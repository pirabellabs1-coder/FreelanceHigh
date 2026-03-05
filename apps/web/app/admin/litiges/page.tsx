"use client";

import { useState, useMemo } from "react";
import { useToastStore } from "@/store/dashboard";
import { usePlatformDataStore, type PlatformDispute } from "@/store/platform-data";
import { cn } from "@/lib/utils";

const PRIORITY_MAP: Record<string, { label: string; cls: string }> = {
  haute: { label: "Haute", cls: "bg-red-500/20 text-red-400" },
  moyenne: { label: "Moyenne", cls: "bg-amber-500/20 text-amber-400" },
  basse: { label: "Basse", cls: "bg-slate-500/20 text-slate-400" },
};

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  ouvert: { label: "Ouvert", cls: "bg-red-500/20 text-red-400" },
  en_examen: { label: "En examen", cls: "bg-amber-500/20 text-amber-400" },
  resolu: { label: "Résolu", cls: "bg-emerald-500/20 text-emerald-400" },
};

const VERDICT_MAP: Record<string, { label: string; cls: string }> = {
  client: { label: "En faveur du client", cls: "text-blue-400" },
  freelance: { label: "En faveur du freelance", cls: "text-primary" },
  partiel: { label: "Remboursement partiel", cls: "text-amber-400" },
  annulation: { label: "Annulation mutuelle", cls: "text-slate-400" },
};

