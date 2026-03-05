"use client";

import { useState } from "react";
import { usePlatformDataStore } from "@/store/platform-data";
import { cn } from "@/lib/utils";

const ALL_CURRENCIES = [
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "FCFA", symbol: "FCFA", label: "Franc CFA" },
  { code: "USD", symbol: "$", label: "Dollar US" },
  { code: "GBP", symbol: "£", label: "Livre Sterling" },
  { code: "MAD", symbol: "MAD", label: "Dirham marocain" },
];

const ALL_PAYMENT_METHODS = [
  { id: "Carte bancaire", icon: "credit_card", desc: "Visa, Mastercard via Stripe" },
  { id: "SEPA", icon: "account_balance", desc: "Virement SEPA" },
  { id: "PayPal", icon: "account_balance_wallet", desc: "PayPal" },
  { id: "Orange Money", icon: "smartphone", desc: "Orange Money (CinetPay)" },
  { id: "Wave", icon: "smartphone", desc: "Wave (CinetPay)" },
  { id: "MTN Mobile Money", icon: "smartphone", desc: "MTN MoMo (CinetPay)" },
  { id: "Flutterwave", icon: "currency_exchange", desc: "Flutterwave" },
  { id: "USDC / USDT", icon: "token", desc: "Stablecoins crypto" },
];

const EMAILS = [
  { key: "welcome", label: "Email de bienvenue" },
  { key: "order_confirmed", label: "Confirmation commande" },
  { key: "order_delivered", label: "Commande livrée" },
  { key: "revision_requested", label: "Révision demandée" },
  { key: "funds_released", label: "Fonds libérés" },
  { key: "dispute_opened", label: "Litige ouvert" },
  { key: "dispute_resolved", label: "Verdict litige" },
  { key: "kyc_approved", label: "KYC approuvé" },
  { key: "kyc_rejected", label: "KYC refusé" },
  { key: "new_message", label: "Nouveau message" },
  { key: "deadline_reminder", label: "Rappel deadline 24h" },
  { key: "password_reset", label: "Réinitialisation mot de passe" },
];

