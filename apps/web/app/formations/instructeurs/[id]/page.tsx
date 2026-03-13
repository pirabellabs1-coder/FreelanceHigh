"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Star, Users, BookOpen, Award, Globe, Linkedin } from "lucide-react";

interface InstructeurPublic {
  id: string;
  bioFr: string | null;
  bioEn: string | null;
  expertise: string[];
  linkedin: string | null;
  website: string | null;
  totalEarned: number;
  user: { name: string; avatar: string | null; image: string | null };
  formations: {
    id: string;
    slug: string;
    titleFr: string;
    titleEn: string;
    price: number;
    isFree: boolean;
    rating: number;
    studentsCount: number;
    reviewsCount: number;
    thumbnail: string | null;
    duration: number;
    level: string;
  }[];
  _count: { formations: number };
  avgRating: number;
  totalStudents: number;
}

export default function InstructeurPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [instructeur, setInstructeur] = useState<InstructeurPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"fr" | "en">("fr");

  useEffect(() => {
    const saved = localStorage.getItem("formations_lang") as "fr" | "en" | null;
    if (saved) setLang(saved);

    fetch(`/api/formations/instructeurs/${id}`)
      .then((r) => r.json())
      .then((d) => { setInstructeur(d.instructeur ?? null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const t = (fr: string, en: string) => (lang === "fr" ? fr : en);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl px-4">
          <div className="h-48 bg-neutral-800 rounded-2xl" />
          <div className="h-32 bg-neutral-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!instructeur) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-center p-4">
        <div>
          <p className="text-slate-400 mb-4">{t("Instructeur introuvable", "Instructor not found")}</p>
          <Link href="/formations/explorer" className="text-primary hover:underline text-sm">
            {t("Explorer les formations", "Browse courses")}
          </Link>
        </div>
      </div>
    );
  }

  const avatar = instructeur.user.avatar || instructeur.user.image;
  const bio = lang === "fr" ? instructeur.bioFr : instructeur.bioEn;

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Profile header */}
      <div className="bg-neutral-800 border-b border-neutral-700">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-primary/10 flex-shrink-0 overflow-hidden">
              {avatar ? (
                <img src={avatar} alt={instructeur.user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary font-bold text-3xl">
                  {instructeur.user.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{instructeur.user.name}</h1>

              {/* Expertise */}
              {instructeur.expertise.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {instructeur.expertise.slice(0, 4).map((e) => (
                    <span key={e} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{e}</span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-white font-medium">{instructeur.avgRating.toFixed(1)}</span> {t("note", "rating")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span className="text-white font-medium">{instructeur.totalStudents.toLocaleString()}</span> {t("apprenants", "students")}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-white font-medium">{instructeur._count.formations}</span> {t("formation", "course")}{instructeur._count.formations > 1 ? "s" : ""}
                </span>
              </div>

              {/* Links */}
              <div className="flex gap-3 mt-4">
                {instructeur.linkedin && (
                  <a href={instructeur.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {instructeur.website && (
                  <a href={instructeur.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
                    <Globe className="w-4 h-4" />
                    {t("Site web", "Website")}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {bio && (
            <div className="mt-6 pt-6 border-t border-neutral-700">
              <h2 className="text-sm font-semibold text-white mb-2">{t("À propos", "About")}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{bio}</p>
            </div>
          )}
        </div>
      </div>

      {/* Formations */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-white mb-6">
          {t("Formations proposées", "Courses Offered")} ({instructeur._count.formations})
        </h2>

        {instructeur.formations.length === 0 ? (
          <p className="text-slate-400">{t("Aucune formation publiée", "No published courses")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructeur.formations.map((f) => (
              <Link
                key={f.id}
                href={`/formations/${f.slug}`}
                className="bg-neutral-800 border border-neutral-700 hover:border-primary/40 rounded-2xl overflow-hidden group transition-all hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="h-36 bg-neutral-700 overflow-hidden">
                  {f.thumbnail ? (
                    <img src={f.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-neutral-500" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                    {lang === "fr" ? f.titleFr : f.titleEn}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {f.rating.toFixed(1)} ({f.reviewsCount})
                    <span>·</span>
                    <Users className="w-3 h-3" />
                    {f.studentsCount.toLocaleString()}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{Math.round(f.duration / 60)}h</span>
                    <span className="font-bold text-white text-sm">
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
