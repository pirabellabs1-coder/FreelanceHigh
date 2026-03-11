"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ApiReview {
  id: string;
  clientName: string;
  clientAvatar: string;
  clientCountry: string;
  rating: number;
  qualite: number;
  communication: number;
  delai: number;
  comment: string;
  reply: string | null;
  createdAt: string;
}

interface ApiService {
  id: string;
  slug: string;
  title: string;
  basePrice: number;
  rating: number;
  ratingCount: number;
  image: string;
  categoryName: string;
}

interface AgencyProfile {
  title: string;
  bio: string;
  photo: string;
  coverPhoto: string;
  city: string;
  country: string;
  skills: string[];
  languages: string[];
  badges: string[];
}

interface ApiAgency {
  id: string;
  name: string;
  plan: string;
  kyc: number;
  memberSince: string;
  profile: AgencyProfile | null;
  isVerified: boolean;
  services: ApiService[];
  reviews: ApiReview[];
  stats: {
    completedOrders: number;
    avgRating: number;
    totalReviews: number;
    activeServices: number;
    teamSize: number;
  };
}

type Tab = "services" | "avis";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0f1117] animate-pulse">
      <div className="bg-gradient-to-b from-[#1a1f2e] to-[#0f1117] border-b border-white/10 py-8">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 flex gap-6">
          <div className="w-24 h-24 rounded-2xl bg-white/5 flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-7 bg-white/5 rounded w-48" />
            <div className="h-4 bg-white/5 rounded w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AgencyProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [agency, setAgency] = useState<ApiAgency | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("services");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/public/agences/${id}`)
      .then((res) => {
        if (res.status === 404) { setNotFound(true); return null; }
        return res.ok ? res.json() : null;
      })
      .then((data) => {
        if (data?.agency) setAgency(data.agency);
        else if (!notFound) setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <PageSkeleton />;

  if (notFound || !agency) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-6xl text-slate-600">apartment</span>
        <h1 className="text-xl font-bold text-white">Agence introuvable</h1>
        <Link href="/feed" className="text-primary hover:underline text-sm">
          Retour au feed
        </Link>
      </div>
    );
  }

  const { profile, stats, services, reviews } = agency;
  const memberSinceYear = agency.memberSince ? new Date(agency.memberSince).getFullYear() : "—";

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "services", label: "Services", count: services.length },
    { key: "avis", label: "Avis", count: reviews.length },
  ];

  return (
    <div className="min-h-screen bg-[#0f1117]">
      {/* Hero */}
      <div className="bg-gradient-to-b from-[#1a1f2e] to-[#0f1117] border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 py-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Logo */}
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-primary/20 flex-shrink-0 border-2 border-primary/30 flex items-center justify-center">
              {profile?.photo ? (
                <Image
                  src={profile.photo}
                  alt={agency.name}
                  width={96}
                  height={96}
                  className="rounded-2xl object-cover w-full h-full"
                  onError={() => {}}
                  unoptimized
                />
              ) : (
                <span className="material-symbols-outlined text-primary text-4xl">apartment</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-white">{agency.name}</h1>
                    <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold">
                      Agence
                    </span>
                  </div>
                  {profile?.title && (
                    <p className="text-primary font-medium">{profile.title}</p>
                  )}
                  {(profile?.city || profile?.country) && (
                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                      <span className="material-symbols-outlined text-base">location_on</span>
                      <span>{[profile.city, profile.country].filter(Boolean).join(", ")}</span>
                    </div>
                  )}
                </div>

                {session && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-[#0f1117] font-bold rounded-xl hover:brightness-110 transition-all text-sm">
                    <span className="material-symbols-outlined text-lg">chat_bubble</span>
                    Contacter l&apos;agence
                  </button>
                )}
              </div>

              {/* Badges */}
              {(profile?.badges || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile!.badges.map((badge) => (
                    <span
                      key={badge}
                      className="flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-semibold"
                    >
                      <span className="material-symbols-outlined text-sm">verified</span>
                      {badge}
                    </span>
                  ))}
                  {agency.isVerified && (
                    <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-semibold">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      Agence Vérifiée
                    </span>
                  )}
                </div>
              )}

              {/* Quick stats */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                {stats.avgRating > 0 && (
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="material-symbols-outlined text-yellow-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-bold text-white">{stats.avgRating.toFixed(1)}</span>
                    <span className="text-slate-500">({stats.totalReviews} avis)</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="material-symbols-outlined text-base">task_alt</span>
                  {stats.completedOrders} projets livrés
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="material-symbols-outlined text-base">calendar_month</span>
                  Fondée en {memberSinceYear}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="flex border-b border-white/10 mb-6">
              {tabs.map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors",
                    activeTab === key
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-500 hover:text-white"
                  )}
                >
                  {label}
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full font-bold",
                    activeTab === key ? "bg-primary/20 text-primary" : "bg-white/10 text-slate-400"
                  )}>
                    {count}
                  </span>
                </button>
              ))}
            </div>

            {/* Services tab */}
            {activeTab === "services" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.length === 0 ? (
                  <p className="text-sm text-slate-500">Aucun service publié.</p>
                ) : (
                  services.map((service) => (
                    <Link
                      key={service.id}
                      href={`/feed/service/${service.id}`}
                      className="bg-[#1a1f2e] rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 transition-colors flex flex-col"
                    >
                      <div className="relative aspect-[16/9] bg-white/5">
                        {service.image && (
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover"
                            onError={() => {}}
                            unoptimized
                          />
                        )}
                      </div>
                      <div className="p-3 flex-1 flex flex-col">
                        <p className="text-sm font-semibold text-white line-clamp-2 flex-1 mb-2">
                          {service.title}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-yellow-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="text-xs text-yellow-400 font-semibold">{service.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-sm font-bold text-white">€{service.basePrice}</span>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}

            {/* Avis tab */}
            {activeTab === "avis" && (
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-sm text-slate-500">Aucun avis pour l&apos;instant.</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-[#1a1f2e] rounded-xl p-4 border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {review.clientAvatar ? (
                            <Image
                              src={review.clientAvatar}
                              alt={review.clientName}
                              width={32}
                              height={32}
                              className="rounded-full"
                              onError={() => {}}
                              unoptimized
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="material-symbols-outlined text-primary text-sm">person</span>
                            </div>
                          )}
                          <span className="text-sm font-semibold text-white">{review.clientName}</span>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s} className={cn("material-symbols-outlined text-sm", s <= review.rating ? "text-yellow-400" : "text-white/10")} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-300">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-4">
            {/* Description */}
            {profile?.bio && (
              <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-4">
                <h3 className="text-sm font-bold text-white mb-2">Notre agence</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Expertises */}
            {(profile?.skills || []).length > 0 && (
              <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-4">
                <h3 className="text-sm font-bold text-white mb-3">Expertises</h3>
                <div className="flex flex-wrap gap-1.5">
                  {profile!.skills.map((skill) => (
                    <span key={skill} className="text-xs bg-white/5 border border-white/10 text-slate-300 px-2.5 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Chiffres */}
            <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-white mb-3">En chiffres</h3>
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Projets livrés</span>
                  <span className="text-white font-semibold">{stats.completedOrders}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Services actifs</span>
                  <span className="text-white font-semibold">{stats.activeServices}</span>
                </div>
                {(profile?.languages || []).length > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Langues</span>
                    <span className="text-white font-semibold">{profile!.languages.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>

            {!session ? (
              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 text-center">
                <p className="text-xs text-slate-300 mb-3">
                  Inscrivez-vous pour contacter cette agence.
                </p>
                <Link
                  href="/inscription"
                  className="flex items-center justify-center w-full py-2.5 bg-primary text-[#0f1117] font-bold rounded-xl text-sm hover:brightness-110 transition-all"
                >
                  S&apos;inscrire gratuitement
                </Link>
              </div>
            ) : (
              <button className="w-full py-3 bg-primary text-[#0f1117] font-bold rounded-xl hover:brightness-110 transition-all text-sm">
                Contacter l&apos;agence
              </button>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
