"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion, AnimatePresence, useMotionValue, useTransform,
  useScroll, useInView, useSpring
} from 'framer-motion';
import Link from 'next/link';
import {
  Shield, Search, Zap, CheckCircle2, FileCheck, ShieldAlert,
  ArrowRight, ChevronRight, Sparkles, Lock, TrendingUp,
  Loader2, Send, FileText, Brain, BarChart3, Clock, Check
} from 'lucide-react';

/* ── Variants ─────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as number[] } }
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

/* ── Data ─────────────────────────────────────────────────── */
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

/* ── Sub-components ───────────────────────────────────────── */

function BlobBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: 'radial-gradient(circle, #10B981 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-primary/15 rounded-full blur-[130px]"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[110px]"
      />
    </div>
  );
}

function HeroCard3D() {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [14, -14]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-14, 14]), { stiffness: 150, damping: 20 });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseX.set(e.clientX - r.left - r.width / 2);
    mouseY.set(e.clientY - r.top - r.height / 2);
  }, [mouseX, mouseY]);

  const onLeave = useCallback(() => { mouseX.set(0); mouseY.set(0); }, [mouseX, mouseY]);

  const [scanStep, setScanStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setScanStep(s => (s + 1) % 5), 1800);
    return () => clearInterval(t);
  }, []);

  const clauses = [
    { risk: "red", text: "Unlimited liability — Sec 4.2", show: 1 },
    { risk: "yellow", text: "Non-compete: 5 yrs post-term", show: 2 },
    { risk: "green", text: "Payment terms: industry std", show: 3 },
    { risk: "green", text: "Confidentiality: compliant", show: 4 }
  ];

  return (
    <div ref={cardRef} onMouseMove={onMove} onMouseLeave={onLeave} style={{ perspective: "1200px" }} className="relative">
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative bg-card/80 backdrop-blur-2xl border border-border/50 rounded-3xl p-8 shadow-2xl shadow-black/50 w-full max-w-md"
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/5 to-emerald-400/5 pointer-events-none" />

        <div className="flex items-center gap-3 mb-6 border-b border-border/40 pb-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">vendor_agreement_2024.pdf</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">14 pages · Analyzed just now</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Risk Score</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-destructive">34</span>
              <span className="text-muted-foreground text-sm">/100</span>
            </div>
          </div>
          <div className="px-4 py-2 bg-destructive/15 text-destructive border border-destructive/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            HIGH RISK
          </div>
        </div>

        <div className="w-full h-2 bg-muted rounded-full mb-6 overflow-hidden">
          <motion.div
            initial={{ width: 0 }} animate={{ width: "34%" }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            className="h-full bg-gradient-to-r from-destructive to-red-500 rounded-full"
          />
        </div>

        <div className="space-y-3">
          {clauses.map((c, i) => (
            <motion.div
              key={i}
              animate={{ opacity: scanStep >= c.show ? 1 : 0.2 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3 text-sm"
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${c.risk === 'red' ? 'bg-destructive' : c.risk === 'yellow' ? 'bg-yellow-500' : 'bg-emerald-500'}`} />
              <span className="text-muted-foreground font-medium">{c.text}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 pt-5 border-t border-border/40 flex items-center justify-between text-sm font-semibold text-primary">
          <span>View Full Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </div>

        <motion.div
          animate={{ y: [-220, 220] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent pointer-events-none"
          style={{ top: "50%" }}
        />
      </motion.div>

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-5 -right-5 bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/40 rounded-2xl px-4 py-2.5 shadow-xl z-20"
      >
        <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-emerald-400" /><span className="text-xs font-bold text-emerald-300">AI Powered</span></div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute -bottom-5 -left-5 bg-primary/20 backdrop-blur-xl border border-primary/40 rounded-2xl px-4 py-2.5 shadow-xl z-20"
      >
        <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /><span className="text-xs font-bold text-primary">Saved 4.5 hrs</span></div>
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    border: color === 'red' ? 'border-destructive/30 text-destructive bg-destructive/10' :
            color === 'yellow' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
            'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    dot: color === 'red' ? 'bg-destructive' : color === 'yellow' ? 'bg-yellow-400' : 'bg-emerald-400'
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative bg-card/60 backdrop-blur-2xl border border-border/40 rounded-3xl p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={placeholders[placeholderIdx]}
          rows={4}
          className="w-full bg-background/40 border border-border/40 rounded-2xl p-5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-muted-foreground/40 font-medium leading-relaxed"
        />
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4 sm:gap-2">
          <p className="text-xs text-muted-foreground/60 text-center sm:text-left">Try pasting a real clause or use the example prompts above</p>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={analyze}
            disabled={!input.trim() || loading}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors w-full sm:w-auto"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Send className="w-4 h-4" /> Analyze Clause</>}
          </motion.button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="mt-6 border-t border-border/40 pt-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-2 ${riskColor(result.color).border}`}>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${riskColor(result.color).dot}`} />
                  {result.level}
                </div>
                <span className="text-sm text-muted-foreground">Score: <span className="font-bold text-foreground">{result.score}/100</span></span>
              </div>
              <div className="space-y-2">
                {result.items.map((item, i) => (
                  <motion.div
                    key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-sm py-2.5 px-4 rounded-xl bg-muted/30"
                  >
                    <div className={`w-2 h-2 rounded-full shrink-0 ${item.type === 'red' ? 'bg-destructive' : item.type === 'yellow' ? 'bg-yellow-500' : 'bg-emerald-500'}`} />
                    <span className="text-muted-foreground">{item.text}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-xs text-muted-foreground">
                  💡 This is a preview. The full ClauseGuard engine analyzes your entire document with deep context.{' '}
                  <Link href="/dashboard" className="text-primary font-semibold hover:underline">Try the real thing →</Link>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let cur = 0;
    const step = target / 60;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(cur));
    }, 28);
    return () => clearInterval(t);
  }, [isInView, target]);
  return <div ref={ref} className="text-5xl md:text-6xl font-heading font-black text-foreground tabular-nums">{count.toLocaleString()}{suffix}</div>;
}

/* ── Page ─────────────────────────────────────────────────── */
export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  return (
    <div className="flex flex-col">

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
        <BlobBackground />
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Legal Intelligence
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight leading-tight sm:leading-[1.05] mb-6 sm:mb-8 text-balance text-center lg:text-left">
                Your Contracts,
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-emerald-400 via-primary to-emerald-400 bg-clip-text text-transparent">
                  Defended by AI.
                </span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mb-10 font-medium text-center lg:text-left mx-auto lg:mx-0">
                Upload any legal agreement and get an instant risk score, plain-English summary, and clause benchmarking — in under 3 seconds.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-12 w-full justify-center lg:justify-start items-center">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <motion.div
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(16,185,129,0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    className="flex justify-center items-center gap-2 bg-primary text-primary-foreground px-6 py-4 rounded-2xl font-bold text-base cursor-pointer group"
                  >
                    Start Analyzing Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                </Link>
                <a href="#demo" className="w-full sm:w-auto">
                  <motion.div
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="flex justify-center items-center gap-2 bg-secondary text-secondary-foreground px-6 py-4 rounded-2xl font-bold text-base border border-border/50 cursor-pointer hover:bg-muted/80 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" /> Try Live Demo
                  </motion.div>
                </a>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {["A","B","C","D","E"].map((l, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-background bg-gradient-to-br from-emerald-500/20 to-primary/20 flex items-center justify-center text-xs font-black text-primary">
                      {l}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground text-center sm:text-left font-medium"><span className="font-bold text-foreground">500+</span> legal professionals trust ClauseGuard</p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="relative hidden lg:flex justify-center items-center"
            >
              <HeroCard3D />
            </motion.div>
          </div>
        </motion.div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 bg-muted-foreground rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ─── MARQUEE ──────────────────────────────────────── */}
      <section className="py-12 border-y border-border/40 bg-muted/10 overflow-hidden">
        <p className="text-center text-[10px] font-black uppercase tracking-[0.35em] text-muted-foreground/40 mb-8">Trusted by modern legal teams</p>
        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="flex gap-20 w-max"
          >
            {[...["CORETEK", "DEFENDIS", "LEXGATE", "SCALE LAW", "ARROWHEAD", "MERIDIAN", "VERTEX LEGAL", "PINNACLE"],
              ...["CORETEK", "DEFENDIS", "LEXGATE", "SCALE LAW", "ARROWHEAD", "MERIDIAN", "VERTEX LEGAL", "PINNACLE"]
            ].map((name, i) => (
              <div key={i} className="flex items-center gap-3 text-muted-foreground/25 font-black text-base tracking-widest whitespace-nowrap hover:text-muted-foreground/60 transition-colors cursor-default">
                <Shield className="w-4 h-4 shrink-0" />{name}
              </div>
            ))}
          </motion.div>
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ─── LIVE DEMO ────────────────────────────────────── */}
      <section id="demo" className="py-28 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-16">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Live Demo
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-heading font-black mb-5 text-balance">
              See it in action. <span className="text-primary block sm:inline">Right now.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Paste any contract clause and watch ClauseGuard instantly identify risks, score the language, and flag deviations from industry standards.
            </motion.p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <InteractiveDemo />
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────── */}
      <section id="how-it-works" className="py-28 bg-muted/10 border-y border-border/40 relative">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-20">
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-heading font-black mb-5 text-balance">
              From upload to insight in <span className="text-primary block sm:inline">3 steps.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground max-w-xl mx-auto">
              Our streamlined pipeline means you spend less time reading and more time negotiating.
            </motion.p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.7 }}
                className="relative text-center p-8 bg-card/60 backdrop-blur-md border border-border/40 rounded-3xl hover:border-primary/30 transition-colors group"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-black flex items-center justify-center shadow-lg shadow-primary/40">
                  {step.step}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  <step.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────── */}
      <section id="features" className="py-28 relative">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-20">
            <motion.p variants={fadeUp} className="text-primary font-bold uppercase tracking-[0.2em] text-sm mb-4">Core Capabilities</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-heading font-black mb-5">
              Everything you need to review<br />contracts with confidence.
            </motion.h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={i} variants={fadeUp}
                whileHover={{ y: -8, boxShadow: "0 24px 48px -12px rgba(0,0,0,0.5)" }}
                className="p-8 rounded-3xl bg-card/60 backdrop-blur-md border border-border/40 cursor-pointer group transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  {feat.title}
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────── */}
      <section className="py-24 bg-muted/10 border-y border-border/40">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7 }}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <p className="text-muted-foreground font-semibold mt-2 uppercase tracking-wider text-xs">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ──────────────────────────────────────── */}
      <section id="pricing" className="py-28 relative">
        <BlobBackground />
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-heading font-black mb-5">Simple, transparent pricing.</motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground">Start free. Scale when you&apos;re ready.</motion.p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.7 }}
                whileHover={{ y: -6 }}
                className={`relative p-8 rounded-3xl border flex flex-col transition-all ${plan.highlight ? 'bg-primary/10 border-primary/50 shadow-2xl shadow-primary/20' : 'bg-card/60 border-border/40 backdrop-blur-md'}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/30">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  {plan.price === "Custom" ? (
                    <span className="text-3xl font-black">Custom</span>
                  ) : (
                    <><span className="text-sm font-bold text-muted-foreground">$</span><span className="text-4xl font-black">{plan.price}</span><span className="text-muted-foreground text-sm">/{plan.period}</span></>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-6">{plan.desc}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard">
                  <motion.div
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className={`w-full py-3.5 rounded-2xl text-center font-bold text-sm cursor-pointer transition-all ${plan.highlight ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90' : 'bg-secondary text-secondary-foreground border border-border/60 hover:bg-muted/80'}`}
                  >
                    {plan.cta}
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────── */}
      <section className="py-28 relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[140px]" />
        </div>
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto bg-card/50 backdrop-blur-3xl border border-border/40 rounded-[3rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Shield className="w-56 h-56" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-heading font-black mb-6 sm:mb-8 leading-tight sm:leading-[1.1] relative z-10 text-balance">
                Ready to secure your <br className="hidden sm:block" /><span className="text-emerald-400">future agreements?</span>
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground mb-10 sm:mb-12 max-w-2xl mx-auto font-medium relative z-10">
                Join 500+ legal teams using ClauseGuard to automate deep-analysis and benchmarking of every contract.
              </p>
              <Link href="/dashboard" className="block w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 30px 60px -15px rgba(16,185,129,0.45)" }}
                  whileTap={{ scale: 0.97 }}
                  className="flex justify-center w-full sm:w-auto items-center gap-3 bg-primary text-primary-foreground text-lg sm:text-xl font-extrabold px-8 sm:px-12 py-4 sm:py-6 rounded-[2rem] sm:rounded-3xl cursor-pointer group relative z-10 transition-all"
                >
                  Try ClauseGuard for Free
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
