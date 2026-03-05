"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { useDashboardStore } from "@/store/dashboard";
import { useCurrencyStore } from "@/store/currency";
import { cn } from "@/lib/utils";

// ============================================================
// Types
// ============================================================

interface Review {
  id: string;
  author: string;
  avatar: string;
  country: string;
  rating: number;
  date: string;
  text: string;
  response?: string;
}

interface VendorInfo {
  type: "freelance" | "agency";
  id: string;
  name: string;
  avatar: string;
  title: string;
  location: string;
  countryFlag: string;
  memberSince: string;
  online: boolean;
  badges: string[];
  stats: {
    completedOrders: number;
    satisfactionRate: number;
    avgResponseTime: string;
    onTimeDelivery: number;
    recurringClients: number;
  };
  skills: string[];
}

interface OtherService {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
}

// ============================================================
// Demo data
// ============================================================

const DEMO_REVIEWS: Review[] = [
  { id: "r1", author: "Aminata Diallo", avatar: "AD", country: "SN", rating: 5, date: "2026-02-18", text: "Travail exceptionnel ! La qualite du livrable a depasse toutes mes attentes. Communication fluide et livraison avant la deadline. Je recommande vivement.", response: "Merci Aminata ! C'est un plaisir de travailler avec des clients aussi clairs dans leurs besoins." },
  { id: "r2", author: "Pierre Martin", avatar: "PM", country: "FR", rating: 4, date: "2026-02-05", text: "Tres bon travail dans l'ensemble. Le resultat est professionnel et bien fini. Petite revision demandee qui a ete prise en compte rapidement." },
  { id: "r3", author: "Kwame Asante", avatar: "KA", country: "CI", rating: 5, date: "2026-01-22", text: "Excellent freelance, tres reactif et competent. Le rendu final est exactement ce que j'attendais. Collaboration agreable du debut a la fin." },
  { id: "r4", author: "Sophie Lefebvre", avatar: "SL", country: "FR", rating: 5, date: "2026-01-10", text: "Deuxieme commande avec ce freelance et toujours aussi satisfaite. Qualite au rendez-vous, delais respectes. Mon freelance de reference !" },
  { id: "r5", author: "Oumar Traore", avatar: "OT", country: "ML", rating: 4, date: "2025-12-28", text: "Bon rapport qualite/prix. Le livrable est propre et fonctionnel. Je reviendrai pour d'autres projets." },
];

const DEMO_VENDOR: VendorInfo = {
  type: "freelance",
  id: "alexandre-rivera",
  name: "Alexandre Rivera",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  title: "Developpeur Full-Stack Senior",
  location: "Paris, France",
  countryFlag: "\ud83c\uddeb\ud83c\uddf7",
  memberSince: "Janvier 2024",
  online: true,
  badges: ["verified", "top_rated", "pro"],
  stats: {
    completedOrders: 247,
    satisfactionRate: 98,
    avgResponseTime: "2h",
    onTimeDelivery: 96,
    recurringClients: 42,
  },
  skills: ["React / Next.js", "Node.js", "TypeScript", "UI/UX Design", "PostgreSQL"],
};

