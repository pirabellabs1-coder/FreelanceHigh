"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Demo data                                                          */
/* ------------------------------------------------------------------ */

const STATS = [
  { label: "Candidatures envoyees", value: "15", icon: "send", color: "text-primary" },
  { label: "En attente", value: "6", icon: "hourglass_top", color: "text-amber-400" },
  { label: "Acceptees", value: "7", icon: "check_circle", color: "text-emerald-400" },
  { label: "Taux acceptation", value: "47%", icon: "trending_up", color: "text-blue-400" },
];

interface Offer {
  id: string;
  title: string;
  client: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  skills: string[];
  proposals: number;
  urgency: string;
  description: string;
  type: string;
}

const OFFERS: Offer[] = [
  { id: "O-001", title: "Refonte application mobile e-commerce", client: "Dakar Shop SARL", budgetMin: 5000, budgetMax: 8000, deadline: "2026-04-15", skills: ["React Native", "TypeScript", "Figma"], proposals: 7, urgency: "Normale", description: "Refonte compl\u00e8te de l'app mobile existante avec nouveau design et nouvelles fonctionnalit\u00e9s de paiement Mobile Money.", type: "Ponctuel" },
  { id: "O-002", title: "Plateforme SaaS de gestion RH", client: "FinTech CI", budgetMin: 15000, budgetMax: 25000, deadline: "2026-06-30", skills: ["Next.js", "PostgreSQL", "Prisma", "Stripe"], proposals: 3, urgency: "Normale", description: "Cr\u00e9ation d'une plateforme SaaS compl\u00e8te pour la gestion des ressources humaines avec paie automatis\u00e9e.", type: "Long terme" },
  { id: "O-003", title: "Campagne marketing digital multi-canaux", client: "FashionAfrik", budgetMin: 2000, budgetMax: 4000, deadline: "2026-03-25", skills: ["Google Ads", "Meta Ads", "SEO", "Analytics"], proposals: 12, urgency: "Urgente", description: "Campagne de lancement pour la nouvelle collection printemps 2026 sur tous les canaux digitaux.", type: "Ponctuel" },
  { id: "O-004", title: "API de paiement Mobile Money", client: "QuickDeliver", budgetMin: 8000, budgetMax: 12000, deadline: "2026-05-01", skills: ["Node.js", "CinetPay", "PostgreSQL", "Docker"], proposals: 5, urgency: "Normale", description: "Int\u00e9gration d'une API de paiement multi-op\u00e9rateurs (Orange Money, Wave, MTN) pour une app de livraison.", type: "Ponctuel" },
  { id: "O-005", title: "Branding complet et charte graphique", client: "EduTech SN", budgetMin: 3000, budgetMax: 5000, deadline: "2026-04-10", skills: ["Illustrator", "Figma", "Branding"], proposals: 9, urgency: "Normale", description: "Cr\u00e9ation de l'identit\u00e9 visuelle compl\u00e8te : logo, charte graphique, templates r\u00e9seaux sociaux et papeterie.", type: "Ponctuel" },
  { id: "O-006", title: "D\u00e9veloppement site vitrine multilingue", client: "TourAfrique", budgetMin: 1500, budgetMax: 3000, deadline: "2026-03-20", skills: ["WordPress", "PHP", "SEO"], proposals: 15, urgency: "Tr\u00e8s urgente", description: "Site vitrine en fran\u00e7ais, anglais et espagnol pour une agence de tourisme panafricaine.", type: "Ponctuel" },
  { id: "O-007", title: "Maintenance applicative mensuelle", client: "HealthApp", budgetMin: 1200, budgetMax: 2000, deadline: "2026-12-31", skills: ["React", "Node.js", "DevOps"], proposals: 4, urgency: "Normale", description: "Contrat de maintenance mensuelle incluant corrections de bugs, mises \u00e0 jour de s\u00e9curit\u00e9 et petites \u00e9volutions.", type: "R\u00e9current" },
  { id: "O-008", title: "Audit s\u00e9curit\u00e9 et RGPD", client: "MediaGroup CI", budgetMin: 4000, budgetMax: 6000, deadline: "2026-04-30", skills: ["Cybersecurity", "RGPD", "Pentest"], proposals: 2, urgency: "Normale", description: "Audit complet de s\u00e9curit\u00e9 avec tests d'intrusion et mise en conformit\u00e9 RGPD.", type: "Ponctuel" },
];

