"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const RATES: Record<string, number> = { EUR: 1, FCFA: 655.957, USD: 1.08 };

const REVENUE_DATA = [
  { month: "Sep", value: 98000 }, { month: "Oct", value: 112000 }, { month: "Nov", value: 125000 },
  { month: "Déc", value: 118000 }, { month: "Jan", value: 135000 }, { month: "Fév", value: 145200 },
];

const MEMBER_REVENUE = [
  { name: "Amadou D.", role: "Lead Dev", ca: 42000, orders: 12, commission: 3360 },
  { name: "Fatou S.", role: "Designer", ca: 28500, orders: 9, commission: 2280 },
  { name: "Nadia F.", role: "Marketing", ca: 22800, orders: 15, commission: 1824 },
  { name: "Ibrahim M.", role: "Full-Stack", ca: 35200, orders: 8, commission: 2816 },
  { name: "Marie K.", role: "Rédactrice", ca: 15000, orders: 20, commission: 1200 },
  { name: "Yacine D.", role: "DevOps", ca: 12000, orders: 4, commission: 960 },
];

const INVOICES = [
  { id: "INV-4501", client: "Dakar Shop SARL", amount: 12500, date: "2026-03-01", status: "payee" },
  { id: "INV-4502", client: "QuickDeliver", amount: 18000, date: "2026-02-28", status: "en_attente" },
  { id: "INV-4503", client: "FashionAfrik", amount: 5200, date: "2026-02-25", status: "payee" },
  { id: "INV-4504", client: "FinTech CI", amount: 8000, date: "2026-02-20", status: "payee" },
  { id: "INV-4505", client: "HealthApp", amount: 9500, date: "2026-02-15", status: "en_retard" },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  payee: { label: "Payée", cls: "bg-emerald-500/20 text-emerald-400" },
  en_attente: { label: "En attente", cls: "bg-amber-500/20 text-amber-400" },
  en_retard: { label: "En retard", cls: "bg-red-500/20 text-red-400" },
};

