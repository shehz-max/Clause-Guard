import { createClient } from "@/lib/supabase/server";
import { Settings, Database, Shield, Zap, RefreshCw } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const supabase = await createClient();

  const { count: kbCount } = await (supabase
    .from('knowledge_base') as any)
    .select('*', { count: 'exact', head: true });

  const { count: docCount } = await (supabase
    .from('documents') as any)
    .select('*', { count: 'exact', head: true });

  const { count: analysisCount } = await (supabase
    .from('analyses') as any)
    .select('*', { count: 'exact', head: true });

  const stats = [
    { label: "Knowledge Base Entries", value: kbCount || 0, icon: Database, color: "text-[#059669]" },
    { label: "Total Documents", value: docCount || 0, icon: Shield, color: "text-[#1E3A5F]" },
    { label: "Analysis Reports", value: analysisCount || 0, icon: Zap, color: "text-[#0F766E]" },
  ];

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1E293B] tracking-tight">Settings</h1>
          <p className="text-[#64748B] mt-1">Manage your system configuration</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-[#E2E8F0]">
              <div className={`w-10 h-10 bg-[#F1F5F9] ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-[#1E293B] mb-1">{stat.value}</div>
              <div className="text-sm text-[#64748B]">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-8 border border-[#E2E8F0]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-[#1E293B] mb-2">Knowledge Base Sync</h3>
              <p className="text-[#64748B] text-sm max-w-md mb-4">
                Sync the legal knowledge base with industry standards and best practices.
              </p>
              <div className="flex items-center gap-4 text-xs text-[#64748B]">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#059669]" /> Database Connected</span>
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#059669]" /> AI Ready</span>
              </div>
            </div>

            <form action="/api/knowledge-base/status" method="POST">
              <button 
                type="submit"
                className="bg-[#1E3A5F] hover:bg-[#152C4A] text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Sync Knowledge Base
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}