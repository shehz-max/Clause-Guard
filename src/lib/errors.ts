// Custom error types for ClauseGuard

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// Network Errors
export class NetworkError extends AppError {
  constructor(message = 'Unable to connect to the server') {
    super(message, 'NETWORK_ERROR', 0)
  }
}

export class TimeoutError extends AppError {
  constructor(message = 'Request timed out') {
    super(message, 'TIMEOUT_ERROR', 504)
  }
}

// Validation Errors
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Please sign in to continue') {
    super(message, 'UNAUTHORIZED', 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to access this resource') {
    super(message, 'FORBIDDEN', 403)
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND', 404)
  }
}

// API Errors
export class RateLimitError extends AppError {
  constructor(retryAfter = 60) {
    super(`Too many requests. Please try again in ${retryAfter} seconds.`, 'RATE_LIMIT', 429)
  }
}

export class ServerError extends AppError {
  constructor(message = 'Something went wrong on our end') {
    super(message, 'SERVER_ERROR', 500, false)
  }
}

// Supabase specific errors
export class SupabaseError extends AppError {
  constructor(message: string, code?: string) {
    super(message, code || 'SUPABASE_ERROR', 500)
  }
}

// Error response helper
export function getErrorResponse(error: unknown): { message: string; code: string; status: number } {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      status: error.statusCode
    }
  }
  
  if (error instanceof Error) {
    // Check for network errors
    if (error.message.includes('fetch failed') || error.message.includes('NetworkError')) {
      return {
        message: 'Unable to connect to the server. Please check your internet connection.',
        code: 'NETWORK_ERROR',
        status: 0
      }
    }
    
    // Check for timeout
    if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      return {
        message: 'Request timed out. Please try again.',
        code: 'TIMEOUT',
        status: 504
      }
    }
    
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
      status: 500
    }
  }
  
  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN',
    status: 500
  }
}

// Log error for debugging
export function logError(error: unknown, context?: string) {
  const timestamp = new Date().toISOString()
  const errorInfo = getErrorResponse(error)
  
  console.error(`[${timestamp}] ${context || 'Error'}:`, {
    message: errorInfo.message,
    code: errorInfo.code,
    status: errorInfo.status,
    stack: error instanceof Error ? error.stack : undefined
  })
}

// Retry configuration
export const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2
}

// Calculate retry delay with exponential backoff
export function getRetryDelay(attempt: number): number {
  const delay = RETRY_CONFIG.initialDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt)
  return Math.min(delay, RETRY_CONFIG.maxDelay)
}

// Check if error is retryable
export function isRetryable(error: unknown): boolean {
  if (error instanceof RateLimitError) return true
  if (error instanceof ServerError) return true
  if (error instanceof NetworkError) return true
  if (error instanceof TimeoutError) return true
  
  // Check status code
  const response = error as { status?: number; code?: string }
  if (response?.status === 429 || response?.status === 503 || response?.status === 504) {
    return true
  }
  
  return false
}