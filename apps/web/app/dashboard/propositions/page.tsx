"use client";

import { useState, useMemo } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ProposalStatus = "en_attente" | "acceptee" | "refusee";

type Proposal = {
  id: string;
  projectTitle: string;
  clientName: string;
  budget: string;
  proposedPrice: number;
  deliveryDays: number;
  status: ProposalStatus;
  submittedAt: string;
  motivation: string;
};

type ClientProject = {
  id: string;
  title: string;
  description: string;
  budget: string;
  deadline: string;
  skills: string[];
  clientName: string;
  clientRating: number;
  postedAt: string;
  proposals: number;
};

// ---------------------------------------------------------------------------
// Demo data
// ---------------------------------------------------------------------------

const DEMO_PROPOSALS: Proposal[] = [
  {
    id: "P-001",
    projectTitle: "Refonte UI/UX Dashboard SaaS",
    clientName: "NexGen Solutions",
    budget: "1500-3000",
    proposedPrice: 2200,
    deliveryDays: 14,
    status: "en_attente",
    submittedAt: "2026-02-28",
    motivation: "Fort de 5 ans d\u2019exp\u00e9rience en UI/UX...",
  },
  {
    id: "P-002",
    projectTitle: "Application Mobile E-commerce",
    clientName: "AfriShop Ltd",
    budget: "3000-5000",
    proposedPrice: 4000,
    deliveryDays: 30,
    status: "acceptee",
    submittedAt: "2026-02-15",
    motivation: "Sp\u00e9cialiste React Native...",
  },
  {
    id: "P-003",
    projectTitle: "Identit\u00e9 Visuelle Compl\u00e8te",
    clientName: "Startup Dakar",
    budget: "500-1000",
    proposedPrice: 750,
    deliveryDays: 7,
    status: "refusee",
    submittedAt: "2026-02-10",
    motivation: "Designer graphique professionnel...",
  },
  {
    id: "P-004",
    projectTitle: "Site Vitrine Restaurant",
    clientName: "Le Boukarou",
    budget: "800-1500",
    proposedPrice: 1100,
    deliveryDays: 10,
    status: "en_attente",
    submittedAt: "2026-03-01",
    motivation: "D\u00e9veloppeur web fullstack...",
  },
  {
    id: "P-005",
    projectTitle: "Campagne Marketing Digital",
    clientName: "TechAfrica Inc",
    budget: "2000-4000",
    proposedPrice: 2800,
    deliveryDays: 21,
    status: "en_attente",
    submittedAt: "2026-03-02",
    motivation: "Expert en marketing digital...",
  },
];

const DEMO_CLIENT_PROJECTS: ClientProject[] = [
  {
    id: "CP-001",
    title: "Refonte UI/UX Dashboard SaaS",
    description:
      "Nous cherchons un designer UI/UX exp\u00e9riment\u00e9 pour refondre compl\u00e8tement notre dashboard SaaS. Le projet inclut la recherche utilisateur, les wireframes, les maquettes haute fid\u00e9lit\u00e9 et le handoff d\u00e9veloppeur.",
    budget: "1500-3000",
    deadline: "2026-04-01",
    skills: ["UI Design", "React", "Figma"],
    clientName: "NexGen Solutions",
    clientRating: 4.9,
    postedAt: "2026-02-26",
    proposals: 8,
  },
  {
    id: "CP-002",
    title: "D\u00e9veloppement API REST Node.js",
    description:
      "Cr\u00e9ation d\u2019une API RESTful avec authentification JWT, gestion de fichiers, pagination avanc\u00e9e et documentation Swagger compl\u00e8te. Base PostgreSQL avec Prisma ORM.",
    budget: "2000-4000",
    deadline: "2026-04-15",
    skills: ["Node.js", "TypeScript", "PostgreSQL"],
    clientName: "DataFlow Corp",
    clientRating: 4.7,
    postedAt: "2026-03-01",
    proposals: 3,
  },
  {
    id: "CP-003",
    title: "Logo et Charte Graphique",
    description:
      "Cr\u00e9ation d\u2019un logo et d\u2019une charte graphique compl\u00e8te pour une startup fintech bas\u00e9e \u00e0 Abidjan. Livraison attendue : logo (couleur + NB), palette, typographie, guide d\u2019utilisation.",
    budget: "500-1000",
    deadline: "2026-03-20",
    skills: ["Logo Design", "Branding", "Illustrator"],
    clientName: "FinPay Startup",
    clientRating: 4.5,
    postedAt: "2026-03-02",
    proposals: 12,
  },
];

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  ProposalStatus,
  { label: string; color: string; icon: string }
