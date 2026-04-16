"use client";

import { useEffect } from "react";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_COLORS: Record<string, { bg: string; hover: string; icon: string }> = {
  danger: { bg: "bg-red-500", hover: "hover:bg-red-600", icon: "warning" },
  warning: { bg: "bg-amber-500", hover: "hover:bg-amber-600", icon: "info" },
  primary: { bg: "bg-[#006e2f]", hover: "hover:bg-[#005523]", icon: "help" },
};

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "primary",
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;
    function onEsc(e: KeyboardEvent) { if (e.key === "Escape") onCancel(); }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onCancel]);

  if (!open) return null;

  const v = VARIANT_COLORS[variant];
  const iconColor = variant === "danger" ? "#ef4444" : variant === "warning" ? "#f59e0b" : "#006e2f";
  const iconBg = variant === "danger" ? "#fee2e2" : variant === "warning" ? "#fef3c7" : "#ecfdf5";

  return (
    <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-4" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
              <span className="material-symbols-outlined text-[24px]" style={{ color: iconColor }}>{v.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-extrabold text-[#191c1e] mb-1">{title}</h3>
              <p className="text-sm text-[#5c647a] leading-relaxed">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white text-[#191c1e] border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-colors ${v.bg} ${v.hover}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
