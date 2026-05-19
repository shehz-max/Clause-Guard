"use client";
import { useState } from "react";
import { Search, User, Menu, X, LayoutDashboard, Upload, Settings, Bell, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/components/providers/auth-provider";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Upload", href: "/upload", icon: Upload },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';

  return (
    <>
      <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-[#64748B] hover:text-[#1E3A5F] md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input 
              type="text" 
              placeholder="Search contracts..." 
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1] transition-colors placeholder:text-[#94A3B8] text-[#1E293B]"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-5">
          <button className="relative p-2.5 text-[#64748B] hover:text-[#1E3A5F] hover:bg-[#F8FAFC] rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#0F766E] rounded-full" />
          </button>
          
          <div className="h-6 w-px bg-[#E2E8F0] hidden sm:block" />
          
          <div 
            className="flex items-center gap-3 cursor-pointer hover:bg-[#F8FAFC] p-2 rounded-lg transition-colors"
            onClick={handleSignOut}
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-[#1E293B]">{userName}</p>
              <p className="text-xs text-[#64748B]">{userEmail}</p>
            </div>
            <div className="w-9 h-9 bg-[#1E3A5F] rounded-lg flex items-center justify-center text-white">
              <User className="w-4 h-4" />
            </div>
            <button className="p-2 text-[#94A3B8] hover:text-[#1E3A5F]" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 z-[99] md:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-[100] md:hidden shadow-xl border-r border-[#E2E8F0]"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-[#F1F5F9]">
                <Logo variant="full" size="sm" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-[#64748B]">
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
                      className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${
                        active 
                          ? "bg-[#CCFBF1] text-[#0F766E] font-semibold" 
                          : "text-[#64748B] hover:text-[#1E3A5F] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-6 border-t border-[#F1F5F9]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1E3A5F] rounded-lg flex items-center justify-center text-white">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1E293B]">{userName}</p>
                      <p className="text-xs text-[#64748B]">{userEmail}</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="p-2 text-[#94A3B8] hover:text-[#1E3A5F] hover:bg-[#F8FAFC] rounded-lg"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}