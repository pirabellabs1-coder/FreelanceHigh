"use client";

import { cn } from "@/lib/utils";

// ============================================================
// Order Phase Pipeline — Visual stepper for order lifecycle
// Used by: Freelance, Client, Agency dashboards
// ============================================================

export interface OrderPhase {
  key: string;
  label: string;
  icon: string;
  description: string;
}

export const ORDER_PHASES: OrderPhase[] = [
  { key: "created", label: "Commande créée", icon: "receipt_long", description: "Le client a passé commande et les fonds sont en escrow." },
  { key: "accepted", label: "Acceptée", icon: "handshake", description: "Le freelance a accepté la mission." },
  { key: "in_progress", label: "En cours", icon: "construction", description: "Le freelance travaille sur la commande." },
  { key: "delivered", label: "Livrée", icon: "local_shipping", description: "Les livrables ont été envoyés au client." },
  { key: "validation", label: "En validation", icon: "fact_check", description: "Le client vérifie les livrables." },
  { key: "completed", label: "Terminée", icon: "celebration", description: "Commande validée, fonds libérés." },
];

export function getPhaseIndex(status: string): number {
  switch (status) {
    case "en_attente": return 0;
    case "en_cours": return 2;
    case "livre": case "livree": return 3;
    case "revision": case "en_revision": return 2;
    case "termine": case "terminee": return 5;
    case "annule": case "annulee": return -1;
    case "litige": return -2;
    default: return 0;
  }
}

function getPhaseState(phaseIdx: number, currentIdx: number, status: string): "done" | "active" | "upcoming" {
  if (status === "annule" || status === "annulee" || status === "litige") return "upcoming";
  if (phaseIdx < currentIdx) return "done";
  if (phaseIdx === currentIdx) return "active";
  return "upcoming";
}

interface TimelineEvent {
  type: string;
  timestamp: string;
}

function getPhaseDate(phase: OrderPhase, timeline?: TimelineEvent[]): string | null {
  if (!timeline) return null;
  const typeMap: Record<string, string> = {
    created: "created",
    accepted: "started",
    in_progress: "started",
    delivered: "delivered",
    validation: "delivered",
    completed: "completed",
  };
  const eventType = typeMap[phase.key];
  if (!eventType) return null;
  const event = timeline.find((e) => e.type === eventType);
  return event ? event.timestamp : null;
}

