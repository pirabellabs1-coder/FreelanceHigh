"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────
type ViewTab = "services" | "offres" | "freelances";

// ─── Demo Data ──────────────────────────────────────────

const CATEGORIES = [
  "Toutes", "Développement", "Design", "Marketing", "Rédaction", "SEO", "Mobile", "Data", "Vidéo",
];

const SERVICES = [
  { id: "s1", title: "Site web e-commerce Next.js", seller: "Awa Diop", sellerType: "freelance" as const, rating: 4.9, reviews: 127, price: 1200, tags: ["Next.js", "React", "E-commerce"], category: "Développement", image: "code" },
  { id: "s2", title: "Identité visuelle complète", seller: "Studio Créa", sellerType: "agence" as const, rating: 4.8, reviews: 89, price: 800, tags: ["Branding", "Logo", "Charte graphique"], category: "Design", image: "palette" },
  { id: "s3", title: "Campagne Google Ads optimisée", seller: "Salimata Traoré", sellerType: "freelance" as const, rating: 4.7, reviews: 64, price: 450, tags: ["Google Ads", "SEA", "Analytics"], category: "Marketing", image: "campaign" },
  { id: "s4", title: "Rédaction articles SEO (x10)", seller: "Léa Dupont", sellerType: "freelance" as const, rating: 4.6, reviews: 52, price: 350, tags: ["SEO", "Copywriting", "Blog"], category: "Rédaction", image: "edit_note" },
  { id: "s5", title: "Application mobile React Native", seller: "DevMobile Agency", sellerType: "agence" as const, rating: 4.9, reviews: 156, price: 3500, tags: ["React Native", "iOS", "Android"], category: "Mobile", image: "smartphone" },
  { id: "s6", title: "Dashboard analytics sur mesure", seller: "Omar Bah", sellerType: "freelance" as const, rating: 4.8, reviews: 73, price: 1800, tags: ["Python", "Data Viz", "Tableau"], category: "Data", image: "analytics" },
  { id: "s7", title: "Vidéo promotionnelle 60 sec", seller: "Clip Factory", sellerType: "agence" as const, rating: 4.5, reviews: 41, price: 600, tags: ["Motion", "After Effects", "Publicité"], category: "Vidéo", image: "videocam" },
  { id: "s8", title: "API REST & microservices Node.js", seller: "Moussa Keita", sellerType: "freelance" as const, rating: 4.9, reviews: 98, price: 2200, tags: ["Node.js", "Express", "MongoDB"], category: "Développement", image: "api" },
  { id: "s9", title: "Audit SEO complet + plan d'action", seller: "SEO Masters", sellerType: "agence" as const, rating: 4.7, reviews: 85, price: 500, tags: ["SEO", "Audit", "Stratégie"], category: "SEO", image: "troubleshoot" },
  { id: "s10", title: "Maquettes UI/UX Figma", seller: "Fatima Benali", sellerType: "freelance" as const, rating: 4.8, reviews: 112, price: 950, tags: ["Figma", "UI/UX", "Prototype"], category: "Design", image: "draw" },
];

const CLIENT_OFFERS = [
  { id: "o1", title: "Refonte complète site vitrine", client: "Dakar Shop SARL", budget: "€2 000 - €4 000", deadline: "2026-04-15", skills: ["Next.js", "Tailwind CSS", "TypeScript"], urgency: "normale" as const, candidates: 8, description: "Refonte d'un site vitrine existant vers une stack moderne avec Next.js et Tailwind CSS." },
  { id: "o2", title: "Application mobile de livraison", client: "QuickDeliver", budget: "€5 000 - €8 000", deadline: "2026-05-01", skills: ["React Native", "Node.js", "PostgreSQL"], urgency: "urgente" as const, candidates: 12, description: "Développement d'une application mobile complète pour la gestion de livraisons en Afrique de l'Ouest." },
  { id: "o3", title: "Stratégie marketing digital Q2 2026", client: "FashionAfrik", budget: "€1 500 - €3 000", deadline: "2026-03-30", skills: ["Marketing digital", "Meta Ads", "Google Ads"], urgency: "tres_urgente" as const, candidates: 5, description: "Mise en place d'une stratégie complète de marketing digital pour le lancement d'une nouvelle collection." },
  { id: "o4", title: "Développement plateforme e-learning", client: "EduTech SN", budget: "€8 000 - €15 000", deadline: "2026-06-30", skills: ["Next.js", "Socket.io", "Stripe", "Prisma"], urgency: "normale" as const, candidates: 15, description: "Création d'une plateforme e-learning avec système de visioconférence, paiements et suivi des élèves." },
  { id: "o5", title: "Identité visuelle startup fintech", client: "FinTech CI", budget: "€800 - €1 500", deadline: "2026-04-10", skills: ["Branding", "Logo", "Figma"], urgency: "urgente" as const, candidates: 9, description: "Création de l'identité visuelle complète pour une nouvelle startup fintech basée à Abidjan." },
  { id: "o6", title: "Migration base de données legacy", client: "MediaGroup CI", budget: "€3 000 - €5 000", deadline: "2026-05-15", skills: ["PostgreSQL", "Python", "ETL", "Docker"], urgency: "normale" as const, candidates: 3, description: "Migration d'une base de données MySQL legacy vers PostgreSQL avec nettoyage des données et scripts ETL." },
];

