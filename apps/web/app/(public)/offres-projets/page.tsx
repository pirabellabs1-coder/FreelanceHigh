"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCurrencyStore } from "@/store/currency";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Urgency = "normale" | "urgente" | "tres_urgente";
type ContractType = "ponctuel" | "long_terme" | "recurrent";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  urgency: Urgency;
  contractType: ContractType;
  skills: string[];
  clientName: string;
  clientRating: number;
  clientReviews: number;
  proposals: number;
  postedAt: string;
  country: string;
}

// ---------------------------------------------------------------------------
// Demo data
// ---------------------------------------------------------------------------

const DEMO_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Refonte UI/UX Dashboard SaaS",
    description:
      "Recherche designer UI/UX pour refonte complete d'un dashboard SaaS existant. Nous avons besoin d'un redesign moderne, intuitif et accessible qui ameliore l'experience utilisateur globale de notre produit.",
    category: "Design UI/UX",
    budgetMin: 1500,
    budgetMax: 3000,
    deadline: "2026-04-01",
    urgency: "normale",
    contractType: "ponctuel",
    skills: ["Figma", "React", "UI Design"],
    clientName: "NexGen Solutions",
    clientRating: 4.9,
    clientReviews: 12,
    proposals: 8,
    postedAt: "2026-02-26",
    country: "France",
  },
  {
    id: "proj-2",
    title: "Developpement API REST Node.js",
    description:
      "Creation API RESTful avec authentification JWT, gestion des roles utilisateurs, et integration base de donnees PostgreSQL. Architecture scalable requise avec documentation Swagger.",
    category: "Developpement Web",
    budgetMin: 2000,
    budgetMax: 4000,
    deadline: "2026-04-15",
    urgency: "urgente",
    contractType: "ponctuel",
    skills: ["Node.js", "TypeScript", "PostgreSQL"],
    clientName: "DataFlow Corp",
    clientRating: 4.7,
    clientReviews: 8,
    proposals: 3,
    postedAt: "2026-03-01",
    country: "Senegal",
  },
  {
    id: "proj-3",
    title: "Logo et Charte Graphique Fintech",
    description:
      "Creation logo et charte graphique complete pour startup fintech. Livrables attendus : logo vectoriel, palette couleurs, typographies, guide d'utilisation et templates reseaux sociaux.",
    category: "Identite Visuelle",
    budgetMin: 500,
    budgetMax: 1000,
    deadline: "2026-03-20",
    urgency: "normale",
    contractType: "ponctuel",
    skills: ["Logo Design", "Branding", "Illustrator"],
    clientName: "FinPay Startup",
    clientRating: 4.5,
    clientReviews: 5,
    proposals: 12,
    postedAt: "2026-03-02",
    country: "Cote d'Ivoire",
  },
  {
    id: "proj-4",
    title: "Application Mobile E-commerce",
    description:
      "Developpement app mobile React Native pour plateforme e-commerce panafricaine. Integration paiements mobiles (Orange Money, Wave, MTN MoMo), gestion catalogue et suivi commandes en temps reel.",
    category: "Application Mobile",
    budgetMin: 3000,
    budgetMax: 6000,
    deadline: "2026-05-01",
    urgency: "normale",
    contractType: "long_terme",
    skills: ["React Native", "TypeScript", "Firebase"],
    clientName: "AfriShop Ltd",
    clientRating: 4.8,
    clientReviews: 15,
    proposals: 6,
    postedAt: "2026-02-20",
    country: "Cameroun",
  },
  {
    id: "proj-5",
    title: "Campagne Marketing Digital",
    description:
      "Strategie marketing complete pour lancement produit SaaS sur le marche africain. SEO, Google Ads, campagnes reseaux sociaux, email marketing et suivi KPIs de performance.",
    category: "Marketing Digital",
    budgetMin: 1000,
    budgetMax: 2500,
    deadline: "2026-03-25",
    urgency: "tres_urgente",
    contractType: "ponctuel",
    skills: ["SEO", "Google Ads", "Social Media"],
    clientName: "TechAfrica Inc",
    clientRating: 4.6,
    clientReviews: 9,
    proposals: 4,
    postedAt: "2026-03-01",
    country: "Maroc",
  },
  {
    id: "proj-6",
    title: "Traduction Site Web FR/EN/AR",
    description:
      "Traduction complete d'un site e-commerce multilingue. Environ 150 pages a traduire du francais vers l'anglais et l'arabe avec adaptation culturelle et respect du ton de marque.",
    category: "Traduction",
    budgetMin: 400,
    budgetMax: 800,
    deadline: "2026-03-15",
    urgency: "urgente",
    contractType: "ponctuel",
    skills: ["Francais", "Anglais", "Arabe"],
    clientName: "MedConnect",
    clientRating: 4.4,
    clientReviews: 3,
    proposals: 9,
    postedAt: "2026-02-28",
    country: "France",
  },
  {
    id: "proj-7",
    title: "Video Promotionnelle 60s",
    description:
      "Creation video animee professionnelle pour presentation produit tech. Style flat design / motion graphics. Script fourni. Livrables en 1080p et format carre pour reseaux sociaux.",
    category: "Video & Animation",
    budgetMin: 800,
    budgetMax: 1500,
    deadline: "2026-04-10",
    urgency: "normale",
    contractType: "ponctuel",
    skills: ["After Effects", "Motion Design", "Animation"],
    clientName: "GreenTech CI",
    clientRating: 4.3,
    clientReviews: 6,
    proposals: 2,
    postedAt: "2026-03-02",
    country: "Cote d'Ivoire",
  },
  {
    id: "proj-8",
    title: "Redaction 20 Articles Blog SEO",
    description:
      "Redaction optimisee SEO pour blog tech. 20 articles de 1500 mots minimum sur les thematiques IA, cloud computing et cybersecurite. Publication WordPress incluse.",
    category: "Redaction & SEO",
    budgetMin: 600,
    budgetMax: 1200,
    deadline: "2026-04-20",
    urgency: "normale",
    contractType: "recurrent",
    skills: ["Redaction Web", "SEO", "WordPress"],
    clientName: "BlogMaster SN",
    clientRating: 4.7,
    clientReviews: 11,
    proposals: 7,
    postedAt: "2026-02-25",
    country: "Senegal",
  },
  {
    id: "proj-9",
    title: "Integration Systeme de Paiement Mobile",
    description:
      "Integration CinetPay et Stripe dans une application web existante. Gestion des webhooks, reconciliation automatique et tableaux de bord financier pour l'administrateur.",
    category: "Developpement Web",
    budgetMin: 1800,
    budgetMax: 3500,
    deadline: "2026-04-05",
    urgency: "urgente",
    contractType: "ponctuel",
    skills: ["Node.js", "Stripe API", "CinetPay", "React"],
    clientName: "PaySmart Africa",
    clientRating: 4.8,
    clientReviews: 7,
    proposals: 5,
    postedAt: "2026-02-27",
    country: "Senegal",
  },
  {
    id: "proj-10",
    title: "Design System Complet pour Startup",
    description:
      "Creation d'un design system complet avec composants Figma, tokens de design, documentation et implementation Storybook. Plus de 50 composants requis avec variantes.",
    category: "Design UI/UX",
    budgetMin: 2500,
    budgetMax: 5000,
    deadline: "2026-05-15",
    urgency: "normale",
    contractType: "long_terme",
    skills: ["Figma", "Storybook", "Design Tokens", "React"],
    clientName: "InnoTech Labs",
    clientRating: 4.9,
    clientReviews: 20,
    proposals: 10,
    postedAt: "2026-03-03",
    country: "France",
  },
  {
    id: "proj-11",
    title: "Chatbot IA Service Client",
    description:
      "Developpement d'un chatbot intelligent base sur GPT pour le service client d'une plateforme e-commerce. Integration WhatsApp Business API et tableau de bord analytics.",
    category: "Intelligence Artificielle",
    budgetMin: 3500,
    budgetMax: 7000,
    deadline: "2026-06-01",
    urgency: "normale",
    contractType: "long_terme",
    skills: ["Python", "OpenAI API", "NLP", "WhatsApp API"],
    clientName: "CommerceAI",
    clientRating: 4.6,
    clientReviews: 4,
    proposals: 3,
    postedAt: "2026-03-02",
    country: "Cameroun",
  },
  {
    id: "proj-12",
    title: "Audit Securite Application Web",
    description:
      "Audit complet de securite d'une application web SaaS : tests de penetration, analyse des vulnerabilites OWASP Top 10, rapport detaille et recommandations de remediation.",
    category: "Cybersecurite",
    budgetMin: 2000,
    budgetMax: 4500,
    deadline: "2026-03-30",
    urgency: "tres_urgente",
    contractType: "ponctuel",
    skills: ["Pentest", "OWASP", "Burp Suite", "Securite Web"],
    clientName: "SecureBank CI",
    clientRating: 4.9,
    clientReviews: 14,
    proposals: 1,
    postedAt: "2026-03-03",
    country: "Cote d'Ivoire",
  },
];

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORIES = [
  "Toutes les categories",
  "Design UI/UX",
  "Developpement Web",
  "Identite Visuelle",
  "Application Mobile",
  "Marketing Digital",
  "Traduction",
  "Video & Animation",
  "Redaction & SEO",
  "Intelligence Artificielle",
  "Cybersecurite",
];

