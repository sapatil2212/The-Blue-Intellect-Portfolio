'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

const stackServices = [
  {
    id: 1,
    title: 'Pre-Production',
    tags: ['Concept Development', 'Scripting', 'Location Scouting', 'Video Shooting'],
    description:
      'Strategic planning for high-impact video production. From concept development and scripting to location scouting and professional video shooting, we build the foundation for cinematic content that performs.',
    cta: 'Pre-Production services',
    accentColor: '#4ade80',
    glowColor: 'rgba(74,222,128,0.15)',
    bgFrom: '#111',
    bgTo: '#0a0a0a',
    icon: (
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="preGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="100%" stopColor="white" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        
        <g opacity="0.25">
          <circle cx="50" cy="50" r="45" stroke="#4ade80" strokeWidth="0.5" strokeDasharray="2 4" />
          <line x1="50" y1="5" x2="50" y2="95" stroke="#4ade80" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="#4ade80" strokeWidth="0.5" strokeDasharray="2 2" />
        </g>

        <g>
          <rect x="18" y="15" width="40" height="50" rx="6" fill="url(#glassGrad)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
          <path d="M18 21 L58 21" stroke="#4ade80" strokeWidth="3" strokeDasharray="4 2" />
          <line x1="24" y1="30" x2="44" y2="30" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          <line x1="24" y1="38" x2="52" y2="38" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          <line x1="24" y1="46" x2="48" y2="46" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          <line x1="24" y1="54" x2="38" y2="54" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          
          <g>
            <path d="M50 25 L58 17 L61 20 L53 28 Z" fill="#4ade80" />
            <path d="M53 28 L51 31 L54 30 Z" fill="#22c55e" />
          </g>
        </g>

        <g>
          <rect x="42" y="38" width="34" height="28" rx="6" fill="#1e293b" stroke="#4ade80" strokeWidth="1.5" />
          <rect x="48" y="44" width="22" height="16" rx="3" fill="url(#preGrad)" opacity="0.9" />
          <path d="M76 44 L88 38 L88 66 L76 60 Z" fill="#0f172a" stroke="#4ade80" strokeWidth="1.5" />
          <line x1="88" y1="46" x2="88" y2="58" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
          <circle cx="82" cy="52" r="3" fill="#4ade80" />
          <circle cx="54" cy="52" r="2.5" fill="#ef4444" />
          <text x="60" y="54" fill="#ef4444" fontSize="5" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.5">REC</text>
          <path d="M50 38 L50 33 L68 33 L68 38" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        <g>
          <circle cx="82" cy="52" r="12" stroke="#4ade80" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        </g>
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Post-Production',
    tags: ['Video Editing', 'Color Grading', 'Motion Graphics', 'Sound Design'],
    description:
      'Professional video editing, color grading, motion graphics, and sound design crafted to maximize retention and engagement. We transform raw footage into polished, performance-driven content.',
    cta: 'Post-Production services',
    accentColor: '#c084fc',
    glowColor: 'rgba(192,132,252,0.15)',
    bgFrom: '#111',
    bgTo: '#0a0a0a',
    icon: (
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="postGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="timelineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        <rect x="12" y="15" width="76" height="34" rx="6" fill="currentColor" className="text-slate-900/40 dark:text-slate-900/80" stroke="#c084fc" strokeWidth="1" opacity="0.6" />
        <line x1="12" y1="23" x2="88" y2="23" stroke="#c084fc" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
        
        <rect x="18" y="27" width="24" height="6" rx="2" fill="url(#postGrad)" />
        <rect x="46" y="27" width="34" height="6" rx="2" fill="#c084fc" opacity="0.6" />
        <rect x="22" y="37" width="48" height="6" rx="2" fill="#c084fc" opacity="0.3" />
        
        <g>
          <line x1="48" y1="20" x2="48" y2="45" stroke="#ef4444" strokeWidth="1.5" />
          <polygon points="45,17 51,17 48,21" fill="#ef4444" />
        </g>

        <g style={{ transform: 'translate(28px, 70px)' }}>
          <circle cx="0" cy="0" r="16" stroke="#c084fc" strokeWidth="2" strokeDasharray="10 5" opacity="0.6" />
          <circle cx="0" cy="0" r="16" stroke="#c084fc" strokeWidth="2" strokeDasharray="30 10" />
          <circle cx="0" cy="0" r="3" fill="#c084fc" />
          <g>
            <circle cx="4" cy="-3" r="2" fill="#ef4444" />
            <line x1="-2" y1="-3" x2="10" y2="-3" stroke="#ef4444" strokeWidth="0.5" />
            <line x1="4" y1="-9" x2="4" y2="3" stroke="#ef4444" strokeWidth="0.5" />
          </g>
        </g>

        <g style={{ transform: 'translate(66px, 70px)' }}>
          {[ -15, -10, -5, 0, 5, 10, 15 ].map((offsetX, i) => {
            const h = [12, 24, 32, 20, 28, 16, 8][i];
            return (
              <rect
                key={offsetX}
                x={offsetX - 1.5}
                y={-h / 2}
                width="3"
                height={h}
                rx="1.5"
                fill="#c084fc"
              />
            );
          })}
        </g>
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Web Development',
    tags: ['Custom Websites', 'E-Commerce', 'Web Apps', 'Optimization'],
    description:
      'Custom web development focused on performance, scalability, and conversion. We design high-performance websites and digital platforms that turn traffic into measurable growth.',
    cta: 'Development services',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56,189,248,0.15)',
    bgFrom: '#111',
    bgTo: '#0a0a0a',
    icon: (
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="webGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="codeBack" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        <g opacity="0.8">
          <rect x="62" y="16" width="22" height="10" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
          <ellipse cx="73" cy="16" rx="11" ry="3" fill="#38bdf8" opacity="0.7" />
          
          <rect x="62" y="28" width="22" height="10" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
          <ellipse cx="73" cy="28" rx="11" ry="3" fill="#38bdf8" opacity="0.7" />
          
          <circle cx="66" cy="21" r="1" fill="#22c55e" />
          <circle cx="66" cy="33" r="1" fill="#22c55e" />
        </g>

        <path d="M50 30 Q60 30 62 21 M50 44 Q58 44 62 33" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

        <g>
          <rect x="14" y="24" width="46" height="52" rx="6" fill="url(#codeBack)" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="20" cy="30" r="1.5" fill="#ef4444" />
          <circle cx="24" cy="30" r="1.5" fill="#eab308" />
          <circle cx="28" cy="30" r="1.5" fill="#22c55e" />
          
          <g style={{ transform: 'translate(20px, 40px)' }}>
            <path d="M0 2 L4 0 L0 -2 M10 2 L6 0 L10 -2" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" />
            <line x1="14" y1="0" x2="30" y2="0" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
            
            <line x1="4" y1="8" x2="20" y2="8" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="4" y1="16" x2="28" y2="16" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="24" x2="32" y2="24" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="32" x2="22" y2="32" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>

        <circle cx="28" cy="82" r="3" fill="#38bdf8" opacity="0.7" />
        <line x1="28" y1="82" x2="38" y2="76" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />

        <g>
          <rect x="56" y="48" width="30" height="34" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
          <rect x="61" y="54" width="20" height="12" rx="2" fill="url(#webGrad)" />
          <rect x="61" y="70" width="12" height="2" rx="1" fill="#38bdf8" opacity="0.7" />
          <rect x="61" y="75" width="20" height="2" rx="1" fill="#38bdf8" opacity="0.4" />
        </g>

        <g>
          <path d="M72 74 L64 60 L69 58 L59 52 L57 62 L62 61 Z" fill="#38bdf8" stroke="#0f172a" strokeWidth="1" />
          <circle cx="59" cy="52" r="1.5" stroke="#38bdf8" strokeWidth="1" />
        </g>
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Social Marketing',
    tags: ['Strategy', 'Content Creation', 'Paid Ads', 'Analytics'],
    description:
      'Data-driven social media marketing designed to increase reach, engagement, and revenue. We combine strategy, content creation, and analytics to build sustainable digital growth systems.',
    cta: 'Marketing services',
    accentColor: '#3b82f6',
    glowColor: 'rgba(59,130,246,0.15)',
    bgFrom: '#111',
    bgTo: '#0a0a0a',
    icon: (
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="socialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="chartGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        <g opacity="0.6">
          <path d="M12 80 L32 64 L52 70 L88 44 L88 80 Z" fill="url(#chartGrad)" />
          <path d="M12 80 L32 64 L52 70 L88 44" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="32" cy="64" r="2.5" fill="#3b82f6" />
          <circle cx="52" cy="70" r="2.5" fill="#3b82f6" />
          <circle cx="88" cy="44" r="3.5" fill="#3b82f6" />
        </g>

        <g style={{ transformOrigin: '32px 52px' }}>
          <path d="M26 58 L20 66 L25 68 L30 60" fill="currentColor" className="text-slate-900 dark:text-slate-100" stroke="#3b82f6" strokeWidth="1" />
          <path d="M26 50 L48 38 L54 66 L32 60 Z" fill="url(#socialGrad)" stroke="#3b82f6" strokeWidth="1" />
          <ellipse cx="51" cy="52" rx="3.5" ry="14" fill="#3b82f6" stroke="currentColor" className="text-slate-900 dark:text-slate-100" strokeWidth="1" />
          <circle cx="26" cy="54" r="2" fill="#ef4444" />
        </g>

        <path
          d="M60 42 Q68 52 60 62"
          stroke="#3b82f6"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ transformOrigin: '51px 52px' }}
        />
        <path
          d="M66 36 Q78 52 66 68"
          stroke="#3b82f6"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ transformOrigin: '51px 52px' }}
        />

        <g>
          <rect x="42" y="16" width="16" height="16" rx="4" fill="rgba(239, 68, 68, 0.15)" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1" />
          <path d="M50 26.5 C49.5 25.5 48 24.5 46.5 25.5 C45 26.5 45 28.5 46.5 29.5 L50 32 L53.5 29.5 C55 28.5 55 26.5 53.5 25.5 C52 24.5 50.5 25.5 50 26.5 Z" fill="#ef4444" />
        </g>

        <g>
          <rect x="70" y="18" width="16" height="16" rx="4" fill="rgba(34, 197, 94, 0.15)" stroke="rgba(34, 197, 94, 0.4)" strokeWidth="1" />
          <path d="M74 23 H82 V29 H77 L74 31 V29 Z" fill="#22c55e" />
        </g>
        
        <g>
          <rect x="62" y="36" width="16" height="16" rx="4" fill="rgba(59, 130, 246, 0.15)" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1" />
          <path d="M68 46 L68 43 Q68 41 70 41 L70 43 H74 V48 H68 Z" fill="#3b82f6" />
        </g>
      </svg>
    ),
  },
];

