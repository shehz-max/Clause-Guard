"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Upload, Settings, Shield, Menu } from "lucide-react";
import { Logo } from "@/components/ui/logo";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Upload", href: "/upload", icon: Upload },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col shrink-0 hidden md:flex">
      <div className="p-6 border-b border-slate-100">
        <Logo variant="full" size="md" />
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">Menu</p>
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link key={link.name} href={link.href} className="block relative">
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-emerald-50 rounded-xl border border-emerald-200"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className={`relative flex items-center px-3 py-3 rounded-xl text-sm transition-colors ${active ? "text-emerald-700 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}>
                <link.icon className={`w-4 h-4 mr-3 ${active ? "text-emerald-600" : "text-slate-400"}`} />
                {link.name}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <Link 
          href="/settings"
          className={`flex items-center px-3 py-3 text-sm rounded-xl transition-all ${
            pathname === "/settings" 
              ? "bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200" 
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Settings className={`w-4 h-4 mr-3 ${pathname === "/settings" ? "text-emerald-600" : "text-slate-400"}`} />
          Settings
        </Link>
      </div>
    </div>
  );
}