"use client";

import { useState, useMemo } from "react";
import { usePlatformDataStore } from "@/store/platform-data";
import { cn } from "@/lib/utils";

const STATUS_MAP: Record<string, { label: string; cls: string; icon: string }> = {
  en_attente: { label: "En attente", cls: "bg-slate-500/20 text-slate-400", icon: "hourglass_empty" },
  en_cours: { label: "En cours", cls: "bg-blue-500/20 text-blue-400", icon: "sync" },
  livre: { label: "Livré", cls: "bg-teal-500/20 text-teal-400", icon: "local_shipping" },
  revision: { label: "Révision", cls: "bg-amber-500/20 text-amber-400", icon: "edit_note" },
  termine: { label: "Terminé", cls: "bg-emerald-500/20 text-emerald-400", icon: "check_circle" },
  annule: { label: "Annulé", cls: "bg-slate-500/20 text-slate-500", icon: "cancel" },
  litige: { label: "Litige", cls: "bg-red-500/20 text-red-400", icon: "gavel" },
};

const ESCROW_MAP: Record<string, { label: string; cls: string }> = {
  held: { label: "Bloqué", cls: "bg-amber-500/20 text-amber-400" },
  released: { label: "Libéré", cls: "bg-emerald-500/20 text-emerald-400" },
  disputed: { label: "Litige", cls: "bg-red-500/20 text-red-400" },
  refunded: { label: "Remboursé", cls: "bg-slate-500/20 text-slate-400" },
};

