"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Star, Users, Clock } from "lucide-react";

interface CategoryDetail {
  id: string;
  nameFr: string;
  nameEn: string;
  slug: string;
  icon: string;
  color: string;
}

interface Formation {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  price: number;
  isFree: boolean;
  rating: number;
  studentsCount: number;
  reviewsCount: number;
  duration: number;
  level: string;
  thumbnail: string | null;
  instructeur: { user: { name: string } };
}

const LEVEL_FR: Record<string, string> = {
  DEBUTANT: "Débutant",
  INTERMEDIAIRE: "Intermédiaire",
  AVANCE: "Avancé",
  TOUS_NIVEAUX: "Tous niveaux",
};

export default function FormationCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"fr" | "en">("fr");

  useEffect(() => {
    const saved = localStorage.getItem("formations_lang") as "fr" | "en" | null;
    if (saved) setLang(saved);

    fetch(`/api/formations/categories/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setCategory(d.category);
        setFormations(d.formations ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const t = (fr: string, en: string) => (lang === "fr" ? fr : en);

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Header */}
      <div className="bg-neutral-800 border-b border-neutral-700 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link href="/formations" className="hover:text-white transition-colors">
              {t("Formations", "Courses")}
            </Link>
            <span>/</span>
            <Link href="/formations/categories" className="hover:text-white transition-colors">
              {t("Catégories", "Categories")}
            </Link>
            <span>/</span>
            <span className="text-white">
              {category ? (lang === "fr" ? category.nameFr : category.nameEn) : slug}
            </span>
          </div>
          {category && (
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${category.color}20` }}
              >
                {category.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {lang === "fr" ? category.nameFr : category.nameEn}
                </h1>
                <p className="text-slate-400 mt-1">
                  {formations.length} {t("formation", "course")}{formations.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Formations */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-neutral-800 rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : formations.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">{t("Aucune formation dans cette catégorie", "No courses in this category")}</p>
            <Link href="/formations/explorer" className="mt-4 inline-block text-primary hover:underline text-sm">
              {t("Explorer toutes les formations", "Explore all courses")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formations.map((f) => (
              <Link key={f.id} href={`/formations/${f.slug}`} className="bg-neutral-800 border border-neutral-700 hover:border-primary/40 rounded-2xl overflow-hidden group transition-all hover:shadow-lg hover:shadow-primary/10">
                {/* Thumbnail */}
                <div className="relative h-40 bg-neutral-700">
                  {f.thumbnail ? (
                    <img src={f.thumbnail} alt={lang === "fr" ? f.titleFr : f.titleEn} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">{category?.icon ?? "📚"}</span>
                    </div>
                  )}
                </div>
                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-white line-clamp-2 group-hover:text-primary transition-colors text-sm mb-2">
                    {lang === "fr" ? f.titleFr : f.titleEn}
                  </h3>
                  <p className="text-xs text-slate-400 mb-3">{f.instructeur.user.name}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {f.rating.toFixed(1)} ({f.reviewsCount})
                    </span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{f.studentsCount.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{Math.round(f.duration / 60)}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-neutral-700 text-slate-300 px-2 py-0.5 rounded-full">
                      {LEVEL_FR[f.level] ?? f.level}
                    </span>
                    <span className="font-bold text-white">
                      {f.isFree ? t("Gratuit", "Free") : `${f.price.toFixed(0)}€`}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
