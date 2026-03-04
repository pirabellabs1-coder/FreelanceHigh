"use client";

import { useState, useCallback } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/ui/confirm-modal";

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------

interface Forfait {
  name: string;
  price: string;
  delai: string;
  revisions: string;
  inclusions: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface AgenceService {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  price: string;
  status: "actif" | "pause";
  views: number;
  orders: number;
  revenue: number;
  conversion: number;
  tags: string[];
  forfaits: Forfait[];
  faq: FaqItem[];
}

interface ServiceFormData {
  title: string;
  category: string;
  subcategory: string;
  description: string;
  forfaits: Forfait[];
  tags: string[];
  faq: FaqItem[];
}

// -------------------------------------------------------------------
// Constants
// -------------------------------------------------------------------

const CATEGORIES = [
  "Développement",
  "Design",
  "Marketing",
  "Rédaction",
  "Traduction",
  "Consulting",
  "Formation",
  "Vidéo & Animation",
  "Musique & Audio",
  "Data & IA",
];

const SUBCATEGORIES: Record<string, string[]> = {
  "Développement": ["Frontend", "Backend", "Full-Stack", "E-commerce", "CMS", "SaaS", "API"],
  "Design": ["Web Design", "App Design", "Prototype", "Design System", "Wireframes", "Branding"],
  "Marketing": ["SEO", "SEA", "Social Media", "Email Marketing", "Content Marketing", "Analytics"],
  "Rédaction": ["Rédaction web", "Articles blog", "Copywriting", "SEO technique", "Traduction"],
  "Traduction": ["Français-Anglais", "Français-Arabe", "Localisation", "Sous-titrage"],
  "Consulting": ["Consulting IT", "Stratégie digitale", "Audit", "Formation"],
  "Formation": ["Développement", "Design", "Marketing", "Business", "Data"],
  "Vidéo & Animation": ["Montage", "Motion design", "Animation 2D/3D", "Pub vidéo", "YouTube"],
  "Musique & Audio": ["Musique", "Podcast", "Sound design", "Voix-off"],
  "Data & IA": ["Data Science", "Machine Learning", "Analytics", "Visualisation", "Automatisation"],
};

const INITIAL_FORFAITS: Forfait[] = [
  { name: "Basique", price: "", delai: "", revisions: "1", inclusions: "" },
  { name: "Standard", price: "", delai: "", revisions: "3", inclusions: "" },
  { name: "Premium", price: "", delai: "", revisions: "Illimitées", inclusions: "" },
];

const EMPTY_FORM: ServiceFormData = {
  title: "",
  category: "",
  subcategory: "",
  description: "",
  forfaits: INITIAL_FORFAITS,
  tags: [],
  faq: [],
};

const DEFAULT_SERVICES: AgenceService[] = [
  {
    id: "1",
    title: "Développement Web Full-Stack",
    category: "Développement",
    subcategory: "Full-Stack",
    description: "Développement d'applications web modernes avec React, Next.js et Node.js. Du site vitrine à l'application complexe.",
    price: "€2 500",
    status: "actif",
    views: 1240,
    orders: 18,
    revenue: 45000,
    conversion: 1.5,
    tags: ["React", "Node.js", "TypeScript"],
    forfaits: [
      { name: "Basique", price: "1500", delai: "7 jours", revisions: "1", inclusions: "Landing page simple" },
      { name: "Standard", price: "2500", delai: "14 jours", revisions: "3", inclusions: "Site vitrine 5 pages" },
      { name: "Premium", price: "5000", delai: "30 jours", revisions: "Illimitées", inclusions: "Application web complète" },
    ],
    faq: [{ question: "Quelles technologies utilisez-vous ?", answer: "React, Next.js, Node.js, TypeScript, PostgreSQL." }],
  },
  {
    id: "2",
    title: "Design UI/UX Mobile",
    category: "Design",
    subcategory: "App Design",
    description: "Design d'interfaces mobiles intuitives et modernes avec Figma. Prototypage et design system inclus.",
    price: "€1 800",
    status: "actif",
    views: 980,
    orders: 12,
    revenue: 21600,
    conversion: 1.2,
    tags: ["Figma", "Mobile", "UI/UX"],
    forfaits: [
      { name: "Basique", price: "800", delai: "5 jours", revisions: "1", inclusions: "3 écrans" },
      { name: "Standard", price: "1800", delai: "10 jours", revisions: "3", inclusions: "10 écrans + prototype" },
      { name: "Premium", price: "3500", delai: "21 jours", revisions: "Illimitées", inclusions: "App complète + design system" },
    ],
    faq: [],
  },
  {
    id: "3",
    title: "Audit SEO Complet",
    category: "Marketing",
    subcategory: "SEO",
    description: "Audit technique et sémantique complet de votre site avec rapport détaillé et plan d'action.",
    price: "€800",
    status: "actif",
    views: 750,
    orders: 22,
    revenue: 17600,
    conversion: 2.9,
    tags: ["SEO", "Google", "Analytics"],
    forfaits: [
      { name: "Basique", price: "400", delai: "3 jours", revisions: "1", inclusions: "Audit technique" },
      { name: "Standard", price: "800", delai: "7 jours", revisions: "2", inclusions: "Audit complet + rapport" },
      { name: "Premium", price: "1500", delai: "14 jours", revisions: "3", inclusions: "Audit + stratégie 6 mois" },
    ],
    faq: [{ question: "Quels outils utilisez-vous ?", answer: "Semrush, Ahrefs, Google Search Console, Screaming Frog." }],
  },
  {
    id: "4",
    title: "Branding & Identité Visuelle",
    category: "Design",
    subcategory: "Branding",
    description: "Création d'identité visuelle complète : logo, charte graphique, papeterie et guidelines.",
    price: "€3 200",
    status: "actif",
    views: 620,
    orders: 8,
    revenue: 25600,
    conversion: 1.3,
    tags: ["Branding", "Logo", "Charte graphique"],
    forfaits: [
      { name: "Basique", price: "1200", delai: "5 jours", revisions: "2", inclusions: "Logo + carte de visite" },
      { name: "Standard", price: "3200", delai: "14 jours", revisions: "3", inclusions: "Logo + charte graphique" },
      { name: "Premium", price: "6000", delai: "30 jours", revisions: "Illimitées", inclusions: "Identité visuelle complète" },
    ],
    faq: [],
  },
  {
    id: "5",
    title: "Campagne Ads Facebook/Google",
    category: "Marketing",
    subcategory: "SEA",
    description: "Création et gestion de campagnes publicitaires sur Facebook et Google avec optimisation ROI.",
    price: "€1 200",
    status: "pause",
    views: 430,
    orders: 5,
    revenue: 6000,
    conversion: 1.2,
    tags: ["Ads", "Facebook", "Google"],
    forfaits: [
      { name: "Basique", price: "600", delai: "3 jours", revisions: "1", inclusions: "Création 1 campagne" },
      { name: "Standard", price: "1200", delai: "7 jours", revisions: "2", inclusions: "2 campagnes + optimisation" },
      { name: "Premium", price: "2500", delai: "30 jours", revisions: "Illimitées", inclusions: "Gestion complète 1 mois" },
    ],
    faq: [],
  },
  {
    id: "6",
    title: "API & Intégration Backend",
    category: "Développement",
    subcategory: "API",
    description: "Conception et développement d'APIs REST/GraphQL performantes avec documentation complète.",
    price: "€3 500",
    status: "actif",
    views: 520,
    orders: 7,
    revenue: 24500,
    conversion: 1.3,
    tags: ["API", "Backend", "Node.js"],
    forfaits: [
      { name: "Basique", price: "1500", delai: "5 jours", revisions: "1", inclusions: "API REST basique" },
      { name: "Standard", price: "3500", delai: "14 jours", revisions: "3", inclusions: "API complète + docs" },
      { name: "Premium", price: "7000", delai: "30 jours", revisions: "Illimitées", inclusions: "Microservices + CI/CD" },
    ],
    faq: [],
  },
  {
    id: "7",
    title: "Rédaction Web SEO",
    category: "Rédaction",
    subcategory: "Rédaction web",
    description: "Rédaction d'articles et contenus web optimisés pour le référencement naturel.",
    price: "€500",
    status: "actif",
    views: 890,
    orders: 30,
    revenue: 15000,
    conversion: 3.4,
    tags: ["Rédaction", "SEO", "Contenu"],
    forfaits: [
      { name: "Basique", price: "200", delai: "2 jours", revisions: "1", inclusions: "1 article 1000 mots" },
      { name: "Standard", price: "500", delai: "5 jours", revisions: "2", inclusions: "3 articles optimisés" },
      { name: "Premium", price: "1200", delai: "14 jours", revisions: "Illimitées", inclusions: "10 articles + stratégie" },
    ],
    faq: [],
  },
  {
    id: "8",
    title: "Maintenance & Support Mensuel",
    category: "Développement",
    subcategory: "Backend",
    description: "Service de maintenance et support technique continu avec monitoring et SLA garantis.",
    price: "€600/mois",
    status: "actif",
    views: 340,
    orders: 10,
    revenue: 36000,
    conversion: 2.9,
    tags: ["Maintenance", "Support", "SLA"],
    forfaits: [
      { name: "Basique", price: "300", delai: "Mensuel", revisions: "—", inclusions: "5h/mois support" },
      { name: "Standard", price: "600", delai: "Mensuel", revisions: "—", inclusions: "15h/mois + monitoring" },
      { name: "Premium", price: "1500", delai: "Mensuel", revisions: "—", inclusions: "Illimité + SLA 4h" },
    ],
    faq: [],
  },
];

const STATS_CARDS = [
  { label: "Total services", value: "8", icon: "work", color: "text-primary" },
  { label: "Services actifs", value: "7", icon: "check_circle", color: "text-emerald-400" },
  { label: "CA total services", value: "€191 300", icon: "payments", color: "text-amber-400" },
  { label: "Taux conversion", value: "1.9%", icon: "trending_up", color: "text-blue-400" },
];

// -------------------------------------------------------------------
// Step Components
// -------------------------------------------------------------------

function StepIndicator({ current, total }: { current: number; total: number }) {
  const labels = ["Informations", "Forfaits", "Tags & FAQ", "Aperçu"];
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2 flex-1">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors",
              i < current
                ? "bg-primary text-background-dark"
                : i === current
                ? "bg-primary/20 text-primary border border-primary"
                : "bg-border-dark text-slate-500"
            )}
          >
            {i < current ? (
              <span className="material-symbols-outlined text-sm">check</span>
            ) : (
              i + 1
            )}
          </div>
          <span
            className={cn(
              "text-xs font-medium hidden sm:block truncate",
              i <= current ? "text-white" : "text-slate-500"
            )}
          >
            {labels[i]}
          </span>
          {i < total - 1 && (
            <div
              className={cn(
                "flex-1 h-px",
                i < current ? "bg-primary" : "bg-border-dark"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Step1Info({
  form,
  onChange,
}: {
  form: ServiceFormData;
  onChange: (updates: Partial<ServiceFormData>) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-1.5">
          Titre du service <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Ex : Développement Web Full-Stack"
          className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-1.5">
          Catégorie <span className="text-red-400">*</span>
        </label>
        <select
          value={form.category}
          onChange={(e) => onChange({ category: e.target.value, subcategory: "" })}
          className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors appearance-none"
        >
          <option value="">Sélectionner une catégorie</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      {form.category && SUBCATEGORIES[form.category] && (
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5">
            Sous-catégorie <span className="text-red-400">*</span>
          </label>
          <select
            value={form.subcategory}
            onChange={(e) => onChange({ subcategory: e.target.value })}
            className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors appearance-none"
          >
            <option value="">Sélectionner une sous-catégorie</option>
            {SUBCATEGORIES[form.category].map((sc) => (
              <option key={sc} value={sc}>
                {sc}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-1.5">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Décrivez votre service en détail..."
          rows={6}
          className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary transition-colors resize-none"
        />
        <p className="text-[11px] text-slate-500 mt-1">
          {form.description.length}/2000 caractères
        </p>
      </div>
    </div>
  );
}

function Step2Forfaits({
  form,
  onChange,
}: {
  form: ServiceFormData;
  onChange: (updates: Partial<ServiceFormData>) => void;
}) {
  function updateForfait(index: number, field: keyof Forfait, value: string) {
    const updated = form.forfaits.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
    onChange({ forfaits: updated });
  }

  const forfaitColors = ["text-slate-400", "text-primary", "text-amber-400"];
  const forfaitBorders = ["border-slate-700", "border-primary/30", "border-amber-500/30"];

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        Configurez les 3 niveaux de forfait pour votre service.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {form.forfaits.map((forfait, i) => (
          <div
            key={forfait.name}
            className={cn(
              "bg-background-dark border rounded-xl p-4 space-y-3",
              forfaitBorders[i]
            )}
          >
            <h4 className={cn("text-sm font-bold", forfaitColors[i])}>
              {forfait.name}
            </h4>
            <div>
              <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1">
                Prix (EUR)
              </label>
              <input
                type="text"
                value={forfait.price}
                onChange={(e) => updateForfait(i, "price", e.target.value)}
                placeholder="0"
                className="w-full bg-neutral-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1">
                Délai de livraison
              </label>
              <input
                type="text"
                value={forfait.delai}
                onChange={(e) => updateForfait(i, "delai", e.target.value)}
                placeholder="Ex : 7 jours"
                className="w-full bg-neutral-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1">
                Révisions
              </label>
              <input
                type="text"
                value={forfait.revisions}
                onChange={(e) => updateForfait(i, "revisions", e.target.value)}
                placeholder="Ex : 3"
                className="w-full bg-neutral-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1">
                Inclusions
              </label>
              <textarea
                value={forfait.inclusions}
                onChange={(e) => updateForfait(i, "inclusions", e.target.value)}
                placeholder="Ce qui est inclus..."
                rows={3}
                className="w-full bg-neutral-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step3TagsFaq({
  form,
  onChange,
}: {
  form: ServiceFormData;
  onChange: (updates: Partial<ServiceFormData>) => void;
}) {
  const [tagInput, setTagInput] = useState("");
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      onChange({ tags: [...form.tags, tag] });
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    onChange({ tags: form.tags.filter((t) => t !== tag) });
  }

  function addFaq() {
    if (faqQuestion.trim() && faqAnswer.trim()) {
      onChange({
        faq: [...form.faq, { question: faqQuestion.trim(), answer: faqAnswer.trim() }],
      });
      setFaqQuestion("");
      setFaqAnswer("");
    }
  }

  function removeFaq(index: number) {
    onChange({ faq: form.faq.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-6">
      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Ajouter un tag..."
            className="flex-1 bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold hover:bg-primary/20 transition-colors"
          >
            Ajouter
          </button>
        </div>
        {form.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-400 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* FAQ */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Questions fréquentes
        </label>
        <div className="space-y-3 mb-3">
          <input
            type="text"
            value={faqQuestion}
            onChange={(e) => setFaqQuestion(e.target.value)}
            placeholder="Question..."
            className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary transition-colors"
          />
          <textarea
            value={faqAnswer}
            onChange={(e) => setFaqAnswer(e.target.value)}
            placeholder="Réponse..."
            rows={3}
            className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary transition-colors resize-none"
          />
          <button
            type="button"
            onClick={addFaq}
            disabled={!faqQuestion.trim() || !faqAnswer.trim()}
            className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">add</span>
              Ajouter une FAQ
            </span>
          </button>
        </div>

        {form.faq.length > 0 && (
          <div className="space-y-2">
            {form.faq.map((item, i) => (
              <div
                key={i}
                className="bg-background-dark border border-border-dark rounded-lg p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{item.question}</p>
                    <p className="text-xs text-slate-400 mt-1">{item.answer}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFaq(i)}
                    className="text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Step4Preview({ form }: { form: ServiceFormData }) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-400 mb-4">
        Vérifiez les informations avant de publier votre service.
      </p>

      {/* General info */}
      <div className="bg-background-dark border border-border-dark rounded-xl p-4 space-y-2">
        <h4 className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
          Informations
        </h4>
        <p className="text-lg font-bold text-white">{form.title || "Sans titre"}</p>
        <p className="text-sm text-primary">
          {form.category || "Aucune catégorie"}
          {form.subcategory && <span className="text-slate-400"> / {form.subcategory}</span>}
        </p>
        <p className="text-sm text-slate-400 whitespace-pre-wrap">
          {form.description || "Aucune description"}
        </p>
      </div>

      {/* Forfaits */}
      <div className="bg-background-dark border border-border-dark rounded-xl p-4">
        <h4 className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">
          Forfaits
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {form.forfaits.map((f) => (
            <div key={f.name} className="border border-border-dark rounded-lg p-3">
              <p className="text-sm font-bold text-white">{f.name}</p>
              <p className="text-lg font-black text-primary mt-1">
                {f.price ? `€${f.price}` : "—"}
              </p>
              <div className="mt-2 space-y-1 text-xs text-slate-400">
                <p>Délai : {f.delai || "—"}</p>
                <p>Révisions : {f.revisions || "—"}</p>
                <p>Inclus : {f.inclusions || "—"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      {form.tags.length > 0 && (
        <div className="bg-background-dark border border-border-dark rounded-xl p-4">
          <h4 className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
            Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      {form.faq.length > 0 && (
        <div className="bg-background-dark border border-border-dark rounded-xl p-4">
          <h4 className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
            FAQ ({form.faq.length})
          </h4>
          <div className="space-y-2">
            {form.faq.map((item, i) => (
              <div key={i}>
                <p className="text-sm font-semibold text-white">{item.question}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------------
// Service Wizard Modal
// -------------------------------------------------------------------

function ServiceWizardModal({
  open,
  editService,
  onClose,
  onSave,
}: {
  open: boolean;
  editService: AgenceService | null;
  onClose: () => void;
  onSave: (form: ServiceFormData) => void;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ServiceFormData>(() => {
    if (editService) {
      return {
        title: editService.title,
        category: editService.category,
        subcategory: editService.subcategory || "",
        description: editService.description || "",
        forfaits: editService.forfaits.length > 0 ? editService.forfaits : INITIAL_FORFAITS,
        tags: editService.tags,
        faq: editService.faq,
      };
    }
    return EMPTY_FORM;
  });

  const updateForm = useCallback(
    (updates: Partial<ServiceFormData>) => {
      setForm((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  function canProceed() {
    if (step === 0) return form.title.trim() !== "" && form.category !== "";
    if (step === 1) return form.forfaits.some((f) => f.price.trim() !== "");
    return true;
  }

  function handleNext() {
    if (step < 3) setStep(step + 1);
    else {
      onSave(form);
      onClose();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-[5vh] overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-neutral-dark border border-border-dark rounded-2xl w-full max-w-3xl shadow-2xl animate-scale-in my-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-dark">
          <div>
            <h2 className="text-lg font-bold text-white">
              {editService ? "Modifier le service" : "Nouveau service"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {editService
                ? "Modifiez les informations de votre service."
                : "Créez un nouveau service pour votre agence."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-5">
          <StepIndicator current={step} total={4} />
        </div>

        {/* Content */}
        <div className="px-6 pb-4 min-h-[320px]">
          {step === 0 && <Step1Info form={form} onChange={updateForm} />}
          {step === 1 && <Step2Forfaits form={form} onChange={updateForm} />}
          {step === 2 && <Step3TagsFaq form={form} onChange={updateForm} />}
          {step === 3 && <Step4Preview form={form} />}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border-dark">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-200 bg-border-dark rounded-lg transition-colors"
          >
            Annuler
          </button>
          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 text-sm font-semibold text-slate-300 border border-border-dark rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Précédent
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-5 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-lg hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {step === 3 ? (
                <>
                  <span className="material-symbols-outlined text-sm">publish</span>
                  {editService ? "Enregistrer" : "Publier"}
                </>
              ) : (
                <>
                  Suivant
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// Main Page
// -------------------------------------------------------------------

export default function AgenceServices() {
  const [services, setServices] = useState<AgenceService[]>(DEFAULT_SERVICES);
  const [filter, setFilter] = useState("tous");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingService, setEditingService] = useState<AgenceService | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AgenceService | null>(null);
  const { addToast } = useToastStore();

  const filtered =
    filter === "tous"
      ? services
      : filter === "actif"
      ? services.filter((s) => s.status === "actif")
      : services.filter((s) => s.status === "pause");

  const activeCount = services.filter((s) => s.status === "actif").length;
  const totalRevenue = services.reduce((sum, s) => sum + s.revenue, 0);
  const avgConversion =
    services.length > 0
      ? (services.reduce((sum, s) => sum + s.conversion, 0) / services.length).toFixed(1)
      : "0";

  const dynamicStats = [
    { label: "Total services", value: String(services.length), icon: "work", color: "text-primary" },
    { label: "Services actifs", value: String(activeCount), icon: "check_circle", color: "text-emerald-400" },
    { label: "CA total services", value: `€${totalRevenue.toLocaleString("fr-FR")}`, icon: "payments", color: "text-amber-400" },
    { label: "Taux conversion", value: `${avgConversion}%`, icon: "trending_up", color: "text-blue-400" },
  ];

  // Open wizard for new service
  function handleNewService() {
    setEditingService(null);
    setWizardOpen(true);
  }

  // Open wizard for editing
  function handleEdit(service: AgenceService) {
    setEditingService(service);
    setWizardOpen(true);
  }

  // Save from wizard
  function handleWizardSave(form: ServiceFormData) {
    if (editingService) {
      // Update existing
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? {
                ...s,
                title: form.title,
                category: form.category,
                subcategory: form.subcategory,
                description: form.description,
                price: form.forfaits[1]?.price
                  ? `€${Number(form.forfaits[1].price).toLocaleString("fr-FR")}`
                  : s.price,
                forfaits: form.forfaits,
                tags: form.tags,
                faq: form.faq,
              }
            : s
        )
      );
      addToast("success", `Service "${form.title}" modifié avec succès`);
    } else {
      // Create new
      const newService: AgenceService = {
        id: "s" + Date.now().toString(36),
        title: form.title,
        category: form.category,
        subcategory: form.subcategory,
        description: form.description,
        price: form.forfaits[1]?.price
          ? `€${Number(form.forfaits[1].price).toLocaleString("fr-FR")}`
          : "€0",
        status: "actif",
        views: 0,
        orders: 0,
        revenue: 0,
        conversion: 0,
        tags: form.tags,
        forfaits: form.forfaits,
        faq: form.faq,
      };
      setServices((prev) => [newService, ...prev]);
      addToast("success", `Service "${form.title}" publié avec succès`);
    }
    setEditingService(null);
  }

  // Toggle pause/active
  function handleToggleStatus(service: AgenceService) {
    const newStatus = service.status === "actif" ? "pause" : "actif";
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, status: newStatus } : s))
    );
    addToast(
      "info",
      newStatus === "actif"
        ? `Service "${service.title}" activé`
        : `Service "${service.title}" mis en pause`
    );
  }

  // Duplicate
  function handleDuplicate(service: AgenceService) {
    const duplicate: AgenceService = {
      ...service,
      id: "s" + Date.now().toString(36),
      title: `${service.title} (copie)`,
      views: 0,
      orders: 0,
      revenue: 0,
      conversion: 0,
    };
    setServices((prev) => [duplicate, ...prev]);
    addToast("success", `Service dupliqué : "${duplicate.title}"`);
  }

  // Delete
  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    addToast("success", `Service "${deleteTarget.title}" supprimé`);
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Services</h1>
          <p className="text-slate-400 text-sm mt-1">
            Gérez les services publiés sous la marque de l&apos;agence.
          </p>
        </div>
        <button
          onClick={handleNewService}
          className="px-4 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nouveau Service
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {dynamicStats.map((s) => (
          <div
            key={s.label}
            className="bg-neutral-dark rounded-xl border border-border-dark p-4 flex items-center gap-3"
          >
            <span className={cn("material-symbols-outlined text-xl", s.color)}>
              {s.icon}
            </span>
            <div>
              <p className="text-xl font-black text-white">{s.value}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[
          { key: "tous", label: "Tous" },
          { key: "actif", label: "Actifs" },
          { key: "pause", label: "En pause" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
              filter === f.key
                ? "bg-primary text-background-dark"
                : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Services list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-neutral-dark rounded-xl border border-border-dark p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-600 mb-3 block">
              work_off
            </span>
            <p className="text-slate-400 text-sm">Aucun service trouvé.</p>
          </div>
        )}

        {filtered.map((s) => (
          <div
            key={s.id}
            className="bg-neutral-dark rounded-xl border border-border-dark p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-white">{s.title}</p>
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                      s.status === "actif"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-slate-500/20 text-slate-400"
                    )}
                  >
                    {s.status === "actif" ? "Actif" : "En pause"}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {s.category}{s.subcategory ? ` / ${s.subcategory}` : ""} · {s.price}
                  {s.tags.length > 0 && (
                    <span className="ml-2">
                      {s.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block ml-1 px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(s)}
                  className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors"
                  title="Modifier"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
                <button
                  onClick={() => handleToggleStatus(s)}
                  className="p-2 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                  title={s.status === "actif" ? "Mettre en pause" : "Activer"}
                >
                  <span className="material-symbols-outlined text-lg">
                    {s.status === "actif" ? "pause" : "play_arrow"}
                  </span>
                </button>
                <button
                  onClick={() => handleDuplicate(s)}
                  className="p-2 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                  title="Dupliquer"
                >
                  <span className="material-symbols-outlined text-lg">content_copy</span>
                </button>
                <button
                  onClick={() => setDeleteTarget(s)}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Supprimer"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-lg font-bold text-white">
                  {s.views.toLocaleString("fr-FR")}
                </p>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Vues</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">{s.orders}</p>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">
                  Commandes
                </p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">
                  €{s.revenue.toLocaleString("fr-FR")}
                </p>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">
                  CA Généré
                </p>
              </div>
              <div>
                <p className="text-lg font-bold text-primary">{s.conversion}%</p>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">
                  Conversion
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Creation / Edit Wizard Modal */}
      <ServiceWizardModal
        key={editingService?.id ?? "new" + String(wizardOpen)}
        open={wizardOpen}
        editService={editingService}
        onClose={() => {
          setWizardOpen(false);
          setEditingService(null);
        }}
        onSave={handleWizardSave}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        open={deleteTarget !== null}
        title="Supprimer le service"
        message={`Voulez-vous vraiment supprimer "${deleteTarget?.title}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
