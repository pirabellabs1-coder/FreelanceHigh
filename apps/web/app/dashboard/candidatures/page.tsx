"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types & mock data
// ---------------------------------------------------------------------------

type Project = {
  id: string;
  title: string;
  budget: string;
  description: string;
  skills: string[];
  duration: string;
  location: string;
  propositions: number;
  urgent?: boolean;
  imagePlaceholderClass: string;
};

const PROJECTS: Project[] = [
  {
    id: "PRJ-301",
    title: "Développement Application Mobile E-commerce",
    budget: "200.000 FCFA",
    description:
      "Nous recherchons un développeur Flutter expérimenté pour finaliser une application de vente en ligne. L'application doit intégrer les paiements mobiles (Orange Money, Wave) et une gestion de stock en temps réel via Firebase.",
    skills: ["Flutter", "Firebase", "Dart", "API REST"],
    duration: "30 jours",
    location: "Sénégal (Distanciel)",
    propositions: 12,
    urgent: true,
    imagePlaceholderClass: "bg-[#1a3a32]",
  },
  {
    id: "PRJ-302",
    title: "Design Logo & Charte Graphique",
    budget: "50.000 FCFA",
    description:
      "Création d'une identité visuelle complète pour une nouvelle startup de livraison écologique. Nous avons besoin d'un logo moderne, d'une palette de couleurs et de polices d'accompagnement.",
    skills: ["Adobe Illustrator", "Branding", "UI/UX"],
    duration: "7 jours",
    location: "Côte d'Ivoire",
    propositions: 5,
    imagePlaceholderClass: "bg-[#1f3a2e]",
  },
  {
    id: "PRJ-303",
    title: "Rédaction de Contenus SEO - Blog Tech",
    budget: "85.000 FCFA",
    description:
      "Nous recherchons un rédacteur spécialisé en nouvelles technologies pour produire 10 articles de 1200 mots optimisés pour le SEO. Thématique : Intelligence Artificielle et Web3.",
    skills: ["Copywriting", "SEO", "Français"],
    duration: "15 jours",
    location: "France",
    propositions: 8,
    imagePlaceholderClass: "bg-[#162e25]",
  },
];

// ---------------------------------------------------------------------------
// Filter bar options
// ---------------------------------------------------------------------------

