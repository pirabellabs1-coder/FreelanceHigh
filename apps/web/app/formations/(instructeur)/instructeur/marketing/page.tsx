"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp, TrendingDown, ShoppingCart, DollarSign,
  Eye, MousePointerClick, CreditCard, CheckCircle, XCircle,
  Target, Zap, BarChart3,
} from "lucide-react";

interface FunnelData {
  pageViews: number;
  addToCarts: number;
  checkoutsStarted: number;
  purchasesCompleted: number;
  paymentsFailed: number;
  conversionRate: string;
  prevPurchases: number;
  purchasesTrend: string;
}

interface Stats {
  funnel: FunnelData;
  abandonedCarts: { total: number; recovered: number; recoveryRate: string; recoveredRevenue: number };
  revenue: { total: number; formations: number; products: number };
  flashPromotions: {
    active: Array<{ id: string; discountPct: number; endsAt: string; formation?: { titleFr: string }; digitalProduct?: { titleFr: string } }>;
    scheduled: Array<{ id: string; discountPct: number; startsAt: string; formation?: { titleFr: string }; digitalProduct?: { titleFr: string } }>;
  };
  pixelStatus: Array<{ type: string; isActive: boolean }>;
}

const PERIODS = [
  { value: "7d", label: "7 jours" },
  { value: "30d", label: "30 jours" },
  { value: "90d", label: "3 mois" },
  { value: "6m", label: "6 mois" },
  { value: "1y", label: "1 an" },
];

export default function MarketingDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/instructeur/marketing/stats?period=${period}`)
      .then((r) => r.json())
      .then((data) => setStats(data.funnel ? data : null))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [period]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-16">
        <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-600">Dashboard Marketing</h2>
        <p className="text-sm text-slate-400 mt-2">
          Partagez vos formations sur les réseaux sociaux, configurez vos pixels publicitaires, et créez une promotion flash pour commencer.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          <Link href="/formations/instructeur/marketing/pixels" className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90">
            Configurer les pixels
          </Link>
          <Link href="/formations/instructeur/promotions" className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700">
            Créer une promotion
          </Link>
        </div>
      </div>
    );
  }

  const f = stats.funnel;
  const trend = parseFloat(f.purchasesTrend);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Marketing</h1>
          <p className="text-sm text-slate-500 mt-1">Suivez vos conversions et optimisez vos ventes</p>
        </div>
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                period === p.value ? "bg-white dark:bg-slate-700 shadow-sm" : "hover:bg-white/50 dark:hover:bg-slate-700/50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Funnel Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <FunnelCard icon={<Eye className="w-5 h-5" />} label="Vues" value={f.pageViews} color="text-blue-600 bg-blue-50 dark:bg-blue-900/20" />
        <FunnelCard icon={<ShoppingCart className="w-5 h-5" />} label="Ajouts panier" value={f.addToCarts} color="text-purple-600 bg-purple-50 dark:bg-purple-900/20" rate={f.pageViews > 0 ? ((f.addToCarts / f.pageViews) * 100).toFixed(1) : "0"} />
        <FunnelCard icon={<CreditCard className="w-5 h-5" />} label="Checkouts" value={f.checkoutsStarted} color="text-amber-600 bg-amber-50 dark:bg-amber-900/20" rate={f.addToCarts > 0 ? ((f.checkoutsStarted / f.addToCarts) * 100).toFixed(1) : "0"} />
        <FunnelCard icon={<CheckCircle className="w-5 h-5" />} label="Achats" value={f.purchasesCompleted} color="text-green-600 bg-green-50 dark:bg-green-900/20" rate={f.checkoutsStarted > 0 ? ((f.purchasesCompleted / f.checkoutsStarted) * 100).toFixed(1) : "0"} />
        <FunnelCard icon={<XCircle className="w-5 h-5" />} label="Échoués" value={f.paymentsFailed} color="text-red-600 bg-red-50 dark:bg-red-900/20" />
      </div>

      {/* Trend + Conversion rate */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Taux de conversion global</p>
          <p className="text-3xl font-bold text-primary">{f.conversionRate}%</p>
          <p className="text-xs text-slate-400 mt-1">Vues → Achats</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Tendance achats</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold">{f.purchasesCompleted}</p>
            {trend !== 0 && (
              <span className={`flex items-center gap-0.5 text-sm font-bold ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
                {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(trend)}%
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">vs. période précédente ({f.prevPurchases})</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Revenus</p>
          <p className="text-3xl font-bold text-green-600">{stats.revenue.total.toFixed(0)}€</p>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span>Formations: {stats.revenue.formations.toFixed(0)}€</span>
            <span>Produits: {stats.revenue.products.toFixed(0)}€</span>
          </div>
        </div>
      </div>

      {/* Abandoned Carts + Pixels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Abandoned Carts */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-amber-500" />
            Paniers abandonnés
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.abandonedCarts.total}</p>
              <p className="text-xs text-slate-500">Abandonnés</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.abandonedCarts.recovered}</p>
              <p className="text-xs text-slate-500">Récupérés</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{stats.abandonedCarts.recoveryRate}%</p>
              <p className="text-xs text-slate-500">Taux récup.</p>
            </div>
          </div>
        </div>

        {/* Pixel Status */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-500" />
            Pixels publicitaires
          </h3>
          <div className="space-y-2">
            {["FACEBOOK", "GOOGLE", "TIKTOK"].map((type) => {
              const pixel = stats.pixelStatus.find((p) => p.type === type);
              return (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{type === "FACEBOOK" ? "Facebook Pixel" : type === "GOOGLE" ? "Google Ads" : "TikTok Pixel"}</span>
                  {pixel ? (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pixel.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                      {pixel.isActive ? "Actif" : "Inactif"}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Non configuré</span>
                  )}
                </div>
              );
            })}
          </div>
          <Link href="/formations/instructeur/marketing/pixels" className="block text-center mt-3 text-xs font-semibold text-primary hover:underline">
            Configurer les pixels
          </Link>
        </div>
      </div>

      {/* Flash Promotions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Promotions flash
          </h3>
          <Link href="/formations/instructeur/promotions" className="text-xs font-semibold text-primary hover:underline">
            Gérer les promotions
          </Link>
        </div>

        {stats.flashPromotions.active.length === 0 && stats.flashPromotions.scheduled.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">Aucune promotion active ou programmée</p>
        ) : (
          <div className="space-y-2">
            {stats.flashPromotions.active.map((promo) => (
              <div key={promo.id} className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                <div>
                  <span className="text-xs font-bold text-green-700 dark:text-green-400">ACTIVE</span>
                  <p className="text-sm font-medium">{promo.formation?.titleFr || promo.digitalProduct?.titleFr}</p>
                </div>
                <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">-{promo.discountPct}%</span>
              </div>
            ))}
            {stats.flashPromotions.scheduled.map((promo) => (
              <div key={promo.id} className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <div>
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-400">PROGRAMMÉE</span>
                  <p className="text-sm font-medium">{promo.formation?.titleFr || promo.digitalProduct?.titleFr}</p>
                </div>
                <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">-{promo.discountPct}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ──

function FunnelCard({ icon, label, value, color, rate }: {
  icon: React.ReactNode; label: string; value: number; color: string; rate?: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${color} mb-2`}>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
      {rate && <p className="text-xs text-primary font-semibold mt-0.5">{rate}% conversion</p>}
    </div>
  );
}
