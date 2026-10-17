import React from "react";
import { Metadata } from "next";
import { UnifiedWorkspace } from "@/components/workspace/UnifiedWorkspace";

export const metadata: Metadata = {
  title: "PDF Studio | StudyPilot AI",
  description: "Advanced browser-based PDF Editor, Annotations, Conversion, OCR, and AI Document Analysis.",
};

export default function PdfStudioPage() {
  return (
    <main className="w-full flex-1 flex flex-col">
      <UnifiedWorkspace initialTab="pdf-studio" />
    </main>
  );
}
