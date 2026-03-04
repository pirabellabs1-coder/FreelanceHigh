"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const CURRENCIES = [
  { code: "FCFA", symbol: "FCFA", label: "Franc CFA" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "USD", symbol: "$", label: "US Dollar" },
];

const PAYMENT_METHODS = [
  { id: "mobile", icon: "smartphone", label: "Mobile Money", description: "Orange Money, MTN MoMo, Wave (Sénégal, Côte d'Ivoire...)", active: true },
  { id: "card", icon: "credit_card", label: "Carte Bancaire", description: "Visa, Mastercard, American Express via Stripe", active: false },
  { id: "bank", icon: "account_balance", label: "Virement Bancaire", description: "SEPA, virement international", active: false },
];

const TRANSACTIONS = [
  { id: "TXN-4201", date: "2026-03-01", freelance: "Moussa Diop", service: "Dashboard React", amount: 463500, currency: "FCFA", amountEur: 706.60, status: "complete", method: "mobile" },
  { id: "TXN-4198", date: "2026-02-27", freelance: "Fatou Seck", service: "Design UI/UX Mobile", amount: 350, currency: "EUR", amountEur: 350, status: "complete", method: "card" },
  { id: "TXN-4195", date: "2026-02-22", freelance: "Kofi Asante", service: "Campagne Google Ads", amount: 250, currency: "EUR", amountEur: 250, status: "pending", method: "card" },
  { id: "TXN-4190", date: "2026-02-18", freelance: "Ahmed Sy", service: "Chatbot IA", amount: 700, currency: "EUR", amountEur: 700, status: "complete", method: "mobile" },
  { id: "TXN-4185", date: "2026-02-10", freelance: "Paul Kouadio", service: "Landing page WordPress", amount: 150, currency: "EUR", amountEur: 150, status: "refund", method: "card" },
];

const SAVED_METHODS = [
  { id: "1", type: "mobile", icon: "smartphone", label: "Orange Money", detail: "+221 77 ••• •• 67", default: true },
  { id: "2", type: "card", icon: "credit_card", label: "Visa •••• 4242", detail: "Expire 12/28", default: false },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  complete: { label: "Complété", cls: "bg-primary/20 text-primary" },
  pending: { label: "En attente", cls: "bg-amber-500/20 text-amber-400" },
  refund: { label: "Remboursé", cls: "bg-red-500/20 text-red-400" },
};

