"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

const CATEGORIES: Record<string, { name: string; icon: string; description: string }> = {
  "developpement-web": { name: "Développement Web", icon: "code", description: "Sites web, applications, e-commerce et développement sur mesure" },
  "design-ui-ux": { name: "Design UI/UX", icon: "palette", description: "Interfaces utilisateur, expérience utilisateur, prototypage et design system" },
  "marketing-digital": { name: "Marketing Digital", icon: "campaign", description: "SEO, réseaux sociaux, publicité en ligne et stratégie digitale" },
  "redaction": { name: "Rédaction", icon: "edit_note", description: "Copywriting, articles, contenus web et rédaction technique" },
  "traduction": { name: "Traduction", icon: "translate", description: "Traduction professionnelle, localisation et interprétation" },
  "video-animation": { name: "Vidéo & Animation", icon: "videocam", description: "Montage vidéo, motion design, animation 2D/3D" },
  "ia-data": { name: "IA & Data", icon: "psychology", description: "Intelligence artificielle, machine learning, analyse de données" },
  "mobile": { name: "Mobile", icon: "smartphone", description: "Applications iOS, Android, React Native et Flutter" },
  "seo": { name: "SEO", icon: "search", description: "Référencement naturel, audit SEO, optimisation technique" },
  "cybersecurite": { name: "Cybersécurité", icon: "security", description: "Audit de sécurité, pentest, protection des données" },
};

