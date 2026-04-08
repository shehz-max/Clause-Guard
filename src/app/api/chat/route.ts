import { streamText } from 'ai';
import { models } from '../../../lib/groq';
import { processRagQuery } from '../../../lib/rag/retriever';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 60 seconds (quality model needs more time)
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, documentId } = body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }
    
    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    const latestMessage = messages[messages.length - 1];
    const userQuery = latestMessage.content;

    // Run RAG pipeline
    const { promptContext, citationMap } = await processRagQuery(userQuery, documentId);

    // Provide detailed instructions to the model on how to use citations
    const systemPrompt = `You are ClauseGuard Copilot, an elite AI legal analyst with deep expertise in contract law, risk assessment, and legal negotiation strategy.

Your primary goal is to answer the user's questions about their contract accurately and precisely.

CORE GUIDELINES:
1. ALWAYS ground your answers in the provided DOCUMENT CONTEXT below. Do not hallucinate clauses.
2. After EVERY sentence that references the document, append the citation bracket e.g. [1], [2]. This is mandatory.
3. If the context doesn't answer the question, say: "This information is not present in the provided contract."
4. When asked about risks, provide actionable negotiation language — not just observations.
5. Use plain English. Your user may not be a lawyer.
6. Structure your answers with clear headings when the response is long.
7. If General Legal Knowledge Base (KB) items are provided, use them to contextualize best practices — but clearly distinguish them from the actual contract.

CONTEXT:
${promptContext}
`;

    const result = streamText({
      model: models.quality,
      system: systemPrompt,
      messages: messages,
    });

    // Provide via stream
    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred during chat generation' }, { status: 500 });
  }
}
