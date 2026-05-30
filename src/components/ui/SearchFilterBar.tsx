"use client";

import React from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { cn } from "@/lib/utils";

const categories = [
  { slug: "all", name: "All Work" },
  { slug: "websites", name: "Websites" },
  { slug: "logos", name: "Logos" },
  { slug: "social-media", name: "Social Posts" },
  { slug: "ai-art", name: "AI Art" },
  { slug: "ugc-videos", name: "UGC Videos" },
  { slug: "reels", name: "Reels" },
  { slug: "branding", name: "Branding" },
  { slug: "case-studies", name: "Case Studies" },
  { slug: "creative-assets", name: "Creative Assets" },
];

export default function SearchFilterBar() {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = usePortfolioStore();

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      {/* Search Input Bar */}
      <div className="relative group rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 shadow-[0_2px_15px_rgba(0,0,0,0.02)] transition-all hover:border-neutral-300 dark:hover:border-neutral-700 p-1">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-blue-500 transition-colors">
          <Search className="h-4.5 w-4.5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects by title, description or tags..."
          className="w-full bg-transparent pl-11 pr-4 py-3 text-sm text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-hidden"
        />
      </div>

      {/* Categories Horizontal Scroll Strip */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={cn(
                "relative px-4.5 py-2.5 text-xs font-semibold rounded-full tracking-wide transition-colors whitespace-nowrap",
                isSelected
                  ? "text-white"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
            >
              {isSelected && (
                <motion.span
                  layoutId="active-category-pill"
                  className="absolute inset-0 bg-linear-to-r from-sky-400 to-blue-600 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
