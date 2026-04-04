import pdfParse from 'pdf-parse'

export interface ParsedPDF {
  text: string
  pageCount: number
  pages: { text: string; pageNumber: number }[]
  info: {
    title?: string
    author?: string
    subject?: string
    keywords?: string
    creator?: string
    producer?: string
    creationDate?: string
    modificationDate?: string
  }
}

export async function parsePDF(buffer: Buffer): Promise<ParsedPDF> {
  try {
    const data = await pdfParse(buffer, {
      // Extract text from each page separately
      pagerender: function(pageData: any) {
        return pageData.getTextContent()
          .then(function(textContent: any) {
            let lastY = null
            let text = ''
            
            for (const item of textContent.items) {
              if (lastY !== item.transform[5] && lastY !== null) {
                text += '\n'
              }
              text += item.str
              lastY = item.transform[5]
            }
            
            return text
          })
      },
    })

    // Extract individual pages
    const pages: { text: string; pageNumber: number }[] = []
    
    // Re-parse to get individual page content
    const pageTexts = data.text.split(/\f/) // Form feed character separates pages
    
    for (let i = 0; i < data.numpages; i++) {
      const pageText = pageTexts[i] || ''
      pages.push({
        text: pageText.trim(),
        pageNumber: i + 1,
      })
    }

    return {
      text: data.text.replace(/\f/g, '\n\n').trim(),
      pageCount: data.numpages,
      pages,
      info: {
        title: data.info?.Title,
        author: data.info?.Author,
        subject: data.info?.Subject,
        keywords: data.info?.Keywords,
        creator: data.info?.Creator,
        producer: data.info?.Producer,
        creationDate: data.info?.CreationDate,
        modificationDate: data.info?.ModDate,
      },
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Invalid PDF')) {
        throw new Error('The file appears to be corrupted or not a valid PDF')
      }
      if (error.message.includes('password')) {
        throw new Error('The PDF is password protected. Please provide an unencrypted PDF')
      }
    }
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Check if buffer is a valid PDF
export function isValidPDF(buffer: Buffer): boolean {
  // PDF files start with %PDF
  return buffer.slice(0, 4).toString() === '%PDF'
}
