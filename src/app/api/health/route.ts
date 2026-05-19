import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/supabase/server';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';
export const maxDuration = 10;

export async function GET(req: Request) {
  // Rate limiting for health endpoint
  const ip = getClientIP(req)
  const { allowed, resetIn } = checkRateLimit(`${ip}:health`, { windowMs: 10000, maxRequests: 60 })
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', retryAfter: Math.ceil(resetIn / 1000) },
      { status: 429 }
    )
  }

  const start = Date.now()
  
  const dbHealth = await checkDatabaseHealth()
  
  const response = {
    status: dbHealth.healthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    services: {
      database: dbHealth
    },
    responseTime: Date.now() - start
  }
  
  return NextResponse.json(response, {
    status: dbHealth.healthy ? 200 : 503
  })
}