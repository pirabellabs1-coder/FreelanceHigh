"use client";

import { useState, useMemo } from "react";
import { useToastStore } from "@/store/dashboard";
import { usePlatformDataStore, type BlogArticle } from "@/store/platform-data";
import { cn } from "@/lib/utils";

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  publie: { label: "Publié", cls: "bg-emerald-500/20 text-emerald-400" },
  brouillon: { label: "Brouillon", cls: "bg-amber-500/20 text-amber-400" },
  programme: { label: "Programmé", cls: "bg-blue-500/20 text-blue-400" },
};

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const BLOG_CATEGORIES = ["Conseils", "Tutoriels", "Success Stories", "Actualités", "Guide", "Paiements", "Tendances"];

type ModalMode = null | "add" | "edit";

type BlogFormState = {
  title: string; slug: string; content: string; excerpt: string; coverImage: string;
  category: string; tags: string[]; author: string;
  status: "brouillon" | "programme" | "publie"; publishedAt: string | null;
  scheduledAt: string | null; metaTitle: string; metaDescription: string;
};

const emptyForm: BlogFormState = {
  title: "", slug: "", content: "", excerpt: "", coverImage: "",
  category: "Conseils", tags: [], author: "Lissanon Gildas",
  status: "brouillon", publishedAt: null,
  scheduledAt: null, metaTitle: "", metaDescription: "",
};

