import { createClient } from "@/lib/supabase/server";
import { ContractCard, Contract } from "@/components/dashboard/contract-card";
import Link from "next/link";
import { Plus, FileText, Shield, Activity, AlertCircle, RefreshCw } from "lucide-react";
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
    throw error; // This will be caught by the error boundary
  }

  if (contracts.length === 0) {
    return (
      <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl">
        <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
          <FileText className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-2xl font-semibold text-slate-900 mb-3">No contracts yet</h3>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">Upload your first legal document to get started with AI-powered analysis.</p>
        <Link 
          href="/upload" 
          className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          Upload Contract
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
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
          <div className="flex items-center justify-between mb-5">
            <div className="w-12 h-12 rounded-xl bg-slate-100" />
            <div className="w-16 h-6 rounded-lg bg-slate-100" />
          </div>
          <div className="h-5 bg-slate-100 rounded-lg w-3/4 mb-3" />
          <div className="h-4 bg-slate-50 rounded-lg w-1/2" />
        </div>
      ))}
    </div>
  );
}

function ErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
        <AlertCircle className="w-7 h-7 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">Unable to Load Contracts</h3>
      <p className="text-slate-600 mb-6 max-w-sm mx-auto">
        {error.message?.includes('fetch') || error.message?.includes('network')
          ? 'Unable to connect to the database. Please check your internet connection.'
          : error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={retry}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium rounded-xl hover:shadow-lg transition-all"
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
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Contract Dashboard</h1>
              <p className="text-slate-500 mt-1">Manage and analyze your legal documents</p>
            </div>
            <Link 
              href="/upload" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all w-fit"
            >
              <Plus className="w-4 h-4" />
              New Analysis
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">-</div>
            <div className="text-sm text-slate-500 mt-1">Contracts uploaded</div>
          </div>

          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Analyzed</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">-</div>
            <div className="text-sm text-slate-500 mt-1">Completed analysis</div>
          </div>

          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Activity className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Processing</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">-</div>
            <div className="text-sm text-slate-500 mt-1">In progress</div>
          </div>

          <Link href="/upload" className="bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-2xl p-5 md:p-6 text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
            </div>
            <div className="text-lg font-bold">New Analysis</div>
            <div className="text-sm text-white/70 mt-1">Upload a contract</div>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Recent Contracts</h2>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
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