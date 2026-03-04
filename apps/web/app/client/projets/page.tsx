"use client";

import { useState } from "react";
import Link from "next/link";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const PROJECTS = [
  { id: "1", title: "Refonte site vitrine entreprise", category: "Développement Web", description: "Refonte complète du site vitrine de notre entreprise avec un design moderne et responsive. Intégration d'un CMS headless.", budget: "2 000 - 3 500", deadline: "2026-04-01", candidatures: 12, skills: ["React", "Next.js", "Tailwind"], status: "actif", urgency: "normale", progress: 65 },
  { id: "2", title: "Application mobile de livraison", category: "Mobile", description: "Développement d'une application mobile de livraison avec géolocalisation en temps réel et paiement Mobile Money.", budget: "5 000 - 8 000", deadline: "2026-05-15", candidatures: 8, skills: ["React Native", "Node.js", "PostgreSQL"], status: "actif", urgency: "urgente", progress: 32 },
  { id: "3", title: "Campagne marketing réseaux sociaux", category: "Marketing Digital", description: "Gestion de campagnes publicitaires sur Facebook, Instagram et LinkedIn pendant 3 mois.", budget: "800 - 1 500", deadline: "2026-03-20", candidatures: 23, skills: ["Facebook Ads", "Instagram", "Copywriting"], status: "actif", urgency: "normale", progress: 90 },
  { id: "4", title: "Logo et identité visuelle", category: "Design", description: "Création d'un logo et d'une charte graphique complète pour notre nouvelle marque.", budget: "500 - 1 200", deadline: "2026-03-30", candidatures: 18, skills: ["Illustrator", "Branding", "Photoshop"], status: "termine", urgency: "normale", progress: 100 },
  { id: "5", title: "Rédaction articles blog (20 articles)", category: "Rédaction", description: "Rédaction de 20 articles optimisés SEO pour notre blog d'entreprise.", budget: "600 - 1 000", deadline: "2026-04-15", candidatures: 31, skills: ["SEO", "Copywriting", "WordPress"], status: "termine", urgency: "normale", progress: 100 },
  { id: "6", title: "Audit cybersécurité infrastructure", category: "Cybersécurité", description: "Audit complet de la sécurité de notre infrastructure cloud et recommandations.", budget: "3 000 - 5 000", deadline: "2026-04-30", candidatures: 5, skills: ["Pentest", "AWS", "Docker"], status: "brouillon", urgency: "tres_urgente", progress: 0 },
];

const TABS = [
  { key: "tous", label: "Tous" },
  { key: "actif", label: "Actifs" },
  { key: "termine", label: "Terminés" },
  { key: "brouillon", label: "Brouillons" },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  actif: { label: "Actif", cls: "bg-primary/20 text-primary" },
  termine: { label: "Terminé", cls: "bg-slate-500/20 text-slate-400" },
  brouillon: { label: "Brouillon", cls: "bg-amber-500/20 text-amber-400" },
};

export default function ClientProjects() {
  const [tab, setTab] = useState("tous");
  const [projects, setProjects] = useState(PROJECTS);
  const { addToast } = useToastStore();

  const filtered = tab === "tous" ? projects : projects.filter(p => p.status === tab);
  const counts = {
    tous: projects.length,
    actif: projects.filter(p => p.status === "actif").length,
    termine: projects.filter(p => p.status === "termine").length,
    brouillon: projects.filter(p => p.status === "brouillon").length,
  };

  function handleDelete(id: string) {
    if (confirm("Supprimer ce projet ?")) {
      setProjects(prev => prev.filter(p => p.id !== id));
      addToast("success", "Projet supprimé");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Mes Projets</h1>
          <p className="text-slate-400 text-sm mt-1">{projects.length} projets publiés · Gérez vos offres et suivez les candidatures.</p>
        </div>
        <Link
          href="/client/projets/nouveau"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Publier un projet
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: counts.tous, icon: "folder_open", color: "text-white" },
          { label: "Actifs", value: counts.actif, icon: "play_circle", color: "text-primary" },
          { label: "Terminés", value: counts.termine, icon: "check_circle", color: "text-slate-400" },
          { label: "Brouillons", value: counts.brouillon, icon: "edit_note", color: "text-amber-400" },
        ].map(s => (
          <div key={s.label} className="bg-neutral-dark rounded-xl border border-border-dark p-4 flex items-center gap-3">
            <span className={cn("material-symbols-outlined text-xl", s.color)}>{s.icon}</span>
            <div>
              <p className={cn("text-xl font-black", s.color)}>{s.value}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-dark rounded-xl p-1 border border-border-dark">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
              tab === t.key ? "bg-primary text-background-dark shadow" : "text-slate-400 hover:text-white"
            )}
          >
            {t.label}
            <span className={cn("text-xs px-1.5 py-0.5 rounded-full", tab === t.key ? "bg-background-dark/20" : "bg-border-dark")}>{counts[t.key as keyof typeof counts]}</span>
          </button>
        ))}
      </div>

      {/* Project cards */}
      <div className="space-y-3">
        {filtered.map(p => (
          <div key={p.id} className="bg-neutral-dark rounded-xl border border-border-dark p-5 hover:border-primary/30 transition-all group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", STATUS_MAP[p.status]?.cls)}>{STATUS_MAP[p.status]?.label}</span>
                  <span className="text-xs bg-border-dark text-slate-400 px-2.5 py-1 rounded-full">{p.category}</span>
                  {p.urgency === "urgente" && <span className="text-xs bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full font-semibold">Urgent</span>}
                  {p.urgency === "tres_urgente" && <span className="text-xs bg-red-500/20 text-red-400 px-2.5 py-1 rounded-full font-semibold">Très urgent</span>}
                </div>
                <h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors">{p.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-2 mt-1 mb-3">{p.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {p.skills.map(s => <span key={s} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium border border-primary/20">{s}</span>)}
                </div>

                <div className="flex items-center gap-6 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">payments</span>€{p.budget}</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span>{new Date(p.deadline).toLocaleDateString("fr-FR")}</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">group</span>{p.candidatures} candidatures</span>
                </div>

                {p.status === "actif" && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-border-dark rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="text-xs font-bold text-primary">{p.progress}%</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 flex-shrink-0">
                <Link href={`/client/projets/${p.id}`} className="px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary hover:text-background-dark transition-all text-center">
                  Voir détails
                </Link>
                <button className="px-4 py-2 bg-border-dark text-slate-400 text-xs font-semibold rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-center">
                  Modifier
                </button>
                <button onClick={() => handleDelete(p.id)} className="px-4 py-2 bg-red-500/10 text-red-400 text-xs font-semibold rounded-lg hover:bg-red-500/20 transition-colors text-center">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-slate-600 mb-3">inbox</span>
            <p className="text-slate-500 font-semibold">Aucun projet dans cette catégorie</p>
            <Link href="/client/projets/nouveau" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-background-dark text-sm font-bold rounded-lg hover:brightness-110 transition-all">
              <span className="material-symbols-outlined text-lg">add</span>
              Publier un projet
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
