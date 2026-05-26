"use client";
import { useToastStore } from "@/store/toast";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

type Item = {
  id: string;
  kind: "formation" | "product";
  slug: string;
  title: string;
  price: number;
  originalPrice: number | null;
  thumbnail: string | null;
  rating: number;
  reviewsCount: number;
  salesCount: number;
  category: string | null;
  type: string;
  seller: string;
  sellerAvatar: string | null;
  shortDesc?: string | null;
  createdAt: string;
};

type ExplorerData = {
  formations: Item[];
  products: Item[];
  categories: string[];
  stats: { totalFormations: number; totalProducts: number; total: number };
};

function formatFCFA(n: number) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";
}

function toEur(fcfa: number) {
  return Math.round(fcfa / 655.957);
}

const GRADIENTS = [
  "from-fh-400 to-fh-600",
  "from-blue-400 to-sky-600",
  "from-pink-400 to-rose-500",
  "from-amber-400 to-orange-500",
  "from-teal-400 to-emerald-600",
  "from-indigo-400 to-indigo-600",
  "from-green-400 to-emerald-600",
  "from-red-400 to-orange-500",
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className="material-symbols-outlined text-[14px] text-yellow-400"
          style={{ fontVariationSettings: s <= Math.floor(rating) ? "'FILL' 1" : "'FILL' 0" }}
        >
          star
        </span>
      ))}
    </div>
  );
}

function ProductCard({ item, idx }: { item: Item; idx: number }) {
  const gradient = GRADIENTS[idx % GRADIENTS.length];
  const href = item.kind === "formation" ? `/formations/formation/${item.slug}` : `/formations/produit/${item.slug}`;
  const discountPct = item.originalPrice && item.originalPrice > item.price
    ? Math.round((1 - item.price / item.originalPrice) * 100)
    : null;
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleBuy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (added || adding) return;
    setAdding(true);
    try {
      const body = item.kind === "formation"
        ? { formationIds: [item.id] }
        : { productIds: [item.id] };
      const res = await fetch("/api/formations/payment/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.data?.checkout_url) {
        // Redirect to Moneroo checkout (or mock return page in dev)
        window.location.href = json.data.checkout_url;
      } else if (json.requireAuth) {
        const returnTo = encodeURIComponent(window.location.pathname);
        window.location.href = `/formations/inscription?role=apprenant&returnTo=${returnTo}`;
      } else {
        useToastStore.getState().addToast("error", json.error ?? "Erreur lors de l'initialisation du paiement");
        setAdding(false);
      }
    } catch (err) {
      console.error(err);
      setAdding(false);
    }
  }

  return (
    <Link
      href={href}
      className="group block bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-fh-600/20 transition-all duration-200 overflow-hidden flex flex-col h-full"
    >
      {/* HERO IMAGE — aspect 4/3 plus aéré */}
      <div className={`relative aspect-[4/3] bg-gradient-to-br ${gradient} overflow-hidden`}>
        {item.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className="material-symbols-outlined text-white text-[72px] opacity-60"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {item.kind === "formation" ? "school" : "book"}
            </span>
          </div>
        )}

        {/* Top-left: type badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur ${
            item.kind === "formation" ? "bg-white/95 text-fh-600" : "bg-white/95 text-violet-600"
          }`}>
            <span className="material-symbols-outlined text-[12px]">
              {item.kind === "formation" ? "play_circle" : "download"}
            </span>
            {item.type}
          </span>
        </div>

        {/* Top-right: discount badge */}
        {discountPct && (
          <div className="absolute top-3 right-3">
            <span className="inline-block bg-red-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full tracking-wide shadow-sm">
              -{discountPct}%
            </span>
          </div>
        )}

        {/* Bottom-left: bestseller pill */}
        {item.salesCount >= 50 && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-950 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              Bestseller
            </span>
          </div>
        )}
      </div>

      {/* CARD BODY */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category label */}
        {item.category && (
          <p className="text-[10px] font-bold text-fh-600 uppercase tracking-wider mb-1.5">
            {item.category}
          </p>
        )}

        {/* Title */}
        <h3 className="font-extrabold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-fh-600 transition-colors min-h-[2.5rem]">
          {item.title}
        </h3>

        {/* Author row */}
        <div className="flex items-center gap-2 mb-2.5">
          {item.sellerAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.sellerAvatar} alt="" className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-fh-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {item.seller.charAt(0).toUpperCase()}
            </div>
          )}
          <p className="text-xs text-gray-600 truncate">
            par <span className="font-semibold text-gray-900">{item.seller}</span>
          </p>
        </div>

        {/* Rating + sales row */}
        <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="font-semibold text-gray-900">{item.rating > 0 ? item.rating.toFixed(1) : "Nouveau"}</span>
            {item.reviewsCount > 0 && <span className="text-gray-500">({item.reviewsCount})</span>}
          </div>
          <span className="text-zinc-300">·</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">shopping_bag</span>
            <span className="font-semibold text-gray-900">{item.salesCount}</span>
            {item.kind === "formation" ? "élève" : "vente"}{item.salesCount !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Price block — pushed to bottom */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-baseline gap-2 flex-wrap mb-2">
            {item.price === 0 ? (
              <span className="text-xl md:text-2xl font-extrabold text-fh-600">Gratuit</span>
            ) : (
              <>
                <span className={`text-xl md:text-2xl font-extrabold ${
                  item.originalPrice && item.originalPrice > item.price ? "text-red-600" : "text-gray-900"
                }`}>
                  {formatFCFA(item.price)}
                </span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span className="text-xs text-zinc-400 line-through font-medium">
                    {formatFCFA(item.originalPrice)}
                  </span>
                )}
              </>
            )}
          </div>
          {item.price > 0 && (
            <p className="text-[10px] text-gray-500 -mt-1 mb-3">≈ {toEur(item.price)} EUR</p>
          )}

          {/* Full-width CTA button */}
          <button
            onClick={handleBuy}
            disabled={adding}
            className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 ${
              added
                ? "bg-fh-500 text-white"
                : "bg-gray-900 text-white hover:bg-fh-600"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {added ? "check_circle" : adding ? "progress_activity" : item.price === 0 ? "download" : "shopping_bag"}
            </span>
            {added ? "Achat confirmé" : adding ? "Patientez…" : item.price === 0 ? "Télécharger" : "Acheter maintenant"}
          </button>
        </div>
      </div>
    </Link>
  );
}

