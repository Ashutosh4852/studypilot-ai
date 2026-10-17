"use client";

import React, { useState } from "react";
import {
  MousePointer,
  Type,
  Highlighter,
  Square,
  Circle,
  ArrowRight,
  Minus,
  PenTool,
  Stamp,
  Image as ImageIcon,
  RotateCw,
  RotateCcw,
  Undo2,
  Redo2,
  Download,
  Sparkles,
  Layers,
  FileCheck,
  Hash,
  Droplet,
  Crop,
  MessageSquarePlus,
  HelpCircle,
} from "lucide-react";

export type PdfToolMode =
  | "select"
  | "text"
  | "highlight"
  | "underline"
  | "strike"
  | "rect"
  | "circle"
  | "line"
  | "arrow"
  | "draw"
  | "signature"
  | "stamp"
  | "crop"
  | "watermark"
  | "numbers";

interface PdfToolbarProps {
  activeTool: PdfToolMode;
  onSelectTool: (tool: PdfToolMode) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onDownload: () => void;
  onOpenConvertModal: () => void;
  onOpenSignatureModal: () => void;
  onOpenWatermarkModal: () => void;
  onOpenPageNumbersModal: () => void;
  onRotateCurrent: (delta: number) => void;
  isAiSidebarOpen: boolean;
  onToggleAiSidebar: () => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  onSendPageToImageStudio?: () => void;
}

