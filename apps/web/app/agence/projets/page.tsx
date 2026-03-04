"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

type ProjectStatus = "a_faire" | "en_cours" | "en_revision" | "termine";
type Priority = "urgent" | "normal" | "faible";

interface Project { id: string; title: string; client: string; assignee: string; initials: string; deadline: string; progress: number; status: ProjectStatus; priority: Priority; budget: string; }

const PROJECTS: Project[] = [
  { id: "1", title: "Refonte e-commerce Dakar Shop", client: "Dakar Shop SARL", assignee: "Amadou D.", initials: "AD", deadline: "2026-03-15", progress: 65, status: "en_cours", priority: "urgent", budget: "€12 500" },
  { id: "2", title: "App mobile livraison", client: "QuickDeliver", assignee: "Ibrahim M.", initials: "IM", deadline: "2026-04-01", progress: 40, status: "en_cours", priority: "normal", budget: "€18 000" },
  { id: "3", title: "Campagne SEO Q1", client: "FashionAfrik", assignee: "Nadia F.", initials: "NF", deadline: "2026-03-20", progress: 85, status: "en_revision", priority: "normal", budget: "€5 200" },
  { id: "4", title: "Audit sécurité cloud", client: "FinTech CI", assignee: "Yacine D.", initials: "YD", deadline: "2026-03-25", progress: 0, status: "a_faire", priority: "urgent", budget: "€8 000" },
  { id: "5", title: "Design système mobile", client: "HealthApp", assignee: "Fatou S.", initials: "FS", deadline: "2026-04-10", progress: 30, status: "en_cours", priority: "faible", budget: "€9 500" },
  { id: "6", title: "Branding TourAfrique", client: "TourAfrique", assignee: "Fatou S.", initials: "FS", deadline: "2026-03-10", progress: 100, status: "termine", priority: "normal", budget: "€3 800" },
  { id: "7", title: "API paiement mobile", client: "QuickDeliver", assignee: "Amadou D.", initials: "AD", deadline: "2026-03-28", progress: 15, status: "a_faire", priority: "normal", budget: "€7 200" },
  { id: "8", title: "Site vitrine EduTech", client: "EduTech SN", assignee: "Marie K.", initials: "MK", deadline: "2026-02-28", progress: 100, status: "termine", priority: "faible", budget: "€4 500" },
  { id: "9", title: "Dashboard analytics", client: "FinTech CI", assignee: "Ibrahim M.", initials: "IM", deadline: "2026-04-05", progress: 5, status: "a_faire", priority: "urgent", budget: "€11 000" },
];

const COLUMNS: { key: ProjectStatus; label: string; color: string }[] = [
  { key: "a_faire", label: "À faire", color: "bg-slate-500" },
  { key: "en_cours", label: "En cours", color: "bg-blue-500" },
  { key: "en_revision", label: "En révision", color: "bg-purple-500" },
  { key: "termine", label: "Terminé", color: "bg-emerald-500" },
];

const PRIORITY_BADGES: Record<Priority, { label: string; cls: string }> = {
  urgent: { label: "Urgent", cls: "bg-red-500/20 text-red-400" },
  normal: { label: "Normal", cls: "bg-amber-500/20 text-amber-400" },
  faible: { label: "Faible", cls: "bg-slate-500/20 text-slate-400" },
};