export default function AdminConfiguration() {
  const { config, updateConfig, updateCommissions, updatePlanConfig, toggleMaintenanceMode, setAnnouncementBanner } = usePlatformDataStore();
  const [tab, setTab] = useState("general");
  const [saved, setSaved] = useState("");

  function showSaved(label: string) {
    setSaved(label);
    setTimeout(() => setSaved(""), 2500);
  }

  // Toggle currency in the enabled list
  function toggleCurrency(code: string) {
    const list = config.enabledCurrencies.includes(code)
      ? config.enabledCurrencies.filter(c => c !== code)
      : [...config.enabledCurrencies, code];
    updateConfig({ enabledCurrencies: list });
    showSaved("Devise mise à jour");
  }

  // Toggle payment method in the enabled list
  function togglePayment(id: string) {
    const list = config.enabledPaymentMethods.includes(id)
      ? config.enabledPaymentMethods.filter(p => p !== id)
      : [...config.enabledPaymentMethods, id];
    updateConfig({ enabledPaymentMethods: list });
    showSaved("Méthode de paiement mise à jour");
  }

  const tabs = [
    { key: "general", label: "Général", icon: "settings" },
    { key: "commissions", label: "Commissions & Plans", icon: "payments" },
    { key: "devises", label: "Devises", icon: "euro" },
    { key: "paiements", label: "Paiements", icon: "credit_card" },
    { key: "emails", label: "Emails", icon: "mail" },
    { key: "maintenance", label: "Maintenance", icon: "build" },
    { key: "banniere", label: "Bannière", icon: "campaign" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">tune</span>
            Configuration Plateforme
          </h1>
          <p className="text-slate-400 text-sm mt-1">Paramètres globaux de FreelanceHigh. Toute modification est appliquée immédiatement.</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
            <span className="text-sm text-emerald-400 font-semibold">{saved}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
              tab === t.key ? "bg-primary text-white" : "bg-neutral-dark border border-border-dark text-slate-500 hover:text-primary"
            )}
          >
            <span className="material-symbols-outlined text-lg">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* General */}
      {tab === "general" && (
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-6 space-y-6">
          <h2 className="font-bold text-lg text-white">Paramètres généraux</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Nom du site</label>
              <input
                value={config.siteName}
                onChange={e => updateConfig({ siteName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500">Les modifications sont sauvegardées automatiquement dans le store global.</p>
        </div>
      )}

      {/* Commissions & Plans */}
      {tab === "commissions" && (
        <div className="space-y-6">
          {/* Commission rates */}
          <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
            <h2 className="font-bold text-lg text-white mb-4">Taux de commission par plan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(["gratuit", "pro", "business", "agence"] as const).map(plan => (
                <div key={plan} className="bg-background-dark/50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">{plan}</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={config.commissions[plan]}
                      onChange={e => {
                        updateCommissions({ ...config.commissions, [plan]: Number(e.target.value) });
                        showSaved("Commissions mises à jour");
                      }}
                      className="w-20 px-3 py-2 rounded-lg border border-border-dark bg-background-dark text-white text-sm text-center outline-none focus:border-primary"
                    />
                    <span className="text-sm text-slate-400">%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plans config */}
          <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
            <h2 className="font-bold text-lg text-white mb-4">Configuration des plans</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-border-dark">
                    <th className="px-3 py-2 text-left font-semibold">Plan</th>
                    <th className="px-3 py-2 text-center font-semibold">Prix/mois (€)</th>
                    <th className="px-3 py-2 text-center font-semibold">Prix/an (€)</th>
                    <th className="px-3 py-2 text-center font-semibold">Commission %</th>
                    <th className="px-3 py-2 text-center font-semibold">Services max</th>
                    <th className="px-3 py-2 text-center font-semibold">Candidatures/mois</th>
                    <th className="px-3 py-2 text-center font-semibold">Boosts/mois</th>
                    <th className="px-3 py-2 text-center font-semibold">Cert. IA</th>
                    <th className="px-3 py-2 text-center font-semibold">API</th>
                  </tr>
                </thead>
                <tbody>
                  {config.plans.map((plan, idx) => (
                    <tr key={plan.name} className="border-b border-border-dark/50">
                      <td className="px-3 py-3 text-sm font-bold text-white">{plan.name}</td>
                      <td className="px-3 py-3 text-center">
                        <input
                          type="number"
                          value={plan.price}
                          onChange={e => { updatePlanConfig(idx, { price: Number(e.target.value) }); showSaved("Plan mis à jour"); }}
                          className="w-16 px-2 py-1 rounded border border-border-dark bg-background-dark text-white text-sm text-center outline-none focus:border-primary"
                        />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <input
                          type="number"
                          value={plan.annualPrice}
                          onChange={e => { updatePlanConfig(idx, { annualPrice: Number(e.target.value) }); showSaved("Plan mis à jour"); }}
                          className="w-16 px-2 py-1 rounded border border-border-dark bg-background-dark text-white text-sm text-center outline-none focus:border-primary"
                        />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <input
                          type="number"
                          value={plan.commission}
                          onChange={e => { updatePlanConfig(idx, { commission: Number(e.target.value) }); showSaved("Plan mis à jour"); }}
                          className="w-16 px-2 py-1 rounded border border-border-dark bg-background-dark text-white text-sm text-center outline-none focus:border-primary"
                        />
                      </td>
                      <td className="px-3 py-3 text-center text-sm text-slate-300">{plan.maxServices ?? "∞"}</td>
                      <td className="px-3 py-3 text-center text-sm text-slate-300">{plan.maxCandidatures ?? "∞"}</td>
                      <td className="px-3 py-3 text-center">
                        <input
                          type="number"
                          value={plan.boostPerMonth}
                          onChange={e => { updatePlanConfig(idx, { boostPerMonth: Number(e.target.value) }); showSaved("Plan mis à jour"); }}
                          className="w-16 px-2 py-1 rounded border border-border-dark bg-background-dark text-white text-sm text-center outline-none focus:border-primary"
                        />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => { updatePlanConfig(idx, { certificationIA: !plan.certificationIA }); showSaved("Plan mis à jour"); }}
                          className={cn("w-6 h-6 rounded-md flex items-center justify-center transition-colors", plan.certificationIA ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-500")}
                        >
                          <span className="material-symbols-outlined text-sm">{plan.certificationIA ? "check" : "close"}</span>
                        </button>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => { updatePlanConfig(idx, { apiAccess: !plan.apiAccess }); showSaved("Plan mis à jour"); }}
                          className={cn("w-6 h-6 rounded-md flex items-center justify-center transition-colors", plan.apiAccess ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-500")}
                        >
                          <span className="material-symbols-outlined text-sm">{plan.apiAccess ? "check" : "close"}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Currencies */}
      {tab === "devises" && (
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
          <h2 className="font-bold text-lg text-white mb-4">Devises</h2>
          <p className="text-sm text-slate-400 mb-4">Activez ou désactivez les devises disponibles sur la plateforme.</p>
          <div className="space-y-3">
            {ALL_CURRENCIES.map(c => {
              const active = config.enabledCurrencies.includes(c.code);
              return (
                <div key={c.code} className="flex items-center justify-between p-4 rounded-lg border border-border-dark hover:border-border-dark/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-white w-12">{c.symbol}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{c.code}</p>
                      <p className="text-xs text-slate-500">{c.label}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleCurrency(c.code)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-semibold transition-colors",
                      active ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" : "bg-slate-500/20 text-slate-400 hover:bg-slate-500/30"
                    )}
                  >
                    {active ? "Actif" : "Inactif"}
                  </button>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 mt-4">Devises actives : {config.enabledCurrencies.join(", ")}</p>
        </div>
      )}

      {/* Payment methods */}
      {tab === "paiements" && (
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
          <h2 className="font-bold text-lg text-white mb-4">Méthodes de paiement</h2>
          <p className="text-sm text-slate-400 mb-4">Activez les méthodes de paiement disponibles pour les utilisateurs.</p>
          <div className="space-y-3">
            {ALL_PAYMENT_METHODS.map(pm => {
              const active = config.enabledPaymentMethods.includes(pm.id);
              return (
                <div key={pm.id} className="flex items-center justify-between p-4 rounded-lg border border-border-dark hover:border-border-dark/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={cn("material-symbols-outlined text-xl", active ? "text-primary" : "text-slate-500")}>{pm.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{pm.id}</p>
                      <p className="text-xs text-slate-500">{pm.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePayment(pm.id)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-semibold transition-colors",
                      active ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" : "bg-slate-500/20 text-slate-400 hover:bg-slate-500/30"
                    )}
                  >
                    {active ? "Actif" : "Inactif"}
                  </button>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 mt-4">Méthodes actives : {config.enabledPaymentMethods.length}/{ALL_PAYMENT_METHODS.length}</p>
        </div>
      )}

      {/* Emails */}
      {tab === "emails" && (
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-white">Emails transactionnels</h2>
            <p className="text-xs text-slate-500">{EMAILS.length} templates configurés</p>
          </div>
          <p className="text-sm text-slate-400 mb-4">Templates React Email dans <code className="text-primary text-xs">packages/ui/emails/</code>. Configuration des envois via Resend.</p>
          <div className="space-y-2">
            {EMAILS.map(e => (
              <div key={e.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-primary">mail</span>
                  <span className="text-sm text-slate-300">{e.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-mono">{e.key}</span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">Actif</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Maintenance */}
      {tab === "maintenance" && (
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-6 space-y-6">
          <h2 className="font-bold text-lg text-white">Mode maintenance</h2>

          <div className={cn("flex items-center gap-4 p-4 rounded-lg border-2 border-dashed transition-colors", config.maintenanceMode ? "border-red-500/30 bg-red-500/5" : "border-border-dark")}>
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                onClick={() => { toggleMaintenanceMode(); showSaved(config.maintenanceMode ? "Maintenance désactivée" : "Maintenance activée"); }}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  config.maintenanceMode ? "bg-red-500" : "bg-slate-600"
                )}
              >
                <div className={cn("w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform", config.maintenanceMode ? "translate-x-6" : "translate-x-0.5")} />
              </button>
              <div>
                <p className="font-semibold text-white">Mode maintenance</p>
                <p className="text-xs text-slate-400">Bloque l&apos;accès pour tous les utilisateurs (sauf admins)</p>
              </div>
            </label>
          </div>

          {config.maintenanceMode && (
            <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/10">
              <p className="text-sm font-semibold text-red-400 flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-lg">warning</span>
                Le mode maintenance est ACTIF — la plateforme est inaccessible !
              </p>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Message de maintenance</label>
              <textarea
                value={config.maintenanceMessage}
                onChange={e => updateConfig({ maintenanceMessage: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none resize-none focus:border-primary"
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <span className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold", config.maintenanceMode ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400")}>
              <span className={cn("w-2 h-2 rounded-full", config.maintenanceMode ? "bg-red-400" : "bg-emerald-400 animate-pulse")} />
              {config.maintenanceMode ? "Plateforme hors ligne" : "Plateforme en ligne"}
            </span>
          </div>
        </div>
      )}

      {/* Announcement banner */}
      {tab === "banniere" && (
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-6 space-y-6">
          <h2 className="font-bold text-lg text-white">Bannière d&apos;annonce</h2>
          <p className="text-sm text-slate-400">Affiche une bannière en haut de la plateforme visible par tous les utilisateurs.</p>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Texte de la bannière</label>
            <textarea
              value={config.announcementBanner}
              onChange={e => setAnnouncementBanner(e.target.value)}
              rows={3}
              placeholder="Laissez vide pour masquer la bannière..."
              className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none resize-none focus:border-primary placeholder:text-slate-500"
            />
          </div>

          {config.announcementBanner && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Aperçu</p>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary font-semibold text-center">
                {config.announcementBanner}
              </div>
            </div>
          )}

          {config.announcementBanner && (
            <button
              onClick={() => { setAnnouncementBanner(""); showSaved("Bannière supprimée"); }}
              className="px-4 py-2 border border-red-500/20 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500/10 transition-colors"
            >
              Supprimer la bannière
            </button>
          )}
        </div>
      )}
    </div>
  );
}
