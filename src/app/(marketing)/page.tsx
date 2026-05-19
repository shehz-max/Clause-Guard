"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion, AnimatePresence, useSpring,
  useMotionValue, useTransform, useScroll, useInView
} from 'framer-motion';
import Link from 'next/link';
import {
  Shield, Search, Zap, CheckCircle2, FileCheck, ShieldAlert,
  ArrowRight, ChevronRight, Sparkles, Lock, TrendingUp,
  Loader2, Send, FileText, Brain, BarChart3, Clock, Check, Menu, X
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const CONTRACT_TYPES = ["NDA", "Employment Contract", "SLA", "Vendor Agreement", "Partnership Agreement"];

const DEMO_RESPONSES = {
  high: {
    level: "HIGH RISK", score: 28, color: "red",
    items: [
      { type: "red", text: "Unlimited liability exposure — Sec 4.2" },
      { type: "red", text: "Unilateral amendment rights without notice" },
      { type: "yellow", text: "Non-compete spans 5 years (above industry std)" },
      { type: "green", text: "Confidentiality terms: standard" }
    ]
  },
  medium: {
    level: "MEDIUM RISK", score: 61, color: "yellow",
    items: [
      { type: "yellow", text: "30-day notice clause (std is 60 days)" },
      { type: "yellow", text: "Auto-renewal with 90-day opt-out window" },
      { type: "green", text: "Payment terms: industry standard" },
      { type: "green", text: "IP ownership: clearly defined" }
    ]
  },
  low: {
    level: "LOW RISK", score: 89, color: "green",
    items: [
      { type: "green", text: "Confidentiality: NDA best practices met" },
      { type: "green", text: "Payment & delivery: well structured" },
      { type: "green", text: "Termination clauses: balanced" },
      { type: "yellow", text: "Jurisdiction: verify local laws apply" }
    ]
  }
};

const FEATURES = [
  { icon: Shield, title: "Automated Risk Scoring", desc: "Get a 0-100 risk score based on clause severity, liability exposure, and industry deviation benchmarks." },
  { icon: Search, title: "Intelligent Summarization", desc: "Dense legalese transformed into plain English executive summaries in under 3 seconds." },
  { icon: Zap, title: "Instant Benchmarking", desc: "Compare against thousands of standard templates to catch missing or unfavorable clauses immediately." },
  { icon: Lock, title: "Secure & Private", desc: "Enterprise-grade encryption. Your documents are never used to train AI models. Ever." },
  { icon: ShieldAlert, title: "Red Flag Detection", desc: "Auto-flag high-risk indemnity, termination, and unlimited liability clauses for legal review." },
  { icon: FileCheck, title: "Multi-format Support", desc: "Analyze PDF, DOCX, and scanned documents with our integrated OCR and parsing engine." }
];

const STEPS = [
  { step: "01", icon: FileText, title: "Upload Your Contract", desc: "Drag & drop any PDF, DOCX, or scanned document. We process it in seconds." },
  { step: "02", icon: Brain, title: "AI Scans & Analyzes", desc: "Our LLM engine reads every clause, identifies risks, and benchmarks against standards." },
  { step: "03", icon: BarChart3, title: "Get Your Risk Report", desc: "Review a full interactive report with risk scores, summaries, and recommendations." }
];

const STATS = [
  { value: 500, suffix: "+", label: "Legal Teams" },
  { value: 98, suffix: "%", label: "Analysis Accuracy" },
  { value: 3, suffix: "s", label: "Avg. Analysis Time" },
  { value: 12000, suffix: "+", label: "Contracts Analyzed" }
];

const PRICING = [
  {
    name: "Free", price: "0", period: "forever",
    desc: "Perfect for individuals exploring AI contract analysis.",
    features: ["5 contract analyses/month", "Risk scoring", "Plain English summaries", "PDF & DOCX support"],
    cta: "Get Started Free", highlight: false
  },
  {
    name: "Pro", price: "29", period: "per month",
    desc: "For legal professionals who review contracts daily.",
    features: ["Unlimited analyses", "Benchmarking against standards", "Red flag detection", "AI chat copilot", "Priority processing"],
    cta: "Start Pro Trial", highlight: true
  },
  {
    name: "Enterprise", price: "Custom", period: "contact us",
    desc: "For law firms and large legal teams at scale.",
    features: ["Everything in Pro", "Custom AI training", "SSO & team management", "SLA guarantee", "Dedicated support"],
    cta: "Contact Sales", highlight: false
  }
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let cur = 0;
    const step = target / 50;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(cur));
    }, 30);
    return () => clearInterval(t);
  }, [isInView, target]);
  return <div ref={ref} className="text-5xl md:text-6xl font-black text-white tabular-nums">{count.toLocaleString()}{suffix}</div>;
}

