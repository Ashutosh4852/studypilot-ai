"use client";

import React, { useState } from "react";
import {
  Sliders,
  Sparkles,
  Crop,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Type,
  Smile,
  EyeOff,
  Droplet,
  Square,
  Circle,
  ArrowRight,
  RotateCcw,
  Check,
} from "lucide-react";
import {
  AdjustmentValues,
  PresetFilterName,
} from "@/lib/image/imageFilters";

interface ImageAdjustSidebarProps {
  adjustments: AdjustmentValues;
  onAdjustmentsChange: (vals: AdjustmentValues) => void;
  presetFilter: PresetFilterName;
  onPresetFilterChange: (name: PresetFilterName) => void;
  onRotate: (angle: number) => void;
  onFlip: (dir: "horizontal" | "vertical") => void;
  onAddText: (text: string, options: { fontSize: number; color: string; bg?: boolean }) => void;
  onAddSticker: (emoji: string) => void;
  onAddShape: (type: "rect" | "circle" | "arrow", color: string) => void;
  privacyBlurMode: boolean;
  onTogglePrivacyBlur: () => void;
  onApplyWatermark: (text: string, opacity: number) => void;
  onCropAspectChange: (aspect: number | null) => void;
  activeCropAspect: number | null;
  onApplyCrop: () => void;
  onResetAdjustments: () => void;
}