const VENDOR_OTHER_SERVICES: OtherService[] = [
  { id: "vos1", title: "Application React / Next.js complete", price: 2000, rating: 5.0, reviews: 32, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop", category: "Developpement Web" },
  { id: "vos2", title: "Design UI/UX et maquettes Figma", price: 400, rating: 4.8, reviews: 28, image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=250&fit=crop", category: "Design UI/UX" },
  { id: "vos3", title: "API REST & Backend Node.js", price: 800, rating: 4.9, reviews: 19, image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop", category: "Backend & API" },
  { id: "vos4", title: "Audit technique & optimisation performance", price: 300, rating: 5.0, reviews: 12, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop", category: "Consulting" },
];

const SIMILAR_SERVICES: OtherService[] = [
  { id: "sim1", title: "Developpement site web WordPress sur mesure", price: 350, rating: 4.7, reviews: 56, image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&h=250&fit=crop", category: "Developpement Web" },
  { id: "sim2", title: "Creation de landing page Webflow", price: 250, rating: 4.8, reviews: 41, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop", category: "Developpement Web" },
  { id: "sim3", title: "Application web SaaS full-stack", price: 3000, rating: 4.9, reviews: 22, image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop", category: "Developpement Web" },
  { id: "sim4", title: "Refonte site e-commerce React", price: 1500, rating: 4.6, reviews: 18, image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop", category: "E-commerce" },
];

// ============================================================
// Badge config
// ============================================================

const BADGE_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  verified: { label: "Verifie", icon: "verified", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  top_rated: { label: "Top Rated", icon: "bolt", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  pro: { label: "Pro", icon: "workspace_premium", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
};

// ============================================================
// Helpers
// ============================================================

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const sizeClasses = size === "md" ? "text-lg" : "text-sm";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={cn(
            "material-symbols-outlined",
            sizeClasses,
            star <= rating ? "text-accent" : "text-slate-600"
          )}
          style={star <= rating ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          star
        </span>
      ))}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

// ============================================================
// Small service card component (used for vendor & similar services)
// ============================================================

function ServiceMiniCard({ service, format }: { service: OtherService; format: (n: number) => string }) {
  return (
    <Link
      href={`/services/${service.id}`}
      className="group bg-white dark:bg-neutral-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="aspect-video bg-slate-100 dark:bg-background-dark relative overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary backdrop-blur-sm">
          {service.category}
        </span>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {service.title}
        </h4>
        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={service.rating} />
          <span className="text-xs text-slate-500">{service.rating} ({service.reviews})</span>
        </div>
        <div className="pt-2 border-t border-slate-100 dark:border-border-dark">
          <span className="text-sm font-black text-primary">A partir de {format(service.price)}</span>
        </div>
      </div>
    </Link>
  );
}

// ============================================================
// Main Page Component
// ============================================================

const REVIEWS_PER_PAGE = 3;

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const services = useDashboardStore((s) => s.services);
  const profile = useDashboardStore((s) => s.profile);
  const format = useCurrencyStore((s) => s.format);

  const service = useMemo(() => services.find((s) => s.id === slug), [services, slug]);

  // States
  const [selectedPackage, setSelectedPackage] = useState<"basic" | "standard" | "premium">("standard");
  const [currentImage, setCurrentImage] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [reviewPage, setReviewPage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const totalReviewPages = Math.ceil(DEMO_REVIEWS.length / REVIEWS_PER_PAGE);
  const paginatedReviews = DEMO_REVIEWS.slice(
    reviewPage * REVIEWS_PER_PAGE,
    (reviewPage + 1) * REVIEWS_PER_PAGE
  );

  const avgRating = (DEMO_REVIEWS.reduce((a, r) => a + r.rating, 0) / DEMO_REVIEWS.length).toFixed(1);

  // Related services from same vendor (exclude current)
  const relatedServices = useMemo(
    () => services.filter((s) => s.id !== slug && s.status === "actif").slice(0, 3),
    [services, slug]
  );

  // Gallery images
  const galleryImages = useMemo(() => {
    if (!service) return [];
    return [
      service.image,
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    ];
  }, [service]);

  // ============================================================
  // 404 state
  // ============================================================
  if (!service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-24">
        <div className="bg-neutral-dark border border-border-dark rounded-2xl p-12 text-center max-w-md">
          <span className="material-symbols-outlined text-6xl text-slate-500 mb-4">search_off</span>
          <h1 className="text-2xl font-bold text-white mb-3">Service introuvable</h1>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            Le service que vous recherchez n&apos;existe pas ou a ete supprime.
          </p>
          <Link
            href="/explorer"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl px-6 py-3 text-sm font-bold transition-all"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Retour a l&apos;explorer
          </Link>
        </div>
      </div>
    );
  }

  // ============================================================
  // Package data
  // ============================================================
  const pkg = service.packages[selectedPackage];
  const vendor = DEMO_VENDOR;

  const features = [
    { basic: true, standard: true, premium: true, label: "Livraison dans les delais" },
    { basic: true, standard: true, premium: true, label: "Fichiers source inclus" },
    { basic: false, standard: true, premium: true, label: "Revisions illimitees" },
    { basic: false, standard: true, premium: true, label: "Support prioritaire" },
    { basic: false, standard: false, premium: true, label: "Livraison express" },
    { basic: false, standard: false, premium: true, label: "Consultation strategie" },
  ];

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="min-h-screen bg-background-dark">
      {/* Breadcrumbs */}
      <div className="border-b border-border-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-400">
            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <Link href="/explorer" className="hover:text-primary transition-colors">Explorer</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-500">{service.category}</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-300 font-medium truncate max-w-[200px]">{service.title}</span>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ============================================ */}
          {/* LEFT COLUMN — Main Content */}
          {/* ============================================ */}
          <div className="flex-1 min-w-0">
            {/* Title + favorite */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                    {service.category}
                  </span>
                  {service.tags.length > 0 && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-700 text-slate-300">
                      {service.tags[0]}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {service.title}
                </h1>
              </div>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={cn(
                  "p-3 rounded-xl border transition-all shrink-0",
                  isFavorite
                    ? "bg-red-500/10 border-red-500/30 text-red-500"
                    : "bg-white/5 border-border-dark text-slate-400 hover:text-red-400 hover:border-red-500/30"
                )}
              >
                <span className="material-symbols-outlined" style={isFavorite ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  favorite
                </span>
              </button>
            </div>

            {/* Rating + orders row */}
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-2">
                <StarRating rating={parseFloat(avgRating)} size="md" />
                <span className="text-white font-bold">{avgRating}</span>
                <span className="text-slate-400 text-sm">({DEMO_REVIEWS.length} avis)</span>
              </div>
              <span className="text-slate-600">|</span>
              <span className="text-sm text-slate-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-primary">shopping_cart</span>
                {service.orders} commandes
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-sm text-slate-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-primary">visibility</span>
                {service.views.toLocaleString("fr-FR")} vues
              </span>
            </div>

            {/* Freelancer mini card */}
            <div className="flex items-center gap-4 mb-6 bg-neutral-dark border border-border-dark rounded-xl p-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0 relative">
                <img src={profile.photo} alt={`${profile.firstName} ${profile.lastName}`} className="w-full h-full object-cover" />
                {vendor.online && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-neutral-dark rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link href={`/freelances/${vendor.id}`} className="text-white font-bold text-sm hover:text-primary transition-colors">
                    {vendor.name}
                  </Link>
                  {vendor.badges.slice(0, 2).map((b) => {
                    const cfg = BADGE_CONFIG[b];
                    if (!cfg) return null;
                    return (
                      <span key={b} className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border", cfg.color)}>
                        <span className="material-symbols-outlined text-[10px] fill-icon">{cfg.icon}</span>
                        {cfg.label}
                      </span>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{vendor.title} - {vendor.location} {vendor.countryFlag}</p>
              </div>
              <Link
                href={`/freelances/${vendor.id}`}
                className="text-primary text-xs font-bold hover:underline shrink-0"
              >
                Voir le profil
              </Link>
            </div>

            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative rounded-xl overflow-hidden bg-neutral-dark border border-border-dark aspect-video">
                <img
                  src={galleryImages[currentImage]}
                  alt={`${service.title} - Image ${currentImage + 1}`}
                  className="w-full h-full object-cover"
                />
                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImage((prev) => prev === 0 ? galleryImages.length - 1 : prev - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all"
                    >
                      <span className="material-symbols-outlined text-xl">chevron_left</span>
                    </button>
                    <button
                      onClick={() => setCurrentImage((prev) => prev === galleryImages.length - 1 ? 0 : prev + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all"
                    >
                      <span className="material-symbols-outlined text-xl">chevron_right</span>
                    </button>
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                      {currentImage + 1} / {galleryImages.length}
                    </div>
                  </>
                )}
              </div>
              {galleryImages.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={cn(
                        "w-20 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0",
                        idx === currentImage ? "border-primary" : "border-border-dark hover:border-slate-500 opacity-60 hover:opacity-100"
                      )}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-bold text-white mb-4">Description du service</h2>
                <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line">{service.description}</p>
              </div>

              {/* What's included */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3">Ce qui est inclus</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {features.filter((f) => f.standard).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      {f.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {service.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span key={tag} className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-bold">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: "timer", label: "Delai de livraison", value: `${service.deliveryDays} jours` },
                  { icon: "refresh", label: "Revisions incluses", value: `${service.revisions}` },
                  { icon: "shopping_cart", label: "Commandes", value: `${service.orders}` },
                  { icon: "visibility", label: "Vues", value: service.views.toLocaleString("fr-FR") },
                ].map((stat) => (
                  <div key={stat.label} className="bg-neutral-dark border border-border-dark rounded-xl p-4 text-center">
                    <span className="material-symbols-outlined text-primary text-xl mb-2 block">{stat.icon}</span>
                    <p className="text-white font-bold text-lg">{stat.value}</p>
                    <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* FAQ */}
              {service.faq.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-white mb-4">Questions frequentes</h2>
                  <div className="space-y-2">
                    {service.faq.map((item, idx) => (
                      <div key={idx} className="bg-neutral-dark border border-border-dark rounded-xl overflow-hidden">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                          className="w-full flex items-center justify-between px-5 py-4 text-left"
                        >
                          <span className="text-sm font-bold text-white">{item.question}</span>
                          <span className={cn("material-symbols-outlined text-slate-400 transition-transform", expandedFaq === idx && "rotate-180")}>
                            expand_more
                          </span>
                        </button>
                        {expandedFaq === idx && (
                          <div className="px-5 pb-4 border-t border-border-dark pt-3">
                            <p className="text-slate-300 text-sm leading-relaxed">{item.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ============================================ */}
            {/* Forfaits comparison (3 columns)             */}
            {/* ============================================ */}
            <div className="mt-12 pt-8 border-t border-border-dark">
              <h2 className="text-lg font-bold text-white mb-6">Comparer les forfaits</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(["basic", "standard", "premium"] as const).map((tier) => {
                  const p = service.packages[tier];
                  const isSelected = selectedPackage === tier;
                  return (
                    <button
                      key={tier}
                      onClick={() => setSelectedPackage(tier)}
                      className={cn(
                        "bg-neutral-dark border rounded-xl p-6 text-left transition-all relative",
                        isSelected ? "border-primary ring-1 ring-primary/30" : "border-border-dark hover:border-slate-500"
                      )}
                    >
                      {tier === "standard" && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                          Populaire
                        </div>
                      )}
                      <h3 className="text-white font-bold text-base mb-1">{p.name}</h3>
                      <p className="text-2xl font-extrabold text-primary mb-3">{format(p.price)}</p>
                      <p className="text-slate-400 text-xs leading-relaxed mb-4">{p.description}</p>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-slate-300">
                          <span className="material-symbols-outlined text-sm text-primary">timer</span>
                          Livraison en {p.delivery} jours
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <span className="material-symbols-outlined text-sm text-primary">refresh</span>
                          {p.revisions === 0 ? "Aucune revision" : `${p.revisions} revision${p.revisions > 1 ? "s" : ""}`}
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border-dark space-y-2">
                        {features.map((f, i) => {
                          const included = f[tier];
                          return (
                            <div key={i} className={cn("flex items-center gap-2 text-xs", included ? "text-slate-300" : "text-slate-600 line-through")}>
                              <span className={cn("material-symbols-outlined text-sm", included ? "text-primary" : "text-slate-600")} style={included ? { fontVariationSettings: "'FILL' 1" } : {}}>
                                {included ? "check_circle" : "cancel"}
                              </span>
                              {f.label}
                            </div>
                          );
                        })}
                      </div>
                      <Link
                        href="/connexion?redirect=/services&message=Connectez-vous+pour+commander+ce+service"
                        className={cn(
                          "mt-4 w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all",
                          isSelected
                            ? "bg-primary text-white hover:bg-primary/90"
                            : "bg-white/5 text-slate-300 border border-border-dark hover:border-primary/30 hover:text-primary"
                        )}
                      >
                        <span className="material-symbols-outlined text-sm">shopping_cart</span>
                        Commander
                      </Link>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ============================================ */}
            {/* A propos du vendeur                          */}
            {/* ============================================ */}
            <div className="mt-12 pt-8 border-t border-border-dark">
              <h2 className="text-lg font-bold text-white mb-6">A propos du vendeur</h2>
              <div className="bg-neutral-dark border border-border-dark rounded-xl p-6">
                <div className="flex items-start gap-5">
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-primary/30">
                      <img src={vendor.avatar} alt={vendor.name} className="w-full h-full object-cover" />
                    </div>
                    {vendor.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-neutral-dark rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-white font-bold text-lg">{vendor.name}</h3>
                      {vendor.countryFlag && <span className="text-lg">{vendor.countryFlag}</span>}
                      {vendor.badges.map((b) => {
                        const cfg = BADGE_CONFIG[b];
                        if (!cfg) return null;
                        return (
                          <span key={b} className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border", cfg.color)}>
                            <span className="material-symbols-outlined text-[10px] fill-icon">{cfg.icon}</span>
                            {cfg.label}
                          </span>
                        );
                      })}
                    </div>
                    <p className="text-primary font-medium text-sm">{vendor.title}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-slate-400 text-xs">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        {vendor.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">calendar_month</span>
                        Membre depuis {vendor.memberSince}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className={cn("material-symbols-outlined text-xs", vendor.online ? "text-emerald-500" : "text-slate-500")}>
                          circle
                        </span>
                        {vendor.online ? "En ligne" : "Hors ligne"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vendor stats */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-border-dark">
                  {[
                    { value: vendor.stats.completedOrders.toString(), label: "Commandes" },
                    { value: `${vendor.stats.satisfactionRate}%`, label: "Satisfaction" },
                    { value: vendor.stats.avgResponseTime, label: "Rep. moy." },
                    { value: `${vendor.stats.onTimeDelivery}%`, label: "Dans les delais" },
                    { value: vendor.stats.recurringClients.toString(), label: "Clients recurrents" },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="text-white font-bold text-lg">{s.value}</p>
                      <p className="text-slate-400 text-xs">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Vendor skills */}
                <div className="mt-4 pt-4 border-t border-border-dark">
                  <p className="text-xs font-bold text-slate-400 mb-2">Competences principales</p>
                  <div className="flex flex-wrap gap-2">
                    {vendor.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg border border-primary/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Vendor action buttons */}
                <div className="flex gap-3 mt-6">
                  <Link
                    href={`/freelances/${vendor.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary/10 border border-primary/30 text-primary rounded-xl px-4 py-3 text-sm font-bold hover:bg-primary/20 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">person</span>
                    Voir le profil complet
                  </Link>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-border-dark text-slate-300 hover:text-primary hover:border-primary/30 rounded-xl px-4 py-3 text-sm font-bold transition-all">
                    <span className="material-symbols-outlined text-sm">mail</span>
                    Contacter
                  </button>
                </div>
              </div>
            </div>

            {/* ============================================ */}
            {/* Avis sur ce service                          */}
            {/* ============================================ */}
            <div className="mt-12 pt-8 border-t border-border-dark">
              <h2 className="text-lg font-bold text-white mb-6">Avis sur ce service</h2>

              {/* Rating summary */}
              <div className="bg-neutral-dark border border-border-dark rounded-xl p-6 mb-6">
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="text-center">
                    <p className="text-4xl font-extrabold text-white">{avgRating}</p>
                    <StarRating rating={parseFloat(avgRating)} size="md" />
                    <p className="text-slate-400 text-xs mt-1">{DEMO_REVIEWS.length} avis</p>
                  </div>
                  <div className="flex-1 min-w-[200px] space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = DEMO_REVIEWS.filter((r) => r.rating === stars).length;
                      const pct = DEMO_REVIEWS.length ? (count / DEMO_REVIEWS.length) * 100 : 0;
                      return (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-xs text-slate-400 w-3">{stars}</span>
                          <span className="material-symbols-outlined text-xs text-accent" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-slate-500 w-6 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Individual reviews */}
              <div className="space-y-4">
                {paginatedReviews.map((review) => (
                  <div key={review.id} className="bg-neutral-dark border border-border-dark rounded-xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                        {review.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-sm">{review.author}</span>
                            <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded-full">{review.country}</span>
                          </div>
                          <span className="text-xs text-slate-500">{formatDate(review.date)}</span>
                        </div>
                        <StarRating rating={review.rating} />
                        <p className="text-slate-300 text-sm leading-relaxed mt-3">{review.text}</p>
                        {review.response && (
                          <div className="mt-3 ml-4 pl-4 border-l-2 border-primary/20">
                            <p className="text-xs font-bold text-primary mb-1 flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">reply</span>
                              Reponse du vendeur
                            </p>
                            <p className="text-sm text-slate-400">{review.response}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Review pagination */}
              {totalReviewPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setReviewPage(Math.max(0, reviewPage - 1))}
                    disabled={reviewPage === 0}
                    className="p-2 rounded-lg border border-border-dark disabled:opacity-30 hover:bg-white/5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm text-slate-400">chevron_left</span>
                  </button>
                  {Array.from({ length: totalReviewPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setReviewPage(i)}
                      className={cn(
                        "w-8 h-8 rounded-lg text-xs font-bold transition-colors",
                        i === reviewPage ? "bg-primary text-white" : "border border-border-dark text-slate-500 hover:bg-white/5"
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setReviewPage(Math.min(totalReviewPages - 1, reviewPage + 1))}
                    disabled={reviewPage === totalReviewPages - 1}
                    className="p-2 rounded-lg border border-border-dark disabled:opacity-30 hover:bg-white/5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
                  </button>
                </div>
              )}
            </div>

            {/* ============================================ */}
            {/* Autres services du vendeur                   */}
            {/* ============================================ */}
            <div className="mt-12 pt-8 border-t border-border-dark">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Autres services de {vendor.name}</h2>
                <Link
                  href={`/freelances/${vendor.id}`}
                  className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
                >
                  Voir tous ses services
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {VENDOR_OTHER_SERVICES.slice(0, 4).map((s) => (
                  <ServiceMiniCard key={s.id} service={s} format={format} />
                ))}
              </div>
            </div>

            {/* ============================================ */}
            {/* Services similaires (autres vendeurs)        */}
            {/* ============================================ */}
            <div className="mt-12 pt-8 border-t border-border-dark">
              <h2 className="text-lg font-bold text-white mb-6">Services similaires</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {SIMILAR_SERVICES.map((s) => (
                  <ServiceMiniCard key={s.id} service={s} format={format} />
                ))}
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* RIGHT COLUMN — Sticky Sidebar */}
          {/* ============================================ */}
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <div className="bg-neutral-dark border border-border-dark rounded-xl overflow-hidden">
                {/* Package tabs */}
                <div className="flex border-b border-border-dark">
                  {(["basic", "standard", "premium"] as const).map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setSelectedPackage(tier)}
                      className={cn(
                        "flex-1 py-3.5 text-xs font-bold transition-all text-center",
                        selectedPackage === tier
                          ? "bg-primary/10 text-primary border-b-2 border-primary"
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                      )}
                    >
                      {service.packages[tier].name}
                    </button>
                  ))}
                </div>

                {/* Package details */}
                <div className="p-6 space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-bold text-base">{pkg.name}</h3>
                      <p className="text-2xl font-extrabold text-primary">{format(pkg.price)}</p>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{pkg.description}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="material-symbols-outlined text-base text-primary">timer</span>
                      {pkg.delivery} jours
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="material-symbols-outlined text-base text-primary">refresh</span>
                      {pkg.revisions === 0 ? "0 revision" : `${pkg.revisions} revision${pkg.revisions > 1 ? "s" : ""}`}
                    </div>
                  </div>

                  <div className="space-y-2.5 py-4 border-t border-b border-border-dark">
                    {features.map((f, i) => {
                      const included = f[selectedPackage];
                      return (
                        <div key={i} className={cn("flex items-center gap-2 text-sm", included ? "text-slate-300" : "text-slate-600")}>
                          <span
                            className={cn("material-symbols-outlined text-base", included ? "text-primary" : "text-slate-600")}
                            style={included ? { fontVariationSettings: "'FILL' 1" } : {}}
                          >
                            {included ? "check_circle" : "cancel"}
                          </span>
                          <span className={cn(!included && "line-through")}>{f.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Extras */}
                  {service.extras.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Extras disponibles</h4>
                      <div className="space-y-2">
                        {service.extras.map((extra, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-background-dark rounded-lg px-4 py-2.5 border border-border-dark">
                            <span className="text-sm text-slate-300">{extra.label}</span>
                            <span className="text-sm font-bold text-primary">+{format(extra.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA Buttons */}
                  <div className="space-y-3 pt-2">
                    <Link
                      href="/connexion?redirect=/services&message=Connectez-vous+pour+commander+ce+service"
                      className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl px-6 py-3.5 text-sm font-bold shadow-lg shadow-primary/20 transition-all"
                    >
                      <span className="material-symbols-outlined text-base">shopping_cart</span>
                      Commander ce forfait
                    </Link>
                    <button className="w-full flex items-center justify-center gap-2 bg-transparent border border-border-dark hover:border-primary/50 text-slate-300 hover:text-primary rounded-xl px-6 py-3.5 text-sm font-bold transition-all">
                      <span className="material-symbols-outlined text-base">mail</span>
                      Contacter le vendeur
                    </button>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="border-t border-border-dark px-6 py-4">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-base text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                    <span>Paiement 100% securise via escrow</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                    <span className="material-symbols-outlined text-base text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
                    <span>Support disponible 7j/7</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                    <span className="material-symbols-outlined text-base text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>undo</span>
                    <span>Satisfait ou rembourse</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
