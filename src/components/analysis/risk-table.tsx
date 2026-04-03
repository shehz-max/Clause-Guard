import { AlertCircle, AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { IdentifiedRisk } from "@/lib/analysis/risk-detector";
import { motion } from "framer-motion";

export function RiskTable({ risks }: { risks: IdentifiedRisk[] }) {
  if (!risks || risks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground/60 bg-card rounded-[2.5rem] border border-border/30 shadow-inner">
        <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-6">
          <Info className="w-8 h-8 opacity-40" strokeWidth={1.5} />
        </div>
        <p className="text-xl font-heading font-medium">No significant risks identified</p>
        <p className="text-sm max-w-xs text-center mt-2">ClauseGuard has determined this contract aligns with standard legal safety protocols.</p>
      </div>
    );
  }

  // Sort: High -> Medium -> Low
  const sortedRisks = [...risks].sort((a, b) => {
    const sMap = { high: 3, medium: 2, low: 1 };
    return sMap[b.severity as keyof typeof sMap] - sMap[a.severity as keyof typeof sMap];
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center text-destructive border border-destructive/20 shadow-sm">
            <ShieldAlert className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground tracking-tight">Risk Assessment</h2>
        </div>
        <span className="text-xs font-bold bg-muted/50 text-muted-foreground border border-border/40 px-4 py-1.5 rounded-full uppercase tracking-widest leading-none">
          {risks.length} Anomalies Found
        </span>
      </div>

      <div className="space-y-5">
        {sortedRisks.map((risk, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`group p-8 rounded-[2rem] border transition-all duration-300 shadow-xl ${
              risk.severity === 'high' ? 'bg-destructive/[0.03] border-destructive/20 hover:bg-destructive/[0.07] hover:border-destructive/40' :
              risk.severity === 'medium' ? 'bg-yellow-500/[0.03] border-yellow-500/20 hover:bg-yellow-500/[0.07] hover:border-yellow-500/40' :
              'bg-card border-border/40 hover:bg-card/80 hover:border-primary/20'
            }`}
          >
             <div className="flex items-start gap-6">
                <div className={`shrink-0 w-12 h-12 rounded-2xl border flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${
                  risk.severity === 'high' ? 'bg-destructive/10 border-destructive/20 text-destructive' : 
                  risk.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                  'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                }`}>
                   {risk.severity === 'high' ? <AlertCircle className="w-6 h-6" strokeWidth={2.5} /> : 
                    risk.severity === 'medium' ? <AlertTriangle className="w-6 h-6" strokeWidth={2.5} /> :
                    <Info className="w-6 h-6" strokeWidth={2.5} />}
                </div>
                
                <div className="flex-1">
                   <div className="flex items-center gap-3 mb-2.5">
                     <h3 className="text-xl font-heading font-bold text-foreground tracking-tight line-height-1.2">{risk.title}</h3>
                     <span className={`text-[10px] uppercase font-black tracking-[0.2em] px-3 py-1 rounded-full border shadow-sm ${
                       risk.severity === 'high' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                       risk.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                       'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                     }`}>
                       {risk.severity}
                     </span>
                   </div>
                   <p className="text-muted-foreground font-medium text-lg leading-relaxed mb-6 opacity-90">{risk.description}</p>
                   
                   <div className="bg-zinc-900/10 dark:bg-black/20 border border-white/5 p-6 rounded-2xl shadow-inner relative overflow-hidden group-hover:border-primary/20 transition-colors">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Mitigation Strategy</span>
                      </div>
                      <p className="text-base text-foreground/90 font-semibold leading-relaxed">{risk.recommendation}</p>
                   </div>
                </div>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
