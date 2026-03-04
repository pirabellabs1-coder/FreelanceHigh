"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ============================================================
// Page Component
// ============================================================

type SideTab = "infos" | "tarification" | "seo" | "galerie";

const MAX_TITLE = 70;
const MAX_DESC = 160;

export default function SeoPage() {
  const [sideTab, setSideTab] = useState<SideTab>("seo");
  const [metaTitle, setMetaTitle] = useState(
    "Je vais creer un logo minimaliste et moderne pour votre entreprise"
  );
  const [metaDesc, setMetaDesc] = useState(
    "Besoin d'une identite visuelle forte ? Je concois des logos uniques, minimalistes et professionnels adaptes a votre marque en 24h. Plus de 500 clients satisfaits en Afrique."
  );
  const [keywords, setKeywords] = useState(["Logo Design", "Minimaliste", "Identite Visuelle"]);
  const [newKeyword, setNewKeyword] = useState("");

  const addKeyword = useCallback(() => {
    const kw = newKeyword.trim();
    if (kw && keywords.length < 5 && !keywords.includes(kw)) {
      setKeywords((prev) => [...prev, kw]);
      setNewKeyword("");
    }
  }, [newKeyword, keywords]);

  const removeKeyword = useCallback((kw: string) => {
    setKeywords((prev) => prev.filter((k) => k !== kw));
  }, []);

  const sideItems: { key: SideTab; icon: string; label: string }[] = [
    { key: "infos", icon: "edit_note", label: "Informations generales" },
    { key: "tarification", icon: "payments", label: "Tarification" },
    { key: "seo", icon: "search_check", label: "SEO & Visibilite" },
    { key: "galerie", icon: "collections", label: "Galerie" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-0 min-h-[calc(100vh-80px)]">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 p-6 border-r border-border-dark shrink-0">
        <div className="sticky top-24">
          <div className="flex items-center gap-2 mb-8">
            <Link
              href="/dashboard/services"
              className="text-slate-500 hover:text-primary flex items-center gap-1 text-sm"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Retour au service
            </Link>
          </div>
          <h3 className="text-lg font-bold mb-6">Parametres Service</h3>
          <nav className="space-y-1">
            {sideItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setSideTab(item.key)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium w-full text-left transition-colors",
                  sideTab === item.key
                    ? "bg-primary/10 text-primary"
                    : "text-slate-500 hover:bg-primary/10"
                )}
              >
                <span className="material-symbols-outlined">{item.icon}</span>{" "}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold mb-2">Optimisation SEO</h1>
            <p className="text-slate-500 dark:text-slate-400">
              Ameliorez le classement de votre service sur Google et dans les recherches
              internes de la plateforme.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10">
            {/* SEO Form */}
            <div className="bg-primary/5 rounded-xl border border-primary/10 p-8">
              <div className="space-y-8">
                {/* Meta Title */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Meta Titre SEO
                    <span className="text-xs font-normal text-slate-400 ml-2">
                      (60-70 caracteres recommandes)
                    </span>
                  </label>
                  <input
                    className="w-full bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Ex: Expert en Design de Logo Minimaliste et Moderne"
                  />
                  <div className="flex justify-between mt-1">
                    <p className="text-[10px] text-slate-400">
                      Le titre qui apparaitra dans les resultats de recherche.
                    </p>
                    <span
                      className={cn(
                        "text-[10px] font-bold",
                        metaTitle.length > MAX_TITLE ? "text-red-400" : "text-primary"
                      )}
                    >
                      {metaTitle.length} / {MAX_TITLE}
                    </span>
                  </div>
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Meta Description SEO
                    <span className="text-xs font-normal text-slate-400 ml-2">
                      (150-160 caracteres recommandes)
                    </span>
                  </label>
                  <textarea
                    className="w-full bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                    rows={4}
                    value={metaDesc}
                    onChange={(e) => setMetaDesc(e.target.value)}
                    placeholder="Decrivez votre service pour les moteurs de recherche..."
                  />
                  <div className="flex justify-between mt-1">
                    <p className="text-[10px] text-slate-400">
                      Un resume accrocheur pour inciter les clients a cliquer.
                    </p>
                    <span
                      className={cn(
                        "text-[10px] font-bold",
                        metaDesc.length > MAX_DESC ? "text-red-400" : "text-primary"
                      )}
                    >
                      {metaDesc.length} / {MAX_DESC}
                    </span>
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Mots-cles personnalises (Tags)
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    {keywords.map((kw) => (
                      <span
                        key={kw}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold"
                      >
                        {kw}
                        <button
                          onClick={() => removeKeyword(kw)}
                          className="material-symbols-outlined text-xs hover:text-red-400"
                        >
                          close
                        </button>
                      </span>
                    ))}
                    {keywords.length < 5 && (
                      <input
                        className="flex-1 bg-transparent border-none p-0 text-sm focus:ring-0 placeholder:text-slate-400 outline-none min-w-[120px]"
                        placeholder="Ajouter un mot-cle..."
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            addKeyword();
                          }
                        }}
                      />
                    )}
                  </div>
                  <p className="mt-2 text-[10px] text-slate-400">
                    Separez les mots-cles par une virgule ou appuyez sur Entree. (Max 5)
                  </p>
                </div>
              </div>
            </div>

            {/* Google Preview */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">visibility</span>
                Apercu du resultat Google
              </h3>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="size-6 bg-slate-800 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[12px] text-slate-400">
                        public
                      </span>
                    </div>
                    <div className="text-[12px] text-slate-400 truncate">
                      freelancehigh.com &rsaquo; services &rsaquo; design-logo
                    </div>
                  </div>
                  <h4 className="text-[20px] text-[#8ab4f8] hover:underline cursor-pointer font-medium leading-tight mb-1">
                    {metaTitle || "Titre du service"}
                  </h4>
                  <p className="text-[14px] text-slate-300 leading-normal">
                    <span className="text-slate-500 font-bold">Note : 4.9 · 124 avis</span>{" "}
                    &mdash; {metaDesc || "Description du service..."}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 border-t border-primary/10 pt-8">
              <Link
                href="/dashboard/services"
                className="px-6 py-2.5 rounded-lg text-sm font-bold border border-primary/20 hover:bg-primary/5"
              >
                Annuler
              </Link>
              <button className="px-8 py-2.5 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20">
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
