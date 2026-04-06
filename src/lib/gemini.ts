import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

// Gemini model for embeddings
export const embeddingModel = genAI.getGenerativeModel({
  model: 'gemini-embedding-001',
})

// Gemini model for text generation (backup option)
export const generativeModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
})

// Embedding dimension
export const EMBEDDING_DIMENSION = 768

// Rate limits for Gemini free tier:
// - 15 RPM (requests per minute)
// - 1,500 RPD (requests per day)
export const GEMINI_RATE_LIMITS = {
  requestsPerMinute: 15,
  requestsPerDay: 1500,
}

// Generate embeddings for text
export async function generateEmbedding(text: string): Promise<number[]> {
  const result = await embeddingModel.embedContent(text)
  return result.embedding.values
}

// Generate embeddings for multiple texts (batch)
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = []
  
  for (const text of texts) {
    const embedding = await generateEmbedding(text)
    embeddings.push(embedding)
  }
  
  return embeddings
}
