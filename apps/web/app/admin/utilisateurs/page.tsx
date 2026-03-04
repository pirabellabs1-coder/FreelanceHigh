"use client";

import { useState, useMemo } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const USERS = [
  { id: "1", name: "Amadou Diallo", email: "amadou@email.com", role: "freelance", country: "\u{1F1F8}\u{1F1F3} S\u00e9n\u00e9gal", registered: "2025-08-15", kyc: 3, status: "actif" },
  { id: "2", name: "Marie Dupont", email: "marie@email.com", role: "client", country: "\u{1F1EB}\u{1F1F7} France", registered: "2025-09-20", kyc: 2, status: "actif" },
  { id: "3", name: "Thomas Martin", email: "thomas@techcorp.sn", role: "agence", country: "\u{1F1F8}\u{1F1F3} S\u00e9n\u00e9gal", registered: "2025-10-01", kyc: 4, status: "actif" },
  { id: "4", name: "Fatou Sow", email: "fatou@email.ci", role: "freelance", country: "\u{1F1E8}\u{1F1EE} C\u00f4te d\u2019Ivoire", registered: "2025-11-10", kyc: 3, status: "actif" },
  { id: "5", name: "Ibrahim Mensah", email: "ibrahim@email.gh", role: "freelance", country: "\u{1F1EC}\u{1F1ED} Ghana", registered: "2025-12-05", kyc: 2, status: "actif" },
  { id: "6", name: "Nadia Faye", email: "nadia@email.sn", role: "freelance", country: "\u{1F1F8}\u{1F1F3} S\u00e9n\u00e9gal", registered: "2026-01-15", kyc: 3, status: "actif" },
  { id: "7", name: "Jean Koulibaly", email: "jean@quickdeliver.com", role: "client", country: "\u{1F1E8}\u{1F1EE} C\u00f4te d\u2019Ivoire", registered: "2026-01-20", kyc: 2, status: "actif" },
  { id: "8", name: "Ousmane Konat\u00e9", email: "ousmane@email.ml", role: "freelance", country: "\u{1F1F2}\u{1F1F1} Mali", registered: "2026-02-01", kyc: 1, status: "suspendu" },
  { id: "9", name: "A\u00efcha Bamba", email: "aicha@email.ci", role: "freelance", country: "\u{1F1E8}\u{1F1EE} C\u00f4te d\u2019Ivoire", registered: "2026-02-10", kyc: 2, status: "actif" },
  { id: "10", name: "Kofi Asante", email: "kofi@email.gh", role: "freelance", country: "\u{1F1EC}\u{1F1ED} Ghana", registered: "2026-02-15", kyc: 1, status: "actif" },
  { id: "11", name: "Moussa Traor\u00e9", email: "moussa@email.ml", role: "freelance", country: "\u{1F1F2}\u{1F1F1} Mali", registered: "2026-02-20", kyc: 3, status: "actif" },
  { id: "12", name: "Sophie Martin", email: "sophie@techmag.fr", role: "client", country: "\u{1F1EB}\u{1F1F7} France", registered: "2026-02-25", kyc: 2, status: "actif" },
  { id: "13", name: "Yacine Diop", email: "yacine@email.sn", role: "freelance", country: "\u{1F1F8}\u{1F1F3} S\u00e9n\u00e9gal", registered: "2026-03-01", kyc: 4, status: "actif" },
  { id: "14", name: "Paul Kouadio", email: "paul@email.ci", role: "freelance", country: "\u{1F1E8}\u{1F1EE} C\u00f4te d\u2019Ivoire", registered: "2026-03-02", kyc: 1, status: "banni" },
  { id: "15", name: "Ahmed Tour\u00e9", email: "ahmed@fintech.ci", role: "client", country: "\u{1F1E8}\u{1F1EE} C\u00f4te d\u2019Ivoire", registered: "2026-03-03", kyc: 3, status: "actif" },
];

