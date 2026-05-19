"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Upload, Settings, Menu } from "lucide-react";
import { Logo } from "@/components/ui/logo";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Upload", href: "/upload", icon: Upload },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-white border-r border-[#E2E8F0] flex flex-col shrink-0 hidden md:flex">
      <div className="p-6 border-b border-[#F1F5F9]">
        <Logo variant="full" size="md" />
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-4 px-3">Menu</p>
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link key={link.name} href={link.href} className="block relative">
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-[#CCFBF1] rounded-lg"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className={`relative flex items-center px-3 py-3 rounded-lg text-sm transition-colors ${active ? "text-[#0F766E] font-semibold" : "text-[#64748B] hover:text-[#1E3A5F] hover:bg-[#F8FAFC]"}`}>
                <link.icon className={`w-4 h-4 mr-3 ${active ? "text-[#0F766E]" : "text-[#94A3B8]"}`} />
                {link.name}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#F1F5F9]">
        <Link 
          href="/settings"
          className={`flex items-center px-3 py-3 text-sm rounded-lg transition-colors ${
            pathname === "/settings" 
              ? "bg-[#CCFBF1] text-[#0F766E] font-semibold" 
              : "text-[#64748B] hover:text-[#1E3A5F] hover:bg-[#F8FAFC]"
          }`}
        >
          <Settings className={`w-4 h-4 mr-3 ${pathname === "/settings" ? "text-[#0F766E]" : "text-[#94A3B8]"}`} />
          Settings
        </Link>
      </div>
    </div>
  );
}