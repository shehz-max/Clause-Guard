import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AppError } from '@/lib/errors';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      throw new AppError('Contract ID is required', 'MISSING_ID', 400);
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new AppError('Invalid contract ID format', 'INVALID_ID', 400);
    }

    const supabase = await createClient();

    // Get document with analysis
    const { data: document, error: docError } = await (supabase
      .from('documents') as any)
      .select(`
        id,
        filename,
        status,
        created_at,
        page_count,
        error_message,
        analyses (
          id,
          overall_risk_score,
          risk_level,
          created_at
        )
      `)
      .eq('id', id)
      .single();

    if (docError) {
      if (docError.code === 'PGRST116') {
        throw new AppError('Contract not found', 'NOT_FOUND', 404);
      }
      throw new AppError(docError.message, 'DATABASE_ERROR', 500);
    }

    if (!document) {
      throw new AppError('Contract not found', 'NOT_FOUND', 404);
    }

    // Determine progress based on status
    const progressMap: Record<string, number> = {
      'processing': 50,
      'analyzed': 100,
      'error': -1 // Indicates failure
    };

    const response = {
      id: document.id,
      filename: document.filename,
      status: document.status,
      progress: progressMap[document.status] ?? 0,
      pageCount: document.page_count,
      createdAt: document.created_at,
      error: document.status === 'error' ? document.error_message : null,
      analysis: document.analyses ? {
        id: document.analyses.id,
        riskScore: document.analyses.overall_risk_score,
        riskLevel: document.analyses.risk_level,
        createdAt: document.analyses.created_at
      } : null
    };

    return NextResponse.json({
      success: true,
      data: response
    });

  } catch (error: any) {
    console.error('Contract status error:', error);
    
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch contract status', code: 'UNKNOWN' },
      { status: 500 }
    );
  }
}