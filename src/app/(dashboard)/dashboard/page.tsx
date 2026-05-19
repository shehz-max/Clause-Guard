import { createClient } from "@/lib/supabase/server";
import { ContractCard, Contract } from "@/components/dashboard/contract-card";
import Link from "next/link";
import { Plus, FileText, Shield, Activity, AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

async function ContractList({ retryKey }: { retryKey: number }) {
  const supabase = await createClient();
  
  const { data: documents, error } = await (supabase
    .from('documents') as any)
    .select(`
      id, filename, status, created_at,
      analyses ( overall_risk_score, risk_level )
    `)
    .order('created_at', { ascending: false });

  const contracts = (documents as Contract[]) || [];

  if (error) {
    throw error;
  }

  if (contracts.length === 0) {
    return (
      <div className="text-center py-20 glass-strong rounded-3xl border border-white/5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
          <FileText className="w-10 h-10 text-indigo-400" />
        </div>
        <h3 className="text-2xl font-semibold text-white mb-3">No contracts yet</h3>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">Upload your first legal document to get started with AI-powered analysis.</p>
        <Link 
          href="/upload" 
          className="group relative inline-flex items-center gap-2"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg">
            <Plus className="w-4 h-4 inline mr-2" />
            Upload Contract
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {contracts.map((contract) => (
        <ContractCard key={contract.id} contract={contract} />
      ))}
    </div>
  );
}

function LoadingContractList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass rounded-2xl p-6 border border-white/5 animate-pulse">
          <div className="flex items-center justify-between mb-5">
            <div className="w-12 h-12 rounded-xl bg-white/5" />
            <div className="w-16 h-6 rounded-lg bg-white/5" />
          </div>
          <div className="h-5 bg-white/5 rounded-lg w-3/4 mb-3" />
          <div className="h-4 bg-white/5 rounded-lg w-1/2" />
        </div>
      ))}
    </div>
  );
}

function ErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="glass-strong rounded-2xl p-8 border border-red-500/20 text-center">
      <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-5">
        <AlertCircle className="w-7 h-7 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Unable to Load Contracts</h3>
      <p className="text-slate-400 mb-6 max-w-sm mx-auto">
        {error.message?.includes('fetch') || error.message?.includes('network')
          ? 'Unable to connect to the database. Please check your internet connection.'
          : error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={retry}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg transition-all"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}

export default async function DashboardPage() {
  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Contract Dashboard</h1>
              <p className="text-slate-400 mt-1">Manage and analyze your legal documents</p>
            </div>
            <Link 
              href="/upload" 
              className="group relative inline-flex items-center gap-2 w-fit"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                New Analysis
              </div>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          <div className="glass rounded-2xl p-5 md:p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</span>
            </div>
            <div className="text-3xl font-bold text-white">-</div>
            <div className="text-sm text-slate-500 mt-1">Contracts uploaded</div>
          </div>

          <div className="glass rounded-2xl p-5 md:p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Analyzed</span>
            </div>
            <div className="text-3xl font-bold text-white">-</div>
            <div className="text-sm text-slate-500 mt-1">Completed analysis</div>
          </div>

          <div className="glass rounded-2xl p-5 md:p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Processing</span>
            </div>
            <div className="text-3xl font-bold text-white">-</div>
            <div className="text-sm text-slate-500 mt-1">In progress</div>
          </div>

          <Link href="/upload" className="group relative bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl p-5 md:p-6 border border-indigo-500/30 hover:border-indigo-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Plus className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-lg font-bold text-white">New Analysis</div>
            <div className="text-sm text-slate-400 mt-1">Upload a contract</div>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Contracts</h2>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            All systems operational
          </div>
        </div>

        <Suspense fallback={<LoadingContractList />}>
          <ContractList retryKey={0} />
        </Suspense>
      </div>
    </div>
  );
}