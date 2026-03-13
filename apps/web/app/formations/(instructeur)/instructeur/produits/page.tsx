"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Plus, Eye, Edit, Archive, Copy, ShoppingBag, Star, TrendingUp } from "lucide-react";

interface Product {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  productType: string;
  price: number;
  salesCount: number;
  viewsCount: number;
  rating: number;
  reviewsCount: number;
  maxBuyers: number | null;
  currentBuyers: number;
  status: string;
  createdAt: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  ACTIF: { label: "Actif", color: "bg-green-100 text-green-700" },
  EN_ATTENTE: { label: "En attente", color: "bg-amber-100 text-amber-700" },
  BROUILLON: { label: "Brouillon", color: "bg-slate-100 text-slate-600" },
  ARCHIVE: { label: "Archivé", color: "bg-red-100 text-red-600" },
  REFUSE: { label: "Refusé", color: "bg-red-100 text-red-700" },
};

const TYPE_ICONS: Record<string, string> = {
  EBOOK: "menu_book", PDF: "picture_as_pdf", TEMPLATE: "dashboard_customize",
  LICENCE: "vpn_key", AUDIO: "headphones", VIDEO: "videocam", AUTRE: "inventory_2",
};

export default function InstructeurProduitsPage() {
  const locale = useLocale();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instructeur/formations?type=products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleArchive(id: string) {
    if (!confirm("Archiver ce produit ?")) return;
    await fetch(`/api/produits/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, status: "ARCHIVE" } : p));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mes produits numériques</h1>
          <p className="text-sm text-slate-500 mt-1">{products.length} produit(s)</p>
        </div>
        <Link
          href="/formations/instructeur/produits/creer"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau produit
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 animate-pulse">
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="material-symbols-outlined text-5xl text-slate-300">inventory_2</span>
          <h3 className="mt-4 text-lg font-semibold text-slate-600">Aucun produit</h3>
          <p className="text-sm text-slate-400 mt-1">Créez votre premier produit numérique</p>
          <Link
            href="/formations/instructeur/produits/creer"
            className="inline-flex items-center gap-2 mt-4 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Créer un produit
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-xs text-slate-500 uppercase">
                <th className="text-left px-4 py-3 font-semibold">Produit</th>
                <th className="text-left px-4 py-3 font-semibold">Type</th>
                <th className="text-right px-4 py-3 font-semibold">Prix</th>
                <th className="text-right px-4 py-3 font-semibold">Ventes</th>
                <th className="text-right px-4 py-3 font-semibold">Revenus</th>
                <th className="text-center px-4 py-3 font-semibold">Statut</th>
                <th className="text-center px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const title = locale === "fr" ? product.titleFr : product.titleEn;
                const status = STATUS_MAP[product.status] || STATUS_MAP.BROUILLON;
                const revenue = product.price * product.salesCount * 0.7;

                return (
                  <tr key={product.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-primary">{TYPE_ICONS[product.productType] || "inventory_2"}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{title}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{product.viewsCount}</span>
                            {product.rating > 0 && <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-400" />{product.rating.toFixed(1)}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{product.productType}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold">{product.price.toFixed(0)}€</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className="flex items-center justify-end gap-1">
                        <ShoppingBag className="w-3 h-3 text-slate-400" />
                        {product.salesCount}
                        {product.maxBuyers && <span className="text-xs text-slate-400">/{product.maxBuyers}</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">{revenue.toFixed(0)}€</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/formations/produits/${product.slug}`}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-primary transition-colors"
                          title="Voir"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {product.status !== "ARCHIVE" && (
                          <button
                            onClick={() => handleArchive(product.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
                            title="Archiver"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
