import React from "react";
import Link from "next/link";
import { Shield, Sparkles, Lock, Cpu, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 transition-colors py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                DM
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-100">DocuMorphix AI</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Unified browser-first AI workspace for students, job seekers, educators, and creators. Edit PDFs, manipulate images, and study smarter.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3">
              Tools for Everyone
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/exam-prep-ai" className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-indigo-600 dark:text-indigo-400">🎓 Exam Prep & MCQ Generator</Link></li>
              <li><Link href="/resume-pdf-editor" className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-emerald-600 dark:text-emerald-400">💼 Resume PDF Editor & Sign</Link></li>
              <li><Link href="/youtube-thumbnail-editor" className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-rose-600 dark:text-rose-400">🎨 YouTube Thumbnail Maker</Link></li>
              <li><Link href="/test-paper-generator" className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-amber-600 dark:text-amber-400">👨‍🏫 Test Paper Generator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3">
              Popular Utilities
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/background-remover" className="hover:text-indigo-600 dark:hover:text-indigo-400">AI Background Remover HD</Link></li>
              <li><Link href="/sign-pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400">Sign PDF Free (No Watermark)</Link></li>
              <li><Link href="/merge-pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400">Merge PDF Online</Link></li>
              <li><Link href="/split-pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400">Split PDF Online</Link></li>
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
                Documents and image edits are processed locally in your browser. Zero uploads to third-party databases.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} DocuMorphix AI. All rights reserved.</p>
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
