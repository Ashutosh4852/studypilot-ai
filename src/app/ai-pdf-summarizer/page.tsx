import React from "react";
import { Metadata } from "next";
import { UnifiedWorkspace } from "@/components/workspace/UnifiedWorkspace";

export const metadata: Metadata = {
  title: "AI PDF Summarizer & Notes Generator Free Online | DocuMorphix AI",
  description:
    "Summarize PDF documents, research papers, and lecture notes with AI for free. Extract key concepts, definitions, and study takeaways in seconds without limits.",
  keywords: [
    "ai pdf summarizer free",
    "summarize pdf online free",
    "generate study notes from pdf",
    "feynman concept explainer ai",
    "free ai document analysis",
  ],
  openGraph: {
    title: "AI PDF Summarizer & Notes Generator Free Online",
    description:
      "Turn lengthy PDFs and textbook chapters into concise, actionable study summaries and key takeaways with AI.",
  },
};

export default function AiPdfSummarizerPage() {
  return (
    <main className="w-full flex-1 flex flex-col">
      <div className="bg-gradient-to-r from-violet-950 via-purple-900 to-indigo-950 text-white px-4 py-6 border-b border-purple-700/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                100% Free • Powered by AI
              </span>
              <span className="text-[10px] font-semibold text-purple-200">
                Feynman Technique & Key Term Extraction
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              AI PDF Summarizer & Study Notes Generator
            </h1>
            <p className="text-xs text-purple-200 max-w-2xl mt-0.5">
              Upload any PDF document, syllabus, or lecture slide deck to automatically extract executive summaries, core definitions, and Feynman-style simplified notes.
            </p>
          </div>
        </div>
      </div>
      <UnifiedWorkspace initialTab="pdf-studio" />
    </main>
  );
}