export default function AdminDisputes() {
  const [tab, setTab] = useState("ouvert");
  const [resolveId, setResolveId] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<PlatformDispute["verdict"]>("freelance");
  const [verdictNote, setVerdictNote] = useState("");
  const [partialPercent, setPartialPercent] = useState(50);
  const { addToast } = useToastStore();
  const { disputes, resolveDispute, startExamineDispute } = usePlatformDataStore();

  const filtered = useMemo(() => {
    if (tab === "tous") return disputes;
    return disputes.filter(d => d.status === tab);
  }, [tab, disputes]);

  const stats = useMemo(() => ({
    ouvert: disputes.filter(d => d.status === "ouvert").length,
    en_examen: disputes.filter(d => d.status === "en_examen").length,
    resolu: disputes.filter(d => d.status === "resolu").length,
    total: disputes.length,
    totalAmount: disputes.filter(d => d.status !== "resolu").reduce((s, d) => s + d.amount, 0),
  }), [disputes]);

  const dispute = disputes.find(d => d.id === resolveId);

  function handleStartExamine(id: string) {
    startExamineDispute(id);
    addToast("info", "Litige passé en examen");
  }

  function handleResolve() {
    if (!resolveId || !verdict) return;
    if (!verdictNote.trim()) { addToast("warning", "Ajoutez un commentaire pour le verdict"); return; }
    resolveDispute(resolveId, verdict, verdictNote, verdict === "partiel" ? partialPercent : undefined);

    const d = disputes.find(x => x.id === resolveId);
    if (verdict === "client") addToast("success", `Litige résolu — €${d?.amount} remboursé au client`);
    else if (verdict === "freelance") addToast("success", `Litige résolu — fonds libérés au freelance`);
    else if (verdict === "partiel") addToast("success", `Litige résolu — ${partialPercent}% remboursé au client`);
    else addToast("success", `Litige résolu — commande annulée`);

    setResolveId(null);
    setVerdictNote("");
    setVerdict("freelance");
    setPartialPercent(50);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">gavel</span>
          Litiges
        </h1>
        <p className="text-slate-400 text-sm mt-1">Gérez les litiges entre clients et freelances. €{stats.totalAmount.toLocaleString()} en jeu.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: "Ouverts", value: stats.ouvert, color: "text-red-400", icon: "error" },
          { label: "En examen", value: stats.en_examen, color: "text-amber-400", icon: "pending" },
          { label: "Résolus", value: stats.resolu, color: "text-emerald-400", icon: "check_circle" },
          { label: "Montant en jeu", value: `€${stats.totalAmount.toLocaleString()}`, color: "text-blue-400", icon: "payments" },
        ].map(s => (
          <div key={s.label} className="bg-neutral-dark rounded-xl p-4 border border-border-dark">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("material-symbols-outlined text-lg", s.color)}>{s.icon}</span>
              <p className={cn("text-xl font-black", s.color)}>{s.value}</p>
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border-dark">
        {[
          { key: "ouvert", label: "Ouverts", count: stats.ouvert },
          { key: "en_examen", label: "En examen", count: stats.en_examen },
          { key: "resolu", label: "Résolus", count: stats.resolu },
          { key: "tous", label: "Tous", count: stats.total },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={cn("px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors flex items-center gap-1.5", tab === t.key ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-white")}>
            {t.label}
            <span className="text-[10px] bg-border-dark px-1.5 py-0.5 rounded-full">{t.count}</span>
          </button>
        ))}
      </div>

      {/* Dispute list */}
      <div className="space-y-4">
        {filtered.map(d => (
          <div key={d.id} className={cn("bg-neutral-dark rounded-xl border p-5 transition-colors", d.status === "resolu" ? "border-border-dark/50 opacity-75" : "border-border-dark hover:border-border-dark/80")}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-sm font-mono font-bold text-primary">{d.id}</span>
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", PRIORITY_MAP[d.priority]?.cls)}>{PRIORITY_MAP[d.priority]?.label}</span>
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", STATUS_MAP[d.status]?.cls)}>{STATUS_MAP[d.status]?.label}</span>
                  <span className="text-xs text-slate-500">Commande {d.orderId}</span>
                </div>
                <p className="font-semibold text-white mb-2">{d.reason}</p>

                {/* Arguments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                    <p className="text-xs font-bold text-blue-400 mb-1">Client : {d.clientName}</p>
                    <p className="text-xs text-slate-400 line-clamp-3">{d.clientArgument}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-xs font-bold text-primary mb-1">Freelance : {d.freelanceName}</p>
                    <p className="text-xs text-slate-400 line-clamp-3">{d.freelanceArgument}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-400 flex-wrap">
                  <span className="font-bold text-primary">€{d.amount.toLocaleString()}</span>
                  <span>Ouvert le {new Date(d.openedAt).toLocaleDateString("fr-FR")}</span>
                  {d.resolvedAt && <span className="text-emerald-400">Résolu le {new Date(d.resolvedAt).toLocaleDateString("fr-FR")}</span>}
                  {d.verdict && <span className={cn("font-semibold", VERDICT_MAP[d.verdict]?.cls)}>{VERDICT_MAP[d.verdict]?.label}</span>}
                  {d.verdictNote && <span className="text-xs italic text-slate-500">&ldquo;{d.verdictNote}&rdquo;</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {d.status === "ouvert" && (
                  <>
                    <button onClick={() => handleStartExamine(d.id)} className="px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-lg hover:bg-amber-600 transition-colors">Examiner</button>
                    <button onClick={() => { setResolveId(d.id); setVerdict("freelance"); }} className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors">Résoudre</button>
                  </>
                )}
                {d.status === "en_examen" && (
                  <button onClick={() => { setResolveId(d.id); setVerdict("freelance"); }} className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors">Rendre le verdict</button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-slate-600">gavel</span>
            <p className="text-slate-500 mt-2">Aucun litige dans cette catégorie</p>
          </div>
        )}
      </div>

      {/* Modal Résolution */}
      {resolveId && dispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setResolveId(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-neutral-dark rounded-2xl p-6 w-full max-w-lg border border-border-dark shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-white mb-4">Résoudre le litige {dispute.id}</h3>

            {/* Résumé */}
            <div className="bg-background-dark rounded-xl p-4 mb-4 border border-border-dark/50 space-y-2">
              <p className="text-sm text-slate-300"><b className="text-white">Commande :</b> {dispute.orderId} — {dispute.orderTitle}</p>
              <p className="text-sm text-slate-300"><b className="text-white">Montant :</b> <span className="text-primary font-bold">€{dispute.amount.toLocaleString()}</span></p>
              <p className="text-sm text-slate-300"><b className="text-white">Client :</b> {dispute.clientName}</p>
              <p className="text-sm text-slate-300"><b className="text-white">Freelance :</b> {dispute.freelanceName}</p>
              <p className="text-sm text-slate-300"><b className="text-white">Motif :</b> {dispute.reason}</p>
            </div>

            {/* Choix du verdict */}
            <label className="text-xs font-semibold text-slate-400 mb-2 block">Verdict</label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {([
                { key: "freelance", label: "Freelance", desc: "Fonds libérés au freelance", icon: "person", color: "border-primary text-primary bg-primary/10" },
                { key: "client", label: "Client", desc: "Remboursement total au client", icon: "person", color: "border-blue-500 text-blue-400 bg-blue-500/10" },
                { key: "partiel", label: "Partiel", desc: "Remboursement partiel", icon: "pie_chart", color: "border-amber-500 text-amber-400 bg-amber-500/10" },
                { key: "annulation", label: "Annulation", desc: "Annulation et remboursement", icon: "cancel", color: "border-slate-500 text-slate-400 bg-slate-500/10" },
              ] as const).map(v => (
                <button key={v.key} onClick={() => setVerdict(v.key)} className={cn("p-3 rounded-xl border-2 text-left transition-all", verdict === v.key ? v.color : "border-border-dark text-slate-400 hover:border-slate-500")}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="material-symbols-outlined text-sm">{v.icon}</span>
                    <span className="text-sm font-bold">{v.label}</span>
                  </div>
                  <p className="text-xs opacity-70">{v.desc}</p>
                </button>
              ))}
            </div>

            {/* Pourcentage partiel */}
            {verdict === "partiel" && (
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Pourcentage remboursé au client : {partialPercent}%</label>
                <input type="range" min={10} max={90} step={5} value={partialPercent} onChange={e => setPartialPercent(+e.target.value)} className="w-full accent-amber-500" />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>€{Math.round(dispute.amount * partialPercent / 100)} au client</span>
                  <span>€{Math.round(dispute.amount * (100 - partialPercent) / 100)} au freelance</span>
                </div>
              </div>
            )}

            {/* Note */}
            <textarea value={verdictNote} onChange={e => setVerdictNote(e.target.value)} rows={3} placeholder="Commentaire du verdict (obligatoire)..." className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-sm text-white placeholder:text-slate-500 outline-none resize-none mb-4 focus:ring-2 focus:ring-primary/30" />

            <div className="flex gap-3">
              <button onClick={() => setResolveId(null)} className="flex-1 py-2.5 border border-border-dark rounded-lg text-sm font-semibold text-slate-300 hover:bg-background-dark/50 transition-colors">Annuler</button>
              <button onClick={handleResolve} className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">Appliquer le verdict</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
