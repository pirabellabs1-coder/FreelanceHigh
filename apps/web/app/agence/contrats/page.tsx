"use client";

import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useToastStore } from "@/store/toast";
import { useAgencyStore } from "@/store/agency";
import type { ApiOrder } from "@/lib/api-client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Contract {
  id: string;
  title: string;
  type: "mission" | "prestation" | "nda";
  client: string;
  member: string;
  amount: number;
  status: "brouillon" | "envoye" | "signe" | "expire";
  createdAt: string;
  signedAt?: string;
  expiresAt: string;
  orderId?: string;
}

// ---------------------------------------------------------------------------
// Static config (UI templates, not demo data)
// ---------------------------------------------------------------------------

const TEMPLATES = [
  { type: "mission" as const, label: "Contrat de Mission", description: "Mission ponctuelle avec livrables d\u00e9finis, d\u00e9lais et conditions de paiement.", icon: "assignment" },
  { type: "prestation" as const, label: "Contrat de Prestation", description: "Prestation de services r\u00e9currente ou forfaitaire avec clauses de r\u00e9vision.", icon: "work" },
  { type: "nda" as const, label: "Accord de Confidentialit\u00e9 (NDA)", description: "Protection des informations confidentielles \u00e9chang\u00e9es entre les parties.", icon: "lock" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  brouillon: { label: "Brouillon", color: "bg-slate-500/10 text-slate-400 border-slate-500/20", icon: "edit_note" },
  envoye: { label: "Envoy\u00e9", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: "send" },
  signe: { label: "Sign\u00e9", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: "verified" },
  expire: { label: "Expir\u00e9", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: "event_busy" },
};

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  mission: { label: "Mission", color: "text-primary", icon: "assignment" },
  prestation: { label: "Prestation", color: "text-blue-400", icon: "work" },
  nda: { label: "NDA", color: "text-amber-400", icon: "lock" },
};

// ---------------------------------------------------------------------------
// Helpers — derive contracts from orders
// ---------------------------------------------------------------------------

function deriveContractStatus(order: ApiOrder): Contract["status"] {
  if (order.status === "termine") return "signe";
  if (order.status === "en_cours" || order.status === "livre") return "envoye";
  if (order.status === "annule") return "expire";
  return "brouillon";
}

