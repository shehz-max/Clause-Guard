"use client";

import { motion } from "framer-motion";
import { FileText, ShieldAlert, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export interface Contract {
  id: string;
  filename: string;
  status: 'pending' | 'processing' | 'analyzed' | 'failed';
  created_at: string;
  analyses?: { overall_risk_score: number; risk_level: string }[];
}

export function ContractCard({ contract }: { contract: Contract }) {
  const isAnalyzed = contract.status === 'analyzed';
  const analysis = isAnalyzed && contract.analyses && contract.analyses.length > 0 ? contract.analyses[0] : null;
  
  const score = analysis?.overall_risk_score ?? 0;
  const isHighRisk = score < 50;
  const isMedRisk = score >= 50 && score < 80;
  
  const dateStr = new Date(contract.created_at).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all"
    >
      <Link href={contract.status === 'analyzed' ? `/contract/${contract.id}` : '#'} className="block p-6">
        <div className="flex justify-between items-start mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center text-primary">
            <FileText className="w-5 h-5" strokeWidth={2} />
          </div>
          
          {isAnalyzed && analysis ? (
            <div className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-2 ${
              isHighRisk ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
              isMedRisk ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isHighRisk ? 'bg-red-400 animate-pulse' : isMedRisk ? 'bg-yellow-400' : 'bg-emerald-400'}`} />
              {score.toFixed(0)}
            </div>
          ) : contract.status === 'failed' ? (
            <div className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Failed
            </div>
          ) : (
            <div className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-muted text-muted-foreground flex items-center gap-1.5">
              <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '2s' }} />
              {contract.status}
            </div>
          )}
        </div>

        <h3 className="font-semibold text-foreground text-base mb-3 line-clamp-2 leading-tight" title={contract.filename}>
          {contract.filename}
        </h3>
        
        <p suppressHydrationWarning className="text-sm text-muted-foreground flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
          {dateStr}
        </p>

        <div className="mt-5 pt-4 border-t border-border/30 flex items-center justify-between">
          <span className="text-sm font-medium text-primary">View Report</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
}