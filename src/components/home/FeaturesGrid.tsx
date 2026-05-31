'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Globe as GlobeIcon, Sparkles, ScanSearch, User, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Data-Backed Strategies',
    description: 'We rely on comprehensive analytics to develop targeted campaigns that guarantee measurable progress and high conversion rates.',
  },
  {
    icon: <GlobeIcon className="w-6 h-6" />,
    title: 'Local & Global SEO',
    description: 'Expand your reach. We optimize your brand to capture local market share while standing out on the global stage.',
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Full-Scale Branding',
    description: 'From logo design to complete brand revamps, we craft memorable identities that resonate and leave lasting impressions.',
  }
];

export default function FeaturesGrid() {
  return (
    <section className="pt-24 pb-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Large Feature Card */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-8 lg:p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-accent/5 to-transparent rounded-bl-full" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6">
                {features[0].icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{features[0].title}</h3>
              <p className="text-muted leading-relaxed max-w-lg">{features[0].description}</p>
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Metric 1: Bar Chart */}
                <div className="aspect-square rounded-xl p-4 flex flex-col justify-between" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                  <p className="text-xs font-medium text-muted">Traffic</p>
                  <div className="flex items-end justify-between h-14 gap-1.5 mt-auto">
                    {[45, 70, 50, 95, 60, 100].map((h, j) => (
                      <motion.div
                        key={j}
                        initial={{ height: '0%' }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1.2, delay: j * 0.1, repeat: Infinity, repeatType: 'reverse', repeatDelay: 2 }}
                        className="w-full rounded-t-sm"
                        style={{ background: 'var(--accent)' }}
                      />
                    ))}
                  </div>
                </div>

                {/* Metric 2: ROI Line */}
                <div className="aspect-square rounded-xl p-4 flex flex-col justify-between relative overflow-hidden" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                  <p className="text-xs font-medium text-muted">Conversion</p>
                  <div className="text-2xl font-bold text-white mt-1">+248%</div>
                  <svg className="absolute bottom-0 left-0 w-full h-1/2" viewBox="0 0 100 50" preserveAspectRatio="none">
                    <motion.path
                      d="M0 50 Q 25 10, 50 30 T 100 0 L 100 50 Z"
                      fill="url(#cardGradient)"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', repeatDelay: 3 }}
                    />
                    <defs>
                      <linearGradient id="cardGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Metric 3: Active Campaigns */}
                <div className="hidden md:flex aspect-square rounded-xl p-4 flex-col justify-center items-center gap-2" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                  <div className="relative flex h-12 w-12 mt-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-20" style={{ background: 'var(--accent)' }}></span>
                    <span className="relative inline-flex flex-col rounded-full h-12 w-12 border items-center justify-center" style={{ background: 'var(--surface-1)', borderColor: 'var(--accent)' }}>
                      <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs font-medium text-muted uppercase tracking-wider mt-3 text-center">Active<br/>Campaigns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Small Feature */}
          <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6">
              {features[1].icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{features[1].title}</h3>
            <p className="text-sm text-muted leading-relaxed">{features[1].description}</p>
            <div className="mt-6 flex flex-col gap-3">
              {/* Fake Search Bar Animation */}
              <div className="w-full h-10 rounded-lg flex items-center px-3 gap-2" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <ScanSearch className="w-4 h-4 text-muted-foreground" />
                <motion.div 
                  initial={{ width: '10%' }} 
                  animate={{ width: '70%' }} 
                  transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
                  className="h-1.5 rounded-full" 
                  style={{ background: 'var(--accent)' }}
                />
              </div>
              {/* Tags / Benefits */}
              <div className="flex gap-2 flex-wrap">
                {['#1 Rankings', 'Organic Traffic', 'More Leads'].map((p, i) => (
                  <motion.div 
                    key={p} 
                    initial={{ opacity: 0.4, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity, repeatType: 'reverse' }}
                    className="h-8 px-3 rounded-md flex items-center justify-center text-[10px] sm:text-xs font-semibold text-accent/80 whitespace-nowrap" 
                    style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
                  >
                    {p}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          {/* WHAT WE DO */}
          <div className="glass-card rounded-2xl p-8 relative overflow-hidden flex flex-col">
            <h3 className="text-xs font-bold text-accent tracking-wider uppercase mb-1">What We Do</h3>
            <p className="text-xl font-bold text-white mb-3">We solve digital challenges.</p>
            <p className="text-sm text-muted leading-relaxed mb-8">
              Together, we help our clients achieve tangible, measurable results. Focused on business outcomes, we bring a unique set of expertise and skills to the party.
            </p>
            <div className="mt-auto flex flex-col gap-4">
              {[75, 50, 90].map((w, j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="h-2.5 flex-1 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                    <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light" style={{ width: `${w}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground w-8 text-right">{w}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* MORE ABOUT US */}
          <div className="glass-card rounded-2xl p-8 relative overflow-hidden border border-border/50 flex flex-col justify-center">
            <div className="space-y-8">
              <div>
                <h5 className="text-base font-semibold text-white mb-2 flex items-center gap-2.5">
                  <User className="w-5 h-5 text-accent" /> Better Audience
                </h5>
                <p className="text-[13px] sm:text-[14px] text-muted leading-relaxed pl-7">
                  We target the right customers using advanced strategies to maximize campaign effectiveness.
                </p>
              </div>
              <div>
                <h5 className="text-base font-semibold text-white mb-2 flex items-center gap-2.5">
                  <BarChart3 className="w-5 h-5 text-accent" /> Better Analytics
                </h5>
                <p className="text-[13px] sm:text-[14px] text-muted leading-relaxed pl-7">
                  We use data-driven insights to improve performance, boost conversions, and maximize ROI.
                </p>
              </div>
              <div>
                <h5 className="text-base font-semibold text-white mb-2 flex items-center gap-2.5">
                  <TrendingUp className="w-5 h-5 text-accent" /> Better Outcomes
                </h5>
                <p className="text-[13px] sm:text-[14px] text-muted leading-relaxed pl-7">
                  We deliver measurable growth in your online presence and business profitability.
                </p>
              </div>
            </div>
          </div>

          {/* Static Objects panel */}
          <div className="glass-card rounded-2xl p-8 relative overflow-hidden border border-border/50 flex flex-col justify-center items-center gap-5">
            <div className="absolute inset-0 bg-accent/10 blur-[80px] rounded-full pointer-events-none" />
            
            {/* Node 1 */}
            <div className="w-full relative z-10 glass-card p-4 sm:p-5 flex items-center gap-5 rounded-xl border border-white/5 transition-colors hover:bg-white/5 bg-surface-1/50">
              <div className="shrink-0 w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent"><User className="w-5 h-5" /></div>
              <div>
                <p className="text-[15px] font-bold text-white mb-0.5">Target Verified</p>
                <p className="text-xs sm:text-sm text-muted">+14.2k Audiences</p>
              </div>
            </div>

            {/* Node 2 */}
            <div className="w-full relative z-10 glass-card p-4 sm:p-5 flex items-center gap-5 rounded-xl border border-white/5 transition-colors hover:bg-white/5 bg-surface-1/50">
              <div className="shrink-0 w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400"><BarChart3 className="w-5 h-5" /></div>
              <div>
                <p className="text-[15px] font-bold text-white mb-0.5">Data Scanned</p>
                <p className="text-xs sm:text-sm text-muted">98.4% Accuracy</p>
              </div>
            </div>

            {/* Node 3 */}
            <div className="w-full relative z-10 glass-card p-4 sm:p-5 flex items-center gap-5 rounded-xl border border-white/5 transition-colors hover:bg-white/5 bg-surface-1/50">
              <div className="shrink-0 w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400"><TrendingUp className="w-5 h-5" /></div>
              <div>
                <p className="text-[15px] font-bold text-white mb-0.5">ROI Projected</p>
                <p className="text-xs sm:text-sm text-muted">Exceeding Targets</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
