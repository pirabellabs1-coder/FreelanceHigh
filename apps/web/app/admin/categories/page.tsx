"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "1", name: "Developpement Web", icon: "code", subcategories: ["Frontend", "Backend", "Fullstack", "WordPress", "E-commerce"], services: 2450, order: 1 },
  { id: "2", name: "Design UI/UX", icon: "palette", subcategories: ["Web Design", "Mobile Design", "Logo", "Branding", "Illustration"], services: 1890, order: 2 },
  { id: "3", name: "Marketing Digital", icon: "campaign", subcategories: ["SEO", "Google Ads", "Social Media", "Email Marketing", "Content"], services: 1560, order: 3 },
  { id: "4", name: "Redaction", icon: "edit_note", subcategories: ["Copywriting", "Articles SEO", "Contenu web", "Technique"], services: 980, order: 4 },
  { id: "5", name: "Traduction", icon: "translate", subcategories: ["FR-EN", "FR-AR", "Localisation", "Sous-titrage"], services: 650, order: 5 },
  { id: "6", name: "Video & Animation", icon: "videocam", subcategories: ["Montage", "Motion Design", "Animation 2D/3D", "Whiteboard"], services: 780, order: 6 },
  { id: "7", name: "IA & Data", icon: "psychology", subcategories: ["Machine Learning", "NLP", "Data Analysis", "Chatbots"], services: 420, order: 7 },
  { id: "8", name: "Mobile", icon: "smartphone", subcategories: ["iOS", "Android", "React Native", "Flutter"], services: 890, order: 8 },
  { id: "9", name: "SEO", icon: "search", subcategories: ["Audit", "On-page", "Off-page", "Technique", "Local"], services: 1120, order: 9 },
  { id: "10", name: "Cybersecurite", icon: "security", subcategories: ["Pentest", "Audit", "Conseil", "Formation"], services: 340, order: 10 },
];

const POPULAR_TAGS = ["react", "wordpress", "python", "figma", "seo", "node.js", "typescript", "photoshop", "mobile", "flutter", "next.js", "vue.js", "tailwind", "django", "shopify", "marketing", "copywriting", "logo", "branding", "devops"];

export default function AdminCategories() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const { addToast } = useToastStore();

  function toggle(id: string) {
    setExpanded(prev => {
      const n = new Set(prev);
      if (n.has(id)) {
        n.delete(id);
      } else {
        n.add(id);
      }
      return n;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">category</span>
          Categories &amp; Tags
        </h1>
        <button
          onClick={() => addToast("info", "Ajout de categorie bientot disponible")}
          className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nouvelle categorie
        </button>
      </div>

      {/* Categories tree */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark">
        <div className="p-5 border-b border-border-dark">
          <h2 className="font-bold text-white">Categories ({CATEGORIES.length})</h2>
        </div>
        <div className="divide-y divide-border-dark">
          {CATEGORIES.map(c => (
            <div key={c.id}>
              <button
                onClick={() => toggle(c.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-red-500/5 transition-colors text-left"
              >
                <span className={cn("material-symbols-outlined text-sm text-slate-400 transition-transform", expanded.has(c.id) && "rotate-90")}>chevron_right</span>
                <span className="material-symbols-outlined text-primary">{c.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-white">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.subcategories.length} sous-categories &middot; {c.services} services</p>
                </div>
                <span className="text-xs text-slate-500">#{c.order}</span>
                <button
                  onClick={e => { e.stopPropagation(); addToast("info", "Modification de categorie"); }}
                  className="p-1 text-slate-400 hover:text-primary"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
              </button>
              {expanded.has(c.id) && (
                <div className="bg-background-dark/50 px-5 py-3 pl-16">
                  <div className="flex flex-wrap gap-2">
                    {c.subcategories.map(sub => (
                      <span key={sub} className="inline-flex items-center gap-1 text-xs text-slate-300 bg-neutral-dark px-3 py-1.5 rounded-lg border border-border-dark">
                        {sub}
                        <button
                          onClick={() => addToast("info", "Sous-categorie modifiee")}
                          className="text-slate-400 hover:text-primary"
                        >
                          <span className="material-symbols-outlined text-xs">edit</span>
                        </button>
                      </span>
                    ))}
                    <button
                      onClick={() => addToast("info", "Ajout sous-categorie")}
                      className="text-xs text-primary hover:underline font-semibold"
                    >
                      + Ajouter
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="bg-neutral-dark rounded-xl border border-border-dark p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white">Tags populaires</h2>
          <button
            onClick={() => addToast("info", "Ajout de tag")}
            className="text-sm text-primary font-semibold hover:underline"
          >
            + Ajouter un tag
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TAGS.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-full font-medium">
              #{tag}
              <button
                onClick={() => addToast("info", `Tag "${tag}" modifie`)}
                className="hover:text-red-300"
              >
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
