"use client";

import React from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  borderColor?: string;
}

export default function GradientCard({
  children,
  className,
  glowColor = "rgba(59, 130, 246, 0.12)", // Soft blue spotlight
  borderColor = "group-hover:border-neutral-300/80 dark:group-hover:border-neutral-700/80",
  ...props
}: GradientCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative rounded-3xl border border-neutral-200/40 dark:border-neutral-800/20 bg-white/90 dark:bg-neutral-900/90 p-6 backdrop-blur-sm shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200/20 dark:hover:shadow-none",
        className
      )}
      {...props}
    >
      {/* Spotlight Radial Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              ${glowColor},
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Content wrapper */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}
