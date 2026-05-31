"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Globe,
  Code2,
  Smartphone,
  Palette,
  MapPin,
  MousePointerClick,
  Share2,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { servicesData } from "@/lib/servicesData";

const containerVariants = {
  hidden: { opacity: 0, y: -12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1] as const, // easeOutExpo
      staggerChildren: 0.04,
      delayChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.02,
      staggerDirection: -1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15, ease: "easeIn" as const } }
};

export default function FloatingNavbar() {
  const pathname = usePathname();

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/onboard") ||
    pathname.startsWith("/client")
  ) {
    return null;
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [isServicesHovered, setIsServicesHovered] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  });

  // Close menus on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  // Lock background scroll when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Static services dropdown configuration mapped to matching mockup icons
  const devDesignServices = [
    { title: "Websites", slug: "ui-ux-design", icon: <Globe className="size-4" /> },
    { title: "Custom Softwares", slug: "web-development", icon: <Code2 className="size-4" /> },
    { title: "App Development", slug: "domain-hosting", icon: <Smartphone className="size-4" /> },
    { title: "Branding", slug: "graphic-design", icon: <Palette className="size-4" /> }
  ];

  const marketingServices = [
    { title: "Local SEO", slug: "digital-marketing", icon: <MapPin className="size-4" /> },
    { title: "Google Ads", slug: "strategy-consulting", icon: <MousePointerClick className="size-4" /> },
    { title: "Social Media Ads", slug: "whatsapp-sms-services", icon: <Share2 className="size-4" /> },
    { title: "Search Engine Optimisation", slug: "digital-marketing", icon: <Search className="size-4" /> }
  ];

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: -100 },
        }}
        animate="visible"
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-[top,padding] duration-500 ease-out px-4 md:px-8 py-4",
          scrolled ? "top-2" : "top-0"
        )}
      >
        <div
          className={cn(
            "mx-auto max-w-7xl transition-all duration-500 rounded-full flex items-center justify-between px-6 py-3 border",
            scrolled
              ? "bg-white/90 dark:bg-neutral-950/90 border-neutral-200/50 dark:border-neutral-800/40 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.04)]"
              : "bg-transparent border-transparent"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img 
              src="/images/logo.png" 
              alt="The Blue Intellect Logo" 
              className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Home Link */}
            <Link
              href="/"
              className={cn(
                "relative px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 transition-colors hover:text-neutral-950 dark:hover:text-neutral-50 rounded-full",
                pathname === "/" && "text-white hover:text-white dark:text-white dark:hover:text-white"
              )}
            >
              {pathname === "/" && (
                <motion.span
                  layoutId="active-nav-indicator"
                  className="absolute inset-0 bg-linear-to-r from-sky-400 via-sky-500 to-blue-600 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              Home
            </Link>

            {/* Work Link */}
            <Link
              href="/work"
              className={cn(
                "relative px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 transition-colors hover:text-neutral-950 dark:hover:text-neutral-50 rounded-full",
                pathname === "/work" && "text-white hover:text-white dark:text-white dark:hover:text-white"
              )}
            >
              {pathname === "/work" && (
                <motion.span
                  layoutId="active-nav-indicator"
                  className="absolute inset-0 bg-linear-to-r from-sky-400 via-sky-500 to-blue-600 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              Work
            </Link>

            {/* Services Dropdown Menu Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setIsServicesHovered(true)}
              onMouseLeave={() => setIsServicesHovered(false)}
            >
              <button
                className={cn(
                  "relative px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 transition-colors hover:text-neutral-950 dark:hover:text-neutral-50 rounded-full flex items-center gap-1 cursor-pointer",
                  pathname.startsWith("/services") && "text-white hover:text-white dark:text-white dark:hover:text-white"
                )}
              >
                {pathname.startsWith("/services") && (
                  <motion.span
                    layoutId="active-nav-indicator"
                    className="absolute inset-0 bg-linear-to-r from-sky-400 via-sky-500 to-blue-600 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span>Services</span>
                <ChevronDown className={cn("size-3 transition-transform duration-300", isServicesHovered && "rotate-180")} />
              </button>

              {/* Mega Dropdown Panel matching user mockup */}
              <AnimatePresence>
                {isServicesHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50 pointer-events-auto"
                    style={{ width: "980px" }}
                  >
                    <div className="rounded-3xl border border-border bg-white dark:bg-neutral-950 p-8 shadow-2xl grid grid-cols-12 gap-8 items-stretch">
                      
                      {/* Left: Columns of Services (7 Columns) */}
                      <div className="col-span-7 grid grid-cols-2 gap-8 pr-4">
                        
                        {/* Column 1: Development & Design */}
                        <div className="space-y-6">
                          <h4 className="text-[11px] font-black uppercase tracking-wider text-primary font-display">
                            Development & Design
                          </h4>
                          <div className="flex flex-col gap-4">
                            {devDesignServices.map((item) => (
                              <Link
                                key={item.slug}
                                href={`/services/${item.slug}`}
                                className="group/item flex items-center gap-3.5 text-left transition-all hover:translate-x-1 duration-250 py-0.5"
                              >
                                <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-primary/10 text-primary transition-all group-hover/item:bg-primary group-hover/item:text-white shrink-0 border border-primary/10 shadow-sm shadow-primary/5">
                                  {item.icon}
                                </div>
                                <span className="text-sm font-extrabold text-neutral-800 dark:text-neutral-200 group-hover/item:text-primary transition-colors">
                                  {item.title}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Column 2: Marketing & SEO */}
                        <div className="space-y-6">
                          <h4 className="text-[11px] font-black uppercase tracking-wider text-primary font-display">
                            Marketing & SEO
                          </h4>
                          <div className="flex flex-col gap-4">
                            {marketingServices.map((item) => (
                              <Link
                                key={item.title}
                                href={`/services/${item.slug}`}
                                className="group/item flex items-center gap-3.5 text-left transition-all hover:translate-x-1 duration-250 py-0.5"
                              >
                                <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-primary/10 text-primary transition-all group-hover/item:bg-primary group-hover/item:text-white shrink-0 border border-primary/10 shadow-sm shadow-primary/5">
                                  {item.icon}
                                </div>
                                <span className="text-sm font-extrabold text-neutral-800 dark:text-neutral-200 group-hover/item:text-primary transition-colors">
                                  {item.title}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Right: Featured Laptop Showcase Billboard (5 Columns) */}
                      <div className="col-span-5 relative rounded-2xl overflow-hidden border border-border/60 flex flex-col justify-end p-6 group/banner min-h-[280px]">
                        <img 
                          src="/images/services/dropdown_featured.png"
                          alt="Scale Your Digital Presence"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/banner:scale-103"
                        />
                        {/* Overlay dark wash with custom gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent z-10" />
                        
                        {/* Text and links */}
                        <div className="relative z-20 space-y-2 text-left">
                          <h4 className="text-white text-base font-black tracking-tight drop-shadow-md font-display">
                            Scale Your Digital Presence
                          </h4>
                          <p className="text-[11px] text-neutral-300 font-semibold leading-relaxed drop-shadow-sm">
                            Transform your business with our data-driven growth strategies.
                          </p>
                          <div className="pt-2">
                            <Link 
                              href="/contact"
                              className="inline-flex items-center gap-1 bg-white text-black font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg shadow-md transition-all hover:bg-neutral-100 hover:gap-1.5 active:scale-95 cursor-pointer uppercase tracking-wider"
                            >
                              <span>Get Started</span>
                              <ArrowRight className="size-3 shrink-0" />
                            </Link>
                          </div>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* About, Contact Links */}
            {["About", "Contact"].map((name) => {
              const href = `/${name.toLowerCase()}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={name}
                  href={href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 transition-colors hover:text-neutral-950 dark:hover:text-neutral-50 rounded-full",
                    isActive && "text-white hover:text-white dark:text-white dark:hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-nav-indicator"
                      className="absolute inset-0 bg-linear-to-r from-sky-400 via-sky-500 to-blue-600 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Action CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors px-3 py-1.5"
            >
              Portal
            </Link>
            <Link
              href="/contact"
              className="group relative inline-flex items-center justify-center gap-1.5 bg-linear-to-r from-sky-400 via-sky-500 to-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-full overflow-hidden transition-all hover:from-sky-500 hover:to-blue-750 active:scale-95 shadow-md shadow-sky-500/20"
            >
              <span>Get in Touch</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Action & Hamburguer */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-850 text-neutral-800 dark:text-neutral-200 focus:outline-hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Card inside header wrapper for pixel-perfect vertical alignment */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              data-lenis-prevent
              className="absolute left-4 right-4 top-[calc(100%-8px)] z-40 md:hidden glass rounded-3xl border border-neutral-200 dark:border-neutral-850 p-6 flex flex-col gap-4 shadow-2xl bg-white/95 dark:bg-neutral-950/95 overflow-y-auto"
              style={{ maxHeight: 'calc(80vh)', overflowY: 'auto' }}
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  {/* Home Link */}
                  <motion.div variants={itemVariants}>
                    <Link
                      href="/"
                      className={cn(
                        "px-4 py-3 rounded-xl text-lg font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors flex items-center justify-between",
                        pathname === "/" && "text-white dark:text-white bg-linear-to-r from-sky-400 via-sky-500 to-blue-600"
                      )}
                    >
                      Home
                    </Link>
                  </motion.div>

                  {/* Work Link */}
                  <motion.div variants={itemVariants}>
                    <Link
                      href="/work"
                      className={cn(
                        "px-4 py-3 rounded-xl text-lg font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors flex items-center justify-between",
                        pathname === "/work" && "text-white dark:text-white bg-linear-to-r from-sky-400 via-sky-500 to-blue-600"
                      )}
                    >
                      Work
                    </Link>
                  </motion.div>

                  {/* Mobile Services Accordion */}
                  <motion.div variants={itemVariants} className="flex flex-col">
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className={cn(
                        "px-4 py-3 rounded-xl text-lg font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors flex items-center justify-between cursor-pointer w-full text-left",
                        pathname.startsWith("/services") && "text-primary dark:text-primary-foreground bg-primary/10 border-primary/10 border"
                      )}
                    >
                      <span>Services</span>
                      <ChevronDown className={cn("size-5 transition-transform duration-200", mobileServicesOpen && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                      {mobileServicesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden pl-4 flex flex-col gap-1.5 mt-1 border-l border-border/60 ml-2"
                        >
                          {servicesData.map((item) => (
                            <Link
                              key={item.slug}
                              href={`/services/${item.slug}`}
                              className={cn(
                                "px-3 py-2.5 rounded-lg text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors",
                                pathname === `/services/${item.slug}` && "text-primary font-bold bg-primary/5"
                              )}
                            >
                              {item.title}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* About, Contact Links */}
                  {["About", "Contact"].map((name) => {
                    const href = `/${name.toLowerCase()}`;
                    const isActive = pathname === href;
                    return (
                      <motion.div key={name} variants={itemVariants}>
                        <Link
                          href={href}
                          className={cn(
                            "px-4 py-3 rounded-xl text-lg font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors flex items-center justify-between",
                            isActive && "text-white dark:text-white bg-linear-to-r from-sky-400 via-sky-500 to-blue-600"
                          )}
                        >
                          {name}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <motion.div variants={itemVariants} className="flex flex-col gap-6 mt-auto">
                <hr className="border-neutral-100 dark:border-neutral-800" />
                <div className="flex flex-col gap-3 text-left">
                  <Link
                    href="/login"
                    className="text-center text-sm font-semibold text-neutral-600 dark:text-neutral-400 py-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                  >
                    Client Portal Login
                  </Link>
                  <Link
                    href="/contact"
                    className="text-center text-sm font-semibold text-white bg-linear-to-r from-sky-400 via-sky-500 to-blue-600 hover:from-sky-500 hover:to-blue-700 py-3.5 rounded-xl shadow-md transition-all active:scale-[0.98]"
                  >
                    Start a Project
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Blurred dark backdrop overlay wash behind the dropdown card */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/35 dark:bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