const NIVEAUX = [
  "Tous les niveaux",
  "Debutant",
  "Intermediaire",
  "Expert",
];

const CONTRACT_TYPES: { value: string; label: string }[] = [
  { value: "tous", label: "Tous les types" },
  { value: "ponctuel", label: "Ponctuel" },
  { value: "long_terme", label: "Long terme" },
  { value: "recurrent", label: "Recurrent" },
];

const URGENCY_OPTIONS: { value: string; label: string }[] = [
  { value: "toutes", label: "Toutes les urgences" },
  { value: "normale", label: "Normale" },
  { value: "urgente", label: "Urgente" },
  { value: "tres_urgente", label: "Tres urgente" },
];

const SORT_OPTIONS: { value: string; label: string; icon: string }[] = [
  { value: "recommandes", label: "Recommandes", icon: "thumb_up" },
  { value: "budget_desc", label: "Budget decroissant", icon: "trending_down" },
  { value: "recents", label: "Plus recents", icon: "schedule" },
  { value: "urgents", label: "Urgents d'abord", icon: "priority_high" },
];

const ITEMS_PER_PAGE = 6;

const URGENCY_CONFIG: Record<
  Urgency,
  { label: string; bgClass: string; textClass: string; borderClass: string; icon: string }
> = {
  normale: {
    label: "Normale",
    bgClass: "bg-slate-100 dark:bg-slate-700/50",
    textClass: "text-slate-600 dark:text-slate-300",
    borderClass: "border-slate-200 dark:border-slate-600",
    icon: "schedule",
  },
  urgente: {
    label: "Urgent",
    bgClass: "bg-amber-50 dark:bg-amber-900/30",
    textClass: "text-amber-700 dark:text-amber-400",
    borderClass: "border-amber-200 dark:border-amber-700/50",
    icon: "warning",
  },
  tres_urgente: {
    label: "Tres urgent",
    bgClass: "bg-red-50 dark:bg-red-900/30",
    textClass: "text-red-700 dark:text-red-400",
    borderClass: "border-red-200 dark:border-red-700/50",
    icon: "error",
  },
};

