import { ChunkMatch } from './hybrid-search';

export interface CitationMap {
  [citationNumber: string]: ChunkMatch;
}

export function generateCitationMap(chunks: ChunkMatch[]): CitationMap {
  const map: CitationMap = {};
  chunks.forEach((chunk, index) => {
    map[(index + 1).toString()] = chunk;
  });
  return map;
}

export function formatContextWithCitations(chunks: ChunkMatch[]): string {
  return chunks.map((chunk, index) => {
    return `[${index + 1}] Section: ${chunk.clause_title || 'Unknown Section'}
${chunk.content}`;
  }).join('\n\n');
}