interface Application {
  id: string;
  offerTitle: string;
  client: string;
  proposedPrice: number;
  proposedDeadline: string;
  status: "en_attente" | "vue" | "acceptee" | "refusee";
  submittedAt: string;
  coverLetter: string;
}

const APPLICATIONS: Application[] = [
  { id: "C-001", offerTitle: "Refonte application mobile e-commerce", client: "Dakar Shop SARL", proposedPrice: 7200, proposedDeadline: "2026-04-10", status: "acceptee", submittedAt: "2026-02-20", coverLetter: "Notre agence poss\u00e8de une expertise reconnue en d\u00e9veloppement mobile..." },
  { id: "C-002", offerTitle: "Plateforme SaaS de gestion RH", client: "FinTech CI", proposedPrice: 22000, proposedDeadline: "2026-06-15", status: "en_attente", submittedAt: "2026-03-01", coverLetter: "Nous avons r\u00e9alis\u00e9 plus de 15 projets SaaS similaires..." },
  { id: "C-003", offerTitle: "Campagne marketing digital multi-canaux", client: "FashionAfrik", proposedPrice: 3500, proposedDeadline: "2026-03-22", status: "vue", submittedAt: "2026-03-02", coverLetter: "Notre \u00e9quipe marketing cumule 30 ans d'exp\u00e9rience en digital..." },
  { id: "C-004", offerTitle: "API de paiement Mobile Money", client: "QuickDeliver", proposedPrice: 10500, proposedDeadline: "2026-04-25", status: "acceptee", submittedAt: "2026-02-15", coverLetter: "Sp\u00e9cialistes CinetPay et int\u00e9grations paiement africain..." },
  { id: "C-005", offerTitle: "Branding complet et charte graphique", client: "EduTech SN", proposedPrice: 4200, proposedDeadline: "2026-04-05", status: "refusee", submittedAt: "2026-02-25", coverLetter: "Notre directeur artistique a travaill\u00e9 pour de grandes marques..." },
  { id: "C-006", offerTitle: "D\u00e9veloppement site vitrine multilingue", client: "TourAfrique", proposedPrice: 2800, proposedDeadline: "2026-03-18", status: "en_attente", submittedAt: "2026-03-03", coverLetter: "Nous avons r\u00e9alis\u00e9 plusieurs sites multilingues pour le secteur touristique..." },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  en_attente: { label: "En attente", cls: "bg-amber-500/20 text-amber-400" },
  vue: { label: "Vue", cls: "bg-blue-500/20 text-blue-400" },
  acceptee: { label: "Accept\u00e9e", cls: "bg-emerald-500/20 text-emerald-400" },
  refusee: { label: "Refus\u00e9e", cls: "bg-red-500/20 text-red-400" },
};

