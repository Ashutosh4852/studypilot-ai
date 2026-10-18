import React from "react";
import { Metadata } from "next";
import { UnifiedWorkspace } from "@/components/workspace/UnifiedWorkspace";

export const metadata: Metadata = {
  title: "Sign PDF Online Free — Add Digital Signature & Initials (No Watermark) | DocuMorphix AI",
  description:
    "Sign PDF documents online for free. Draw your signature by hand, type cursive initials, or upload image seals with zero watermarks or signup barriers.",
  keywords: [
    "sign pdf online free",
    "electronic signature pdf free",
    "free digital signature tool",
    "draw signature on pdf online",
    "sign document without watermark",
  ],
  openGraph: {
    title: "Sign PDF Online Free — Digital Signature & Official Stamps",
    description:
      "Add legally compliant electronic signatures and official stamps to your PDF documents 100% free with zero watermarks.",
  },
};

export default function SignPdfPage() {
  return (
    <main className="w-full flex-1 flex flex-col">
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-indigo-950 text-white px-4 py-6 border-b border-teal-700/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                100% Free • Legally Sound
              </span>
              <span className="text-[10px] font-semibold text-teal-200">
                Drawn, Cursive, or Uploaded Stamps
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              Sign PDF Online Free (Electronic Signature)
            </h1>
            <p className="text-xs text-teal-200 max-w-2xl mt-0.5">
              Draw your digital signature with mouse/touchscreen, type cursive initials, or apply verified stamps (APPROVED, CONFIDENTIAL, FINAL) onto any PDF file.
            </p>
          </div>
        </div>
      </div>
      <UnifiedWorkspace initialTab="pdf-studio" />
    </main>
  );
}
