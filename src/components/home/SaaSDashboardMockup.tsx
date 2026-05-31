'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, TrendingUp, Users, DollarSign, ArrowUpRight, 
  Layers, Settings, Bell, Search, Sparkles, Check, Play
} from 'lucide-react';

export default function SaaSDashboardMockup() {
  const [liveRevenue, setLiveRevenue] = useState(12840);
  const [latestLead, setLatestLead] = useState({ name: 'Alex M.', action: 'signed up', time: 'Just now' });

  // Simulate real-time SaaS dashboard updates
  useEffect(() => {
    const revenueInterval = setInterval(() => {
      setLiveRevenue(prev => prev + Math.floor(Math.random() * 15) + 5);
    }, 3000);

    const names = ['Sarah K.', 'David L.', 'Elena R.', 'Marcus T.', 'Chloe W.', 'Ivan B.'];
    const actions = ['booked discovery', 'registered event', 'started trial', 'requested proposal'];
    
    const leadInterval = setInterval(() => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setLatestLead({
        name: randomName,
        action: randomAction,
        time: 'Just now'
      });
    }, 7000);

    return () => {
      clearInterval(revenueInterval);
      clearInterval(leadInterval);
    };
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-16 px-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      
      {/* Background radial highlight glow */}
      <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Floating Badge 1: Lead capture notifications */}
      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-6 top-[25%] z-20 hidden md:flex items-center gap-3 p-3.5 rounded-xl border border-emerald-500/20 bg-black/80 backdrop-blur-md shadow-2xl shadow-emerald-500/5 max-w-[200px]"
      >
        <div className="h-7 w-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Check className="h-4 w-4" />
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold text-white leading-none mb-0.5">{latestLead.name}</p>
          <p className="text-[9px] text-neutral-400 leading-none">{latestLead.action} · {latestLead.time}</p>
        </div>
      </motion.div>

      {/* Floating Badge 2: Premium conversion indicator */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -right-8 bottom-[20%] z-20 hidden md:flex flex-col gap-1.5 p-4 rounded-xl border border-blue-500/20 bg-black/80 backdrop-blur-md shadow-2xl shadow-blue-500/5 min-w-[170px] text-left"
      >
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Growth Engine</span>
          <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
        </div>
        <div>
          <span className="text-2xl font-black text-white leading-none">+248%</span>
          <p className="text-[9px] text-neutral-400 mt-1 leading-normal">Average ROI acceleration projects</p>
        </div>
      </motion.div>

      {/* Main Glassmorphic Dashboard Window Container */}
      <div 
        className="glass-card w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-neutral-800 bg-neutral-950/40"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Browser header navigation bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-900 bg-neutral-950/80">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
          </div>
          
          {/* Simulated URL bar */}
          <div className="w-[60%] sm:w-[45%] h-6 rounded-md bg-neutral-900/60 border border-neutral-800/40 flex items-center justify-center px-2 gap-1.5 text-[10px] text-neutral-500 font-mono">
            <Search className="h-2.5 w-2.5" />
            <span>theblueintellect.com/dashboard</span>
          </div>

          <div className="flex items-center gap-2">
            <Bell className="h-3.5 w-3.5 text-neutral-500 hover:text-white transition-colors cursor-pointer" />
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[9px] font-bold text-white">
              BI
            </div>
          </div>
        </div>

        {/* Dashboard Workstation Body */}
        <div className="flex h-[320px] sm:h-[400px] w-full">
          
          {/* Sidebar menu */}
          <div className="w-14 sm:w-16 border-r border-neutral-900 bg-neutral-950/40 flex flex-col items-center py-6 gap-6 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Sparkles className="h-4 w-4" />
            </div>
            
            <nav className="flex flex-col gap-4 mt-4">
              <div className="h-8 w-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center cursor-pointer">
                <Activity className="h-4 w-4" />
              </div>
              <div className="h-8 w-8 rounded-lg text-neutral-600 hover:text-neutral-300 transition-colors flex items-center justify-center cursor-pointer">
                <Layers className="h-4 w-4" />
              </div>
              <div className="h-8 w-8 rounded-lg text-neutral-600 hover:text-neutral-300 transition-colors flex items-center justify-center cursor-pointer">
                <Settings className="h-4 w-4" />
              </div>
            </nav>
          </div>

          {/* Main workspace panels */}
          <div className="flex-1 p-4 sm:p-6 overflow-hidden flex flex-col gap-4 text-left">
            
            {/* Top row cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 shrink-0">
              {/* Stat card 1 */}
              <div className="rounded-xl border border-neutral-900 bg-neutral-950/60 p-3.5">
                <div className="flex items-center justify-between text-neutral-500 mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Revenue</span>
                  <DollarSign className="h-3.5 w-3.5 text-blue-400" />
                </div>
                <div className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  ${liveRevenue.toLocaleString()}
                </div>
                <span className="text-[9px] text-emerald-400 font-medium inline-flex items-center gap-0.5 mt-0.5">
                  <ArrowUpRight className="h-2 w-2" /> +18.4% this mo
                </span>
              </div>

              {/* Stat card 2 */}
              <div className="rounded-xl border border-neutral-900 bg-neutral-950/60 p-3.5">
                <div className="flex items-center justify-between text-neutral-500 mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Active Users</span>
                  <Users className="h-3.5 w-3.5 text-purple-400" />
                </div>
                <div className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  4,821
                </div>
                <span className="text-[9px] text-emerald-400 font-medium inline-flex items-center gap-0.5 mt-0.5">
                  <ArrowUpRight className="h-2 w-2" /> +12.3% live pulse
                </span>
              </div>

              {/* Stat card 3: Hidden on mobile, visible on desktop */}
              <div className="hidden lg:block rounded-xl border border-neutral-900 bg-neutral-950/60 p-3.5">
                <div className="flex items-center justify-between text-neutral-500 mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Conversion</span>
                  <Activity className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <div className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  4.82%
                </div>
                <span className="text-[9px] text-emerald-400 font-medium inline-flex items-center gap-0.5 mt-0.5">
                  <ArrowUpRight className="h-2 w-2" /> +3.1% optimization
                </span>
              </div>
            </div>

            {/* Growth Graph panel */}
            <div className="flex-1 rounded-xl border border-neutral-900 bg-neutral-950/80 p-4 relative overflow-hidden flex flex-col justify-between">
              
              {/* Graph top details */}
              <div className="flex items-center justify-between shrink-0 mb-4">
                <div>
                  <h4 className="text-xs font-bold text-white">Campaign Conversion Growth</h4>
                  <p className="text-[9px] text-neutral-500 mt-0.5">Real-time organic traffic acquisitions via Google Ads & SEO campaigns</p>
                </div>
                <div className="flex items-center gap-1.5 bg-neutral-900/60 border border-neutral-800/40 rounded-md px-2 py-0.5 text-[9px] text-neutral-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping inline-block" />
                  <span>Real-time Live</span>
                </div>
              </div>

              {/* Graphical representation (Sleek drawing SVG) */}
              <div className="flex-1 w-full relative min-h-[100px] flex items-end">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(255,255,255,0.03)" strokeWidth="0.2" />
                  <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="0.2" />
                  <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="0.2" />

                  {/* Gradient area under line */}
                  <defs>
                    <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  <motion.path
                    d="M0 38 Q 15 35, 30 24 T 60 14 T 80 8 T 100 2 L 100 40 L 0 40 Z"
                    fill="url(#areaGlow)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />

                  {/* Growth Line Path */}
                  <motion.path
                    d="M0 38 Q 15 35, 30 24 T 60 14 T 80 8 T 100 2"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2.2, ease: "easeInOut" }}
                  />

                  {/* Nodes on graph */}
                  <motion.circle 
                    cx="30" cy="24" r="1" fill="var(--accent)" 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }}
                  />
                  <motion.circle 
                    cx="60" cy="14" r="1" fill="var(--accent)" 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 }}
                  />
                  <motion.circle 
                    cx="80" cy="8" r="1.2" fill="var(--accent-light)" 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.6 }}
                  />
                  <motion.circle 
                    cx="100" cy="2" r="1.5" fill="var(--accent-light)" 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.0 }}
                  />
                </svg>

                {/* Graph coordinates labeling */}
                <div className="absolute inset-x-0 bottom-0 flex justify-between text-[7px] font-mono text-neutral-600 select-none">
                  <span>01:00 AM</span>
                  <span>05:00 AM</span>
                  <span>09:00 AM</span>
                  <span>01:00 PM</span>
                  <span>05:00 PM</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
