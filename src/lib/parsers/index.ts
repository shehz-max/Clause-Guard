import { parsePDF, isValidPDF, ParsedPDF } from './pdf-parser'
import { parseDOCX, isValidDOCX, ParsedDOCX } from './docx-parser'

export type { ParsedPDF, ParsedDOCX }

export interface ParsedDocument {
  text: string
  pageCount: number | null
  fileType: 'pdf' | 'docx'
  metadata: {
    title?: string
    author?: string
    [key: string]: string | undefined
  }
  // Raw parsed data for advanced use
  raw: ParsedPDF | ParsedDOCX
}

export async function parseDocument(
  buffer: Buffer,
  fileType: 'pdf' | 'docx'
): Promise<ParsedDocument> {
  if (fileType === 'pdf') {
    if (!isValidPDF(buffer)) {
      throw new Error('Invalid PDF file')
    }
    
    const parsed = await parsePDF(buffer)
    return {
      text: parsed.text,
      pageCount: parsed.pageCount,
      fileType: 'pdf',
      metadata: {
        title: parsed.info.title,
        author: parsed.info.author,
      },
      raw: parsed,
    }
  }
  
  if (fileType === 'docx') {
    if (!isValidDOCX(buffer)) {
      throw new Error('Invalid DOCX file')
    }
    
    const parsed = await parseDOCX(buffer)
    return {
      text: parsed.text,
      pageCount: parsed.pageCount,
      fileType: 'docx',
      metadata: {
        title: parsed.info.title,
        author: parsed.info.author,
      },
      raw: parsed,
    }
  }
  
  throw new Error(`Unsupported file type: ${fileType}`)
}

// Auto-detect file type from buffer
export function detectFileType(buffer: Buffer): 'pdf' | 'docx' | null {
  if (isValidPDF(buffer)) return 'pdf'
  if (isValidDOCX(buffer)) return 'docx'
  return null
}

// Get file extension from filename
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

// Validate if file extension matches content
export function validateFileType(filename: string, buffer: Buffer): boolean {
  const ext = getFileExtension(filename)
  const detected = detectFileType(buffer)
  
  if (ext === 'pdf' && detected === 'pdf') return true
  if ((ext === 'docx' || ext === 'doc') && detected === 'docx') return true
  
  return false
}

export { isValidPDF, isValidDOCX }
