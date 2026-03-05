"use client";

import { useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePlatformDataStore, computeAgencyStats } from "@/store/platform-data";

// Current demo agency = u9 (TechCorp Agency)
const CURRENT_AGENCY_ID = "u9";

const ACTIVITIES = [
  { member: "Amadou D.", action: "a livré le module panier", time: "Il y a 30min", icon: "check_circle", color: "text-emerald-400" },
  { member: "Fatou S.", action: "a uploadé les maquettes Figma", time: "Il y a 1h", icon: "upload_file", color: "text-blue-400" },
  { member: "Nadia F.", action: "a soumis le rapport SEO", time: "Il y a 2h", icon: "description", color: "text-purple-400" },
  { member: "Ibrahim T.", action: "a commencé le sprint 3", time: "Il y a 3h", icon: "play_arrow", color: "text-amber-400" },
  { member: "Kofi M.", action: "a rejoint le projet FinTech", time: "Il y a 5h", icon: "person_add", color: "text-primary" },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  en_attente: { label: "En attente", cls: "bg-amber-500/20 text-amber-400" },
  en_cours: { label: "En cours", cls: "bg-blue-500/20 text-blue-400" },
  conception: { label: "Conception", cls: "bg-purple-500/20 text-purple-400" },
  actif: { label: "Actif", cls: "bg-primary/20 text-primary" },
};

const STATUS_COLORS: Record<string, string> = {
  online: "bg-emerald-400",
  busy: "bg-amber-400",
  offline: "bg-slate-500",
};

export default function AgencyDashboard() {
  const state = usePlatformDataStore();
  const agencyStats = useMemo(() => computeAgencyStats(state, CURRENT_AGENCY_ID), [state]);

  const STATS = [
    { label: "CA mensuel", value: `€${agencyStats.totalCA.toLocaleString()}`, icon: "trending_up", color: "text-primary", trend: "+12.4%", trendUp: true },
    { label: "Projets actifs", value: agencyStats.activeProjects.toString(), icon: "folder_open", color: "text-blue-400", trend: `+${agencyStats.activeProjects}`, trendUp: true },
    { label: "Membres", value: agencyStats.totalMembers.toString(), icon: "groups", color: "text-purple-400" },
    { label: "Commandes", value: agencyStats.activeOrderCount.toString(), icon: "shopping_cart", color: "text-amber-400", trend: `${agencyStats.activeOrderCount}`, trendUp: true },
    { label: "Satisfaction", value: `${agencyStats.satisfaction}%`, icon: "sentiment_satisfied", color: "text-emerald-400", trend: "+2%", trendUp: true },
    { label: "Occupation", value: `${agencyStats.avgOccupation}%`, icon: "schedule", color: "text-orange-400", trend: agencyStats.avgOccupation > 70 ? "+5%" : "-1.5%", trendUp: agencyStats.avgOccupation > 70 },
  ];

  const revenue = state.agencyRevenue;
  const maxRev = Math.max(...revenue.map(r => r.value));
  const chartW = 600;
  const chartH = 180;
  const points = revenue.map((r, i) => ({
    x: (i / (revenue.length - 1)) * chartW,
    y: chartH - (r.value / maxRev) * chartH,
  }));
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${chartW} ${chartH} L 0 ${chartH} Z`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Tableau de bord</h1>
          <p className="text-slate-400 text-sm mt-1">Vue globale de votre agence — TechCorp Agency</p>
        </div>
        <div className="flex gap-2">
          <Link href="/agence/projets" className="px-4 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">add</span>
            Nouveau projet
          </Link>
          <Link href="/agence/equipe" className="px-4 py-2.5 bg-neutral-dark border border-border-dark text-white text-sm font-bold rounded-xl hover:bg-border-dark transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">person_add</span>
            Inviter
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {STATS.map(s => (
          <div key={s.label} className="bg-neutral-dark rounded-xl border border-border-dark p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={cn("material-symbols-outlined text-xl", s.color)}>{s.icon}</span>
              {s.trend && (
                <span className={cn("text-xs font-semibold", s.trendUp ? "text-emerald-400" : "text-red-400")}>
                  {s.trend}
                </span>
              )}
            </div>
            <p className="text-xl font-black text-white">{s.value}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-neutral-dark rounded-xl border border-border-dark p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">Revenus mensuels</h2>
            <span className="text-xs text-slate-500">6 derniers mois</span>
          </div>
          <svg viewBox={`0 0 ${chartW} ${chartH + 20}`} className="w-full h-48">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(var(--color-primary))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(var(--color-primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#areaGrad)" />
            <path d={linePath} fill="none" stroke="rgb(var(--color-primary))" strokeWidth="2.5" strokeLinejoin="round" />
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="4" fill="rgb(var(--color-primary))" />
                <text x={p.x} y={p.y - 10} textAnchor="middle" className="text-[10px] fill-slate-400">€{(revenue[i].value / 1000).toFixed(0)}k</text>
                <text x={p.x} y={chartH + 16} textAnchor="middle" className="text-[10px] fill-slate-500">{revenue[i].month}</text>
              </g>
            ))}
          </svg>
        </div>

        {/* Team Status */}
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">Équipe</h2>
            <Link href="/agence/equipe" className="text-xs text-primary font-semibold hover:underline">Voir tout</Link>
          </div>
          <div className="space-y-3">
            {state.agencyMembers.map(m => (
              <div key={m.id} className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{m.avatar}</div>
                  <span className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-neutral-dark", STATUS_COLORS[m.status])} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{m.name}</p>
                  <p className="text-xs text-slate-500">{m.role}</p>
                </div>
                <span className={cn("text-[10px] font-semibold capitalize", m.status === "online" ? "text-emerald-400" : m.status === "busy" ? "text-amber-400" : "text-slate-500")}>
                  {m.status === "online" ? "Disponible" : m.status === "busy" ? "Occupé" : "Hors-ligne"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Projects Table */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark">
        <div className="p-5 border-b border-border-dark flex items-center justify-between">
          <h2 className="font-bold text-white">Projets actifs</h2>
          <Link href="/agence/projets" className="text-sm text-primary font-semibold hover:underline">Voir tout</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-border-dark">
                <th className="px-5 py-3 text-left font-semibold">Projet</th>
                <th className="px-5 py-3 text-left font-semibold">Responsable</th>
                <th className="px-5 py-3 text-left font-semibold">Statut</th>
                <th className="px-5 py-3 text-left font-semibold">Progression</th>
                <th className="px-5 py-3 text-left font-semibold">Budget</th>
              </tr>
            </thead>
            <tbody>
              {state.agencyProjects.map((p, i) => (
                <tr key={i} className="border-b border-border-dark/50 hover:bg-background-dark/30 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-sm font-semibold text-white">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.client}</p>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                        {p.memberName.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-sm text-slate-300">{p.memberName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", STATUS_MAP[p.status]?.cls)}>{STATUS_MAP[p.status]?.label}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-border-dark rounded-full max-w-[100px]">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-400">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold text-white">€{p.budget.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
        <h2 className="font-bold text-white mb-4">Activité récente</h2>
        <div className="space-y-4">
          {ACTIVITIES.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className={cn("material-symbols-outlined text-lg mt-0.5", a.color)}>{a.icon}</span>
              <div className="flex-1">
                <p className="text-sm text-slate-300"><span className="font-semibold text-white">{a.member}</span> {a.action}</p>
                <p className="text-xs text-slate-500">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
