"use client";

import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Languages,
  Lightbulb,
  ScanText,
  Loader2,
  CheckCircle2,
  XCircle,
  Copy,
  ChevronRight,
  ShieldCheck,
  Send,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { McqQuestion } from "@/lib/ai/geminiClient";

interface PdfAiSidebarProps {
  extractedText: string;
  selectedText?: string;
  currentPage: number;
  totalPages: number;
  onClose?: () => void;
  pdfCanvasRef?: React.RefObject<HTMLCanvasElement>;
}

export function PdfAiSidebar({
  extractedText,
  selectedText = "",
  currentPage,
  totalPages,
  onClose,
  pdfCanvasRef,
}: PdfAiSidebarProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<
    "summary" | "qa" | "definitions" | "mcqs" | "explain" | "translate" | "ocr"
  >("summary");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [mcqs, setMcqs] = useState<McqQuestion[] | null>(null);
  const [definitions, setDefinitions] = useState<Array<{ term: string; definition: string }> | null>(null);
  const [aiProviderInfo, setAiProviderInfo] = useState<{ provider: string; isExternal: boolean; note?: string } | null>(null);

  // Q&A state
  const [qaInput, setQaInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Hello! I am your DocuMorphix AI assistant. Ask me anything about this PDF document." },
  ]);

  // Translate state
  const [targetLang, setTargetLang] = useState("Spanish");

  // MCQ answer tracking
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showAnswers, setShowAnswers] = useState(false);

  // OCR state
  const [ocrStatus, setOcrStatus] = useState<string | null>(null);

  const executeAiTask = async (task: "summarize" | "definitions" | "mcqs" | "explain" | "translate") => {
    const textToAnalyze =
      task === "explain" || task === "translate"
        ? (selectedText || extractedText.slice(0, 3000))
        : extractedText;

    if (!textToAnalyze || textToAnalyze.trim().length === 0) {
      toast({
        type: "warning",
        title: "No document text found",
        description: "Document seems empty or scanned. Try the OCR tab to recognize text from scanned pages.",
      });
      return;
    }

    setLoading(true);
    setResult(null);
    setMcqs(null);
    setDefinitions(null);

    try {
      const res = await fetch("/api/ai/pdf-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task,
          text: textToAnalyze,
          targetLang,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Failed to process AI task");
      }

      setResult(json.data.result);
      if (json.data.mcqs) setMcqs(json.data.mcqs);
      if (json.data.definitions) setDefinitions(json.data.definitions);
      setAiProviderInfo({
        provider: json.data.provider,
        isExternal: json.data.isExternalApi,
        note: json.data.message,
      });

      toast({
        type: "success",
        title: "Analysis Ready",
        description: json.data.isExternalApi ? "Processed with Gemini 1.5 Flash" : "Generated via DocuMorphix Local Engine",
      });
    } catch (e: any) {
      toast({ type: "error", title: "AI Error", description: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSendQa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaInput.trim() || loading) return;

    const query = qaInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: query }]);
    setQaInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/pdf-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "qa",
          text: extractedText || "No text",
          query,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to get answer");

      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: json.data.result },
      ]);
      setAiProviderInfo({
        provider: json.data.provider,
        isExternal: json.data.isExternalApi,
      });
    } catch (e: any) {
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: `⚠️ Error: ${e.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Run Client-Side OCR on current page canvas using Tesseract.js
  const runOcrOnCurrentPage = async () => {
    setLoading(true);
    setOcrStatus("Initializing in-browser OCR engine...");
    try {
      const Tesseract = await import("tesseract.js");
      setOcrStatus("Processing page image pixels...");

      // Get image from canvas or create one
      let imageSource: string | HTMLCanvasElement | null = null;
      if (pdfCanvasRef?.current) {
        imageSource = pdfCanvasRef.current;
      }

      if (!imageSource) {
        throw new Error("No visible page canvas found to perform OCR.");
      }

      const { data } = await Tesseract.recognize(imageSource, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setOcrStatus(`Recognizing text (${Math.floor(m.progress * 100)}%)...`);
          }
        },
      });

      setResult(data.text || "No text recognized.");
      setAiProviderInfo({
        provider: "tesseract-wasm-ocr",
        isExternal: false,
        note: "OCR completed 100% locally in your browser with WebAssembly.",
      });

      toast({
        type: "success",
        title: "OCR Complete",
        description: `Recognized ${data.text.length} characters on Page ${currentPage}.`,
      });
    } catch (e: any) {
      toast({ type: "error", title: "OCR Failed", description: e.message });
      setOcrStatus(null);
    } finally {
      setLoading(false);
      setOcrStatus(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ type: "success", title: "Copied to clipboard" });
  };

  return (
    <aside className="w-80 md:w-96 border-l border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 flex flex-col h-full shadow-lg">
      {/* Top Header */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">AI PDF Copilot</h3>
            <span className="text-[10px] text-slate-400">Document Analysis & Study Tools</span>
          </div>
        </div>

        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xs">
            ✕
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 sm:grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-1 text-[10px]">
        {[
          { id: "summary", label: "Summary", icon: BookOpen },
          { id: "qa", label: "Ask Q&A", icon: MessageSquare },
          { id: "definitions", label: "Key Terms", icon: Lightbulb },
          { id: "mcqs", label: "MCQ Quiz", icon: HelpCircle },
          { id: "explain", label: "ELI5", icon: Lightbulb },
          { id: "translate", label: "Translate", icon: Languages },
          { id: "ocr", label: "OCR", icon: ScanText },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id as any);
                setResult(null);
                setMcqs(null);
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded transition-all ${
                activeTab === t.id
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              <Icon className="w-3.5 h-3.5 mb-0.5" />
              <span className="truncate">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Security & Engine indicator */}
      <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[10px] flex items-center justify-between text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          {aiProviderInfo?.isExternal ? "Gemini 1.5 Flash Cloud" : "DocuMorphix Offline Engine"}
        </span>
        <span>Page {currentPage}/{totalPages}</span>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* SUMMARY TAB */}
        {activeTab === "summary" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Generate a structured executive summary with core takeaways and study advice.
            </p>
            <button
              onClick={() => executeAiTask("summarize")}
              disabled={loading}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Summarize Entire Document</span>
            </button>

            {result && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap relative group">
                <button
                  onClick={() => copyToClipboard(result)}
                  className="absolute top-2 right-2 p-1 rounded bg-white dark:bg-slate-800 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copy"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                {result}
              </div>
            )}
          </div>
        )}

        {/* Q&A TAB */}
        {activeTab === "qa" && (
          <div className="flex flex-col h-full space-y-3">
            <div className="flex-1 space-y-2 overflow-y-auto max-h-[360px] pr-1">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl text-xs max-w-[90%] leading-relaxed ${
                    msg.sender === "user"
                      ? "ml-auto bg-indigo-600 text-white"
                      : "mr-auto bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                  <span>Analyzing document text...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSendQa} className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <input
                type="text"
                placeholder="Ask about this document..."
                value={qaInput}
                onChange={(e) => setQaInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!qaInput.trim() || loading}
                className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* DEFINITIONS TAB */}
        {activeTab === "definitions" && (
          <div className="space-y-3">
            <button
              onClick={() => executeAiTask("definitions")}
              disabled={loading}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
              <span>Extract Definitions & Core Terms</span>
            </button>

            {definitions && (
              <div className="space-y-2">
                {definitions.map((d, i) => (
                  <div key={i} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs">
                    <strong className="text-indigo-600 dark:text-indigo-400 block font-semibold mb-0.5">
                      {d.term}
                    </strong>
                    <span className="text-slate-600 dark:text-slate-300">{d.definition}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MCQS / QUIZ TAB */}
        {activeTab === "mcqs" && (
          <div className="space-y-3">
            <button
              onClick={() => executeAiTask("mcqs")}
              disabled={loading}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <HelpCircle className="w-4 h-4" />}
              <span>Generate Revision Quiz (5 MCQs)</span>
            </button>

            {mcqs && (
              <div className="space-y-4">
                {mcqs.map((q, qIdx) => {
                  const userAns = selectedAnswers[qIdx];
                  const isAnswered = userAns !== undefined;

                  return (
                    <div
                      key={qIdx}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs space-y-2"
                    >
                      <p className="font-semibold text-slate-800 dark:text-slate-100">
                        {qIdx + 1}. {q.question}
                      </p>

                      <div className="space-y-1.5">
                        {q.options.map((opt, optIdx) => {
                          const isCorrect = optIdx === q.correctAnswer;
                          const isSelected = userAns === optIdx;

                          let btnStyle = "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900";
                          if (showAnswers || isAnswered) {
                            if (isCorrect) btnStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200";
                            else if (isSelected) btnStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-200";
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => {
                                setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
                              }}
                              className={`w-full text-left p-2 rounded-lg border text-[11px] transition-colors flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {(showAnswers || isAnswered) && isCorrect && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              )}
                              {(showAnswers || isAnswered) && isSelected && !isCorrect && (
                                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {(showAnswers || isAnswered) && q.explanation && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200 dark:border-slate-800">
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}

                <button
                  onClick={() => setShowAnswers(!showAnswers)}
                  className="w-full py-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950"
                >
                  {showAnswers ? "Hide Solutions" : "Reveal All Solutions"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* EXPLAIN / ELI5 TAB */}
        {activeTab === "explain" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Simplifies dense academic jargon or formulas using the Feynman Technique and everyday analogies.
            </p>
            {selectedText && (
              <div className="p-2 rounded bg-indigo-50 dark:bg-indigo-950/40 text-[11px] text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <strong>Selected snippet:</strong> &quot;{selectedText.slice(0, 100)}...&quot;
              </div>
            )}
            <button
              onClick={() => executeAiTask("explain")}
              disabled={loading}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
              <span>Explain in Simple Words</span>
            </button>

            {result && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {result}
              </div>
            )}
          </div>
        )}

        {/* TRANSLATE TAB */}
        {activeTab === "translate" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Target Language:
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {["Spanish", "French", "German", "Hindi", "Japanese", "Chinese", "Arabic", "Russian", "Portuguese", "Italian"].map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => executeAiTask("translate")}
              disabled={loading}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
              <span>Translate Document Text</span>
            </button>

            {result && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {result}
              </div>
            )}
          </div>
        )}

        {/* OCR TAB */}
        {activeTab === "ocr" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              For scanned textbooks, lecture slides, or image-based PDFs without a selectable text layer. Runs entirely in your browser with Tesseract WebAssembly.
            </p>

            <button
              onClick={runOcrOnCurrentPage}
              disabled={loading}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanText className="w-4 h-4" />}
              <span>Run Browser OCR on Page {currentPage}</span>
            </button>

            {ocrStatus && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-xs text-indigo-700 dark:text-indigo-300">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>{ocrStatus}</span>
              </div>
            )}

            {result && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Recognized Text:</span>
                  <button onClick={() => copyToClipboard(result)} className="text-indigo-600 hover:underline">
                    Copy Text
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {result}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
