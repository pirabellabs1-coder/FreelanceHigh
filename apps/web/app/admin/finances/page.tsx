"use client";

import { useState, useMemo } from "react";
import { useToastStore } from "@/store/dashboard";
import { usePlatformDataStore, computeAdminFinanceStats } from "@/store/platform-data";
import { cn } from "@/lib/utils";

const TYPE_MAP: Record<string, { label: string; cls: string; icon: string }> = {
  paiement: { label: "Paiement", cls: "text-emerald-400", icon: "payments" },
  commission: { label: "Commission", cls: "text-blue-400", icon: "account_balance" },
  retrait: { label: "Retrait", cls: "text-orange-400", icon: "account_balance_wallet" },
  remboursement: { label: "Remboursement", cls: "text-red-400", icon: "undo" },
  abonnement: { label: "Abonnement", cls: "text-purple-400", icon: "card_membership" },
};

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  complete: { label: "Complété", cls: "bg-emerald-500/20 text-emerald-400" },
  en_attente: { label: "En attente", cls: "bg-amber-500/20 text-amber-400" },
  echoue: { label: "Échoué", cls: "bg-red-500/20 text-red-400" },
  bloque: { label: "Bloqué", cls: "bg-red-500/20 text-red-400" },
};

export default function AdminFinances() {
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { addToast } = useToastStore();
  const state = usePlatformDataStore();
  const { blockTransaction, unblockTransaction } = state;

  const financeStats = useMemo(() => computeAdminFinanceStats(state), [state]);

  const transactions = useMemo(() => {
    let list = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date));
    if (typeFilter) list = list.filter(t => t.type === typeFilter);
    if (statusFilter) list = list.filter(t => t.status === statusFilter);
    return list.map(t => ({
      ...t,
      displayAmount: t.type === "retrait" || t.type === "remboursement" ? -t.amount : t.amount,
    }));
  }, [state, typeFilter, statusFilter]);

  function handleBlock(id: string) {
    blockTransaction(id);
    addToast("success", `Transaction ${id} bloquée`);
  }

  function handleUnblock(id: string) {
    unblockTransaction(id);
    addToast("success", `Transaction ${id} débloquée`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">payments</span>
            Finances
          </h1>
          <p className="text-slate-400 text-sm mt-1">Suivi des transactions et revenus de la plateforme.</p>
        </div>
        <button onClick={() => addToast("success", "Rapport financier exporté (CSV)")} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors">
          <span className="material-symbols-outlined text-sm">download</span>
          Exporter
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Revenus plateforme", value: `€${financeStats.platformRevenue.toLocaleString()}`, icon: "trending_up", color: "text-emerald-400", bgIcon: "bg-emerald-500/20", sub: "Commissions cumulées" },
          { label: "Fonds en escrow", value: `€${financeStats.escrowFunds.toLocaleString()}`, icon: "lock", color: "text-blue-400", bgIcon: "bg-blue-500/20", sub: "En attente de libération" },
          { label: "Retraits en attente", value: `€${financeStats.pendingWithdrawals.toLocaleString()}`, icon: "hourglass_top", color: "text-amber-400", bgIcon: "bg-amber-500/20", sub: "À traiter" },
          { label: "Abonnements", value: `€${financeStats.subscriptionRevenue.toLocaleString()}`, icon: "card_membership", color: "text-purple-400", bgIcon: "bg-purple-500/20", sub: "Revenus récurrents" },
        ].map(s => (
          <div key={s.label} className="bg-neutral-dark rounded-xl p-5 border border-border-dark">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", s.bgIcon)}>
              <span className={cn("material-symbols-outlined", s.color)}>{s.icon}</span>
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            <p className="text-[10px] text-slate-600 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Extra metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-neutral-dark rounded-xl p-4 border border-border-dark">
          <p className="text-sm font-bold text-white">€{financeStats.totalPayments.toLocaleString()}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">Total paiements</p>
        </div>
        <div className="bg-neutral-dark rounded-xl p-4 border border-border-dark">
          <p className="text-sm font-bold text-red-400">€{financeStats.totalRefunds.toLocaleString()}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">Remboursements</p>
        </div>
        <div className="bg-neutral-dark rounded-xl p-4 border border-border-dark">
          <p className="text-sm font-bold text-white">{state.transactions.length}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">Total transactions</p>
        </div>
        <div className="bg-neutral-dark rounded-xl p-4 border border-border-dark">
          <p className="text-sm font-bold text-white">{state.transactions.filter(t => t.status === "bloque").length}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">Bloquées</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-3 flex-wrap">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border-dark bg-neutral-dark text-sm text-white outline-none cursor-pointer focus:ring-2 focus:ring-primary/30">
          <option value="">Tous les types</option>
          <option value="paiement">Paiement</option>
          <option value="commission">Commission</option>
          <option value="retrait">Retrait</option>
          <option value="remboursement">Remboursement</option>
          <option value="abonnement">Abonnement</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border border-border-dark bg-neutral-dark text-sm text-white outline-none cursor-pointer focus:ring-2 focus:ring-primary/30">
          <option value="">Tous les statuts</option>
          <option value="complete">Complété</option>
          <option value="en_attente">En attente</option>
          <option value="bloque">Bloqué</option>
          <option value="echoue">Échoué</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
        <div className="p-5 border-b border-border-dark flex items-center justify-between">
          <h2 className="font-bold text-white">Transactions ({transactions.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-dark">
                <th className="px-5 py-3 text-left text-[10px] text-slate-500 uppercase tracking-wider font-semibold">ID</th>
                <th className="px-5 py-3 text-left text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Description</th>
                <th className="px-5 py-3 text-left text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Utilisateur</th>
                <th className="px-5 py-3 text-left text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Type</th>
                <th className="px-5 py-3 text-left text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Méthode</th>
                <th className="px-5 py-3 text-left text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Date</th>
                <th className="px-5 py-3 text-right text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Montant</th>
                <th className="px-5 py-3 text-center text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Statut</th>
                <th className="px-5 py-3 text-center text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id} className="border-b border-border-dark/50 hover:bg-background-dark/30 transition-colors">
                  <td className="px-5 py-3 text-xs font-mono text-slate-500">{t.id}</td>
                  <td className="px-5 py-3 text-sm text-white max-w-[200px] truncate">{t.description || `${t.type} ${t.orderId || ""}`}</td>
                  <td className="px-5 py-3 text-sm text-slate-300">{t.userName || t.userId}</td>
                  <td className="px-5 py-3">
                    <span className={cn("text-xs font-semibold flex items-center gap-1", TYPE_MAP[t.type]?.cls)}>
                      <span className="material-symbols-outlined text-sm">{TYPE_MAP[t.type]?.icon}</span>
                      {TYPE_MAP[t.type]?.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-400">{t.method ?? "—"}</td>
                  <td className="px-5 py-3 text-sm text-slate-400">{new Date(t.date).toLocaleDateString("fr-FR")}</td>
                  <td className={cn("px-5 py-3 text-sm font-bold text-right", t.displayAmount > 0 ? "text-emerald-400" : "text-red-400")}>
                    {t.displayAmount > 0 ? "+" : ""}€{Math.abs(t.displayAmount).toLocaleString("fr-FR")}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", STATUS_MAP[t.status]?.cls)}>
                      {STATUS_MAP[t.status]?.label}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-center gap-1">
                      {t.status === "en_attente" && (
                        <button onClick={() => handleBlock(t.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Bloquer">
                          <span className="material-symbols-outlined text-lg">block</span>
                        </button>
                      )}
                      {t.status === "bloque" && (
                        <button onClick={() => handleUnblock(t.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors" title="Débloquer">
                          <span className="material-symbols-outlined text-lg">lock_open</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
