"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

// ============================================================
// Demo data
// ============================================================

interface PortfolioProject {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

interface Skill {
  name: string;
  level: string;
  percent: number;
}

interface Review {
  id: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
}

interface FreelancerProfile {
  username: string;
  name: string;
  title: string;
  location: string;
  experience: string;
  languages: string;
  available: boolean;
  bio: string[];
  coverImage: string;
  avatar: string;
  skills: Skill[];
  tags: string[];
  portfolio: PortfolioProject[];
  reviews: Review[];
  stats: { label: string; value: string }[];
}

const DEMO_FREELANCER: FreelancerProfile = {
  username: "alexandre-rivera",
  name: "Alexandre Rivera",
  title: "Developpeur Full-Stack Senior & Designer UI/UX",
  location: "Paris, France",
  experience: "10+ ans d'experience",
  languages: "Francais, Anglais",
  available: true,
  bio: [
    "Passionne par la creation d'experiences numeriques exceptionnelles, j'accompagne les startups et les entreprises dans le developpement de produits web robustes et esthetiques. Mon approche combine une expertise technique approfondie en architecture logicielle avec une sensibilite design centree sur l'utilisateur.",
    "Specialise en React, Node.js et TypeScript, je transforme des idees complexes en solutions simples, scalables et performantes.",
  ],
  coverImage:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop",
  avatar:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  skills: [
    { name: "React / Next.js", level: "Expert", percent: 95 },
    { name: "Node.js / Express", level: "Expert", percent: 90 },
    { name: "UI/UX Design", level: "Avance", percent: 85 },
    { name: "TypeScript", level: "Expert", percent: 92 },
    { name: "PostgreSQL / MongoDB", level: "Avance", percent: 80 },
  ],
  tags: ["TailwindCSS", "Docker", "Figma", "GraphQL", "Firebase"],
  portfolio: [
    {
      id: "p1",
      title: "SaaS Analytics Platform",
      subtitle: "UI/UX & Frontend Development",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    },
    {
      id: "p2",
      title: "Eco-Commerce Mobile App",
      subtitle: "React Native & Node.js",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    },
    {
      id: "p3",
      title: "Creative Agency Website",
      subtitle: "Design & Webflow",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    },
    {
      id: "p4",
      title: "Fintech Wealth Management",
      subtitle: "Full-stack Engineering",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
    },
  ],
  reviews: [
    {
      id: "r1",
      author: "Marc Leroy",
      role: "CEO de Techni-Soft",
      avatar: "ML",
      rating: 5,
      text: '"Alexandre a fait un travail remarquable sur notre plateforme SaaS. Non seulement il est techniquement excellent, mais il comprend parfaitement les enjeux business."',
    },
    {
      id: "r2",
      author: "Sophie Durant",
      role: "Directrice Produit",
      avatar: "SD",
      rating: 4.5,
      text: '"Un grand professionnalisme et une communication fluide. Le projet a ete livre en avance avec une qualite de code irreprochable."',
    },
  ],
  stats: [
    { label: "Reussite", value: "98%" },
    { label: "Projets", value: "150+" },
    { label: "Note client", value: "4.9/5" },
    { label: "Rep. moyenne", value: "2h" },
  ],
};

function StarRating({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(
        <span key={i} className="material-symbols-outlined text-sm fill-icon text-primary">
          star
        </span>
      );
    } else if (i - 0.5 <= rating) {
      stars.push(
        <span key={i} className="material-symbols-outlined text-sm fill-icon text-primary">
          star_half
        </span>
      );
    } else {
      stars.push(
        <span key={i} className="material-symbols-outlined text-sm text-slate-400">
          star
        </span>
      );
    }
  }
  return <div className="flex">{stars}</div>;
}

// ============================================================
// Page Component
// ============================================================

