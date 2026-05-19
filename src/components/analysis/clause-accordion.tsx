import { ClauseAnalysis } from "@/lib/analysis/clause-analyzer";
import { BestPracticeComparison } from "@/lib/analysis/comparator";
import { Check, X, FileText, Scale } from "lucide-react";

export function ClauseAccordion({ 
  clauses, comparisons 
}: { 
  clauses: ClauseAnalysis[], 
  comparisons: BestPracticeComparison[] 
}) {
  return (
    <div className="space-y-10">
      {comparisons.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Industry Benchmarking</h2>
              <p className="text-sm text-muted-foreground">Compare against standard practices</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {comparisons.map((c, i) => (
              <div key={i} className="p-5 bg-card border border-border/50 rounded-2xl hover:border-primary/20 transition-all">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">Topic</div>
                    <div className="font-semibold text-foreground">{c.topic}</div>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                    c.alignment === 'aligned' ? 'bg-emerald-500/10 text-emerald-400' :
                    c.alignment === 'missing' ? 'bg-red-500/10 text-red-400' :
                    'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {c.alignment === 'aligned' ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    {c.alignment}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-xl">
                    <div className="text-xs text-muted-foreground mb-2">Contract</div>
                    <p className="text-sm text-foreground">{c.contract_stance}</p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <div className="text-xs text-primary mb-2">Best Practice</div>
                    <p className="text-sm text-foreground">{c.best_practice}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Clause Breakdown</h2>
            <p className="text-sm text-muted-foreground">Individual analysis of each clause</p>
          </div>
        </div>

        {clauses.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border/50 rounded-2xl">
            <p className="text-muted-foreground">No clause analysis available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clauses.map((c, i) => (
              <div key={i} className="p-5 bg-card border border-border/50 rounded-2xl hover:border-primary/20 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{c.clause_title}</h3>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                    c.is_standard ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {c.is_standard ? 'Standard' : 'Non-Standard'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{c.plain_english}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}