"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Users, DollarSign, Award, TrendingUp, Eye, Clock, CheckCircle, XCircle } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface AdminFormationStats {
  totalFormations: number;
  totalStudents: number;
  revenueThisMonth: number;
  certificatesIssued: number;
  pendingFormations: number;
  pendingInstructors: number;
  revenueByMonth: { month: string; revenue: number; commission: number }[];
  recentActivity: { type: string; title: string; user: string; date: string }[];
}

export default function AdminFormationsDashboardPage() {
  const [stats, setStats] = useState<AdminFormationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/formations/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Formations actives", value: stats?.totalFormations ?? 0, icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Total apprenants", value: (stats?.totalStudents ?? 0).toLocaleString(), icon: Users, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "CA formations ce mois", value: `${(stats?.revenueThisMonth ?? 0).toFixed(0)}€`, icon: DollarSign, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Certifications délivrées", value: (stats?.certificatesIssued ?? 0).toLocaleString(), icon: Award, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-dark rounded w-1/3" />
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map((i) => <div key={i} className="h-24 bg-neutral-dark rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">🎓 Administration Formations</h1>
        <div className="flex gap-3">
          {stats && stats.pendingFormations > 0 && (
            <Link href="/admin/formations/liste?status=EN_ATTENTE" className="flex items-center gap-2 bg-yellow-500/10 text-yellow-400 text-sm font-medium px-3 py-2 rounded-lg border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors">
              <Clock className="w-4 h-4" />
              {stats.pendingFormations} formation{stats.pendingFormations > 1 ? "s" : ""} en attente
            </Link>
          )}
          {stats && stats.pendingInstructors > 0 && (
            <Link href="/admin/formations/instructeurs?status=EN_ATTENTE" className="flex items-center gap-2 bg-orange-500/10 text-orange-400 text-sm font-medium px-3 py-2 rounded-lg border border-orange-500/20 hover:bg-orange-500/20 transition-colors">
              <Users className="w-4 h-4" />
              {stats.pendingInstructors} instructeur{stats.pendingInstructors > 1 ? "s" : ""} en attente
            </Link>
          )}
        </div>
      </div>

      {/* Sub-nav */}
      <div className="flex gap-1 bg-border-dark/30 rounded-xl p-1 w-fit">
        {([
          ["/admin/formations/dashboard", "Dashboard"],
          ["/admin/formations/liste", "Formations"],
          ["/admin/formations/instructeurs", "Instructeurs"],
          ["/admin/formations/apprenants", "Apprenants"],
          ["/admin/formations/finances", "Finances"],
          ["/admin/formations/certificats", "Certificats"],
          ["/admin/formations/categories", "Catégories"],
        ] as [string, string][]).map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              href.includes("dashboard") ? "bg-primary text-white" : "text-slate-400 hover:text-white hover:bg-border-dark/50"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-neutral-dark border border-border-dark rounded-xl p-5">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-neutral-dark border border-border-dark rounded-xl p-6">
        <h2 className="font-semibold text-white mb-4">Revenus formations (12 derniers mois)</h2>
        {stats?.revenueByMonth && stats.revenueByMonth.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `${v}€`} />
              <Tooltip contentStyle={{ backgroundColor: "#1e1e1e", border: "1px solid #333", color: "#fff" }} formatter={(v: number, name: string) => [`${v}€`, name === "revenue" ? "Revenus bruts" : "Commissions (30%)"]} />
              <Bar dataKey="revenue" fill="#6C2BD9" radius={[4, 4, 0, 0]} name="revenue" />
              <Bar dataKey="commission" fill="#10b981" radius={[4, 4, 0, 0]} name="commission" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-slate-400 text-sm text-center py-8">Aucune donnée disponible</p>
        )}
      </div>

      {/* Recent activity */}
      <div className="bg-neutral-dark border border-border-dark rounded-xl">
        <div className="p-5 border-b border-border-dark">
          <h2 className="font-semibold text-white">Activité récente</h2>
        </div>
        <div className="divide-y divide-border-dark">
          {(stats?.recentActivity ?? []).slice(0, 10).map((a, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                a.type === "enrollment" ? "bg-blue-500/10" : a.type === "certificate" ? "bg-green-500/10" : "bg-purple-500/10"
              }`}>
                {a.type === "enrollment" ? <Users className="w-4 h-4 text-blue-400" /> : a.type === "certificate" ? <Award className="w-4 h-4 text-green-400" /> : <BookOpen className="w-4 h-4 text-purple-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{a.title}</p>
                <p className="text-xs text-slate-400">{a.user}</p>
              </div>
              <span className="text-xs text-slate-500 flex-shrink-0">{a.date}</span>
            </div>
          ))}
          {!stats?.recentActivity?.length && (
            <p className="text-center text-slate-400 text-sm py-8">Aucune activité récente</p>
          )}
        </div>
      </div>
    </div>
  );
}
