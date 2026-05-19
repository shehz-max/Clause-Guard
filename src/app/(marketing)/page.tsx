"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';
import {
  Shield, Search, Zap, CheckCircle, FileCheck, ShieldAlert,
  ArrowRight, ChevronDown, Sparkles, Lock, FileText, Brain, 
  BarChart3, Clock, Check, Menu, X, Play, Users, Star, Award,
  TrendingUp, Target, BookOpen, MessageSquare, Download, ChevronRight,
  Zap as ZapIcon, Layers, Fingerprint, LineChart
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const FEATURES = [
  { icon: Shield, title: "AI Risk Detection", desc: "Advanced neural networks analyze every clause for potential risks and vulnerabilities." },
  { icon: Search, title: "Deep Clause Analysis", desc: "Break down complex legal language into clear, understandable insights." },
  { icon: ZapIcon, title: "Instant Processing", desc: "Get comprehensive analysis in under 3 seconds with our optimized AI pipeline." },
  { icon: Lock, title: "Bank-Grade Security", desc: "End-to-end encryption ensures your sensitive documents remain protected." },
  { icon: BarChart3, title: "Risk Scoring", desc: "0-100 risk scores based on clause severity and industry benchmarks." },
  { icon: Layers, title: "Clause Benchmarking", desc: "Compare against thousands of standard templates and best practices." }
];

const HOW_IT_WORKS = [
  { step: "01", icon: FileText, title: "Upload Contract", desc: "Drag and drop PDF or DOCX files with automatic format detection." },
  { step: "02", icon: Brain, title: "AI Analysis", desc: "Our neural engine reads every clause, identifies risks, and benchmarks." },
  { step: "03", icon: ShieldAlert, title: "Get Report", desc: "Receive comprehensive risk report with actionable recommendations." }
];

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "General Counsel", company: "TechVentures Inc.", text: "ClauseGuard saved our legal team 20+ hours per week on contract reviews. The AI precision is remarkable.", avatar: "SC" },
  { name: "Michael Ross", role: "Partner", company: "Ross & Associates", text: "The risk scoring is incredibly accurate. It's like having an extra associate who never sleeps.", avatar: "MR" },
  { name: "Emily Watson", role: "CEO", company: "StartupFlow", text: "We now review every vendor contract in minutes, not days. This is a game changer.", avatar: "EW" }
];

const PRICING = [
  {
    name: "Starter", price: "0", period: "forever",
    desc: "Perfect for individuals exploring AI contract analysis.",
    features: ["5 analyses/month", "Basic risk scoring", "PDF support", "Email support"],
    cta: "Get Started Free", highlight: false
  },
  {
    name: "Professional", price: "29", period: "per month",
    desc: "For legal professionals who need deeper insights.",
    features: ["Unlimited analyses", "Advanced benchmarking", "AI copilot chat", "Priority processing", "Export reports"],
    cta: "Start 14-day Trial", highlight: true
  },
  {
    name: "Enterprise", price: "Custom", period: "contact us",
    desc: "For teams and firms with advanced requirements.",
    features: ["Everything in Pro", "Custom integrations", "Team management", "SLA guarantee", "Dedicated support"],
    cta: "Contact Sales", highlight: false
  }
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2500;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[128px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-pink-500/10 to-indigo-500/10 rounded-full blur-[128px]" />
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800) 
          }}
          animate={{ 
            y: [null, Math.random() * -200 - 100],
            opacity: [0, 0.5, 0]
          }}
          transition={{ 
            duration: Math.random() * 10 + 10, 
            repeat: Infinity,
            delay: Math.random() * 5
          }}
          className="absolute w-1 h-1 bg-indigo-400/50 rounded-full"
        />
      ))}
    </div>
  );
}

function NeuralNetworkVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="relative w-full h-full"
    >
      <svg viewBox="0 0 400 400" className="w-full h-full">
        <defs>
          <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Connection lines */}
        <g opacity="0.3">
          <motion.line x1="200" y1="80" x2="100" y2="200" stroke="url(#nodeGradient)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }} />
          <motion.line x1="200" y1="80" x2="200" y2="200" stroke="url(#nodeGradient)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.7 }} />
          <motion.line x1="200" y1="80" x2="300" y2="200" stroke="url(#nodeGradient)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.9 }} />
          
          <motion.line x1="100" y1="200" x2="200" y2="320" stroke="url(#nodeGradient)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1.1 }} />
          <motion.line x1="200" y1="200" x2="200" y2="320" stroke="url(#nodeGradient)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1.3 }} />
          <motion.line x1="300" y1="200" x2="200" y2="320" stroke="url(#nodeGradient)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1.5 }} />
          
          <motion.line x1="100" y1="200" x2="300" y2="200" stroke="url(#nodeGradient)" strokeWidth="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1.7 }} />
        </g>
        
        {/* Input layer */}
        <g filter="url(#nodeGlow)">
          <motion.circle cx="200" cy="80" r="12" fill="url(#nodeGradient)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }} />
          <motion.circle cx="100" cy="200" r="10" fill="url(#nodeGradient)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }} />
          <motion.circle cx="300" cy="200" r="10" fill="url(#nodeGradient)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: 'spring' }} />
        </g>
        
        {/* Hidden layer */}
        <g filter="url(#nodeGlow)">
          <motion.circle cx="200" cy="200" r="14" fill="url(#nodeGradient)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7, type: 'spring' }} />
        </g>
        
        {/* Output layer */}
        <g filter="url(#nodeGlow)">
          <motion.circle cx="200" cy="320" r="16" fill="url(#nodeGradient)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9, type: 'spring' }} />
        </g>
        
        {/* Pulse animation on nodes */}
        <circle cx="200" cy="80" r="12" fill="none" stroke="#818CF8" strokeWidth="2" opacity="0.5">
          <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="320" r="16" fill="none" stroke="#F472B6" strokeWidth="2" opacity="0.5">
          <animate attributeName="r" values="16;26;16" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    </motion.div>
  );
}