export default function AdminBlog() {
  const { addToast } = useToastStore();
  const { blogArticles, addArticle, updateArticle, publishArticle, unpublishArticle, deleteArticle } = usePlatformDataStore();

  const [modal, setModal] = useState<ModalMode>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [tagInput, setTagInput] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [tab, setTab] = useState("tous");

  const filtered = useMemo(() => {
    if (tab === "tous") return blogArticles;
    return blogArticles.filter(a => a.status === tab);
  }, [tab, blogArticles]);

  const stats = useMemo(() => ({
    publie: blogArticles.filter(a => a.status === "publie").length,
    brouillon: blogArticles.filter(a => a.status === "brouillon").length,
    programme: blogArticles.filter(a => a.status === "programme").length,
    totalViews: blogArticles.reduce((s, a) => s + a.views, 0),
  }), [blogArticles]);

  function openAdd() {
    setForm(emptyForm);
    setEditId(null);
    setModal("add");
  }

  function openEdit(article: BlogArticle) {
    setForm({
      title: article.title, slug: article.slug, content: article.content,
      excerpt: article.excerpt, coverImage: article.coverImage,
      category: article.category, tags: [...article.tags], author: article.author,
      status: article.status, publishedAt: article.publishedAt,
      scheduledAt: article.scheduledAt,
      metaTitle: article.metaTitle || "", metaDescription: article.metaDescription || "",
    });
    setEditId(article.id);
    setModal("edit");
  }

  function handleSave() {
    if (!form.title.trim()) { addToast("warning", "Le titre est requis"); return; }
    if (!form.content.trim()) { addToast("warning", "Le contenu est requis"); return; }

    const slug = form.slug || slugify(form.title);
    const data = { ...form, slug };

    if (modal === "add") {
      addArticle(data);
      addToast("success", `Article "${form.title}" créé`);
    } else if (modal === "edit" && editId) {
      updateArticle(editId, data);
      addToast("success", `Article "${form.title}" modifié`);
    }
    setModal(null);
  }

  function handlePublish(id: string) {
    const article = blogArticles.find(a => a.id === id);
    publishArticle(id);
    addToast("success", `"${article?.title}" publié — visible sur /blog`);
  }

  function handleUnpublish(id: string) {
    unpublishArticle(id);
    addToast("success", "Article dépublié");
  }

  function handleDelete() {
    if (!deleteId) return;
    const article = blogArticles.find(a => a.id === deleteId);
    deleteArticle(deleteId);
    addToast("success", `"${article?.title}" supprimé`);
    setDeleteId(null);
  }

  function addTag() {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">article</span>
            Blog
          </h1>
          <p className="text-slate-400 text-sm mt-1">{blogArticles.length} articles — {stats.totalViews.toLocaleString()} vues totales</p>
        </div>
        <button onClick={openAdd} className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">add</span>
          Nouvel article
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: "Publiés", value: stats.publie, color: "text-emerald-400", icon: "check_circle" },
          { label: "Brouillons", value: stats.brouillon, color: "text-amber-400", icon: "edit_note" },
          { label: "Programmés", value: stats.programme, color: "text-blue-400", icon: "schedule" },
          { label: "Vues totales", value: stats.totalViews.toLocaleString(), color: "text-primary", icon: "visibility" },
        ].map(s => (
          <div key={s.label} className="bg-neutral-dark rounded-xl p-4 border border-border-dark">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("material-symbols-outlined text-lg", s.color)}>{s.icon}</span>
              <p className={cn("text-xl font-black", s.color)}>{s.value}</p>
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border-dark">
        {[
          { key: "tous", label: "Tous", count: blogArticles.length },
          { key: "publie", label: "Publiés", count: stats.publie },
          { key: "brouillon", label: "Brouillons", count: stats.brouillon },
          { key: "programme", label: "Programmés", count: stats.programme },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={cn("px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors flex items-center gap-1.5", tab === t.key ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-white")}>
            {t.label}
            <span className="text-[10px] bg-border-dark px-1.5 py-0.5 rounded-full">{t.count}</span>
          </button>
        ))}
      </div>

      {/* Articles table */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-dark">
                <th className="px-5 py-3 text-left text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Article</th>
                <th className="px-5 py-3 text-left text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Catégorie</th>
                <th className="px-5 py-3 text-center text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Statut</th>
                <th className="px-5 py-3 text-center text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Vues</th>
                <th className="px-5 py-3 text-left text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Date</th>
                <th className="px-5 py-3 text-center text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className="border-b border-border-dark/50 hover:bg-background-dark/30 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-sm font-semibold text-white truncate max-w-[300px]">{a.title}</p>
                    <p className="text-xs text-slate-500">par {a.author} — /{a.slug}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs bg-border-dark text-slate-300 px-2 py-0.5 rounded-full">{a.category}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", STATUS_MAP[a.status]?.cls)}>{STATUS_MAP[a.status]?.label}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-center font-bold text-white">{a.views > 0 ? a.views.toLocaleString() : "—"}</td>
                  <td className="px-5 py-3 text-sm text-slate-400">{a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("fr-FR") : new Date(a.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-center gap-1">
                      <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors" title="Modifier">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      {a.status !== "publie" && (
                        <button onClick={() => handlePublish(a.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors" title="Publier">
                          <span className="material-symbols-outlined text-lg">publish</span>
                        </button>
                      )}
                      {a.status === "publie" && (
                        <button onClick={() => handleUnpublish(a.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors" title="Dépublier">
                          <span className="material-symbols-outlined text-lg">unpublished</span>
                        </button>
                      )}
                      <button onClick={() => setDeleteId(a.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Supprimer">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-slate-600">article</span>
            <p className="text-slate-500 mt-2">Aucun article dans cette catégorie</p>
          </div>
        )}
      </div>

      {/* Modal Éditeur */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-neutral-dark rounded-2xl p-6 w-full max-w-2xl border border-border-dark shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-white mb-6">{modal === "add" ? "Nouvel article" : "Modifier l'article"}</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Titre *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: slugify(e.target.value) }))} className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-sm text-white outline-none focus:ring-2 focus:ring-primary/30" placeholder="Titre de l'article" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Slug</label>
                  <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-sm text-slate-400 font-mono outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Catégorie</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-sm text-white outline-none cursor-pointer focus:ring-2 focus:ring-primary/30">
                    {BLOG_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Extrait</label>
                <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-sm text-white outline-none resize-none focus:ring-2 focus:ring-primary/30" placeholder="Résumé court de l'article..." />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Contenu * (Markdown supporté)</label>
                <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={10} className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-sm text-white outline-none resize-y focus:ring-2 focus:ring-primary/30 font-mono" placeholder="Rédigez votre article ici... ## Titres supportés" />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Tags</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {form.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                      #{tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-red-400"><span className="material-symbols-outlined text-xs">close</span></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} className="flex-1 px-4 py-2 rounded-lg border border-border-dark bg-background-dark text-sm text-white outline-none focus:ring-2 focus:ring-primary/30" placeholder="Ajouter un tag..." />
                  <button onClick={addTag} className="px-3 py-2 bg-border-dark text-slate-300 rounded-lg text-sm hover:bg-primary/20 transition-colors">Ajouter</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Auteur</label>
                  <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-sm text-white outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Statut</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as BlogArticle["status"] }))} className="w-full px-4 py-2.5 rounded-lg border border-border-dark bg-background-dark text-sm text-white outline-none cursor-pointer focus:ring-2 focus:ring-primary/30">
                    <option value="brouillon">Brouillon</option>
                    <option value="publie">Publié</option>
                    <option value="programme">Programmé</option>
                  </select>
                </div>
              </div>

              {/* SEO */}
              <details className="border border-border-dark rounded-lg p-4">
                <summary className="text-xs font-semibold text-slate-400 cursor-pointer">SEO (optionnel)</summary>
                <div className="space-y-3 mt-3">
                  <input value={form.metaTitle || ""} onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))} className="w-full px-4 py-2 rounded-lg border border-border-dark bg-background-dark text-sm text-white outline-none focus:ring-2 focus:ring-primary/30" placeholder="Meta title" />
                  <textarea value={form.metaDescription || ""} onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))} rows={2} className="w-full px-4 py-2 rounded-lg border border-border-dark bg-background-dark text-sm text-white outline-none resize-none focus:ring-2 focus:ring-primary/30" placeholder="Meta description" />
                </div>
              </details>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-border-dark rounded-lg text-sm font-semibold text-slate-300 hover:bg-background-dark/50 transition-colors">Annuler</button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">{modal === "add" ? "Créer" : "Enregistrer"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-neutral-dark rounded-2xl p-6 w-full max-w-sm border border-border-dark shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center"><span className="material-symbols-outlined text-red-400">warning</span></div>
              <h3 className="font-bold text-lg text-white">Supprimer cet article ?</h3>
            </div>
            <p className="text-sm text-slate-400 mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-border-dark rounded-lg text-sm font-semibold text-slate-300 hover:bg-background-dark/50 transition-colors">Annuler</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-colors">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
