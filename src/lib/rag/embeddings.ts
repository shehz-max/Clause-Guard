import { generateEmbedding, generateEmbeddings as generateGeminiEmbeddings } from '../gemini'
import { geminiRateLimiter, withRateLimit } from '../rate-limiter'

// Generate single embedding with rate limiting
export async function createEmbedding(text: string): Promise<number[]> {
  return withRateLimit(
    geminiRateLimiter,
    () => generateEmbedding(text),
    undefined,
    3
  )
}

// Generate embeddings for multiple texts with batching and rate limiting
export async function createEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = []
  
  for (const text of texts) {
    const embedding = await createEmbedding(text)
    embeddings.push(embedding)
  }
  
  return embeddings
}

// Calculate cosine similarity between two embeddings
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Embeddings must have the same dimension')
  }
  
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}
