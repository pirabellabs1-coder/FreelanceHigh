"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const REVIEWS = [
  {
    id: "r1",
    orderId: "ORD-1012",
    service: "Optimisation SEO Technique & Audit",
    client: "Agence Média Paris",
    clientCountry: "FR",
    avatar: "AM",
    date: "12 Fév 2026",
    rating: 5,
    communication: 5,
    delai: 5,
    qualite: 5,
    comment: "Travail exceptionnel ! Lissanon a réalisé un audit SEO complet et très détaillé de notre site. Les recommandations étaient claires, priorisées et accompagnées d'un plan d'action concret. En seulement 3 semaines après implémentation, notre trafic organique a augmenté de 28%. Je recommande vivement.",
    myReply: "Merci beaucoup pour votre retour ! Ce fut un plaisir de travailler sur ce projet. N'hésitez pas à me contacter pour la suite des optimisations.",
    helpful: 8,
  },
  {
    id: "r2",
    orderId: "ORD-1009",
    service: "Design UI/UX Application Mobile",
    client: "StartupTech Dakar",
    clientCountry: "SN",
    avatar: "SD",
    date: "5 Fév 2026",
    rating: 4.9,
    communication: 5,
    delai: 5,
    qualite: 4.9,
    comment: "Excellent travail sur la conception UX/UI de notre app mobile. Lissanon a parfaitement compris nos besoins et livré des maquettes Figma impeccables. La communication était fluide tout au long du projet. Très professionnel et réactif.",
    myReply: null,
    helpful: 5,
  },
  {
    id: "r3",
    orderId: "ORD-0998",
    service: "API Backend Node.js + Prisma",
    client: "TechVision Mali",
    clientCountry: "ML",
    avatar: "TV",
    date: "15 Jan 2026",
    rating: 4.8,
    communication: 4.8,
    delai: 4.7,
    qualite: 5,
    comment: "Développeur très compétent. L'API livrée est bien structurée, documentée et performante. Quelques allers-retours sur les spécifications mais rien de bloquant. Je referai appel à ses services pour la v2 de notre produit.",
    myReply: "Merci pour votre confiance ! Avec plaisir pour la v2, ce sera encore mieux maintenant que nous nous connaissons mieux.",
    helpful: 3,
  },
  {
    id: "r4",
    orderId: "ORD-0985",
    service: "Développement Application React/Next.js",
    client: "E-Commerce Côte d'Ivoire",
    clientCountry: "CI",
    avatar: "EC",
    date: "2 Jan 2026",
    rating: 5,
    communication: 5,
    delai: 5,
    qualite: 5,
    comment: "Projet livré en avance, qualité irréprochable. Le code est propre, bien documenté et testé. L'application est exactement ce que nous espérions. Collaboration parfaite du début à la fin.",
    myReply: null,
    helpful: 12,
  },
];

const FLAG: Record<string, string> = { CI: "🇨🇮", SN: "🇸🇳", FR: "🇫🇷", ML: "🇲🇱", BJ: "🇧🇯" };

const avgRating = REVIEWS.reduce((a, b) => a + b.rating, 0) / REVIEWS.length;

