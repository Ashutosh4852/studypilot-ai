"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  PdfToolbar,
  PdfToolMode,
} from "./PdfToolbar";
import { PdfPageList } from "./PdfPageList";
import { PdfAiSidebar } from "./PdfAiSidebar";
import { PdfConverterModal } from "./PdfConverterModal";
import { SignaturePadModal } from "./SignaturePadModal";
import { SecurityBanner } from "./SecurityBanner";
import { Modal } from "@/components/ui/Modal";
import { Dropzone } from "@/components/ui/Dropzone";
import { useToast } from "@/components/ui/Toast";
import {
  AnnotationItem,
  rotatePdfPage,
  reorderPdfPages,
  deletePdfPage,
  duplicatePdfPage,
  insertBlankPdfPage,
  addWatermark,
  addPageDecorations,
  applyAnnotationsToPdf,
} from "@/lib/pdf/pdfEngine";
import {
  renderPdfPageToDataUrl,
  renderAllPdfPages,
  extractPdfText,
} from "@/lib/pdf/pdfRenderer";
import { downloadBlob } from "@/lib/utils";
import {
  FileText,
  Loader2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  Check,
} from "lucide-react";

export interface PdfEditorProps {
  onSendPageToImageStudio?: (dataUrl: string, pageNumber: number) => void;
  incomingImageForPdf?: string | null;
  onClearIncomingImage?: () => void;
}