const DEMO_SERVICES = [
  { id: "1", title: "Site e-commerce complet avec Shopify", category: "developpement-web", price: 450, rating: 4.9, reviews: 127, seller: "Amadou D.", level: "Top Rated", delivery: 7, image: "code" },
  { id: "2", title: "Refonte UI/UX application mobile", category: "design-ui-ux", price: 350, rating: 4.8, reviews: 89, seller: "Fatou S.", level: "Elite", delivery: 5, image: "palette" },
  { id: "3", title: "Stratégie SEO complète et audit", category: "seo", price: 200, rating: 4.7, reviews: 63, seller: "Ousmane K.", level: "Confirmé", delivery: 3, image: "search" },
  { id: "4", title: "Application React Native cross-platform", category: "mobile", price: 800, rating: 4.9, reviews: 45, seller: "Ibrahim M.", level: "Top Rated", delivery: 14, image: "smartphone" },
  { id: "5", title: "Vidéo promotionnelle avec animation", category: "video-animation", price: 300, rating: 4.6, reviews: 78, seller: "Aïcha B.", level: "Confirmé", delivery: 5, image: "videocam" },
  { id: "6", title: "Campagne Google Ads optimisée", category: "marketing-digital", price: 250, rating: 4.8, reviews: 92, seller: "Kofi A.", level: "Elite", delivery: 3, image: "campaign" },
  { id: "7", title: "Rédaction articles SEO (10 articles)", category: "redaction", price: 180, rating: 4.5, reviews: 156, seller: "Marie L.", level: "Confirmé", delivery: 7, image: "edit_note" },
  { id: "8", title: "Traduction FR-EN professionnelle", category: "traduction", price: 120, rating: 4.9, reviews: 201, seller: "Jean-Pierre N.", level: "Top Rated", delivery: 2, image: "translate" },
  { id: "9", title: "Modèle ML prédictif sur mesure", category: "ia-data", price: 600, rating: 4.7, reviews: 34, seller: "Moussa T.", level: "Elite", delivery: 10, image: "psychology" },
  { id: "10", title: "Audit cybersécurité complet", category: "cybersecurite", price: 500, rating: 4.8, reviews: 28, seller: "Yacine D.", level: "Top Rated", delivery: 5, image: "security" },
  { id: "11", title: "Landing page WordPress optimisée", category: "developpement-web", price: 150, rating: 4.6, reviews: 210, seller: "Paul K.", level: "Confirmé", delivery: 3, image: "code" },
  { id: "12", title: "Design système complet Figma", category: "design-ui-ux", price: 500, rating: 4.9, reviews: 67, seller: "Aminata C.", level: "Elite", delivery: 10, image: "palette" },
  { id: "13", title: "API REST Node.js & documentation", category: "developpement-web", price: 380, rating: 4.7, reviews: 55, seller: "David O.", level: "Top Rated", delivery: 7, image: "code" },
  { id: "14", title: "Community management 1 mois", category: "marketing-digital", price: 400, rating: 4.5, reviews: 88, seller: "Nadia F.", level: "Confirmé", delivery: 30, image: "campaign" },
  { id: "15", title: "Chatbot IA pour service client", category: "ia-data", price: 700, rating: 4.8, reviews: 22, seller: "Ahmed S.", level: "Top Rated", delivery: 14, image: "psychology" },
  { id: "16", title: "Montage vidéo YouTube (10 vidéos)", category: "video-animation", price: 350, rating: 4.6, reviews: 44, seller: "Awa D.", level: "Confirmé", delivery: 14, image: "videocam" },
];

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const category = CATEGORIES[slug];
  const [sortBy, setSortBy] = useState("pertinence");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const services = useMemo(() => {
    const filtered = DEMO_SERVICES.filter(s => s.category === slug);
    if (sortBy === "prix-asc") filtered.sort((a, b) => a.price - b.price);
    if (sortBy === "prix-desc") filtered.sort((a, b) => b.price - a.price);
    if (sortBy === "note") filtered.sort((a, b) => b.rating - a.rating);
    if (sortBy === "populaire") filtered.sort((a, b) => b.reviews - a.reviews);
    return filtered;
  }, [slug, sortBy]);

  if (!category) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
          <h2 className="text-xl font-bold mb-2">Catégorie introuvable</h2>
          <Link href="/explorer" className="text-primary hover:underline">Retour au marketplace</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-primary">Accueil</Link>
          <span>/</span>
          <Link href="/explorer" className="hover:text-primary">Explorer</Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-white font-medium">{category.name}</span>
        </nav>

        {/* Category header */}
        <div className="bg-white dark:bg-neutral-dark rounded-2xl p-8 border border-slate-200 dark:border-border-dark mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-primary">{category.icon}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{category.name}</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">{category.description}</p>
              <p className="text-sm text-primary font-semibold mt-1">{services.length} services disponibles</p>
            </div>
          </div>
        </div>

        {/* Sort bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">{services.length} résultats</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Trier par :</span>
            {[
              { key: "pertinence", label: "Pertinence" },
              { key: "prix-asc", label: "Prix ↑" },
              { key: "prix-desc", label: "Prix ↓" },
              { key: "note", label: "Note" },
              { key: "populaire", label: "Populaire" },
            ].map(s => (
              <button key={s.key} onClick={() => setSortBy(s.key)} className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors", sortBy === s.key ? "bg-primary text-white" : "bg-slate-100 dark:bg-neutral-dark text-slate-600 dark:text-slate-400 hover:bg-slate-200")}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services grid */}
        {services.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">inbox</span>
            <p className="text-lg font-semibold text-slate-500">Aucun service dans cette catégorie</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map(s => (
              <Link key={s.id} href={`/services/${s.id}`} className="group bg-white dark:bg-neutral-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                  <span className="material-symbols-outlined text-5xl text-primary/40">{s.image}</span>
                  <span className="absolute top-3 left-3 bg-primary/90 text-white text-xs font-bold px-2 py-1 rounded-lg">{category.name}</span>
                  <button onClick={(e) => { e.preventDefault(); setFavorites(prev => { const n = new Set(prev); if (n.has(s.id)) { n.delete(s.id); } else { n.add(s.id); } return n; }); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-neutral-dark/80 flex items-center justify-center hover:bg-white transition-colors">
                    <span className={cn("material-symbols-outlined text-lg", favorites.has(s.id) ? "text-rose-500" : "text-slate-400")}>{favorites.has(s.id) ? "favorite" : "favorite_border"}</span>
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">{s.seller.charAt(0)}</div>
                    <span className="text-xs text-slate-500">{s.seller}</span>
                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">{s.level}</span>
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
                    <span className="text-sm font-bold">{s.rating}</span>
                    <span className="text-xs text-slate-400">({s.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-border-dark pt-3">
                    <span className="text-xs text-slate-400">{s.delivery}j livraison</span>
                    <span className="font-bold text-primary">À partir de €{s.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* All categories link */}
        <div className="mt-12 text-center">
          <Link href="/explorer" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
            <span className="material-symbols-outlined">arrow_back</span>
            Voir toutes les catégories
          </Link>
        </div>
      </div>
    </div>
  );
}
