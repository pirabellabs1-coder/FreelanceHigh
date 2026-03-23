"use client";

import { useState, useEffect, useMemo } from "react";
import { useToastStore } from "@/store/toast";
import { feedApi, type ApiService } from "@/lib/api-client";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────
type ViewTab = "services" | "offres" | "freelances";

interface DerivedFreelancer {
  id: string;
  name: string;
  initials: string;
  avatar: string;
  rating: number;
  serviceCount: number;
  tags: string[];
  categories: string[];
}

// ─── Component ──────────────────────────────────────────

export default function AgenceExplorer() {
  const [tab, setTab] = useState<ViewTab>("services");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Toutes");
  const [showContact, setShowContact] = useState<string | null>(null);
  const [showApply, setShowApply] = useState<string | null>(null);
  const [applyLetter, setApplyLetter] = useState("");
  const [applyPrice, setApplyPrice] = useState("");
  const [applyDeadline, setApplyDeadline] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const { addToast } = useToastStore();

  // ─── Data loading ───
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    feedApi
      .list()
      .then((res) => {
        if (!cancelled) {
          setServices(res.services ?? []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erreur de chargement");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ─── Derived data ───
  const categories = useMemo(() => {
    const cats = Array.from(new Set(services.map((s) => s.categoryName).filter(Boolean)));
    cats.sort((a, b) => a.localeCompare(b, "fr"));
    return ["Toutes", ...cats];
  }, [services]);

  const freelancers = useMemo<DerivedFreelancer[]>(() => {
    const map = new Map<string, DerivedFreelancer>();
    for (const s of services) {
      const key = s.vendorName;
      if (!key) continue;
      const existing = map.get(key);
      if (existing) {
        existing.serviceCount += 1;
        existing.rating = Math.max(existing.rating, s.rating);
        for (const tag of s.tags) {
          if (!existing.tags.includes(tag)) existing.tags.push(tag);
        }
        if (s.categoryName && !existing.categories.includes(s.categoryName)) {
          existing.categories.push(s.categoryName);
        }
      } else {
        const parts = key.trim().split(/\s+/);
        const initials =
          parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : key.slice(0, 2).toUpperCase();
        map.set(key, {
          id: `vendor-${key}`,
          name: key,
          initials,
          avatar: s.vendorAvatar || "",
          rating: s.rating,
          serviceCount: 1,
          tags: [...s.tags],
          categories: s.categoryName ? [s.categoryName] : [],
        });
      }
    }
    return Array.from(map.values());
  }, [services]);

  // ─── Filters ───
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        s.title.toLowerCase().includes(q) ||
        s.vendorName.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q));
      const matchCategory =
        categoryFilter === "Toutes" || s.categoryName === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [services, search, categoryFilter]);

  const filteredFreelancers = useMemo(() => {
    return freelancers.filter((f) => {
      const q = search.toLowerCase();
      return (
        !search ||
        f.name.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q)) ||
        f.categories.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [freelancers, search]);

  // Offres clients tab: no endpoint available yet, always empty
  const filteredOffers: never[] = [];

  const tabs: { key: ViewTab; label: string; icon: string; count: number }[] = [
    { key: "services", label: "Services", icon: "storefront", count: filteredServices.length },
    { key: "offres", label: "Offres Clients", icon: "assignment", count: filteredOffers.length },
    { key: "freelances", label: "Freelances", icon: "person_search", count: filteredFreelancers.length },
  ];

  function handleApply() {
    if (!applyLetter.trim() || !applyPrice.trim()) {
      addToast("error", "Veuillez remplir la lettre de motivation et le prix proposé.");
      return;
    }
    addToast("success", "Candidature envoyée avec succès !");
    setShowApply(null);
    setApplyLetter("");
    setApplyPrice("");
    setApplyDeadline("");
  }

  function handleContact() {
    if (!contactMessage.trim()) {
      addToast("error", "Veuillez rédiger un message.");
      return;
    }
    addToast("success", "Message envoyé !");
    setShowContact(null);
    setContactMessage("");
  }

  // ─── Icon helper: pick a material icon based on category ───
  function categoryIcon(cat: string): string {
    const map: Record<string, string> = {
      "Développement": "code",
      "Design": "palette",
      "Marketing": "campaign",
      "Rédaction": "edit_note",
      "SEO": "troubleshoot",
      "Mobile": "smartphone",
      "Data": "analytics",
      "Vidéo": "videocam",
    };
    return map[cat] || "storefront";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">Explorer</h1>
          <p className="text-slate-400 text-sm mt-1">
            Parcourez le marketplace, les offres clients et les profils freelances.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setCategoryFilter("Toutes"); }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
              tab === t.key
                ? "bg-primary text-background-dark"
                : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white"
            )}
          >
            <span className="material-symbols-outlined text-lg">{t.icon}</span>
            {t.label}
            <span className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
              tab === t.key ? "bg-background-dark/20 text-background-dark" : "bg-primary/10 text-primary"
            )}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search + Category Filters */}
      <div className="space-y-3">
        <div className="relative max-w-lg">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              tab === "services" ? "Rechercher un service, vendeur ou technologie..."
              : tab === "offres" ? "Rechercher une offre, client ou compétence..."
              : "Rechercher un freelance, compétence ou titre..."
            }
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50"
          />
        </div>
        {tab === "services" && categories.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                  categoryFilter === cat
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "bg-neutral-dark text-slate-500 border border-border-dark hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ────── Loading State ────── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-sm text-slate-500">Chargement des données...</p>
        </div>
      )}

      {/* ────── Error State ────── */}
      {!loading && error && (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-5xl text-red-500/60 mb-3">error</span>
          <p className="text-slate-400 font-semibold mb-2">Erreur de chargement</p>
          <p className="text-xs text-slate-500 mb-4">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              feedApi
                .list()
                .then((res) => setServices(res.services ?? []))
                .catch((err) => setError(err instanceof Error ? err.message : "Erreur"))
                .finally(() => setLoading(false));
            }}
            className="px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* ────── Services View ────── */}
      {!loading && !error && tab === "services" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredServices.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <span className="material-symbols-outlined text-5xl text-slate-600 mb-3">
                {services.length === 0 ? "storefront" : "search_off"}
              </span>
              <p className="text-slate-500 font-semibold">
                {services.length === 0
                  ? "Aucun service disponible pour le moment"
                  : "Aucun service trouvé"}
              </p>
              {services.length === 0 && (
                <p className="text-xs text-slate-600 mt-1">
                  Les services apparaitront ici une fois publiés sur le marketplace.
                </p>
              )}
            </div>
          ) : (
            filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden hover:border-primary/20 transition-all group"
              >
                {/* Service icon header */}
                <div className="h-32 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-primary/40 group-hover:text-primary/60 transition-colors">
                    {categoryIcon(service.categoryName)}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  {/* Title + Badge */}
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight">{service.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <p className="text-xs text-slate-500">{service.vendorName}</p>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider bg-emerald-500/20 text-emerald-400">
                        {service.categoryName}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {service.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Rating + Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-yellow-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-xs font-semibold text-white">{service.rating.toFixed(1)}</span>
                      <span className="text-xs text-slate-500">({service.ratingCount})</span>
                    </div>
                    <p className="text-sm font-black text-white">
                      {(service.basePrice ?? 0).toLocaleString("fr-FR")}&nbsp;&euro;
                    </p>
                  </div>

                  {/* Delivery info */}
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    {service.deliveryDays} jour{service.deliveryDays > 1 ? "s" : ""} de livraison
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => addToast("info", `Détails du service "${service.title}"`)}
                      className="flex-1 py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      Voir
                    </button>
                    <button
                      onClick={() => setShowContact(service.vendorName)}
                      className="flex-1 py-2 bg-neutral-dark border border-border-dark text-slate-400 text-xs font-semibold rounded-lg hover:text-white hover:border-primary/30 transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">mail</span>
                      Contacter
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ────── Offres Clients View ────── */}
      {!loading && !error && tab === "offres" && (
        <div className="space-y-3">
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-slate-600 mb-3">assignment</span>
            <p className="text-slate-500 font-semibold">Aucune offre disponible pour le moment</p>
            <p className="text-xs text-slate-600 mt-1">
              Les offres clients apparaitront ici lorsque des projets seront publiés.
            </p>
          </div>
        </div>
      )}

      {/* ────── Freelances View ────── */}
      {!loading && !error && tab === "freelances" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredFreelancers.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <span className="material-symbols-outlined text-5xl text-slate-600 mb-3">
                {freelancers.length === 0 ? "person_search" : "search_off"}
              </span>
              <p className="text-slate-500 font-semibold">
                {freelancers.length === 0
                  ? "Aucun freelance disponible pour le moment"
                  : "Aucun freelance trouvé"}
              </p>
              {freelancers.length === 0 && (
                <p className="text-xs text-slate-600 mt-1">
                  Les freelances apparaitront ici une fois des services publiés.
                </p>
              )}
            </div>
          ) : (
            filteredFreelancers.map((freelancer) => (
              <div
                key={freelancer.id}
                className="bg-neutral-dark rounded-xl border border-border-dark p-5 hover:border-primary/20 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                      {freelancer.initials}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{freelancer.name}</p>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        {freelancer.categories.join(", ") || "Freelance"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rating + Services count */}
                <div className="flex items-center gap-3 mb-3 text-xs text-slate-400">
                  <span className="flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-yellow-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-semibold text-white">{freelancer.rating.toFixed(1)}</span>
                  </span>
                  <span className="flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-sm">storefront</span>
                    {freelancer.serviceCount} service{freelancer.serviceCount > 1 ? "s" : ""}
                  </span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {freelancer.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                      {tag}
                    </span>
                  ))}
                  {freelancer.tags.length > 4 && (
                    <span className="text-[10px] bg-slate-500/10 text-slate-500 px-2 py-0.5 rounded-full font-semibold">
                      +{freelancer.tags.length - 4}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowContact(freelancer.name)}
                    className="flex-1 py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">mail</span>
                    Contacter
                  </button>
                  <button
                    onClick={() => addToast("info", `Proposition de recrutement envoyée à ${freelancer.name}`)}
                    className="flex-1 py-2 bg-neutral-dark border border-border-dark text-slate-400 text-xs font-semibold rounded-lg hover:text-white hover:border-primary/30 transition-colors flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">person_add</span>
                    Recruter
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ────── Contact Modal ────── */}
      {showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowContact(null); setContactMessage(""); }} />
          <div className="relative bg-neutral-dark rounded-2xl border border-border-dark p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Contacter {showContact}</h3>
              <button onClick={() => { setShowContact(null); setContactMessage(""); }} className="text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">Objet</label>
                <input
                  placeholder="Objet de votre message..."
                  className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">Message</label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Rédigez votre message..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowContact(null); setContactMessage(""); }}
                  className="flex-1 py-2.5 text-slate-400 text-sm font-semibold hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleContact}
                  className="flex-1 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────── Apply Modal ────── */}
      {showApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowApply(null); setApplyLetter(""); setApplyPrice(""); setApplyDeadline(""); }} />
          <div className="relative bg-neutral-dark rounded-2xl border border-border-dark p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Postuler</h3>
              <button onClick={() => { setShowApply(null); setApplyLetter(""); setApplyPrice(""); setApplyDeadline(""); }} className="text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">
                  Lettre de motivation
                </label>
                <textarea
                  value={applyLetter}
                  onChange={(e) => setApplyLetter(e.target.value)}
                  placeholder="Expliquez pourquoi votre agence est la meilleure pour ce projet..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">
                    Prix proposé (&euro;)
                  </label>
                  <input
                    value={applyPrice}
                    onChange={(e) => setApplyPrice(e.target.value)}
                    placeholder="Ex: 3500"
                    type="number"
                    className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">
                    Délai proposé
                  </label>
                  <input
                    value={applyDeadline}
                    onChange={(e) => setApplyDeadline(e.target.value)}
                    type="date"
                    className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">
                  Pièces jointes (optionnel)
                </label>
                <div className="border-2 border-dashed border-border-dark rounded-xl p-4 text-center hover:border-primary/30 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-2xl text-slate-500 mb-1">cloud_upload</span>
                  <p className="text-xs text-slate-500">Portfolio, références, propositions...</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowApply(null); setApplyLetter(""); setApplyPrice(""); setApplyDeadline(""); }}
                  className="flex-1 py-2.5 text-slate-400 text-sm font-semibold hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                  Envoyer la candidature
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
