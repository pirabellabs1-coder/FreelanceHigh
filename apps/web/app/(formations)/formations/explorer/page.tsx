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
  "from-violet-400 to-purple-600",
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
  const href = `/formations/produit/${item.slug}`;
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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col">
      {/* HERO IMAGE — taille augmentée comme un poster */}
      <Link href={href} className="block relative">
        <div className={`relative aspect-[4/5] bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
          {item.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          ) : (
            <span
              className="material-symbols-outlined text-white text-[80px] opacity-70"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {item.kind === "formation" ? "school" : "book"}
            </span>
          )}

          {/* Type badge — top left */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur ${
              item.kind === "formation" ? "bg-white/95 text-[#006e2f]" : "bg-white/95 text-violet-600"
            }`}>
              <span className="material-symbols-outlined text-[12px]">
                {item.kind === "formation" ? "play_circle" : "download"}
              </span>
              {item.type}
            </span>
          </div>

          {/* Discount badge — top right */}
          {discountPct && (
            <div className="absolute top-3 right-3">
              <span className="inline-block bg-zinc-900 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full tracking-wide shadow-md">
                -{discountPct}%
              </span>
            </div>
          )}

          {/* Bestseller / Popular badge — bottom left if salesCount > 50 */}
          {item.salesCount >= 50 && (
            <div className="absolute bottom-3 left-3">
              <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-950 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md">
                <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                Bestseller
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* CARD BODY — compact */}
      <div className="p-4 flex-1 flex flex-col">
        <Link href={href}>
          <h3 className="font-bold text-[#191c1e] text-sm line-clamp-2 mb-2 group-hover:text-[#006e2f] transition-colors min-h-[2.5rem]">
            {item.title}
          </h3>
        </Link>

        {/* Seller compact */}
        <div className="flex items-center gap-1.5 mb-2">
          {item.sellerAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.sellerAvatar} alt="" className="w-4 h-4 rounded-full object-cover" />
          ) : (
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#006e2f] to-emerald-500 flex items-center justify-center text-white text-[8px] font-bold">
              {item.seller.charAt(0).toUpperCase()}
            </div>
          )}
          <p className="text-[10px] text-[#5c647a] truncate">{item.seller}</p>
        </div>

        {/* Rating + sales — single line, compact */}
        <div className="flex items-center gap-2 mb-3 text-[11px] text-[#5c647a]">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="font-semibold">{item.rating > 0 ? item.rating.toFixed(1) : "—"}</span>
            {item.reviewsCount > 0 && <span>({item.reviewsCount} avis)</span>}
            {item.reviewsCount === 0 && <span>(0 avis)</span>}
          </div>
          {item.salesCount > 0 && (
            <>
              <span className="text-zinc-300">·</span>
              <span>{item.salesCount} vente{item.salesCount > 1 ? "s" : ""}</span>
            </>
          )}
        </div>

        {/* Price block — old strikethrough + new prominent */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-xs text-zinc-400 line-through font-medium">
                  {formatFCFA(item.originalPrice)}
                </span>
              )}
              <span className={`text-lg font-extrabold ${
                item.originalPrice && item.originalPrice > item.price ? "text-red-600" : "text-[#191c1e]"
              }`}>
                {formatFCFA(item.price)}
              </span>
            </div>
            <p className="text-[10px] text-[#5c647a] mt-0.5">FCFA · ≈ {toEur(item.price)} €</p>
          </div>
          <button
            onClick={handleBuy}
            disabled={adding}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-[11px] font-bold transition-all flex-shrink-0 disabled:opacity-50 ${
              added
                ? "bg-[#22c55e] text-[#004b1e]"
                : "bg-zinc-900 text-white hover:bg-[#006e2f]"
            }`}
            title="Acheter ce produit maintenant"
          >
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {added ? "check" : adding ? "hourglass_empty" : "shopping_bag"}
            </span>
            {added ? "Acheté !" : adding ? "..." : "Acheter"}
          </button>
        </div>
      </div>
    </div>
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#006e2f]/10 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px] text-[#006e2f]" style={{ fontVariationSettings: "'FILL' 1" }}>
                card_giftcard
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#191c1e] mb-2">Cadeau envoyé !</h2>
            <p className="text-sm text-[#5c647a] mb-4">
              <span className="font-semibold text-[#191c1e]">{success}</span> recevra un email avec les instructions pour accéder à « {item.title} ».
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-white font-bold hover:opacity-90"
              style={{ background: "linear-gradient(to right, #006e2f, #22c55e)" }}
            >
              Fermer
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-[#191c1e] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-pink-500" style={{ fontVariationSettings: "'FILL' 1" }}>card_giftcard</span>
                  Offrir ce {item.kind === "formation" ? "cours" : "produit"}
                </h2>
                <p className="text-xs text-[#5c647a] mt-1 line-clamp-1">« {item.title} »</p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
                <span className="material-symbols-outlined text-[20px] text-[#5c647a]">close</span>
              </button>
            </div>

            <div className="bg-pink-50 border border-pink-100 rounded-xl p-3 mb-4">
              <p className="text-xs text-pink-800">
                Vous allez payer <span className="font-bold">{formatFCFA(item.price)}</span> et le destinataire recevra un accès immédiat à ce contenu.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5c647a] mb-1.5 uppercase tracking-wide">Email du destinataire *</label>
                <input
                  type="email"
                  value={form.recipientEmail}
                  onChange={(e) => setForm((f) => ({ ...f, recipientEmail: e.target.value }))}
                  placeholder="ami@exemple.com"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#006e2f]/40 focus:ring-2 focus:ring-[#006e2f]/10"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5c647a] mb-1.5 uppercase tracking-wide">Prénom du destinataire</label>
                <input
                  type="text"
                  value={form.recipientName}
                  onChange={(e) => setForm((f) => ({ ...f, recipientName: e.target.value }))}
                  placeholder="Marie"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#006e2f]/40 focus:ring-2 focus:ring-[#006e2f]/10"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5c647a] mb-1.5 uppercase tracking-wide">Message personnel (optionnel)</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Joyeux anniversaire ! J'ai pensé que ça te plairait."
                  rows={3}
                  maxLength={200}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#006e2f]/40 resize-none"
                />
                <p className="text-[10px] text-[#5c647a] mt-1 text-right">{form.message.length}/200</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#5c647a] hover:bg-gray-50">
                Annuler
              </button>
              <button
                onClick={() => giftMutation.mutate(form)}
                disabled={!form.recipientEmail || giftMutation.isPending}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-50 hover:opacity-90"
                style={{ background: "linear-gradient(to right, #006e2f, #22c55e)" }}
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
    <div className="min-h-screen bg-[#f7f9fb]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#006e2f] mb-3">
            Marketplace FreelanceHigh
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#191c1e] tracking-tight mb-4 leading-tight">
            Explorez nos formations<br className="hidden md:block" /> & produits digitaux
          </h1>
          <p className="text-[#5c647a] text-base md:text-lg mb-8">
            {isLoading ? "Chargement…" : stats && stats.total > 0
              ? `${stats.total} produit${stats.total > 1 ? "s" : ""} disponible${stats.total > 1 ? "s" : ""} créé${stats.total > 1 ? "s" : ""} par nos experts.`
              : "Les premiers produits arrivent bientôt."
            }
          </p>

          <div className="relative max-w-2xl mx-auto mb-8">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#5c647a] text-[22px]">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une formation, un e-book, un template..."
              className="w-full pl-12 pr-6 py-4 rounded-full border border-gray-200 bg-white shadow-lg text-[#191c1e] placeholder:text-[#5c647a] focus:outline-none focus:ring-2 focus:ring-[#006e2f]/30 text-sm md:text-base"
            />
          </div>

          {/* Category pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-[#006e2f] text-white border-[#006e2f]"
                      : "bg-white text-[#5c647a] border-gray-200 hover:border-[#006e2f] hover:text-[#006e2f]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Toolbar — tabs + sort + filters all on top, full width */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex items-center gap-3 flex-wrap">
          {/* Type tabs */}
          <div className="flex gap-1 bg-[#f3f3f4] p-1 rounded-xl">
            {([
              { value: "all", label: "Tout", count: stats?.total ?? 0 },
              { value: "formations", label: "Formations", count: stats?.totalFormations ?? 0 },
              { value: "products", label: "Produits", count: stats?.totalProducts ?? 0 },
            ] as const).map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.value ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {tab.label}
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.value ? "bg-[#22c55e]/10 text-[#006e2f]" : "bg-zinc-200 text-zinc-500"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-zinc-200 hidden md:block" />

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="px-3 py-2 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-900 bg-white focus:outline-none focus:border-[#22c55e] cursor-pointer"
          >
            <option value="relevance">Tri : Pertinence</option>
            <option value="recent">Tri : Plus récents</option>
            <option value="price-asc">Tri : Prix ↑</option>
            <option value="price-desc">Tri : Prix ↓</option>
            <option value="rating">Tri : Mieux notés</option>
          </select>

          {/* Rating filter as inline pills */}
          <div className="flex gap-1">
            {[0, 4, 4.5].map((r) => (
              <button
                key={r}
                onClick={() => setMinRating(r)}
                className={`flex items-center gap-0.5 px-2.5 py-2 rounded-lg text-[11px] font-bold transition-all border ${
                  minRating === r
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                }`}
              >
                {r === 0 ? "Toutes notes" : (
                  <>
                    {r}
                    <span className="material-symbols-outlined text-[12px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="ml-0.5">+</span>
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Price filter compact */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 bg-white">
            <span className="material-symbols-outlined text-[14px] text-zinc-400">payments</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Max</span>
            <input
              type="range"
              min="5000"
              max="1000000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-24 accent-[#22c55e]"
            />
            <span className="text-[11px] font-bold font-mono text-zinc-900 whitespace-nowrap">
              {maxPrice >= 1000000 ? "∞" : `${(maxPrice / 1000).toFixed(0)}k`}
            </span>
          </div>

          <div className="flex-1" />

          {/* Reset + result count */}
          {(activeCategory || minRating > 0 || maxPrice < 1000000 || sort !== "relevance" || search) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-[11px] font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
              Réinitialiser
            </button>
          )}
          <p className="text-xs text-zinc-500 font-mono">
            <span className="font-bold text-zinc-900">{displayedItems.length}</span> résultat{displayedItems.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Full-width grid — sidebar removed */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 pb-16">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="aspect-[4/5] bg-gray-100 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                  <div className="h-5 bg-gray-100 rounded w-1/3 animate-pulse mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-24 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px] text-gray-300">search_off</span>
            </div>
            <p className="font-semibold text-[#191c1e] mb-1">
              {(stats?.total ?? 0) === 0 ? "Bientôt disponible" : "Aucun résultat"}
            </p>
            <p className="text-sm text-[#5c647a] mb-4">
              {(stats?.total ?? 0) === 0
                ? "Les premiers produits arrivent bientôt. Soyez le premier créateur à publier !"
                : "Essayez de modifier vos filtres de recherche."}
            </p>
            {(stats?.total ?? 0) === 0 ? (
              <Link
                href="/formations/vendeur/produits/creer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90"
                style={{ background: "linear-gradient(to right, #006e2f, #22c55e)" }}
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Publier un produit
              </Link>
            ) : (
              <button onClick={resetFilters} className="text-sm font-semibold text-[#006e2f] hover:underline">
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
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
