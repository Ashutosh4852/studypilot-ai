import React from "react";
import { Metadata } from "next";
import { UnifiedWorkspace } from "@/components/workspace/UnifiedWorkspace";

export const metadata: Metadata = {
  title: "Split PDF Online Free — Extract Pages Without Limits | DocuMorphix AI",
  description:
    "Split PDF files or extract custom page ranges into new standalone documents for free with zero watermarks. Fast, browser-based, and completely private.",
  keywords: [
    "split pdf online free",
    "extract pdf pages free without watermark",
    "separate pdf document online",
    "cut pdf pages free",
    "free pdf splitter no sign up",
  ],
  openGraph: {
    title: "Split PDF Online Free — Extract Custom Page Ranges",
    description:
      "Separate and extract pages from large PDF documents into clean individual files without watermarks.",
  },
};

export default function SplitPdfPage() {
  return (
    <main className="w-full flex-1 flex flex-col">
      <div className="bg-gradient-to-r from-cyan-950 via-sky-950 to-indigo-950 text-white px-4 py-6 border-b border-cyan-700/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                100% Free • Zero Watermark
              </span>
              <span className="text-[10px] font-semibold text-cyan-200">
                Extract Single Pages or Ranges
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              Split PDF Online Free
            </h1>
            <p className="text-xs text-cyan-200 max-w-2xl mt-0.5">
              Specify page numbers (e.g. 1-5, 8, 11-14) to instantly split and extract sections into a brand new PDF file without watermarks or file limits.
            </p>
          </div>
        </div>
      </div>
      <UnifiedWorkspace initialTab="pdf-studio" />
    </main>
  );
}
