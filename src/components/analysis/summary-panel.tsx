import { ShieldAlert, TrendingUp, CheckCircle, Lightbulb, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function SummaryPanel({ analysis }: { analysis: any }) {
  if (!analysis) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6">
      {/* Executive Summary Card */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-8 md:p-10 bg-card rounded-[2rem] border border-border/40 shadow-2xl shadow-black/20 overflow-hidden isolate"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none -z-10" />
        
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary ring-1 ring-primary/20 shadow-lg shadow-primary/5">
            <Zap className="w-5 h-5 fill-primary/20" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground tracking-tight">Executive Intelligence</h2>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest opacity-60">Automated Summary</p>
          </div>
        </div>
        
        <div className="leading-relaxed text-muted-foreground text-lg font-medium whitespace-pre-wrap bg-zinc-900/10 dark:bg-white/5 p-6 md:p-8 rounded-2xl border border-white/5 shadow-inner">
          {analysis.summary}
        </div>
      </motion.section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Critical Risks", value: analysis.risks?.length || 0, icon: ShieldAlert, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
          { label: "Best Practice Alignment", value: `${analysis.best_practice_comparisons?.filter((c:any) => c.alignment === 'aligned').length || 0}`, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          { label: "Clause Standard", value: `${analysis.clause_analyses?.filter((c:any) => c.is_standard).length || 0}`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="p-7 bg-card border border-border/40 rounded-3xl flex items-start gap-6 shadow-xl transition-all hover:border-primary/20 group"
          >
            <div className={`w-14 h-14 ${stat.bg} ${stat.border} border rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} strokeWidth={2} />
            </div>
            <div>
              <div className="text-3xl font-heading font-bold mb-1 text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground tracking-widest uppercase font-bold opacity-60">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
