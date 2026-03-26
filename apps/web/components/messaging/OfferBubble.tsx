"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToastStore } from "@/store/toast";

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

interface OfferBubbleProps {
  offer: OfferData;
  isMine: boolean;
  currentUserRole: string;
  onAccept?: (offerId: string) => Promise<void>;
  onRefuse?: (offerId: string) => Promise<void>;
  onProposeProlongation?: (offerId: string) => void;
}

const STATUS_STYLES: Record<string, { label: string; color: string; icon: string }> = {
  en_attente: { label: "En attente", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: "schedule" },
  acceptee: { label: "Acceptee", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: "check_circle" },
  refusee: { label: "Refusee", color: "text-red-400 bg-red-500/10 border-red-500/20", icon: "cancel" },
  expiree: { label: "Expiree", color: "text-slate-400 bg-slate-500/10 border-slate-500/20", icon: "timer_off" },
  annulee: { label: "Annulee", color: "text-slate-400 bg-slate-500/10 border-slate-500/20", icon: "block" },
};

export function OfferBubble({ offer, isMine, currentUserRole, onAccept, onRefuse }: OfferBubbleProps) {
  const addToast = useToastStore((s) => s.addToast);
  const [accepting, setAccepting] = useState(false);
  const [refusing, setRefusing] = useState(false);

  const statusInfo = STATUS_STYLES[offer.status] || STATUS_STYLES.en_attente;
  const isExpired = offer.expiresAt ? new Date(offer.expiresAt) < new Date() : false;
  const canAct = offer.status === "en_attente" && !isExpired && !isMine;

  async function handleAccept() {
    if (!onAccept) return;
    setAccepting(true);
    try {
      await onAccept(offer.offerId);
      addToast("success", "Offre acceptee ! La commande a ete creee.");
    } catch {
      addToast("error", "Erreur lors de l'acceptation de l'offre");
    } finally {
      setAccepting(false);
    }
  }

  async function handleRefuse() {
    if (!onRefuse) return;
    setRefusing(true);
    try {
      await onRefuse(offer.offerId);
      addToast("info", "Offre refusee.");
    } catch {
      addToast("error", "Erreur lors du refus");
    } finally {
      setRefusing(false);
    }
  }

  return (
    <div className={cn(
      "w-full max-w-sm rounded-xl border-2 overflow-hidden transition-all",
      offer.status === "acceptee" ? "border-emerald-500/30 bg-emerald-500/5" :
      offer.status === "refusee" || isExpired ? "border-slate-500/20 bg-slate-500/5 opacity-70" :
      "border-primary/30 bg-primary/5"
    )}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border-dark/50 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-lg">local_offer</span>
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Offre Personnalisee</span>
        <span className={cn("ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border", statusInfo.color)}>
          <span className="material-symbols-outlined text-[10px] mr-0.5 align-middle">{statusInfo.icon}</span>
          {isExpired && offer.status === "en_attente" ? "Expiree" : statusInfo.label}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <h4 className="font-bold text-sm">{offer.title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{offer.description}</p>

        {/* Details grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-background-dark/50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-slate-500">Montant</p>
            <p className="text-sm font-extrabold text-primary">{offer.amount} EUR</p>
          </div>
          <div className="bg-background-dark/50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-slate-500">Delai</p>
            <p className="text-sm font-bold">{offer.delay}</p>
          </div>
          <div className="bg-background-dark/50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-slate-500">Revisions</p>
            <p className="text-sm font-bold">{offer.revisions}</p>
          </div>
        </div>

        {/* Validity */}
        {offer.expiresAt && offer.status === "en_attente" && !isExpired && (
          <p className="text-[10px] text-slate-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">timer</span>
            Valide jusqu&apos;au {new Date(offer.expiresAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        )}

        {/* Action buttons (only for recipient, not sender) */}
        {canAct && (
          <div className="flex gap-2 pt-1">
            <button onClick={handleAccept} disabled={accepting}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-primary text-white font-bold rounded-lg text-xs hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20">
              {accepting ? (
                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-sm">check</span>
              )}
              Accepter l&apos;offre
            </button>
            <button onClick={handleRefuse} disabled={refusing}
              className="flex items-center justify-center gap-1 px-3 py-2.5 border border-red-500/30 text-red-400 font-bold rounded-lg text-xs hover:bg-red-500/10 disabled:opacity-50 transition-all">
              {refusing ? (
                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-sm">close</span>
              )}
              Refuser
            </button>
          </div>
        )}

        {/* Accepted message */}
        {offer.status === "acceptee" && (
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 rounded-lg text-xs font-bold text-emerald-400">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Offre acceptee — La commande a ete creee. Le freelance a 3 jours pour valider et commencer.
          </div>
        )}
      </div>
    </div>
  );
}
