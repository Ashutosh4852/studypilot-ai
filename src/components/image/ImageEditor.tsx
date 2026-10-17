"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ImageToolbar } from "./ImageToolbar";
import { ImageAdjustSidebar } from "./ImageAdjustSidebar";
import { ImageAiStudio } from "./ImageAiStudio";
import { Dropzone } from "@/components/ui/Dropzone";
import { useToast } from "@/components/ui/Toast";
import {
  AdjustmentValues,
  PresetFilterName,
  applyImageAdjustments,
  applyPrivacyBlur,
} from "@/lib/image/imageFilters";
import { CanvasPreset } from "@/lib/image/imagePresets";
import { downloadDataUrl } from "@/lib/utils";
import { ImageIcon, Loader2, Sparkles, Sliders, ShieldCheck } from "lucide-react";

const initialAdjustments: AdjustmentValues = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  sharpness: 0,
  blur: 0,
  hue: 0,
  exposure: 0,
};

export interface ImageEditorProps {
  initialImageDataUrl?: string | null;
  onSendToPdfStudio?: (dataUrl: string) => void;
}

export function ImageEditor({
  initialImageDataUrl,
  onSendToPdfStudio,
}: ImageEditorProps = {}) {
  const { toast } = useToast();

  // Loaded image source
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fileName, setFileName] = useState("image.png");
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  // Canvas Refs
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Undo / Redo stack (stores Data URLs)
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Adjustments & Filters
  const [adjustments, setAdjustments] = useState<AdjustmentValues>(initialAdjustments);
  const [presetFilter, setPresetFilter] = useState<PresetFilterName>("none");

  // Viewport & UI
  const [zoomScale, setZoomScale] = useState(1.0);
  const [isComparing, setIsComparing] = useState(false);
  const [currentPresetId, setCurrentPresetId] = useState<string | undefined>();
  const [activeSidePanel, setActiveSidePanel] = useState<"adjust" | "ai">("adjust");

  // Privacy Redaction Mode
  const [privacyBlurMode, setPrivacyBlurMode] = useState(false);
  const isBlurringRef = useRef(false);
  const blurStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Crop Mode
  const [activeCropAspect, setActiveCropAspect] = useState<number | null>(null);

  // Push canvas state to undo stack
  const pushCanvasState = useCallback(() => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, dataUrl];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      loadCanvasFromDataUrl(history[nextIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      loadCanvasFromDataUrl(history[nextIndex]);
    }
  };

  const loadCanvasFromDataUrl = (dataUrl: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = mainCanvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
    };
    img.src = dataUrl;
  };

  // Upload and initialize image
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        originalImageRef.current = img;
        const canvas = mainCanvasRef.current;
        if (canvas) {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
          }
        }
        setFileName(file.name);
        setImageLoaded(true);
        setHistory([dataUrl]);
        setHistoryIndex(0);
        setAdjustments(initialAdjustments);
        setPresetFilter("none");
        toast({
          type: "success",
          title: "Image Opened",
          description: `${file.name} (${img.width}×${img.height}px)`,
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (initialImageDataUrl) {
      const img = new Image();
      img.onload = () => {
        originalImageRef.current = img;
        const canvas = mainCanvasRef.current;
        if (canvas) {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
          }
        }
        setFileName("pdf_exported_page.png");
        setImageLoaded(true);
        setHistory([initialImageDataUrl]);
        setHistoryIndex(0);
        setAdjustments(initialAdjustments);
        setPresetFilter("none");
        toast({
          type: "success",
          title: "Page Loaded from PDF Studio",
          description: "Ready for AI background removal, retouching, and filters.",
        });
      };
      img.src = initialImageDataUrl;
    }
  }, [initialImageDataUrl, toast]);

  // Re-apply adjustments when sliders or filter change
  const reapplyAllFilters = useCallback(() => {
    if (!originalImageRef.current || !mainCanvasRef.current) return;
    const canvas = mainCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Redraw original
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(originalImageRef.current, 0, 0, canvas.width, canvas.height);

    // Apply adjustments
    applyImageAdjustments(ctx, canvas.width, canvas.height, adjustments, presetFilter);
  }, [adjustments, presetFilter]);

  useEffect(() => {
    if (imageLoaded && !privacyBlurMode) {
      reapplyAllFilters();
    }
  }, [adjustments, presetFilter, imageLoaded, reapplyAllFilters, privacyBlurMode]);

  // Rotate image
  const handleRotate = (angle: number) => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    const rad = (angle * Math.PI) / 180;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.height;
    tempCanvas.height = canvas.width;
    const tCtx = tempCanvas.getContext("2d");
    if (!tCtx) return;

    tCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
    tCtx.rotate(rad);
    tCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

    canvas.width = tempCanvas.width;
    canvas.height = tempCanvas.height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(tempCanvas, 0, 0);
    }
    pushCanvasState();
    toast({ type: "success", title: `Rotated ${angle}°` });
  };

  // Flip image
  const handleFlip = (direction: "horizontal" | "vertical") => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tCtx = tempCanvas.getContext("2d");
    if (!tCtx) return;

    tCtx.translate(
      direction === "horizontal" ? canvas.width : 0,
      direction === "vertical" ? canvas.height : 0
    );
    tCtx.scale(direction === "horizontal" ? -1 : 1, direction === "vertical" ? -1 : 1);
    tCtx.drawImage(canvas, 0, 0);

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(tempCanvas, 0, 0);
    }
    pushCanvasState();
    toast({ type: "success", title: `Flipped ${direction}` });
  };

  // Add text overlay
  const handleAddText = (
    text: string,
    options: { fontSize: number; color: string; bg?: boolean }
  ) => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.font = `bold ${options.fontSize}px system-ui, sans-serif`;
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const x = canvas.width / 2 - textWidth / 2;
    const y = canvas.height / 2;

    if (options.bg) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
      ctx.beginPath();
      ctx.roundRect(x - 16, y - options.fontSize - 8, textWidth + 32, options.fontSize + 24, 8);
      ctx.fill();
    }

    ctx.fillStyle = options.color;
    ctx.fillText(text, x, y);
    ctx.restore();

    pushCanvasState();
    toast({ type: "success", title: "Text overlay added" });
  };

  // Add sticker / emoji
  const handleAddSticker = (emoji: string) => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.font = "64px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, canvas.width / 2, canvas.height / 2);
    ctx.restore();

    pushCanvasState();
    toast({ type: "success", title: `Sticker ${emoji} added` });
  };

  // Add shape
  const handleAddShape = (type: "rect" | "circle" | "arrow", color: string) => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    const w = 180;
    const h = 120;
    const x = canvas.width / 2 - w / 2;
    const y = canvas.height / 2 - h / 2;

    if (type === "rect") {
      ctx.strokeRect(x, y, w, h);
    } else if (type === "circle") {
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, canvas.height / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (type === "arrow") {
      ctx.beginPath();
      ctx.moveTo(x, y + h / 2);
      ctx.lineTo(x + w, y + h / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + w, y + h / 2);
      ctx.lineTo(x + w - 20, y + h / 2 - 15);
      ctx.moveTo(x + w, y + h / 2);
      ctx.lineTo(x + w - 20, y + h / 2 + 15);
      ctx.stroke();
    }
    ctx.restore();

    pushCanvasState();
    toast({ type: "success", title: `Shape ${type} added` });
  };

  // Privacy Redaction interaction on canvas
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!privacyBlurMode) return;
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    isBlurringRef.current = true;
    blurStartRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!privacyBlurMode || !isBlurringRef.current) return;
    isBlurringRef.current = false;
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const currentX = (e.clientX - rect.left) * scaleX;
    const currentY = (e.clientY - rect.top) * scaleY;

    const x = Math.min(blurStartRef.current.x, currentX);
    const y = Math.min(blurStartRef.current.y, currentY);
    const w = Math.abs(currentX - blurStartRef.current.x);
    const h = Math.abs(currentY - blurStartRef.current.y);

    if (w > 10 && h > 10) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        applyPrivacyBlur(ctx, Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h), "pixelate", 16);
      }
      pushCanvasState();
      toast({ type: "success", title: "Region Redacted", description: "Sensitive information pixelated." });
    }
  };

  // Watermark
  const handleApplyWatermark = (text: string, opacity: number) => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.font = "bold 48px system-ui, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 8;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.fillText(text, 0, 0);
    ctx.restore();

    pushCanvasState();
    toast({ type: "success", title: "Watermark applied" });
  };

  // Apply Crop
  const handleApplyCrop = () => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    let targetWidth = canvas.width;
    let targetHeight = canvas.height;

    if (activeCropAspect) {
      if (canvas.width / canvas.height > activeCropAspect) {
        // Wider than desired aspect
        targetWidth = canvas.height * activeCropAspect;
      } else {
        // Taller than desired aspect
        targetHeight = canvas.width / activeCropAspect;
      }
    } else {
      // Default center 80% crop
      targetWidth = canvas.width * 0.8;
      targetHeight = canvas.height * 0.8;
    }

    const startX = (canvas.width - targetWidth) / 2;
    const startY = (canvas.height - targetHeight) / 2;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = targetWidth;
    tempCanvas.height = targetHeight;
    const tCtx = tempCanvas.getContext("2d");
    if (!tCtx) return;

    tCtx.drawImage(canvas, startX, startY, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(tempCanvas, 0, 0);
    }

    pushCanvasState();
    toast({ type: "success", title: "Crop Applied", description: `Cropped to ${Math.round(targetWidth)}×${Math.round(targetHeight)}` });
  };

  // Select Preset dimensions
  const handleSelectPreset = (preset: CanvasPreset) => {
    setCurrentPresetId(preset.id);
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = preset.width;
    tempCanvas.height = preset.height;
    const tCtx = tempCanvas.getContext("2d");
    if (!tCtx) return;

    // Fill background
    tCtx.fillStyle = "#ffffff";
    tCtx.fillRect(0, 0, preset.width, preset.height);

    // Fit current image into preset canvas keeping aspect ratio
    const scale = Math.min(preset.width / canvas.width, preset.height / canvas.height);
    const drawW = canvas.width * scale;
    const drawH = canvas.height * scale;
    const dx = (preset.width - drawW) / 2;
    const dy = (preset.height - drawH) / 2;

    tCtx.drawImage(canvas, dx, dy, drawW, drawH);

    canvas.width = preset.width;
    canvas.height = preset.height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(tempCanvas, 0, 0);
    }

    pushCanvasState();
    toast({ type: "success", title: `Preset Applied: ${preset.name}`, description: `${preset.width}×${preset.height}px` });
  };

  // Export image
  const handleExport = (format: "png" | "jpeg" | "webp", quality: number) => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    const mime = `image/${format}`;
    const dataUrl = canvas.toDataURL(mime, quality);
    const baseName = fileName.replace(/\.[^/.]+$/, "");
    downloadDataUrl(dataUrl, `${baseName}_edited.${format}`);
    toast({
      type: "success",
      title: "Export Complete",
      description: `Saved as ${format.toUpperCase()} (${canvas.width}×${canvas.height}px).`,
    });
  };

  // Reset workspace
  const handleReset = () => {
    if (confirm("Reset editor workspace and clear uploaded image?")) {
      setImageLoaded(false);
      setHistory([]);
      setHistoryIndex(-1);
      originalImageRef.current = null;
      setAdjustments(initialAdjustments);
      setPresetFilter("none");
      toast({ type: "info", title: "Workspace Reset" });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* Top Toolbar */}
      <ImageToolbar
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        zoomScale={zoomScale}
        onZoomChange={setZoomScale}
        isComparing={isComparing}
        onToggleCompare={() => setIsComparing(!isComparing)}
        onReset={handleReset}
        onExport={handleExport}
        currentPresetId={currentPresetId}
        onSelectPreset={handleSelectPreset}
        onSendToPdfStudio={
          imageLoaded && onSendToPdfStudio
            ? () => {
                const canvas = mainCanvasRef.current;
                if (canvas) {
                  onSendToPdfStudio(canvas.toDataURL("image/png"));
                }
              }
            : undefined
        }
      />

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Adjustments Sidebar */}
        {imageLoaded && (
          <ImageAdjustSidebar
            adjustments={adjustments}
            onAdjustmentsChange={setAdjustments}
            presetFilter={presetFilter}
            onPresetFilterChange={setPresetFilter}
            onRotate={handleRotate}
            onFlip={handleFlip}
            onAddText={handleAddText}
            onAddSticker={handleAddSticker}
            onAddShape={handleAddShape}
            privacyBlurMode={privacyBlurMode}
            onTogglePrivacyBlur={() => setPrivacyBlurMode(!privacyBlurMode)}
            onApplyWatermark={handleApplyWatermark}
            onCropAspectChange={setActiveCropAspect}
            activeCropAspect={activeCropAspect}
            onApplyCrop={handleApplyCrop}
            onResetAdjustments={() => {
              setAdjustments(initialAdjustments);
              setPresetFilter("none");
            }}
          />
        )}

        {/* Center Canvas Area */}
        <div
          ref={containerRef}
          className="flex-1 flex flex-col items-center justify-center overflow-auto p-6 bg-slate-200/70 dark:bg-slate-950/80 relative"
        >
          {/* Empty Upload State */}
          {!imageLoaded && (
            <div className="max-w-xl w-full my-auto flex flex-col items-center">
              <Dropzone
                accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
                maxSizeMb={30}
                title="Upload Photo to AI Image Studio"
                subtitle="Supports JPG, JPEG, PNG, and WebP (Client-side secure, up to 30 MB)"
                onFilesSelected={(files) => handleImageUpload(files[0])}
              />
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Pixel adjustments and privacy redaction process directly in your browser.</span>
              </div>
            </div>
          )}

          {/* Active Canvas Display */}
          <div
            className={`relative rounded-xl overflow-hidden shadow-2xl transition-transform border border-slate-300 dark:border-slate-800 bg-transparency-grid ${
              !imageLoaded ? "hidden" : "block"
            }`}
            style={{ transform: `scale(${zoomScale})`, transformOrigin: "center center" }}
          >
            {/* Main Interactive Canvas */}
            <canvas
              ref={mainCanvasRef}
              onMouseDown={handleCanvasMouseDown}
              onMouseUp={handleCanvasMouseUp}
              className={`block max-w-none ${
                privacyBlurMode ? "cursor-crosshair" : "cursor-default"
              }`}
            />

            {/* Compare Overlay: Original image */}
            {isComparing && originalImageRef.current && (
              <div className="absolute inset-0 z-30 pointer-events-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={originalImageRef.current.src}
                  alt="Original unedited"
                  className="w-full h-full object-fill"
                />
                <span className="absolute top-3 left-3 px-2 py-1 rounded bg-black/75 text-white text-xs font-bold shadow">
                  ORIGINAL UNEDITED
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right AI Studio Panel */}
        {imageLoaded && (
          <ImageAiStudio
            canvasRef={mainCanvasRef}
            onImageUpdated={pushCanvasState}
            onReplaceCanvasImage={(url) => {
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.onload = () => {
                originalImageRef.current = img;
                const canvas = mainCanvasRef.current;
                if (canvas) {
                  canvas.width = img.width;
                  canvas.height = img.height;
                  const ctx = canvas.getContext("2d");
                  if (ctx) {
                    ctx.drawImage(img, 0, 0);
                  }
                }
                pushCanvasState();
              };
              img.src = url;
            }}
            onApplyThumbnailLayout={(layout) => {
              handleAddText(layout.headline, { fontSize: 44, color: "#ffffff", bg: true });
            }}
          />
        )}
      </div>
    </div>
  );
}
