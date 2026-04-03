import { streamText } from 'ai';
import { models } from '../../../lib/groq';
import { processRagQuery } from '../../../lib/rag/retriever';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

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
    const systemPrompt = `You are a specialized legal AI assistant named ClauseGuard.
Your goal is to answer the user's questions about their contract based strictly on the provided context.

DOCUMENT CONTEXT EXCERPTS:
You have been provided with excerpts from the contract. Each excerpt starts with a citation tag like [1], [2], etc.

INSTRUCTIONS:
1. You MUST use the provided context to answer the question. 
2. Whenever you state a fact or reference a clause from the document context, you MUST append the citation bracket (e.g., "[1]") immediately after the sentence or clause.
3. If the context does not contain the answer, explicitly state that the information is not present in the provided contract. Do not hallucinate.
4. If Knowledge Base (KB) information is provided, you can use it to give general advice or highlight risks, but make sure to distinguish it from the actual contract text.

CONTEXT:
${promptContext}
`;

    const result = streamText({
      model: models.default,
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