const CONTRACT_LABELS: Record<ContractType, string> = {
  ponctuel: "Ponctuel",
  long_terme: "Long terme",
  recurrent: "Recurrent",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function daysAgo(dateStr: string): string {
  const diff = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Hier";
  return `Il y a ${diff} jours`;
}

function daysUntil(dateStr: string): string {
  const diff = Math.ceil(
    (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (diff <= 0) return "Expire";
  if (diff === 1) return "1 jour restant";
  return `${diff} jours restants`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative w-full">
      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
        search
      </span>
      <input
        type="text"
        placeholder="Rechercher un projet par titre, competence, categorie..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full pl-12 pr-4 py-3.5 rounded-xl text-sm font-medium",
          "bg-white dark:bg-neutral-dark",
          "border border-slate-200 dark:border-border-dark",
          "text-slate-900 dark:text-slate-100",
          "placeholder:text-slate-400 dark:placeholder:text-slate-500",
          "outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
          "transition-all"
        )}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      )}
    </div>
  );
}

function FilterSidebar({
  category,
  setCategory,
  budgetMin,
  setBudgetMin,
  budgetMax,
  setBudgetMax,
  deadline,
  setDeadline,
  niveau,
  setNiveau,
  contractType,
  setContractType,
  urgency,
  setUrgency,
  onReset,
  hasFilters,
}: {
  category: string;
  setCategory: (v: string) => void;
  budgetMin: string;
  setBudgetMin: (v: string) => void;
  budgetMax: string;
  setBudgetMax: (v: string) => void;
  deadline: string;
  setDeadline: (v: string) => void;
  niveau: string;
  setNiveau: (v: string) => void;
  contractType: string;
  setContractType: (v: string) => void;
  urgency: string;
  setUrgency: (v: string) => void;
  onReset: () => void;
  hasFilters: boolean;
}) {
  return (
    <aside className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">
            tune
          </span>
          Filtres
        </h3>
        {hasFilters && (
          <button
            onClick={onReset}
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">
              restart_alt
            </span>
            Reinitialiser
          </button>
        )}
      </div>

      {/* Category */}
      <FilterGroup label="Categorie" icon="category">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={cn(
            "w-full rounded-lg px-3 py-2.5 text-sm font-medium",
            "bg-white dark:bg-neutral-dark",
            "border border-slate-200 dark:border-border-dark",
            "text-slate-700 dark:text-slate-200",
            "outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
            "transition-all cursor-pointer"
          )}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </FilterGroup>

      {/* Budget */}
      <FilterGroup label="Budget (EUR)" icon="payments">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={budgetMin}
            onChange={(e) => setBudgetMin(e.target.value)}
            className={cn(
              "w-full rounded-lg px-3 py-2.5 text-sm font-medium",
              "bg-white dark:bg-neutral-dark",
              "border border-slate-200 dark:border-border-dark",
              "text-slate-700 dark:text-slate-200",
              "placeholder:text-slate-400 dark:placeholder:text-slate-500",
              "outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
              "transition-all"
            )}
          />
          <input
            type="number"
            placeholder="Max"
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value)}
            className={cn(
              "w-full rounded-lg px-3 py-2.5 text-sm font-medium",
              "bg-white dark:bg-neutral-dark",
              "border border-slate-200 dark:border-border-dark",
              "text-slate-700 dark:text-slate-200",
              "placeholder:text-slate-400 dark:placeholder:text-slate-500",
              "outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
              "transition-all"
            )}
          />
        </div>
      </FilterGroup>

      {/* Deadline */}
      <FilterGroup label="Delai" icon="event">
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className={cn(
            "w-full rounded-lg px-3 py-2.5 text-sm font-medium",
            "bg-white dark:bg-neutral-dark",
            "border border-slate-200 dark:border-border-dark",
            "text-slate-700 dark:text-slate-200",
            "outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
            "transition-all cursor-pointer"
          )}
        />
      </FilterGroup>

      {/* Niveau requis */}
      <FilterGroup label="Niveau requis" icon="school">
        <select
          value={niveau}
          onChange={(e) => setNiveau(e.target.value)}
          className={cn(
            "w-full rounded-lg px-3 py-2.5 text-sm font-medium",
            "bg-white dark:bg-neutral-dark",
            "border border-slate-200 dark:border-border-dark",
            "text-slate-700 dark:text-slate-200",
            "outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
            "transition-all cursor-pointer"
          )}
        >
          {NIVEAUX.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </FilterGroup>

      {/* Type de contrat */}
      <FilterGroup label="Type de contrat" icon="description">
        <div className="space-y-2">
          {CONTRACT_TYPES.map((ct) => (
            <label
              key={ct.value}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm font-medium",
                contractType === ct.value
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-neutral-dark border border-transparent"
              )}
            >
              <div
                className={cn(
                  "size-4 rounded-full border-2 flex items-center justify-center transition-all",
                  contractType === ct.value
                    ? "border-primary"
                    : "border-slate-300 dark:border-slate-600"
                )}
              >
                {contractType === ct.value && (
                  <div className="size-2 rounded-full bg-primary" />
                )}
              </div>
              {ct.label}
            </label>
          ))}
        </div>
      </FilterGroup>

      {/* Urgence */}
      <FilterGroup label="Urgence" icon="priority_high">
        <div className="space-y-2">
          {URGENCY_OPTIONS.map((u) => (
            <label
              key={u.value}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm font-medium",
                urgency === u.value
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-neutral-dark border border-transparent"
              )}
            >
              <div
                className={cn(
                  "size-4 rounded-full border-2 flex items-center justify-center transition-all",
                  urgency === u.value
                    ? "border-primary"
                    : "border-slate-300 dark:border-slate-600"
                )}
              >
                {urgency === u.value && (
                  <div className="size-2 rounded-full bg-primary" />
                )}
              </div>
              {u.label}
            </label>
          ))}
        </div>
      </FilterGroup>
    </aside>
  );
}

