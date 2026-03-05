"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCurrencyStore } from "@/store/currency";

// ============================================================
// Types
// ============================================================

interface AgencyService {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviews: number;
  delivery: string;
  image: string;
  category: string;
}

interface AgencyMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface AgencyReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  response?: string;
  project: string;
}

interface AgencyProfile {
  slug: string;
  name: string;
  logo: string;
  coverImage: string;
  description: string[];
  sector: string;
  location: string;
  country: string;
  countryFlag: string;
  website: string;
  memberSince: string;
  verified: boolean;
  badges: string[];
  teamSize: number;
  members: AgencyMember[];
  services: AgencyService[];
  reviews: AgencyReview[];
  stats: {
    completedProjects: number;
    satisfiedClients: number;
    satisfaction: number;
    avgResponseTime: string;
    avgDelivery: string;
    recurringClients: number;
  };
  specialties: string[];
  socialLinks: { linkedin?: string; website?: string };
}

// ============================================================
// Demo data
// ============================================================

const DEMO_AGENCY: AgencyProfile = {
  slug: "techcorp-agency",
  name: "TechCorp Agency",
  logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop",
  coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop",
  description: [
    "TechCorp Agency est une agence digitale full-service specialisee dans le developpement web, mobile et le design UI/UX. Basee a Abidjan, nous accompagnons les entreprises africaines et internationales dans leur transformation numerique depuis 2022.",
    "Notre equipe pluridisciplinaire de 12 experts combine creativite, expertise technique et connaissance approfondie du marche africain pour delivrer des solutions performantes et innovantes. Nous croyons en la puissance de la technologie pour transformer les entreprises et les communautes.",
    "De la conception a la mise en production, nous offrons un accompagnement complet : strategie digitale, design d'interface, developpement sur mesure, integration de systemes de paiement locaux (Mobile Money, Wave, Orange Money) et maintenance continue.",
  ],
  sector: "Developpement Web & Mobile",
  location: "Abidjan, Cote d'Ivoire",
  country: "Cote d'Ivoire",
  countryFlag: "\ud83c\udde8\ud83c\uddee",
  website: "https://techcorp.ci",
  memberSince: "Mars 2022",
  verified: true,
  badges: ["verified", "premium", "top_agency"],
  teamSize: 12,
  members: [
    { id: "m1", name: "Kouame Yao", role: "Directeur & Fondateur", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
    { id: "m2", name: "Awa Diallo", role: "Lead Designer UI/UX", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face" },
    { id: "m3", name: "Ibrahim Toure", role: "Developpeur Full-Stack Senior", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" },
    { id: "m4", name: "Marie Kouassi", role: "Chef de Projet", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face" },
    { id: "m5", name: "Sekou Camara", role: "Developpeur Mobile", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face" },
  ],
  services: [
    { id: "as1", title: "Site web vitrine professionnel", price: 800, rating: 4.9, reviews: 32, delivery: "14 jours", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop", category: "Developpement Web" },
    { id: "as2", title: "Application mobile iOS & Android", price: 2500, rating: 4.8, reviews: 18, delivery: "30 jours", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop", category: "Mobile" },
    { id: "as3", title: "Design UI/UX complet (Figma)", price: 600, rating: 5.0, reviews: 25, delivery: "10 jours", image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=250&fit=crop", category: "Design UI/UX" },
    { id: "as4", title: "Plateforme e-commerce sur mesure", price: 3000, rating: 4.7, reviews: 14, delivery: "45 jours", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop", category: "E-commerce" },
    { id: "as5", title: "Integration API & systemes de paiement", price: 1200, rating: 4.9, reviews: 21, delivery: "14 jours", image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop", category: "Backend & API" },
    { id: "as6", title: "Strategie digitale & SEO", price: 500, rating: 4.6, reviews: 16, delivery: "7 jours", image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&h=250&fit=crop", category: "Marketing Digital" },
    { id: "as7", title: "Dashboard analytique sur mesure", price: 1800, rating: 4.8, reviews: 9, delivery: "21 jours", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop", category: "Data & Analytics" },
    { id: "as8", title: "Maintenance & support technique", price: 300, rating: 4.9, reviews: 28, delivery: "Continu", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop", category: "DevOps & Cloud" },
  ],
  reviews: [
    { id: "ar1", author: "Amadou Diop", avatar: "AD", rating: 5, text: "TechCorp a realise notre plateforme e-commerce en un temps record. L'equipe est reactive, professionnelle et comprend parfaitement les enjeux du marche africain. Le systeme de paiement Mobile Money fonctionne parfaitement.", date: "20 fev. 2026", project: "Plateforme e-commerce", response: "Merci Amadou ! Ce fut un plaisir de travailler sur ce projet ambitieux pour le marche ivoirien." },
    { id: "ar2", author: "Claire Beaumont", avatar: "CB", rating: 5, text: "Excellente experience avec TechCorp. Le design de notre application mobile est moderne et intuitif. Les utilisateurs adorent ! La communication a ete fluide tout au long du projet.", date: "5 fev. 2026", project: "Application mobile iOS & Android" },
    { id: "ar3", author: "Moussa Kone", avatar: "MK", rating: 4, text: "Bon travail d'ensemble sur notre site vitrine. Quelques ajustements ont ete necessaires sur le responsive, mais l'equipe a ete tres reactive pour corriger. Je recommande.", date: "18 jan. 2026", project: "Site web vitrine professionnel", response: "Merci Moussa pour votre retour constructif. Nous avons ameliore nos process de QA depuis." },
    { id: "ar4", author: "Fatima Ndiaye", avatar: "FN", rating: 5, text: "Notre dashboard analytique est exactement ce dont nous avions besoin. TechCorp a su comprendre nos besoins metier complexes et les traduire en une interface claire et performante.", date: "2 jan. 2026", project: "Dashboard analytique sur mesure" },
    { id: "ar5", author: "Jean-Pierre Martin", avatar: "JM", rating: 5, text: "J'ai fait appel a TechCorp pour l'integration de plusieurs API de paiement. Le resultat est impeccable, robuste et bien documente. L'equipe maitrise parfaitement les ecosystemes de paiement africains.", date: "15 dec. 2025", project: "Integration API & paiements" },
    { id: "ar6", author: "Adama Traore", avatar: "AT", rating: 4, text: "Tres satisfait du travail de strategie digitale realise par TechCorp. Notre visibilite en ligne a augmente de 150% en 3 mois. Seul bemol : le delai initial a ete legerement depasse.", date: "1 dec. 2025", project: "Strategie digitale & SEO" },
  ],
  stats: {
    completedProjects: 120,
    satisfiedClients: 85,
    satisfaction: 97,
    avgResponseTime: "1h30",
    avgDelivery: "12 jours",
    recurringClients: 64,
  },
  specialties: [
    "React / Next.js",
    "React Native",
    "Node.js",
    "UI/UX Design",
    "E-commerce",
    "Mobile Money",
    "API REST",
    "PostgreSQL",
    "Figma",
    "SEO",
    "TypeScript",
    "TailwindCSS",
  ],
  socialLinks: { linkedin: "#", website: "https://techcorp.ci" },
};

// ============================================================
// Badge config
// ============================================================

const BADGE_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  verified: { label: "Verifiee", icon: "verified", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  premium: { label: "Premium", icon: "workspace_premium", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  top_agency: { label: "Top Agence", icon: "diamond", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
};

// ============================================================
// Category colors
// ============================================================

const CATEGORY_COLORS: Record<string, string> = {
  "Developpement Web": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "Design UI/UX": "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  "Backend & API": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "Mobile": "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  "E-commerce": "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  "Marketing Digital": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  "DevOps & Cloud": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "Data & Analytics": "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
};

// ============================================================
// Star Rating Component
// ============================================================

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "base" }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(
        <span key={i} className={cn("material-symbols-outlined fill-icon text-primary", size === "sm" ? "text-sm" : "text-base")}>star</span>
      );
    } else if (i - 0.5 <= rating) {
      stars.push(
        <span key={i} className={cn("material-symbols-outlined fill-icon text-primary", size === "sm" ? "text-sm" : "text-base")}>star_half</span>
      );
    } else {
      stars.push(
        <span key={i} className={cn("material-symbols-outlined text-slate-400", size === "sm" ? "text-sm" : "text-base")}>star</span>
      );
    }
  }
  return <div className="flex">{stars}</div>;
}

// ============================================================
// Page Component
// ============================================================

const REVIEWS_PER_PAGE = 3;

export default function AgencyProfilePage() {
  const params = useParams();
  const _slug = params.slug as string;
  const agency = DEMO_AGENCY;
  const { format } = useCurrencyStore();

  const [contactOpen, setContactOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "team" | "reviews">("about");
  const [reviewPage, setReviewPage] = useState(0);

  const totalReviewPages = Math.ceil(agency.reviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = agency.reviews.slice(
    reviewPage * REVIEWS_PER_PAGE,
    (reviewPage + 1) * REVIEWS_PER_PAGE
  );

  const avgRating = (
    agency.reviews.reduce((a, r) => a + r.rating, 0) / agency.reviews.length
  ).toFixed(1);

  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="w-full max-w-[1100px] px-4 md:px-10 py-8">
        {/* ============================================================ */}
        {/* Cover + Logo + Info Section                                   */}
        {/* ============================================================ */}
        <div className="relative w-full">
          {/* Cover Image */}
          <div
            className="w-full bg-center bg-no-repeat bg-cover rounded-xl min-h-[260px] relative overflow-hidden shadow-xl"
            style={{ backgroundImage: `url("${agency.coverImage}")` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent" />
          </div>

          {/* Profile Info Row */}
          <div className="flex flex-col md:flex-row gap-6 px-6 -mt-16 relative z-10">
            {/* Logo */}
            <div className="relative shrink-0">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-2xl border-4 border-background-dark w-36 h-36 shadow-2xl"
                style={{ backgroundImage: `url("${agency.logo}")` }}
              />
              {agency.verified && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 border-3 border-background-dark rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm fill-icon">verified</span>
                </div>
              )}
            </div>

            {/* Name & Info */}
            <div className="flex flex-col justify-end pb-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-slate-900 dark:text-slate-100 text-2xl md:text-3xl font-extrabold tracking-tight">
                  {agency.name}
                </h1>
                {agency.countryFlag && <span className="text-xl">{agency.countryFlag}</span>}
                {/* Badges */}
                {agency.badges.map((b) => {
                  const cfg = BADGE_CONFIG[b];
                  if (!cfg) return null;
                  return (
                    <span
                      key={b}
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border",
                        cfg.color
                      )}
                    >
                      <span className="material-symbols-outlined text-xs fill-icon">{cfg.icon}</span>
                      {cfg.label}
                    </span>
                  );
                })}
              </div>
              <p className="text-primary text-lg font-semibold">{agency.sector}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-slate-500 dark:text-slate-400 text-sm">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  {agency.location}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">group</span>
                  {agency.teamSize} membres
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">calendar_month</span>
                  Membre depuis {agency.memberSince}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">speed</span>
                  Rep. moy. {agency.stats.avgResponseTime}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-end gap-2 pb-2 self-start md:self-end flex-wrap">
              <button
                onClick={() => setContactOpen(!contactOpen)}
                className="h-11 px-5 rounded-lg bg-primary/10 border border-primary/30 text-primary font-bold hover:bg-primary/20 transition-all text-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">mail</span>
                Contacter l&apos;agence
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("agency-services");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="h-11 px-5 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-sm">storefront</span>
                Voir nos services
              </button>
            </div>
          </div>
        </div>

        {/* Contact Quick Form */}
        {contactOpen && (
          <div className="mt-6 bg-primary/5 dark:bg-white/5 border border-primary/10 rounded-xl p-6">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">mail</span>
              Contacter {agency.name}
            </h3>
            <textarea
              className="w-full p-3 rounded-lg border border-primary/20 bg-white dark:bg-neutral-dark text-sm outline-none focus:ring-1 focus:ring-primary resize-none"
              rows={3}
              placeholder="Decrivez votre projet ou posez votre question..."
            />
            <button className="mt-3 px-6 py-2.5 bg-primary text-white font-bold rounded-lg text-sm hover:opacity-90 transition-all">
              Envoyer
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* Stats Row                                                     */}
        {/* ============================================================ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { icon: "task_alt", label: "Projets realises", value: agency.stats.completedProjects.toString(), color: "text-primary" },
            { icon: "group", label: "Clients satisfaits", value: agency.stats.satisfiedClients.toString(), color: "text-blue-500" },
            { icon: "thumb_up", label: "Satisfaction", value: `${agency.stats.satisfaction}%`, color: "text-emerald-500" },
            { icon: "schedule", label: "Delai moyen", value: agency.stats.avgDelivery, color: "text-amber-500" },
          ].map((s) => (
            <div key={s.label} className="bg-primary/5 dark:bg-white/5 rounded-xl border border-primary/10 p-4 text-center">
              <span className={cn("material-symbols-outlined text-2xl mb-1", s.color)}>{s.icon}</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ============================================================ */}
        {/* Main Grid                                                     */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Tabs: About / Team / Reviews */}
            <section>
              <div className="flex border-b border-slate-200 dark:border-border-dark mb-6">
                {(["about", "team", "reviews"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      if (tab === "reviews") setReviewPage(0);
                    }}
                    className={cn(
                      "px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px",
                      activeTab === tab
                        ? "text-primary border-primary"
                        : "text-slate-500 border-transparent hover:text-slate-700"
                    )}
                  >
                    {tab === "about" && "A propos"}
                    {tab === "team" && `Equipe (${agency.members.length})`}
                    {tab === "reviews" && `Avis (${agency.reviews.length})`}
                  </button>
                ))}
              </div>

              {/* About Tab */}
              {activeTab === "about" && (
                <div className="space-y-6">
                  {/* Description */}
                  <div className="bg-primary/5 dark:bg-white/5 p-6 rounded-xl border border-primary/10">
                    {agency.description.map((p, i) => (
                      <p
                        key={i}
                        className={cn(
                          "text-slate-700 dark:text-slate-300 leading-relaxed",
                          i > 0 && "mt-4"
                        )}
                      >
                        {p}
                      </p>
                    ))}
                  </div>

                  {/* Specialties */}
                  <div>
                    <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">psychology</span>
                      Specialites
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {agency.specialties.map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg border border-primary/20"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Extra stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/30 text-center">
                      <span className="material-symbols-outlined text-2xl text-emerald-600 dark:text-emerald-400 mb-1">repeat</span>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{agency.stats.recurringClients}%</p>
                      <p className="text-xs text-slate-500">Clients recurrents</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-200 dark:border-blue-800/30 text-center">
                      <span className="material-symbols-outlined text-2xl text-blue-600 dark:text-blue-400 mb-1">speed</span>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{agency.stats.avgResponseTime}</p>
                      <p className="text-xs text-slate-500">Temps de reponse</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-200 dark:border-purple-800/30 text-center">
                      <span className="material-symbols-outlined text-2xl text-purple-600 dark:text-purple-400 mb-1">groups</span>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{agency.teamSize}</p>
                      <p className="text-xs text-slate-500">Membres d&apos;equipe</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Team Tab */}
              {activeTab === "team" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {agency.members.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white dark:bg-neutral-dark rounded-xl border border-slate-200 dark:border-border-dark p-5 flex items-center gap-4 hover:shadow-lg transition-shadow"
                    >
                      <div
                        className="w-14 h-14 rounded-full bg-center bg-cover shrink-0 border-2 border-primary/20"
                        style={{ backgroundImage: `url("${member.avatar}")` }}
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {member.name}
                        </p>
                        <p className="text-xs text-primary font-medium">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div>
                  {/* Review Summary */}
                  <div className="flex items-center gap-4 mb-6 p-4 bg-primary/5 dark:bg-white/5 rounded-xl border border-primary/10">
                    <div className="text-center">
                      <p className="text-4xl font-black text-primary">{avgRating}</p>
                      <StarRating rating={parseFloat(avgRating)} size="base" />
                      <p className="text-xs text-slate-500 mt-1">{agency.reviews.length} avis</p>
                    </div>
                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = agency.reviews.filter(
                          (r) => Math.floor(r.rating) === star
                        ).length;
                        const pct = (count / agency.reviews.length) * 100;
                        return (
                          <div key={star} className="flex items-center gap-2 text-xs">
                            <span className="w-3 text-slate-500">{star}</span>
                            <span className="material-symbols-outlined text-xs fill-icon text-amber-400">
                              star
                            </span>
                            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-400 rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="w-6 text-right text-slate-400">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Review List */}
                  <div className="space-y-4">
                    {paginatedReviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-white dark:bg-neutral-dark p-5 rounded-xl border border-slate-200 dark:border-border-dark"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                              {review.avatar}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{review.author}</p>
                              <p className="text-slate-500 text-xs flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">folder</span>
                                {review.project}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <StarRating rating={review.rating} />
                            <p className="text-[10px] text-slate-400 mt-0.5">{review.date}</p>
                          </div>
                        </div>
                        <p className="text-slate-700 dark:text-slate-400 text-sm">{review.text}</p>
                        {review.response && (
                          <div className="mt-3 ml-6 pl-4 border-l-2 border-primary/20">
                            <p className="text-xs font-bold text-primary mb-1 flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">reply</span>
                              Reponse de {agency.name}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {review.response}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalReviewPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <button
                        onClick={() => setReviewPage(Math.max(0, reviewPage - 1))}
                        disabled={reviewPage === 0}
                        className="p-2 rounded-lg border border-slate-200 dark:border-border-dark disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-border-dark transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                      </button>
                      {Array.from({ length: totalReviewPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setReviewPage(i)}
                          className={cn(
                            "w-8 h-8 rounded-lg text-xs font-bold transition-colors",
                            i === reviewPage
                              ? "bg-primary text-white"
                              : "border border-slate-200 dark:border-border-dark text-slate-500 hover:bg-slate-100 dark:hover:bg-border-dark"
                          )}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() =>
                          setReviewPage(Math.min(totalReviewPages - 1, reviewPage + 1))
                        }
                        disabled={reviewPage === totalReviewPages - 1}
                        className="p-2 rounded-lg border border-slate-200 dark:border-border-dark disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-border-dark transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* ============================================================ */}
          {/* Right Column: Sidebar                                        */}
          {/* ============================================================ */}
          <div className="space-y-6">
            {/* Agency Info Card */}
            <div className="bg-primary/5 dark:bg-white/5 p-6 rounded-2xl border border-primary/10 shadow-sm">
              <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">apartment</span>
                Informations
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-lg">category</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Secteur</p>
                    <p className="text-sm font-semibold">{agency.sector}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Localisation</p>
                    <p className="text-sm font-semibold">{agency.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-lg">groups</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Taille de l&apos;equipe</p>
                    <p className="text-sm font-semibold">{agency.teamSize} membres</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-lg">calendar_month</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Membre depuis</p>
                    <p className="text-sm font-semibold">{agency.memberSince}</p>
                  </div>
                </div>
                {agency.website && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-lg">language</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Site web</p>
                      <a
                        href={agency.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        {agency.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-primary p-6 rounded-2xl text-white shadow-xl shadow-primary/10">
              <h4 className="font-bold mb-4 opacity-90 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">bar_chart</span>
                En chiffres
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 p-3 rounded-xl">
                  <p className="text-2xl font-black">{avgRating}</p>
                  <p className="text-[10px] uppercase tracking-wider opacity-80">Note moyenne</p>
                </div>
                <div className="bg-white/10 p-3 rounded-xl">
                  <p className="text-2xl font-black">{agency.stats.completedProjects}</p>
                  <p className="text-[10px] uppercase tracking-wider opacity-80">Projets</p>
                </div>
                <div className="bg-white/10 p-3 rounded-xl">
                  <p className="text-2xl font-black">{agency.stats.satisfaction}%</p>
                  <p className="text-[10px] uppercase tracking-wider opacity-80">Satisfaction</p>
                </div>
                <div className="bg-white/10 p-3 rounded-xl">
                  <p className="text-2xl font-black">{agency.stats.avgResponseTime}</p>
                  <p className="text-[10px] uppercase tracking-wider opacity-80">Rep. moyenne</p>
                </div>
              </div>
            </div>

            {/* CTA Contact Card */}
            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800/30">
              <h4 className="font-bold text-emerald-800 dark:text-emerald-400 mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined">handshake</span>
                Vous avez un projet ?
              </h4>
              <p className="text-sm text-emerald-700 dark:text-emerald-300/70 mb-4">
                Contactez {agency.name} pour discuter de votre projet et recevoir un devis personnalise.
              </p>
              <button
                onClick={() => setContactOpen(true)}
                className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors text-sm"
              >
                Demander un devis
              </button>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-4 py-2">
              {agency.socialLinks.linkedin && (
                <a
                  className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/10 transition-all"
                  href={agency.socialLinks.linkedin}
                  aria-label="LinkedIn"
                >
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.493-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-2v-3.86c0-.881-.719-1.6-1.6-1.6s-1.6.719-1.6 1.6v3.86h-2v-6h2v1.135c.671-.647 1.62-1.135 2.6-1.135 1.989 0 3.6 1.611 3.6 3.6v2.399z" />
                  </svg>
                </a>
              )}
              {agency.socialLinks.website && (
                <a
                  className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/10 transition-all"
                  href={agency.socialLinks.website}
                  aria-label="Website"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined text-xl">language</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Nos services -- visible section for all visitors              */}
      {/* ============================================================ */}
      <div id="agency-services" className="w-full max-w-[1100px] px-4 md:px-10 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-slate-900 dark:text-slate-100 text-2xl font-extrabold flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">storefront</span>
            Nos services
            <span className="ml-1 text-sm font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
              {agency.services.length}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {agency.services.slice(0, 6).map((service) => {
            const catColor =
              CATEGORY_COLORS[service.category] ||
              "bg-slate-500/10 text-slate-600 dark:text-slate-400";

            return (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="group bg-white dark:bg-neutral-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-slate-100 dark:bg-background-dark relative overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Category badge on image */}
                  <span
                    className={cn(
                      "absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-sm",
                      catColor
                    )}
                  >
                    {service.category}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-4">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h4>

                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={service.rating} />
                    <span className="text-xs text-slate-500">
                      {service.rating} ({service.reviews} avis)
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-border-dark">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">schedule</span>
                      {service.delivery}
                    </span>
                    <span className="text-sm font-black text-primary">
                      A partir de {format(service.price)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Show all button if more than 6 services */}
        {agency.services.length > 6 && (
          <div className="flex justify-center mt-8">
            <Link
              href={`/explorer?agence=${agency.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-colors border border-primary/20"
            >
              <span className="material-symbols-outlined text-lg">grid_view</span>
              Voir tous les services ({agency.services.length})
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
