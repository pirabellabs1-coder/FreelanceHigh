"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "tous", label: "Tous", icon: "all_inclusive" },
  { key: "logo", label: "Projet Logo", icon: "code" },
  { key: "web", label: "Développement Web", icon: "code" },
  { key: "redaction", label: "Rédaction Content", icon: "edit_note" },
];

const FREELANCERS = [
  { name: "Jean D.", specialty: "Expert React", rating: 4.9, reviews: 120, verified: true },
  { name: "Marie L.", specialty: "UI/UX Designer", rating: 5.0, reviews: 85, verified: true },
  { name: "Dev Studio", specialty: "Fullstack Agency", rating: 4.8, reviews: 210, verified: false },
  { name: "Sophie Design", specialty: "Illustratrice", rating: 4.9, reviews: 56, verified: true },
];

const SERVICES = [
  { title: "Design de Logo Minimaliste & Branding Premium", freelance: "Jean D.", rating: 4.9, reviews: 42, price: 250, image: "🎨" },
  { title: "Landing Page Conversion-Optimisée (Figma/React)", freelance: "Marie L.", rating: 5.0, reviews: 18, price: 800, image: "🖥️" },
  { title: "Illustrations Personnalisées pour SaaS & Blogs", freelance: "Sophie Design", rating: 4.8, reviews: 29, price: 150, image: "🌿" },
];

const LISTS = [
  { name: "Projet Logo", count: 12, icon: "palette", color: "bg-primary/20" },
  { name: "Développement Web", count: 5, icon: "laptop_mac", color: "bg-primary/20" },
  { name: "Montage Vidéo", count: 3, icon: "movie", color: "bg-primary/20" },
];

export default function ClientFavorites() {
  const [tab, setTab] = useState("tous");
  const [favorites, setFavorites] = useState(FREELANCERS.map(f => f.name));
  const { addToast } = useToastStore();

  function toggleFavorite(name: string) {
    setFavorites(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
    addToast("success", favorites.includes(name) ? "Retiré des favoris" : "Ajouté aux favoris");
  }

  function createList() {
    const name = prompt("Nom de la nouvelle liste :");
    if (name) addToast("success", `Liste "${name}" créée`);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Services et Freelances Favoris</h1>
          <p className="text-slate-400 text-sm mt-1">Gérez vos prestataires et services sauvegardés pour vos futurs projets.</p>
        </div>
        <button onClick={createList} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all">
          <span className="material-symbols-outlined text-lg">add</span>
          Créer une nouvelle liste
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-4 border-b border-border-dark">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={cn("flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors -mb-px", tab === t.key ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-300")}>
            <span className="material-symbols-outlined text-sm">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Freelances Favoris */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">group</span>
            Freelances Favoris
          </h2>
          <button className="text-sm text-primary font-semibold hover:underline">Voir tout</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FREELANCERS.map(f => (
            <div key={f.name} className="bg-neutral-dark rounded-xl border border-border-dark p-5 text-center relative hover:border-primary/50 transition-colors">
              <button onClick={() => toggleFavorite(f.name)} className="absolute top-3 right-3">
                <span className={cn("material-symbols-outlined text-xl", favorites.includes(f.name) ? "text-primary" : "text-slate-600")} style={{ fontVariationSettings: favorites.includes(f.name) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
              </button>
              <div className="relative inline-block mb-3">
                <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto flex items-center justify-center text-primary text-2xl font-bold">{f.name.split(" ").map(n => n[0]).join("")}</div>
                {f.verified && (
                  <span className="absolute bottom-0 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-background-dark text-sm">check</span>
                  </span>
                )}
              </div>
              <p className="font-bold text-white">{f.name}</p>
              <p className="text-[11px] text-primary uppercase font-bold tracking-wider mt-0.5">{f.specialty}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <span className="material-symbols-outlined text-yellow-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-sm font-bold text-white">{f.rating}</span>
                <span className="text-xs text-slate-500">({f.reviews})</span>
              </div>
              <button className="mt-3 px-6 py-2 bg-border-dark text-white text-sm font-semibold rounded-lg hover:bg-primary hover:text-background-dark transition-colors">Profil</button>
            </div>
          ))}
        </div>
      </div>

      {/* Services Sauvegardés */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            Services Sauvegardés
          </h2>
          <button className="text-sm text-primary font-semibold hover:underline">Voir tout</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map(s => (
            <div key={s.title} className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden hover:border-primary/50 transition-colors">
              <div className="h-40 bg-background-dark flex items-center justify-center text-5xl relative">
                {s.image}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">{s.freelance[0]}</div>
                  <span className="text-xs text-white font-medium bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded">{s.freelance}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white text-sm line-clamp-2">{s.title}</h3>
                <div className="flex items-center gap-1 mt-2">
                  <span className="material-symbols-outlined text-yellow-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-sm font-bold text-white">{s.rating}</span>
                  <span className="text-xs text-slate-500">({s.reviews})</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-dark">
                  <span className="text-xs text-slate-500">À partir de</span>
                  <span className="text-lg font-bold text-white">{s.price} €</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Listes de Projets */}
      <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Vos Listes de Projets</h2>
            <p className="text-sm text-slate-400">Organisez vos favoris par type de projet.</p>
          </div>
          <button onClick={createList} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-sm">folder</span>
            Nouvelle liste
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LISTS.map(l => (
            <button key={l.name} className="bg-neutral-dark rounded-xl border border-border-dark p-5 text-left hover:border-primary/40 transition-colors">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", l.color)}>
                <span className="material-symbols-outlined text-primary">{l.icon}</span>
              </div>
              <p className="font-bold text-white">{l.name}</p>
              <p className="text-xs text-primary/60">{l.count} éléments sauvegardés</p>
            </button>
          ))}
          <button onClick={createList} className="border-2 border-dashed border-border-dark rounded-xl p-5 text-center hover:border-primary/40 transition-colors flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-2xl text-slate-500 mb-1">add</span>
            <p className="text-sm text-slate-500 font-medium">Ajouter</p>
          </button>
        </div>
      </div>
    </div>
  );
}
