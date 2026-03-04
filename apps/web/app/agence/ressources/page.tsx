"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

interface FileItem {
  id: string;
  name: string;
  type: "folder" | "image" | "pdf" | "doc" | "video" | "zip";
  size?: string;
  date: string;
  uploader?: string;
  project?: string;
}

const FILES: FileItem[] = [
  { id: "1", name: "Projet E-commerce", type: "folder", date: "2026-03-01", project: "E-commerce StartupTech" },
  { id: "2", name: "Maquettes App Mobile", type: "folder", date: "2026-02-28", project: "App FinTech" },
  { id: "3", name: "Assets Marketing", type: "folder", date: "2026-02-25" },
  { id: "4", name: "brief-client-dupont.pdf", type: "pdf", size: "2.4 MB", date: "2026-03-03", uploader: "Amadou D.", project: "Site vitrine Dupont" },
  { id: "5", name: "maquette-v2-finale.fig", type: "doc", size: "12.8 MB", date: "2026-03-02", uploader: "Fatou S.", project: "App FinTech" },
  { id: "6", name: "logo-agence-hd.png", type: "image", size: "850 KB", date: "2026-02-20", uploader: "Fatou S." },
  { id: "7", name: "video-promo-30s.mp4", type: "video", size: "45.2 MB", date: "2026-02-18", uploader: "Nadia F." },
  { id: "8", name: "livrables-seo-janvier.zip", type: "zip", size: "8.1 MB", date: "2026-02-15", uploader: "Nadia F.", project: "SEO BlogMedia" },
  { id: "9", name: "contrat-type-prestation.docx", type: "doc", size: "156 KB", date: "2026-02-10", uploader: "Thomas C." },
  { id: "10", name: "facture-client-awa.pdf", type: "pdf", size: "98 KB", date: "2026-02-08", uploader: "Ibrahim M.", project: "Marketing Awa Consulting" },
];

const TYPE_ICONS: Record<string, { icon: string; color: string }> = {
  folder: { icon: "folder", color: "text-amber-500" },
  image: { icon: "image", color: "text-blue-400" },
  pdf: { icon: "picture_as_pdf", color: "text-red-400" },
  doc: { icon: "description", color: "text-blue-500" },
  video: { icon: "videocam", color: "text-purple-400" },
  zip: { icon: "folder_zip", color: "text-emerald-400" },
};

const USED_MB = 69.6;
const QUOTA_GB = 50;
const USED_PCT = (USED_MB / (QUOTA_GB * 1024)) * 100;

