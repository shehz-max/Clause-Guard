import { createClient } from '../supabase/server';
import { createEmbedding } from './embeddings';

export interface ChunkMatch {
  id: string;
  content: string;
  chunk_index: number;
  clause_title: string | null;
  page_number: number;
  char_start: number;
  char_end: number;
  semantic_rank: number;
  keyword_rank: number;
  rrf_score: number;
}

export interface KBMatch {
  id: string;
  category: string;
  title: string;
  content: string;
  metadata: any;
  semantic_rank: number;
  keyword_rank: number;
  rrf_score: number;
}

/**
 * Perform a hybrid search (Vector + BM25) on document chunks using RRF.
 */
export async function hybridSearchChunks(
  query: string,
  documentId: string,
  matchCount: number = 8,
  keywordWeight: number = 0.3,
  semanticWeight: number = 0.7
): Promise<ChunkMatch[]> {
  const supabase = await createClient();
  const queryEmbedding = await createEmbedding(query);

  const { data, error } = await (supabase as any).rpc('hybrid_search_chunks', {
    query_text: query,
    query_embedding: queryEmbedding,
    document_id: documentId,
    match_count: matchCount,
    keyword_weight: keywordWeight,
    semantic_weight: semanticWeight
  });

  if (error) {
    console.error('Error during hybridSearchChunks:', error);
    throw new Error('Failed to perform hybrid search on chunks');
  }

  return data as ChunkMatch[];
}

/**
 * Perform a hybrid search on the Knowledge Base.
 */
export async function hybridSearchKnowledgeBase(
  query: string,
  categoryFilter?: string,
  matchCount: number = 5,
  keywordWeight: number = 0.3,
  semanticWeight: number = 0.7
): Promise<KBMatch[]> {
  const supabase = await createClient();
  const queryEmbedding = await createEmbedding(query);

  const { data, error } = await (supabase as any).rpc('hybrid_search_knowledge_base', {
    query_text: query,
    query_embedding: queryEmbedding,
    category_filter: categoryFilter || null,
    match_count: matchCount,
    keyword_weight: keywordWeight,
    semantic_weight: semanticWeight
  });

  if (error) {
    console.error('Error during hybridSearchKnowledgeBase:', error);
    throw new Error('Failed to perform hybrid search on knowledge base');
  }

  return data as KBMatch[];
}
