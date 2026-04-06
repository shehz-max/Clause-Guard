import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const dummyEmbedding = Array(768).fill(0.1);
  
  const { data, error } = await supabase.from('chunks').insert([{
    document_id: '00000000-0000-0000-0000-000000000000', // Might violate FK if documents table enforces it
    content: 'test content',
    chunk_index: 0,
    clause_title: 'test title',
    page_number: 1,
    char_start: 0,
    char_end: 10,
    token_count: 5,
    embedding: dummyEmbedding,
  }]);

  if (error) {
    console.error("Insert Error Details:", JSON.stringify(error, null, 2));
  } else {
    console.log("Insert Success!");
  }
}

testInsert();
