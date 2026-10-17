import React from "react";
import { Metadata } from "next";
import { UnifiedWorkspace } from "@/components/workspace/UnifiedWorkspace";

export const metadata: Metadata = {
  title: "AI Image Studio | StudyPilot AI",
  description: "Modern image editing workspace with background remover, AI generative diffusion, social media presets, and privacy redaction.",
};

export default function ImageStudioPage() {
  return (
    <main className="w-full flex-1 flex flex-col">
      <UnifiedWorkspace initialTab="image-studio" />
    </main>
  );
}