function HeroCard() {
  const [scanStep, setScanStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setScanStep(s => (s + 1) % 5), 2000);
    return () => clearInterval(t);
  }, []);

  const clauses = [
    { risk: "red", text: "Unlimited liability — Sec 4.2", show: 1 },
    { risk: "yellow", text: "Non-compete: 5 yrs post-term", show: 2 },
    { risk: "green", text: "Payment terms: industry std", show: 3 },
    { risk: "green", text: "Confidentiality: compliant", show: 4 }
  ];

  return (
    <div className="relative w-full max-w-[420px]">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/20 via-transparent to-transparent blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-7 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="font-semibold text-sm text-white">vendor_agreement_2024.pdf</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">14 pages · Analyzed just now</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Risk Score</p>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-red-400">34</span>
              <span className="text-white/40 text-sm">/100</span>
            </div>
          </div>
          <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            HIGH RISK
          </div>
        </div>

        <div className="w-full h-2 bg-white/5 rounded-full mb-6 overflow-hidden">
          <motion.div
            initial={{ width: 0 }} animate={{ width: "34%" }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
        </div>

        <div className="space-y-3">
          {clauses.map((c, i) => (
            <motion.div
              key={i}
              animate={{ opacity: scanStep >= c.show ? 1 : 0.3 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 text-sm"
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${c.risk === 'red' ? 'bg-red-400' : c.risk === 'yellow' ? 'bg-yellow-400' : 'bg-emerald-400'}`} />
              <span className="text-white/60 font-medium">{c.text}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-sm font-semibold text-emerald-400">
          <span>View Full Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </div>

        <motion.div
          animate={{ y: [-200, 200] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
          className="absolute left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"
          style={{ top: "45%" }}
        />
      </motion.div>

      <motion.div
        animate={{ y: [0, -8, 0], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 -right-4 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 backdrop-blur-xl border border-emerald-500/30 rounded-2xl px-4 py-3 z-20"
      >
        <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-emerald-400" /><span className="text-xs font-bold text-emerald-300">AI Powered</span></div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0], opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-3 -left-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 z-20"
      >
        <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-white/60" /><span className="text-xs font-bold text-white/60">Saved 4.5 hrs</span></div>
      </motion.div>
    </div>
  );
}

function InteractiveDemo() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<typeof DEMO_RESPONSES.high | null>(null);
  const [loading, setLoading] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  const placeholders = [
    'Paste a clause... e.g. "Either party may terminate this agreement with 30 days notice..."',
    'Try: "The contractor shall bear unlimited liability for any damages..."',
    'Try: "This agreement auto-renews annually unless cancelled 90 days prior..."'
  ];

  useEffect(() => {
    const t = setInterval(() => setPlaceholderIdx(p => (p + 1) % placeholders.length), 4000);
    return () => clearInterval(t);
  }, []);

  const analyze = async () => {
    if (!input.trim()) return;
    setLoading(true); setResult(null);
    await new Promise(r => setTimeout(r, 1800));
    const lower = input.toLowerCase();
    if (/unlimited|sole discretion|no limit|indemnif|full liab/.test(lower)) setResult(DEMO_RESPONSES.high);
    else if (/terminat|cancel|breach|renew|30.day|notice|penalty/.test(lower)) setResult(DEMO_RESPONSES.medium);
    else setResult(DEMO_RESPONSES.low);
    setLoading(false);
  };

  const riskColor = (color: string) => ({
    border: color === 'red' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
            color === 'yellow' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
            'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    dot: color === 'red' ? 'bg-red-400' : color === 'yellow' ? 'bg-yellow-400' : 'bg-emerald-400'
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="relative z-10">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={placeholders[placeholderIdx]}
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all placeholder:text-white/30 font-medium leading-relaxed text-white"
          />
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
            <p className="text-xs text-white/40 text-center sm:text-left">Try pasting a real clause or use the example prompts above</p>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={analyze}
              disabled={!input.trim() || loading}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-gray-900 px-6 py-3 rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all w-full sm:w-auto"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Send className="w-4 h-4" /> Analyze Clause</>}
            </motion.button>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="mt-6 border-t border-white/10 pt-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-2 ${riskColor(result.color).border}`}>
                    <div className={`w-2 h-2 rounded-full animate-pulse ${riskColor(result.color).dot}`} />
                    {result.level}
                  </div>
                  <span className="text-sm text-white/40">Score: <span className="font-bold text-white">{result.score}/100</span></span>
                </div>
                <div className="space-y-2">
                  {result.items.map((item, i) => (
                    <motion.div
                      key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 text-sm py-3 px-4 rounded-xl bg-white/5"
                    >
                      <div className={`w-2 h-2 rounded-full shrink-0 ${item.type === 'red' ? 'bg-red-400' : item.type === 'yellow' ? 'bg-yellow-400' : 'bg-emerald-400'}`} />
                      <span className="text-white/60">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-emerald-400/5 border border-emerald-500/10">
                  <p className="text-xs text-white/60">
                    This is a preview. The full ClauseGuard engine analyzes your entire document with deep context.{' '}
                    <Link href="/dashboard" className="text-emerald-400 font-semibold hover:underline">Try the real thing</Link>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : ''}`}>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">ClauseGuard</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-white/60 hover:text-white transition-colors">How it Works</a>
          <a href="#demo" className="text-sm text-white/60 hover:text-white transition-colors">Live Demo</a>
          <a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-white/60 hover:text-white transition-colors font-medium">
            Log in
          </Link>
          <Link href="/dashboard" className="bg-gradient-to-r from-emerald-500 to-emerald-400 text-gray-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
            Get Started Free
          </Link>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-2">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="container mx-auto px-6 py-6 space-y-4">
              <a href="#features" className="block text-white/60 hover:text-white py-2">Features</a>
              <a href="#how-it-works" className="block text-white/60 hover:text-white py-2">How it Works</a>
              <a href="#demo" className="block text-white/60 hover:text-white py-2">Live Demo</a>
              <a href="#pricing" className="block text-white/60 hover:text-white py-2">Pricing</a>
              <div className="pt-4 flex flex-col gap-3">
                <Link href="/dashboard" className="text-center text-white/60 hover:text-white py-3 font-medium">Log in</Link>
                <Link href="/dashboard" className="text-center bg-gradient-to-r from-emerald-500 to-emerald-400 text-gray-900 px-5 py-3 rounded-xl font-bold">Get Started Free</Link>
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
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <Navigation />

      <section ref={heroRef} className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#050505_70%)]" />
        </div>

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Legal Intelligence
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
                Your Contracts,
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                  Defended by AI.
                </span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg text-white/50 leading-relaxed max-w-lg mb-10">
                Upload any legal agreement and get an instant risk score, plain-English summary, and clause benchmarking — in under 3 seconds.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/dashboard">
                  <motion.div
                    whileHover={{ scale: 1.03, boxShadow: "0 20px 40px -10px rgba(16,185,129,0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-gray-900 px-8 py-4 rounded-2xl font-bold text-base"
                  >
                    Start Analyzing Free
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
                <a href="#demo">
                  <motion.div
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 bg-white/5 text-white px-8 py-4 rounded-2xl font-bold text-base border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <Sparkles className="w-4 h-4" /> Try Live Demo
                  </motion.div>
                </a>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {["A","B","C","D","E"].map((l, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center text-xs font-black text-emerald-400">
                      {l}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-white/40"><span className="font-bold text-white">500+</span> legal professionals trust ClauseGuard</p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="hidden lg:flex justify-center"
            >
              <HeroCard />
            </motion.div>
          </div>
        </motion.div>

        <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-6 h-10 rounded-full border border-white/30 flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      <section className="py-16 border-y border-white/5 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="container mx-auto px-6">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.35em] text-white/20 mb-8">Trusted by modern legal teams</p>
          <div className="relative overflow-hidden">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="flex gap-20 w-max"
            >
              {[...["CORETEK", "DEFENDIS", "LEXGATE", "SCALE LAW", "ARROWHEAD", "MERIDIAN", "VERTEX LEGAL", "PINNACLE"],
                ...["CORETEK", "DEFENDIS", "LEXGATE", "SCALE LAW", "ARROWHEAD", "MERIDIAN", "VERTEX LEGAL", "PINNACLE"]
              ].map((name, i) => (
                <div key={i} className="flex items-center gap-3 text-white/15 font-black text-base tracking-widest whitespace-nowrap hover:text-white/30 transition-colors cursor-default">
                  <Shield className="w-4 h-4 shrink-0" />{name}
                </div>
              ))}
            </motion.div>
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      <section id="demo" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.03] to-transparent" />
        <div className="container mx-auto px-6 relative">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-16">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Demo
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-black mb-5">
              See it in action. <span className="text-emerald-400">Right now.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-white/50 max-w-2xl mx-auto">
              Paste any contract clause and watch ClauseGuard instantly identify risks, score the language, and flag deviations from industry standards.
            </motion.p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <InteractiveDemo />
          </motion.div>
        </div>
      </section>

      <section id="how-it-works" className="py-32 border-y border-white/5">
        <div className="container mx-auto px-6">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-20">
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black mb-5">
              From upload to insight in <span className="text-emerald-400">3 steps.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-white/50 max-w-xl mx-auto">
              Our streamlined pipeline means you spend less time reading and more time negotiating.
            </motion.p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.7 }}
                className="relative text-center p-10 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl hover:border-emerald-500/30 transition-all group"
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-gray-900 text-sm font-black flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  {step.step}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-6 mt-4 group-hover:bg-emerald-500 group-hover:text-gray-900 transition-all duration-500">
                  <step.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-white/50 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/[0.02] via-transparent to-transparent" />
        <div className="container mx-auto px-6 relative">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-20">
            <motion.p variants={fadeUp} className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-sm mb-4">Core Capabilities</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black">
              Everything you need to review<br />contracts with confidence.
            </motion.h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={i} variants={fadeUp}
                whileHover={{ y: -8, borderColor: 'rgba(16,185,129,0.3)' }}
                className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 cursor-pointer group transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-gray-900 transition-all duration-500">
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  {feat.title}
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-emerald-400" />
                </h3>
                <p className="text-white/50 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7 }}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <p className="text-white/40 font-semibold mt-2 uppercase tracking-wider text-xs">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.03] to-transparent" />
        <div className="container mx-auto px-6 relative">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black mb-5">Simple, transparent pricing.</motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-white/50">Start free. Scale when you&apos;re ready.</motion.p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.7 }}
                whileHover={{ y: -6 }}
                className={`relative p-8 rounded-3xl border flex flex-col transition-all ${plan.highlight ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-400 text-gray-900 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/30">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  {plan.price === "Custom" ? (
                    <span className="text-3xl font-black">Custom</span>
                  ) : (
                    <><span className="text-sm font-bold text-white/40">$</span><span className="text-4xl font-black">{plan.price}</span><span className="text-white/40 text-sm">/{plan.period}</span></>
                  )}
                </div>
                <p className="text-white/50 text-sm mb-6">{plan.desc}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="text-white/50">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard">
                  <motion.div
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className={`w-full py-4 rounded-2xl text-center font-bold text-sm cursor-pointer transition-all ${plan.highlight ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-gray-900 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}
                  >
                    {plan.cta}
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-[140px]" />
        </div>
        <div className="container mx-auto px-6 text-center relative">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-[3rem] p-16 md:p-20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Shield className="w-56 h-56" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
                Ready to secure your <br /><span className="text-emerald-400">future agreements?</span>
              </h2>
              <p className="text-lg text-white/50 mb-12 max-w-2xl mx-auto">
                Join 500+ legal teams using ClauseGuard to automate deep-analysis and benchmarking of every contract.
              </p>
              <Link href="/dashboard" className="inline-block">
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 30px 60px -15px rgba(16,185,129,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-gray-900 text-lg font-extrabold px-10 py-5 rounded-[2rem] cursor-pointer shadow-lg shadow-emerald-500/30 transition-all"
                >
                  Try ClauseGuard for Free
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">ClauseGuard</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-white/40">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <a href="#demo" className="hover:text-white transition-colors">Live Demo</a>
            </div>
            <p className="text-sm text-white/30">© 2026 ClauseGuard by Muhammad Umer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}