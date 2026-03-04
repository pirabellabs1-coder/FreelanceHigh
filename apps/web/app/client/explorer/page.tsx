"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Demo Data                                                           */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  { key: "tous", label: "Tous", icon: "apps" },
  { key: "dev", label: "Développement", icon: "code" },
  { key: "design", label: "Design", icon: "palette" },
  { key: "marketing", label: "Marketing", icon: "campaign" },
  { key: "redaction", label: "Rédaction", icon: "edit_note" },
  { key: "video", label: "Vidéo", icon: "videocam" },
  { key: "data", label: "Data & IA", icon: "psychology" },
];

const SERVICES = [
  { id: "s1", title: "Développement d\u2019application React / Next.js", seller: "Amadou Diallo", sellerType: "freelance" as const, avatar: "AD", rating: 4.9, reviews: 127, price: 1500, delivery: "14 jours", category: "dev", tags: ["React", "Next.js", "TypeScript"], featured: true },
  { id: "s2", title: "Design UI/UX mobile-first", seller: "TechCorp Agency", sellerType: "agence" as const, avatar: "TC", rating: 4.8, reviews: 89, price: 2200, delivery: "10 jours", category: "design", tags: ["Figma", "UI/UX", "Mobile"], featured: true },
  { id: "s3", title: "Campagne publicitaire Facebook & Instagram", seller: "Fatou Sow", sellerType: "freelance" as const, avatar: "FS", rating: 4.7, reviews: 65, price: 800, delivery: "7 jours", category: "marketing", tags: ["Meta Ads", "Social Media", "ROI"] },
  { id: "s4", title: "Logo & identité visuelle complète", seller: "Ibrahim Koné", sellerType: "freelance" as const, avatar: "IK", rating: 5.0, reviews: 42, price: 600, delivery: "5 jours", category: "design", tags: ["Illustrator", "Branding", "Logo"] },
  { id: "s5", title: "Rédaction SEO 10 articles optimisés", seller: "Marie Dupont", sellerType: "freelance" as const, avatar: "MD", rating: 4.6, reviews: 38, price: 450, delivery: "12 jours", category: "redaction", tags: ["SEO", "Copywriting", "Français"] },
  { id: "s6", title: "API Backend & Intégration (Node.js / Python)", seller: "WebPro Agency", sellerType: "agence" as const, avatar: "WP", rating: 4.9, reviews: 104, price: 3500, delivery: "21 jours", category: "dev", tags: ["Node.js", "Python", "API REST"] },
  { id: "s7", title: "Montage vidéo professionnel & motion design", seller: "Ousmane Ba", sellerType: "freelance" as const, avatar: "OB", rating: 4.8, reviews: 56, price: 700, delivery: "7 jours", category: "video", tags: ["Premiere Pro", "After Effects", "Motion"] },
  { id: "s8", title: "Dashboard analytics & data visualisation", seller: "DataForge Agency", sellerType: "agence" as const, avatar: "DF", rating: 4.7, reviews: 31, price: 2800, delivery: "15 jours", category: "data", tags: ["Python", "Tableau", "SQL", "IA"] },
  { id: "s9", title: "Application mobile Flutter cross-platform", seller: "Kofi Mensah", sellerType: "freelance" as const, avatar: "KM", rating: 4.9, reviews: 73, price: 2000, delivery: "20 jours", category: "dev", tags: ["Flutter", "Dart", "Firebase"] },
  { id: "s10", title: "Stratégie marketing digital complète", seller: "GrowthLab Agency", sellerType: "agence" as const, avatar: "GL", rating: 4.6, reviews: 47, price: 1800, delivery: "14 jours", category: "marketing", tags: ["SEO", "SEA", "Social Media", "Email"] },
  { id: "s11", title: "Traduction FR/EN professionnelle", seller: "Aïssatou Diop", sellerType: "freelance" as const, avatar: "AD", rating: 4.8, reviews: 92, price: 300, delivery: "3 jours", category: "redaction", tags: ["Traduction", "FR", "EN"] },
  { id: "s12", title: "Site WordPress e-commerce clé en main", seller: "Moussa Traoré", sellerType: "freelance" as const, avatar: "MT", rating: 4.5, reviews: 58, price: 1200, delivery: "10 jours", category: "dev", tags: ["WordPress", "WooCommerce", "PHP"] },
];

