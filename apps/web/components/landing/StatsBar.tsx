"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { formatStatNumber } from "@/lib/ranking";

interface PlatformStats {
  freelances: number;
  completedOrders: number;
  averageRating: number;
  totalReviews: number;
  newUsersThisMonth: number;
  countriesCount: number;
}

export function StatsBar() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const t = useTranslations("landing.stats");

  useEffect(() => {
    fetch("/api/public/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setStats(data);
      })
      .catch(() => {});
  }, []);

  const freelanceCount = stats?.freelances ?? 0;
  const avgRating = stats?.averageRating ?? 0;
  const totalReviews = stats?.totalReviews ?? 0;
  const completedOrders = stats?.completedOrders ?? 0;
  const newThisMonth = stats?.newUsersThisMonth ?? 0;
  const countriesCount = stats?.countriesCount ?? 0;

  // Honest formatting: null if too low to show as number
  const freelanceDisplay = stats ? formatStatNumber(freelanceCount) : null;
  const ordersDisplay = stats ? formatStatNumber(completedOrders) : null;
  const reviewsDisplay = totalReviews > 0 ? (formatStatNumber(totalReviews) ?? String(totalReviews)) : "";

  const cardClass = "bg-white dark:bg-slate-800 p-3 sm:p-5 md:p-8 rounded-xl sm:rounded-2xl border border-primary/10 shadow-2xl flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 md:gap-6 text-center sm:text-left";

  return (
    <section className="px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-20 relative z-20">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {/* Freelances actifs */}
        <div className={cardClass}>
          <div className="size-10 sm:size-12 md:size-16 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <span className="material-symbols-outlined text-xl sm:text-2xl md:text-4xl">groups</span>
          </div>
          <div className="min-w-0">
            <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-tight leading-tight">{t("freelances_label")}</p>
            <h3 className="text-lg sm:text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              {!stats ? "—" : freelanceDisplay ?? t("join_first")}
            </h3>
            {newThisMonth > 0 && (
              <span className="text-[10px] sm:text-xs font-bold text-primary hidden sm:flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                {t("freelances_growth", { count: newThisMonth })}
              </span>
            )}
          </div>
        </div>

        {/* Satisfaction client */}
        <div className={cardClass}>
          <div className="size-10 sm:size-12 md:size-16 rounded-xl sm:rounded-2xl bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
            <span className="material-symbols-outlined text-xl sm:text-2xl md:text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          </div>
          <div className="min-w-0">
            <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-tight leading-tight">{t("satisfaction_label")}</p>
            <h3 className="text-lg sm:text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              {stats ? (avgRating > 0 ? `${avgRating}/5` : "—") : "—"}
            </h3>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 hidden sm:flex items-center gap-1 mt-1">
              {reviewsDisplay ? t("reviews_count", { count: reviewsDisplay }) : t("no_reviews")}
            </span>
          </div>
        </div>

        {/* Projets livres */}
        <div className={cardClass}>
          <div className="size-10 sm:size-12 md:size-16 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <span className="material-symbols-outlined text-xl sm:text-2xl md:text-4xl">task_alt</span>
          </div>
          <div className="min-w-0">
            <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-tight leading-tight">{t("projects_label")}</p>
            <h3 className="text-lg sm:text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              {!stats ? "—" : ordersDisplay ?? t("join_first")}
            </h3>
            <span className="text-[10px] sm:text-xs font-bold text-primary hidden sm:flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-xs">verified_user</span>
              {t("secure_payments")}
            </span>
          </div>
        </div>

        {/* Pays couverts */}
        <div className={cardClass}>
          <div className="size-10 sm:size-12 md:size-16 rounded-xl sm:rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
            <span className="material-symbols-outlined text-xl sm:text-2xl md:text-4xl">public</span>
          </div>
          <div className="min-w-0">
            <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-tight leading-tight">{t("countries_label")}</p>
            <h3 className="text-lg sm:text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              {!stats ? "—" : countriesCount > 0 ? String(countriesCount) : "—"}
            </h3>
            <span className="text-[10px] sm:text-xs font-bold text-emerald-500 hidden sm:flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-xs">language</span>
              {t("global_reach")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
