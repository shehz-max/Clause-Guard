"use client";
import { useState } from "react";
import { Search, User, Menu, X, Hexagon, UploadCloud, Settings, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: Hexagon },
    { name: "Upload", href: "/upload", icon: UploadCloud },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      <header className="h-16 bg-card/50 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-6 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-muted-foreground hover:text-foreground lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative w-full max-w-md hidden md:block group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" strokeWidth={2} />
            <input 
              type="text" 
              placeholder="Search documents, risks, or clauses..." 
              className="w-full bg-muted/30 border border-border/40 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-muted-foreground/40"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2.5 text-muted-foreground/60 hover:text-foreground transition-colors rounded-xl hover:bg-muted/50">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
          </button>
          
          <div className="h-6 w-px bg-border/40 hidden sm:block" />
          
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-foreground">Umer Muhammad</p>
              <p className="text-xs text-muted-foreground">Legal Admin</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-y-0 left-0 w-72 bg-card border-r border-border/50 z-[100] lg:hidden"
          >
            <div className="h-16 flex items-center justify-between px-6 border-b border-border/50">
              <span className="text-lg font-bold text-foreground">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-6 space-y-2">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${
                      active ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-6 border-t border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Umer Muhammad</p>
                  <p className="text-xs text-muted-foreground">Legal Admin</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-[99] lg:hidden"
        />
      )}
    </>
  );
}