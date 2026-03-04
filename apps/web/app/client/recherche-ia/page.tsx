"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ============================================================
// Types & Demo Data
// ============================================================

interface ExtractedEntity {
  icon: string;
  label: string;
  isPrimary: boolean;
}

interface AIResult {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  skills: string[];
  availability: string;
  availabilityColor: string;
  rate: string;
  isPerfectMatch: boolean;
}

const DEMO_RESULTS: AIResult[] = [
  {
    id: "1",
    name: "Amadou Diop",
    title: "Expert React Native & Node.js",
    avatar: "AD",
    bio: "Specialiste des apps logistiques. Deja realise 3 apps de livraison avec temps reel et paiement Stripe.",
    skills: ["Flutter", "Firebase", "Mapbox"],
    availability: "Immediate",
    availabilityColor: "text-green-500",
    rate: "450k - 550k CFA",
    isPerfectMatch: true,
  },
  {
    id: "2",
    name: "Sarah Kone",
    title: "Full-stack Developer",
    avatar: "SK",
    bio: "Capable de livrer un MVP en 10 jours. Forte experience en integration de APIs de geolocalisation.",
    skills: ["React Native", "Node.js"],
    availability: "Sous 3 jours",
    availabilityColor: "text-slate-300",
    rate: "480k CFA",
    isPerfectMatch: false,
  },
  {
    id: "3",
    name: "Jean-Luc Mensah",
    title: "Backend & API Specialist",
    avatar: "JM",
    bio: "Specialise dans les systemes de paiement locaux (Mobile Money). Rapide et efficace.",
    skills: ["Python", "Django"],
    availability: "Immediate",
    availabilityColor: "text-green-500",
    rate: "520k CFA",
    isPerfectMatch: false,
  },
];

// ============================================================
// Page Component
// ============================================================

export default function RechercheIAPage() {
  const [query, setQuery] = useState(
    "Je cherche quelqu'un pour creer une app de livraison en 2 semaines avec un budget de 500k"
  );
  const [searched, setSearched] = useState(true);
  const [results, setResults] = useState<AIResult[]>(DEMO_RESULTS);

  const extractedEntities: ExtractedEntity[] = [
    { icon: "payments", label: "Budget: 500k CFA", isPrimary: true },
    { icon: "schedule", label: "Delai: 2 semaines", isPrimary: true },
    { icon: "app_shortcut", label: "App de livraison", isPrimary: false },
    { icon: "code", label: "Developpement Mobile", isPrimary: false },
  ];

  function handleSearch() {
    if (!query.trim()) return;
    setSearched(true);
    setResults(DEMO_RESULTS);
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Sidebar (inherits from client layout) is handled by parent */}
      <div className="flex-1 flex flex-col items-center">
        {/* Hero Search Section */}
        <section className="w-full max-w-4xl px-6 pt-12 pb-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <span className="material-symbols-outlined text-sm">neurology</span>
            Moteur IA Actif
          </div>

          <h1 className="text-slate-900 dark:text-white tracking-tight text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Recherche Intelligente par IA
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mb-10">
            Decrivez votre besoin en langage naturel. Notre IA analyse vos contraintes de
            budget, de delai et de competences.
          </p>

          {/* Search Bar with glow */}
          <div className="w-full relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-blue-500/50 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
            <div className="relative flex flex-col w-full bg-white dark:bg-neutral-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-2xl p-2">
              <div className="flex items-center gap-3 px-4 h-14">
                <span className="material-symbols-outlined text-primary">search</span>
                <input
                  className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-slate-900 dark:text-white text-lg placeholder:text-slate-400"
                  placeholder="Decrivez votre projet ici..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
                <button
                  onClick={handleSearch}
                  className="bg-primary text-white p-2 rounded-lg flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>

              {/* Extracted entities */}
              {searched && (
                <div className="flex gap-2 p-3 border-t border-slate-100 dark:border-border-dark overflow-x-auto">
                  {extractedEntities.map((entity) => (
                    <div
                      key={entity.label}
                      className={cn(
                        "flex h-8 shrink-0 items-center gap-2 rounded-lg px-3",
                        entity.isPrimary
                          ? "bg-primary/20 border border-primary/30"
                          : "bg-slate-100 dark:bg-border-dark"
                      )}
                    >
                      <span
                        className={cn(
                          "material-symbols-outlined text-sm",
                          entity.isPrimary ? "text-primary" : ""
                        )}
                      >
                        {entity.icon}
                      </span>
                      <p
                        className={cn(
                          "text-xs font-bold",
                          entity.isPrimary
                            ? "text-primary"
                            : "text-slate-600 dark:text-slate-300"
                        )}
                      >
                        {entity.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Results Section */}
        {searched && (
          <section className="w-full max-w-6xl px-6 py-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                Resultats analyses par l&apos;IA
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Trier par:</span>
                <button className="font-bold text-primary flex items-center gap-1">
                  Pertinence IA{" "}
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <div
                  key={result.id}
                  className={cn(
                    "group relative bg-white dark:bg-neutral-dark border rounded-xl overflow-hidden transition-all shadow-md hover:shadow-lg",
                    result.isPerfectMatch
                      ? "border-primary/40 hover:border-primary shadow-lg hover:shadow-primary/5"
                      : "border-slate-200 dark:border-border-dark hover:border-primary/50"
                  )}
                >
                  {/* Match badge */}
                  {result.isPerfectMatch && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded flex items-center gap-1 uppercase tracking-tighter">
                        <span className="material-symbols-outlined text-[12px] font-bold">
                          verified
                        </span>
                        Match Parfait
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Freelancer info */}
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={cn(
                          "size-14 rounded-full flex items-center justify-center font-bold text-lg",
                          result.isPerfectMatch
                            ? "bg-primary/20 text-primary border-2 border-primary"
                            : "bg-slate-200 dark:bg-border-dark text-slate-600 dark:text-slate-300"
                        )}
                      >
                        {result.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{result.name}</h4>
                        <p className="text-primary text-sm font-medium">{result.title}</p>
                      </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                      {result.bio}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {result.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-slate-100 dark:bg-border-dark rounded text-[10px] font-bold uppercase tracking-wide"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Availability & Rate */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-border-dark">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">
                          Disponibilite
                        </p>
                        <p className={cn("text-sm font-bold", result.availabilityColor)}>
                          {result.availability}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-500 uppercase font-bold">
                          Tarif estime
                        </p>
                        <p className="text-sm font-bold">{result.rate}</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href="/freelances/demo"
                    className={cn(
                      "w-full py-3 font-bold text-sm transition-colors flex items-center justify-center",
                      result.isPerfectMatch
                        ? "bg-primary/10 hover:bg-primary text-primary hover:text-white"
                        : "bg-slate-50 dark:bg-border-dark/30 hover:bg-primary text-slate-700 dark:text-slate-300 hover:text-white border-t border-slate-100 dark:border-border-dark"
                    )}
                  >
                    Voir le profil
                  </Link>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-12 flex flex-col items-center">
              <p className="text-slate-500 text-sm mb-4 font-medium tracking-wide uppercase">
                L&apos;IA a identifie 12 autres profils pertinents
              </p>
              <button className="flex items-center gap-2 px-8 py-3 rounded-full border border-primary text-primary font-bold hover:bg-primary/5 transition-colors">
                Afficher plus de resultats
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
