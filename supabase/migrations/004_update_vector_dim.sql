-- 1. Drop existing indexes
DROP INDEX IF EXISTS idx_chunks_embedding;
DROP INDEX IF EXISTS idx_knowledge_base_embedding;

-- 2. TRUNCATE tables to start fresh with unified 1536 dimensions
TRUNCATE TABLE chunks CASCADE;
TRUNCATE TABLE knowledge_base CASCADE;

-- 3. Alter columns to 1536 dimensions (The industry-standard limit)
ALTER TABLE chunks ALTER COLUMN embedding TYPE vector(1536);
ALTER TABLE knowledge_base ALTER COLUMN embedding TYPE vector(1536);

-- 4. Re-create the optimized indexes for 1536-dim vectors
CREATE INDEX idx_chunks_embedding ON chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_knowledge_base_embedding ON knowledge_base USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
