import { generateText } from 'ai';
import { models } from '../groq';

export interface ClauseAnalysis {
  clause_title: string;
  plain_english: string;
  is_standard: boolean;
}

export async function analyzeClauses(chunks: any[]): Promise<ClauseAnalysis[]> {
  // We only analyze chunks that clearly have a clause_title
  const titledChunks = chunks.filter((c: any) => c.clause_title).slice(0, 10); // Analyze top 10

  if (titledChunks.length === 0) return [];

  const prompt = `Translate these legal clauses into 1-2 sentences of plain English, and determine if they are standard/boilerplate (true) or unusual (false).
Respond purely with a JSON array formatting using the exact keys: "clause_title", "plain_english", and "is_standard" (boolean).
Do not output markdown code blocks.

CLAUSES:
${titledChunks.map((c: any) => `TITLE: ${c.clause_title}\nTEXT: ${c.content}\n`).join('---\n')}
`;

  try {
    const { text } = await generateText({
      model: models.fast,
      prompt: prompt,
    });
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText) as ClauseAnalysis[];
  } catch (err) {
    console.error('Error in clause analyzer:', err);
    return [];
  }
}
