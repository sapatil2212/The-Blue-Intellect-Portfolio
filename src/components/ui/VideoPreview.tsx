"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPreviewProps {
  url: string;
  className?: string;
  autoPlay?: boolean;
}

export default function VideoPreview({ url, className, autoPlay = false }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // YouTube identifier parser
  const getYoutubeId = (link: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = link.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const ytId = getYoutubeId(url);

  // Instagram URL parser
  const isInstagram = url.includes("instagram.com/reel/") || url.includes("instagram.com/p/");
  
  const getInstagramEmbedUrl = (link: string) => {
    const cleanUrl = link.split("?")[0];
    return `${cleanUrl}${cleanUrl.endsWith("/") ? "" : "/"}embed`;
  };

  useEffect(() => {
    if (videoRef.current) {
      if (autoPlay) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [autoPlay, url]);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!videoRef.current) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (ytId) {
    return (
      <div className={cn("relative aspect-video w-full overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-200/10", className)}>
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=${autoPlay ? 1 : 0}&mute=1&loop=1&playlist=${ytId}`}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (isInstagram) {
    return (
      <div className={cn("relative w-full overflow-hidden rounded-2xl bg-neutral-950 flex justify-center items-center border border-neutral-200/10", className)} style={{ aspectRatio: "9/16", maxHeight: "580px" }}>
        <iframe
          src={getInstagramEmbedUrl(url)}
          className="h-full w-full border-0 min-h-[480px]"
          scrolling="no"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div
      className={cn("group relative aspect-video w-full overflow-hidden rounded-2xl bg-neutral-950 cursor-pointer border border-neutral-200/10", className)}
      onClick={handlePlayPause}
    >
      <video
        ref={videoRef}
        src={url}
        autoPlay={autoPlay}
        muted={isMuted}
        loop
        playsInline
        className="h-full w-full object-cover"
      />
      
      {/* Video Visual Hover Overlay */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-transform active:scale-95 shadow-md">
          {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white translate-x-0.5" />}
        </div>
      </div>

      {/* Mute toggle button */}
      <div className="absolute bottom-3 right-3 z-10">
        <button
          onClick={handleMute}
          className="h-8 w-8 rounded-full bg-black/45 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          type="button"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
