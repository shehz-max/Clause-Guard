import { createClient } from "@/lib/supabase/server";
import { ContractCard, Contract } from "@/components/dashboard/contract-card";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";

// Server action style cache busting or just dynamic config
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: documents, error } = await supabase
    .from('documents')
    .select(`
      id, filename, status, created_at,
      analyses ( overall_risk_score, risk_level )
    `)
    .order('created_at', { ascending: false });

  const contracts = (documents as Contract[]) || [];

  return (
    <div className="max-w-7xl mx-auto py-8 lg:py-12 px-2 md:px-0">
      {/* Hero Section */}
      <div className="relative mb-14 p-8 md:p-12 bg-card rounded-3xl border border-border/40 shadow-2xl shadow-black/40 overflow-hidden isolate">
        {/* Background Gradients */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none -z-10" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Engine Online
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4 text-foreground leading-tight">
              Contract Intelligence
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Upload, analyze, and instantly benchmark your legal agreements against industry-standard templates.
            </p>
          </div>
          <Link 
            href="/upload" 
            className="mt-8 md:mt-0 shrink-0 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-2xl flex items-center transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Analysis
          </Link>
        </div>
      </div>

      {error ? (
        <div className="p-6 bg-destructive/10 text-destructive rounded-xl border border-destructive/20">
          Error loading contracts: {error.message}
        </div>
      ) : contracts.length === 0 ? (
        <div className="text-center py-24 bg-card/30 border border-dashed border-border/60 rounded-3xl backdrop-blur-sm">
          <div className="w-20 h-20 bg-muted/60 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
            <FileText className="w-10 h-10 text-muted-foreground opacity-60" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">No contracts found</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">You haven't uploaded any legal documents yet. Upload your first contract to get started with the ClauseGuard engine.</p>
          <Link 
            href="/upload" 
            className="bg-secondary text-secondary-foreground font-medium px-6 py-3 rounded-full inline-flex items-center hover:bg-secondary/80 transition-colors shadow-sm"
          >
            Upload Contract
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {contracts.map((contract) => (
            <ContractCard key={contract.id} contract={contract} />
          ))}
        </div>
      )}
    </div>
  );
}
