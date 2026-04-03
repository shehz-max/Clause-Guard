export interface Chunk {
  content: string
  chunkIndex: number
  clauseTitle: string | null
  pageNumber: number | null
  charStart: number
  charEnd: number
  tokenCount: number
}

interface ChunkerOptions {
  targetTokens?: number
  overlapTokens?: number
  minChunkTokens?: number
}

// Simple token estimation (1 token ≈ 4 characters for English)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

// Detect if text is a legal clause heading
function isClauseHeading(text: string): boolean {
  const trimmed = text.trim()
  
  // Numbered sections (e.g., "1.", "1.1", "Section 1:")
  if (/^(Section\s+)?\d+(\.\d+)*[.:\s]/.test(trimmed)) return true
  
  // ALL CAPS headings (common in legal docs)
  if (/^[A-Z][A-Z\s]{3,}[A-Z]$/.test(trimmed)) return true
  
  // Headings ending with colon
  if (/^[A-Z][A-Za-z\s]{2,30}:$/.test(trimmed)) return true
  
  return false
}

// Extract clause title from text
function extractClauseTitle(text: string): string | null {
  const lines = text.split('\n')
  for (const line of lines.slice(0, 3)) {
    if (isClauseHeading(line)) {
      return line.trim()
    }
  }
  return null
}

// Split text into paragraphs
function splitIntoParagraphs(text: string): string[] {
  return text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
}

// Find clause boundaries in text
function findClauseBoundaries(text: string): number[] {
  const boundaries: number[] = [0]
  const lines = text.split('\n')
  let charIndex = 0
  
  for (let i = 0; i < lines.length; i++) {
    if (isClauseHeading(lines[i])) {
      boundaries.push(charIndex)
    }
    charIndex += lines[i].length + 1 // +1 for newline
  }
  
  boundaries.push(text.length)
  return boundaries
}

// Main chunking function with clause-aware splitting
export function chunkDocument(
  text: string,
  options: ChunkerOptions = {}
): Chunk[] {
  const {
    targetTokens = 600,
    overlapTokens = 150,
    minChunkTokens = 100,
  } = options

  const targetChars = targetTokens * 4
  const overlapChars = overlapTokens * 4
  const minChunkChars = minChunkTokens * 4

  const chunks: Chunk[] = []
  const boundaries = findClauseBoundaries(text)
  
  let currentChunk = ''
  let currentStart = 0
  let chunkIndex = 0

  for (let i = 0; i < boundaries.length - 1; i++) {
    const start = boundaries[i]
    const end = boundaries[i + 1]
    const section = text.slice(start, end).trim()
    
    if (section.length === 0) continue

    // If adding this section would exceed target, save current chunk
    if (currentChunk.length + section.length > targetChars && currentChunk.length >= minChunkChars) {
      const clauseTitle = extractClauseTitle(currentChunk)
      
      chunks.push({
        content: currentChunk.trim(),
        chunkIndex: chunkIndex++,
        clauseTitle,
        pageNumber: null, // Will be set later if page info available
        charStart: currentStart,
        charEnd: currentStart + currentChunk.length,
        tokenCount: estimateTokens(currentChunk),
      })

      // Start new chunk with overlap
      const overlapStart = Math.max(0, currentChunk.length - overlapChars)
      currentChunk = currentChunk.slice(overlapStart) + '\n\n' + section
      currentStart = start - overlapChars
    } else {
      // Add to current chunk
      if (currentChunk.length > 0) {
        currentChunk += '\n\n'
      }
      currentChunk += section
    }
  }

  // Don't forget the last chunk
  if (currentChunk.length >= minChunkChars) {
    const clauseTitle = extractClauseTitle(currentChunk)
    
    chunks.push({
      content: currentChunk.trim(),
      chunkIndex: chunkIndex++,
      clauseTitle,
      pageNumber: null,
      charStart: currentStart,
      charEnd: currentStart + currentChunk.length,
      tokenCount: estimateTokens(currentChunk),
    })
  }

  // Merge very small chunks with neighbors
  return mergeSmallChunks(chunks, minChunkChars)
}

// Merge chunks that are too small
function mergeSmallChunks(chunks: Chunk[], minChunkChars: number): Chunk[] {
  if (chunks.length <= 1) return chunks

  const merged: Chunk[] = []
  let i = 0

  while (i < chunks.length) {
    let current = { ...chunks[i] }
    
    // Merge with next chunk if too small
    while (current.content.length < minChunkChars && i + 1 < chunks.length) {
      const next = chunks[i + 1]
      current.content += '\n\n' + next.content
      current.charEnd = next.charEnd
      current.tokenCount = estimateTokens(current.content)
      current.clauseTitle = current.clauseTitle || next.clauseTitle
      i++
    }
    
    merged.push(current)
    i++
  }

  // Re-index chunks
  return merged.map((chunk, idx) => ({
    ...chunk,
    chunkIndex: idx,
  }))
}

// Chunk text with page information (for PDFs)
export function chunkDocumentWithPages(
  pages: { text: string; pageNumber: number }[],
  options?: ChunkerOptions
): Chunk[] {
  const fullText = pages.map(p => p.text).join('\n\n')
  const chunks = chunkDocument(fullText, options)
  
  // Assign page numbers based on character positions
  let currentPage = 1
  let charCount = 0
  
  return chunks.map(chunk => {
    // Find which page this chunk starts on
    let pageCharCount = 0
    for (const page of pages) {
      if (chunk.charStart >= pageCharCount && chunk.charStart < pageCharCount + page.text.length) {
        return { ...chunk, pageNumber: page.pageNumber }
      }
      pageCharCount += page.text.length + 2 // +2 for \n\n
    }
    return chunk
  })
}
