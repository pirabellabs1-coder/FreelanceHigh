"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const TEAM_PERFORMANCE = [
  { name: "Amadou D.", orders: 12, rating: 4.9, avgDelay: "2.1j", onTime: 95 },
  { name: "Fatou S.", orders: 9, rating: 4.7, avgDelay: "1.8j", onTime: 100 },
  { name: "Nadia F.", orders: 15, rating: 4.6, avgDelay: "3.2j", onTime: 87 },
  { name: "Ibrahim M.", orders: 8, rating: 4.9, avgDelay: "1.5j", onTime: 100 },
  { name: "Marie K.", orders: 20, rating: 4.7, avgDelay: "2.0j", onTime: 95 },
  { name: "Yacine D.", orders: 4, rating: 4.5, avgDelay: "2.8j", onTime: 75 },
];

const NPS = { score: 72, promoters: 65, passives: 22, detractors: 13 };

const CATEGORIES = [
  { name: "Développement", revenue: 82000, pct: 45 },
  { name: "Design", revenue: 47100, pct: 26 },
  { name: "Marketing", revenue: 29000, pct: 16 },
  { name: "Rédaction", revenue: 15000, pct: 8 },
  { name: "DevOps", revenue: 12000, pct: 5 },
];

const CAT_COLORS = ["bg-primary", "bg-blue-500", "bg-purple-500", "bg-amber-500", "bg-slate-500"];

export default function AgenceAnalytics() {
  const [period, setPeriod] = useState("mois");
  const { addToast } = useToastStore();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Performance de l&apos;équipe et métriques de l&apos;agence.</p>
        </div>
        <div className="flex gap-2">
          <select value={period} onChange={e => setPeriod(e.target.value)} className="px-3 py-2 bg-neutral-dark border border-border-dark rounded-lg text-xs text-white outline-none focus:border-primary/50">
            <option value="semaine">Cette semaine</option>
            <option value="mois">Ce mois</option>
            <option value="trimestre">Ce trimestre</option>
            <option value="annee">Cette année</option>
          </select>
          <button onClick={() => addToast("info", "Export CSV en cours...")} className="px-4 py-2 bg-neutral-dark border border-border-dark rounded-lg text-xs text-white font-semibold hover:bg-border-dark transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">download</span>
            Exporter
          </button>
        </div>
      </div>

      {/* NPS */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
        <h2 className="font-bold text-white mb-4">Satisfaction Clients (NPS)</h2>
        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className={cn("text-5xl font-black", NPS.score >= 50 ? "text-primary" : NPS.score >= 0 ? "text-amber-400" : "text-red-400")}>{NPS.score}</p>
            <p className="text-xs text-slate-500 mt-1">Score NPS</p>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 h-3 bg-border-dark rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500" style={{ width: `${NPS.promoters}%` }} />
                <div className="h-full bg-amber-400" style={{ width: `${NPS.passives}%` }} />
                <div className="h-full bg-red-400" style={{ width: `${NPS.detractors}%` }} />
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-emerald-400 font-semibold">Promoteurs {NPS.promoters}%</span>
              <span className="text-amber-400 font-semibold">Passifs {NPS.passives}%</span>
              <span className="text-red-400 font-semibold">Détracteurs {NPS.detractors}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Performance */}
        <div className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
          <div className="p-5 border-b border-border-dark"><h2 className="font-bold text-white">Performance Équipe</h2></div>
          <table className="w-full">
            <thead><tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-border-dark"><th className="px-5 py-3 text-left font-semibold">Membre</th><th className="px-5 py-3 text-left font-semibold">Commandes</th><th className="px-5 py-3 text-left font-semibold">Note</th><th className="px-5 py-3 text-left font-semibold">Délai moy.</th><th className="px-5 py-3 text-left font-semibold">À temps</th></tr></thead>
            <tbody>
              {TEAM_PERFORMANCE.map(m => (
                <tr key={m.name} className="border-b border-border-dark/50 hover:bg-background-dark/30 transition-colors">
                  <td className="px-5 py-3"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">{m.name.split(" ").map(n => n[0]).join("")}</div><span className="text-sm font-semibold text-white">{m.name}</span></div></td>
                  <td className="px-5 py-3 text-sm text-slate-300">{m.orders}</td>
                  <td className="px-5 py-3"><span className="text-sm font-semibold text-yellow-400 flex items-center gap-0.5"><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>{m.rating}</span></td>
                  <td className="px-5 py-3 text-sm text-slate-400">{m.avgDelay}</td>
                  <td className="px-5 py-3"><span className={cn("text-sm font-bold", m.onTime >= 90 ? "text-emerald-400" : m.onTime >= 80 ? "text-amber-400" : "text-red-400")}>{m.onTime}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Revenue by category */}
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <h2 className="font-bold text-white mb-4">Revenus par Catégorie</h2>
          <div className="space-y-4">
            {CATEGORIES.map((c, i) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-white">{c.name}</span>
                  <span className="text-sm text-slate-400">€{c.revenue.toLocaleString("fr-FR")} ({c.pct}%)</span>
                </div>
                <div className="h-3 bg-border-dark rounded-full">
                  <div className={cn("h-full rounded-full", CAT_COLORS[i])} style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-border-dark flex items-center justify-between">
            <span className="text-sm font-bold text-white">Total</span>
            <span className="text-sm font-bold text-primary">€{CATEGORIES.reduce((s, c) => s + c.revenue, 0).toLocaleString("fr-FR")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
