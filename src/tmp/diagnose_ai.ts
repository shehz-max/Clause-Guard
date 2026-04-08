import { createAdminClient } from '../lib/supabase/server';
import { createEmbedding } from '../lib/rag/embeddings';
import { hybridSearchChunks } from '../lib/rag/hybrid-search';
import { generateText } from 'ai';
import { groq } from '../lib/groq';

async function diagnoseAI() {
  console.log('--- STARTING AI DIAGNOSIS ---');

  // 1. Test Embedding
  try {
    console.log('Testing Embedding (Gemini)...');
    const embedding = await createEmbedding('Test query');
    console.log('✅ Embedding successful. Dimensions:', embedding.length);
  } catch (e: any) {
    console.error('❌ Embedding FAILED:', e.message);
  }

  // 2. Test Supabase
  try {
    console.log('Testing Supabase Connection...');
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('documents').select('id').limit(1);
    if (error) throw error;
    console.log('✅ Supabase Connection successful.');
  } catch (e: any) {
    console.error('❌ Supabase FAILED:', e.message);
  }

  // 3. Test Groq (Fast Model)
  try {
    console.log('Testing Groq Model (8B)...');
    const { text } = await generateText({
      model: groq('llama-3.1-8b-instant'),
      prompt: 'Say hello',
    });
    console.log('✅ Groq 8B successful:', text);
  } catch (e: any) {
    console.error('❌ Groq 8B FAILED:', e.message);
  }

  // 4. Test Groq (Quality Model)
  try {
    console.log('Testing Groq Model (70B)...');
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt: 'Say hello',
    });
    console.log('✅ Groq 70B successful:', text);
  } catch (e: any) {
    console.error('❌ Groq 70B FAILED:', e.message);
  }

  console.log('--- DIAGNOSIS COMPLETE ---');
}

diagnoseAI();
