import { createClient } from "@/lib/supabase/server";
import { ContractCard, Contract } from "@/components/dashboard/contract-card";
import Link from "next/link";
import { Plus, FileText, Sparkles, TrendingUp, Shield, Activity } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: documents, error } = await (supabase
    .from('documents') as any)
    .select(`
      id, filename, status, created_at,
      analyses ( overall_risk_score, risk_level )
    `)
    .order('created_at', { ascending: false });

  const contracts = (documents as Contract[]) || [];

  const stats = [
    { label: "Total Contracts", value: contracts.length, icon: FileText, color: "text-emerald-400" },
    { label: "Analyzed", value: contracts.filter(c => c.status === 'analyzed').length, icon: Shield, color: "text-blue-400" },
    { label: "Processing", value: contracts.filter(c => c.status === 'processing').length, icon: Activity, color: "text-yellow-400" },
  ];

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Contract Dashboard</h1>
              <p className="text-muted-foreground text-sm">Monitor and manage your legal documents</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-6 hover:border-primary/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{contracts.length}</div>
            <div className="text-sm text-muted-foreground mt-1">Contracts uploaded</div>
          </div>

          <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-6 hover:border-primary/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Analyzed</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{contracts.filter(c => c.status === 'analyzed').length}</div>
            <div className="text-sm text-muted-foreground mt-1">Completed analysis</div>
          </div>

          <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-6 hover:border-primary/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Processing</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{contracts.filter(c => c.status === 'processing').length}</div>
            <div className="text-sm text-muted-foreground mt-1">In progress</div>
          </div>

          <Link href="/upload" className="bg-gradient-to-r from-primary to-primary/80 border border-primary/20 rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/20 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary-foreground" />
              </div>
              <TrendingUp className="w-5 h-5 text-primary-foreground/60 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-lg font-bold text-primary-foreground">New Analysis</div>
            <div className="text-sm text-primary-foreground/60 mt-1">Upload a contract</div>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Recent Contracts</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            All systems operational
          </div>
        </div>

        {error ? (
          <div className="p-8 bg-destructive/10 border border-destructive/20 rounded-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Activity className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Connection Error</h3>
            <p className="text-muted-foreground">Unable to load contracts. Please check your database connection.</p>
          </div>
        ) : contracts.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-card to-card/50 border border-dashed border-border/60 rounded-3xl">
            <div className="w-20 h-20 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <FileText className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-foreground">No contracts yet</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">Upload your first legal document to get started with AI-powered analysis.</p>
            <Link 
              href="/upload" 
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              Upload Contract
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}