"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

// ============================================================
// Types
// ============================================================
interface Proposal {
  id: string;
  freelancerName: string;
  freelancerType: "freelance" | "agence";
  projectTitle: string;
  description: string;
  budget: number;
  deadline: string;
  status: "en_attente" | "acceptee" | "refusee" | "expiree";
  dateSent: string;
  skills: string[];
}

// ============================================================
// Demo data
// ============================================================
const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: "PROP-001",
    freelancerName: "Moussa Diop",
    freelancerType: "freelance",
    projectTitle: "Refonte complète du site e-commerce",
    description: "Nous recherchons un développeur fullstack pour moderniser notre plateforme e-commerce existante avec Next.js et une passerelle de paiement Mobile Money intégrée.",
    budget: 4500,
    deadline: "2026-04-15",
    status: "en_attente",
    dateSent: "2026-03-01",
    skills: ["Next.js", "React", "Stripe", "CinetPay"],
  },
  {
    id: "PROP-002",
    freelancerName: "Fatou Seck",
    freelancerType: "freelance",
    projectTitle: "Design UI/UX application mobile santé",
    description: "Conception d'une interface utilisateur complète pour une application mobile de suivi de santé destinée au marché ouest-africain. Maquettes Figma + prototype interactif.",
    budget: 2800,
    deadline: "2026-04-01",
    status: "acceptee",
    dateSent: "2026-02-20",
    skills: ["Figma", "UI/UX", "Mobile Design", "Prototypage"],
  },
  {
    id: "PROP-003",
    freelancerName: "Studio Waaw",
    freelancerType: "agence",
    projectTitle: "Campagne marketing digital Q2 2026",
    description: "Gestion complète de nos campagnes publicitaires sur Facebook, Instagram et Google Ads pendant 3 mois avec rapports mensuels de performance.",
    budget: 3200,
    deadline: "2026-06-30",
    status: "en_attente",
    dateSent: "2026-03-02",
    skills: ["Facebook Ads", "Google Ads", "SEO", "Analytics"],
  },
  {
    id: "PROP-004",
    freelancerName: "Ahmed Sy",
    freelancerType: "freelance",
    projectTitle: "Développement chatbot IA service client",
    description: "Intégration d'un chatbot intelligent basé sur GPT pour notre service client avec gestion multi-langues (FR/EN) et escalade vers un agent humain.",
    budget: 5000,
    deadline: "2026-05-01",
    status: "refusee",
    dateSent: "2026-02-15",
    skills: ["Python", "OpenAI", "NLP", "Node.js"],
  },
  {
    id: "PROP-005",
    freelancerName: "Kofi Asante",
    freelancerType: "freelance",
    projectTitle: "Audit cybersécurité infrastructure cloud",
    description: "Audit complet de la sécurité de notre infrastructure AWS avec rapport détaillé des vulnérabilités et recommandations de correction prioritaires.",
    budget: 3800,
    deadline: "2026-04-10",
    status: "acceptee",
    dateSent: "2026-02-18",
    skills: ["AWS", "Pentest", "Docker", "Kubernetes"],
  },
  {
    id: "PROP-006",
    freelancerName: "Digital Savane",
    freelancerType: "agence",
    projectTitle: "Identité visuelle et branding complet",
    description: "Création d'une identité visuelle complète incluant logo, charte graphique, supports marketing print et digital, et déclinaison sur réseaux sociaux.",
    budget: 2200,
    deadline: "2026-03-30",
    status: "expiree",
    dateSent: "2026-01-20",
    skills: ["Branding", "Illustrator", "Photoshop", "InDesign"],
  },
  {
    id: "PROP-007",
    freelancerName: "Paul Kouadio",
    freelancerType: "freelance",
    projectTitle: "Application mobile de livraison React Native",
    description: "Développement d'une application mobile cross-platform de livraison à la demande avec géolocalisation temps réel, notifications push et paiement intégré.",
    budget: 7500,
    deadline: "2026-06-15",
    status: "en_attente",
    dateSent: "2026-03-03",
    skills: ["React Native", "Firebase", "Maps API", "Node.js"],
  },
  {
    id: "PROP-008",
    freelancerName: "Marie Leclerc",
    freelancerType: "freelance",
    projectTitle: "Rédaction 30 articles SEO blog tech",
    description: "Rédaction de 30 articles optimisés SEO pour notre blog tech couvrant les sujets IA, blockchain, cloud computing et transformation digitale en Afrique.",
    budget: 1500,
    deadline: "2026-05-30",
    status: "refusee",
    dateSent: "2026-02-10",
    skills: ["SEO", "Rédaction Web", "WordPress", "Copywriting"],
  },
];

