"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle, Loader2 } from "lucide-react";

interface FormationData {
  id: string;
  titleFr: string;
  titleEn: string;
  shortDescFr: string;
  shortDescEn: string;
  descriptionFr: string;
  descriptionEn: string;
  thumbnail: string;
  previewVideo: string;
  price: number;
  isFree: boolean;
  level: string;
  duration: number;
  hasCertificate: boolean;
  minScore: number;
  status: string;
  categoryId: string;
}

export default function ModifierFormationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [formation, setFormation] = useState<FormationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [titleFr, setTitleFr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [shortDescFr, setShortDescFr] = useState("");
  const [shortDescEn, setShortDescEn] = useState("");
  const [descriptionFr, setDescriptionFr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [previewVideo, setPreviewVideo] = useState("");
  const [price, setPrice] = useState(0);
  const [isFree, setIsFree] = useState(false);
  const [level, setLevel] = useState("TOUS_NIVEAUX");
  const [duration, setDuration] = useState(60);
  const [hasCertificate, setHasCertificate] = useState(true);
  const [minScore, setMinScore] = useState(80);

  useEffect(() => {
    fetch(`/api/instructeur/formations/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.formation) {
          const f = data.formation;
          setFormation(f);
          setTitleFr(f.titleFr || "");
          setTitleEn(f.titleEn || "");
          setShortDescFr(f.shortDescFr || "");
          setShortDescEn(f.shortDescEn || "");
          setDescriptionFr(f.descriptionFr || "");
          setDescriptionEn(f.descriptionEn || "");
          setThumbnail(f.thumbnail || "");
          setPreviewVideo(f.previewVideo || "");
          setPrice(f.price || 0);
          setIsFree(f.isFree || false);
          setLevel(f.level || "TOUS_NIVEAUX");
          setDuration(f.duration || 60);
          setHasCertificate(f.hasCertificate ?? true);
          setMinScore(f.minScore || 80);
        } else {
          setError("Formation introuvable");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur de chargement");
        setLoading(false);
      });
  }, [id]);

  const handleSave = async (submitForReview = false) => {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/instructeur/formations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleFr,
          titleEn,
          shortDescFr,
          shortDescEn,
          descriptionFr,
          descriptionEn,
          thumbnail,
          previewVideo,
          price: isFree ? 0 : price,
          isFree,
          level,
          duration,
          hasCertificate,
          minScore,
          status: submitForReview ? "EN_ATTENTE" : "BROUILLON",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la sauvegarde");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/formations/instructeur/mes-formations");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !formation) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400">{error}</p>
        <Link href="/formations/instructeur/mes-formations" className="text-primary text-sm mt-4 inline-block">
          ← Retour à mes formations
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/formations/instructeur/mes-formations"
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Modifier la formation</h1>
          <p className="text-sm text-slate-400">{formation?.titleFr}</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-green-400 text-sm">
          ✅ Formation sauvegardée avec succès. Redirection en cours...
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Titres */}
      <div className="bg-neutral-dark border border-border-dark rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-white text-sm uppercase tracking-wide">Informations de base</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Titre FR *</label>
            <input
              value={titleFr}
              onChange={(e) => setTitleFr(e.target.value)}
              maxLength={80}
              className="w-full bg-surface-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
            />
            <p className="text-xs text-slate-500 mt-1">{titleFr.length}/80</p>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Titre EN</label>
            <input
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              maxLength={80}
              className="w-full bg-surface-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Description courte FR</label>
            <textarea
              value={shortDescFr}
              onChange={(e) => setShortDescFr(e.target.value)}
              rows={3}
              maxLength={200}
              className="w-full bg-surface-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Description courte EN</label>
            <textarea
              value={shortDescEn}
              onChange={(e) => setShortDescEn(e.target.value)}
              rows={3}
              maxLength={200}
              className="w-full bg-surface-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary resize-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Description complète FR</label>
            <textarea
              value={descriptionFr}
              onChange={(e) => setDescriptionFr(e.target.value)}
              rows={6}
              className="w-full bg-surface-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Description complète EN</label>
            <textarea
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              rows={6}
              className="w-full bg-surface-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary resize-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Niveau</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-surface-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
            >
              <option value="DEBUTANT">Débutant</option>
              <option value="INTERMEDIAIRE">Intermédiaire</option>
              <option value="AVANCE">Avancé</option>
              <option value="TOUS_NIVEAUX">Tous niveaux</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Durée (min)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
              min={10}
              className="w-full bg-surface-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Médias */}
      <div className="bg-neutral-dark border border-border-dark rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-white text-sm uppercase tracking-wide">Médias</h2>

        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">URL image de couverture</label>
          <input
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="https://..."
            className="w-full bg-surface-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
          />
          {thumbnail && (
            <img src={thumbnail} alt="Aperçu" className="mt-2 h-32 w-auto rounded-lg object-cover" />
          )}
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">URL vidéo de prévisualisation</label>
          <input
            value={previewVideo}
            onChange={(e) => setPreviewVideo(e.target.value)}
            placeholder="https://youtube.com/... ou https://vimeo.com/..."
            className="w-full bg-surface-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Prix */}
      <div className="bg-neutral-dark border border-border-dark rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-white text-sm uppercase tracking-wide">Prix et certification</h2>

        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setIsFree(!isFree)}
            className={`w-10 h-6 rounded-full transition-colors ${isFree ? "bg-primary" : "bg-border-dark"} relative`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isFree ? "left-5" : "left-1"}`} />
          </div>
          <span className="text-sm text-white">Formation gratuite</span>
        </label>

        {!isFree && (
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Prix (€)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              min={5}
              max={500}
              step={0.01}
              className="w-full bg-surface-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
            />
            <p className="text-xs text-green-400 mt-1">Vos revenus nets : {(price * 0.7).toFixed(2)} € (70%)</p>
          </div>
        )}

        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setHasCertificate(!hasCertificate)}
            className={`w-10 h-6 rounded-full transition-colors ${hasCertificate ? "bg-primary" : "bg-border-dark"} relative`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${hasCertificate ? "left-5" : "left-1"}`} />
          </div>
          <span className="text-sm text-white">Certificat disponible</span>
        </label>

        {hasCertificate && (
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Score minimum pour le certificat : {minScore}%</label>
            <input
              type="range"
              value={minScore}
              onChange={(e) => setMinScore(parseInt(e.target.value))}
              min={50}
              max={100}
              step={5}
              className="w-full accent-primary"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link
          href="/formations/instructeur/mes-formations"
          className="text-sm text-slate-400 hover:text-white px-4 py-2 rounded-lg transition-colors"
        >
          Annuler
        </Link>
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="flex items-center gap-2 bg-border-dark hover:bg-border-dark/70 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Sauvegarder brouillon
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={saving || !titleFr}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Soumettre pour modération
        </button>
      </div>
    </div>
  );
}
