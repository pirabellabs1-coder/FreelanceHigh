"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const REGISTRATIONS = [
  { day: "Lun", value: 45 }, { day: "Mar", value: 62 }, { day: "Mer", value: 58 },
  { day: "Jeu", value: 71 }, { day: "Ven", value: 85 }, { day: "Sam", value: 52 }, { day: "Dim", value: 38 },
];

const REVENUE_BY_CAT = [
  { category: "Developpement Web", revenue: 48500, pct: 33 },
  { category: "Design UI/UX", revenue: 28200, pct: 19 },
  { category: "Marketing Digital", revenue: 21800, pct: 15 },
  { category: "Mobile", revenue: 18900, pct: 13 },
  { category: "IA & Data", revenue: 12500, pct: 9 },
  { category: "Cybersecurite", revenue: 8400, pct: 6 },
  { category: "Autres", revenue: 6900, pct: 5 },
];

const TOP_COUNTRIES = [
  { country: "Senegal", flag: "SN", users: 3200, revenue: 42000 },
  { country: "Cote d\u2019Ivoire", flag: "CI", users: 2800, revenue: 38000 },
  { country: "France", flag: "FR", users: 2100, revenue: 35000 },
  { country: "Cameroun", flag: "CM", users: 1500, revenue: 15000 },
  { country: "Mali", flag: "ML", users: 900, revenue: 8000 },
  { country: "Ghana", flag: "GH", users: 750, revenue: 6500 },
];

const FUNNEL = [
  { step: "Visite site", value: 45000, pct: 100 },
  { step: "Inscription", value: 4500, pct: 10 },
  { step: "Profil complete", value: 3200, pct: 7.1 },
  { step: "Premier achat/service", value: 1800, pct: 4 },
  { step: "Client recurrent", value: 650, pct: 1.4 },
];

export default function AdminAnalytics() {
  const [period, setPeriod] = useState("30j");
  const { addToast } = useToastStore();
  const maxReg = Math.max(...REGISTRATIONS.map(r => r.value));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">bar_chart</span>
          Analytics Plateforme
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex bg-border-dark rounded-lg p-0.5">
            {["7j", "30j", "90j", "12m"].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-semibold transition-colors",
                  period === p ? "bg-neutral-dark text-primary shadow-sm" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => addToast("success", "Rapport exporte")}
            className="px-3 py-1.5 border border-border-dark rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-red-500/5 flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">download</span>Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Inscriptions", value: 411, trend: "+12%" },
          { label: "Taux conversion", value: "3,2", suffix: "%" },
          { label: "Panier moyen", value: 285, prefix: "\u20AC" },
          { label: "Retention M1", value: 72, suffix: "%" },
        ].map(s => (
          <div key={s.label} className="bg-neutral-dark rounded-xl p-5 border border-border-dark">
            <p className="text-2xl font-bold text-white">{s.prefix}{s.value}{s.suffix}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-slate-500">{s.label}</p>
              {s.trend && <span className="text-xs text-emerald-400 font-semibold">{s.trend}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registrations chart */}
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <h2 className="font-bold text-white mb-4">Inscriptions (7 derniers jours)</h2>
          <div className="flex items-end gap-3 h-40">
            {REGISTRATIONS.map(r => (
              <div key={r.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-white">{r.value}</span>
                <div className="w-full bg-primary rounded-t-lg" style={{ height: `${(r.value / maxReg) * 100}%` }} />
                <span className="text-xs text-slate-500">{r.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion funnel */}
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <h2 className="font-bold text-white mb-4">Tunnel de conversion</h2>
          <div className="space-y-3">
            {FUNNEL.map(f => (
              <div key={f.step}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-300">{f.step}</span>
                  <span className="font-bold text-white">{f.value.toLocaleString()} ({f.pct}%)</span>
                </div>
                <div className="h-3 bg-border-dark rounded-full">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${f.pct}%`, minWidth: f.pct < 5 ? "1rem" : undefined }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by category */}
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <h2 className="font-bold text-white mb-4">Revenus par categorie</h2>
          <div className="space-y-3">
            {REVENUE_BY_CAT.map(r => (
              <div key={r.category}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-300">{r.category}</span>
                  <span className="font-bold text-white">&euro;{r.revenue.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-border-dark rounded-full">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top countries */}
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <h2 className="font-bold text-white mb-4">Top pays</h2>
          <div className="space-y-3">
            {TOP_COUNTRIES.map((c, idx) => (
              <div key={c.flag} className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-500/5 transition-colors">
                <span className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-xs font-bold">{idx + 1}</span>
                <span className="text-sm text-slate-300 flex-1">{c.country}</span>
                <span className="text-sm font-bold text-slate-400">{c.users.toLocaleString()} users</span>
                <span className="text-sm font-bold text-primary">&euro;{c.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