function ServiceStackCard({
  service,
  index,
  total,
}: {
  service: typeof stackServices[0];
  index: number;
  total: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start 100px', 'start -50%'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, index === total - 1 ? 1 : 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, index === total - 1 ? 1 : 0.4]);

  return (
    <motion.div
      ref={cardRef}
      style={{
        scale,
        opacity,
        position: 'sticky',
        top: `${100 + index * 30}px`,
        transformOrigin: 'top center',
        zIndex: index + 1,
      }}
      className="w-full"
    >
      <div className="relative w-full rounded-3xl overflow-hidden min-h-[260px]">
        {/* Light mode background */}
        <div 
          className="absolute inset-0 rounded-3xl dark:hidden"
          style={{
            background: `radial-gradient(ellipse at 70% 50%, ${service.accentColor}15 0%, transparent 60%), linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)`,
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: `0 8px 40px rgba(0,0,0,0.04), inset 0 0 60px ${service.accentColor}10`,
          }}
        />
        {/* Dark mode background */}
        <div 
          className="absolute inset-0 rounded-3xl hidden dark:block"
          style={{
            background: `radial-gradient(ellipse at 70% 50%, ${service.glowColor} 0%, transparent 60%), linear-gradient(135deg, #111 0%, #0a0a0a 100%)`,
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 60px ${service.glowColor}`,
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 p-8 md:p-12">
          <div className="flex-1 min-w-0">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase mb-5"
              style={{
                background: `${service.accentColor}18`,
                border: `1px solid ${service.accentColor}30`,
                color: service.accentColor,
              }}
            >
              {String(service.id).padStart(2, '0')} · Service
            </div>

            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-5 leading-tight tracking-tight">
              {service.title}
            </h3>

            <div className="flex flex-wrap gap-2 mb-6">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-[12px] font-semibold text-slate-700 dark:text-[rgba(255,255,255,0.75)] bg-slate-100 dark:bg-[rgba(255,255,255,0.06)] border border-slate-200 dark:border-[rgba(255,255,255,0.1)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-sm leading-relaxed mb-8 max-w-lg text-slate-600 dark:text-[rgba(255,255,255,0.55)]">
              {service.description}
            </p>

            <Link
              href="/services"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-[13px] font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 text-white dark:text-[#111]"
              style={{
                background: service.accentColor,
                boxShadow: `0 0 20px ${service.glowColor}`,
              }}
            >
              {service.cta}
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="shrink-0 w-40 h-40 md:w-52 md:h-52 opacity-90">
            {service.icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ServicesStackSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-[11px] font-bold tracking-widest uppercase"
            style={{
              background: 'rgba(59,130,246,0.08)',
              border: '1px solid rgba(59,130,246,0.2)',
              color: 'var(--accent)',
            }}
          >
            Our Expertise
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white font-display leading-tight tracking-tight mb-12">
            Services that <span className="text-accent italic">scale brands.</span>
          </h2>
        </div>

        <div className="relative flex flex-col gap-10 md:gap-16 pb-6">
          {stackServices.map((service, index) => (
            <ServiceStackCard
              key={service.id}
              service={service}
              index={index}
              total={stackServices.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
