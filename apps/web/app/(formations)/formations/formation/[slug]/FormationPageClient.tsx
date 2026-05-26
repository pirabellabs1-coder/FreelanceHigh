"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEntityTracker } from "@/lib/tracking/useEntityTracker";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Lesson {
  id: string;
  title: string;
  duration: number | null;
  isFree: boolean;
  order: number;
}

interface Section {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
  lessonCount: number;
  duration: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { id: string; name: string | null; image: string | null };
}

interface Instructeur {
  id: string;
  userId: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  expertise: string[];
  yearsExp: number;
}

interface Formation {
  id: string;
  slug: string;
  title: string;
  shortDesc: string | null;
  description: string | null;
  descriptionFormat: string;
  learnPoints: string[];
  requirements: string[];
  targetAudience: string | null;
  locale: string;
  thumbnail: string | null;
  previewVideo: string | null;
  level: string;
  languages: string[];
  duration: number;
  price: number;
  originalPrice: number | null;
  isFree: boolean;
  hasCertificate: boolean;
  maxStudents: number | null;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  viewsCount: number;
  totalLessons: number;
  category: { id: string; slug: string; name: string } | null;
  instructeur: Instructeur;
  sections: Section[];
  reviews: Review[];
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

function initials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function fmtDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${m.toString().padStart(2, "0")}` : `${h}h`;
}

function timeAgo(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (d < 1) return "Aujourd'hui";
  if (d < 30) return `Il y a ${d}j`;
  if (d < 365) return `Il y a ${Math.floor(d / 30)} mois`;
  return `Il y a ${Math.floor(d / 365)} an(s)`;
}

const LEVEL_LABELS: Record<string, { label: string; color: string }> = {
  DEBUTANT: { label: "Débutant", color: "bg-green-100 text-green-700" },
  INTERMEDIAIRE: { label: "Intermédiaire", color: "bg-amber-100 text-amber-700" },
  AVANCE: { label: "Avancé", color: "bg-red-100 text-red-700" },
  TOUS_NIVEAUX: { label: "Tous niveaux", color: "bg-blue-100 text-blue-700" },
};

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className="material-symbols-outlined"
          style={{
            fontSize: `${size}px`,
            color: s <= Math.round(rating) ? "#f59e0b" : "#d1d5db",
            fontVariationSettings: "'FILL' 1",
          }}
        >
          star
        </span>
      ))}
    </div>
  );
}

// ─── Section item ─────────────────────────────────────────────────────────────
function SectionAccordion({ section, index }: { section: Section; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-fh-600/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-extrabold text-fh-600">{index + 1}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{section.title}</p>
            <p className="text-[11px] text-gray-600">
              {section.lessonCount} leçon{section.lessonCount > 1 ? "s" : ""}
              {section.duration > 0 && ` · ${fmtDuration(section.duration)}`}
            </p>
          </div>
        </div>
        <span
          className="material-symbols-outlined text-gray-600 text-[20px] flex-shrink-0"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
        >
          expand_more
        </span>
      </button>
      {open && (
        <div className="border-t border-gray-100 bg-stone-50/50">
          {section.lessons.map((l) => (
            <div
              key={l.id}
              className="flex items-center gap-3 px-5 py-2.5 border-b border-gray-50 last:border-0"
            >
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ color: l.isFree ? "#006e2f" : "#9ca3af", fontVariationSettings: l.isFree ? "'FILL' 1" : "" }}
              >
                {l.isFree ? "play_circle" : "lock"}
              </span>
              <p className="text-xs text-gray-900 flex-1 min-w-0 truncate">{l.title}</p>
              <div className="flex items-center gap-2 flex-shrink-0">
                {l.isFree && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-fh-600/10 text-fh-600">
                    Aperçu
                  </span>
                )}
                {l.duration && (
                  <span className="text-[10px] text-gray-500">{fmtDuration(l.duration)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function FormationPageClient({ slug }: { slug: string }) {
  const router = useRouter();
  const [formation, setFormation] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Track view (deduped per session, persisted in DB → Formation.viewsCount++)
  useEntityTracker("formation", formation?.id);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/formations/public/formation/${slug}`);
        if (!res.ok) throw new Error();
        const json = await res.json();
        setFormation(json.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  function handleBuyNow() {
    if (!formation) return;
    router.push(`/formations/checkout?fids=${formation.id}`);
  }

  async function handleAddToCart() {
    if (!formation || addingToCart) return;
    setAddingToCart(true);
    try {
      const res = await fetch("/api/formations/apprenant/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formationId: formation.id }),
      });
      if (res.ok) {
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2500);
      }
    } finally {
      setAddingToCart(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 animate-pulse">
        <div className="h-72 bg-gray-200" />
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-4">
          <div className="h-10 w-2/3 bg-gray-200 rounded-lg" />
          <div className="h-60 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !formation) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-12 text-center max-w-md">
          <span className="material-symbols-outlined text-gray-300 text-5xl">school</span>
          <h2 className="text-base md:text-lg font-bold text-gray-900 mt-3">Formation introuvable</h2>
          <p className="text-sm text-gray-600 mt-1.5 mb-4">
            Cette formation n&apos;existe pas ou n&apos;est plus disponible.
          </p>
          <Link
            href="/formations/explorer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-bold bg-fh-600 hover:bg-fh-700"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Voir le catalogue
          </Link>
        </div>
      </div>
    );
  }

  const levelInfo = LEVEL_LABELS[formation.level] ?? { label: formation.level, color: "bg-gray-100 text-gray-700" };
  const discount = formation.originalPrice && formation.originalPrice > formation.price
    ? Math.round(((formation.originalPrice - formation.price) / formation.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Breadcrumb minimal — no hero cover */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-6">
        <Link
          href="/formations/explorer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <span className="material-symbols-outlined text-[14px]">arrow_back</span>
          Catalogue
        </Link>
        {/* Mobile title */}
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-tight mt-4 md:hidden">
          {formation.title}
        </h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── Main content ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Product image card — aspect 16:9 */}
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
              <div className="aspect-video w-full bg-fh-600/5 flex items-center justify-center">
                {formation.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={formation.thumbnail}
                    alt={formation.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <span
                      className="material-symbols-outlined text-fh-600 text-[64px] opacity-40"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      play_circle
                    </span>
                    <p className="text-xs text-gray-600 mt-2 font-semibold uppercase tracking-wide">
                      Formation vidéo
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Header card */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 md:p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${levelInfo.color}`}>
                  {levelInfo.label}
                </span>
                {formation.category && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600">
                    {formation.category.name}
                  </span>
                )}
                {formation.hasCertificate && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700">
                    <span className="material-symbols-outlined text-[13px]">workspace_premium</span>
                    Certificat
                  </span>
                )}
                {formation.studentsCount > 100 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">
                    <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      local_fire_department
                    </span>
                    POPULAIRE
                  </span>
                )}
              </div>

              <h1 className="hidden md:block text-xl md:text-2xl font-extrabold text-gray-900 leading-tight">
                {formation.title}
              </h1>
              {formation.shortDesc && (
                <p className="text-sm md:text-base text-gray-600 mt-3 leading-relaxed">{formation.shortDesc}</p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 mt-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <StarRating rating={formation.rating} size={16} />
                  <span className="text-sm font-semibold text-gray-900">
                    {formation.rating > 0 ? formation.rating.toFixed(1) : "Nouveau"}
                  </span>
                  {formation.reviewsCount > 0 && (
                    <span className="text-xs text-gray-500">({formation.reviewsCount})</span>
                  )}
                </div>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">groups</span>
                  {fmt(formation.studentsCount)} apprenant{formation.studentsCount > 1 ? "s" : ""}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">play_lesson</span>
                  {formation.totalLessons} leçon{formation.totalLessons > 1 ? "s" : ""}
                </span>
                {formation.duration > 0 && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {fmtDuration(formation.duration)}
                  </span>
                )}
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">language</span>
                  {formation.languages.map((l) => l.toUpperCase()).join(", ")}
                </span>
              </div>
            </div>

            {/* What you'll learn */}
            {formation.learnPoints && formation.learnPoints.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 md:p-6">
                <h2 className="text-base md:text-lg font-extrabold text-gray-900 mb-4">Ce que vous allez apprendre</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formation.learnPoints.map((p, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span
                        className="material-symbols-outlined text-fh-600 text-[18px] flex-shrink-0 mt-0.5"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      <p className="text-sm text-gray-900 leading-relaxed">{p}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course content */}
            {formation.sections && formation.sections.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 md:p-6">
                <h2 className="text-base md:text-lg font-extrabold text-gray-900 mb-2">Contenu de la formation</h2>
                <p className="text-xs text-gray-600 mb-4">
                  {formation.sections.length} section{formation.sections.length > 1 ? "s" : ""} ·{" "}
                  {formation.totalLessons} leçon{formation.totalLessons > 1 ? "s" : ""}
                  {formation.duration > 0 && ` · ${fmtDuration(formation.duration)}`}
                </p>
                <div className="space-y-2">
                  {formation.sections.map((s, i) => (
                    <SectionAccordion key={s.id} section={s} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {formation.requirements && formation.requirements.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 md:p-6">
                <h2 className="text-base md:text-lg font-extrabold text-gray-900 mb-4">Prérequis</h2>
                <ul className="space-y-2">
                  {formation.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-gray-600 text-[18px] flex-shrink-0 mt-0.5">
                        arrow_right
                      </span>
                      <p className="text-sm text-gray-600 leading-relaxed">{r}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Target audience */}
            {formation.targetAudience && (
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 md:p-6">
                <h2 className="text-base md:text-lg font-extrabold text-gray-900 mb-3">À qui s&apos;adresse cette formation ?</h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{formation.targetAudience}</p>
              </div>
            )}

            {/* Description */}
            {formation.description && (
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 md:p-6">
                <h2 className="text-base md:text-lg font-extrabold text-gray-900 mb-3">Description</h2>
                {formation.descriptionFormat === "tiptap" || /<\/?(p|h[1-6]|ul|ol|li|strong|em|br|a|blockquote)[\s>/]/i.test(formation.description) ? (
                  <div
                    className="prose prose-sm max-w-none text-gray-600 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-a:text-fh-600"
                    dangerouslySetInnerHTML={{ __html: formation.description }}
                  />
                ) : (
                  <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {formation.description}
                  </div>
                )}
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 md:p-6">
              <h2 className="text-base md:text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                Avis des apprenants
                <span className="text-sm font-semibold text-gray-600">({formation.reviewsCount})</span>
              </h2>
              {formation.reviews.length === 0 ? (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-gray-300 text-5xl">reviews</span>
                  <p className="text-sm text-gray-600 mt-3">Aucun avis pour cette formation pour l&apos;instant.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formation.reviews.map((r) => (
                    <div key={r.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0">
                          {r.user.image ? (
                            <img src={r.user.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            initials(r.user.name)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-gray-900">{r.user.name ?? "Apprenant"}</p>
                            <span className="text-[11px] text-gray-500">{timeAgo(r.createdAt)}</span>
                          </div>
                          <StarRating rating={r.rating} size={13} />
                          <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{r.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Price card */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden sticky top-4">
              {/* Preview video */}
              {formation.previewVideo && (
                <div className="relative aspect-video bg-black">
                  <video
                    src={formation.previewVideo}
                    controls
                    className="w-full h-full object-cover"
                    poster={formation.thumbnail ?? undefined}
                  />
                </div>
              )}

              <div className="p-5">
                <div className="mb-4">
                  {discount > 0 && (
                    <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 mb-2">
                      -{discount}%
                    </span>
                  )}
                  <div className="flex items-baseline gap-2">
                    {formation.isFree ? (
                      <p className="text-xl md:text-2xl font-extrabold text-fh-600">Gratuit</p>
                    ) : (
                      <>
                        <p className="text-xl md:text-2xl font-extrabold text-fh-600">{fmt(formation.price)}</p>
                        <span className="text-sm font-bold text-gray-600">FCFA</span>
                      </>
                    )}
                  </div>
                  {formation.originalPrice && formation.originalPrice > formation.price && (
                    <p className="text-sm text-gray-400 line-through">{fmt(formation.originalPrice)} FCFA</p>
                  )}
                  {!formation.isFree && (
                    <p className="text-xs text-gray-500 mt-1">
                      ≈ {Math.round(formation.price / 655.957)} EUR
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleBuyNow}
                    className="w-full py-2.5 md:py-3 rounded-lg text-white font-bold text-sm transition-colors bg-fh-600 hover:bg-fh-700 flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">{formation.isFree ? "play_arrow" : "bolt"}</span>
                    {formation.isFree ? "Commencer maintenant" : "Acheter maintenant"}
                  </button>
                  {!formation.isFree && (
                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className="w-full py-2.5 md:py-3 rounded-lg text-fh-600 font-bold text-sm border border-fh-600/30 hover:border-fh-600/60 hover:bg-fh-600/5 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {addingToCart ? (
                        <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                      ) : addedToCart ? (
                        <>
                          <span className="material-symbols-outlined text-[18px]">check</span>
                          Ajouté au panier
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                          Ajouter au panier
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="mt-5 pt-5 border-t border-gray-100 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="material-symbols-outlined text-fh-600 text-[16px]">all_inclusive</span>
                    Accès à vie
                  </div>
                  {formation.hasCertificate && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="material-symbols-outlined text-fh-600 text-[16px]">workspace_premium</span>
                      Certificat de complétion
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="material-symbols-outlined text-fh-600 text-[16px]">devices</span>
                    Accessible sur mobile & desktop
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="material-symbols-outlined text-fh-600 text-[16px]">event_available</span>
                    Remboursement 14 jours
                  </div>
                </div>
              </div>
            </div>

            {/* Instructeur card */}
            <Link
              href={`/formations/instructeurs/${formation.instructeur.userId}`}
              className="block bg-white rounded-lg border border-gray-100 shadow-sm p-5 hover:border-fh-600/30 transition-colors"
            >
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Formateur</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-fh-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {formation.instructeur.image ? (
                    <img src={formation.instructeur.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    initials(formation.instructeur.name)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {formation.instructeur.name ?? "Formateur"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {formation.instructeur.yearsExp > 0
                      ? `${formation.instructeur.yearsExp} an(s) d'expérience`
                      : "Nouveau formateur"}
                  </p>
                </div>
                <span className="material-symbols-outlined text-gray-500 text-[18px]">chevron_right</span>
              </div>
              {formation.instructeur.bio && (
                <p className="text-xs text-gray-600 mt-3 line-clamp-3 leading-relaxed">
                  {formation.instructeur.bio}
                </p>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
