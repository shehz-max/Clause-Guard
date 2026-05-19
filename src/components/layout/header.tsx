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
      <header className="h-16 bg-[#121218] border-b border-white/5 flex items-center justify-between px-4 md:px-6 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-400 hover:text-white md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search contracts..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 transition-all placeholder:text-slate-500 text-white"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-5">
          <button className="relative p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full" />
          </button>
          
          <div className="h-6 w-px bg-white/10 hidden sm:block" />
          
          <div 
            className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors"
            onClick={handleSignOut}
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-white">{userName}</p>
              <p className="text-xs text-slate-500">{userEmail}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
              <User className="w-4 h-4" />
            </div>
            <button className="p-2 text-slate-400 hover:text-white" title="Sign out">
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
              className="fixed inset-0 bg-black/60 z-[99] md:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#121218] z-[100] md:hidden shadow-2xl border-r border-white/5"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
                <Logo variant="full" size="sm" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400">
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
                        active 
                          ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-white border border-indigo-500/20" 
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-6 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{userName}</p>
                      <p className="text-xs text-slate-500">{userEmail}</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"
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