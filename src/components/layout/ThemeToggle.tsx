"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full bg-neutral-100/50 dark:bg-neutral-800/50 animate-pulse border border-neutral-200/50 dark:border-neutral-800/80" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200/50 dark:border-neutral-800/80 bg-white/40 dark:bg-neutral-900/40 hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-colors shadow-xs cursor-pointer overflow-hidden"
      aria-label="Toggle theme"
    >
      <motion.div
        className="flex items-center justify-center h-full w-full"
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {isDark ? (
          <Moon className="h-4.5 w-4.5 text-blue-400 fill-blue-400/20" />
        ) : (
          <Sun className="h-4.5 w-4.5 text-amber-500 fill-amber-500/20" />
        )}
      </motion.div>
    </button>
  );
}
