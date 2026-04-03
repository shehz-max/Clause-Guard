import { IdentifiedRisk } from './risk-detector';

export function calculateRiskScore(risks: IdentifiedRisk[]): { score: number; risk_level: 'low' | 'medium' | 'high' } {
  if (!risks || risks.length === 0) {
    return { score: 100, risk_level: 'low' }; // Safe baseline
  }

  let totalPenalty = 0;
  risks.forEach(risk => {
    const severity = risk.severity.toLowerCase();
    if (severity === 'high') totalPenalty += 30;
    else if (severity === 'medium') totalPenalty += 15;
    else totalPenalty += 5;
  });

  // Score from 0 to 100
  let score = 100 - totalPenalty;
  if (score < 0) score = 0;
  
  let risk_level: 'low' | 'medium' | 'high' = 'low';
  if (score < 50) risk_level = 'high';
  else if (score < 80) risk_level = 'medium';

  return { score, risk_level };
}