const TABS = [
  { key: "toutes", label: "Toutes" },
  { key: "en_attente", label: "En attente" },
  { key: "acceptee", label: "Acceptees" },
  { key: "refusee", label: "Refusees" },
  { key: "expiree", label: "Expirees" },
];

const STATUS_MAP: Record<string, { label: string; cls: string; icon: string }> = {
  en_attente: { label: "En attente", cls: "bg-amber-500/20 text-amber-400", icon: "schedule" },
  acceptee: { label: "Acceptee", cls: "bg-primary/20 text-primary", icon: "check_circle" },
  refusee: { label: "Refusee", cls: "bg-red-500/20 text-red-400", icon: "cancel" },
  expiree: { label: "Expiree", cls: "bg-slate-500/20 text-slate-400", icon: "timer_off" },
};

const SEARCHABLE_FREELANCERS = [
  { name: "Moussa Diop", type: "freelance", skills: ["Next.js", "React", "Node.js"] },
  { name: "Fatou Seck", type: "freelance", skills: ["Figma", "UI/UX", "Mobile Design"] },
  { name: "Studio Waaw", type: "agence", skills: ["Marketing", "SEO", "Ads"] },
  { name: "Ahmed Sy", type: "freelance", skills: ["Python", "IA", "NLP"] },
  { name: "Kofi Asante", type: "freelance", skills: ["AWS", "Pentest", "DevOps"] },
  { name: "Digital Savane", type: "agence", skills: ["Branding", "Design", "Print"] },
  { name: "Paul Kouadio", type: "freelance", skills: ["React Native", "Mobile", "Firebase"] },
  { name: "Marie Leclerc", type: "freelance", skills: ["SEO", "Redaction", "WordPress"] },
  { name: "Ousmane Ba", type: "freelance", skills: ["Laravel", "PHP", "MySQL"] },
  { name: "Tech Valley", type: "agence", skills: ["Cloud", "DevOps", "SRE"] },
];

const SKILL_OPTIONS = [
  "React", "Next.js", "Node.js", "TypeScript", "Python", "Figma", "UI/UX",
  "Mobile Design", "React Native", "Firebase", "AWS", "Docker", "SEO",
  "WordPress", "Stripe", "CinetPay", "Laravel", "PHP", "Branding",
  "Illustrator", "Photoshop", "Google Ads", "Facebook Ads", "OpenAI",
];

