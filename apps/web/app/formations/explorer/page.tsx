"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown, Star, Clock, Users, Award } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────

interface Category {
  id: string;
  nameFr: string;
  nameEn: string;
  slug: string;
  _count?: { formations: number };
}

interface Formation {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  shortDescFr: string | null;
  shortDescEn: string | null;
  thumbnail: string | null;
  price: number;
  originalPrice: number | null;
  isFree: boolean;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  duration: number;
  level: string;
  hasCertificate: boolean;
  createdAt: string;
  publishedAt: string | null;
  category: { nameFr: string; nameEn: string; color: string | null; slug: string };
  instructeur: { user: { name: string; avatar: string | null; image: string | null } };
}

interface FiltersState {
  search: string;
  categorySlug: string;
  level: string[];
  priceRange: string;
  durationRange: string;
  minRating: string;
  language: string[];
}

// ── Helpers ────────────────────────────────────────────────────

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function formatPrice(price: number, isFree: boolean, freeLabel: string): string {
  if (isFree) return freeLabel;
  return `${price.toFixed(0)}€`;
}

function isNew(createdAt: string): boolean {
  const d = new Date(createdAt);
  const now = new Date();
  return (now.getTime() - d.getTime()) < 30 * 24 * 60 * 60 * 1000;
}

// ── Components ─────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3 h-3 ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
        />
      ))}
    </span>
  );
}

