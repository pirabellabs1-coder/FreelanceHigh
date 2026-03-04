"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const ORDERS = [
  { id: "CMD-2601", service: "Site e-commerce Shopify", freelance: "Amadou D.", client: "Marie Dupont", amount: 1200, status: "en_cours", date: "2026-03-03", deadline: "2026-03-18" },
  { id: "CMD-2602", service: "Logo & Branding complet", freelance: "Fatou S.", client: "StartupTech SAS", amount: 450, status: "en_cours", date: "2026-03-02", deadline: "2026-03-12" },
  { id: "CMD-2603", service: "Application mobile React Native", freelance: "Ibrahim M.", client: "Awa Consulting", amount: 3500, status: "livree", date: "2026-02-15", deadline: "2026-03-01" },
  { id: "CMD-2604", service: "Audit SEO complet", freelance: "Nadia F.", client: "Marie Dupont", amount: 350, status: "livree", date: "2026-02-20", deadline: "2026-03-05" },
  { id: "CMD-2605", service: "Campagne Google Ads", freelance: "Cheikh B.", client: "Moussa Import-Export", amount: 800, status: "revision", date: "2026-02-28", deadline: "2026-03-10" },
  { id: "CMD-2606", service: "Design UI/UX application", freelance: "A\u00efcha K.", client: "FinTech Abidjan", amount: 1800, status: "litige", date: "2026-02-10", deadline: "2026-02-28" },
  { id: "CMD-2607", service: "R\u00e9daction articles SEO (x10)", freelance: "Ousmane T.", client: "BlogMedia SARL", amount: 500, status: "annulee", date: "2026-02-05", deadline: "2026-02-20" },
  { id: "CMD-2608", service: "API REST Node.js", freelance: "Amadou D.", client: "StartupTech SAS", amount: 2200, status: "en_cours", date: "2026-03-01", deadline: "2026-03-20" },
  { id: "CMD-2609", service: "Chatbot WhatsApp", freelance: "Ibrahim M.", client: "Awa Consulting", amount: 950, status: "en_attente", date: "2026-03-04", deadline: "2026-03-15" },
  { id: "CMD-2610", service: "Montage vid\u00e9o promotionnelle", freelance: "Fatou S.", client: "Marie Dupont", amount: 600, status: "en_attente", date: "2026-03-04", deadline: "2026-03-14" },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  en_attente: { label: "En attente", cls: "bg-slate-500/20 text-slate-400" },
  en_cours: { label: "En cours", cls: "bg-blue-500/20 text-blue-400" },
  livree: { label: "Livr\u00e9e", cls: "bg-emerald-500/20 text-emerald-400" },
  revision: { label: "R\u00e9vision", cls: "bg-amber-500/20 text-amber-400" },
  litige: { label: "Litige", cls: "bg-red-500/20 text-red-400" },
  annulee: { label: "Annul\u00e9e", cls: "bg-slate-500/20 text-slate-400" },
};

export default function AdminCommandes() {
  const [tab, setTab] = useState("toutes");
  const [search, setSearch] = useState("");
  const { addToast } = useToastStore();

  const filtered = ORDERS.filter(o => {
    if (tab !== "toutes" && o.status !== tab) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.service.toLowerCase().includes(search.toLowerCase()) && !o.freelance.toLowerCase().includes(search.toLowerCase()) && !o.client.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalAmount = ORDERS.reduce((s, o) => s + o.amount, 0);
  const tabs = [
    { key: "toutes", label: "Toutes" },
    { key: "en_attente", label: "En attente" },
    { key: "en_cours", label: "En cours" },
    { key: "livree", label: "Livr\u00e9es" },
    { key: "revision", label: "R\u00e9vision" },
    { key: "litige", label: "Litiges" },
    { key: "annulee", label: "Annul\u00e9es" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">shopping_bag</span>
        Gestion des Commandes
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Commandes totales", value: ORDERS.length, icon: "receipt_long" },
          { label: "En cours", value: ORDERS.filter(o => o.status === "en_cours").length, icon: "pending" },
          { label: "Litiges", value: ORDERS.filter(o => o.status === "litige").length, icon: "gavel" },
          { label: "Volume total", value: totalAmount, prefix: "\u20AC", icon: "payments" },
        ].map(s => (
          <div key={s.label} className="bg-neutral-dark rounded-xl p-5 border border-border-dark">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary">{s.icon}</span>
              <p className="text-xs text-slate-400">{s.label}</p>
            </div>
            <p className="text-2xl font-bold text-white">{s.prefix}{s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Table container */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
        {/* Tabs + search bar */}
        <div className="p-4 border-b border-border-dark flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex gap-1 flex-wrap">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                  tab === t.key
                    ? "bg-primary text-white"
                    : "text-slate-400 hover:bg-border-dark hover:text-white"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="pl-9 pr-4 py-2 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none focus:border-primary w-full sm:w-64 placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Orders table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-400 uppercase border-b border-border-dark">
                <th className="px-5 py-3 text-left font-semibold">ID</th>
                <th className="px-5 py-3 text-left font-semibold">Service</th>
                <th className="px-5 py-3 text-left font-semibold">Freelance</th>
                <th className="px-5 py-3 text-left font-semibold">Client</th>
                <th className="px-5 py-3 text-center font-semibold">Montant</th>
                <th className="px-5 py-3 text-center font-semibold">Statut</th>
                <th className="px-5 py-3 text-left font-semibold">Deadline</th>
                <th className="px-5 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-b border-border-dark/50 hover:bg-primary/5">
                  <td className="px-5 py-3 text-sm font-mono font-bold text-primary">{o.id}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-white max-w-[200px] truncate">{o.service}</td>
                  <td className="px-5 py-3 text-sm text-slate-400">{o.freelance}</td>
                  <td className="px-5 py-3 text-sm text-slate-400">{o.client}</td>
                  <td className="px-5 py-3 text-sm text-center font-bold text-white">&euro;{o.amount.toLocaleString()}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", STATUS_MAP[o.status]?.cls)}>
                      {STATUS_MAP[o.status]?.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-400">{new Date(o.deadline).toLocaleDateString("fr-FR")}</td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => addToast("info", `D\u00e9tails commande ${o.id}`)}
                        className="p-1 text-slate-400 hover:text-primary transition-colors"
                        title="D\u00e9tails"
                      >
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                      {o.status === "litige" && (
                        <button
                          onClick={() => addToast("info", "Ouverture litige")}
                          className="p-1 text-slate-400 hover:text-primary transition-colors"
                          title="G\u00e9rer litige"
                        >
                          <span className="material-symbols-outlined text-lg">gavel</span>
                        </button>
                      )}
                      {o.status === "en_cours" && (
                        <button
                          onClick={() => addToast("info", "Intervention manuelle")}
                          className="p-1 text-slate-400 hover:text-primary transition-colors"
                          title="Intervenir"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-slate-400 py-8">Aucune commande trouv&eacute;e</p>
        )}
      </div>
    </div>
  );
}
