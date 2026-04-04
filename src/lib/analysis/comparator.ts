import { generateText } from 'ai';
import { models } from '../groq';
import { createClient } from '../supabase/server';

export interface BestPracticeComparison {
  topic: string;
  contract_stance: string;
  best_practice: string;
  alignment: 'aligned' | 'deviant' | 'missing';
}

export async function compareWithBestPractices(chunks: any[]): Promise<BestPracticeComparison[]> {
  const supabase = await createClient();
  const { data: bpsData } = await (supabase.from('knowledge_base') as any).select('title, content').eq('category', 'best_practice').limit(5);
  const bps = (bpsData as any[]) || [];
  
  if (bps.length === 0) return [];

  const prompt = `Compare the following contract to these 5 best practices. 
Respond purely with a JSON array using exact lowercase keys: "topic", "contract_stance", "best_practice", "alignment" ("aligned", "deviant", "missing").
Do not output markdown code blocks.

BEST PRACTICES:
${bps.map(bp => `${bp.title}: ${bp.content}`).join('\n')}

CONTRACT EXCERPT:
${chunks.slice(0, 10).map((c: any) => c.content).join('\n')}
`;

  try {
    const { text } = await generateText({
      model: models.fast,
      prompt: prompt,
    });
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText) as BestPracticeComparison[];
  } catch (err) {
    console.error('Error in comparator:', err);
    return [];
  }
}
