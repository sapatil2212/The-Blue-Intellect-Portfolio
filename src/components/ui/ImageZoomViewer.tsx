"use client";

import React from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface ImageZoomViewerProps {
  src: string;
  alt?: string;
  className?: string;
}

export default function ImageZoomViewer({ src, alt = "Preview Image", className }: ImageZoomViewerProps) {
  return (
    <PhotoProvider
      maskOpacity={0.85}
      loadingElement={<div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />}
    >
      <div className="relative overflow-hidden cursor-zoom-in">
        <PhotoView src={src}>
          <img
            src={src}
            alt={alt}
            className={className}
            loading="lazy"
          />
        </PhotoView>
      </div>
    </PhotoProvider>
  );
}
