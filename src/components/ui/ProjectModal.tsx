"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ExternalLink, Tag, DollarSign, Calendar, Globe, Code2,
  RefreshCw, Maximize2, Minimize2, Monitor, Smartphone, Tablet,
  ChevronLeft, ChevronRight, Play, Image as ImageIcon, ArrowUpRight,
} from "lucide-react";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Image from "next/image";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" {...props}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

// ── Browser Chrome for iframe preview ────────────────────────────────────────
type Viewport = "desktop" | "tablet" | "mobile";

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

function BrowserPreview({ url }: { url: string }) {
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [iframeKey, setIframeKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  const reload = () => { setIframeKey(k => k + 1); setLoading(true); setIframeError(false); };

  return (
    <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-950 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
      {/* Browser toolbar */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-neutral-200/80 dark:bg-neutral-900 border-b border-neutral-300/50 dark:border-neutral-800 shrink-0">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="h-3 w-3 rounded-full bg-rose-400 dark:bg-rose-500" />
          <div className="h-3 w-3 rounded-full bg-amber-400 dark:bg-amber-500" />
          <div className="h-3 w-3 rounded-full bg-emerald-400 dark:bg-emerald-500" />
        </div>

        {/* Viewport switcher */}
        <div className="flex items-center gap-0.5 bg-neutral-300/60 dark:bg-neutral-800 rounded-lg p-0.5 shrink-0">
          {(["desktop", "tablet", "mobile"] as Viewport[]).map(v => {
            const Icon = v === "desktop" ? Monitor : v === "tablet" ? Tablet : Smartphone;
            return (
              <button key={v} onClick={() => setViewport(v)}
                className={cn("p-1.5 rounded-md transition", viewport === v ? "bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200")}>
                <Icon className="h-3 w-3" />
              </button>
            );
          })}
        </div>

        {/* URL bar */}
        <div className="flex-1 flex items-center gap-2 bg-white dark:bg-neutral-800 rounded-lg px-3 py-1.5 border border-neutral-300/50 dark:border-neutral-700 min-w-0">
          <Globe className="h-3 w-3 text-emerald-500 shrink-0" />
          <span className="text-[11px] text-neutral-600 dark:text-neutral-300 truncate font-mono">{url}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={reload} className="p-1.5 rounded-lg hover:bg-neutral-300/60 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition" title="Reload">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="p-1.5 rounded-lg hover:bg-neutral-300/60 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition" title="Open in new tab">
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Iframe viewport container */}
      <div className="flex-1 overflow-auto bg-neutral-300 dark:bg-neutral-950 flex justify-center">
        <div
          className="relative h-full transition-all duration-300 bg-white"
          style={{ width: VIEWPORT_WIDTHS[viewport], minWidth: viewport === "desktop" ? "100%" : undefined }}
        >
          {loading && !iframeError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-neutral-900 z-10 gap-3">
              <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <p className="text-xs text-neutral-400 dark:text-neutral-500">Loading preview...</p>
            </div>
          )}
          {iframeError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900 gap-4 p-8 text-center">
              <div className="h-12 w-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Globe className="h-6 w-6 text-neutral-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Preview blocked</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 max-w-xs">
                  This site doesn't allow embedding. Open it directly to view.
                </p>
              </div>
              <a href={url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition">
                <ExternalLink className="h-3.5 w-3.5" /> Open Website
              </a>
            </div>
          ) : (
            <iframe
              key={iframeKey}
              src={url}
              className="w-full h-full border-0"
              style={{ minHeight: "500px" }}
              onLoad={() => setLoading(false)}
              onError={() => { setLoading(false); setIframeError(true); }}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              title="Website preview"
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Media Gallery ─────────────────────────────────────────────────────────────
function ModalGallery({ media, thumbnail }: { media: { id: string; url: string; type: string }[]; thumbnail: string }) {
  const allMedia = [{ id: "thumb", url: thumbnail, type: "IMAGE" }, ...media];
  const [idx, setIdx] = useState(0);
  const active = allMedia[idx] ?? allMedia[0];
  const isVideo = active.type === "VIDEO" || active.url.toLowerCase().endsWith(".mp4");

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Main viewer */}
      <div className="relative flex-1 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 min-h-[300px]">
        {isVideo ? (
          <video src={active.url} controls autoPlay muted loop playsInline className="w-full h-full object-contain" />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center p-2">
            <Image src={active.url} alt="Preview" fill className="object-contain" sizes="(max-width: 1024px) 100vw, 60vw" />
          </div>
        )}

        {/* Prev/Next */}
        {allMedia.length > 1 && (
          <>
            <button onClick={() => setIdx(i => (i - 1 + allMedia.length) % allMedia.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => setIdx(i => (i + 1) % allMedia.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition">
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {allMedia.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)}
                  className={cn("h-1.5 rounded-full transition-all", i === idx ? "w-4 bg-white" : "w-1.5 bg-white/50")} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allMedia.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
          {allMedia.map((item, i) => (
            <button key={item.id + i} onClick={() => setIdx(i)}
              className={cn("relative h-14 w-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                i === idx ? "border-blue-500 opacity-100" : "border-transparent opacity-50 hover:opacity-80")}>
              {item.type === "IMAGE" ? (
                <img src={item.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-neutral-800 flex items-center justify-center">
                  <Play className="h-4 w-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function ProjectModal() {
  const { selectedProject, setSelectedProject } = usePortfolioStore();
  const [activeTab, setActiveTab] = useState<"preview" | "gallery" | "info">("preview");
  const isWebsite = selectedProject?.projectType === "WEBSITE" && !!selectedProject?.websiteLink;

  // Reset tab when project changes
  useEffect(() => {
    if (selectedProject) {
      setActiveTab(isWebsite ? "preview" : "gallery");
    }
  }, [selectedProject?.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedProject(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSelectedProject]);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedProject]);

  return (
    <AnimatePresence>
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6" data-lenis-prevent>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
            className="relative z-10 w-full rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col"
            style={{ maxWidth: isWebsite && activeTab === "preview" ? "1200px" : "900px", maxHeight: "92vh" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
              {/* Tabs */}
              <div className="flex items-center gap-1 flex-1 min-w-0">
                {isWebsite && (
                  <button onClick={() => setActiveTab("preview")}
                    className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition",
                      activeTab === "preview" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400" : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800")}>
                    <Globe className="h-3.5 w-3.5" /> Live Preview
                  </button>
                )}
                {selectedProject.media.length > 0 || selectedProject.thumbnail ? (
                  <button onClick={() => setActiveTab("gallery")}
                    className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition",
                      activeTab === "gallery" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400" : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800")}>
                    <ImageIcon className="h-3.5 w-3.5" /> Gallery
                  </button>
                ) : null}
                <button onClick={() => setActiveTab("info")}
                  className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition",
                    activeTab === "info" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400" : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800")}>
                  <Code2 className="h-3.5 w-3.5" /> Details
                </button>
              </div>

              {/* Title (center) */}
              <div className="hidden sm:block text-center flex-1 min-w-0">
                <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">{selectedProject.title}</p>
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500">{selectedProject.category?.name}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-1 justify-end">
                {selectedProject.websiteLink && (
                  <a href={selectedProject.websiteLink} target="_blank" rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition">
                    <ExternalLink className="h-3.5 w-3.5" /> Visit
                  </a>
                )}
                <button onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 transition">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden">
              {/* Live Preview Tab */}
              {activeTab === "preview" && isWebsite && (
                <div className="h-full p-3" style={{ minHeight: "500px" }}>
                  <BrowserPreview url={selectedProject.websiteLink!} />
                </div>
              )}

              {/* Gallery Tab */}
              {activeTab === "gallery" && (
                <div className="h-full p-4 overflow-y-auto" style={{ minHeight: "400px" }}>
                  <ModalGallery media={selectedProject.media} thumbnail={selectedProject.thumbnail} />
                </div>
              )}

              {/* Info Tab */}
              {activeTab === "info" && (
                <div className="h-full overflow-y-auto p-5 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* Left */}
                    <div className="space-y-5">
                      <div>
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{selectedProject.title}</h2>
                        <span className="inline-block mt-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
                          {selectedProject.category?.name}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">About</h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                          {selectedProject.description}
                        </p>
                      </div>

                      {selectedProject.tags?.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedProject.tags.map(tag => (
                              <span key={tag.id} className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2.5 py-1 rounded-lg">
                                <Tag className="h-3 w-3 text-neutral-400" /> {tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right */}
                    <div className="space-y-4">
                      {selectedProject.pricing && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                          <div className="h-9 w-9 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                            <DollarSign className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Package</p>
                            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">{selectedProject.pricing}</p>
                          </div>
                        </div>
                      )}

                      {selectedProject.createdAt && (
                        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                          <Calendar className="h-4 w-4 shrink-0" />
                          <span>Published {formatDate(selectedProject.createdAt)}</span>
                        </div>
                      )}

                      {/* CTA buttons */}
                      <div className="flex flex-col gap-2 pt-2">
                        {selectedProject.websiteLink && (
                          <a href={selectedProject.websiteLink} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95">
                            <Globe className="h-4 w-4" /> Visit Website
                          </a>
                        )}
                        {selectedProject.sourceCodeLink && (
                          <a href={selectedProject.sourceCodeLink} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-sm font-semibold transition-all">
                            <GithubIcon /> Source Code
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
