'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Play } from 'lucide-react';
import { FaInstagram, FaXTwitter, FaFacebookF, FaLinkedinIn, FaPinterestP, FaYoutube, FaGlobe, FaBullhorn } from 'react-icons/fa6';

export default function HeroSection() {
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

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          canvas.width = width * window.devicePixelRatio;
          canvas.height = height * window.devicePixelRatio;
          ctx.resetTransform();
          ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
          
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
      <div className="hero-dots" />
      <div className="absolute inset-0 bg-grid opacity-60 dark:opacity-[0.25] pointer-events-none z-0" />
      <div className="hero-glow" />
      <div className="hero-glow-secondary" />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

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

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
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

        <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-[68px] font-extrabold tracking-tight leading-[1.2] font-display text-white max-w-4xl mx-auto mb-6">
          Your Vision, Our Innovation <br />
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

        <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Welcome to The Blue Intellect. We provide comprehensive digital solutions, from Local SEO to Corporate Branding, perfectly designed to help your business thrive and scale efficiently.
        </p>

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