const FREELANCERS = [
  { id: "f1", name: "Amadou Diallo", title: "Développeur Full-Stack Senior", avatar: "AD", rating: 4.9, reviews: 127, hourly: 85, country: "Sénégal", flag: "🇸🇳", skills: ["React", "Node.js", "TypeScript"], available: true, verified: true, topRated: true },
  { id: "f2", name: "Fatou Sow", title: "Spécialiste Marketing Digital", avatar: "FS", rating: 4.7, reviews: 65, hourly: 60, country: "Côte d\u2019Ivoire", flag: "🇨🇮", skills: ["Meta Ads", "Google Ads", "SEO"], available: true, verified: true },
  { id: "f3", name: "Ibrahim Koné", title: "Designer UI/UX & Branding", avatar: "IK", rating: 5.0, reviews: 42, hourly: 70, country: "France", flag: "🇫🇷", skills: ["Figma", "Illustrator", "UI/UX"], available: false, verified: true, topRated: true },
  { id: "f4", name: "Kofi Mensah", title: "Développeur Mobile Flutter", avatar: "KM", rating: 4.9, reviews: 73, hourly: 75, country: "Cameroun", flag: "🇨🇲", skills: ["Flutter", "Dart", "Firebase"], available: true, verified: true },
  { id: "f5", name: "Aïssatou Diop", title: "Rédactrice & Traductrice", avatar: "AD", rating: 4.8, reviews: 92, hourly: 45, country: "Sénégal", flag: "🇸🇳", skills: ["Rédaction SEO", "Traduction", "Copywriting"], available: true, verified: true },
  { id: "f6", name: "Ousmane Ba", title: "Vidéaste & Motion Designer", avatar: "OB", rating: 4.8, reviews: 56, hourly: 55, country: "Mali", flag: "🇲🇱", skills: ["Premiere Pro", "After Effects", "DaVinci"], available: true, verified: false },
];

const AGENCIES = [
  { id: "a1", name: "TechCorp Agency", desc: "Agence de développement digital full-service", avatar: "TC", rating: 4.8, reviews: 89, members: 12, country: "Sénégal", flag: "🇸🇳", specialities: ["Dev Web", "Mobile", "UI/UX"], verified: true, premium: true },
  { id: "a2", name: "WebPro Agency", desc: "Expert backend et intégration API", avatar: "WP", rating: 4.9, reviews: 104, members: 8, country: "France", flag: "🇫🇷", specialities: ["Backend", "API", "DevOps"], verified: true },
  { id: "a3", name: "DataForge Agency", desc: "Data science et solutions IA", avatar: "DF", rating: 4.7, reviews: 31, members: 6, country: "Côte d\u2019Ivoire", flag: "🇨🇮", specialities: ["Data", "IA", "Analytics"], verified: true },
  { id: "a4", name: "GrowthLab Agency", desc: "Marketing digital et croissance", avatar: "GL", rating: 4.6, reviews: 47, members: 10, country: "Cameroun", flag: "🇨🇲", specialities: ["SEO", "SEA", "Social Media"], verified: false },
];

