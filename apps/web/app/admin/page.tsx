"use client";

import { cn } from "@/lib/utils";

const STATS = [
  { label: "Utilisateurs totaux", value: "12 450", icon: "people", color: "text-primary", trend: "+8.2%" },
  { label: "GMV mensuel", value: "€145 200", icon: "payments", color: "text-blue-400", trend: "+12.5%" },
  { label: "Commandes actives", value: "342", icon: "shopping_cart", color: "text-amber-400", trend: "+5.3%" },
  { label: "Commissions perçues", value: "€14 520", icon: "account_balance", color: "text-emerald-400", trend: "+15.1%" },
  { label: "Litiges ouverts", value: "7", icon: "gavel", color: "text-red-400" },
  { label: "En modération", value: "15", icon: "pending", color: "text-purple-400" },
];

const REVENUE = [
  { month: "Mar", value: 85000 }, { month: "Avr", value: 92000 }, { month: "Mai", value: 98000 },
  { month: "Jui", value: 105000 }, { month: "Jul", value: 110000 }, { month: "Aoû", value: 108000 },
  { month: "Sep", value: 115000 }, { month: "Oct", value: 122000 }, { month: "Nov", value: 130000 },
  { month: "Déc", value: 128000 }, { month: "Jan", value: 138000 }, { month: "Fév", value: 145200 },
];

const ACTIVITIES = [
  { text: "Amadou D. s\u2019est inscrit en tant que freelance", time: "Il y a 5min", icon: "person_add", color: "text-primary" },
  { text: "Commande CMD-342 livrée par Fatou S.", time: "Il y a 15min", icon: "check_circle", color: "text-emerald-400" },
  { text: "Litige ouvert sur CMD-338", time: "Il y a 30min", icon: "gavel", color: "text-red-400" },
  { text: "KYC Niveau 3 approuvé pour Ibrahim M.", time: "Il y a 1h", icon: "verified", color: "text-blue-400" },
  { text: "Nouveau service en attente de modération", time: "Il y a 1h", icon: "pending", color: "text-amber-400" },
  { text: "Paiement €2 500 libéré (escrow)", time: "Il y a 2h", icon: "lock_open", color: "text-emerald-400" },
  { text: "TechCorp Agency a rejoint la plateforme", time: "Il y a 3h", icon: "apartment", color: "text-purple-400" },
  { text: "Commande CMD-339 terminée", time: "Il y a 3h", icon: "task_alt", color: "text-primary" },
];

const ALERTS = [
  { title: "Activité suspecte détectée", description: "Tentatives de connexion multiples depuis IP inconnue", severity: "haute", icon: "warning" },
  { title: "Litige urgent non résolu", description: "Litige CMD-338 ouvert depuis 3 jours sans réponse", severity: "haute", icon: "gavel" },
  { title: "File KYC en retard", description: "23 demandes KYC en attente depuis plus de 48h", severity: "moyenne", icon: "schedule" },
];

export default function AdminDashboard() {
  const maxRev = Math.max(...REVENUE.map(r => r.value));
  const chartW = 700;
  const chartH = 160;
  const points = REVENUE.map((r, i) => ({ x: (i / (REVENUE.length - 1)) * chartW, y: chartH - (r.value / maxRev) * chartH }));
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${chartW} ${chartH} L 0 ${chartH} Z`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Administration</h1>
          <p className="text-slate-400 text-sm mt-1">Vue globale de la plateforme FreelanceHigh.</p>
        </div>
        <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Plateforme en ligne
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {STATS.map(s => (
          <div key={s.label} className="bg-neutral-dark rounded-xl border border-border-dark p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("material-symbols-outlined text-lg", s.color)}>{s.icon}</span>
            </div>
            <p className="text-xl font-black text-white">{s.value}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{s.label}</p>
              {s.trend && <span className="text-[10px] text-emerald-400 font-bold">{s.trend}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-neutral-dark rounded-xl border border-border-dark p-5">
          <h2 className="font-bold text-white mb-4">Revenus plateforme (12 mois)</h2>
          <svg viewBox={`0 0 ${chartW} ${chartH + 20}`} className="w-full h-48">
            <defs><linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgb(var(--color-primary))" stopOpacity="0.3" /><stop offset="100%" stopColor="rgb(var(--color-primary))" stopOpacity="0" /></linearGradient></defs>
            <path d={areaPath} fill="url(#adminGrad)" />
            <path d={linePath} fill="none" stroke="rgb(var(--color-primary))" strokeWidth="2.5" strokeLinejoin="round" />
            {points.map((p, i) => (
              <g key={i}><circle cx={p.x} cy={p.y} r="3" fill="rgb(var(--color-primary))" /><text x={p.x} y={p.y - 8} textAnchor="middle" className="text-[9px] fill-slate-400">€{(REVENUE[i].value / 1000).toFixed(0)}k</text><text x={p.x} y={chartH + 14} textAnchor="middle" className="text-[9px] fill-slate-500">{REVENUE[i].month}</text></g>
            ))}
          </svg>
        </div>

        {/* Alerts */}
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">notifications_active</span>
            Alertes
          </h2>
          <div className="space-y-3">
            {ALERTS.map((a, i) => (
              <div key={i} className={cn("p-3 rounded-xl border", a.severity === "haute" ? "bg-red-500/5 border-red-500/20" : "bg-amber-500/5 border-amber-500/20")}>
                <div className="flex items-start gap-2">
                  <span className={cn("material-symbols-outlined text-lg mt-0.5", a.severity === "haute" ? "text-red-400" : "text-amber-400")}>{a.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-white">{a.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{a.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity feed */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
        <h2 className="font-bold text-white mb-4">Activité récente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {ACTIVITIES.map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-background-dark/30 transition-colors">
              <span className={cn("material-symbols-outlined text-lg", a.color)}>{a.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300 truncate">{a.text}</p>
                <p className="text-[10px] text-slate-500">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <h3 className="font-bold text-white text-sm mb-3">Utilisateurs par rôle</h3>
          {[{ role: "Freelances", count: 8240, pct: 66 }, { role: "Clients", count: 3650, pct: 29 }, { role: "Agences", count: 560, pct: 5 }].map(r => (
            <div key={r.role} className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-300">{r.role}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-border-dark rounded-full"><div className="h-full bg-primary rounded-full" style={{ width: `${r.pct}%` }} /></div>
                <span className="text-sm font-bold text-white">{r.count.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <h3 className="font-bold text-white text-sm mb-3">Top pays</h3>
          {[{ country: "Sénégal", flag: "🇸🇳", users: 3200 }, { country: "Côte d\u2019Ivoire", flag: "🇨🇮", users: 2800 }, { country: "France", flag: "🇫🇷", users: 2100 }, { country: "Cameroun", flag: "🇨🇲", users: 1500 }, { country: "Mali", flag: "🇲🇱", users: 900 }].map(c => (
            <div key={c.country} className="flex items-center justify-between py-1.5">
              <span className="text-sm text-slate-300">{c.flag} {c.country}</span>
              <span className="text-sm font-bold text-white">{c.users.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <h3 className="font-bold text-white text-sm mb-3">Métriques clés</h3>
          {[{ label: "Taux de conversion", value: "3.2%" }, { label: "Panier moyen", value: "€285" }, { label: "Temps résolution litige", value: "2.3j" }, { label: "NPS plateforme", value: "68/100" }, { label: "Taux rétention M1", value: "72%" }].map(m => (
            <div key={m.label} className="flex items-center justify-between py-1.5">
              <span className="text-sm text-slate-500">{m.label}</span>
              <span className="text-sm font-bold text-white">{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
