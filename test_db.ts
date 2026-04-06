import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  console.log('Testing Supabase Connection...');
  
  const { data, error } = await supabase.from('documents').select('id').limit(1);
  
  if (error) {
    if (error.code === '42P01') {
      console.log('FAIL: The "documents" table does not exist. You need to run the migrations!');
    } else {
      console.log('FAIL: Error interacting with Supabase:', error);
    }
  } else {
    console.log('SUCCESS: The "documents" table exists and the database is configured!');
  }
  
  const { data: chunksData, error: chunksError } = await supabase.from('chunks').select('id').limit(1);
  if (chunksError) {
    if (chunksError.code === '42P01') {
      console.log('FAIL: The "chunks" table does not exist.');
    }
  } else {
    console.log('SUCCESS: The "chunks" table exists.');
  }
}

testSupabase();