const FREELANCERS = [
  { id: "f1", name: "Awa Diop", title: "Développeuse React/Next.js", initials: "AD", rating: 4.9, hourlyRate: 45, country: "Sénégal", flag: "🇸🇳", skills: ["React", "Next.js", "TypeScript", "Node.js"], available: true, completedOrders: 127 },
  { id: "f2", name: "Moussa Keita", title: "Designer UI/UX Senior", initials: "MK", rating: 4.8, hourlyRate: 50, country: "Côte d'Ivoire", flag: "🇨🇮", skills: ["Figma", "Sketch", "Adobe XD", "Prototyping"], available: true, completedOrders: 89 },
  { id: "f3", name: "Léa Dupont", title: "Rédactrice SEO & Copywriter", initials: "LD", rating: 4.7, hourlyRate: 30, country: "France", flag: "🇫🇷", skills: ["SEO", "Copywriting", "WordPress", "Rédaction web"], available: false, completedOrders: 64 },
  { id: "f4", name: "Omar Bah", title: "Développeur Python/Django", initials: "OB", rating: 4.9, hourlyRate: 55, country: "Guinée", flag: "🇬🇳", skills: ["Python", "Django", "PostgreSQL", "Docker"], available: true, completedOrders: 98 },
  { id: "f5", name: "Salimata Traoré", title: "Experte Marketing Digital", initials: "ST", rating: 4.6, hourlyRate: 40, country: "Mali", flag: "🇲🇱", skills: ["Google Ads", "Meta Ads", "Analytics", "Stratégie"], available: true, completedOrders: 52 },
  { id: "f6", name: "Fatima Benali", title: "Designer Produit", initials: "FB", rating: 4.8, hourlyRate: 48, country: "Maroc", flag: "🇲🇦", skills: ["Figma", "UI/UX", "Design System", "Webflow"], available: true, completedOrders: 112 },
  { id: "f7", name: "Jean Kouamé", title: "Développeur Mobile React Native", initials: "JK", rating: 4.7, hourlyRate: 52, country: "Côte d'Ivoire", flag: "🇨🇮", skills: ["React Native", "Flutter", "iOS", "Android"], available: false, completedOrders: 76 },
  { id: "f8", name: "Claire Martin", title: "Data Analyst & BI", initials: "CM", rating: 4.5, hourlyRate: 42, country: "Belgique", flag: "🇧🇪", skills: ["Python", "Tableau", "SQL", "Power BI"], available: true, completedOrders: 41 },
];

const URGENCY_MAP: Record<string, { label: string; cls: string }> = {
  normale: { label: "Normale", cls: "bg-slate-500/20 text-slate-400" },
  urgente: { label: "Urgente", cls: "bg-amber-500/20 text-amber-400" },
  tres_urgente: { label: "Très urgente", cls: "bg-red-500/20 text-red-400" },
};

// ─── Component ──────────────────────────────────────────

