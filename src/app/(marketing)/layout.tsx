"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFBFC]">
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          boxShadow: scrolled ? "0 1px 3px rgba(0,0,0,0.05)" : "0 0px 0px transparent",
        }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 w-full border-b border-slate-200/50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Logo variant="full" size="md" />

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">How it Works</a>
              <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Testimonials</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Pricing</a>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="hidden sm:block text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors">
                Sign In
              </Link>
              <Link href="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.04, boxShadow: "0 10px 20px -5px rgba(5,150,105,0.25)" }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  Get Started Free
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      <main className="flex-1">{children}</main>

      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="mb-6">
                <Logo variant="full" size="md" />
              </div>
              <p className="text-slate-400 max-w-sm text-base leading-relaxed">
                Protecting your business through intelligent legal analysis. ClauseGuard benchmarks and secures your contracts in seconds.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-slate-400">Product</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#testimonials" className="text-slate-400 hover:text-white transition-colors">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-slate-400">Legal</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">© {new Date().getFullYear()} ClauseGuard. All rights reserved.</p>
            <p className="text-slate-500 text-sm">Built with Next.js & AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}