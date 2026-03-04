"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// ============================================================
// Demo Data
// ============================================================

interface Activity {
  id: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  value: string;
}

const CHART_DATA = [
  { day: "LUN", impressions: 60, clicks: 20 },
  { day: "MAR", impressions: 75, clicks: 25 },
  { day: "MER", impressions: 90, clicks: 35 },
  { day: "JEU", impressions: 55, clicks: 15 },
  { day: "VEN", impressions: 80, clicks: 30 },
  { day: "SAM", impressions: 40, clicks: 10 },
  { day: "DIM", impressions: 30, clicks: 5 },
];

const ACTIVITIES: Activity[] = [
  {
    id: "1",
    icon: "trending_up",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
    title: "Nouveau record d'impressions",
    subtitle: "Il y a 2 heures · Design de Logo",
    value: "+240",
  },
  {
    id: "2",
    icon: "payment",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: "Recharge de budget reussie",
    subtitle: "Hier a 15:30 · Par Orange Money",
    value: "15 000 FCFA",
  },
];

const SERVICES = [
  { name: "Design de Logo Minimaliste", checked: true },
  { name: "Identite Visuelle Complete", checked: false },
];

// ============================================================
// Page Component
// ============================================================

export default function BoostPage() {
  const [budget, setBudget] = useState("2500");
  const [duration, setDuration] = useState("7 jours");
  const [selectedServices, setSelectedServices] = useState(
    SERVICES.map((s) => s.checked)
  );
  const [campaignActive, setCampaignActive] = useState(true);

  function toggleService(index: number) {
    setSelectedServices((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-1">Campagnes de Boost</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Boostez la visibilite de vos services et atteignez plus de clients potentiels.
          </p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all">
          <span className="material-symbols-outlined">add_circle</span>
          Nouvelle Campagne
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">settings</span>
              Configuration
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Budget quotidien (FCFA)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    CFA
                  </span>
                  <input
                    className="w-full bg-primary/10 border-none rounded-lg py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-2">
                  Estimation: ~1,500 a 3,000 impressions par jour.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Duree de la campagne
                </label>
                <select
                  className="w-full bg-primary/10 border-none rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option>7 jours (Recommande)</option>
                  <option>15 jours</option>
                  <option>30 jours</option>
                  <option>Continu (Jusqu&apos;a epuisement)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Services a promouvoir
                </label>
                <div className="space-y-3">
                  {SERVICES.map((service, i) => (
                    <label
                      key={service.name}
                      className={cn(
                        "flex items-center p-3 rounded-xl border cursor-pointer transition-colors",
                        selectedServices[i]
                          ? "border-primary/20 bg-primary/5"
                          : "border-primary/10 hover:bg-primary/10"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices[i]}
                        onChange={() => toggleService(i)}
                        className="rounded text-primary focus:ring-primary bg-transparent border-primary/40 mr-3"
                      />
                      <span className="text-xs font-bold">{service.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full py-3 bg-primary/20 hover:bg-primary/30 rounded-xl font-bold transition-colors">
                Mettre a jour la campagne
              </button>
            </div>
          </div>

          {/* Campaign Status */}
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold">Statut de la campagne</span>
              <span
                className={cn(
                  "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full uppercase",
                  campaignActive
                    ? "text-primary bg-primary/20"
                    : "text-slate-400 bg-slate-700"
                )}
              >
                {campaignActive && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                )}
                {campaignActive ? "En cours" : "En pause"}
              </span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-slate-500 mb-1">Depense aujourd&apos;hui</p>
                <p className="text-xl font-black">1 840 FCFA</p>
              </div>
              <button
                onClick={() => setCampaignActive(!campaignActive)}
                className={cn(
                  "text-xs font-bold hover:underline",
                  campaignActive ? "text-red-500" : "text-primary"
                )}
              >
                {campaignActive ? "Mettre en pause" : "Reprendre"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Stats + Chart + Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "visibility", label: "Impressions", value: "12,480", change: "+12%" },
              { icon: "ads_click", label: "Clics", value: "842", change: "+5%" },
              { icon: "shopping_cart_checkout", label: "Conversions", value: "34", change: "+18%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-primary/5 p-6 rounded-2xl border border-primary/10"
              >
                <div className="flex items-center gap-3 text-slate-500 mb-2">
                  <span className="material-symbols-outlined text-sm">{stat.icon}</span>
                  <span className="text-xs font-bold uppercase">{stat.label}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black">{stat.value}</span>
                  <span className="text-xs font-bold text-primary flex items-center">
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold">Performance de la semaine</h3>
                <p className="text-xs text-slate-500">
                  Suivi des clics et impressions par jour
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Impressions
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-yellow-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Clics
                  </span>
                </div>
              </div>
            </div>

            <div className="relative h-64 w-full flex items-end justify-between gap-4 pt-4">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full border-t border-primary/5" />
                ))}
              </div>

              {CHART_DATA.map((bar) => (
                <div
                  key={bar.day}
                  className="flex-1 flex flex-col items-center gap-2 z-10"
                >
                  <div className="w-full flex justify-center gap-1 items-end h-full">
                    <div
                      className="w-3 bg-primary/60 rounded-t-sm transition-all duration-300"
                      style={{ height: `${bar.impressions}%` }}
                    />
                    <div
                      className="w-3 bg-yellow-500/60 rounded-t-sm transition-all duration-300"
                      style={{ height: `${bar.clicks}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-primary/5 rounded-2xl border border-primary/10 overflow-hidden">
            <div className="p-4 border-b border-primary/10 flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Activites recentes
              </h3>
              <button className="text-xs text-primary font-bold">Tout voir</button>
            </div>
            <div className="divide-y divide-primary/10">
              {ACTIVITIES.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "size-8 rounded-full flex items-center justify-center",
                        activity.iconBg,
                        activity.iconColor
                      )}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {activity.icon}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{activity.title}</p>
                      <p className="text-[10px] text-slate-500">{activity.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium">{activity.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
