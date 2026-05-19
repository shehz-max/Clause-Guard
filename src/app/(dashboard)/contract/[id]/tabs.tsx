"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SummaryPanel } from "@/components/analysis/summary-panel";
import { RiskTable } from "@/components/analysis/risk-table";
import { ClauseAccordion } from "@/components/analysis/clause-accordion";
import { ChatInterface } from "@/components/chat/chat-interface";
import { FileText, ShieldAlert, FileDigit, MessageSquare, Loader2, RefreshCw } from "lucide-react";

export function ContractTabs({ document, analysis }: { document: any, analysis: any }) {
  const [activeTab, setActiveTab] = useState("summary");

  const tabs = [
    { id: "summary", label: "Summary", icon: FileText },
    { id: "risks", label: "Risks", icon: ShieldAlert },
    { id: "clauses", label: "Clauses", icon: FileDigit },
    { id: "chat", label: "AI Chat", icon: MessageSquare },
  ];

  if (!analysis && activeTab !== "chat") {
    const isFailed = document.status === "error";
    
    return (
      <div className="bg-card border border-border/50 rounded-2xl p-12 text-center">
        {isFailed ? (
          <>
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-5 text-red-500">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Analysis Failed</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              {document.error_message || "We encountered an error while processing this contract."}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-muted text-muted-foreground font-medium text-sm rounded-xl hover:bg-muted/80 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="px-5 py-2.5 bg-primary text-primary-foreground font-medium text-sm rounded-xl hover:bg-primary/90 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-1">Analyzing Document...</h3>
              <p className="text-muted-foreground">Our AI is scanning and analyzing your contract</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
      <div className="flex border-b border-border/50 bg-muted/20 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-all relative ${
              activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      
      <div className="min-h-[500px]">
         <AnimatePresence mode="wait">
           {activeTab === "summary" && (
             <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
               <SummaryPanel analysis={analysis} />
             </motion.div>
           )}
           {activeTab === "risks" && (
             <motion.div key="risks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
               <RiskTable risks={analysis?.risks || []} />
             </motion.div>
           )}
           {activeTab === "clauses" && (
             <motion.div key="clauses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
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