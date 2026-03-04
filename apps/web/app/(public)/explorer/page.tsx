"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useCurrencyStore } from "@/store/currency";
import { cn } from "@/lib/utils";

// ============================================================
// Types
// ============================================================

interface MarketplaceService {
  id: string;
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  image: string;
  freelancer: {
    name: string;
    avatar: string;
    level: "Nouveau" | "Confirme" | "Top Rated" | "Elite";
    country: string;
  };
  rating: number;
  reviewCount: number;
  price: number;
  deliveryDays: number;
  favorited: boolean;
}

// ============================================================
// Constants
// ============================================================

const CATEGORIES = [
  { label: "Developpement Web", slug: "developpement-web", icon: "code" },
  { label: "Design UI/UX", slug: "design-ui-ux", icon: "palette" },
  { label: "Marketing Digital", slug: "marketing-digital", icon: "campaign" },
  { label: "Redaction", slug: "redaction", icon: "edit_note" },
  { label: "Traduction", slug: "traduction", icon: "translate" },
  { label: "Video & Animation", slug: "video-animation", icon: "videocam" },
  { label: "IA & Data", slug: "ia-data", icon: "smart_toy" },
  { label: "Mobile", slug: "mobile", icon: "smartphone" },
  { label: "SEO", slug: "seo", icon: "travel_explore" },
  { label: "Cybersecurite", slug: "cybersecurite", icon: "security" },
] as const;

const DELIVERY_OPTIONS = [
  { label: "Tous", value: "all" },
  { label: "1-3 jours", value: "1-3" },
  { label: "3-7 jours", value: "3-7" },
  { label: "7-14 jours", value: "7-14" },
  { label: "14-30 jours", value: "14-30" },
] as const;

const RATING_OPTIONS = [
  { label: "4 etoiles et +", value: 4 },
  { label: "3 etoiles et +", value: 3 },
  { label: "2 etoiles et +", value: 2 },
] as const;

const SELLER_LEVELS = ["Nouveau", "Confirme", "Top Rated", "Elite"] as const;

const COUNTRIES = [
  "Tous",
  "Senegal",
  "Cote d'Ivoire",
  "Cameroun",
  "France",
  "Maroc",
  "Belgique",
  "Canada",
  "Mali",
  "Burkina Faso",
] as const;

const SORT_OPTIONS = [
  { label: "Pertinence", value: "pertinence" },
  { label: "Prix croissant", value: "prix_asc" },
  { label: "Prix decroissant", value: "prix_desc" },
  { label: "Meilleures notes", value: "note" },
  { label: "Plus recents", value: "recent" },
  { label: "Populaires", value: "populaire" },
] as const;

const ITEMS_PER_PAGE = 12;

const CATEGORY_GRADIENTS: Record<string, string> = {
  "developpement-web": "from-emerald-600/80 to-teal-800/80",
  "design-ui-ux": "from-purple-600/80 to-pink-700/80",
  "marketing-digital": "from-orange-500/80 to-red-600/80",
  "redaction": "from-blue-500/80 to-indigo-700/80",
  "traduction": "from-cyan-500/80 to-blue-600/80",
  "video-animation": "from-rose-500/80 to-purple-600/80",
  "ia-data": "from-violet-600/80 to-indigo-800/80",
  "mobile": "from-sky-500/80 to-blue-700/80",
  "seo": "from-lime-500/80 to-green-700/80",
  "cybersecurite": "from-slate-600/80 to-zinc-800/80",
};

// ============================================================
// Demo Data (24+ services)
// ============================================================

