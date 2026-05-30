"use client";

import React, { useState } from "react";
import ImageZoomViewer from "./ImageZoomViewer";
import VideoPreview from "./VideoPreview";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: string;
  url: string;
  type: string;
}

interface MediaGalleryProps {
  media: MediaItem[];
  thumbnail: string;
}

export default function MediaGallery({ media, thumbnail }: MediaGalleryProps) {
  // Combine thumbnail (default card image) and the media array to construct our sliding carousel
  const allMedia = [
    { id: "thumb", url: thumbnail, type: "IMAGE" },
    ...media,
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = allMedia[activeIndex] || allMedia[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Focus Viewport */}
      <div className="relative overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/40">
        {activeItem.type === "IMAGE" ? (
          <div className="flex items-center justify-center p-1 bg-white dark:bg-neutral-950">
            <ImageZoomViewer
              src={activeItem.url}
              alt="Gallery Image Preview"
              className="w-full h-auto object-contain max-h-[460px] rounded-xl"
            />
          </div>
        ) : (
          <VideoPreview url={activeItem.url} autoPlay={true} className="max-h-[460px]" />
        )}
      </div>

      {/* Mini Thumbnails Selector Strip */}
      {allMedia.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {allMedia.map((item, index) => {
            const isSelected = index === activeIndex;
            return (
              <button
                key={item.id + "-" + index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 border-2 transition-all duration-300",
                  isSelected
                    ? "border-blue-600 dark:border-blue-500 scale-95 shadow-md"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                {item.type === "IMAGE" ? (
                  <img
                    src={item.url}
                    className="h-full w-full object-cover"
                    alt="Gallery thumbnail"
                  />
                ) : (
                  <div className="relative h-full w-full bg-neutral-900 flex items-center justify-center text-[9px] text-neutral-200 font-bold uppercase">
                    <div className="absolute inset-0 bg-neutral-950/40" />
                    <span className="relative z-10">Video</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
