"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import Link from 'next/link';
import {
  Shield, Search, Zap, CheckCircle, FileCheck, ShieldAlert,
  ArrowRight, ChevronDown, Sparkles, Lock, FileText, Brain, 
  BarChart3, Clock, Check, Menu, X, Play, Users, Star, Award,
  TrendingUp, Target, BookOpen, MessageSquare, Download
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const FEATURES = [
  { icon: Shield, title: "Automated Risk Scoring", desc: "Get instant 0-100 risk scores based on clause severity and industry benchmarks." },
  { icon: Search, title: "Deep Clause Analysis", desc: "AI-powered breakdown of every clause with plain English translations." },
  { icon: Zap, title: "Instant Processing", desc: "Analyze contracts in under 3 seconds with our optimized pipeline." },
  { icon: Lock, title: "Enterprise Security", desc: "Bank-level encryption. Your documents are never stored or shared." },
  { icon: ShieldAlert, title: "Red Flag Detection", desc: "Auto-identify unlimited liability, unilateral amendments, and risky terms." },
  { icon: BarChart3, title: "Industry Benchmarking", desc: "Compare against thousands of standard templates and best practices." }
];

const HOW_IT_WORKS = [
  { step: "01", icon: Upload, title: "Upload Contract", desc: "Drag and drop PDF or DOCX files. We support all major formats." },
  { step: "02", icon: Brain, title: "AI Analysis", desc: "Our LLM engine reads every clause, identifies risks, and benchmarks." },
  { step: "03", icon: FileCheck, title: "Get Insights", desc: "Receive a comprehensive risk report with actionable recommendations." }
];

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "General Counsel", company: "TechVentures Inc.", text: "ClauseGuard saved our legal team 20+ hours per week on contract reviews." },
  { name: "Michael Ross", role: "Partner", company: "Ross & Associates", text: "The risk scoring is remarkably accurate. It's like having an extra associate." },
  { name: "Emily Watson", role: "CEO", company: "StartupFlow", text: "We now review every vendor contract in minutes, not days. Game changer." }
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
    const duration = 2000;
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
    <div ref={ref} className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