function AnalysisPreview() {
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => setStep(s => (s + 1) % 4), 3000);
    return () => clearInterval(interval);
  }, []);

  const risks = [
    { text: "Unlimited liability — Sec 4.2", color: "bg-red-500" },
    { text: "Non-compete: 5 years", color: "bg-amber-500" },
    { text: "Auto-renewal clause", color: "bg-amber-500" },
    { text: "Payment terms: standard", color: "bg-emerald-500" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      viewport={{ once: true }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl" />
      
      <div className="relative glass-strong rounded-3xl p-8 border border-white/10 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg glow">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">vendor_agreement_2024.pdf</h3>
            <p className="text-slate-400 text-sm">14 pages · Analyzed just now</p>
          </div>
        </div>

        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Risk Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">34</span>
              <span className="text-slate-500 text-lg">/100</span>
            </div>
          </div>
          <div className="px-4 py-2 bg-red-500/20 text-red-400 rounded-full text-sm font-bold flex items-center gap-2 border border-red-500/30">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            HIGH RISK
          </div>
        </div>

        <div className="w-full h-3 bg-slate-800/50 rounded-full mb-6 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "34%" }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full"
          />
        </div>

        <div className="space-y-3">
          {risks.map((risk, i) => (
            <motion.div
              key={i}
              animate={{ opacity: step >= i ? 1 : 0.4, x: step >= i ? 0 : -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5"
            >
              <div className={`w-3 h-3 rounded-full ${risk.color}`} />
              <span className="text-slate-300 font-medium text-sm">{risk.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative glass rounded-2xl p-8 border border-white/5 hover:border-indigo-500/30 transition-all duration-300">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-300">
          <feature.icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
        <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
      </div>
    </motion.div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: typeof TESTIMONIALS[0] }) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative glass rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all">
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-pink-400 text-pink-400" />
          ))}
        </div>
        <p className="text-slate-300 leading-relaxed mb-6 text-lg">"{testimonial.text}"</p>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
            {testimonial.avatar}
          </div>
          <div>
            <p className="font-semibold text-white">{testimonial.name}</p>
            <p className="text-slate-400 text-sm">{testimonial.role}, {testimonial.company}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Logo variant="full" size="md" />
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-slate-400 hover:text-white transition-colors font-medium text-sm">Features</a>
          <a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors font-medium text-sm">How it Works</a>
          <a href="#testimonials" className="text-slate-400 hover:text-white transition-colors font-medium text-sm">Testimonials</a>
          <a href="#pricing" className="text-slate-400 hover:text-white transition-colors font-medium text-sm">Pricing</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors font-medium text-sm">
            Sign In
          </Link>
          <Link href="/dashboard" className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg">
              Get Started Free
            </div>
          </Link>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-white">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/5"
          >
            <div className="px-6 py-6 space-y-4">
              <a href="#features" className="block text-slate-300 py-2 font-medium">Features</a>
              <a href="#how-it-works" className="block text-slate-300 py-2 font-medium">How it Works</a>
              <a href="#testimonials" className="block text-slate-300 py-2 font-medium">Testimonials</a>
              <a href="#pricing" className="block text-slate-300 py-2 font-medium">Pricing</a>
              <div className="pt-4 flex flex-col gap-3">
                <Link href="/dashboard" className="text-center text-slate-300 py-3 font-medium">Sign In</Link>
                <Link href="/dashboard" className="text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold">Get Started Free</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-x-hidden">
      <Navigation />
      <FloatingOrbs />

      <section ref={heroRef} className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold mb-8">
                <Sparkles className="w-4 h-4" />
                Powered by Advanced AI
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
                Secure Your Contracts with
                <span className="block text-gradient-animated">
                  AI Intelligence
                </span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-xl text-slate-400 leading-relaxed max-w-xl mb-10">
                Upload any legal agreement and get instant risk scores, plain-English summaries, and clause benchmarking — all in under 3 seconds.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/dashboard">
                  <motion.div
                    whileHover={{ scale: 1.03, boxShadow: "0 20px 40px -10px rgba(99, 102, 241, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative inline-flex items-center justify-center gap-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg">
                      Start Analyzing Free
                      <ArrowRight className="inline w-5 h-5 ml-2" />
                    </div>
                  </motion.div>
                </Link>
                <a href="#how-it-works">
                  <motion.div
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 glass text-white px-8 py-4 rounded-2xl font-bold text-lg border border-white/10 hover:border-white/20 transition-all"
                  >
                    <Play className="w-5 h-5" /> See How It Works
                  </motion.div>
                </a>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {["S", "M", "E", "A", "J"].map((l, i) => (
                    <motion.div 
                      key={i} 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm border-2 border-black shadow-lg"
                      whileHover={{ y: -5 }}
                    >
                      {l}
                    </motion.div>
                  ))}
                </div>
                <p className="text-slate-400"><span className="font-bold text-white">500+</span> legal teams trust ClauseGuard</p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="hidden lg:flex justify-center items-center"
            >
              <NeuralNetworkVisual />
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 12, 0] }} 
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
        >
          <span className="text-xs font-medium mb-2">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <AnimatedCounter target={500} suffix="+" />
              <p className="text-slate-400 font-medium mt-2">Legal Teams</p>
            </div>
            <div>
              <AnimatedCounter target={98} suffix="%" />
              <p className="text-slate-400 font-medium mt-2">Accuracy Rate</p>
            </div>
            <div>
              <AnimatedCounter target={3} suffix="s" />
              <p className="text-slate-400 font-medium mt-2">Avg. Analysis Time</p>
            </div>
            <div>
              <AnimatedCounter target={12000} suffix="+" />
              <p className="text-slate-400 font-medium mt-2">Contracts Analyzed</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-16">
            <motion.span variants={fadeInUp} className="inline-block text-indigo-400 font-bold uppercase tracking-widest text-sm mb-4">Features</motion.span>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Everything You Need for<br />
              <span className="text-gradient-animated">Contract Analysis</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-slate-400 max-w-2xl mx-auto">
              Our AI-powered platform handles the heavy lifting so you can focus on what matters.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={i} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-32 relative">
        <div className="container mx-auto px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-20">
            <motion.span variants={fadeInUp} className="inline-block text-indigo-400 font-bold uppercase tracking-widest text-sm mb-4">Process</motion.span>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              How It Works
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-slate-400 max-w-xl mx-auto">
              Three simple steps to transform your contract review process.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.7 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-2xl font-black flex items-center justify-center mx-auto mb-6 shadow-lg glow">
                  {step.step}
                </div>
                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <step.icon className="w-7 h-7 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-28 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-indigo-500/30 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-indigo-400 font-bold uppercase tracking-widest text-sm mb-4">Live Preview</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                See Your Contract<br />
                <span className="text-gradient-animated">Risks Instantly</span>
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed mb-8">
                Our AI analyzes every clause, identifies potential risks, and provides actionable recommendations — all in seconds.
              </p>
              <ul className="space-y-4 mb-8">
                {["Automated risk scoring (0-100)", "Plain English clause translations", "Industry benchmark comparisons", "Key date & deadline extraction"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-indigo-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative inline-flex items-center gap-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg">
                    Try It Now <ArrowRight className="inline w-5 h-5 ml-2" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            <AnalysisPreview />
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-16">
            <motion.span variants={fadeInUp} className="inline-block text-pink-400 font-bold uppercase tracking-widest text-sm mb-4">Testimonials</motion.span>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Trusted by Legal Professionals
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {TESTIMONIALS.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-32 relative">
        <div className="container mx-auto px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-16">
            <motion.span variants={fadeInUp} className="inline-block text-purple-400 font-bold uppercase tracking-widest text-sm mb-4">Pricing</motion.span>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-slate-400">
              Start free. Scale when you're ready.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.7 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className={`relative p-8 rounded-3xl transition-all ${
                  plan.highlight 
                    ? 'bg-gradient-to-b from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/50 shadow-lg glow' 
                    : 'glass border border-white/5 hover:border-white/10'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  {plan.price === "Custom" ? (
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Custom</span>
                  ) : (
                    <>
                      <span className="text-sm font-semibold text-slate-400">$</span>
                      <span className="text-4xl font-black text-white">{plan.price}</span>
                      <span className="text-slate-500 text-sm">/{plan.period}</span>
                    </>
                  )}
                </div>
                <p className="text-slate-400 text-sm mb-6">{plan.desc}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard" className="block">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-2xl text-center font-bold transition-all ${
                      plan.highlight 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {plan.cta}
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Ready to Secure Your Contracts?
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
              Join 500+ legal teams using ClauseGuard to automate contract analysis and protect their business.
            </p>
            <Link href="/dashboard">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 30px 60px -15px rgba(99, 102, 241, 0.5)" }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center gap-3"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-50" />
                <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xl font-bold px-10 py-5 rounded-2xl shadow-2xl">
                  Get Started for Free
                  <ArrowRight className="inline w-6 h-6 ml-2" />
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo variant="full" size="sm" />
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-sm text-slate-500">© 2026 ClauseGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}