> = {
  en_attente: {
    label: "En attente",
    color: "bg-amber-500/10 text-amber-400",
    icon: "schedule",
  },
  acceptee: {
    label: "Accept\u00e9e",
    color: "bg-emerald-500/10 text-emerald-400",
    icon: "check_circle",
  },
  refusee: {
    label: "Refus\u00e9e",
    color: "bg-red-500/10 text-red-400",
    icon: "cancel",
  },
};

const TABS = [
  { label: "Toutes", filter: null },
  { label: "En attente", filter: "en_attente" as ProposalStatus },
  { label: "Accept\u00e9es", filter: "acceptee" as ProposalStatus },
  { label: "Refus\u00e9es", filter: "refusee" as ProposalStatus },
];

// ---------------------------------------------------------------------------
// Helper: format date
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: string;
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="bg-background-dark/50 rounded-2xl border border-border-dark p-5 flex items-center gap-4">
      <div
        className={cn(
          "size-12 rounded-xl flex items-center justify-center",
          accent ?? "bg-primary/10"
        )}
      >
        <span
          className={cn(
            "material-symbols-outlined text-xl",
            accent ? accent.replace("bg-", "text-").replace("/10", "") : "text-primary"
          )}
        >
          {icon}
        </span>
      </div>
      <div>
        <p className="text-2xl font-black text-slate-100">{value}</p>
        <p className="text-xs text-slate-500 font-semibold">{label}</p>
      </div>
    </div>
  );
}

function ProposalCard({
  proposal,
  onToggleDetails,
  expanded,
}: {
  proposal: Proposal;
  onToggleDetails: () => void;
  expanded: boolean;
}) {
  const s = STATUS_CONFIG[proposal.status];

  return (
    <div className="bg-background-dark/50 rounded-2xl border border-border-dark hover:border-primary/30 transition-all">
      <div className="p-5">
        {/* Top row: title + status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-100 line-clamp-1">
              {proposal.projectTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm leading-none">
                person
              </span>
              {proposal.clientName}
            </p>
          </div>
          <span
            className={cn(
              "flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg",
              s.color
            )}
          >
            <span className="material-symbols-outlined text-sm leading-none">
              {s.icon}
            </span>
            {s.label}
          </span>
        </div>

        {/* Budget + price + delivery */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 mb-3">
          <span>
            Budget :{" "}
            <span className="font-semibold text-slate-300">
              \u20ac{proposal.budget}
            </span>
          </span>
          <span>
            Votre tarif :{" "}
            <span className="font-black text-primary">
              \u20ac{proposal.proposedPrice.toLocaleString("fr-FR")}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm leading-none">
              schedule
            </span>
            {proposal.deliveryDays} jours
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm leading-none">
              calendar_today
            </span>
            {formatDate(proposal.submittedAt)}
          </span>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-border-dark">
            <p className="text-xs font-bold text-slate-400 mb-1.5">
              Lettre de motivation
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              {proposal.motivation}
            </p>
          </div>
        )}

        {/* Footer */}
        <button
          onClick={onToggleDetails}
          className="mt-3 flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
        >
          <span className="material-symbols-outlined text-sm leading-none">
            {expanded ? "expand_less" : "expand_more"}
          </span>
          {expanded ? "Masquer les d\u00e9tails" : "Voir d\u00e9tails"}
        </button>
      </div>
    </div>
  );
}

