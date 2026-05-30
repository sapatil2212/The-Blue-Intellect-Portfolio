"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles,
  AlertCircle,
  FileText,
  ChevronRight,
  HelpCircle,
  ShieldCheck,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { servicesData } from "@/lib/servicesData";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ServicePage({ params }: PageProps) {
  const { slug } = use(params);
  const service = useMemo(() => servicesData.find((s) => s.slug === slug), [slug]);

  if (!service) {
    notFound();
  }

  const [activeTab, setActiveTab] = useState<"challenge" | "solution">("challenge");

  return (
    <div className="w-full relative overflow-hidden bg-background">
      {/* ── Background Glow Blooms ── */}
      <div 
        className={cn(
          "absolute top-[-10%] left-[50%] -translate-x-[50%] w-[900px] h-[550px] rounded-full opacity-20 pointer-events-none blur-[140px] z-0 transition-colors duration-500",
          service.slug === "ui-ux-design" && "bg-blue-500",
          service.slug === "web-development" && "bg-purple-500",
          service.slug === "graphic-design" && "bg-pink-500",
          service.slug === "digital-marketing" && "bg-emerald-500",
          service.slug === "email-marketing" && "bg-amber-500",
          service.slug === "strategy-consulting" && "bg-cyan-500",
          service.slug === "data-analytics" && "bg-blue-500",
          service.slug === "google-cloud" && "bg-green-500",
          service.slug === "domain-hosting" && "bg-indigo-500",
          service.slug === "tata-tele-services" && "bg-sky-500",
          service.slug === "whatsapp-sms-services" && "bg-green-500",
          service.slug === "ivr-services" && "bg-purple-500"
        )}
      />

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24 space-y-20 relative z-10">
        
        {/* ── Breadcrumb navigation ── */}
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground select-none">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="size-3" />
          <span className="text-muted-foreground/60">Services</span>
          <ChevronRight className="size-3" />
          <span className="text-primary dark:text-primary-foreground font-bold">{service.title}</span>
        </div>

        {/* ── Service Hero Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-widest border border-primary/15">
              <Sparkles className="size-3.5 fill-primary/20" />
              <span>{service.category}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1] font-display">
              {service.title.split(" ").map((word, idx) => {
                if (idx >= service.title.split(" ").length - 2) {
                  return <span key={idx} className="gradient-text"> {word}</span>;
                }
                return <span key={idx}> {word}</span>;
              })}
            </h1>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">
              {service.subdesc}
            </p>

            {/* Micro value badges */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {service.stats.map((stat, i) => (
                <div key={i} className="rounded-2xl border border-border/80 glass-card p-4 flex flex-col justify-center items-center text-center shadow-lg shadow-neutral-900/5 dark:shadow-neutral-950/20">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">{stat.label}</span>
                  <span 
                    className="text-2xl font-black mt-1 flex items-center justify-center gap-1 font-display"
                    style={{ color: service.accentColor }}
                  >
                    <TrendingUp className="size-5 shrink-0" />
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Right Visuals */}
          <div className="lg:col-span-2">
            <div className="relative aspect-square rounded-[2rem] border border-border/80 glass-card overflow-hidden shadow-2xl p-2 flex items-center justify-center bg-muted/20">
              <div 
                className="absolute inset-0 opacity-10 blur-[80px]" 
                style={{ backgroundColor: service.accentColor }}
              />
              <img
                src={service.imagePath}
                alt={service.title}
                className="w-full h-full object-cover rounded-[1.8rem] shadow-lg transition-transform duration-500 hover:scale-102"
                onError={(e) => {
                  // Fallback to abstract SVG template if image hasn't finished generating
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              
              {/* Fallback abstract visual graphic inside container */}
              <div className="w-40 h-40 flex items-center justify-center text-primary shrink-0 opacity-80 animate-pulse">
                <Sparkles className="size-20" style={{ color: service.accentColor }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Service Checklist Features ── */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground font-display">
              Core Attributes & Deliverables
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              We cover all phases of this service to ensure top-tier strategic results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.bullets.map((bullet, i) => (
              <div key={i} className="group rounded-2xl border border-border/80 glass-card p-6 flex flex-col justify-between hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                <div className="space-y-4">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-primary/5"
                    style={{ backgroundColor: `${service.accentColor}12`, color: service.accentColor }}
                  >
                    <CheckCircle2 className="size-5" />
                  </div>
                  <h3 className="font-extrabold text-foreground text-sm tracking-tight group-hover:text-primary transition-colors">
                    {bullet}
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-semibold">
                    Highly optimized operations tailored for maximum market output.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Case Study: Challenge vs Our Solution ── */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground font-display">
              Case Study & Solution Strategy
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              See how we analyze business constraints and execute solutions.
            </p>
          </div>

          {/* Interactive Tablet/Desktop split view */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
            
            {/* Left: Interactive Tab Controls */}
            <div className="lg:col-span-2 flex flex-col justify-between p-6 rounded-3xl border border-border/80 glass-card">
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-bold text-primary tracking-widest">Methodology</span>
                  <h3 className="text-lg font-bold text-foreground tracking-tight">Structured Performance Optimization</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We follow a 3-step structured lifecycle model: analyzing root challenge bottlenecks, mapping tailored programmatic architectures, and ensuring verified positive output.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setActiveTab("challenge")}
                    className={cn(
                      "px-4 py-3 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer border",
                      activeTab === "challenge"
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        : "bg-muted/30 hover:bg-muted text-muted-foreground border-border/40"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <AlertCircle className="size-4 shrink-0" />
                      1. Analyze Challenge
                    </span>
                    <ChevronRight className="size-3.5" />
                  </button>
                  
                  <button
                    onClick={() => setActiveTab("solution")}
                    className={cn(
                      "px-4 py-3 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer border",
                      activeTab === "solution"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-muted/30 hover:bg-muted text-muted-foreground border-border/40"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="size-4 shrink-0" />
                      2. Implement Solution
                    </span>
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-border/40 flex items-center gap-2.5 text-[11px] text-muted-foreground font-semibold">
                <Clock className="size-3.5 text-primary" />
                <span>Estimated Integration: 2-3 Weeks</span>
              </div>
            </div>

            {/* Right: Content Cards */}
            <div className="lg:col-span-3 min-h-[300px] flex">
              <AnimatePresence mode="wait">
                {activeTab === "challenge" ? (
                  <motion.div
                    key="challenge"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="w-full rounded-3xl border border-rose-500/15 dark:border-rose-500/10 bg-rose-500/5 p-8 flex flex-col justify-between shadow-xl"
                  >
                    <div className="space-y-4">
                      <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                        <AlertCircle className="size-4" />
                      </div>
                      <h4 className="text-rose-500 font-extrabold text-sm uppercase tracking-wider">
                        Business Challenge Block
                      </h4>
                      <p className="text-sm font-extrabold text-foreground tracking-tight">
                        Analyzing root constraints and bottlenecks
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-2 font-semibold">
                        {service.challenge}
                      </p>
                    </div>

                    <div className="mt-6 flex gap-2 flex-wrap">
                      {["Slow Load", "Bounce", "Loss of ROI"].map((t) => (
                        <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/10">
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="solution"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="w-full rounded-3xl border border-emerald-500/15 dark:border-emerald-500/10 bg-emerald-500/5 p-8 flex flex-col justify-between shadow-xl"
                  >
                    <div className="space-y-4">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <ShieldCheck className="size-4" />
                      </div>
                      <h4 className="text-emerald-500 font-extrabold text-sm uppercase tracking-wider">
                        Our Solution Strategy
                      </h4>
                      <p className="text-sm font-extrabold text-foreground tracking-tight">
                        Tailored programmatic engineering mapping
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-2 font-semibold">
                        {service.solution}
                      </p>
                      <p className="text-xs font-bold text-foreground pt-4 border-t border-border/40 mt-4 flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-emerald-500" />
                        Outcomes: {service.outcomes}
                      </p>
                    </div>

                    <div className="mt-6 flex gap-2 flex-wrap">
                      {["Next-Gen Stack", "Security", "Scale"].map((t) => (
                        <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/10">
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* ── Interactive Booking CTA Banner ── */}
        <div className="relative rounded-[2.5rem] overflow-hidden border border-border/80 glass-card p-10 md:p-14 text-center space-y-6 shadow-2xl">
          <div 
            className="absolute inset-0 opacity-15 blur-[120px] rounded-full pointer-events-none" 
            style={{ backgroundColor: service.accentColor }}
          />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground font-display">
              Ready to Optimize Your <span className="gradient-text">{service.title}</span>?
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-semibold">
              Book a technical strategic consultation call with our team. We will analyze your infrastructure and present a bulletproof growth action plan.
            </p>
            
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="glow-button w-full sm:w-auto h-11 px-8 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 text-white cursor-pointer active:scale-98"
                style={{ backgroundColor: service.accentColor }}
              >
                <span>Strategic Booking Call</span>
                <ArrowRight className="size-4 shrink-0" />
              </Link>
              
              <Link
                href="/pricing"
                className="w-full sm:w-auto h-11 px-6 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                Explore Pricing Models
                <ArrowUpRight className="size-3.5 shrink-0" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
