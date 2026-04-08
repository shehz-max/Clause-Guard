import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://panlqhzvzuwmyqptxgpw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhbmxxaHp2enV3bXlxcHR4Z3B3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA0NTQxNSwiZXhwIjoyMDkwNjIxNDE1fQ.gMaBBeXEQwdDk1VSxuRVEyox9Eqe2jjIikawBVON88Y'
);

async function check() {
  const { data, error } = await supabase
    .from('documents')
    .select('id, filename, status, error_message, created_at')
    .order('created_at', { ascending: false })
    .limit(3);

  console.log(JSON.stringify(data, null, 2));
}

check();
