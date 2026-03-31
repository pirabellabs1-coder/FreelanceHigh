/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCurrencyStore } from "@/store/currency";
import { BadgeDisplay } from "@/components/ui/BadgeDisplay";

interface TopFreelance {
  id: string;
  username: string;
  name: string;
  title: string;
  rating: number;
  skills: string[];
  dailyRateEur: number;
  completedOrders: number;
  reviewCount: number;
  badge: string;
  badges?: string[];
  image: string;
  location: string;
}

export function TopFreelancesSection() {
  const { format } = useCurrencyStore();
  const [freelances, setFreelances] = useState<TopFreelance[]>([]);
  const t = useTranslations("landing.top_freelances");

  useEffect(() => {
    fetch("/api/public/top-freelances?limit=3")
      .then((res) => (res.ok ? res.json() : { freelances: [] }))
      .then((data) => {
        if (Array.isArray(data.freelances)) setFreelances(data.freelances);
      })
      .catch(() => {});
  }, []);

  if (!freelances || freelances.length === 0) return null;

  return (
    <section className="bg-primary/5 dark:bg-primary/5 py-12 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        {/* Header centre */}
        <div className="text-center space-y-3 sm:space-y-6 mb-10 sm:mb-16 lg:mb-20">
          <h2 className="text-xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight">
            {t("title")}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
            {t("subtitle")}
          </p>
        </div>

        {/* Grid cards verticales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {freelances.map((f) => (
            <Link
              key={f.id}
              href={`/freelances/${f.username}`}
              className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-primary/5 hover:-translate-y-2 transition-all duration-300"
            >
              {/* Header: gradient background + avatar circulaire */}
              <div className="relative">
                <div className="h-24 sm:h-28 bg-gradient-to-br from-primary/80 via-primary/60 to-teal-600/70" />
                {/* Avatar circulaire centré */}
                <div className="flex justify-center -mt-12 sm:-mt-14 relative z-10">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden bg-primary/10 flex-shrink-0">
                    {f.image ? (
                      <img
                        alt={f.name}
                        className="w-full h-full object-cover"
                        src={f.image}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                        <span className="text-2xl sm:text-3xl font-extrabold text-primary/60">
                          {(f.name || "?").slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Badge sur le gradient */}
                {f.badges && f.badges.length > 0 ? (
                  <div className="absolute top-3 right-3">
                    <BadgeDisplay badges={f.badges} size="sm" maxDisplay={1} />
                  </div>
                ) : f.badge ? (
                  <div className="absolute top-3 right-3 bg-accent text-slate-900 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    {f.badge}
                  </div>
                ) : null}
                {/* Location */}
                {f.location && (
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">location_on</span>
                    {f.location}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="px-5 pb-5 pt-3 sm:px-8 sm:pb-8 sm:pt-4 text-center">
                <h4 className="text-lg sm:text-2xl font-bold mb-0.5 truncate">{f.name}</h4>
                <p className="text-xs sm:text-sm text-primary font-bold uppercase tracking-wider truncate mb-3 sm:mb-4">{f.title}</p>

                {/* Rating */}
                {(f.rating ?? 0) > 0 && (
                  <div className="flex items-center justify-center gap-1 mb-3 sm:mb-4">
                    <span
                      className="material-symbols-outlined text-base text-accent"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="text-base font-extrabold">{(f.rating ?? 0).toFixed(1)}</span>
                  </div>
                )}

                {/* Stats: ventes + avis */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-emerald-500">shopping_cart</span>
                    <span className="font-bold text-slate-900 dark:text-white">{f.completedOrders ?? 0}</span> vente{(f.completedOrders ?? 0) !== 1 ? "s" : ""}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-bold text-slate-900 dark:text-white">{f.reviewCount ?? 0}</span> avis
                  </div>
                </div>

                {(f.skills || []).length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-5">
                    {(f.skills || []).map((skill) => (
                      <span
                        key={skill}
                        className="bg-slate-100 dark:bg-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 sm:pt-5 border-t border-slate-100 dark:border-slate-700 gap-2">
                  {(f.dailyRateEur ?? 0) > 0 ? (
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="text-slate-500 text-[10px] font-bold uppercase">{t("daily_rate")}</span>
                      <span className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white">
                        {format(f.dailyRateEur)} <span className="text-xs sm:text-sm font-normal text-slate-500">{t("per_day")}</span>
                      </span>
                    </div>
                  ) : (
                    <div />
                  )}
                  <span className="bg-primary text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl group-hover:bg-primary/90 transition-all flex items-center gap-1.5 flex-shrink-0">
                    <span className="material-symbols-outlined text-base">visibility</span>
                    <span className="hidden sm:inline">Voir le profil</span>
                    <span className="sm:hidden">Profil</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
