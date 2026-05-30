"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: string) => void;
  label?: string;
  accept?: string;
  className?: string;
}

export default function UploadDropzone({
  onUploadSuccess,
  onUploadError,
  label = "Drag & drop files here or click to browse",
  accept = "image/*,video/*",
  className,
}: UploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.url) {
        setSuccess(true);
        onUploadSuccess(data.url);
      } else {
        const errorMsg = data.error || "Failed to upload file.";
        setError(errorMsg);
        if (onUploadError) onUploadError(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err.message || "An unexpected error occurred.";
      setError(errorMsg);
      if (onUploadError) onUploadError(errorMsg);
    } finally {
      setIsUploading(false);
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerFileInput}
      className={cn(
        "relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-all duration-300 cursor-pointer bg-neutral-50/50 dark:bg-white/2 hover:bg-neutral-100/50 dark:hover:bg-white/5",
        isDragOver
          ? "border-blue-500 bg-blue-500/10 dark:bg-blue-500/5 scale-[1.01]"
          : "border-neutral-300 dark:border-white/10",
        isUploading && "pointer-events-none opacity-80",
        className
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        disabled={isUploading}
      />

      {isUploading ? (
        <div className="flex flex-col items-center space-y-2 animate-pulse text-blue-500">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-xxs font-bold uppercase tracking-wider">Uploading asset files...</p>
        </div>
      ) : success ? (
        <div className="flex flex-col items-center space-y-2 text-emerald-500">
          <CheckCircle className="h-8 w-8 animate-scaleUp" />
          <p className="text-xxs font-bold uppercase tracking-wider">Asset Upload Completed!</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center space-y-2 text-rose-500">
          <AlertCircle className="h-8 w-8" />
          <p className="text-xxs font-bold uppercase tracking-wider">{error}</p>
          <span className="text-[10px] text-zinc-400">Click to try again</span>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2 text-neutral-400 dark:text-neutral-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
          <UploadCloud className="h-8 w-8" />
          <p className="text-xxs font-bold text-center uppercase tracking-wider px-2">
            {label}
          </p>
        </div>
      )}
    </div>
  );
}
