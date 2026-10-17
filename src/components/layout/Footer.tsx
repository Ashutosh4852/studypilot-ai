import React from "react";
import Link from "next/link";
import { Shield, Sparkles, Lock, Cpu, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 transition-colors py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                SP
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-100">StudyPilot AI</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Unified browser-first AI workspace for students, educators, and creators. Edit PDFs, manipulate images, and study smarter.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3">
              PDF Studio
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/pdf-studio" className="hover:text-indigo-600 dark:hover:text-indigo-400">Visual PDF Editor</Link></li>
              <li><Link href="/pdf-studio?tab=convert" className="hover:text-indigo-600 dark:hover:text-indigo-400">PDF to Images / OCR</Link></li>
              <li><Link href="/pdf-studio?tab=convert" className="hover:text-indigo-600 dark:hover:text-indigo-400">Merge & Split PDF</Link></li>
              <li><Link href="/pdf-studio?tab=ai" className="hover:text-indigo-600 dark:hover:text-indigo-400">AI Summarizer & MCQs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3">
              AI Image Studio
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/image-studio" className="hover:text-indigo-600 dark:hover:text-indigo-400">Canvas & Filters</Link></li>
              <li><Link href="/image-studio?tool=bg-remove" className="hover:text-indigo-600 dark:hover:text-indigo-400">Background Remover</Link></li>
              <li><Link href="/image-studio?tool=object-remove" className="hover:text-indigo-600 dark:hover:text-indigo-400">Object Inpainting</Link></li>
              <li><Link href="/image-studio?tool=presets" className="hover:text-indigo-600 dark:hover:text-indigo-400">Social Media Templates</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3">
              Privacy & Security
            </h4>
            <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <Lock className="w-3.5 h-3.5" /> Client-Side Processing First
              </div>
              <p className="text-[11px] leading-relaxed">
                Documents and image edits are processed locally in your browser. Cloud AI is only invoked with your explicit consent.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} StudyPilot AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-indigo-500" /> Private & Secure
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-violet-500" /> WebAssembly & HTML5 Canvas
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
