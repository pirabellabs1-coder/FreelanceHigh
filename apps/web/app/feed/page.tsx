"use client";

import { useState, useMemo, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/dev/mock-data";
import { CategoryBar } from "@/components/navbar/CategoryBar";
import { type ApiService } from "@/lib/api-client";

// ─── Constants ────────────────────────────────────────────────────────────────

const SERVICES_PER_PAGE = 100;

type FeedTab = "pour-vous" | "meilleurs" | "nouveaux";

const SORT_OPTIONS = [
  { value: "pertinence", label: "Pertinence" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
  { value: "note", label: "Meilleures notes" },
  { value: "nouveaute", label: "Nouveautés" },
  { value: "popularite", label: "Plus populaires" },
];

// ─── Feed Service type (from API) ────────────────────────────────────────────

interface FeedService {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  tags: string[];
  images: string[];
  packages: {
    basic: { name: string; description: string; price: number; deliveryDays: number; revisions: number };
    standard: { name: string; description: string; price: number; deliveryDays: number; revisions: number };
    premium: { name: string; description: string; price: number; deliveryDays: number; revisions: number };
  };
  vendorId: string;
  vendorName: string;
  vendorAvatar: string;
  rating: number;
  reviewCount: number;
  orderCount: number;
  featured: boolean;
  createdAt: string;
}

function mapApiToFeed(s: ApiService): FeedService {
  return {
    id: s.id,
    slug: s.slug,
    title: s.title,
    description: (s.descriptionText || "").slice(0, 120),
    category: s.categoryName,
    categorySlug: s.categoryId,
    tags: s.tags,
    images: s.images.length > 0 ? s.images : [s.mainImage || ""],
    packages: {
      basic: { name: s.packages.basic.name, description: s.packages.basic.description, price: s.packages.basic.price, deliveryDays: s.packages.basic.deliveryDays, revisions: s.packages.basic.revisions },
      standard: { name: s.packages.standard.name, description: s.packages.standard.description, price: s.packages.standard.price, deliveryDays: s.packages.standard.deliveryDays, revisions: s.packages.standard.revisions },
      premium: { name: s.packages.premium.name, description: s.packages.premium.description, price: s.packages.premium.price, deliveryDays: s.packages.premium.deliveryDays, revisions: s.packages.premium.revisions },
    },
    vendorId: s.userId,
    vendorName: s.vendorName || "Freelance",
    vendorAvatar: s.vendorAvatar || "",
    rating: s.rating,
    reviewCount: s.ratingCount,
    orderCount: s.orderCount,
    featured: s.isBoosted,
    createdAt: s.createdAt,
  };
}

// ─── Shuffle (Fisher-Yates) ──────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ─── Scoring Algorithm ────────────────────────────────────────────────────────

function computeScore(service: FeedService): number {
  const salesScore = Math.min(service.orderCount / 500, 1) * 0.25;
  const ratingScore = (service.rating / 5) * 0.20;
  const recencyScore = (() => {
    const daysOld = (Date.now() - new Date(service.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, 1 - daysOld / 90) * 0.15;
  })();
  const viewScore = Math.min((service.reviewCount * 15 + service.orderCount * 8) / 5000, 1) * 0.10;
  const featuredBonus = service.featured ? 0.15 : 0;
  const randomScore = Math.random() * 0.15;
  return salesScore + ratingScore + recencyScore + viewScore + featuredBonus + randomScore;
}

function buildFeedList(services: FeedService[], tab: FeedTab): FeedService[] {
  if (tab === "pour-vous") {
    const shuffled = shuffleArray(services);
    const scored = shuffled.map((s) => ({ s, score: computeScore(s) }));
    scored.sort((a, b) => b.score - a.score);

    const result: FeedService[] = [];
    const vendorCount: Record<string, number> = {};

    for (const { s } of scored) {
      if ((vendorCount[s.vendorId] || 0) >= 4) continue;
      result.push(s);
      vendorCount[s.vendorId] = (vendorCount[s.vendorId] || 0) + 1;
    }
    return result;
  }

  if (tab === "meilleurs") {
    return [...services].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
  }

  if (tab === "nouveaux") {
    return [...services].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return shuffleArray(services);
}

// ─── Service Card ─────────────────────────────────────────────────────────────

function ServiceCard({ service }: { service: FeedService }) {
  const minPrice = service.packages.basic.price;
  const [imgError, setImgError] = useState(false);
  const hasImage = service.images[0] && service.images[0] !== "";

  return (
    <Link
      href={`/feed/service/${service.id}`}
      className="group bg-[#1a1f2e] rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] bg-white/5 overflow-hidden">
        {hasImage && !imgError ? (
          <Image
            src={service.images[0]}
            alt={service.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
            <span className="material-symbols-outlined text-primary text-4xl opacity-50">image</span>
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {service.featured && (
            <span className="bg-primary/90 text-[#0f1117] text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0 overflow-hidden">
            {service.vendorAvatar ? (
              <Image
                src={service.vendorAvatar}
                alt={service.vendorName}
                width={24}
                height={24}
                className="rounded-full"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xs">person</span>
              </div>
            )}
          </div>
          <span className="text-xs text-slate-400 font-medium truncate">{service.vendorName}</span>
        </div>

        <h3 className="text-sm font-semibold text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors flex-1">
          {service.title}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={cn("material-symbols-outlined text-sm", star <= Math.round(service.rating) ? "text-yellow-400" : "text-white/10")}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >star</span>
            ))}
          </div>
          <span className="text-xs text-yellow-400 font-semibold">{service.rating.toFixed(1)}</span>
          <span className="text-xs text-slate-500">({service.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-1 text-slate-500 text-xs">
            <span className="material-symbols-outlined text-sm">shopping_cart</span>
            <span>{service.orderCount}</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500">A partir de</p>
            <p className="text-base font-bold text-white">{minPrice} EUR</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Filters Panel ────────────────────────────────────────────────────────────

interface Filters {
  priceMin: number;
  priceMax: number;
  rating: number;
  deliveryDays: number;
}

const DEFAULT_FILTERS: Filters = { priceMin: 0, priceMax: 10000, rating: 0, deliveryDays: 0 };

function FiltersPanel({ filters, onChange, onClose }: { filters: Filters; onChange: (f: Filters) => void; onClose: () => void }) {
  return (
    <aside className="w-72 flex-shrink-0 bg-[#1a1f2e] border border-white/10 rounded-2xl p-5 h-fit sticky top-36 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">Filtres</h3>
        <button onClick={() => onChange(DEFAULT_FILTERS)} className="text-xs text-primary hover:text-primary/80 transition-colors">
          Reinitialiser
        </button>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Budget</p>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-[10px] text-slate-500">Min (EUR)</label>
            <input type="number" value={filters.priceMin || ""} onChange={(e) => onChange({ ...filters, priceMin: +e.target.value || 0 })} min={0} placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-primary/50" />
          </div>
          <span className="text-slate-500 pt-4">—</span>
          <div className="flex-1">
            <label className="text-[10px] text-slate-500">Max (EUR)</label>
            <input type="number" value={filters.priceMax < 10000 ? filters.priceMax : ""} onChange={(e) => onChange({ ...filters, priceMax: +e.target.value || 10000 })} min={0} placeholder="Max" className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-primary/50" />
          </div>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Note minimale</p>
        <div className="flex gap-2">
          {[0, 4, 4.5, 4.8].map((r) => (
            <button key={r} onClick={() => onChange({ ...filters, rating: r })} className={cn("flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors", filters.rating === r ? "bg-primary text-[#0f1117]" : "bg-white/5 text-slate-400 hover:bg-white/10")}>
              {r === 0 ? "Tout" : `${r}+`}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Delai max (jours)</p>
        <div className="flex gap-2 flex-wrap">
          {[0, 3, 7, 14, 30].map((d) => (
            <button key={d} onClick={() => onChange({ ...filters, deliveryDays: d })} className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors", filters.deliveryDays === d ? "bg-primary text-[#0f1117]" : "bg-white/5 text-slate-400 hover:bg-white/10")}>
              {d === 0 ? "Tout" : `${d}j`}
            </button>
          ))}
        </div>
      </div>
      <button onClick={onClose} className="w-full py-2.5 bg-primary text-[#0f1117] rounded-xl text-sm font-bold hover:brightness-110 transition-all lg:hidden">
        Appliquer les filtres
      </button>
    </aside>
  );
}

// ─── Welcome Banner ───────────────────────────────────────────────────────────

function WelcomeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const welcomed = localStorage.getItem("fh_welcomed");
      if (!welcomed) {
        setVisible(true);
        const timer = setTimeout(() => {
          setVisible(false);
          localStorage.setItem("fh_welcomed", "1");
        }, 5000);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage not available
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="mb-4 mx-4 lg:mx-6 rounded-2xl bg-gradient-to-r from-primary/25 via-primary/10 to-blue-500/10 border border-primary/20 px-5 py-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>waving_hand</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-white">Bienvenue sur FreelanceHigh !</p>
        <p className="text-xs text-slate-300 mt-0.5">Decouvrez les meilleurs freelances et agences francophones pour vos projets.</p>
      </div>
      <button onClick={() => { setVisible(false); localStorage.setItem("fh_welcomed", "1"); }} className="text-slate-500 hover:text-white transition-colors flex-shrink-0">
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-[#1a1f2e] rounded-2xl overflow-hidden border border-white/5 animate-pulse">
      <div className="aspect-[16/9] bg-white/5" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/5" />
          <div className="h-3 bg-white/5 rounded flex-1" />
        </div>
        <div className="h-4 bg-white/5 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
        <div className="h-px bg-white/5" />
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-white/5 rounded" />
          <div className="h-5 w-12 bg-white/5 rounded" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Feed Page ───────────────────────────────────────────────────────────

function FeedPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const categorySlug = searchParams.get("categorie") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const [activeTab, setActiveTab] = useState<FeedTab>("pour-vous");
  const [sort, setSort] = useState("pertinence");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);

  // Fetch real services from API
  const [services, setServices] = useState<FeedService[]>([]);
  useEffect(() => {
    setLoading(true);
    fetch("/api/feed")
      .then((res) => res.ok ? res.json() : { services: [] })
      .then((data: { services: ApiService[] }) => {
        if (data.services) {
          setServices(data.services.map(mapApiToFeed));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Filter services
  const filteredServices = useMemo(() => {
    let list = services;

    if (query) {
      const q = query.toLowerCase();
      list = list.filter((s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (categorySlug) {
      list = list.filter((s) => s.categorySlug === categorySlug);
    }

    list = list.filter((s) => {
      const price = s.packages.basic.price;
      return price >= filters.priceMin && price <= filters.priceMax;
    });

    if (filters.rating > 0) list = list.filter((s) => s.rating >= filters.rating);
    if (filters.deliveryDays > 0) list = list.filter((s) => s.packages.basic.deliveryDays <= filters.deliveryDays);

    return list;
  }, [services, query, categorySlug, filters]);

  // Apply tab ordering
  const tabOrdered = useMemo(() => {
    if (query || categorySlug) {
      switch (sort) {
        case "prix-asc": return [...filteredServices].sort((a, b) => a.packages.basic.price - b.packages.basic.price);
        case "prix-desc": return [...filteredServices].sort((a, b) => b.packages.basic.price - a.packages.basic.price);
        case "note": return [...filteredServices].sort((a, b) => b.rating - a.rating);
        case "nouveaute": return [...filteredServices].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        case "popularite": return [...filteredServices].sort((a, b) => b.orderCount - a.orderCount);
        default: return buildFeedList(filteredServices, "pour-vous");
      }
    }
    return buildFeedList(filteredServices, activeTab);
  }, [filteredServices, activeTab, sort, query, categorySlug]);

  // Pagination
  const totalPages = Math.ceil(tabOrdered.length / SERVICES_PER_PAGE);
  const startIndex = (currentPage - 1) * SERVICES_PER_PAGE;
  const displayedServices = tabOrdered.slice(startIndex, startIndex + SERVICES_PER_PAGE);
  const hasMore = currentPage < totalPages;

  const goToPage = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const qs = params.toString();
    router.push(`/feed${qs ? `?${qs}` : ""}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchParams, router]);

  const activeCategory = CATEGORIES.find((c) => c.slug === categorySlug);

  const tabs: { id: FeedTab; label: string; icon: string }[] = [
    { id: "pour-vous", label: "Pour vous", icon: "recommend" },
    { id: "meilleurs", label: "Meilleurs services", icon: "workspace_premium" },
    { id: "nouveaux", label: "Nouveaux", icon: "fiber_new" },
  ];

  return (
    <div>
      <CategoryBar />

      {/* Welcome banner — first visit only */}
      <WelcomeBanner />

      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-4">
        {/* Tabs — only when no search/category filter active */}
        {!query && !categorySlug && (
          <div className="flex items-center gap-1 mb-4 bg-white/5 rounded-xl p-1 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); goToPage(1); }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-primary text-[#0f1117] shadow-md shadow-primary/20"
                    : "text-slate-400 hover:text-white"
                )}
              >
                <span className="material-symbols-outlined text-base" style={activeTab === tab.id ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {tab.icon}
                </span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-bold text-white">
              {query ? `Resultats pour "${query}"` : activeCategory ? activeCategory.label : "Tous les services"}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {loading ? "Chargement..." : (
                <>
                  {tabOrdered.length} service{tabOrdered.length !== 1 ? "s" : ""} disponible{tabOrdered.length !== 1 ? "s" : ""}
                  {totalPages > 1 && (
                    <span className="ml-2">— Page {currentPage} sur {totalPages}</span>
                  )}
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors lg:hidden",
                showFilters ? "bg-primary/10 text-primary" : "bg-white/5 text-slate-400 hover:text-white"
              )}
            >
              <span className="material-symbols-outlined text-lg">tune</span>
              Filtres
            </button>
            {(query || categorySlug) && (
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#1a1f2e]">{opt.label}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters desktop */}
          <div className="hidden lg:block">
            <FiltersPanel filters={filters} onChange={setFilters} onClose={() => {}} />
          </div>

          {/* Filters mobile */}
          {showFilters && (
            <div className="fixed inset-0 z-50 bg-black/60 lg:hidden" onClick={() => setShowFilters(false)}>
              <div className="absolute left-0 top-0 h-full w-80 overflow-y-auto p-4" onClick={(e) => e.stopPropagation()}>
                <FiltersPanel filters={filters} onChange={setFilters} onClose={() => setShowFilters(false)} />
              </div>
            </div>
          )}

          {/* Services grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : displayedServices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">search_off</span>
                <h3 className="text-lg font-semibold text-white mb-2">Aucun service disponible</h3>
                <p className="text-sm text-slate-500 max-w-sm">
                  {query || filters.rating > 0 || filters.deliveryDays > 0
                    ? "Essayez d'autres termes de recherche ou supprimez certains filtres."
                    : "Les services apparaitront ici une fois approuves par l'administration."}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {displayedServices.map((service, index) => (
                    <ServiceCard key={`${service.id}-${index}`} service={service} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-10 flex flex-col items-center gap-6">
                  {hasMore && (
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      className="flex items-center gap-3 px-10 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl text-sm font-bold transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-primary/30"
                    >
                      <span className="material-symbols-outlined text-xl">arrow_forward</span>
                      Voir plus de services
                      <span className="text-xs opacity-70 ml-1">
                        ({tabOrdered.length - (startIndex + SERVICES_PER_PAGE)} restants)
                      </span>
                    </button>
                  )}

                  {/* Page indicator */}
                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                          currentPage <= 1 ? "text-slate-600 cursor-not-allowed" : "text-slate-400 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                      </button>

                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let page: number;
                        if (totalPages <= 5) {
                          page = i + 1;
                        } else if (currentPage <= 3) {
                          page = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + i;
                        } else {
                          page = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={cn(
                              "w-9 h-9 rounded-lg text-sm font-semibold transition-colors",
                              page === currentPage
                                ? "bg-primary text-[#0f1117]"
                                : "text-slate-400 hover:bg-white/10 hover:text-white"
                            )}
                          >
                            {page}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                          currentPage >= totalPages ? "text-slate-600 cursor-not-allowed" : "text-slate-400 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                      </button>
                    </div>
                  )}

                  {!hasMore && tabOrdered.length > 0 && (
                    <div className="flex flex-col items-center gap-3 py-4 text-center">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>done_all</span>
                      </div>
                      <p className="text-sm font-semibold text-white">Vous avez tout vu !</p>
                      <p className="text-xs text-slate-500">De nouveaux services arrivent bientot.</p>
                      {currentPage > 1 && (
                        <button
                          onClick={() => goToPage(1)}
                          className="text-xs text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
                        >
                          Revenir a la premiere page
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Chargement du feed...</p>
        </div>
      </div>
    }>
      <FeedPageInner />
    </Suspense>
  );
}
