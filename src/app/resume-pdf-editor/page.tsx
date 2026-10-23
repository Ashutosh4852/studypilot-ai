import React from "react";
import { Metadata } from "next";
import { UnifiedWorkspace } from "@/components/workspace/UnifiedWorkspace";
import { Briefcase, CheckCircle2, ShieldCheck, Sparkles, FileSignature } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Resume PDF Editor & Signer without Watermark — Edit CV Online | DocuMorphix AI",
  description:
    "Edit your Resume, CV, and Portfolio PDFs online 100% free with zero watermarks. Update phone numbers, add work experience, insert digital signatures to offer letters, and export in crisp HD quality.",
  keywords: [
    "free resume pdf editor no watermark",
    "edit cv pdf online without adobe",
    "sign offer letter pdf free online",
    "freelance contract signer free",
    "update resume pdf without formatting loss",
    "free digital signature pdf tool",
  ],
  openGraph: {
    title: "Free Resume PDF Editor & Contract Signer without Watermark",
    description:
      "Update your resume contact info, format layout, and digitally sign offer letters or freelance agreements in seconds with zero watermarks.",
  },
};

export default function ResumePdfEditorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Edit a Resume PDF Online for Free without Watermark",
    step: [
      {
        "@type": "HowToStep",
        name: "Upload Resume PDF",
        text: "Upload your existing resume or CV PDF into DocuMorphix AI.",
      },
      {
        "@type": "HowToStep",
        name: "Edit or Add Details",
        text: "Use the text tool to update phone numbers, add recent job experience, or modify skills.",
      },
      {
        "@type": "HowToStep",
        name: "Add Signature or Export",
        text: "Add a clean draw signature if signing an offer letter, and click Download PDF for instant 100% watermark-free output.",
      },
    ],
  };

  return (
    <main className="w-full flex-1 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-blue-950 text-white px-4 py-8 border-b border-teal-800/40">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-400 text-slate-950 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Job Seeker & Freelancer Essential
              </span>
              <span className="text-xs font-medium text-teal-300">
                100% Private In-Browser • Zero Watermarks • No Signup
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Free Resume PDF Editor & Digital Contract Signer
            </h1>
            <p className="text-sm text-teal-200 mt-2 leading-relaxed">
              Need to quickly fix a typo on your CV, update your phone number, or sign an employment contract? 
              Do it in seconds directly in your browser without Adobe Acrobat paywalls or export watermarks.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Preserves Layout
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5">Keeps fonts and styling crisp</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> 100% Private
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5">Files never leave your device</p>
            </div>
          </div>
        </div>
      </div>

      <UnifiedWorkspace initialTab="pdf-studio" />
    </main>
  );
}
