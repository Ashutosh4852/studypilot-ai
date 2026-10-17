"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import {
  FileImage,
  Files,
  FileText,
  Download,
  Upload,
  ArrowRight,
  Layers,
  Split,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { renderAllPdfPages, extractPdfText } from "@/lib/pdf/pdfRenderer";
import { imagesToPdf, textToPdf, mergePdfs, extractPdfPages } from "@/lib/pdf/pdfEngine";
import { downloadBlob, downloadDataUrl } from "@/lib/utils";
import JSZip from "jszip";
import { useToast } from "@/components/ui/Toast";

interface PdfConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPdfBytes?: Uint8Array | null;
  currentFileName?: string;
  totalPages?: number;
  onPdfLoaded?: (bytes: Uint8Array, name: string) => void;
}

export function PdfConverterModal({
  isOpen,
  onClose,
  currentPdfBytes,
  currentFileName = "document.pdf",
  totalPages = 1,
  onPdfLoaded,
}: PdfConverterModalProps) {
  const { toast } = useToast();
  const [activeTool, setActiveTool] = useState<
    "pdf-to-images" | "images-to-pdf" | "pdf-to-text" | "text-to-pdf" | "merge-pdfs" | "split-pdf"
  >("pdf-to-images");

  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");

  // States for sub-tools
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [mergePdfFiles, setMergePdfFiles] = useState<File[]>([]);
  const [txtInput, setTxtInput] = useState("");
  const [splitRange, setSplitRange] = useState("1");
  const [imageFormat, setImageFormat] = useState<"png" | "jpeg">("png");

  // 1. PDF to Images (JPG / PNG)
  const handlePdfToImages = async () => {
    if (!currentPdfBytes) {
      toast({ type: "error", title: "No PDF loaded", description: "Upload or open a PDF first." });
      return;
    }
    setLoading(true);
    setProgressMsg("Rendering pages to high-resolution images...");
    try {
      const pages = await renderAllPdfPages(currentPdfBytes, imageFormat, 2.0, (curr, total) => {
        setProgressMsg(`Rendering page ${curr} of ${total}...`);
      });

      if (pages.length === 1) {
        // Single page download
        downloadDataUrl(pages[0].dataUrl, `${currentFileName.replace(".pdf", "")}_page_1.${imageFormat}`);
        toast({ type: "success", title: "Download complete", description: `Saved page 1 as ${imageFormat.toUpperCase()}` });
      } else {
        // Multi-page zip
        setProgressMsg("Packaging ZIP archive...");
        const zip = new JSZip();
        pages.forEach((p) => {
          const base64 = p.dataUrl.split(",")[1];
          zip.file(`page_${p.pageNumber}.${imageFormat}`, base64, { base64: true });
        });
        const blob = await zip.generateAsync({ type: "blob" });
        downloadBlob(blob, `${currentFileName.replace(".pdf", "")}_images.zip`);
        toast({ type: "success", title: "ZIP Downloaded", description: `Exported ${pages.length} pages as ${imageFormat.toUpperCase()}` });
      }
      onClose();
    } catch (e: any) {
      toast({ type: "error", title: "Export failed", description: e.message });
    } finally {
      setLoading(false);
      setProgressMsg("");
    }
  };

  // 2. Images to PDF
  const handleImagesToPdf = async () => {
    if (imgFiles.length === 0) {
      toast({ type: "error", title: "No images selected", description: "Select at least one image." });
      return;
    }
    setLoading(true);
    setProgressMsg("Converting images to PDF pages...");
    try {
      const imageItems: Array<{ dataUrl: string }> = [];
      for (const file of imgFiles) {
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        imageItems.push({ dataUrl });
      }

      const pdfBytes = await imagesToPdf(imageItems);
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      downloadBlob(blob, "converted_images.pdf");
      toast({ type: "success", title: "PDF Created", description: `Merged ${imgFiles.length} images into PDF.` });

      if (onPdfLoaded) {
        onPdfLoaded(pdfBytes, "converted_images.pdf");
      }
      onClose();
    } catch (e: any) {
      toast({ type: "error", title: "Conversion failed", description: e.message });
    } finally {
      setLoading(false);
      setProgressMsg("");
    }
  };

  // 3. PDF to Extracted Text (.txt)
  const handlePdfToText = async () => {
    if (!currentPdfBytes) {
      toast({ type: "error", title: "No PDF loaded", description: "Upload or open a PDF first." });
      return;
    }
    setLoading(true);
    setProgressMsg("Extracting text layer...");
    try {
      const pages = await extractPdfText(currentPdfBytes, (curr, total) => {
        setProgressMsg(`Extracting text from page ${curr} of ${total}...`);
      });
      const fullText = pages
        .map((p) => `--- PAGE ${p.pageNumber} ---\n\n${p.text}`)
        .join("\n\n\n");

      const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
      downloadBlob(blob, `${currentFileName.replace(".pdf", "")}_extracted.txt`);
      toast({ type: "success", title: "Text Extracted", description: `Saved extracted text file.` });
      onClose();
    } catch (e: any) {
      toast({ type: "error", title: "Extraction failed", description: e.message });
    } finally {
      setLoading(false);
      setProgressMsg("");
    }
  };

  // 4. TXT to PDF
  const handleTxtToPdf = async () => {
    if (!txtInput.trim()) {
      toast({ type: "error", title: "Text is empty", description: "Type or paste text to convert." });
      return;
    }
    setLoading(true);
    setProgressMsg("Formatting text to PDF document...");
    try {
      const pdfBytes = await textToPdf(txtInput, "Document Export");
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      downloadBlob(blob, "notes_document.pdf");
      toast({ type: "success", title: "PDF Created", description: "Successfully generated PDF from text." });

      if (onPdfLoaded) {
        onPdfLoaded(pdfBytes, "notes_document.pdf");
      }
      onClose();
    } catch (e: any) {
      toast({ type: "error", title: "Conversion failed", description: e.message });
    } finally {
      setLoading(false);
      setProgressMsg("");
    }
  };

  // 5. Merge Multiple PDFs
  const handleMergePdfs = async () => {
    if (mergePdfFiles.length < 2 && !currentPdfBytes) {
      toast({ type: "error", title: "Need more files", description: "Select at least 2 PDF files to merge." });
      return;
    }
    setLoading(true);
    setProgressMsg("Merging PDF documents...");
    try {
      const buffers: Uint8Array[] = [];
      if (currentPdfBytes) {
        buffers.push(currentPdfBytes);
      }
      for (const file of mergePdfFiles) {
        const ab = await file.arrayBuffer();
        buffers.push(new Uint8Array(ab));
      }

      const mergedBytes = await mergePdfs(buffers);
      const blob = new Blob([mergedBytes as any], { type: "application/pdf" });
      downloadBlob(blob, "merged_document.pdf");
      toast({ type: "success", title: "Merge Complete", description: `Merged ${buffers.length} documents.` });

      if (onPdfLoaded) {
        onPdfLoaded(mergedBytes, "merged_document.pdf");
      }
      onClose();
    } catch (e: any) {
      toast({ type: "error", title: "Merge failed", description: e.message });
    } finally {
      setLoading(false);
      setProgressMsg("");
    }
  };

  // 6. Split / Extract Pages
  const handleSplitPdf = async () => {
    if (!currentPdfBytes) {
      toast({ type: "error", title: "No PDF loaded", description: "Upload or open a PDF first." });
      return;
    }
    setLoading(true);
    setProgressMsg("Extracting selected pages...");
    try {
      // Parse range string like "1, 3-5"
      const indices: number[] = [];
      const parts = splitRange.split(",");
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.includes("-")) {
          const [startStr, endStr] = trimmed.split("-");
          const start = parseInt(startStr, 10);
          const end = parseInt(endStr, 10);
          for (let p = start; p <= end; p++) {
            if (p >= 1 && p <= totalPages) indices.push(p - 1);
          }
        } else {
          const p = parseInt(trimmed, 10);
          if (p >= 1 && p <= totalPages) indices.push(p - 1);
        }
      }

      if (indices.length === 0) {
        throw new Error(`Invalid page range. Document has ${totalPages} pages.`);
      }

      const extractedBytes = await extractPdfPages(currentPdfBytes, Array.from(new Set(indices)));
      const blob = new Blob([extractedBytes as any], { type: "application/pdf" });
      downloadBlob(blob, `extracted_pages_${indices.map((i) => i + 1).join("_")}.pdf`);
      toast({ type: "success", title: "Pages Extracted", description: `Created new PDF with ${indices.length} pages.` });
      onClose();
    } catch (e: any) {
      toast({ type: "error", title: "Split failed", description: e.message });
    } finally {
      setLoading(false);
      setProgressMsg("");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="PDF Conversion & Document Utilities"
      description="Convert formats, merge multiple documents, extract pages, or turn images into PDFs."
      maxWidth="xl"
    >
      {/* Category selector */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-5 text-[11px] font-medium text-center">
        {[
          { id: "pdf-to-images", label: "PDF to Images", icon: FileImage },
          { id: "images-to-pdf", label: "Images to PDF", icon: Files },
          { id: "pdf-to-text", label: "PDF to Text", icon: FileText },
          { id: "text-to-pdf", label: "TXT to PDF", icon: FileText },
          { id: "merge-pdfs", label: "Merge PDFs", icon: Layers },
          { id: "split-pdf", label: "Split Pages", icon: Split },
        ].map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as any)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                activeTool === tool.id
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{progressMsg}</p>
        </div>
      )}

      {!loading && (
        <div className="space-y-4">
          {/* Tool 1: PDF to Images */}
          {activeTool === "pdf-to-images" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                <span className="font-semibold block mb-1">Source Document:</span>
                <span className="text-slate-500">
                  {currentPdfBytes
                    ? `${currentFileName} (${totalPages} pages)`
                    : "No PDF currently open. Open a document in the editor first."}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Target Format:</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setImageFormat("png")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                      imageFormat === "png"
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    PNG (High Clarity)
                  </button>
                  <button
                    onClick={() => setImageFormat("jpeg")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                      imageFormat === "jpeg"
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    JPG (Smaller Size)
                  </button>
                </div>
              </div>

              <button
                onClick={handlePdfToImages}
                disabled={!currentPdfBytes}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Export Pages to {imageFormat.toUpperCase()}</span>
              </button>
            </div>
          )}

          {/* Tool 2: Images to PDF */}
          {activeTool === "images-to-pdf" && (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 cursor-pointer bg-slate-50 dark:bg-slate-950 text-center">
                <Files className="w-7 h-7 text-indigo-500 mb-2" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Select Images (JPG, PNG, WebP)
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Hold Ctrl/Cmd to select multiple images
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => setImgFiles(Array.from(e.target.files || []))}
                  className="hidden"
                />
              </label>

              {imgFiles.length > 0 && (
                <div className="text-xs text-slate-600 dark:text-slate-300 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <span>Selected {imgFiles.length} images</span>
                  <button onClick={() => setImgFiles([])} className="text-rose-500 hover:underline">
                    Clear
                  </button>
                </div>
              )}

              <button
                onClick={handleImagesToPdf}
                disabled={imgFiles.length === 0}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Compile into PDF Document</span>
              </button>
            </div>
          )}

          {/* Tool 3: PDF to Text */}
          {activeTool === "pdf-to-text" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Extract the underlying text layer from all {totalPages} pages of your current document into a clean .txt file without formatting artifacts.
              </p>
              <button
                onClick={handlePdfToText}
                disabled={!currentPdfBytes}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Extract Text Layer (.txt)</span>
              </button>
            </div>
          )}

          {/* Tool 4: TXT to PDF */}
          {activeTool === "text-to-pdf" && (
            <div className="space-y-3">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Paste or type text to convert into standard A4 PDF:
              </label>
              <textarea
                rows={6}
                value={txtInput}
                onChange={(e) => setTxtInput(e.target.value)}
                placeholder="Paste class notes, code snippets, or essay draft..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleTxtToPdf}
                disabled={!txtInput.trim()}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Create Formatted PDF</span>
              </button>
            </div>
          )}

          {/* Tool 5: Merge PDFs */}
          {activeTool === "merge-pdfs" && (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 cursor-pointer bg-slate-50 dark:bg-slate-950 text-center">
                <Layers className="w-7 h-7 text-indigo-500 mb-2" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Select Additional PDF Files to Merge
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Will be appended in order
                </span>
                <input
                  type="file"
                  multiple
                  accept="application/pdf"
                  onChange={(e) => setMergePdfFiles(Array.from(e.target.files || []))}
                  className="hidden"
                />
              </label>

              {mergePdfFiles.length > 0 && (
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {mergePdfFiles.map((file, i) => (
                    <div
                      key={i}
                      className="text-xs flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800"
                    >
                      <span className="truncate">{file.name}</span>
                      <span className="text-slate-400 text-[10px]">{(file.size / 1024).toFixed(0)} KB</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleMergePdfs}
                disabled={mergePdfFiles.length === 0 && !currentPdfBytes}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Merge Documents Together</span>
              </button>
            </div>
          )}

          {/* Tool 6: Split PDF */}
          {activeTool === "split-pdf" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Extract specific page ranges into a separate standalone document.
              </p>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Page Range (1 - {totalPages}):
                </label>
                <input
                  type="text"
                  value={splitRange}
                  onChange={(e) => setSplitRange(e.target.value)}
                  placeholder="e.g. 1-3, 5"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleSplitPdf}
                disabled={!currentPdfBytes}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
              >
                <Split className="w-4 h-4" />
                <span>Extract Pages to New PDF</span>
              </button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
