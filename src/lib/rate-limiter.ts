import { GROQ_RATE_LIMITS, GEMINI_RATE_LIMITS } from './groq'

interface RateLimiterConfig {
  requestsPerMinute: number
  requestsPerDay: number
  tokensPerMinute?: number
}

interface RateLimiterState {
  minuteRequests: number
  dayRequests: number
  tokensThisMinute: number
  lastMinuteReset: number
  lastDayReset: number
  queue: Array<() => void>
}

class TokenBucketRateLimiter {
  private config: RateLimiterConfig
  private state: RateLimiterState
  private name: string

  constructor(name: string, config: RateLimiterConfig) {
    this.name = name
    this.config = config
    this.state = {
      minuteRequests: 0,
      dayRequests: 0,
      tokensThisMinute: 0,
      lastMinuteReset: Date.now(),
      lastDayReset: Date.now(),
      queue: [],
    }
  }

  private resetIfNeeded() {
    const now = Date.now()
    const minuteAgo = now - 60000
    const dayAgo = now - 86400000

    if (this.state.lastMinuteReset < minuteAgo) {
      this.state.minuteRequests = 0
      this.state.tokensThisMinute = 0
      this.state.lastMinuteReset = now
    }

    if (this.state.lastDayReset < dayAgo) {
      this.state.dayRequests = 0
      this.state.lastDayReset = now
    }
  }

  private calculateDelay(tokens?: number): number {
    this.resetIfNeeded()

    // Check daily limit
    if (this.state.dayRequests >= this.config.requestsPerDay) {
      return -1 // Daily limit exceeded
    }

    // Check per-minute request limit
    if (this.state.minuteRequests >= this.config.requestsPerMinute) {
      const waitTime = 60000 - (Date.now() - this.state.lastMinuteReset) + 1000
      return waitTime
    }

    // Check token limit if applicable
    if (tokens && this.config.tokensPerMinute) {
      if (this.state.tokensThisMinute + tokens > this.config.tokensPerMinute) {
        const waitTime = 60000 - (Date.now() - this.state.lastMinuteReset) + 1000
        return waitTime
      }
    }

    return 0 // No delay needed
  }

  async acquire(tokens?: number): Promise<boolean> {
    const delay = this.calculateDelay(tokens)

    if (delay === -1) {
      throw new Error(`${this.name} daily quota exceeded`)
    }

    if (delay > 0) {
      console.log(`${this.name} rate limit: waiting ${Math.ceil(delay / 1000)}s`)
      await new Promise(resolve => setTimeout(resolve, delay))
      return this.acquire(tokens) // Retry after wait
    }

    this.state.minuteRequests++
    this.state.dayRequests++
    if (tokens) {
      this.state.tokensThisMinute += tokens
    }

    return true
  }

  getStatus() {
    this.resetIfNeeded()
    return {
      minuteRequests: this.state.minuteRequests,
      dayRequests: this.state.dayRequests,
      minuteLimit: this.config.requestsPerMinute,
      dayLimit: this.config.requestsPerDay,
      minuteRemaining: this.config.requestsPerMinute - this.state.minuteRequests,
      dayRemaining: this.config.requestsPerDay - this.state.dayRequests,
    }
  }
}

// Rate limiters for different APIs
export const groqRateLimiter = new TokenBucketRateLimiter('Groq', GROQ_RATE_LIMITS)
export const geminiRateLimiter = new TokenBucketRateLimiter('Gemini', GEMINI_RATE_LIMITS)

// Wrapper for rate-limited API calls
export async function withRateLimit<T>(
  limiter: TokenBucketRateLimiter,
  fn: () => Promise<T>,
  tokens?: number,
  retries = 3
): Promise<T> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      await limiter.acquire(tokens)
      return await fn()
    } catch (error) {
      if (attempt === retries - 1) throw error
      
      // Check if it's a rate limit error (429)
      if (error instanceof Error && error.message.includes('429')) {
        const backoff = Math.pow(2, attempt) * 1000 + Math.random() * 1000
        console.log(`Rate limited, backing off ${Math.ceil(backoff / 1000)}s...`)
        await new Promise(resolve => setTimeout(resolve, backoff))
      } else {
        throw error
      }
    }
  }
  
  throw new Error('Max retries exceeded')
}
