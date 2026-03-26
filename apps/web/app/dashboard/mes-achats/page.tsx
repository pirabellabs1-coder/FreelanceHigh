"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToastStore } from "@/store/dashboard";
import { ordersApi, type ApiOrder } from "@/lib/api-client";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  en_attente: { label: "En attente", color: "bg-amber-500/10 text-amber-400", icon: "schedule" },
  EN_ATTENTE: { label: "En attente", color: "bg-amber-500/10 text-amber-400", icon: "schedule" },
  en_cours: { label: "En cours", color: "bg-blue-500/10 text-blue-400", icon: "play_circle" },
  EN_COURS: { label: "En cours", color: "bg-blue-500/10 text-blue-400", icon: "play_circle" },
  livre: { label: "Livre", color: "bg-emerald-500/10 text-emerald-400", icon: "local_shipping" },
  LIVRE: { label: "Livre", color: "bg-emerald-500/10 text-emerald-400", icon: "local_shipping" },
  revision: { label: "Revision", color: "bg-orange-500/10 text-orange-400", icon: "edit_note" },
  REVISION: { label: "Revision", color: "bg-orange-500/10 text-orange-400", icon: "edit_note" },
  termine: { label: "Termine", color: "bg-emerald-500/10 text-emerald-400", icon: "check_circle" },
  TERMINE: { label: "Termine", color: "bg-emerald-500/10 text-emerald-400", icon: "check_circle" },
  annule: { label: "Annule", color: "bg-red-500/10 text-red-400", icon: "cancel" },
  ANNULE: { label: "Annule", color: "bg-red-500/10 text-red-400", icon: "cancel" },
  litige: { label: "Litige", color: "bg-red-500/10 text-red-400", icon: "gavel" },
  LITIGE: { label: "Litige", color: "bg-red-500/10 text-red-400", icon: "gavel" },
};

type FilterTab = "all" | "en_attente" | "en_cours" | "livre" | "termine" | "litige";

export default function MesAchatsPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  useEffect(() => {
    setLoading(true);
    // Fetch orders where current user is the BUYER
    fetch("/api/orders?side=buyer")
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return orders;
    return orders.filter((o) => {
      const s = (o.status || "").toLowerCase();
      return s === activeFilter;
    });
  }, [orders, activeFilter]);

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "Tous" },
    { key: "en_attente", label: "En attente" },
    { key: "en_cours", label: "En cours" },
    { key: "livre", label: "Livres" },
    { key: "termine", label: "Termines" },
    { key: "litige", label: "Litiges" },
  ];

  const totalSpent = orders
    .filter((o) => ["termine", "TERMINE"].includes(o.status))
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  return (
    <div className="max-w-full space-y-6">
      {/* Header */}
      <div>
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-primary font-medium">Mes Achats</span>
        </nav>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold">Mes Achats</h1>
        <p className="text-slate-400 mt-1">Services que vous avez achetes aupres d&apos;autres freelances ou agences.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-background-dark/50 border border-border-dark rounded-xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Total achats</p>
          <p className="text-3xl font-extrabold">{orders.length}</p>
        </div>
        <div className="bg-background-dark/50 border border-border-dark rounded-xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">En cours</p>
          <p className="text-3xl font-extrabold text-blue-400">
            {orders.filter((o) => ["en_cours", "EN_COURS", "livre", "LIVRE", "revision", "REVISION"].includes(o.status)).length}
          </p>
        </div>
        <div className="bg-background-dark/50 border border-border-dark rounded-xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Total depense</p>
          <p className="text-3xl font-extrabold text-primary">{totalSpent.toLocaleString("fr-FR")} EUR</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filterTabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveFilter(tab.key)}
            className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all",
              activeFilter === tab.key ? "bg-primary text-white" : "bg-background-dark/50 border border-border-dark text-slate-400 hover:text-white hover:border-primary/30")}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-background-dark/50 border border-border-dark rounded-xl p-5 animate-pulse">
              <div className="h-5 w-48 bg-slate-700 rounded mb-2" />
              <div className="h-3 w-32 bg-slate-700/50 rounded" />
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-background-dark/50 border border-border-dark rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-slate-600 mb-3 block">shopping_bag</span>
          <p className="text-lg font-bold text-slate-400 mb-2">Aucun achat</p>
          <p className="text-sm text-slate-500 mb-4">
            {activeFilter === "all"
              ? "Vous n'avez pas encore achete de services. Explorez le marketplace !"
              : "Aucun achat dans cette categorie."}
          </p>
          <Link href="/explorer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-lg">explore</span>
            Explorer les services
          </Link>
        </div>
      ) : (
        <div className="bg-background-dark/50 border border-border-dark rounded-xl overflow-hidden">
          <div className="divide-y divide-border-dark">
            {filteredOrders.map((order) => {
              const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.en_attente;
              const amount = order.amount || 0;
              return (
                <Link key={order.id} href={`/client/commandes/${order.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-primary/5 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                    <span className="material-symbols-outlined text-lg">{sc.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {(order as unknown as Record<string, string>).serviceTitle || `Commande ${order.id}`}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {order.id} &middot; {new Date(order.createdAt || "").toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1", sc.color)}>
                    <span className="material-symbols-outlined text-sm">{sc.icon}</span>
                    {sc.label}
                  </span>
                  <p className="text-sm font-bold w-24 text-right flex-shrink-0">&euro;{amount.toLocaleString("fr-FR")}</p>
                  <span className="material-symbols-outlined text-slate-500 text-lg flex-shrink-0">chevron_right</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
