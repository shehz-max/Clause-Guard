"use client";

import { motion } from "framer-motion";
import { FileText, ShieldAlert, CheckCircle, Clock, ArrowRight } from "lucide-react";
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
  // Note: supabase joins array of analyses
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="group relative h-full flex flex-col overflow-hidden rounded-3xl bg-card border border-border/30 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-all hover:bg-card/80 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30"
    >
      <Link href={contract.status === 'analyzed' ? `/contract/${contract.id}` : '#'} className="flex flex-col h-full p-6 relative z-10">
        
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500 pointer-events-none -z-10" />

        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-muted/50 rounded-2xl group-hover:bg-primary/10 group-hover:text-primary transition-colors text-muted-foreground ring-1 ring-inset ring-white/5 shadow-inner shadow-black/20">
            <FileText className="w-5 h-5" strokeWidth={2} />
          </div>
          
          {isAnalyzed && analysis ? (
            <div className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center border shadow-sm backdrop-blur-md ${
              isHighRisk ? 'bg-destructive/10 text-destructive border-destructive/20' : 
              isMedRisk ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full mr-2 ${isHighRisk ? 'bg-destructive' : isMedRisk ? 'bg-yellow-500' : 'bg-emerald-500'}`} />
              Score: {score.toFixed(0)}
            </div>
          ) : contract.status === 'failed' ? (
            <div className="px-3 py-1.5 text-xs font-semibold rounded-full bg-destructive/10 text-destructive border border-destructive/20 flex items-center shadow-sm">
              <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />
              Failed
            </div>
          ) : (
            <div className="px-3 py-1.5 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground border border-border/60 flex items-center shadow-sm">
              <Clock className="w-3 h-3 mr-1.5 animate-spin-slow opacity-70" />
              <span className="capitalize">{contract.status}</span>
            </div>
          )}
        </div>

        <h3 className="font-heading font-semibold text-lg text-foreground mb-2 line-clamp-2 pr-2" title={contract.filename}>
          {contract.filename}
        </h3>
        
        <p suppressHydrationWarning className="text-sm font-medium text-muted-foreground/60 flex items-center flex-1">
          {dateStr}
        </p>

        <div className="mt-6 pt-5 border-t border-border/40 flex items-center justify-between text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
          <span>View Report</span>
          <div className="w-7 h-7 rounded-full bg-primary/0 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
             <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