function FloatingDocument({ className = "" }: { className?: string }) {
  return (
    <motion.div
      animate={{ 
        y: [0, -15, 0],
        rotate: [0, 2, 0]
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className={`relative ${className}`}
    >
      <svg viewBox="0 0 200 260" className="w-full h-full drop-shadow-2xl">
        <rect x="20" y="10" width="120" height="160" rx="8" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="2" />
        <rect x="30" y="30" width="60" height="6" rx="3" fill="#94A3B8" />
        <rect x="30" y="45" width="100" height="4" rx="2" fill="#CBD5E1" />
        <rect x="30" y="55" width="90" height="4" rx="2" fill="#CBD5E1" />
        <rect x="30" y="65" width="80" height="4" rx="2" fill="#CBD5E1" />
        <rect x="30" y="80" width="95" height="4" rx="2" fill="#E2E8F0" />
        <rect x="30" y="90" width="70" height="4" rx="2" fill="#E2E8F0" />
        
        <circle cx="160" cy="200" r="45" fill="#059669" className="drop-shadow-lg" />
        <path d="M140 200L152 212L180 184" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        
        <motion.path
          animate={{ pathLength: [0, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          d="M100 180L110 190L130 170"
          stroke="#10B981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-50"
        />
      </svg>
    </motion.div>
  );
}

function AnalysisPreview() {
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => setStep(s => (s + 1) % 4), 2500);
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
      className="relative bg-white rounded-3xl shadow-2xl p-8 border border-slate-200/50 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500" />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <FileText className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg">vendor_agreement_2024.pdf</h3>
          <p className="text-slate-500 text-sm">14 pages · Analyzed just now</p>
        </div>
      </div>

      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Risk Score</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-red-500">34</span>
            <span className="text-slate-400 text-lg">/100</span>
          </div>
        </div>
        <div className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-bold flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          HIGH RISK
        </div>
      </div>

      <div className="w-full h-3 bg-slate-100 rounded-full mb-6 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "34%" }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full"
        />
      </div>

      <div className="space-y-3">
        {risks.map((risk, i) => (
          <motion.div
            key={i}
            animate={{ opacity: step >= i ? 1 : 0.4, x: step >= i ? 0 : -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
          >
            <div className={`w-3 h-3 rounded-full ${risk.color}`} />
            <span className="text-slate-700 font-medium text-sm">{risk.text}</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        animate={{ y: [-180, 180] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
        className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent"
        style={{ top: "45%" }}
      />
    </motion.div>
  );
}

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)" }}
      className="group bg-white rounded-2xl p-8 border border-slate-200/50 hover:border-emerald-500/30 transition-all duration-300"
    >
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
        <feature.icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
      <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
    </motion.div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: typeof TESTIMONIALS[0] }) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-200/50 shadow-lg">
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-slate-700 leading-relaxed mb-6 text-lg">"{testimonial.text}"</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
          {testimonial.name[0]}
        </div>
        <div>
          <p className="font-semibold text-slate-900">{testimonial.name}</p>
          <p className="text-slate-500 text-sm">{testimonial.role}, {testimonial.company}</p>
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-200/50' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Logo variant="full" size="md" />
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-slate-600 hover:text-emerald-600 transition-colors font-medium">Features</a>
          <a href="#how-it-works" className="text-slate-600 hover:text-emerald-600 transition-colors font-medium">How it Works</a>
          <a href="#testimonials" className="text-slate-600 hover:text-emerald-600 transition-colors font-medium">Testimonials</a>
          <a href="#pricing" className="text-slate-600 hover:text-emerald-600 transition-colors font-medium">Pricing</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-700 hover:text-emerald-600 transition-colors font-medium">
            Sign In
          </Link>
          <Link href="/dashboard" className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
            Get Started Free
          </Link>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-slate-700">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-200"
          >
            <div className="px-6 py-6 space-y-4">
              <a href="#features" className="block text-slate-700 py-2 font-medium">Features</a>
              <a href="#how-it-works" className="block text-slate-700 py-2 font-medium">How it Works</a>
              <a href="#testimonials" className="block text-slate-700 py-2 font-medium">Testimonials</a>
              <a href="#pricing" className="block text-slate-700 py-2 font-medium">Pricing</a>
              <div className="pt-4 flex flex-col gap-3">
                <Link href="/dashboard" className="text-center text-slate-700 py-3 font-medium">Sign In</Link>
                <Link href="/dashboard" className="text-center bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold">Get Started Free</Link>
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
    <div className="min-h-screen bg-[#FAFBFC] text-slate-900 overflow-x-hidden">
      <Navigation />

      <section ref={heroRef} className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-50 to-blue-50 rounded-full blur-3xl opacity-40" />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold mb-8">
                <Sparkles className="w-4 h-4" />
                AI-Powered Contract Intelligence
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
                Secure Your Contracts with
                <span className="block bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  AI Intelligence
                </span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-xl text-slate-600 leading-relaxed max-w-xl mb-10">
                Upload any legal agreement and get instant risk scores, plain-English summaries, and clause benchmarking — all in under 3 seconds.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/dashboard">
                  <motion.div
                    whileHover={{ scale: 1.03, boxShadow: "0 20px 40px -10px rgba(5,150,105,0.35)" }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/25"
                  >
                    Start Analyzing Free
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
                <a href="#how-it-works">
                  <motion.div
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all"
                  >
                    <Play className="w-5 h-5" /> See How It Works
                  </motion.div>
                </a>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {["A", "B", "C", "D", "E"].map((l, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-md">
                      {l}
                    </div>
                  ))}
                </div>
                <p className="text-slate-600"><span className="font-bold text-slate-900">500+</span> legal teams trust ClauseGuard</p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="hidden lg:flex justify-center items-center"
            >
              <FloatingDocument className="w-[420px] h-[520px]" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 12, 0] }} 
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400"
        >
          <span className="text-xs font-medium mb-2">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      <section className="py-20 bg-white border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <AnimatedCounter target={500} suffix="+" />
              <p className="text-slate-500 font-medium mt-2">Legal Teams</p>
            </div>
            <div>
              <AnimatedCounter target={98} suffix="%" />
              <p className="text-slate-500 font-medium mt-2">Accuracy Rate</p>
            </div>
            <div>
              <AnimatedCounter target={3} suffix="s" />
              <p className="text-slate-500 font-medium mt-2">Avg. Analysis Time</p>
            </div>
            <div>
              <AnimatedCounter target={12000} suffix="+" />
              <p className="text-slate-500 font-medium mt-2">Contracts Analyzed</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-32">
        <div className="container mx-auto px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-16">
            <motion.span variants={fadeInUp} className="inline-block text-emerald-600 font-bold uppercase tracking-widest text-sm mb-4">Features</motion.span>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Everything You Need for<br />
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">Contract Analysis</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-slate-600 max-w-2xl mx-auto">
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

      <section id="how-it-works" className="py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-20">
            <motion.span variants={fadeInUp} className="inline-block text-emerald-600 font-bold uppercase tracking-widest text-sm mb-4">Process</motion.span>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              How It Works
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-slate-600 max-w-xl mx-auto">
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
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-2xl font-black flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                  {step.step}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-6 shadow-md">
                  <step.icon className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-28 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-emerald-200 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-emerald-600 font-bold uppercase tracking-widest text-sm mb-4">Live Preview</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                See Your Contract<br />
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">Risks Instantly</span>
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed mb-8">
                Our AI analyzes every clause, identifies potential risks, and provides actionable recommendations — all in seconds.
              </p>
              <ul className="space-y-4 mb-8">
                {["Automated risk scoring (0-100)", "Plain English clause translations", "Industry benchmark comparisons", "Key date & deadline extraction"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/25"
                >
                  Try It Now <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </motion.div>

            <AnalysisPreview />
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-16">
            <motion.span variants={fadeInUp} className="inline-block text-emerald-600 font-bold uppercase tracking-widest text-sm mb-4">Testimonials</motion.span>
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

      <section id="pricing" className="py-32">
        <div className="container mx-auto px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-16">
            <motion.span variants={fadeInUp} className="inline-block text-emerald-600 font-bold uppercase tracking-widest text-sm mb-4">Pricing</motion.span>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-slate-600">
              Start free. Scale when you&apos;re ready.
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
                className={`relative p-8 rounded-3xl border-2 transition-all ${
                  plan.highlight 
                    ? 'bg-gradient-to-b from-emerald-50 to-white border-emerald-500 shadow-xl shadow-emerald-500/10' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  {plan.price === "Custom" ? (
                    <span className="text-3xl font-black text-slate-900">Custom</span>
                  ) : (
                    <>
                      <span className="text-sm font-semibold text-slate-500">$</span>
                      <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                      <span className="text-slate-500 text-sm">/{plan.period}</span>
                    </>
                  )}
                </div>
                <p className="text-slate-600 text-sm mb-6">{plan.desc}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
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
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
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

      <section className="py-32 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Ready to Secure Your Contracts?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12">
              Join 500+ legal teams using ClauseGuard to automate contract analysis and protect their business.
            </p>
            <Link href="/dashboard">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 30px 60px -15px rgba(5,150,105,0.5)" }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-900 text-xl font-bold px-10 py-5 rounded-2xl shadow-2xl"
              >
                Get Started for Free
                <ArrowRight className="w-6 h-6" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 bg-slate-900 border-t border-slate-800">
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

function Upload(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17,8 12,3 7,8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}