function FilterGroup({
  label,
  icon,
  children,
}: {
  label: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <span className="material-symbols-outlined text-sm">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

function SortBar({
  sort,
  setSort,
  total,
}: {
  sort: string;
  setSort: (v: string) => void;
  total: number;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
        <span className="text-slate-900 dark:text-slate-100 font-bold">
          {total}
        </span>{" "}
        {total === 1 ? "projet trouve" : "projets trouves"}
      </p>
      <div className="flex gap-2 flex-wrap">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSort(opt.value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
              sort === opt.value
                ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                : "bg-white dark:bg-neutral-dark text-slate-600 dark:text-slate-300 border-slate-200 dark:border-border-dark hover:border-primary/40 hover:text-primary"
            )}
          >
            <span className="material-symbols-outlined text-sm">
              {opt.icon}
            </span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: (p: Project) => void;
}) {
  const { format } = useCurrencyStore();
  const urgConfig = URGENCY_CONFIG[project.urgency];
  const showUrgencyBadge = project.urgency !== "normale";

  return (
    <div
      onClick={() => onSelect(project)}
      className={cn(
        "group relative flex flex-col p-5 rounded-2xl cursor-pointer",
        "bg-white dark:bg-neutral-dark",
        "border border-slate-200 dark:border-border-dark",
        "hover:border-primary/40 dark:hover:border-primary/40",
        "hover:shadow-lg hover:shadow-primary/5",
        "transition-all duration-200"
      )}
    >
      {/* Top row: category + urgency */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
            "bg-primary/10 text-primary border border-primary/20"
          )}
        >
          <span className="material-symbols-outlined text-sm">folder</span>
          {project.category}
        </span>
        {showUrgencyBadge && (
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border",
              urgConfig.bgClass,
              urgConfig.textClass,
              urgConfig.borderClass
            )}
          >
            <span className="material-symbols-outlined text-sm">
              {urgConfig.icon}
            </span>
            {urgConfig.label}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors leading-snug mb-2 line-clamp-2">
        {project.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-3">
        {project.description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className={cn(
              "px-2 py-0.5 text-xs font-semibold rounded-md",
              "bg-slate-100 dark:bg-background-dark",
              "text-slate-600 dark:text-slate-300",
              "border border-slate-200 dark:border-border-dark"
            )}
          >
            {skill}
          </span>
        ))}
        {project.skills.length > 4 && (
          <span className="px-2 py-0.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
            +{project.skills.length - 4}
          </span>
        )}
      </div>

      {/* Budget */}
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary text-lg">
          payments
        </span>
        <span className="text-sm font-extrabold text-primary">
          {format(project.budgetMin)} - {format(project.budgetMax)}
        </span>
      </div>

      {/* Client row */}
      <div className="flex items-center gap-2 mb-4">
        <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-sm">
            person
          </span>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
            {project.clientName}
          </span>
          <div className="flex items-center gap-0.5">
            <span className="material-symbols-outlined text-amber-500 text-sm">
              star
            </span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {project.clientRating}
            </span>
            <span className="text-xs text-slate-400">
              ({project.clientReviews})
            </span>
          </div>
        </div>
      </div>

      {/* Footer: proposals, deadline, posted */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-border-dark mt-auto">
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">group</span>
            {project.proposals} propositions
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">
              calendar_today
            </span>
            {daysUntil(project.deadline)}
          </span>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {daysAgo(project.postedAt)}
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(project);
        }}
        className={cn(
          "mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl",
          "bg-primary hover:bg-primary/90 text-white text-sm font-bold",
          "shadow-md shadow-primary/20 transition-all"
        )}
      >
        <span className="material-symbols-outlined text-sm">send</span>
        Postuler
      </button>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | "ellipsis")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8 py-4">
      <button
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(
          "size-10 flex items-center justify-center rounded-xl border transition-all",
          "bg-white dark:bg-neutral-dark border-slate-200 dark:border-border-dark",
          "text-slate-600 dark:text-slate-300",
          "hover:bg-primary hover:text-white hover:border-primary",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-neutral-dark disabled:hover:text-slate-600 dark:disabled:hover:text-slate-300"
        )}
      >
        <span className="material-symbols-outlined text-xl">chevron_left</span>
      </button>

      {pages.map((page, idx) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${idx}`}
            className="text-slate-400 px-1 select-none"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onChange(page as number)}
            className={cn(
              "size-10 flex items-center justify-center rounded-xl border text-sm font-bold transition-all",
              currentPage === page
                ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                : "bg-white dark:bg-neutral-dark border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white hover:border-primary"
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(
          "size-10 flex items-center justify-center rounded-xl border transition-all",
          "bg-white dark:bg-neutral-dark border-slate-200 dark:border-border-dark",
          "text-slate-600 dark:text-slate-300",
          "hover:bg-primary hover:text-white hover:border-primary",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-neutral-dark disabled:hover:text-slate-600 dark:disabled:hover:text-slate-300"
        )}
      >
        <span className="material-symbols-outlined text-xl">
          chevron_right
        </span>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Detail slide-over
// ---------------------------------------------------------------------------

function ProjectDetailPanel({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const { format } = useCurrencyStore();
  const urgConfig = URGENCY_CONFIG[project.urgency];

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-white dark:bg-background-dark border-l border-slate-200 dark:border-border-dark shadow-2xl animate-slide-in overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-border-dark px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate pr-4">
            Detail du projet
          </h2>
          <button
            onClick={onClose}
            className="size-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-neutral-dark hover:bg-slate-200 dark:hover:bg-border-dark transition-colors"
          >
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">
              close
            </span>
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold",
                "bg-primary/10 text-primary border border-primary/20"
              )}
            >
              <span className="material-symbols-outlined text-sm">folder</span>
              {project.category}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border",
                urgConfig.bgClass,
                urgConfig.textClass,
                urgConfig.borderClass
              )}
            >
              <span className="material-symbols-outlined text-sm">
                {urgConfig.icon}
              </span>
              {urgConfig.label}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold",
                "bg-slate-100 dark:bg-neutral-dark text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-border-dark"
              )}
            >
              <span className="material-symbols-outlined text-sm">
                description
              </span>
              {CONTRACT_LABELS[project.contractType]}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
            {project.title}
          </h3>

          {/* Client profile */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-neutral-dark border border-slate-200 dark:border-border-dark">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-2xl">
                person
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                {project.clientName}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-amber-500 text-sm">
                    star
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {project.clientRating}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  ({project.clientReviews} avis)
                </span>
                <span className="text-xs text-slate-400">
                  {project.country}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-lg">
                article
              </span>
              Description du projet
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Skills / Requirements */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-lg">
                construction
              </span>
              Competences requises
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <span
                  key={skill}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold rounded-full",
                    "bg-primary/10 text-primary border border-primary/20"
                  )}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Budget, deadline, contract */}
          <div className="grid grid-cols-1 gap-3">
            <DetailInfoRow
              icon="payments"
              label="Budget"
              value={`${format(project.budgetMin)} - ${format(project.budgetMax)}`}
              valueClass="text-primary font-extrabold"
            />
            <DetailInfoRow
              icon="event"
              label="Deadline"
              value={new Date(project.deadline).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
            <DetailInfoRow
              icon="schedule"
              label="Temps restant"
              value={daysUntil(project.deadline)}
            />
            <DetailInfoRow
              icon="description"
              label="Type de contrat"
              value={CONTRACT_LABELS[project.contractType]}
            />
            <DetailInfoRow
              icon="location_on"
              label="Pays"
              value={project.country}
            />
            <DetailInfoRow
              icon="group"
              label="Propositions recues"
              value={`${project.proposals} candidatures`}
            />
            <DetailInfoRow
              icon="calendar_today"
              label="Publie"
              value={daysAgo(project.postedAt)}
            />
          </div>

          {/* CTA */}
          <div className="pt-4 border-t border-slate-200 dark:border-border-dark space-y-3">
            <a
              href="/dashboard/propositions"
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl",
                "bg-primary hover:bg-primary/90 text-white text-sm font-bold",
                "shadow-lg shadow-primary/20 transition-all"
              )}
            >
              <span className="material-symbols-outlined text-lg">send</span>
              Soumettre une proposition
            </a>
            <button
              onClick={onClose}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3 rounded-xl",
                "bg-slate-100 dark:bg-neutral-dark",
                "text-slate-600 dark:text-slate-300 text-sm font-bold",
                "border border-slate-200 dark:border-border-dark",
                "hover:bg-slate-200 dark:hover:bg-border-dark transition-all"
              )}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailInfoRow({
  icon,
  label,
  value,
  valueClass,
}: {
  icon: string;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-neutral-dark border border-slate-100 dark:border-border-dark">
      <span className="material-symbols-outlined text-primary text-lg">
        {icon}
      </span>
      <div className="flex items-center justify-between flex-1 gap-4 min-w-0">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
          {label}
        </span>
        <span
          className={cn(
            "text-sm font-bold text-slate-900 dark:text-slate-100 text-right truncate",
            valueClass
          )}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile filters drawer
// ---------------------------------------------------------------------------

function MobileFiltersDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-white dark:bg-background-dark border-r border-slate-200 dark:border-border-dark shadow-2xl animate-slide-in overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-border-dark px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Filtres
          </h2>
          <button
            onClick={onClose}
            className="size-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-neutral-dark hover:bg-slate-200 dark:hover:bg-border-dark transition-colors"
          >
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">
              close
            </span>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function OffresProjectsPage() {
  // Search & filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [deadline, setDeadline] = useState("");
  const [niveau, setNiveau] = useState(NIVEAUX[0]);
  const [contractType, setContractType] = useState("tous");
  const [urgency, setUrgency] = useState("toutes");

  // Sort & pagination
  const [sort, setSort] = useState("recommandes");
  const [currentPage, setCurrentPage] = useState(1);

  // UI
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const hasFilters =
    category !== CATEGORIES[0] ||
    budgetMin !== "" ||
    budgetMax !== "" ||
    deadline !== "" ||
    niveau !== NIVEAUX[0] ||
    contractType !== "tous" ||
    urgency !== "toutes" ||
    search !== "";

  const resetFilters = useCallback(() => {
    setSearch("");
    setCategory(CATEGORIES[0]);
    setBudgetMin("");
    setBudgetMax("");
    setDeadline("");
    setNiveau(NIVEAUX[0]);
    setContractType("tous");
    setUrgency("toutes");
    setCurrentPage(1);
  }, []);

  // Filter + sort logic
  const filteredProjects = useMemo(() => {
    let result = [...DEMO_PROJECTS];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.skills.some((s) => s.toLowerCase().includes(q)) ||
          p.clientName.toLowerCase().includes(q)
      );
    }

    // Category
    if (category !== CATEGORIES[0]) {
      result = result.filter((p) => p.category === category);
    }

    // Budget min
    if (budgetMin) {
      const min = parseFloat(budgetMin);
      if (!isNaN(min)) {
        result = result.filter((p) => p.budgetMax >= min);
      }
    }

    // Budget max
    if (budgetMax) {
      const max = parseFloat(budgetMax);
      if (!isNaN(max)) {
        result = result.filter((p) => p.budgetMin <= max);
      }
    }

    // Deadline
    if (deadline) {
      result = result.filter(
        (p) => new Date(p.deadline) <= new Date(deadline)
      );
    }

    // Contract type
    if (contractType !== "tous") {
      result = result.filter((p) => p.contractType === contractType);
    }

    // Urgency
    if (urgency !== "toutes") {
      result = result.filter((p) => p.urgency === urgency);
    }

    // Sort
    switch (sort) {
      case "budget_desc":
        result.sort((a, b) => b.budgetMax - a.budgetMax);
        break;
      case "recents":
        result.sort(
          (a, b) =>
            new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
        );
        break;
      case "urgents":
        {
          const urgencyOrder: Record<string, number> = {
            tres_urgente: 0,
            urgente: 1,
            normale: 2,
          };
          result.sort(
            (a, b) =>
              (urgencyOrder[a.urgency] ?? 2) - (urgencyOrder[b.urgency] ?? 2)
          );
        }
        break;
      case "recommandes":
      default:
        result.sort(
          (a, b) =>
            b.clientRating * b.clientReviews -
            a.clientRating * a.clientReviews
        );
        break;
    }

    return result;
  }, [search, category, budgetMin, budgetMax, deadline, contractType, urgency, sort]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)
  );
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, budgetMin, budgetMax, deadline, contractType, urgency, sort]);

  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedProject(null);
  }, []);

  const sidebarContent = (
    <FilterSidebar
      category={category}
      setCategory={setCategory}
      budgetMin={budgetMin}
      setBudgetMin={setBudgetMin}
      budgetMax={budgetMax}
      setBudgetMax={setBudgetMax}
      deadline={deadline}
      setDeadline={setDeadline}
      niveau={niveau}
      setNiveau={setNiveau}
      contractType={contractType}
      setContractType={setContractType}
      urgency={urgency}
      setUrgency={setUrgency}
      onReset={resetFilters}
      hasFilters={hasFilters}
    />
  );

  return (
    <>
      <section className="px-6 lg:px-20 pt-10 pb-20">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* ---------------------------------------------------------------- */}
          {/* Header                                                           */}
          {/* ---------------------------------------------------------------- */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  Offres de Projets
                </h1>
                <p className="text-base text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                  Explorez les missions publiees par nos clients et trouvez le
                  projet qui correspond a vos competences. Postulez directement
                  et commencez a collaborer.
                </p>
              </div>
              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className={cn(
                  "lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl",
                  "bg-white dark:bg-neutral-dark",
                  "border border-slate-200 dark:border-border-dark",
                  "text-sm font-bold text-slate-700 dark:text-slate-200",
                  "hover:border-primary/40 transition-all flex-shrink-0"
                )}
              >
                <span className="material-symbols-outlined text-primary text-lg">
                  tune
                </span>
                Filtres
                {hasFilters && (
                  <span className="size-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    !
                  </span>
                )}
              </button>
            </div>

            {/* Search bar */}
            <SearchBar value={search} onChange={setSearch} />
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Sort bar                                                         */}
          {/* ---------------------------------------------------------------- */}
          <SortBar
            sort={sort}
            setSort={setSort}
            total={filteredProjects.length}
          />

          {/* ---------------------------------------------------------------- */}
          {/* Main layout: sidebar + grid                                      */}
          {/* ---------------------------------------------------------------- */}
          <div className="flex gap-8">
            {/* Sidebar (desktop) */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-28 p-5 rounded-2xl bg-white dark:bg-neutral-dark border border-slate-200 dark:border-border-dark">
                {sidebarContent}
              </div>
            </div>

            {/* Projects grid */}
            <div className="flex-1 min-w-0">
              {paginatedProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {paginatedProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onSelect={handleSelectProject}
                    />
                  ))}
                </div>
              ) : (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="size-20 rounded-2xl bg-slate-100 dark:bg-neutral-dark flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-4xl">
                      search_off
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Aucun projet trouve
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
                    Aucun projet ne correspond a vos criteres de recherche.
                    Essayez de modifier vos filtres ou effectuez une nouvelle
                    recherche.
                  </p>
                  <button
                    onClick={resetFilters}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2.5 rounded-xl",
                      "bg-primary hover:bg-primary/90 text-white text-sm font-bold",
                      "shadow-md shadow-primary/20 transition-all"
                    )}
                  >
                    <span className="material-symbols-outlined text-sm">
                      restart_alt
                    </span>
                    Reinitialiser les filtres
                  </button>
                </div>
              )}

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile filters drawer */}
      <MobileFiltersDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
      >
        {sidebarContent}
      </MobileFiltersDrawer>

      {/* Detail slide-over */}
      {selectedProject && (
        <ProjectDetailPanel
          project={selectedProject}
          onClose={handleCloseDetail}
        />
      )}
    </>
  );
}
