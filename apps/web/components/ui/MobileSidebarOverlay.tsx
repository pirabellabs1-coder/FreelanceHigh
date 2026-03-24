"use client";

import { useEffect } from "react";

interface MobileSidebarOverlayProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Shared mobile sidebar overlay — replaces 7 duplicated patterns.
 * Renders a backdrop + slide-in container at z-50.
 * Usage: wrap your sidebar content as children.
 */
export function MobileSidebarOverlay({
  open,
  onClose,
  children,
}: MobileSidebarOverlayProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Sidebar container */}
      <div className="relative z-50 h-full max-w-[min(85vw,288px)] w-72 animate-slide-in flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Fermer le menu"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
        {children}
      </div>
    </div>
  );
}
