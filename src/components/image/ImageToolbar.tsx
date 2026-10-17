"use client";

import React, { useState } from "react";
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Download,
  Split,
  Trash2,
  Layers,
  Sparkles,
  Sliders,
  Check,
  FileText,
} from "lucide-react";
import { CANVAS_PRESETS, CanvasPreset } from "@/lib/image/imagePresets";

interface ImageToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  zoomScale: number;
  onZoomChange: (scale: number) => void;
  isComparing: boolean;
  onToggleCompare: () => void;
  onReset: () => void;
  onExport: (format: "png" | "jpeg" | "webp", quality: number) => void;
  currentPresetId?: string;
  onSelectPreset: (preset: CanvasPreset) => void;
  onSendToPdfStudio?: () => void;
}

export function ImageToolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoomScale,
  onZoomChange,
  isComparing,
  onToggleCompare,
  onReset,
  onExport,
  currentPresetId,
  onSelectPreset,
  onSendToPdfStudio,
}: ImageToolbarProps) {
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [exportQuality, setExportQuality] = useState(0.92);

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-sm select-none z-20">
      {/* Left controls: Presets & Undo/Redo */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Preset Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setPresetsOpen(!presetsOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              {CANVAS_PRESETS.find((p) => p.id === currentPresetId)?.name || "Canvas Size"}
            </span>
          </button>

          {presetsOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 block">
                Design & Social Canvas Presets
              </span>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {CANVAS_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onSelectPreset(preset);
                      setPresetsOpen(false);
                    }}
                    className={`w-full flex items-start justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                      currentPresetId === preset.id
                        ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div>
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-[10px] text-slate-400">{preset.description}</div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {preset.width}×{preset.height}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800" />

        {/* Undo / Redo */}
        <button
          disabled={!canUndo}
          onClick={onUndo}
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          disabled={!canRedo}
          onClick={onRedo}
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        {/* Compare Before / After */}
        <button
          onClick={onToggleCompare}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
            isComparing
              ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
              : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
          title="Compare with Original Image"
        >
          <Split className="w-3.5 h-3.5" />
          <span>{isComparing ? "Showing Original" : "Compare"}</span>
        </button>
      </div>

      {/* Center Zoom Controls */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
        <button
          onClick={() => onZoomChange(Math.max(0.3, zoomScale - 0.15))}
          className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="font-mono text-[11px] font-semibold px-2 min-w-[48px] text-center">
          {Math.round(zoomScale * 100)}%
        </span>
        <button
          onClick={() => onZoomChange(Math.min(3.0, zoomScale + 0.15))}
          className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onZoomChange(1.0)}
          className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
          title="Fit 100%"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Controls: Reset & Export */}
      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          title="Reset Image & Clear Canvas"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {onSendToPdfStudio && (
          <button
            onClick={onSendToPdfStudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-all"
            title="Send graphic to PDF Studio as stamp or page"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Insert into PDF Studio</span>
          </button>
        )}

        {/* Export / Download Menu */}
        <div className="relative">
          <button
            onClick={() => setExportOpen(!exportOpen)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Image</span>
          </button>

          {exportOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in">
              <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-2">
                Export Settings
              </h5>

              <div className="space-y-3">
                {/* Format selection */}
                <div>
                  <label className="text-[11px] font-medium text-slate-500 block mb-1">
                    Image Format:
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {(["png", "jpeg", "webp"] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setExportFormat(fmt)}
                        className={`py-1 text-xs font-semibold uppercase rounded-lg border transition-all ${
                          exportFormat === fmt
                            ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                            : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                  {exportFormat === "png" && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 block">
                      ✓ Alpha transparency preserved
                    </span>
                  )}
                </div>

                {/* Quality slider for JPG / WebP */}
                {exportFormat !== "png" && (
                  <div>
                    <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
                      <span>Quality:</span>
                      <span>{Math.round(exportQuality * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.3"
                      max="1.0"
                      step="0.05"
                      value={exportQuality}
                      onChange={(e) => setExportQuality(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                )}

                <button
                  onClick={() => {
                    onExport(exportFormat, exportQuality);
                    setExportOpen(false);
                  }}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-colors"
                >
                  Download {exportFormat.toUpperCase()}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
