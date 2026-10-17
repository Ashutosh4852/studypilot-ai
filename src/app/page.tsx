import React from "react";
import { Metadata } from "next";
import { UnifiedWorkspace } from "@/components/workspace/UnifiedWorkspace";

export const metadata: Metadata = {
  title: "StudyPilot AI — Integrated PDF Studio & AI Image Studio",
  description:
    "Unified browser-first AI workspace for students and researchers. Edit PDFs, annotate, extract text, summarize with AI, and retouch images.",
};

export default function HomePage() {
  return (
    <main className="w-full flex-1 flex flex-col">
      <UnifiedWorkspace initialTab="dashboard" />
    </main>
  );
}
