import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ContractTabs } from "./tabs"; 
import { ExportButton } from "@/components/analysis/export-button";
import { ChevronLeft, FileText, Calendar } from "lucide-react";
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
    <div className="min-h-screen pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-slate-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{doc.filename}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(doc.created_at).toLocaleDateString()}
                  </span>
                  {doc.page_count && (
                    <span>{doc.page_count} pages</span>
                  )}
                </div>
              </div>
            </div>

            {analysis ? (
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Risk Score</p>
                  <div className={`text-4xl font-black ${
                    analysis.overall_risk_score < 50 ? 'text-red-500' : 
                    analysis.overall_risk_score < 80 ? 'text-amber-500' : 'text-emerald-600'
                  }`}>
                    {analysis.overall_risk_score.toFixed(0)}
                    <span className="text-lg text-slate-400 font-normal">/100</span>
                  </div>
                </div>
                <ExportButton document={doc} analysis={analysis} />
              </div>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Analyzing...
              </div>
            )}
          </div>
        </div>
        
        <ContractTabs document={doc} analysis={analysis} />
      </div>
    </div>
  );
}