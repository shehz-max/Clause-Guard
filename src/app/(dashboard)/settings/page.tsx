import { createClient } from "@/lib/supabase/server";
import { Settings, Database, Activity, RefreshCw, ShieldCheck, Zap } from "lucide-react";

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
    { label: "Knowledge Base Entries", value: kbCount || 0, icon: Database, color: "text-primary" },
    { label: "Total Documents", value: docCount || 0, icon: ShieldCheck, color: "text-emerald-500" },
    { label: "Analysis Reports", value: analysisCount || 0, icon: Zap, color: "text-yellow-500" },
  ];

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground">Manage your system configuration</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 bg-card border border-border/50 rounded-2xl">
              <div className={`w-10 h-10 ${stat.color} bg-current/10 rounded-xl flex items-center justify-center mb-4 border border-current/10`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="p-8 bg-card border border-border/50 rounded-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Knowledge Base Sync</h3>
              <p className="text-muted-foreground text-sm max-w-md mb-4">
                Sync the legal knowledge base with industry standards and best practices.
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Database Connected</span>
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> AI Ready</span>
              </div>
            </div>

            <form action="/api/knowledge-base/status" method="POST">
              <button 
                type="submit"
                className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all"
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