'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { ArrowUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function Counter({ from = 0, to, duration = 2.5, suffix = '', format = false }: { from?: number, to: number, duration?: number, suffix?: string, format?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(from);
  
  const rounded = useTransform(count, (latest) => {
    const val = Math.round(latest);
    return (format ? val.toLocaleString() : val) + suffix;
  });

  useEffect(() => {
    if (inView) {
      animate(count, to, { duration, ease: "easeOut" });
    }
  }, [count, inView, to, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function StatsSection() {
  const stats = [
    { value: 95, suffix: '%', label: 'Average increase in sales for our clients', progress: 95 },
    { value: 500, suffix: '+', label: 'Satisfied Clients', progress: 100 },
    { value: 99, suffix: '%', label: 'Results improved compared to previous agencies', progress: 99 },
  ];

  return (
    <section className="pt-10 pb-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-display tracking-tight">
            The proof is in the numbers
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-[15px] leading-relaxed">
            Our results speak for themselves. See how we've helped businesses grow.
          </p>
        </div>

        <div className="glass-card rounded-[2rem] p-8 lg:p-12 relative overflow-hidden border border-border/50">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14 items-center relative z-10">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 mb-8">
                  <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(59,130,246,0.15)]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="var(--surface-2)" strokeWidth="4" />
                    <motion.circle 
                      cx="50" cy="50" r="46" fill="none" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round"
                      strokeDasharray="289"
                      initial={{ strokeDashoffset: 289 }}
                      whileInView={{ strokeDashoffset: 289 - (289 * stat.progress) / 100 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 2.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white tracking-tight">
                      <Counter to={stat.value} suffix={stat.suffix} />
                    </span>
                  </div>
                  <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-accent/20 text-accent transition-transform hover:-translate-y-1" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                     <ArrowUp className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[13px] font-medium text-muted max-w-[200px] mx-auto leading-relaxed">{stat.label}</p>
              </div>
            ))}

            <div className="rounded-[1.5rem] p-8 text-center flex flex-col items-center justify-center h-full relative overflow-hidden border transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]" style={{ background: 'var(--surface-1)', borderColor: 'var(--accent)' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10 w-full flex flex-col items-center gap-2">
                <h3 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                  <Counter to={350000} format={true} suffix="+" duration={3} />
                </h3>
                <p className="text-[13px] text-muted mb-8 max-w-[180px] mx-auto leading-relaxed">Leads generated for our clients</p>
                <Link href="/contact" className="glow-button px-6 py-3 rounded-full text-[13px] font-bold text-white w-full flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(59,130,246,0.3)] border border-accent/50">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
