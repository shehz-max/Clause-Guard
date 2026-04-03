import { createClient } from "@/lib/supabase/server";
import { Settings, Database, Activity, RefreshCw, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const supabase = await createClient();

  // Get knowledge base stats
  const { count: kbCount } = await supabase
    .from('knowledge_base')
    .select('*', { count: 'exact', head: true });

  const { count: docCount } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true });

  const { count: analysisCount } = await supabase
    .from('analyses')
    .select('*', { count: 'exact', head: true });

  const stats = [
    { label: "Vectorized Clauses", value: kbCount || 0, icon: Database, color: "text-primary", description: "Standard clauses for RAG analysis" },
    { label: "Analyzed Documents", value: docCount || 0, icon: ShieldCheck, color: "text-emerald-500", description: "Total legal contracts processed" },
    { label: "Intelligence Reports", value: analysisCount || 0, icon: Zap, color: "text-yellow-500", description: "Generated AI risk assessments" },
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="mb-10 flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary ring-1 ring-primary/20">
          <Settings className="w-6 h-6" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">System Settings</h1>
          <p className="text-muted-foreground">Manage your AI intelligence engine and database health.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="p-8 bg-card border border-border/30 rounded-3xl shadow-xl shadow-black/20 group hover:border-primary/20 transition-all">
            <div className={`w-12 h-12 ${stat.color} bg-current/10 rounded-2xl flex items-center justify-center mb-6 border border-current/10`}>
              <stat.icon className="w-6 h-6" strokeWidth={2} />
            </div>
            <div className="text-4xl font-heading font-bold mb-1 text-foreground">{stat.value}</div>
            <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3 opacity-60">{stat.label}</div>
            <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">{stat.description}</p>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary" />
          Engine Health & Synchronization
        </h2>

        <div className="bg-card border border-border/30 rounded-[2rem] p-8 shadow-2xl shadow-black/40 relative overflow-hidden isolate">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none -z-10" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-xl font-heading font-bold mb-3">Knowledge Base Sync</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The ClauseGuard engine relies on a vectorized dataset of standard industry practices. 
                If you update the local legal definitions or want to refresh the Vector DB, trigger a full re-sync.
              </p>
              <div className="flex items-center gap-4 text-sm font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Database Connected</span>
                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Gemini-Pro Ready</span>
              </div>
            </div>

            <form action="/api/knowledge-base/status" method="POST">
              <button 
                type="submit"
                className="bg-primary text-primary-foreground font-bold px-8 py-4 rounded-2xl flex items-center gap-3 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30 active:scale-95 whitespace-nowrap"
              >
                <RefreshCw className="w-5 h-5" />
                Force Engine Sync
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
