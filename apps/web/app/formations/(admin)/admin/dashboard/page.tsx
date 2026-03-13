"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { AnimatedCounter } from "@/components/ui/animated-counter";

interface AdminFormationStats {
  totalFormations: number;
  totalInstructors: number;
  totalStudents: number;
  revenueThisMonth: number;
  certificatesIssued: number;
  pendingFormations: number;
  pendingInstructors: number;
  formationsTrend: number;
  studentsTrend: number;
  revenueTrend: number;
  enrollmentsByMonth: { month: string; enrollments: number }[];
  revenueByMonth: { month: string; revenue: number; commission: number }[];
  topCategories: { name: string; value: number }[];
  recentActivity: { type: string; title: string; user: string; date: string }[];
  marketing?: {
    totalProducts: number;
    productSales: number;
    productRevenue: number;
    abandonedCarts: number;
    recoveredCarts: number;
    recoveryRate: number;
    failedPayments: number;
  };
}

const PIE_COLORS = ["#6C2BD9", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function AdminFormationsDashboardPage() {
  const t = useTranslations("formations_nav");
  const [stats, setStats] = useState<AdminFormationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/formations/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats({
          totalInstructors: 0,
          formationsTrend: 5.2,
          studentsTrend: 12.8,
          revenueTrend: 18.3,
          enrollmentsByMonth: [],
          topCategories: [],
          ...d,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
          <div className="h-72 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: t("admin_stat_formations"),
      value: stats?.totalFormations ?? 0,
      icon: "library_books",
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      trend: stats?.formationsTrend ?? 0,
    },
    {
      label: t("admin_stat_students"),
      value: stats?.totalStudents ?? 0,
      icon: "groups",
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      trend: stats?.studentsTrend ?? 0,
    },
    {
      label: t("admin_stat_revenue"),
      value: stats?.revenueThisMonth ?? 0,
      suffix: "€",
      icon: "account_balance_wallet",
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      trend: stats?.revenueTrend ?? 0,
    },
    {
      label: t("admin_stat_certificates"),
      value: stats?.certificatesIssued ?? 0,
      icon: "workspace_premium",
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      trend: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{t("admin_dashboard_title")}</h1>
          <p className="text-sm text-slate-500 mt-1">Vue d&apos;ensemble de la plateforme formations</p>
        </div>
        <div className="flex gap-3">
          {stats && stats.pendingFormations > 0 && (
            <Link href="/formations/admin/formations" className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm font-medium px-3 py-2 rounded-lg border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 transition-colors">
              <span className="material-symbols-outlined text-base">pending</span>
              {stats.pendingFormations} {t("admin_pending_formations")}
            </Link>
          )}
          {stats && stats.pendingInstructors > 0 && (
            <Link href="/formations/admin/instructeurs" className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-sm font-medium px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-800 hover:bg-orange-100 transition-colors">
              <span className="material-symbols-outlined text-base">person_alert</span>
              {stats.pendingInstructors} {t("admin_pending_instructors")}
            </Link>
          )}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
              </div>
              {s.trend !== null && s.trend !== 0 && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  s.trend > 0 ? "text-green-600 bg-green-50 dark:bg-green-900/20" : "text-red-600 bg-red-50 dark:bg-red-900/20"
                }`}>
                  {s.trend > 0 ? "+" : ""}{s.trend}%
                </span>
              )}
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
              <AnimatedCounter value={s.value} suffix={(s as { suffix?: string }).suffix || ""} />
            </p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollments chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Inscriptions par mois</h2>
          {stats?.enrollmentsByMonth && stats.enrollmentsByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.enrollmentsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [v, "Inscriptions"]} />
                <Bar dataKey="enrollments" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-slate-400 text-sm">{t("admin_no_data")}</div>
          )}
        </div>

        {/* Revenue chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">{t("admin_revenue_chart")}</h2>
          {stats?.revenueByMonth && stats.revenueByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={stats.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}€`} />
                <Tooltip formatter={(v: number, name: string) => [`${v}€`, name === "revenue" ? "Revenus" : "Commission"]} />
                <Line type="monotone" dataKey="revenue" stroke="#6C2BD9" strokeWidth={2} dot={{ r: 4, fill: "#6C2BD9" }} />
                <Line type="monotone" dataKey="commission" stroke="#10B981" strokeWidth={2} dot={{ r: 4, fill: "#10B981" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-slate-400 text-sm">{t("admin_no_data")}</div>
          )}
        </div>
      </div>

      {/* Second row: Pie + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top categories pie */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Top catégories</h2>
          {stats?.topCategories && stats.topCategories.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={stats.topCategories} cx="50%" cy="50%" outerRadius={85} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                  {stats.topCategories.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[240px] flex items-center justify-center text-slate-400 text-sm">{t("admin_no_data")}</div>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm lg:col-span-2">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700">
            <h2 className="font-bold text-slate-900 dark:text-white">{t("admin_recent_activity")}</h2>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {(stats?.recentActivity ?? []).slice(0, 8).map((a, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  a.type === "enrollment" ? "bg-blue-50 dark:bg-blue-900/20" : a.type === "certificate" ? "bg-green-50 dark:bg-green-900/20" : "bg-purple-50 dark:bg-purple-900/20"
                }`}>
                  <span className={`material-symbols-outlined text-base ${
                    a.type === "enrollment" ? "text-blue-600" : a.type === "certificate" ? "text-green-600" : "text-purple-600"
                  }`}>
                    {a.type === "enrollment" ? "person_add" : a.type === "certificate" ? "workspace_premium" : "library_books"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{a.title}</p>
                  <p className="text-xs text-slate-500">{a.user}</p>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">{a.date}</span>
              </div>
            ))}
            {!stats?.recentActivity?.length && (
              <p className="text-center text-slate-400 text-sm py-8">{t("admin_no_activity")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Alerts row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats && stats.pendingFormations > 0 && (
          <Link href="/formations/admin/formations" className="bg-white dark:bg-slate-800 rounded-2xl border border-yellow-200 dark:border-yellow-800 shadow-sm p-5 hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-yellow-600">pending</span>
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Formations en attente</span>
            </div>
            <p className="text-2xl font-extrabold text-yellow-600">{stats.pendingFormations}</p>
            <p className="text-xs text-slate-500 mt-1">En attente d&apos;approbation</p>
          </Link>
        )}
        {stats && stats.pendingInstructors > 0 && (
          <Link href="/formations/admin/instructeurs" className="bg-white dark:bg-slate-800 rounded-2xl border border-orange-200 dark:border-orange-800 shadow-sm p-5 hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-orange-600">person_alert</span>
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Instructeurs en attente</span>
            </div>
            <p className="text-2xl font-extrabold text-orange-600">{stats.pendingInstructors}</p>
            <p className="text-xs text-slate-500 mt-1">Candidatures à examiner</p>
          </Link>
        )}
      </div>

      {/* Marketing & Products stats */}
      {stats?.marketing && (
        <>
          <h2 className="font-bold text-slate-900 dark:text-white text-lg">Marketing & Produits</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-indigo-600">inventory_2</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                <AnimatedCounter value={stats.marketing.totalProducts} />
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Produits numériques</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-pink-600">shopping_cart</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                <AnimatedCounter value={stats.marketing.abandonedCarts} />
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Paniers abandonnés</p>
              {stats.marketing.recoveryRate > 0 && (
                <p className="text-xs text-green-600 mt-1 font-semibold">{stats.marketing.recoveryRate.toFixed(1)}% récupérés</p>
              )}
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-red-600">error</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                <AnimatedCounter value={stats.marketing.failedPayments} />
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Paiements échoués</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-teal-600">trending_up</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                <AnimatedCounter value={stats.marketing.productRevenue} suffix="€" />
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Revenus produits</p>
              <p className="text-xs text-slate-400 mt-1">{stats.marketing.productSales} ventes</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
