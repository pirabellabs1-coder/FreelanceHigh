"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

// ── Types ──────────────────────────────────────────────────────

interface Category {
  id: string;
  nameFr: string;
  nameEn: string;
  slug: string;
  icon: string | null;
  color: string | null;
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
  category: { nameFr: string; nameEn: string; color: string | null };
  instructeur: { user: { name: string; avatar: string | null; image: string | null } };
}

interface DigitalProduct {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  banner: string | null;
  price: number;
  originalPrice: number | null;
  isFree: boolean;
  productType: string;
  rating: number;
  reviewsCount: number;
  salesCount: number;
  maxBuyers: number | null;
  currentBuyers: number;
  previewEnabled: boolean;
  instructeur: { user: { name: string; avatar: string | null; image: string | null } };
  category: { nameFr: string; nameEn: string; slug: string } | null;
}

// ── Helpers ────────────────────────────────────────────────────

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// ── Formation Card ─────────────────────────────────────────────

function FormationCard({ formation, lang }: { formation: Formation; lang: string }) {
  const title = lang === "en" ? formation.titleEn : formation.titleFr;
  const isNew = new Date(formation.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const isBestseller = formation.studentsCount > 100;

  return (
    <Link
      href={`/formations/${formation.slug}`}
      className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-video bg-slate-100 dark:bg-slate-700">
        {formation.thumbnail ? (
          <img
            src={formation.thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: formation.category.color ?? "#0e7c66" + "20" }}
          >
            <span className="text-4xl">🎓</span>
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {isBestseller && (
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
              Bestseller
            </span>
          )}
          {isNew && !isBestseller && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Nouveau
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category */}
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full mb-2 self-start"
          style={{
            backgroundColor: (formation.category.color ?? "#0e7c66") + "20",
            color: formation.category.color ?? "#0e7c66",
          }}
        >
          {lang === "en" ? formation.category.nameEn : formation.category.nameFr}
        </span>

        {/* Title */}
        <h3 className="font-bold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Instructor */}
        <p className="text-xs text-slate-500 mb-2">
          {formation.instructeur.user.name}
        </p>

        {/* Rating */}
        {formation.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-yellow-500 text-sm font-bold">{formation.rating.toFixed(1)}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`text-sm ${star <= Math.round(formation.rating) ? "text-yellow-400" : "text-slate-300"}`}>★</span>
              ))}
            </div>
            <span className="text-xs text-slate-400">({formation.reviewsCount})</span>
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
          <span>{formatDuration(formation.duration)}</span>
          <span>·</span>
          <span>{formation.studentsCount.toLocaleString()} étudiants</span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            {formation.isFree ? (
              <span className="text-lg font-extrabold text-green-500">Gratuit</span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {formation.price.toFixed(2)}€
                </span>
                {formation.originalPrice && formation.originalPrice > formation.price && (
                  <span className="text-sm text-slate-400 line-through">
                    {formation.originalPrice.toFixed(2)}€
                  </span>
                )}
              </div>
            )}
          </div>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">
            Voir →
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Main Page ──────────────────────────────────────────────────

export default function FormationsLandingPage() {
  const t = useTranslations("formations");
  const locale = useLocale();
  const router = useRouter();
  const lang = locale === "en" ? "en" : "fr";

  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Formation[]>([]);
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ formations: number; apprenants: number; instructeurs: number; averageRating: number } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/formations/categories").then((r) => r.json()),
      fetch("/api/formations?limit=8&sort=populaire").then((r) => r.json()),
      fetch("/api/formations/stats").then((r) => r.json()),
      fetch("/api/produits?limit=4&sort=populaire").then((r) => r.json()),
    ]).then(([cats, form, st, prods]) => {
      setCategories(Array.isArray(cats) ? cats : []);
      setFeatured(Array.isArray(form?.formations) ? form.formations : []);
      setStats(st);
      setProducts(Array.isArray(prods?.products) ? prods.products : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/formations/explorer?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/formations/explorer");
    }
  };

  const formatStatValue = (n: number): string => {
    if (n >= 1000) return `${Math.floor(n / 1000)}K+`;
    if (n > 0) return `${n}+`;
    return "0";
  };

  const STATS = [
    { value: stats ? formatStatValue(stats.apprenants) : "—", label: t("stats_learners") },
    { value: stats ? formatStatValue(stats.formations) : "—", label: t("stats_courses") },
    { value: stats ? formatStatValue(stats.instructeurs) : "—", label: t("stats_instructors") },
    { value: stats?.averageRating ? `${stats.averageRating}/5` : "—", label: t("stats_satisfaction") },
  ];

  const HOW_IT_WORKS = [
    { icon: "🔍", title: t("step1_title"), desc: lang === "en" ? "Browse thousands of courses in our catalog" : "Parcourez des milliers de formations dans notre catalogue" },
    { icon: "💳", title: t("step2_title"), desc: lang === "en" ? "Secure payment with 30-day money-back guarantee" : "Paiement sécurisé avec garantie satisfait ou remboursé 30 jours" },
    { icon: "📚", title: t("step3_title"), desc: lang === "en" ? "Access videos, resources and quizzes anytime" : "Accédez aux vidéos, ressources et quiz quand vous voulez" },
    { icon: "🏆", title: t("step4_title"), desc: lang === "en" ? "Earn a shareable certificate recognized by employers" : "Obtenez un certificat partageable reconnu par les employeurs" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative px-6 lg:px-20 pt-12 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 min-h-[560px] flex flex-col justify-center px-8 lg:px-16 py-12">
            {/* Decorative blurs */}
            <div className="absolute -top-24 -right-24 size-96 bg-primary/20 blur-[150px] rounded-full" />
            <div className="absolute -bottom-24 -left-24 size-96 bg-accent/10 blur-[150px] rounded-full" />

            {/* Content */}
            <div className="relative z-10 max-w-3xl space-y-8">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider border border-accent/30">
                {lang === "en" ? "Training & Certifications" : "Formations & Certifications"}
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] tracking-tight">
                {t("hero_title")}
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 max-w-xl leading-relaxed">
                {t("hero_subtitle")}
              </p>

              {/* Search */}
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-2xl border border-white/10 gap-2">
                <div className="flex flex-1 items-center min-w-0">
                  <span className="material-symbols-outlined text-slate-400 px-3">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("hero_search_placeholder")}
                    className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 text-base py-4 min-w-0"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg whitespace-nowrap"
                >
                  {lang === "en" ? "Search" : "Rechercher"}
                </button>
              </form>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/formations/explorer"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/30 transition-all text-sm text-center"
                >
                  {t("hero_cta_explore")}
                </Link>
                <Link
                  href="/formations/devenir-instructeur"
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-3 rounded-xl font-bold transition-all backdrop-blur-sm text-sm text-center"
                >
                  {t("hero_cta_instructor")}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-5xl mx-auto -mt-8 relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-xl border border-slate-200 dark:border-slate-700">
              <div className="text-2xl font-extrabold text-primary mb-1">{stat.value}</div>
              <div className="text-xs text-slate-500 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATÉGORIES ──────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-12">
            {t("popular_categories")}
          </h2>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 animate-pulse">
                  <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/formations/categories/${cat.slug}`}
                  className="group bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-primary/30 transition-all duration-300 text-center flex flex-col items-center gap-3"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {cat.icon ?? "📚"}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                      {lang === "en" ? cat.nameEn : cat.nameFr}
                    </p>
                    {cat._count && (
                      <p className="text-xs text-slate-400 mt-1">
                        {cat._count.formations} {lang === "en" ? "courses" : "formations"}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FORMATIONS EN VEDETTE ────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-extrabold">{t("featured_title")}</h2>
            <Link
              href="/formations/explorer"
              className="text-primary hover:text-primary/80 font-semibold text-sm flex items-center gap-1"
            >
              {lang === "en" ? "See all →" : "Voir tout →"}
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 animate-pulse">
                  <div className="aspect-video bg-slate-200 dark:bg-slate-700" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((formation) => (
                <FormationCard key={formation.id} formation={formation} lang={lang} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              <span className="text-6xl mb-4 block">📚</span>
              <p className="text-lg">{lang === "en" ? "Courses coming soon!" : "Des formations arrivent bientôt !"}</p>
            </div>
          )}
        </div>
      </section>

      {/* ── PRODUITS NUMÉRIQUES POPULAIRES ──────────────────────────── */}
      {products.length > 0 && (
        <section className="py-20 px-6 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-extrabold">{t("popular_products")}</h2>
                <p className="text-slate-500 mt-1">{t("popular_products_subtitle")}</p>
              </div>
              <Link
                href="/formations/produits"
                className="text-primary hover:text-primary/80 font-semibold text-sm flex items-center gap-1"
              >
                {t("see_all_products")} →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {products.map((product) => {
                const title = lang === "en" ? product.titleEn : product.titleFr;
                const hasDiscount = product.originalPrice && product.originalPrice > product.price;
                const isLimited = product.maxBuyers && product.maxBuyers > 0;
                const stockPct = isLimited ? ((product.maxBuyers! - product.currentBuyers) / product.maxBuyers!) * 100 : 100;

                return (
                  <Link
                    key={product.id}
                    href={`/formations/produits/${product.slug}`}
                    className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col"
                  >
                    {/* Banner */}
                    <div className="relative overflow-hidden aspect-[4/3] bg-slate-100 dark:bg-slate-700">
                      {product.banner ? (
                        <img
                          src={product.banner}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                          <span className="text-5xl">
                            {product.productType === "EBOOK" ? "📖" : product.productType === "TEMPLATE" ? "📄" : product.productType === "LICENCE" ? "🔑" : product.productType === "AUDIO" ? "🎧" : product.productType === "VIDEO" ? "🎬" : "📦"}
                          </span>
                        </div>
                      )}
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                        <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {t(`product_type_${product.productType}`)}
                        </span>
                        {product.previewEnabled && (
                          <span className="bg-sky-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {t("product_preview_available")}
                          </span>
                        )}
                      </div>
                      {hasDiscount && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          -{Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                      <p className="text-xs text-slate-500 mb-2">
                        {product.instructeur.user.name}
                      </p>

                      {/* Rating */}
                      {product.rating > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-yellow-500 text-sm font-bold">{product.rating.toFixed(1)}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={`text-sm ${star <= Math.round(product.rating) ? "text-yellow-400" : "text-slate-300"}`}>★</span>
                            ))}
                          </div>
                          <span className="text-xs text-slate-400">({product.reviewsCount})</span>
                        </div>
                      )}

                      {/* Sales + Stock */}
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
                        <span>{product.salesCount} {lang === "en" ? "sales" : "ventes"}</span>
                        {isLimited && (
                          <>
                            <span>·</span>
                            <span className={stockPct < 20 ? "text-red-500 font-bold" : "text-orange-500"}>
                              {t("product_limited")}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Price */}
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          {product.isFree ? (
                            <span className="text-lg font-extrabold text-green-500">{t("free")}</span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                                {product.price.toFixed(2)}€
                              </span>
                              {hasDiscount && (
                                <span className="text-sm text-slate-400 line-through">
                                  {product.originalPrice!.toFixed(2)}€
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">
                          {lang === "en" ? "View →" : "Voir →"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── COMMENT ÇA MARCHE ────────────────────────────────────── */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-12">{t("how_it_works_title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  {step.icon}
                </div>
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto -mt-2 mb-4 relative z-10 shadow-lg">
                  {i + 1}
                </div>
                <h3 className="font-bold text-base mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA INSTRUCTEUR ─────────────────────────────────────── */}
      <section className="px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto bg-slate-900 border border-primary/30 rounded-[3rem] p-12 lg:p-24 text-center space-y-8 relative overflow-hidden shadow-2xl shadow-primary/10">
          <div className="absolute -top-24 -right-24 size-96 bg-primary/20 blur-[150px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 size-96 bg-accent/10 blur-[150px] rounded-full" />

          <h2 className="text-3xl md:text-5xl font-extrabold text-white max-w-3xl mx-auto leading-[1.1] relative z-10">
            {t("instructor_cta_title")}
          </h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto relative z-10 leading-relaxed">
            {t("instructor_cta_subtitle")}
          </p>
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full font-bold text-sm border border-accent/30 relative z-10">
            {t("instructor_revenue")}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link
              href="/formations/devenir-instructeur"
              className="bg-primary hover:bg-primary/90 text-white px-12 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary/30"
            >
              {t("start_teaching")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
