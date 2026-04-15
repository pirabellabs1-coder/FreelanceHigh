"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// ─── Mentor shape (matches /api/formations/mentors response) ────────────────
type Mentor = {
  id: string;
  userId: string;
  name: string | null;
  image: string | null;
  specialty: string;
  domain: string | null;
  bio: string;
  coverImage: string | null;
  sessionPrice: number;
  sessionDuration: number;
  languages: string[];
  badges: string[];
  available: boolean;
  isVerified: boolean;
  rating: number;
  reviews: number;
  students: number;
  totalSessions: number;
  // Derived (UI helpers)
  cover?: string;
  initials?: string;
  gradient?: string;
  sessionDurationLabel?: string;
};

// Default cover photos (rotated based on mentor id hash) — shown when mentor hasn't set a cover
const DEFAULT_COVERS = [
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
  "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=800&q=80",
  "https://images.unsplash.com/photo-1557425493-6f90ae4659fc?w=800&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
];

function coverFor(m: Mentor): string {
  if (m.coverImage) return m.coverImage;
  const hash = m.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return DEFAULT_COVERS[hash % DEFAULT_COVERS.length];
}

function initialsOf(name: string | null): string {
  if (!name) return "??";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function gradientFor(id: string): string {
  const gradients = [
    "from-blue-500 to-blue-700",
    "from-purple-500 to-pink-600",
    "from-emerald-500 to-teal-700",
    "from-amber-500 to-orange-600",
    "from-indigo-500 to-indigo-700",
    "from-rose-500 to-red-600",
  ];
  const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
}


const domains = ["Tous", "Marketing", "Dev", "Design", "Business"];

const badgeConfig: Record<string, { bg: string; text: string; icon: string }> = {
  "Top Mentor":    { bg: "bg-amber-50",  text: "text-amber-700",  icon: "emoji_events" },
  "Vérifié":       { bg: "bg-green-50",  text: "text-green-700",  icon: "verified" },
  "Expert Tech":   { bg: "bg-blue-50",   text: "text-blue-700",   icon: "code" },
  "Rising Star":   { bg: "bg-purple-50", text: "text-purple-700", icon: "star" },
};

export default function MentorsPage() {
  const [activeDomain, setActiveDomain] = useState("Tous");
  const [search, setSearch] = useState("");
  const [allMentors, setAllMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/formations/mentors");
        if (!res.ok) throw new Error();
        const json = await res.json();
        // Enrich with UI helpers so the existing card markup keeps working
        const enriched: Mentor[] = (json.data ?? []).map((m: Mentor) => ({
          ...m,
          cover: coverFor(m),
          initials: initialsOf(m.name),
          gradient: gradientFor(m.id),
          sessionDurationLabel: `${m.sessionDuration} min`,
        }));
        setAllMentors(enriched);
      } catch (err) {
        console.warn("[mentors page] fetch failed", err);
        setAllMentors([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = allMentors.filter((m) => {
    const matchDomain = activeDomain === "Tous" || m.domain === activeDomain;
    const q = search.trim().toLowerCase();
    const matchSearch =
      q === "" ||
      (m.name ?? "").toLowerCase().includes(q) ||
      m.specialty.toLowerCase().includes(q);
    return matchDomain && matchSearch;
  });

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        className="relative py-20 px-4 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #003d1b 0%, #006e2f 55%, #22c55e 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute bottom-0 -left-16 w-64 h-64 bg-white/5 rounded-full" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white text-sm font-semibold px-4 py-2 rounded-full mb-5 border border-white/20">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            Mentorat 1:1 · Experts africains
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
            Trouvez votre mentor
          </h1>
          <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Des professionnels qui vous accompagnent en session individuelle pour accélérer votre carrière freelance.
          </p>
          <div className="relative max-w-md mx-auto">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
            <input
              type="text"
              placeholder="Chercher un mentor, une spécialité…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-5 py-3.5 rounded-2xl text-[#191c1e] text-sm font-medium outline-none focus:ring-2 focus:ring-[#22c55e] bg-white shadow-xl placeholder:text-gray-400"
            />
          </div>
        </div>
      </section>

      {/* ── Domain filters ─────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-4 px-4 sticky top-[72px] z-30 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none">
          {domains.map((domain) => (
            <button
              key={domain}
              onClick={() => setActiveDomain(domain)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeDomain === domain
                  ? "bg-[#006e2f] text-white shadow-sm"
                  : "bg-[#f7f9fb] text-[#5c647a] hover:bg-green-50 hover:text-[#006e2f]"
              }`}
            >
              {domain}
            </button>
          ))}
          <span className="ml-auto text-xs text-[#5c647a] flex-shrink-0 font-medium pl-4 whitespace-nowrap">
            {filtered.length} mentor{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </section>

      {/* ── Mentor grid ────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-[#f7f9fb] min-h-[60vh]">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-28 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="w-14 h-14 bg-gray-200 rounded-2xl -mt-7" />
                    <div className="h-4 bg-gray-200 rounded-lg w-2/3" />
                    <div className="h-3 bg-gray-200 rounded-lg w-full" />
                    <div className="h-10 bg-gray-200 rounded-xl mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-[#5c647a]">
              <span className="material-symbols-outlined text-[56px] block mb-3 text-gray-300">person_search</span>
              <p className="font-semibold text-[#191c1e] mb-1">
                {allMentors.length === 0 ? "Aucun mentor inscrit pour l'instant" : "Aucun mentor trouvé"}
              </p>
              <p className="text-sm mb-4">
                {allMentors.length === 0
                  ? "Soyez le premier à proposer vos services de mentorat sur FreelanceHigh."
                  : "Essayez un autre domaine ou modifiez votre recherche."}
              </p>
              {allMentors.length === 0 && (
                <Link
                  href="/formations/inscription?role=mentor"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white text-sm font-bold"
                  style={{ background: "linear-gradient(to right, #006e2f, #22c55e)" }}
                >
                  <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
                  Devenir mentor
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA become mentor ──────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#e8f5e9] flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-[32px] text-[#006e2f]" style={{ fontVariationSettings: "'FILL' 1" }}>record_voice_over</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#191c1e] mb-3">Devenez mentor sur FreelanceHigh</h2>
          <p className="text-[#5c647a] text-base mb-8 max-w-lg mx-auto leading-relaxed">
            Partagez votre expertise en 1:1, fixez vos propres tarifs et développez une nouvelle source de revenus récurrents. Les candidatures sont ouvertes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/formations/inscription?role=mentor"
              className="inline-flex items-center justify-center gap-2 bg-[#006e2f] text-white font-bold px-8 py-3.5 rounded-2xl text-sm shadow-lg hover:bg-[#005a26] hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
              Postuler comme mentor
            </Link>
            <Link
              href="/formations/connexion"
              className="inline-flex items-center justify-center gap-2 border border-gray-200 text-[#5c647a] font-semibold px-8 py-3.5 rounded-2xl text-sm hover:bg-gray-50 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              J&apos;ai déjà un compte
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Beautiful Mentor Card ─────────────────────────────────────────────────────
function MentorCard({ mentor }: { mentor: Mentor }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group">

      {/* Cover photo */}
      <div className="relative h-28 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mentor.cover ?? coverFor(mentor)}
          alt={mentor.name ?? "Mentor"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Availability badge */}
        <div className={`absolute top-3 right-3 flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${mentor.available ? "bg-green-500 text-white" : "bg-gray-600 text-gray-200"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${mentor.available ? "bg-white" : "bg-gray-400"}`} />
          {mentor.available ? "Disponible" : "Complet"}
        </div>

        {/* Domain tag */}
        {mentor.domain && (
          <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
            {mentor.domain}
          </div>
        )}
      </div>

      {/* Avatar — overlapping cover */}
      <div className="relative px-5">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mentor.gradient ?? gradientFor(mentor.id)} flex items-center justify-center border-4 border-white shadow-lg -mt-7 relative z-10 overflow-hidden`}>
          {mentor.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mentor.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-white font-extrabold text-base tracking-tight">{mentor.initials ?? initialsOf(mentor.name)}</span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="px-5 pt-2 pb-5 flex flex-col flex-1">
        {/* Name + specialty */}
        <div className="mb-2">
          <h3 className="font-extrabold text-[#191c1e] text-base leading-tight">{mentor.name ?? "Mentor"}</h3>
          <p className="text-xs text-[#5c647a] font-medium mt-0.5 leading-snug">{mentor.specialty}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map((s) => (
              <span key={s} className="material-symbols-outlined text-[12px]"
                style={{ color: s <= Math.round(mentor.rating) ? "#f59e0b" : "#d1d5db", fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
            ))}
          </div>
          <span className="text-xs font-bold text-[#191c1e]">{mentor.rating.toFixed(1)}</span>
          <span className="text-xs text-[#5c647a]">({mentor.reviews})</span>
          <span className="text-[#5c647a] text-xs">·</span>
          <span className="text-xs text-[#5c647a]">{mentor.students.toLocaleString("fr-FR")} élèves</span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {mentor.badges.map((badge) => {
            const cfg = badgeConfig[badge] ?? { bg: "bg-gray-100", text: "text-gray-600", icon: "label" };
            return (
              <span key={badge} className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
                {badge}
              </span>
            );
          })}
          {/* Languages */}
          {mentor.languages.map((lang) => (
            <span key={lang} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-[#5c647a]">{lang}</span>
          ))}
        </div>

        {/* Bio */}
        <p className="text-xs text-[#5c647a] leading-relaxed line-clamp-2 flex-1 mb-4">{mentor.bio}</p>

        {/* Session info + CTAs */}
        <div className="border-t border-gray-100 pt-4 flex items-center justify-between gap-2">
          <div>
            <p className="font-extrabold text-[#006e2f] text-base">{mentor.sessionPrice.toLocaleString("fr-FR")} <span className="text-xs font-bold text-[#5c647a]">FCFA</span></p>
            <p className="text-[10px] text-[#5c647a]">{mentor.sessionDurationLabel ?? `${mentor.sessionDuration} min`} · ≈{Math.round(mentor.sessionPrice / 655.957)} €</p>
          </div>
          <div className="flex gap-1.5">
            <Link
              href={`/formations/mentors/${mentor.id}`}
              className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-bold bg-gray-100 text-[#191c1e] hover:bg-gray-200 transition-colors flex-shrink-0"
              title="Voir le profil complet"
            >
              <span className="material-symbols-outlined text-[14px]">person</span>
            </Link>
            <Link
              href={mentor.available ? `/formations/inscription?role=mentor&mentorId=${mentor.id}` : "#"}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                mentor.available
                  ? "bg-[#006e2f] text-white hover:bg-[#005a26] shadow-sm hover:shadow-md"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {mentor.available ? "calendar_add_on" : "event_busy"}
              </span>
              {mentor.available ? "Réserver" : "Complet"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
