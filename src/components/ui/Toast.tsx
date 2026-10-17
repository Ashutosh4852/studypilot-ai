"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  toast: (options: { type?: ToastType; title: string; description?: string; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = useCallback(
    ({ type = "info", title, description, duration = 4000 }: { type?: ToastType; title: string; description?: string; duration?: number }) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = { id, type, title, description };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-lg border backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 ${
              t.type === "success"
                ? "bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100"
                : t.type === "error"
                ? "bg-rose-50/95 dark:bg-rose-950/90 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100"
                : t.type === "warning"
                ? "bg-amber-50/95 dark:bg-amber-950/90 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100"
                : "bg-indigo-50/95 dark:bg-indigo-950/90 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-100"
            }`}
          >
            {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
            {t.type === "error" && <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
            {t.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />}
            {t.type === "info" && <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />}

            <div className="flex-1">
              <h5 className="text-xs font-semibold">{t.title}</h5>
              {t.description && <p className="text-[11px] opacity-90 mt-0.5">{t.description}</p>}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
