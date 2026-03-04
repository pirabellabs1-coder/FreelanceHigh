"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const FREELANCES = [
  { id: "1", name: "Awa Diop", title: "Développeuse React/Next.js", skills: ["React", "Next.js", "TypeScript"], rate: "€45/h", rating: 4.9, available: true, initials: "AD" },
  { id: "2", name: "Moussa Keita", title: "Designer UI/UX Senior", skills: ["Figma", "Sketch", "Adobe XD"], rate: "€50/h", rating: 4.8, available: true, initials: "MK" },
  { id: "3", name: "Léa Dupont", title: "Rédactrice SEO", skills: ["SEO", "Copywriting", "WordPress"], rate: "€30/h", rating: 4.7, available: false, initials: "LD" },
  { id: "4", name: "Omar Bah", title: "Développeur Python/Django", skills: ["Python", "Django", "PostgreSQL"], rate: "€55/h", rating: 4.9, available: true, initials: "OB" },
  { id: "5", name: "Salimata Traoré", title: "Marketing Digital", skills: ["Google Ads", "Meta Ads", "Analytics"], rate: "€40/h", rating: 4.6, available: true, initials: "ST" },
];

const MISSIONS = [
  { id: "M-001", freelance: "Awa Diop", service: "Intégration composants React", client: "Dakar Shop", amount: 2200, agencyMargin: 440, status: "en_cours", deadline: "2026-03-20" },
  { id: "M-002", freelance: "Moussa Keita", service: "Maquettes app mobile", client: "HealthApp", amount: 1800, agencyMargin: 360, status: "en_cours", deadline: "2026-03-15" },
  { id: "M-003", freelance: "Léa Dupont", service: "Rédaction articles SEO (x10)", client: "FashionAfrik", amount: 1500, agencyMargin: 300, status: "livree", deadline: "2026-02-28" },
  { id: "M-004", freelance: "Omar Bah", service: "API REST microservices", client: "FinTech CI", amount: 4200, agencyMargin: 840, status: "en_cours", deadline: "2026-04-01" },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  en_cours: { label: "En cours", cls: "bg-blue-500/20 text-blue-400" },
  livree: { label: "Livrée", cls: "bg-emerald-500/20 text-emerald-400" },
};

export default function AgenceSousTraitance() {
  const [tab, setTab] = useState<"freelances" | "missions">("freelances");
  const [skillFilter, setSkillFilter] = useState("");
  const [showOrder, setShowOrder] = useState(false);
  const { addToast } = useToastStore();

  const allSkills = [...new Set(FREELANCES.flatMap(f => f.skills))];
  const filteredFreelances = skillFilter ? FREELANCES.filter(f => f.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase()))) : FREELANCES;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Sous-traitance</h1>
          <p className="text-slate-400 text-sm mt-1">Trouvez des freelances externes et gérez les missions sous-traitées.</p>
        </div>
        <button onClick={() => setShowOrder(true)} className="px-4 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">add</span>
          Nouvelle commande
        </button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab("freelances")} className={cn("px-4 py-2 rounded-lg text-sm font-semibold transition-colors", tab === "freelances" ? "bg-primary text-background-dark" : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white")}>Freelances disponibles</button>
        <button onClick={() => setTab("missions")} className={cn("px-4 py-2 rounded-lg text-sm font-semibold transition-colors", tab === "missions" ? "bg-primary text-background-dark" : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white")}>Missions en cours ({MISSIONS.filter(m => m.status === "en_cours").length})</button>
      </div>

      {tab === "freelances" && (
        <>
          <div className="relative max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
            <input value={skillFilter} onChange={e => setSkillFilter(e.target.value)} placeholder="Filtrer par compétence..." className="w-full pl-10 pr-4 py-2.5 bg-neutral-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {allSkills.map(s => (
              <button key={s} onClick={() => setSkillFilter(skillFilter === s ? "" : s)} className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors", skillFilter === s ? "bg-primary/10 text-primary border border-primary/20" : "bg-neutral-dark text-slate-500 border border-border-dark hover:text-white")}>{s}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredFreelances.map(f => (
              <div key={f.id} className="bg-neutral-dark rounded-xl border border-border-dark p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">{f.initials}</div>
                    <div>
                      <p className="font-bold text-white text-sm">{f.name}</p>
                      <p className="text-xs text-slate-500">{f.title}</p>
                    </div>
                  </div>
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", f.available ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400")}>{f.available ? "Disponible" : "Occupé"}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {f.skills.map(s => <span key={s} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">{s}</span>)}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{f.rate}</span>
                    <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-yellow-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>{f.rating}</span>
                  </div>
                  <button onClick={() => { setShowOrder(true); }} className="text-xs text-primary font-semibold hover:underline">Commander</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "missions" && (
        <div className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
          <table className="w-full">
            <thead><tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-border-dark"><th className="px-5 py-3 text-left font-semibold">Mission</th><th className="px-5 py-3 text-left font-semibold">Freelance</th><th className="px-5 py-3 text-left font-semibold">Client</th><th className="px-5 py-3 text-left font-semibold">Montant</th><th className="px-5 py-3 text-left font-semibold">Marge</th><th className="px-5 py-3 text-left font-semibold">Statut</th><th className="px-5 py-3 text-left font-semibold">Deadline</th></tr></thead>
            <tbody>
              {MISSIONS.map(m => (
                <tr key={m.id} className="border-b border-border-dark/50 hover:bg-background-dark/30 transition-colors">
                  <td className="px-5 py-3"><p className="text-sm font-semibold text-white">{m.service}</p><p className="text-xs text-slate-500">{m.id}</p></td>
                  <td className="px-5 py-3 text-sm text-slate-300">{m.freelance}</td>
                  <td className="px-5 py-3 text-sm text-slate-400">{m.client}</td>
                  <td className="px-5 py-3 text-sm font-bold text-white">€{m.amount.toLocaleString("fr-FR")}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-primary">€{m.agencyMargin.toLocaleString("fr-FR")}</td>
                  <td className="px-5 py-3"><span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", STATUS_MAP[m.status]?.cls)}>{STATUS_MAP[m.status]?.label}</span></td>
                  <td className="px-5 py-3 text-sm text-slate-500">{new Date(m.deadline).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowOrder(false)} />
          <div className="relative bg-neutral-dark rounded-2xl border border-border-dark p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">Nouvelle commande externe</h3>
            <div className="space-y-4">
              <input placeholder="Description de la mission" className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Budget (€)" className="px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50" />
                <input type="date" className="px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50" />
              </div>
              <textarea placeholder="Détails..." rows={3} className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 resize-none" />
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowOrder(false)} className="flex-1 py-2.5 text-slate-400 text-sm font-semibold hover:text-white transition-colors">Annuler</button>
                <button onClick={() => { addToast("success", "Commande envoyée !"); setShowOrder(false); }} className="flex-1 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all">Envoyer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
