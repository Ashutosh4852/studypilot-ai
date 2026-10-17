"use client";

import React, { useState } from "react";
import { ShieldCheck, AlertTriangle, Info, Trash2, Eye, HelpCircle } from "lucide-react";

interface SecurityBannerProps {
  fileName?: string;
  onReset?: () => void;
}

export function SecurityBanner({ fileName, onReset }: SecurityBannerProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-xs text-slate-600 dark:text-slate-300 shadow-sm mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-100">
              <span>Client-Side Security Active</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 rounded font-normal">
                100% In-Browser
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {fileName ? `File: "${fileName}"` : "Document"} is processed locally using WebAssembly. No files are uploaded to external servers without explicit AI consent.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
            <span>{detailsOpen ? "Hide Notice" : "Important Security Notes"}</span>
          </button>

          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-lg border border-rose-200 dark:border-rose-900/80 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              title="Reset and clear current document from browser memory"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Workspace</span>
            </button>
          )}
        </div>
      </div>

      {detailsOpen && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 animate-in fade-in">
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-[11px]">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <strong className="font-semibold">Digital Signature Invalidation Warning:</strong>
              <p className="mt-0.5 leading-relaxed">
                If your PDF has been digitally signed using a cryptographic PKI certificate (e.g., DocuSign, Adobe Sign, Government e-Signs), adding visual annotations, deleting, or reordering pages will break the cryptographic hash and invalidate its digital certificate.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-indigo-900 dark:text-indigo-200 text-[11px]">
            <Info className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />
            <div>
              <strong className="font-semibold">Visual Annotations vs Original PDF Streams:</strong>
              <p className="mt-0.5 leading-relaxed">
                Adding or editing visible text inserts high-resolution vector and raster annotation overlays onto the PDF canvas. It renders seamlessly in all PDF viewers (Adobe Acrobat, Preview, Chrome, Edge) while safely preserving the integrity of the underlying source document structure.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
