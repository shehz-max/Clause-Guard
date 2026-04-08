import { generateText } from 'ai';
import { models } from '../groq';
import { ChunkMatch } from './hybrid-search';

/**
 * Stage 2 RAG: Reranker
 * Uses a fast LLM to judge the relevance of initially retrieved chunks.
 * This ensures the final "Smart" model receives ONLY high-density, 
 * relevant legal information, staying within token limits.
 */
export async function rerankLegalChunks(
  query: string, 
  chunks: ChunkMatch[], 
  limit: number = 4
): Promise<ChunkMatch[]> {
  if (chunks.length <= limit) return chunks;

  // Prepare chunks for evaluation with clear IDs
  const chunksToEvaluate = chunks.map((c, i) => `[ID: ${i}]\n${c.content}\n`).join('---\n');

  const prompt = `You are an elite Legal Context Filter. 
User Query: "${query}"

Below are ${chunks.length} excerpts from a legal contract. 
Rank them by how directly they answer the user's query.

CRITERIA:
- High priority to specific clauses mentioning the keywords in the query.
- High priority to clauses containing numerical limits, dates, or party obligations related to the query.
- Ignore boilerplate text that doesn't provide specific answers.

EXCERPTS:
${chunksToEvaluate}

Output ONLY the IDs of the TOP ${limit} most relevant excerpts in order of priority, as a JSON array of numbers.
Example: [2, 0, 5, 1]
Do not explain. No markdown. Just the array.`;

  try {
    const { text } = await generateText({
      model: models.fast, // llama-3.1-8b-instant
      prompt,
    });

    // Parse IDs - be resilient to markdown wrapping
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const topIndices: number[] = JSON.parse(cleanJson);

    if (!Array.isArray(topIndices)) return chunks.slice(0, limit);

    // Map back to original chunk objects
    const reranked = topIndices
      .map(index => chunks[index])
      .filter(chunk => !!chunk); // Handle potential Hallucinations of IDs

    return reranked.length > 0 ? reranked.slice(0, limit) : chunks.slice(0, limit);
  } catch (error) {
    console.error('Legal Reranker Error:', error);
    // Fallback: return original top results
    return chunks.slice(0, limit);
  }
}