type ViewType = "services" | "freelances" | "agences";

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function ClientExplorer() {
  const [view, setView] = useState<ViewType>("services");
  const [category, setCategory] = useState("tous");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("pertinence");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [contactModal, setContactModal] = useState<string | null>(null);
  const [proposalModal, setProposalModal] = useState<string | null>(null);
  const [proposalForm, setProposalForm] = useState({ title: "", description: "", budget: "", deadline: "" });

  const filteredServices = useMemo(() => {
    let list = SERVICES;
    if (category !== "tous") list = list.filter(s => s.category === category);
    if (search) list = list.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));
    list = list.filter(s => s.price >= priceRange[0] && s.price <= priceRange[1]);
    if (sortBy === "prix-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "prix-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "note") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sortBy === "populaire") list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [category, search, sortBy, priceRange]);

  const filteredFreelancers = useMemo(() => {
    if (!search) return FREELANCERS;
    return FREELANCERS.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.skills.some(s => s.toLowerCase().includes(search.toLowerCase())));
  }, [search]);

  const filteredAgencies = useMemo(() => {
    if (!search) return AGENCIES;
    return AGENCIES.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.specialities.some(s => s.toLowerCase().includes(search.toLowerCase())));
  }, [search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">Explorer</h1>
        <p className="text-slate-400 text-sm mt-1">Trouvez les meilleurs services, freelances et agences pour vos projets.</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">search</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un service, un freelance, une agence ou une compétence..."
          className="w-full pl-12 pr-4 py-3.5 bg-neutral-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}
      </div>

      {/* View Tabs + Sort */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 bg-neutral-dark border border-border-dark rounded-xl p-1">
          {([
            { key: "services", label: "Services", icon: "work", count: filteredServices.length },
            { key: "freelances", label: "Freelances", icon: "person", count: filteredFreelancers.length },
            { key: "agences", label: "Agences", icon: "apartment", count: filteredAgencies.length },
          ] as { key: ViewType; label: string; icon: string; count: number }[]).map(v => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                view === v.key ? "bg-primary text-background-dark" : "text-slate-400 hover:text-white"
              )}
            >
              <span className="material-symbols-outlined text-lg">{v.icon}</span>
              {v.label}
              <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-bold", view === v.key ? "bg-background-dark/20 text-background-dark" : "bg-border-dark text-slate-500")}>{v.count}</span>
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-3 py-2 bg-neutral-dark border border-border-dark rounded-lg text-sm text-white outline-none"
        >
          <option value="pertinence">Pertinence</option>
          <option value="prix-asc">Prix croissant</option>
          <option value="prix-desc">Prix décroissant</option>
          <option value="note">Meilleure note</option>
          <option value="populaire">Plus populaire</option>
        </select>
      </div>

      {/* Category filter (services view only) */}
      {view === "services" && (
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                category === c.key ? "bg-primary/10 text-primary border border-primary/30" : "bg-neutral-dark text-slate-400 border border-border-dark hover:text-white"
              )}
            >
              <span className="material-symbols-outlined text-base">{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>
      )}

      {/* ===== SERVICES VIEW ===== */}
      {view === "services" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredServices.map(s => (
            <div key={s.id} className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden hover:border-primary/40 transition-all group">
              {/* Service header */}
              <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                <span className="material-symbols-outlined text-5xl text-primary/30">
                  {s.category === "dev" ? "code" : s.category === "design" ? "palette" : s.category === "marketing" ? "campaign" : s.category === "redaction" ? "edit_note" : s.category === "video" ? "videocam" : "psychology"}
                </span>
                {s.featured && (
                  <span className="absolute top-3 left-3 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">star</span> Vedette
                  </span>
                )}
                {s.sellerType === "agence" && (
                  <span className="absolute top-3 right-3 bg-primary/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">Agence</span>
                )}
              </div>
              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-white text-sm group-hover:text-primary transition-colors line-clamp-2 mb-2">{s.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">{s.avatar}</div>
                  <span className="text-xs text-slate-400">{s.seller}</span>
                  <div className="flex items-center gap-0.5 ml-auto">
                    <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
                    <span className="text-xs font-bold text-white">{s.rating}</span>
                    <span className="text-[10px] text-slate-500">({s.reviews})</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {s.tags.slice(0, 3).map(t => (
                    <span key={t} className="text-[10px] bg-border-dark text-slate-400 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border-dark">
                  <div>
                    <p className="text-[10px] text-slate-500">À partir de</p>
                    <p className="text-lg font-black text-primary">€{s.price.toLocaleString("fr-FR")}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setContactModal(s.seller)}
                      className="px-3 py-2 bg-border-dark text-slate-300 text-xs font-semibold rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      Contacter
                    </button>
                    <button className="px-3 py-2 bg-primary text-background-dark text-xs font-bold rounded-lg hover:brightness-110 transition-all">
                      Commander
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredServices.length === 0 && (
            <div className="col-span-full text-center py-16">
              <span className="material-symbols-outlined text-5xl text-slate-600 mb-3">search_off</span>
              <p className="text-slate-400">Aucun service trouvé pour ces critères.</p>
            </div>
          )}
        </div>
      )}

      {/* ===== FREELANCES VIEW ===== */}
      {view === "freelances" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFreelancers.map(f => (
            <div key={f.id} className="bg-neutral-dark rounded-xl border border-border-dark p-5 hover:border-primary/40 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">{f.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-white">{f.name}</h3>
                    {f.verified && <span className="material-symbols-outlined text-blue-400 text-base">verified</span>}
                    {f.topRated && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-xs">star</span> Top Rated
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-0.5">{f.title}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                    <span>{f.flag} {f.country}</span>
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-amber-400 text-xs">star</span>
                      <span className="font-bold text-white">{f.rating}</span> ({f.reviews})
                    </span>
                    <span className="font-bold text-white">€{f.hourly}/h</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {f.skills.map(s => (
                      <span key={s} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border-dark">
                <span className={cn("flex items-center gap-1.5 text-xs font-semibold", f.available ? "text-emerald-400" : "text-slate-500")}>
                  <span className={cn("w-2 h-2 rounded-full", f.available ? "bg-emerald-400" : "bg-slate-500")} />
                  {f.available ? "Disponible" : "Occupé"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setContactModal(f.name)}
                    className="px-3 py-1.5 bg-border-dark text-slate-300 text-xs font-semibold rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    Contacter
                  </button>
                  <button
                    onClick={() => setProposalModal(f.name)}
                    className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    Proposition
                  </button>
                  <button className="px-3 py-1.5 bg-primary text-background-dark text-xs font-bold rounded-lg hover:brightness-110 transition-all">
                    Voir profil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== AGENCIES VIEW ===== */}
      {view === "agences" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAgencies.map(a => (
            <div key={a.id} className="bg-neutral-dark rounded-xl border border-border-dark p-5 hover:border-primary/40 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">{a.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-white">{a.name}</h3>
                    {a.verified && <span className="material-symbols-outlined text-blue-400 text-base">verified</span>}
                    {a.premium && (
                      <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-bold">Premium</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-0.5">{a.desc}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                    <span>{a.flag} {a.country}</span>
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-amber-400 text-xs">star</span>
                      <span className="font-bold text-white">{a.rating}</span> ({a.reviews})
                    </span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">group</span>{a.members} membres</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {a.specialities.map(s => (
                      <span key={s} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border-dark">
                <button
                  onClick={() => setContactModal(a.name)}
                  className="px-3 py-1.5 bg-border-dark text-slate-300 text-xs font-semibold rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  Contacter
                </button>
                <button
                  onClick={() => setProposalModal(a.name)}
                  className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors"
                >
                  Demander un devis
                </button>
                <button className="px-3 py-1.5 bg-primary text-background-dark text-xs font-bold rounded-lg hover:brightness-110 transition-all">
                  Voir agence
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== CONTACT MODAL ===== */}
      {contactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setContactModal(null)}>
          <div className="bg-neutral-dark rounded-xl border border-border-dark p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-lg">Contacter {contactModal}</h3>
              <button onClick={() => setContactModal(null)} className="text-slate-400 hover:text-white"><span className="material-symbols-outlined">close</span></button>
            </div>
            <textarea
              rows={4}
              placeholder="Bonjour, je suis intéressé par vos services. Pouvez-vous me donner plus de détails sur..."
              className="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setContactModal(null)} className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white">Annuler</button>
              <button onClick={() => setContactModal(null)} className="px-5 py-2 bg-primary text-background-dark text-sm font-bold rounded-lg hover:brightness-110 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">send</span>
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== PROPOSAL MODAL ===== */}
      {proposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setProposalModal(null)}>
          <div className="bg-neutral-dark rounded-xl border border-border-dark p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-lg">Proposition à {proposalModal}</h3>
              <button onClick={() => setProposalModal(null)} className="text-slate-400 hover:text-white"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-1.5">Titre du projet</label>
                <input
                  value={proposalForm.title}
                  onChange={e => setProposalForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Ex: Refonte de notre site e-commerce"
                  className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-lg text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-1.5">Description du besoin</label>
                <textarea
                  value={proposalForm.description}
                  onChange={e => setProposalForm(p => ({ ...p, description: e.target.value }))}
                  rows={4}
                  placeholder="Décrivez précisément ce que vous recherchez, les fonctionnalités attendues, le contexte..."
                  className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-lg text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-white mb-1.5">Budget estimé</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">€</span>
                    <input
                      type="number"
                      value={proposalForm.budget}
                      onChange={e => setProposalForm(p => ({ ...p, budget: e.target.value }))}
                      placeholder="1500"
                      className="w-full pl-7 pr-4 py-2.5 bg-background-dark border border-border-dark rounded-lg text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-1.5">Deadline</label>
                  <input
                    type="date"
                    value={proposalForm.deadline}
                    onChange={e => setProposalForm(p => ({ ...p, deadline: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-lg text-sm text-white outline-none focus:border-primary/50"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setProposalModal(null)} className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white">Annuler</button>
              <button onClick={() => { setProposalModal(null); setProposalForm({ title: "", description: "", budget: "", deadline: "" }); }} className="px-5 py-2 bg-primary text-background-dark text-sm font-bold rounded-lg hover:brightness-110 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">send</span>
                Envoyer la proposition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
