'use client';

import Link from 'next/link';
import {
  ArrowRight, Play, Star, Check, User, ArrowUp, ExternalLink, Code2, Share2, Search, Palette, Film,
  Sparkles, CalendarClock, BarChart3, ImagePlus, TrendingUp, SmilePlus, RefreshCw, MessageCircleHeart,
  ScanSearch, Globe as GlobeIcon, FolderOpen, Mail, ShieldCheck, ArrowUpRight
} from 'lucide-react';
import { FaInstagram, FaXTwitter, FaFacebookF, FaLinkedinIn, FaPinterestP, FaYoutube, FaGlobe, FaBullhorn } from 'react-icons/fa6';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate, useInView, useScroll } from 'framer-motion';
import { ProjectType } from '@/store/usePortfolioStore';
import ProjectCard from '@/components/ui/ProjectCard';

interface HomeClientProps {
  projects: ProjectType[];
  isAdmin?: boolean;
}

/* ───────────── Animated Hero Section ───────────── */
function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [headingIndex, setHeadingIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeadingIndex((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; life: number; maxLife: number;
    }> = [];

    const createParticle = () => {
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.width / 2;
      return {
        x: centerX + (Math.random() - 0.5) * 400,
        y: Math.random() * rect.height * 0.4 + rect.height * 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.5 - 0.1,
        size: Math.random() * 2 + 0.5,
        opacity: 0,
        life: 0,
        maxLife: Math.random() * 200 + 100,
      };
    };

    // Sizer observer to ensure perfectly circular canvas particles across High-DPI screens without layout stretching
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          canvas.width = width * window.devicePixelRatio;
          canvas.height = height * window.devicePixelRatio;
          ctx.resetTransform();
          ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
          
          // Reset particles for a clean start on resize
          particles = [];
          for (let i = 0; i < 40; i++) {
            const p = createParticle();
            p.life = Math.random() * p.maxLife;
            particles.push(p);
          }
        }
      }
    });

    resizeObserver.observe(canvas);

    const animateParticles = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      if (particles.length < 50 && Math.random() < 0.1) {
        particles.push(createParticle());
      }

      particles = particles.filter(p => p.life < p.maxLife);

      particles.forEach(p => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        const progress = p.life / p.maxLife;
        if (progress < 0.2) p.opacity = progress * 5;
        else if (progress > 0.8) p.opacity = (1 - progress) * 5;
        else p.opacity = 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity * 0.4})`;
        ctx.fill();

        // Soft glow around particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity * 0.08})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animateParticles);
    };

    animateParticles();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);

  const floatingLogos = [
    { icon: <FaFacebookF className="w-4 h-4" color="#1877F2" />, name: 'Facebook', position: 'left-[5%] top-[30%]', delay: '0s' },
    { icon: <FaInstagram className="w-4 h-4" color="#E4405F" />, name: 'Instagram', position: 'left-[15%] bottom-[25%]', delay: '1s' },
    { icon: <FaXTwitter className="w-4 h-4" />, name: 'X.com', position: 'right-[5%] top-[25%]', delay: '0.5s' },
    { icon: <FaLinkedinIn className="w-4 h-4" color="#0A66C2" />, name: 'LinkedIn', position: 'right-[15%] bottom-[20%]', delay: '1.5s' },
    { icon: <FaPinterestP className="w-4 h-4" color="#E60023" />, name: 'Pinterest', position: 'left-[22%] top-[15%]', delay: '0.8s' },
    { icon: <FaYoutube className="w-4 h-4" color="#FF0000" />, name: 'YouTube', position: 'right-[25%] top-[12%]', delay: '1.2s' },
    { icon: <FaGlobe className="w-4 h-4" color="#3b82f6" />, name: 'Website', position: 'left-[5%] bottom-[45%]', delay: '0.3s' },
    { icon: <FaBullhorn className="w-4 h-4" color="#3b82f6" />, name: 'Marketing', position: 'right-[5%] bottom-[45%]', delay: '1.8s' },
  ];

  return (
    <section className="hero-bg relative pt-20 pb-16 lg:pt-24 lg:pb-20 min-h-[80vh] flex items-center justify-center">
      {/* Dot grid */}
      <div className="hero-dots" />
      
      {/* Main glow bloom */}
      <div className="hero-glow" />
      <div className="hero-glow-secondary" />

      {/* Canvas particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Floating original logos */}
      <div className="hidden lg:block">
        {floatingLogos.map((logo, i) => (
          <div
            key={i}
            className={`floating-logo-badge ${logo.position}`}
            style={{ animationDelay: logo.delay }}
          >
            {logo.icon}
            <span>{logo.name}</span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Badge — rotating text with fade */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/15 dark:border-blue-400/15 mb-8 animate-fade-in">
          <span className="inline-block w-8 h-5 rounded text-[10px] font-bold flex items-center justify-center" style={{ background: 'var(--accent)', color: '#fff' }}>
            #1
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={headingIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="text-xs font-medium text-accent"
            >
              {[
                'Top Rated Digital Marketing Agency',
                'Award-Winning Web Development Studio',
                'Creative Design & Branding Experts',
                'Google Ads & SEO Growth Partners',
                'Full-Stack Development Specialists',
              ][headingIndex % 5]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Stable Professional Heading - animations scoped to the single target word to avoid layout jumps */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-[68px] font-extrabold tracking-tight leading-[1.2] font-display text-white max-w-4xl mx-auto mb-6">
          Your Vision, Our Innovation  <br />
          Shaping{' '}
          <span className="relative inline-block min-w-[260px] sm:min-w-[340px] md:min-w-[420px] text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light text-left sm:text-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={headingIndex}
                initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="inline-block gradient-text font-extrabold"
              >
                {[
                  'Digital Reality',
                  'Web Design',
                  'Brand Strategy',
                  'SEO & Growth',
                  'Web Engineering',
                ][headingIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Welcome to The Blue Intellect. We provide comprehensive digital solutions, from Local SEO to Corporate Branding, perfectly designed to help your business thrive and scale efficiently.
        </p>

        {/* CTAs */}
        <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 mb-6 animate-fade-in-up w-full" style={{ animationDelay: '0.2s' }}>
          <Link
            href="/contact"
            className="glow-button px-4 py-2.5 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-semibold rounded-md inline-flex items-center justify-center gap-1.5 sm:gap-2 flex-1 sm:flex-none max-w-[160px] sm:max-w-none text-center"
            style={{ color: '#fff' }}
          >
            Book Appointment
          </Link>
          <Link
            href="/services"
            className="px-4 py-2.5 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-medium text-fg rounded-md inline-flex items-center justify-center gap-1.5 sm:gap-2 transition-colors flex-1 sm:flex-none max-w-[160px] sm:max-w-none text-center"
            style={{ border: '1px solid var(--border)', background: 'var(--surface-1)' }}
          >
            Explore Services
            <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
          </Link>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-accent" />
            <span>Proven Marketing ROI</span>
          </div>
          <span className="text-muted/30">•</span>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-accent" />
            <span>Dedicated Strategy Experts</span>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ───────────── Trusted By ───────────── */
const clientLogos = [
  { file: '1.png', name: 'Client 1' },
  { file: '2.png', name: 'Client 2' },
  { file: '3.png', name: 'Client 3' },
  { file: '4.png', name: 'Client 4' },
  { file: '5.png', name: 'Client 5' },
  { file: '6.png', name: 'Client 6' },
  { file: '7.png', name: 'Client 7' },
  { file: '8.png', name: 'Client 8' },
  { file: '9.png', name: 'Client 9' },
  { file: '10.png', name: 'Client 10' },
  { file: '11.png', name: 'Client 11' },
  { file: '12.png', name: 'Client 12' },
  { file: '13.png', name: 'Client 13' },
  { file: '14.png', name: 'Client 14' },
  { file: '15.png', name: 'Client 15' },
  { file: '16.png', name: 'Client 16' },
  { file: '17.png', name: 'Client 17' },
  { file: '18.png', name: 'Client 18' },
  { file: '19.png', name: 'Client 19' },
  { file: 'Arya_Foods.png', name: 'Arya Foods' },
  { file: 'Darshan_Jadhav.png', name: 'Darshan Jadhav' },
  { file: 'DS Moto.png', name: 'DS Moto' },
  { file: 'Gaurav Kirana.png', name: 'Gaurav Kirana' },
  { file: 'Hotel_Omkar_Garden.png', name: 'Hotel Omkar Garden' },
  { file: 'Hotel_Trident.png', name: 'Hotel Trident' },
  { file: 'Jain_Bakers _logo.png', name: 'Jain Bakers' },
  { file: 'Jogeshwari_Super_Shopee.png', name: 'Jogeshwari Super Shopee' },
  { file: 'Kavyaas_Slimming_Center.png', name: 'Kavyaas Slimming Center' },
  { file: 'Key_Tech.png', name: 'Key Tech' },
  { file: 'Laser Dental.png', name: 'Laser Dental' },
  { file: 'Lily_Events.png', name: 'Lily Events' },
  { file: 'Logo Final.png', name: 'Client' },
  { file: 'Logo SM 1.png', name: 'Client' },
  { file: 'Logo.png', name: 'Client' },
  { file: 'MA Events.jpg', name: 'MA Events' },
  { file: 'OK_Kirana.png', name: 'OK Kirana' },
  { file: 'Pranika_Arts.png', name: 'Pranika Arts' },
  { file: 'Scenic_Lands.png', name: 'Scenic Lands' },
  { file: 'TE_LOGO_1_1.png', name: 'TE Logo' },
  { file: 'The bright logo 1.png', name: 'The Bright' },
  { file: 'Trade Bharat.png', name: 'Trade Bharat' },
  { file: 'Utkarsh Wani Samaj_HD_Png.png', name: 'Utkarsh Wani Samaj' },
  { file: 'UWPL_Logo_HD_Png.png', name: 'UWPL' },
];

function TrustedBySection() {
  const track = [...clientLogos, ...clientLogos, ...clientLogos, ...clientLogos];

  return (
    <section className="py-12 overflow-hidden relative" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <p className="text-center text-xs text-muted uppercase tracking-[0.2em] font-display">
          Trusted by growing businesses and established brands
        </p>
      </div>

      <div className="relative flex overflow-hidden group">
        {/* fade edges */}
        <div className="absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-[var(--bg)] to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-[var(--bg)] to-transparent pointer-events-none z-10" />

        <div className="animate-marquee flex flex-nowrap items-center gap-4 w-max group-hover:[animation-play-state:paused]">
          {track.map((logo, i) => (
            <div
              key={i}
              className="client-logo-card shrink-0 flex items-center justify-center rounded-xl border"
              style={{
                width: 140,
                height: 72,
                background: 'var(--card-bg)',
                borderColor: 'var(--border)',
              }}
            >
              <img
                src={`/images/logo/${logo.file}`}
                alt={logo.name}
                style={{ width: 100, height: 44, objectFit: 'contain', objectPosition: 'center' }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Features Bento Grid ───────────── */
function FeaturesGrid() {
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

  return (
    <section className="pt-24 pb-10 relative">
      <div className="section-glow section-glow-top" />
      <div className="section-glow section-glow-left" />
      <div className="section-glow section-glow-right" />
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
          {/* WHAT WE DO (Replaces Branding) */}
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

          {/* MORE ABOUT US Text Content */}
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

/* ───────────── Manage Business ───────────── */
function ManageSection() {
  const items = [
    { icon: <ImagePlus className="w-5 h-5" />, title: 'UI/UX Design', desc: 'Crafting experiences that convert.', subdesc: 'We design user-centric interfaces that are both intuitive and impactful, ensuring seamless interaction and maximum engagement.', bullets: ['Creative Design', 'Intuitive UX', 'Prototyping', 'Usability Testing'] },
    { icon: <GlobeIcon className="w-5 h-5" />, title: 'Custom Web Development', desc: 'Building scalable and secure digital platforms.', subdesc: 'Our web solutions are crafted to meet your business goals while ensuring performance, flexibility, and future growth.', bullets: ['Responsive Design', 'Custom Functionality', 'High Performance', 'Enterprise-Level Security'] },
    { icon: <TrendingUp className="w-5 h-5" />, title: 'Strategy & Consulting', desc: 'Digital roadmaps that drive results.', subdesc: 'Our consulting services are designed to provide clarity, direction, and measurable outcomes. We help businesses make smart digital decisions to fuel growth.', bullets: ['Brand Strategy', 'Digital Transformation Consulting', 'Marketing Roadmap', 'Competitive Analysis'] },
    { icon: <Sparkles className="w-5 h-5" />, title: 'Graphic Designing', desc: 'Creative visuals that communicate', subdesc: 'We craft compelling visual designs that not only reflect your brand identity but also captivate your audience across digital and print platforms.', bullets: ['Logo & Branding', 'Marketing Collaterals', 'Social Media Creatives', 'Web & App UI Design'] },
    { icon: <BarChart3 className="w-5 h-5" />, title: 'Digital Marketing', desc: 'Get noticed, get results.', subdesc: 'We craft performance-driven digital marketing strategies that increase your brand visibility and ROI.', bullets: ['SEO & SEM', 'Social Media Marketing', 'Content Strategy', 'Paid Campaigns'] },
    { icon: <ScanSearch className="w-5 h-5" />, title: 'Data Analytics', desc: 'Transform Data into Business Intelligence', subdesc: 'Unlock the power of your data with our comprehensive Data Analytics services. We help you collect, process, and analyze complex datasets to uncover actionable insights that drive smarter decision-making.', bullets: ['Business Intelligence Dashboards', 'Predictive Analytics', 'Customer Segmentation'] },
    { icon: <GlobeIcon className="w-5 h-5" />, title: 'Domain & Hosting', desc: 'Reliable, Secure, and Scalable Web Infrastructure', subdesc: 'Build your digital presence on a solid foundation. We offer top-tier domain registration and reliable hosting solutions tailored for businesses of all sizes.', bullets: ['Domain Name Registration', 'Shared, VPS & Dedicated Hosting', 'Cloud Hosting Solutions', 'SSL Certificates & Security', 'Email Hosting'] },
    { icon: <GlobeIcon className="w-5 h-5" />, title: 'Google Cloud Services', desc: 'Innovate at Scale with Google Cloud', subdesc: 'Accelerate your digital transformation with our end-to-end Google Cloud services. As your cloud partner, we help you migrate, manage, and optimize workloads on GCP.', bullets: ['Cloud Migration & Deployment', 'Compute Engine & Storage', 'Cloud Functions & App Engine', 'BigQuery & Cloud AI Integration', 'Ongoing Cloud Management'] },
    { icon: <MessageCircleHeart className="w-5 h-5" />, title: 'Tata Tele Business Services', desc: 'Powering Businesses with Tata Teleservices', subdesc: 'As an official partner of Tata Tele Business Services, we bring you trusted, enterprise-grade communication and connectivity solutions backed by India\'s most reliable telecom network.', bullets: ['Leased Line Internet Solutions', 'PRI Lines & SIP Trunking', 'Cloud Telephony', 'IoT Solutions', 'Voice & Data Plans'] },
    { icon: <MessageCircleHeart className="w-5 h-5" />, title: 'WhatsApp & SMS Services', desc: 'Reach Your Customers Instantly', subdesc: 'Enhance your customer communication with our WhatsApp Business API and Bulk SMS solutions. We help you engage, inform, and convert through the most direct channels available today.', bullets: ['WhatsApp Business API Integration', 'Transactional & Promotional SMS', 'Bulk Messaging Campaigns', 'Automated Messaging Bots', 'Delivery Reports'] },
    { icon: <SmilePlus className="w-5 h-5" />, title: 'IVR Services', desc: 'Smart Call Management with IVR Solutions', subdesc: 'Deliver a seamless customer experience with our customizable Interactive Voice Response (IVR) systems. Route calls efficiently, provide self-service options, and ensure 24/7 customer support availability.', bullets: ['Multi-level IVR Systems', 'Call Routing & Forwarding', 'Voice Recording & Analytics', 'Cloud-based IVR Setup', 'Custom Greeting Messages'] },
    { icon: <RefreshCw className="w-5 h-5" />, title: 'Email Marketing Services', desc: 'Drive Conversions with Smart Email Campaigns', subdesc: 'Reach your audience where it matters most – their inbox. Our Email Marketing Services are designed to boost engagement, improve retention, and drive sales.', bullets: ['Email Campaign Design & Management', 'Automated Drip Campaigns', 'Subscriber List Segmentation', 'Performance Tracking & Analytics', 'GDPR & CAN-SPAM Compliance'] },
  ];

  return (
    <section className="py-24 relative">
      <div className="section-glow section-glow-top" />
      <div className="section-glow section-glow-left" />
      <div className="section-glow section-glow-right" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-display">
            Strategies that shape <span className="text-accent italic">your business</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            We provide an end-to-end suite of marketing solutions to help you get the most out of your digital presence.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 group cursor-default flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-5 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-1 font-display">{item.title}</h3>
              <p className="text-accent text-sm font-medium mb-3">{item.desc}</p>
              <p className="text-sm text-muted leading-relaxed flex-1 mb-5">{item.subdesc}</p>
              <ul className="space-y-2 mb-2 mt-auto">
                {item.bullets.map((bullet, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-border/40 flex items-center justify-between">
                <Link href="/services" className="text-[13px] font-semibold text-accent flex items-center gap-1.5 hover:text-accent-light transition-colors group-hover:gap-2.5">
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/contact" className="glow-button px-4 py-2 text-[12px] font-semibold rounded-full text-white shadow-lg shadow-accent/20 transition-transform active:scale-95">
                  Book now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Stats / Proof Section ───────────── */
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

function StatsSection() {
  const stats = [
    { value: 95, suffix: '%', label: 'Average increase in sales for our clients', progress: 95 },
    { value: 500, suffix: '+', label: 'Satisfied Clients', progress: 100 },
    { value: 99, suffix: '%', label: 'Results improved compared to previous agencies', progress: 99 },
  ];

  return (
    <section className="pt-10 pb-24 relative overflow-hidden">
      <div className="section-glow section-glow-top" />
      <div className="section-glow section-glow-left" />
      <div className="section-glow section-glow-right" />
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
                  {/* SVG Progress Circle */}
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
                  {/* Center Value */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white tracking-tight">
                      <Counter to={stat.value} suffix={stat.suffix} />
                    </span>
                  </div>
                  {/* Small indicator arrow */}
                  <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-accent/20 text-accent transition-transform hover:-translate-y-1" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                     <ArrowUp className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[13px] font-medium text-muted max-w-[200px] mx-auto leading-relaxed">{stat.label}</p>
              </div>
            ))}

            {/* Highlight Colored Box */}
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

/* ───────────── Services Stack Section ───────────── */
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
        
        {/* Grid Accents */}
        <g opacity="0.25">
          <circle cx="50" cy="50" r="45" stroke="#4ade80" strokeWidth="0.5" strokeDasharray="2 4" />
          <line x1="50" y1="5" x2="50" y2="95" stroke="#4ade80" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="#4ade80" strokeWidth="0.5" strokeDasharray="2 2" />
        </g>

        {/* Script / Storyboard Board */}
        <g>
          <rect x="18" y="15" width="40" height="50" rx="6" fill="url(#glassGrad)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" style={{ backdropFilter: 'blur(5px)' }} />
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

        {/* Camera body */}
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

        {/* Video Editor Tracks (Background block) */}
        <rect x="12" y="15" width="76" height="34" rx="6" fill="currentColor" className="text-slate-900/40 dark:text-slate-900/80" stroke="#c084fc" strokeWidth="1" opacity="0.6" />
        {/* Timeline ruler */}
        <line x1="12" y1="23" x2="88" y2="23" stroke="#c084fc" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
        
        {/* Timeline Tracks blocks (Gradients) */}
        <rect x="18" y="27" width="24" height="6" rx="2" fill="url(#postGrad)" />
        <rect x="46" y="27" width="34" height="6" rx="2" fill="#c084fc" opacity="0.6" />
        <rect x="22" y="37" width="48" height="6" rx="2" fill="#c084fc" opacity="0.3" />
        
        {/* Playhead indicator */}
        <g>
          <line x1="48" y1="20" x2="48" y2="45" stroke="#ef4444" strokeWidth="1.5" />
          <polygon points="45,17 51,17 48,21" fill="#ef4444" />
        </g>

        {/* Color Grading Wheel / Dial */}
        <g style={{ transform: 'translate(28px, 70px)' }}>
          {/* Wheel Ring */}
          <circle cx="0" cy="0" r="16" stroke="#c084fc" strokeWidth="2" strokeDasharray="10 5" opacity="0.6" />
          <circle cx="0" cy="0" r="16" stroke="#c084fc" strokeWidth="2" strokeDasharray="30 10" />
          {/* Center Point */}
          <circle cx="0" cy="0" r="3" fill="#c084fc" />
          {/* Grading picker picker point */}
          <g>
            <circle cx="4" cy="-3" r="2" fill="#ef4444" />
            <line x1="-2" y1="-3" x2="10" y2="-3" stroke="#ef4444" strokeWidth="0.5" />
            <line x1="4" y1="-9" x2="4" y2="3" stroke="#ef4444" strokeWidth="0.5" />
          </g>
        </g>

        {/* Audio Spectrum / Waveform on the right */}
        <g style={{ transform: 'translate(66px, 70px)' }}>
          {/* Wave outlines */}
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

        {/* Database / Cloud Stack */}
        <g opacity="0.8">
          {/* Cylinder 1 */}
          <rect x="62" y="16" width="22" height="10" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
          <ellipse cx="73" cy="16" rx="11" ry="3" fill="#38bdf8" opacity="0.7" />
          
          {/* Cylinder 2 */}
          <rect x="62" y="28" width="22" height="10" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
          <ellipse cx="73" cy="28" rx="11" ry="3" fill="#38bdf8" opacity="0.7" />
          
          {/* Server lights */}
          <circle cx="66" cy="21" r="1" fill="#22c55e" />
          <circle cx="66" cy="33" r="1" fill="#22c55e" />
        </g>

        {/* Connecting Data streams */}
        <path d="M50 30 Q60 30 62 21 M50 44 Q58 44 62 33" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

        {/* Code Editor Window */}
        <g>
          {/* Code IDE Panel */}
          <rect x="14" y="24" width="46" height="52" rx="6" fill="url(#codeBack)" stroke="#38bdf8" strokeWidth="1.5" />
          {/* Editor Header dots */}
          <circle cx="20" cy="30" r="1.5" fill="#ef4444" />
          <circle cx="24" cy="30" r="1.5" fill="#eab308" />
          <circle cx="28" cy="30" r="1.5" fill="#22c55e" />
          
          {/* Mock Code Blocks */}
          <g style={{ transform: 'translate(20px, 40px)' }}>
            {/* Tag < > */}
            <path d="M0 2 L4 0 L0 -2 M10 2 L6 0 L10 -2" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" />
            <line x1="14" y1="0" x2="30" y2="0" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
            
            <line x1="4" y1="8" x2="20" y2="8" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="4" y1="16" x2="28" y2="16" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="24" x2="32" y2="24" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="32" x2="22" y2="32" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>

        {/* Floating tech nodes */}
        <circle cx="28" cy="82" r="3" fill="#38bdf8" opacity="0.7" />
        <line x1="28" y1="82" x2="38" y2="76" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />

        {/* Modern Browser outline / Card */}
        <g>
          {/* Card */}
          <rect x="56" y="48" width="30" height="34" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
          <rect x="61" y="54" width="20" height="12" rx="2" fill="url(#webGrad)" />
          <rect x="61" y="70" width="12" height="2" rx="1" fill="#38bdf8" opacity="0.7" />
          <rect x="61" y="75" width="20" height="2" rx="1" fill="#38bdf8" opacity="0.4" />
        </g>

        {/* High-tech mouse pointer and click wave */}
        <g>
          {/* Laser Cursor */}
          <path d="M72 74 L64 60 L69 58 L59 52 L57 62 L62 61 Z" fill="#38bdf8" stroke="#0f172a" strokeWidth="1" />
          {/* Ripple */}
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

        {/* Analytics Growth Chart (Bottom Background Layer) */}
        <g opacity="0.6">
          <path d="M12 80 L32 64 L52 70 L88 44 L88 80 Z" fill="url(#chartGrad)" />
          <path d="M12 80 L32 64 L52 70 L88 44" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Chart Nodes */}
          <circle cx="32" cy="64" r="2.5" fill="#3b82f6" />
          <circle cx="52" cy="70" r="2.5" fill="#3b82f6" />
          <circle cx="88" cy="44" r="3.5" fill="#3b82f6" />
        </g>

        {/* Megaphone Bullhorn (Centered Left) */}
        <g style={{ transformOrigin: '32px 52px' }}>
          {/* Metallic base & handle */}
          <path d="M26 58 L20 66 L25 68 L30 60" fill="currentColor" className="text-slate-900 dark:text-slate-100" stroke="#3b82f6" strokeWidth="1" />
          {/* Horn Cone */}
          <path d="M26 50 L48 38 L54 66 L32 60 Z" fill="url(#socialGrad)" stroke="#3b82f6" strokeWidth="1" />
          {/* Front Bell rim */}
          <ellipse cx="51" cy="52" rx="3.5" ry="14" fill="#3b82f6" stroke="currentColor" className="text-slate-900 dark:text-slate-100" strokeWidth="1" />
          {/* Trigger Red Dot */}
          <circle cx="26" cy="54" r="2" fill="#ef4444" />
        </g>

        {/* Broadcasting Social Signals (Waves) */}
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

        {/* Floating Social Glass Notification Badges */}
        {/* Heart Reaction Bubble */}
        <g>
          {/* Glass Bubble Container */}
          <rect x="42" y="16" width="16" height="16" rx="4" fill="rgba(239, 68, 68, 0.15)" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1" style={{ backdropFilter: 'blur(3px)' }} />
          {/* Heart Icon SVG Path */}
          <path d="M50 26.5 C49.5 25.5 48 24.5 46.5 25.5 C45 26.5 45 28.5 46.5 29.5 L50 32 L53.5 29.5 C55 28.5 55 26.5 53.5 25.5 C52 24.5 50.5 25.5 50 26.5 Z" fill="#ef4444" />
        </g>

        {/* Message Alert Bubble */}
        <g>
          {/* Glass Bubble Container */}
          <rect x="70" y="18" width="16" height="16" rx="4" fill="rgba(34, 197, 94, 0.15)" stroke="rgba(34, 197, 94, 0.4)" strokeWidth="1" style={{ backdropFilter: 'blur(3px)' }} />
          {/* Comment Speech Bubble */}
          <path d="M74 23 H82 V29 H77 L74 31 V29 Z" fill="#22c55e" />
        </g>
        
        {/* Like Reaction Badge */}
        <g>
          {/* Glass Bubble Container */}
          <rect x="62" y="36" width="16" height="16" rx="4" fill="rgba(59, 130, 246, 0.15)" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1" style={{ backdropFilter: 'blur(3px)' }} />
          {/* Thumbs Up Icon */}
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

        {/* Subtle glow blob */}
        <div
          className="absolute inset-0 pointer-events-none hidden dark:block"
          style={{
            background: `radial-gradient(ellipse at 75% 50%, ${service.glowColor} 0%, transparent 55%)`,
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 p-8 md:p-12">
          {/* Left: Content */}
          <div className="flex-1 min-w-0">
            {/* Service number */}
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

            {/* Tags */}
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

          {/* Right: Icon */}
          <div className="shrink-0 w-40 h-40 md:w-52 md:h-52 opacity-90">
            {service.icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ServicesStackSection() {
  return (
    <section className="py-24 relative">
      <div className="section-glow section-glow-top" />
      <div className="section-glow section-glow-left" />
      <div className="section-glow section-glow-right" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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

        {/* Sticky Scroll Stack */}
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

/* ───────────── Recent Projects / Showcase Section ───────────── */
function RecentProjectsSection({ projects, isAdmin }: { projects: ProjectType[], isAdmin: boolean }) {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="section-glow section-glow-top" />
      <div className="section-glow section-glow-left" />
      <div className="section-glow section-glow-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-[11px] font-bold tracking-widest uppercase"
              style={{
                background: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.2)',
                color: 'var(--accent)',
              }}
            >
              Our Creative Showcase
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-display">
              Featured <span className="text-accent italic">Case Studies</span>
            </h2>
            <p className="text-muted max-w-2xl text-[15px] leading-relaxed">
              Explore our latest web applications, creative designs, and performance campaigns.
            </p>
          </div>
          <Link href="/work" className="mt-6 sm:mt-0 glow-button px-6 py-3 rounded-md text-[13px] font-bold text-white shadow-lg active:scale-95">
            View All Portfolio ({projects.length})
          </Link>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 rounded-3xl border border-dashed border-border bg-card p-8 max-w-2xl mx-auto shadow-xs">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-accent to-accent-light flex items-center justify-center text-white shadow-md animate-pulse">
              <FolderOpen className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Showcase Under Construction</h3>
              <p className="text-sm text-muted max-w-md leading-relaxed">
                {isAdmin ? (
                  "The showcase database is currently empty. Click below to add the very first project and build your live portfolio!"
                ) : (
                  "We are currently curating and deploying our premium showcase studies. Check back soon or login as administrator to populate the portfolio."
                )}
              </p>
            </div>
            {isAdmin ? (
              <Link href="/admin/portfolio" className="glow-button px-8 py-3 font-semibold text-xs text-white">
                <span>Add First Project</span>
                <ArrowRight className="h-4 w-4 ml-1.5 inline-block" />
              </Link>
            ) : (
              <Link href="/login" className="px-8 py-3 text-xs font-semibold rounded-md border border-border text-white hover:bg-surface-2 transition-colors">
                <span>Admin Login</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────────── Testimonials ───────────── */
function TestimonialsSection() {
  const testimonials = [
    { name: 'Arya Foods', logo: 'Arya_Foods.png', handle: '@arya_foods', text: 'The Blue Intellect built our custom e-commerce solution, allowing us to manage orders seamlessly and increase our online food sales by 150%.' },
    { name: 'Kavyaas Slimming Center', logo: 'Kavyaas_Slimming_Center.png', handle: '@kavyaas_slimming', text: 'Our local SEO search rankings skyrocketed! We went from page three to ranking #1 for weight loss treatments in our region within months.' },
    { name: 'DS Moto', logo: 'DS Moto.png', handle: '@dsmoto_automotive', text: 'Exceptional WhatsApp & Bulk SMS automation campaigns. It helped us reach our auto service clients instantly and increased return customer bookings.' },
    { name: 'Hotel Trident', logo: 'Hotel_Trident.png', handle: '@hotel_trident', text: 'Their custom web development and booking funnel optimization are outstanding. Seamless reservations, crystal clear customer flow, and zero bugs.' },
    { name: 'Key Tech', logo: 'Key_Tech.png', handle: '@keytech_engineering', text: 'We partner with them for our Google Cloud infrastructure migration. The scaling and latency improvements are outstanding, drastically cutting server overhead.' },
    { name: 'Lily Events', logo: 'Lily_Events.png', handle: '@lily_events', text: 'Captivating graphic design and social media ad creatives. The Blue Intellect captured the elegance of our wedding planning firm and doubled our organic inquiries.' },
    { name: 'Jain Bakers', logo: 'Jain_Bakers _logo.png', handle: '@jain_bakers', text: 'Our brand identity was completely transformed by their graphic design team. The logo system and packaging creatives communicate our heritage beautifully.' },
    { name: 'Trade Bharat', logo: 'Trade Bharat.png', handle: '@trade_bharat', text: 'Data-backed strategies and analytics dashboard systems designed by The Blue Intellect gave us complete visibility over user acquisition metrics.' },
  ];

  const track1 = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="section-glow section-glow-top" />
      <div className="section-glow section-glow-left" />
      <div className="section-glow section-glow-right" />
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 border" style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}>
          <User className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-white tracking-wide">Our Customers</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-display">What people are saying</h2>
        <p className="text-muted max-w-2xl mx-auto">
          We are very proud of the service we provide and stand by every product we carry. Read our testimonials from our happy customers.
        </p>
      </div>

      {/* Marquee Rows */}
      <div className="relative flex flex-col gap-6 overflow-hidden">
        {/* Row 1: Right to Left */}
        <div className="flex w-max animate-marquee gap-6 hover:[animation-play-state:paused] group">
          {track1.map((t, i) => (
            <div key={i} className="testimonial-card rounded-2xl p-6 w-[350px] shrink-0 outline-none flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl border flex items-center justify-center bg-white p-1 shrink-0" style={{ borderColor: 'var(--border)' }}>
                  <img
                    src={`/images/logo/${t.logo}`}
                    alt={t.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-muted">{t.handle}</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">&ldquo;{t.text}&rdquo;</p>
            </div>
          ))}
        </div>

        {/* Row 2: Left to Right */}
        <div className="flex w-max animate-marquee-reverse gap-6 hover:[animation-play-state:paused] group">
          {track1.map((t, i) => (
            <div key={`rev-${i}`} className="testimonial-card rounded-2xl p-6 w-[350px] shrink-0 outline-none flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl border flex items-center justify-center bg-white p-1 shrink-0" style={{ borderColor: 'var(--border)' }}>
                  <img
                    src={`/images/logo/${t.logo}`}
                    alt={t.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-muted">{t.handle}</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">&ldquo;{t.text}&rdquo;</p>
            </div>
          ))}
        </div>

        {/* Edge Gradients */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg to-transparent pointer-events-none fade-edges" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg to-transparent pointer-events-none fade-edges" />
      </div>
    </section>
  );
}

/* ───────────── CTA Section ───────────── */
function CTASection() {
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

export default function HomeClient({ projects, isAdmin = false }: HomeClientProps) {
  return (
    <div className="w-full flex flex-col pt-16 overflow-hidden">
      <HeroSection />
      <TrustedBySection />
      <FeaturesGrid />
      <div className="section-divider" />
      <StatsSection />
      <div className="section-divider" />
      <ServicesStackSection />
      <div className="section-divider" />
      <RecentProjectsSection projects={projects} isAdmin={isAdmin} />
      <div className="section-divider" />
      <ManageSection />
      <div className="section-divider" />
      <TestimonialsSection />
      <div className="section-divider" />
      <CTASection />
    </div>
  );
}