const BUDGETS = ["Tous les budgets", "< 50.000 FCFA", "50k – 200k FCFA", "> 200.000 FCFA"];
const CATEGORIES = ["Toutes les catégories", "Développement", "Design", "Rédaction", "Marketing", "Vidéo"];
const PAYS = ["Tous les pays", "Sénégal", "Côte d'Ivoire", "Cameroun", "France", "Mali"];
const CONTRATS = ["Tous les contrats", "Ponctuel", "Long terme", "Récurrent", "Urgent"];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl pl-4 pr-3",
          "bg-[#1a2e2a] border border-[#293835] hover:border-[#0e7c66]/50 transition-all",
        )}
      >
        <p className="text-slate-200 text-sm font-semibold whitespace-nowrap">
          {value === options[0] ? label : value}
        </p>
        <span className="material-symbols-outlined text-[#0e7c66] text-[20px]">expand_more</span>
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute top-12 left-0 z-40 min-w-[200px] bg-[#1a2e2a] border border-[#293835] rounded-xl shadow-2xl overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-sm hover:bg-[#0e7c66]/10 transition-colors",
                  value === opt ? "text-[#0e7c66] font-bold" : "text-slate-300",
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ProjectImagePlaceholder({
  placeholderClass,
  urgent,
}: {
  placeholderClass: string;
  urgent?: boolean;
}) {
  return (
    <div
      className={cn(
        "w-full md:w-64 h-48 md:h-auto rounded-xl shrink-0 overflow-hidden relative flex items-center justify-center",
        placeholderClass,
      )}
    >
      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 30px, #0e7c66 30px, #0e7c66 31px), repeating-linear-gradient(90deg, transparent, transparent 30px, #0e7c66 30px, #0e7c66 31px)",
        }}
      />
      <span className="material-symbols-outlined text-[#0e7c66]/30 text-[64px]">work</span>
      {urgent && (
        <div className="absolute top-3 left-3 bg-[#0e7c66]/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
          Urgent
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group flex flex-col md:flex-row items-stretch gap-6 p-5 rounded-2xl bg-[#11211e]/50 border border-[#293835] hover:border-[#0e7c66]/40 transition-all shadow-sm hover:shadow-md">
      {/* Image / placeholder */}
      <ProjectImagePlaceholder
        placeholderClass={project.imagePlaceholderClass}
        urgent={project.urgent}
      />

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between py-2">
        <div>
          {/* Title + budget */}
          <div className="flex justify-between items-start mb-2 gap-4">
            <h3 className="text-slate-100 text-xl font-bold group-hover:text-[#0e7c66] transition-colors leading-snug">
              {project.title}
            </h3>
            <span className="text-[#0e7c66] font-black text-lg whitespace-nowrap flex-shrink-0">
              {project.budget}
            </span>
          </div>

          {/* Description */}
          <p className="text-slate-400 text-base mb-4 line-clamp-2">{project.description}</p>

          {/* Skill tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-[#0e7c66]/20 text-[#0e7c66] text-xs font-bold rounded-full border border-[#0e7c66]/30"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Footer: meta + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-[#293835]">
          <div className="flex items-center gap-5 text-slate-400 text-sm flex-wrap">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
              <span>{project.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              <span>{project.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">group</span>
              <span>{project.propositions} Propositions</span>
            </div>
          </div>

          <button
            className={cn(
              "flex min-w-[120px] items-center justify-center rounded-lg h-10 px-6",
              "bg-[#0e7c66] text-white text-sm font-bold hover:brightness-110 transition-all shadow-md shadow-[#0e7c66]/20",
            )}
          >
            Postuler
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

function Pagination({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  const pages: (number | "ellipsis")[] = [1, 2, 3, "ellipsis", totalPages];

  return (
    <div className="flex items-center justify-center gap-2 mt-12 py-4">
      {/* Prev */}
      <button
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(
          "size-10 flex items-center justify-center rounded-lg border transition-all",
          "border-[#293835] bg-[#1a2e2a] text-slate-300 hover:bg-[#0e7c66] hover:text-white hover:border-[#0e7c66]",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#1a2e2a] disabled:hover:text-slate-300",
        )}
      >
        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${idx}`} className="text-slate-500 px-1">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onChange(page as number)}
            className={cn(
              "size-10 flex items-center justify-center rounded-lg border text-sm font-bold transition-all",
              currentPage === page
                ? "bg-[#0e7c66] text-white border-[#0e7c66]"
                : "border-[#293835] text-slate-300 hover:bg-[#0e7c66] hover:text-white hover:border-[#0e7c66]",
            )}
          >
            {page}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(
          "size-10 flex items-center justify-center rounded-lg border transition-all",
          "border-[#293835] bg-[#1a2e2a] text-slate-300 hover:bg-[#0e7c66] hover:text-white hover:border-[#0e7c66]",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#1a2e2a] disabled:hover:text-slate-300",
        )}
      >
        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function CandidaturesPage() {
  const [budget, setBudget] = useState(BUDGETS[0]);
  const [categorie, setCategorie] = useState(CATEGORIES[0]);
  const [pays, setPays] = useState(PAYS[0]);
  const [contrat, setContrat] = useState(CONTRATS[0]);
  const [currentPage, setCurrentPage] = useState(1);

  function clearFilters() {
    setBudget(BUDGETS[0]);
    setCategorie(CATEGORIES[0]);
    setPays(PAYS[0]);
    setContrat(CONTRATS[0]);
  }

  const hasActiveFilters =
    budget !== BUDGETS[0] ||
    categorie !== CATEGORIES[0] ||
    pays !== PAYS[0] ||
    contrat !== CONTRATS[0];

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* ------------------------------------------------------------------ */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-wrap justify-between items-end gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-100 text-3xl font-black leading-tight tracking-tight">
            Explorateur d&apos;Offres
          </h1>
          <p className="text-slate-400 text-base max-w-xl">
            Trouvez la mission qui correspond à vos compétences parmi les appels d&apos;offres récents postés par nos clients.
          </p>
        </div>

        <button
          onClick={() => {
            /* In production this would refetch from the API */
          }}
          className={cn(
            "flex items-center gap-2 rounded-lg h-10 px-4",
            "bg-[#1a2e2a] text-slate-100 text-sm font-bold",
            "hover:bg-[#0e7c66]/20 transition-all border border-[#293835] hover:border-[#0e7c66]/30",
          )}
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          <span>Actualiser</span>
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Filter bar                                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex gap-3 pb-6 flex-wrap border-b border-[#293835]">
        <FilterDropdown label="Budget" options={BUDGETS} value={budget} onChange={setBudget} />
        <FilterDropdown label="Catégorie" options={CATEGORIES} value={categorie} onChange={setCategorie} />
        <FilterDropdown label="Pays" options={PAYS} value={pays} onChange={setPays} />
        <FilterDropdown label="Type de contrat" options={CONTRATS} value={contrat} onChange={setContrat} />

        <div className="h-10 w-px bg-[#293835] mx-1" />

        <button
          onClick={clearFilters}
          className={cn(
            "flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl px-4 text-sm font-bold transition-all",
            hasActiveFilters
              ? "bg-[#0e7c66]/20 text-[#0e7c66] border border-[#0e7c66]/30"
              : "bg-[#1a2e2a] text-slate-400 border border-[#293835]",
          )}
        >
          {hasActiveFilters && (
            <span className="material-symbols-outlined text-[16px]">close</span>
          )}
          Effacer les filtres
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Project cards grid                                                  */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 gap-6">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Pagination                                                          */}
      {/* ------------------------------------------------------------------ */}
      <Pagination
        currentPage={currentPage}
        totalPages={12}
        onChange={setCurrentPage}
      />
    </div>
  );
}
