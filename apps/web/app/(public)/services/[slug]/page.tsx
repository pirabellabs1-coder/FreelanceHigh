"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { useDashboardStore } from "@/store/dashboard";
import { useCurrencyStore } from "@/store/currency";
import { cn } from "@/lib/utils";

// ============================================================
// Fake reviews for demo
// ============================================================
interface Review {
  id: string;
  author: string;
  avatar: string;
  country: string;
  rating: number;
  date: string;
  text: string;
}

const DEMO_REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Aminata Diallo",
    avatar: "AD",
    country: "SN",
    rating: 5,
    date: "2026-02-18",
    text: "Travail exceptionnel ! La qualite du livrable a depassé toutes mes attentes. Communication fluide et livraison avant la deadline. Je recommande vivement.",
  },
  {
    id: "r2",
    author: "Pierre Martin",
    avatar: "PM",
    country: "FR",
    rating: 4,
    date: "2026-02-05",
    text: "Tres bon travail dans l'ensemble. Le resultat est professionnel et bien fini. Petite revision demandee qui a ete prise en compte rapidement.",
  },
  {
    id: "r3",
    author: "Kwame Asante",
    avatar: "KA",
    country: "CI",
    rating: 5,
    date: "2026-01-22",
    text: "Excellent freelance, tres reactif et competent. Le rendu final est exactement ce que j'attendais. Collaboration agreable du debut a la fin.",
  },
  {
    id: "r4",
    author: "Sophie Lefebvre",
    avatar: "SL",
    country: "FR",
    rating: 5,
    date: "2026-01-10",
    text: "Deuxieme commande avec ce freelance et toujours aussi satisfaite. Qualite au rendez-vous, delais respectes. Mon freelance de reference sur la plateforme !",
  },
  {
    id: "r5",
    author: "Oumar Traore",
    avatar: "OT",
    country: "ML",
    rating: 4,
    date: "2025-12-28",
    text: "Bon rapport qualite/prix. Le livrable est propre et fonctionnel. Je reviendrai pour d'autres projets.",
  },
];

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
// Main Page Component
// ============================================================
export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const services = useDashboardStore((s) => s.services);
  const profile = useDashboardStore((s) => s.profile);
  const format = useCurrencyStore((s) => s.format);

  const service = useMemo(() => services.find((s) => s.id === slug), [services, slug]);

  // States
  const [activeTab, setActiveTab] = useState<"apropos" | "forfaits" | "profil" | "avis">("apropos");
  const [selectedPackage, setSelectedPackage] = useState<"basic" | "standard" | "premium">("standard");
  const [currentImage, setCurrentImage] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Related services (exclude current, limit 3)
  const relatedServices = useMemo(
    () =>
      services
        .filter((s) => s.id !== slug && s.status === "actif")
        .slice(0, 3),
    [services, slug]
  );

  // Gallery images (use the service image + some demo placeholders)
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
          <span className="material-symbols-outlined text-6xl text-slate-500 mb-4">
            search_off
          </span>
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
  // Package data for sidebar
  // ============================================================
  const pkg = service.packages[selectedPackage];

  const packageFeatures: Record<string, { basic: boolean; standard: boolean; premium: boolean; label: string }[]> = {
    [service.id]: [
      { basic: true, standard: true, premium: true, label: "Livraison dans les delais" },
      { basic: true, standard: true, premium: true, label: "Fichiers source inclus" },
      { basic: false, standard: true, premium: true, label: "Revisions illimitees" },
      { basic: false, standard: true, premium: true, label: "Support prioritaire" },
      { basic: false, standard: false, premium: true, label: "Livraison express" },
      { basic: false, standard: false, premium: true, label: "Consultation strategie" },
    ],
  };

  const features = packageFeatures[service.id] || [
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
            <Link href="/" className="hover:text-primary transition-colors">
              Accueil
            </Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <Link href="/explorer" className="hover:text-primary transition-colors">
              Explorer
            </Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-500">{service.category}</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-300 font-medium truncate max-w-[200px]">
              {service.title}
            </span>
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
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-tight">
              {service.title}
            </h1>

            {/* Freelancer mini card */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">
                <img
                  src={profile.photo}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/freelances/${profile.username}`}
                    className="text-white font-bold text-sm hover:text-primary transition-colors"
                  >
                    {profile.firstName} {profile.lastName}
                  </Link>
                  <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-bold">
                    <span
                      className="material-symbols-outlined text-xs"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                    Pro
                  </span>
                  <span className="text-xs text-slate-500">
                    {profile.city}, {profile.country}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <StarRating rating={5} />
                  <span className="text-xs text-slate-400 font-medium">
                    4.9 ({service.orders + 15} avis)
                  </span>
                  <span className="text-xs text-slate-500">|</span>
                  <span className="text-xs text-slate-400">
                    {service.orders} commandes
                  </span>
                </div>
              </div>
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
                      onClick={() =>
                        setCurrentImage((prev) =>
                          prev === 0 ? galleryImages.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all"
                    >
                      <span className="material-symbols-outlined text-xl">chevron_left</span>
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImage((prev) =>
                          prev === galleryImages.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all"
                    >
                      <span className="material-symbols-outlined text-xl">chevron_right</span>
                    </button>
                    {/* Image counter */}
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                      {currentImage + 1} / {galleryImages.length}
                    </div>
                  </>
                )}
              </div>
              {/* Thumbnail strip */}
              {galleryImages.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={cn(
                        "w-20 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0",
                        idx === currentImage
                          ? "border-primary"
                          : "border-border-dark hover:border-slate-500 opacity-60 hover:opacity-100"
                      )}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="border-b border-border-dark mb-8">
              <div className="flex gap-1 overflow-x-auto">
                {(
                  [
                    { key: "apropos", label: "A propos", icon: "info" },
                    { key: "forfaits", label: "Forfaits", icon: "sell" },
                    { key: "profil", label: "Profil", icon: "person" },
                    { key: "avis", label: "Avis", icon: "star" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap",
                      activeTab === tab.key
                        ? "text-primary border-primary"
                        : "text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-600"
                    )}
                  >
                    <span className="material-symbols-outlined text-base">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="min-h-[400px]">
              {/* A propos */}
              {activeTab === "apropos" && (
                <div className="space-y-8">
                  {/* Description */}
                  <div>
                    <h2 className="text-lg font-bold text-white mb-4">Description du service</h2>
                    <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line">
                      {service.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {service.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-white mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {service.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-bold"
                          >
                            {tag}
                          </span>
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
                      <div
                        key={stat.label}
                        className="bg-neutral-dark border border-border-dark rounded-xl p-4 text-center"
                      >
                        <span className="material-symbols-outlined text-primary text-xl mb-2 block">
                          {stat.icon}
                        </span>
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
                          <div
                            key={idx}
                            className="bg-neutral-dark border border-border-dark rounded-xl overflow-hidden"
                          >
                            <button
                              onClick={() =>
                                setExpandedFaq(expandedFaq === idx ? null : idx)
                              }
                              className="w-full flex items-center justify-between px-5 py-4 text-left"
                            >
                              <span className="text-sm font-bold text-white">
                                {item.question}
                              </span>
                              <span
                                className={cn(
                                  "material-symbols-outlined text-slate-400 transition-transform",
                                  expandedFaq === idx && "rotate-180"
                                )}
                              >
                                expand_more
                              </span>
                            </button>
                            {expandedFaq === idx && (
                              <div className="px-5 pb-4 border-t border-border-dark pt-3">
                                <p className="text-slate-300 text-sm leading-relaxed">
                                  {item.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Forfaits tab */}
              {activeTab === "forfaits" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-white">Comparer les forfaits</h2>
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
                            isSelected
                              ? "border-primary ring-1 ring-primary/30"
                              : "border-border-dark hover:border-slate-500"
                          )}
                        >
                          {tier === "standard" && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                              Populaire
                            </div>
                          )}
                          <h3 className="text-white font-bold text-base mb-1">{p.name}</h3>
                          <p className="text-2xl font-extrabold text-primary mb-3">
                            {format(p.price)}
                          </p>
                          <p className="text-slate-400 text-xs leading-relaxed mb-4">
                            {p.description}
                          </p>
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2 text-slate-300">
                              <span className="material-symbols-outlined text-sm text-primary">
                                timer
                              </span>
                              Livraison en {p.delivery} jours
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <span className="material-symbols-outlined text-sm text-primary">
                                refresh
                              </span>
                              {p.revisions === 0 ? "Aucune revision" : `${p.revisions} revision${p.revisions > 1 ? "s" : ""}`}
                            </div>
                          </div>
                          {/* Feature list */}
                          <div className="mt-4 pt-4 border-t border-border-dark space-y-2">
                            {features.map((f, i) => {
                              const included = f[tier];
                              return (
                                <div
                                  key={i}
                                  className={cn(
                                    "flex items-center gap-2 text-xs",
                                    included ? "text-slate-300" : "text-slate-600 line-through"
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "material-symbols-outlined text-sm",
                                      included ? "text-primary" : "text-slate-600"
                                    )}
                                    style={included ? { fontVariationSettings: "'FILL' 1" } : {}}
                                  >
                                    {included ? "check_circle" : "cancel"}
                                  </span>
                                  {f.label}
                                </div>
                              );
                            })}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Profil tab */}
              {activeTab === "profil" && (
                <div className="space-y-8">
                  {/* Profile card */}
                  <div className="bg-neutral-dark border border-border-dark rounded-xl p-6">
                    <div className="flex items-start gap-5">
                      <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-primary/30 flex-shrink-0">
                        <img
                          src={profile.photo}
                          alt={`${profile.firstName} ${profile.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-white font-bold text-lg">
                            {profile.firstName} {profile.lastName}
                          </h3>
                          <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-bold">
                            <span
                              className="material-symbols-outlined text-xs"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              verified
                            </span>
                            Pro
                          </span>
                        </div>
                        <p className="text-primary font-medium text-sm mb-2">{profile.title}</p>
                        <p className="text-slate-400 text-sm leading-relaxed">{profile.bio}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border-dark">
                      <div className="text-center">
                        <p className="text-white font-bold text-lg">
                          {services.filter((s) => s.status === "actif").length}
                        </p>
                        <p className="text-slate-400 text-xs">Services actifs</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-bold text-lg">98%</p>
                        <p className="text-slate-400 text-xs">Taux completion</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-bold text-lg">2.5j</p>
                        <p className="text-slate-400 text-xs">Delai moyen</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-bold text-lg">4.9</p>
                        <p className="text-slate-400 text-xs">Note moyenne</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-sm font-bold text-white mb-3">Competences</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill.name}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold border",
                            skill.level === "expert"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : skill.level === "intermediaire"
                              ? "bg-accent/10 text-accent border-accent/20"
                              : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                          )}
                        >
                          {skill.name}
                          <span className="ml-1 opacity-60">
                            ({skill.level === "expert" ? "Expert" : skill.level === "intermediaire" ? "Inter." : "Deb."})
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h3 className="text-sm font-bold text-white mb-3">Langues</h3>
                    <div className="flex flex-wrap gap-3">
                      {profile.languages.map((lang) => (
                        <div
                          key={lang.name}
                          className="flex items-center gap-2 bg-neutral-dark border border-border-dark rounded-lg px-4 py-2"
                        >
                          <span className="material-symbols-outlined text-sm text-primary">
                            translate
                          </span>
                          <span className="text-white text-sm font-medium">{lang.name}</span>
                          <span className="text-slate-500 text-xs">({lang.level})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div>
                    <h3 className="text-sm font-bold text-white mb-3">Liens</h3>
                    <div className="flex flex-wrap gap-3">
                      {profile.links.linkedin && (
                        <a
                          href={profile.links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-neutral-dark border border-border-dark rounded-lg px-4 py-2 text-slate-300 text-sm hover:text-primary hover:border-primary/30 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">link</span>
                          LinkedIn
                        </a>
                      )}
                      {profile.links.github && (
                        <a
                          href={profile.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-neutral-dark border border-border-dark rounded-lg px-4 py-2 text-slate-300 text-sm hover:text-primary hover:border-primary/30 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">code</span>
                          GitHub
                        </a>
                      )}
                      {profile.links.portfolio && (
                        <a
                          href={profile.links.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-neutral-dark border border-border-dark rounded-lg px-4 py-2 text-slate-300 text-sm hover:text-primary hover:border-primary/30 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">language</span>
                          Portfolio
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Avis tab */}
              {activeTab === "avis" && (
                <div className="space-y-6">
                  {/* Rating summary */}
                  <div className="bg-neutral-dark border border-border-dark rounded-xl p-6">
                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="text-center">
                        <p className="text-4xl font-extrabold text-white">4.9</p>
                        <StarRating rating={5} size="md" />
                        <p className="text-slate-400 text-xs mt-1">{DEMO_REVIEWS.length} avis</p>
                      </div>
                      <div className="flex-1 min-w-[200px] space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => {
                          const count = DEMO_REVIEWS.filter((r) => r.rating === stars).length;
                          const pct = DEMO_REVIEWS.length
                            ? (count / DEMO_REVIEWS.length) * 100
                            : 0;
                          return (
                            <div key={stars} className="flex items-center gap-3">
                              <span className="text-xs text-slate-400 w-3">{stars}</span>
                              <span
                                className="material-symbols-outlined text-xs text-accent"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                star
                              </span>
                              <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-accent rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-500 w-6 text-right">
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Individual reviews */}
                  <div className="space-y-4">
                    {DEMO_REVIEWS.map((review) => (
                      <div
                        key={review.id}
                        className="bg-neutral-dark border border-border-dark rounded-xl p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                            {review.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-white font-bold text-sm">
                                  {review.author}
                                </span>
                                <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded-full">
                                  {review.country}
                                </span>
                              </div>
                              <span className="text-xs text-slate-500">
                                {formatDate(review.date)}
                              </span>
                            </div>
                            <StarRating rating={review.rating} />
                            <p className="text-slate-300 text-sm leading-relaxed mt-3">
                              {review.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Related Services */}
            {relatedServices.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border-dark">
                <h2 className="text-lg font-bold text-white mb-6">Services similaires</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedServices.map((rs) => (
                    <Link
                      key={rs.id}
                      href={`/services/${rs.id}`}
                      className="bg-neutral-dark border border-border-dark rounded-xl overflow-hidden hover:border-primary/30 transition-all group"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={rs.image}
                          alt={rs.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-primary font-bold mb-1">{rs.category}</p>
                        <h3 className="text-white font-bold text-sm mb-2 line-clamp-2">
                          {rs.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <StarRating rating={4} />
                            <span className="text-xs text-slate-400 ml-1">4.8</span>
                          </div>
                          <p className="text-primary font-extrabold text-sm">
                            A partir de {format(rs.packages.basic.price)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
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
                  {/* Package name + price */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-bold text-base">{pkg.name}</h3>
                      <p className="text-2xl font-extrabold text-primary">{format(pkg.price)}</p>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{pkg.description}</p>
                  </div>

                  {/* Delivery + Revisions */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="material-symbols-outlined text-base text-primary">timer</span>
                      {pkg.delivery} jours
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="material-symbols-outlined text-base text-primary">
                        refresh
                      </span>
                      {pkg.revisions === 0
                        ? "0 revision"
                        : `${pkg.revisions} revision${pkg.revisions > 1 ? "s" : ""}`}
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="space-y-2.5 py-4 border-t border-b border-border-dark">
                    {features.map((f, i) => {
                      const included = f[selectedPackage];
                      return (
                        <div
                          key={i}
                          className={cn(
                            "flex items-center gap-2 text-sm",
                            included ? "text-slate-300" : "text-slate-600"
                          )}
                        >
                          <span
                            className={cn(
                              "material-symbols-outlined text-base",
                              included ? "text-primary" : "text-slate-600"
                            )}
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
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Extras disponibles
                      </h4>
                      <div className="space-y-2">
                        {service.extras.map((extra, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-background-dark rounded-lg px-4 py-2.5 border border-border-dark"
                          >
                            <span className="text-sm text-slate-300">{extra.label}</span>
                            <span className="text-sm font-bold text-primary">
                              +{format(extra.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA Buttons */}
                  <div className="space-y-3 pt-2">
                    <Link
                      href="/inscription"
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
                    <span
                      className="material-symbols-outlined text-base text-primary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified_user
                    </span>
                    <span>Paiement 100% securise via escrow</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                    <span
                      className="material-symbols-outlined text-base text-primary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      support_agent
                    </span>
                    <span>Support disponible 7j/7</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                    <span
                      className="material-symbols-outlined text-base text-primary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      undo
                    </span>
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
