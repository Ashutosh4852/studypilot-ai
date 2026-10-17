"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Sparkles,
  Image as ImageIcon,
  BookOpen,
  HelpCircle,
  Menu,
  X,
  Search,
  User,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { href: "/", label: "Dashboard", icon: BookOpen },
    { href: "/pdf-studio", label: "PDF Studio", icon: FileText, badge: "100% Free" },
    { href: "/image-studio", label: "AI Image Studio", icon: ImageIcon, badge: "Free AI" },
  ];

  const toolsList = [
    { title: "PDF Editor & Annotator", category: "PDF Studio", href: "/pdf-studio" },
    { title: "Merge & Split PDFs", category: "PDF Studio", href: "/pdf-studio?tab=convert" },
    { title: "PDF to Images / OCR", category: "PDF Studio", href: "/pdf-studio?tab=convert" },
    { title: "AI PDF Summary & Q&A", category: "PDF Studio", href: "/pdf-studio?tab=ai" },
    { title: "AI Background Remover", category: "AI Image Studio", href: "/image-studio?tool=bg-remove" },
    { title: "AI Object Inpainting", category: "AI Image Studio", href: "/image-studio?tool=object-remove" },
    { title: "Social Media Presets", category: "AI Image Studio", href: "/image-studio?tool=presets" },
    { title: "Photo Filters & Retouch", category: "AI Image Studio", href: "/image-studio?tool=adjust" },
  ];

  const filteredTools = searchQuery.trim()
    ? toolsList.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-300 bg-clip-text text-transparent">
                  StudyPilot <span className="font-extrabold text-indigo-600 dark:text-indigo-400">AI</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  PDF & Creative Studio
                </span>
              </div>
            </Link>
          </div>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      item.badge === "New" 
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                        : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2.5">
            {/* Quick search button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search tools...</span>
                <kbd className="hidden lg:inline px-1 py-0.5 text-[9px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-sm">
                  Ctrl+K
                </kbd>
              </button>

              {/* Quick Search Dropdown */}
              {searchOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 mb-2">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Type a tool name (e.g. OCR, crop, bg remove)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent text-xs w-full outline-none text-slate-800 dark:text-slate-200"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600 text-xs">
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {(searchQuery.trim() ? filteredTools : toolsList.slice(0, 5)).map((tool, idx) => (
                      <Link
                        key={idx}
                        href={tool.href}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors text-left"
                      >
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                          {tool.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {tool.category}
                        </span>
                      </Link>
                    ))}
                    {searchQuery.trim() && filteredTools.length === 0 && (
                      <p className="text-xs text-center py-4 text-slate-400">
                        No tools found matching &quot;{searchQuery}&quot;
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Toggle */}
            <ThemeToggle />

            {/* Auth / Account avatar state */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shadow-inner">
                SP
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  Free Student Plan
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-2.5 h-2.5" /> 100% Free Forever
                </span>
              </div>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 py-3 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
