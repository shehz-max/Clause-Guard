import { ClauseAnalysis } from "@/lib/analysis/clause-analyzer";
import { BestPracticeComparison } from "@/lib/analysis/comparator";
import { Check, X, FileText, SplitSquareHorizontal } from "lucide-react";

export function ClauseAccordion({ 
  clauses, comparisons 
}: { 
  clauses: ClauseAnalysis[], 
  comparisons: BestPracticeComparison[] 
}) {
  return (
    <div className="max-w-5xl mx-auto space-y-12 py-6">
      <section>
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-sm">
            <SplitSquareHorizontal className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground tracking-tight">Industry Benchmarking</h2>
        </div>
        
        <div className="grid gap-6">
          {comparisons.map((c, i) => (
            <div key={i} className="flex flex-col lg:flex-row gap-6 p-8 bg-card border border-border/30 rounded-[2rem] shadow-xl shadow-black/20 relative overflow-hidden isolate group hover:border-primary/20 transition-all">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none -z-10" />

              <div className="flex-1 lg:max-w-[200px]">
                 <div className="text-[10px] font-black uppercase text-muted-foreground mb-2 tracking-[0.2em] opacity-60">Legal Topic</div>
                 <div className="font-heading font-bold text-xl text-foreground mb-4">{c.topic}</div>
                 <div className="flex items-center">
                    <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border shadow-sm flex items-center ${
                      c.alignment === 'aligned' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      c.alignment === 'missing' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                      'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                    }`}>
                      {c.alignment === 'aligned' ? <Check className="w-3.5 h-3.5 mr-2" strokeWidth={3} /> : <X className="w-3.5 h-3.5 mr-2" strokeWidth={3} />}
                      {c.alignment}
                    </span>
                 </div>
              </div>
              
              <div className="flex-1 p-6 bg-zinc-900/10 dark:bg-black/20 rounded-2xl border border-white/5 shadow-inner">
                 <div className="text-[10px] font-black uppercase text-muted-foreground mb-3 tracking-[0.2em] opacity-50">Contract Stance</div>
                 <p className="text-base text-foreground/80 leading-relaxed font-medium line-height-1.4">{c.contract_stance}</p>
              </div>

              <div className="flex-1 p-6 bg-primary/5 rounded-2xl border border-primary/10 shadow-inner">
                 <div className="text-[10px] font-black uppercase text-primary mb-3 tracking-[0.2em] opacity-60">Best Practice Guidence</div>
                 <p className="text-base text-foreground/80 leading-relaxed font-medium line-height-1.4 italic">{c.best_practice}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pt-12 border-t border-border/30">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-zinc-800 dark:bg-white/5 rounded-xl flex items-center justify-center text-muted-foreground border border-white/10 shadow-sm">
            <FileText className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground tracking-tight">Clause Breakdown</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {clauses.map((c, i) => (
             <div key={i} className="p-7 bg-card/60 backdrop-blur-md border border-border/40 rounded-3xl group hover:border-primary/30 transition-all shadow-lg hover:shadow-primary/5">
                <div className="flex justify-between items-start mb-4 gap-4">
                   <h3 className="font-heading font-bold text-lg text-foreground tracking-tight line-clamp-1">{c.clause_title}</h3>
                   <span className={`text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full border shrink-0 ${
                     c.is_standard ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                   }`}>
                     {c.is_standard ? 'Standard' : 'Non-Standard'}
                   </span>
                </div>
                <div className="text-[10px] font-black uppercase text-muted-foreground mb-2 tracking-widest opacity-40">Plain English Interpretation</div>
                <p className="text-muted-foreground text-base leading-relaxed font-medium opacity-90">{c.plain_english}</p>
             </div>
          ))}
        </div>
      </section>
    </div>
  );
}
