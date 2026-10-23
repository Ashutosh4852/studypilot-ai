import React from "react";
import { Metadata } from "next";
import { UnifiedWorkspace } from "@/components/workspace/UnifiedWorkspace";
import { BookMarked, Sparkles, CheckCircle, Award, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Test Paper & Quiz Generator from PDF — For Teachers & Coaching | DocuMorphix AI",
  description:
    "Generate comprehensive question papers, practice quizzes, and complete answer keys with explanations from any textbook or syllabus PDF. 100% free for teachers, tutors, and coaching institutes.",
  keywords: [
    "ai test paper generator from pdf",
    "coaching institute question paper maker online",
    "generate quiz questions from textbook pdf free",
    "exam question maker with answer key",
    "free teacher quiz maker without watermark",
    "cbse icse state board test paper generator",
  ],
  openGraph: {
    title: "AI Test Paper & Quiz Generator from PDF — Free for Educators",
    description:
      "Save hours of preparation. Turn textbook chapters and syllabus notes into ready-to-print test papers and quizzes in seconds.",
  },
};

export default function TestPaperGeneratorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AI Test Paper & Question Generator",
    applicationCategory: "EducationalApplication",
    operatingSystem: "All Web Browsers",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <main className="w-full flex-1 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white px-4 py-8 border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Dedicated for Teachers & Tutors
              </span>
              <span className="text-xs font-medium text-emerald-300">
                School • Coaching Institutes • Online Educators • Home Tutors
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              AI Question Paper & Test Generator from PDF
            </h1>
            <p className="text-sm text-emerald-200 mt-2 leading-relaxed">
              Create comprehensive practice tests, multiple-choice quizzes, and answer keys in seconds.
              Upload textbook chapters or syllabus documents to automatically extract high-quality assessment questions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Answer Keys Included
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5">With full step-by-step explanations</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="font-bold text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" /> 100% Free Forever
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5">No subscription or page limits</p>
            </div>
          </div>
        </div>
      </div>

      <UnifiedWorkspace initialTab="study-tools" />
    </main>
  );
}
