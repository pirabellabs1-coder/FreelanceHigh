"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, ExternalLink, Pencil, Trash2, Eye } from "lucide-react";

interface FunnelItem {
  id: string;
  slug: string;
  published: boolean;
  formation: {
    title: string;
    slug: string;
    thumbnail: string | null;
    price: number;
    studentsCount: number;
  };
  updatedAt: string;
}

interface Formation {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
}

export default function TunnelDeVenteListPage() {
  const router = useRouter();
  const [funnels, setFunnels] = useState<FunnelItem[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedFormationId, setSelectedFormationId] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/instructeur/sales-funnel").then((r) => r.json()),
      fetch("/api/instructeur/formations?status=all").then((r) => r.json()),
    ]).then(([fData, formData]) => {
      setFunnels(fData.funnels ?? []);
      setFormations(formData.formations ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const funnelFormationIds = new Set(funnels.map((f) => f.formation?.slug).filter(Boolean));
  const availableFormations = formations.filter((f) => !funnelFormationIds.has(f.slug));

  const autoSlug = (title: string) =>
    title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const createFunnel = async () => {
    if (!selectedFormationId || !newSlug) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/instructeur/sales-funnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formationId: selectedFormationId, slug: newSlug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur");
        setCreating(false);
        return;
      }
      router.push(`/formations/instructeur/tunnel-de-vente/${data.funnel.id}`);
    } catch {
      setError("Erreur réseau");
      setCreating(false);
    }
  };

  const deleteFunnel = async (id: string) => {
    if (!confirm("Supprimer ce tunnel de vente ?")) return;
    await fetch(`/api/instructeur/sales-funnel/${id}`, { method: "DELETE" });
    setFunnels(funnels.filter((f) => f.id !== id));
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Tunnels de vente</h1>
          <p className="text-sm text-slate-500 mt-1">Créez des pages de vente personnalisées pour vos formations</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Nouveau tunnel
        </button>
      </div>

      {/* Create dialog */}
      {showCreate && (
        <div className="bg-white dark:bg-slate-900 border border-primary/30 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">Créer un tunnel de vente</h2>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Formation *</label>
            <select
              value={selectedFormationId}
              onChange={(e) => {
                setSelectedFormationId(e.target.value);
                const f = formations.find((f) => f.id === e.target.value);
                if (f) setNewSlug(autoSlug(f.title));
              }}
              className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2.5 text-sm"
            >
              <option value="">Sélectionner une formation...</option>
              {availableFormations.map((f) => (
                <option key={f.id} value={f.id}>{f.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Slug de la page *</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">/formations/vente/</span>
              <input
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                className="flex-1 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 text-sm font-mono"
                placeholder="ma-formation"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button onClick={() => { setShowCreate(false); setError(""); }} className="border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-800">Annuler</button>
            <button onClick={createFunnel} disabled={!selectedFormationId || !newSlug || creating} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50">
              {creating ? "Création..." : "Créer le tunnel"}
            </button>
          </div>
        </div>
      )}

      {/* Funnels list */}
      {funnels.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg mb-2">Aucun tunnel de vente</p>
          <p className="text-sm">Créez votre premier tunnel pour vendre vos formations</p>
        </div>
      ) : (
        <div className="space-y-3">
          {funnels.map((funnel) => (
            <div key={funnel.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center gap-4">
              {funnel.formation?.thumbnail ? (
                <img src={funnel.formation.thumbnail} alt="" className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
              ) : (
                <div className="w-16 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{funnel.formation?.title}</p>
                <p className="text-xs text-slate-400 font-mono">/formations/vente/{funnel.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${funnel.published ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
                  {funnel.published ? "Publié" : "Brouillon"}
                </span>
                {funnel.published && (
                  <a href={`/formations/vente/${funnel.slug}`} target="_blank" rel="noopener" className="p-1.5 text-slate-400 hover:text-primary rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </a>
                )}
                <button onClick={() => router.push(`/formations/instructeur/tunnel-de-vente/${funnel.id}`)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => deleteFunnel(funnel.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
