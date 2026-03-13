"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, Star, BookOpen } from "lucide-react";
import { getFormationFavorites, toggleFormationFavorite } from "@/lib/formations/favorites";

interface Formation {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  thumbnail: string | null;
  price: number;
  isFree: boolean;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  duration: number;
  level: string;
  instructeur: {
    user: { name: string };
  };
}

const LEVEL_LABELS: Record<string, string> = {
  DEBUTANT: "Débutant",
  INTERMEDIAIRE: "Intermédiaire",
  AVANCE: "Avancé",
  TOUS_NIVEAUX: "Tous niveaux",
};

export default function FavorisPage() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedLang = localStorage.getItem("fh_lang") as "fr" | "en" | null;
    if (storedLang) setLang(storedLang);

    const savedFavorites = getFormationFavorites();
    setFavorites(savedFavorites);

    if (savedFavorites.length === 0) {
      setLoading(false);
      return;
    }

    // Fetch each favorite formation
    Promise.all(
      savedFavorites.map((id) =>
        fetch(`/api/formations/${id}`)
          .then((r) => r.json())
          .then((d) => d.formation)
          .catch(() => null)
      )
    )
      .then((results) => {
        setFormations(results.filter(Boolean) as Formation[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const removeFavorite = (id: string) => {
    toggleFormationFavorite(id);
    setFavorites((prev) => prev.filter((f) => f !== id));
    setFormations((prev) => prev.filter((f) => f.id !== id));
  };

  const t = {
    title: lang === "fr" ? "Mes favoris" : "My Favorites",
    empty: lang === "fr" ? "Aucune formation en favoris" : "No courses in favorites",
    emptyDesc:
      lang === "fr"
        ? "Cliquez sur le ❤️ sur les pages de formations pour les ajouter ici."
        : "Click the ❤️ on course pages to save them here.",
    explore: lang === "fr" ? "Explorer les formations" : "Explore courses",
    remove: lang === "fr" ? "Retirer" : "Remove",
    addToCart: lang === "fr" ? "Ajouter au panier" : "Add to cart",
    free: lang === "fr" ? "Gratuit" : "Free",
    students: lang === "fr" ? "apprenants" : "students",
    reviews: lang === "fr" ? "avis" : "reviews",
  };

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h${m > 0 ? m : ""}` : `${m}min`;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
          <Heart className="w-5 h-5 text-red-400 fill-red-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">{t.title}</h1>
          <p className="text-sm text-slate-400">
            {formations.length} {lang === "fr" ? "formation(s)" : "course(s)"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400">Chargement...</div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <Heart className="w-16 h-16 text-slate-600 mx-auto" />
          <div>
            <p className="text-white font-medium">{t.empty}</p>
            <p className="text-slate-400 text-sm mt-1">{t.emptyDesc}</p>
          </div>
          <Link
            href="/formations/explorer"
            className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            {t.explore}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formations.map((formation) => (
            <div
              key={formation.id}
              className="bg-neutral-dark border border-border-dark rounded-xl overflow-hidden flex flex-col"
            >
              {/* Thumbnail */}
              <Link href={`/formations/${formation.slug}`} className="relative block">
                {formation.thumbnail ? (
                  <img
                    src={formation.thumbnail}
                    alt={lang === "fr" ? formation.titleFr : formation.titleEn}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-primary/40" />
                  </div>
                )}
              </Link>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <Link href={`/formations/${formation.slug}`}>
                  <h3 className="font-semibold text-white text-sm line-clamp-2 hover:text-primary transition-colors">
                    {lang === "fr" ? formation.titleFr : formation.titleEn}
                  </h3>
                </Link>
                <p className="text-xs text-slate-400 mt-1">{formation.instructeur?.user?.name}</p>

                <div className="flex items-center gap-2 mt-2">
                  {formation.rating > 0 && (
                    <>
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-yellow-400 font-medium">{formation.rating.toFixed(1)}</span>
                      <span className="text-xs text-slate-500">({formation.reviewsCount} {t.reviews})</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span>{formatDuration(formation.duration)}</span>
                  <span>·</span>
                  <span>{LEVEL_LABELS[formation.level] ?? formation.level}</span>
                  <span>·</span>
                  <span>{formation.studentsCount} {t.students}</span>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-white">
                    {formation.isFree ? (
                      <span className="text-green-400">{t.free}</span>
                    ) : (
                      `${formation.price.toFixed(0)}€`
                    )}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFavorite(formation.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      title={t.remove}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/formations/${formation.slug}`}
                      className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      {t.addToCart}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