export default function FreelanceProfilePage() {
  const params = useParams();
  const _username = params.username as string;
  const freelancer = DEMO_FREELANCER;
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="w-full max-w-[1100px] px-4 md:px-10 py-8">
        {/* Hero / Header */}
        <div className="relative w-full">
          {/* Cover Image */}
          <div
            className="w-full bg-center bg-no-repeat bg-cover rounded-xl min-h-[260px] relative overflow-hidden shadow-xl"
            style={{ backgroundImage: `url("${freelancer.coverImage}")` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent" />
          </div>

          {/* Profile Info Row */}
          <div className="flex flex-col md:flex-row gap-6 px-6 -mt-16 relative z-10">
            {/* Avatar */}
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-2xl border-4 border-background-dark w-40 h-40 shadow-2xl shrink-0"
              style={{ backgroundImage: `url("${freelancer.avatar}")` }}
            />

            {/* Name & Info */}
            <div className="flex flex-col justify-end pb-2 flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-extrabold tracking-tight">
                  {freelancer.name}
                </h1>
                {freelancer.available && (
                  <div className="flex h-7 items-center justify-center gap-x-1.5 rounded-full bg-primary/20 px-3 border border-primary/30">
                    <span className="material-symbols-outlined text-primary text-sm fill-icon">
                      check_circle
                    </span>
                    <p className="text-primary text-xs font-bold uppercase tracking-wider">
                      Disponible maintenant
                    </p>
                  </div>
                )}
              </div>
              <p className="text-primary text-lg font-semibold">{freelancer.title}</p>
              <div className="flex flex-wrap gap-4 mt-2 text-slate-500 dark:text-slate-400 text-sm">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">location_on</span>{" "}
                  {freelancer.location}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">work_history</span>{" "}
                  {freelancer.experience}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">translate</span>{" "}
                  {freelancer.languages}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-end gap-3 pb-2 self-start md:self-end">
              <button
                onClick={() => setContactOpen(!contactOpen)}
                className="h-11 px-6 rounded-lg bg-primary/10 border border-primary/30 text-primary font-bold hover:bg-primary/20 transition-all"
              >
                Contacter
              </button>
              <Link
                href="/inscription"
                className="h-11 px-6 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center"
              >
                Recruter
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Quick Form (toggle) */}
        {contactOpen && (
          <div className="mt-6 bg-primary/5 dark:bg-white/5 border border-primary/10 rounded-xl p-6">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">mail</span>
              Envoyer un message
            </h3>
            <textarea
              className="w-full p-3 rounded-lg border border-primary/20 bg-white dark:bg-neutral-dark text-sm outline-none focus:ring-1 focus:ring-primary resize-none"
              rows={3}
              placeholder="Decrivez votre projet..."
            />
            <button className="mt-3 px-6 py-2.5 bg-primary text-white font-bold rounded-lg text-sm hover:opacity-90 transition-all">
              Envoyer
            </button>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* About */}
            <section>
              <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person</span> A
                propos
              </h3>
              <div className="bg-primary/5 dark:bg-white/5 p-6 rounded-xl border border-primary/10">
                {freelancer.bio.map((p, i) => (
                  <p
                    key={i}
                    className={cn(
                      "text-slate-700 dark:text-slate-300 leading-relaxed",
                      i > 0 && "mt-4"
                    )}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </section>

            {/* Portfolio */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">collections</span>{" "}
                  Portfolio
                </h3>
                <button className="text-primary text-sm font-semibold hover:underline">
                  Voir tout
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {freelancer.portfolio.map((project) => (
                  <div
                    key={project.id}
                    className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/10 transition-colors z-10" />
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={project.image}
                      alt={project.title}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                      <p className="text-white font-bold">{project.title}</p>
                      <p className="text-white/80 text-xs">{project.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section>
              <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">star</span> Avis
                clients ({freelancer.reviews.length})
              </h3>
              <div className="space-y-4">
                {freelancer.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-primary/5 dark:bg-white/5 p-5 rounded-xl border border-primary/5"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                          {review.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{review.author}</p>
                          <p className="text-slate-500 text-xs">{review.role}</p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-slate-700 dark:text-slate-400 text-sm italic">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-8">
            {/* Skills */}
            <div className="bg-primary/5 dark:bg-white/5 p-6 rounded-2xl border border-primary/10 shadow-sm">
              <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">psychology</span>{" "}
                Competences
              </h3>
              <div className="space-y-5">
                {freelancer.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-primary font-bold">{skill.level}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-700"
                        style={{ width: `${skill.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-primary/10 flex flex-wrap gap-2">
                {freelancer.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-primary p-6 rounded-2xl text-white shadow-xl shadow-primary/10">
              <h4 className="font-bold mb-4 opacity-90">Statistiques cles</h4>
              <div className="grid grid-cols-2 gap-4">
                {freelancer.stats.map((stat) => (
                  <div key={stat.label} className="bg-white/10 p-3 rounded-xl">
                    <p className="text-2xl font-black">{stat.value}</p>
                    <p className="text-[10px] uppercase tracking-wider opacity-80">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-6 py-2">
              <a
                className="text-slate-400 hover:text-primary transition-colors"
                href="#"
                aria-label="LinkedIn"
              >
                <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.493-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-2v-3.86c0-.881-.719-1.6-1.6-1.6s-1.6.719-1.6 1.6v3.86h-2v-6h2v1.135c.671-.647 1.62-1.135 2.6-1.135 1.989 0 3.6 1.611 3.6 3.6v2.399z" />
                </svg>
              </a>
              <a
                className="text-slate-400 hover:text-primary transition-colors"
                href="#"
                aria-label="GitHub"
              >
                <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                className="text-slate-400 hover:text-primary transition-colors"
                href="#"
                aria-label="Instagram"
              >
                <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
