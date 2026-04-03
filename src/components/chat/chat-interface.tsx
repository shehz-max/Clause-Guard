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

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full border border-border/40 rounded-2xl overflow-hidden bg-card/30 backdrop-blur-md shadow-2xl">
      <div className="bg-muted/30 border-b border-border/50 px-6 py-4 flex items-center justify-between">
         <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
               <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
               <h3 className="font-semibold text-foreground">ClauseGuard Copilot</h3>
               <p className="text-xs text-muted-foreground">Ask anything about this document</p>
            </div>
         </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
           <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-70">
              <Bot className="w-12 h-12 mb-4 drop-shadow-[0_0_15px_rgba(var(--primary),0.3)] text-primary/80" />
              <p>I&apos;ve read the contract. What would you like to know?</p>
              <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-lg">
                 <button onClick={() => handleInputChange({ target: { value: "What are the termination conditions?" } } as any)} className="px-4 py-2 bg-muted rounded-full text-xs hover:bg-muted/80 hover:text-foreground transition-colors border border-border/50">Terminations?</button>
                 <button onClick={() => handleInputChange({ target: { value: "Is there an exclusivity clause?" } } as any)} className="px-4 py-2 bg-muted rounded-full text-xs hover:bg-muted/80 hover:text-foreground transition-colors border border-border/50">Exclusivity?</button>
                 <button onClick={() => handleInputChange({ target: { value: "Summarize the payment terms." } } as any)} className="px-4 py-2 bg-muted rounded-full text-xs hover:bg-muted/80 hover:text-foreground transition-colors border border-border/50">Payment Terms?</button>
              </div>
           </div>
        ) : (
          messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[80%] rounded-2xl p-4 flex items-start shadow-sm ${
                 m.role === 'user' 
                   ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                   : 'bg-muted/50 text-foreground border border-border/50 rounded-tl-sm'
               }`}>
                  <div className="mr-3 shrink-0 mt-0.5">
                     {m.role === 'user' ? <User className="w-5 h-5 opacity-70" /> : <Bot className="w-5 h-5 text-primary" />}
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                    {/* Render citations specifically if available (e.g. [1]) */}
                    {m.content.split(/(\[\d+\])/g).map((part, i) => {
                       if (part.match(/\[\d+\]/)) {
                         return <span key={i} className="inline-flex items-center justify-center ml-1 px-1.5 py-0 bg-primary/20 hover:bg-primary/30 text-primary text-[10px] font-bold rounded cursor-help transition-colors border border-primary/20" title="Citation from contract">{part}</span>;
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
             <div className="bg-muted/30 border border-border/50 rounded-2xl rounded-tl-sm p-4 flex items-center shadow-inner">
                <Loader2 className="w-4 h-4 text-primary animate-spin mr-2" />
                <span className="text-sm text-primary animate-pulse font-medium">Analyzing context...</span>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-background/50 border-t border-border/50 px-6">
        <form onSubmit={handleSubmit} className="relative flex items-center">
           <input
             value={input}
             onChange={handleInputChange}
             placeholder="Message AI copilot..."
             className="w-full bg-muted/30 border border-border/60 rounded-full pl-5 pr-14 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-muted/50 transition-all placeholder:text-muted-foreground/60"
             disabled={isLoading}
           />
           <button 
             type="submit" 
             disabled={isLoading || !input.trim()}
             className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-all shadow-md active:scale-95"
           >
             <Send className="w-4 h-4 ml-[-2px]" />
           </button>
        </form>
      </div>
    </div>
  );
}
