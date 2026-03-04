"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const ORDERS = [
  { id: "ORD-8001", service: "Développement Web Full-Stack", client: "Marc Dupont", assignee: "Amadou D.", amount: "€2 500", status: "en_cours", date: "2026-03-01" },
  { id: "ORD-8002", service: "Design UI/UX Mobile", client: "Fatima Benali", assignee: "Fatou S.", amount: "€1 800", status: "en_cours", date: "2026-02-28" },
  { id: "ORD-8003", service: "Audit SEO Complet", client: "Aminata Touré", assignee: "Nadia F.", amount: "€800", status: "livree", date: "2026-02-25" },
  { id: "ORD-8004", service: "API & Intégration Backend", client: "Jean Kouamé", assignee: "Ibrahim M.", amount: "€3 500", status: "en_cours", date: "2026-02-27" },
  { id: "ORD-8005", service: "Branding & Identité Visuelle", client: "Claire Martin", assignee: "Fatou S.", amount: "€3 200", status: "en_revision", date: "2026-02-20" },
  { id: "ORD-8006", service: "Rédaction Web SEO", client: "Sophie Diallo", assignee: "Marie K.", amount: "€500", status: "livree", date: "2026-02-18" },
  { id: "ORD-8007", service: "Campagne Ads Facebook", client: "Omar Sy", assignee: "Nadia F.", amount: "€1 200", status: "annulee", date: "2026-02-15" },
  { id: "ORD-8008", service: "Maintenance Mensuel", client: "Pierre Legrand", assignee: "Yacine D.", amount: "€600", status: "en_cours", date: "2026-03-01" },
];

const MEMBERS = ["Amadou D.", "Fatou S.", "Nadia F.", "Ibrahim M.", "Marie K.", "Yacine D.", "Kofi A."];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  en_cours: { label: "En cours", cls: "bg-blue-500/20 text-blue-400" },
  livree: { label: "Livrée", cls: "bg-emerald-500/20 text-emerald-400" },
  en_revision: { label: "En révision", cls: "bg-purple-500/20 text-purple-400" },
  annulee: { label: "Annulée", cls: "bg-red-500/20 text-red-400" },
};

export default function AgenceCommandes() {
  const [filter, setFilter] = useState("tous");
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const { addToast } = useToastStore();

  const filtered = filter === "tous" ? ORDERS : ORDERS.filter(o => o.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Commandes</h1>
        <p className="text-slate-400 text-sm mt-1">Suivez toutes les commandes issues des services de l&apos;agence.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[{ key: "tous", label: "Toutes" }, { key: "en_cours", label: "En cours" }, { key: "livree", label: "Livrées" }, { key: "en_revision", label: "En révision" }, { key: "annulee", label: "Annulées" }].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={cn("px-4 py-2 rounded-lg text-sm font-semibold transition-colors", filter === f.key ? "bg-primary text-background-dark" : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white")}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-border-dark">
              <th className="px-5 py-3 text-left font-semibold">Référence</th>
              <th className="px-5 py-3 text-left font-semibold">Service</th>
              <th className="px-5 py-3 text-left font-semibold">Client</th>
              <th className="px-5 py-3 text-left font-semibold">Assigné à</th>
              <th className="px-5 py-3 text-left font-semibold">Montant</th>
              <th className="px-5 py-3 text-left font-semibold">Statut</th>
              <th className="px-5 py-3 text-left font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} className="border-b border-border-dark/50 hover:bg-background-dark/30 transition-colors">
                <td className="px-5 py-3 text-sm font-mono text-primary font-semibold">{o.id}</td>
                <td className="px-5 py-3 text-sm text-white font-semibold">{o.service}</td>
                <td className="px-5 py-3 text-sm text-slate-400">{o.client}</td>
                <td className="px-5 py-3">
                  {assigningId === o.id ? (
                    <select
                      defaultValue={o.assignee}
                      onChange={e => { addToast("success", `Assigné à ${e.target.value}`); setAssigningId(null); }}
                      onBlur={() => setAssigningId(null)}
                      autoFocus
                      className="px-2 py-1 bg-background-dark border border-primary/50 rounded-lg text-xs text-white outline-none"
                    >
                      {MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  ) : (
                    <button onClick={() => setAssigningId(o.id)} className="flex items-center gap-2 text-sm text-slate-300 hover:text-primary transition-colors">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">{o.assignee.split(" ").map(n => n[0]).join("")}</div>
                      {o.assignee}
                    </button>
                  )}
                </td>
                <td className="px-5 py-3 text-sm font-semibold text-white">{o.amount}</td>
                <td className="px-5 py-3"><span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", STATUS_MAP[o.status]?.cls)}>{STATUS_MAP[o.status]?.label}</span></td>
                <td className="px-5 py-3 text-sm text-slate-500">{new Date(o.date).toLocaleDateString("fr-FR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
