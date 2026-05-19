"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Hexagon, UploadCloud, Settings, Shield } from "lucide-react";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: Hexagon },
  { name: "Upload", href: "/upload", icon: UploadCloud },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-card border-r border-border/50 flex flex-col shrink-0">
      <div className="p-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">ClauseGuard</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4 px-3">Navigation</div>
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link key={link.name} href={link.href} className="block relative">
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className={`relative flex items-center px-3 py-3 rounded-xl text-sm transition-colors ${active ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                <link.icon className={`w-4 h-4 mr-3 ${active ? "opacity-100" : "opacity-60"}`} />
                {link.name}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
         <Link 
            href="/settings"
            className={`flex items-center px-3 py-3 text-sm transition-all rounded-xl ${
              pathname === "/settings" 
                ? "text-primary bg-primary/10 font-semibold border border-primary/20" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Settings className={`w-4 h-4 mr-3 ${pathname === "/settings" ? "opacity-100" : "opacity-60"}`} />
            Settings
         </Link>
      </div>
    </div>
  );
}