export default function AgenceProjets() {
  const [view, setView] = useState<"kanban" | "liste">("kanban");
  const [showNew, setShowNew] = useState(false);
  const [clientFilter, setClientFilter] = useState("tous");
  const [priorityFilter, setPriorityFilter] = useState("tous");
  const { addToast } = useToastStore();

  const clients = [...new Set(PROJECTS.map(p => p.client))];
  const filtered = PROJECTS.filter(p => (clientFilter === "tous" || p.client === clientFilter) && (priorityFilter === "tous" || p.priority === priorityFilter));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Projets</h1>
          <p className="text-slate-400 text-sm mt-1">Gérez tous les projets de l&apos;agence.</p>
        </div>
        <button onClick={() => setShowNew(true)} className="px-4 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">add</span>
          Nouveau Projet
        </button>
      </div>

      {/* Toggle + Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          <button onClick={() => setView("kanban")} className={cn("px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2", view === "kanban" ? "bg-primary text-background-dark" : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white")}>
            <span className="material-symbols-outlined text-lg">view_kanban</span>Kanban
          </button>
          <button onClick={() => setView("liste")} className={cn("px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2", view === "liste" ? "bg-primary text-background-dark" : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white")}>
            <span className="material-symbols-outlined text-lg">list</span>Liste
          </button>
        </div>
        <div className="flex gap-2">
          <select value={clientFilter} onChange={e => setClientFilter(e.target.value)} className="px-3 py-2 bg-neutral-dark border border-border-dark rounded-lg text-xs text-white outline-none focus:border-primary/50">
            <option value="tous">Tous les clients</option>
            {clients.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="px-3 py-2 bg-neutral-dark border border-border-dark rounded-lg text-xs text-white outline-none focus:border-primary/50">
            <option value="tous">Toutes priorités</option>
            <option value="urgent">Urgent</option>
            <option value="normal">Normal</option>
            <option value="faible">Faible</option>
          </select>
        </div>
      </div>

      {/* Capacity */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark p-4 flex items-center gap-4">
        <span className="material-symbols-outlined text-primary">speed</span>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400 font-semibold">Capacité Agence</span>
            <span className="text-xs font-bold text-white">75%</span>
          </div>
          <div className="h-2 bg-border-dark rounded-full"><div className="h-full bg-primary rounded-full" style={{ width: "75%" }} /></div>
        </div>
      </div>

      {/* Kanban view */}
      {view === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {COLUMNS.map(col => {
            const colProjects = filtered.filter(p => p.status === col.key);
            return (
              <div key={col.key}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn("w-3 h-3 rounded-full", col.color)} />
                  <span className="text-sm font-bold text-white">{col.label}</span>
                  <span className="text-xs text-slate-500 bg-border-dark px-1.5 py-0.5 rounded-full">{colProjects.length}</span>
                </div>
                <div className="space-y-3">
                  {colProjects.map(p => (
                    <div key={p.id} className="bg-neutral-dark rounded-xl border border-border-dark p-4 hover:border-primary/20 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", PRIORITY_BADGES[p.priority].cls)}>{PRIORITY_BADGES[p.priority].label}</span>
                        <span className="text-[10px] text-slate-500">{new Date(p.deadline).toLocaleDateString("fr-FR")}</span>
                      </div>
                      <p className="text-sm font-bold text-white mb-1">{p.title}</p>
                      <p className="text-xs text-slate-500 mb-3">{p.client}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[9px] font-bold">{p.initials}</div>
                          <span className="text-xs text-slate-400">{p.assignee}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-400">{p.progress}%</span>
                      </div>
                      {p.progress > 0 && p.progress < 100 && (
                        <div className="h-1.5 bg-border-dark rounded-full mt-2"><div className="h-full bg-primary rounded-full" style={{ width: `${p.progress}%` }} /></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List view */}
      {view === "liste" && (
        <div className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-border-dark">
                <th className="px-5 py-3 text-left font-semibold">Projet</th>
                <th className="px-5 py-3 text-left font-semibold">Client</th>
                <th className="px-5 py-3 text-left font-semibold">Assigné</th>
                <th className="px-5 py-3 text-left font-semibold">Priorité</th>
                <th className="px-5 py-3 text-left font-semibold">Progression</th>
                <th className="px-5 py-3 text-left font-semibold">Budget</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-border-dark/50 hover:bg-background-dark/30 transition-colors">
                  <td className="px-5 py-3"><p className="text-sm font-semibold text-white">{p.title}</p><p className="text-xs text-slate-500">Deadline : {new Date(p.deadline).toLocaleDateString("fr-FR")}</p></td>
                  <td className="px-5 py-3 text-sm text-slate-400">{p.client}</td>
                  <td className="px-5 py-3"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">{p.initials}</div><span className="text-sm text-slate-300">{p.assignee}</span></div></td>
                  <td className="px-5 py-3"><span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", PRIORITY_BADGES[p.priority].cls)}>{PRIORITY_BADGES[p.priority].label}</span></td>
                  <td className="px-5 py-3"><div className="flex items-center gap-2"><div className="flex-1 h-2 bg-border-dark rounded-full max-w-[100px]"><div className="h-full bg-primary rounded-full" style={{ width: `${p.progress}%` }} /></div><span className="text-xs font-semibold text-slate-400">{p.progress}%</span></div></td>
                  <td className="px-5 py-3 text-sm font-semibold text-white">{p.budget}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New project modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNew(false)} />
          <div className="relative bg-neutral-dark rounded-2xl border border-border-dark p-6 w-full max-w-lg">
            <h3 className="text-lg font-bold text-white mb-4">Nouveau projet</h3>
            <div className="space-y-4">
              <input placeholder="Titre du projet" className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50" />
              <select className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50">
                <option>Sélectionner un client</option>
                {clients.map(c => <option key={c}>{c}</option>)}
              </select>
              <textarea placeholder="Description" rows={3} className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" className="px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50" />
                <input placeholder="Budget (€)" className="px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50" />
              </div>
              <select className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50">
                <option value="normal">Priorité : Normal</option>
                <option value="urgent">Priorité : Urgent</option>
                <option value="faible">Priorité : Faible</option>
              </select>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowNew(false)} className="flex-1 py-2.5 text-slate-400 text-sm font-semibold hover:text-white transition-colors">Annuler</button>
                <button onClick={() => { addToast("success", "Projet créé !"); setShowNew(false); }} className="flex-1 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all">Créer le projet</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
