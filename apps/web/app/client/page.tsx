"use client";

import { useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePlatformDataStore, computeClientStats } from "@/store/platform-data";

// Current demo client = u5 (TechCorp Inc.)
const CURRENT_CLIENT_ID = "u5";

export default function ClientDashboard() {
  const state = usePlatformDataStore();

  const clientStats = useMemo(() => computeClientStats(state, CURRENT_CLIENT_ID), [state]);

  const myProjects = useMemo(() => {
    return state.clientProjects.map(p => ({
      ...p,
      icon: p.progress >= 80 ? "rocket_launch" : p.progress >= 50 ? "hub" : "edit",
      iconBg: p.progress >= 80 ? "bg-orange-500/20" : p.progress >= 50 ? "bg-primary/20" : "bg-blue-500/20",
      iconColor: p.progress >= 80 ? "text-orange-400" : p.progress >= 50 ? "text-primary" : "text-blue-400",
    }));
  }, [state.clientProjects]);

  const myOrders = useMemo(() => {
    return state.clientOrders;
  }, [state.clientOrders]);

  const STATS = [
    { label: "Projets Actifs", value: clientStats.activeProjects.toString(), variation: `${clientStats.completedOrders} terminés`, variationColor: "text-primary", icon: "folder_copy", iconBg: "bg-primary/10", iconColor: "text-primary" },
    { label: "Freelances", value: clientStats.uniqueFreelances.toString(), variation: "Freelances engagés", variationColor: "text-slate-400", icon: "people", iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
    { label: "Dépenses Totales", value: `${clientStats.totalSpent.toLocaleString()} €`, variation: `${clientStats.completedOrders} commandes`, variationColor: "text-emerald-400", icon: "payments", iconBg: "bg-orange-500/10", iconColor: "text-orange-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Tableau de Bord</h1>
        <p className="text-primary/60 mt-1">Bienvenue, voici un aperçu de votre activité actuelle.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="bg-neutral-dark rounded-xl p-5 border border-border-dark">
            <div className="flex items-center justify-between mb-3">
              <p className="text-primary/60 text-sm font-medium">{s.label}</p>
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", s.iconBg)}>
                <span className={cn("material-symbols-outlined text-xl", s.iconColor)}>{s.icon}</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className={cn("text-xs mt-1", s.variationColor)}>{s.variation}</p>
          </div>
        ))}
      </div>

      {/* Projects + Right Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Projets Actifs */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Projets Actifs</h2>
            <Link href="/client/projets" className="text-sm text-primary font-semibold hover:underline">Voir tout</Link>
          </div>

          <div className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border-dark text-xs text-slate-500 uppercase font-semibold">
              <div className="col-span-5">Nom du projet</div>
              <div className="col-span-4">Progression</div>
              <div className="col-span-3 text-right">Date d&apos;échéance</div>
            </div>

            {/* Table rows */}
            {myProjects.map(p => (
              <div key={p.id} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-border-dark/50 hover:bg-white/[0.02] transition-colors items-center">
                <div className="col-span-5 flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", p.iconBg)}>
                    <span className={cn("material-symbols-outlined text-lg", p.iconColor)}>{p.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{p.name}</p>
                    <p className="text-xs text-slate-500">Freelance: {p.freelanceName}</p>
                  </div>
                </div>
                <div className="col-span-4 flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400 w-8">{p.progress}%</span>
                  <div className="flex-1 h-2 bg-border-dark rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all", p.barColor)} style={{ width: `${p.progress}%` }} />
                  </div>
                  <span className={cn("text-xs font-semibold", p.statusColor)}>{p.status}</span>
                </div>
                <div className="col-span-3 text-right text-sm text-slate-400">
                  {p.dueDate}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Dernières Commandes */}
          <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
            <h3 className="text-base font-bold text-white mb-4">Dernières Commandes</h3>
            <div className="space-y-3">
              {myOrders.map(o => (
                <div key={o.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-border-dark flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-slate-400 text-lg">description</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{o.name}</p>
                    <p className="text-xs text-slate-500">{o.ref} · {o.status}</p>
                  </div>
                  <span className="text-sm font-bold text-white flex-shrink-0">€{o.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <Link href="/client/commandes" className="block text-center text-sm text-primary font-semibold mt-4 py-2 border border-border-dark rounded-lg hover:bg-primary/5 transition-colors">
              Voir tout l&apos;historique
            </Link>
          </div>

          {/* Résumé financier */}
          <div className="bg-neutral-dark rounded-xl border border-border-dark p-5 relative overflow-hidden">
            <p className="text-primary font-bold text-sm mb-2">Total dépensé</p>
            <p className="text-4xl font-bold text-white">€{clientStats.totalSpent.toLocaleString()}</p>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Commandes terminées</span>
                <span className="font-bold text-emerald-400">{clientStats.completedOrders}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Projets actifs</span>
                <span className="font-bold text-blue-400">{clientStats.activeProjects}</span>
              </div>
            </div>
            {/* Decorative */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-600/20 rounded-full" />
            <div className="absolute -bottom-2 -right-1 w-16 h-16 bg-slate-600/10 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
