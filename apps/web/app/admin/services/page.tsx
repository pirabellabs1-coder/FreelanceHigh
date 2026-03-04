"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const SERVICES = [
  { id: "1", title: "Bot Discord personnalis\u00e9", seller: "Paul K.", category: "D\u00e9veloppement", price: 120, submitted: "2026-03-03", status: "en_attente" },
  { id: "2", title: "Logo minimaliste premium", seller: "Aminata C.", category: "Design", price: 80, submitted: "2026-03-02", status: "en_attente" },
  { id: "3", title: "Audit SEO complet", seller: "Ousmane K.", category: "SEO", price: 200, submitted: "2026-03-02", status: "en_attente" },
  { id: "4", title: "Service de piratage", seller: "Utilisateur X", category: "Autre", price: 500, submitted: "2026-03-01", status: "signale", reports: 5 },
  { id: "5", title: "Contenu adulte", seller: "Utilisateur Y", category: "Autre", price: 50, submitted: "2026-02-28", status: "signale", reports: 8 },
  { id: "6", title: "Traduction EN-FR juridique", seller: "Jean-Pierre N.", category: "Traduction", price: 150, submitted: "2026-03-03", status: "en_attente" },
];

export default function AdminServices() {
  const [tab, setTab] = useState("en_attente");
  const [services, setServices] = useState(SERVICES);
  const { addToast } = useToastStore();

  const filtered = tab === "tous" ? services : services.filter(s => s.status === tab);

  function action(id: string, act: string) {
    setServices(prev => prev.filter(s => s.id !== id));
    addToast("success", `Service ${act}`);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">work</span>
        Mod&eacute;ration des Services
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "En attente", value: services.filter(s => s.status === "en_attente").length, color: "text-amber-400" },
          { label: "Approuv\u00e9s ce mois", value: 89, color: "text-emerald-400" },
          { label: "Refus\u00e9s", value: 7, color: "text-red-400" },
          { label: "Signal\u00e9s", value: services.filter(s => s.status === "signale").length, color: "text-orange-400" },
        ].map(s => (
          <div key={s.label} className="bg-neutral-dark rounded-xl p-5 border border-border-dark">
            <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border-dark">
        {[
          { key: "en_attente", label: "En attente" },
          { key: "signale", label: "Signal\u00e9s" },
          { key: "tous", label: "Tous" },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors",
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-slate-400 hover:text-white"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Service cards */}
      <div className="space-y-4">
        {filtered.map(s => (
          <div key={s.id} className="bg-neutral-dark rounded-xl border border-border-dark p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-bold text-white">{s.title}</h3>
                  <span className="text-xs bg-border-dark text-slate-300 px-2 py-0.5 rounded-full">{s.category}</span>
                  {s.status === "signale" && (
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-semibold">
                      {(s as { reports?: number }).reports} signalements
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400">
                  par <b className="text-slate-300">{s.seller}</b> &middot; &euro;{s.price} &middot; {new Date(s.submitted).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => action(s.id, "approuv\u00e9")}
                  className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Approuver
                </button>
                <button
                  onClick={() => action(s.id, "refus\u00e9")}
                  className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors"
                >
                  Refuser
                </button>
                <button
                  onClick={() => action(s.id, "supprim\u00e9")}
                  className="px-3 py-1.5 bg-border-dark text-slate-400 text-xs font-bold rounded-lg hover:bg-border-dark/80 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-slate-600">check_circle</span>
            <p className="text-slate-400 mt-2">Aucun service &agrave; mod&eacute;rer</p>
          </div>
        )}
      </div>
    </div>
  );
}
