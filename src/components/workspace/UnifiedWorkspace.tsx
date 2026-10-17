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
import { ShareBar } from "@/components/common/ShareBar";

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
              100% Free
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
          <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8">
            {/* Free Hero Banner */}
            <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-700 via-violet-700 to-purple-700 text-white shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border border-white/10">
              <div className="space-y-3 z-10 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-400 text-slate-950 shadow-sm flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> 100% Free Forever
                  </span>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
                    Zero Watermark • No Credit Card
                  </span>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
                    No Sign Up Required
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                  Free Online PDF Editor & AI Image Studio
                </h1>
                <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
                  The complete browser-first creative & study platform. Edit PDF documents, add digital signatures, remove image backgrounds in HD, convert files, and generate AI revision notes & MCQs without paywalls or usage limits.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full sm:w-auto z-10 min-w-[200px]">
                <button
                  onClick={() => setActiveTab("pdf-studio")}
                  className="px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-xs shadow-lg hover:bg-indigo-50 transition-all text-center flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" /> Open Free PDF Studio
                </button>
                <button
                  onClick={() => setActiveTab("image-studio")}
                  className="px-5 py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs shadow-lg hover:bg-slate-900 border border-white/20 transition-all text-center flex items-center justify-center gap-2"
                >
                  <ImageIcon className="w-4 h-4 text-pink-400" /> Open Free Image Studio
                </button>
              </div>
            </div>

            {/* Viral Multi-Platform Share Widget */}
            <ShareBar url="https://studypilot-app-seven.vercel.app" />

            {/* Core Feature Cards (High SEO Value) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Free Online Productivity Suite
                  </h2>
                  <p className="text-xs text-slate-500">
                    High-performance client-side tools designed for students, researchers, and creators.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                  Unlimited Free Access
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* PDF Studio Card */}
                <div
                  onClick={() => setActiveTab("pdf-studio")}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-indigo-400 cursor-pointer transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        No Watermark
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                      Free Online PDF Editor
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Add and edit text, draw freehand, insert shapes, draw or type signatures, apply official stamps, rotate/reorder pages, merge, split, and extract text with OCR.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600">
                    <span>Launch PDF Editor</span>
                    <span>→</span>
                  </div>
                </div>

                {/* AI Image Studio Card */}
                <div
                  onClick={() => setActiveTab("image-studio")}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-pink-400 cursor-pointer transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950/80 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-50 dark:bg-pink-950 text-pink-600 dark:text-pink-400">
                        Instant Cutout
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-pink-600 transition-colors">
                      Free AI Image Editor & Background Remover
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      1-click transparent background cutout, YouTube & Instagram canvas presets, convolution sharpening, filters, privacy blur redaction, and PNG/JPG export.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-pink-600">
                    <span>Launch Image Studio</span>
                    <span>→</span>
                  </div>
                </div>

                {/* Study Tools Card */}
                <div
                  onClick={() => setActiveTab("study-tools")}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-amber-400 cursor-pointer transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                        Smart AI
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 transition-colors">
                      AI Notes & Revision Flashcards
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Generate structured revision notes, interactive 3D flip flashcards, and exam-readiness MCQ quizzes directly from any topic or document content.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-600">
                    <span>Launch Study Deck</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Free Search Tools Grid (SEO Keyword Anchors) */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Popular Free Online Tools
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-xs">
                <button
                  onClick={() => setActiveTab("pdf-studio")}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 text-left transition-all"
                >
                  <span className="font-semibold block">Free PDF Editor</span>
                  <span className="text-[10px] text-slate-400">Add text, sign & draw</span>
                </button>
                <button
                  onClick={() => setActiveTab("pdf-studio")}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 text-left transition-all"
                >
                  <span className="font-semibold block">Merge PDF Free</span>
                  <span className="text-[10px] text-slate-400">Combine multiple files</span>
                </button>
                <button
                  onClick={() => setActiveTab("pdf-studio")}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 text-left transition-all"
                >
                  <span className="font-semibold block">PDF to JPG / PNG</span>
                  <span className="text-[10px] text-slate-400">Extract high-res images</span>
                </button>
                <button
                  onClick={() => setActiveTab("image-studio")}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-pink-50 dark:hover:bg-pink-950/40 hover:text-pink-600 text-left transition-all"
                >
                  <span className="font-semibold block">Background Remover HD</span>
                  <span className="text-[10px] text-slate-400">100% transparent cutout</span>
                </button>
                <button
                  onClick={() => setActiveTab("image-studio")}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-pink-50 dark:hover:bg-pink-950/40 hover:text-pink-600 text-left transition-all"
                >
                  <span className="font-semibold block">YouTube Thumbnail Maker</span>
                  <span className="text-[10px] text-slate-400">1280 × 720 canvas preset</span>
                </button>
                <button
                  onClick={() => setActiveTab("pdf-studio")}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 text-left transition-all"
                >
                  <span className="font-semibold block">Free Sign PDF</span>
                  <span className="text-[10px] text-slate-400">Draw, cursive, or stamp</span>
                </button>
                <button
                  onClick={() => setActiveTab("pdf-studio")}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 text-left transition-all"
                >
                  <span className="font-semibold block">AI PDF Summarizer</span>
                  <span className="text-[10px] text-slate-400">Bullet points & concepts</span>
                </button>
                <button
                  onClick={() => setActiveTab("study-tools")}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600 text-left transition-all"
                >
                  <span className="font-semibold block">MCQ Quiz Generator</span>
                  <span className="text-[10px] text-slate-400">Instant test questions</span>
                </button>
              </div>
            </div>

            {/* SEO Rich FAQ Accordion Section */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Frequently Asked Questions (FAQ)
                </h3>
                <p className="text-xs text-slate-500">
                  Everything you need to know about StudyPilot AI&apos;s free PDF and Image tools.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">
                    Is StudyPilot AI really 100% free with no watermark?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Yes! All tools—including PDF editing, page reordering, digital signatures, image background removal, and AI study notes—are 100% free forever. We never add watermarks to your downloaded files or demand credit card details.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">
                    How do I edit PDF text and sign documents online for free?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Simply open PDF Studio, drag and drop your PDF file, and choose between Text Box, Freehand Drawing, Shapes, or Signature tool. You can draw your signature, type it in cursive, or upload a signature image, then click Download PDF.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">
                    How does the free background remover work?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Our AI Image Studio uses high-speed color difference and edge detection algorithms to cut out backgrounds directly in your browser. You can export as a transparent PNG or replace the background with custom colors.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">
                    Are my uploaded files and PDFs kept private?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Your privacy is our highest priority. All PDF edits, page renders, annotations, and image canvas transformations are processed 100% locally on your device via WebAssembly and HTML5 Canvas. Your documents are never stored on external servers without your permission.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">
                    Can I merge multiple PDFs or convert PDF to JPG?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Yes! Click on &apos;Convert / OCR / Merge&apos; in PDF Studio to merge multiple PDFs into one, split selected page ranges, convert PDF pages to high-resolution JPG or PNG images, and extract plain text.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">
                    How do I generate revision flashcards and MCQs from my notes?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Head to the &apos;Notes &amp; Flashcards&apos; tab or click &apos;AI PDF Assistant&apos;. Enter any study subject or document text to instantly generate structured bullet-point notes, 3D flip study flashcards, and a 5-question MCQ revision quiz with live scoring.
                  </p>
                </div>
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