function ClientProjectCard({
  project,
  onSubmitProposal,
}: {
  project: ClientProject;
  onSubmitProposal: (project: ClientProject) => void;
}) {
  return (
    <div className="bg-background-dark/50 rounded-2xl border border-border-dark hover:border-primary/30 transition-all p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-sm font-bold text-slate-100 line-clamp-1 flex-1">
          {project.title}
        </h3>
        <span className="text-primary font-black text-sm whitespace-nowrap">
          \u20ac{project.budget}
        </span>
      </div>

      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
        {project.description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {project.skills.map((skill) => (
          <span
            key={skill}
            className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 mb-4">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm leading-none">
            person
          </span>
          {project.clientName}
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm leading-none text-amber-400">
            star
          </span>
          {project.clientRating}
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm leading-none">
            calendar_today
          </span>
          {formatDate(project.postedAt)}
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm leading-none">
            group
          </span>
          {project.proposals} propositions
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm leading-none">
            event
          </span>
          D\u00e9lai : {formatDate(project.deadline)}
        </span>
      </div>

      <button
        onClick={() => onSubmitProposal(project)}
        className="w-full flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
      >
        <span className="material-symbols-outlined text-base leading-none">
          send
        </span>
        Soumettre une proposition
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Proposal form component
// ---------------------------------------------------------------------------

type ProposalFormData = {
  motivation: string;
  price: string;
  deliveryDays: string;
  files: File[];
};

function ProposalForm({
  project,
  onBack,
  onSubmit,
}: {
  project: ClientProject;
  onBack: () => void;
  onSubmit: (data: ProposalFormData) => void;
}) {
  const [form, setForm] = useState<ProposalFormData>({
    motivation: "",
    price: "",
    deliveryDays: "",
    files: [],
  });
  const [dragActive, setDragActive] = useState(false);

  function handleChange(field: keyof ProposalFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const dropped = Array.from(e.dataTransfer.files);
    setForm((prev) => ({
      ...prev,
      files: [...prev.files, ...dropped].slice(0, 5),
    }));
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      files: [...prev.files, ...selected].slice(0, 5),
    }));
  }

  function removeFile(index: number) {
    setForm((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  }

  function handleSubmit() {
    onSubmit(form);
  }

  function handleSaveDraft() {
    onBack();
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-200 transition-colors"
      >
        <span className="material-symbols-outlined text-base leading-none">
          arrow_back
        </span>
        Retour aux projets
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ---------------------------------------------------------------- */}
        {/* Left column: form */}
        {/* ---------------------------------------------------------------- */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-background-dark/50 rounded-2xl border border-border-dark p-6 space-y-5">
            <h3 className="text-base font-black text-slate-100">
              Soumettre une proposition
            </h3>

            {/* Motivation */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">
                Lettre de motivation *
              </label>
              <textarea
                value={form.motivation}
                onChange={(e) => handleChange("motivation", e.target.value)}
                placeholder="D\u00e9crivez votre exp\u00e9rience pertinente, votre approche pour ce projet et pourquoi le client devrait vous choisir..."
                rows={8}
                style={{ minHeight: 250 }}
                className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y placeholder:text-slate-500 leading-relaxed"
              />
            </div>

            {/* Price + Delivery side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Proposed price */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  Tarif propos\u00e9 (\u20ac) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                    \u20ac
                  </span>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="Ex: 2000"
                    min={0}
                    className="w-full bg-background-dark border border-border-dark rounded-xl pl-8 pr-3 py-2.5 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-slate-500"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Hors frais de plateforme (5%)
                </p>
              </div>

              {/* Delivery days */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  D\u00e9lai de livraison *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.deliveryDays}
                    onChange={(e) =>
                      handleChange("deliveryDays", e.target.value)
                    }
                    placeholder="Ex: 14"
                    min={1}
                    className="w-full bg-background-dark border border-border-dark rounded-xl px-3 pr-16 py-2.5 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-slate-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                    jours
                  </span>
                </div>
              </div>
            </div>

            {/* File upload */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">
                Pi\u00e8ces jointes
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={cn(
                  "relative rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer",
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-border-dark hover:border-primary/40 hover:bg-primary/5"
                )}
              >
                <input
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.zip"
                  onChange={handleFileInput}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <span className="material-symbols-outlined text-3xl text-slate-500 mx-auto block mb-2">
                  cloud_upload
                </span>
                <p className="text-sm text-slate-400 font-semibold">
                  Glissez-d\u00e9posez vos fichiers ici
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  PDF, PNG, JPG ou ZIP (Max. 10 Mo par fichier)
                </p>
              </div>

              {/* File list */}
              {form.files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {form.files.map((file, i) => (
                    <div
                      key={`${file.name}-${i}`}
                      className="flex items-center gap-3 bg-neutral-dark rounded-lg px-3 py-2"
                    >
                      <span className="material-symbols-outlined text-base text-primary">
                        description
                      </span>
                      <span className="text-xs text-slate-300 flex-1 truncate">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {(file.size / (1024 * 1024)).toFixed(1)} Mo
                      </span>
                      <button
                        onClick={() => removeFile(i)}
                        className="p-0.5 rounded text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm leading-none">
                          close
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-base leading-none">
                  send
                </span>
                Envoyer la proposition
              </button>
              <button
                onClick={handleSaveDraft}
                className="px-6 py-3 border border-border-dark rounded-xl text-sm font-bold text-slate-400 hover:bg-primary/5 hover:text-slate-200 transition-all"
              >
                Enregistrer en brouillon
              </button>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Right column: project summary (sticky) */}
        {/* ---------------------------------------------------------------- */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-8 space-y-4">
            <div className="bg-background-dark/50 rounded-2xl border border-border-dark p-5 space-y-4">
              <p className="text-[10px] font-black text-primary tracking-widest uppercase">
                R\u00e9capitulatif du projet
              </p>

              <h4 className="text-sm font-bold text-slate-100">
                {project.title}
              </h4>

              {/* Skill tags */}
              <div className="flex flex-wrap gap-1.5">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <p className="text-xs text-slate-400 line-clamp-4 leading-relaxed">
                {project.description}
              </p>

              <div className="border-t border-border-dark pt-3 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Budget</span>
                  <span className="font-bold text-slate-200">
                    \u20ac{project.budget}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Date limite</span>
                  <span className="font-semibold text-slate-300">
                    {formatDate(project.deadline)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Publi\u00e9 le</span>
                  <span className="font-semibold text-slate-300">
                    {formatDate(project.postedAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Client</span>
                  <span className="font-semibold text-slate-300 flex items-center gap-1">
                    {project.clientName}
                    <span className="material-symbols-outlined text-amber-400 text-sm leading-none">
                      star
                    </span>
                    <span className="text-amber-400">
                      {project.clientRating}
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Propositions</span>
                  <span className="font-semibold text-slate-300">
                    {project.proposals}
                  </span>
                </div>
              </div>
            </div>

            {/* Tip box */}
            <div className="bg-primary/5 rounded-2xl border border-primary/20 p-4 flex gap-3">
              <span className="material-symbols-outlined text-primary text-lg flex-shrink-0 mt-0.5">
                tips_and_updates
              </span>
              <div>
                <p className="text-xs font-bold text-primary mb-1">
                  Conseil
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Les propositions personnalis\u00e9es ont 3x plus de chances
                  d&apos;\u00eatre accept\u00e9es. Mentionnez des projets
                  similaires et expliquez votre approche sp\u00e9cifique.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

type View = "list" | "projects" | "form";

export default function PropositionsPage() {
  const addToast = useToastStore((s) => s.addToast);

  const [view, setView] = useState<View>("list");
  const [activeTab, setActiveTab] = useState("Toutes");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(
    null
  );
  const [proposals, setProposals] = useState<Proposal[]>(DEMO_PROPOSALS);

  // Filtered proposals
  const filteredProposals = useMemo(() => {
    const tab = TABS.find((t) => t.label === activeTab);
    if (!tab || !tab.filter) return proposals;
    return proposals.filter((p) => p.status === tab.filter);
  }, [proposals, activeTab]);

  // Stats
  const stats = useMemo(() => {
    const total = proposals.length;
    const accepted = proposals.filter((p) => p.status === "acceptee").length;
    const pending = proposals.filter((p) => p.status === "en_attente").length;
    return { total, accepted, pending };
  }, [proposals]);

  // Handlers
  function handleExploreProjects() {
    setView("projects");
  }

  function handleSelectProject(project: ClientProject) {
    setSelectedProject(project);
    setView("form");
  }

  function handleBackToProjects() {
    setSelectedProject(null);
    setView("projects");
  }

  function handleBackToList() {
    setView("list");
  }

  function handleSubmitProposal(data: ProposalFormData) {
    if (!selectedProject) return;

    if (!data.motivation.trim()) {
      addToast("error", "Veuillez r\u00e9diger une lettre de motivation");
      return;
    }
    if (!data.price || Number(data.price) <= 0) {
      addToast("error", "Veuillez indiquer un tarif valide");
      return;
    }
    if (!data.deliveryDays || Number(data.deliveryDays) <= 0) {
      addToast("error", "Veuillez indiquer un d\u00e9lai de livraison valide");
      return;
    }

    const newProposal: Proposal = {
      id: "P-" + String(proposals.length + 1).padStart(3, "0"),
      projectTitle: selectedProject.title,
      clientName: selectedProject.clientName,
      budget: selectedProject.budget,
      proposedPrice: Number(data.price),
      deliveryDays: Number(data.deliveryDays),
      status: "en_attente",
      submittedAt: new Date().toISOString().slice(0, 10),
      motivation: data.motivation,
    };

    setProposals((prev) => [newProposal, ...prev]);
    setSelectedProject(null);
    setView("list");
    addToast(
      "success",
      `Proposition envoy\u00e9e pour "${selectedProject.title}"`
    );
  }

  // -----------------------------------------------------------------------
  // View: Form
  // -----------------------------------------------------------------------
  if (view === "form" && selectedProject) {
    return (
      <div className="max-w-6xl mx-auto">
        <ProposalForm
          project={selectedProject}
          onBack={handleBackToProjects}
          onSubmit={handleSubmitProposal}
        />
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // View: Explore projects
  // -----------------------------------------------------------------------
  if (view === "projects") {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <button
                onClick={handleBackToList}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-primary/10 transition-all"
              >
                <span className="material-symbols-outlined text-lg">
                  arrow_back
                </span>
              </button>
              <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  work
                </span>
                Explorer les projets
              </h2>
            </div>
            <p className="text-sm text-slate-400 ml-10">
              Trouvez un projet et soumettez votre proposition.
            </p>
          </div>
        </div>

        {/* Project cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_CLIENT_PROJECTS.map((project) => (
            <ClientProjectCard
              key={project.id}
              project={project}
              onSubmitProposal={handleSelectProject}
            />
          ))}
        </div>

        {/* Empty-state help */}
        <div className="bg-primary/5 rounded-2xl border border-primary/20 p-5 flex items-start gap-4">
          <span className="material-symbols-outlined text-primary text-xl flex-shrink-0 mt-0.5">
            info
          </span>
          <div>
            <p className="text-sm font-bold text-slate-200 mb-1">
              Comment augmenter vos chances ?
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              R\u00e9digez une lettre de motivation personnalis\u00e9e pour
              chaque projet. Proposez un tarif comp\u00e9titif et un d\u00e9lai
              r\u00e9aliste. Joignez des exemples de travaux similaires.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // View: Proposals list (default)
  // -----------------------------------------------------------------------
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">send</span>
            Mes Propositions
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Soumettez des propositions aux projets clients et suivez leur
            statut.
          </p>
        </div>
        <button
          onClick={handleExploreProjects}
          className="inline-flex items-center gap-2 bg-primary hover:opacity-90 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-base leading-none">
            explore
          </span>
          Explorer les projets
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon="send"
          label="Total soumises"
          value={stats.total}
        />
        <StatCard
          icon="check_circle"
          label="Accept\u00e9es"
          value={stats.accepted}
          accent="bg-emerald-500/10"
        />
        <StatCard
          icon="schedule"
          label="En attente"
          value={stats.pending}
          accent="bg-amber-500/10"
        />
      </div>

      {/* Tabs + content */}
      <div className="bg-background-dark/50 rounded-2xl border border-border-dark overflow-hidden">
        {/* Tab bar */}
        <div className="flex items-center gap-1 px-5 py-4 border-b border-border-dark">
          <div className="flex gap-1 bg-neutral-dark rounded-xl p-1">
            {TABS.map((t) => (
              <button
                key={t.label}
                onClick={() => setActiveTab(t.label)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all",
                  activeTab === t.label
                    ? "bg-primary/10 text-primary"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Proposals */}
        {filteredProposals.length === 0 ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-4xl leading-none text-slate-600 mx-auto mb-3 block">
              send
            </span>
            <p className="text-slate-500 font-semibold">
              Aucune proposition dans cette cat\u00e9gorie
            </p>
            <button
              onClick={handleExploreProjects}
              className="mt-4 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Explorer les projets disponibles
            </button>
          </div>
        ) : (
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                expanded={expandedId === proposal.id}
                onToggleDetails={() =>
                  setExpandedId(
                    expandedId === proposal.id ? null : proposal.id
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