// ============================================================
// Component
// ============================================================
export default function ClientProposals() {
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [tab, setTab] = useState("toutes");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { addToast } = useToastStore();

  // New proposal form state
  const [newFreelancer, setNewFreelancer] = useState("");
  const [freelancerSearch, setFreelancerSearch] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newSkills, setNewSkills] = useState<string[]>([]);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [showFreelancerDropdown, setShowFreelancerDropdown] = useState(false);

  // Counts
  const counts = {
    toutes: proposals.length,
    en_attente: proposals.filter((p) => p.status === "en_attente").length,
    acceptee: proposals.filter((p) => p.status === "acceptee").length,
    refusee: proposals.filter((p) => p.status === "refusee").length,
    expiree: proposals.filter((p) => p.status === "expiree").length,
  };

  const filtered = tab === "toutes" ? proposals : proposals.filter((p) => p.status === tab);

  const detailProposal = showDetailModal ? proposals.find((p) => p.id === showDetailModal) : null;

  // Reset form
  function resetForm() {
    setNewFreelancer("");
    setFreelancerSearch("");
    setNewTitle("");
    setNewDescription("");
    setNewBudget("");
    setNewDeadline("");
    setNewSkills([]);
    setEditingId(null);
  }

  // Create / Update proposal
  function handleSubmitProposal() {
    if (!newFreelancer || !newTitle || !newDescription || !newBudget || !newDeadline) {
      addToast("error", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (editingId) {
      setProposals((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                freelancerName: newFreelancer,
                freelancerType: (SEARCHABLE_FREELANCERS.find((f) => f.name === newFreelancer)?.type as "freelance" | "agence") || "freelance",
                projectTitle: newTitle,
                description: newDescription,
                budget: parseFloat(newBudget),
                deadline: newDeadline,
                skills: newSkills,
              }
            : p
        )
      );
      addToast("success", "Proposition modifiee avec succes");
    } else {
      const proposal: Proposal = {
        id: "PROP-" + String(proposals.length + 1).padStart(3, "0"),
        freelancerName: newFreelancer,
        freelancerType: (SEARCHABLE_FREELANCERS.find((f) => f.name === newFreelancer)?.type as "freelance" | "agence") || "freelance",
        projectTitle: newTitle,
        description: newDescription,
        budget: parseFloat(newBudget),
        deadline: newDeadline,
        status: "en_attente",
        dateSent: new Date().toISOString().slice(0, 10),
        skills: newSkills,
      };
      setProposals((prev) => [proposal, ...prev]);
      addToast("success", "Proposition envoyee avec succes");
    }

    resetForm();
    setShowCreateModal(false);
  }

  // Open edit
  function handleEdit(proposal: Proposal) {
    setEditingId(proposal.id);
    setNewFreelancer(proposal.freelancerName);
    setFreelancerSearch(proposal.freelancerName);
    setNewTitle(proposal.projectTitle);
    setNewDescription(proposal.description);
    setNewBudget(String(proposal.budget));
    setNewDeadline(proposal.deadline);
    setNewSkills([...proposal.skills]);
    setShowCreateModal(true);
  }

  // Cancel proposal
  function handleCancel(id: string) {
    setProposals((prev) => prev.filter((p) => p.id !== id));
    addToast("success", "Proposition annulee");
  }

  // Resend
  function handleResend(id: string) {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: "en_attente" as const, dateSent: new Date().toISOString().slice(0, 10) }
          : p
      )
    );
    addToast("success", "Proposition relancee avec succes");
  }

  // Toggle skill
  function toggleSkill(skill: string) {
    setNewSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
  }

  // Filter freelancers
  const filteredFreelancers = SEARCHABLE_FREELANCERS.filter((f) =>
    f.name.toLowerCase().includes(freelancerSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Propositions</h1>
          <p className="text-slate-400 text-sm mt-1">
            Gerez vos propositions de projets envoyees aux freelances et agences.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nouvelle proposition
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Envoyees", value: counts.toutes, icon: "send", color: "text-white" },
          { label: "En attente", value: counts.en_attente, icon: "schedule", color: "text-amber-400" },
          { label: "Acceptees", value: counts.acceptee, icon: "check_circle", color: "text-primary" },
          { label: "Refusees", value: counts.refusee, icon: "cancel", color: "text-red-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-neutral-dark rounded-xl border border-border-dark p-4 flex items-center gap-3"
          >
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", s.color === "text-primary" ? "bg-primary/10" : s.color === "text-amber-400" ? "bg-amber-500/10" : s.color === "text-red-400" ? "bg-red-500/10" : "bg-white/5")}>
              <span className={cn("material-symbols-outlined", s.color)}>{s.icon}</span>
            </div>
            <div>
              <p className={cn("text-xl font-black", s.color)}>{s.value}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-dark rounded-xl p-1 border border-border-dark">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
              tab === t.key
                ? "bg-primary text-background-dark shadow"
                : "text-slate-400 hover:text-white"
            )}
          >
            {t.label}
            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                tab === t.key ? "bg-background-dark/20" : "bg-border-dark"
              )}
            >
              {counts[t.key as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {/* Proposal cards */}
      <div className="space-y-3">
        {filtered.map((p) => {
          const statusInfo = STATUS_MAP[p.status];
          return (
            <div
              key={p.id}
              className="bg-neutral-dark rounded-xl border border-border-dark p-5 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Top row: status + meta */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1", statusInfo.cls)}>
                      <span className="material-symbols-outlined text-xs">{statusInfo.icon}</span>
                      {statusInfo.label}
                    </span>
                    <span className="text-xs bg-border-dark text-slate-400 px-2.5 py-1 rounded-full">
                      {p.freelancerType === "agence" ? "Agence" : "Freelance"}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{p.id}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors">
                    {p.projectTitle}
                  </h3>

                  {/* Freelancer */}
                  <div className="flex items-center gap-2 mt-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                      {p.freelancerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{p.freelancerName}</p>
                      <p className="text-[11px] text-slate-500">
                        {p.freelancerType === "agence" ? "Agence" : "Freelance"}
                      </p>
                    </div>
                  </div>

                  {/* Description excerpt */}
                  <p className="text-sm text-slate-400 line-clamp-2 mb-3">{p.description}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.skills.map((s) => (
                      <span
                        key={s}
                        className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium border border-primary/20"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center gap-6 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">payments</span>
                      {p.budget.toLocaleString("fr-FR")} EUR
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">calendar_today</span>
                      {new Date(p.deadline).toLocaleDateString("fr-FR")}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">send</span>
                      Envoyee le {new Date(p.dateSent).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => setShowDetailModal(p.id)}
                    className="px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary hover:text-background-dark transition-all text-center"
                  >
                    Voir details
                  </button>
                  {p.status === "en_attente" && (
                    <>
                      <button
                        onClick={() => handleEdit(p)}
                        className="px-4 py-2 bg-border-dark text-slate-400 text-xs font-semibold rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-center"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleCancel(p.id)}
                        className="px-4 py-2 bg-red-500/10 text-red-400 text-xs font-semibold rounded-lg hover:bg-red-500/20 transition-colors text-center"
                      >
                        Annuler
                      </button>
                    </>
                  )}
                  {(p.status === "refusee" || p.status === "expiree") && (
                    <button
                      onClick={() => handleResend(p.id)}
                      className="px-4 py-2 bg-border-dark text-slate-400 text-xs font-semibold rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-center"
                    >
                      Relancer
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-slate-600 mb-3 block">
              inbox
            </span>
            <p className="text-slate-500 font-semibold">Aucune proposition dans cette categorie</p>
            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-background-dark text-sm font-bold rounded-lg hover:brightness-110 transition-all"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Envoyer une proposition
            </button>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* Detail Modal */}
      {/* ============================================================ */}
      {showDetailModal && detailProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDetailModal(null)}
          />
          <div className="relative w-full max-w-2xl bg-neutral-dark rounded-2xl border border-border-dark shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-dark">
              <div>
                <h2 className="text-xl font-bold text-white">Details de la proposition</h2>
                <p className="text-sm text-slate-500 font-mono mt-0.5">{detailProposal.id}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(null)}
                className="w-8 h-8 rounded-lg bg-border-dark flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Status */}
              <div className="flex items-center gap-3">
                <span className={cn("text-sm font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5", STATUS_MAP[detailProposal.status].cls)}>
                  <span className="material-symbols-outlined text-sm">{STATUS_MAP[detailProposal.status].icon}</span>
                  {STATUS_MAP[detailProposal.status].label}
                </span>
              </div>

              {/* Freelancer */}
              <div className="flex items-center gap-3 p-4 bg-background-dark rounded-xl border border-border-dark">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                  {detailProposal.freelancerName.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-bold text-white">{detailProposal.freelancerName}</p>
                  <p className="text-xs text-slate-500">
                    {detailProposal.freelancerType === "agence" ? "Agence" : "Freelance"}
                  </p>
                </div>
              </div>

              {/* Project */}
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Projet</h3>
                <p className="text-lg font-bold text-white">{detailProposal.projectTitle}</p>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{detailProposal.description}</p>
              </div>

              {/* Budget + Deadline */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-background-dark rounded-xl border border-border-dark">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Budget propose</p>
                  <p className="text-xl font-black text-primary">{detailProposal.budget.toLocaleString("fr-FR")} EUR</p>
                </div>
                <div className="p-4 bg-background-dark rounded-xl border border-border-dark">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Date limite</p>
                  <p className="text-xl font-black text-white">{new Date(detailProposal.deadline).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Competences requises</h3>
                <div className="flex flex-wrap gap-2">
                  {detailProposal.skills.map((s) => (
                    <span key={s} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium border border-primary/20">{s}</span>
                  ))}
                </div>
              </div>

              {/* Date sent */}
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="material-symbols-outlined text-sm">send</span>
                Envoyee le {new Date(detailProposal.dateSent).toLocaleDateString("fr-FR")}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-border-dark">
                {detailProposal.status === "en_attente" && (
                  <>
                    <button
                      onClick={() => {
                        setShowDetailModal(null);
                        handleEdit(detailProposal);
                      }}
                      className="px-5 py-2.5 bg-border-dark text-white text-sm font-bold rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => {
                        handleCancel(detailProposal.id);
                        setShowDetailModal(null);
                      }}
                      className="px-5 py-2.5 bg-red-500/10 text-red-400 text-sm font-bold rounded-xl hover:bg-red-500/20 transition-colors"
                    >
                      Annuler
                    </button>
                  </>
                )}
                {(detailProposal.status === "refusee" || detailProposal.status === "expiree") && (
                  <button
                    onClick={() => {
                      handleResend(detailProposal.id);
                      setShowDetailModal(null);
                    }}
                    className="px-5 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all"
                  >
                    Relancer la proposition
                  </button>
                )}
                <button
                  onClick={() => setShowDetailModal(null)}
                  className="px-5 py-2.5 bg-border-dark text-slate-400 text-sm font-semibold rounded-xl hover:text-white transition-colors ml-auto"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* Create / Edit Modal */}
      {/* ============================================================ */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setShowCreateModal(false);
              resetForm();
            }}
          />
          <div className="relative w-full max-w-2xl bg-neutral-dark rounded-2xl border border-border-dark shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-dark">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingId ? "Modifier la proposition" : "Nouvelle proposition"}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {editingId
                    ? "Modifiez les details de votre proposition"
                    : "Envoyez une proposition de projet a un freelance ou une agence"}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="w-8 h-8 rounded-lg bg-border-dark flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Freelancer search */}
              <div className="relative">
                <label className="block text-sm font-semibold text-white mb-2">
                  Destinataire <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Rechercher un freelance ou une agence..."
                    value={freelancerSearch}
                    onChange={(e) => {
                      setFreelancerSearch(e.target.value);
                      setShowFreelancerDropdown(true);
                    }}
                    onFocus={() => setShowFreelancerDropdown(true)}
                    className="w-full pl-10 pr-4 py-3 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                {newFreelancer && (
                  <div className="flex items-center gap-2 mt-2 p-2 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                      {newFreelancer.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="text-sm font-semibold text-primary">{newFreelancer}</span>
                    <button
                      onClick={() => {
                        setNewFreelancer("");
                        setFreelancerSearch("");
                      }}
                      className="ml-auto text-primary/60 hover:text-primary"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                )}
                {showFreelancerDropdown && freelancerSearch && !newFreelancer && (
                  <div className="absolute z-10 w-full mt-1 bg-background-dark border border-border-dark rounded-xl shadow-xl max-h-48 overflow-y-auto">
                    {filteredFreelancers.map((f) => (
                      <button
                        key={f.name}
                        onClick={() => {
                          setNewFreelancer(f.name);
                          setFreelancerSearch(f.name);
                          setShowFreelancerDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-dark transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                          {f.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{f.name}</p>
                          <p className="text-[11px] text-slate-500">{f.type === "agence" ? "Agence" : "Freelance"} · {f.skills.join(", ")}</p>
                        </div>
                      </button>
                    ))}
                    {filteredFreelancers.length === 0 && (
                      <p className="px-4 py-3 text-sm text-slate-500">Aucun resultat</p>
                    )}
                  </div>
                )}
              </div>

              {/* Project title */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Titre du projet <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Refonte site vitrine entreprise"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Description du projet <span className="text-red-400">*</span>
                </label>
                <textarea
                  placeholder="Decrivez votre projet en detail : objectifs, livrables attendus, contexte..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              {/* Budget + Deadline */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Budget (EUR) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                      payments
                    </span>
                    <input
                      type="number"
                      placeholder="3 000"
                      value={newBudget}
                      onChange={(e) => setNewBudget(e.target.value)}
                      className="w-full pl-10 pr-14 py-3 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-semibold">EUR</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Date limite <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Skills tags */}
              <div className="relative">
                <label className="block text-sm font-semibold text-white mb-2">
                  Competences requises
                </label>
                {newSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {newSkills.map((s) => (
                      <span
                        key={s}
                        className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium border border-primary/20 flex items-center gap-1"
                      >
                        {s}
                        <button onClick={() => toggleSkill(s)} className="hover:text-white">
                          <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setShowSkillDropdown(!showSkillDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-background-dark border border-border-dark rounded-xl text-sm text-slate-500 hover:border-primary/30 transition-colors"
                >
                  <span>Ajouter des competences...</span>
                  <span className="material-symbols-outlined text-lg">expand_more</span>
                </button>
                {showSkillDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-background-dark border border-border-dark rounded-xl shadow-xl p-3 max-h-48 overflow-y-auto">
                    <div className="flex flex-wrap gap-1.5">
                      {SKILL_OPTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleSkill(s)}
                          className={cn(
                            "text-xs px-2.5 py-1.5 rounded-full font-medium transition-all border",
                            newSkills.includes(s)
                              ? "bg-primary/20 text-primary border-primary/30"
                              : "bg-border-dark text-slate-400 border-border-dark hover:text-white hover:border-primary/20"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-border-dark">
                <button
                  onClick={handleSubmitProposal}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                >
                  <span className="material-symbols-outlined text-lg">
                    {editingId ? "save" : "send"}
                  </span>
                  {editingId ? "Enregistrer" : "Envoyer la proposition"}
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2.5 bg-border-dark text-slate-400 text-sm font-semibold rounded-xl hover:text-white transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
