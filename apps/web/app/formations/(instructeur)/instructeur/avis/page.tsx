"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, MessageSquare, Filter } from "lucide-react";

interface Avis {
  id: string;
  rating: number;
  comment: string;
  response: string | null;
  createdAt: string;
  user: { name: string; avatar: string | null; image: string | null };
  formation: { titleFr: string; slug: string };
}

export default function InstructeurAvisPage() {
  const [avis, setAvis] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState(0);
  const [replyModal, setReplyModal] = useState<Avis | null>(null);
  const [replyText, setReplyText] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchAvis = () => {
    fetch("/api/instructeur/avis")
      .then((r) => r.json())
      .then((d) => { setAvis(d.avis ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchAvis(); }, []);

  const submitReply = async () => {
    if (!replyModal || !replyText.trim()) return;
    setSaving(true);
    await fetch(`/api/formations/${replyModal.formation.slug}/reviews/${replyModal.id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ response: replyText }),
    });
    setSaving(false);
    setReplyModal(null);
    setReplyText("");
    fetchAvis();
  };

  const filtered = avis.filter((a) => filterRating === 0 || a.rating === filterRating);

  const avgRating = avis.length > 0
    ? avis.reduce((acc, a) => acc + a.rating, 0) / avis.length
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: avis.filter((a) => a.rating === r).length,
    pct: avis.length > 0 ? (avis.filter((a) => a.rating === r).length / avis.length) * 100 : 0,
  }));

  const INSTRUCTOR_NAV = [
    ["/formations/instructeur/dashboard", "Dashboard"],
    ["/formations/instructeur/mes-formations", "Formations"],
    ["/formations/instructeur/apprenants", "Apprenants"],
    ["/formations/instructeur/revenus", "Revenus"],
    ["/formations/instructeur/avis", "Avis"],
    ["/formations/instructeur/statistiques", "Statistiques"],
  ] as [string, string][];

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-xl font-bold text-white">Avis reçus</h1>

      {/* Sub-nav */}
      <div className="flex gap-1 bg-border-dark/30 rounded-xl p-1 w-fit overflow-x-auto">
        {INSTRUCTOR_NAV.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              href.includes("avis") ? "bg-primary text-white" : "text-slate-400 hover:text-white hover:bg-border-dark/50"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Global rating */}
        <div className="bg-neutral-dark border border-border-dark rounded-xl p-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-white">{avgRating.toFixed(1)}</div>
              <div className="flex justify-center mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-slate-600"}`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-1">{avis.length} avis</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {ratingCounts.map(({ rating, count, pct }) => (
                <div key={rating} className="flex items-center gap-2">
                  <button
                    onClick={() => setFilterRating(filterRating === rating ? 0 : rating)}
                    className={`text-xs w-3 text-right ${filterRating === rating ? "text-primary" : "text-slate-400"}`}
                  >
                    {rating}
                  </button>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                  <div className="flex-1 h-1.5 bg-border-dark rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-slate-400 w-4 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Filter by rating */}
        <div className="bg-neutral-dark border border-border-dark rounded-xl p-6">
          <p className="text-sm text-slate-400 mb-3">Filtrer par note</p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterRating(0)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${filterRating === 0 ? "bg-primary text-white" : "bg-border-dark text-slate-400 hover:text-white"}`}
            >
              Tous ({avis.length})
            </button>
            {[5, 4, 3, 2, 1].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRating(filterRating === r ? 0 : r)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 ${filterRating === r ? "bg-primary text-white" : "bg-border-dark text-slate-400 hover:text-white"}`}
              >
                {r} <Star className="w-3 h-3 fill-current" /> ({ratingCounts.find(rc => rc.rating === r)?.count ?? 0})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-slate-400">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            {avis.length === 0 ? "Aucun avis reçu pour l'instant" : "Aucun avis avec ce filtre"}
          </div>
        ) : (
          filtered.map((a) => {
            const avatar = a.user.avatar || a.user.image;
            return (
              <div key={a.id} className="bg-neutral-dark border border-border-dark rounded-xl p-5">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {avatar ? (
                      <img src={avatar} alt={a.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-primary font-bold text-sm">{a.user.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-white text-sm">{a.user.name}</p>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= a.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{a.formation.titleFr} · {new Date(a.createdAt).toLocaleDateString("fr-FR")}</p>
                    <p className="text-sm text-slate-300">{a.comment}</p>

                    {/* Existing response */}
                    {a.response && (
                      <div className="mt-3 pl-4 border-l-2 border-primary/30">
                        <p className="text-xs text-slate-500 mb-1">Votre réponse :</p>
                        <p className="text-sm text-slate-400">{a.response}</p>
                      </div>
                    )}

                    {/* Reply button */}
                    {!a.response && (
                      <button
                        onClick={() => { setReplyModal(a); setReplyText(""); }}
                        className="mt-3 flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Répondre
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reply modal */}
      {replyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setReplyModal(null)} />
          <div className="relative bg-neutral-dark border border-border-dark rounded-2xl p-6 w-full max-w-lg">
            <h2 className="font-bold text-white mb-1">Répondre à {replyModal.user.name}</h2>
            <p className="text-xs text-slate-500 mb-4 line-clamp-2">{replyModal.comment}</p>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
              placeholder="Votre réponse publique..."
              className="w-full bg-border-dark border border-border-dark/60 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setReplyModal(null)} className="flex-1 border border-border-dark text-slate-300 py-2.5 rounded-xl hover:bg-border-dark/50 transition-colors text-sm">Annuler</button>
              <button
                onClick={submitReply}
                disabled={!replyText.trim() || saving}
                className="flex-1 bg-primary text-white font-bold py-2.5 rounded-xl hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
              >
                {saving ? "Envoi..." : "Publier la réponse"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
