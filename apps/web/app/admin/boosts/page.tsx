"use client";

import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/store/admin";
import { useCurrencyStore } from "@/store/currency";

interface AdminBoost {
  id: string;
  serviceId: string;
  serviceTitle: string;
  freelanceName: string;
  tier: string;
  status: string;
  totalCost: number;
  startedAt: string | null;
  endedAt: string | null;
  viewsGenerated: number;
  clicksGenerated: number;
  ordersGenerated: number;
  isActive: boolean;
}

interface BoostStats {
  totalBoosts: number;
  activeBoosts: number;
  totalRevenue: number;
  totalViews: number;
  totalClicks: number;
  totalOrders: number;
}

export default function AdminBoostsPage() {
  const { format } = useCurrencyStore();
  const [boosts, setBoosts] = useState<AdminBoost[]>([]);
  const [stats, setStats] = useState<BoostStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all");

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/boosts")
      .then((r) => r.json())
      .then((data) => {
        setBoosts(data.boosts || []);
        setStats(data.stats || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (filter === "active") return boosts.filter((b) => b.isActive);
    if (filter === "expired") return boosts.filter((b) => !b.isActive);
    return boosts;
  }, [boosts, filter]);

  const safeStats: BoostStats = {
    totalBoosts: stats?.totalBoosts ?? (stats as any)?.total ?? 0,
    activeBoosts: stats?.activeBoosts ?? (stats as any)?.active ?? 0,
    totalRevenue: stats?.totalRevenue ?? 0,
    totalViews: stats?.totalViews ?? 0,
    totalClicks: stats?.totalClicks ?? 0,
    totalOrders: stats?.totalOrders ?? 0,
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-black">Gestion des Boosts</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">rocket_launch</span>
          Gestion des Boosts
        </h1>
        <span className="text-sm text-slate-500">{boosts.length} boost(s) total</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Total Boosts", value: (safeStats.totalBoosts ?? 0).toLocaleString(), icon: "rocket_launch", color: "text-primary" },
          { label: "Actifs", value: (safeStats.activeBoosts ?? 0).toLocaleString(), icon: "play_circle", color: "text-emerald-400" },
          { label: "Revenus", value: format(safeStats.totalRevenue ?? 0), icon: "payments", color: "text-amber-400" },
          { label: "Vues generees", value: (safeStats.totalViews ?? 0).toLocaleString(), icon: "visibility", color: "text-blue-400" },
          { label: "Clics generes", value: (safeStats.totalClicks ?? 0).toLocaleString(), icon: "ads_click", color: "text-purple-400" },
          { label: "Commandes", value: (safeStats.totalOrders ?? 0).toLocaleString(), icon: "shopping_cart", color: "text-pink-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("material-symbols-outlined text-lg", stat.color)}>{stat.icon}</span>
              <span className="text-xs text-slate-500">{stat.label}</span>
            </div>
            <p className="text-xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(["all", "active", "expired"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
              filter === tab
                ? "bg-primary text-white"
                : "bg-white/5 text-slate-400 hover:bg-white/10"
            )}
          >
            {tab === "all" ? "Tous" : tab === "active" ? "Actifs" : "Expires"}
            <span className="ml-1.5 text-xs opacity-70">
              ({tab === "all" ? boosts.length : tab === "active" ? boosts.filter((b) => b.isActive).length : boosts.filter((b) => !b.isActive).length})
            </span>
          </button>
        ))}
      </div>

      {/* Boosts Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <span className="material-symbols-outlined text-5xl mb-4 block">rocket_launch</span>
          <p className="text-lg font-semibold">Aucun boost {filter !== "all" ? (filter === "active" ? "actif" : "expire") : ""}</p>
          <p className="text-sm mt-1">Les boosts de services apparaitront ici quand les freelances en activeront.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-white/10">
                <th className="pb-3 font-semibold">Service</th>
                <th className="pb-3 font-semibold">Freelance</th>
                <th className="pb-3 font-semibold">Tier</th>
                <th className="pb-3 font-semibold">Cout</th>
                <th className="pb-3 font-semibold">Debut</th>
                <th className="pb-3 font-semibold">Fin</th>
                <th className="pb-3 font-semibold">Vues</th>
                <th className="pb-3 font-semibold">Clics</th>
                <th className="pb-3 font-semibold">Commandes</th>
                <th className="pb-3 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 font-semibold max-w-[200px] truncate">{b.serviceTitle || "—"}</td>
                  <td className="py-3 text-slate-400">{b.freelanceName || "Inconnu"}</td>
                  <td className="py-3">
                    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full",
                      b.tier === "ultime" || b.tier === "ULTIMATE" ? "text-amber-400 bg-amber-500/10" :
                      b.tier === "premium" || b.tier === "PREMIUM" ? "text-purple-400 bg-purple-500/10" :
                      "text-blue-400 bg-blue-500/10"
                    )}>
                      {b.tier}
                    </span>
                  </td>
                  <td className="py-3 font-semibold">{format(b.totalCost ?? 0)}</td>
                  <td className="py-3 text-slate-400">{b.startedAt ? new Date(b.startedAt).toLocaleDateString("fr-FR") : "—"}</td>
                  <td className="py-3 text-slate-400">{b.endedAt ? new Date(b.endedAt).toLocaleDateString("fr-FR") : "—"}</td>
                  <td className="py-3">{(b.viewsGenerated ?? 0).toLocaleString()}</td>
                  <td className="py-3">{(b.clicksGenerated ?? 0).toLocaleString()}</td>
                  <td className="py-3">{(b.ordersGenerated ?? 0).toLocaleString()}</td>
                  <td className="py-3">
                    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full",
                      b.isActive ? "text-emerald-400 bg-emerald-500/10" : "text-slate-400 bg-slate-500/10"
                    )}>
                      {b.isActive ? "Actif" : "Expire"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
