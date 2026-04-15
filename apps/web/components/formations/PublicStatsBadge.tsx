"use client";

import { useQuery } from "@tanstack/react-query";

type Stats = {
  totalUsers: number;
  totalInstructors: number;
  totalLearners: number;
  totalFormations: number;
  totalProducts: number;
  totalProductsCount: number;
  totalSales: number;
  totalCountries: number;
};

export function CreatorsJoinBadge() {
  const { data } = useQuery<{ data: Stats }>({
    queryKey: ["public-stats"],
    queryFn: () => fetch("/api/formations/public/stats").then((r) => r.json()),
    staleTime: 120_000,
  });

  const n = data?.data?.totalInstructors ?? 0;

  if (n === 0) {
    return (
      <p className="text-sm font-medium text-[#5c647a]">
        <span className="font-bold text-[#191c1e]">Soyez parmi les premiers</span> créateurs à lancer
      </p>
    );
  }

  return (
    <p className="text-sm font-medium text-[#5c647a]">
      Rejoint par{" "}
      <span className="font-bold text-[#191c1e]">
        {n.toLocaleString("fr-FR")} créateur{n > 1 ? "s" : ""}
      </span>
    </p>
  );
}

export function HeroBadge() {
  const { data } = useQuery<{ data: Stats }>({
    queryKey: ["public-stats"],
    queryFn: () => fetch("/api/formations/public/stats").then((r) => r.json()),
    staleTime: 120_000,
  });

  const products = data?.data?.totalProductsCount ?? 0;
  const sales = data?.data?.totalSales ?? 0;

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f2f4f6] rounded-full border border-[#bccbb9]/20">
      <span className="material-symbols-outlined text-[#006e2f] scale-75" style={{ fontVariationSettings: "'FILL' 1" }}>
        stars
      </span>
      <span className="text-xs font-bold tracking-wider text-[#3d4a3d] uppercase">
        {products === 0 ? "Nouvelle plateforme · En croissance" : sales > 0 ? `${sales.toLocaleString("fr-FR")} ventes réalisées` : `${products} produit${products > 1 ? "s" : ""} disponible${products > 1 ? "s" : ""}`}
      </span>
    </div>
  );
}

export function PublicStatsStrip() {
  const { data, isLoading } = useQuery<{ data: Stats }>({
    queryKey: ["public-stats"],
    queryFn: () => fetch("/api/formations/public/stats").then((r) => r.json()),
    staleTime: 120_000,
  });

  const s = data?.data;

  const items = [
    { label: "Créateurs", value: s?.totalInstructors ?? 0, icon: "groups" },
    { label: "Apprenants", value: s?.totalLearners ?? 0, icon: "school" },
    { label: "Produits", value: s?.totalProductsCount ?? 0, icon: "inventory_2" },
    { label: "Pays", value: s?.totalCountries ?? 0, icon: "public" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {items.map((item) => (
        <div key={item.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <span className="material-symbols-outlined text-[20px] text-[#006e2f] mb-1 inline-block" style={{ fontVariationSettings: "'FILL' 1" }}>
            {item.icon}
          </span>
          <p className="text-2xl font-extrabold text-[#191c1e]">
            {isLoading ? "…" : item.value.toLocaleString("fr-FR")}
          </p>
          <p className="text-[11px] text-[#5c647a]">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
