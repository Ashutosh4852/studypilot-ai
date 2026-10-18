import React from "react";
import { Metadata } from "next";
import { UnifiedWorkspace } from "@/components/workspace/UnifiedWorkspace";

export const metadata: Metadata = {
  title: "Free AI Background Remover HD — 100% Transparent Cutout | StudyPilot AI",
  description:
    "Remove background from photos and images in HD resolution 100% free with no watermark. Instant transparent PNG download with zero signup required.",
  keywords: [
    "free background remover hd",
    "remove bg free online",
    "transparent background cutout online",
    "free photo background eraser",
    "ai background removal without watermark",
  ],
  openGraph: {
    title: "Free AI Background Remover HD — Transparent PNG Cutout",
    description:
      "Isolate subjects and cut out transparent backgrounds in 1 click. 100% free with no watermark or resolution caps.",
  },
};

export default function BackgroundRemoverPage() {
  return (
    <main className="w-full flex-1 flex flex-col">
      <div className="bg-gradient-to-r from-pink-900 via-rose-900 to-purple-900 text-white px-4 py-6 border-b border-pink-700/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                1-Click HD Cutout • 100% Free
              </span>
              <span className="text-[10px] font-semibold text-pink-200">
                Transparent PNG & Color Replacement
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              Free AI Background Remover HD
            </h1>
            <p className="text-xs text-pink-200 max-w-2xl mt-0.5">
              Upload any JPG, PNG, or WebP photo to instantly isolate subjects and remove background colors. Export in full resolution with zero watermarks.
            </p>
          </div>
        </div>
      </div>
      <UnifiedWorkspace initialTab="image-studio" />
    </main>
  );
}
