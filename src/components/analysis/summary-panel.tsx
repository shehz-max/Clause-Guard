import { ShieldAlert, TrendingUp, CheckCircle, Zap, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { DeadlineTimeline } from "./deadline-timeline";

export function SummaryPanel({ analysis }: { analysis: any }) {
  if (!analysis) return null;

  return (
    <div className="space-y-8">
      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Executive Summary</h2>
            <p className="text-sm text-slate-500">AI-generated overview</p>
          </div>
        </div>
        <div className="text-base leading-relaxed text-slate-700 whitespace-pre-wrap bg-white p-6 rounded-xl border border-slate-200">
          {analysis.summary}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: "Critical Risks", value: analysis.risks?.length || 0, icon: ShieldAlert, color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
          { label: "Best Practices Met", value: `${analysis.best_practice_comparisons?.filter((c:any) => c.alignment === 'aligned').length || 0}`, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
          { label: "Standard Clauses", value: `${analysis.clause_analyses?.filter((c:any) => c.is_standard).length || 0}`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className={`p-6 bg-white rounded-2xl border ${stat.border} flex items-center gap-4 hover:shadow-md transition-all`}
          >
            <div className={`w-12 h-12 ${stat.bg} border ${stat.border} rounded-xl flex items-center justify-center shrink-0`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {analysis.key_dates && analysis.key_dates.length > 0 && (
        <DeadlineTimeline keyDates={analysis.key_dates} />
      )}
    </div>
  );
}