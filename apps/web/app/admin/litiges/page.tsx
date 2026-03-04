"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const DISPUTES = [
  { id: "LIT-001", order: "CMD-338", buyer: "Jean K.", seller: "Ousmane K.", reason: "Livraison non conforme au brief", amount: 500, opened: "2026-02-28", priority: "urgent", status: "ouvert" },
  { id: "LIT-002", order: "CMD-325", buyer: "Sophie M.", seller: "Paul K.", reason: "D\u00e9lai non respect\u00e9, travail incomplet", amount: 150, opened: "2026-02-25", priority: "urgent", status: "en_cours" },
  { id: "LIT-003", order: "CMD-330", buyer: "Ahmed T.", seller: "Marie L.", reason: "Qualit\u00e9 du contenu insuffisante", amount: 180, opened: "2026-02-27", priority: "normal", status: "ouvert" },
  { id: "LIT-004", order: "CMD-315", buyer: "Fatim S.", seller: "A\u00efcha B.", reason: "Vid\u00e9o ne correspond pas aux sp\u00e9cifications", amount: 300, opened: "2026-02-20", priority: "normal", status: "en_cours" },
  { id: "LIT-005", order: "CMD-310", buyer: "Moussa N.", seller: "Kofi A.", reason: "Communication inexistante, projet abandonn\u00e9", amount: 700, opened: "2026-02-18", priority: "faible", status: "ouvert" },
  { id: "LIT-006", order: "CMD-298", buyer: "Awa D.", seller: "David O.", reason: "Fichiers sources non fournis", amount: 250, opened: "2026-02-15", priority: "normal", status: "en_cours" },
  { id: "LIT-007", order: "CMD-290", buyer: "Ibrahima S.", seller: "Nadia F.", reason: "R\u00e9sultats campagne en dessous des objectifs", amount: 400, opened: "2026-02-10", priority: "faible", status: "ouvert" },
];

const PRIORITY_MAP: Record<string, { label: string; cls: string }> = {
  urgent: { label: "Urgent", cls: "bg-red-500/20 text-red-400" },
  normal: { label: "Normal", cls: "bg-amber-500/20 text-amber-400" },
  faible: { label: "Faible", cls: "bg-slate-500/20 text-slate-400" },
};

export default function AdminDisputes() {
  const [selected, setSelected] = useState<string | null>(null);
  const [verdict, setVerdict] = useState("");
  const [disputes, setDisputes] = useState(DISPUTES);
  const { addToast } = useToastStore();

  const dispute = disputes.find(d => d.id === selected);

  function resolve(id: string, favor: string) {
    setDisputes(prev => prev.filter(d => d.id !== id));
    addToast("success", `Litige r\u00e9solu en faveur du ${favor}`);
    setSelected(null);
    setVerdict("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">gavel</span>
          Litiges
        </h1>
        <p className="text-slate-400 text-sm mt-1">G\u00e9rez les litiges entre acheteurs et vendeurs.</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Ouverts", value: disputes.filter(d => d.status === "ouvert").length, color: "text-red-400", icon: "error" },
          { label: "En cours", value: disputes.filter(d => d.status === "en_cours").length, color: "text-amber-400", icon: "pending" },
          { label: "R\u00e9solus ce mois", value: 15, color: "text-emerald-400", icon: "check_circle" },
          { label: "Temps moyen", value: "2.3j", color: "text-blue-400", icon: "schedule" },
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

      {/* Liste des litiges */}
      <div className="space-y-4">
        {disputes.map(d => (
          <div key={d.id} className="bg-neutral-dark rounded-xl border border-border-dark p-5 hover:border-border-dark/80 transition-colors">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-sm font-mono font-bold text-primary">{d.id}</span>
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", PRIORITY_MAP[d.priority]?.cls)}>
                    {PRIORITY_MAP[d.priority]?.label}
                  </span>
                  <span className="text-xs text-slate-500">Commande {d.order}</span>
                </div>
                <p className="font-semibold text-white mb-1">{d.reason}</p>
                <div className="flex items-center gap-4 text-sm text-slate-400 flex-wrap">
                  <span>Acheteur : <b className="text-slate-300">{d.buyer}</b></span>
                  <span>Vendeur : <b className="text-slate-300">{d.seller}</b></span>
                  <span className="font-bold text-primary">&euro;{d.amount}</span>
                  <span>Ouvert le {new Date(d.opened).toLocaleDateString("fr-FR")}</span>
                </div>
              </div>
              <button
                onClick={() => setSelected(d.id)}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors shrink-0"
              >
                R\u00e9soudre
              </button>
            </div>
          </div>
        ))}
        {disputes.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-slate-600">gavel</span>
            <p className="text-slate-500 mt-2">Aucun litige en cours</p>
          </div>
        )}
      </div>

      {/* Modale de r\u00e9solution */}
      {selected && dispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-neutral-dark rounded-2xl p-6 w-full max-w-lg border border-border-dark shadow-2xl">
            <h3 className="font-bold text-lg text-white mb-4">R\u00e9soudre {dispute.id}</h3>
            <div className="bg-background-dark rounded-lg p-4 mb-4 border border-border-dark/50">
              <p className="text-sm text-slate-300"><b className="text-white">Motif :</b> {dispute.reason}</p>
              <p className="text-sm text-slate-300 mt-1"><b className="text-white">Montant :</b> &euro;{dispute.amount}</p>
              <p className="text-sm text-slate-300 mt-1"><b className="text-white">Acheteur :</b> {dispute.buyer} vs <b className="text-white">Vendeur :</b> {dispute.seller}</p>
            </div>
            <textarea
              value={verdict}
              onChange={e => setVerdict(e.target.value)}
              rows={2}
              placeholder="Commentaire du verdict (optionnel)..."
              className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-sm text-white placeholder:text-slate-500 outline-none resize-none mb-4 focus:ring-2 focus:ring-primary/30"
            />
            <div className="flex gap-3">
              <button
                onClick={() => resolve(dispute.id, "freelance")}
                className="flex-1 py-2.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors"
              >
                En faveur du freelance
              </button>
              <button
                onClick={() => resolve(dispute.id, "client")}
                className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors"
              >
                En faveur du client
              </button>
            </div>
            <button
              onClick={() => { addToast("info", "Remboursement partiel appliqu\u00e9"); setSelected(null); setVerdict(""); }}
              className="w-full mt-2 py-2.5 border border-amber-500/50 text-amber-400 rounded-lg text-xs font-bold hover:bg-amber-500/10 transition-colors"
            >
              Remboursement partiel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
