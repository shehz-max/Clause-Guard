import { Check, X, FileText, Scale } from "lucide-react";

export function ClauseAccordion({ 
  clauses, comparisons 
}: { 
  clauses: any[], 
  comparisons: any[] 
}) {
  return (
    <div className="space-y-10">
      {comparisons.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Industry Benchmarking</h2>
              <p className="text-sm text-slate-500">Compare against standard practices</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {comparisons.map((c, i) => (
              <div key={i} className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-emerald-300 transition-all">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <div className="flex-1">
                    <div className="text-xs text-slate-500 mb-1">Topic</div>
                    <div className="font-semibold text-slate-900">{c.topic}</div>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                    c.alignment === 'aligned' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    c.alignment === 'missing' ? 'bg-red-50 text-red-600 border border-red-100' :
                    'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {c.alignment === 'aligned' ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    {c.alignment}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-xs text-slate-500 mb-2">Contract</div>
                    <p className="text-sm text-slate-700">{c.contract_stance}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="text-xs text-emerald-600 mb-2">Best Practice</div>
                    <p className="text-sm text-slate-700">{c.best_practice}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 flex items-center justify-center text-purple-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Clause Breakdown</h2>
            <p className="text-sm text-slate-500">Individual analysis of each clause</p>
          </div>
        </div>

        {clauses.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-2xl">
            <p className="text-slate-500">No clause analysis available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clauses.map((c, i) => (
              <div key={i} className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-emerald-300 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">{c.clause_title}</h3>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                    c.is_standard ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {c.is_standard ? 'Standard' : 'Non-Standard'}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{c.plain_english}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}