export default function AgenceRessources() {
  const [files, setFiles] = useState(FILES);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const { addToast } = useToastStore();

  const filtered = files.filter(f =>
    !search || f.name.toLowerCase().includes(search.toLowerCase()) || (f.project && f.project.toLowerCase().includes(search.toLowerCase()))
  );

  const folders = filtered.filter(f => f.type === "folder");
  const otherFiles = filtered.filter(f => f.type !== "folder");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Ressources & Médias</h1>
          <p className="text-slate-400 text-sm mt-1">Cloud partagé de l&apos;agence — dossiers par projet et fichiers.</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="px-4 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">upload</span>
          Importer
        </button>
      </div>

      {/* Quota */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">cloud</span>
            <p className="text-sm font-bold text-white">Espace de stockage</p>
          </div>
          <p className="text-xs text-slate-400">{USED_MB} MB / {QUOTA_GB} GB</p>
        </div>
        <div className="h-3 bg-border-dark rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.max(USED_PCT, 0.5)}%` }} />
        </div>
        <p className="text-[10px] text-slate-500 mt-2">{(QUOTA_GB * 1024 - USED_MB).toFixed(0)} MB restants sur votre plan Agence</p>
      </div>

      {/* Search + view toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un fichier ou un projet..." className="w-full pl-10 pr-4 py-2.5 bg-neutral-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50" />
        </div>
        <div className="flex bg-neutral-dark border border-border-dark rounded-lg overflow-hidden">
          <button onClick={() => setView("grid")} className={cn("p-2.5 transition-colors", view === "grid" ? "bg-primary text-background-dark" : "text-slate-400 hover:text-white")}>
            <span className="material-symbols-outlined text-lg">grid_view</span>
          </button>
          <button onClick={() => setView("list")} className={cn("p-2.5 transition-colors", view === "list" ? "bg-primary text-background-dark" : "text-slate-400 hover:text-white")}>
            <span className="material-symbols-outlined text-lg">view_list</span>
          </button>
        </div>
      </div>

      {/* Folders section */}
      {folders.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Dossiers</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {folders.map(f => (
              <button key={f.id} className="bg-neutral-dark rounded-xl border border-border-dark p-4 hover:border-primary/50 transition-colors text-left group">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-2xl text-amber-500">folder</span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{f.name}</p>
                    {f.project && <p className="text-[10px] text-primary truncate">{f.project}</p>}
                  </div>
                </div>
                <p className="text-[10px] text-slate-500">{new Date(f.date).toLocaleDateString("fr-FR")}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Files */}
      {otherFiles.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Fichiers</p>
          {view === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {otherFiles.map(f => (
                <div key={f.id} className="bg-neutral-dark rounded-xl border border-border-dark p-4 hover:border-primary/50 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-center h-14 mb-3">
                    <span className={cn("material-symbols-outlined text-4xl", TYPE_ICONS[f.type]?.color)}>{TYPE_ICONS[f.type]?.icon}</span>
                  </div>
                  <p className="text-sm font-semibold text-white truncate">{f.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-slate-500">{f.size || "—"}</p>
                    <p className="text-[10px] text-slate-500">{new Date(f.date).toLocaleDateString("fr-FR")}</p>
                  </div>
                  {f.uploader && <p className="text-[10px] text-slate-400 mt-1">par {f.uploader}</p>}
                  {f.project && <p className="text-[10px] text-primary mt-0.5 truncate">{f.project}</p>}
                  <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => addToast("info", `Téléchargement de ${f.name}`)} className="p-1 text-slate-500 hover:text-primary"><span className="material-symbols-outlined text-sm">download</span></button>
                    <button onClick={() => { setFiles(prev => prev.filter(fi => fi.id !== f.id)); addToast("success", "Fichier supprimé"); }} className="p-1 text-slate-500 hover:text-red-400"><span className="material-symbols-outlined text-sm">delete</span></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-border-dark">
                    <th className="px-5 py-3 text-left font-semibold">Nom</th>
                    <th className="px-5 py-3 text-left font-semibold">Projet</th>
                    <th className="px-5 py-3 text-left font-semibold">Uploadé par</th>
                    <th className="px-5 py-3 text-center font-semibold">Taille</th>
                    <th className="px-5 py-3 text-left font-semibold">Date</th>
                    <th className="px-5 py-3 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {otherFiles.map(f => (
                    <tr key={f.id} className="border-b border-border-dark/50 hover:bg-background-dark/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span className={cn("material-symbols-outlined text-lg", TYPE_ICONS[f.type]?.color)}>{TYPE_ICONS[f.type]?.icon}</span>
                          <span className="text-sm font-semibold text-white">{f.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-400">{f.project || "—"}</td>
                      <td className="px-5 py-3 text-sm text-slate-400">{f.uploader || "—"}</td>
                      <td className="px-5 py-3 text-sm text-slate-400 text-center">{f.size || "—"}</td>
                      <td className="px-5 py-3 text-sm text-slate-500">{new Date(f.date).toLocaleDateString("fr-FR")}</td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex justify-center gap-1">
                          <button onClick={() => addToast("info", `Téléchargement de ${f.name}`)} className="p-1.5 text-slate-500 hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"><span className="material-symbols-outlined text-lg">download</span></button>
                          <button onClick={() => { setFiles(prev => prev.filter(fi => fi.id !== f.id)); addToast("success", "Fichier supprimé"); }} className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"><span className="material-symbols-outlined text-lg">delete</span></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {otherFiles.length === 0 && <p className="text-center text-slate-500 py-8">Aucun fichier trouvé</p>}
            </div>
          )}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-5xl text-slate-600 mb-3 block">search_off</span>
          <p className="text-slate-400">Aucun résultat pour &quot;{search}&quot;</p>
        </div>
      )}

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowUpload(false)} />
          <div className="relative bg-neutral-dark rounded-2xl border border-border-dark p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">Importer des fichiers</h3>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border-dark rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-4xl text-slate-500 mb-2 block">cloud_upload</span>
                <p className="text-sm text-slate-400">Glissez vos fichiers ici ou <span className="text-primary font-semibold">parcourez</span></p>
                <p className="text-[10px] text-slate-500 mt-1">PDF, images, vidéos, documents — max 100 MB par fichier</p>
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Dossier de destination</label>
                <select className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-xl text-sm text-white outline-none focus:border-primary/50">
                  <option>Racine</option>
                  <option>Projet E-commerce</option>
                  <option>Maquettes App Mobile</option>
                  <option>Assets Marketing</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowUpload(false)} className="flex-1 py-2.5 text-slate-400 text-sm font-semibold hover:text-white transition-colors">Annuler</button>
                <button onClick={() => { addToast("success", "Fichiers importés avec succès"); setShowUpload(false); }} className="flex-1 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all">Importer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
