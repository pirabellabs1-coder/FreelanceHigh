"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Download, Key, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface Purchase {
  id: string;
  paidAmount: number;
  licenseKey: string | null;
  downloadCount: number;
  maxDownloads: number;
  createdAt: string;
  product: {
    id: string;
    slug: string;
    titleFr: string;
    titleEn: string;
    productType: string;
    banner: string | null;
    fileMimeType: string | null;
  };
}

const TYPE_ICONS: Record<string, string> = {
  EBOOK: "menu_book", PDF: "picture_as_pdf", TEMPLATE: "dashboard_customize",
  LICENCE: "vpn_key", AUDIO: "headphones", VIDEO: "videocam", AUTRE: "inventory_2",
};

export default function MesProduitsPage() {
  const locale = useLocale();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/apprenant/produits")
      .then((r) => r.json())
      .then((data) => setPurchases(data.purchases || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  function copyLicenseKey(key: string) {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mes produits numériques</h1>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 animate-pulse">
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : purchases.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600">Aucun produit acheté</h3>
          <p className="text-sm text-slate-400 mt-1">Explorez nos produits numériques</p>
          <Link
            href="/formations/produits"
            className="inline-flex items-center gap-2 mt-4 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90"
          >
            Voir les produits
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {purchases.map((purchase) => {
            const product = purchase.product;
            const title = locale === "fr" ? product.titleFr : product.titleEn;
            const remainingDownloads = purchase.maxDownloads - purchase.downloadCount;
            const icon = TYPE_ICONS[product.productType] || "inventory_2";

            return (
              <div
                key={purchase.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                {/* Icon/Banner */}
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {product.banner ? (
                    <img src={product.banner} alt={title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-2xl text-primary">{icon}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/formations/produits/${product.slug}`} className="text-sm font-bold hover:text-primary transition-colors">
                    {title}
                  </Link>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">{icon}</span>
                      {product.productType}
                    </span>
                    <span>Acheté le {new Date(purchase.createdAt).toLocaleDateString("fr")}</span>
                    {purchase.paidAmount > 0 && <span>{purchase.paidAmount.toFixed(2)}€</span>}
                    {purchase.paidAmount === 0 && <span className="text-green-600 font-semibold">Gratuit</span>}
                  </div>

                  {/* License key */}
                  {purchase.licenseKey && (
                    <div className="flex items-center gap-2 mt-2">
                      <Key className="w-4 h-4 text-amber-500" />
                      <code className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                        {purchase.licenseKey}
                      </code>
                      <button
                        onClick={() => copyLicenseKey(purchase.licenseKey!)}
                        className="text-xs text-primary hover:underline"
                      >
                        {copiedKey === purchase.licenseKey ? "Copié !" : "Copier"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Download button */}
                <div className="flex flex-col items-end gap-1">
                  <a
                    href={remainingDownloads > 0 ? `/api/produits/${product.id}/download` : undefined}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                      remainingDownloads > 0
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "bg-slate-200 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    Télécharger
                  </a>
                  <span className="text-xs text-slate-400">
                    {remainingDownloads} / {purchase.maxDownloads} téléchargement(s)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
