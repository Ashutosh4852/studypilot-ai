"use client";

import React, { useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  BookOpen,
  LayoutDashboard,
  Layers,
  ArrowRightLeft,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { PdfEditor } from "@/components/pdf/PdfEditor";
import { ImageEditor } from "@/components/image/ImageEditor";
import { StudyToolsHub } from "@/components/study/StudyToolsHub";
import { useToast } from "@/components/ui/Toast";

export type WorkspaceTab = "dashboard" | "pdf-studio" | "image-studio" | "study-tools" | "pipeline";

interface UnifiedWorkspaceProps {
  initialTab?: WorkspaceTab;
}

export function UnifiedWorkspace({ initialTab = "dashboard" }: UnifiedWorkspaceProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(initialTab);

  // Cross-Module Shared State
  const [exportedPdfPageImg, setExportedPdfPageImg] = useState<string | null>(null);
  const [exportedImageForPdf, setExportedImageForPdf] = useState<string | null>(null);

  // Bridge: PDF Studio -> Image Studio
  const handleSendPdfPageToImageStudio = (dataUrl: string, pageNum: number) => {
    setExportedPdfPageImg(dataUrl);
    setActiveTab("image-studio");
    toast({
      type: "success",
      title: "Cross-Studio Bridge Active",
      description: `Loaded Page ${pageNum} into AI Image Studio for editing.`,
    });
  };

  // Bridge: Image Studio -> PDF Studio
  const handleSendImageToPdfStudio = (dataUrl: string) => {
    setExportedImageForPdf(dataUrl);
    setActiveTab("pdf-studio");
    toast({
      type: "success",
      title: "Cross-Studio Bridge Active",
      description: "Embedded graphic into PDF Studio canvas.",
    });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] w-full bg-slate-100 dark:bg-[#090d16]">
      {/* Unified Studio Navigation Header */}
      <div className="sticky top-16 z-30 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto select-none shadow-sm">
        {/* Workspace Mode Tabs */}
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "dashboard"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("pdf-studio")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "pdf-studio"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF Studio</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
              Pro
            </span>
          </button>

          <button
            onClick={() => setActiveTab("image-studio")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "image-studio"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
            <span>AI Image Studio</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 font-bold">
              AI
            </span>
          </button>

          <button
            onClick={() => setActiveTab("study-tools")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "study-tools"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span>Notes & Flashcards</span>
          </button>

          <button
            onClick={() => setActiveTab("pipeline")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "pipeline"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-violet-500" />
            <span>Pipeline Bridge</span>
          </button>
        </div>

        {/* Global Security status badge */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> Unified Studio Active
          </span>
        </div>
      </div>

      {/* Tab Panels (Kept in DOM so user never loses state between tabs) */}
      <div className="flex-1 flex flex-col">
        {/* 1. DASHBOARD OVERVIEW */}
        <div className={activeTab === "dashboard" ? "block" : "hidden"}>
          {/* Quick Hub Navigation Cards */}
          <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20">
                  All-In-One Unified Workspace
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold">
                  StudyPilot AI Integrated Studio
                </h2>
                <p className="text-xs text-indigo-100 max-w-xl">
                  Edit PDFs, retouch & upscale graphics, generate revision flashcards, and bridge media across studios seamlessly in one unified interface.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setActiveTab("pdf-studio")}
                  className="px-4 py-2 rounded-xl bg-white text-indigo-700 font-bold text-xs shadow-md hover:bg-indigo-50 transition-all"
                >
                  Open PDF Studio
                </button>
                <button
                  onClick={() => setActiveTab("image-studio")}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md hover:bg-slate-800 transition-all"
                >
                  Open Image Studio
                </button>
              </div>
            </div>

            {/* Quick studio jump grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div
                onClick={() => setActiveTab("pdf-studio")}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-indigo-400 cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                  PDF Studio
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Full editor with text boxes, annotations, signatures, watermarks, reordering, merge, and WASM OCR.
                </p>
                <span className="mt-4 text-xs font-semibold text-indigo-600 flex items-center gap-1">
                  Launch Editor →
                </span>
              </div>

              <div
                onClick={() => setActiveTab("image-studio")}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-pink-400 cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950/80 text-pink-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-pink-600 transition-colors">
                  AI Image Studio
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Canvas presets for YouTube and Instagram, background cutout/replace, filters, convolution sharpness, and privacy blur.
                </p>
                <span className="mt-4 text-xs font-semibold text-pink-600 flex items-center gap-1">
                  Launch Creative Canvas →
                </span>
              </div>

              <div
                onClick={() => setActiveTab("study-tools")}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-amber-400 cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 transition-colors">
                  Notes & Flashcards
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  AI study notes generator, interactive revision flashcard deck with flip animation, and exam quiz arena.
                </p>
                <span className="mt-4 text-xs font-semibold text-amber-600 flex items-center gap-1">
                  Launch Revision Deck →
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. PDF STUDIO (EMBEDDED) */}
        <div className={`flex-1 ${activeTab === "pdf-studio" ? "flex flex-col" : "hidden"}`}>
          <PdfEditor
            onSendPageToImageStudio={handleSendPdfPageToImageStudio}
            incomingImageForPdf={exportedImageForPdf}
            onClearIncomingImage={() => setExportedImageForPdf(null)}
          />
        </div>

        {/* 3. AI IMAGE STUDIO (EMBEDDED) */}
        <div className={`flex-1 ${activeTab === "image-studio" ? "flex flex-col" : "hidden"}`}>
          <ImageEditor
            initialImageDataUrl={exportedPdfPageImg}
            onSendToPdfStudio={handleSendImageToPdfStudio}
          />
        </div>

        {/* 4. STUDY TOOLS HUB (EMBEDDED) */}
        <div className={`flex-1 ${activeTab === "study-tools" ? "flex flex-col" : "hidden"}`}>
          <StudyToolsHub />
        </div>

        {/* 5. PIPELINE BRIDGE EXPLANATION */}
        <div className={`p-6 max-w-4xl mx-auto space-y-6 ${activeTab === "pipeline" ? "block" : "hidden"}`}>
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-indigo-500" />
              <span>Cross-Studio Pipeline Bridge</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              StudyPilot AI uniquely bridges PDF and Creative image workflows into a seamless bidirectional pipeline:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  1. PDF Studio ➔ Image Studio
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Click <strong>&quot;Edit in Image Studio&quot;</strong> on any PDF page toolbar to render that page in full resolution and load it directly into AI Image Studio for background removal, photo filters, or upscaling.
                </p>
                <button
                  onClick={() => setActiveTab("pdf-studio")}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Try in PDF Studio →
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-pink-50/50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900/60 space-y-2">
                <span className="text-xs font-bold text-pink-700 dark:text-pink-300">
                  2. Image Studio ➔ PDF Studio
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  After creating or retouching a graphic in Image Studio, click <strong>&quot;Insert into PDF Studio&quot;</strong> to immediately place the graphic onto your current PDF document as a high-res vector stamp or overlay!
                </p>
                <button
                  onClick={() => setActiveTab("image-studio")}
                  className="text-xs font-semibold text-pink-600 hover:underline"
                >
                  Try in Image Studio →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
