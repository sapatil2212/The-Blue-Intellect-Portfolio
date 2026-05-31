'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Terminal, Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import GradientCard from '../ui/GradientCard';
import AnimatedButton from '../ui/AnimatedButton';

const values = [
  { icon: <Zap className="h-5 w-5 text-amber-500" />, title: "Aesthetic Excellence", text: "Every layout, shadow, and animation must feel premium. We do not do basic templates." },
  { icon: <Terminal className="h-5 w-5 text-blue-500" />, title: "Engineering Rigor", text: "We write clean, semantic, fully type-safe TypeScript code coupled with stable database ORMs." },
  { icon: <Activity className="h-5 w-5 text-emerald-500" />, title: "AI Acceleration", text: "We utilize Midjourney, Sora, and custom models to produce visual content at warp speed." }
];

const timeline = [
  {
    step: "01",
    title: "Discovery & Blueprint",
    description: "We align on core product objectives, design aesthetic direction, database schemas, and establish custom prompt frameworks."
  },
  {
    step: "02",
    title: "Interactive Prototyping",
    description: "Our design architects build responsive Figma assets and interactive Framer canvases to map perfect user flows."
  },
  {
    step: "03",
    title: "Full-Stack Assembly",
    description: "We build out the Next.js app structure, configure Prisma schemas, generate Server Actions, and execute motion assets."
  },
  {
    step: "04",
    title: "Launch & Optimization",
    description: "Every page undergoes strict Core Web Vitals checks. We ensure a 90+ score and deploy to scalable Vercel containers."
  }
];

export default function AboutSection() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/15 dark:border-blue-400/15">
            <Sparkles className="h-3.5 w-3.5 fill-blue-500/20" />
            <span>Our Philosophy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-display">
            Pioneering Synthetic Creative Design
          </h2>
          <p className="text-sm md:text-base text-muted leading-relaxed max-w-2xl mx-auto">
            The Blue Intellect is a boutique full-stack engineering and visual design studio. We partner with next-gen startups and creative labels to design, build, and deploy high-end digital systems.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, idx) => (
            <GradientCard key={idx} glowColor="rgba(59, 130, 246, 0.04)" className="space-y-4 p-6 bg-card-bg border border-border/40 hover:border-accent/30 transition-all rounded-2xl">
              <div className="h-10 w-10 rounded-xl bg-surface-1 flex items-center justify-center border border-border/60 shrink-0">
                {v.icon}
              </div>
              <h3 className="text-base font-bold text-white">{v.title}</h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">{v.text}</p>
            </GradientCard>
          ))}
        </div>

        {/* Timeline Process */}
        <div className="space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">The Sprints</span>
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Our Work Lifecycle</h3>
            <p className="text-xs text-muted max-w-md mx-auto">
              We follow a structured 4-step assembly method to ensure design aesthetics remain premium from discovery to launch.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto border-l border-border ml-4 md:ml-auto md:border-l-0 md:before:absolute md:before:left-1/2 md:before:h-full md:before:w-[1px] md:before:bg-border pl-8 md:pl-0 space-y-12">
            {timeline.map((step, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: isLeft ? -15 : 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`relative flex flex-col md:w-1/2 ${
                    isLeft ? "md:pr-12 md:mr-auto text-left" : "md:pl-12 md:ml-auto md:items-end text-left md:text-right"
                  }`}
                >
                  <div className="absolute top-1.5 -left-[41px] md:-left-auto md:left-1/2 md:-translate-x-1/2 h-4 w-4 rounded-full bg-accent border-2 border-[var(--bg)] shadow-md" />

                  <div className="space-y-2 max-w-md">
                    <span className="text-2xl font-bold text-accent/20 block">{step.step}</span>
                    <h4 className="text-base font-bold text-white">{step.title}</h4>
                    <p className="text-xs text-muted leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-center pt-8">
            <Link href="/about">
              <AnimatedButton className="bg-surface-1 border border-border text-white text-xs font-semibold px-6 py-3 rounded-xl hover:bg-surface-2 transition-all">
                <span>Learn More About Us</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </AnimatedButton>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