function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function orderToContract(order: ApiOrder): Contract {
  const status = deriveContractStatus(order);
  return {
    id: `CTR-${order.id.slice(-4).toUpperCase()}`,
    title: order.serviceTitle,
    type: "mission",
    client: order.clientName,
    member: "",
    amount: order.amount,
    status,
    createdAt: order.createdAt.slice(0, 10),
    signedAt: status === "signe" && order.completedAt ? order.completedAt.slice(0, 10) : undefined,
    expiresAt: addMonths(order.createdAt, 3),
    orderId: order.id,
  };
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function AgenceContratsPage() {
  const addToast = useToastStore((s) => s.addToast);
  const { orders, members, syncAll, isLoading } = useAgencyStore();

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [detailContract, setDetailContract] = useState<Contract | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const memberNames = useMemo(() => members.map((m) => m.name), [members]);
  const defaultMember = memberNames[0] ?? "";

  const [newContract, setNewContract] = useState({
    title: "",
    type: "mission" as Contract["type"],
    client: "",
    member: defaultMember,
    amount: "",
  });

  // Sync member default when members load
  useEffect(() => {
    if (defaultMember) setNewContract((prev) => ({ ...prev, member: prev.member || defaultMember }));
  }, [defaultMember]);

  // Sync data on mount
  useEffect(() => { syncAll(); }, [syncAll]);

  // Derive contracts from orders that are active or completed
  const contracts = useMemo<Contract[]>(() => {
    const eligible = orders.filter((o) =>
      ["en_cours", "livre", "termine", "annule", "en_attente"].includes(o.status),
    );
    return eligible.map(orderToContract);
  }, [orders]);

  const filtered = useMemo(() => {
    let result = [...contracts];
    if (filterStatus !== "all") result = result.filter((c) => c.status === filterStatus);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) =>
        c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.client.toLowerCase().includes(q),
      );
    }
    return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [contracts, filterStatus, searchQuery]);

  const stats = useMemo(() => ({
    total: contracts.length,
    signes: contracts.filter((c) => c.status === "signe").length,
    enAttente: contracts.filter((c) => c.status === "envoye" || c.status === "brouillon").length,
    montantTotal: contracts.filter((c) => c.status === "signe").reduce((s, c) => s + c.amount, 0),
  }), [contracts]);

  function handleCreate() {
    if (!newContract.title.trim() || !newContract.client.trim()) return;
    addToast("success", `Contrat "${newContract.title}" cr\u00e9\u00e9 en brouillon`);
    setShowCreateModal(false);
    setNewContract({ title: "", type: "mission", client: "", member: defaultMember, amount: "" });
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">description</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">Contrats</h1>
            <p className="text-slate-400 mt-1">G\u00e9rez les contrats de l&apos;agence avec vos clients.</p>
          </div>
        </div>
        <button onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
          <span className="material-symbols-outlined text-lg">add</span>
          Nouveau contrat
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, icon: "description", color: "text-primary", bg: "bg-primary/10" },
          { label: "Sign\u00e9s", value: stats.signes, icon: "verified", color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "En attente", value: stats.enAttente, icon: "schedule", color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Montant engag\u00e9", value: `\u20ac${stats.montantTotal.toLocaleString("fr-FR")}`, icon: "payments", color: "text-blue-400", bg: "bg-blue-500/10" },
        ].map((stat) => (
          <div key={stat.label} className="bg-neutral-dark border border-border-dark rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-500 uppercase">{stat.label}</p>
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", stat.bg)}>
                <span className={cn("material-symbols-outlined text-lg", stat.color)}>{stat.icon}</span>
              </div>
            </div>
            <p className="text-2xl font-extrabold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Templates */}
      <div className="bg-neutral-dark border border-border-dark rounded-xl p-6">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">library_books</span>
          Templates de contrats
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TEMPLATES.map((tpl) => (
            <button key={tpl.type} onClick={() => { setNewContract((prev) => ({ ...prev, type: tpl.type })); setShowCreateModal(true); }}
              className="bg-neutral-dark border border-border-dark rounded-xl p-4 text-left hover:border-primary/30 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary">{tpl.icon}</span>
              </div>
              <p className="text-sm font-bold text-white mb-1">{tpl.label}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{tpl.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary">
          <option value="all">Tous les statuts</option>
          <option value="brouillon">Brouillons</option>
          <option value="envoye">Envoy\u00e9s</option>
          <option value="signe">Sign\u00e9s</option>
          <option value="expire">Expir\u00e9s</option>
        </select>
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par num\u00e9ro, titre ou client..."
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-dark border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" />
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-8 text-slate-400 gap-2">
          <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
          Chargement des contrats...
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <div className="bg-neutral-dark border border-border-dark rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-primary/5 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">R\u00e9f\u00e9rence</th>
                  <th className="px-6 py-4">Contrat</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Montant</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark">
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-500">
                    <span className="material-symbols-outlined text-4xl mb-2 block opacity-30">description</span>
                    Aucun contrat
                  </td></tr>
                )}
                {filtered.map((contract) => {
                  const sc = STATUS_CONFIG[contract.status];
                  const tc = TYPE_CONFIG[contract.type];
                  return (
                    <tr key={contract.id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4"><span className="font-mono text-sm font-bold text-primary">{contract.id}</span></td>
                      <td className="px-6 py-4 text-sm font-medium max-w-[220px] truncate">{contract.title}</td>
                      <td className="px-6 py-4">
                        <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", tc?.color)}>
                          <span className="material-symbols-outlined text-sm">{tc?.icon}</span>
                          {tc?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">{contract.client}</td>
                      <td className="px-6 py-4 text-sm font-bold">{contract.amount > 0 ? `\u20ac${(contract.amount ?? 0).toLocaleString("fr-FR")}` : "\u2014"}</td>
                      <td className="px-6 py-4">
                        <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border", sc?.color)}>
                          <span className="material-symbols-outlined text-xs">{sc?.icon}</span>
                          {sc?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => addToast("success", `Contrat ${contract.id} t\u00e9l\u00e9charg\u00e9 en PDF`)} title="T\u00e9l\u00e9charger PDF"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors">
                            <span className="material-symbols-outlined text-lg">download</span>
                          </button>
                          <button onClick={() => setDetailContract(contract)} title="Voir les d\u00e9tails"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors">
                            <span className="material-symbols-outlined text-lg">visibility</span>
                          </button>
                          {contract.status === "brouillon" && (
                            <button onClick={() => addToast("success", `Contrat ${contract.id} envoy\u00e9 au client`)} title="Envoyer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                              <span className="material-symbols-outlined text-lg">send</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailContract && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDetailContract(null)} />
          <div className="relative bg-neutral-dark border border-border-dark rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Contrat {detailContract.id}</h3>
              <button onClick={() => setDetailContract(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3">
              {[
                ["Titre", detailContract.title],
                ["Type", TYPE_CONFIG[detailContract.type]?.label],
                ["Client", detailContract.client],
                ["Cr\u00e9\u00e9 le", new Date(detailContract.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })],
                ["Expire le", new Date(detailContract.expiresAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })],
                ...(detailContract.signedAt ? [["Sign\u00e9 le", new Date(detailContract.signedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })]] : []),
                ...(detailContract.orderId ? [["Commande li\u00e9e", detailContract.orderId]] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-border-dark">
                  <span className="text-sm text-slate-500">{label}</span>
                  <span className="text-sm font-semibold">{value}</span>
                </div>
              ))}
              {detailContract.amount > 0 && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-500">Montant</span>
                  <span className="text-lg font-extrabold text-primary">{`\u20ac${(detailContract.amount ?? 0).toLocaleString("fr-FR")}`}</span>
                </div>
              )}
            </div>
            <button onClick={() => { addToast("success", `Contrat ${detailContract.id} t\u00e9l\u00e9charg\u00e9`); setDetailContract(null); }}
              className="w-full mt-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">download</span>
              T\u00e9l\u00e9charger PDF
            </button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-neutral-dark border border-border-dark rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add</span>
                Nouveau contrat
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Type de contrat</label>
                <div className="grid grid-cols-3 gap-2">
                  {TEMPLATES.map((tpl) => (
                    <button key={tpl.type} onClick={() => setNewContract((prev) => ({ ...prev, type: tpl.type }))}
                      className={cn("p-3 rounded-xl border text-center transition-all",
                        newContract.type === tpl.type ? "border-primary bg-primary/5" : "border-border-dark bg-neutral-dark hover:border-primary/30"
                      )}>
                      <span className={cn("material-symbols-outlined text-lg", newContract.type === tpl.type ? "text-primary" : "text-slate-400")}>{tpl.icon}</span>
                      <p className="text-xs font-semibold mt-1">{tpl.label}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Titre *</label>
                <input type="text" value={newContract.title} onChange={(e) => setNewContract((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex : D\u00e9veloppement API REST..." className="w-full px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Client *</label>
                <input type="text" value={newContract.client} onChange={(e) => setNewContract((prev) => ({ ...prev, client: e.target.value }))}
                  placeholder="Nom du client..." className="w-full px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Membre assign\u00e9</label>
                  {memberNames.length > 0 ? (
                    <select value={newContract.member} onChange={(e) => setNewContract((prev) => ({ ...prev, member: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary">
                      {memberNames.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={newContract.member} onChange={(e) => setNewContract((prev) => ({ ...prev, member: e.target.value }))}
                      placeholder="Nom du membre..." className="w-full px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Montant (\u20ac)</label>
                  <input type="number" value={newContract.amount} onChange={(e) => setNewContract((prev) => ({ ...prev, amount: e.target.value }))}
                    placeholder="0" className="w-full px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleCreate} disabled={!newContract.title.trim() || !newContract.client.trim()}
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">save</span>
                  Cr\u00e9er en brouillon
                </button>
                <button onClick={() => setShowCreateModal(false)}
                  className="px-4 py-3 border border-border-dark rounded-lg text-sm font-bold text-slate-400 hover:text-slate-100 transition-all">
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
