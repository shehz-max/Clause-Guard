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
    { label: "Knowledge Base Entries", value: kbCount || 0, icon: Database, color: "text-emerald-600" },
    { label: "Total Documents", value: docCount || 0, icon: Shield, color: "text-blue-600" },
    { label: "Analysis Reports", value: analysisCount || 0, icon: Zap, color: "text-purple-600" },
  ];

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your system configuration</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className={`w-10 h-10 rounded-xl ${stat.color} bg-current/10 flex items-center justify-center mb-4 border border-current/10`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Knowledge Base Sync</h3>
              <p className="text-slate-500 text-sm max-w-md mb-4">
                Sync the legal knowledge base with industry standards and best practices.
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Database Connected</span>
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> AI Ready</span>
              </div>
            </div>

            <form action="/api/knowledge-base/status" method="POST">
              <button 
                type="submit"
                className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
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