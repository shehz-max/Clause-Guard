import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/types';
import * as fs from 'fs';
import * as path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET() {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ success: false, error: 'Missing Supabase credentials in environment' }, { status: 500 });
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey);

  try {
    const { count: risky_clause_count, error: error1 } = await (supabase
      .from('knowledge_base') as any)
      .select('*', { count: 'exact', head: true })
      .eq('category', 'risky_clause');
      
    const { count: best_practice_count, error: error2 } = await (supabase
      .from('knowledge_base') as any)
      .select('*', { count: 'exact', head: true })
      .eq('category', 'best_practice');

    const { count: glossary_count, error: error3 } = await (supabase
      .from('knowledge_base') as any)
      .select('*', { count: 'exact', head: true })
      .eq('category', 'glossary');

    const { count: template_count, error: error4 } = await (supabase
      .from('knowledge_base') as any)
      .select('*', { count: 'exact', head: true })
      .eq('category', 'template');
      
    if (error1 || error2 || error3 || error4) {
      throw error1 || error2 || error3 || error4;
    }

    return NextResponse.json({
      success: true,
      counts: {
        risky_clauses: risky_clause_count,
        best_practices: best_practice_count,
        glossary: glossary_count,
        templates: template_count,
        total: (risky_clause_count || 0) + (best_practice_count || 0) + (glossary_count || 0) + (template_count || 0)
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Replaces the CLI script, allowing us to seed via HTTP and avoid NPM/TSX issues
export async function POST(req: Request) {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ success: false, error: 'Missing Supabase credentials in environment' }, { status: 500 });
  }

  if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ success: false, error: 'Missing GOOGLE_API_KEY credentials in environment' }, { status: 500 });
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey);
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async function embedText(text: string): Promise<number[]> {
    const result = await model.embedContent(text);
    return result.embedding.values;
  }

  try {
    const messages: string[] = [];

    async function processFile(filename: string) {
      messages.push(`Processing ${filename}...`);
      const filePath = path.join(process.cwd(), 'knowledge-base', filename);
      
      if (!fs.existsSync(filePath)) {
        messages.push(`File not found: ${filePath}`);
        return;
      }

      const rawData = fs.readFileSync(filePath, 'utf-8');
      const items = JSON.parse(rawData);
      messages.push(`Found ${items.length} items in ${filename}`);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        try {
            const embedding = await embedText(item.content);
            
            const { error } = await (supabase.from('knowledge_base') as any).insert({
              category: item.category as 'risky_clause' | 'best_practice' | 'glossary' | 'template',
              title: item.title,
              content: item.content,
              metadata: item.metadata,
              embedding: embedding
            }); 
            
            if (error) {
               messages.push(`DB Error for ${item.title}: ${error.message}`);
            } else {
               messages.push(`Successfully saved: ${item.title}`);
            }
        } catch(err: any) {
            messages.push(`Failed to generate embedding for ${item.title}: ${err.message}`);
        }
        
        // Safety delay to avoid hitting Gemini free tier limits
        await sleep(500);
      }
    }

    messages.push('Clearing existing knowledge base...');
    const { error: deleteError } = await (supabase.from('knowledge_base') as any).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) {
        throw new Error(`Failed to clear existing knowledge base: ${deleteError.message}`);
    }
    
    await processFile('risky-clauses.json');
    await processFile('best-practices.json');
    await processFile('legal-glossary.json');
    await processFile('clause-templates.json');

    return NextResponse.json({ success: true, messages });

  } catch (error: any) {
    console.error('API KB Seed Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
