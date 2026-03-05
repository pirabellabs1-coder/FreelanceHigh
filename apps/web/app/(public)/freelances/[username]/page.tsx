"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCurrencyStore } from "@/store/currency";

// ============================================================
// Types
// ============================================================

interface PortfolioProject {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tags: string[];
}

interface Skill {
  name: string;
  level: string;
  percent: number;
}

interface ServiceCard {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviews: number;
  delivery: string;
  image: string;
  category: string;
}

interface Formation {
  title: string;
  school: string;
  year: string;
  type: "diploma" | "certification";
}

interface Language {
  name: string;
  level: string;
  flag: string;
}

interface Review {
  id: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  response?: string;
}

interface FreelancerProfile {
  username: string;
  name: string;
  title: string;
  location: string;
  country: string;
  countryFlag: string;
  memberSince: string;
  experience: string;
  available: boolean;
  online: boolean;
  bio: string[];
  coverImage: string;
  avatar: string;
  skills: Skill[];
  tags: string[];
  portfolio: PortfolioProject[];
  reviews: Review[];
  services: ServiceCard[];
  formations: Formation[];
  languages: Language[];
  badges: string[];
  stats: {
    completedOrders: number;
    satisfactionRate: number;
    avgResponseTime: string;
    onTimeDelivery: number;
    recurringClients: number;
    profileViews: number;
  };
  socialLinks: { linkedin?: string; github?: string; portfolio?: string };
}

// ============================================================
// Demo data
// ============================================================

