import React from "react";
import { Metadata } from "next";
import { UnifiedWorkspace } from "@/components/workspace/UnifiedWorkspace";
import { GraduationCap, Sparkles, BookOpen, CheckCircle, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Exam Prep & MCQ Generator from PDF — UPSC, GATE, JEE & College | DocuMorphix AI",
  description:
    "Transform exam syllabus, textbook PDFs, and class notes into high-yield MCQs, flashcards, and quick revision cheat sheets for UPSC, GATE, JEE, NEET, and College Semester Exams 100% free.",
  keywords: [
    "ai exam prep tool free",
    "upsc notes to mcq generator",
    "gate exam practice questions from pdf",
    "jee neet revision notes ai",
    "college semester exam notes summarizer",
    "free multiple choice quiz maker from textbook",
  ],
  openGraph: {
    title: "AI Exam Prep & MCQ Generator from PDF — Free Study Copilot",
    description:
      "Master exam topics faster. Upload any study PDF or enter an exam topic to generate test-ready MCQs, key formula flashcards, and Feynman summaries with zero paywalls.",
  },
};

export default function ExamPrepAiPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    name: "AI Exam Preparation & Practice Tool",
    description:
      "Free AI-powered revision tool for students preparing for competitive exams like UPSC, GATE, JEE, NEET, and college semester examinations.",
    provider: {
      "@type": "Organization",
      name: "DocuMorphix AI",
      url: "https://studypilot-app-seven.vercel.app",
    },
  };

  return (
    <main className="w-full flex-1 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Target Banner */}
      <div className="bg-gradient-to-r from-violet-950 via-indigo-950 to-slate-950 text-white px-4 py-8 border-b border-indigo-800/40">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 100% Free for Students
              </span>
              <span className="text-xs font-medium text-indigo-300">
                UPSC • GATE • JEE • NEET • University Semesters
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              AI Exam Preparation Copilot & MCQ Quiz Builder
            </h1>
            <p className="text-sm text-indigo-200 mt-2 leading-relaxed">
              Stop spending hours manually writing questions. Turn your PDF notes and textbook chapters into 
              instant multiple-choice tests, flashcards, and concept summaries. Completely free with zero watermarks.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Instant MCQs
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5">With detailed answer explanations</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="font-bold text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> Feynman Summary
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5">Simplifies hard concepts</p>
            </div>
          </div>
        </div>
      </div>

      <UnifiedWorkspace initialTab="study-tools" />
    </main>
  );
}
