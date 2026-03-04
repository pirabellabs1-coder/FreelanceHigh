"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";

export default function ClientProfile() {
  const { addToast } = useToastStore();
  const [form, setForm] = useState({
    fullName: "Jean Dupont",
    email: "jean.dupont@email.sn",
    bio: "Entrepreneur passionné par le digital. Je dirige une agence de transformation digitale spécialisée dans les solutions innovantes pour les entreprises africaines. Toujours à la recherche de freelances talentueux pour collaborer.",
    company: "Digital Solutions SARL",
    website: "https://digitalsolutions.sn",
    sector: "Technologie",
    teamSize: "10-50",
    country: "Sénégal",
    city: "Dakar",
    phone: "+221 77 123 45 67",
  });

  function update(key: string, val: string) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function save() {
    addToast("success", "Profil mis à jour avec succès !");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Mon Profil</h1>
          <p className="text-slate-400 text-sm mt-1">Gérez vos informations personnelles et votre profil entreprise.</p>
        </div>
        <button onClick={save} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all">
          <span className="material-symbols-outlined text-lg">save</span>
          Enregistrer les modifications
        </button>
      </div>

      {/* Profile Header Card */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-black ring-4 ring-primary/20">
              JD
            </div>
            <button
              onClick={() => addToast("info", "Upload photo bientôt disponible")}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-background-dark shadow-lg hover:scale-110 transition-transform"
            >
              <span className="material-symbols-outlined text-sm">photo_camera</span>
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{form.fullName}</h2>
            <p className="text-slate-400 text-sm">Entrepreneur · {form.city}, {form.country}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                Email vérifié
              </span>
              <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                Téléphone vérifié
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-5">
          <span className="material-symbols-outlined text-primary">person</span>
          Informations personnelles
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Nom complet</label>
            <input value={form.fullName} onChange={e => update("fullName", e.target.value)} className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Email</label>
            <input value={form.email} onChange={e => update("email", e.target.value)} type="email" className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Téléphone</label>
            <input value={form.phone} onChange={e => update("phone", e.target.value)} className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Pays</label>
            <select value={form.country} onChange={e => update("country", e.target.value)} className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
              {["Sénégal", "Côte d'Ivoire", "Cameroun", "France", "Belgique", "Canada", "Autre"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Bio professionnelle</label>
          <textarea
            value={form.bio}
            onChange={e => update("bio", e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>
      </div>

      {/* Company Info */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-5">
          <span className="material-symbols-outlined text-primary">business</span>
          Profil Entreprise
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Nom de l&apos;entreprise</label>
            <input value={form.company} onChange={e => update("company", e.target.value)} className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Site web</label>
            <input value={form.website} onChange={e => update("website", e.target.value)} className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Secteur d&apos;activité</label>
            <select value={form.sector} onChange={e => update("sector", e.target.value)} className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
              {["Technologie", "Marketing", "Finance", "Santé", "Éducation", "Commerce", "Industrie", "Autre"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Taille d&apos;équipe</label>
            <select value={form.teamSize} onChange={e => update("teamSize", e.target.value)} className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
              {["1-5", "5-10", "10-50", "50-200", "200+"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Profile completion */}
      <div className="bg-primary/5 rounded-xl border border-primary/10 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">trending_up</span>
            <p className="font-bold text-white text-sm">Complétion du profil</p>
          </div>
          <span className="text-primary text-sm font-bold">75%</span>
        </div>
        <div className="h-2 bg-border-dark rounded-full overflow-hidden mb-3">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: "75%" }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <span className="flex items-center gap-1.5 text-slate-500"><span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>Photo de profil ajoutée</span>
          <span className="flex items-center gap-1.5 text-slate-500"><span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>Bio renseignée</span>
          <span className="flex items-center gap-1.5 text-slate-500"><span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>Entreprise vérifiée</span>
          <span className="flex items-center gap-1.5 text-slate-400"><span className="material-symbols-outlined text-slate-600 text-sm">radio_button_unchecked</span>Ajouter une méthode de paiement</span>
        </div>
      </div>
    </div>
  );
}
