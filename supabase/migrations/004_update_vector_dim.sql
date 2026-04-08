-- 1. Drop existing indexes that depend on the 768 dimension
DROP INDEX IF EXISTS idx_chunks_embedding;
DROP INDEX IF EXISTS idx_knowledge_base_embedding;

-- 2. TRUNCATE tables to avoid dimension mismatch errors during conversion
-- (Since the data is currently invalid/3072, we start fresh)
TRUNCATE TABLE chunks CASCADE;
TRUNCATE TABLE knowledge_base CASCADE;

-- 3. Alter columns to the new 3072 dimension
ALTER TABLE chunks ALTER COLUMN embedding TYPE vector(3072);
ALTER TABLE knowledge_base ALTER COLUMN embedding TYPE vector(3072);

-- 4. Re-create the optimized vector indexes
-- We use ivfflat for performance on larger dimensions
CREATE INDEX idx_chunks_embedding ON chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_knowledge_base_embedding ON knowledge_base USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
