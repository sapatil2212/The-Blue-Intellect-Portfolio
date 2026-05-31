"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowRight,
  X,
  Play,
  Eye,
  Info,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  CheckCircle2,
  FileText,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  Maximize2
} from "lucide-react";
import { ProjectType } from "@/store/usePortfolioStore";
import { cn } from "@/lib/utils";

interface ShowcaseClientProps {
  projects: ProjectType[];
  initialCategory?: string;
  isAdmin?: boolean;
}

// Inline SVGs for brand icons to guarantee compatibility
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function FigmaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
      <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
      <path d="M12 9h3.5a3.5 3.5 0 1 1-3.5 3.5V9z" />
      <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
      <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
      <polygon points="10 15 15 12 10 9" />
    </svg>
  );
}

export default function ShowcaseClient({
  projects = [],
  initialCategory = "all",
  isAdmin = false
}: ShowcaseClientProps) {
   const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<ProjectType | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isPreviewLive, setIsPreviewLive] = useState(false);
  const [selectedSubType, setSelectedSubType] = useState<string | null>(null);

  // Lightbox Zoom / Pan States
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Extract all unique categories
  const categoriesList = useMemo(() => {
    const list = new Map<string, { id: string; name: string; slug: string }>();
    projects.forEach(p => {
      if (p.category) {
        list.set(p.category.id, p.category);
      }
    });
    return Array.from(list.values());
  }, [projects]);

  // Filters projects based on selected category, query, and publish status (allow admins to view drafts)
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const isLive = p.published || isAdmin;
      const matchesCategory = selectedCategory === "all" || p.categoryId === selectedCategory;
      const matchesSubType = !selectedSubType || p.subType === selectedSubType;
      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.subType && p.subType.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.tags?.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return isLive && matchesCategory && matchesSubType && matchesSearch;
    });
  }, [projects, selectedCategory, selectedSubType, searchQuery, isAdmin]);

  // Extract unique subTypes for projects in the currently selected category
  const availableSubTypes = useMemo(() => {
    if (selectedCategory === "all") return [];
    const types = new Set<string>();
    projects.forEach(p => {
      const isLive = p.published || isAdmin;
      if (isLive && p.categoryId === selectedCategory && p.subType) {
        types.add(p.subType.trim());
      }
    });
    return Array.from(types).sort();
  }, [projects, selectedCategory, isAdmin]);

  // Counts of projects per category for UX badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    let total = 0;
    
    projects.forEach(p => {
      const isLive = p.published || isAdmin;
      if (isLive) {
        total++;
        if (p.categoryId) {
          counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
        }
      }
    });
    
    return {
      all: total,
      ...counts
    } as Record<string, number>;
  }, [projects, isAdmin]);

  // Featured Spotlight Projects (displayed on top)
  const featuredProjects = useMemo(() => {
    return filteredProjects.filter(p => p.featured);
  }, [filteredProjects]);

  // Standard Projects Grid (non-featured or fallback)
  const standardProjects = useMemo(() => {
    return filteredProjects.filter(p => !p.featured || featuredProjects.length > 3);
  }, [filteredProjects, featuredProjects]);

  const activeProjectParsedDescription = useMemo(() => {
    if (!activeProject) return null;
    if (activeProject.projectType === "CASE_STUDY" && activeProject.description.trim().startsWith("{")) {
      try {
        return JSON.parse(activeProject.description);
      } catch (e) {
        return null;
      }
    }
    return null;
  }, [activeProject]);

  const projectTypesLabel: Record<string, string> = {
    WEBSITE: "Website Preview",
    LOGO: "Logo Design",
    SOCIAL: "Social Media Campaign",
    AI_ART: "AI Generative Concept",
    UGC: "UGC Showcase",
    REELS: "Instagram Content",
    BRANDING: "Identity System",
    CASE_STUDY: "Case Study Breakdown",
    CREATIVE_ASSET: "Design Asset"
  };

  return (
    <div className="w-full max-w-[1380px] mx-auto px-4 pt-32 pb-24 space-y-12">
      {/* Header Block */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-8">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/15 dark:border-blue-400/15">
          <Sparkles className="h-3.5 w-3.5 fill-blue-500/20" />
          <span>Agency Showcase</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
          Our <span className="gradient-text">Creative Work</span>
        </h1>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
          Explore our collection of next-generation digital products, high-converting platforms, and interactive campaign assets.
        </p>
      </div>

      {/* ── Category Filters and Search Control Panel ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-4 md:p-5 rounded-3xl bg-white/60 dark:bg-neutral-950/40 backdrop-blur-xl border border-neutral-200/80 dark:border-white/10 shadow-none dark:shadow-2xl dark:shadow-neutral-950/30 transition-all duration-300">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none w-full lg:w-auto">
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedSubType(null);
            }}
            className={cn(
              "px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-2",
              selectedCategory === "all"
                ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500 shadow-md shadow-blue-600/10 dark:shadow-blue-500/10"
                : "bg-neutral-100/50 hover:bg-neutral-200/50 text-neutral-600 hover:text-neutral-900 dark:bg-white/5 dark:hover:bg-white/10 dark:text-neutral-400 dark:hover:text-white border-neutral-200/40 dark:border-white/5"
            )}
          >
            <span>All Creative Work</span>
            <span className={cn(
              "text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold transition-all",
              selectedCategory === "all"
                ? "bg-white/20 text-white"
                : "bg-neutral-200/60 text-neutral-500 dark:bg-white/10 dark:text-neutral-400"
            )}>
              {categoryCounts.all}
            </span>
          </button>
          {categoriesList.map(cat => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedSubType(null);
                }}
                className={cn(
                  "px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-2",
                  isSelected
                    ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500 shadow-md shadow-blue-600/10 dark:shadow-blue-500/10"
                    : "bg-neutral-100/50 hover:bg-neutral-200/50 text-neutral-600 hover:text-neutral-900 dark:bg-white/5 dark:hover:bg-white/10 dark:text-neutral-400 dark:hover:text-white border-neutral-200/40 dark:border-white/5"
                )}
              >
                <span>{cat.name}</span>
                <span className={cn(
                  "text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold transition-all",
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-neutral-200/60 text-neutral-500 dark:bg-white/10 dark:text-neutral-400"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Animated Search Container */}
        <div className="flex items-center justify-end relative h-10 w-full lg:w-auto shrink-0">
          <AnimatePresence initial={false}>
            {!isSearchOpen ? (
              <motion.button
                key="search-trigger"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 rounded-full border border-neutral-200 dark:border-white/10 bg-white/40 dark:bg-neutral-900/30 hover:bg-neutral-100 hover:text-blue-500 dark:hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-xs shrink-0"
                title="Search showcase"
              >
                <Search className="size-4" />
              </motion.button>
            ) : (
              <motion.div
                key="search-input-container"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="relative flex items-center h-10 overflow-hidden bg-white/50 dark:bg-neutral-900/30 rounded-full border border-neutral-200 dark:border-white/10"
              >
                <Search className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search tags or key features..."
                  className="w-full h-full pl-10 pr-9 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-semibold"
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="absolute right-2.5 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-neutral-200/50 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="size-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Sub Category Filter Menu ── */}
      {availableSubTypes.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-2xl bg-neutral-100/30 dark:bg-neutral-900/10 border border-neutral-200/40 dark:border-white/5 animate-fadeIn">
          <span className="text-[10px] uppercase font-black text-muted-foreground mr-2 tracking-wider pl-1.5">
            Filter by Sub-type:
          </span>
          <button
            onClick={() => setSelectedSubType(null)}
            className={cn(
              "px-3 py-1 rounded-xl text-[10px] font-extrabold cursor-pointer border transition-all",
              !selectedSubType
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs"
                : "bg-transparent hover:bg-neutral-100 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground border-neutral-200/60 dark:border-white/5"
            )}
          >
            All
          </button>
          {availableSubTypes.map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubType(sub)}
              className={cn(
                "px-3 py-1 rounded-xl text-[10px] font-extrabold cursor-pointer border transition-all",
                selectedSubType === sub
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs"
                  : "bg-transparent hover:bg-neutral-100 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground border-neutral-200/60 dark:border-white/5"
              )}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* ── Unified Creative Grid ── */}
      <div className="space-y-6">
        {filteredProjects.length === 0 ? (
          <div className="rounded-3xl border border-border/80 glass-card p-16 text-center flex flex-col items-center justify-center max-w-xl mx-auto shadow-xl">
            <div className="h-12 w-12 rounded-2xl bg-muted/40 flex items-center justify-center mb-4 border border-border/60">
              <Info className="size-6 text-muted-foreground" />
            </div>
            <h3 className="font-extrabold text-foreground text-lg">No Catalog Listings Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-2 leading-relaxed">
              No active projects match your category selection or search keywords. Please try clearing your search query or selecting another category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => {
                const isFeatured = project.featured;
                const isWebsite = project.category?.slug === "websites";
                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => {
                      setActiveProject(project);
                      setActiveMediaIndex(0);
                      setIsPreviewLive(!!project.websiteLink && project.projectType === "WEBSITE");
                    }}
                    className={cn(
                      "group relative overflow-hidden rounded-3xl border border-border/80 glass-card flex flex-col hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer",
                      isFeatured ? "md:col-span-2 lg:col-span-2 md:flex-row min-h-[340px]" : "col-span-1 aspect-[4/3.3]"
                    )}
                  >
                    {isWebsite ? (
                      <>
                        {/* Media / Image Area */}
                        <div
                          className={cn(
                            "relative overflow-hidden bg-muted shrink-0",
                            isFeatured 
                              ? "w-full md:w-1/2 aspect-video md:aspect-auto md:min-h-full" 
                              : "w-full aspect-[2.4/1]"
                          )}
                        >
                          <img
                            src={project.thumbnail}
                            alt={project.title}
                            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                          />


                          {/* Glass view indicator */}
                          <div className="absolute top-4 right-4 flex gap-1.5 items-center bg-blue-600 dark:bg-blue-500 border border-blue-500/20 px-3 py-1.5 rounded-xl text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-extrabold uppercase tracking-wider shadow-lg shadow-blue-600/20">
                            <Eye className="size-3.5 text-white animate-pulse" style={{ color: "#ffffff", stroke: "#ffffff" }} />
                            <span className="text-white" style={{ color: "#ffffff" }}>View Project</span>
                          </div>

                          {/* Featured / Spotlight Badge */}
                          {isFeatured && (
                            <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-primary/20 flex items-center gap-1.5 border border-primary/20">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                              </span>
                              <span>Featured Spotlight</span>
                            </span>
                          )}

                          {/* Draft status watermark */}
                          {!project.published && (
                            <span className="absolute top-4 left-4 bg-rose-500 text-white text-[9px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-rose-450 shadow-md">
                              DRAFT
                            </span>
                          )}
                        </div>

                        {/* Project Info Block */}
                        <div
                          className={cn(
                            "flex flex-col justify-between flex-1",
                            isFeatured ? "p-6 w-full md:w-1/2" : "p-3 w-full"
                          )}
                        >
                          <div className="space-y-3">
                            <div className={cn("flex items-center flex-wrap", isFeatured ? "gap-2" : "gap-1.5")}>
                              <span className={cn("bg-primary/10 text-primary font-extrabold uppercase rounded-full border border-primary/10", isFeatured ? "text-[10px] px-2.5 py-0.5" : "text-[8px] px-2 py-0.5 tracking-wider")}>
                                {project.category?.name}
                              </span>
                              {project.subType && (
                                <span className={cn("bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold uppercase rounded-full border border-indigo-500/10", isFeatured ? "text-[10px] px-2.5 py-0.5" : "text-[8px] px-2 py-0.5 tracking-wider")}>
                                  {project.subType}
                                </span>
                              )}
                              <span className={cn("font-bold text-muted-foreground uppercase tracking-wider", isFeatured ? "text-[10px]" : "text-[8px]")}>
                                {projectTypesLabel[project.projectType] || project.projectType}
                              </span>
                            </div>

                            <h3
                              className={cn(
                                "font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300",
                                isFeatured ? "text-xl md:text-2xl line-clamp-2" : "text-sm md:text-base line-clamp-1"
                              )}
                            >
                              {project.title}
                            </h3>

                            <p className={cn("text-neutral-600 dark:text-neutral-350 leading-relaxed font-medium", isFeatured ? "text-xs line-clamp-2" : "text-[10px] line-clamp-1")}>
                              {project.projectType === "CASE_STUDY" && project.description.trim().startsWith("{")
                                ? JSON.parse(project.description).rawDescription
                                : project.description}
                            </p>
                          </div>

                          {/* Tags footer */}
                          {project.tags && project.tags.length > 0 && (
                            <div className={cn("flex flex-wrap gap-1 border-t border-border/40", isFeatured ? "mt-6 pt-4" : "mt-2 pt-2")}>
                              {project.tags.slice(0, isFeatured ? 4 : 3).map(tag => (
                                <span
                                  key={tag.id}
                                  className={cn("font-semibold bg-muted text-muted-foreground border border-border rounded-lg", isFeatured ? "text-[10px] px-2.5 py-0.5" : "text-[8px] px-1.5 py-0.5")}
                                >
                                  {tag.name}
                                </span>
                              ))}
                              {project.tags.length > (isFeatured ? 4 : 3) && (
                                <span className={cn("font-semibold text-muted-foreground font-mono self-center", isFeatured ? "text-[10px] px-2 py-0.5" : "text-[8px] px-1 py-0.5")}>
                                  +{project.tags.length - (isFeatured ? 4 : 3)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      /* Non-website Card View: ONLY show Image and Category Type Badge */
                      <div className="relative w-full h-full overflow-hidden bg-muted flex-1">
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                        />


                        {/* Floating Category Badge in top-left */}
                        <span 
                          className="absolute top-4 left-4 bg-blue-600 dark:bg-blue-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-lg border border-blue-500/20"
                          style={{ color: "#ffffff" }}
                        >
                          {project.category?.name}
                        </span>

                        {/* Glass view indicator in top-right */}
                        <div className="absolute top-4 right-4 flex gap-1.5 items-center bg-blue-600 dark:bg-blue-500 border border-blue-500/20 px-3 py-1.5 rounded-xl text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-extrabold uppercase tracking-wider shadow-lg shadow-blue-600/20">
                          <Eye className="size-3.5 text-white animate-pulse" style={{ color: "#ffffff", stroke: "#ffffff" }} />
                          <span className="text-white" style={{ color: "#ffffff" }}>View Project</span>
                        </div>

                        {/* Spotlight Featured watermark */}
                        {isFeatured && (
                          <span 
                            className="absolute bottom-4 left-4 bg-amber-500 text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-amber-400 shadow-md"
                            style={{ color: "#ffffff" }}
                          >
                            Featured Spotlight
                          </span>
                        )}

                        {/* Draft status watermark */}
                        {!project.published && (
                          <span 
                            className="absolute bottom-4 left-4 bg-rose-500 text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-rose-450 shadow-md"
                            style={{ color: "#ffffff" }}
                          >
                            DRAFT
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Showcase Modal Overlay ── */}
      <AnimatePresence>
        {activeProject && (
          <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => {
                setActiveProject(null);
                setIsPreviewLive(false);
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className={cn(
                "relative w-full overflow-hidden rounded-3xl border border-border bg-card shadow-2xl text-foreground text-left flex flex-col transition-all duration-300",
                isPreviewLive 
                  ? "max-w-7xl w-[95vw] h-[90vh]" 
                  : "max-w-5xl w-[90vw] max-h-[90vh] p-8 overflow-y-auto"
              )}
            >
              {/* Top Row: Title & Close or Browser Controls */}
              {isPreviewLive ? (
                <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border bg-muted/40 shrink-0">
                  {/* Browser simulated dots */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>

                  {/* Browser simulated URL Bar */}
                  <div className="flex-1 max-w-xl mx-auto flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card/85 text-xs text-muted-foreground select-all">
                    <Globe className="size-3.5 text-primary shrink-0" />
                    <span className="truncate flex-1 font-mono text-[10px] tracking-wide text-foreground">
                      {activeProject.websiteLink}
                    </span>
                  </div>

                  {/* Right: View toggle and Close button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPreviewLive(false)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors cursor-pointer"
                    >
                      <Info className="size-3.5 text-muted-foreground" />
                      <span className="hidden sm:inline">Details</span>
                    </button>
                    <a
                      href={activeProject.websiteLink || undefined}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors cursor-pointer text-center text-decoration-none"
                    >
                      <ExternalLink className="size-3.5 text-muted-foreground" />
                      <span className="hidden sm:inline">Open Tab</span>
                    </a>
                    <button
                      onClick={() => {
                        setActiveProject(null);
                        setIsPreviewLive(false);
                      }}
                      className="w-8 h-8 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0 cursor-pointer"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Original Details Top Row */
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-border mb-6">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-primary tracking-widest block">
                      {activeProject.category?.name} • {projectTypesLabel[activeProject.projectType] || activeProject.projectType}
                    </span>
                    <h2 className="text-xl font-bold tracking-tight mt-1 flex items-center gap-2">
                      {activeProject.title}
                      {activeProject.featured && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[8px] font-bold border border-amber-500/20">
                          SPOTLIGHT
                        </span>
                      )}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setActiveProject(null);
                      setIsPreviewLive(false);
                    }}
                    className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0 cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}

              {/* Main Contents Split or Browser Preview */}
              {isPreviewLive ? (
                <div className="flex-1 w-full relative bg-white overflow-hidden flex flex-col">
                  {/* Security Banner */}
                  <div className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-100 dark:border-amber-900/30 px-6 py-2 flex items-center justify-between text-[11px] text-amber-800 dark:text-amber-300 shrink-0">
                    <span className="flex items-center gap-1.5 font-medium leading-none">
                      <Info className="size-3.5 text-amber-500 shrink-0" />
                      Interactive sandbox preview. If the website does not load due to provider security headers, 
                      <a href={activeProject.websiteLink || undefined} target="_blank" rel="noreferrer" className="underline font-bold hover:text-amber-950 dark:hover:text-amber-100 ml-1">
                        open in a new tab
                      </a>.
                    </span>
                  </div>
                  
                  {/* Active Iframe */}
                  <iframe
                    src={activeProject.websiteLink || undefined}
                    className="w-full flex-1 border-0 bg-white"
                    title={activeProject.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  />
                </div>
              ) : (
                /* Original Details Split Layout Start */
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left side: Media Viewer */}
                <div className="lg:col-span-3 space-y-4">
                  {/* Primary Media Asset */}
                  <div className="relative aspect-video rounded-2xl border border-border bg-muted overflow-hidden">
                    {activeProject.media && activeProject.media.length > 0 ? (
                      activeProject.media[activeMediaIndex]?.type === "VIDEO" ? (
                        <video
                          src={activeProject.media[activeMediaIndex].url}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={activeProject.media[activeMediaIndex]?.url || activeProject.thumbnail}
                          alt="Project Media"
                          className={cn(
                            "w-full h-full object-cover",
                            !(activeProject.category?.slug === "websites" || activeProject.projectType === "WEBSITE") && "cursor-zoom-in hover:opacity-90 transition-opacity"
                          )}
                          onClick={() => {
                            if (!(activeProject.category?.slug === "websites" || activeProject.projectType === "WEBSITE")) {
                              setLightboxImageUrl(activeProject.media[activeMediaIndex]?.url || activeProject.thumbnail);
                              setZoomLevel(1);
                              setPanOffset({ x: 0, y: 0 });
                              setIsLightboxOpen(true);
                            }
                          }}
                        />
                      )
                    ) : (
                      <img
                        src={activeProject.thumbnail}
                        alt="Project Thumbnail"
                        className={cn(
                          "w-full h-full object-cover",
                          !(activeProject.category?.slug === "websites" || activeProject.projectType === "WEBSITE") && "cursor-zoom-in hover:opacity-90 transition-opacity"
                        )}
                        onClick={() => {
                          if (!(activeProject.category?.slug === "websites" || activeProject.projectType === "WEBSITE")) {
                            setLightboxImageUrl(activeProject.thumbnail);
                            setZoomLevel(1);
                            setPanOffset({ x: 0, y: 0 });
                            setIsLightboxOpen(true);
                          }
                        }}
                      />
                    )}
                  </div>

                  {/* Thumbnail Selector Carousel */}
                  {activeProject.media && activeProject.media.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                      {/* Standard image thumb */}
                      <button
                        onClick={() => {
                          // Allow adding index for thumbnail
                        }}
                        className={cn(
                          "relative h-12 w-20 rounded-lg border overflow-hidden shrink-0 transition-all",
                          activeMediaIndex === -1 ? "border-primary" : "border-border hover:border-slate-500/30"
                        )}
                        style={{ display: "none" }} // skip helper placeholder
                      >
                        <img src={activeProject.thumbnail} alt="" className="w-full h-full object-cover" />
                      </button>

                      {activeProject.media.map((media, index) => (
                        <button
                          key={media.id}
                          onClick={() => setActiveMediaIndex(index)}
                          className={cn(
                            "relative h-12 w-20 rounded-lg border overflow-hidden shrink-0 transition-all cursor-pointer",
                            activeMediaIndex === index ? "border-primary scale-95" : "border-border hover:border-slate-500/30"
                          )}
                        >
                          <img src={media.url} alt="" className="w-full h-full object-cover" />
                          {media.type === "VIDEO" && (
                            <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                              <Play className="size-3 text-white fill-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right side: Project Details & Integrations */}
                <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* CASE STUDY STRUCTURAL RENDERING */}
                    {activeProjectParsedDescription ? (
                      <div className="space-y-4">
                        {activeProjectParsedDescription.badge && (
                          <span className="inline-flex text-[10px] font-bold px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded border border-blue-500/20">
                            {activeProjectParsedDescription.badge}
                          </span>
                        )}

                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <FileText className="size-3.5" /> Project Overview
                          </h4>
                          <p className="text-xs text-foreground leading-relaxed mt-1">
                            {activeProjectParsedDescription.rawDescription}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                            <AlertCircle className="size-3.5" /> Client Challenge
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                            {activeProjectParsedDescription.challenge}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5" /> Solution & Action
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                            {activeProjectParsedDescription.solution}
                          </p>
                        </div>

                        {/* Outcomes & Stats */}
                        {activeProjectParsedDescription.stats && activeProjectParsedDescription.stats.length > 0 && (
                          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                            {activeProjectParsedDescription.stats.map((stat: any, index: number) => (
                              <div key={index} className="rounded-xl border border-border bg-muted/30 p-3 text-center">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                                  {stat.label}
                                </span>
                                <p className="text-lg font-black text-primary mt-1 flex items-center justify-center gap-1">
                                  <TrendingUp className="size-4 shrink-0" /> {stat.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      // STANDARD SHOWCASE DESCRIPTION
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                          Project Description
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {activeProject.description}
                        </p>
                      </div>
                    )}

                    {/* Metadata tags */}
                    {activeProject.tags && activeProject.tags.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Core Attributes
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {activeProject.tags.map(tag => (
                            <span
                              key={tag.id}
                              className="text-[10px] font-bold px-2 py-0.5 bg-muted text-muted-foreground border border-border rounded"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pricing Badge */}
                    {activeProject.pricing && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Estimate Cost:</span>
                        <span className="text-primary font-bold">{activeProject.pricing}</span>
                      </div>
                    )}
                  </div>

                  {/* Primary Link buttons */}
                  <div className="space-y-2 pt-6 border-t border-border mt-auto">
                    {activeProject.websiteLink && (
                      <button
                        onClick={() => setIsPreviewLive(true)}
                        className="w-full h-9 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10 hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        <Globe className="size-4" />
                        Preview Live Website
                        <ArrowRight className="size-3.5" />
                      </button>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2">
                      {activeProject.websiteLink && (
                        <a
                          href={activeProject.websiteLink || undefined}
                          target="_blank"
                          rel="noreferrer"
                          className="h-9 rounded-xl border border-border hover:bg-muted text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors text-center"
                        >
                          <ExternalLink className="size-3.5 text-slate-400" />
                          Open New Tab
                        </a>
                      )}
                      
                      {activeProject.sourceCodeLink && (
                        <a
                          href={activeProject.sourceCodeLink || undefined}
                          target="_blank"
                          rel="noreferrer"
                          className={cn(
                            "h-9 rounded-xl border border-border hover:bg-muted text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors text-center",
                            activeProject.websiteLink ? "" : "col-span-2"
                          )}
                        >
                          <GithubIcon className="size-4 text-slate-400" />
                          Repository
                        </a>
                      )}
                      
                      {activeProject.projectType === "REELS" || activeProject.projectType === "UGC" || activeProject.projectType === "SOCIAL" ? (
                        activeProject.websiteLink ? null : (
                          <div className="col-span-2 text-center text-[10px] text-slate-500 font-semibold italic">
                            Social content project assets. Click previews on the left to watch.
                          </div>
                        )
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* ── Visual Lightbox Zoom / Pan Overlay ── */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div 
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 select-none outline-none"
            onKeyDown={(e) => {
              if (e.key === "Escape") setIsLightboxOpen(false);
            }}
            tabIndex={0}
          >
            {/* Top Close Button & Toolbar */}
            <div className="absolute top-4 right-4 z-[60] flex items-center gap-3">
              <span className="text-[10px] text-slate-400 font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md select-none">
                Scroll to Zoom • Drag to Pan
              </span>
              <button 
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white transition cursor-pointer"
                title="Close interactive view"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Bottom Toolbar controls */}
            <div className="absolute bottom-6 z-[60] flex items-center gap-2 bg-black/60 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md shadow-2xl">
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="size-4" />
              </button>
              <span className="text-[10px] font-mono font-bold tracking-widest text-white px-2.5 min-w-[50px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(4, prev + 0.25))}
                className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="size-4" />
              </button>
              <div className="w-[1px] h-4 bg-white/10 mx-1.5" />
              <button
                onClick={() => {
                  setZoomLevel(1);
                  setPanOffset({ x: 0, y: 0 });
                }}
                className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                title="Reset zoom & pan"
              >
                <Maximize2 className="size-3.5" />
                Reset
              </button>
            </div>

            {/* Main Interactive Image Stage */}
            <div 
              className="w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => {
                e.preventDefault();
                setIsDragging(true);
                setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
              }}
              onMouseMove={(e) => {
                if (!isDragging) return;
                setPanOffset({
                  x: e.clientX - dragStart.x,
                  y: e.clientY - dragStart.y
                });
              }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onWheel={(e) => {
                const delta = e.deltaY < 0 ? 0.1 : -0.1;
                setZoomLevel(prev => Math.min(4, Math.max(0.5, prev + delta)));
              }}
            >
              <img 
                src={lightboxImageUrl} 
                alt="Interactive View"
                draggable={false}
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                  transition: isDragging ? "none" : "transform 0.15s ease-out",
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
                }}
                className="max-w-[90vw] max-h-[80vh] w-auto h-auto object-contain rounded-lg border border-white/5 select-none"
              />
            </div>

          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
