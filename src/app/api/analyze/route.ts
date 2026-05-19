import { NextResponse } from 'next/server';
import { runAnalysisPipeline } from '../../../lib/analysis/pipeline';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

// Define maximum duration for Next.js to avoid Vercel 10s default timeout
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = getClientIP(req)
    const { allowed, resetIn } = checkRateLimit(`${ip}:analyze`, { windowMs: 60000, maxRequests: 5 })
    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again later.', retryAfter: Math.ceil(resetIn / 1000) },
        { status: 429 }
      )
    }

    const body = await req.json();
    const { documentId } = body;

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    const analysis = await runAnalysisPipeline(documentId);

    return NextResponse.json({ success: true, analysis });

  } catch (error: any) {
    console.error('Analysis Pipeline Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
