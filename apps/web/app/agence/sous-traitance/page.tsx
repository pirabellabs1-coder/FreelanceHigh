"use client";

import { useState, useEffect, useMemo } from "react";
import { useAgencyStore } from "@/store/agency";
import { useToastStore } from "@/store/toast";
import { feedApi, type ApiService } from "@/lib/api-client";
import { cn } from "@/lib/utils";

// ── Derived freelancer type extracted from services ──

interface DerivedFreelancer {
  id: string;
  name: string;
  username: string;
  avatar: string;
  country: string;
  skills: string[];
  rating: number;
  basePrice: number;
  serviceCount: number;
  initials: string;
}

// ── Status map for missions table ──

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  en_cours: { label: "En cours", cls: "bg-blue-500/20 text-blue-400" },
  livre: { label: "Livrée", cls: "bg-emerald-500/20 text-emerald-400" },
  en_attente: { label: "En attente", cls: "bg-amber-500/20 text-amber-400" },
  revision: { label: "Révision", cls: "bg-orange-500/20 text-orange-400" },
  annule: { label: "Annulée", cls: "bg-red-500/20 text-red-400" },
  termine: { label: "Terminée", cls: "bg-emerald-500/20 text-emerald-400" },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AgenceSousTraitance() {
  const [tab, setTab] = useState<"freelances" | "missions">("freelances");
  const [skillFilter, setSkillFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOrder, setShowOrder] = useState(false);
  const [feedServices, setFeedServices] = useState<ApiService[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const { addToast } = useToastStore();
  const { orders, syncOrders, isLoading: storeLoading } = useAgencyStore();

  // Fetch available freelancers from the public feed
  useEffect(() => {
    let cancelled = false;
    setFeedLoading(true);
    feedApi
      .list()
      .then((res) => {
        if (!cancelled) setFeedServices(res.services);
      })
      .catch(() => {
        // Silently fail — empty state will show
      })
      .finally(() => {
        if (!cancelled) setFeedLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Sync orders from agency store on mount
  useEffect(() => {
    syncOrders();
  }, [syncOrders]);

  // Derive unique freelancers from feed services
  const freelancers = useMemo<DerivedFreelancer[]>(() => {
    const map = new Map<string, DerivedFreelancer>();
    for (const svc of feedServices) {
      const key = svc.vendorUsername || svc.userId;
      const existing = map.get(key);
      if (existing) {
        // Merge tags/skills
        for (const tag of svc.tags) {
          if (!existing.skills.includes(tag)) existing.skills.push(tag);
        }
        existing.serviceCount += 1;
        if (svc.vendorRating > existing.rating) existing.rating = svc.vendorRating;
        if (svc.basePrice < existing.basePrice) existing.basePrice = svc.basePrice;
      } else {
        map.set(key, {
          id: svc.userId,
          name: svc.vendorName,
          username: svc.vendorUsername,
          avatar: svc.vendorAvatar,
          country: svc.vendorCountry,
          skills: [...svc.tags],
          rating: svc.vendorRating,
          basePrice: svc.basePrice,
          serviceCount: 1,
          initials: getInitials(svc.vendorName),
        });
      }
    }
    return Array.from(map.values());
  }, [feedServices]);

  // All unique skills for the filter chips
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    for (const f of freelancers) {
      for (const s of f.skills) set.add(s);
    }
    return Array.from(set).sort();
  }, [freelancers]);

  // Filter freelancers by skill and search query
  const filteredFreelancers = useMemo(() => {
    let result = freelancers;
    if (skillFilter) {
      result = result.filter((f) =>
        f.skills.some((s) => s.toLowerCase().includes(skillFilter.toLowerCase()))
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.skills.some((s) => s.toLowerCase().includes(q)) ||
          f.country.toLowerCase().includes(q)
      );
    }
    return result;
  }, [freelancers, skillFilter, searchQuery]);

  // Missions derived from agency orders
  const missions = useMemo(() => orders, [orders]);
  const activeMissionCount = useMemo(
    () => missions.filter((m) => m.status === "en_cours").length,
    [missions]
  );

  // Stats
  const totalMissionsValue = useMemo(
    () => missions.reduce((sum, m) => sum + m.amount, 0),
    [missions]
  );
  const totalCommission = useMemo(
    () => missions.reduce((sum, m) => sum + m.commission, 0),
    [missions]
  );

  const loading = feedLoading || storeLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">Sous-traitance</h1>
          <p className="text-slate-400 text-sm mt-1">
            Trouvez des freelances externes et gérez les missions sous-traitées.
          </p>
        </div>
        <button
          onClick={() => setShowOrder(true)}
          className="px-4 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nouvelle commande
        </button>
      </div>

      {/* Stats summary */}
      {missions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-neutral-dark rounded-xl border border-border-dark p-4">
            <p className="text-xs text-slate-500 mb-1">Missions actives</p>
            <p className="text-xl font-black text-white">{activeMissionCount}</p>
          </div>
          <div className="bg-neutral-dark rounded-xl border border-border-dark p-4">
            <p className="text-xs text-slate-500 mb-1">Valeur totale</p>
            <p className="text-xl font-black text-white">
              {totalMissionsValue.toLocaleString("fr-FR")} €
            </p>
          </div>
          <div className="bg-neutral-dark rounded-xl border border-border-dark p-4">
            <p className="text-xs text-slate-500 mb-1">Commission agence</p>
            <p className="text-xl font-black text-primary">
              {totalCommission.toLocaleString("fr-FR")} €
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("freelances")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
            tab === "freelances"
              ? "bg-primary text-background-dark"
              : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white"
          )}
        >
          Freelances disponibles
        </button>
        <button
          onClick={() => setTab("missions")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
            tab === "missions"
              ? "bg-primary text-background-dark"
              : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white"
          )}
        >
          Missions en cours ({activeMissionCount})
        </button>
      </div>

      {/* ── Freelances Tab ── */}
      {tab === "freelances" && (
        <>
          {/* Search */}
          <div className="relative max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un freelance ou une compétence..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50"
            />
          </div>

          {/* Skill filter chips */}
          {allSkills.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {allSkills.map((s) => (
                <button
                  key={s}
                  onClick={() => setSkillFilter(skillFilter === s ? "" : s)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                    skillFilter === s
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "bg-neutral-dark text-slate-500 border border-border-dark hover:text-white"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredFreelancers.length === 0 && (
            <div className="bg-neutral-dark rounded-xl border border-border-dark p-12 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-600 mb-3 block">
                person_search
              </span>
              <p className="text-white font-semibold mb-1">Aucun freelance disponible</p>
              <p className="text-sm text-slate-500">
                {searchQuery || skillFilter
                  ? "Essayez de modifier vos critères de recherche."
                  : "Les freelances de la plateforme apparaitront ici."}
              </p>
            </div>
          )}

          {/* Freelancer cards */}
          {!loading && filteredFreelancers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredFreelancers.map((f) => (
                <div
                  key={f.id}
                  className="bg-neutral-dark rounded-xl border border-border-dark p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {f.avatar ? (
                        <img
                          src={f.avatar}
                          alt={f.name}
                          className="w-11 h-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                          {f.initials}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-white text-sm">{f.name}</p>
                        <p className="text-xs text-slate-500">
                          {f.country ? `${f.country} · ` : ""}
                          {f.serviceCount} service{f.serviceCount > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {f.skills.slice(0, 6).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold"
                      >
                        {s}
                      </span>
                    ))}
                    {f.skills.length > 6 && (
                      <span className="text-[10px] text-slate-500 px-2 py-0.5">
                        +{f.skills.length - 6}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>A partir de {(f.basePrice ?? 0).toLocaleString("fr-FR")} €</span>
                      {f.rating > 0 && (
                        <span className="flex items-center gap-0.5">
                          <span
                            className="material-symbols-outlined text-yellow-400 text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                          {f.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setShowOrder(true)}
                      className="text-xs text-primary font-semibold hover:underline"
                    >
                      Commander
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Missions Tab ── */}
      {tab === "missions" && (
        <>
          {/* Loading state */}
          {storeLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
          )}

          {/* Empty state */}
          {!storeLoading && missions.length === 0 && (
            <div className="bg-neutral-dark rounded-xl border border-border-dark p-12 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-600 mb-3 block">
                assignment
              </span>
              <p className="text-white font-semibold mb-1">Aucune mission en cours</p>
              <p className="text-sm text-slate-500">
                Vos commandes sous-traitees apparaitront ici une fois lancees.
              </p>
            </div>
          )}

          {/* Missions table */}
          {!storeLoading && missions.length > 0 && (
            <div className="bg-neutral-dark rounded-xl border border-border-dark overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-border-dark">
                    <th className="px-5 py-3 text-left font-semibold">Mission</th>
                    <th className="px-5 py-3 text-left font-semibold">Client</th>
                    <th className="px-5 py-3 text-left font-semibold">Montant</th>
                    <th className="px-5 py-3 text-left font-semibold">Commission</th>
                    <th className="px-5 py-3 text-left font-semibold">Statut</th>
                    <th className="px-5 py-3 text-left font-semibold">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {missions.map((m) => {
                    const statusInfo = STATUS_MAP[m.status] || {
                      label: m.status,
                      cls: "bg-slate-500/20 text-slate-400",
                    };
                    return (
                      <tr
                        key={m.id}
                        className="border-b border-border-dark/50 hover:bg-background-dark/30 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <p className="text-sm font-semibold text-white">
                            {m.serviceTitle}
                          </p>
                          <p className="text-xs text-slate-500">#{m.id.slice(-6)}</p>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            {m.clientAvatar && (
                              <img
                                src={m.clientAvatar}
                                alt={m.clientName}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            )}
                            <span className="text-sm text-slate-300">{m.clientName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm font-bold text-white">
                          {(m.amount ?? 0).toLocaleString("fr-FR")} €
                        </td>
                        <td className="px-5 py-3 text-sm font-semibold text-primary">
                          {(m.commission ?? 0).toLocaleString("fr-FR")} €
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={cn(
                              "text-xs font-semibold px-2.5 py-1 rounded-full",
                              statusInfo.cls
                            )}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-500">
                          {new Date(m.deadline).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── New Order Modal ── */}
      {showOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowOrder(false)}
          />
          <div className="relative bg-neutral-dark rounded-2xl border border-border-dark p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">
              Nouvelle commande externe
            </h3>
            <div className="space-y-4">
              <input
                placeholder="Description de la mission"
                className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Budget (€)"
                  className="px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50"
                />
                <input
                  type="date"
                  className="px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50"
                />
              </div>
              <textarea
                placeholder="Détails..."
                rows={3}
                className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 resize-none"
              />
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowOrder(false)}
                  className="flex-1 py-2.5 text-slate-400 text-sm font-semibold hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    addToast("success", "Commande envoyée !");
                    setShowOrder(false);
                  }}
                  className="flex-1 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
