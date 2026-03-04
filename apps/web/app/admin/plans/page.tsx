"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const PLANS = [
  { id: "gratuit", name: "Gratuit", price: 0, commission: 20, services: 3, candidatures: 5, users: 4200, color: "border-slate-500" },
  { id: "pro", name: "Pro", price: 15, commission: 15, services: 15, candidatures: 20, users: 5800, color: "border-primary" },
  { id: "business", name: "Business", price: 45, commission: 10, services: -1, candidatures: -1, users: 1890, color: "border-blue-500" },
  { id: "agence", name: "Agence", price: 99, commission: 8, services: -1, candidatures: -1, users: 560, color: "border-purple-500" },
];

const PROMOS = [
  { code: "LAUNCH2026", discount: 30, uses: 145, maxUses: 500, expiry: "2026-06-30", active: true },
  { code: "AFRIK20", discount: 20, uses: 89, maxUses: 200, expiry: "2026-04-30", active: true },
  { code: "WELCOME10", discount: 10, uses: 312, maxUses: 1000, expiry: "2026-12-31", active: true },
];

export default function AdminPlans() {
  const [editPlan, setEditPlan] = useState<string | null>(null);
  const [newCommission, setNewCommission] = useState(0);
  const { addToast } = useToastStore();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">workspace_premium</span>
        Plans &amp; Commissions
      </h1>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {PLANS.map(p => (
          <div key={p.id} className={cn("bg-neutral-dark rounded-xl p-5 border-2", p.color)}>
            <h3 className="font-bold text-lg text-white">{p.name}</h3>
            <p className="text-2xl font-bold mt-2 text-white">
              {p.price === 0 ? "Gratuit" : `\u20AC${p.price}/mois`}
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Commission</span>
                <span className="font-bold text-white">{p.commission}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Services</span>
                <span className="font-bold text-white">{p.services === -1 ? "Illimit\u00e9" : p.services}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Candidatures/mois</span>
                <span className="font-bold text-white">{p.candidatures === -1 ? "Illimit\u00e9" : p.candidatures}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Utilisateurs actifs</span>
                <span className="font-bold text-primary">{p.users.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => { setEditPlan(p.id); setNewCommission(p.commission); }}
              className="w-full mt-4 py-2 border border-border-dark rounded-lg text-xs font-semibold text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              Modifier
            </button>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setEditPlan(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-neutral-dark rounded-2xl p-6 w-full max-w-md border border-border-dark">
            <h3 className="font-bold text-lg text-white mb-4">
              Modifier le plan {PLANS.find(p => p.id === editPlan)?.name}
            </h3>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Taux de commission (%)
            </label>
            <input
              type="number"
              value={newCommission}
              onChange={e => setNewCommission(Number(e.target.value))}
              min={1}
              max={50}
              className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none focus:border-primary mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setEditPlan(null)}
                className="flex-1 py-2.5 border border-border-dark rounded-lg text-sm font-semibold text-slate-300 hover:bg-border-dark transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => { addToast("success", "Plan mis \u00e0 jour"); setEditPlan(null); }}
                className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promo codes */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark">
        <div className="p-5 border-b border-border-dark flex items-center justify-between">
          <h2 className="font-bold text-white">Codes promotionnels</h2>
          <button
            onClick={() => addToast("info", "Cr\u00e9ation de code bient\u00f4t disponible")}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors"
          >
            Nouveau code
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-400 uppercase border-b border-border-dark">
                <th className="px-5 py-3 text-left font-semibold">Code</th>
                <th className="px-5 py-3 text-center font-semibold">R&eacute;duction</th>
                <th className="px-5 py-3 text-center font-semibold">Utilisations</th>
                <th className="px-5 py-3 text-left font-semibold">Expiration</th>
                <th className="px-5 py-3 text-center font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {PROMOS.map(p => (
                <tr key={p.code} className="border-b border-border-dark/50 hover:bg-primary/5">
                  <td className="px-5 py-3 font-mono font-bold text-sm text-primary">{p.code}</td>
                  <td className="px-5 py-3 text-center text-sm font-bold text-white">{p.discount}%</td>
                  <td className="px-5 py-3 text-center text-sm text-slate-400">{p.uses}/{p.maxUses}</td>
                  <td className="px-5 py-3 text-sm text-slate-400">{new Date(p.expiry).toLocaleDateString("fr-FR")}</td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">Actif</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
