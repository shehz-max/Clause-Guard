-- 006: Update RPC functions to 1536 dimensions
-- This ensures the vector search works with the new Gemini embedding standard.

-- Match Chunks
CREATE OR REPLACE FUNCTION match_chunks(
    query_embedding VECTOR(1536),
    match_count INT,
    document_id UUID
)
RETURNS TABLE (
    id UUID,
    content TEXT,
    chunk_index INTEGER,
    clause_title TEXT,
    page_number INTEGER,
    char_start INTEGER,
    char_end INTEGER,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.content,
        c.chunk_index,
        c.clause_title,
        c.page_number,
        c.char_start,
        c.char_end,
        1 - (c.embedding <=> query_embedding) AS similarity
    FROM chunks c
    WHERE c.document_id = match_chunks.document_id
    ORDER BY c.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Match Knowledge Base
CREATE OR REPLACE FUNCTION match_knowledge_base(
    query_embedding VECTOR(1536),
    match_count INT,
    category_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    category TEXT,
    title TEXT,
    content TEXT,
    metadata JSONB,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        kb.id,
        kb.category,
        kb.title,
        kb.content,
        kb.metadata,
        1 - (kb.embedding <=> query_embedding) AS similarity
    FROM knowledge_base kb
    WHERE (category_filter IS NULL OR kb.category = category_filter)
    ORDER BY kb.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Hybrid Search Chunks
CREATE OR REPLACE FUNCTION hybrid_search_chunks(
    query_text TEXT,
    query_embedding VECTOR(1536),
    document_id UUID,
    match_count INT DEFAULT 8,
    keyword_weight FLOAT DEFAULT 0.3,
    semantic_weight FLOAT DEFAULT 0.7
)
RETURNS TABLE (
    id UUID,
    content TEXT,
    chunk_index INTEGER,
    clause_title TEXT,
    page_number INTEGER,
    char_start INTEGER,
    char_end INTEGER,
    semantic_rank INTEGER,
    keyword_rank INTEGER,
    rrf_score FLOAT
)
LANGUAGE plpgsql
AS $$
DECLARE
    k CONSTANT FLOAT := 60.0;
BEGIN
    RETURN QUERY
    WITH semantic_results AS (
        SELECT
            c.id,
            c.content,
            c.chunk_index,
            c.clause_title,
            c.page_number,
            c.char_start,
            c.char_end,
            ROW_NUMBER() OVER (ORDER BY c.embedding <=> query_embedding) AS rank
        FROM chunks c
        WHERE c.document_id = hybrid_search_chunks.document_id
        ORDER BY c.embedding <=> query_embedding
        LIMIT match_count * 2
    ),
    keyword_results AS (
        SELECT
            c.id,
            c.content,
            c.chunk_index,
            c.clause_title,
            c.page_number,
            c.char_start,
            c.char_end,
            ROW_NUMBER() OVER (ORDER BY ts_rank(to_tsvector('english', c.content), plainto_tsquery('english', query_text)) DESC) AS rank
        FROM chunks c
        WHERE c.document_id = hybrid_search_chunks.document_id
            AND to_tsvector('english', c.content) @@ plainto_tsquery('english', query_text)
        ORDER BY ts_rank(to_tsvector('english', c.content), plainto_tsquery('english', query_text)) DESC
        LIMIT match_count * 2
    ),
    combined AS (
        SELECT
            COALESCE(s.id, k.id) AS chunk_id,
            COALESCE(s.content, k.content) AS chunk_content,
            COALESCE(s.chunk_index, k.chunk_index) AS chunk_chunk_index,
            COALESCE(s.clause_title, k.clause_title) AS chunk_clause_title,
            COALESCE(s.page_number, k.page_number) AS chunk_page_number,
            COALESCE(s.char_start, k.char_start) AS chunk_char_start,
            COALESCE(s.char_end, k.char_end) AS chunk_char_end,
            s.rank AS semantic_rank_val,
            k.rank AS keyword_rank_val,
            COALESCE(semantic_weight / (k + s.rank), 0.0) + 
            COALESCE(keyword_weight / (k + k.rank), 0.0) AS rrf_score_val
        FROM semantic_results s
        FULL OUTER JOIN keyword_results k ON s.id = k.id
    )
    SELECT
        combined.chunk_id AS id,
        combined.chunk_content AS content,
        combined.chunk_chunk_index AS chunk_index,
        combined.chunk_clause_title AS clause_title,
        combined.chunk_page_number AS page_number,
        combined.chunk_char_start AS char_start,
        combined.chunk_char_end AS char_end,
        combined.semantic_rank_val::INTEGER AS semantic_rank,
        combined.keyword_rank_val::INTEGER AS keyword_rank,
        combined.rrf_score_val AS rrf_score
    FROM combined
    ORDER BY combined.rrf_score_val DESC
    LIMIT match_count;
END;
$$;

-- Hybrid Search Knowledge Base
CREATE OR REPLACE FUNCTION hybrid_search_knowledge_base(
    query_text TEXT,
    query_embedding VECTOR(1536),
    category_filter TEXT DEFAULT NULL,
    match_count INT DEFAULT 5,
    keyword_weight FLOAT DEFAULT 0.3,
    semantic_weight FLOAT DEFAULT 0.7
)
RETURNS TABLE (
    id UUID,
    category TEXT,
    title TEXT,
    content TEXT,
    metadata JSONB,
    semantic_rank INTEGER,
    keyword_rank INTEGER,
    rrf_score FLOAT
)
LANGUAGE plpgsql
AS $$
DECLARE
    k CONSTANT FLOAT := 60.0;
BEGIN
    RETURN QUERY
    WITH semantic_results AS (
        SELECT
            kb.id,
            kb.category,
            kb.title,
            kb.content,
            kb.metadata,
            ROW_NUMBER() OVER (ORDER BY kb.embedding <=> query_embedding) AS rank
        FROM knowledge_base kb
        WHERE (category_filter IS NULL OR kb.category = category_filter)
        ORDER BY kb.embedding <=> query_embedding
        LIMIT match_count * 2
    ),
    keyword_results AS (
        SELECT
            kb.id,
            kb.category,
            kb.title,
            kb.content,
            kb.metadata,
            ROW_NUMBER() OVER (ORDER BY ts_rank(to_tsvector('english', kb.content), plainto_tsquery('english', query_text)) DESC) AS rank
        FROM knowledge_base kb
        WHERE (category_filter IS NULL OR kb.category = category_filter)
            AND to_tsvector('english', kb.content) @@ plainto_tsquery('english', query_text)
        ORDER BY ts_rank(to_tsvector('english', kb.content), plainto_tsquery('english', query_text)) DESC
        LIMIT match_count * 2
    ),
    combined AS (
        SELECT
            COALESCE(s.id, k.id) AS kb_id,
            COALESCE(s.category, k.category) AS kb_category,
            COALESCE(s.title, k.title) AS kb_title,
            COALESCE(s.content, k.content) AS kb_content,
            COALESCE(s.metadata, k.metadata) AS kb_metadata,
            s.rank AS semantic_rank_val,
            k.rank AS keyword_rank_val,
            COALESCE(semantic_weight / (k + s.rank), 0.0) + 
            COALESCE(keyword_weight / (k + k.rank), 0.0) AS rrf_score_val
        FROM semantic_results s
        FULL OUTER JOIN keyword_results k ON s.id = k.id
    )
    SELECT
        combined.kb_id AS id,
        combined.kb_category AS category,
        combined.kb_title AS title,
        combined.kb_content AS content,
        combined.kb_metadata AS metadata,
        combined.semantic_rank_val::INTEGER AS semantic_rank,
        combined.keyword_rank_val::INTEGER AS keyword_rank,
        combined.rrf_score_val AS rrf_score
    FROM combined
    ORDER BY combined.rrf_score_val DESC
    LIMIT match_count;
END;
$$;
