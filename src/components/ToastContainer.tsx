"use client";

import React from "react";
import { useApp } from "../context/AppContext";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
  ArrowRight,
} from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast, setActiveTab } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-full max-w-sm sm:max-w-md px-4 flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((toast) => {
        const iconMap = {
          success: (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          ),
          error: (
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
          ),
          warning: (
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          ),
          info: (
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          ),
        };

        const bgMap = {
          success:
            "border-emerald-200 dark:border-emerald-800 bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-950 dark:text-emerald-100",
          error:
            "border-rose-200 dark:border-rose-800 bg-rose-50/95 dark:bg-rose-950/90 text-rose-950 dark:text-rose-100",
          warning:
            "border-amber-200 dark:border-amber-800 bg-amber-50/95 dark:bg-amber-950/90 text-amber-950 dark:text-amber-100",
          info:
            "border-blue-200 dark:border-blue-800 bg-blue-50/95 dark:bg-blue-950/90 text-blue-950 dark:text-blue-100",
        };

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto w-full p-3.5 rounded-2xl border shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-3 duration-300 flex items-start gap-3 relative overflow-hidden group ${bgMap[toast.type]}`}
          >
            <div className="mt-0.5">{iconMap[toast.type]}</div>

            <div
              className={`flex-1 min-w-0 ${toast.actionTab ? "cursor-pointer" : ""}`}
              onClick={() => {
                if (toast.actionTab) {
                  setActiveTab(toast.actionTab);
                  removeToast(toast.id);
                }
              }}
            >
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs font-bold leading-tight truncate">
                  {toast.title}
                </h4>
                {toast.actionTab && (
                  <span className="text-[10px] font-semibold flex items-center gap-0.5 text-orange-600 dark:text-orange-400 underline ml-auto">
                    <span>Lihat</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                )}
              </div>
              <p className="text-xs opacity-90 mt-0.5 leading-relaxed break-words">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg text-current opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-opacity flex-shrink-0 min-h-[28px] min-w-[28px] flex items-center justify-center"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
