import { NextResponse } from 'next/server';
import { runAnalysisPipeline } from '../../../lib/analysis/pipeline';

// Define maximum duration for Next.js to avoid Vercel 10s default timeout
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
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
