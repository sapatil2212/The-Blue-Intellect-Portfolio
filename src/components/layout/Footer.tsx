"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowRight, Sparkles, Mail, Clock, Check, Loader2, Phone, MapPin } from "lucide-react";
import { FaInstagram, FaXTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa6";

const platformLinks = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/work" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Client Portal", href: "/login" },
];

const serviceLinks = [
  { name: "Websites", href: "/services/ui-ux-design" },
  { name: "Custom Softwares", href: "/services/web-development" },
  { name: "App Development", href: "/services/domain-hosting" },
  { name: "Branding", href: "/services/graphic-design" },
  { name: "Local SEO & Marketing", href: "/services/digital-marketing" },
  { name: "Ads & Strategy", href: "/services/strategy-consulting" },
];

export default function Footer() {
  const pathname = usePathname();

  // Exclude login and signup routes from footer
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup")
  ) {
    return null;
  }

  // Live Digital Clock state
  const [time, setTime] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const updateTime = () => {
      const now = new Date();
      // Format time as hh:mm:ss AM/PM in user's current locale or standard layout
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative z-10 w-full mt-auto border-t border-blue-500/15 dark:border-blue-400/15 bg-neutral-50/50 dark:bg-neutral-950/40 backdrop-blur-md overflow-hidden">
      {/* Visual Accent Glow Orb */}
      <div className="absolute top-[-100px] left-[50%] -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 dark:bg-blue-500/3 blur-[120px] pointer-events-none -z-10 rounded-full" />

      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-8">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 group mb-6">
                <img
                  src="/images/logo.png"
                  alt="The Blue Intellect Logo"
                  className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 max-w-sm">
                Next-gen digital solutions built for progressive brands. Integrating creative design with technical excellence.
              </p>
            </div>

            {/* Time Widget */}
            <div className="mt-8 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-blue-500/15 dark:border-blue-400/15">
              <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-neutral-100/60 dark:bg-neutral-900/40 backdrop-blur-md border border-blue-500/15 dark:border-blue-400/15 text-xs font-medium text-neutral-800 dark:text-neutral-350">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-neutral-500 dark:text-neutral-500 font-semibold">Active & Online</span>
                <span className="text-blue-500/20 dark:text-blue-400/20">|</span>
                {isClient && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 inline text-neutral-400" />
                    <span>{time}</span>
                    <span className="text-[10px] text-neutral-400 font-normal">
                      ({Intl.DateTimeFormat().resolvedOptions().timeZone.split("/")[1]?.replace("_", " ") || "Local"})
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-8 gap-x-6 lg:col-span-8">
            {/* Column: Platform */}
            <div>
              <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-900 dark:text-neutral-100 mb-5">
                Platform
              </h3>
              <ul className="space-y-3.5">
                {platformLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group relative inline-flex items-center text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    >
                      <span>{link.name}</span>
                      <motion.span
                        className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-500 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column: Services */}
            <div>
              <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-900 dark:text-neutral-100 mb-5">
                Services
              </h3>
              <ul className="space-y-3.5">
                {serviceLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group relative inline-flex items-center text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    >
                      <span>{link.name}</span>
                      <motion.span
                        className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-500 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column: Contact Info */}
            <div>
              <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-900 dark:text-neutral-100 mb-5">
                Contact Info
              </h3>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-2.5">
                  <Mail className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] text-neutral-400 dark:text-neutral-500 font-semibold uppercase tracking-wider">Email Us</p>
                    <a href="mailto:info@theblueintellect.com" className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      info@theblueintellect.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] text-neutral-400 dark:text-neutral-500 font-semibold uppercase tracking-wider">Call / WhatsApp</p>
                    <a href="tel:+919096896679" className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      +91 90968 96679
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] text-neutral-400 dark:text-neutral-500 font-semibold uppercase tracking-wider">Location</p>
                    <p className="text-xs font-semibold text-neutral-855 dark:text-neutral-155 leading-relaxed">
                      Pune, Maharashtra, India
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>


        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-blue-500/15 dark:border-blue-400/15 flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs text-neutral-500 dark:text-neutral-500 font-medium">
              &copy; {new Date().getFullYear()} The Blue Intellect. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-neutral-400 dark:text-neutral-600">
              <Link href="/privacy" className="hover:text-blue-500 transition-colors">Privacy Policy</Link>
              <span>&middot;</span>
              <Link href="/terms" className="hover:text-blue-500 transition-colors">Terms of Service</Link>
            </div>
          </div>

          {/* Socials & Back To Top */}
          <div className="flex items-center justify-between md:justify-start gap-4">
            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
                { icon: FaXTwitter, href: "https://x.com", label: "X (Twitter)" },
                { icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group flex items-center justify-center h-10 w-10 rounded-full border border-blue-500/15 dark:border-blue-400/15 hover:border-blue-500/30 dark:hover:border-blue-400/30 bg-neutral-100/60 dark:bg-neutral-900/40 text-neutral-600 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <social.icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>

            {/* Back to top button */}
            <button
              onClick={handleBackToTop}
              aria-label="Back to top"
              className="flex items-center justify-center h-10 w-10 rounded-full border border-blue-500/15 dark:border-blue-400/15 hover:border-blue-500/30 dark:hover:border-blue-400/30 bg-neutral-100/60 dark:bg-neutral-900/40 text-neutral-600 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ArrowUp className="h-4.5 w-4.5 animate-bounce" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
