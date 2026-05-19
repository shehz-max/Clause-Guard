// In-memory rate limiter for Vercel serverless
// For production, consider using Vercel KV or Redis

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Default limits
const DEFAULT_WINDOW_MS = 60000; // 1 minute
const DEFAULT_MAX_REQUESTS = 30;

export const RATE_LIMITS = {
  // API Routes
  upload: { windowMs: 60000, maxRequests: 10 }, // 10 uploads per minute
  chat: { windowMs: 60000, maxRequests: 30 }, // 30 chat messages per minute
  analyze: { windowMs: 60000, maxRequests: 5 }, // 5 analyses per minute
  
  // Health check - can be called more frequently
  health: { windowMs: 10000, maxRequests: 60 }, // 60 per 10 seconds
  
  // General API - default for most endpoints
  default: { windowMs: 60000, maxRequests: 100 }, // 100 per minute
};

// Store for rate limits (in production, use Redis or Vercel KV)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export class RateLimitExceededError extends Error {
  constructor(
    public retryAfter: number,
    public limit: number,
    public windowMs: number
  ) {
    super(`Rate limit exceeded. Try again in ${retryAfter} seconds.`);
    this.name = 'RateLimitExceededError';
  }
}

export function getRateLimitKey(ip: string, endpoint: string): string {
  return `${ip}:${endpoint}`;
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMITS.default
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // If no entry or entry has expired, create new one
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs
    };
  }

  // Increment count
  entry.count++;
  
  // Check if limit exceeded
  if (entry.count > config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetTime - now
    };
  }

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetIn: entry.resetTime - now
  };
}

// Wrapper for API routes
export async function withRateLimit<T>(
  handler: () => Promise<T>,
  endpoint: keyof typeof RATE_LIMITS = 'default'
): Promise<T> {
  // Get client IP (in production, use proper IP detection)
  const ip = 'unknown'; // This should be extracted from headers in real implementation
  
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS.default;
  const key = getRateLimitKey(ip, endpoint);
  const { allowed, remaining, resetIn } = checkRateLimit(key, config);

  if (!allowed) {
    throw new RateLimitExceededError(
      Math.ceil(resetIn / 1000),
      config.maxRequests,
      config.windowMs
    );
  }

  return handler();
}

// IP extraction utility for Next.js
export function getClientIP(request: Request): string {
  // Check various headers that might contain the real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// Input validation utilities
export function validateUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export function sanitizeFilename(filename: string): string {
  // Remove path traversal and dangerous characters
  return filename
    .replace(/\.\./g, '') // Remove path traversal
    .replace(/[<>:"|?*]/g, '') // Remove special characters
    .replace(/\\/g, '/') // Normalize backslashes
    .substring(0, 255); // Limit length
}

export function validateFileType(filename: string, allowedTypes: string[]): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return allowedTypes.includes(ext);
}

// Security headers middleware
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-DNS-Prefetch-Control': 'on',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self'; " +
      "connect-src 'self' https://*.supabase.co https://*.groq.com https://generativelanguage.googleapis.com; " +
      "frame-ancestors 'none';"
  };
}

// Apply security headers to response
export function applySecurityHeaders(response: Response): Response {
  const headers = getSecurityHeaders();
  
  const newHeaders = new Headers(response.headers);
  Object.entries(headers).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}

// Request size limits
export const REQUEST_LIMITS = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  maxTextLength: 10 * 1024 * 1024, // 10MB
  maxJsonBody: 1 * 1024 * 1024, // 1MB
};

// Validate request body size
export function validateRequestSize(body: any, limit: number): boolean {
  if (!body) return true;
  
  const size = JSON.stringify(body).length;
  return size <= limit;
}