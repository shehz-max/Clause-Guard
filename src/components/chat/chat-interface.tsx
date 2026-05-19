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
    <div className="flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border/50">
      <div className="bg-gradient-to-r from-primary/10 to-transparent border-b border-border/50 px-6 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">ClauseGuard Copilot</h3>
          <p className="text-xs text-muted-foreground">Ask questions about this document</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-5 text-primary">
              <Bot className="w-8 h-8" />
            </div>
            <p className="text-muted-foreground mb-6">I&apos;ve analyzed your contract. Ask me anything about it.</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {suggestedQuestions.map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => handleInputChange({ target: { value: q } } as any)}
                  className="px-4 py-2 bg-muted/50 text-sm text-muted-foreground hover:text-foreground rounded-lg border border-border/30 hover:border-primary/30 transition-all"
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
                  ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground' 
                  : 'bg-muted/50 text-foreground border border-border/30'
              }`}>
                <div className={`shrink-0 mt-0.5 ${m.role === 'user' ? 'text-primary-foreground/70' : 'text-primary'}`}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {m.content.split(/(\[\d+\])/g).map((part, i) => {
                    if (part.match(/\[\d+\]/)) {
                      return <span key={i} className={`inline-flex items-center justify-center mx-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded ${
                        m.role === 'user' ? 'bg-primary-foreground/20' : 'bg-primary/20 text-primary'
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
            <div className="bg-muted/50 border border-border/30 rounded-2xl p-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">Analyzing...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-muted/20 border-t border-border/50">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about this contract..."
            className="flex-1 bg-background/50 border border-border/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-muted-foreground/40"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl flex items-center justify-center disabled:opacity-50 hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}