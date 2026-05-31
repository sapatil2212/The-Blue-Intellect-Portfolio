"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Sparkles, 
  Terminal, 
  Activity, 
  Zap, 
  Award, 
  ArrowRight,
  Clock,
  Search,
  Calendar,
  Compass,
  LineChart,
  FileText,
  UserCheck,
  Cpu,
  Heart,
  HelpCircle
} from "lucide-react";
import GradientCard from "@/components/ui/GradientCard";

const setsUsApart = [
  {
    step: "01",
    icon: <UserCheck className="h-5 w-5 text-blue-500" />,
    title: "Dedicated Project Manager",
    description: "Experience your project being taken care of by experts at each level."
  },
  {
    step: "02",
    icon: <FileText className="h-5 w-5 text-emerald-500" />,
    title: "Periodic Reports",
    description: "Track the progress of your projects, get the reports delivered in your inbox weekly."
  },
  {
    step: "03",
    icon: <Cpu className="h-5 w-5 text-amber-500" />,
    title: "Tailor-Made Solutions",
    description: "We customise solutions suitable to your needs."
  },
  {
    step: "04",
    icon: <Clock className="h-5 w-5 text-purple-500" />,
    title: "On Time Delivery",
    description: "We stand by our commitments and always deliver projects on time."
  }
];

const approachSteps = [
  {
    step: "01",
    icon: <Search className="h-5 w-5 text-blue-500" />,
    title: "Detailing",
    description: "Understanding your needs and detailing the project requirements."
  },
  {
    step: "02",
    icon: <Calendar className="h-5 w-5 text-teal-500" />,
    title: "Planning",
    description: "Setting up an action plan to achieve desired results."
  },
  {
    step: "03",
    icon: <Compass className="h-5 w-5 text-indigo-500" />,
    title: "Strategy",
    description: "Procedure perceiving to execute plans to accomplish."
  },
  {
    step: "04",
    icon: <Activity className="h-5 w-5 text-pink-500" />,
    title: "Analysis",
    description: "Analysing the problem with attention to even minor details."
  },
  {
    step: "05",
    icon: <Zap className="h-5 w-5 text-amber-500" />,
    title: "Implementation",
    description: "Ensuring effective implementation of strategies and solutions to increase efficiency."
  },
  {
    step: "06",
    icon: <LineChart className="h-5 w-5 text-emerald-500" />,
    title: "Measuring",
    description: "Measure every outcome for its optimum efficacy."
  },
  {
    step: "07",
    icon: <FileText className="h-5 w-5 text-violet-500" />,
    title: "Reporting",
    description: "Report project progress at each level to ensure transparency with clients."
  }
];
export default function AboutPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24 space-y-28">
      
      {/* Section 1: Hero */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/15 dark:border-blue-400/15">
          <Sparkles className="h-3.5 w-3.5 fill-blue-500/20" />
          <span>Our Philosophy</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
          Pioneering Synthetic Creative Design.
        </h1>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-350 leading-relaxed max-w-2xl mx-auto">
          The Blue Intellect is a boutique full-stack engineering and visual design studio. We partner with next-gen startups and creative labels to design, build, and deploy high-end digital systems.
        </p>
      </section>

      {/* Section 2: Why The Blue Intellect / Sets Us Apart */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/15 dark:border-emerald-400/15">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Why The Blue Intellect</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Here’s What Sets Us Apart!
          </h2>
          <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto">
            Experience absolute transparency, bespoke design excellence, and dedicated client-first engineering delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {setsUsApart.map((item, idx) => (
            <GradientCard key={idx} glowColor="rgba(59, 130, 246, 0.08)" className="relative space-y-6 overflow-hidden">
              <div className="absolute top-4 right-4 text-4xl font-black text-neutral-200/40 dark:text-neutral-800/30 select-none">
                {item.step}
              </div>
              <div className="h-10 w-10 rounded-xl bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center border border-neutral-100/50 dark:border-neutral-800/30">
                {item.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">{item.title}</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.description}</p>
              </div>
            </GradientCard>
          ))}
        </div>
      </section>

      {/* Section 3: Our Work Approach */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/15 dark:border-indigo-400/15">
            <Compass className="h-3.5 w-3.5" />
            <span>Methodology</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Our Work Approach
          </h2>
          <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto">
            A meticulous, analytics-driven execution pipeline from deep detailing to optimized campaign delivery.
          </p>
        </div>

        {/* Approach Horizontal/Vertical Grid Journey */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {approachSteps.map((step, idx) => (
            <GradientCard key={idx} glowColor="rgba(59, 130, 246, 0.08)" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-lg bg-blue-500/10 dark:bg-blue-400/5 text-blue-500 flex items-center justify-center border border-blue-500/10">
                  {step.icon}
                </div>
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-850 text-neutral-500 dark:text-neutral-400">
                  Step {step.step}
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">{step.title}</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{step.description}</p>
              </div>
            </GradientCard>
          ))}
        </div>
      </section>

      {/* Section 4: Our Belief Banner & Got a Project CTA */}
      <section className="relative overflow-hidden rounded-3xl border border-neutral-200/30 dark:border-neutral-800/20 bg-neutral-950 p-8 sm:p-12 md:p-16 text-center max-w-5xl mx-auto shadow-2xl">
        {/* Subtle Radial Blue spotlight inside the dark box */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{
            background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.12) 0%, transparent 65%)"
          }}
        />
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/15">
            <Heart className="h-3.5 w-3.5 fill-blue-500/20 text-blue-500 animate-pulse" />
            <span>Our Belief</span>
          </div>
          
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-relaxed font-display max-w-3xl mx-auto">
            "No business is average. You can take your business to the greatest heights. You just need strong determination and a trustworthy marketing partner."
          </h2>
          
          <p className="text-xs sm:text-sm text-neutral-450 leading-relaxed max-w-2xl mx-auto">
            Embark on your dream journey with us and take your business to the next level. Let's discuss your roadmap today.
          </p>
          
          <div className="pt-4">
            <Link
              href="/contact"
              className="glow-button inline-flex items-center gap-2 bg-linear-to-r from-sky-400 via-sky-500 to-blue-600 hover:from-sky-500 hover:to-blue-700 text-white font-extrabold text-xs sm:text-sm px-8 py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] group cursor-pointer"
            >
              <span>Got a project? Let's Discuss!</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
