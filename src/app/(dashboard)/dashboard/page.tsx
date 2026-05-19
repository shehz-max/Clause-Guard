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
      <div className="text-center py-20 bg-white rounded-2xl border border-[#E2E8F0]">
        <div className="w-20 h-20 bg-[#F8FAFC] rounded-xl flex items-center justify-center mx-auto mb-6">
          <FileText className="w-10 h-10 text-[#94A3B8]" />
        </div>
        <h3 className="text-2xl font-semibold text-[#1E293B] mb-3">No contracts yet</h3>
        <p className="text-[#64748B] mb-8 max-w-md mx-auto">Upload your first legal document to get started with AI-powered analysis.</p>
        <Link 
          href="/upload" 
          className="inline-flex items-center gap-2 bg-[#1E3A5F] hover:bg-[#152C4A] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
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
        <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-6 animate-pulse">
          <div className="flex items-center justify-between mb-5">
            <div className="w-12 h-12 bg-[#F1F5F9] rounded-lg" />
            <div className="w-16 h-6 bg-[#F1F5F9] rounded-lg" />
          </div>
          <div className="h-5 bg-[#F1F5F9] rounded-lg w-3/4 mb-3" />
          <div className="h-4 bg-[#F1F5F9] rounded-lg w-1/2" />
        </div>
      ))}
    </div>
  );
}

function ErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-[#E11D48] p-8 text-center">
      <div className="w-14 h-14 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-5">
        <AlertCircle className="w-7 h-7 text-[#E11D48]" />
      </div>
      <h3 className="text-lg font-semibold text-[#1E293B] mb-2">Unable to Load Contracts</h3>
      <p className="text-[#64748B] mb-6 max-w-sm mx-auto">
        {error.message?.includes('fetch') || error.message?.includes('network')
          ? 'Unable to connect to the database. Please check your internet connection.'
          : error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={retry}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E3A5F] text-white font-medium rounded-lg hover:bg-[#152C4A] transition-colors"
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
              <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B] tracking-tight">Contract Dashboard</h1>
              <p className="text-[#64748B] mt-1">Manage and analyze your legal documents</p>
            </div>
            <Link 
              href="/upload" 
              className="inline-flex items-center gap-2 bg-[#1E3A5F] hover:bg-[#152C4A] text-white font-semibold px-5 py-3 rounded-lg transition-colors w-fit"
            >
              <Sparkles className="w-4 h-4" />
              New Analysis
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          <div className="bg-white rounded-xl p-5 md:p-6 border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-[#F1F5F9] rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#1E3A5F]" />
              </div>
              <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Total</span>
            </div>
            <div className="text-3xl font-bold text-[#1E293B]">-</div>
            <div className="text-sm text-[#64748B] mt-1">Contracts uploaded</div>
          </div>

          <div className="bg-white rounded-xl p-5 md:p-6 border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#059669]" />
              </div>
              <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Analyzed</span>
            </div>
            <div className="text-3xl font-bold text-[#1E293B]">-</div>
            <div className="text-sm text-[#64748B] mt-1">Completed analysis</div>
          </div>

          <div className="bg-white rounded-xl p-5 md:p-6 border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#D97706]" />
              </div>
              <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Processing</span>
            </div>
            <div className="text-3xl font-bold text-[#1E293B]">-</div>
            <div className="text-sm text-[#64748B] mt-1">In progress</div>
          </div>

          <Link href="/upload" className="bg-[#0F766E] hover:bg-[#0D9488] rounded-xl p-5 md:p-6 text-white transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
            </div>
            <div className="text-lg font-bold">New Analysis</div>
            <div className="text-sm text-white/70 mt-1">Upload a contract</div>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#1E293B]">Recent Contracts</h2>
          <div className="flex items-center gap-2 text-sm text-[#64748B]">
            <div className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
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