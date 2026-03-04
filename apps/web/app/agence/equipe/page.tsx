"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const MEMBERS = [
  { id: "1", name: "Thomas Martin", role: "admin", title: "Directeur Agence", skills: ["Stratégie", "Management"], occupation: 45, projects: 5, rating: 4.9, access: "Complet", initials: "TM" },
  { id: "2", name: "Amadou Diallo", role: "manager", title: "Lead Développeur", skills: ["React", "Node.js", "TypeScript"], occupation: 82, projects: 4, rating: 4.8, access: "Projets + Finances", initials: "AD" },
  { id: "3", name: "Fatou Sow", role: "membre", title: "Designer UI/UX", skills: ["Figma", "UI Design", "Branding"], occupation: 70, projects: 3, rating: 4.7, access: "Projets", initials: "FS" },
  { id: "4", name: "Nadia Fofana", role: "commercial", title: "Responsable Commercial", skills: ["Vente", "SEO", "Marketing"], occupation: 55, projects: 2, rating: 4.6, access: "Clients + Projets", initials: "NF" },
  { id: "5", name: "Ibrahim Mbaye", role: "membre", title: "Développeur Full-Stack", skills: ["Python", "Django", "React"], occupation: 90, projects: 4, rating: 4.9, access: "Projets", initials: "IM" },
  { id: "6", name: "Yacine Diop", role: "membre", title: "DevOps Engineer", skills: ["AWS", "Docker", "CI/CD"], occupation: 60, projects: 2, rating: 4.5, access: "Projets", initials: "YD" },
  { id: "7", name: "Kofi Asante", role: "commercial", title: "Business Developer", skills: ["CRM", "Négociation"], occupation: 40, projects: 3, rating: 4.4, access: "Clients", initials: "KA" },
  { id: "8", name: "Marie Koffi", role: "membre", title: "Rédactrice Web", skills: ["SEO", "Copywriting", "Blog"], occupation: 65, projects: 3, rating: 4.7, access: "Projets", initials: "MK" },
];

const PENDING_REQUESTS = [
  { name: "Aïssatou Ba", email: "aissatou@email.com", role: "Développeuse Frontend", date: "2026-03-02" },
  { name: "Moussa Camara", email: "moussa@email.com", role: "Designer 3D", date: "2026-03-01" },
  { name: "Léa Dubois", email: "lea@email.com", role: "Chef de projet", date: "2026-02-28" },
];

const ROLE_BADGES: Record<string, { label: string; cls: string }> = {
  admin: { label: "Admin", cls: "bg-red-500/20 text-red-400" },
  manager: { label: "Manager", cls: "bg-purple-500/20 text-purple-400" },
  membre: { label: "Membre", cls: "bg-blue-500/20 text-blue-400" },
  commercial: { label: "Commercial", cls: "bg-amber-500/20 text-amber-400" },
};

