import { generateText } from 'ai';
import { models } from '../groq';

export interface KeyDate {
  label: string;
  date: string; // ISO format if absolute, plain text if relative e.g. "30 days after signing"
  type: 'absolute' | 'relative';
  category: 'expiry' | 'renewal' | 'payment' | 'notice' | 'milestone' | 'other';
  urgency: 'high' | 'medium' | 'low';
}

export async function extractKeyDates(fullText: string): Promise<KeyDate[]> {
  const textContext = fullText.slice(0, 18000);

  const prompt = `You are a contract date extraction specialist. 
Your task is to identify ALL critical dates, deadlines, and time-sensitive obligations mentioned in this contract.

Extract every important date or time reference including:
- Contract start and end/expiry dates
- Renewal windows and deadlines
- Payment due dates and schedules
- Notice period requirements (e.g. "30 days notice before termination")
- Milestone delivery dates
- Option exercise windows
- Regulatory compliance deadlines

For each date, provide a JSON object with EXACTLY these fields:
- "label": short descriptive name (e.g. "Contract Expiry Date", "Payment Due", "Termination Notice Period")
- "date": the exact date in YYYY-MM-DD format if absolute, or plain English if relative (e.g. "30 days after signing")
- "type": MUST be exactly "absolute" or "relative"
- "category": MUST be one of: "expiry", "renewal", "payment", "notice", "milestone", "other"
- "urgency": MUST be "high" if within 90 days or critical, "medium" if 90-180 days, "low" if further

Respond ONLY with a valid JSON array. No markdown. No explanation. If no dates are found, output [].

CONTRACT TEXT:
${textContext}
`;

  try {
    const { text } = await generateText({
      model: models.fast,
      prompt,
    });
    const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const dates = JSON.parse(clean) as KeyDate[];
    return Array.isArray(dates) ? dates : [];
  } catch (err) {
    console.error('Error extracting key dates:', err);
    return [];
  }
}
