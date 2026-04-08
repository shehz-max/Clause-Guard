import { createClient } from '../supabase/server';
import { summarizeContract } from './summarizer';
import { detectRisks } from './risk-detector';
import { analyzeClauses } from './clause-analyzer';
import { compareWithBestPractices } from './comparator';
import { calculateRiskScore } from './scorer';
import { extractKeyDates } from './deadline-extractor';

export async function runAnalysisPipeline(documentId: string) {
  const supabase = await createClient();

  try {
    const { data: documentData, error: docErr } = await (supabase.from('documents') as any).select('*').eq('id', documentId).single();
    const doc = (documentData as any);
    if (docErr || !doc) throw new Error('Document not found');

    const { data: chunksData, error: chunkErr } = await (supabase.from('chunks') as any).select('*').eq('document_id', documentId).order('chunk_index');
    const chunks = (chunksData as any[]) || [];
    if (chunkErr || chunks.length === 0) throw new Error('Document chunks not found');

    // Parallelize ALL independent AI tasks — maximum speed, minimum latency
    const [summary, risks, clause_analyses, best_practice_comparisons, key_dates] = await Promise.all([
      summarizeContract(doc.raw_text),
      detectRisks(chunks),
      analyzeClauses(chunks),
      compareWithBestPractices(chunks),
      extractKeyDates(doc.raw_text),
    ]);
    
    const { score, risk_level } = calculateRiskScore(risks);

    const { data: analysis, error: insertErr } = await (supabase.from('analyses') as any).insert({
      document_id: documentId,
      summary,
      overall_risk_score: score,
      risk_level,
      risks,
      clause_analyses,
      best_practice_comparisons,
      key_dates,
      metadata: { completed_at: new Date().toISOString() }
    }).select().single();

    if (insertErr) throw new Error(`Failed to save analysis: ${insertErr.message}`);

    await (supabase.from('documents') as any).update({ status: 'analyzed' }).eq('id', documentId);

    return analysis;
  } catch (error: any) {
    console.error('Final Pipeline Error:', error);
    await (supabase.from('documents') as any).update({ status: 'error', error_message: error.message }).eq('id', documentId);
    throw error;
  }
}
