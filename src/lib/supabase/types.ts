export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string
          filename: string
          file_type: 'pdf' | 'docx'
          file_size_bytes: number
          raw_text: string
          page_count: number | null
          status: 'processing' | 'analyzed' | 'error'
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          filename: string
          file_type: 'pdf' | 'docx'
          file_size_bytes: number
          raw_text: string
          page_count?: number | null
          status?: 'processing' | 'analyzed' | 'error'
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          filename?: string
          file_type?: 'pdf' | 'docx'
          file_size_bytes?: number
          raw_text?: string
          page_count?: number | null
          status?: 'processing' | 'analyzed' | 'error'
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chunks: {
        Row: {
          id: string
          document_id: string
          content: string
          chunk_index: number
          clause_title: string | null
          page_number: number | null
          char_start: number
          char_end: number
          token_count: number | null
          embedding: number[] | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          content: string
          chunk_index: number
          clause_title?: string | null
          page_number?: number | null
          char_start: number
          char_end: number
          token_count?: number | null
          embedding?: number[] | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          content?: string
          chunk_index?: number
          clause_title?: string | null
          page_number?: number | null
          char_start?: number
          char_end?: number
          token_count?: number | null
          embedding?: number[] | null
          metadata?: Json
          created_at?: string
        }
      }
      analyses: {
        Row: {
          id: string
          document_id: string
          summary: string | null
          overall_risk_score: number | null
          risk_level: 'low' | 'medium' | 'high' | null
          clause_analyses: Json
          risks: Json
          best_practice_comparisons: Json
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          document_id: string
          summary?: string | null
          overall_risk_score?: number | null
          risk_level?: 'low' | 'medium' | 'high' | null
          clause_analyses?: Json
          risks?: Json
          best_practice_comparisons?: Json
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          summary?: string | null
          overall_risk_score?: number | null
          risk_level?: 'low' | 'medium' | 'high' | null
          clause_analyses?: Json
          risks?: Json
          best_practice_comparisons?: Json
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          document_id: string
          role: 'user' | 'assistant'
          content: string
          citations: Json
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          role: 'user' | 'assistant'
          content: string
          citations?: Json
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          role?: 'user' | 'assistant'
          content?: string
          citations?: Json
          created_at?: string
        }
      }
      knowledge_base: {
        Row: {
          id: string
          category: 'risky_clause' | 'best_practice' | 'glossary' | 'template'
          title: string
          content: string
          metadata: Json
          embedding: number[] | null
          created_at: string
        }
        Insert: {
          id?: string
          category: 'risky_clause' | 'best_practice' | 'glossary' | 'template'
          title: string
          content: string
          metadata?: Json
          embedding?: number[] | null
          created_at?: string
        }
        Update: {
          id?: string
          category?: 'risky_clause' | 'best_practice' | 'glossary' | 'template'
          title?: string
          content?: string
          metadata?: Json
          embedding?: number[] | null
          created_at?: string
        }
      }
    }
    Functions: {
      match_chunks: {
        Args: {
          query_embedding: number[]
          match_count: number
          document_id: string
        }
        Returns: {
          id: string
          content: string
          chunk_index: number
          clause_title: string | null
          page_number: number | null
          char_start: number
          char_end: number
          similarity: number
        }[]
      }
      match_knowledge_base: {
        Args: {
          query_embedding: number[]
          match_count: number
          category_filter?: string
        }
        Returns: {
          id: string
          category: string
          title: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      hybrid_search_chunks: {
        Args: {
          query_text: string
          query_embedding: number[]
          document_id: string
          match_count?: number
          keyword_weight?: number
          semantic_weight?: number
        }
        Returns: {
          id: string
          content: string
          chunk_index: number
          clause_title: string | null
          page_number: number | null
          char_start: number
          char_end: number
          semantic_rank: number
          keyword_rank: number
          rrf_score: number
        }[]
      }
      hybrid_search_knowledge_base: {
        Args: {
          query_text: string
          query_embedding: number[]
          category_filter?: string
          match_count?: number
          keyword_weight?: number
          semantic_weight?: number
        }
        Returns: {
          id: string
          category: string
          title: string
          content: string
          metadata: Json
          semantic_rank: number
          keyword_rank: number
          rrf_score: number
        }[]
      }
    }
  }
}
