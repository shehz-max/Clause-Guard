import { ShieldAlert, TrendingUp, CheckCircle, Zap, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { DeadlineTimeline } from "./deadline-timeline";

export function SummaryPanel({ analysis }: { analysis: any }) {
  if (!analysis) return null;

  return (
    <div className="space-y-8">
      <div className="p-8 bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Executive Summary</h2>
            <p className="text-sm text-muted-foreground">AI-generated overview</p>
          </div>
        </div>
        <div className="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap bg-muted/30 p-6 rounded-xl border border-border/30">
          {analysis.summary}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: "Critical Risks", value: analysis.risks?.length || 0, icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
          { label: "Best Practices Met", value: `${analysis.best_practice_comparisons?.filter((c:any) => c.alignment === 'aligned').length || 0}`, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          { label: "Standard Clauses", value: `${analysis.clause_analyses?.filter((c:any) => c.is_standard).length || 0}`, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="p-6 bg-card border border-border/50 rounded-2xl flex items-center gap-4 hover:border-primary/20 transition-all"
          >
            <div className={`w-12 h-12 ${stat.bg} border ${stat.border} rounded-xl flex items-center justify-center shrink-0`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
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