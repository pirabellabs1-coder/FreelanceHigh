"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDashboardStore, useToastStore } from "@/store/dashboard";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export default function PortfolioPage() {
  const { portfolio, addPortfolioProject, updatePortfolioProject, deletePortfolioProject } = useDashboardStore();
  const addToast = useToastStore((s) => s.addToast);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "", skills: "", images: "", link: "", featured: false });

  function resetForm() {
    setForm({ title: "", description: "", category: "", skills: "", images: "", link: "", featured: false });
    setEditingId(null);
    setShowForm(false);
  }

  function openEdit(id: string) {
    const p = portfolio.find((x) => x.id === id);
    if (!p) return;
    setForm({
      title: p.title, description: p.description, category: p.category,
      skills: p.skills.join(", "), images: p.images.join(", "), link: p.link, featured: p.featured,
    });
    setEditingId(id);
    setShowForm(true);
  }

  function handleSave() {
    if (!form.title.trim()) { addToast("error", "Le titre est requis"); return; }
    const data = {
      title: form.title, description: form.description, category: form.category,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      link: form.link, featured: form.featured,
    };
    if (editingId) {
      updatePortfolioProject(editingId, data);
      addToast("success", "Projet modifie !");
    } else {
      addPortfolioProject(data);
      addToast("success", "Projet ajoute au portfolio !");
    }
    resetForm();
  }

  function handleDelete(id: string) {
    deletePortfolioProject(id);
    setDeleteModal(null);
    addToast("success", "Projet supprime");
  }

  function toggleFeatured(id: string) {
    const p = portfolio.find((x) => x.id === id);
    if (p) {
      updatePortfolioProject(id, { featured: !p.featured });
      addToast("info", p.featured ? "Retire des favoris" : "Ajoute aux favoris");
    }
  }

  return (
    <div className="max-w-full space-y-4 sm:space-y-6 lg:space-y-8">
      <ConfirmModal open={!!deleteModal} title="Supprimer le projet" message="Etes-vous sur ? Cette action est irreversible."
        confirmLabel="Supprimer" variant="danger" onConfirm={() => deleteModal && handleDelete(deleteModal)} onCancel={() => setDeleteModal(null)} />

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">Portfolio</h2>
          <p className="text-slate-400 mt-1">{portfolio.length} projet(s) · {portfolio.filter((p) => p.featured).length} en vedette</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-lg text-sm hover:bg-primary/90 shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-lg">add</span> Ajouter un projet
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-background-dark/50 border border-primary/30 rounded-xl p-6 space-y-4 animate-scale-in">
          <h3 className="font-bold text-lg">{editingId ? "Modifier le projet" : "Nouveau projet"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Titre *</label>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Categorie</label>
              <input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3}
              className="w-full px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Competences (separees par virgule)</label>
            <input value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
              className="w-full px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">URLs d&apos;images (separees par virgule)</label>
            <input value={form.images} onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
              className="w-full px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Lien du projet</label>
            <input value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
              className="w-full px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              className="w-4 h-4 rounded accent-primary" />
            <span className="text-sm">Mettre en vedette</span>
          </label>
          <div className="flex gap-3">
            <button onClick={handleSave} className="px-5 py-2.5 bg-primary text-white font-bold rounded-lg text-sm hover:bg-primary/90">
              {editingId ? "Enregistrer" : "Ajouter"}
            </button>
            <button onClick={resetForm} className="px-4 py-2.5 text-sm text-slate-400 hover:text-slate-200">Annuler</button>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portfolio.map((p) => (
          <div key={p.id} className="bg-background-dark/50 border border-border-dark rounded-xl overflow-hidden group hover:border-primary/30 transition-all">
            {p.images[0] && (
              <img src={p.images[0]} alt={p.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold">{p.title}</h3>
                  <p className="text-xs text-primary font-semibold mt-0.5">{p.category}</p>
                </div>
                {p.featured && (
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">star</span> Vedette
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 line-clamp-2">{p.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.skills.map((s) => (
                  <span key={s} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">{s}</span>
                ))}
              </div>
              <div className="flex gap-2 pt-2 border-t border-border-dark">
                <button onClick={() => openEdit(p.id)} className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">edit</span> Modifier
                </button>
                <button onClick={() => toggleFeatured(p.id)} className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors">
                  <span className="material-symbols-outlined text-sm">{p.featured ? "star" : "star_outline"}</span> {p.featured ? "Retirer" : "Vedette"}
                </button>
                <button onClick={() => setDeleteModal(p.id)} className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors ml-auto">
                  <span className="material-symbols-outlined text-sm">delete</span> Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
