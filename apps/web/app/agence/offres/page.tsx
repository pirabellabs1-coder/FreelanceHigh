"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Demo data                                                          */
/* ------------------------------------------------------------------ */

const STATS = [
  { label: "Offres envoyees", value: "22", icon: "local_offer", color: "text-primary" },
  { label: "En attente", value: "8", icon: "hourglass_top", color: "text-amber-400" },
  { label: "Acceptees", value: "10", icon: "check_circle", color: "text-emerald-400" },
  { label: "CA potentiel", value: "\u20ac45 200", icon: "payments", color: "text-blue-400" },
];

type OfferStatus = "en_attente" | "acceptee" | "refusee" | "expiree";

interface CustomOffer {
  id: string;
  client: string;
  clientInitials: string;
  projectTitle: string;
  description: string;
  amount: number;
  deadline: string;
  validity: string;
  status: OfferStatus;
  createdAt: string;
}

const OFFERS: CustomOffer[] = [
  { id: "OFF-001", client: "Marc Dupont", clientInitials: "MD", projectTitle: "Refonte e-commerce Dakar Shop", description: "Refonte compl\u00e8te du site e-commerce avec int\u00e9gration Mobile Money et nouveau design responsive.", amount: 8500, deadline: "2026-04-15", validity: "2026-03-15", status: "en_attente", createdAt: "2026-03-01" },
  { id: "OFF-002", client: "Aminata Tour\u00e9", clientInitials: "AT", projectTitle: "Strat\u00e9gie SEO FashionAfrik", description: "Audit SEO complet, optimisation on-page et off-page, strat\u00e9gie de contenu sur 6 mois.", amount: 4200, deadline: "2026-09-30", validity: "2026-03-20", status: "acceptee", createdAt: "2026-02-25" },
  { id: "OFF-003", client: "Pierre Legrand", clientInitials: "PL", projectTitle: "Plateforme FinTech CI v2", description: "D\u00e9veloppement de la version 2 avec nouveaux modules de conformit\u00e9 et tableaux de bord avanc\u00e9s.", amount: 22000, deadline: "2026-07-31", validity: "2026-03-10", status: "en_attente", createdAt: "2026-02-28" },
  { id: "OFF-004", client: "Jean Kouam\u00e9", clientInitials: "JK", projectTitle: "App mobile QuickDeliver v3", description: "Ajout du suivi temps r\u00e9el GPS, notifications push et int\u00e9gration Wave.", amount: 12000, deadline: "2026-05-30", validity: "2026-03-08", status: "acceptee", createdAt: "2026-02-20" },
  { id: "OFF-005", client: "Sophie Diallo", clientInitials: "SD", projectTitle: "Branding EduTech SN", description: "Cr\u00e9ation de l'identit\u00e9 visuelle compl\u00e8te et du kit de communication digitale.", amount: 3800, deadline: "2026-04-30", validity: "2026-02-20", status: "expiree", createdAt: "2026-02-05" },
  { id: "OFF-006", client: "Fatima Benali", clientInitials: "FB", projectTitle: "App sant\u00e9 HealthApp", description: "Module de t\u00e9l\u00e9consultation et int\u00e9gration calendrier rendez-vous patients.", amount: 9500, deadline: "2026-06-15", validity: "2026-03-25", status: "en_attente", createdAt: "2026-03-02" },
  { id: "OFF-007", client: "Omar Sy", clientInitials: "OS", projectTitle: "Site m\u00e9dia MediaGroup", description: "Cr\u00e9ation d'un portail m\u00e9dia avec CMS personnalis\u00e9, streaming vid\u00e9o et mon\u00e9tisation.", amount: 15000, deadline: "2026-08-31", validity: "2026-02-15", status: "refusee", createdAt: "2026-01-30" },
  { id: "OFF-008", client: "Claire Martin", clientInitials: "CM", projectTitle: "Portail tourisme TourAfrique", description: "Refonte du portail avec r\u00e9servation en ligne, multi-devises et multilingue (FR/EN/ES).", amount: 7200, deadline: "2026-05-15", validity: "2026-03-18", status: "en_attente", createdAt: "2026-03-03" },
];

const STATUS_MAP: Record<OfferStatus, { label: string; cls: string }> = {
  en_attente: { label: "En attente", cls: "bg-amber-500/20 text-amber-400" },
  acceptee: { label: "Accept\u00e9e", cls: "bg-emerald-500/20 text-emerald-400" },
  refusee: { label: "Refus\u00e9e", cls: "bg-red-500/20 text-red-400" },
  expiree: { label: "Expir\u00e9e", cls: "bg-slate-500/20 text-slate-400" },
};