export function ImageAdjustSidebar({
  adjustments,
  onAdjustmentsChange,
  presetFilter,
  onPresetFilterChange,
  onRotate,
  onFlip,
  onAddText,
  onAddSticker,
  onAddShape,
  privacyBlurMode,
  onTogglePrivacyBlur,
  onApplyWatermark,
  onCropAspectChange,
  activeCropAspect,
  onApplyCrop,
  onResetAdjustments,
}: ImageAdjustSidebarProps) {
  const [activeCategory, setActiveCategory] = useState<
    "adjust" | "filters" | "crop" | "transform" | "text" | "shapes" | "privacy" | "watermark"
  >("adjust");

  // Local state for text adder
  const [inputText, setInputText] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(36);
  const [includeTextBg, setIncludeTextBg] = useState(true);

  // Local state for watermark
  const [watermarkText, setWatermarkText] = useState("STUDYPILOT AI");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);

  const filtersList: Array<{ id: PresetFilterName; label: string }> = [
    { id: "none", label: "Normal" },
    { id: "grayscale", label: "B&W Mono" },
    { id: "sepia", label: "Sepia Warm" },
    { id: "vintage", label: "Retro Film" },
    { id: "cyberpunk", label: "Cyberpunk" },
    { id: "noir", label: "Dramatic Noir" },
    { id: "warm", label: "Warm Sunset" },
    { id: "cool", label: "Cool Blue" },
    { id: "high-contrast", label: "Punchy" },
    { id: "invert", label: "Inverted" },
  ];

  const stickers = ["🔥", "💡", "⭐", "✅", "🚀", "🎓", "📚", "💯", "🎯", "✨", "📌", "🏆"];

  return (
    <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 flex flex-col h-full shadow-sm select-none">
      {/* Category Icons Row */}
      <div className="grid grid-cols-4 sm:grid-cols-8 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-1 text-[10px]">
        {[
          { id: "adjust", label: "Tune", icon: Sliders },
          { id: "filters", label: "Filter", icon: Sparkles },
          { id: "crop", label: "Crop", icon: Crop },
          { id: "transform", label: "Rotate", icon: RotateCw },
          { id: "text", label: "Text", icon: Type },
          { id: "shapes", label: "Shapes", icon: Square },
          { id: "privacy", label: "Privacy", icon: EyeOff },
          { id: "watermark", label: "Stamp", icon: Droplet },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveCategory(item.id as any)}
              className={`flex flex-col items-center justify-center py-2 px-0.5 rounded-lg transition-all ${
                activeCategory === item.id
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              <Icon className="w-3.5 h-3.5 mb-1" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content for active category */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* 1. ADJUSTMENTS */}
        {activeCategory === "adjust" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Pixel Adjustments
              </h4>
              <button
                onClick={onResetAdjustments}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Brightness */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>Brightness</span>
                <span className="font-mono">{adjustments.brightness}</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={adjustments.brightness}
                onChange={(e) =>
                  onAdjustmentsChange({ ...adjustments, brightness: parseInt(e.target.value, 10) })
                }
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Contrast */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>Contrast</span>
                <span className="font-mono">{adjustments.contrast}</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={adjustments.contrast}
                onChange={(e) =>
                  onAdjustmentsChange({ ...adjustments, contrast: parseInt(e.target.value, 10) })
                }
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Saturation */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>Saturation</span>
                <span className="font-mono">{adjustments.saturation}</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={adjustments.saturation}
                onChange={(e) =>
                  onAdjustmentsChange({ ...adjustments, saturation: parseInt(e.target.value, 10) })
                }
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Sharpness */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>Sharpness (Convolution)</span>
                <span className="font-mono">{adjustments.sharpness}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.sharpness}
                onChange={(e) =>
                  onAdjustmentsChange({ ...adjustments, sharpness: parseInt(e.target.value, 10) })
                }
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Exposure */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>Exposure</span>
                <span className="font-mono">{adjustments.exposure}</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={adjustments.exposure}
                onChange={(e) =>
                  onAdjustmentsChange({ ...adjustments, exposure: parseInt(e.target.value, 10) })
                }
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Blur */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>Soft Blur</span>
                <span className="font-mono">{adjustments.blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={adjustments.blur}
                onChange={(e) =>
                  onAdjustmentsChange({ ...adjustments, blur: parseInt(e.target.value, 10) })
                }
                className="w-full accent-indigo-600"
              />
            </div>
          </div>
        )}

        {/* 2. FILTERS */}
        {activeCategory === "filters" && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Color Filter Presets
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {filtersList.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onPresetFilterChange(f.id)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    presetFilter === f.id
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold ring-2 ring-indigo-200 dark:ring-indigo-900"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div>{f.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. CROP */}
        {activeCategory === "crop" && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Crop Aspect Ratio
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Freeform", aspect: null },
                { label: "1:1 Square", aspect: 1 },
                { label: "16:9 YouTube", aspect: 16 / 9 },
                { label: "4:5 Portrait", aspect: 4 / 5 },
                { label: "9:16 Stories", aspect: 9 / 16 },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onCropAspectChange(item.aspect)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                    activeCropAspect === item.aspect
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              onClick={onApplyCrop}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-colors"
            >
              Apply Crop Selection
            </button>
          </div>
        )}

        {/* 4. TRANSFORM / ROTATE / FLIP */}
        {activeCategory === "transform" && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Rotate & Flip
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onRotate(90)}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs flex items-center justify-center gap-1.5"
              >
                <RotateCw className="w-4 h-4 text-indigo-500" />
                <span>Rotate 90° CW</span>
              </button>
              <button
                onClick={() => onRotate(-90)}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4 text-indigo-500" />
                <span>Rotate 90° CCW</span>
              </button>
              <button
                onClick={() => onFlip("horizontal")}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs flex items-center justify-center gap-1.5"
              >
                <FlipHorizontal className="w-4 h-4 text-violet-500" />
                <span>Flip Horizontal</span>
              </button>
              <button
                onClick={() => onFlip("vertical")}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs flex items-center justify-center gap-1.5"
              >
                <FlipVertical className="w-4 h-4 text-violet-500" />
                <span>Flip Vertical</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. TEXT & CAPTIONS */}
        {activeCategory === "text" && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Add Text Overlay
            </h4>
            <div>
              <input
                type="text"
                placeholder="Enter headline or caption..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Font Size: {fontSize}px</span>
              <input
                type="range"
                min="18"
                max="80"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                className="w-32 accent-indigo-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">Color:</label>
              {["#ffffff", "#000000", "#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6"].map((c) => (
                <button
                  key={c}
                  onClick={() => setTextColor(c)}
                  className={`w-5 h-5 rounded-full border ${textColor === c ? "ring-2 ring-indigo-500" : ""}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="bgPill"
                checked={includeTextBg}
                onChange={(e) => setIncludeTextBg(e.target.checked)}
                className="rounded accent-indigo-600"
              />
              <label htmlFor="bgPill" className="text-xs text-slate-600 dark:text-slate-300">
                Add Dark Backdrop Banner
              </label>
            </div>

            <button
              onClick={() => {
                if (inputText.trim()) {
                  onAddText(inputText, { fontSize, color: textColor, bg: includeTextBg });
                  setInputText("");
                }
              }}
              disabled={!inputText.trim()}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md disabled:opacity-50"
            >
              Place Text on Canvas
            </button>
          </div>
        )}

        {/* 6. SHAPES & STICKERS */}
        {activeCategory === "shapes" && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Shapes
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onAddShape("rect", "#ef4444")}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs flex flex-col items-center gap-1"
              >
                <Square className="w-4 h-4 text-rose-500" />
                <span>Box</span>
              </button>
              <button
                onClick={() => onAddShape("circle", "#3b82f6")}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs flex flex-col items-center gap-1"
              >
                <Circle className="w-4 h-4 text-blue-500" />
                <span>Circle</span>
              </button>
              <button
                onClick={() => onAddShape("arrow", "#10b981")}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs flex flex-col items-center gap-1"
              >
                <ArrowRight className="w-4 h-4 text-emerald-500" />
                <span>Arrow</span>
              </button>
            </div>

            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 pt-2 border-t border-slate-200 dark:border-slate-800">
              Stickers & Badges
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {stickers.map((s, i) => (
                <button
                  key={i}
                  onClick={() => onAddSticker(s)}
                  className="p-2 text-xl rounded-xl border border-slate-200 dark:border-slate-800 hover:scale-110 active:scale-95 transition-all text-center bg-slate-50 dark:bg-slate-950"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 7. PRIVACY BLUR / PIXELATION */}
        {activeCategory === "privacy" && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Redact Sensitive Information
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click and drag a box across passwords, faces, credit card numbers, or student ID badges to pixelate them.
            </p>

            <button
              onClick={onTogglePrivacyBlur}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                privacyBlurMode
                  ? "bg-rose-600 text-white border-rose-600 shadow-md animate-pulse"
                  : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              <EyeOff className="w-4 h-4" />
              <span>{privacyBlurMode ? "Click & Drag on Canvas to Redact" : "Activate Redaction Tool"}</span>
            </button>
          </div>
        )}

        {/* 8. WATERMARK */}
        {activeCategory === "watermark" && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Image Watermark
            </h4>
            <div>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Watermark text..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-bold uppercase"
              />
            </div>

            <div className="flex justify-between text-xs text-slate-500">
              <span>Opacity:</span>
              <span>{Math.round(watermarkOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.05"
              value={watermarkOpacity}
              onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
              className="w-full accent-indigo-600"
            />

            <button
              onClick={() => onApplyWatermark(watermarkText, watermarkOpacity)}
              disabled={!watermarkText.trim()}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md disabled:opacity-50"
            >
              Imprint Watermark
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
