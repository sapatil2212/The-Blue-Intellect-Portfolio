"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  className?: string;
}

export default function StatsCounter({
  value,
  suffix = "",
  prefix = "",
  label,
  className,
}: StatsCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Animate once when element is scrolled within viewport
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 25,
    stiffness: 80,
  });

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
  }, [springValue]);

  return (
    <div ref={ref} className={cn("text-center", className)}>
      <div className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight flex items-center justify-center gap-0.5">
        <span className="text-neutral-400 dark:text-neutral-500 font-medium">{prefix}</span>
        <span>{displayValue}</span>
        <span className="text-blue-600 dark:text-blue-500 font-light">{suffix}</span>
      </div>
      <p className="mt-2 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
        {label}
      </p>
    </div>
  );
}
