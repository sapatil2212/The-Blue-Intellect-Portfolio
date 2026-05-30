"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Compass, Eye, ShieldAlert, Sparkles } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 relative overflow-hidden bg-neutral-50/50">
      
      {/* Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />

      {/* Grid overlay for texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg space-y-8 flex flex-col items-center">
        
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-extrabold uppercase tracking-wider border border-rose-100"
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Error 404</span>
        </motion.div>

        {/* Huge Animated 404 Glassmorphic Text */}
        <div className="relative">
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="text-[120px] md:text-[160px] font-black tracking-tighter leading-none select-none text-transparent bg-clip-text bg-gradient-to-b from-neutral-800 to-neutral-500/80 drop-shadow-sm filter"
          >
            404
          </motion.h1>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[110%] h-[60%] bg-white/30 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rotate-[-4deg] flex items-center justify-center">
              <span className="text-[10px] font-extrabold tracking-widest text-neutral-800/80 uppercase">
                Dimension Fragmented
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-3"
        >
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
            Lost in creative hyperspace.
          </h2>
          <p className="text-xs text-neutral-500 max-w-sm leading-relaxed mx-auto">
            The design path or project model directory you are seeking doesn&apos;t exist or has been compiled to a different namespace.
          </p>
        </motion.div>

        {/* Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4"
        >
          <Link href="/" className="w-full sm:w-auto">
            <button className="w-full h-11 px-6 rounded-xl bg-neutral-900 text-white text-xs font-bold transition-all duration-300 hover:bg-neutral-800 active:scale-[0.98] flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Base</span>
            </button>
          </Link>
          <Link href="/work" className="w-full sm:w-auto">
            <button className="w-full h-11 px-6 rounded-xl border border-neutral-200 bg-white text-neutral-800 text-xs font-bold transition-all duration-300 hover:border-neutral-300 hover:text-neutral-950 active:scale-[0.98] flex items-center justify-center gap-2">
              <Compass className="h-4 w-4" />
              <span>Explore Projects</span>
            </button>
          </Link>
        </motion.div>

        {/* Simple inline links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex gap-4 pt-6 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400"
        >
          <Link href="/pricing" className="hover:text-neutral-900 transition-colors">Pricing</Link>
          <span>•</span>
          <Link href="/about" className="hover:text-neutral-900 transition-colors">About</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-neutral-900 transition-colors">Contact</Link>
        </motion.div>

      </div>
    </div>
  );
}
