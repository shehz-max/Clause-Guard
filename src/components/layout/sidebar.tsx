"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Scale, FileText, UploadCloud, Hexagon, Settings } from "lucide-react";

const links = [
  { name: "Dashboard", href: "/", icon: Hexagon },
  { name: "Analyze", href: "/upload", icon: UploadCloud },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-full border-r border-border/30 bg-background/50 backdrop-blur-2xl flex-col hidden md:flex shrink-0">
      <div className="h-20 flex items-center px-6 border-b border-border/30 relative overflow-hidden">
        {/* Subtle glow behind logo */}
        <div className="absolute top-1/2 left-4 w-12 h-12 bg-primary/20 rounded-full blur-xl -translate-y-1/2 pointer-events-none" />
        
        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 mr-3 text-primary shadow-inner">
          <svg className="w-4 h-4 fill-primary/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <span className="font-heading font-bold text-lg tracking-tight text-foreground">
          ClauseGuard
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2 mt-4">Main Menu</div>
        {links.map((link) => {
          const active = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
          return (
            <Link key={link.name} href={link.href} className="block relative">
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <div className={`relative flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                <link.icon className={`w-4 h-4 mr-3 ${active ? "opacity-100" : "opacity-70"}`} />
                {link.name}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/30">
         <Link 
            href="/settings"
            className={`flex items-center px-4 py-2.5 text-sm transition-all rounded-xl relative ${
              pathname === "/settings" 
                ? "text-primary bg-primary/10 border border-primary/20 font-bold" 
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Settings className={`w-4 h-4 mr-3 ${pathname === "/settings" ? "opacity-100" : "opacity-70"}`} />
            System Settings
         </Link>
      </div>
    </div>
  );
}