export default function AgenceFinances() {
  const [tab, setTab] = useState<"vue" | "membres" | "factures">("vue");
  const [currency, setCurrency] = useState<"EUR" | "FCFA" | "USD">("EUR");
  const [showRetrait, setShowRetrait] = useState(false);
  const { addToast } = useToastStore();

  const fmt = (v: number) => {
    const converted = v * RATES[currency];
    if (currency === "FCFA") return `${Math.round(converted).toLocaleString("fr-FR")} FCFA`;
    return `${currency === "USD" ? "$" : "€"}${Math.round(converted).toLocaleString("fr-FR")}`;
  };

  const maxRev = Math.max(...REVENUE_DATA.map(r => r.value));
  const chartW = 600; const chartH = 160;
  const points = REVENUE_DATA.map((r, i) => ({ x: (i / (REVENUE_DATA.length - 1)) * chartW, y: chartH - (r.value / maxRev) * chartH }));
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${chartW} ${chartH} L 0 ${chartH} Z`;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Finances</h1>
          <p className="text-slate-400 text-sm mt-1">Revenus, factures et retraits de l&apos;agence.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-neutral-dark border border-border-dark rounded-lg overflow-hidden">
            {(["EUR", "FCFA", "USD"] as const).map(c => (
              <button key={c} onClick={() => setCurrency(c)} className={cn("px-3 py-2 text-xs font-bold transition-colors", currency === c ? "bg-primary text-background-dark" : "text-slate-400 hover:text-white")}>{c}</button>
            ))}
          </div>
          <button onClick={() => setShowRetrait(true)} className="px-4 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">account_balance</span>
            Retrait
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "CA Global", value: fmt(145200), icon: "trending_up", color: "text-primary" },
          { label: "Solde disponible", value: fmt(82400), icon: "account_balance_wallet", color: "text-emerald-400" },
          { label: "En attente", value: fmt(27500), icon: "schedule", color: "text-amber-400" },
          { label: "Total gagné", value: fmt(892000), icon: "payments", color: "text-blue-400" },
        ].map(s => (
          <div key={s.label} className="bg-neutral-dark rounded-xl border border-border-dark p-4 flex items-center gap-3">
            <span className={cn("material-symbols-outlined text-xl", s.color)}>{s.icon}</span>
            <div>
              <p className="text-xl font-black text-white">{s.value}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[{ key: "vue" as const, label: "Vue d'ensemble" }, { key: "membres" as const, label: "Par membre" }, { key: "factures" as const, label: "Factures" }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={cn("px-4 py-2 rounded-lg text-sm font-semibold transition-colors", tab === t.key ? "bg-primary text-background-dark" : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white")}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "vue" && (
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
          <h2 className="font-bold text-white mb-4">CA Mensuel</h2>
          <svg viewBox={`0 0 ${chartW} ${chartH + 20}`} className="w-full h-48">
            <defs><linearGradient id="finGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgb(var(--color-primary))" stopOpacity="0.3" /><stop offset="100%" stopColor="rgb(var(--color-primary))" stopOpacity="0" /></linearGradient></defs>
            <path d={areaPath} fill="url(#finGrad)" />
            <path d={linePath} fill="none" stroke="rgb(var(--color-primary))" strokeWidth="2.5" strokeLinejoin="round" />
            {points.map((p, i) => (
              <g key={i}><circle cx={p.x} cy={p.y} r="4" fill="rgb(var(--color-primary))" /><text x={p.x} y={p.y - 10} textAnchor="middle" className="text-[10px] fill-slate-400">{fmt(REVENUE_DATA[i].value)}</text><text x={p.x} y={chartH + 16} textAnchor="middle" className="text-[10px] fill-slate-500">{REVENUE_DATA[i].month}</text></g>
            ))}
          </svg>
        </div>
      )}

      {tab === "membres" && (
        <div className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
          <table className="w-full">
            <thead><tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-border-dark"><th className="px-5 py-3 text-left font-semibold">Membre</th><th className="px-5 py-3 text-left font-semibold">CA Généré</th><th className="px-5 py-3 text-left font-semibold">Commandes</th><th className="px-5 py-3 text-left font-semibold">Commission (8%)</th></tr></thead>
            <tbody>
              {MEMBER_REVENUE.map(m => (
                <tr key={m.name} className="border-b border-border-dark/50 hover:bg-background-dark/30 transition-colors">
                  <td className="px-5 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">{m.name.split(" ").map(n => n[0]).join("")}</div><div><p className="text-sm font-semibold text-white">{m.name}</p><p className="text-xs text-slate-500">{m.role}</p></div></div></td>
                  <td className="px-5 py-3 text-sm font-bold text-white">{fmt(m.ca)}</td>
                  <td className="px-5 py-3 text-sm text-slate-400">{m.orders}</td>
                  <td className="px-5 py-3 text-sm text-primary font-semibold">{fmt(m.commission)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "factures" && (
        <div className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
          <table className="w-full">
            <thead><tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-border-dark"><th className="px-5 py-3 text-left font-semibold">Facture</th><th className="px-5 py-3 text-left font-semibold">Client</th><th className="px-5 py-3 text-left font-semibold">Montant</th><th className="px-5 py-3 text-left font-semibold">Date</th><th className="px-5 py-3 text-left font-semibold">Statut</th><th className="px-5 py-3 text-left font-semibold">Actions</th></tr></thead>
            <tbody>
              {INVOICES.map(inv => (
                <tr key={inv.id} className="border-b border-border-dark/50 hover:bg-background-dark/30 transition-colors">
                  <td className="px-5 py-3 text-sm font-mono text-primary font-semibold">{inv.id}</td>
                  <td className="px-5 py-3 text-sm text-slate-300">{inv.client}</td>
                  <td className="px-5 py-3 text-sm font-bold text-white">{fmt(inv.amount)}</td>
                  <td className="px-5 py-3 text-sm text-slate-500">{new Date(inv.date).toLocaleDateString("fr-FR")}</td>
                  <td className="px-5 py-3"><span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", STATUS_MAP[inv.status]?.cls)}>{STATUS_MAP[inv.status]?.label}</span></td>
                  <td className="px-5 py-3"><button onClick={() => addToast("info", `Facture ${inv.id} téléchargée`)} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"><span className="material-symbols-outlined text-sm">download</span>PDF</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showRetrait && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRetrait(false)} />
          <div className="relative bg-neutral-dark rounded-2xl border border-border-dark p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">Demande de retrait</h3>
            <div className="space-y-4">
              <div><label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Montant</label><input placeholder="0.00" className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50" /></div>
              <div><label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Méthode</label><select className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50"><option>Virement SEPA</option><option>Orange Money</option><option>Wave</option><option>PayPal</option></select></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowRetrait(false)} className="flex-1 py-2.5 text-slate-400 text-sm font-semibold hover:text-white transition-colors">Annuler</button>
                <button onClick={() => { addToast("success", "Demande de retrait envoyée"); setShowRetrait(false); }} className="flex-1 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all">Confirmer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
