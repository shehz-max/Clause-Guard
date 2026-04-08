import { hybridSearchChunks, hybridSearchKnowledgeBase } from './hybrid-search';
import { evaluateRetrievalRelevance } from './corrective-rag';
import { generateCitationMap, formatContextWithCitations } from './citations';

export async function processRagQuery(query: string, documentId: string) {
  // 1. Initial Retrieval from Document
  // We use 10 chunks to ensure high recall without the extra CRAG step
  let chunks = await hybridSearchChunks(query, documentId, 10, 0.4, 0.6);
  
  // 2. Corrective Validation (Skipped for performance and rate-limit safety)
  // Let the main LLM handle the relevance filtering within the prompt context
  // chunks = await evaluateRetrievalRelevance(query, chunks);
  
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