const DEMO_SERVICES: MarketplaceService[] = [
  {
    id: "ms1", slug: "creation-site-web-vitrine-next-js", title: "Creation de site web vitrine avec Next.js",
    category: "Developpement Web", categorySlug: "developpement-web",
    image: "code", freelancer: { name: "Gildas L.", avatar: "GL", level: "Top Rated", country: "Cote d'Ivoire" },
    rating: 4.9, reviewCount: 287, price: 120, deliveryDays: 7, favorited: false,
  },
  {
    id: "ms2", slug: "design-ui-ux-application-mobile", title: "Design UI/UX complet pour application mobile",
    category: "Design UI/UX", categorySlug: "design-ui-ux",
    image: "palette", freelancer: { name: "Claire B.", avatar: "CB", level: "Elite", country: "France" },
    rating: 4.8, reviewCount: 203, price: 180, deliveryDays: 5, favorited: false,
  },
  {
    id: "ms3", slug: "strategie-marketing-digital-reseaux-sociaux", title: "Strategie marketing digital et reseaux sociaux",
    category: "Marketing Digital", categorySlug: "marketing-digital",
    image: "campaign", freelancer: { name: "Fatou S.", avatar: "FS", level: "Top Rated", country: "Senegal" },
    rating: 4.7, reviewCount: 312, price: 95, deliveryDays: 3, favorited: false,
  },
  {
    id: "ms4", slug: "redaction-articles-blog-seo", title: "Redaction d'articles de blog optimises SEO",
    category: "Redaction", categorySlug: "redaction",
    image: "edit_note", freelancer: { name: "Amina D.", avatar: "AD", level: "Confirme", country: "Senegal" },
    rating: 4.6, reviewCount: 156, price: 60, deliveryDays: 2, favorited: false,
  },
  {
    id: "ms5", slug: "traduction-francais-anglais-professionnelle", title: "Traduction francais-anglais professionnelle",
    category: "Traduction", categorySlug: "traduction",
    image: "translate", freelancer: { name: "Sophie M.", avatar: "SM", level: "Top Rated", country: "Belgique" },
    rating: 4.9, reviewCount: 198, price: 45, deliveryDays: 2, favorited: false,
  },
  {
    id: "ms6", slug: "montage-video-pub-instagram", title: "Montage video publicitaire pour Instagram & TikTok",
    category: "Video & Animation", categorySlug: "video-animation",
    image: "videocam", freelancer: { name: "Youssef M.", avatar: "YM", level: "Confirme", country: "Maroc" },
    rating: 4.5, reviewCount: 89, price: 150, deliveryDays: 5, favorited: false,
  },
  {
    id: "ms7", slug: "chatbot-ia-customer-service", title: "Chatbot IA pour service client automatise",
    category: "IA & Data", categorySlug: "ia-data",
    image: "smart_toy", freelancer: { name: "Marc T.", avatar: "MT", level: "Elite", country: "Cameroun" },
    rating: 4.8, reviewCount: 145, price: 250, deliveryDays: 10, favorited: false,
  },
  {
    id: "ms8", slug: "application-mobile-react-native", title: "Application mobile React Native cross-platform",
    category: "Mobile", categorySlug: "mobile",
    image: "smartphone", freelancer: { name: "Gildas L.", avatar: "GL", level: "Top Rated", country: "Cote d'Ivoire" },
    rating: 4.9, reviewCount: 342, price: 350, deliveryDays: 14, favorited: false,
  },
  {
    id: "ms9", slug: "audit-seo-technique-complet", title: "Audit SEO technique complet de votre site web",
    category: "SEO", categorySlug: "seo",
    image: "travel_explore", freelancer: { name: "Fatou S.", avatar: "FS", level: "Top Rated", country: "Senegal" },
    rating: 4.7, reviewCount: 267, price: 200, deliveryDays: 7, favorited: false,
  },
  {
    id: "ms10", slug: "test-penetration-securite-web", title: "Test de penetration et audit securite web",
    category: "Cybersecurite", categorySlug: "cybersecurite",
    image: "security", freelancer: { name: "Ibrahim K.", avatar: "IK", level: "Elite", country: "Mali" },
    rating: 4.9, reviewCount: 78, price: 400, deliveryDays: 10, favorited: false,
  },
  {
    id: "ms11", slug: "logo-design-identite-visuelle", title: "Logo design et identite visuelle complete",
    category: "Design UI/UX", categorySlug: "design-ui-ux",
    image: "palette", freelancer: { name: "Claire B.", avatar: "CB", level: "Elite", country: "France" },
    rating: 4.8, reviewCount: 340, price: 85, deliveryDays: 3, favorited: false,
  },
  {
    id: "ms12", slug: "api-backend-nodejs-fastify", title: "API backend Node.js avec Fastify et Prisma",
    category: "Developpement Web", categorySlug: "developpement-web",
    image: "code", freelancer: { name: "Gildas L.", avatar: "GL", level: "Top Rated", country: "Cote d'Ivoire" },
    rating: 4.9, reviewCount: 198, price: 250, deliveryDays: 10, favorited: false,
  },
  {
    id: "ms13", slug: "community-management-mensuel", title: "Community management mensuel pour vos reseaux",
    category: "Marketing Digital", categorySlug: "marketing-digital",
    image: "campaign", freelancer: { name: "Awa N.", avatar: "AN", level: "Confirme", country: "Senegal" },
    rating: 4.4, reviewCount: 67, price: 300, deliveryDays: 30, favorited: false,
  },
  {
    id: "ms14", slug: "redaction-contenu-site-web", title: "Redaction complete du contenu de votre site web",
    category: "Redaction", categorySlug: "redaction",
    image: "edit_note", freelancer: { name: "Marie D.", avatar: "MD", level: "Top Rated", country: "France" },
    rating: 4.7, reviewCount: 231, price: 180, deliveryDays: 7, favorited: false,
  },
  {
    id: "ms15", slug: "traduction-arabe-francais-technique", title: "Traduction arabe-francais documents techniques",
    category: "Traduction", categorySlug: "traduction",
    image: "translate", freelancer: { name: "Hassan R.", avatar: "HR", level: "Confirme", country: "Maroc" },
    rating: 4.6, reviewCount: 102, price: 55, deliveryDays: 3, favorited: false,
  },
  {
    id: "ms16", slug: "animation-motion-design-logo", title: "Animation motion design pour votre logo",
    category: "Video & Animation", categorySlug: "video-animation",
    image: "videocam", freelancer: { name: "Kofi A.", avatar: "KA", level: "Nouveau", country: "Cote d'Ivoire" },
    rating: 4.2, reviewCount: 23, price: 75, deliveryDays: 4, favorited: false,
  },
  {
    id: "ms17", slug: "analyse-donnees-dashboard-power-bi", title: "Analyse de donnees et dashboard Power BI",
    category: "IA & Data", categorySlug: "ia-data",
    image: "smart_toy", freelancer: { name: "Nadia T.", avatar: "NT", level: "Top Rated", country: "Cameroun" },
    rating: 4.8, reviewCount: 178, price: 200, deliveryDays: 5, favorited: false,
  },
  {
    id: "ms18", slug: "application-flutter-ios-android", title: "Application Flutter pour iOS et Android",
    category: "Mobile", categorySlug: "mobile",
    image: "smartphone", freelancer: { name: "Oumar S.", avatar: "OS", level: "Confirme", country: "Mali" },
    rating: 4.5, reviewCount: 56, price: 280, deliveryDays: 14, favorited: false,
  },
  {
    id: "ms19", slug: "optimisation-seo-on-page", title: "Optimisation SEO on-page pour e-commerce",
    category: "SEO", categorySlug: "seo",
    image: "travel_explore", freelancer: { name: "Pierre L.", avatar: "PL", level: "Top Rated", country: "France" },
    rating: 4.6, reviewCount: 189, price: 150, deliveryDays: 5, favorited: false,
  },
  {
    id: "ms20", slug: "formation-securite-informatique", title: "Formation en securite informatique pour equipes",
    category: "Cybersecurite", categorySlug: "cybersecurite",
    image: "security", freelancer: { name: "Bamba D.", avatar: "BD", level: "Confirme", country: "Burkina Faso" },
    rating: 4.3, reviewCount: 34, price: 500, deliveryDays: 7, favorited: false,
  },
  {
    id: "ms21", slug: "ecommerce-shopify-custom", title: "Boutique e-commerce Shopify personnalisee",
    category: "Developpement Web", categorySlug: "developpement-web",
    image: "code", freelancer: { name: "Amina D.", avatar: "AD", level: "Confirme", country: "Senegal" },
    rating: 4.5, reviewCount: 112, price: 180, deliveryDays: 7, favorited: false,
  },
  {
    id: "ms22", slug: "design-system-figma-complet", title: "Design system Figma complet pour votre produit",
    category: "Design UI/UX", categorySlug: "design-ui-ux",
    image: "palette", freelancer: { name: "Nadia T.", avatar: "NT", level: "Elite", country: "Cameroun" },
    rating: 4.9, reviewCount: 256, price: 350, deliveryDays: 10, favorited: false,
  },
  {
    id: "ms23", slug: "campagne-google-ads-optimisee", title: "Campagne Google Ads optimisee et geree",
    category: "Marketing Digital", categorySlug: "marketing-digital",
    image: "campaign", freelancer: { name: "Pierre L.", avatar: "PL", level: "Top Rated", country: "France" },
    rating: 4.7, reviewCount: 145, price: 220, deliveryDays: 5, favorited: false,
  },
  {
    id: "ms24", slug: "script-automatisation-python", title: "Script d'automatisation Python sur mesure",
    category: "IA & Data", categorySlug: "ia-data",
    image: "smart_toy", freelancer: { name: "Marc T.", avatar: "MT", level: "Elite", country: "Cameroun" },
    rating: 4.8, reviewCount: 167, price: 130, deliveryDays: 5, favorited: false,
  },
  {
    id: "ms25", slug: "wordpress-theme-custom", title: "Theme WordPress personnalise et responsive",
    category: "Developpement Web", categorySlug: "developpement-web",
    image: "code", freelancer: { name: "Kofi A.", avatar: "KA", level: "Nouveau", country: "Cote d'Ivoire" },
    rating: 4.1, reviewCount: 18, price: 90, deliveryDays: 5, favorited: false,
  },
  {
    id: "ms26", slug: "voix-off-professionnelle-francais", title: "Voix-off professionnelle en francais",
    category: "Video & Animation", categorySlug: "video-animation",
    image: "videocam", freelancer: { name: "Awa N.", avatar: "AN", level: "Confirme", country: "Senegal" },
    rating: 4.6, reviewCount: 89, price: 40, deliveryDays: 2, favorited: false,
  },
];