export default function AgenceEquipe() {
  const [tab, setTab] = useState<"tous" | "dispo" | "demandes">("tous");
  const [roleFilter, setRoleFilter] = useState("tous");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "membre", message: "" });
  const { addToast } = useToastStore();

  const filtered = roleFilter === "tous" ? MEMBERS : MEMBERS.filter(m => m.role === roleFilter);
  const avgOccupation = Math.round(MEMBERS.reduce((s, m) => s + m.occupation, 0) / MEMBERS.length);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Membres de l&apos;Agence</h1>
          <p className="text-slate-400 text-sm mt-1">Gérez votre équipe et les accès des collaborateurs.</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="px-4 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">person_add</span>
          Ajouter un membre
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Charge Moyenne", value: `${avgOccupation}%`, icon: "speed", color: "text-primary" },
          { label: "Taux d'Activité", value: "92%", icon: "trending_up", color: "text-emerald-400" },
          { label: "Projets Actifs", value: "24", icon: "folder_open", color: "text-blue-400" },
        ].map(s => (
          <div key={s.label} className="bg-neutral-dark rounded-xl border border-border-dark p-4 flex items-center gap-3">
            <span className={cn("material-symbols-outlined text-xl", s.color)}>{s.icon}</span>
            <div>
              <p className="text-xl font-black text-white">{s.value}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab("tous")} className={cn("px-4 py-2 rounded-lg text-sm font-semibold transition-colors", tab === "tous" ? "bg-primary text-background-dark" : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white")}>
          Tous les membres ({MEMBERS.length})
        </button>
        <button onClick={() => setTab("dispo")} className={cn("px-4 py-2 rounded-lg text-sm font-semibold transition-colors", tab === "dispo" ? "bg-primary text-background-dark" : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white")}>
          Disponibilité
        </button>
        <button onClick={() => setTab("demandes")} className={cn("px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2", tab === "demandes" ? "bg-primary text-background-dark" : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white")}>
          Demandes d&apos;accès ({PENDING_REQUESTS.length})
          {PENDING_REQUESTS.length > 0 && <span className="w-2 h-2 bg-amber-400 rounded-full" />}
        </button>
      </div>

      {/* Role filters */}
      {(tab === "tous" || tab === "dispo") && (
        <div className="flex gap-2">
          {[{ key: "tous", label: "Tous" }, { key: "admin", label: "Admin" }, { key: "manager", label: "Manager" }, { key: "membre", label: "Membre" }, { key: "commercial", label: "Commercial" }].map(f => (
            <button key={f.key} onClick={() => setRoleFilter(f.key)} className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors", roleFilter === f.key ? "bg-primary/10 text-primary border border-primary/20" : "bg-neutral-dark text-slate-500 border border-border-dark hover:text-white")}>
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Members table */}
      {(tab === "tous" || tab === "dispo") && (
        <div className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-border-dark">
                <th className="px-5 py-3 text-left font-semibold">Collaborateur</th>
                <th className="px-5 py-3 text-left font-semibold">Rôle</th>
                <th className="px-5 py-3 text-left font-semibold">Accès</th>
                <th className="px-5 py-3 text-left font-semibold">Charge de travail</th>
                <th className="px-5 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className="border-b border-border-dark/50 hover:bg-background-dark/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">{m.initials}</div>
                      <div>
                        <p className="text-sm font-semibold text-white">{m.name}</p>
                        <p className="text-xs text-slate-500">{m.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3"><span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", ROLE_BADGES[m.role]?.cls)}>{ROLE_BADGES[m.role]?.label}</span></td>
                  <td className="px-5 py-3 text-sm text-slate-400">{m.access}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-border-dark rounded-full max-w-[100px]">
                        <div className={cn("h-full rounded-full", m.occupation > 80 ? "bg-red-400" : m.occupation > 60 ? "bg-amber-400" : "bg-primary")} style={{ width: `${m.occupation}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-400">{m.occupation}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => addToast("info", `Profil de ${m.name}`)} className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
                      <button onClick={() => addToast("info", `Retirer ${m.name} ?`)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"><span className="material-symbols-outlined text-lg">person_remove</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pending requests */}
      {tab === "demandes" && (
        <div className="space-y-3">
          {PENDING_REQUESTS.map((r, i) => (
            <div key={i} className="bg-neutral-dark rounded-xl border border-border-dark p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400"><span className="material-symbols-outlined">person</span></div>
                <div>
                  <p className="font-bold text-white">{r.name}</p>
                  <p className="text-xs text-slate-500">{r.email} · {r.role} · Demandé le {new Date(r.date).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => addToast("success", `${r.name} accepté(e)`)} className="px-4 py-2 bg-primary text-background-dark text-sm font-bold rounded-lg hover:brightness-110 transition-all">Accepter</button>
                <button onClick={() => addToast("info", `${r.name} refusé(e)`)} className="px-4 py-2 bg-neutral-dark border border-border-dark text-slate-400 text-sm font-semibold rounded-lg hover:text-white transition-colors">Refuser</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowInvite(false)} />
          <div className="relative bg-neutral-dark rounded-2xl border border-border-dark p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">Inviter un membre</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Email</label>
                <input type="email" value={inviteForm.email} onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))} placeholder="collaborateur@email.com" className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Rôle</label>
                <select value={inviteForm.role} onChange={e => setInviteForm(f => ({ ...f, role: e.target.value }))} className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50">
                  <option value="membre">Membre</option>
                  <option value="manager">Manager</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Message (optionnel)</label>
                <textarea value={inviteForm.message} onChange={e => setInviteForm(f => ({ ...f, message: e.target.value }))} rows={3} placeholder="Bienvenue dans l'équipe !" className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowInvite(false)} className="flex-1 py-2.5 text-slate-400 text-sm font-semibold hover:text-white transition-colors">Annuler</button>
                <button onClick={() => { addToast("success", "Invitation envoyée !"); setShowInvite(false); setInviteForm({ email: "", role: "membre", message: "" }); }} className="flex-1 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all">Envoyer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
