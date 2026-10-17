"use client";

import React, { useRef, useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { PenTool, Type, Upload, Check, Trash2, Stamp } from "lucide-react";

interface SignaturePadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string, type: "signature" | "stamp", label?: string) => void;
}

export function SignaturePadModal({
  isOpen,
  onClose,
  onSave,
}: SignaturePadModalProps) {
  const [activeTab, setActiveTab] = useState<"draw" | "type" | "stamps" | "upload">("draw");
  const [typedName, setTypedName] = useState("");
  const [selectedFont, setSelectedFont] = useState<"cursive" | "serif" | "sans">("cursive");
  const [sigColor, setSigColor] = useState("#000000");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  // Ready-made stamps
  const presetStamps = [
    { label: "APPROVED", color: "#16a34a" },
    { label: "CONFIDENTIAL", color: "#dc2626" },
    { label: "DRAFT", color: "#ea580c" },
    { label: "REVIEWED", color: "#2563eb" },
    { label: "FINAL", color: "#7c3aed" },
    { label: "PAID", color: "#059669" },
    { label: "REJECTED", color: "#b91c1c" },
    { label: "URGENT", color: "#e11d48" },
  ];

  useEffect(() => {
    if (isOpen && activeTab === "draw") {
      clearCanvas();
    }
  }, [isOpen, activeTab]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = sigColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const handleSaveDrawn = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl, "signature");
    onClose();
  };

  const handleSaveTyped = () => {
    if (!typedName.trim()) return;
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 140;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = sigColor;

    let fontStr = "42px 'Brush Script MT', 'Segoe Script', cursive";
    if (selectedFont === "serif") fontStr = "36px Georgia, serif";
    if (selectedFont === "sans") fontStr = "bold 32px system-ui, sans-serif";

    ctx.font = fontStr;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(typedName, 200, 70);

    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl, "signature", typedName);
    onClose();
  };

  const handleSaveStamp = (stamp: { label: string; color: string }) => {
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rounded rectangle border
    ctx.strokeStyle = stamp.color;
    ctx.lineWidth = 5;
    ctx.fillStyle = stamp.color + "18"; // light tint fill
    ctx.beginPath();
    ctx.roundRect(10, 10, 280, 80, 12);
    ctx.fill();
    ctx.stroke();

    // Stamp text
    ctx.font = "900 28px sans-serif";
    ctx.fillStyle = stamp.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.letterSpacing = "2px";
    ctx.fillText(stamp.label, 150, 50);

    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl, "stamp", stamp.label);
    onClose();
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onSave(dataUrl, "stamp", file.name);
      onClose();
    };
    reader.readAsDataURL(file);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Signature or Business Stamp"
      description="Draw by hand, type cursive initials, choose a verification stamp, or upload your signature."
      maxWidth="lg"
    >
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-4 gap-2">
        <button
          onClick={() => setActiveTab("draw")}
          className={`flex items-center gap-1.5 pb-2 text-xs font-medium border-b-2 transition-all ${
            activeTab === "draw"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Draw</span>
        </button>
        <button
          onClick={() => setActiveTab("type")}
          className={`flex items-center gap-1.5 pb-2 text-xs font-medium border-b-2 transition-all ${
            activeTab === "type"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Type</span>
        </button>
        <button
          onClick={() => setActiveTab("stamps")}
          className={`flex items-center gap-1.5 pb-2 text-xs font-medium border-b-2 transition-all ${
            activeTab === "stamps"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Stamp className="w-3.5 h-3.5" />
          <span>Stamps</span>
        </button>
        <button
          onClick={() => setActiveTab("upload")}
          className={`flex items-center gap-1.5 pb-2 text-xs font-medium border-b-2 transition-all ${
            activeTab === "upload"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File</span>
        </button>
      </div>

      {/* Color picker for draw and type */}
      {(activeTab === "draw" || activeTab === "type") && (
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-slate-500 dark:text-slate-400">Ink Color:</span>
          {["#000000", "#1e3a8a", "#047857", "#b91c1c"].map((color) => (
            <button
              key={color}
              onClick={() => setSigColor(color)}
              className={`w-5 h-5 rounded-full border-2 transition-transform ${
                sigColor === color ? "scale-125 border-indigo-500 ring-2 ring-indigo-300" : "border-white"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}

      {/* Tab 1: Draw */}
      {activeTab === "draw" && (
        <div className="space-y-4">
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 p-2 shadow-inner">
            <canvas
              ref={canvasRef}
              width={460}
              height={180}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-44 cursor-crosshair touch-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={clearCanvas}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Canvas</span>
            </button>
            <button
              onClick={handleSaveDrawn}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-colors"
            >
              Insert Signature
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Type */}
      {activeTab === "type" && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Type your full name or initials
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-2">
            {[
              { id: "cursive", label: "Cursive Script" },
              { id: "serif", label: "Formal Serif" },
              { id: "sans", label: "Modern Clean" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFont(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  selectedFont === f.id
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-400 dark:text-indigo-300"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 p-6 flex items-center justify-center min-h-[100px]">
            <span
              style={{
                color: sigColor,
                fontFamily:
                  selectedFont === "cursive"
                    ? "'Brush Script MT', 'Segoe Script', cursive"
                    : selectedFont === "serif"
                    ? "Georgia, serif"
                    : "sans-serif",
                fontSize: selectedFont === "cursive" ? "32px" : "26px",
              }}
            >
              {typedName || "Preview will appear here"}
            </span>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveTyped}
              disabled={!typedName.trim()}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 shadow-md transition-colors"
            >
              Insert Typed Signature
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Ready-Made Business Stamps */}
      {activeTab === "stamps" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click any official stamp below to place it directly onto your document:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {presetStamps.map((stamp) => (
              <button
                key={stamp.label}
                onClick={() => handleSaveStamp(stamp)}
                className="p-3 rounded-xl border-2 hover:scale-105 active:scale-95 transition-all text-center flex flex-col items-center justify-center gap-1 group shadow-sm"
                style={{ borderColor: stamp.color, backgroundColor: stamp.color + "12" }}
              >
                <span
                  className="font-extrabold text-xs tracking-wider"
                  style={{ color: stamp.color }}
                >
                  {stamp.label}
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                  Click to add
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Upload File */}
      {activeTab === "upload" && (
        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 cursor-pointer text-center bg-slate-50 dark:bg-slate-950">
            <Upload className="w-8 h-8 text-indigo-500 mb-2" />
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
              Upload signature image or company seal (PNG / JPG)
            </span>
            <span className="text-[11px] text-slate-400 mt-1">Transparent PNG recommended</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleUploadImage}
              className="hidden"
            />
          </label>
        </div>
      )}
    </Modal>
  );
}