export default function AgenceExplorer() {
  const [tab, setTab] = useState<ViewTab>("services");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Toutes");
  const [showContact, setShowContact] = useState<string | null>(null);
  const [showApply, setShowApply] = useState<string | null>(null);
  const [applyLetter, setApplyLetter] = useState("");
  const [applyPrice, setApplyPrice] = useState("");
  const [applyDeadline, setApplyDeadline] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const { addToast } = useToastStore();

  // Filters
  const filteredServices = SERVICES.filter((s) => {
    const matchSearch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.seller.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = categoryFilter === "Toutes" || s.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const filteredOffers = CLIENT_OFFERS.filter((o) => {
    const matchSearch =
      !search ||
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.client.toLowerCase().includes(search.toLowerCase()) ||
      o.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchSearch;
  });

  const filteredFreelancers = FREELANCERS.filter((f) => {
    const matchSearch =
      !search ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchSearch;
  });

  const tabs: { key: ViewTab; label: string; icon: string; count: number }[] = [
    { key: "services", label: "Services", icon: "storefront", count: filteredServices.length },
    { key: "offres", label: "Offres Clients", icon: "assignment", count: filteredOffers.length },
    { key: "freelances", label: "Freelances", icon: "person_search", count: filteredFreelancers.length },
  ];

  function handleApply() {
    if (!applyLetter.trim() || !applyPrice.trim()) {
      addToast("error", "Veuillez remplir la lettre de motivation et le prix proposé.");
      return;
    }
    addToast("success", "Candidature envoyée avec succès !");
    setShowApply(null);
    setApplyLetter("");
    setApplyPrice("");
    setApplyDeadline("");
  }

  function handleContact() {
    if (!contactMessage.trim()) {
      addToast("error", "Veuillez rédiger un message.");
      return;
    }
    addToast("success", "Message envoyé !");
    setShowContact(null);
    setContactMessage("");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Explorer</h1>
          <p className="text-slate-400 text-sm mt-1">
            Parcourez le marketplace, les offres clients et les profils freelances.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setCategoryFilter("Toutes"); }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
              tab === t.key
                ? "bg-primary text-background-dark"
                : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white"
            )}
          >
            <span className="material-symbols-outlined text-lg">{t.icon}</span>
            {t.label}
            <span className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
              tab === t.key ? "bg-background-dark/20 text-background-dark" : "bg-primary/10 text-primary"
            )}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search + Category Filters */}
      <div className="space-y-3">
        <div className="relative max-w-lg">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              tab === "services" ? "Rechercher un service, vendeur ou technologie..."
              : tab === "offres" ? "Rechercher une offre, client ou compétence..."
              : "Rechercher un freelance, compétence ou titre..."
            }
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50"
          />
        </div>
        {tab === "services" && (
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                  categoryFilter === cat
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "bg-neutral-dark text-slate-500 border border-border-dark hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ────── Services View ────── */}
      {tab === "services" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredServices.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <span className="material-symbols-outlined text-5xl text-slate-600 mb-3">search_off</span>
              <p className="text-slate-500 font-semibold">Aucun service trouvé</p>
            </div>
          ) : (
            filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden hover:border-primary/20 transition-all group"
              >
                {/* Service icon header */}
                <div className="h-32 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-primary/40 group-hover:text-primary/60 transition-colors">
                    {service.image}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  {/* Title + Badge */}
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight">{service.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <p className="text-xs text-slate-500">{service.seller}</p>
                      <span className={cn(
                        "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider",
                        service.sellerType === "agence"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      )}>
                        {service.sellerType === "agence" ? "Agence" : "Freelance"}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {service.tags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Rating + Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-yellow-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-xs font-semibold text-white">{service.rating}</span>
                      <span className="text-xs text-slate-500">({service.reviews})</span>
                    </div>
                    <p className="text-sm font-black text-white">
                      {service.price.toLocaleString("fr-FR")}&nbsp;€
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => addToast("info", `Détails du service "${service.title}"`)}
                      className="flex-1 py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      Voir
                    </button>
                    <button
                      onClick={() => setShowContact(service.seller)}
                      className="flex-1 py-2 bg-neutral-dark border border-border-dark text-slate-400 text-xs font-semibold rounded-lg hover:text-white hover:border-primary/30 transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">mail</span>
                      Contacter
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ────── Offres Clients View ────── */}
      {tab === "offres" && (
        <div className="space-y-3">
          {filteredOffers.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-slate-600 mb-3">search_off</span>
              <p className="text-slate-500 font-semibold">Aucune offre trouvée</p>
            </div>
          ) : (
            filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-neutral-dark rounded-xl border border-border-dark p-5 hover:border-primary/20 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Main info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3 flex-wrap">
                      <h3 className="text-sm font-bold text-white">{offer.title}</h3>
                      <span className={cn(
                        "text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0",
                        URGENCY_MAP[offer.urgency]?.cls
                      )}>
                        {URGENCY_MAP[offer.urgency]?.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{offer.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {offer.skills.map((skill) => (
                        <span key={skill} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">business</span>
                        {offer.client}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">group</span>
                        {offer.candidates} candidatures
                      </span>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-black text-white">{offer.budget}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Budget estimé</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        {new Date(offer.deadline).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowApply(offer.id)}
                      className="px-4 py-2 bg-primary text-background-dark text-xs font-bold rounded-lg hover:brightness-110 transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">send</span>
                      Postuler
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ────── Freelances View ────── */}
      {tab === "freelances" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredFreelancers.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <span className="material-symbols-outlined text-5xl text-slate-600 mb-3">search_off</span>
              <p className="text-slate-500 font-semibold">Aucun freelance trouvé</p>
            </div>
          ) : (
            filteredFreelancers.map((freelancer) => (
              <div
                key={freelancer.id}
                className="bg-neutral-dark rounded-xl border border-border-dark p-5 hover:border-primary/20 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                      {freelancer.initials}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{freelancer.name}</p>
                      <p className="text-[11px] text-slate-500 leading-tight">{freelancer.title}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[9px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-1",
                    freelancer.available
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-slate-500/20 text-slate-400"
                  )}>
                    {freelancer.available ? "Disponible" : "Occupé"}
                  </span>
                </div>

                {/* Country + Rating */}
                <div className="flex items-center gap-3 mb-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="text-sm">{freelancer.flag}</span>
                    {freelancer.country}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-yellow-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-semibold text-white">{freelancer.rating}</span>
                  </span>
                  <span className="flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    {freelancer.completedOrders}
                  </span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {freelancer.skills.slice(0, 4).map((skill) => (
                    <span key={skill} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Hourly Rate */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-black text-white">{freelancer.hourlyRate}&nbsp;€<span className="text-xs font-normal text-slate-500">/h</span></p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowContact(freelancer.name)}
                    className="flex-1 py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">mail</span>
                    Contacter
                  </button>
                  <button
                    onClick={() => addToast("info", `Proposition de recrutement envoyée à ${freelancer.name}`)}
                    className="flex-1 py-2 bg-neutral-dark border border-border-dark text-slate-400 text-xs font-semibold rounded-lg hover:text-white hover:border-primary/30 transition-colors flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">person_add</span>
                    Recruter
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ────── Contact Modal ────── */}
      {showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowContact(null); setContactMessage(""); }} />
          <div className="relative bg-neutral-dark rounded-2xl border border-border-dark p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Contacter {showContact}</h3>
              <button onClick={() => { setShowContact(null); setContactMessage(""); }} className="text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">Objet</label>
                <input
                  placeholder="Objet de votre message..."
                  className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">Message</label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Rédigez votre message..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowContact(null); setContactMessage(""); }}
                  className="flex-1 py-2.5 text-slate-400 text-sm font-semibold hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleContact}
                  className="flex-1 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────── Apply Modal ────── */}
      {showApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowApply(null); setApplyLetter(""); setApplyPrice(""); setApplyDeadline(""); }} />
          <div className="relative bg-neutral-dark rounded-2xl border border-border-dark p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                Postuler : {CLIENT_OFFERS.find((o) => o.id === showApply)?.title}
              </h3>
              <button onClick={() => { setShowApply(null); setApplyLetter(""); setApplyPrice(""); setApplyDeadline(""); }} className="text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Offer summary */}
            <div className="bg-background-dark rounded-xl border border-border-dark p-4 mb-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">business</span>
                  {CLIENT_OFFERS.find((o) => o.id === showApply)?.client}
                </span>
                <span className="font-bold text-white text-sm">
                  {CLIENT_OFFERS.find((o) => o.id === showApply)?.budget}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">
                  Lettre de motivation
                </label>
                <textarea
                  value={applyLetter}
                  onChange={(e) => setApplyLetter(e.target.value)}
                  placeholder="Expliquez pourquoi votre agence est la meilleure pour ce projet..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">
                    Prix proposé (€)
                  </label>
                  <input
                    value={applyPrice}
                    onChange={(e) => setApplyPrice(e.target.value)}
                    placeholder="Ex: 3500"
                    type="number"
                    className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">
                    Délai proposé
                  </label>
                  <input
                    value={applyDeadline}
                    onChange={(e) => setApplyDeadline(e.target.value)}
                    type="date"
                    className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">
                  Pièces jointes (optionnel)
                </label>
                <div className="border-2 border-dashed border-border-dark rounded-xl p-4 text-center hover:border-primary/30 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-2xl text-slate-500 mb-1">cloud_upload</span>
                  <p className="text-xs text-slate-500">Portfolio, références, propositions...</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowApply(null); setApplyLetter(""); setApplyPrice(""); setApplyDeadline(""); }}
                  className="flex-1 py-2.5 text-slate-400 text-sm font-semibold hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                  Envoyer la candidature
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
