"use client";
import { useState } from "react";
import { Search, Bell, User, Menu, X, Hexagon, UploadCloud, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogoText } from "@/components/ui/logo";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: Hexagon },
    { name: "Analyze", href: "/upload", icon: UploadCloud },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      <header className="h-16 w-full border-b border-border/30 bg-background/50 backdrop-blur-2xl flex items-center justify-between px-4 sm:px-8 z-30 sticky top-0">
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground md:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-md hidden md:block group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" strokeWidth={2} />
            <input 
              type="text" 
              placeholder="Search documents, risks, or clauses..." 
              className="w-full bg-muted/20 border border-border/40 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 transition-all placeholder:text-muted-foreground/40 bg-zinc-900/10 dark:bg-white/5"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-5">
          <button className="relative p-2 text-muted-foreground/70 hover:text-foreground transition-all rounded-xl hover:bg-white/5 ring-1 ring-inset ring-transparent hover:ring-white/5 hidden sm:block">
            <Bell className="w-4.5 h-4.5" strokeWidth={2} />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
          </button>
          
          <div className="h-4 w-px bg-border/40 mx-1 hidden sm:block" />
          
          <div className="flex items-center gap-3 pl-1 group cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-foreground tracking-tight line-height-1">Umer Muhammad</p>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest opacity-60">Legal Admin</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-zinc-800 to-zinc-700 dark:from-zinc-100/10 dark:to-zinc-100/20 ring-1 ring-white/10 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105">
              <User className="w-4.5 h-4.5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] md:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="h-16 flex items-center justify-between px-6 border-b border-border/30">
                <LogoText />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-muted-foreground">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 p-6 space-y-4">
                {links.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link 
                      key={link.name} 
                      href={link.href} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all ${
                        active ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20" : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <link.icon className="w-6 h-6" />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-8 border-t border-border/30 text-center">
                <p className="text-sm text-muted-foreground mb-1 font-semibold">Umer Muhammad</p>
                <p className="text-xs text-muted-foreground/60 uppercase tracking-widest">Legal Admin</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
