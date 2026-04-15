"use client";

import { useState } from "react";

const mentors = [
  {
    id: 1,
    name: "Éric Mensah",
    initials: "EM",
    gradient: "from-blue-500 to-blue-700",
    specialty: "Facebook Ads & Marketing Digital",
    domain: "Marketing",
    bio: "10 ans d'expérience en growth marketing pour des marques africaines. Formé +1 200 freelances.",
    rating: 4.9,
    reviews: 247,
    students: 1284,
    sessionPrice: 25000,
    sessionDuration: "60 min",
    languages: ["Français", "Anglais"],
    badges: ["Top Mentor", "Vérifié"],
    available: true,
  },
  {
    id: 2,
    name: "Aminata Koné",
    initials: "AK",
    gradient: "from-purple-500 to-purple-700",
    specialty: "Développement Web & React",
    domain: "Dev",
    bio: "Développeuse full-stack Senior chez une startup fintech. Passionnée par la transmission et le mentorat.",
    rating: 4.8,
    reviews: 183,
    students: 967,
    sessionPrice: 35000,
    sessionDuration: "60 min",
    languages: ["Français"],
    badges: ["Expert Tech", "Vérifié"],
    available: true,
  },
  {
    id: 3,
    name: "David Kabore",
    initials: "DK",
    gradient: "from-orange-500 to-orange-700",
    specialty: "Design UI/UX & Branding",
    domain: "Design",
    bio: "Designer indépendant avec un portfolio de +120 projets. Spécialiste de l'identité visuelle pour TPE/PME africaines.",
    rating: 4.7,
    reviews: 98,
    students: 542,
    sessionPrice: 20000,
    sessionDuration: "45 min",
    languages: ["Français", "Mooré"],
    badges: ["Vérifié"],
    available: false,
  },
  {
    id: 4,
    name: "Carine Aboua",
    initials: "CA",
    gradient: "from-pink-500 to-rose-600",
    specialty: "Copywriting & Personal Branding",
    domain: "Marketing",
    bio: "Copywriteuse freelance et coach personnel branding. A aidé +300 entrepreneurs à se positionner sur les réseaux.",
    rating: 5.0,
    reviews: 74,
    students: 388,
    sessionPrice: 18000,
    sessionDuration: "60 min",
    languages: ["Français"],
    badges: ["Rising Star", "Vérifié"],
    available: true,
  },
  {
    id: 5,
    name: "Moussa Diallo",
    initials: "MD",
    gradient: "from-teal-500 to-teal-700",
    specialty: "Finance Personnelle & Investissement",
    domain: "Business",
    bio: "Consultant financier indépendant. Expert en gestion patrimoniale adaptée aux marchés africains et diaspora.",
    rating: 4.9,
    reviews: 131,
    students: 710,
    sessionPrice: 40000,
    sessionDuration: "90 min",
    languages: ["Français", "Anglais", "Wolof"],
    badges: ["Top Mentor", "Vérifié"],
    available: true,
  },
  {
    id: 6,
    name: "Jean-Pierre Nkomo",
    initials: "JN",
    gradient: "from-indigo-500 to-indigo-700",
    specialty: "Intelligence Artificielle & Automatisation",
    domain: "Dev",
    bio: "Data scientist et entrepreneur tech. Aide les freelances à intégrer l'IA dans leurs services pour se différencier.",
    rating: 4.8,
    reviews: 59,
    students: 294,
    sessionPrice: 45000,
    sessionDuration: "60 min",
    languages: ["Français", "Anglais"],
    badges: ["Expert Tech", "Vérifié"],
    available: true,
  },
];

const domains = ["Tous", "Marketing", "Dev", "Design", "Business"];

const badgeConfig: Record<string, { className: string }> = {
  "Top Mentor": { className: "bg-yellow-100 text-yellow-700" },
  Vérifié: { className: "bg-green-100 text-green-700" },
  "Expert Tech": { className: "bg-blue-100 text-blue-700" },
  "Rising Star": { className: "bg-purple-100 text-purple-700" },
};

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className="material-symbols-outlined text-[14px]"
            style={{
              color: star <= Math.round(rating) ? "#f59e0b" : "#d1d5db",
              fontVariationSettings: "'FILL' 1",
            }}
          >
            star
          </span>
        ))}
      </div>
      <span className="text-sm font-bold text-[#191c1e]">{rating.toFixed(1)}</span>
      <span className="text-xs text-[#5c647a]">({reviews} avis)</span>
    </div>
  );
}

