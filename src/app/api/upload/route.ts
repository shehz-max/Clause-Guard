import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { parseDocument, getFileExtension } from '@/lib/parsers'
import { chunkDocument, chunkDocumentWithPages } from '@/lib/rag/chunker'
import { createEmbeddings } from '@/lib/rag/embeddings'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const extension = getFileExtension(file.name)
    if (!['pdf', 'docx', 'doc'].includes(extension)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and DOCX files are supported.' },
        { status: 400 }
      )
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB.' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Parse document
    let parsedDoc
    try {
      const fileType = extension === 'pdf' ? 'pdf' : 'docx'
      parsedDoc = await parseDocument(buffer, fileType)
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to parse document' },
        { status: 400 }
      )
    }

    // Create document record
    const documentId = uuidv4()
    const { error: docError } = await (supabase.from('documents') as any).insert({
      id: documentId,
      filename: file.name,
      file_type: extension === 'pdf' ? 'pdf' : 'docx',
      file_size_bytes: file.size,
      raw_text: parsedDoc.text,
      page_count: parsedDoc.pageCount,
      status: 'processing',
    })

    if (docError) {
      console.error('Error creating document:', docError)
      return NextResponse.json(
        { error: 'Failed to create document record' },
        { status: 500 }
      )
    }

    // Chunk the document
    let chunks
    if (extension === 'pdf' && 'pages' in parsedDoc.raw) {
      const pdfData = parsedDoc.raw as { pages: { text: string; pageNumber: number }[] }
      chunks = chunkDocumentWithPages(pdfData.pages, {
        targetTokens: 600,
        overlapTokens: 150,
        minChunkTokens: 100,
      })
    } else {
      chunks = chunkDocument(parsedDoc.text, {
        targetTokens: 600,
        overlapTokens: 150,
        minChunkTokens: 100,
      })
    }

    // Generate embeddings for chunks
    const chunkContents = chunks.map(c => c.content)
    const embeddings = await createEmbeddings(chunkContents)

    // FORCE truncation down to 768 dims right before insertion to bypass strict Webpack lib caching
    for (let i = 0; i < embeddings.length; i++) {
      if (embeddings[i] && embeddings[i].length > 768) {
        embeddings[i] = embeddings[i].slice(0, 768);
      }
    }

    // Insert chunks with embeddings
    const chunkRecords = chunks.map((chunk, index) => ({
      document_id: documentId,
      content: chunk.content,
      chunk_index: chunk.chunkIndex,
      clause_title: chunk.clauseTitle,
      page_number: chunk.pageNumber,
      char_start: chunk.charStart,
      char_end: chunk.charEnd,
      token_count: chunk.tokenCount,
      embedding: embeddings[index],
    }))

    const { error: chunksError } = await (supabase.from('chunks') as any).insert(chunkRecords)

    if (chunksError) {
      console.error('Error inserting chunks:', chunksError)
      // Update document status to error
      await (supabase
        .from('documents') as any)
        .update({ status: 'error', error_message: 'Failed to process chunks: ' + (chunksError.message || JSON.stringify(chunksError)) })
        .eq('id', documentId)
      
      return NextResponse.json(
        { error: 'Failed to process document chunks: ' + chunksError.message, details: chunksError },
        { status: 500 }
      )
    }

    // Trigger analysis (async)
    // We don't await this - it runs in background
    fetch(`${request.nextUrl.origin}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId }),
    }).catch(console.error)

    return NextResponse.json({
      success: true,
      documentId,
      message: 'Document uploaded and processing started',
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

// Set max body size for uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}
