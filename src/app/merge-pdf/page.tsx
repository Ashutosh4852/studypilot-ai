import React from "react";
import { Metadata } from "next";
import { UnifiedWorkspace } from "@/components/workspace/UnifiedWorkspace";

export const metadata: Metadata = {
  title: "Merge PDF Free Online — Combine Multiple PDF Files Without Watermark | DocuMorphix AI",
  description:
    "Combine multiple PDF documents into one single file 100% free with zero watermarks. Fast, secure, and private in-browser PDF merger with unlimited pages.",
  keywords: [
    "merge pdf free online",
    "combine pdf files online without watermark",
    "join pdf documents free",
    "merge multiple pdfs free",
    "free pdf merger no sign up",
  ],
  openGraph: {
    title: "Merge PDF Free Online — Combine PDF Files Without Watermark",
    description:
      "Join multiple PDF documents into a single unified file. 100% free with zero watermarks and no file size limits.",
  },
};

export default function MergePdfPage() {
  return (
    <main className="w-full flex-1 flex flex-col">
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white px-4 py-6 border-b border-indigo-700/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                100% Free • No Watermark
              </span>
              <span className="text-[10px] font-semibold text-indigo-200">
                Client-Side Private Processing
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              Merge PDF Files Online Free
            </h1>
            <p className="text-xs text-indigo-200 max-w-2xl mt-0.5">
              Select multiple PDF files from your device and combine them into a single high-quality document in seconds without watermarks or file limits.
            </p>
          </div>
        </div>
      </div>
      <UnifiedWorkspace initialTab="pdf-studio" />
    </main>
  );
}
