import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { AppError } from '@/lib/errors';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function DELETE(
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

    const supabase = createAdminClient();

    // First check if the contract exists
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('id, filename')
      .eq('id', id)
      .single();

    if (fetchError || !document) {
      throw new AppError('Contract not found', 'NOT_FOUND', 404);
    }

    // Delete related records first (cascade should handle this, but being explicit)
    // Delete analyses
    await supabase
      .from('analyses')
      .delete()
      .eq('document_id', id);

    // Delete chat messages
    await supabase
      .from('chat_messages')
      .delete()
      .eq('document_id', id);

    // Delete chunks (with embeddings)
    await supabase
      .from('chunks')
      .delete()
      .eq('document_id', id);

    // Finally delete the document
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Delete contract error:', deleteError);
      throw new AppError('Failed to delete contract', 'DELETE_FAILED', 500);
    }

    console.log(`Contract deleted: ${id} (${document.filename})`);

    return NextResponse.json({
      success: true,
      message: 'Contract deleted successfully',
      deletedId: id
    });

  } catch (error: any) {
    console.error('Delete contract error:', error);
    
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete contract', code: 'UNKNOWN' },
      { status: 500 }
    );
  }
}

// GET single contract (for future use)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      throw new AppError('Contract ID is required', 'MISSING_ID', 400);
    }

    const supabase = createAdminClient();

    const { data: document, error } = await (supabase
      .from('documents') as any)
      .select(`
        id,
        filename,
        file_type,
        file_size_bytes,
        page_count,
        status,
        created_at,
        analyses (
          id,
          overall_risk_score,
          risk_level,
          summary
        )
      `)
      .eq('id', id)
      .single();

    if (error || !document) {
      throw new AppError('Contract not found', 'NOT_FOUND', 404);
    }

    return NextResponse.json({
      success: true,
      data: document
    });

  } catch (error: any) {
    console.error('Get contract error:', error);
    
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch contract', code: 'UNKNOWN' },
      { status: 500 }
    );
  }
}