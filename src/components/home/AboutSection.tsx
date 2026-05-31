'use client';

import React from 'react';
import { Sparkles, Zap, Terminal, Activity } from 'lucide-react';
import GradientCard from '../ui/GradientCard';

const values = [
  { icon: <Zap className="h-5 w-5 text-amber-500" />, title: "Aesthetic Excellence", text: "Every layout, shadow, and animation must feel premium. We do not do basic templates." },
  { icon: <Terminal className="h-5 w-5 text-blue-500" />, title: "Engineering Rigor", text: "We write clean, semantic, fully type-safe TypeScript code coupled with stable database ORMs." },
  { icon: <Activity className="h-5 w-5 text-emerald-500" />, title: "AI Acceleration", text: "We utilize Midjourney, Sora, and custom models to produce visual content at warp speed." }
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

      </div>
    </section>
  );
}
