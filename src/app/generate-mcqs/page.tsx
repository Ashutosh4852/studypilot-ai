import React from "react";
import { Metadata } from "next";
import { UnifiedWorkspace } from "@/components/workspace/UnifiedWorkspace";

export const metadata: Metadata = {
  title: "Generate MCQs from PDF Free Online — AI Exam Practice Quiz | StudyPilot AI",
  description:
    "Generate multiple choice questions (MCQs) and interactive study quizzes from any PDF or topic online for free. Test your knowledge with instant scoring.",
  keywords: [
    "generate mcqs from pdf online free",
    "pdf to quiz maker free",
    "create mcq questions from notes",
    "ai exam revision quiz generator",
    "free flashcard and quiz generator",
  ],
  openGraph: {
    title: "Generate MCQs from PDF Free Online — AI Practice Quiz",
    description:
      "Transform study notes and textbook chapters into 5-question MCQ revision quizzes with live scoring and explanations.",
  },
};

export default function GenerateMcqsPage() {
  return (
    <main className="w-full flex-1 flex flex-col">
      <div className="bg-gradient-to-r from-amber-950 via-orange-950 to-indigo-950 text-white px-4 py-6 border-b border-amber-700/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                100% Free • Interactive Quiz
              </span>
              <span className="text-[10px] font-semibold text-amber-200">
                Live Score Tracking & Instant Explanations
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              Generate MCQs from PDF Online Free
            </h1>
            <p className="text-xs text-amber-200 max-w-2xl mt-0.5">
              Turn your study materials and PDFs into comprehensive multiple-choice test questions. Practice with real exam questions and master concepts faster.
            </p>
          </div>
        </div>
      </div>
      <UnifiedWorkspace initialTab="study-tools" />
    </main>
  );
}