// ============================================================
// Sub-components
// ============================================================

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const iconSize = size === "sm" ? "text-sm" : "text-base";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={cn(
            "material-symbols-outlined",
            iconSize,
            star <= Math.floor(rating) ? "text-accent" : star - 0.5 <= rating ? "text-accent" : "text-slate-300 dark:text-slate-600"
          )}
          style={star <= Math.floor(rating) ? { fontVariationSettings: "'FILL' 1" } : star - 0.5 <= rating ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          {star <= Math.floor(rating) ? "star" : star - 0.5 <= rating ? "star_half" : "star"}
        </span>
      ))}
    </div>
  );
}

function LevelBadge({ level }: { level: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    "Nouveau": { bg: "bg-slate-500/15 dark:bg-slate-500/20", text: "text-slate-600 dark:text-slate-400" },
    "Confirme": { bg: "bg-blue-500/15 dark:bg-blue-500/20", text: "text-blue-600 dark:text-blue-400" },
    "Top Rated": { bg: "bg-primary/15 dark:bg-primary/20", text: "text-primary" },
    "Elite": { bg: "bg-accent/15 dark:bg-accent/20", text: "text-amber-600 dark:text-accent" },
  };
  const c = config[level] ?? config["Nouveau"];
  return (
    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap", c.bg, c.text)}>
      {level}
    </span>
  );
}

