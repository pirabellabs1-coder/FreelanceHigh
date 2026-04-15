"use client";

import { useToastStore } from "@/store/toast";
import { cn } from "@/lib/utils";

const ICONS: Record<string, string> = {
  success: "check_circle",
  error: "error",
  info: "info",
  warning: "warning",
};

const COLORS: Record<string, string> = {
  success: "bg-white border-emerald-200 text-emerald-700 shadow-emerald-500/10",
  error: "bg-white border-red-200 text-red-700 shadow-red-500/10",
  info: "bg-white border-blue-200 text-blue-700 shadow-blue-500/10",
  warning: "bg-white border-amber-200 text-amber-700 shadow-amber-500/10",
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl animate-slide-in",
            COLORS[toast.type]
          )}
        >
          <span
            className="material-symbols-outlined text-xl flex-shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {ICONS[toast.type]}
          </span>
          <p className="text-sm font-semibold flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
