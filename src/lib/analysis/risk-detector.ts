import { generateText } from 'ai';
import { models } from '../groq';

export interface IdentifiedRisk {
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  recommendation: string;
}

export async function detectRisks(chunks: any[]): Promise<IdentifiedRisk[]> {
   // Reduce text size to strictly avoid exceeding prompt lengths
   const chunksContext = chunks.slice(0, 15).map((c, i) => `[Chunk ${i}]:\n${c.content}\n`).join('---\n');
   
   const prompt = `You are a strict risk management AI.
Review the following contract chunks. Identify any clauses that pose a significant legal or financial risk.
Provide your answer strictly as a JSON array of objects with the following exactly lowercase keys: "severity" (must be "low", "medium", or "high"), "title", "description", "recommendation".
If no risks exist, output []. Do not output markdown code blocks.

CONTRACT CHUNKS:
${chunksContext}
`;

  try {
    const { text } = await generateText({
      model: models.fast,
      prompt: prompt,
    });
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const risks = JSON.parse(cleanText) as IdentifiedRisk[];
    return Array.isArray(risks) ? risks : [];
  } catch (err) {
    console.error('Error detecting risks:', err);
    return [];
  }
}
