"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Terminal, Activity, Eye, Zap, ShieldAlert, Award } from "lucide-react";
import GradientCard from "@/components/ui/GradientCard";

const timeline = [
  {
    step: "01",
    title: "Discovery & Blueprint Sprints",
    description: "We align on core product objectives, design aesthetic direction, database schemas, and establish the custom prompt model frameworks."
  },
  {
    step: "02",
    title: "Interactive Prototyping",
    description: "Our design architects build responsive Figma assets and interactive Framer canvases. We finalize video reels scripts and UGC angles."
  },
  {
    step: "03",
    title: "Full-Stack Assembly",
    description: "We build out the Next.js app structure, configure Prisma connection strings, generate Server Actions, and implement Framer scroll animations."
  },
  {
    step: "04",
    title: "Verification & Launch",
    description: "Every page undergoes Core Web Vitals checks. We ensure a 90+ Lighthouse score, confirm database indices are operational, and deploy to Vercel."
  }
];

const values = [
  { icon: <Zap className="h-5 w-5 text-amber-500" />, title: "Aesthetic Excellence", text: "Every layout, shadow, and animation must feel premium. We do not do basic templates." },
  { icon: <Terminal className="h-5 w-5 text-blue-500" />, title: "Engineering Rigor", text: "We write clean, semantic, fully type-safe TypeScript code coupled with stable database ORMs." },
  { icon: <Activity className="h-5 w-5 text-emerald-500" />, title: "AI Acceleration", text: "We utilize Midjourney, Sora, and custom models to produce visual content at warp speed." }
];

export default function AboutPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24 space-y-24">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-semibold uppercase tracking-wider border border-blue-500/15 dark:border-blue-400/15">
          <Sparkles className="h-3.5 w-3.5 fill-blue-500/20" />
          <span>Our Philosophy</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
          Pioneering Synthetic Creative Design.
        </h1>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
          The Blue Intellect is a boutique full-stack engineering and visual design studio. We partner with next-gen SaaS startups and creative labels to design, build, and deploy high-end digital systems.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {values.map((v, idx) => (
          <GradientCard key={idx} glowColor="rgba(59, 130, 246, 0.08)" className="space-y-4">
            <div className="h-10 w-10 rounded-xl bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center border border-neutral-100 dark:border-neutral-800">
              {v.icon}
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">{v.title}</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{v.text}</p>
          </GradientCard>
        ))}
      </section>

      {/* Interactive Process Timeline */}
      <section className="space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">The Sprints</span>
          <h2 className="text-2xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Our Work Lifecycle.
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto">
            We follow a structured 4-step assembly method to ensure design aesthetics remain premium from discovery to launch.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto border-l-2 border-neutral-200/60 dark:border-neutral-800 ml-4 md:ml-auto md:border-l-0 md:before:absolute md:before:left-1/2 md:before:h-full md:before:w-0.5 md:before:bg-neutral-200/60 dark:md:before:bg-neutral-800 pl-8 md:pl-0 space-y-12">
          {timeline.map((step, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`relative flex flex-col md:w-1/2 ${
                  isLeft ? "md:pr-12 md:mr-auto text-left" : "md:pl-12 md:ml-auto md:items-end text-left md:text-right"
                }`}
              >
                {/* Timeline Circle Node */}
                <div className="absolute top-1.5 -left-[41px] md:-left-auto md:left-1/2 md:-translate-x-1/2 h-5 w-5 rounded-full bg-blue-600 border-4 border-white dark:border-neutral-900 shadow-md" />

                <div className="space-y-2 max-w-md">
                  <span className="text-3xl font-semibold text-blue-500/20 dark:text-blue-400/20">{step.step}</span>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">{step.title}</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Team Crew */}
      <section className="border-t border-neutral-100 dark:border-neutral-800 pt-20 text-center space-y-12">
        <div className="space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">The Crew</span>
          <h2 className="text-2xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Creative & Tech Leadership
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <GradientCard className="p-6 flex flex-col items-center">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
              className="h-20 w-20 rounded-full object-cover shadow-sm ring-2 ring-blue-500/10"
              alt="Sophia Chen"
            />
            <h4 className="mt-4 text-sm font-bold text-neutral-900 dark:text-neutral-50">Sophia Chen</h4>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider mt-1">
              Co-Founder & UI/UX Architect
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 max-w-xs leading-relaxed">
              Ex-Stripe designer focusing on layout grids, spatial motion transitions, and interactive design prototypes.
            </p>
          </GradientCard>

          <GradientCard className="p-6 flex flex-col items-center">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
              className="h-20 w-20 rounded-full object-cover shadow-sm ring-2 ring-blue-500/10"
              alt="Liam O'Connor"
            />
            <h4 className="mt-4 text-sm font-bold text-neutral-900 dark:text-neutral-50">Liam O&apos;Connor</h4>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider mt-1">
              Co-Founder & Lead Systems Engineer
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 max-w-xs leading-relaxed">
              Full-stack engineer focusing on Next.js server frameworks, Prisma schema indexes, and Core Web Vital loads.
            </p>
          </GradientCard>
        </div>
      </section>
    </div>
  );
}
