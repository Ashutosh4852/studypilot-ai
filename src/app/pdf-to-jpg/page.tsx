import React from "react";
import { Metadata } from "next";
import { UnifiedWorkspace } from "@/components/workspace/UnifiedWorkspace";

export const metadata: Metadata = {
  title: "Convert PDF to JPG Free Online — High Quality Image Extractor | DocuMorphix AI",
  description:
    "Convert PDF pages to high-resolution JPG or PNG images online for free. Download individual pages or a complete ZIP package with zero watermarks or signup.",
  keywords: [
    "pdf to jpg converter free online",
    "convert pdf to image free",
    "pdf to png high resolution",
    "extract images from pdf free",
    "pdf to jpg without watermark",
  ],
  openGraph: {
    title: "Convert PDF to JPG Free Online — High Resolution Images",
    description:
      "Transform your PDF documents into crisp JPG and PNG pictures in seconds without watermarks.",
  },
};

export default function PdfToJpgPage() {
  return (
    <main className="w-full flex-1 flex flex-col">
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-violet-900 text-white px-4 py-6 border-b border-indigo-700/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                100% Free • High Definition
              </span>
              <span className="text-[10px] font-semibold text-indigo-200">
                PNG & JPG ZIP Downloads
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              Convert PDF to JPG Online Free
            </h1>
            <p className="text-xs text-indigo-200 max-w-2xl mt-0.5">
              Extract every page of your PDF file into clean, full-resolution JPG or PNG images. Fast, browser-based, and zero watermarks guaranteed.
            </p>
          </div>
        </div>
      </div>
      <UnifiedWorkspace initialTab="pdf-studio" />
    </main>
  );
}
