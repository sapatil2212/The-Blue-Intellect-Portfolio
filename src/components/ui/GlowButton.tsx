"use client";

import React from "react";
import { cn } from "@/lib/utils";
import AnimatedButton from "./AnimatedButton";

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  magneticStrength?: number;
}

export default function GlowButton({
  children,
  className,
  glowColor = "from-sky-400 via-cyan-400 to-blue-500",
  magneticStrength = 0.3,
  ...props
}: GlowButtonProps) {
  return (
    <div className="relative group">
      {/* Background Glow Layer */}
      <div
        className={cn(
          "absolute -inset-1 rounded-full bg-linear-to-r opacity-50 blur-lg group-hover:opacity-85 transition-all duration-500 group-hover:scale-102",
          glowColor
        )}
      />
      {/* Button Layer */}
      <AnimatedButton
        magneticStrength={magneticStrength}
        className={cn(
          "bg-linear-to-r from-sky-400 via-sky-500 to-blue-600 text-white font-medium border-0 shadow-lg shadow-sky-500/20 hover:from-sky-550 hover:to-blue-700 hover:shadow-sky-500/30 hover:scale-[1.01] active:scale-95 transition-all duration-300",
          className
        )}
        {...props}
      >
        {children}
      </AnimatedButton>
    </div>
  );
}