function ServiceCard({
  service,
  view,
  format,
  onToggleFavorite,
}: {
  service: MarketplaceService;
  view: "grid" | "list";
  format: (n: number) => string;
  onToggleFavorite: (id: string) => void;
}) {
  const catIcon = CATEGORIES.find((c) => c.slug === service.categorySlug)?.icon ?? "category";
  const gradient = CATEGORY_GRADIENTS[service.categorySlug] ?? "from-primary/80 to-teal-800/80";

  if (view === "list") {
    return (
      <Link
        href={`/services/${service.slug}`}
        className="group flex flex-col sm:flex-row gap-4 bg-white dark:bg-neutral-dark rounded-xl border border-slate-200 dark:border-border-dark hover:border-primary/40 dark:hover:border-primary/40 hover:shadow-lg transition-all p-3"
      >
        {/* Image */}
        <div className="relative w-full sm:w-56 h-40 sm:h-36 rounded-lg overflow-hidden flex-shrink-0">
          <div className={cn("absolute inset-0 bg-gradient-to-br flex items-center justify-center", gradient)}>
            <span className="material-symbols-outlined text-white/80 text-5xl">{catIcon}</span>
          </div>
          <div className="absolute top-2 left-2">
            <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md">
              {service.category}
            </span>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(service.id); }}
            className={cn(
              "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all",
              service.favorited
                ? "bg-red-500 text-white"
                : "bg-black/30 backdrop-blur-sm text-white hover:bg-red-500"
            )}
          >
            <span className="material-symbols-outlined text-sm" style={service.favorited ? { fontVariationSettings: "'FILL' 1" } : {}}>
              favorite
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                {service.freelancer.avatar}
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{service.freelancer.name}</span>
              <LevelBadge level={service.freelancer.level} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 mb-2">
              {service.title}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <StarRating rating={service.rating} />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{service.rating}</span>
              <span className="text-xs text-slate-500">({service.reviewCount})</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span className="material-symbols-outlined text-sm">schedule</span>
              {service.deliveryDays}j
            </div>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white">
              A partir de {format(service.price)}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col bg-white dark:bg-neutral-dark rounded-xl border border-slate-200 dark:border-border-dark hover:border-primary/40 dark:hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className={cn("absolute inset-0 bg-gradient-to-br flex items-center justify-center group-hover:scale-105 transition-transform duration-300", gradient)}>
          <span className="material-symbols-outlined text-white/80 text-6xl">{catIcon}</span>
        </div>
        <div className="absolute top-2.5 left-2.5">
          <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
            {service.category}
          </span>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(service.id); }}
          className={cn(
            "absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all",
            service.favorited
              ? "bg-red-500 text-white"
              : "bg-black/30 backdrop-blur-sm text-white hover:bg-red-500"
          )}
        >
          <span className="material-symbols-outlined text-sm" style={service.favorited ? { fontVariationSettings: "'FILL' 1" } : {}}>
            favorite
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Freelancer */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0">
            {service.freelancer.avatar}
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{service.freelancer.name}</span>
          <LevelBadge level={service.freelancer.level} />
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 mb-3 flex-1">
          {service.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={service.rating} />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{service.rating}</span>
          <span className="text-xs text-slate-500">({service.reviewCount})</span>
        </div>

        {/* Divider + Price */}
        <div className="border-t border-slate-100 dark:border-border-dark pt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span className="material-symbols-outlined text-sm">schedule</span>
            {service.deliveryDays}j
          </div>
          <p className="text-sm font-extrabold text-slate-900 dark:text-white">
            A partir de {format(service.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ============================================================
// Filter Sidebar (Desktop + Mobile Drawer)
// ============================================================

interface FilterState {
  categories: string[];
  priceMin: string;
  priceMax: string;
  delivery: string;
  minRating: number;
  sellerLevels: string[];
  country: string;
  search: string;
}

const defaultFilters: FilterState = {
  categories: [],
  priceMin: "",
  priceMax: "",
  delivery: "all",
  minRating: 0,
  sellerLevels: [],
  country: "Tous",
  search: "",
};

function FilterSidebar({
  filters,
  onChange,
  onReset,
  className,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onReset: () => void;
  className?: string;
}) {
  const toggleCategory = (slug: string) => {
    const next = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug];
    onChange({ ...filters, categories: next });
  };

  const toggleSellerLevel = (level: string) => {
    const next = filters.sellerLevels.includes(level)
      ? filters.sellerLevels.filter((l) => l !== level)
      : [...filters.sellerLevels, level];
    onChange({ ...filters, sellerLevels: next });
  };

  const hasFilters =
    filters.categories.length > 0 ||
    filters.priceMin !== "" ||
    filters.priceMax !== "" ||
    filters.delivery !== "all" ||
    filters.minRating > 0 ||
    filters.sellerLevels.length > 0 ||
    filters.country !== "Tous";

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Categories</h4>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.slug)}
                onChange={() => toggleCategory(cat.slug)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary/30 accent-primary"
              />
              <span className="material-symbols-outlined text-sm text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">{cat.icon}</span>
              <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Fourchette de prix (EUR)</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin}
            onChange={(e) => onChange({ ...filters, priceMin: e.target.value })}
            className="w-full bg-white dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
          <span className="text-slate-400 text-xs">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax}
            onChange={(e) => onChange({ ...filters, priceMax: e.target.value })}
            className="w-full bg-white dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Delivery Time */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Delai de livraison</h4>
        <select
          value={filters.delivery}
          onChange={(e) => onChange({ ...filters, delivery: e.target.value })}
          className="w-full bg-white dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        >
          {DELIVERY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Note minimale</h4>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="radio"
              name="rating"
              checked={filters.minRating === 0}
              onChange={() => onChange({ ...filters, minRating: 0 })}
              className="w-4 h-4 border-slate-300 dark:border-slate-600 text-primary focus:ring-primary/30 accent-primary"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Toutes les notes</span>
          </label>
          {RATING_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === opt.value}
                onChange={() => onChange({ ...filters, minRating: opt.value })}
                className="w-4 h-4 border-slate-300 dark:border-slate-600 text-primary focus:ring-primary/30 accent-primary"
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: opt.value }).map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-sm text-accent" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
                <span className="text-sm text-slate-700 dark:text-slate-300 ml-1">& +</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Seller Level */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Niveau du vendeur</h4>
        <div className="space-y-1.5">
          {SELLER_LEVELS.map((level) => (
            <label key={level} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.sellerLevels.includes(level)}
                onChange={() => toggleSellerLevel(level)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary/30 accent-primary"
              />
              <LevelBadge level={level} />
            </label>
          ))}
        </div>
      </div>

      {/* Country */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Pays</h4>
        <select
          value={filters.country}
          onChange={(e) => onChange({ ...filters, country: e.target.value })}
          className="w-full bg-white dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        >
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Reset */}
      {hasFilters && (
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-slate-200 dark:border-border-dark text-sm font-semibold text-slate-600 dark:text-slate-400 hover:border-red-400 hover:text-red-500 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">restart_alt</span>
          Reinitialiser les filtres
        </button>
      )}
    </div>
  );
}