function GiftModal({ item, onClose }: { item: Item | null; onClose: () => void }) {
  const [form, setForm] = useState({ recipientEmail: "", recipientName: "", message: "" });
  const [success, setSuccess] = useState<string | null>(null);

  const giftMutation = useMutation({
    mutationFn: (body: typeof form) =>
      fetch("/api/formations/gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: item?.kind, itemId: item?.id, ...body }),
      }).then((r) => r.json()),
    onSuccess: (res) => {
      if (res.error) { useToastStore.getState().addToast("error", res.error); return; }
      setSuccess(res.data?.recipient?.email ?? null);
    },
  });

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-fh-600/10 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px] text-fh-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                card_giftcard
              </span>
            </div>
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-2">Cadeau envoyé !</h2>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold text-gray-900">{success}</span> recevra un email avec les instructions pour accéder à « {item.title} ».
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg text-white font-bold bg-fh-600 hover:bg-fh-700"
            >
              Fermer
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-pink-500" style={{ fontVariationSettings: "'FILL' 1" }}>card_giftcard</span>
                  Offrir ce {item.kind === "formation" ? "cours" : "produit"}
                </h2>
                <p className="text-xs text-gray-600 mt-1 line-clamp-1">« {item.title} »</p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
                <span className="material-symbols-outlined text-[20px] text-gray-600">close</span>
              </button>
            </div>

            <div className="bg-pink-50 border border-pink-100 rounded-lg p-3 mb-4">
              <p className="text-xs text-pink-800">
                Vous allez payer <span className="font-bold">{formatFCFA(item.price)}</span> et le destinataire recevra un accès immédiat à ce contenu.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email du destinataire *</label>
                <input
                  type="email"
                  value={form.recipientEmail}
                  onChange={(e) => setForm((f) => ({ ...f, recipientEmail: e.target.value }))}
                  placeholder="ami@exemple.com"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-fh-600/40 focus:ring-2 focus:ring-fh-600/10"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Prénom du destinataire</label>
                <input
                  type="text"
                  value={form.recipientName}
                  onChange={(e) => setForm((f) => ({ ...f, recipientName: e.target.value }))}
                  placeholder="Marie"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-fh-600/40 focus:ring-2 focus:ring-fh-600/10"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Message personnel (optionnel)</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Joyeux anniversaire ! J'ai pensé que ça te plairait."
                  rows={3}
                  maxLength={200}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-fh-600/40 resize-none"
                />
                <p className="text-[10px] text-gray-500 mt-1 text-right">{form.message.length}/200</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Annuler
              </button>
              <button
                onClick={() => giftMutation.mutate(form)}
                disabled={!form.recipientEmail || giftMutation.isPending}
                className="flex-1 py-2.5 rounded-lg text-white text-sm font-bold disabled:opacity-50 bg-fh-600 hover:bg-fh-700"
              >
                {giftMutation.isPending ? "Envoi…" : `Offrir ${formatFCFA(item.price)}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ExplorerPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "formations" | "products">("all");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [sort, setSort] = useState<"relevance" | "price-asc" | "price-desc" | "rating" | "recent">("relevance");
  const [giftItem, setGiftItem] = useState<Item | null>(null);

  const { data: response, isLoading } = useQuery<{ data: ExplorerData }>({
    queryKey: ["public-explorer", search, activeCategory, minRating, maxPrice, sort],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (activeCategory) params.set("category", activeCategory);
      if (minRating > 0) params.set("minRating", String(minRating));
      if (maxPrice < 1000000) params.set("maxPrice", String(maxPrice));
      if (sort !== "relevance") params.set("sort", sort);
      return fetch(`/api/formations/public/explorer?${params.toString()}`).then((r) => r.json());
    },
    staleTime: 30_000,
  });

  const data = response?.data;
  const formations = data?.formations ?? [];
  const products = data?.products ?? [];
  const categories = data?.categories ?? [];
  const stats = data?.stats;

  const displayedItems = useMemo(() => {
    if (activeTab === "formations") return formations;
    if (activeTab === "products") return products;
    // "all" — interleave formations and products
    return [...formations, ...products].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [activeTab, formations, products]);

  const resetFilters = () => {
    setSearch("");
    setActiveCategory(null);
    setMinRating(0);
    setMaxPrice(1000000);
    setSort("relevance");
  };

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* Hero */}
      <section className="bg-white border-b border-gray-200 py-10 md:py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-fh-600 mb-3">
            Marketplace Novakou
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-3 leading-tight">
            Explorez nos formations<br className="hidden md:block" /> & produits digitaux
          </h1>
          <p className="text-gray-600 text-sm md:text-base mb-6">
            {isLoading ? "Chargement…" : stats && stats.total > 0
              ? `${stats.total} produit${stats.total > 1 ? "s" : ""} disponible${stats.total > 1 ? "s" : ""} créé${stats.total > 1 ? "s" : ""} par nos experts.`
              : "Les premiers produits arrivent bientôt."
            }
          </p>

          <div className="relative max-w-2xl mx-auto mb-6">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-[20px]">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une formation, un e-book, un template..."
              className="w-full pl-11 pr-5 py-3 rounded-lg border border-gray-200 bg-white shadow-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-fh-600 focus:ring-2 focus:ring-fh-600/20 text-sm"
            />
          </div>

          {/* Category pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    activeCategory === cat
                      ? "bg-fh-600 text-white border-fh-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-fh-600 hover:text-fh-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Toolbar — clean modern design with grouped controls */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar md:flex-wrap md:overflow-visible">

          {/* GROUPE 1 : Type tabs (icônes + label + count) */}
          <div className="inline-flex items-center bg-gray-100 p-1 rounded-lg">
            {([
              { value: "all", label: "Tout", count: stats?.total ?? 0, icon: "apps" },
              { value: "formations", label: "Formations", count: stats?.totalFormations ?? 0, icon: "school" },
              { value: "products", label: "Produits", count: stats?.totalProducts ?? 0, icon: "shopping_bag" },
            ] as const).map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  activeTab === tab.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className={`material-symbols-outlined text-[15px] ${activeTab === tab.value ? "text-fh-600" : ""}`}>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[22px] text-center ${
                  activeTab === tab.value ? "bg-fh-600 text-white" : "bg-gray-200 text-gray-600"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* GROUPE 2 : Sort + Rating + Price (regroupés visuellement) */}
          <div className="inline-flex items-center gap-2 flex-wrap">
            {/* Sort dropdown — pill style */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="appearance-none pl-9 pr-8 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-900 focus:outline-none focus:border-fh-600 focus:ring-2 focus:ring-fh-600/20 cursor-pointer transition-colors hover:border-gray-300"
              >
                <option value="relevance">Pertinence</option>
                <option value="recent">Plus récents</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="rating">Mieux notés</option>
              </select>
              <span className="material-symbols-outlined text-[16px] text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">sort</span>
              <span className="material-symbols-outlined text-[16px] text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
            </div>

            {/* Rating filter — pills with active state */}
            <div className="inline-flex items-center bg-gray-100 p-1 rounded-lg">
              {[
                { value: 0, label: "Toutes notes", icon: null },
                { value: 4, label: "4.0", icon: true },
                { value: 4.5, label: "4.5", icon: true },
              ].map((r) => (
                <button
                  key={r.value}
                  onClick={() => setMinRating(r.value)}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-bold transition-colors ${
                    minRating === r.value
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {r.icon && (
                    <span className="material-symbols-outlined text-[13px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  )}
                  {r.label}
                  {r.icon && <span className="text-[10px]">+</span>}
                </button>
              ))}
            </div>

            {/* Price slider — embedded compact */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors">
              <span className="material-symbols-outlined text-[16px] text-gray-500">payments</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Prix max</span>
              <input
                type="range"
                min="5000"
                max="1000000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-20 accent-fh-600 cursor-pointer"
              />
              <span className="text-xs font-extrabold text-fh-600 whitespace-nowrap min-w-[36px] text-right">
                {maxPrice >= 1000000 ? "∞" : `${(maxPrice / 1000).toFixed(0)}k`}
              </span>
            </div>
          </div>

          <div className="flex-1" />

          {/* Result count + Reset */}
          <div className="inline-flex items-center gap-3">
            {(activeCategory || minRating > 0 || maxPrice < 1000000 || sort !== "relevance" || search) && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-[11px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                Réinitialiser
              </button>
            )}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-fh-600/5">
              <span className="material-symbols-outlined text-[14px] text-fh-600">filter_alt</span>
              <span className="text-xs text-gray-600">
                <span className="font-extrabold text-gray-900">{displayedItems.length}</span> résultat{displayedItems.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width grid — sidebar removed */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 pb-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                  <div className="h-5 bg-gray-100 rounded w-1/3 animate-pulse mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm py-20 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px] text-gray-300">search_off</span>
            </div>
            <p className="font-semibold text-gray-900 mb-1">
              {(stats?.total ?? 0) === 0 ? "Bientôt disponible" : "Aucun résultat"}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {(stats?.total ?? 0) === 0
                ? "Les premiers produits arrivent bientôt. Soyez le premier créateur à publier !"
                : "Essayez de modifier vos filtres de recherche."}
            </p>
            {(stats?.total ?? 0) === 0 ? (
              <Link
                href="/formations/vendeur/produits/creer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-bold bg-fh-600 hover:bg-fh-700"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Publier un produit
              </Link>
            ) : (
              <button onClick={resetFilters} className="text-sm font-semibold text-fh-600 hover:underline">
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedItems.map((item, idx) => (
              <ProductCard key={`${item.kind}-${item.id}`} item={item} idx={idx} />
            ))}
          </div>
        )}
      </div>

      <GiftModal item={giftItem} onClose={() => setGiftItem(null)} />
    </div>
  );
}
