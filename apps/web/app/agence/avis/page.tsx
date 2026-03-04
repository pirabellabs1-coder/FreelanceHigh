"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Demo data                                                          */
/* ------------------------------------------------------------------ */

const STATS = [
  { label: "Note moyenne", value: "4.8/5", icon: "star", color: "text-yellow-400" },
  { label: "Total avis", value: "89", icon: "reviews", color: "text-primary" },
  { label: "Satisfaction", value: "96%", icon: "sentiment_satisfied", color: "text-emerald-400" },
  { label: "Reponses", value: "85%", icon: "reply", color: "text-blue-400" },
];

const DISTRIBUTION = [
  { stars: 5, label: "5", pct: 72, count: 64 },
  { stars: 4, label: "4", pct: 18, count: 16 },
  { stars: 3, label: "3", pct: 6, count: 5 },
  { stars: 2, label: "2", pct: 3, count: 3 },
  { stars: 1, label: "1", pct: 1, count: 1 },
];

interface ReviewCriteria {
  qualite: number;
  communication: number;
  delai: number;
}

interface Review {
  id: string;
  clientName: string;
  clientInitials: string;
  date: string;
  rating: number;
  comment: string;
  criteria: ReviewCriteria;
  agencyResponse: string | null;
  projectTitle: string;
}

const REVIEWS: Review[] = [
  {
    id: "R-001",
    clientName: "Marc Dupont",
    clientInitials: "MD",
    date: "2026-03-01",
    rating: 5,
    comment: "Travail exceptionnel sur la refonte de notre site e-commerce. L'\u00e9quipe a \u00e9t\u00e9 r\u00e9active, professionnelle et a livr\u00e9 un r\u00e9sultat qui d\u00e9passe nos attentes. Le design est moderne et l'exp\u00e9rience utilisateur est fluide. Je recommande vivement TechCorp Agency.",
    criteria: { qualite: 5, communication: 5, delai: 5 },
    agencyResponse: "Merci Marc ! C'est un plaisir de travailler avec Dakar Shop. Nous restons disponibles pour vos futurs projets.",
    projectTitle: "Refonte e-commerce Dakar Shop",
  },
  {
    id: "R-002",
    clientName: "Aminata Tour\u00e9",
    clientInitials: "AT",
    date: "2026-02-25",
    rating: 5,
    comment: "Excellente strat\u00e9gie SEO mise en place par l'\u00e9quipe. En 3 mois, notre trafic organique a augment\u00e9 de 180%. Les rapports mensuels sont clairs et d\u00e9taill\u00e9s. Tr\u00e8s satisfaite de la collaboration.",
    criteria: { qualite: 5, communication: 5, delai: 4 },
    agencyResponse: null,
    projectTitle: "Strat\u00e9gie SEO FashionAfrik",
  },
  {
    id: "R-003",
    clientName: "Pierre Legrand",
    clientInitials: "PL",
    date: "2026-02-18",
    rating: 4,
    comment: "Bonne r\u00e9alisation technique pour la plateforme. Quelques retards sur le calendrier initial mais la qualit\u00e9 du code est au rendez-vous. La documentation fournie est compl\u00e8te. Je travaillerai de nouveau avec eux.",
    criteria: { qualite: 5, communication: 4, delai: 3 },
    agencyResponse: "Merci Pierre pour ce retour honn\u00eate. Nous avons pris note des retards et am\u00e9lior\u00e9 nos processus de planification.",
    projectTitle: "Plateforme FinTech CI",
  },
  {
    id: "R-004",
    clientName: "Jean Kouam\u00e9",
    clientInitials: "JK",
    date: "2026-02-10",
    rating: 5,
    comment: "L'application mobile livr\u00e9e est impeccable. L'int\u00e9gration des paiements Mobile Money fonctionne parfaitement. L'\u00e9quipe a m\u00eame ajout\u00e9 des fonctionnalit\u00e9s bonus. Un vrai partenaire technologique de confiance.",
    criteria: { qualite: 5, communication: 5, delai: 5 },
    agencyResponse: null,
    projectTitle: "App mobile QuickDeliver",
  },
  {
    id: "R-005",
    clientName: "Sophie Diallo",
    clientInitials: "SD",
    date: "2026-01-28",
    rating: 3,
    comment: "Le r\u00e9sultat final est correct mais la communication pendant le projet aurait pu \u00eatre meilleure. Plusieurs relances n\u00e9cessaires pour obtenir des mises \u00e0 jour. Le livrable est fonctionnel mais manque de finitions sur certains d\u00e9tails.",
    criteria: { qualite: 3, communication: 2, delai: 3 },
    agencyResponse: "Sophie, nous vous remercions pour ce retour. Nous avons depuis renforc\u00e9 notre communication projet avec des points hebdomadaires syst\u00e9matiques.",
    projectTitle: "Site vitrine EduTech SN",
  },
  {
    id: "R-006",
    clientName: "Fatima Benali",
    clientInitials: "FB",
    date: "2026-01-15",
    rating: 4,
    comment: "Bon travail sur l'application de sant\u00e9. L'interface est intuitive et bien pens\u00e9e pour nos utilisateurs. Le respect du cahier des charges est quasi parfait. Seul b\u00e9mol : quelques bugs mineurs d\u00e9couverts apr\u00e8s la mise en production, rapidement corrig\u00e9s.",
    criteria: { qualite: 4, communication: 4, delai: 4 },
    agencyResponse: null,
    projectTitle: "App sant\u00e9 HealthApp",
  },
];