export default function AdminCommandes() {
  const { orders, forceDelivery, forceCancel, releaseEscrow, refundOrder, updateOrderStatus } = usePlatformDataStore();
  const [tab, setTab] = useState("toutes");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ orderId: string; action: string } | null>(null);

  const filtered = useMemo(() => {
    return orders.filter(o => {
      if (tab !== "toutes" && o.status !== tab) return false;
      if (search) {
        const q = search.toLowerCase();
        return o.id.toLowerCase().includes(q) || o.serviceTitle.toLowerCase().includes(q) || o.freelanceName.toLowerCase().includes(q) || o.clientName.toLowerCase().includes(q);
      }
      return true;
    }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [orders, tab, search]);

  const totalVolume = orders.filter(o => o.status !== "annule").reduce((s, o) => s + o.amount, 0);
  const totalCommissions = orders.filter(o => ["termine", "livre"].includes(o.status)).reduce((s, o) => s + o.commission, 0);

  const tabs = [
    { key: "toutes", label: "Toutes", count: orders.length },
    { key: "en_attente", label: "En attente", count: orders.filter(o => o.status === "en_attente").length },
    { key: "en_cours", label: "En cours", count: orders.filter(o => o.status === "en_cours").length },
    { key: "livre", label: "Livrées", count: orders.filter(o => o.status === "livre").length },
    { key: "revision", label: "Révision", count: orders.filter(o => o.status === "revision").length },
    { key: "termine", label: "Terminées", count: orders.filter(o => o.status === "termine").length },
    { key: "litige", label: "Litiges", count: orders.filter(o => o.status === "litige").length },
    { key: "annule", label: "Annulées", count: orders.filter(o => o.status === "annule").length },
  ];

  const detail = selectedOrder ? orders.find(o => o.id === selectedOrder) : null;

  function executeAction() {
    if (!confirmAction) return;
    const { orderId, action } = confirmAction;
    switch (action) {
      case "forceDelivery": forceDelivery(orderId); break;
      case "forceCancel": forceCancel(orderId); break;
      case "releaseEscrow": releaseEscrow(orderId); break;
      case "refundOrder": refundOrder(orderId); break;
    }
    setConfirmAction(null);
    setSelectedOrder(null);
  }

  const actionLabels: Record<string, { label: string; desc: string; color: string }> = {
    forceDelivery: { label: "Forcer la livraison", desc: "Marquer cette commande comme terminée et libérer les fonds immédiatement.", color: "bg-emerald-600 hover:bg-emerald-700" },
    forceCancel: { label: "Forcer l'annulation", desc: "Annuler cette commande et rembourser le client.", color: "bg-red-600 hover:bg-red-700" },
    releaseEscrow: { label: "Libérer l'escrow", desc: "Libérer les fonds bloqués et marquer la commande comme terminée.", color: "bg-blue-600 hover:bg-blue-700" },
    refundOrder: { label: "Rembourser", desc: "Annuler et rembourser intégralement le client. Une transaction de remboursement sera créée.", color: "bg-red-600 hover:bg-red-700" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">shopping_bag</span>
            Gestion des Commandes
          </h1>
          <p className="text-slate-400 text-sm mt-1">Gérer toutes les commandes, escrow et interventions manuelles.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        {[
          { label: "Commandes totales", value: orders.length.toString(), icon: "receipt_long", color: "text-primary" },
          { label: "En cours", value: orders.filter(o => o.status === "en_cours").length.toString(), icon: "sync", color: "text-blue-400" },
          { label: "Litiges", value: orders.filter(o => o.status === "litige").length.toString(), icon: "gavel", color: "text-red-400" },
          { label: "Volume total", value: `€${totalVolume.toLocaleString()}`, icon: "payments", color: "text-emerald-400" },
          { label: "Commissions", value: `€${totalCommissions.toLocaleString()}`, icon: "account_balance", color: "text-amber-400" },
        ].map(s => (
          <div key={s.label} className="bg-neutral-dark rounded-xl p-4 border border-border-dark">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("material-symbols-outlined text-lg", s.color)}>{s.icon}</span>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{s.label}</p>
            </div>
            <p className="text-xl font-black text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table container */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
        {/* Tabs + search */}
        <div className="p-4 border-b border-border-dark flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex gap-1 flex-wrap">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1",
                  tab === t.key ? "bg-primary text-white" : "text-slate-400 hover:bg-border-dark hover:text-white"
                )}
              >
                {t.label}
                {t.count > 0 && <span className={cn("text-[10px] rounded-full px-1.5", tab === t.key ? "bg-white/20" : "bg-border-dark")}>{t.count}</span>}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher ID, service, freelance, client..."
              className="pl-9 pr-4 py-2 rounded-lg border border-border-dark bg-background-dark text-white text-sm outline-none focus:border-primary w-full sm:w-72 placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-border-dark">
                <th className="px-4 py-3 text-left font-semibold">ID</th>
                <th className="px-4 py-3 text-left font-semibold">Service</th>
                <th className="px-4 py-3 text-left font-semibold">Freelance</th>
                <th className="px-4 py-3 text-left font-semibold">Client</th>
                <th className="px-4 py-3 text-center font-semibold">Montant</th>
                <th className="px-4 py-3 text-center font-semibold">Statut</th>
                <th className="px-4 py-3 text-center font-semibold">Escrow</th>
                <th className="px-4 py-3 text-center font-semibold">Progression</th>
                <th className="px-4 py-3 text-left font-semibold">Deadline</th>
                <th className="px-4 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-b border-border-dark/50 hover:bg-primary/5 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono font-bold text-primary">{o.id}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-white max-w-[180px] truncate">{o.serviceTitle}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{o.freelanceName}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{o.clientName}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className="font-bold text-white">&euro;{o.amount.toLocaleString()}</span>
                    <span className="block text-[10px] text-slate-500">comm. &euro;{o.commission}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1", STATUS_MAP[o.status]?.cls)}>
                      <span className="material-symbols-outlined text-xs">{STATUS_MAP[o.status]?.icon}</span>
                      {STATUS_MAP[o.status]?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", ESCROW_MAP[o.escrowStatus]?.cls)}>
                      {ESCROW_MAP[o.escrowStatus]?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-border-dark rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${o.progress}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{o.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400">{new Date(o.deadline).toLocaleDateString("fr-FR")}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedOrder(o.id)}
                      className="p-1.5 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                      title="Gérer"
                    >
                      <span className="material-symbols-outlined text-lg">settings</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-slate-600">inbox</span>
            <p className="text-slate-500 mt-2">Aucune commande trouvée</p>
          </div>
        )}
      </div>

      {/* Order detail / action modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-neutral-dark rounded-2xl border border-border-dark w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border-dark flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">receipt_long</span>
                  Commande {detail.id}
                </h2>
                <p className="text-sm text-slate-400 mt-0.5">{detail.serviceTitle}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background-dark/50 rounded-lg p-3">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Freelance</p>
                  <p className="text-sm font-semibold text-white">{detail.freelanceName}</p>
                </div>
                <div className="bg-background-dark/50 rounded-lg p-3">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Client</p>
                  <p className="text-sm font-semibold text-white">{detail.clientName}</p>
                </div>
                <div className="bg-background-dark/50 rounded-lg p-3">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Montant</p>
                  <p className="text-sm font-bold text-primary">&euro;{detail.amount.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Commission : &euro;{detail.commission}</p>
                </div>
                <div className="bg-background-dark/50 rounded-lg p-3">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Catégorie</p>
                  <p className="text-sm text-white">{detail.category}</p>
                </div>
                <div className="bg-background-dark/50 rounded-lg p-3">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Créée le</p>
                  <p className="text-sm text-white">{new Date(detail.createdAt).toLocaleDateString("fr-FR")}</p>
                </div>
                <div className="bg-background-dark/50 rounded-lg p-3">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Deadline</p>
                  <p className="text-sm text-white">{new Date(detail.deadline).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>

              {/* Status & Escrow */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Statut :</span>
                  <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1", STATUS_MAP[detail.status]?.cls)}>
                    <span className="material-symbols-outlined text-xs">{STATUS_MAP[detail.status]?.icon}</span>
                    {STATUS_MAP[detail.status]?.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Escrow :</span>
                  <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", ESCROW_MAP[detail.escrowStatus]?.cls)}>
                    {ESCROW_MAP[detail.escrowStatus]?.label}
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">Progression</span>
                  <span className="text-xs font-bold text-white">{detail.progress}%</span>
                </div>
                <div className="h-2 bg-border-dark rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${detail.progress}%` }} />
                </div>
              </div>

              {detail.deliveredAt && (
                <p className="text-xs text-slate-400">
                  <span className="material-symbols-outlined text-xs text-emerald-400 mr-1">check</span>
                  Livré le {new Date(detail.deliveredAt).toLocaleDateString("fr-FR")}
                </p>
              )}

              {/* Quick status change */}
              {!["termine", "annule"].includes(detail.status) && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Changer le statut</p>
                  <div className="flex gap-2 flex-wrap">
                    {(["en_attente", "en_cours", "livre", "revision", "litige"] as const).filter(s => s !== detail.status).map(s => (
                      <button
                        key={s}
                        onClick={() => { updateOrderStatus(detail.id, s); }}
                        className={cn("text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors hover:opacity-80", STATUS_MAP[s]?.cls, "border-transparent")}
                      >
                        {STATUS_MAP[s]?.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin actions */}
              <div className="border-t border-border-dark pt-5">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Actions admin</p>
                <div className="grid grid-cols-2 gap-2">
                  {detail.escrowStatus === "held" && !["termine", "annule"].includes(detail.status) && (
                    <>
                      <button
                        onClick={() => setConfirmAction({ orderId: detail.id, action: "forceDelivery" })}
                        className="flex items-center gap-2 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm font-semibold hover:border-emerald-500/40 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        Forcer la livraison
                      </button>
                      <button
                        onClick={() => setConfirmAction({ orderId: detail.id, action: "releaseEscrow" })}
                        className="flex items-center gap-2 p-3 rounded-lg border border-blue-500/20 bg-blue-500/5 text-blue-400 text-sm font-semibold hover:border-blue-500/40 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">lock_open</span>
                        Libérer l&apos;escrow
                      </button>
                    </>
                  )}
                  {!["termine", "annule"].includes(detail.status) && (
                    <>
                      <button
                        onClick={() => setConfirmAction({ orderId: detail.id, action: "forceCancel" })}
                        className="flex items-center gap-2 p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-sm font-semibold hover:border-red-500/40 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">cancel</span>
                        Annuler la commande
                      </button>
                      <button
                        onClick={() => setConfirmAction({ orderId: detail.id, action: "refundOrder" })}
                        className="flex items-center gap-2 p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-sm font-semibold hover:border-red-500/40 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">currency_exchange</span>
                        Rembourser
                      </button>
                    </>
                  )}
                  {["termine", "annule"].includes(detail.status) && (
                    <p className="col-span-2 text-sm text-slate-500 text-center py-4">Cette commande est {detail.status === "termine" ? "terminée" : "annulée"}. Aucune action disponible.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4" onClick={() => setConfirmAction(null)}>
          <div className="bg-neutral-dark rounded-2xl border border-border-dark w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-2xl text-amber-400">warning</span>
              <h3 className="text-lg font-bold text-white">Confirmer l&apos;action</h3>
            </div>
            <p className="text-sm text-slate-300 mb-2 font-semibold">{actionLabels[confirmAction.action]?.label}</p>
            <p className="text-sm text-slate-400 mb-6">{actionLabels[confirmAction.action]?.desc}</p>
            <p className="text-xs text-slate-500 mb-6">Commande : <span className="font-mono text-primary">{confirmAction.orderId}</span></p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmAction(null)} className="flex-1 py-2.5 border border-border-dark rounded-lg text-sm font-semibold text-slate-400 hover:text-white transition-colors">Annuler</button>
              <button onClick={executeAction} className={cn("flex-1 py-2.5 rounded-lg text-sm font-bold text-white transition-colors", actionLabels[confirmAction.action]?.color)}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