function FormationCard({ formation, locale, t }: { formation: Formation; locale: string; t: ReturnType<typeof useTranslations> }) {
  const title = locale === "fr" ? formation.titleFr : (formation.titleEn || formation.titleFr);
  const desc = locale === "fr" ? formation.shortDescFr : (formation.shortDescEn || formation.shortDescFr);
  const catName = locale === "fr" ? formation.category.nameFr : (formation.category.nameEn || formation.category.nameFr);
  const instructorName = formation.instructeur?.user?.name ?? "Instructeur";
  const avatarUrl = formation.instructeur?.user?.avatar || formation.instructeur?.user?.image;
  const thumbnail = formation.thumbnail;
  const showBestseller = formation.studentsCount > 100;
  const showNew = isNew(formation.createdAt) && !showBestseller;
  const discountPct = formation.originalPrice && formation.originalPrice > formation.price
    ? Math.round((1 - formation.price / formation.originalPrice) * 100)
    : null;

  return (
    <Link href={`/formations/${formation.slug}`} className="group block bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary/30 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-slate-100 dark:to-slate-700 overflow-hidden">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-30">🎓</div>
        )}
        {showBestseller && (
          <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded">
            {t("bestseller")}
          </span>
        )}
        {showNew && !showBestseller && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">
            {t("new")}
          </span>
        )}
        {discountPct && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
            -{discountPct}%
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Category badge */}
        <span
          className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2"
          style={{ backgroundColor: `${formation.category.color || "#0e7c66"}20`, color: formation.category.color || "#0e7c66" }}
        >
          {catName}
        </span>

        {/* Title */}
        <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-5 h-5 rounded-full bg-primary/10 overflow-hidden flex-shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={instructorName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs flex items-center justify-center h-full text-primary font-medium">
                {instructorName.charAt(0)}
              </span>
            )}
          </div>
          <span className="text-xs text-slate-500 truncate">{instructorName}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-xs font-bold text-amber-600">{formation.rating.toFixed(1)}</span>
          <StarRating rating={formation.rating} />
          <span className="text-xs text-slate-400">({formation.reviewsCount.toLocaleString()})</span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(formation.duration)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {formation.studentsCount.toLocaleString()}
          </span>
          {formation.hasCertificate && (
            <span className="flex items-center gap-1">
              <Award className="w-3 h-3 text-green-500" />
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`font-bold text-base ${formation.isFree ? "text-green-600" : "text-slate-900"}`}>
              {formatPrice(formation.price, formation.isFree, t("free"))}
            </span>
            {formation.originalPrice && formation.originalPrice > formation.price && (
              <span className="text-xs text-slate-400 line-through">
                {formation.originalPrice.toFixed(0)}€
              </span>
            )}
          </div>
          <span className="text-xs text-primary font-medium">
            {t("level_" + formation.level.toLowerCase().replace("tous_niveaux", "tous").replace("débutant", "debutant").replace("intermédiaire", "intermediaire").replace("avancé", "avance"))}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Main Page ──────────────────────────────────────────────────

export default function ExplorerFormationsPage() {
  const t = useTranslations("formations");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sort, setSort] = useState(searchParams.get("sort") || "populaire");

  const [filters, setFilters] = useState<FiltersState>({
    search: searchParams.get("q") || "",
    categorySlug: searchParams.get("category") || "",
    level: [],
    priceRange: "",
    durationRange: "",
    minRating: "",
    language: [],
  });
  const [pendingFilters, setPendingFilters] = useState<FiltersState>(filters);

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchFormations = useCallback(async (f: FiltersState, s: string, p: number, append = false) => {
    if (p === 1) setLoading(true); else setLoadingMore(true);

    const params = new URLSearchParams();
    if (f.search) params.set("q", f.search);
    if (f.categorySlug) params.set("category", f.categorySlug);
    if (f.level.length) params.set("level", f.level.join(","));
    if (f.priceRange) params.set("price", f.priceRange);
    if (f.durationRange) params.set("duration", f.durationRange);
    if (f.minRating) params.set("rating", f.minRating);
    if (f.language.length) params.set("language", f.language.join(","));
    params.set("sort", s);
    params.set("page", String(p));
    params.set("limit", "12");

    try {
      const res = await fetch(`/api/formations?${params.toString()}`);
      if (!res.ok) return;
      const data = await res.json();
      const items: Formation[] = data.formations ?? [];
      const tot: number = data.total ?? 0;
      const totalPages: number = data.totalPages ?? 1;

      if (append) {
        setFormations((prev) => [...prev, ...items]);
      } else {
        setFormations(items);
      }
      setTotal(tot);
      setHasMore(p < totalPages);
    } catch {}
    finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/formations/categories").then((r) => r.json()).then((d) => setCategories(Array.isArray(d) ? d : []));
  }, []);

  useEffect(() => {
    setPage(1);
    fetchFormations(filters, sort, 1, false);
  }, [filters, sort, fetchFormations]);

  const handleSearchChange = (val: string) => {
    setPendingFilters((prev) => ({ ...prev, search: val }));
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: val }));
    }, 300);
  };

  const applyFilters = () => {
    setFilters(pendingFilters);
    setShowMobileFilters(false);
  };

  const resetFilters = () => {
    const fresh: FiltersState = { search: "", categorySlug: "", level: [], priceRange: "", durationRange: "", minRating: "", language: [] };
    setPendingFilters(fresh);
    setFilters(fresh);
  };

  const toggleArrayFilter = (key: "level" | "language", val: string) => {
    setPendingFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter((x) => x !== val) : [...prev[key], val],
    }));
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchFormations(filters, sort, next, true);
  };

  const levelOptions = [
    { value: "DEBUTANT", label: locale === "fr" ? "Débutant" : "Beginner" },
    { value: "INTERMEDIAIRE", label: locale === "fr" ? "Intermédiaire" : "Intermediate" },
    { value: "AVANCE", label: locale === "fr" ? "Avancé" : "Advanced" },
    { value: "TOUS_NIVEAUX", label: locale === "fr" ? "Tous niveaux" : "All Levels" },
  ];

  const priceOptions = [
    { value: "", label: t("price_all") },
    { value: "free", label: t("price_free") },
    { value: "paid", label: t("price_paid") },
    { value: "under20", label: t("price_under20") },
    { value: "20to50", label: "20€ - 50€" },
    { value: "over50", label: t("price_over50") },
  ];

  const durationOptions = [
    { value: "", label: t("duration_all") },
    { value: "under2h", label: t("duration_under2h") },
    { value: "2h5h", label: "2h - 5h" },
    { value: "5h10h", label: "5h - 10h" },
    { value: "over10h", label: t("duration_over10h") },
  ];

  const ratingOptions = [
    { value: "4.5", label: "4.5★ " + (locale === "fr" ? "et plus" : "and up") },
    { value: "4.0", label: "4.0★ " + (locale === "fr" ? "et plus" : "and up") },
    { value: "3.5", label: "3.5★ " + (locale === "fr" ? "et plus" : "and up") },
  ];

  const sortOptions = [
    { value: "populaire", label: t("sort_popular") },
    { value: "note", label: t("sort_rated") },
    { value: "recent", label: t("sort_newest") },
    { value: "prix_asc", label: t("sort_price_asc") },
    { value: "prix_desc", label: t("sort_price_desc") },
  ];

  const SidebarFilters = ({ forMobile = false }: { forMobile?: boolean }) => (
    <aside className={forMobile ? "p-4" : "w-64 flex-shrink-0"}>
      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-semibold text-slate-900 text-sm mb-3">{t("filter_category")}</h3>
        <button
          onClick={() => setPendingFilters((p) => ({ ...p, categorySlug: "" }))}
          className={`block w-full text-left text-sm px-2 py-1.5 rounded-lg mb-1 transition-colors ${
            !pendingFilters.categorySlug ? "bg-primary/10 text-primary font-medium" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          {locale === "fr" ? "Toutes les catégories" : "All Categories"}
          {" "}
          <span className="text-slate-400">({categories.reduce((s, c) => s + (c._count?.formations ?? 0), 0)})</span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setPendingFilters((p) => ({ ...p, categorySlug: cat.slug }))}
            className={`block w-full text-left text-sm px-2 py-1.5 rounded-lg mb-0.5 transition-colors ${
              pendingFilters.categorySlug === cat.slug ? "bg-primary/10 text-primary font-medium" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {locale === "fr" ? cat.nameFr : (cat.nameEn || cat.nameFr)}
            {cat._count && <span className="text-slate-400 ml-1">({cat._count.formations})</span>}
          </button>
        ))}
      </div>

      {/* Level */}
      <div className="mb-6">
        <h3 className="font-semibold text-slate-900 text-sm mb-3">{t("filter_level")}</h3>
        {levelOptions.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 py-1 cursor-pointer">
            <input
              type="checkbox"
              checked={pendingFilters.level.includes(opt.value)}
              onChange={() => toggleArrayFilter("level", opt.value)}
              className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
            />
            <span className="text-sm text-slate-700">{opt.label}</span>
          </label>
        ))}
      </div>

      {/* Price */}
      <div className="mb-6">
        <h3 className="font-semibold text-slate-900 text-sm mb-3">{t("filter_price")}</h3>
        {priceOptions.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 py-1 cursor-pointer">
            <input
              type="radio"
              name="price"
              checked={pendingFilters.priceRange === opt.value}
              onChange={() => setPendingFilters((p) => ({ ...p, priceRange: opt.value }))}
              className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
            />
            <span className="text-sm text-slate-700">{opt.label}</span>
          </label>
        ))}
      </div>

      {/* Duration */}
      <div className="mb-6">
        <h3 className="font-semibold text-slate-900 text-sm mb-3">{t("filter_duration")}</h3>
        {durationOptions.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 py-1 cursor-pointer">
            <input
              type="radio"
              name="duration"
              checked={pendingFilters.durationRange === opt.value}
              onChange={() => setPendingFilters((p) => ({ ...p, durationRange: opt.value }))}
              className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
            />
            <span className="text-sm text-slate-700">{opt.label}</span>
          </label>
        ))}
      </div>

      {/* Rating */}
      <div className="mb-6">
        <h3 className="font-semibold text-slate-900 text-sm mb-3">{t("filter_rating")}</h3>
        {ratingOptions.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 py-1 cursor-pointer">
            <input
              type="checkbox"
              checked={pendingFilters.minRating === opt.value}
              onChange={() => setPendingFilters((p) => ({ ...p, minRating: p.minRating === opt.value ? "" : opt.value }))}
              className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
            />
            <span className="text-sm text-slate-700">{opt.label}</span>
          </label>
        ))}
      </div>

      {/* Language */}
      <div className="mb-6">
        <h3 className="font-semibold text-slate-900 text-sm mb-3">{t("filter_language")}</h3>
        {[{ value: "fr", label: "Français" }, { value: "en", label: "English" }].map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 py-1 cursor-pointer">
            <input
              type="checkbox"
              checked={pendingFilters.language.includes(opt.value)}
              onChange={() => toggleArrayFilter("language", opt.value)}
              className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
            />
            <span className="text-sm text-slate-700">{opt.label}</span>
          </label>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-2 border-t">
        <button
          onClick={applyFilters}
          className="flex-1 bg-primary text-white text-sm font-medium py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          {t("filter_apply")}
        </button>
        <button
          onClick={resetFilters}
          className="px-3 border border-slate-300 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors"
        >
          {t("filter_reset")}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Top search bar */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-4">
            {/* Search input */}
            <div className="flex-1 relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={pendingFilters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t("hero_search_placeholder")}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {pendingFilters.search && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative hidden sm:block">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Mobile filters toggle */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {locale === "fr" ? "Filtres" : "Filters"}
            </button>
          </div>

          {/* Results count */}
          <div className="mt-2 text-xs text-slate-500">
            {!loading && (
              <span>
                {t("courses_found", { count: total })}
                {filters.search && <span className="ml-1">pour <strong>&quot;{filters.search}&quot;</strong></span>}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">{locale === "fr" ? "Filtres" : "Filters"}</h2>
              <button onClick={() => setShowMobileFilters(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <SidebarFilters forMobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-xl border p-5 w-64">
              <SidebarFilters />
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border overflow-hidden animate-pulse">
                    <div className="aspect-video bg-slate-100" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-slate-100 rounded w-1/3" />
                      <div className="h-4 bg-slate-100 rounded w-4/5" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                      <div className="h-3 bg-slate-100 rounded w-2/3" />
                      <div className="h-5 bg-slate-100 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : formations.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-slate-500">{t("no_courses")}</p>
                <button onClick={resetFilters} className="mt-4 text-primary text-sm hover:underline">
                  {t("filter_reset")}
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {formations.map((f) => (
                    <FormationCard key={f.id} formation={f} locale={locale} t={t} />
                  ))}
                </div>

                {/* Load more */}
                {hasMore && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="bg-white border border-slate-200 text-slate-700 font-medium px-8 py-3 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                      {loadingMore
                        ? (locale === "fr" ? "Chargement..." : "Loading...")
                        : (locale === "fr" ? "Voir plus" : "Load more")}
                    </button>
                  </div>
                )}

                {!hasMore && formations.length > 0 && (
                  <p className="text-center text-sm text-slate-400 mt-8">
                    {locale === "fr" ? `${total} formation${total > 1 ? "s" : ""} au total` : `${total} course${total > 1 ? "s" : ""} total`}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
