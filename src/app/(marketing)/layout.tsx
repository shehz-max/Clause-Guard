"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogoText } from "@/components/ui/logo";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background relative selection:bg-primary/30">
      {/* Background ambient */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: scrolled ? "rgba(10,15,26,0.85)" : "rgba(10,15,26,0)",
          borderColor: scrolled ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
        }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 w-full border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <LogoText />
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
              <a href="#demo" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Live Demo</a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Log in
              </Link>
              <Link href="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all cursor-pointer"
                >
                  Get Started Free
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      <main className="flex-1">{children}</main>

      <footer className="bg-muted/20 border-t border-border/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <LogoText />
              <p className="mt-4 text-muted-foreground max-w-xs text-sm leading-relaxed">
                Protecting your business through intelligent legal analysis. ClauseGuard benchmarks and secures your contracts in seconds.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-muted-foreground/60">Product</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#demo" className="text-muted-foreground hover:text-primary transition-colors">Live Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-muted-foreground/60">Legal</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-xs">&copy; {new Date().getFullYear()} ClauseGuard by Muhammad Umer. All rights reserved.</p>
            <p className="text-muted-foreground text-xs">Built with ❤️ using Next.js & AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
