import { generateText } from 'ai';
import { models } from '../groq';

export async function summarizeContract(fullText: string): Promise<string> {
  // If contract is too huge, truncate to roughly 20k chars as standard context length
  const textContext = fullText.slice(0, 20000);

  const prompt = `You are an expert contract lawyer. 
Write a high-level, plain-English executive summary for the following contract text.
Focus on the primary obligations, term lengths, payment structures, and any immediate red flags.
Do NOT use legal jargon. Output only the summary, no markdown blocks.

CONTRACT:
${textContext}
`;

  try {
    const { text } = await generateText({
      model: models.fast,
      prompt: prompt,
    });
    return text.trim();
  } catch (err) {
    console.error('Error generating summary:', err);
    return 'Summary generation failed due to an API error.';
  }
}
