import { createClient } from '../supabase/server';
import { summarizeContract } from './summarizer';
import { detectRisks } from './risk-detector';
import { analyzeClauses } from './clause-analyzer';
import { compareWithBestPractices } from './comparator';
import { calculateRiskScore } from './scorer';

export async function runAnalysisPipeline(documentId: string) {
  const supabase = await createClient();

  try {
    const { data: doc, error: docErr } = await (supabase.from('documents') as any).select('*').eq('id', documentId).single();
    if (docErr || !doc) throw new Error('Document not found');

    const { data: chunks, error: chunkErr } = await (supabase.from('chunks') as any).select('*').eq('document_id', documentId).order('chunk_index');
    if (chunkErr || !chunks || chunks.length === 0) throw new Error('Document chunks not found');

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const summary = await summarizeContract(doc.raw_text);
    await sleep(1000); // Rate limiter delay buffer for free tier

    const risks = await detectRisks(chunks);
    await sleep(1000);

    const clause_analyses = await analyzeClauses(chunks);
    await sleep(1000);

    const best_practice_comparisons = await compareWithBestPractices(chunks);
    
    const { score, risk_level } = calculateRiskScore(risks);

    const { data: analysis, error: insertErr } = await (supabase.from('analyses') as any).insert({
      document_id: documentId,
      summary,
      overall_risk_score: score,
      risk_level,
      risks,
      clause_analyses,
      best_practice_comparisons,
      metadata: { completed_at: new Date().toISOString() }
    }).select().single();

    if (insertErr) throw new Error(`Failed to save analysis: ${insertErr.message}`);

    await (supabase.from('documents') as any).update({ status: 'analyzed' }).eq('id', documentId);

    return analysis;
  } catch (error: any) {
    console.error('Final Pipeline Error:', error);
    await (supabase.from('documents') as any).update({ status: 'error' }).eq('id', documentId);
    throw error;
  }
}
