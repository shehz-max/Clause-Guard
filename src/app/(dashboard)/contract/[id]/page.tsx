import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ContractTabs } from "./tabs"; 
import { ExportButton } from "@/components/analysis/export-button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;
  
  const { data: documentData, error } = await (supabase
    .from('documents') as any)
    .select(`*, analyses(*)`)
    .eq('id', id)
    .single();
  
  const doc = (documentData as any);

  if (error || !doc) return notFound();

  const analysis = doc.analyses && doc.analyses.length > 0 ? doc.analyses[0] : null;

  return (
    <div className="max-w-6xl mx-auto min-h-[calc(100vh-8rem)] flex flex-col px-4 sm:px-0">
      <div className="mb-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 shrink-0">
        <div className="flex flex-col items-center sm:items-start w-full sm:w-auto text-center sm:text-left">
           <Link 
            href="/dashboard" 
            className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest mb-3"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate max-w-full sm:max-w-2xl px-4 sm:px-0">
            {doc.filename}
          </h1>
          <p suppressHydrationWarning className="text-muted-foreground mt-1 text-sm">
            Uploaded {new Date(doc.created_at).toLocaleDateString()}
          </p>
        </div>

        {analysis ? (
           <div className="flex flex-col items-center sm:items-end gap-3 w-full sm:w-auto">
              <div className="flex flex-col items-center sm:items-end">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-bold">Overall Risk Score</span>
                <div className={`text-4xl sm:text-5xl font-black tracking-tighter ${analysis.overall_risk_score < 50 ? 'text-destructive' : analysis.overall_risk_score < 80 ? 'text-yellow-500' : 'text-emerald-500'}`}>
                  {analysis.overall_risk_score.toFixed(0)}<span className="text-xl text-muted-foreground/40 font-normal">/100</span>
                </div>
              </div>
              <div className="w-full sm:w-auto">
                <ExportButton document={doc} analysis={analysis} />
              </div>
           </div>
        ) : (
            <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
               <span className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-bold">Status</span>
               <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black animate-pulse border border-primary/20">
                 ANALYZING...
               </div>
            </div>
        )}
      </div>
      
      <ContractTabs document={doc} analysis={analysis} />
    </div>
  );
}
