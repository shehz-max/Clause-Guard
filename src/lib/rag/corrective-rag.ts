import { generateText } from 'ai';
import { models } from '../groq';
import { ChunkMatch } from './hybrid-search';

export async function evaluateRetrievalRelevance(query: string, chunks: ChunkMatch[]): Promise<ChunkMatch[]> {
  if (!chunks || chunks.length === 0) return [];

  const chunksText = chunks.map((c, i) => `[Chunk ${i}]:\n${c.content}\n`).join('---\n');
  
  const prompt = `
You are a legal document relevance evaluator. 
Given the user query: "${query}"

Evaluate if each of the following retrieved contract chunks contains information that is explicitly or implicitly relevant to answering the query.
Be generous; if the chunk provides ANY useful context for the query, mark it true. 
If it is completely unrelated, mark it false.

${chunksText}

Return exactly a JSON array of booleans indicating relevance, in the same order as the chunks provided. No markdown, no explanation, only the JSON array like: [true, false, true, ...]
`;

  try {
    const { text } = await generateText({
      model: models.fast,
      prompt: prompt,
    });
    
    // Clean up potential markdown formatting from LLM response
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const evaluation: boolean[] = JSON.parse(cleanText);
    
    if (!Array.isArray(evaluation) || evaluation.length !== chunks.length) {
       console.warn('CRAG evaluation length mismatch, falling back to all chunks.');
       return chunks;
    }

    return chunks.filter((_, i) => evaluation[i] === true);
  } catch (err) {
    console.error('Error in Corrective RAG evaluation:', err);
    // If LLM fails or parses wrong, fallback to base chunks
    return chunks;
  }
}
