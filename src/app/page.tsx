import React from "react";
import { Metadata } from "next";
import { UnifiedWorkspace } from "@/components/workspace/UnifiedWorkspace";

export const metadata: Metadata = {
  title: "Free Online PDF Editor without Watermark & AI Image Studio | StudyPilot AI",
  description:
    "100% Free online PDF editor, free background remover HD, AI PDF summarizer, MCQ quiz generator, PDF to JPG converter, and merge PDF. No watermark, no signup.",
};

export default function HomePage() {
  return (
    <main className="w-full flex-1 flex flex-col">
      <UnifiedWorkspace initialTab="dashboard" />
    </main>
  );
}
