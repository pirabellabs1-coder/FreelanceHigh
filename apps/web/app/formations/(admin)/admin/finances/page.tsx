"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface AdminFinancesData {
  totalRevenue: number;
  totalCommission: number;
  pendingWithdrawals: number;
  pendingRefunds: number;
  revenueByMonth: { month: string; revenue: number; commission: number }[];
  withdrawals: {
    id: string;
    amount: number;
    method: string;
    status: string;
    createdAt: string;
    instructeur: { user: { name: string; email: string } };
  }[];
}

export default function AdminFormationsFinancesPage() {
  const t = useTranslations("formations_nav");
  const [data, setData] = useState<AdminFinancesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/formations/finances")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const processWithdrawal = async (id: string, action: "approve" | "reject") => {
    setProcessingId(id);
    await fetch(`/api/admin/formations/finances/withdrawal/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setProcessingId(null);
    fetch("/api/admin/formations/finances").then((r) => r.json()).then((d) => setData(d));
  };

  const statCards = [
    { label: t("admin_total_revenue"), value: `${(data?.totalRevenue ?? 0).toFixed(0)}€`, icon: "payments", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: t("admin_commission"), value: `${(data?.totalCommission ?? 0).toFixed(0)}€`, icon: "trending_up", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: t("admin_pending_withdrawals"), value: `${(data?.pendingWithdrawals ?? 0).toFixed(0)}€`, icon: "account_balance", color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { label: t("admin_pending_refunds"), value: data?.pendingRefunds ?? 0, icon: "error_outline", color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">{t("admin_finances_title")}</h1>

      {loading ? (
        <div className="text-center py-12 text-slate-400">{t("loading")}</div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((s) => (
              <div key={s.label} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                  <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
                </div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Revenue chart */}
          {data?.revenueByMonth && data.revenueByMonth.length > 0 && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
              <h2 className="font-semibold mb-4">{t("admin_revenue_chart")}</h2>
              <div className="space-y-3">
                {data.revenueByMonth.map((m) => (
                  <div key={m.month} className="flex items-center gap-4">
                    <span className="text-xs text-slate-500 w-12">{m.month}</span>
                    <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (m.revenue / Math.max(...data.revenueByMonth.map(r => r.revenue), 1)) * 100)}%` }} />
                    </div>
                    <span className="text-sm font-semibold w-20 text-right">{m.revenue.toFixed(0)}€</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending withdrawals */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="font-semibold">{t("admin_pending_withdrawal_requests")}</h2>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {(data?.withdrawals ?? []).filter(w => w.status === "EN_ATTENTE").length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-8">{t("admin_no_pending_withdrawals")}</p>
              ) : (
                (data?.withdrawals ?? []).filter(w => w.status === "EN_ATTENTE").map((w) => (
                  <div key={w.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-medium">{w.instructeur.user.name}</p>
                      <p className="text-xs text-slate-500">{w.instructeur.user.email} · {w.method}</p>
                      <p className="text-xs text-slate-400">{new Date(w.createdAt).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold">{w.amount.toFixed(0)}€</span>
                      <button onClick={() => processWithdrawal(w.id, "approve")} disabled={processingId === w.id} className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">{t("admin_approve")}</button>
                      <button onClick={() => processWithdrawal(w.id, "reject")} disabled={processingId === w.id} className="text-xs bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">{t("admin_reject")}</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
