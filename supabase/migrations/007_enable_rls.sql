-- Phase 7: Database RLS (Row Level Security) Setup
-- This migration adds user authentication support and enables row-level security

-- ============================================
-- STEP 1: Create profiles table for user data
-- ============================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 2: Add user_id to existing tables
-- ============================================

-- Add user_id column to documents table (for ownership)
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- ============================================
-- STEP 3: Create updated_at trigger for profiles
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 4: Disable RLS initially for setup
-- ============================================

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chunks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 5: Create RLS Policies for profiles
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Users can insert their own profile (auto-created on signup)
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================
-- STEP 6: Create RLS Policies for documents
-- ============================================

-- Users can view contracts they own
CREATE POLICY "Users can view own documents"
ON public.documents FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can insert contracts they own
CREATE POLICY "Users can insert own documents"
ON public.documents FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update contracts they own
CREATE POLICY "Users can update own documents"
ON public.documents FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete contracts they own
CREATE POLICY "Users can delete own documents"
ON public.documents FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- STEP 7: Create RLS Policies for chunks
-- ============================================

-- Users can view chunks of contracts they own
CREATE POLICY "Users can view own document chunks"
ON public.chunks FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.documents 
        WHERE documents.id = chunks.document_id 
        AND (documents.user_id = auth.uid() OR documents.user_id IS NULL)
    )
);

-- Users can insert chunks for contracts they own
CREATE POLICY "Users can insert own document chunks"
ON public.chunks FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.documents 
        WHERE documents.id = chunks.document_id 
        AND documents.user_id = auth.uid()
    )
);

-- Users can delete chunks of contracts they own
CREATE POLICY "Users can delete own document chunks"
ON public.chunks FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.documents 
        WHERE documents.id = chunks.document_id 
        AND documents.user_id = auth.uid()
    )
);

-- ============================================
-- STEP 8: Create RLS Policies for analyses
-- ============================================

-- Users can view analyses of contracts they own
CREATE POLICY "Users can view own document analyses"
ON public.analyses FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.documents 
        WHERE documents.id = analyses.document_id 
        AND (documents.user_id = auth.uid() OR documents.user_id IS NULL)
    )
);

-- Users can insert analyses for contracts they own
CREATE POLICY "Users can insert own document analyses"
ON public.analyses FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.documents 
        WHERE documents.id = analyses.document_id 
        AND (documents.user_id = auth.uid() OR documents.user_id IS NULL)
    )
);

-- Users can update analyses of contracts they own
CREATE POLICY "Users can update own document analyses"
ON public.analyses FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.documents 
        WHERE documents.id = analyses.document_id 
        AND (documents.user_id = auth.uid() OR documents.user_id IS NULL)
    )
);

-- ============================================
-- STEP 9: Create RLS Policies for chat_messages
-- ============================================

-- Users can view chat messages of contracts they own
CREATE POLICY "Users can view own document chat messages"
ON public.chat_messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.documents 
        WHERE documents.id = chat_messages.document_id 
        AND (documents.user_id = auth.uid() OR documents.user_id IS NULL)
    )
);

-- Users can insert chat messages for contracts they own
CREATE POLICY "Users can insert own document chat messages"
ON public.chat_messages FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.documents 
        WHERE documents.id = chat_messages.document_id 
        AND (documents.user_id = auth.uid() OR documents.user_id IS NULL)
    )
);

-- ============================================
-- STEP 10: Create RLS Policies for knowledge_base
-- ============================================

-- All authenticated users can view knowledge base (read-only)
CREATE POLICY "Authenticated users can view knowledge base"
ON public.knowledge_base FOR SELECT
TO authenticated
USING (true);

-- Only service role can modify knowledge base
-- (handled by service role key in API routes)

-- ============================================
-- STEP 11: Enable RLS on all tables
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 12: Create helper function for anonymous access
-- ============================================

-- Function to check if user is authenticated (for service role bypass)
CREATE OR REPLACE FUNCTION is_authenticated()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.role() = 'authenticated' OR auth.role() = 'service_role';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 13: Create indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ============================================
-- NOTES FOR DEPLOYMENT:
-- ============================================
-- 
-- 1. Run this migration in Supabase SQL Editor
-- 
-- 2. After running, existing documents without user_id 
--    will be viewable by all users (public access)
-- 
-- 3. New documents will be assigned to the uploader
-- 
-- 4. To update existing documents with user_id, you'll need to:
--    - Add authentication first
--    - Then run a migration to assign user_id
-- 
-- 5. For the knowledge_base table:
--    - RLS is enabled but allows all authenticated users read access
--    - Service role key bypasses RLS for admin operations
-- 
-- ============================================