"use client";

import React, { useState } from "react";
import { Share2, Copy, Check, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface ShareBarProps {
  url?: string;
  title?: string;
}

export function ShareBar({
  url = "https://studypilot-app-seven.vercel.app",
  title = "StudyPilot AI — 100% Free Online PDF Editor & AI Image Studio (Zero Watermark)",
}: ShareBarProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareText = `${title}\n\nFree online PDF editing, HD background removal, AI summarization, and exam MCQ quiz generator with zero watermarks!\nCheck it out here:`;

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${shareText} ${url}`);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        type: "success",
        title: "Link Copied!",
        description: "Website link copied to clipboard. Share it with your friends and college groups!",
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast({
        type: "error",
        title: "Copy Failed",
        description: "Please manually copy the URL.",
      });
    }
  };

  return (
    <div className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/60 dark:border-indigo-900/40 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-center md:text-left">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
          <Share2 className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center md:justify-start gap-1.5">
            Share StudyPilot AI with Friends & Classmates
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> 100% Free
            </span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Help your college batchmates and creators get free PDF editing, background removal, and study notes with zero watermarks!
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* WhatsApp Share */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodedText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          title="Share on WhatsApp"
        >
          <span>WhatsApp</span>
        </a>

        {/* Telegram Share */}
        <a
          href={`https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          title="Share on Telegram"
        >
          <span>Telegram</span>
        </a>

        {/* X / Twitter Share */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 dark:bg-slate-800 dark:hover:bg-slate-700"
          title="Share on X / Twitter"
        >
          <span>Twitter / X</span>
        </a>

        {/* LinkedIn Share */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          title="Share on LinkedIn"
        >
          <span>LinkedIn</span>
        </a>

        {/* Reddit Share */}
        <a
          href={`https://reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          title="Share on Reddit"
        >
          <span>Reddit</span>
        </a>

        {/* Copy Link Button */}
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
