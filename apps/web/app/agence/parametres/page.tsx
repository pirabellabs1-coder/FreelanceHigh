"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { key: "agence", label: "Informations", icon: "business" },
  { key: "roles", label: "Rôles & Permissions", icon: "shield" },
  { key: "plan", label: "Abonnement", icon: "loyalty" },
  { key: "paiements", label: "Paiements", icon: "credit_card" },
  { key: "notifications", label: "Notifications", icon: "notifications" },
  { key: "danger", label: "Zone danger", icon: "warning" },
];

const PERMISSIONS = [
  "Voir projets",
  "Créer projets",
  "Gérer équipe",
  "Voir finances",
  "Retirer fonds",
  "Modifier paramètres",
  "Supprimer contenu",
];

const ROLE_DEFAULTS: Record<string, boolean[]> = {
  Admin: [true, true, true, true, true, true, true],
  Manager: [true, true, true, true, false, false, false],
  Membre: [true, true, false, false, false, false, false],
  Commercial: [true, false, false, true, false, false, false],
};

const PLAN_FEATURES = [
  "Membres : jusqu'à 20",
  "Commission : 8%",
  "Services actifs : illimité",
  "Boosts publicitaires : 10/mois",
  "Certification IA",
  "Clés API & Webhooks",
  "Stockage ressources : 50 GB",
  "Support prioritaire",
];

