"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const REVIEWS = [
  { id: "1", freelance: "Jean-Luc S.", service: "Développement API REST", date: "2026-02-28", rating: 5, quality: 5, communication: 5, delay: 4, comment: "Excellent travail ! L'API a été livrée avant le délai avec une documentation complète. Je recommande vivement.", response: "Merci beaucoup Marc ! Ce fut un plaisir de travailler sur ce projet." },
  { id: "2", freelance: "Marie Koffi", service: "Audit SEO Complet", date: "2026-02-20", rating: 4, quality: 4, communication: 5, delay: 4, comment: "Bon audit SEO avec des recommandations pertinentes. Quelques points auraient pu être plus détaillés.", response: null },
  { id: "3", freelance: "Sophie Design", service: "Logo & Branding", date: "2026-02-10", rating: 3, quality: 3, communication: 4, delay: 2, comment: "Le logo est correct mais le délai n'a pas été respecté. La communication aurait pu être meilleure pendant les retards.", response: "Je m'excuse pour le retard, j'ai eu un imprévu. Le résultat final est conforme au brief." },
  { id: "4", freelance: "Thomas Weber", service: "Design UI/UX Mobile", date: "2026-01-15", rating: 5, quality: 5, communication: 5, delay: 5, comment: "Parfait ! Design moderne, livraison rapide, excellent suivi. Thomas est un freelance d'exception.", response: null },
];

const PENDING_REVIEWS = [
  { orderId: "ORD-7815", service: "Développement Frontend React", freelance: "Amadou D.", completedDate: "2026-03-01", deadline: "2026-03-08" },
];

function StarRating({ rating, size = "text-sm" }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className={cn("material-symbols-outlined", size, i <= rating ? "text-yellow-400" : "text-slate-600")}
          style={{ fontVariationSettings: i <= rating ? "'FILL' 1" : "'FILL' 0" }}
        >
          star
        </span>
      ))}
    </div>
  );
}

