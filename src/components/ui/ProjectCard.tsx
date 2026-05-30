"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, ArrowUpRight, Globe, Image as ImageIcon, Video, Palette, FileText } from "lucide-react";
import { usePortfolioStore, ProjectType } from "@/store/usePortfolioStore";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: ProjectType;
}

const TYPE_ICON: Record<string, React.ElementType> = {
  WEBSITE: Globe,
  VIDEO: Video,
  UGC: Video,
  REELS: Video,
  LOGO: Palette,
  BRANDING: Palette,
  SOCIAL: ImageIcon,
  AI_ART: ImageIcon,
  CASE_STUDY: FileText,
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const setSelectedProject = usePortfolioStore((s) => s.setSelectedProject);
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoMedia = project.media.find(
    (m) => m.type === "VIDEO" || m.url.toLowerCase().endsWith(".mp4")
  );

  const TypeIcon = TYPE_ICON[project.projectType] ?? ArrowUpRight;
  const isWebsite = project.projectType === "WEBSITE";

  const handleMouseEnter = () => {
    setHovered(true);
    if (videoMedia && videoRef.current) videoRef.current.play().catch(() => {});
  };
  const handleMouseLeave = () => {
    setHovered(false);
    if (videoMedia && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      onClick={() => setSelectedProject(project)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden rounded-2xl border border-neutral-200/70 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-black/30 transition-shadow duration-300 cursor-pointer flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden bg-neutral-100 dark:bg-neutral-800" style={{ aspectRatio: "16/10" }}>
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className={cn(
              "object-cover transition-transform duration-700 ease-out",
              hovered && !videoMedia ? "scale-[1.06]" : "scale-100"
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-300 dark:text-neutral-600">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}

        {/* Video overlay */}
        {videoMedia && (
          <video
            ref={videoRef}
            src={videoMedia.url}
            loop muted playsInline
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 pointer-events-none",
              hovered ? "opacity-100" : "opacity-0"
            )}
          />
        )}

        {/* Gradient overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-300",
          hovered ? "opacity-100" : "opacity-0"
        )} />

        {/* Top-left: type badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold">
            <TypeIcon className="h-3 w-3" />
            {project.category?.name || project.projectType}
          </span>
        </div>

        {/* Top-right: featured dot */}
        {project.featured && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-bold">
              ★ Featured
            </span>
          </div>
        )}

        {/* Bottom: CTA on hover */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between transition-all duration-300",
          hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <p className="text-white text-xs font-semibold line-clamp-1 flex-1 mr-2">{project.title}</p>
          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-lg shrink-0">
            {isWebsite ? (
              <Globe className="h-3.5 w-3.5 text-blue-600" />
            ) : videoMedia ? (
              <Play className="h-3.5 w-3.5 fill-neutral-900 text-neutral-900" />
            ) : (
              <ArrowUpRight className="h-3.5 w-3.5 text-neutral-900" />
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          {project.title}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed flex-1">
          {project.description}
        </p>

        {/* Tags + website indicator */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap gap-1 flex-1 min-w-0">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag.id} className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md">
                #{tag.name}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-[9px] text-neutral-400 dark:text-neutral-500 px-1 py-0.5">+{project.tags.length - 3}</span>
            )}
          </div>
          {isWebsite && project.websiteLink && (
            <span className="shrink-0 text-[9px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
              <Globe className="h-3 w-3" /> Live
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