export default function AvisPage() {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const dist = [5, 4, 3, 2, 1].map((n) => ({
    star: n,
    count: REVIEWS.filter((r) => Math.round(r.rating) === n).length,
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-100">Avis reçus</h2>
        <p className="text-sm text-slate-400 mt-0.5">{REVIEWS.length} avis vérifiés</p>
      </div>

      {/* Summary */}
      <div className="bg-background-dark/50 rounded-2xl border border-border-dark p-6 flex flex-col sm:flex-row items-center gap-8">
        {/* Global score */}
        <div className="text-center flex-shrink-0">
          <p className="text-6xl font-black text-slate-100 mb-1">{avgRating.toFixed(1)}</p>
          <div className="flex items-center justify-center gap-0.5 mb-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={cn("material-symbols-outlined text-xl leading-none", i < Math.floor(avgRating) ? "text-amber-400" : "text-slate-600")}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 font-semibold">Note globale</p>
        </div>

        {/* Distribution */}
        <div className="flex-1 space-y-2 w-full sm:w-auto">
          {dist.map(({ star, count }) => (
            <div key={star} className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <span className="text-xs font-bold text-slate-400">{star}</span>
                <span className="material-symbols-outlined text-xs leading-none text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <div className="flex-1 h-2 bg-border-dark rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: REVIEWS.length > 0 ? `${(count / REVIEWS.length) * 100}%` : "0%" }}
                />
              </div>
              <span className="text-xs text-slate-500 w-4 text-right flex-shrink-0">{count}</span>
            </div>
          ))}
        </div>

        {/* Sub-scores */}
        <div className="space-y-2 flex-shrink-0">
          {[
            { label: "Qualité", score: (REVIEWS.reduce((a, b) => a + b.qualite, 0) / REVIEWS.length).toFixed(1) },
            { label: "Communication", score: (REVIEWS.reduce((a, b) => a + b.communication, 0) / REVIEWS.length).toFixed(1) },
            { label: "Délai", score: (REVIEWS.reduce((a, b) => a + b.delai, 0) / REVIEWS.length).toFixed(1) },
          ].map(({ label, score }) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500 font-semibold">{label}</span>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs leading-none text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-xs font-black text-slate-100">{score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {REVIEWS.map((r) => {
          const isExpanded = expandedId === r.id;
          const isReplying = replyingTo === r.id;

          return (
            <div key={r.id} className="bg-background-dark/50 rounded-2xl border border-border-dark p-5">
              {/* Review header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-black text-primary">{r.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-100">{r.client}</p>
                    <span className="text-xs text-slate-400">{FLAG[r.clientCountry] ?? ""}</span>
                    <span className="text-xs text-slate-600">·</span>
                    <span className="text-xs text-slate-500">{r.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={cn("material-symbols-outlined text-xs leading-none", i < Math.floor(r.rating) ? "text-amber-400" : "text-slate-600")}
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-black text-slate-300">{r.rating}</span>
                    <span className="text-xs text-slate-600">·</span>
                    <span className="text-xs text-slate-500">{r.service}</span>
                  </div>
                </div>
                <button className="flex-shrink-0 p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Signaler">
                  <span className="material-symbols-outlined text-sm leading-none">flag</span>
                </button>
              </div>

              {/* Comment */}
              <p className={cn("text-sm text-slate-400 leading-relaxed", !isExpanded && "line-clamp-3")}>{r.comment}</p>
              {r.comment.length > 180 && (
                <button
                  onClick={() => setExpandedId(isExpanded ? null : r.id)}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:opacity-80 mt-1"
                >
                  {isExpanded ? (
                    <><span className="material-symbols-outlined text-xs leading-none">expand_less</span> Voir moins</>
                  ) : (
                    <><span className="material-symbols-outlined text-xs leading-none">expand_more</span> Lire la suite</>
                  )}
                </button>
              )}

              {/* My reply */}
              {r.myReply && (
                <div className="mt-3 pl-4 border-l-2 border-primary/30">
                  <p className="text-xs font-bold text-primary mb-1">Votre réponse</p>
                  <p className="text-xs text-slate-400">{r.myReply}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border-dark">
                <span className="text-xs text-slate-500">{r.helpful} personnes ont trouvé cet avis utile</span>
                {!r.myReply && (
                  <button
                    onClick={() => setReplyingTo(isReplying ? null : r.id)}
                    className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm leading-none">chat_bubble</span>
                    Répondre
                  </button>
                )}
              </div>

              {/* Reply form */}
              {isReplying && !r.myReply && (
                <div className="mt-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Rédigez votre réponse publique…"
                    rows={3}
                    className="w-full bg-background-dark border border-border-dark rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-primary resize-none mb-2 placeholder:text-slate-500"
                  />
                  <div className="flex gap-2">
                    <button className="bg-primary hover:opacity-90 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all">
                      Publier la réponse
                    </button>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="px-4 py-2 border border-border-dark rounded-xl text-xs font-bold text-slate-400 hover:bg-primary/5"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
