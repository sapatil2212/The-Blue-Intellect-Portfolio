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
    <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-4">
      {/* Category pills */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none flex-1 min-w-0">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={cn(
                "relative px-4 py-2 text-xs font-semibold rounded-full tracking-wide transition-colors whitespace-nowrap cursor-pointer",
                isSelected
                  ? "text-white"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
            >
              {isSelected && (
                <motion.span
                  layoutId="active-category-pill"
                  className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Search input — no border box, just an underline */}
      <div className="relative shrink-0 w-full sm:w-56">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search key features or design tags..."
          className="w-full bg-transparent pl-9 pr-3 py-2 text-xs text-neutral-700 dark:text-neutral-300 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none border-b border-neutral-200 dark:border-neutral-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
        />
      </div>
    </div>
  );
}