const URGENCY_MAP: Record<string, { cls: string }> = {
  Normale: { cls: "bg-slate-500/20 text-slate-400" },
  Urgente: { cls: "bg-amber-500/20 text-amber-400" },
  "Tr\u00e8s urgente": { cls: "bg-red-500/20 text-red-400" },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AgenceCandidatures() {
  const [tab, setTab] = useState<"offres" | "candidatures">("offres");
  const [showApply, setShowApply] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailOffer, setDetailOffer] = useState<Offer | null>(null);

  // Apply form state
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");
  const [proposedDeadline, setProposedDeadline] = useState("");

  const { addToast } = useToastStore();

  function openApply(offer: Offer) {
    setSelectedOffer(offer);
    setCoverLetter("");
    setProposedPrice("");
    setProposedDeadline("");
    setShowApply(true);
  }

  function submitApplication() {
    if (!coverLetter.trim()) {
      addToast("error", "Veuillez r\u00e9diger une lettre de motivation.");
      return;
    }
    if (!proposedPrice.trim()) {
      addToast("error", "Veuillez indiquer un prix propos\u00e9.");
      return;
    }
    if (!proposedDeadline.trim()) {
      addToast("error", "Veuillez indiquer un d\u00e9lai propos\u00e9.");
      return;
    }
    addToast("success", `Candidature envoy\u00e9e pour "${selectedOffer?.title}" !`);
    setShowApply(false);
  }

  function openDetail(offer: Offer) {
    setDetailOffer(offer);
    setShowDetail(true);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Candidatures</h1>
          <p className="text-slate-400 text-sm mt-1">
            Postulez aux offres de projets clients et suivez vos candidatures.
          </p>
        </div>
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

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("offres")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
            tab === "offres"
              ? "bg-primary text-background-dark"
              : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white"
          )}
        >
          Offres disponibles
        </button>
        <button
          onClick={() => setTab("candidatures")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
            tab === "candidatures"
              ? "bg-primary text-background-dark"
              : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white"
          )}
        >
          Nos candidatures ({APPLICATIONS.length})
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB: Offres disponibles                                       */}
      {/* ============================================================ */}
      {tab === "offres" && (
        <div className="space-y-3">
          {OFFERS.map((o) => (
            <div
              key={o.id}
              className="bg-neutral-dark rounded-xl border border-border-dark p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-bold text-white">{o.title}</p>
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                        URGENCY_MAP[o.urgency]?.cls
                      )}
                    >
                      {o.urgency}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {o.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {o.client} &middot; {o.id}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-black text-white">
                    &euro;{o.budgetMin.toLocaleString("fr-FR")} &ndash; &euro;
                    {o.budgetMax.toLocaleString("fr-FR")}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">
                    Budget
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {o.skills.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Meta & actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      calendar_today
                    </span>
                    {new Date(o.deadline).toLocaleDateString("fr-FR")}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      group
                    </span>
                    {o.proposals} candidature{o.proposals > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openDetail(o)}
                    className="px-3 py-1.5 bg-neutral-dark border border-border-dark text-slate-400 text-xs font-semibold rounded-lg hover:text-white hover:border-primary/30 transition-colors"
                  >
                    Voir d&eacute;tails
                  </button>
                  <button
                    onClick={() => openApply(o)}
                    className="px-3 py-1.5 bg-primary text-background-dark text-xs font-bold rounded-lg hover:brightness-110 transition-all"
                  >
                    Postuler
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB: Nos candidatures                                         */}
      {/* ============================================================ */}
      {tab === "candidatures" && (
        <div className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-border-dark">
                <th className="px-5 py-3 text-left font-semibold">Offre</th>
                <th className="px-5 py-3 text-left font-semibold">Client</th>
                <th className="px-5 py-3 text-left font-semibold">
                  Prix propos&eacute;
                </th>
                <th className="px-5 py-3 text-left font-semibold">
                  D&eacute;lai
                </th>
                <th className="px-5 py-3 text-left font-semibold">Statut</th>
                <th className="px-5 py-3 text-left font-semibold">
                  Soumise le
                </th>
                <th className="px-5 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {APPLICATIONS.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-border-dark/50 hover:bg-background-dark/30 transition-colors"
                >
                  <td className="px-5 py-3">
                    <p className="text-sm font-semibold text-white truncate max-w-[220px]">
                      {a.offerTitle}
                    </p>
                    <p className="text-xs text-slate-500">{a.id}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-300">
                    {a.client}
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-white">
                    &euro;{a.proposedPrice.toLocaleString("fr-FR")}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-400">
                    {new Date(a.proposedDeadline).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "text-xs font-semibold px-2.5 py-1 rounded-full",
                        STATUS_MAP[a.status]?.cls
                      )}
                    >
                      {STATUS_MAP[a.status]?.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-500">
                    {new Date(a.submittedAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          addToast("info", `D\u00e9tails de la candidature ${a.id}`)
                        }
                        className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Voir"
                      >
                        <span className="material-symbols-outlined text-lg">
                          visibility
                        </span>
                      </button>
                      {a.status === "en_attente" && (
                        <button
                          onClick={() =>
                            addToast(
                              "warning",
                              `Candidature ${a.id} retir\u00e9e`
                            )
                          }
                          className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Retirer"
                        >
                          <span className="material-symbols-outlined text-lg">
                            close
                          </span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
                {detailOffer.title}
              </h3>
              <button
                onClick={() => setShowDetail(false)}
                className="text-slate-400 hover:text-white transition-colors flex-shrink-0"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="material-symbols-outlined text-sm">
                  business
                </span>
                {detailOffer.client}
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {detailOffer.description}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background-dark rounded-lg p-3 border border-border-dark">
                  <p className="text-lg font-black text-white">
                    &euro;{detailOffer.budgetMin.toLocaleString("fr-FR")} &ndash; &euro;
                    {detailOffer.budgetMax.toLocaleString("fr-FR")}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">
                    Budget
                  </p>
                </div>
                <div className="bg-background-dark rounded-lg p-3 border border-border-dark">
                  <p className="text-lg font-black text-white">
                    {new Date(detailOffer.deadline).toLocaleDateString("fr-FR")}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">
                    Deadline
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {detailOffer.skills.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">group</span>
                  {detailOffer.proposals} candidature{detailOffer.proposals > 1 ? "s" : ""}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                    URGENCY_MAP[detailOffer.urgency]?.cls
                  )}
                >
                  {detailOffer.urgency}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {detailOffer.type}
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowDetail(false)}
                  className="flex-1 py-2.5 text-slate-400 text-sm font-semibold hover:text-white transition-colors"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    setShowDetail(false);
                    openApply(detailOffer);
                  }}
                  className="flex-1 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all"
                >
                  Postuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: Postuler                                               */}
      {/* ============================================================ */}
      {showApply && selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowApply(false)}
          />
          <div className="relative bg-neutral-dark rounded-2xl border border-border-dark p-6 w-full max-w-md">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Postuler</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedOffer.title}
                </p>
              </div>
              <button
                onClick={() => setShowApply(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1.5 block">
                  Lettre de motivation
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Pr&eacute;sentez votre agence et pourquoi vous &ecirc;tes le bon choix pour ce projet..."
                  rows={5}
                  className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1.5 block">
                    Prix propos&eacute; (&euro;)
                  </label>
                  <input
                    type="number"
                    value={proposedPrice}
                    onChange={(e) => setProposedPrice(e.target.value)}
                    placeholder={`${selectedOffer.budgetMin} - ${selectedOffer.budgetMax}`}
                    className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1.5 block">
                    D&eacute;lai propos&eacute;
                  </label>
                  <input
                    type="date"
                    value={proposedDeadline}
                    onChange={(e) => setProposedDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="bg-background-dark rounded-lg p-3 border border-border-dark">
                <p className="text-xs text-slate-400">
                  <span className="material-symbols-outlined text-sm align-middle mr-1 text-amber-400">
                    info
                  </span>
                  Budget client : &euro;
                  {selectedOffer.budgetMin.toLocaleString("fr-FR")} &ndash; &euro;
                  {selectedOffer.budgetMax.toLocaleString("fr-FR")} &middot;
                  Deadline :{" "}
                  {new Date(selectedOffer.deadline).toLocaleDateString("fr-FR")}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowApply(false)}
                  className="flex-1 py-2.5 text-slate-400 text-sm font-semibold hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={submitApplication}
                  className="flex-1 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all"
                >
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