export default function ClientPayments() {
  const [currency, setCurrency] = useState("EUR");
  const [activeTab, setActiveTab] = useState<"overview" | "methods" | "invoices">("overview");
  const [selectedMethod, setSelectedMethod] = useState("mobile");
  const { addToast } = useToastStore();

  const totalSpent = 2156.60;
  const pending = 250;
  const credits = 45;

  const TABS = [
    { key: "overview", label: "Vue d\u2019ensemble", icon: "dashboard" },
    { key: "methods", label: "Méthodes de paiement", icon: "payments" },
    { key: "invoices", label: "Factures & Historique", icon: "receipt_long" },
  ] as const;

  function formatAmount(eur: number) {
    if (currency === "FCFA") return `${Math.round(eur * 655.957).toLocaleString("fr-FR")} FCFA`;
    if (currency === "USD") return `$${(eur * 1.08).toFixed(2)}`;
    return `${eur.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Paiements & Facturation</h1>
          <p className="text-slate-400 text-sm mt-1">Gérez vos méthodes de paiement, consultez vos transactions et téléchargez vos factures.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Devise :</span>
          <div className="flex bg-neutral-dark rounded-lg border border-border-dark p-0.5">
            {CURRENCIES.map(c => (
              <button
                key={c.code}
                onClick={() => setCurrency(c.code)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-bold transition-all",
                  currency === c.code ? "bg-primary text-background-dark shadow" : "text-slate-400 hover:text-white"
                )}
              >
                {c.code}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total dépensé</p>
          </div>
          <p className="text-2xl font-black text-white">{formatAmount(totalSpent)}</p>
          {currency === "FCFA" && <p className="text-xs text-slate-500 mt-1">≈ {totalSpent.toFixed(2)} EUR</p>}
        </div>
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-400">schedule</span>
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">En attente</p>
          </div>
          <p className="text-2xl font-black text-amber-400">{formatAmount(pending)}</p>
        </div>
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">redeem</span>
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Crédits FreelanceHigh</p>
          </div>
          <p className="text-2xl font-black text-white">{formatAmount(credits)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-dark rounded-xl p-1 border border-border-dark">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex-1 justify-center",
              activeTab === t.key ? "bg-primary text-background-dark shadow" : "text-slate-400 hover:text-white"
            )}
          >
            <span className="material-symbols-outlined text-lg">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Recent Transactions */}
          <div className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
            <div className="px-5 py-4 border-b border-border-dark flex items-center justify-between">
              <h2 className="font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">swap_vert</span>
                Transactions récentes
              </h2>
              <button onClick={() => setActiveTab("invoices")} className="text-sm text-primary font-semibold hover:underline">Tout voir</button>
            </div>
            <div className="divide-y divide-border-dark">
              {TRANSACTIONS.slice(0, 4).map(tx => (
                <div key={tx.id} className="px-5 py-4 flex items-center gap-4 hover:bg-background-dark/30 transition-colors">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", tx.method === "mobile" ? "bg-primary/10" : "bg-blue-500/10")}>
                    <span className={cn("material-symbols-outlined", tx.method === "mobile" ? "text-primary" : "text-blue-400")}>{tx.method === "mobile" ? "smartphone" : "credit_card"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{tx.service}</p>
                    <p className="text-xs text-slate-500">{tx.freelance} · {new Date(tx.date).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{formatAmount(tx.amountEur)}</p>
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", STATUS_MAP[tx.status]?.cls)}>{STATUS_MAP[tx.status]?.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setActiveTab("methods")}
              className="bg-neutral-dark rounded-xl border border-border-dark p-5 text-left hover:border-primary/40 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-xl">add_card</span>
              </div>
              <p className="font-bold text-white">Ajouter une méthode</p>
              <p className="text-xs text-slate-500 mt-1">Carte bancaire, Mobile Money ou virement</p>
            </button>
            <button
              onClick={() => addToast("success", "Rapport de dépenses en cours de génération...")}
              className="bg-neutral-dark rounded-xl border border-border-dark p-5 text-left hover:border-primary/40 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-xl">download</span>
              </div>
              <p className="font-bold text-white">Exporter le rapport</p>
              <p className="text-xs text-slate-500 mt-1">Téléchargez vos dépenses en CSV ou PDF</p>
            </button>
          </div>

          {/* Exchange Rates */}
          <div className="bg-primary/5 rounded-xl border border-primary/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary text-lg">currency_exchange</span>
              <p className="font-bold text-white text-sm">Taux de change</p>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px]">sync</span>
                Actualisé il y a 5 min
              </span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <span className="text-slate-400">1 EUR = <span className="text-white font-bold">655,96 FCFA</span></span>
              <span className="text-slate-400">1 EUR = <span className="text-white font-bold">1,08 USD</span></span>
              <span className="text-slate-400">1 EUR = <span className="text-white font-bold">0,85 GBP</span></span>
              <span className="text-slate-400">1 EUR = <span className="text-white font-bold">10,95 MAD</span></span>
            </div>
          </div>
        </div>
      )}

      {/* Methods Tab */}
      {activeTab === "methods" && (
        <div className="space-y-6">
          {/* Saved Methods */}
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">credit_card</span>
              Méthodes enregistrées
            </h2>
            <div className="space-y-3">
              {SAVED_METHODS.map(m => (
                <div key={m.id} className="flex items-center gap-4 p-4 bg-neutral-dark rounded-xl border border-border-dark hover:border-primary/30 transition-colors">
                  <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", m.type === "mobile" ? "bg-primary/10" : "bg-blue-500/10")}>
                    <span className={cn("material-symbols-outlined", m.type === "mobile" ? "text-primary" : "text-blue-400")}>{m.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{m.label}</p>
                    <p className="text-xs text-slate-500">{m.detail}</p>
                  </div>
                  {m.default && <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">Par défaut</span>}
                  <button className="text-slate-500 hover:text-red-400 transition-colors">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Method */}
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">add_card</span>
              Ajouter une méthode
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PAYMENT_METHODS.map(pm => (
                <button
                  key={pm.id}
                  onClick={() => setSelectedMethod(pm.id)}
                  className={cn(
                    "p-5 rounded-xl border-2 text-left transition-all",
                    selectedMethod === pm.id
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-border-dark bg-neutral-dark hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">{pm.icon}</span>
                    </div>
                    {selectedMethod === pm.id && (
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    )}
                  </div>
                  <p className="font-bold text-white text-sm">{pm.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{pm.description}</p>
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="mt-4 bg-neutral-dark rounded-xl border border-border-dark p-5">
              <label className="block text-sm font-semibold text-white mb-2">
                {selectedMethod === "mobile" ? "Numéro de téléphone" : selectedMethod === "card" ? "Numéro de carte" : "IBAN"}
              </label>
              <input
                type="text"
                placeholder={selectedMethod === "mobile" ? "+221 77 123 45 67" : selectedMethod === "card" ? "4242 4242 4242 4242" : "SN08 SN0000000000000000000000"}
                className="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex items-center gap-2 mt-3 p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                <span className="material-symbols-outlined text-blue-400 text-lg">verified_user</span>
                <p className="text-xs text-slate-400">Vos informations de paiement sont cryptées et sécurisées par protocole SSL/TLS.</p>
              </div>
              <button
                onClick={() => addToast("success", "Méthode de paiement ajoutée")}
                className="mt-4 px-6 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all"
              >
                Enregistrer la méthode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === "invoices" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">receipt_long</span>
              Historique des transactions
            </h2>
            <button
              onClick={() => addToast("success", "Export en cours...")}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-dark border border-border-dark rounded-lg text-sm font-semibold text-white hover:bg-border-dark transition-colors"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              Exporter CSV
            </button>
          </div>

          <div className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-border-dark">
                  <th className="px-5 py-3 text-left font-semibold">Référence</th>
                  <th className="px-5 py-3 text-left font-semibold">Date</th>
                  <th className="px-5 py-3 text-left font-semibold">Freelance</th>
                  <th className="px-5 py-3 text-left font-semibold">Service</th>
                  <th className="px-5 py-3 text-right font-semibold">Montant</th>
                  <th className="px-5 py-3 text-center font-semibold">Statut</th>
                  <th className="px-5 py-3 text-center font-semibold">Facture</th>
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map(tx => (
                  <tr key={tx.id} className="border-b border-border-dark/50 hover:bg-background-dark/30 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-mono text-primary font-semibold">{tx.id}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-400">{new Date(tx.date).toLocaleDateString("fr-FR")}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                          {tx.freelance.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-sm font-medium text-white">{tx.freelance}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-400">{tx.service}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-white text-right">{formatAmount(tx.amountEur)}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={cn("text-[10px] font-semibold px-2.5 py-1 rounded-full", STATUS_MAP[tx.status]?.cls)}>{STATUS_MAP[tx.status]?.label}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => addToast("success", `Facture ${tx.id} téléchargée`)}
                        className="p-1.5 text-slate-500 hover:text-primary transition-colors"
                        title="Télécharger PDF"
                      >
                        <span className="material-symbols-outlined text-lg">download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Info Note */}
          <p className="text-xs text-slate-500 text-center">
            Une facture PDF est automatiquement générée et envoyée à votre adresse email après chaque paiement validé.
          </p>
        </div>
      )}
    </div>
  );
}
