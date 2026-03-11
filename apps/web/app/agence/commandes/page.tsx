"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAgencyStore } from "@/store/agency";
import { cn } from "@/lib/utils";
import type { ApiOrder } from "@/lib/api-client";

// ── Status config ──

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  en_attente: { label: "En attente", cls: "bg-amber-500/20 text-amber-400" },
  en_cours: { label: "En cours", cls: "bg-blue-500/20 text-blue-400" },
  livre: { label: "Livrée", cls: "bg-emerald-500/20 text-emerald-400" },
  revision: { label: "Révision", cls: "bg-purple-500/20 text-purple-400" },
  termine: { label: "Terminée", cls: "bg-green-500/20 text-green-400" },
  annule: { label: "Annulée", cls: "bg-red-500/20 text-red-400" },
  litige: { label: "Litige", cls: "bg-red-900/30 text-red-300" },
};

// ── Filter tabs ──

const FILTER_TABS = [
  { key: "all", label: "Toutes", icon: "list" },
  { key: "en_cours", label: "En cours", icon: "autorenew" },
  { key: "livre", label: "Livrées", icon: "check_circle" },
  { key: "annule", label: "Annulées", icon: "cancel" },
  { key: "litige", label: "En litige", icon: "gavel" },
  { key: "en_retard", label: "En retard", icon: "schedule" },
] as const;

const ITEMS_PER_PAGE = 20;

// ── Helpers ──

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function isOverdue(order: ApiOrder): boolean {
  if (["termine", "annule", "livre", "litige"].includes(order.status)) return false;
  return new Date(order.deadline) < new Date();
}

function getProgressColor(progress: number): string {
  if (progress >= 80) return "bg-emerald-500";
  if (progress >= 50) return "bg-blue-500";
  if (progress >= 25) return "bg-amber-500";
  return "bg-red-500";
}

// ── CSV export ──