export default function AgenceParametres() {
  const [section, setSection] = useState("agence");
  const { addToast } = useToastStore();
  const [agency, setAgency] = useState({
    name: "TechCorp Agency",
    description: "Agence digitale spécialisée en développement web et mobile pour l'Afrique francophone.",
    sector: "Technologie",
    website: "https://techcorp.sn",
    country: "Sénégal",
    siret: "",
  });
  const [notifs, setNotifs] = useState([
    { id: "1", label: "Nouvelle commande", email: true, push: true, sms: false },
    { id: "2", label: "Membre rejoint l'agence", email: true, push: false, sms: false },
    { id: "3", label: "Paiement reçu", email: true, push: true, sms: true },
    { id: "4", label: "Litige ouvert", email: true, push: true, sms: true },
    { id: "5", label: "Rapport hebdomadaire", email: true, push: false, sms: false },
    { id: "6", label: "Délai de livraison proche", email: true, push: true, sms: false },
    { id: "7", label: "Nouveau message client", email: false, push: true, sms: false },
  ]);
  const [permissions, setPermissions] = useState(ROLE_DEFAULTS);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const togglePerm = (role: string, idx: number) => {
    setPermissions(prev => ({
      ...prev,
      [role]: prev[role].map((v, i) => i === idx ? !v : v),
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Paramètres</h1>
        <p className="text-slate-400 text-sm mt-1">Configurez votre agence, les rôles et les préférences.</p>
      </div>

      <div className="flex gap-6">
        {/* Left menu */}
        <div className="w-56 shrink-0 space-y-1">
          {SECTIONS.map(s => (
            <button key={s.key} onClick={() => setSection(s.key)} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-left", section === s.key ? "bg-primary text-background-dark" : "text-slate-400 hover:text-white hover:bg-neutral-dark")}>
              <span className="material-symbols-outlined text-lg">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-neutral-dark rounded-xl border border-border-dark p-6">
          {/* Informations agence */}
          {section === "agence" && (
            <div className="space-y-5 max-w-lg">
              <h2 className="text-lg font-bold text-white mb-4">Informations de l&apos;agence</h2>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xl font-black">TC</div>
                  <button onClick={() => addToast("info", "Upload de logo bientôt disponible")} className="text-xs text-primary font-semibold hover:underline">Changer le logo</button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Nom de l&apos;agence</label>
                <input value={agency.name} onChange={e => setAgency(a => ({ ...a, name: e.target.value }))} className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Description</label>
                <textarea value={agency.description} onChange={e => setAgency(a => ({ ...a, description: e.target.value }))} rows={3} className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Secteur</label>
                  <input value={agency.sector} onChange={e => setAgency(a => ({ ...a, sector: e.target.value }))} className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Pays</label>
                  <input value={agency.country} onChange={e => setAgency(a => ({ ...a, country: e.target.value }))} className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Site web</label>
                <input value={agency.website} onChange={e => setAgency(a => ({ ...a, website: e.target.value }))} className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">SIRET (optionnel)</label>
                <input value={agency.siret} onChange={e => setAgency(a => ({ ...a, siret: e.target.value }))} placeholder="XXX XXX XXX XXXXX" className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50" />
              </div>
              <button onClick={() => addToast("success", "Paramètres sauvegardés")} className="px-6 py-2.5 bg-primary text-background-dark rounded-xl text-sm font-bold hover:brightness-110 transition-all">Enregistrer</button>
            </div>
          )}

          {/* Rôles & Permissions */}
          {section === "roles" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white mb-4">Rôles & Permissions</h2>
              <p className="text-sm text-slate-400">Définissez les permissions pour chaque rôle de l&apos;agence.</p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-border-dark">
                      <th className="px-4 py-3 text-left font-semibold">Permission</th>
                      {Object.keys(permissions).map(role => (
                        <th key={role} className="px-4 py-3 text-center font-semibold">{role}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PERMISSIONS.map((perm, idx) => (
                      <tr key={perm} className="border-b border-border-dark/50">
                        <td className="px-4 py-3 text-sm text-white font-medium">{perm}</td>
                        {Object.keys(permissions).map(role => (
                          <td key={role} className="px-4 py-3 text-center">
                            <button
                              onClick={() => togglePerm(role, idx)}
                              className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-colors", permissions[role][idx] ? "bg-primary/20 text-primary" : "bg-border-dark text-slate-500 hover:text-slate-300")}
                            >
                              <span className="material-symbols-outlined text-lg">{permissions[role][idx] ? "check" : "close"}</span>
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={() => addToast("success", "Permissions mises à jour")} className="px-6 py-2.5 bg-primary text-background-dark rounded-xl text-sm font-bold hover:brightness-110 transition-all">Enregistrer</button>
            </div>
          )}

          {/* Plan d'abonnement */}
          {section === "plan" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white mb-4">Abonnement</h2>
              <div className="bg-primary/10 rounded-xl border border-primary/20 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xl font-black text-white">Plan Agence</p>
                    <p className="text-sm text-slate-400">€99/mois · Commission 8%</p>
                  </div>
                  <span className="text-xs bg-primary text-background-dark px-3 py-1.5 rounded-full font-bold">Actif</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {PLAN_FEATURES.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-background-dark/50 rounded-xl border border-border-dark p-5">
                <p className="text-sm font-bold text-white mb-2">Prochain renouvellement</p>
                <p className="text-sm text-slate-400">4 avril 2026 — €99,00</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => addToast("info", "Changement de plan à venir")} className="px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-xl text-sm text-white font-semibold hover:bg-border-dark transition-colors">Changer de plan</button>
                <button onClick={() => addToast("info", "Annulation du plan à venir")} className="px-4 py-2.5 text-red-400 text-sm font-semibold hover:text-red-300 transition-colors">Annuler l&apos;abonnement</button>
              </div>
            </div>
          )}

          {/* Paiements */}
          {section === "paiements" && (
            <div className="space-y-5 max-w-lg">
              <h2 className="text-lg font-bold text-white mb-4">Méthodes de paiement</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-background-dark/50 rounded-xl border border-border-dark">
                  <span className="material-symbols-outlined text-primary text-xl">credit_card</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">Visa •••• 5678</p>
                    <p className="text-xs text-slate-500">Expire 06/28</p>
                  </div>
                  <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold">Par défaut</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-background-dark/50 rounded-xl border border-border-dark">
                  <span className="material-symbols-outlined text-amber-400 text-xl">account_balance</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">Virement SEPA</p>
                    <p className="text-xs text-slate-500">FR76 •••• •••• 4921</p>
                  </div>
                  <button className="text-xs text-slate-400 hover:text-white transition-colors">Définir par défaut</button>
                </div>
              </div>
              <button onClick={() => addToast("info", "Ajout de méthode bientôt disponible")} className="flex items-center gap-2 text-sm text-primary font-semibold hover:underline">
                <span className="material-symbols-outlined text-lg">add</span>
                Ajouter une méthode
              </button>
              <div className="pt-4 border-t border-border-dark">
                <h3 className="text-sm font-bold text-white mb-3">Méthodes de retrait</h3>
                <div className="space-y-3">
                  {[
                    { label: "Virement SEPA", detail: "FR76 •••• •••• 4921", icon: "account_balance" },
                    { label: "Orange Money", detail: "+221 77 •••• 456", icon: "phone_iphone" },
                  ].map(m => (
                    <div key={m.label} className="flex items-center gap-4 p-4 bg-background-dark/50 rounded-xl border border-border-dark">
                      <span className="material-symbols-outlined text-slate-400 text-xl">{m.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-white">{m.label}</p>
                        <p className="text-xs text-slate-500">{m.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {section === "notifications" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white mb-4">Notifications</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-border-dark">
                      <th className="px-4 py-3 text-left font-semibold">Événement</th>
                      <th className="px-4 py-3 text-center font-semibold">Email</th>
                      <th className="px-4 py-3 text-center font-semibold">Push</th>
                      <th className="px-4 py-3 text-center font-semibold">SMS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifs.map(n => (
                      <tr key={n.id} className="border-b border-border-dark/50">
                        <td className="px-4 py-3 text-sm text-white font-medium">{n.label}</td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => setNotifs(prev => prev.map(nn => nn.id === n.id ? { ...nn, email: !nn.email } : nn))} className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-colors", n.email ? "bg-primary/20 text-primary" : "bg-border-dark text-slate-500")}>
                            <span className="material-symbols-outlined text-lg">{n.email ? "check" : "close"}</span>
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => setNotifs(prev => prev.map(nn => nn.id === n.id ? { ...nn, push: !nn.push } : nn))} className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-colors", n.push ? "bg-primary/20 text-primary" : "bg-border-dark text-slate-500")}>
                            <span className="material-symbols-outlined text-lg">{n.push ? "check" : "close"}</span>
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => setNotifs(prev => prev.map(nn => nn.id === n.id ? { ...nn, sms: !nn.sms } : nn))} className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-colors", n.sms ? "bg-primary/20 text-primary" : "bg-border-dark text-slate-500")}>
                            <span className="material-symbols-outlined text-lg">{n.sms ? "check" : "close"}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={() => addToast("success", "Notifications mises à jour")} className="px-6 py-2.5 bg-primary text-background-dark rounded-xl text-sm font-bold hover:brightness-110 transition-all">Enregistrer</button>
            </div>
          )}

          {/* Zone danger */}
          {section === "danger" && (
            <div className="space-y-5 max-w-lg">
              <h2 className="text-lg font-bold text-white mb-4">Zone danger</h2>
              <div className="p-5 bg-red-500/5 rounded-xl border border-red-500/20">
                <h3 className="text-sm font-bold text-red-400 mb-2">Suspendre l&apos;agence</h3>
                <p className="text-xs text-slate-400 mb-3">Mettre l&apos;agence en pause désactive tous les services et rend le profil invisible. Les commandes en cours seront maintenues.</p>
                <button onClick={() => addToast("info", "Suspension à venir")} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-xl text-xs font-bold border border-red-500/20 hover:bg-red-500/20 transition-colors">Suspendre l&apos;agence</button>
              </div>
              <div className="p-5 bg-red-500/5 rounded-xl border border-red-500/20">
                <h3 className="text-sm font-bold text-red-400 mb-2">Supprimer l&apos;agence</h3>
                <p className="text-xs text-slate-400 mb-3">Cette action est irréversible. Toutes les données, services, historiques et accès des membres seront définitivement supprimés.</p>
                <button onClick={() => setShowDeleteConfirm(true)} className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-colors">Supprimer définitivement</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-neutral-dark rounded-2xl border border-red-500/30 p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-400">warning</span>
              </div>
              <h3 className="text-lg font-bold text-white">Confirmer la suppression</h3>
            </div>
            <p className="text-sm text-slate-400 mb-4">Êtes-vous sûr de vouloir supprimer définitivement votre agence ? Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 text-slate-400 text-sm font-semibold hover:text-white transition-colors">Annuler</button>
              <button onClick={() => { addToast("error", "Agence supprimée"); setShowDeleteConfirm(false); }} className="flex-1 py-2.5 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 transition-all">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
