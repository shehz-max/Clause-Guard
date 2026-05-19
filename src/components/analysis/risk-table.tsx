import { AlertCircle, AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { IdentifiedRisk } from "@/lib/analysis/risk-detector";
import { motion } from "framer-motion";

export function RiskTable({ risks }: { risks: IdentifiedRisk[] }) {
  if (!risks || risks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-card border border-border/50 rounded-2xl">
        <div className="w-14 h-14 rounded-xl bg-muted/50 flex items-center justify-center mb-4">
          <Info className="w-6 h-6 text-muted-foreground/50" />
        </div>
        <p className="text-lg font-semibold text-foreground mb-2">No significant risks found</p>
        <p className="text-sm text-muted-foreground max-w-sm">This contract appears to align well with standard legal safety protocols.</p>
      </div>
    );
  }

  const sortedRisks = [...risks].sort((a, b) => {
    const sMap = { high: 3, medium: 2, low: 1 };
    return sMap[b.severity as keyof typeof sMap] - sMap[a.severity as keyof typeof sMap];
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Identified Risks</h2>
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
          {risks.length} found
        </span>
      </div>

      <div className="space-y-4">
        {sortedRisks.map((risk, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-6 rounded-2xl border transition-all ${
              risk.severity === 'high' ? 'bg-red-500/5 border-red-500/20' :
              risk.severity === 'medium' ? 'bg-yellow-500/5 border-yellow-500/20' :
              'bg-muted/30 border-border/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                risk.severity === 'high' ? 'bg-red-500/10 text-red-500' : 
                risk.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                'bg-emerald-500/10 text-emerald-500'
              }`}>
                {risk.severity === 'high' ? <AlertCircle className="w-5 h-5" /> : 
                 risk.severity === 'medium' ? <AlertTriangle className="w-5 h-5" /> :
                 <Info className="w-5 h-5" />}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-base font-semibold text-foreground">{risk.title}</h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded-lg uppercase ${
                    risk.severity === 'high' ? 'bg-red-500/10 text-red-400' :
                    risk.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {risk.severity}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{risk.description}</p>
                
                <div className="bg-muted/40 p-4 rounded-xl border border-border/30">
                  <div className="text-xs font-medium text-muted-foreground mb-2">Recommendation</div>
                  <p className="text-sm text-foreground font-medium">{risk.recommendation}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}