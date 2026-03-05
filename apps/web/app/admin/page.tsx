"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePlatformDataStore, computeAdminStats, computeAdminFinanceStats } from "@/store/platform-data";
import { cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AdminDashboard() {
  const [revPeriod, setRevPeriod] = useState("12m");
  const state = usePlatformDataStore();
  const adminRevenue = state.adminRevenue[revPeriod] || state.adminRevenue["12m"];

  const stats = useMemo(() => computeAdminStats(state), [state]);
  const finance = useMemo(() => computeAdminFinanceStats(state), [state]);

  const STATS = [
    { label: "Utilisateurs", value: stats.totalUsers.toLocaleString(), icon: "people", color: "text-primary", trend: "+8.2%", link: "/admin/utilisateurs" },
    { label: "GMV", value: `€${stats.gmv.toLocaleString()}`, icon: "payments", color: "text-blue-400", trend: "+12.5%", link: "/admin/finances" },
    { label: "Commandes actives", value: stats.activeOrders.toString(), icon: "shopping_cart", color: "text-amber-400", link: "/admin/commandes" },
    { label: "Commissions", value: `€${stats.commissions.toLocaleString()}`, icon: "account_balance", color: "text-emerald-400", trend: "+15.1%", link: "/admin/finances" },
    { label: "Litiges", value: stats.disputes.toString(), icon: "gavel", color: "text-red-400", link: "/admin/litiges" },
    { label: "Modération", value: stats.pendingModeration.toString(), icon: "pending", color: "text-purple-400", link: "/admin/services" },
  ];

  const roleCounts = [
    { role: "Freelances", count: stats.freelances, pct: stats.totalUsers > 0 ? Math.round((stats.freelances / stats.totalUsers) * 100) : 0 },
    { role: "Clients", count: stats.clients, pct: stats.totalUsers > 0 ? Math.round((stats.clients / stats.totalUsers) * 100) : 0 },
    { role: "Agences", count: stats.agencies, pct: stats.totalUsers > 0 ? Math.round((stats.agencies / stats.totalUsers) * 100) : 0 },
  ];

  // Build live activity from actual data
  const activities = useMemo(() => {
    const acts: { text: string; time: string; icon: string; color: string; link: string }[] = [];

    // Recent orders
    const recentOrders = [...state.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3);
    recentOrders.forEach(o => {
      if (o.status === "en_cours") acts.push({ text: `Commande ${o.id} en cours — ${o.serviceTitle}`, time: o.createdAt, icon: "shopping_cart", color: "text-amber-400", link: "/admin/commandes" });
      else if (o.status === "termine") acts.push({ text: `Commande ${o.id} terminée — €${o.amount}`, time: o.deliveredAt || o.createdAt, icon: "check_circle", color: "text-emerald-400", link: "/admin/commandes" });
      else if (o.status === "litige") acts.push({ text: `Litige ouvert sur ${o.id}`, time: o.createdAt, icon: "gavel", color: "text-red-400", link: "/admin/litiges" });
    });

    // Pending services
    const pendingSvc = state.services.filter(s => s.status === "en_attente").slice(0, 2);
    pendingSvc.forEach(s => acts.push({ text: `Service "${s.title}" en attente de modération`, time: s.createdAt, icon: "pending", color: "text-purple-400", link: "/admin/services" }));

    // KYC
    const pendingKyc = state.kycRequests.filter(k => k.status === "en_attente").slice(0, 2);
    pendingKyc.forEach(k => acts.push({ text: `KYC Niv. ${k.requestedLevel} — ${k.userName}`, time: k.submittedAt, icon: "verified", color: "text-blue-400", link: "/admin/kyc" }));

    // Recent users
    const recentUsers = [...state.users].sort((a, b) => b.registeredAt.localeCompare(a.registeredAt)).slice(0, 2);
    recentUsers.forEach(u => acts.push({ text: `${u.name} inscrit comme ${u.role}`, time: u.registeredAt, icon: "person_add", color: "text-primary", link: "/admin/utilisateurs" }));

    return acts.slice(0, 8);
  }, [state]);

  // Dynamic alerts
  const alerts = useMemo(() => {
    const list: { title: string; description: string; severity: "haute" | "moyenne"; icon: string; link: string }[] = [];
    if (stats.disputes > 0) list.push({ title: `${stats.disputes} litige(s) ouvert(s)`, description: "Des litiges nécessitent votre attention", severity: "haute", icon: "gavel", link: "/admin/litiges" });
    if (stats.pendingModeration > 0) list.push({ title: `${stats.pendingModeration} service(s) en attente`, description: "Des services attendent votre approbation", severity: "moyenne", icon: "pending", link: "/admin/services" });
    if (stats.pendingKyc > 0) list.push({ title: `${stats.pendingKyc} demande(s) KYC`, description: "Demandes de vérification en attente", severity: "moyenne", icon: "verified", link: "/admin/kyc" });
    if (finance.pendingWithdrawals > 0) list.push({ title: `€${finance.pendingWithdrawals} en retraits`, description: "Retraits en attente de traitement", severity: "moyenne", icon: "account_balance_wallet", link: "/admin/finances" });
    return list;
  }, [stats, finance]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Administration</h1>
          <p className="text-slate-400 text-sm mt-1">Vue globale de la plateforme FreelanceHigh.</p>
        </div>
        <span className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold", state.config.maintenanceMode ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400")}>
          <span className={cn("w-2 h-2 rounded-full", state.config.maintenanceMode ? "bg-red-400" : "bg-emerald-400 animate-pulse")} />
          {state.config.maintenanceMode ? "Mode maintenance" : "Plateforme en ligne"}
        </span>
      </div>

      {/* Stats clickable */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {STATS.map(s => (
          <Link key={s.label} href={s.link} className="bg-neutral-dark rounded-xl border border-border-dark p-4 hover:border-primary/30 transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("material-symbols-outlined text-lg", s.color)}>{s.icon}</span>
            </div>
            <p className="text-xl font-black text-white group-hover:text-primary transition-colors">{s.value}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{s.label}</p>
              {s.trend && <span className="text-[10px] text-emerald-400 font-bold">{s.trend}</span>}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart with recharts */}
        <div className="lg:col-span-2 bg-neutral-dark rounded-xl border border-border-dark p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">Revenus plateforme</h2>
            <div className="flex bg-border-dark rounded-lg p-0.5">
              {["7j", "30j", "90j", "12m"].map(p => (
                <button key={p} onClick={() => setRevPeriod(p)} className={cn("px-2.5 py-1 rounded-md text-[10px] font-semibold transition-colors", revPeriod === p ? "bg-neutral-dark text-primary shadow-sm" : "text-slate-500 hover:text-slate-300")}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={adminRevenue}>
              <defs>
                <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C2BD9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6C2BD9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "#1e1e2e", border: "1px solid #2d2d3f", borderRadius: 12, color: "#fff", fontSize: 12 }} formatter={(v: number) => [`€${v.toLocaleString()}`, ""]} />
              <Area type="monotone" dataKey="revenue" stroke="#6C2BD9" strokeWidth={2.5} fill="url(#dashGrad)" name="Revenus" />
              <Area type="monotone" dataKey="commissions" stroke="#10B981" strokeWidth={1.5} fill="none" name="Commissions" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Dynamic Alerts */}
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">notifications_active</span>
            Alertes ({alerts.length})
          </h2>
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-4xl text-emerald-400">check_circle</span>
              <p className="text-sm text-slate-400 mt-2">Aucune alerte !</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((a, i) => (
                <Link key={i} href={a.link} className={cn("block p-3 rounded-xl border transition-colors", a.severity === "haute" ? "bg-red-500/5 border-red-500/20 hover:border-red-500/40" : "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40")}>
                  <div className="flex items-start gap-2">
                    <span className={cn("material-symbols-outlined text-lg mt-0.5", a.severity === "haute" ? "text-red-400" : "text-amber-400")}>{a.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{a.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{a.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity feed */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
        <h2 className="font-bold text-white mb-4">Activité récente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {activities.map((a, i) => (
            <Link key={i} href={a.link} className="flex items-center gap-3 p-3 rounded-xl hover:bg-background-dark/30 transition-colors">
              <span className={cn("material-symbols-outlined text-lg", a.color)}>{a.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300 truncate">{a.text}</p>
                <p className="text-[10px] text-slate-500">{a.time}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Users by role */}
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <h3 className="font-bold text-white text-sm mb-3">Utilisateurs par rôle</h3>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={stats.rolePie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={4}>
                {stats.rolePie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1e1e2e", border: "1px solid #2d2d3f", borderRadius: 12, color: "#fff", fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          {roleCounts.map(r => (
            <div key={r.role} className="flex items-center justify-between py-1">
              <span className="text-sm text-slate-300">{r.role}</span>
              <span className="text-sm font-bold text-white">{r.count} ({r.pct}%)</span>
            </div>
          ))}
        </div>

        {/* Top countries */}
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <h3 className="font-bold text-white text-sm mb-3">Top pays</h3>
          {stats.topCountries.map(c => (
            <div key={c.country} className="flex items-center justify-between py-1.5">
              <span className="text-sm text-slate-300">{c.flag} {c.country}</span>
              <span className="text-sm font-bold text-white">{c.users}</span>
            </div>
          ))}
        </div>

        {/* Key metrics */}
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <h3 className="font-bold text-white text-sm mb-3">Métriques clés</h3>
          {[
            { label: "Taux de complétion", value: `${stats.completionRate}%` },
            { label: "Panier moyen", value: `€${stats.avgOrderValue}` },
            { label: "Escrow en cours", value: `€${stats.escrowTotal.toLocaleString()}` },
            { label: "Catégories actives", value: `${stats.totalCategories}` },
            { label: "Articles publiés", value: `${stats.totalArticles}` },
          ].map(m => (
            <div key={m.label} className="flex items-center justify-between py-1.5">
              <span className="text-sm text-slate-500">{m.label}</span>
              <span className="text-sm font-bold text-white">{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Catégories", icon: "category", link: "/admin/categories", color: "text-primary" },
          { label: "Blog", icon: "article", link: "/admin/blog", color: "text-blue-400" },
          { label: "KYC", icon: "verified", link: "/admin/kyc", count: stats.pendingKyc, color: "text-amber-400" },
          { label: "Configuration", icon: "settings", link: "/admin/configuration", color: "text-slate-400" },
        ].map(q => (
          <Link key={q.label} href={q.link} className="bg-neutral-dark rounded-xl border border-border-dark p-4 flex items-center gap-3 hover:border-primary/30 transition-all group">
            <span className={cn("material-symbols-outlined text-2xl", q.color)}>{q.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{q.label}</p>
              {q.count !== undefined && q.count > 0 && <p className="text-xs text-amber-400">{q.count} en attente</p>}
            </div>
            <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors">chevron_right</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