export default function ClientReviews() {
  const [tab, setTab] = useState<"donnes" | "en_attente">("donnes");
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [newRating, setNewRating] = useState({ quality: 0, communication: 0, delay: 0, comment: "" });
  const { addToast } = useToastStore();

  function submitReview() {
    if (newRating.quality === 0 || newRating.communication === 0 || newRating.delay === 0) {
      addToast("error", "Veuillez attribuer une note pour chaque critère");
      return;
    }
    addToast("success", "Avis publié avec succès !");
    setNewRating({ quality: 0, communication: 0, delay: 0, comment: "" });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">Mes Avis</h1>
        <p className="text-slate-400 text-sm mt-1">Consultez vos évaluations et laissez des avis sur vos collaborations.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-xl text-yellow-400">star</span>
          <div>
            <p className="text-xl font-black text-white">4.3</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Note moyenne</p>
          </div>
        </div>
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-xl text-primary">rate_review</span>
          <div>
            <p className="text-xl font-black text-white">{REVIEWS.length}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Avis donnés</p>
          </div>
        </div>
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-xl text-amber-400">schedule</span>
          <div>
            <p className="text-xl font-black text-amber-400">{PENDING_REVIEWS.length}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">En attente</p>
          </div>
        </div>
        <div className="bg-neutral-dark rounded-xl border border-border-dark p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-xl text-primary">thumb_up</span>
          <div>
            <p className="text-xl font-black text-white">92%</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Satisfaction</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab("donnes")} className={cn("px-4 py-2 rounded-lg text-sm font-semibold transition-colors", tab === "donnes" ? "bg-primary text-background-dark" : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white")}>
          Avis donnés ({REVIEWS.length})
        </button>
        <button onClick={() => setTab("en_attente")} className={cn("px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2", tab === "en_attente" ? "bg-primary text-background-dark" : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white")}>
          En attente ({PENDING_REVIEWS.length})
          {PENDING_REVIEWS.length > 0 && <span className="w-2 h-2 bg-amber-400 rounded-full" />}
        </button>
      </div>

      {/* Given Reviews */}
      {tab === "donnes" && (
        <div className="space-y-4">
          {REVIEWS.map(r => (
            <div key={r.id} className="bg-neutral-dark rounded-xl border border-border-dark p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                    {r.freelance.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{r.freelance}</p>
                    <p className="text-xs text-slate-500">{r.service} · {new Date(r.date).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StarRating rating={r.rating} />
                  <span className="text-sm font-bold text-white">{r.rating}.0</span>
                </div>
              </div>

              <p className="text-sm text-slate-300 mb-3">{r.comment}</p>

              {/* Detail ratings */}
              <div className="flex gap-6 text-xs mb-3">
                <span className="text-slate-500">Qualité : <StarRating rating={r.quality} size="text-[10px]" /></span>
                <span className="text-slate-500">Communication : <StarRating rating={r.communication} size="text-[10px]" /></span>
                <span className="text-slate-500">Délai : <StarRating rating={r.delay} size="text-[10px]" /></span>
              </div>

              {r.response && (
                <div className="bg-background-dark rounded-lg p-3 border border-border-dark">
                  <p className="text-xs text-primary font-semibold mb-1">Réponse de {r.freelance}</p>
                  <p className="text-xs text-slate-400">{r.response}</p>
                </div>
              )}

              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-dark">
                <button
                  onClick={() => { setEditingReview(editingReview === r.id ? null : r.id); }}
                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">edit</span>
                  Modifier
                </button>
                <span className="text-slate-600">·</span>
                <button
                  onClick={() => addToast("info", "Signalement envoyé")}
                  className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">flag</span>
                  Signaler
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pending Reviews */}
      {tab === "en_attente" && (
        <div className="space-y-4">
          {PENDING_REVIEWS.map(p => (
            <div key={p.orderId} className="bg-neutral-dark rounded-xl border border-border-dark p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <span className="material-symbols-outlined">rate_review</span>
                  </div>
                  <div>
                    <p className="font-bold text-white">{p.service}</p>
                    <p className="text-xs text-slate-500">Freelance : {p.freelance} · Terminée le {new Date(p.completedDate).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>
                <span className="text-xs bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full font-semibold">
                  Expire le {new Date(p.deadline).toLocaleDateString("fr-FR")}
                </span>
              </div>

              {/* Rating form */}
              <div className="space-y-4 bg-background-dark rounded-xl p-5 border border-border-dark">
                <p className="text-sm font-bold text-white">Évaluer cette commande</p>
                {[
                  { key: "quality", label: "Qualité du travail" },
                  { key: "communication", label: "Communication" },
                  { key: "delay", label: "Respect des délais" },
                ].map(c => (
                  <div key={c.key} className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">{c.label}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <button
                          key={i}
                          onClick={() => setNewRating(r => ({ ...r, [c.key]: i }))}
                          className={cn(
                            "material-symbols-outlined text-xl transition-colors",
                            i <= (newRating[c.key as keyof typeof newRating] as number) ? "text-yellow-400" : "text-slate-600 hover:text-yellow-400/50"
                          )}
                          style={{ fontVariationSettings: i <= (newRating[c.key as keyof typeof newRating] as number) ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          star
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Commentaire (optionnel)</label>
                  <textarea
                    value={newRating.comment}
                    onChange={e => setNewRating(r => ({ ...r, comment: e.target.value }))}
                    rows={3}
                    placeholder="Partagez votre expérience avec ce freelance..."
                    className="w-full px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 resize-none"
                  />
                </div>
                <button onClick={submitReview} className="px-6 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all">
                  Publier l&apos;avis
                </button>
              </div>
            </div>
          ))}
          {PENDING_REVIEWS.length === 0 && (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-slate-600 mb-3">rate_review</span>
              <p className="text-slate-500 font-semibold">Aucun avis en attente</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
