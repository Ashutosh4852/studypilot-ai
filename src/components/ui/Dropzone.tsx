"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, File, AlertCircle, Check } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface DropzoneProps {
  accept: string; // e.g. ".pdf,application/pdf" or "image/*"
  maxSizeMb?: number;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  className?: string;
}

export function Dropzone({
  accept,
  maxSizeMb = 35,
  title,
  subtitle,
  icon,
  multiple = false,
  onFilesSelected,
  className = "",
}: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndHandle = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    const validFiles: File[] = [];
    const maxBytes = maxSizeMb * 1024 * 1024;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > maxBytes) {
        setError(`File "${file.name}" exceeds the ${maxSizeMb} MB limit (${formatBytes(file.size)}).`);
        return;
      }
      validFiles.push(file);
      if (!multiple) break;
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    validateAndHandle(e.dataTransfer.files);
  };

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center select-none ${
          isDragOver
            ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[1.01]"
            : "border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-900/80"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => validateAndHandle(e.target.files)}
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-inner">
          {icon || <UploadCloud className="w-7 h-7" />}
        </div>

        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          {subtitle || `Drag and drop files here, or click to browse (Max ${maxSizeMb} MB)`}
        </p>

        <span className="mt-3 px-3 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm">
          Select from device
        </span>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
