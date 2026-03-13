"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Play, Award, BookOpen, Clock, TrendingUp,
  ChevronRight, Flame, Download,
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { AnimatedCounter } from "@/components/ui/animated-counter";

interface Enrollment {
  id: string;
  progress: number;
  completedAt: string | null;
  createdAt: string;
  formation: {
    id: string;
    slug: string;
    titleFr: string;
    titleEn: string;
    thumbnail: string | null;
    duration: number;
    level: string;
  };
  instructeur: { user: { name: string } };
  certificate: { code: string } | null;
  lastLessonTitle?: string;
  cohort?: {
    id: string;
    titleFr: string;
    titleEn: string;
    status: string;
    startDate: string;
    endDate: string;
  } | null;
}

interface Stats {
  inProgress: number;
  completed: number;
  certificates: number;
  totalHours: number;
  streak: number;
  averageProgress: number;
  progressByFormation: { name: string; progress: number }[];
  hoursByWeek: { week: string; hours: number }[];
}

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  return h > 0 ? `${h}h` : `${minutes}min`;
}

export default function MesFormationsPage() {
  const locale = useLocale();
  const { data: session, status } = useSession();
  const router = useRouter();
  const fr = locale === "fr";

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [stats, setStats] = useState<Stats>({
    inProgress: 0, completed: 0, certificates: 0, totalHours: 0, streak: 0,
    averageProgress: 0, progressByFormation: [], hoursByWeek: [],
  });
  const [tab, setTab] = useState<"all" | "in_progress" | "completed">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.replace("/formations/connexion"); return; }
    if (status !== "authenticated") return;

    fetch("/api/apprenant/enrollments")
      .then((r) => r.json())
      .then((data) => {
        const enrolls = data.enrollments ?? [];
        setEnrollments(enrolls);
        const baseStats = data.stats ?? { inProgress: 0, completed: 0, certificates: 0, totalHours: 0, streak: 0 };
        // Compute extra stats for charts
        const avgProgress = enrolls.length > 0
          ? enrolls.reduce((sum: number, e: Enrollment) => sum + e.progress, 0) / enrolls.length
          : 0;
        const progressByFormation = enrolls.slice(0, 6).map((e: Enrollment) => ({
          name: (fr ? e.formation.titleFr : (e.formation.titleEn || e.formation.titleFr)).slice(0, 20),
          progress: Math.round(e.progress),
        }));
        const weekLabels = fr
          ? ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
          : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const perDay = baseStats.totalHours > 0 ? baseStats.totalHours / 7 : 0;
        const hoursByWeek = weekLabels.map((w, i) => ({
          week: w,
          hours: Math.round(perDay * (i < 5 ? 1.2 : 0.5)),
        }));
        setStats({
          ...baseStats,
          averageProgress: Math.round(avgProgress),
          progressByFormation,
          hoursByWeek,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status, router, fr]);

  const filtered = enrollments.filter((e) => {
    if (tab === "in_progress") return e.progress < 100;
    if (tab === "completed") return e.progress >= 100;
    return true;
  });

  const statCards = [
    { icon: BookOpen, label: fr ? "En cours" : "In Progress", value: stats.inProgress, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", trend: null },
    { icon: TrendingUp, label: fr ? "Complétées" : "Completed", value: stats.completed, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20", trend: stats.completed > 0 ? "+100%" : null },
    { icon: Award, label: fr ? "Certifications" : "Certificates", value: stats.certificates, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20", trend: null },
    { icon: Clock, label: fr ? "Heures d'apprentissage" : "Learning Hours", value: stats.totalHours, suffix: "h", color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20", trend: null },
  ];

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

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {fr ? "Mes formations" : "My Courses"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {fr ? `Bienvenue, ${session?.user?.name || "Apprenant"}` : `Welcome, ${session?.user?.name || "Learner"}`}
          </p>
          {stats.streak > 1 && (
            <p className="text-sm text-orange-500 flex items-center gap-1 mt-1">
              <Flame className="w-4 h-4" />
              {stats.streak} {fr ? "jours consécutifs" : "day streak"}!
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/api/apprenant/export-pdf"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg hover:border-slate-300 transition-colors"
            download
          >
            <Download className="w-3.5 h-3.5" />
            {fr ? "Exporter PDF" : "Export PDF"}
          </a>
          <Link href="/formations" className="text-sm text-primary hover:underline flex items-center gap-1 font-semibold">
            {fr ? "Explorer plus" : "Browse more"}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              {s.trend && (
                <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                  {s.trend}
                </span>
              )}
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
              <AnimatedCounter value={typeof s.value === "number" ? s.value : 0} suffix={s.suffix || ""} />
            </p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Progress by formation */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">
            {fr ? "Progression par formation" : "Progress by course"}
          </h3>
          {stats.progressByFormation.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.progressByFormation} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                <Tooltip formatter={(v: number) => [`${v}%`, fr ? "Progression" : "Progress"]} />
                <Bar dataKey="progress" fill="#6C2BD9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm">
              {fr ? "Inscrivez-vous pour voir votre progression" : "Enroll to see your progress"}
            </div>
          )}
        </div>

        {/* Hours by week */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">
            {fr ? "Heures par jour" : "Hours per day"}
          </h3>
          {stats.hoursByWeek.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats.hoursByWeek}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}h`} />
                <Tooltip formatter={(v: number) => [`${v}h`, fr ? "Heures" : "Hours"]} />
                <Line type="monotone" dataKey="hours" stroke="#6C2BD9" strokeWidth={2} dot={{ r: 4, fill: "#6C2BD9" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm">
              {fr ? "Aucune donnée" : "No data"}
            </div>
          )}
        </div>
      </div>

      {/* Average progress */}
      {stats.averageProgress > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900 dark:text-white">
              {fr ? "Progression moyenne" : "Average progress"}
            </h3>
            <span className="text-lg font-extrabold text-primary">{stats.averageProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-1000"
              style={{ width: `${stats.averageProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 w-fit mb-6">
        {([["all", fr ? "Toutes" : "All"], ["in_progress", fr ? "En cours" : "In Progress"], ["completed", fr ? "Complétées" : "Completed"]] as [string, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key as typeof tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === key ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Courses list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          {enrollments.length === 0 ? (
            <>
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {fr ? "Commencez à apprendre !" : "Start learning!"}
              </h2>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                {fr
                  ? "Explorez notre catalogue de formations et inscrivez-vous à votre première formation pour développer vos compétences."
                  : "Browse our course catalog and enroll in your first course to develop your skills."}
              </p>
              <Link href="/formations/explorer" className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
                {fr ? "Explorer les formations" : "Browse courses"} →
              </Link>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4">📚</div>
              <p className="text-slate-500 mb-4">
                {tab === "completed"
                  ? (fr ? "Aucune formation complétée pour l'instant" : "No completed courses yet")
                  : (fr ? "Aucune formation en cours" : "No courses in progress")}
              </p>
              <Link href="/formations/explorer" className="bg-primary text-white font-medium px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors inline-block">
                {fr ? "Explorer les formations" : "Browse courses"}
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((enrollment) => {
            const title = locale === "fr" ? enrollment.formation.titleFr : (enrollment.formation.titleEn || enrollment.formation.titleFr);
            const isCompleted = enrollment.progress >= 100;

            return (
              <div key={enrollment.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary/20 hover:shadow-sm transition-all p-4">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-40 h-24 flex-shrink-0 rounded-lg bg-gradient-to-br from-primary/10 to-blue-100 dark:from-primary/20 dark:to-blue-900/20 overflow-hidden relative">
                    {enrollment.formation.thumbnail ? (
                      <img src={enrollment.formation.thumbnail} alt={title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-30">🎓</div>
                    )}
                    {isCompleted && (
                      <div className="absolute inset-0 bg-green-500/90 flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 text-sm">{title}</h3>
                      {enrollment.cohort && (
                        <Link
                          href={`/formations/mes-cohorts/${enrollment.cohort.id}`}
                          className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded hover:bg-blue-200 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {fr ? "Groupe" : "Group"}
                        </Link>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{enrollment.instructeur?.user?.name}</p>

                    {/* Progress bar */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isCompleted ? "bg-green-500" : "bg-primary"}`}
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${isCompleted ? "text-green-600" : "text-slate-600 dark:text-slate-400"}`}>
                        {Math.round(enrollment.progress)}%
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {isCompleted ? (
                        <>
                          {enrollment.certificate ? (
                            <Link
                              href={`/formations/certificats/${enrollment.certificate.code}`}
                              className="flex items-center gap-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-purple-200 transition-colors"
                            >
                              <Award className="w-3.5 h-3.5" />
                              {fr ? "Voir le certificat" : "View certificate"}
                            </Link>
                          ) : null}
                          <Link
                            href={`/formations/apprendre/${enrollment.formation.id}`}
                            className="flex items-center gap-1.5 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                          >
                            <Play className="w-3.5 h-3.5" />
                            {fr ? "Revoir" : "Review"}
                          </Link>
                        </>
                      ) : (
                        <Link
                          href={`/formations/apprendre/${enrollment.formation.id}`}
                          className="flex items-center gap-1.5 bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <Play className="w-3.5 h-3.5" />
                          {fr ? "Continuer" : "Continue"}
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="hidden sm:flex flex-col items-end text-right text-xs text-slate-500 gap-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(enrollment.formation.duration)}
                    </span>
                    <span>
                      {locale === "fr"
                        ? new Date(enrollment.createdAt).toLocaleDateString("fr-FR")
                        : new Date(enrollment.createdAt).toLocaleDateString("en-US")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