export default function MentorsPage() {
  const [activeDomain, setActiveDomain] = useState("Tous");
  const [search, setSearch] = useState("");

  const filtered = mentors.filter((m) => {
    const matchDomain = activeDomain === "Tous" || m.domain === activeDomain;
    const matchSearch =
      search.trim() === "" ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.specialty.toLowerCase().includes(search.toLowerCase()) ||
      m.domain.toLowerCase().includes(search.toLowerCase());
    return matchDomain && matchSearch;
  });

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#006e2f] via-[#005a26] to-[#003d1b] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm font-semibold px-4 py-2 rounded-full mb-5">
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            Mentorat 1:1
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5">
            Trouvez votre mentor
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Des experts africains qui vous accompagnent en session individuelle pour accélérer votre carrière.
          </p>
          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#5c647a] text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Chercher un mentor, une spécialité…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-5 py-4 rounded-2xl text-[#191c1e] text-sm font-medium outline-none focus:ring-2 focus:ring-[#22c55e] bg-white shadow-lg placeholder:text-gray-400"
            />
          </div>
        </div>
      </section>

      {/* Domain filters */}
      <section className="bg-white border-b border-gray-100 py-4 px-4 sticky top-[72px] z-30">
        <div className="max-w-5xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="material-symbols-outlined text-[#5c647a] text-[18px] flex-shrink-0">tune</span>
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
          <span className="ml-auto text-xs text-[#5c647a] flex-shrink-0 font-medium pl-4">
            {filtered.length} mentor{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </section>

      {/* Mentor grid */}
      <section className="py-10 px-4 bg-[#f7f9fb] min-h-[60vh]">
        <div className="max-w-5xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-[#5c647a]">
              <span className="material-symbols-outlined text-[56px] block mb-3 text-gray-300">
                person_search
              </span>
              <p className="font-semibold text-[#191c1e] mb-1">Aucun mentor trouvé</p>
              <p className="text-sm">Essayez un autre domaine ou modifiez votre recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col"
                >
                  {/* Card top / avatar */}
                  <div className={`h-24 bg-gradient-to-br ${mentor.gradient} relative flex items-end px-5 pb-0`}>
                    {mentor.available ? (
                      <span className="absolute top-3 right-3 flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                        Disponible
                      </span>
                    ) : (
                      <span className="absolute top-3 right-3 flex items-center gap-1 bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full inline-block"></span>
                        Indisponible
                      </span>
                    )}
                    {/* Avatar bubble */}
                    <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center translate-y-8 border-2 border-white overflow-hidden">
                      <span className={`text-lg font-extrabold bg-gradient-to-br ${mentor.gradient} bg-clip-text text-transparent`}>
                        {mentor.initials}
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="pt-10 px-5 pb-5 flex flex-col flex-1">
                    {/* Name + badges */}
                    <div className="mb-1">
                      <h3 className="font-bold text-[#191c1e] text-base">{mentor.name}</h3>
                      <p className="text-xs text-[#5c647a] font-medium">{mentor.specialty}</p>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3 mt-2">
                      {mentor.badges.map((badge) => (
                        <span
                          key={badge}
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            badgeConfig[badge]?.className ?? "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>

                    {/* Rating */}
                    <StarRating rating={mentor.rating} reviews={mentor.reviews} />

                    {/* Bio */}
                    <p className="text-xs text-[#5c647a] leading-relaxed mt-3 mb-4 flex-1 line-clamp-3">
                      {mentor.bio}
                    </p>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 mb-4 text-xs text-[#5c647a]">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">school</span>
                        <span>{mentor.students.toLocaleString("fr-FR")} apprenants</span>
                      </div>
                      <span>·</span>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        <span>{mentor.sessionDuration}</span>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="flex flex-wrap gap-1 mb-5">
                      {mentor.languages.map((lang) => (
                        <span
                          key={lang}
                          className="text-xs px-2 py-0.5 rounded-full bg-[#f7f9fb] text-[#5c647a] border border-gray-200"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>

                    {/* Price + CTA */}
                    <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                      <div>
                        <p className="font-extrabold text-[#191c1e] text-base">
                          {mentor.sessionPrice.toLocaleString("fr-FR")} FCFA
                        </p>
                        <p className="text-xs text-[#5c647a]">
                          ≈ {Math.round(mentor.sessionPrice / 655.957)} € / session
                        </p>
                      </div>
                      <button
                        disabled={!mentor.available}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          mentor.available
                            ? "bg-[#006e2f] text-white hover:bg-[#005a26] shadow-sm hover:shadow"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {mentor.available ? "calendar_add_on" : "event_busy"}
                        </span>
                        {mentor.available ? "Réserver" : "Complet"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA become mentor */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#e8f5e9] flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-[32px] text-[#006e2f]">school</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#191c1e] mb-3">
            Devenez mentor sur FreelanceHigh
          </h2>
          <p className="text-[#5c647a] text-base mb-8 max-w-lg mx-auto">
            Partagez votre expertise en 1:1, fixez vos propres tarifs et développez une nouvelle source de revenus. Les candidatures sont ouvertes.
          </p>
          <button className="inline-flex items-center gap-2 bg-[#006e2f] text-white font-bold px-7 py-3.5 rounded-2xl text-sm shadow-lg hover:bg-[#005a26] hover:shadow-xl transition-all hover:-translate-y-0.5">
            <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
            Postuler comme mentor
          </button>
        </div>
      </section>
    </>
  );
}
