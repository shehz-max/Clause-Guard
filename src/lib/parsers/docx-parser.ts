import mammoth from 'mammoth'

export interface ParsedDOCX {
  text: string
  pageCount: number | null
  paragraphs: string[]
  info: {
    title?: string
    author?: string
    subject?: string
    keywords?: string
    creator?: string
    lastModifiedBy?: string
    revision?: string
    created?: string
    modified?: string
  }
}

export async function parseDOCX(buffer: Buffer): Promise<ParsedDOCX> {
  try {
    const result = await mammoth.extractRawText({ buffer })
    
    // Split into paragraphs for better processing
    const paragraphs = result.value
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0)
    
    // Clean up the text
    const text = result.value
      .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
      .trim()
    
    // DOCX doesn't have explicit page count, estimate based on content
    // Average 500 words per page
    const wordCount = text.split(/\s+/).length
    const estimatedPageCount = Math.ceil(wordCount / 500)

    return {
      text,
      pageCount: estimatedPageCount,
      paragraphs,
      info: {}, // Mammoth doesn't expose metadata easily
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('zip')) {
        throw new Error('The file appears to be corrupted or not a valid DOCX')
      }
    }
    throw new Error(`Failed to parse DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Alternative: Extract with more formatting preserved
export async function parseDOCXWithFormatting(buffer: Buffer): Promise<{
  text: string
  html: string
  paragraphs: string[]
}> {
  const [textResult, htmlResult] = await Promise.all([
    mammoth.extractRawText({ buffer }),
    mammoth.convertToHtml({ buffer }),
  ])

  const paragraphs = textResult.value
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0)

  return {
    text: textResult.value.trim(),
    html: htmlResult.value,
    paragraphs,
  }
}

// Check if buffer is a valid DOCX (ZIP file starting with PK)
export function isValidDOCX(buffer: Buffer): boolean {
  // DOCX files are ZIP files starting with PK
  return buffer.slice(0, 2).toString('hex') === '504b'
}
