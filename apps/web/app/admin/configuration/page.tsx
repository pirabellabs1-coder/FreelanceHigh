"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

export default function AdminConfiguration() {
  const { addToast } = useToastStore();
  const [tab, setTab] = useState("general");
  const [maintenance, setMaintenance] = useState(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState("La plateforme est en maintenance. Nous serons de retour sous peu.");
  const [config, setConfig] = useState({
    siteName: "FreelanceHigh",
    slogan: "La plateforme freelance qui eleve votre carriere au plus haut niveau",
    contactEmail: "contact@freelancehigh.com",
    supportEmail: "support@freelancehigh.com",
    defaultCurrency: "EUR",
    defaultLang: "fr",
    minOrderAmount: 5,
    maxFileSize: 50,
    autoApproveServices: false,
    requireKycForPublish: true,
    escrowHoldDays: 14,
    disputeDeadlineDays: 7,
  });

  const CURRENCIES = [
    { code: "EUR", symbol: "\u20AC", active: true },
    { code: "FCFA", symbol: "FCFA", active: true },
    { code: "USD", symbol: "$", active: true },
    { code: "GBP", symbol: "\u00A3", active: true },
    { code: "MAD", symbol: "MAD", active: false },
  ];

  const LANGS = [
    { code: "fr", label: "Francais", active: true },
    { code: "en", label: "English", active: false },
    { code: "ar", label: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629", active: false },
    { code: "es", label: "Espanol", active: false },
    { code: "pt", label: "Portugues", active: false },
  ];

  const PAYMENT_METHODS = [
    { id: "stripe", name: "Stripe (Cartes, SEPA)", icon: "credit_card", active: true },
    { id: "cinetpay", name: "CinetPay (Mobile Money)", icon: "smartphone", active: true },
    { id: "paypal", name: "PayPal", icon: "account_balance_wallet", active: false },
    { id: "flutterwave", name: "Flutterwave", icon: "currency_exchange", active: false },
    { id: "crypto", name: "USDC / USDT", icon: "token", active: false },
  ];

  const EMAILS = [
    { key: "welcome", label: "Email de bienvenue", active: true },
    { key: "order_confirmed", label: "Confirmation commande", active: true },
    { key: "order_delivered", label: "Commande livree", active: true },
    { key: "revision_requested", label: "Revision demandee", active: true },
    { key: "funds_released", label: "Fonds liberes", active: true },
    { key: "dispute_opened", label: "Litige ouvert", active: true },
    { key: "dispute_resolved", label: "Verdict litige", active: true },
    { key: "kyc_approved", label: "KYC approuve", active: true },
    { key: "kyc_rejected", label: "KYC refuse", active: true },
    { key: "new_message", label: "Nouveau message", active: false },
    { key: "deadline_reminder", label: "Rappel deadline 24h", active: true },
    { key: "password_reset", label: "Reinitialisation mot de passe", active: true },
  ];

  const tabs = [
    { key: "general", label: "General", icon: "settings" },
    { key: "devises", label: "Devises & Langues", icon: "language" },
    { key: "paiements", label: "Paiements", icon: "payments" },
    { key: "emails", label: "Emails", icon: "mail" },
    { key: "maintenance", label: "Maintenance", icon: "build" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">tune</span>
        Configuration Plateforme
      </h1>

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
              tab === t.key
                ? "bg-primary text-white"
                : "bg-neutral-dark border border-border-dark text-slate-500 hover:text-primary"
            )}
          >
            <span className="material-symbols-outlined text-lg">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {tab === "general" && (
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-6 space-y-6">
          <h2 className="font-bold text-lg text-white">Parametres generaux</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Nom du site</label>
              <input value={config.siteName} onChange={e => setConfig(c => ({...c, siteName: e.target.value}))} className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Slogan</label>
              <input value={config.slogan} onChange={e => setConfig(c => ({...c, slogan: e.target.value}))} className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email de contact</label>
              <input value={config.contactEmail} onChange={e => setConfig(c => ({...c, contactEmail: e.target.value}))} className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email de support</label>
              <input value={config.supportEmail} onChange={e => setConfig(c => ({...c, supportEmail: e.target.value}))} className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Montant min. commande (&euro;)</label>
              <input type="number" value={config.minOrderAmount} onChange={e => setConfig(c => ({...c, minOrderAmount: Number(e.target.value)}))} className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Taille max. fichier (MB)</label>
              <input type="number" value={config.maxFileSize} onChange={e => setConfig(c => ({...c, maxFileSize: Number(e.target.value)}))} className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Duree escrow (jours)</label>
              <input type="number" value={config.escrowHoldDays} onChange={e => setConfig(c => ({...c, escrowHoldDays: Number(e.target.value)}))} className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Deadline litige (jours)</label>
              <input type="number" value={config.disputeDeadlineDays} onChange={e => setConfig(c => ({...c, disputeDeadlineDays: Number(e.target.value)}))} className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={config.autoApproveServices} onChange={e => setConfig(c => ({...c, autoApproveServices: e.target.checked}))} className="w-4 h-4 accent-red-500" />
              <span className="text-sm text-slate-300">Approuver automatiquement les nouveaux services</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={config.requireKycForPublish} onChange={e => setConfig(c => ({...c, requireKycForPublish: e.target.checked}))} className="w-4 h-4 accent-red-500" />
              <span className="text-sm text-slate-300">KYC niveau 3 requis pour publier un service</span>
            </label>
          </div>
          <button onClick={() => addToast("success", "Configuration sauvegardee")} className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors">Sauvegarder</button>
        </div>
      )}

      {tab === "devises" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
            <h2 className="font-bold text-lg text-white mb-4">Devises</h2>
            <div className="space-y-3">
              {CURRENCIES.map(c => (
                <div key={c.code} className="flex items-center justify-between p-3 rounded-lg border border-border-dark">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">{c.symbol}</span>
                    <span className="text-sm text-slate-400">{c.code}</span>
                  </div>
                  <button
                    onClick={() => addToast("info", `Devise ${c.code} ${c.active ? "desactivee" : "activee"}`)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold",
                      c.active ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400"
                    )}
                  >
                    {c.active ? "Actif" : "Inactif"}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Devise par defaut</label>
              <select
                value={config.defaultCurrency}
                onChange={e => setConfig(c => ({...c, defaultCurrency: e.target.value}))}
                className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none"
              >
                {CURRENCIES.filter(c => c.active).map(c => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
              </select>
            </div>
          </div>

          <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
            <h2 className="font-bold text-lg text-white mb-4">Langues</h2>
            <div className="space-y-3">
              {LANGS.map(l => (
                <div key={l.code} className="flex items-center justify-between p-3 rounded-lg border border-border-dark">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white uppercase">{l.code}</span>
                    <span className="text-sm text-slate-400">{l.label}</span>
                  </div>
                  <button
                    onClick={() => addToast("info", `Langue ${l.label} ${l.active ? "desactivee" : "activee"}`)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold",
                      l.active ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400"
                    )}
                  >
                    {l.active ? "Actif" : "Inactif"}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Langue par defaut</label>
              <select
                value={config.defaultLang}
                onChange={e => setConfig(c => ({...c, defaultLang: e.target.value}))}
                className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none"
              >
                {LANGS.filter(l => l.active).map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {tab === "paiements" && (
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
          <h2 className="font-bold text-lg text-white mb-4">Methodes de paiement</h2>
          <div className="space-y-3">
            {PAYMENT_METHODS.map(pm => (
              <div key={pm.id} className="flex items-center justify-between p-4 rounded-lg border border-border-dark">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">{pm.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{pm.name}</p>
                    <p className="text-xs text-slate-500">{pm.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => addToast("info", `Configuration ${pm.name}`)} className="text-xs text-primary font-semibold hover:underline">Configurer</button>
                  <button
                    onClick={() => addToast("info", `${pm.name} ${pm.active ? "desactive" : "active"}`)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold",
                      pm.active ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400"
                    )}
                  >
                    {pm.active ? "Actif" : "Inactif"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "emails" && (
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-white">Emails transactionnels</h2>
            <p className="text-xs text-slate-500">{EMAILS.filter(e => e.active).length}/{EMAILS.length} actifs</p>
          </div>
          <div className="space-y-2">
            {EMAILS.map(e => (
              <div key={e.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-red-500/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-slate-500">mail</span>
                  <span className="text-sm text-slate-300">{e.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => addToast("info", `Edition template "${e.label}"`)} className="text-xs text-primary font-semibold hover:underline">Editer</button>
                  <button
                    onClick={() => addToast("info", `Email ${e.active ? "desactive" : "active"}`)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold",
                      e.active ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400"
                    )}
                  >
                    {e.active ? "Actif" : "Inactif"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "maintenance" && (
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-6 space-y-6">
          <h2 className="font-bold text-lg text-white">Mode maintenance</h2>
          <div className="flex items-center gap-4 p-4 rounded-lg border-2 border-dashed border-border-dark">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={maintenance} onChange={e => setMaintenance(e.target.checked)} className="w-5 h-5 accent-red-500" />
              <div>
                <p className="font-semibold text-white">Activer le mode maintenance</p>
                <p className="text-xs text-slate-400">Bloque l&apos;acces a la plateforme pour tous les utilisateurs (sauf admins)</p>
              </div>
            </label>
          </div>
          {maintenance && (
            <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/10">
              <p className="text-sm font-semibold text-red-400 flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-lg">warning</span>
                Le mode maintenance est ACTIF
              </p>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Message de maintenance</label>
              <textarea
                value={maintenanceMsg}
                onChange={e => setMaintenanceMsg(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none resize-none"
              />
            </div>
          )}
          <button onClick={() => addToast("success", maintenance ? "Mode maintenance active" : "Mode maintenance desactive")} className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors">Sauvegarder</button>
        </div>
      )}
    </div>
  );
}
