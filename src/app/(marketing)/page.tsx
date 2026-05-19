"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowRight, ChevronDown, Check, FileText, Upload
} from 'lucide-react';
import { 
  FEATURES, HOW_IT_WORKS, TESTIMONIALS, PRICING, 
  HeroDocumentAnimation, FeatureCard, TestimonialCard, StatsSection,
  fadeInUp, staggerContainer
} from './components';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="max-w-xl"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-[#CCFBF1] rounded-full text-[#0F766E] text-sm font-semibold mb-8">
                <FileText className="w-4 h-4" />
                AI-Powered Contract Analysis
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E293B] tracking-tight leading-tight mb-6">
                Secure Your Contracts with
                <span className="block text-gradient-accent">AI Intelligence</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-lg text-[#64748B] leading-relaxed mb-10 max-w-lg">
                Upload any legal agreement and get instant risk scores, plain-English summaries, and clause benchmarking — all in under 3 seconds.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#1E3A5F] hover:bg-[#152C4A] text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    Start Analyzing Free
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <a href="#how-it-works">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white text-[#1E3A5F] border border-[#E2E8F0] hover:border-[#CBD5E1] px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    See How It Works
                  </motion.button>
                </a>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {["S", "M", "E", "A", "J"].map((l, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-[#1E3A5F] flex items-center justify-center text-white font-bold text-sm border-2 border-white">
                      {l}
                    </div>
                  ))}
                </div>
                <p className="text-[#64748B]">
                  <span className="font-semibold text-[#1E293B]">500+</span> legal teams trust ClauseGuard
                </p>
              </motion.div>
            </motion.div>

            {/* Right Column - Animation */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:flex justify-center items-center"
            >
              <HeroDocumentAnimation />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#94A3B8]"
        >
          <span className="text-xs font-medium">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span variants={fadeInUp} className="text-[#0F766E] font-semibold uppercase tracking-widest text-sm mb-4 block">
              Features
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-[#1E293B] tracking-tight mb-4">
              Everything You Need for Contract Analysis
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-[#64748B] max-w-2xl mx-auto">
              Our AI-powered platform handles the heavy lifting so you can focus on what matters.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={i} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span variants={fadeInUp} className="text-[#0F766E] font-semibold uppercase tracking-widest text-sm mb-4 block">
              Process
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-[#1E293B] tracking-tight mb-4">
              How It Works
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-[#64748B] max-w-xl mx-auto">
              Three simple steps to transform your contract review process.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <div className="w-16 h-16 bg-[#1E3A5F] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <div className="w-14 h-14 bg-[#CCFBF1] rounded-xl flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-6 h-6 text-[#0F766E]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1E293B] mb-3">{step.title}</h3>
                <p className="text-[#64748B] leading-relaxed">{step.desc}</p>
                
                {i < 2 && (
                  <div className="hidden md:block absolute top-20 left-[60%] w-[80%] h-0.5 bg-[#E2E8F0]" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span variants={fadeInUp} className="text-[#0F766E] font-semibold uppercase tracking-widest text-sm mb-4 block">
              Testimonials
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-[#1E293B] tracking-tight">
              Trusted by Legal Professionals
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {TESTIMONIALS.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span variants={fadeInUp} className="text-[#0F766E] font-semibold uppercase tracking-widest text-sm mb-4 block">
              Pricing
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-[#1E293B] tracking-tight mb-4">
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-[#64748B]">
              Start free. Scale when you&apos;re ready.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`relative p-8 rounded-xl ${
                  plan.highlight 
                    ? 'bg-[#1E3A5F] text-white' 
                    : 'bg-white border border-[#E2E8F0]'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0F766E] text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                    Most Popular
                  </div>
                )}
                
                <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-[#1E293B]'}`}>
                  {plan.name}
                </h3>
                
                <div className="flex items-baseline gap-1 mb-4">
                  {plan.price === "Custom" ? (
                    <span className="text-3xl font-bold text-white">Custom</span>
                  ) : (
                    <>
                      <span className={`text-sm font-semibold ${plan.highlight ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>$</span>
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className={`text-sm ${plan.highlight ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>/{plan.period}</span>
                    </>
                  )}
                </div>
                
                <p className={`text-sm mb-6 ${plan.highlight ? 'text-[#CBD5E1]' : 'text-[#64748B]'}`}>
                  {plan.desc}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <Check className={`w-4 h-4 shrink-0 ${plan.highlight ? 'text-[#CCFBF1]' : 'text-[#059669]'}`} />
                      <span className={plan.highlight ? 'text-[#E2E8F0]' : 'text-[#475569]'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/dashboard" className="block">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-lg font-semibold transition-colors ${
                      plan.highlight 
                        ? 'bg-white text-[#1E3A5F] hover:bg-[#F1F5F9]' 
                        : 'bg-[#1E3A5F] text-white hover:bg-[#152C4A]'
                    }`}
                  >
                    {plan.cta}
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-[#1E3A5F]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Secure Your Contracts?
            </h2>
            <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto mb-10">
              Join 500+ legal teams using ClauseGuard to automate contract analysis and protect their business.
            </p>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#0F766E] hover:bg-[#0D9488] text-white px-10 py-4 rounded-lg font-semibold text-lg inline-flex items-center gap-2 transition-colors"
              >
                Get Started for Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}