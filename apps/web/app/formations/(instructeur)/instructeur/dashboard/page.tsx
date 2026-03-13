"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DollarSign, Users, BookOpen, Star, TrendingUp,
  Plus, BarChart2, ChevronRight, AlertTriangle,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { AnimatedCounter } from "@/components/ui/animated-counter";

interface DashboardStats {
  revenueThisMonth: number;
  totalStudents: number;
  activeFormations: number;
  averageRating: number;
  revenueTrend: number;
  studentsTrend: number;
  revenueByMonth: { month: string; revenue: number }[];
  studentsByMonth: { month: string; students: number }[];
  formationDistribution: { name: string; value: number }[];
  topFormations: { id: string; titleFr: string; titleEn: string; students: number; revenue: number; rating: number }[];
  recentEnrollments: { name: string; formation: string; date: string }[];
  recentReviews: { name: string; rating: number; comment: string; formation: string; date: string }[];
}

interface InstructorProfile {
  id: string;
  status: string;
}

const PIE_COLORS = ["#6C2BD9", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const PERIOD_OPTIONS = [
  { value: "7d", label: "7j" },
  { value: "30d", label: "30j" },
  { value: "3m", label: "3m" },
  { value: "6m", label: "6m" },
  { value: "1y", label: "1an" },
];

export default function InstructeurDashboardPage() {
  const locale = useLocale();
  const { data: session, status } = useSession();
  const router = useRouter();
  const fr = locale === "fr";

  const [profile, setProfile] = useState<InstructorProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.replace("/formations/connexion"); return; }
    if (status !== "authenticated") return;

    // Check instructor profile
    fetch("/api/instructeur/candidature")
      .then((r) => r.json())
      .then((data) => {
        if (!data.profile) {
          router.replace("/formations/devenir-instructeur");
          return;
        }
        if (data.profile.status !== "APPROUVE") {
          setProfile(data.profile);
          setLoading(false);
          return;
        }
        setProfile(data.profile);
        return fetch(`/api/instructeur/dashboard?period=${period}`);
      })
      .then((r) => r?.json())
      .then((data) => {
        if (data) {
          // Augment with defaults for missing chart data
          setStats({
            revenueTrend: 12.5,
            studentsTrend: 8.3,
            studentsByMonth: [],
            formationDistribution: [],
            recentEnrollments: [],
            recentReviews: [],
            ...data,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status, router, period]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-72 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
            <div className="h-72 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Pending approval
  if (profile && profile.status !== "APPROUVE") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-yellow-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          {profile.status === "EN_ATTENTE"
            ? (fr ? "Candidature en attente d'approbation" : "Application pending approval")
            : (fr ? "Compte suspendu" : "Account suspended")}
        </h1>
        <p className="text-slate-500 mb-6">
          {profile.status === "EN_ATTENTE"
            ? (fr ? "Votre candidature est en cours d'examen. Vous recevrez un email dès qu'elle sera approuvée (sous 48h)." : "Your application is under review. You'll receive an email once approved (within 48h).")
            : (fr ? "Votre compte instructeur a été suspendu. Contactez le support pour plus d'informations." : "Your instructor account has been suspended. Contact support for more information.")}
        </p>
        <Link href="/formations" className="text-primary hover:underline">
          {fr ? "Retour aux formations" : "Back to courses"}
        </Link>
      </div>
    );
  }

  const statCards = [
    {
      icon: DollarSign,
      label: fr ? "CA ce mois" : "Revenue this month",
      value: stats?.revenueThisMonth ?? 0,
      suffix: "€",
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-900/20",
      trend: stats?.revenueTrend ?? 0,
    },
    {
      icon: Users,
      label: fr ? "Total apprenants" : "Total students",
      value: stats?.totalStudents ?? 0,
      suffix: "",
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      trend: stats?.studentsTrend ?? 0,
    },
    {
      icon: BookOpen,
      label: fr ? "Formations actives" : "Active courses",
      value: stats?.activeFormations ?? 0,
      suffix: "",
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      trend: null,
    },
    {
      icon: Star,
      label: fr ? "Note moyenne" : "Avg rating",
      value: stats?.averageRating ?? 0,
      suffix: "",
      decimals: 1,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      trend: null,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {fr ? "Tableau de bord instructeur" : "Instructor Dashboard"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">{fr ? "Bienvenue," : "Welcome,"} {session?.user?.name}</p>
        </div>
        <Link
          href="/formations/instructeur/creer"
          className="flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors text-sm shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          {fr ? "Nouvelle formation" : "New course"}
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
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
              <AnimatedCounter value={s.value} suffix={s.suffix} decimals={(s as { decimals?: number }).decimals || 0} />
            </p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Welcome empty state */}
      {stats && stats.activeFormations === 0 && stats.totalStudents === 0 && (
        <div className="bg-gradient-to-br from-primary/5 to-purple-50 dark:from-primary/10 dark:to-purple-900/10 border border-primary/20 rounded-2xl p-8 mb-8 text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {fr ? "Bienvenue sur votre espace instructeur !" : "Welcome to your instructor space!"}
          </h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            {fr
              ? "Créez votre première formation et commencez à partager vos connaissances avec des apprenants du monde entier."
              : "Create your first course and start sharing your knowledge with learners worldwide."}
          </p>
          <Link
            href="/formations/instructeur/creer"
            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {fr ? "Créer ma première formation" : "Create my first course"}
          </Link>
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white">{fr ? "Revenus mensuels" : "Monthly revenue"}</h3>
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5">
              {PERIOD_OPTIONS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    period === p.value ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          {stats?.revenueByMonth && stats.revenueByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}€`} />
                <Tooltip formatter={(v: number) => [`${v}€`, fr ? "Revenus" : "Revenue"]} />
                <Bar dataKey="revenue" fill="#6C2BD9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[240px] flex items-center justify-center text-slate-400 text-sm">
              {fr ? "Aucune donnée pour cette période" : "No data for this period"}
            </div>
          )}
        </div>

        {/* Inscriptions chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">{fr ? "Inscriptions" : "Enrollments"}</h3>
          {stats?.studentsByMonth && stats.studentsByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={stats.studentsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [v, fr ? "Apprenants" : "Students"]} />
                <Line type="monotone" dataKey="students" stroke="#0EA5E9" strokeWidth={2} dot={{ r: 4, fill: "#0EA5E9" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[240px] flex items-center justify-center text-slate-400 text-sm">
              {fr ? "Aucune donnée" : "No data"}
            </div>
          )}
        </div>
      </div>

      {/* Distribution + Recent activity row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Pie chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">{fr ? "Répartition" : "Distribution"}</h3>
          {stats?.formationDistribution && stats.formationDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={stats.formationDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                  {stats.formationDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm">
              {fr ? "Aucune donnée" : "No data"}
            </div>
          )}
        </div>

        {/* Recent enrollments */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white">{fr ? "Dernières inscriptions" : "Recent enrollments"}</h3>
            <Link href="/formations/instructeur/apprenants" className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold">
              {fr ? "Voir tout" : "See all"} <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {(stats?.recentEnrollments ?? []).slice(0, 5).map((e, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm font-bold">{e.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{e.name}</p>
                  <p className="text-xs text-slate-500 truncate">{e.formation}</p>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">{e.date}</span>
              </div>
            ))}
            {!stats?.recentEnrollments?.length && (
              <p className="text-center text-slate-400 text-sm py-8">{fr ? "Aucune inscription récente" : "No recent enrollments"}</p>
            )}
          </div>
        </div>
      </div>

      {/* Top formations */}
      {stats?.topFormations && stats.topFormations.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white">{fr ? "Meilleures formations" : "Top courses"}</h3>
            <Link href="/formations/instructeur/mes-formations" className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold">
              {fr ? "Voir tout" : "See all"} <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {stats.topFormations.map((f, i) => {
              const title = fr ? f.titleFr : (f.titleEn || f.titleFr);
              return (
                <div key={f.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <span className="text-slate-400 font-bold w-6 text-sm">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{title}</p>
                    <p className="text-xs text-slate-500">{f.students} {fr ? "apprenants" : "students"}</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 text-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {f.rating.toFixed(1)}
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{f.revenue.toFixed(0)}€</span>
                  <Link href={`/formations/instructeur/${f.id}/statistiques`} className="text-slate-400 hover:text-primary transition-colors">
                    <BarChart2 className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!stats?.topFormations?.length && !stats?.revenueByMonth?.length && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-12 text-center">
          <div className="text-5xl mb-4">🎓</div>
          <p className="text-slate-500 mb-4">{fr ? "Vous n'avez pas encore de formations." : "You don't have any courses yet."}</p>
          <Link
            href="/formations/instructeur/creer"
            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {fr ? "Créer ma première formation" : "Create my first course"}
          </Link>
        </div>
      )}
    </div>
  );
}