const FILTER_TABS = [
  { key: "tous", label: "Tous" },
  { key: "5", label: "5 \u00e9toiles" },
  { key: "4", label: "4 \u00e9toiles" },
  { key: "3-", label: "3 et moins" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function StarDisplay({ rating, size = "text-sm" }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={cn(
            "material-symbols-outlined",
            size,
            star <= rating ? "text-yellow-400" : "text-slate-600"
          )}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
      ))}
    </div>
  );
}

function CriteriaBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 5) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 w-28 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-border-dark rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full",
            value >= 4
              ? "bg-primary"
              : value >= 3
              ? "bg-amber-400"
              : "bg-red-400"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-white w-6 text-right">
        {value}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AgenceAvis() {
  const [filter, setFilter] = useState("tous");
  const [responseTexts, setResponseTexts] = useState<Record<string, string>>({});
  const [expandedResponse, setExpandedResponse] = useState<string | null>(null);

  const { addToast } = useToastStore();

  const filtered =
    filter === "tous"
      ? REVIEWS
      : filter === "5"
      ? REVIEWS.filter((r) => r.rating === 5)
      : filter === "4"
      ? REVIEWS.filter((r) => r.rating === 4)
      : REVIEWS.filter((r) => r.rating <= 3);

  function submitResponse(reviewId: string) {
    const text = responseTexts[reviewId]?.trim();
    if (!text) {
      addToast("error", "Veuillez r\u00e9diger une r\u00e9ponse.");
      return;
    }
    addToast("success", "R\u00e9ponse publi\u00e9e avec succ\u00e8s !");
    setResponseTexts((prev) => ({ ...prev, [reviewId]: "" }));
    setExpandedResponse(null);
  }

  function reportReview(reviewId: string) {
    addToast("warning", `Avis ${reviewId} signal\u00e9 pour examen par la mod\u00e9ration.`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">Avis clients</h1>
        <p className="text-slate-400 text-sm mt-1">
          Consultez et r&eacute;pondez aux avis re&ccedil;us par l&apos;agence.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="bg-neutral-dark rounded-xl border border-border-dark p-4 flex items-center gap-3"
          >
            <span
              className={cn("material-symbols-outlined text-xl", s.color)}
              style={
                s.icon === "star"
                  ? { fontVariationSettings: "'FILL' 1" }
                  : undefined
              }
            >
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

      {/* Rating distribution */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
        <h2 className="font-bold text-white mb-4">
          R&eacute;partition des notes
        </h2>
        <div className="space-y-2.5">
          {DISTRIBUTION.map((d) => (
            <div key={d.stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12 flex-shrink-0">
                <span className="text-sm font-semibold text-white">
                  {d.label}
                </span>
                <span
                  className="material-symbols-outlined text-yellow-400 text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              </div>
              <div className="flex-1 h-3 bg-border-dark rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    d.stars >= 4
                      ? "bg-primary"
                      : d.stars === 3
                      ? "bg-amber-400"
                      : "bg-red-400"
                  )}
                  style={{ width: `${d.pct}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 w-16 text-right">
                {d.pct}% ({d.count})
              </span>
            </div>
          ))}
        </div>
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

      {/* Reviews */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-neutral-dark rounded-xl border border-border-dark p-10 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-600 mb-3">
              reviews
            </span>
            <p className="text-slate-500 font-semibold">
              Aucun avis dans cette cat&eacute;gorie
            </p>
          </div>
        ) : (
          filtered.map((r) => (
            <div
              key={r.id}
              className="bg-neutral-dark rounded-xl border border-border-dark p-5"
            >
              {/* Review header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                    {r.clientInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-white text-sm">
                        {r.clientName}
                      </p>
                      <StarDisplay rating={r.rating} />
                    </div>
                    <p className="text-xs text-slate-500">
                      {r.projectTitle} &middot;{" "}
                      {new Date(r.date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => reportReview(r.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
                  title="Signaler cet avis"
                >
                  <span className="material-symbols-outlined text-lg">flag</span>
                </button>
              </div>

              {/* Comment */}
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {r.comment}
              </p>

              {/* Criteria breakdown */}
              <div className="bg-background-dark rounded-lg p-4 border border-border-dark mb-4 space-y-2">
                <CriteriaBar label="Qualit\u00e9" value={r.criteria.qualite} />
                <CriteriaBar
                  label="Communication"
                  value={r.criteria.communication}
                />
                <CriteriaBar label="D\u00e9lai" value={r.criteria.delai} />
              </div>

              {/* Existing agency response */}
              {r.agencyResponse && (
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary text-sm">
                      reply
                    </span>
                    <p className="text-xs font-semibold text-primary">
                      R&eacute;ponse de TechCorp Agency
                    </p>
                  </div>
                  <p className="text-sm text-slate-300">{r.agencyResponse}</p>
                </div>
              )}

              {/* Response form (only if no existing response) */}
              {!r.agencyResponse && (
                <div>
                  {expandedResponse === r.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={responseTexts[r.id] || ""}
                        onChange={(e) =>
                          setResponseTexts((prev) => ({
                            ...prev,
                            [r.id]: e.target.value,
                          }))
                        }
                        placeholder="R&eacute;digez votre r&eacute;ponse publique..."
                        rows={3}
                        className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 resize-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setExpandedResponse(null)}
                          className="px-3 py-1.5 text-slate-400 text-xs font-semibold hover:text-white transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => submitResponse(r.id)}
                          className="px-4 py-1.5 bg-primary text-background-dark text-xs font-bold rounded-lg hover:brightness-110 transition-all"
                        >
                          Publier la r&eacute;ponse
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setExpandedResponse(r.id)}
                      className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
                    >
                      <span className="material-symbols-outlined text-sm">
                        reply
                      </span>
                      R&eacute;pondre &agrave; cet avis
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
