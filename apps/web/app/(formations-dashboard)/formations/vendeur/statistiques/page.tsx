"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

type Period = "3m" | "6m" | "12m";

type StatsData = {
  monthlyChart: { month: string; amount: number; netAmount: number; sales: number }[];
  topProducts: {
    id: string;
    title: string;
    type: string;
    revenue: number;
    sales: number;
    rating: number;
    reviewsCount: number;
    engagement: number;
  }[];
  ratingDist: { star: number; count: number }[];
  summary: { totalRevenue: number; netRevenue: number; totalSales: number; avgPerSale: number };
};

function formatFCFA(n: number) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n));
}

function SkeletonBar({ count }: { count: number }) {
  return (
    <div className="flex items-end gap-2 md:gap-3 animate-pulse" style={{ height: "160px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-1 bg-gray-100 rounded-t-lg" style={{ height: `${40 + Math.random() * 60}%` }} />
      ))}
    </div>
  );
}

export default function StatistiquesPage() {
  const [period, setPeriod] = useState<Period>("6m");

  const { data, isLoading } = useQuery<{ data: StatsData | null }>({
    queryKey: ["vendeur-stats", period],
    queryFn: () => fetch(`/api/formations/vendeur/stats?period=${period}`).then((r) => r.json()),
    staleTime: 30_000,
  });

  const d = data?.data;
  const chart = d?.monthlyChart ?? [];
  const maxAmount = chart.length > 0 ? Math.max(...chart.map((c) => c.amount), 1) : 1;
  const summary = d?.summary;
  const topProducts = d?.topProducts ?? [];
  const ratingDist = d?.ratingDist ?? [];
  const maxRatingCount = ratingDist.length > 0 ? Math.max(...ratingDist.map((r) => r.count), 1) : 1;

  const PLATFORM_FEE = 0.20;

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c1e]">Statistiques</h1>
          <p className="text-sm text-[#5c647a] mt-1">Analysez vos performances en détail</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#191c1e] bg-white hover:bg-gray-50 transition-colors">
          <span className="material-symbols-outlined text-[18px] text-[#5c647a]">download</span>
          Exporter le rapport
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Revenus bruts",
            value: summary ? `${formatFCFA(summary.totalRevenue)} FCFA` : "—",
            sub: summary ? `≈ ${Math.round(summary.totalRevenue / 655.957).toLocaleString("fr-FR")} €` : "",
            icon: "payments",
            color: "text-[#006e2f]",
            bg: "bg-[#006e2f]/10",
          },
          {
            label: "Revenus nets",
            value: summary ? `${formatFCFA(summary.netRevenue)} FCFA` : "—",
            sub: `Après ${Math.round(PLATFORM_FEE * 100)}% commission`,
            icon: "account_balance_wallet",
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Panier moyen",
            value: summary && summary.avgPerSale > 0 ? `${formatFCFA(summary.avgPerSale)} FCFA` : "—",
            sub: summary && summary.totalSales > 0 ? `${summary.totalSales} ventes` : "Aucune vente",
            icon: "receipt",
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${kpi.bg}`}>
              <span className={`material-symbols-outlined text-[20px] ${kpi.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {kpi.icon}
              </span>
            </div>
            <p className="text-[10px] font-semibold text-[#5c647a] uppercase tracking-wide mb-1">{kpi.label}</p>
            <p className="text-base font-extrabold text-[#191c1e] leading-snug">{isLoading ? "…" : kpi.value}</p>
            <p className="text-[10px] text-[#5c647a] mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="font-bold text-[#191c1e] text-base">Revenus mensuels</h2>
            <p className="text-xs text-[#5c647a] mt-0.5">En FCFA brut</p>
          </div>
          {/* Period selector */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            {(["3m", "6m", "12m"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  period === p ? "bg-white text-[#191c1e] shadow-sm" : "text-[#5c647a] hover:text-[#191c1e]"
                }`}
              >
                {p === "3m" ? "3 mois" : p === "6m" ? "6 mois" : "12 mois"}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <SkeletonBar count={period === "3m" ? 3 : period === "6m" ? 6 : 12} />
        ) : chart.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-[#5c647a] text-sm">
            Aucune donnée pour cette période
          </div>
        ) : (
          <>
            <div className="flex items-end gap-2 md:gap-3" style={{ height: "160px" }}>
              {chart.map((d, i) => {
                const height = (d.amount / maxAmount) * 100;
                const isLast = i === chart.length - 1;
                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5 group" style={{ height: "160px", justifyContent: "flex-end" }}>
                    <div className="w-full flex flex-col items-center justify-end" style={{ height: "130px" }}>
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-1 bg-[#191c1e] text-white text-[9px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap">
                        {formatFCFA(d.amount)} FCFA · {d.sales} vente{d.sales !== 1 ? "s" : ""}
                      </div>
                      <div
                        className="w-full rounded-t-lg transition-all duration-300"
                        style={{
                          height: `${Math.max(height, d.amount > 0 ? 4 : 0)}%`,
                          background: isLast
                            ? "linear-gradient(to top, #006e2f, #22c55e)"
                            : "#dbeafe",
                          minHeight: d.amount > 0 ? "4px" : "0",
                        }}
                      />
                    </div>
                    <span className="text-[9px] font-semibold text-[#5c647a]">{d.month}</span>
                    <span className={`text-[9px] font-bold ${isLast ? "text-[#006e2f]" : "text-[#5c647a]"}`}>
                      {d.sales > 0 ? d.sales : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-[#5c647a] text-center mt-2">Barres bleues = périodes passées · Barre verte = plus récent · Chiffres = nb de ventes</p>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-[#191c1e] text-base mb-4">Top Produits</h2>
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-2 bg-gray-100 rounded w-1/2" />
                    <div className="h-1.5 bg-gray-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : topProducts.length === 0 ? (
            <div className="py-8 text-center">
              <span className="material-symbols-outlined text-[32px] text-gray-300 block mb-2">storefront</span>
              <p className="text-sm text-[#5c647a]">Aucun produit avec des ventes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, idx) => (
                <div key={product.id} className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0"
                    style={{
                      background: idx === 0 ? "#f59e0b" : idx === 1 ? "#9ca3af" : idx === 2 ? "#cd7c2f" : "#e5e7eb",
                      color: idx < 3 ? "white" : "#6b7280",
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#191c1e] line-clamp-1">{product.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[10px] text-[#5c647a]">{product.type}</span>
                      <span className="text-[10px] font-semibold text-[#5c647a]">·</span>
                      <span className="text-[10px] font-semibold text-[#191c1e]">{product.sales} ventes</span>
                      {product.rating > 0 && (
                        <>
                          <span className="text-[10px] text-[#5c647a]">·</span>
                          <span className="text-[10px] text-amber-600 font-semibold">★ {product.rating.toFixed(1)}</span>
                        </>
                      )}
                    </div>
                    {product.engagement > 0 && (
                      <div className="mt-1.5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] text-[#5c647a]">Complétion</span>
                          <span className="text-[9px] font-bold text-[#191c1e]">{product.engagement}%</span>
                        </div>
                        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${product.engagement}%`, background: "linear-gradient(to right, #006e2f, #22c55e)" }}
                          />
                        </div>
                      </div>
                    )}
                    <p className="text-[10px] font-semibold text-[#006e2f] mt-1">
                      {formatFCFA(product.revenue)} FCFA{" "}
                      <span className="text-[#5c647a] font-normal">≈ {Math.round(product.revenue / 655.957)} €</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rating distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-[#191c1e] text-base mb-4">Distribution des avis</h2>
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-3 bg-gray-100 rounded w-6 flex-shrink-0" />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full" />
                  <div className="h-3 bg-gray-100 rounded w-6" />
                </div>
              ))}
            </div>
          ) : ratingDist.every((r) => r.count === 0) ? (
            <div className="py-8 text-center">
              <span className="material-symbols-outlined text-[32px] text-gray-300 block mb-2">star_border</span>
              <p className="text-sm text-[#5c647a]">Aucun avis reçu pour l&apos;instant</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {ratingDist.map((r) => (
                  <div key={r.star} className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5 w-10 flex-shrink-0">
                      <span className="text-xs font-bold text-[#191c1e]">{r.star}</span>
                      <span className="material-symbols-outlined text-[12px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: maxRatingCount > 0 ? `${(r.count / maxRatingCount) * 100}%` : "0%",
                          background: r.star >= 4 ? "linear-gradient(to right, #006e2f, #22c55e)" : r.star === 3 ? "#f59e0b" : "#ef4444",
                        }}
                      />
                    </div>
                    <span className="text-xs text-[#5c647a] w-5 text-right">{r.count}</span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-extrabold text-[#191c1e]">
                      {topProducts.length > 0
                        ? (topProducts.reduce((s, p) => s + p.rating * p.reviewsCount, 0) / Math.max(topProducts.reduce((s, p) => s + p.reviewsCount, 0), 1)).toFixed(2)
                        : "—"}
                    </p>
                    <p className="text-[10px] text-[#5c647a]">Note moyenne</p>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => {
                      const avg = topProducts.length > 0
                        ? topProducts.reduce((sum, p) => sum + p.rating * p.reviewsCount, 0) / Math.max(topProducts.reduce((sum, p) => sum + p.reviewsCount, 0), 1)
                        : 0;
                      return (
                        <span key={s} className={`material-symbols-outlined text-[20px] ${s <= Math.round(avg) ? "text-amber-400" : "text-gray-200"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                      );
                    })}
                  </div>
                </div>
                <p className="text-[10px] text-[#5c647a] mt-1">
                  {ratingDist.reduce((s, r) => s + r.count, 0)} avis au total
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
