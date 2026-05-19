"use client";

import { useChat } from "ai/react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

export function ChatInterface({ documentId }: { documentId: string }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: { documentId }
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const suggestedQuestions = [
    "What are the termination conditions?",
    "Is there an exclusivity clause?",
    "Summarize the payment terms."
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">ClauseGuard Copilot</h3>
          <p className="text-xs text-slate-500">Ask questions about this document</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mb-5 text-emerald-600">
              <Bot className="w-8 h-8" />
            </div>
            <p className="text-slate-600 mb-6">I&apos;ve analyzed your contract. Ask me anything about it.</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {suggestedQuestions.map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => handleInputChange({ target: { value: q } } as any)}
                  className="px-4 py-2 bg-white text-sm text-slate-600 hover:text-emerald-600 rounded-lg border border-slate-200 hover:border-emerald-300 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 flex items-start gap-3 ${
                m.role === 'user' 
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white' 
                  : 'bg-white text-slate-800 border border-slate-200'
              }`}>
                <div className={`shrink-0 mt-0.5 ${m.role === 'user' ? 'text-white/70' : 'text-emerald-600'}`}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {m.content.split(/(\[\d+\])/g).map((part, i) => {
                    if (part.match(/\[\d+\]/)) {
                      return <span key={i} className={`inline-flex items-center justify-center mx-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded ${
                        m.role === 'user' ? 'bg-white/20' : 'bg-emerald-100 text-emerald-700'
                      }`}>{part}</span>;
                    }
                    return <span key={i}>{part}</span>;
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
              <span className="text-sm text-slate-500">Analyzing...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about this contract..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all placeholder:text-slate-400"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl flex items-center justify-center disabled:opacity-50 hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}