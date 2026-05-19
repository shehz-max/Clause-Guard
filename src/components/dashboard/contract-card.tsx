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
  
  const dateStr = new Date(contract.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0,0,0,0.15)" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-emerald-500/30 overflow-hidden"
    >
      <Link href={contract.status === 'analyzed' ? `/contract/${contract.id}` : '#'} className="block p-6">
        <div className="flex justify-between items-start mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          
          {isAnalyzed && analysis ? (
            <div className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 ${
              isHighRisk ? 'bg-red-50 text-red-600 border border-red-100' : 
              isMedRisk ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isHighRisk ? 'bg-red-500 animate-pulse' : isMedRisk ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              {score.toFixed(0)}
            </div>
          ) : contract.status === 'failed' ? (
            <div className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 border border-red-100 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Failed
            </div>
          ) : (
            <div className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 flex items-center gap-1.5">
              <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '2s' }} />
              {contract.status}
            </div>
          )}
        </div>

        <h3 className="font-semibold text-slate-900 text-base mb-3 line-clamp-2 leading-tight" title={contract.filename}>
          {contract.filename}
        </h3>
        
        <p className="text-sm text-slate-500 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          {dateStr}
        </p>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm font-medium text-emerald-600">View Report</span>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
}