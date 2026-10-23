import React from "react";
import { Metadata } from "next";
import { UnifiedWorkspace } from "@/components/workspace/UnifiedWorkspace";
import { Video, Sparkles, Image as ImageIcon, Flame, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Free YouTube Thumbnail Maker & AI Background Remover HD | DocuMorphix AI",
  description:
    "Design click-worthy 1280x720 YouTube Thumbnails and remove backgrounds from creator photos 100% free with unlimited HD downloads. Zero watermarks, zero subscriptions.",
  keywords: [
    "free youtube thumbnail maker online",
    "ai background remover hd free",
    "removebg free alternative high resolution",
    "youtube thumbnail creator no watermark",
    "transparent png photo cutout for thumbnails",
    "youtube 1280x720 image designer",
  ],
  openGraph: {
    title: "Free YouTube Thumbnail Maker & AI Background Remover HD",
    description:
      "Create high-CTR YouTube thumbnails, remove photo backgrounds with 1-click AI, and export in full 1080p/720p HD with zero watermarks.",
  },
};

export default function YoutubeThumbnailEditorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "YouTube Thumbnail Maker & AI Background Remover",
    applicationCategory: "DesignApplication",
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
      <div className="bg-gradient-to-r from-red-950 via-rose-950 to-slate-950 text-white px-4 py-8 border-b border-rose-800/40">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-500 text-white flex items-center gap-1">
                <Flame className="w-3 h-3" /> Built for YouTubers & Creators
              </span>
              <span className="text-xs font-medium text-rose-300">
                1280x720 Canvas • Unlimited Full-Res Downloads • Zero Watermark
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Free YouTube Thumbnail Studio & AI Background Remover
            </h1>
            <p className="text-sm text-rose-200 mt-2 leading-relaxed">
              Tired of Remove.bg charging per HD image or Canva adding watermarks to your thumbnail exports?
              Get instant transparent cutouts and design high-converting YouTube graphics with zero paywalls.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Full HD Cutouts
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5">No 0.25MP low-res locks</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Instant Presets
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5">YouTube 16:9, Insta 1:1, Banner</p>
            </div>
          </div>
        </div>
      </div>

      <UnifiedWorkspace initialTab="image-studio" />
    </main>
  );
}
