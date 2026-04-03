import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are in .env.local');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
    console.error('Missing GOOGLE_API_KEY in .env.local');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function embedText(text: string): Promise<number[]> {
  const result = await model.embedContent(text);
  return result.embedding.values;
}

async function processFile(filename: string) {
  console.log(`\nProcessing ${filename}...`);
  const filePath = path.resolve(__dirname, `../knowledge-base/${filename}`);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  const rawData = fs.readFileSync(filePath, 'utf-8');
  const items = JSON.parse(rawData);
  console.log(`Found ${items.length} items in ${filename}`);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    console.log(`Embedding [${i + 1}/${items.length}]: ${item.title}`);
    
    try {
        const embedding = await embedText(item.content);
        
        const { error } = await supabase.from('knowledge_base').insert({
        category: item.category,
        title: item.title,
        content: item.content,
        metadata: item.metadata,
        embedding: embedding
        }); 
        
        if (error) {
           console.error(`DB Error for ${item.title}:`, error.message);
        } else {
           console.log(`Successfully saved: ${item.title}`);
        }
    } catch(err: any) {
        console.error(`Failed to process ${item.title}: ${err.message}`);
    }
    
    // Safety delay to avoid hitting Gemini free tier limits
    await sleep(750);
  }
}

async function main() {
  console.log('Clearing existing knowledge base...');
  const { error: deleteError } = await supabase.from('knowledge_base').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (deleteError) {
      console.error('Failed to clear existing knowledge base:', deleteError);
      process.exit(1);
  }
  
  await processFile('risky-clauses.json');
  await processFile('best-practices.json');
  await processFile('legal-glossary.json');
  await processFile('clause-templates.json');
  
  console.log('\nSeeding completed successfully!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
