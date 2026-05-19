import { AlertCircle, AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { IdentifiedRisk } from "@/lib/analysis/risk-detector";
import { motion } from "framer-motion";

export function RiskTable({ risks }: { risks: IdentifiedRisk[] }) {
  if (!risks || risks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50 border border-slate-200 rounded-2xl">
        <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
          <Info className="w-6 h-6 text-emerald-600" />
        </div>
        <p className="text-lg font-semibold text-slate-900 mb-2">No significant risks found</p>
        <p className="text-sm text-slate-500 max-w-sm">This contract appears to align well with standard legal safety protocols.</p>
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
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Identified Risks</h2>
        </div>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
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
              risk.severity === 'high' ? 'bg-red-50 border-red-200' :
              risk.severity === 'medium' ? 'bg-amber-50 border-amber-200' :
              'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                risk.severity === 'high' ? 'bg-red-100 text-red-600' : 
                risk.severity === 'medium' ? 'bg-amber-100 text-amber-600' :
                'bg-emerald-100 text-emerald-600'
              }`}>
                {risk.severity === 'high' ? <AlertCircle className="w-5 h-5" /> : 
                 risk.severity === 'medium' ? <AlertTriangle className="w-5 h-5" /> :
                 <Info className="w-5 h-5" />}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-base font-semibold text-slate-900">{risk.title}</h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded-lg uppercase ${
                    risk.severity === 'high' ? 'bg-red-100 text-red-600' :
                    risk.severity === 'medium' ? 'bg-amber-100 text-amber-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    {risk.severity}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-4">{risk.description}</p>
                
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="text-xs font-medium text-slate-500 mb-2">Recommendation</div>
                  <p className="text-sm text-slate-800 font-medium">{risk.recommendation}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}