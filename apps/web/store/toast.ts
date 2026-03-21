"use client";

import { create } from "zustand";

// ============================================================
// Toast store — extrait de dashboard.ts pour eviter les erreurs
// "Cannot access 'y' before initialization" (TDZ) causees par
// les imports circulaires avec Turbopack.
// Ce fichier n'a AUCUNE dependance vers api-client ou demo-data.
// ============================================================

export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}

interface ToastState {
  toasts: Toast[];
  addToast: (type: Toast["type"], message: string) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (type, message) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
