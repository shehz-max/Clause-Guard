"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Link from 'next/link';
import {
  Shield, Search, Zap, CheckCircle, FileCheck, ShieldAlert,
  ArrowRight, Sparkles, Lock, FileText, Brain, 
  BarChart3, Clock, Check, Menu, X, Play, Users, Star,
  TrendingUp, Upload, Layers, AlertTriangle
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.075 } }
};

// Data
const FEATURES = [
  { icon: Shield, title: "AI Risk Detection", desc: "Advanced neural networks analyze every clause for potential risks and vulnerabilities." },
  { icon: Search, title: "Deep Clause Analysis", desc: "Break down complex legal language into clear, understandable insights." },
  { icon: Zap, title: "Instant Processing", desc: "Get comprehensive analysis in under 3 seconds with our optimized AI pipeline." },
  { icon: Lock, title: "Bank-Grade Security", desc: "End-to-end encryption ensures your sensitive documents remain protected." },
  { icon: BarChart3, title: "Risk Scoring", desc: "0-100 risk scores based on clause severity and industry benchmarks." },
  { icon: Layers, title: "Clause Benchmarking", desc: "Compare against thousands of standard templates and best practices." }
];

const HOW_IT_WORKS = [
  { step: "01", icon: Upload, title: "Upload Contract", desc: "Drag and drop PDF or DOCX files with automatic format detection." },
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

// Animated Counter Component
function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
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
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-[#1E3A5F]">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

// Hero Document Animation Component
function HeroDocumentAnimation() {
  const [phase, setPhase] = useState(0);
  
  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(1), 400);
    const timer2 = setTimeout(() => setPhase(2), 800);
    const timer3 = setTimeout(() => setPhase(3), 1200);
    const timer4 = setTimeout(() => setPhase(4), 1600);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Document Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 20, scale: phase >= 1 ? 1 : 0.95 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] p-6 relative overflow-hidden"
      >
        {/* Document Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#1E3A5F] rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-[#1E293B]">vendor_contract.pdf</p>
            <p className="text-xs text-[#64748B]">14 pages · Analyzed</p>
          </div>
        </div>
        
        {/* Document Lines */}
        <div className="space-y-2 mb-4">
          <div className="h-2 bg-[#F1F5F9] rounded w-full" />
          <div className="h-2 bg-[#F1F5F9] rounded w-5/6" />
          <div className="h-2 bg-[#F1F5F9] rounded w-4/5" />
          <div className="h-2 bg-[#F1F5F9] rounded w-3/4" />
        </div>
        
        {/* Risk Score Display */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider">Risk Score</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#E11D48]">34</span>
              <span className="text-[#64748B]">/100</span>
            </div>
          </div>
          <div className="px-3 py-1 bg-[#FEE2E2] text-[#E11D48] rounded-full text-xs font-semibold">
            HIGH RISK
          </div>
        </div>
        
        {/* Risk Bar */}
        <div className="mt-3 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "34%" }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-[#E11D48] rounded-full"
          />
        </div>
        
        {/* Scan Line */}
        <motion.div
          initial={{ top: 0, opacity: 0 }}
          animate={{ top: '100%', opacity: phase >= 2 ? 0.4 : 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute left-0 right-0 h-0.5 bg-[#0F766E] -translate-y-full"
        />
      </motion.div>
      
      {/* Risk Badges */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: phase >= 3 ? 1 : 0, scale: phase >= 3 ? 1 : 0.8 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -right-4 top-1/4"
      >
        <div className="bg-[#FEE2E2] border border-[#FECACA] text-[#E11D48] px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
          <AlertTriangle className="w-3 h-3 inline mr-1" />
          Unlimited Liability
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: phase >= 4 ? 1 : 0, scale: phase >= 4 ? 1 : 0.8 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="absolute -left-4 top-1/2"
      >
        <div className="bg-[#FEF3C7] border border-[#FDE68A] text-[#D97706] px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
          <Clock className="w-3 h-3 inline mr-1" />
          5yr Non-compete
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: phase >= 4 ? 1 : 0, scale: phase >= 4 ? 1 : 0.8 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="absolute -right-4 bottom-1/4"
      >
        <div className="bg-[#D1FAE5] border border-[#A7F3D0] text-[#059669] px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
          <CheckCircle className="w-3 h-3 inline mr-1" />
          Auto-renewal
        </div>
      </motion.div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.075, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-50px" }}
      className="group bg-white rounded-xl border border-[#E2E8F0] p-8 hover:border-[#0F766E] hover:shadow-md hover:-translate-y-1 transition-all duration-200"
    >
      <div className="w-12 h-12 bg-[#CCFBF1] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0F766E] transition-colors duration-200">
        <feature.icon className="w-6 h-6 text-[#0F766E] group-hover:text-white transition-colors duration-200" />
      </div>
      <h3 className="text-lg font-semibold text-[#1E293B] mb-3">{feature.title}</h3>
      <p className="text-[#64748B] leading-relaxed">{feature.desc}</p>
    </motion.div>
  );
}

// Testimonial Card Component
function TestimonialCard({ testimonial }: { testimonial: typeof TESTIMONIALS[0] }) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-8">
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-[#D97706] text-[#D97706]" />
        ))}
      </div>
      <p className="text-[#475569] leading-relaxed mb-6 text-lg">"{testimonial.text}"</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#1E3A5F] rounded-full flex items-center justify-center text-white font-bold text-lg">
          {testimonial.avatar}
        </div>
        <div>
          <p className="font-semibold text-[#1E293B]">{testimonial.name}</p>
          <p className="text-[#64748B] text-sm">{testimonial.role}, {testimonial.company}</p>
        </div>
      </div>
    </div>
  );
}

// Stats Section
function StatsSection() {
  return (
    <section className="py-16 bg-white border-y border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="text-center">
            <AnimatedCounter target={500} suffix="+" />
            <p className="text-[#64748B] mt-2">Legal Teams</p>
          </div>
          <div className="text-center">
            <AnimatedCounter target={98} suffix="%" />
            <p className="text-[#64748B] mt-2">Accuracy Rate</p>
          </div>
          <div className="text-center">
            <AnimatedCounter target={3} suffix="s" />
            <p className="text-[#64748B] mt-2">Avg. Analysis Time</p>
          </div>
          <div className="text-center">
            <AnimatedCounter target={12000} suffix="+" />
            <p className="text-[#64748B] mt-2">Contracts Analyzed</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Export all components and data
export { FEATURES, HOW_IT_WORKS, TESTIMONIALS, PRICING, AnimatedCounter, HeroDocumentAnimation, FeatureCard, TestimonialCard, StatsSection, fadeInUp, staggerContainer };