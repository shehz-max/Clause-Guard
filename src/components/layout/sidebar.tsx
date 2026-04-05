"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Hexagon, UploadCloud, Settings } from "lucide-react";
import { LogoText } from "@/components/ui/logo";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: Hexagon },
  { name: "Analyze", href: "/upload", icon: UploadCloud },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-full border-r border-border/30 bg-background/50 backdrop-blur-2xl flex-col hidden md:flex shrink-0">
      <div className="h-20 flex items-center px-6 border-b border-border/30 relative">
        <LogoText />
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