function formatDate(ts: string): string {
  return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function formatShortDate(ts: string): string {
  return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

// ============================================================
// Props
// ============================================================

export interface OrderPhasePipelineProps {
  status: string;
  revisionsLeft?: number;
  timeline?: TimelineEvent[];
}

// ============================================================
// Component
// ============================================================

export function OrderPhasePipeline({ status, revisionsLeft, timeline }: OrderPhasePipelineProps) {
  const currentIdx = getPhaseIndex(status);
  const isRevision = status === "revision" || status === "en_revision";
  const isCancelled = status === "annule" || status === "annulee";
  const isDispute = status === "litige";

  return (
    <div className="bg-background-dark/50 border border-border-dark rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">timeline</span>
          Suivi de la commande
        </h3>
        {isRevision && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 text-orange-400 text-xs font-bold rounded-full border border-orange-500/20">
            <span className="material-symbols-outlined text-sm">replay</span>
            Révision demandée
          </span>
        )}
        {isCancelled && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 text-xs font-bold rounded-full border border-red-500/20">
            <span className="material-symbols-outlined text-sm">cancel</span>
            Commande annulée
          </span>
        )}
        {isDispute && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 text-xs font-bold rounded-full border border-red-500/20">
            <span className="material-symbols-outlined text-sm">gavel</span>
            Litige en cours
          </span>
        )}
      </div>

      {/* ---- Horizontal pipeline (desktop) ---- */}
      <div className="hidden md:block">
        <div className="flex items-start">
          {ORDER_PHASES.map((phase, i) => {
            const state = getPhaseState(i, currentIdx, status);
            const phaseDate = getPhaseDate(phase, timeline);
            const isLast = i === ORDER_PHASES.length - 1;

            return (
              <div key={phase.key} className="flex-1 flex flex-col items-center text-center relative group">
                {/* Connector line (before) */}
                {i > 0 && (
                  <div
                    className={cn(
                      "absolute top-5 h-0.5 z-0",
                      state === "done" ? "bg-emerald-500" :
                      state === "active" ? "bg-primary" : "bg-border-dark"
                    )}
                    style={{ left: "calc(-50% + 20px)", right: "calc(50% + 20px)" }}
                  />
                )}

                {/* Icon */}
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all relative",
                  state === "done" ? "bg-emerald-500/20 ring-2 ring-emerald-500" :
                  state === "active" ? "bg-primary/20 ring-2 ring-primary" :
                  "bg-white/5 ring-1 ring-border-dark"
                )}>
                  {state === "done" ? (
                    <span className="material-symbols-outlined text-lg text-emerald-400">check</span>
                  ) : (
                    <span className={cn(
                      "material-symbols-outlined text-lg",
                      state === "active" ? "text-primary" : "text-slate-600"
                    )}>{phase.icon}</span>
                  )}
                  {state === "active" && (
                    <span className="absolute inset-0 rounded-full ring-2 ring-primary animate-ping opacity-20" />
                  )}
                </div>

                {/* Label */}
                <p className={cn(
                  "text-xs font-bold mt-2.5",
                  state === "done" ? "text-emerald-400" :
                  state === "active" ? "text-primary" : "text-slate-600"
                )}>{phase.label}</p>

                {/* Date */}
                {phaseDate && state === "done" && (
                  <p className="text-[10px] text-slate-500 mt-0.5">{formatShortDate(phaseDate)}</p>
                )}
                {state === "active" && (
                  <p className="text-[10px] text-primary/60 mt-0.5 font-semibold">En cours...</p>
                )}

                {/* Tooltip */}
                <div className="absolute top-14 mt-2 bg-neutral-dark border border-border-dark rounded-lg px-3 py-2 text-left w-44 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                  <p className="text-[11px] text-slate-300 leading-relaxed">{phase.description}</p>
                </div>

                {/* Connector line (after) */}
                {!isLast && (
                  <div
                    className={cn(
                      "absolute top-5 h-0.5 z-0",
                      i < currentIdx ? "bg-emerald-500" :
                      i === currentIdx ? "bg-gradient-to-r from-primary to-border-dark" : "bg-border-dark"
                    )}
                    style={{ left: "calc(50% + 20px)", right: "calc(-50% + 20px)" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- Vertical pipeline (mobile) ---- */}
      <div className="md:hidden space-y-0">
        {ORDER_PHASES.map((phase, i) => {
          const state = getPhaseState(i, currentIdx, status);
          const phaseDate = getPhaseDate(phase, timeline);
          const isLast = i === ORDER_PHASES.length - 1;

          return (
            <div key={phase.key} className="flex gap-3">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center relative",
                  state === "done" ? "bg-emerald-500/20 ring-2 ring-emerald-500" :
                  state === "active" ? "bg-primary/20 ring-2 ring-primary" :
                  "bg-white/5 ring-1 ring-border-dark"
                )}>
                  {state === "done" ? (
                    <span className="material-symbols-outlined text-lg text-emerald-400">check</span>
                  ) : (
                    <span className={cn(
                      "material-symbols-outlined text-lg",
                      state === "active" ? "text-primary" : "text-slate-600"
                    )}>{phase.icon}</span>
                  )}
                  {state === "active" && (
                    <span className="absolute inset-0 rounded-full ring-2 ring-primary animate-ping opacity-20" />
                  )}
                </div>
                {!isLast && (
                  <div className={cn(
                    "w-0.5 flex-1 my-1 min-h-[16px]",
                    state === "done" ? "bg-emerald-500" :
                    state === "active" ? "bg-primary" : "bg-border-dark"
                  )} />
                )}
              </div>
              <div className={cn("pb-4 flex-1", isLast && "pb-0")}>
                <p className={cn(
                  "font-bold text-sm",
                  state === "done" ? "text-emerald-400" :
                  state === "active" ? "text-primary" : "text-slate-600"
                )}>{phase.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{phase.description}</p>
                {phaseDate && state === "done" && (
                  <p className="text-[10px] text-slate-500 mt-0.5">{formatDate(phaseDate)}</p>
                )}
                {state === "active" && (
                  <p className="text-[10px] text-primary/60 mt-0.5 font-semibold">En cours...</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Revision indicator */}
      {isRevision && (
        <div className="mt-3 flex items-center gap-3 px-4 py-3 bg-orange-500/5 border border-orange-500/20 rounded-xl">
          <span className="material-symbols-outlined text-orange-400 text-xl">replay</span>
          <div>
            <p className="text-sm font-bold text-orange-300">Révision demandée par le client</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {revisionsLeft != null ? `${revisionsLeft} révision(s) restante(s) — ` : ""}La commande retourne en phase de travail.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
