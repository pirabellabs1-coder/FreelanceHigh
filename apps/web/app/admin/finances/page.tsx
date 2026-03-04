"use client";

import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const TRANSACTIONS = [
  { id: "TX-001", description: "Paiement CMD-342", type: "paiement", amount: 450, method: "Carte Visa", date: "2026-03-03", status: "complete" },
  { id: "TX-002", description: "Commission 15% CMD-342", type: "commission", amount: 67.5, method: "-", date: "2026-03-03", status: "complete" },
  { id: "TX-003", description: "Retrait Amadou D.", type: "retrait", amount: -1500, method: "Wave", date: "2026-03-02", status: "en_attente" },
  { id: "TX-004", description: "Paiement CMD-340", type: "paiement", amount: 800, method: "Orange Money", date: "2026-03-01", status: "complete" },
  { id: "TX-005", description: "Remboursement CMD-335", type: "remboursement", amount: -200, method: "Carte Visa", date: "2026-02-28", status: "complete" },
  { id: "TX-006", description: "Paiement CMD-338", type: "paiement", amount: 500, method: "PayPal", date: "2026-02-28", status: "escrow" },
  { id: "TX-007", description: "Commission 10% CMD-340", type: "commission", amount: 80, method: "-", date: "2026-03-01", status: "complete" },
  { id: "TX-008", description: "Retrait Fatou S.", type: "retrait", amount: -2000, method: "Virement SEPA", date: "2026-02-27", status: "complete" },
];

const TYPE_MAP: Record<string, { label: string; cls: string; icon: string }> = {
  paiement: { label: "Paiement", cls: "text-emerald-400", icon: "payments" },
  commission: { label: "Commission", cls: "text-blue-400", icon: "account_balance" },
  retrait: { label: "Retrait", cls: "text-orange-400", icon: "account_balance_wallet" },
  remboursement: { label: "Remboursement", cls: "text-red-400", icon: "undo" },
};

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  complete: { label: "Compl\u00e9t\u00e9", cls: "bg-emerald-500/20 text-emerald-400" },
  en_attente: { label: "En attente", cls: "bg-amber-500/20 text-amber-400" },
  escrow: { label: "Escrow", cls: "bg-blue-500/20 text-blue-400" },
};

export default function AdminFinances() {
  const { addToast } = useToastStore();

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
        <button
          onClick={() => addToast("success", "Rapport financier export\u00e9")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          Exporter
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Revenus plateforme", value: "\u20ac14 520", icon: "trending_up", color: "text-emerald-400", bgIcon: "bg-emerald-500/20" },
          { label: "Fonds en escrow", value: "\u20ac8 500", icon: "lock", color: "text-blue-400", bgIcon: "bg-blue-500/20" },
          { label: "Retraits en attente", value: "\u20ac3 500", icon: "hourglass_top", color: "text-amber-400", bgIcon: "bg-amber-500/20" },
          { label: "Commissions ce mois", value: "\u20ac2 147", icon: "account_balance", color: "text-purple-400", bgIcon: "bg-purple-500/20" },
        ].map(s => (
          <div key={s.label} className="bg-neutral-dark rounded-xl p-5 border border-border-dark">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", s.bgIcon)}>
              <span className={cn("material-symbols-outlined", s.color)}>{s.icon}</span>
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tableau des transactions */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
        <div className="p-5 border-b border-border-dark flex items-center justify-between">
          <h2 className="font-bold text-white">Transactions</h2>
          <button
            onClick={() => addToast("success", "Export CSV g\u00e9n\u00e9r\u00e9")}
            className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-dark">
                <th className="px-5 py-3 text-left text-[10px] text-slate-500 uppercase tracking-wider font-semibold">ID</th>
                <th className="px-5 py-3 text-left text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Description</th>
                <th className="px-5 py-3 text-left text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Type</th>
                <th className="px-5 py-3 text-left text-[10px] text-slate-500 uppercase tracking-wider font-semibold">M\u00e9thode</th>
                <th className="px-5 py-3 text-left text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Date</th>
                <th className="px-5 py-3 text-right text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Montant</th>
                <th className="px-5 py-3 text-center text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map(t => (
                <tr key={t.id} className="border-b border-border-dark/50 hover:bg-background-dark/30 transition-colors">
                  <td className="px-5 py-3 text-xs font-mono text-slate-500">{t.id}</td>
                  <td className="px-5 py-3 text-sm text-white">{t.description}</td>
                  <td className="px-5 py-3">
                    <span className={cn("text-xs font-semibold flex items-center gap-1", TYPE_MAP[t.type]?.cls)}>
                      <span className="material-symbols-outlined text-sm">{TYPE_MAP[t.type]?.icon}</span>
                      {TYPE_MAP[t.type]?.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-400">{t.method}</td>
                  <td className="px-5 py-3 text-sm text-slate-400">{new Date(t.date).toLocaleDateString("fr-FR")}</td>
                  <td className={cn("px-5 py-3 text-sm font-bold text-right", t.amount > 0 ? "text-emerald-400" : "text-red-400")}>
                    {t.amount > 0 ? "+" : ""}&euro;{Math.abs(t.amount).toLocaleString("fr-FR")}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", STATUS_MAP[t.status]?.cls)}>
                      {STATUS_MAP[t.status]?.label}
                    </span>
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