export function PdfEditor({
  onSendPageToImageStudio,
  incomingImageForPdf,
  onClearIncomingImage,
}: PdfEditorProps = {}) {
  const { toast } = useToast();

  // Document state
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState<string>("document.pdf");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageThumbnails, setPageThumbnails] = useState<string[]>([]);
  const [pageRotations, setPageRotations] = useState<Record<number, number>>({});
  const [extractedFullText, setExtractedFullText] = useState<string>("");
  const [selectedText, setSelectedText] = useState<string>("");

  // Editor viewport & tools state
  const [activeTool, setActiveTool] = useState<PdfToolMode>("select");
  const [zoomScale, setZoomScale] = useState<number>(1.2);
  const [selectedColor, setSelectedColor] = useState<string>("#3b82f6");
  const [brushSize, setBrushSize] = useState<number>(3);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMsg, setLoadingMsg] = useState<string>("");

  // Annotations & History for Undo / Redo
  const [annotations, setAnnotations] = useState<AnnotationItem[]>([]);
  const [history, setHistory] = useState<AnnotationItem[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Active drawing interaction ref
  const isInteractingRef = useRef<boolean>(false);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentFreehandPointsRef = useRef<Array<{ x: number; y: number }>>([]);

  // Modals state
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isConverterModalOpen, setIsConverterModalOpen] = useState(false);
  const [isWatermarkModalOpen, setIsWatermarkModalOpen] = useState(false);
  const [isPageNumbersModalOpen, setIsPageNumbersModalOpen] = useState(false);

  // Watermark modal fields
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.18);
  const [watermarkAngle, setWatermarkAngle] = useState(45);

  // Page Numbers modal fields
  const [addPageNums, setAddPageNums] = useState(true);
  const [pageNumPos, setPageNumPos] = useState<"bottom-center" | "bottom-right" | "top-right">("bottom-center");
  const [headerText, setHeaderText] = useState("");
  const [footerText, setFooterText] = useState("");

  // Canvas refs
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Push new state to undo/redo history
  const pushState = useCallback((newAnnotations: AnnotationItem[]) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, newAnnotations];
    });
    setHistoryIndex((prev) => prev + 1);
    setAnnotations(newAnnotations);
  }, [historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setAnnotations(history[nextIndex]);
    } else if (historyIndex === 0) {
      setHistoryIndex(-1);
      setAnnotations([]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setAnnotations(history[nextIndex]);
    }
  };

  // Keyboard shortcuts (Ctrl+Z, Ctrl+Y, Delete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyIndex, history]);

  // Handle cross-module incoming image from AI Image Studio
  useEffect(() => {
    if (incomingImageForPdf) {
      const newAnn: AnnotationItem = {
        id: Math.random().toString(36).substring(2, 9),
        type: "image",
        page: currentPage,
        x: 0.25,
        y: 0.25,
        width: 0.5,
        height: 0.35,
        dataUrl: incomingImageForPdf,
      };
      setAnnotations((prev) => [...prev, newAnn]);
      toast({
        type: "success",
        title: "Graphic Embedded",
        description: "Placed graphic from AI Image Studio onto current PDF page.",
      });
      if (onClearIncomingImage) onClearIncomingImage();
    }
  }, [incomingImageForPdf, currentPage, onClearIncomingImage, toast]);

  // Load and parse uploaded PDF
  const loadPdfFile = async (file: File) => {
    setLoading(true);
    setLoadingMsg("Parsing PDF and generating high-resolution page previews...");
    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      setPdfBytes(bytes);
      setFileName(file.name);

      // Render thumbnails
      const pages = await renderAllPdfPages(bytes, "png", 0.6);
      setTotalPages(pages.length);
      setPageThumbnails(pages.map((p) => p.dataUrl));
      setCurrentPage(1);

      // Extract full text for AI in background
      extractPdfText(bytes).then((extracted) => {
        const text = extracted.map((p) => p.text).join(" ");
        setExtractedFullText(text);
      }).catch((e) => console.warn("Background text extraction issue:", e));

      // Reset annotations
      setAnnotations([]);
      setHistory([]);
      setHistoryIndex(-1);
      setPageRotations({});

      toast({
        type: "success",
        title: "PDF Loaded",
        description: `Successfully loaded ${file.name} (${pages.length} pages).`,
      });
    } catch (e: any) {
      console.error(e);
      toast({
        type: "error",
        title: "Failed to open PDF",
        description: e.message || "Invalid or corrupt PDF file.",
      });
    } finally {
      setLoading(false);
      setLoadingMsg("");
    }
  };

  // Render current page onto background canvas
  useEffect(() => {
    if (!pdfBytes) return;

    let isCancelled = false;
    const renderCurrent = async () => {
      try {
        const { dataUrl, width, height } = await renderPdfPageToDataUrl(
          pdfBytes,
          currentPage,
          zoomScale
        );
        if (isCancelled) return;

        const bgCanvas = backgroundCanvasRef.current;
        const ovCanvas = overlayCanvasRef.current;
        if (!bgCanvas || !ovCanvas) return;

        const img = new Image();
        img.onload = () => {
          bgCanvas.width = width;
          bgCanvas.height = height;
          ovCanvas.width = width;
          ovCanvas.height = height;

          const ctx = bgCanvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
          }
          drawOverlayAnnotations();
        };
        img.src = dataUrl;
      } catch (err) {
        console.error("Page render error:", err);
      }
    };

    renderCurrent();
    return () => {
      isCancelled = true;
    };
  }, [pdfBytes, currentPage, zoomScale, pageRotations]);

  // Redraw annotations on overlay canvas
  const drawOverlayAnnotations = useCallback(() => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const width = canvas.width;
    const height = canvas.height;

    // Filter annotations for current page
    const pageAnns = annotations.filter((a) => a.page === currentPage);

    for (const ann of pageAnns) {
      ctx.save();
      const x = ann.x * width;
      const y = ann.y * height;
      const w = (ann.width || 0.2) * width;
      const h = (ann.height || 0.05) * height;

      ctx.strokeStyle = ann.color || "#000000";
      ctx.fillStyle = ann.color || "#000000";
      ctx.lineWidth = 2.5;

      switch (ann.type) {
        case "text":
          ctx.font = `${ann.fontSize || 16}px system-ui, sans-serif`;
          ctx.fillText(ann.text || "", x, y);
          break;

        case "highlight":
          ctx.fillStyle = ann.color || "#facc15";
          ctx.globalAlpha = 0.35;
          ctx.fillRect(x, y, w, h);
          break;

        case "rect":
          ctx.strokeRect(x, y, w, h);
          break;

        case "circle":
          ctx.beginPath();
          ctx.ellipse(x + w / 2, y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2);
          ctx.stroke();
          break;

        case "line":
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + w, y + h);
          ctx.stroke();
          break;

        case "arrow":
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + w, y + h);
          ctx.stroke();
          // Arrow head
          const angle = Math.atan2(h, w);
          ctx.beginPath();
          ctx.moveTo(x + w, y + h);
          ctx.lineTo(x + w - 12 * Math.cos(angle - Math.PI / 6), y + h - 12 * Math.sin(angle - Math.PI / 6));
          ctx.moveTo(x + w, y + h);
          ctx.lineTo(x + w - 12 * Math.cos(angle + Math.PI / 6), y + h - 12 * Math.sin(angle + Math.PI / 6));
          ctx.stroke();
          break;

        case "freehand":
          if (ann.points && ann.points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(ann.points[0].x * width, ann.points[0].y * height);
            for (let p = 1; p < ann.points.length; p++) {
              ctx.lineTo(ann.points[p].x * width, ann.points[p].y * height);
            }
            ctx.stroke();
          }
          break;

        case "signature":
        case "stamp":
        case "image":
          if (ann.dataUrl) {
            const img = new Image();
            img.src = ann.dataUrl;
            ctx.drawImage(img, x, y, w, h);
          }
          break;
      }
      ctx.restore();
    }
  }, [annotations, currentPage]);

  useEffect(() => {
    drawOverlayAnnotations();
  }, [annotations, drawOverlayAnnotations]);

  // Mouse / Touch handlers for overlay interaction
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === "select") return;

    isInteractingRef.current = true;
    const coords = getCanvasCoords(e);
    startPosRef.current = coords;

    if (activeTool === "draw") {
      currentFreehandPointsRef.current = [coords];
    } else if (activeTool === "text") {
      const text = prompt("Enter text annotation:", "Type text here...");
      if (text) {
        const newAnn: AnnotationItem = {
          id: Math.random().toString(36).substring(2, 9),
          type: "text",
          page: currentPage,
          x: coords.x,
          y: coords.y,
          text,
          fontSize: 16,
          color: selectedColor,
        };
        pushState([...annotations, newAnn]);
      }
      isInteractingRef.current = false;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isInteractingRef.current) return;
    const coords = getCanvasCoords(e);

    if (activeTool === "draw") {
      currentFreehandPointsRef.current.push(coords);

      // Quick live preview of stroke
      const canvas = overlayCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const pts = currentFreehandPointsRef.current;
      if (pts.length > 1) {
        ctx.save();
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(pts[pts.length - 2].x * canvas.width, pts[pts.length - 2].y * canvas.height);
        ctx.lineTo(pts[pts.length - 1].x * canvas.width, pts[pts.length - 1].y * canvas.height);
        ctx.stroke();
        ctx.restore();
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isInteractingRef.current) return;
    isInteractingRef.current = false;
    const endCoords = getCanvasCoords(e);
    const start = startPosRef.current;

    const w = endCoords.x - start.x;
    const h = endCoords.y - start.y;

    if (activeTool === "draw") {
      if (currentFreehandPointsRef.current.length > 1) {
        const newAnn: AnnotationItem = {
          id: Math.random().toString(36).substring(2, 9),
          type: "freehand",
          page: currentPage,
          x: start.x,
          y: start.y,
          points: [...currentFreehandPointsRef.current],
          color: selectedColor,
        };
        pushState([...annotations, newAnn]);
      }
      currentFreehandPointsRef.current = [];
    } else if (["rect", "circle", "line", "arrow", "highlight"].includes(activeTool)) {
      if (Math.abs(w) > 0.01 || Math.abs(h) > 0.01) {
        const newAnn: AnnotationItem = {
          id: Math.random().toString(36).substring(2, 9),
          type: activeTool as any,
          page: currentPage,
          x: Math.min(start.x, endCoords.x),
          y: Math.min(start.y, endCoords.y),
          width: Math.abs(w),
          height: Math.abs(h),
          color: activeTool === "highlight" ? "#facc15" : selectedColor,
        };
        pushState([...annotations, newAnn]);
      }
    }
  };

  // Add signature or stamp
  const handleInsertSignature = (dataUrl: string, type: "signature" | "stamp", label?: string) => {
    const newAnn: AnnotationItem = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      page: currentPage,
      x: 0.35,
      y: 0.7,
      width: type === "stamp" ? 0.3 : 0.25,
      height: type === "stamp" ? 0.1 : 0.08,
      dataUrl,
      text: label,
    };
    pushState([...annotations, newAnn]);
    toast({
      type: "success",
      title: `${type === "stamp" ? "Stamp" : "Signature"} Added`,
      description: "Placed on current page.",
    });
  };

  // Rotate current page
  const handleRotateCurrent = async (delta: number) => {
    if (!pdfBytes) return;
    try {
      const updated = await rotatePdfPage(pdfBytes, currentPage - 1, delta);
      setPdfBytes(updated);
      setPageRotations((prev) => ({
        ...prev,
        [currentPage]: ((prev[currentPage] || 0) + delta + 360) % 360,
      }));
      // Refresh thumbnail
      const thumb = await renderPdfPageToDataUrl(updated, currentPage, 0.6);
      setPageThumbnails((prev) => {
        const copy = [...prev];
        copy[currentPage - 1] = thumb.dataUrl;
        return copy;
      });
      toast({ type: "success", title: "Page Rotated", description: `Rotated page ${currentPage} by ${delta}°.` });
    } catch (e: any) {
      toast({ type: "error", title: "Rotation failed", description: e.message });
    }
  };

  // Reorder page
  const handleMovePage = async (fromIndex: number, toIndex: number) => {
    if (!pdfBytes || fromIndex === toIndex || toIndex < 0 || toIndex >= totalPages) return;
    try {
      const newOrder = Array.from({ length: totalPages }, (_, i) => i);
      const [moved] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, moved);

      const updated = await reorderPdfPages(pdfBytes, newOrder);
      setPdfBytes(updated);

      // Re-render thumbnails
      const pages = await renderAllPdfPages(updated, "png", 0.6);
      setPageThumbnails(pages.map((p) => p.dataUrl));
      setCurrentPage(toIndex + 1);
      toast({ type: "success", title: "Pages Reordered" });
    } catch (e: any) {
      toast({ type: "error", title: "Reorder failed", description: e.message });
    }
  };

  // Delete page
  const handleDeletePage = async (pageIdx: number) => {
    if (!pdfBytes || totalPages <= 1) return;
    try {
      const updated = await deletePdfPage(pdfBytes, pageIdx);
      setPdfBytes(updated);
      const newTotal = totalPages - 1;
      setTotalPages(newTotal);

      const pages = await renderAllPdfPages(updated, "png", 0.6);
      setPageThumbnails(pages.map((p) => p.dataUrl));
      setCurrentPage((prev) => Math.min(prev, newTotal));

      // Remove annotations on deleted page and shift higher pages
      setAnnotations((prev) =>
        prev
          .filter((a) => a.page !== pageIdx + 1)
          .map((a) => (a.page > pageIdx + 1 ? { ...a, page: a.page - 1 } : a))
      );

      toast({ type: "success", title: "Page Deleted", description: `Removed page ${pageIdx + 1}.` });
    } catch (e: any) {
      toast({ type: "error", title: "Delete failed", description: e.message });
    }
  };

  // Duplicate page
  const handleDuplicatePage = async (pageIdx: number) => {
    if (!pdfBytes) return;
    try {
      const updated = await duplicatePdfPage(pdfBytes, pageIdx);
      setPdfBytes(updated);
      const newTotal = totalPages + 1;
      setTotalPages(newTotal);

      const pages = await renderAllPdfPages(updated, "png", 0.6);
      setPageThumbnails(pages.map((p) => p.dataUrl));
      toast({ type: "success", title: "Page Duplicated" });
    } catch (e: any) {
      toast({ type: "error", title: "Duplicate failed", description: e.message });
    }
  };

  // Insert blank page
  const handleInsertBlank = async (afterPage: number) => {
    if (!pdfBytes) return;
    try {
      const updated = await insertBlankPdfPage(pdfBytes, afterPage);
      setPdfBytes(updated);
      const newTotal = totalPages + 1;
      setTotalPages(newTotal);

      const pages = await renderAllPdfPages(updated, "png", 0.6);
      setPageThumbnails(pages.map((p) => p.dataUrl));
      setCurrentPage(afterPage + 1);
      toast({ type: "success", title: "Blank Page Inserted" });
    } catch (e: any) {
      toast({ type: "error", title: "Insert failed", description: e.message });
    }
  };

  // Apply Watermark
  const handleApplyWatermark = async () => {
    if (!pdfBytes) return;
    try {
      const updated = await addWatermark(pdfBytes, {
        text: watermarkText,
        opacity: watermarkOpacity,
        angle: watermarkAngle,
      });
      setPdfBytes(updated);
      setIsWatermarkModalOpen(false);
      toast({ type: "success", title: "Watermark Applied", description: `Applied "${watermarkText}" across all pages.` });
    } catch (e: any) {
      toast({ type: "error", title: "Watermark failed", description: e.message });
    }
  };

  // Apply Page Numbers & Headers
  const handleApplyPageNumbers = async () => {
    if (!pdfBytes) return;
    try {
      const updated = await addPageDecorations(pdfBytes, {
        addPageNumbers: addPageNums,
        pageNumberPosition: pageNumPos,
        headerText: headerText.trim() || undefined,
        footerText: footerText.trim() || undefined,
      });
      setPdfBytes(updated);
      setIsPageNumbersModalOpen(false);
      toast({ type: "success", title: "Headers & Page Numbers Applied" });
    } catch (e: any) {
      toast({ type: "error", title: "Decoration failed", description: e.message });
    }
  };

  // Download final edited PDF
  const handleDownload = async () => {
    if (!pdfBytes) {
      toast({ type: "warning", title: "No document", description: "Open a document first." });
      return;
    }
    setLoading(true);
    setLoadingMsg("Baking vector annotations, text, stamps, and high-res modifications...");
    try {
      // Bake annotations directly onto the PDF
      const bakedBytes = await applyAnnotationsToPdf(pdfBytes, annotations);
      const blob = new Blob([bakedBytes as any], { type: "application/pdf" });
      const outName = fileName.endsWith(".pdf")
        ? fileName.replace(".pdf", "_edited.pdf")
        : `${fileName}_edited.pdf`;
      downloadBlob(blob, outName);
      toast({
        type: "success",
        title: "Download Started",
        description: `Exported standard Adobe-compliant PDF (${outName}).`,
      });
    } catch (e: any) {
      toast({ type: "error", title: "Export failed", description: e.message });
    } finally {
      setLoading(false);
      setLoadingMsg("");
    }
  };

  // Clear workspace
  const handleResetWorkspace = () => {
    if (confirm("Reset workspace? All unsaved annotations and document changes will be cleared.")) {
      setPdfBytes(null);
      setAnnotations([]);
      setHistory([]);
      setHistoryIndex(-1);
      setPageThumbnails([]);
      setExtractedFullText("");
      setFileName("document.pdf");
      toast({ type: "info", title: "Workspace Reset" });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* Top Toolbar */}
      <PdfToolbar
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        canUndo={historyIndex >= 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onDownload={handleDownload}
        onOpenConvertModal={() => setIsConverterModalOpen(true)}
        onOpenSignatureModal={() => setIsSignatureModalOpen(true)}
        onOpenWatermarkModal={() => setIsWatermarkModalOpen(true)}
        onOpenPageNumbersModal={() => setIsPageNumbersModalOpen(true)}
        onRotateCurrent={handleRotateCurrent}
        isAiSidebarOpen={isAiSidebarOpen}
        onToggleAiSidebar={() => setIsAiSidebarOpen(!isAiSidebarOpen)}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        brushSize={brushSize}
        onBrushSizeChange={setBrushSize}
        onSendPageToImageStudio={
          pdfBytes && onSendPageToImageStudio
            ? () => {
                const canvas = backgroundCanvasRef.current;
                if (canvas) {
                  onSendPageToImageStudio(canvas.toDataURL("image/png"), currentPage);
                }
              }
            : undefined
        }
      />

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Thumbnails & Reorder */}
        {pdfBytes && (
          <PdfPageList
            totalPages={totalPages}
            currentPage={currentPage}
            pageThumbnails={pageThumbnails}
            pageRotations={pageRotations}
            onSelectPage={setCurrentPage}
            onRotatePage={handleRotateCurrent}
            onDeletePage={handleDeletePage}
            onDuplicatePage={handleDuplicatePage}
            onMovePage={handleMovePage}
            onInsertBlankPage={handleInsertBlank}
          />
        )}

        {/* Center Canvas / Document Viewer */}
        <div
          ref={containerRef}
          className="flex-1 flex flex-col items-center justify-start overflow-auto p-6 bg-slate-200/70 dark:bg-slate-950/80 relative"
        >
          {/* Security Banner */}
          <div className="w-full max-w-4xl">
            <SecurityBanner
              fileName={pdfBytes ? fileName : undefined}
              onReset={pdfBytes ? handleResetWorkspace : undefined}
            />
          </div>

          {/* Empty State / Upload Dropzone */}
          {!pdfBytes && !loading && (
            <div className="max-w-xl w-full my-auto flex flex-col items-center">
              <Dropzone
                accept="application/pdf,.pdf"
                maxSizeMb={50}
                title="Upload PDF Document to Studio"
                subtitle="Drag and drop your PDF here, or click to browse (Client-side secure, up to 50 MB)"
                onFilesSelected={(files) => loadPdfFile(files[0])}
              />
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                <span>Compatible with lecture slides, research papers, resumes, and study sheets.</span>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="my-auto flex flex-col items-center justify-center p-8 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-800 shadow-xl">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Processing Document
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs text-center">
                {loadingMsg || "Please wait while DocuMorphix processes your PDF..."}
              </p>
            </div>
          )}

          {/* Document Canvas Layer Container */}
          {pdfBytes && !loading && (
            <div className="relative shadow-2xl rounded-lg overflow-hidden bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 my-4 select-none">
              {/* Background Canvas: rendered PDF page */}
              <canvas ref={backgroundCanvasRef} className="block pointer-events-none" />

              {/* Overlay Canvas: user annotations, drawings, shapes, signatures */}
              <canvas
                ref={overlayCanvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className={`absolute inset-0 z-10 ${
                  activeTool === "select"
                    ? "cursor-default"
                    : activeTool === "text"
                    ? "cursor-text"
                    : activeTool === "draw"
                    ? "cursor-crosshair"
                    : "cursor-crosshair"
                }`}
              />

              {/* Floating Zoom & Page Controls Bar */}
              <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/85 backdrop-blur text-white text-xs shadow-lg">
                <button
                  onClick={() => setZoomScale((prev) => Math.max(0.6, prev - 0.2))}
                  className="p-1.5 rounded hover:bg-slate-800 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="font-mono text-[11px] px-1 font-semibold">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  onClick={() => setZoomScale((prev) => Math.min(2.5, prev + 0.2))}
                  className="p-1.5 rounded hover:bg-slate-800 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <div className="h-4 w-[1px] bg-slate-700 mx-1" />
                <span className="px-1 text-[11px] text-slate-300">
                  {currentPage} / {totalPages}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right AI Copilot Sidebar */}
        {isAiSidebarOpen && (
          <PdfAiSidebar
            extractedText={extractedFullText}
            selectedText={selectedText}
            currentPage={currentPage}
            totalPages={totalPages}
            onClose={() => setIsAiSidebarOpen(false)}
            pdfCanvasRef={backgroundCanvasRef}
          />
        )}
      </div>

      {/* Signature & Stamp Modal */}
      <SignaturePadModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={handleInsertSignature}
      />

      {/* Convert, Merge & Split Modal */}
      <PdfConverterModal
        isOpen={isConverterModalOpen}
        onClose={() => setIsConverterModalOpen(false)}
        currentPdfBytes={pdfBytes}
        currentFileName={fileName}
        totalPages={totalPages}
        onPdfLoaded={(bytes, name) => {
          setPdfBytes(bytes);
          setFileName(name);
          renderAllPdfPages(bytes, "png", 0.6).then((pages) => {
            setTotalPages(pages.length);
            setPageThumbnails(pages.map((p) => p.dataUrl));
            setCurrentPage(1);
          });
        }}
      />

      {/* Watermark Configuration Modal */}
      <Modal
        isOpen={isWatermarkModalOpen}
        onClose={() => setIsWatermarkModalOpen(false)}
        title="Add Document Watermark"
        description="Imprint custom security or status text across all document pages."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Watermark Text:
            </label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              placeholder="CONFIDENTIAL, DO NOT DISTRIBUTE..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Opacity ({Math.round(watermarkOpacity * 100)}%):
              </label>
              <input
                type="range"
                min="0.05"
                max="0.6"
                step="0.05"
                value={watermarkOpacity}
                onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Angle ({watermarkAngle}°):
              </label>
              <input
                type="range"
                min="0"
                max="90"
                step="15"
                value={watermarkAngle}
                onChange={(e) => setWatermarkAngle(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>

          <button
            onClick={handleApplyWatermark}
            disabled={!watermarkText.trim() || !pdfBytes}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md disabled:opacity-50"
          >
            Apply Watermark to All Pages
          </button>
        </div>
      </Modal>

      {/* Page Numbers & Headers Modal */}
      <Modal
        isOpen={isPageNumbersModalOpen}
        onClose={() => setIsPageNumbersModalOpen(false)}
        title="Page Numbers, Headers & Footers"
        description="Insert formal academic page numbering and document headings."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Include Page Numbers (Page X of Y)
            </span>
            <input
              type="checkbox"
              checked={addPageNums}
              onChange={(e) => setAddPageNums(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
          </div>

          {addPageNums && (
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Page Number Position:
              </label>
              <select
                value={pageNumPos}
                onChange={(e) => setPageNumPos(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="top-right">Top Right</option>
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Top Header Text (Optional):
            </label>
            <input
              type="text"
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
              placeholder="e.g. DocuMorphix AI Research Notes - Spring Semester"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Bottom Footer Text (Optional):
            </label>
            <input
              type="text"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              placeholder="e.g. Strictly For Academic Revision"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            />
          </div>

          <button
            onClick={handleApplyPageNumbers}
            disabled={!pdfBytes}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md disabled:opacity-50"
          >
            Apply to All Pages
          </button>
        </div>
      </Modal>
    </div>
  );
}
