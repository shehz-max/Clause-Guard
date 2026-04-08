import { hybridSearchChunks, hybridSearchKnowledgeBase } from './hybrid-search';
import { generateCitationMap, formatContextWithCitations } from './citations';
import { rerankLegalChunks } from './reranker';

export async function processRagQuery(query: string, documentId: string) {
  // 1. Initial Retrieval (High Recall)
  // Retrieve 15 chunks to ensure we don't miss nuanced information
  const initialChunks = await hybridSearchChunks(query, documentId, 15, 0.4, 0.6);
  
  // 2. Legal Reranking (High Precision)
  // Use Judge AI to narrow down to the 5 absolute most relevant clauses
  const chunks = await rerankLegalChunks(query, initialChunks, 5);
  
  // 3. Fallback/Supplement from Knowledge Base if relevant chunks are too few
  let kbResults = '';
  if (chunks.length < 3) {
    const kbMatches = await hybridSearchKnowledgeBase(query, undefined, 3);
    if (kbMatches.length > 0) {
      kbResults = kbMatches.map((kb, i) => `[KB-${i + 1}] Category: ${kb.category}\n${kb.content}`).join('\n\n');
    }
  }

  // 4. Citation Mapping
  const citationMap = generateCitationMap(chunks);
  const contextText = formatContextWithCitations(chunks);

  return {
    citationMap,
    baseChunks: chunks,
    promptContext: `
DOCUMENT CONTEXT EXCERPTS:
${contextText || '(No directly relevant contract clauses found in document)'}

${kbResults ? `\nGENERAL LEGAL KNOWLEDGE BASE (Best Practices / Examples):\n${kbResults}` : ''}
    `.trim()
  };
}
