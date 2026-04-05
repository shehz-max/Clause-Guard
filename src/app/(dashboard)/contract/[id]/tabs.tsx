"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SummaryPanel } from "@/components/analysis/summary-panel";
import { RiskTable } from "@/components/analysis/risk-table";
import { ClauseAccordion } from "@/components/analysis/clause-accordion";
import { ChatInterface } from "@/components/chat/chat-interface";
import { FileText, ShieldAlert, FileDigit, MessageSquare, Loader2 } from "lucide-react";

export function ContractTabs({ document, analysis }: { document: any, analysis: any }) {
  const [activeTab, setActiveTab] = useState("summary");

  const tabs = [
    { id: "summary", label: "Executive Summary", icon: FileText },
    { id: "risks", label: "Identified Risks", icon: ShieldAlert },
    { id: "clauses", label: "Clause Breakdown", icon: FileDigit },
    { id: "chat", label: "AI Co-Pilot", icon: MessageSquare },
  ];

  if (!analysis && activeTab !== "chat") {
    const isFailed = document.status === "failed";
    
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-0 bg-card/40 border border-border/50 rounded-2xl p-12 text-center">
        {isFailed ? (
          <>
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6 text-destructive ring-1 ring-destructive/20 shadow-lg shadow-destructive/5">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-foreground mb-2">Analysis Failed</h3>
            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
              We encountered an error while processing this contract. This can happen with highly complex formatting or encrypted files.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-8 px-6 py-2.5 bg-secondary text-secondary-foreground rounded-xl font-bold text-sm hover:bg-secondary/80 transition-all border border-border/40"
            >
              Retry Connection
            </button>
          </>
        ) : (
          <>
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-foreground">Analyzing Document...</h3>
            <p className="text-muted-foreground">The AI engine is currently processing this contract.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-card/40 border border-border/40 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl shadow-black/20">
      <div className="flex border-b border-border/40 bg-muted/20 px-2 pt-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center py-4 px-2 text-sm font-medium transition-all relative rounded-t-xl hover:bg-muted/80 ${
              activeTab === tab.id ? "text-primary bg-muted/40" : "text-muted-foreground"
            }`}
          >
            <tab.icon className={`w-4 h-4 mr-2 ${activeTab === tab.id ? "opacity-100" : "opacity-70"}`} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(var(--primary),0.5)]"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      
      <div className="flex-1 overflow-hidden relative bg-card/20">
         <AnimatePresence mode="wait">
           {activeTab === "summary" && (
             <motion.div key="summary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full overflow-y-auto p-8">
               <SummaryPanel analysis={analysis} />
             </motion.div>
           )}
           {activeTab === "risks" && (
             <motion.div key="risks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full overflow-y-auto p-8">
               <RiskTable risks={analysis?.risks || []} />
             </motion.div>
           )}
           {activeTab === "clauses" && (
             <motion.div key="clauses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full overflow-y-auto p-8">
               <ClauseAccordion 
                 clauses={analysis?.clause_analyses || []} 
                 comparisons={analysis?.best_practice_comparisons || []}
               />
             </motion.div>
           )}
           {activeTab === "chat" && (
             <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
               <ChatInterface documentId={document.id} />
             </motion.div>
           )}
         </AnimatePresence>
      </div>
    </div>
  );
}
