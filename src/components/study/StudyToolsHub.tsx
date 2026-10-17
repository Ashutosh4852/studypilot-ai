"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCw,
  Copy,
  Lightbulb,
  Zap,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
}

export function StudyToolsHub() {
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<"notes" | "flashcards" | "quiz">("notes");

  // Study Notes Generator state
  const [notesTopic, setNotesTopic] = useState("");
  const [generatedNotes, setGeneratedNotes] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Flashcards state
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      id: "1",
      category: "Computer Science",
      front: "What is the time complexity of searching an element in a Balanced Binary Search Tree (AVL / Red-Black)?",
      back: "O(log n) in both average and worst cases, because the tree maintains a maximum height of O(log n).",
    },
    {
      id: "2",
      category: "Data Structures",
      front: "Explain the fundamental difference between Array and Linked List in memory allocation.",
      back: "Arrays allocate contiguous memory blocks (allowing O(1) random access), while Linked Lists allocate nodes non-contiguously using pointers (allowing O(1) insertions without reallocation).",
    },
    {
      id: "3",
      category: "Operating Systems",
      front: "What are the 4 Coffman conditions required for a Deadlock to occur?",
      back: "1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait",
    },
    {
      id: "4",
      category: "AI & Machine Learning",
      front: "What is Overfitting, and how can it be mitigated?",
      back: "When a model learns training noise rather than general patterns. Mitigate using: Regularization (L1/L2), Dropout, Cross-Validation, and collecting more training data.",
    },
  ]);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);

  // Quiz Arena state
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  const sampleQuestions = [
    {
      question: "Which sorting algorithm exhibits the best guaranteed worst-case time complexity?",
      options: ["Quicksort (O(n²))", "Merge Sort (O(n log n))", "Bubble Sort (O(n²))", "Insertion Sort (O(n²))"],
      correct: 1,
      explanation: "Merge Sort guarantees O(n log n) in best, average, and worst cases using divide-and-conquer.",
    },
    {
      question: "In TCP/IP networking, what mechanism is responsible for preventing network congestion?",
      options: ["DNS Resolution", "TCP Sliding Window & Slow Start", "ARP broadcast", "HTTP 304 caching"],
      correct: 1,
      explanation: "TCP employs Slow Start, Congestion Avoidance, and Fast Retransmit to prevent network collapse.",
    },
    {
      question: "Which database ACID property ensures that transactions are either fully committed or entirely rolled back?",
      options: ["Atomicity", "Consistency", "Isolation", "Durability"],
      correct: 0,
      explanation: "Atomicity guarantees the 'all-or-nothing' execution of a database transaction.",
    },
  ];

  const handleGenerateNotes = async () => {
    if (!notesTopic.trim()) {
      toast({ type: "warning", title: "Topic required", description: "Enter a topic to generate notes." });
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/pdf-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "summarize",
          text: `Comprehensive master study notes on ${notesTopic}. Include: Core Principles, Key Formulas/Concepts, Common Interview/Exam Pitfalls, and Quick Revision Memory Anchors.`,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Generation failed");

      setGeneratedNotes(json.data.result);
      toast({ type: "success", title: "Study Notes Ready", description: `Compiled notes for "${notesTopic}".` });
    } catch (e: any) {
      toast({ type: "error", title: "Failed", description: e.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIdx((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIdx((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleMarkMastered = () => {
    setMasteredCount((prev) => prev + 1);
    toast({ type: "success", title: "Mastered!", description: "Keep up the momentum." });
    handleNextCard();
  };

  const handleGradeQuiz = () => {
    let score = 0;
    sampleQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) score++;
    });
    setQuizScore(score);
    toast({
      type: "success",
      title: "Quiz Graded",
      description: `You scored ${score} out of ${sampleQuestions.length}!`,
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit">
        <button
          onClick={() => setActiveSubTab("notes")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === "notes"
              ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Smart Study Notes</span>
        </button>

        <button
          onClick={() => setActiveSubTab("flashcards")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === "flashcards"
              ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Flashcard Revision</span>
        </button>

        <button
          onClick={() => setActiveSubTab("quiz")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === "quiz"
              ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <HelpCircle className="w-4 h-4 text-emerald-500" />
          <span>Exam Quiz Arena</span>
        </button>
      </div>

      {/* 1. SMART NOTES */}
      {activeSubTab === "notes" && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>AI Study Notes Generator</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generate structured, high-retention revision sheets for exams, placements, and thesis research.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter topic (e.g. Graph Algorithms Dijkstra vs Bellman-Ford, Quantum Computing basics)..."
                value={notesTopic}
                onChange={(e) => setNotesTopic(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleGenerateNotes}
                disabled={isGenerating || !notesTopic.trim()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? "Generating..." : "Generate Notes"}</span>
              </button>
            </div>
          </div>

          {generatedNotes && (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative group">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedNotes);
                  toast({ type: "success", title: "Copied to clipboard" });
                }}
                className="absolute top-4 right-4 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 text-xs flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
              <div className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                {generatedNotes}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. FLASHCARDS */}
      {activeSubTab === "flashcards" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Card {currentCardIdx + 1} of {flashcards.length}
            </span>
            <span>Mastered: {masteredCount} cards</span>
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[260px] rounded-3xl border-2 border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-tr from-white to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950/20 shadow-xl p-8 flex flex-col justify-between cursor-pointer select-none transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                {flashcards[currentCardIdx].category}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" /> Click to flip
              </span>
            </div>

            <div className="my-auto text-center py-6">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {isFlipped ? flashcards[currentCardIdx].back : flashcards[currentCardIdx].front}
              </h3>
            </div>

            <div className="text-center text-[11px] text-slate-400">
              {isFlipped ? "Answer revealed" : "Question side"}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrevCard}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleMarkMastered}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark as Mastered</span>
            </button>

            <button
              onClick={handleNextCard}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. QUIZ ARENA */}
      {activeSubTab === "quiz" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                Placement & Exam Practice Arena
              </h4>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-300">
                Answer the questions below to test your technical mastery.
              </p>
            </div>
            {quizScore !== null && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-600 text-white">
                Score: {quizScore} / {sampleQuestions.length}
              </span>
            )}
          </div>

          <div className="space-y-4">
            {sampleQuestions.map((q, qIdx) => (
              <div
                key={qIdx}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
              >
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {qIdx + 1}. {q.question}
                </h4>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = quizAnswers[qIdx] === optIdx;
                    const isGraded = quizScore !== null;
                    const isCorrect = optIdx === q.correct;

                    let style = "border-slate-200 dark:border-slate-800 hover:bg-slate-50";
                    if (isGraded) {
                      if (isCorrect) style = "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200";
                      else if (isSelected) style = "border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200";
                    } else if (isSelected) {
                      style = "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold";
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-colors flex items-center justify-between ${style}`}
                      >
                        <span>{opt}</span>
                        {isGraded && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {isGraded && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500" />}
                      </button>
                    );
                  })}
                </div>

                {quizScore !== null && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-100 dark:border-slate-800">
                    💡 {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleGradeQuiz}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            Submit Quiz & Reveal Solutions
          </button>
        </div>
      )}
    </div>
  );
}
