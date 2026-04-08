-- Week 1: Add key_dates column to analyses table (non-breaking)
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS key_dates JSONB DEFAULT '[]';

-- Week 2 (pre-create for obligations tracker):
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS obligations JSONB DEFAULT '{}';

-- Add error_message to documents if not exists (improves error reporting)
ALTER TABLE documents ADD COLUMN IF NOT EXISTS error_message TEXT;
