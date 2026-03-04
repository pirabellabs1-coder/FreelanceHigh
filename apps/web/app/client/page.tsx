"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const STATS = [
  { label: "Projets Actifs", value: "12", variation: "+2% depuis le mois dernier", variationColor: "text-primary", icon: "folder_copy", iconBg: "bg-primary/10", iconColor: "text-primary" },
  { label: "Messages", value: "4", variation: "Non lus ce matin", variationColor: "text-slate-400", icon: "mail", iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
  { label: "Dépenses Mensuelles", value: "2 450,00 €", variation: "-5% budget restant", variationColor: "text-red-400", icon: "photo_camera", iconBg: "bg-orange-500/10", iconColor: "text-orange-400" },
];

const PROJECTS = [
  { name: "Refonte Site E-commerce", client: "Client: L'Oreal Paris", progress: 75, status: "En cours", statusColor: "text-primary", barColor: "bg-primary", date: "12 Oct 2023", icon: "rocket_launch", iconBg: "bg-primary/20", iconColor: "text-primary" },
  { name: "Développement API Mobile", client: "Client: TechNova", progress: 32, status: "Phase de test", statusColor: "text-blue-400", barColor: "bg-blue-500", date: "25 Nov 2023", icon: "hub", iconBg: "bg-blue-500/20", iconColor: "text-blue-400" },
  { name: "Identité Visuelle - Startup", client: "Client: SolarFlow", progress: 90, status: "Finalisation", statusColor: "text-orange-400", barColor: "bg-orange-500", date: "05 Oct 2023", icon: "edit", iconBg: "bg-orange-500/20", iconColor: "text-orange-400" },
];

const ORDERS = [
  { name: "Pack Maintenance A...", ref: "#CMD-90231", status: "Payé", amount: "890€" },
  { name: "Audit SEO - Trimestriel", ref: "#CMD-89442", status: "En attente", amount: "450€" },
];

export default function ClientDashboard() {
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
            {PROJECTS.map(p => (
              <div key={p.name} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-border-dark/50 hover:bg-white/[0.02] transition-colors items-center">
                <div className="col-span-5 flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", p.iconBg)}>
                    <span className={cn("material-symbols-outlined text-lg", p.iconColor)}>{p.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.client}</p>
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
                  {p.date}
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
              {ORDERS.map(o => (
                <div key={o.ref} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-border-dark flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-slate-400 text-lg">description</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{o.name}</p>
                    <p className="text-xs text-slate-500">{o.ref} · {o.status}</p>
                  </div>
                  <span className="text-sm font-bold text-white flex-shrink-0">{o.amount}</span>
                </div>
              ))}
            </div>
            <Link href="/client/commandes" className="block text-center text-sm text-primary font-semibold mt-4 py-2 border border-border-dark rounded-lg hover:bg-primary/5 transition-colors">
              Voir tout l&apos;historique
            </Link>
          </div>

          {/* Utilisation Stockage */}
          <div className="bg-neutral-dark rounded-xl border border-border-dark p-5 relative overflow-hidden">
            <p className="text-primary font-bold text-sm mb-2">Utilisation Stockage</p>
            <p className="text-4xl font-bold text-white">78.4 <span className="text-lg font-normal text-slate-400">GB</span></p>
            <div className="h-2 bg-border-dark rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "78.4%" }} />
            </div>
            <p className="text-xs text-primary/60 mt-2">Vous utilisez 78% de votre quota de 100GB.</p>
            {/* Decorative cloud */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-600/20 rounded-full" />
            <div className="absolute -bottom-2 -right-1 w-16 h-16 bg-slate-600/10 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