// ============================================================
// Pagination
// ============================================================

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
}) {
  if (total <= 1) return null;

  const pages: (number | "ellipsis")[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("ellipsis");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push("ellipsis");
    pages.push(total);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-border-dark text-slate-500 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <span className="material-symbols-outlined text-sm">chevron_left</span>
      </button>
      {pages.map((page, idx) =>
        page === "ellipsis" ? (
          <span key={`e-${idx}`} className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={cn(
              "w-9 h-9 rounded-lg text-sm font-bold transition-colors",
              page === current
                ? "bg-primary text-white"
                : "border border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary"
            )}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-border-dark text-slate-500 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <span className="material-symbols-outlined text-sm">chevron_right</span>
      </button>
    </div>
  );
}

// ============================================================
// Main Page Component
// ============================================================

export default function ExplorerPage() {
  const { format } = useCurrencyStore();

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sort, setSort] = useState("pertinence");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [services, setServices] = useState(DEMO_SERVICES);

  // ---- Toggle favorite ----
  const toggleFavorite = useCallback((id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, favorited: !s.favorited } : s))
    );
  }, []);

  // ---- Filtering ----
  const filtered = useMemo(() => {
    let result = [...services];

    // Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.freelancer.name.toLowerCase().includes(q)
      );
    }

    // Categories
    if (filters.categories.length > 0) {
      result = result.filter((s) => filters.categories.includes(s.categorySlug));
    }

    // Price
    if (filters.priceMin !== "") {
      result = result.filter((s) => s.price >= Number(filters.priceMin));
    }
    if (filters.priceMax !== "") {
      result = result.filter((s) => s.price <= Number(filters.priceMax));
    }

    // Delivery
    if (filters.delivery !== "all") {
      const [minStr, maxStr] = filters.delivery.split("-");
      const min = Number(minStr);
      const max = Number(maxStr);
      result = result.filter((s) => s.deliveryDays >= min && s.deliveryDays <= max);
    }

    // Rating
    if (filters.minRating > 0) {
      result = result.filter((s) => s.rating >= filters.minRating);
    }

    // Seller levels
    if (filters.sellerLevels.length > 0) {
      result = result.filter((s) => filters.sellerLevels.includes(s.freelancer.level));
    }

    // Country
    if (filters.country !== "Tous") {
      result = result.filter((s) => s.freelancer.country === filters.country);
    }

    return result;
  }, [services, filters]);

  // ---- Sorting ----
  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "prix_asc":
        arr.sort((a, b) => a.price - b.price);
        break;
      case "prix_desc":
        arr.sort((a, b) => b.price - a.price);
        break;
      case "note":
        arr.sort((a, b) => b.rating - a.rating);
        break;
      case "recent":
        arr.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case "populaire":
        arr.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        break;
    }
    return arr;
  }, [filtered, sort]);

  // ---- Pagination ----
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paged = useMemo(
    () => sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [sorted, page]
  );

  // Reset page when filters change
  const updateFilters = useCallback((f: FilterState) => {
    setFilters(f);
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPage(1);
  }, []);

  const activeFilterCount =
    filters.categories.length +
    (filters.priceMin !== "" ? 1 : 0) +
    (filters.priceMax !== "" ? 1 : 0) +
    (filters.delivery !== "all" ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    filters.sellerLevels.length +
    (filters.country !== "Tous" ? 1 : 0);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* ---- Header ---- */}
      <div className="border-b border-slate-200 dark:border-border-dark bg-white dark:bg-neutral-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
            Explorer les Services
          </h1>
          {/* Search bar */}
          <div className="relative max-w-2xl">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
            <input
              type="text"
              placeholder="Rechercher un service, une competence, un freelance..."
              value={filters.search}
              onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
            {filters.search && (
              <button
                onClick={() => updateFilters({ ...filters, search: "" })}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ---- Main content ---- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* ---- Filter Sidebar (Desktop) ---- */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white dark:bg-neutral-dark rounded-xl border border-slate-200 dark:border-border-dark p-5 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">filter_list</span>
                Filtres
                {activeFilterCount > 0 && (
                  <span className="ml-auto bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </h3>
              <FilterSidebar
                filters={filters}
                onChange={updateFilters}
                onReset={resetFilters}
              />
            </div>
          </aside>

          {/* ---- Results area ---- */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-border-dark text-sm font-semibold hover:border-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">filter_list</span>
                  Filtres
                  {activeFilterCount > 0 && (
                    <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-800 dark:text-white">{sorted.length}</span> services trouves
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-white dark:bg-neutral-dark border border-slate-200 dark:border-border-dark rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>

                {/* View toggle */}
                <div className="hidden sm:flex items-center border border-slate-200 dark:border-border-dark rounded-lg overflow-hidden">
                  <button
                    onClick={() => setView("grid")}
                    className={cn(
                      "p-2 transition-colors",
                      view === "grid" ? "bg-primary text-white" : "text-slate-500 hover:text-primary"
                    )}
                  >
                    <span className="material-symbols-outlined text-sm">grid_view</span>
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={cn(
                      "p-2 transition-colors",
                      view === "list" ? "bg-primary text-white" : "text-slate-500 hover:text-primary"
                    )}
                  >
                    <span className="material-symbols-outlined text-sm">view_list</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Service grid / list */}
            {paged.length > 0 ? (
              <div
                className={cn(
                  view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5"
                    : "flex flex-col gap-4"
                )}
              >
                {paged.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    view={view}
                    format={format}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-border-dark flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl text-slate-400">search_off</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Aucun service trouve</h3>
                <p className="text-sm text-slate-500 max-w-md mb-5">
                  Aucun service ne correspond a vos criteres de recherche. Essayez de modifier vos filtres ou d&apos;elargir votre recherche.
                </p>
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">restart_alt</span>
                  Reinitialiser les filtres
                </button>
              </div>
            )}

            {/* Pagination */}
            <Pagination current={page} total={totalPages} onChange={setPage} />
          </div>
        </div>
      </div>

      {/* ---- Mobile Filter Drawer ---- */}
      {mobileFiltersOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white dark:bg-neutral-dark border-r border-slate-200 dark:border-border-dark shadow-2xl lg:hidden animate-slide-in overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-border-dark">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-base">filter_list</span>
                Filtres
              </h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-border-dark transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-5">
              <FilterSidebar
                filters={filters}
                onChange={updateFilters}
                onReset={resetFilters}
              />
            </div>
            <div className="sticky bottom-0 p-5 bg-white dark:bg-neutral-dark border-t border-slate-200 dark:border-border-dark">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                Voir {sorted.length} resultats
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
