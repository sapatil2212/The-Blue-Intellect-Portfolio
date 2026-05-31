'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="section-glow section-glow-top" />
      <div className="section-glow section-glow-left" />
      <div className="section-glow section-glow-right" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight font-display">
          Ready to scale your{' '}
          <span className="gradient-text">digital growth?</span>
        </h2>
        <p className="text-lg text-muted max-w-2xl mx-auto mb-10">
          Partner with The Blue Intellect and dominate your market. Start unlocking incredible results and double your impact today.
        </p>
        <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 w-full px-2">
          <Link href="/contact" className="glow-button px-4 py-2.5 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-semibold rounded-md inline-flex items-center justify-center gap-1.5 sm:gap-2 flex-1 sm:flex-none max-w-[160px] sm:max-w-none text-center" style={{ color: '#fff' }}>
            Free Proposal <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 hidden xs:block" />
          </Link>
          <Link href="/services" className="px-4 py-2.5 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-medium text-fg rounded-md inline-flex items-center justify-center gap-1.5 sm:gap-2 transition-colors flex-1 sm:flex-none max-w-[160px] sm:max-w-none text-center whitespace-nowrap" style={{ border: '1px solid var(--border)', background: 'var(--surface-1)' }}>
            Talk to Expert <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 hidden xs:block" />
          </Link>
        </div>
      </div>
    </section>
  );
}
