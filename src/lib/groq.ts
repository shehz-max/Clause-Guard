import { createGroq } from '@ai-sdk/groq'

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

// Default model for generation
export const DEFAULT_MODEL = 'llama-3.1-8b-instant'

// Groq client for AI SDK
export const groqClient = groq(DEFAULT_MODEL)

// Model configurations for different tasks
export const models = {
  // Fast model for simple tasks
  fast: groq('llama-3.1-8b-instant'),
  // Better quality for analysis
  quality: groq('llama-3.3-70b-versatile'),
  // Default balanced option
  default: groq(DEFAULT_MODEL),
}

// Rate limits for Groq free tier:
// - 30 RPM (requests per minute)
// - 14,400 RPD (requests per day)
// - 6,000 tokens per minute
export const GROQ_RATE_LIMITS = {
  requestsPerMinute: 30,
  requestsPerDay: 14400,
  tokensPerMinute: 6000,
}

// Gemini Free Tier Rate Limits (approximate for RAG safety)
export const GEMINI_RATE_LIMITS = {
  requestsPerMinute: 15,
  requestsPerDay: 1500,
}
