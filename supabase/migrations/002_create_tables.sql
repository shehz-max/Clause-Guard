-- Documents table: Stores contract metadata and raw text
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'docx')),
    file_size_bytes INTEGER NOT NULL,
    raw_text TEXT NOT NULL,
    page_count INTEGER,
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'analyzed', 'error')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chunks table: Stores clause-aware chunks with embeddings
CREATE TABLE IF NOT EXISTS chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    clause_title TEXT,
    page_number INTEGER,
    char_start INTEGER NOT NULL,
    char_end INTEGER NOT NULL,
    token_count INTEGER,
    embedding VECTOR(768),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analyses table: Stores analysis results
CREATE TABLE IF NOT EXISTS analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    summary TEXT,
    overall_risk_score REAL,
    risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
    clause_analyses JSONB DEFAULT '[]',
    risks JSONB DEFAULT '[]',
    best_practice_comparisons JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages table: Persisted chat history per contract
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    citations JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge base table: Pre-loaded legal knowledge
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL CHECK (category IN ('risky_clause', 'best_practice', 'glossary', 'template')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    embedding VECTOR(768),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chunks_document_id ON chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_chunks_embedding ON chunks USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_chunks_content ON chunks USING gin (to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_analyses_document_id ON analyses(document_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_document_id ON chat_messages(document_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_embedding ON knowledge_base USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_content ON knowledge_base USING gin (to_tsvector('english', content));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_analyses_updated_at ON analyses;
CREATE TRIGGER update_analyses_updated_at
    BEFORE UPDATE ON analyses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
