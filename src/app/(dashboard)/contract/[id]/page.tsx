import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ContractTabs } from "./tabs"; 
import { ExportButton } from "@/components/analysis/export-button";
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
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6 flex items-start justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground truncate max-w-2xl">{doc.filename}</h1>
          <p suppressHydrationWarning className="text-muted-foreground mt-1">Uploaded {new Date(doc.created_at).toLocaleDateString()}</p>
        </div>
        {analysis ? (
           <div className="flex flex-col items-end gap-3">
              <div className="flex flex-col items-end">
                <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1 font-semibold">Overall Risk Score</span>
                <div className={`text-4xl font-bold tracking-tighter ${analysis.overall_risk_score < 50 ? 'text-destructive' : analysis.overall_risk_score < 80 ? 'text-yellow-500' : 'text-emerald-500'}`}>
                  {analysis.overall_risk_score.toFixed(0)} <span className="text-xl text-muted-foreground opacity-50 font-normal">/ 100</span>
                </div>
              </div>
              <ExportButton document={doc} analysis={analysis} />
           </div>
        ) : (
            <div className="flex flex-col items-end">
               <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1 font-semibold">Status</span>
               <div className="px-3 py-1 rounded-full bg-primary/20 text-primary font-bold animate-pulse">Processing...</div>
            </div>
        )}
      </div>
      
      <ContractTabs document={doc} analysis={analysis} />
    </div>
  );
}
