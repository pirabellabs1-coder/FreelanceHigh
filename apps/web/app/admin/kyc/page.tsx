"use client";

import { useState, useMemo } from "react";
import { useToastStore } from "@/store/dashboard";
import { usePlatformDataStore } from "@/store/platform-data";
import { cn } from "@/lib/utils";

const LEVEL_MAP: Record<number, { label: string; desc: string; color: string }> = {
  1: { label: "Niveau 1", desc: "Email vérifié", color: "text-slate-400" },
  2: { label: "Niveau 2", desc: "Téléphone vérifié", color: "text-blue-400" },
  3: { label: "Niveau 3", desc: "Identité vérifiée", color: "text-amber-400" },
  4: { label: "Niveau 4", desc: "Vérification pro", color: "text-emerald-400" },
};

export default function AdminKYC() {
  const [tab, setTab] = useState("en_attente");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const { addToast } = useToastStore();
  const { kycRequests, users, approveKyc, refuseKyc } = usePlatformDataStore();

  const filtered = useMemo(() => {
    if (tab === "tous") return kycRequests;
    if (tab === "en_attente") return kycRequests.filter(r => r.status === "en_attente");
    if (tab === "approuve") return kycRequests.filter(r => r.status === "approuve");
    if (tab === "refuse") return kycRequests.filter(r => r.status === "refuse");
    const lvl = parseInt(tab.replace("niveau_", ""));
    return kycRequests.filter(r => r.requestedLevel === lvl && r.status === "en_attente");
  }, [tab, kycRequests]);

  const stats = useMemo(() => ({
    pending: kycRequests.filter(r => r.status === "en_attente").length,
    approved: kycRequests.filter(r => r.status === "approuve").length,
    refused: kycRequests.filter(r => r.status === "refuse").length,
  }), [kycRequests]);

  function handleApprove(id: string) {
    const req = kycRequests.find(r => r.id === id);
    approveKyc(id);
    addToast("success", `KYC de ${req?.userName} approuvé — niveau ${req?.requestedLevel} activé`);
  }

  function handleRefuse() {
    if (!rejectId || !rejectReason.trim()) { addToast("warning", "Indiquez un motif de refus"); return; }
    const req = kycRequests.find(r => r.id === rejectId);
    refuseKyc(rejectId, rejectReason);
    addToast("success", `KYC de ${req?.userName} refusé`);
    setRejectId(null);
    setRejectReason("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">verified</span>
          Vérifications KYC
        </h1>
        <p className="text-slate-400 text-sm mt-1">Validez les demandes de vérification d&apos;identité.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "En attente", value: stats.pending, color: "text-amber-400", icon: "hourglass_top" },
          { label: "Approuvés", value: stats.approved, color: "text-emerald-400", icon: "check_circle" },
          { label: "Refusés", value: stats.refused, color: "text-red-400", icon: "cancel" },
        ].map(s => (
          <div key={s.label} className="bg-neutral-dark rounded-xl p-5 border border-border-dark">
            <div className="flex items-center gap-3 mb-2">
              <span className={cn("material-symbols-outlined", s.color)}>{s.icon}</span>
              <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
            </div>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Onglets */}
      <div className="flex gap-2 border-b border-border-dark overflow-x-auto">
        {[
          { key: "en_attente", label: "En attente", count: stats.pending },
          { key: "approuve", label: "Approuvés", count: stats.approved },
          { key: "refuse", label: "Refusés", count: stats.refused },
          { key: "tous", label: "Tous", count: kycRequests.length },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={cn("px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap flex items-center gap-1.5", tab === t.key ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-300")}>
            {t.label}
            <span className="text-[10px] bg-border-dark px-1.5 py-0.5 rounded-full">{t.count}</span>
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="space-y-4">
        {filtered.map(r => {
          const user = users.find(u => u.id === r.userId);
          const levelInfo = LEVEL_MAP[r.requestedLevel];
          return (
            <div key={r.id} className={cn("bg-neutral-dark rounded-xl border border-border-dark p-5", r.status !== "en_attente" && "opacity-70")}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">{r.userAvatar}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-white">{r.userName}</h3>
                      <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", levelInfo?.color === "text-blue-400" ? "bg-blue-500/20 text-blue-400" : levelInfo?.color === "text-amber-400" ? "bg-amber-500/20 text-amber-400" : levelInfo?.color === "text-emerald-400" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400")}>
                        {levelInfo?.label}
                      </span>
                      {r.status === "approuve" && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">Approuvé</span>}
                      {r.status === "refuse" && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-semibold">Refusé</span>}
                    </div>
                    <p className="text-sm text-slate-400">{r.userEmail}</p>
                    <p className="text-sm text-slate-400 mt-0.5">Niveau actuel : <b className="text-white">{r.currentLevel}</b> → Demandé : <b className="text-white">{r.requestedLevel}</b></p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 text-xs bg-border-dark text-slate-300 px-2 py-1 rounded-lg">
                        <span className="material-symbols-outlined text-xs">description</span>{r.documentType}
                      </span>
                      <span className="text-xs text-slate-500">Soumis le {new Date(r.submittedAt).toLocaleDateString("fr-FR")}</span>
                      {user && <span className="text-xs text-slate-500">{user.countryFlag} {user.country}</span>}
                    </div>
                    {r.refuseReason && <p className="text-xs text-red-400/80 mt-2">Motif : {r.refuseReason}</p>}
                    {r.reviewedAt && <p className="text-xs text-slate-600 mt-1">Traité le {new Date(r.reviewedAt).toLocaleDateString("fr-FR")} par {r.reviewedBy}</p>}
                  </div>
                </div>
                {r.status === "en_attente" && (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleApprove(r.id)} className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors">Approuver</button>
                    <button onClick={() => setRejectId(r.id)} className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors">Refuser</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-slate-600">verified</span>
            <p className="text-slate-500 mt-2">Aucune demande dans cette catégorie</p>
          </div>
        )}
      </div>

      {/* Modal refus */}
      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setRejectId(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-neutral-dark rounded-2xl p-6 w-full max-w-md border border-border-dark shadow-2xl">
            <h3 className="font-bold text-lg text-white mb-4">Motif de refus</h3>
            <p className="text-sm text-slate-400 mb-3">Ce motif sera communiqué à l&apos;utilisateur.</p>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} placeholder="Expliquez le motif du refus..." className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-sm text-white placeholder:text-slate-500 outline-none resize-none mb-4 focus:ring-2 focus:ring-primary/30" />
            <div className="flex gap-3">
              <button onClick={() => setRejectId(null)} className="flex-1 py-2.5 border border-border-dark rounded-lg text-sm font-semibold text-slate-300 hover:bg-background-dark/50 transition-colors">Annuler</button>
              <button onClick={handleRefuse} className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-colors">Confirmer le refus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
