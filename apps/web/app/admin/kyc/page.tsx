"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const KYC_REQUESTS = [
  { id: "1", name: "Kofi Asante", role: "freelance", level: 2, docs: ["T\u00e9l\u00e9phone v\u00e9rifi\u00e9"], submitted: "2026-03-03", country: "\u{1F1EC}\u{1F1ED} Ghana" },
  { id: "2", name: "Awa Diallo", role: "freelance", level: 3, docs: ["Carte d\u2019identit\u00e9", "Selfie v\u00e9rification"], submitted: "2026-03-02", country: "\u{1F1F8}\u{1F1F3} S\u00e9n\u00e9gal" },
  { id: "3", name: "Paul Kouadio", role: "freelance", level: 3, docs: ["Passeport", "Justificatif domicile"], submitted: "2026-03-01", country: "\u{1F1E8}\u{1F1EE} C\u00f4te d\u2019Ivoire" },
  { id: "4", name: "Aminata Camara", role: "freelance", level: 4, docs: ["Dipl\u00f4me", "Portfolio pro", "Lettre r\u00e9f\u00e9rence"], submitted: "2026-03-01", country: "\u{1F1EC}\u{1F1F3} Guin\u00e9e" },
  { id: "5", name: "David Osei", role: "freelance", level: 2, docs: ["T\u00e9l\u00e9phone v\u00e9rifi\u00e9"], submitted: "2026-02-28", country: "\u{1F1EC}\u{1F1ED} Ghana" },
  { id: "6", name: "FashionAfrik", role: "client", level: 3, docs: ["RCCM", "Pi\u00e8ce d\u2019identit\u00e9 g\u00e9rant"], submitted: "2026-02-28", country: "\u{1F1E8}\u{1F1EE} C\u00f4te d\u2019Ivoire" },
];

export default function AdminKYC() {
  const [tab, setTab] = useState("tous");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [requests, setRequests] = useState(KYC_REQUESTS);
  const { addToast } = useToastStore();

  const filtered = tab === "tous" ? requests : requests.filter(r => `niveau_${r.level}` === tab);

  function approve(id: string) {
    setRequests(prev => prev.filter(r => r.id !== id));
    addToast("success", "KYC approuv\u00e9 avec succ\u00e8s");
  }

  function reject(id: string) {
    setRequests(prev => prev.filter(r => r.id !== id));
    addToast("info", "KYC refus\u00e9");
    setRejectId(null);
    setRejectReason("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">verified</span>
          V\u00e9rifications KYC
        </h1>
        <p className="text-slate-400 text-sm mt-1">Validez les demandes de v\u00e9rification d&apos;identit\u00e9.</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "En attente", value: requests.length, color: "text-amber-400", icon: "hourglass_top" },
          { label: "Approuv\u00e9s aujourd\u2019hui", value: 12, color: "text-emerald-400", icon: "check_circle" },
          { label: "Refus\u00e9s", value: 3, color: "text-red-400", icon: "cancel" },
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
      <div className="flex gap-2 border-b border-border-dark">
        {[
          { key: "tous", label: "Tous" },
          { key: "niveau_2", label: "Niveau 2" },
          { key: "niveau_3", label: "Niveau 3" },
          { key: "niveau_4", label: "Niveau 4" },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors",
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-300"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Liste des demandes */}
      <div className="space-y-4">
        {filtered.map(r => (
          <div key={r.id} className="bg-neutral-dark rounded-xl border border-border-dark p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                  {r.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-white">{r.name}</h3>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-semibold">Niveau {r.level}</span>
                    <span className="text-xs text-slate-500 capitalize">{r.role}</span>
                  </div>
                  <p className="text-sm text-slate-400">{r.country} &middot; Soumis le {new Date(r.submitted).toLocaleDateString("fr-FR")}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {r.docs.map(d => (
                      <span key={d} className="inline-flex items-center gap-1 text-xs bg-border-dark text-slate-300 px-2 py-1 rounded-lg">
                        <span className="material-symbols-outlined text-xs">description</span>{d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => approve(r.id)}
                  className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Approuver
                </button>
                <button
                  onClick={() => setRejectId(r.id)}
                  className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors"
                >
                  Refuser
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-slate-600">verified</span>
            <p className="text-slate-500 mt-2">Aucune demande en attente</p>
          </div>
        )}
      </div>

      {/* Modale de refus */}
      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setRejectId(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-neutral-dark rounded-2xl p-6 w-full max-w-md border border-border-dark shadow-2xl">
            <h3 className="font-bold text-lg text-white mb-4">Motif de refus</h3>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Expliquez le motif du refus..."
              className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-sm text-white placeholder:text-slate-500 outline-none resize-none mb-4 focus:ring-2 focus:ring-primary/30"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setRejectId(null)}
                className="flex-1 py-2.5 border border-border-dark rounded-lg text-sm font-semibold text-slate-300 hover:bg-background-dark/50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => reject(rejectId)}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-colors"
              >
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