function generateCsv(orders: ApiOrder[]): void {
  const headers = [
    "N° Commande",
    "Client",
    "Service",
    "Montant (EUR)",
    "Statut",
    "Date limite",
    "Progression (%)",
    "Date création",
  ];

  const rows = orders.map((o) => [
    o.id,
    o.clientName,
    o.serviceTitle,
    o.amount.toString(),
    STATUS_MAP[o.status]?.label || o.status,
    o.deadline,
    o.progress.toString(),
    o.createdAt,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `commandes-agence-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ── Component ──

export default function AgenceCommandes() {
  const {
    orders,
    syncOrders,
    orderFilter,
    setOrderFilter,
    orderSearch,
    setOrderSearch,
    isLoading,
  } = useAgencyStore();

  const [currentPage, setCurrentPage] = useState(1);

  // Sync orders on mount
  useEffect(() => {
    syncOrders();
  }, [syncOrders]);

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [orderFilter, orderSearch]);

  // Filter and search logic
  const filteredOrders = useMemo(() => {
    let result = orders;

    // Apply status filter
    if (orderFilter === "en_retard") {
      result = result.filter((o) => isOverdue(o));
    } else if (orderFilter !== "all") {
      result = result.filter((o) => o.status === orderFilter);
    }

    // Apply search
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.clientName.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          o.serviceTitle.toLowerCase().includes(q)
      );
    }

    return result;
  }, [orders, orderFilter, orderSearch]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length, en_retard: 0 };
    for (const o of orders) {
      counts[o.status] = (counts[o.status] || 0) + 1;
      if (isOverdue(o)) counts.en_retard += 1;
    }
    return counts;
  }, [orders]);

  const handleExportCsv = useCallback(() => {
    generateCsv(filteredOrders);
  }, [filteredOrders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Commandes</h1>
          <p className="text-slate-400 text-sm mt-1">
            Suivez toutes les commandes issues des services de l&apos;agence.
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          disabled={filteredOrders.length === 0}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors",
            filteredOrders.length > 0
              ? "bg-primary text-background-dark hover:opacity-90"
              : "bg-neutral-dark text-slate-500 cursor-not-allowed border border-border-dark"
          )}
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Exporter CSV
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setOrderFilter(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
              orderFilter === tab.key
                ? "bg-primary text-background-dark"
                : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white"
            )}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            {tab.label}
            {(tabCounts[tab.key] ?? 0) > 0 && (
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                  orderFilter === tab.key
                    ? "bg-background-dark/20 text-background-dark"
                    : "bg-border-dark text-slate-400"
                )}
              >
                {tabCounts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[20px]">
          search
        </span>
        <input
          type="text"
          placeholder="Rechercher par nom de client ou n° de commande..."
          value={orderSearch}
          onChange={(e) => setOrderSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-neutral-dark border border-border-dark rounded-lg text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 transition-colors"
        />
        {orderSearch && (
          <button
            onClick={() => setOrderSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Loading state */}
      {isLoading && orders.length === 0 && (
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-12 flex flex-col items-center justify-center gap-3">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">
            progress_activity
          </span>
          <p className="text-slate-400 text-sm">Chargement des commandes...</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredOrders.length === 0 && (
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-12 flex flex-col items-center justify-center gap-3">
          <span className="material-symbols-outlined text-5xl text-slate-600">
            shopping_cart
          </span>
          <p className="text-slate-400 text-sm font-medium">
            Aucune commande pour le moment
          </p>
          {orderSearch && (
            <p className="text-slate-500 text-xs">
              Aucun resultat pour &quot;{orderSearch}&quot;.{" "}
              <button
                onClick={() => setOrderSearch("")}
                className="text-primary hover:underline"
              >
                Effacer la recherche
              </button>
            </p>
          )}
        </div>
      )}

      {/* Table */}
      {!isLoading && paginatedOrders.length > 0 && (
        <div className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-border-dark">
                  <th className="px-5 py-3 text-left font-semibold">N° commande</th>
                  <th className="px-5 py-3 text-left font-semibold">Client</th>
                  <th className="px-5 py-3 text-left font-semibold">Service</th>
                  <th className="px-5 py-3 text-left font-semibold">Montant</th>
                  <th className="px-5 py-3 text-left font-semibold">Statut</th>
                  <th className="px-5 py-3 text-left font-semibold">Date limite</th>
                  <th className="px-5 py-3 text-left font-semibold">Progression</th>
                  <th className="px-5 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => {
                  const overdue = isOverdue(order);
                  const statusInfo = STATUS_MAP[order.status] || {
                    label: order.status,
                    cls: "bg-slate-500/20 text-slate-400",
                  };

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-border-dark/50 hover:bg-background-dark/30 transition-colors"
                    >
                      {/* Order number */}
                      <td className="px-5 py-3">
                        <Link
                          href={`/agence/commandes/${order.id}`}
                          className="text-sm font-mono text-primary font-semibold hover:underline"
                        >
                          {order.id.length > 12
                            ? `#${order.id.slice(-6).toUpperCase()}`
                            : order.id}
                        </Link>
                      </td>

                      {/* Client */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          {order.clientAvatar ? (
                            <Image
                              src={order.clientAvatar}
                              alt={order.clientName}
                              width={28}
                              height={28}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                              {order.clientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </div>
                          )}
                          <span className="text-sm text-slate-300 font-medium truncate max-w-[140px]">
                            {order.clientName}
                          </span>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="px-5 py-3">
                        <span className="text-sm text-white font-semibold truncate block max-w-[200px]">
                          {order.serviceTitle}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-3">
                        <span className="text-sm font-semibold text-white">
                          {formatAmount(order.amount)}
                        </span>
                      </td>

                      {/* Status badge */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              "text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap",
                              statusInfo.cls
                            )}
                          >
                            {statusInfo.label}
                          </span>
                          {overdue && (
                            <span className="material-symbols-outlined text-red-400 text-[16px]" title="En retard">
                              warning
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Deadline */}
                      <td className="px-5 py-3">
                        <span
                          className={cn(
                            "text-sm",
                            overdue ? "text-red-400 font-medium" : "text-slate-500"
                          )}
                        >
                          {formatDate(order.deadline)}
                        </span>
                      </td>

                      {/* Progress bar */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <div className="flex-1 h-1.5 bg-background-dark rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                getProgressColor(order.progress)
                              )}
                              style={{ width: `${Math.min(100, order.progress)}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 font-mono w-8 text-right">
                            {order.progress}%
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3">
                        <Link
                          href={`/agence/commandes/${order.id}`}
                          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-semibold transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            visibility
                          </span>
                          Voir
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-border-dark">
              <p className="text-xs text-slate-500">
                {filteredOrders.length} commande{filteredOrders.length > 1 ? "s" : ""} —
                page {currentPage} sur {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    currentPage === 1
                      ? "text-slate-600 cursor-not-allowed"
                      : "text-slate-400 hover:text-white hover:bg-background-dark"
                  )}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_left
                  </span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    if (totalPages <= 7) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (Math.abs(page - currentPage) <= 1) return true;
                    return false;
                  })
                  .reduce<(number | "ellipsis")[]>((acc, page, idx, arr) => {
                    if (idx > 0) {
                      const prev = arr[idx - 1];
                      if (page - prev > 1) acc.push("ellipsis");
                    }
                    acc.push(page);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "ellipsis" ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-1 text-slate-600 text-xs"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setCurrentPage(item)}
                        className={cn(
                          "w-8 h-8 rounded-lg text-xs font-semibold transition-colors",
                          currentPage === item
                            ? "bg-primary text-background-dark"
                            : "text-slate-400 hover:text-white hover:bg-background-dark"
                        )}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    currentPage === totalPages
                      ? "text-slate-600 cursor-not-allowed"
                      : "text-slate-400 hover:text-white hover:bg-background-dark"
                  )}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
