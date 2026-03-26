"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface OfferData {
  offerId: string;
  title: string;
  amount: number;
  delay: string;
  revisions: number;
  description: string;
  status: string;
  validityDays: number;
  expiresAt?: string;
}

interface OfferMessageCardProps {
  offerData: OfferData;
  isClient: boolean;
  onAccept: () => Promise<void>;
  onRefuse: () => Promise<void>;
}

const STATUS_BADGES: Record<string, { label: string; cls: string; icon: string }> = {
  en_attente: { label: "En attente", cls: "bg-amber-500/20 text-amber-400", icon: "schedule" },
  acceptee: { label: "Acceptee", cls: "bg-emerald-500/20 text-emerald-400", icon: "check_circle" },
  refusee: { label: "Refusee", cls: "bg-red-500/20 text-red-400", icon: "cancel" },
  expiree: { label: "Expiree", cls: "bg-slate-500/20 text-slate-400", icon: "timer_off" },
};

export function OfferMessageCard({ offerData, isClient, onAccept, onRefuse }: OfferMessageCardProps) {
  const [loading, setLoading] = useState(false);
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isExpired = offerData.expiresAt ? new Date(offerData.expiresAt) < new Date() : false;
  const effectiveStatus = isExpired && offerData.status === "en_attente" ? "expiree" : offerData.status;
  const badge = STATUS_BADGES[effectiveStatus] || STATUS_BADGES.en_attente;
  const showActions = isClient && effectiveStatus === "en_attente";

  // Expiration countdown
  let expiresIn = "";
  if (offerData.expiresAt && effectiveStatus === "en_attente") {
    const diff = new Date(offerData.expiresAt).getTime() - Date.now();
    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      expiresIn = days > 0 ? `${days}j ${hours}h` : `${hours}h`;
    }
  }

  async function handleAccept() {
    setLoading(true);
    try { await onAccept(); } finally { setLoading(false); }
  }

  async function handleRefuse() {
    setLoading(true);
    setShowRefuseModal(false);
    try { await onRefuse(); } finally { setLoading(false); }
  }

  const descriptionTruncated = offerData.description.length > 120 && !expanded
    ? offerData.description.slice(0, 120) + "..."
    : offerData.description;

  return (
    <>
      <ConfirmModal
        open={showRefuseModal}
        title="Refuser l'offre"
        message={`Etes-vous sur de vouloir refuser l'offre "${offerData.title}" ? Cette action est irreversible.`}
        confirmLabel="Refuser l'offre"
        variant="danger"
        onConfirm={handleRefuse}
        onCancel={() => setShowRefuseModal(false)}
      />

      <div className={cn(
        "w-full max-w-sm rounded-2xl border-2 overflow-hidden transition-all",
        effectiveStatus === "acceptee" ? "border-emerald-500/30 bg-emerald-500/5" :
        effectiveStatus === "refusee" ? "border-red-500/20 bg-red-500/5" :
        effectiveStatus === "expiree" ? "border-slate-500/20 bg-slate-500/5 opacity-60" :
        "border-primary/30 bg-primary/5"
      )}>
        {/* Header */}
        <div className="px-4 pt-4 pb-2 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-lg">local_offer</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-white truncate">{offerData.title}</p>
              <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5", badge.cls)}>
                <span className="material-symbols-outlined text-[10px]">{badge.icon}</span>
                {badge.label}
              </span>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="px-4 py-2">
          <p className="text-2xl font-black text-emerald-400">
            {offerData.amount.toLocaleString("fr-FR")} <span className="text-sm font-bold">EUR</span>
          </p>
        </div>

        {/* Details */}
        <div className="px-4 pb-2 grid grid-cols-2 gap-2">
          <div className="bg-white/5 rounded-lg px-3 py-2">
            <p className="text-[10px] text-slate-500 font-bold uppercase">Delai</p>
            <p className="text-xs font-bold text-white">{offerData.delay}</p>
          </div>
          <div className="bg-white/5 rounded-lg px-3 py-2">
            <p className="text-[10px] text-slate-500 font-bold uppercase">Revisions</p>
            <p className="text-xs font-bold text-white">{offerData.revisions}</p>
          </div>
        </div>

        {/* Description */}
        <div className="px-4 pb-2">
          <p className="text-xs text-slate-300 leading-relaxed">{descriptionTruncated}</p>
          {offerData.description.length > 120 && (
            <button onClick={() => setExpanded(!expanded)} className="text-[10px] text-primary font-bold mt-1 hover:underline">
              {expanded ? "Voir moins" : "Voir plus"}
            </button>
          )}
        </div>

        {/* Expiration */}
        {expiresIn && (
          <div className="px-4 pb-2">
            <p className="text-[10px] text-slate-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]">timer</span>
              Expire dans {expiresIn}
            </p>
          </div>
        )}

        {/* Actions (client only, en_attente only) */}
        {showActions && (
          <div className="px-4 pb-4 flex gap-2">
            <button
              onClick={handleAccept}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 text-white text-sm font-black rounded-xl hover:bg-emerald-600 disabled:opacity-50 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
            >
              {loading ? (
                <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-lg">check_circle</span>
              )}
              {loading ? "..." : "Accepter"}
            </button>
            <button
              onClick={() => setShowRefuseModal(true)}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-red-500/30 text-red-400 text-sm font-bold rounded-xl hover:bg-red-500/10 disabled:opacity-50 transition-all"
            >
              <span className="material-symbols-outlined text-lg">close</span>
              Refuser
            </button>
          </div>
        )}

        {/* Accepted state */}
        {effectiveStatus === "acceptee" && (
          <div className="px-4 pb-4 flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <span className="material-symbols-outlined text-lg">check_circle</span>
            Offre acceptee — commande creee
          </div>
        )}
      </div>
    </>
  );
}
