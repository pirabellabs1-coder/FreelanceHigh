"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Category {
  id: string;
  nameFr: string;
  nameEn: string;
  slug: string;
  icon: string;
  color: string;
  _count: { formations: number };
}

export default function FormationsCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"fr" | "en">("fr");

  useEffect(() => {
    const saved = localStorage.getItem("formations_lang") as "fr" | "en" | null;
    if (saved) setLang(saved);

    fetch("/api/formations/categories")
      .then((r) => r.json())
      .then((d) => { setCategories(d.categories ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Header */}
      <div className="bg-neutral-800 border-b border-neutral-700 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link href="/formations" className="hover:text-white transition-colors">
              {lang === "fr" ? "Formations" : "Courses"}
            </Link>
            <span>/</span>
            <span className="text-white">{lang === "fr" ? "Catégories" : "Categories"}</span>
          </div>
          <h1 className="text-3xl font-bold text-white">
            {lang === "fr" ? "Toutes les catégories" : "All Categories"}
          </h1>
          <p className="text-slate-400 mt-2">
            {lang === "fr"
              ? "Explorez nos formations par domaine d'expertise"
              : "Explore our courses by field of expertise"}
          </p>
        </div>
      </div>

      {/* Categories grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-neutral-800 rounded-2xl p-6 animate-pulse h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/formations/categories/${cat.slug}`}
                className="bg-neutral-800 border border-neutral-700 hover:border-primary/40 rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-primary/10 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                  style={{ backgroundColor: `${cat.color}20` }}
                >
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                  {lang === "fr" ? cat.nameFr : cat.nameEn}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {cat._count.formations} {lang === "fr" ? "formation" : "course"}{cat._count.formations > 1 ? "s" : ""}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
