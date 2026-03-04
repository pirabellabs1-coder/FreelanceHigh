"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const ARTICLES = [
  { id: "1", title: "10 conseils pour r\u00e9ussir en freelance en Afrique", author: "Lissanon G.", category: "Conseils", status: "publie", date: "2026-03-01", views: 2450 },
  { id: "2", title: "Comment fixer ses tarifs en tant que freelance", author: "Nadia F.", category: "Tarification", status: "publie", date: "2026-02-25", views: 1890 },
  { id: "3", title: "Les meilleures m\u00e9thodes de paiement en Afrique", author: "Amadou D.", category: "Paiements", status: "publie", date: "2026-02-20", views: 3200 },
  { id: "4", title: "Guide du client : publier un projet efficace", author: "Lissanon G.", category: "Guide", status: "publie", date: "2026-02-15", views: 1560 },
  { id: "5", title: "Tendances tech 2026 en Afrique francophone", author: "Ibrahim M.", category: "Tendances", status: "brouillon", date: "2026-03-03", views: 0 },
  { id: "6", title: "Success story : de 0 \u00e0 \u20AC5000/mois depuis Dakar", author: "Fatou S.", category: "Success Story", status: "programme", date: "2026-03-15", views: 0 },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  publie: { label: "Publi\u00e9", cls: "bg-emerald-500/20 text-emerald-400" },
  brouillon: { label: "Brouillon", cls: "bg-amber-500/20 text-amber-400" },
  programme: { label: "Programm\u00e9", cls: "bg-blue-500/20 text-blue-400" },
};

export default function AdminBlog() {
  const [articles, setArticles] = useState(ARTICLES);
  const { addToast } = useToastStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">article</span>
          Blog
        </h1>
        <button
          onClick={() => addToast("info", "\u00c9diteur d\u0027article bient\u00f4t disponible")}
          className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nouvel article
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Articles publi\u00e9s", value: 45 },
          { label: "Brouillons", value: 8 },
          { label: "Vues ce mois", value: 12450 },
        ].map(s => (
          <div key={s.label} className="bg-neutral-dark rounded-xl p-5 border border-border-dark">
            <p className="text-2xl font-bold text-white">{s.value.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Articles table */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-400 uppercase border-b border-border-dark">
                <th className="px-5 py-3 text-left font-semibold">Article</th>
                <th className="px-5 py-3 text-left font-semibold">Auteur</th>
                <th className="px-5 py-3 text-left font-semibold">Cat&eacute;gorie</th>
                <th className="px-5 py-3 text-center font-semibold">Statut</th>
                <th className="px-5 py-3 text-center font-semibold">Vues</th>
                <th className="px-5 py-3 text-left font-semibold">Date</th>
                <th className="px-5 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(a => (
                <tr key={a.id} className="border-b border-border-dark/50 hover:bg-primary/5">
                  <td className="px-5 py-3 text-sm font-semibold text-white max-w-xs truncate">{a.title}</td>
                  <td className="px-5 py-3 text-sm text-slate-400">{a.author}</td>
                  <td className="px-5 py-3 text-sm">
                    <span className="text-xs bg-border-dark text-slate-300 px-2 py-0.5 rounded-full">{a.category}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", STATUS_MAP[a.status]?.cls)}>
                      {STATUS_MAP[a.status]?.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-center font-bold text-white">{a.views > 0 ? a.views.toLocaleString() : "-"}</td>
                  <td className="px-5 py-3 text-sm text-slate-400">{new Date(a.date).toLocaleDateString("fr-FR")}</td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => addToast("info", "\u00c9diteur ouvert")}
                        className="p-1 text-slate-400 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button
                        onClick={() => { setArticles(prev => prev.filter(ar => ar.id !== a.id)); addToast("success", "Article supprim\u00e9"); }}
                        className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {articles.length === 0 && (
          <p className="text-center text-slate-400 py-8">Aucun article trouv&eacute;</p>
        )}
      </div>
    </div>
  );
}