const FILTER_TABS = [
  { key: "toutes", label: "Toutes" },
  { key: "en_attente", label: "En attente" },
  { key: "acceptee", label: "Accept\u00e9es" },
  { key: "refusee", label: "Refus\u00e9es" },
  { key: "expiree", label: "Expir\u00e9es" },
];

const CLIENT_LIST = [
  "Marc Dupont",
  "Aminata Tour\u00e9",
  "Pierre Legrand",
  "Jean Kouam\u00e9",
  "Sophie Diallo",
  "Fatima Benali",
  "Omar Sy",
  "Claire Martin",
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AgenceOffres() {
  const [filter, setFilter] = useState("toutes");
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [detailOffer, setDetailOffer] = useState<CustomOffer | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editOffer, setEditOffer] = useState<CustomOffer | null>(null);

  // Create form state
  const [formClient, setFormClient] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formDeadline, setFormDeadline] = useState("");
  const [formValidity, setFormValidity] = useState("");

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  const { addToast } = useToastStore();

  const filtered =
    filter === "toutes"
      ? OFFERS
      : OFFERS.filter((o) => o.status === filter);

  function resetForm() {
    setFormClient("");
    setFormTitle("");
    setFormDescription("");
    setFormAmount("");
    setFormDeadline("");
    setFormValidity("");
  }

  function submitCreate() {
    if (!formClient.trim()) {
      addToast("error", "Veuillez s\u00e9lectionner un client.");
      return;
    }
    if (!formTitle.trim()) {
      addToast("error", "Veuillez saisir un titre.");
      return;
    }
    if (!formAmount.trim()) {
      addToast("error", "Veuillez saisir un montant.");
      return;
    }
    if (!formDeadline.trim()) {
      addToast("error", "Veuillez indiquer un d\u00e9lai.");
      return;
    }
    if (!formValidity.trim()) {
      addToast("error", "Veuillez indiquer une dur\u00e9e de validit\u00e9.");
      return;
    }
    addToast("success", `Offre "${formTitle}" envoy\u00e9e \u00e0 ${formClient} !`);
    resetForm();
    setShowCreate(false);
  }

  function openEdit(offer: CustomOffer) {
    setEditOffer(offer);
    setEditTitle(offer.projectTitle);
    setEditDescription(offer.description);
    setEditAmount(offer.amount.toString());
    setEditDeadline(offer.deadline);
    setShowEdit(true);
  }

  function submitEdit() {
    if (!editTitle.trim() || !editAmount.trim() || !editDeadline.trim()) {
      addToast("error", "Veuillez remplir tous les champs obligatoires.");
      return;
    }
    addToast("success", `Offre "${editTitle}" modifi\u00e9e !`);
    setShowEdit(false);
  }

  function openDetail(offer: CustomOffer) {
    setDetailOffer(offer);
    setShowDetail(true);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Offres personnalis&eacute;es</h1>
          <p className="text-slate-400 text-sm mt-1">
            Envoyez des devis sur mesure &agrave; vos clients.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreate(true);
          }}
          className="px-4 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nouvelle offre
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="bg-neutral-dark rounded-xl border border-border-dark p-4 flex items-center gap-3"
          >
            <span className={cn("material-symbols-outlined text-xl", s.color)}>
              {s.icon}
            </span>
            <div>
              <p className="text-xl font-black text-white">{s.value}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_TABS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
              filter === f.key
                ? "bg-primary text-background-dark"
                : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Offer cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-neutral-dark rounded-xl border border-border-dark p-10 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-600 mb-3">
              local_offer
            </span>
            <p className="text-slate-500 font-semibold">
              Aucune offre dans cette cat&eacute;gorie
            </p>
          </div>
        ) : (
          filtered.map((o) => (
            <div
              key={o.id}
              className="bg-neutral-dark rounded-xl border border-border-dark p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                    {o.clientInitials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p className="font-bold text-white truncate">
                        {o.projectTitle}
                      </p>
                      <span
                        className={cn(
                          "text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0",
                          STATUS_MAP[o.status]?.cls
                        )}
                      >
                        {STATUS_MAP[o.status]?.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {o.client} &middot; {o.id}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-black text-white">
                    &euro;{o.amount.toLocaleString("fr-FR")}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">
                    Montant
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                {o.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      calendar_today
                    </span>
                    Deadline : {new Date(o.deadline).toLocaleDateString("fr-FR")}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      schedule
                    </span>
                    Cr&eacute;&eacute;e le{" "}
                    {new Date(o.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => openDetail(o)}
                    className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Voir"
                  >
                    <span className="material-symbols-outlined text-lg">
                      visibility
                    </span>
                  </button>
                  {o.status === "en_attente" && (
                    <>
                      <button
                        onClick={() => openEdit(o)}
                        className="p-2 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                        title="Modifier"
                      >
                        <span className="material-symbols-outlined text-lg">
                          edit
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          addToast("info", `Relance envoy\u00e9e \u00e0 ${o.client}`)
                        }
                        className="p-2 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                        title="Relancer"
                      >
                        <span className="material-symbols-outlined text-lg">
                          notifications_active
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          addToast("warning", `Offre ${o.id} annul\u00e9e`)
                        }
                        className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Annuler"
                      >
                        <span className="material-symbols-outlined text-lg">
                          cancel
                        </span>
                      </button>
                    </>
                  )}
                  {o.status === "expiree" && (
                    <button
                      onClick={() =>
                        addToast("info", `Offre ${o.id} renvoy\u00e9e \u00e0 ${o.client}`)
                      }
                      className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors"
                      title="Renvoyer"
                    >
                      <span className="material-symbols-outlined text-lg">
                        refresh
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL: Voir d\u00e9tails                                       */}
      {/* ============================================================ */}
      {showDetail && detailOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDetail(false)}
          />
          <div className="relative bg-neutral-dark rounded-2xl border border-border-dark p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-white pr-4">
                {detailOffer.projectTitle}
              </h3>
              <button
                onClick={() => setShowDetail(false)}
                className="text-slate-400 hover:text-white transition-colors flex-shrink-0"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                  {detailOffer.clientInitials}
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {detailOffer.client}
                  </p>
                  <p className="text-xs text-slate-500">{detailOffer.id}</p>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full ml-auto",
                    STATUS_MAP[detailOffer.status]?.cls
                  )}
                >
                  {STATUS_MAP[detailOffer.status]?.label}
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {detailOffer.description}
              </p>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-background-dark rounded-lg p-3 border border-border-dark">
                  <p className="text-lg font-black text-white">
                    &euro;{detailOffer.amount.toLocaleString("fr-FR")}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">
                    Montant
                  </p>
                </div>
                <div className="bg-background-dark rounded-lg p-3 border border-border-dark">
                  <p className="text-sm font-black text-white">
                    {new Date(detailOffer.deadline).toLocaleDateString("fr-FR")}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">
                    Deadline
                  </p>
                </div>
                <div className="bg-background-dark rounded-lg p-3 border border-border-dark">
                  <p className="text-sm font-black text-white">
                    {new Date(detailOffer.validity).toLocaleDateString("fr-FR")}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">
                    Validit&eacute;
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowDetail(false)}
                  className="flex-1 py-2.5 text-slate-400 text-sm font-semibold hover:text-white transition-colors"
                >
                  Fermer
                </button>
                {detailOffer.status === "en_attente" && (
                  <button
                    onClick={() => {
                      setShowDetail(false);
                      openEdit(detailOffer);
                    }}
                    className="flex-1 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all"
                  >
                    Modifier
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: Cr\u00e9er une offre                                    */}
      {/* ============================================================ */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreate(false)}
          />
          <div className="relative bg-neutral-dark rounded-2xl border border-border-dark p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                Nouvelle offre personnalis&eacute;e
              </h3>
              <button
                onClick={() => setShowCreate(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1.5 block">
                  Client
                </label>
                <select
                  value={formClient}
                  onChange={(e) => setFormClient(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50"
                >
                  <option value="">S&eacute;lectionner un client...</option>
                  {CLIENT_LIST.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1.5 block">
                  Titre du projet
                </label>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ex : Refonte site e-commerce"
                  className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1.5 block">
                  Description
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="D&eacute;crivez la prestation propos&eacute;e..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1.5 block">
                    Montant (&euro;)
                  </label>
                  <input
                    type="number"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="5000"
                    className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1.5 block">
                    D&eacute;lai de livraison
                  </label>
                  <input
                    type="date"
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1.5 block">
                  Validit&eacute; de l&apos;offre
                </label>
                <input
                  type="date"
                  value={formValidity}
                  onChange={(e) => setFormValidity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 text-slate-400 text-sm font-semibold hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={submitCreate}
                  className="flex-1 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all"
                >
                  Envoyer l&apos;offre
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: Modifier une offre                                     */}
      {/* ============================================================ */}
      {showEdit && editOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowEdit(false)}
          />
          <div className="relative bg-neutral-dark rounded-2xl border border-border-dark p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Modifier l&apos;offre
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editOffer.id} &middot; {editOffer.client}
                </p>
              </div>
              <button
                onClick={() => setShowEdit(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1.5 block">
                  Titre du projet
                </label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1.5 block">
                  Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1.5 block">
                    Montant (&euro;)
                  </label>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1.5 block">
                    D&eacute;lai de livraison
                  </label>
                  <input
                    type="date"
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowEdit(false)}
                  className="flex-1 py-2.5 text-slate-400 text-sm font-semibold hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={submitEdit}
                  className="flex-1 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
