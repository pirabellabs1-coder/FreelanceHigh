"use client";

import { useState, useMemo } from "react";
import { usePlatformDataStore, type AuditEntry } from "@/store/platform-data";
import { cn } from "@/lib/utils";

const ACTION_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  suspend_user: { label: "Suspension", color: "text-amber-400 bg-amber-500/10", icon: "pause_circle" },
  ban_user: { label: "Bannissement", color: "text-red-400 bg-red-500/10", icon: "block" },
  reactivate_user: { label: "Reactivation", color: "text-green-400 bg-green-500/10", icon: "check_circle" },
  change_role: { label: "Changement role", color: "text-blue-400 bg-blue-500/10", icon: "swap_horiz" },
  change_plan: { label: "Changement plan", color: "text-purple-400 bg-purple-500/10", icon: "workspace_premium" },
  verify_kyc: { label: "Verification KYC", color: "text-green-400 bg-green-500/10", icon: "verified" },
  approve_kyc: { label: "KYC approuve", color: "text-green-400 bg-green-500/10", icon: "verified" },
  refuse_kyc: { label: "KYC refuse", color: "text-red-400 bg-red-500/10", icon: "cancel" },
  resolve_dispute: { label: "Litige resolu", color: "text-blue-400 bg-blue-500/10", icon: "gavel" },
  impersonate: { label: "Impersonation", color: "text-amber-400 bg-amber-500/10", icon: "visibility" },
  reset_password: { label: "Reset mdp", color: "text-amber-400 bg-amber-500/10", icon: "lock_reset" },
};

function formatDateTime(ts: string) {
  return new Date(ts).toLocaleString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function getActionInfo(action: string) {
  return ACTION_LABELS[action] ?? { label: action, color: "text-slate-400 bg-slate-500/10", icon: "info" };
}

export default function AuditLogPage() {
  const { auditLog } = usePlatformDataStore();
  const [filterAction, setFilterAction] = useState("tous");
  const [search, setSearch] = useState("");

  const uniqueActions = useMemo(
    () => [...new Set(auditLog.map((e) => e.action))],
    [auditLog]
  );

  const filtered = useMemo(() => {
    let list = auditLog;
    if (filterAction !== "tous") {
      list = list.filter((e) => e.action === filterAction);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.adminName.toLowerCase().includes(q) ||
          (e.targetUserName?.toLowerCase().includes(q) ?? false) ||
          e.action.toLowerCase().includes(q)
      );
    }
    return list;
  }, [auditLog, filterAction, search]);

  function exportCsv() {
    const header = "Date,Admin,Action,Cible,Details\n";
    const rows = filtered
      .map((e) =>
        `"${formatDateTime(e.createdAt)}","${e.adminName}","${e.action}","${e.targetUserName ?? "-"}","${JSON.stringify(e.details ?? {})}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Journal d&apos;audit</h2>
          <p className="text-slate-400 mt-1">
            {auditLog.length} action{auditLog.length !== 1 ? "s" : ""} enregistree{auditLog.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          Exporter CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
          <input
            type="text"
            placeholder="Rechercher par admin, cible, action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-dark border border-border-dark rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary appearance-none"
        >
          <option value="tous">Toutes les actions</option>
          {uniqueActions.map((a) => (
            <option key={a} value={a}>{getActionInfo(a).label}</option>
          ))}
        </select>
      </div>

      {/* Audit log table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <span className="material-symbols-outlined text-5xl mb-3">history</span>
          <p className="font-medium">Aucune action enregistree</p>
          <p className="text-xs mt-1">Les actions admin apparaitront ici automatiquement.</p>
        </div>
      ) : (
        <div className="bg-neutral-dark border border-border-dark rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-dark text-left">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Admin</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Cible</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => {
                const info = getActionInfo(entry.action);
                return (
                  <tr key={entry.id} className="border-b border-border-dark/50 hover:bg-background-dark/30">
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                      {formatDateTime(entry.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-white">{entry.adminName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold", info.color)}>
                        <span className="material-symbols-outlined text-xs">{info.icon}</span>
                        {info.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {entry.targetUserName ? (
                        <a href={`/admin/utilisateurs/${entry.targetUserId}`} className="text-sm text-primary hover:underline font-medium">
                          {entry.targetUserName}
                        </a>
                      ) : (
                        <span className="text-sm text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {entry.details ? (
                        <span className="text-xs text-slate-400">
                          {Object.entries(entry.details)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(", ")}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