export function PdfToolbar({
  activeTool,
  onSelectTool,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onDownload,
  onOpenConvertModal,
  onOpenSignatureModal,
  onOpenWatermarkModal,
  onOpenPageNumbersModal,
  onRotateCurrent,
  isAiSidebarOpen,
  onToggleAiSidebar,
  selectedColor,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  onSendPageToImageStudio,
}: PdfToolbarProps) {
  const [shapesMenuOpen, setShapesMenuOpen] = useState(false);

  const colors = [
    "#ef4444", // Red
    "#f59e0b", // Amber
    "#10b981", // Emerald
    "#3b82f6", // Blue
    "#8b5cf6", // Purple
    "#000000", // Black
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between gap-2 shadow-sm select-none z-20">
      {/* Left tool groups */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
        {/* Pointer / Select */}
        <button
          onClick={() => onSelectTool("select")}
          className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
            activeTool === "select"
              ? "bg-indigo-600 text-white shadow-sm font-semibold"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
          title="Select / Move Annotations (V)"
        >
          <MousePointer className="w-4 h-4" />
          <span className="hidden sm:inline">Select</span>
        </button>

        {/* Text Box */}
        <button
          onClick={() => onSelectTool("text")}
          className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
            activeTool === "text"
              ? "bg-indigo-600 text-white shadow-sm font-semibold"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
          title="Add Text Box (T)"
        >
          <Type className="w-4 h-4" />
          <span className="hidden sm:inline">Text</span>
        </button>

        {/* Highlight */}
        <button
          onClick={() => onSelectTool("highlight")}
          className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
            activeTool === "highlight"
              ? "bg-indigo-600 text-white shadow-sm font-semibold"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
          title="Highlight Text (H)"
        >
          <Highlighter className="w-4 h-4 text-amber-500" />
          <span className="hidden md:inline">Highlight</span>
        </button>

        {/* Freehand Draw */}
        <button
          onClick={() => onSelectTool("draw")}
          className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
            activeTool === "draw"
              ? "bg-indigo-600 text-white shadow-sm font-semibold"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
          title="Freehand Pen (P)"
        >
          <PenTool className="w-4 h-4" />
          <span className="hidden md:inline">Draw</span>
        </button>

        {/* Shapes Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShapesMenuOpen(!shapesMenuOpen)}
            className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-all ${
              ["rect", "circle", "line", "arrow"].includes(activeTool)
                ? "bg-indigo-600 text-white shadow-sm font-semibold"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
            title="Shapes & Lines"
          >
            <Square className="w-4 h-4" />
            <span className="hidden sm:inline">Shapes</span>
          </button>

          {shapesMenuOpen && (
            <div className="absolute left-0 mt-1.5 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 z-50 flex flex-col gap-1">
              <button
                onClick={() => {
                  onSelectTool("rect");
                  setShapesMenuOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
              >
                <Square className="w-3.5 h-3.5" /> Rectangle
              </button>
              <button
                onClick={() => {
                  onSelectTool("circle");
                  setShapesMenuOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
              >
                <Circle className="w-3.5 h-3.5" /> Circle
              </button>
              <button
                onClick={() => {
                  onSelectTool("arrow");
                  setShapesMenuOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
              >
                <ArrowRight className="w-3.5 h-3.5" /> Arrow
              </button>
              <button
                onClick={() => {
                  onSelectTool("line");
                  setShapesMenuOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
              >
                <Minus className="w-3.5 h-3.5" /> Line
              </button>
            </div>
          )}
        </div>

        {/* Signature & Stamp */}
        <button
          onClick={onOpenSignatureModal}
          className="p-2 rounded-xl text-xs flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Add Signature or Business Stamp"
        >
          <Stamp className="w-4 h-4 text-emerald-500" />
          <span className="hidden lg:inline">Signature / Stamp</span>
        </button>

        {/* Watermark */}
        <button
          onClick={onOpenWatermarkModal}
          className="p-2 rounded-xl text-xs flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Add Watermark"
        >
          <Droplet className="w-4 h-4 text-sky-500" />
          <span className="hidden xl:inline">Watermark</span>
        </button>

        {/* Page Numbers */}
        <button
          onClick={onOpenPageNumbersModal}
          className="p-2 rounded-xl text-xs flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Add Page Numbers & Headers"
        >
          <Hash className="w-4 h-4 text-violet-500" />
          <span className="hidden xl:inline">Page Numbers</span>
        </button>

        {/* Convert & Document Utilities */}
        <button
          onClick={onOpenConvertModal}
          className="p-2 rounded-xl text-xs flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Convert, Merge & Split"
        >
          <Layers className="w-4 h-4 text-amber-500" />
          <span className="hidden md:inline">Convert & Merge</span>
        </button>

        <div className="h-5 w-[1px] bg-slate-200 dark:border-slate-700 mx-1" />

        {/* Color Palette Picker */}
        <div className="flex items-center gap-1">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => onColorChange(c)}
              className={`w-4 h-4 rounded-full border transition-transform ${
                selectedColor === c ? "scale-125 ring-2 ring-indigo-400 border-white" : "border-slate-300"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Right tool actions */}
      <div className="flex items-center gap-1.5">
        {/* Undo / Redo */}
        <button
          disabled={!canUndo}
          onClick={onUndo}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          disabled={!canRedo}
          onClick={onRedo}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        {/* Rotate current page */}
        <button
          onClick={() => onRotateCurrent(90)}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Rotate Current Page CW"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <div className="h-5 w-[1px] bg-slate-200 dark:border-slate-700 mx-1" />

        {/* AI Tools Toggle Button */}
        <button
          onClick={onToggleAiSidebar}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isAiSidebarOpen
              ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
              : "bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 hover:bg-violet-100"
          }`}
          title="Toggle AI Study Copilot"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Copilot</span>
        </button>

        {/* Bridge to Image Studio */}
        {onSendPageToImageStudio && (
          <button
            onClick={onSendPageToImageStudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 hover:bg-pink-100 transition-all"
            title="Edit current PDF page in AI Image Studio"
          >
            <ImageIcon className="w-3.5 h-3.5 text-pink-500" />
            <span className="hidden sm:inline">Edit in Image Studio</span>
          </button>
        )}

        {/* Download PDF */}
        <button
          onClick={onDownload}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          title="Export and Download Edited PDF"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
}