const ROLE_MAP: Record<string, { label: string; cls: string }> = {
  freelance: { label: "Freelance", cls: "bg-primary/10 text-primary" },
  client: { label: "Client", cls: "bg-blue-500/20 text-blue-400" },
  agence: { label: "Agence", cls: "bg-purple-500/20 text-purple-400" },
};

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  actif: { label: "Actif", cls: "bg-emerald-500/20 text-emerald-400" },
  suspendu: { label: "Suspendu", cls: "bg-amber-500/20 text-amber-400" },
  banni: { label: "Banni", cls: "bg-red-500/20 text-red-400" },
};

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { addToast } = useToastStore();

  const filtered = useMemo(() => {
    return USERS.filter(u => {
      if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
      if (roleFilter && u.role !== roleFilter) return false;
      if (statusFilter && u.status !== statusFilter) return false;
      return true;
    });
  }, [search, roleFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">people</span>
          Utilisateurs
        </h1>
        <p className="text-slate-400 text-sm mt-1">G\u00e9rez les comptes de la plateforme FreelanceHigh.</p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-dark bg-neutral-dark text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-border-dark bg-neutral-dark text-sm text-white outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
        >
          <option value="">Tous les r\u00f4les</option>
          <option value="freelance">Freelance</option>
          <option value="client">Client</option>
          <option value="agence">Agence</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-border-dark bg-neutral-dark text-sm text-white outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
        >
          <option value="">Tous les statuts</option>
          <option value="actif">Actif</option>
          <option value="suspendu">Suspendu</option>
          <option value="banni">Banni</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-dark">
                <th className="px-5 py-3 text-left text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Utilisateur</th>
                <th className="px-5 py-3 text-left text-[10px] text-slate-500 uppercase tracking-wider font-semibold">R\u00f4le</th>
                <th className="px-5 py-3 text-left text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Pays</th>
                <th className="px-5 py-3 text-center text-[10px] text-slate-500 uppercase tracking-wider font-semibold">KYC</th>
                <th className="px-5 py-3 text-center text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Statut</th>
                <th className="px-5 py-3 text-left text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Inscrit le</th>
                <th className="px-5 py-3 text-center text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-border-dark/50 hover:bg-background-dark/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {u.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", ROLE_MAP[u.role]?.cls)}>
                      {ROLE_MAP[u.role]?.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-300">{u.country}</td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-xs font-bold bg-border-dark text-slate-300 px-2 py-0.5 rounded-full">Niv. {u.kyc}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", STATUS_MAP[u.status]?.cls)}>
                      {STATUS_MAP[u.status]?.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-400">{new Date(u.registered).toLocaleDateString("fr-FR")}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => addToast("info", `Profil de ${u.name} ouvert`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Voir profil"
                      >
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                      {u.status === "actif" && (
                        <button
                          onClick={() => addToast("warning", `${u.name} suspendu`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                          title="Suspendre"
                        >
                          <span className="material-symbols-outlined text-lg">block</span>
                        </button>
                      )}
                      {u.status === "suspendu" && (
                        <button
                          onClick={() => addToast("success", `${u.name} r\u00e9activ\u00e9`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                          title="R\u00e9activer"
                        >
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                        </button>
                      )}
                      {u.status === "banni" && (
                        <button
                          onClick={() => addToast("info", `Compte de ${u.name} d\u00e9banni`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                          title="D\u00e9bannir"
                        >
                          <span className="material-symbols-outlined text-lg">lock_open</span>
                        </button>
                      )}
                      <button
                        onClick={() => addToast("info", `Message envoy\u00e9 \u00e0 ${u.name}`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                        title="Envoyer un message"
                      >
                        <span className="material-symbols-outlined text-lg">mail</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-sm text-slate-500 text-center">{filtered.length} utilisateur{filtered.length > 1 ? "s" : ""} affich\u00e9{filtered.length > 1 ? "s" : ""}</p>
    </div>
  );
}