const DEMO_FREELANCER: FreelancerProfile = {
  username: "alexandre-rivera",
  name: "Alexandre Rivera",
  title: "Developpeur Full-Stack Senior & Designer UI/UX",
  location: "Paris, France",
  country: "France",
  countryFlag: "\ud83c\uddeb\ud83c\uddf7",
  memberSince: "Janvier 2024",
  experience: "10+ ans d'experience",
  available: true,
  online: true,
  bio: [
    "Passionne par la creation d'experiences numeriques exceptionnelles, j'accompagne les startups et les entreprises dans le developpement de produits web robustes et esthetiques. Mon approche combine une expertise technique approfondie en architecture logicielle avec une sensibilite design centree sur l'utilisateur.",
    "Specialise en React, Node.js et TypeScript, je transforme des idees complexes en solutions simples, scalables et performantes.",
  ],
  coverImage:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop",
  avatar:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  badges: ["verified", "top_rated", "pro"],
  skills: [
    { name: "React / Next.js", level: "Expert", percent: 95 },
    { name: "Node.js / Express", level: "Expert", percent: 90 },
    { name: "UI/UX Design", level: "Avance", percent: 85 },
    { name: "TypeScript", level: "Expert", percent: 92 },
    { name: "PostgreSQL / MongoDB", level: "Avance", percent: 80 },
  ],
  tags: ["TailwindCSS", "Docker", "Figma", "GraphQL", "Firebase"],
  formations: [
    { title: "Master Informatique", school: "Universite Paris-Saclay", year: "2016", type: "diploma" },
    { title: "AWS Solutions Architect", school: "Amazon Web Services", year: "2023", type: "certification" },
    { title: "Google UX Design Certificate", school: "Google / Coursera", year: "2022", type: "certification" },
  ],
  languages: [
    { name: "Francais", level: "Natif", flag: "\ud83c\uddeb\ud83c\uddf7" },
    { name: "Anglais", level: "Courant (C1)", flag: "\ud83c\uddec\ud83c\udde7" },
    { name: "Espagnol", level: "Intermediaire (B1)", flag: "\ud83c\uddea\ud83c\uddf8" },
  ],
  stats: {
    completedOrders: 247,
    satisfactionRate: 98,
    avgResponseTime: "2h",
    onTimeDelivery: 96,
    recurringClients: 42,
    profileViews: 3850,
  },
  portfolio: [
    {
      id: "p1",
      title: "SaaS Analytics Platform",
      subtitle: "UI/UX & Frontend Development",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      tags: ["React", "TypeScript", "D3.js"],
    },
    {
      id: "p2",
      title: "Eco-Commerce Mobile App",
      subtitle: "React Native & Node.js",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      tags: ["React Native", "Node.js"],
    },
    {
      id: "p3",
      title: "Creative Agency Website",
      subtitle: "Design & Webflow",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      tags: ["Design", "Webflow"],
    },
    {
      id: "p4",
      title: "Fintech Wealth Management",
      subtitle: "Full-stack Engineering",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
      tags: ["Next.js", "PostgreSQL"],
    },
  ],
  services: [
    { id: "srv1", title: "Site web vitrine professionnel sur mesure", price: 500, rating: 4.9, reviews: 45, delivery: "7 jours", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop", category: "Developpement Web" },
    { id: "srv2", title: "Application React / Next.js complete", price: 2000, rating: 5.0, reviews: 32, delivery: "21 jours", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop", category: "Developpement Web" },
    { id: "srv3", title: "Design UI/UX et maquettes Figma", price: 400, rating: 4.8, reviews: 28, delivery: "5 jours", image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=250&fit=crop", category: "Design UI/UX" },
    { id: "srv4", title: "API REST & Backend Node.js", price: 800, rating: 4.9, reviews: 19, delivery: "10 jours", image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop", category: "Backend & API" },
    { id: "srv5", title: "Integration CMS WordPress / Strapi", price: 350, rating: 4.7, reviews: 15, delivery: "5 jours", image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&h=250&fit=crop", category: "Developpement Web" },
    { id: "srv6", title: "Audit technique & optimisation performance", price: 300, rating: 5.0, reviews: 12, delivery: "3 jours", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop", category: "Consulting" },
    { id: "srv7", title: "Migration & refactoring codebase", price: 1500, rating: 4.8, reviews: 8, delivery: "14 jours", image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop", category: "Developpement Web" },
  ],
  reviews: [
    {
      id: "r1",
      author: "Marc Leroy",
      role: "CEO de Techni-Soft",
      avatar: "ML",
      rating: 5,
      date: "15 fev. 2026",
      text: "Alexandre a fait un travail remarquable sur notre plateforme SaaS. Non seulement il est techniquement excellent, mais il comprend parfaitement les enjeux business.",
      response: "Merci Marc ! Ce fut un plaisir de collaborer sur ce projet ambitieux.",
    },
    {
      id: "r2",
      author: "Sophie Durant",
      role: "Directrice Produit",
      avatar: "SD",
      rating: 5,
      date: "2 fev. 2026",
      text: "Un grand professionnalisme et une communication fluide. Le projet a ete livre en avance avec une qualite de code irreprochable.",
    },
    {
      id: "r3",
      author: "Aminata Diallo",
      role: "Fondatrice de DigiShop",
      avatar: "AD",
      rating: 5,
      date: "18 jan. 2026",
      text: "Troisieme collaboration avec Alexandre et toujours aussi satisfaite. Il comprend parfaitement les besoins du marche africain et livre un code de qualite.",
      response: "Merci Aminata, au plaisir de continuer notre collaboration !",
    },
    {
      id: "r4",
      author: "Pierre Martin",
      role: "CTO chez InnoTech",
      avatar: "PM",
      rating: 4,
      date: "5 jan. 2026",
      text: "Tres bon travail sur notre API. Code propre et bien documente. Petite revision demandee qui a ete faite rapidement.",
    },
    {
      id: "r5",
      author: "Claire Beaumont",
      role: "Designer Senior",
      avatar: "CB",
      rating: 5,
      date: "20 dec. 2025",
      text: "Super integration de mes maquettes Figma. Le rendu est pixel-perfect et le code est extremement propre. Je recommande sans hesitation.",
    },
  ],
  socialLinks: { linkedin: "#", github: "#", portfolio: "#" },
};

// ============================================================
// Badge config
// ============================================================

const BADGE_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  verified: { label: "Verifie", icon: "verified", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  top_rated: { label: "Top Rated", icon: "bolt", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  pro: { label: "Pro", icon: "workspace_premium", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  elite: { label: "Elite", icon: "diamond", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  rising_talent: { label: "Rising Talent", icon: "trending_up", color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" },
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
  "Consulting": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
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

export default function FreelanceProfilePage() {
  const params = useParams();
  const _username = params.username as string;
  const freelancer = DEMO_FREELANCER;
  const { format } = useCurrencyStore();

  const [contactOpen, setContactOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "portfolio" | "reviews">("about");
  const [reviewPage, setReviewPage] = useState(0);

  const totalReviewPages = Math.ceil(freelancer.reviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = freelancer.reviews.slice(
    reviewPage * REVIEWS_PER_PAGE,
    (reviewPage + 1) * REVIEWS_PER_PAGE
  );

  const avgRating = (
    freelancer.reviews.reduce((a, r) => a + r.rating, 0) / freelancer.reviews.length
  ).toFixed(1);

  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="w-full max-w-[1100px] px-4 md:px-10 py-8">
        {/* ============================================================ */}
        {/* Hero / Header                                                 */}
        {/* ============================================================ */}
        <div className="relative w-full">
          {/* Cover Image */}
          <div
            className="w-full bg-center bg-no-repeat bg-cover rounded-xl min-h-[260px] relative overflow-hidden shadow-xl"
            style={{ backgroundImage: `url("${freelancer.coverImage}")` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent" />
          </div>

          {/* Profile Info Row */}
          <div className="flex flex-col md:flex-row gap-6 px-6 -mt-16 relative z-10">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-2xl border-4 border-background-dark w-40 h-40 shadow-2xl"
                style={{ backgroundImage: `url("${freelancer.avatar}")` }}
              />
              {/* Online indicator */}
              {freelancer.online && (
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-3 border-background-dark rounded-full" />
              )}
            </div>

            {/* Name & Info */}
            <div className="flex flex-col justify-end pb-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-slate-900 dark:text-slate-100 text-2xl md:text-3xl font-extrabold tracking-tight">
                  {freelancer.name}
                </h1>
                {freelancer.countryFlag && <span className="text-xl">{freelancer.countryFlag}</span>}
                {freelancer.available && (
                  <div className="flex h-7 items-center justify-center gap-x-1.5 rounded-full bg-primary/20 px-3 border border-primary/30">
                    <span className="material-symbols-outlined text-primary text-sm fill-icon">
                      check_circle
                    </span>
                    <p className="text-primary text-xs font-bold uppercase tracking-wider">
                      Disponible
                    </p>
                  </div>
                )}
                {/* Badges */}
                {freelancer.badges.map((b) => {
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
              <p className="text-primary text-lg font-semibold">{freelancer.title}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-slate-500 dark:text-slate-400 text-sm">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  {freelancer.location}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">work_history</span>
                  {freelancer.experience}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">calendar_month</span>
                  Membre depuis {freelancer.memberSince}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">speed</span>
                  Rep. moy. {freelancer.stats.avgResponseTime}
                </span>
              </div>
              {/* Rating row */}
              <div className="flex items-center gap-3 mt-2">
                <StarRating rating={parseFloat(avgRating)} size="base" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{avgRating}</span>
                <span className="text-sm text-slate-500">({freelancer.reviews.length} avis)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pb-2 self-start md:self-end">
              <button
                onClick={() => setContactOpen(!contactOpen)}
                className="h-11 px-5 rounded-lg bg-primary/10 border border-primary/30 text-primary font-bold hover:bg-primary/20 transition-all text-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">mail</span>
                Envoyer un message
              </button>
              <Link
                href="/inscription"
                className="h-11 px-5 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2 text-sm justify-center"
              >
                <span className="material-symbols-outlined text-sm">storefront</span>
                Commander un service
              </Link>
              <button className="h-11 px-5 rounded-lg border border-slate-200 dark:border-border-dark text-slate-500 font-bold hover:border-primary/30 hover:text-primary transition-all text-sm flex items-center gap-2 justify-center">
                <span className="material-symbols-outlined text-sm">favorite_border</span>
                Favoris
              </button>
            </div>
          </div>
        </div>

        {/* Contact Quick Form (toggle) */}
        {contactOpen && (
          <div className="mt-6 bg-primary/5 dark:bg-white/5 border border-primary/10 rounded-xl p-6">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">mail</span>
              Envoyer un message a {freelancer.name}
            </h3>
            <textarea
              className="w-full p-3 rounded-lg border border-primary/20 bg-white dark:bg-neutral-dark text-sm outline-none focus:ring-1 focus:ring-primary resize-none"
              rows={3}
              placeholder="Decrivez votre projet..."
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
            { icon: "task_alt", label: "Commandes completees", value: freelancer.stats.completedOrders.toString(), color: "text-primary" },
            { icon: "thumb_up", label: "Taux de satisfaction", value: `${freelancer.stats.satisfactionRate}%`, color: "text-emerald-500" },
            { icon: "schedule", label: "Reponse moyenne", value: freelancer.stats.avgResponseTime, color: "text-blue-500" },
            { icon: "timer", label: "Dans les delais", value: `${freelancer.stats.onTimeDelivery}%`, color: "text-amber-500" },
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
            {/* Tabs: About / Portfolio / Reviews */}
            <section>
              <div className="flex border-b border-slate-200 dark:border-border-dark mb-6">
                {(["about", "portfolio", "reviews"] as const).map((tab) => (
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
                    {tab === "portfolio" && `Portfolio (${freelancer.portfolio.length})`}
                    {tab === "reviews" && `Avis (${freelancer.reviews.length})`}
                  </button>
                ))}
              </div>

              {/* About Tab */}
              {activeTab === "about" && (
                <div className="space-y-8">
                  {/* Bio */}
                  <div className="bg-primary/5 dark:bg-white/5 p-6 rounded-xl border border-primary/10">
                    {freelancer.bio.map((p, i) => (
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

                  {/* Formation & Certifications */}
                  <div>
                    <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">school</span>
                      Formation & Certifications
                    </h3>
                    <div className="space-y-3">
                      {freelancer.formations.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-4 bg-white dark:bg-neutral-dark rounded-xl border border-slate-200 dark:border-border-dark p-4"
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                            f.type === "diploma" ? "bg-blue-500/10" : "bg-amber-500/10"
                          )}>
                            <span className={cn(
                              "material-symbols-outlined text-lg",
                              f.type === "diploma" ? "text-blue-500" : "text-amber-500"
                            )}>
                              {f.type === "diploma" ? "school" : "verified"}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-slate-900 dark:text-white">{f.title}</p>
                            <p className="text-xs text-slate-500">{f.school} - {f.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">translate</span>
                      Langues parlees
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {freelancer.languages.map((lang) => (
                        <div
                          key={lang.name}
                          className="flex items-center gap-2 bg-white dark:bg-neutral-dark border border-slate-200 dark:border-border-dark rounded-lg px-4 py-2.5"
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{lang.name}</span>
                          <span className="text-xs text-slate-500">({lang.level})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Extra stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/30 text-center">
                      <span className="material-symbols-outlined text-2xl text-emerald-600 dark:text-emerald-400 mb-1">repeat</span>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{freelancer.stats.recurringClients}</p>
                      <p className="text-xs text-slate-500">Clients recurrents</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-200 dark:border-blue-800/30 text-center">
                      <span className="material-symbols-outlined text-2xl text-blue-600 dark:text-blue-400 mb-1">visibility</span>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{freelancer.stats.profileViews.toLocaleString("fr-FR")}</p>
                      <p className="text-xs text-slate-500">Vues du profil</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-200 dark:border-purple-800/30 text-center">
                      <span className="material-symbols-outlined text-2xl text-purple-600 dark:text-purple-400 mb-1">star</span>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{avgRating}/5</p>
                      <p className="text-xs text-slate-500">Note moyenne</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Portfolio Tab */}
              {activeTab === "portfolio" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {freelancer.portfolio.map((project) => (
                    <div
                      key={project.id}
                      className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/10 transition-colors z-10" />
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                        <p className="text-white font-bold">{project.title}</p>
                        <p className="text-white/80 text-xs mb-2">{project.subtitle}</p>
                        <div className="flex gap-1">
                          {project.tags.map((tag) => (
                            <span key={tag} className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
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
                      <p className="text-xs text-slate-500 mt-1">{freelancer.reviews.length} avis</p>
                    </div>
                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = freelancer.reviews.filter(
                          (r) => Math.floor(r.rating) === star
                        ).length;
                        const pct = (count / freelancer.reviews.length) * 100;
                        return (
                          <div key={star} className="flex items-center gap-2 text-xs">
                            <span className="w-3 text-slate-500">{star}</span>
                            <span className="material-symbols-outlined text-xs fill-icon text-amber-400">star</span>
                            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
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
                              <p className="text-slate-500 text-xs">{review.role}</p>
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
                              Reponse de {freelancer.name}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{review.response}</p>
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
                        onClick={() => setReviewPage(Math.min(totalReviewPages - 1, reviewPage + 1))}
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
            {/* Skills */}
            <div className="bg-primary/5 dark:bg-white/5 p-6 rounded-2xl border border-primary/10 shadow-sm">
              <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">psychology</span>
                Competences
              </h3>
              <div className="space-y-5">
                {freelancer.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-primary font-bold">{skill.level}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-700"
                        style={{ width: `${skill.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-primary/10 flex flex-wrap gap-2">
                {freelancer.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
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
                  <p className="text-2xl font-black">{freelancer.stats.completedOrders}</p>
                  <p className="text-[10px] uppercase tracking-wider opacity-80">Commandes</p>
                </div>
                <div className="bg-white/10 p-3 rounded-xl">
                  <p className="text-2xl font-black">{freelancer.stats.satisfactionRate}%</p>
                  <p className="text-[10px] uppercase tracking-wider opacity-80">Satisfaction</p>
                </div>
                <div className="bg-white/10 p-3 rounded-xl">
                  <p className="text-2xl font-black">{freelancer.stats.avgResponseTime}</p>
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
                Contactez {freelancer.name} pour discuter de votre projet et recevoir un devis personnalise.
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
              {freelancer.socialLinks.linkedin && (
                <a className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/10 transition-all" href={freelancer.socialLinks.linkedin} aria-label="LinkedIn">
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.493-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-2v-3.86c0-.881-.719-1.6-1.6-1.6s-1.6.719-1.6 1.6v3.86h-2v-6h2v1.135c.671-.647 1.62-1.135 2.6-1.135 1.989 0 3.6 1.611 3.6 3.6v2.399z" />
                  </svg>
                </a>
              )}
              {freelancer.socialLinks.github && (
                <a className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/10 transition-all" href={freelancer.socialLinks.github} aria-label="GitHub">
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              )}
              {freelancer.socialLinks.portfolio && (
                <a className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/10 transition-all" href={freelancer.socialLinks.portfolio} aria-label="Portfolio">
                  <span className="material-symbols-outlined text-xl">language</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Mes services -- visible section for ALL visitors              */}
      {/* ============================================================ */}
      <div className="w-full max-w-[1100px] px-4 md:px-10 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-slate-900 dark:text-slate-100 text-2xl font-extrabold flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">storefront</span>
            Mes services
            <span className="ml-1 text-sm font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
              {freelancer.services.length}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {freelancer.services.slice(0, 6).map((service) => {
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
                    loading="lazy"
                  />
                  {/* Category badge */}
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
        {freelancer.services.length > 6 && (
          <div className="flex justify-center mt-8">
            <Link
              href={`/explorer?freelance=${freelancer.username}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-colors border border-primary/20"
            >
              <span className="material-symbols-outlined text-lg">grid_view</span>
              Voir tous les services ({freelancer.services.length})
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
