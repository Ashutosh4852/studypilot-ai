"use client";

import React from "react";
import {
  RotateCw,
  RotateCcw,
  Trash2,
  Copy,
  PlusCircle,
  ArrowUp,
  ArrowDown,
  Layers,
} from "lucide-react";

interface PdfPageListProps {
  totalPages: number;
  currentPage: number;
  pageThumbnails: string[];
  pageRotations: Record<number, number>;
  onSelectPage: (page: number) => void;
  onRotatePage: (page: number, delta: number) => void;
  onDeletePage: (page: number) => void;
  onDuplicatePage: (page: number) => void;
  onMovePage: (fromIndex: number, toIndex: number) => void;
  onInsertBlankPage: (afterPage: number) => void;
}

export function PdfPageList({
  totalPages,
  currentPage,
  pageThumbnails,
  pageRotations,
  onSelectPage,
  onRotatePage,
  onDeletePage,
  onDuplicatePage,
  onMovePage,
  onInsertBlankPage,
}: PdfPageListProps) {
  return (
    <div className="w-56 border-r border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex flex-col h-full select-none">
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Layers className="w-4 h-4 text-indigo-500" />
          <span>Pages ({totalPages})</span>
        </div>

        <button
          onClick={() => onInsertBlankPage(totalPages)}
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
          title="Add Blank Page at End"
        >
          <PlusCircle className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          const isSelected = currentPage === pageNum;
          const thumb = pageThumbnails[idx];
          const rotation = pageRotations[pageNum] || 0;

          return (
            <div
              key={pageNum}
              className={`group relative rounded-xl border-2 transition-all p-2 flex flex-col items-center bg-white dark:bg-slate-950 shadow-sm ${
                isSelected
                  ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900/50"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {/* Thumbnail card */}
              <div
                onClick={() => onSelectPage(pageNum)}
                className="w-full h-44 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center cursor-pointer overflow-hidden relative"
              >
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumb}
                    alt={`Page ${pageNum}`}
                    className="max-h-full max-w-full object-contain transition-transform"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  />
                ) : (
                  <span className="text-xs text-slate-400 font-mono">Page {pageNum}</span>
                )}

                {/* Page number badge */}
                <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white shadow">
                  {pageNum}
                </span>
              </div>

              {/* Action tools row */}
              <div className="flex items-center justify-between w-full mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 text-slate-500 text-xs">
                {/* Reorder up/down */}
                <div className="flex items-center gap-0.5">
                  <button
                    disabled={idx === 0}
                    onClick={() => onMovePage(idx, idx - 1)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === totalPages - 1}
                    onClick={() => onMovePage(idx, idx + 1)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Rotate CCW / CW */}
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => onRotatePage(pageNum, -90)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Rotate Counter-Clockwise"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRotatePage(pageNum, 90)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Rotate Clockwise"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Duplicate / Delete */}
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => onDuplicatePage(idx)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-500"
                    title="Duplicate Page"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={totalPages <= 1}
                    onClick={() => onDeletePage(idx)}
                    className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-500 disabled:opacity-30"
                    title="Delete Page"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
