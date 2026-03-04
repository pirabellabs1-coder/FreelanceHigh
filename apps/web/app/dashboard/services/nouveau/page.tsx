"use client";

import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDashboardStore, useToastStore } from "@/store/dashboard";

const CATEGORIES: Record<string, string[]> = {
  "Developpement Web": ["Frontend", "Backend", "Full-Stack", "E-commerce", "CMS", "SaaS"],
  "Application Mobile": ["iOS", "Android", "React Native", "Flutter", "PWA"],
  "Design UI/UX": ["Web Design", "App Design", "Prototype", "Design System", "Wireframes"],
  "Identite Visuelle": ["Logo", "Charte graphique", "Branding", "Packaging", "Print"],
  "Redaction & SEO": ["Redaction web", "Articles blog", "Copywriting", "SEO technique", "Traduction"],
  "Community Management": ["Reseaux sociaux", "Strategie social media", "Publicite", "Influence"],
  "Video & Montage": ["Montage", "Motion design", "Animation", "Pub video", "YouTube"],
  "Motion Design": ["Animation 2D", "Animation 3D", "Intro/Outro", "Explainer video"],
  "Conseil Strategique": ["Consulting IT", "Strategie digitale", "Audit", "Formation"],
  "Traduction": ["Francais-Anglais", "Francais-Arabe", "Localisation", "Sous-titrage"],
  "Support IT": ["Administration systeme", "DevOps", "Cloud", "Securite"],
  "E-commerce": ["Shopify", "WooCommerce", "PrestaShop", "Marketplace"],
  "Formation": ["Developpement", "Design", "Marketing", "Business"],
};

const TAGS_SUGGESTIONS = [
  "React", "Next.js", "TypeScript", "Node.js", "Python", "Figma", "Tailwind CSS",
  "WordPress", "Shopify", "Photoshop", "Illustrator", "PostgreSQL", "MongoDB",
  "Vue.js", "Docker", "AWS", "Stripe", "SEO", "UI/UX",
];

const STEPS = [
  { label: "Informations", subtitle: "Titre & Description", icon: "edit_note" },
  { label: "Forfaits", subtitle: "Tarifs & Delais", icon: "payments" },
  { label: "Extras & FAQ", subtitle: "Options additionnelles", icon: "quiz" },
  { label: "Galerie", subtitle: "Medias & Publication", icon: "photo_library" },
];

const EXPERT_TIPS: Record<number, { title: string; content: string }> = {
  0: {
    title: "Conseil d'expert",
    content: "Un titre clair et precis attire 3x plus de freelances qualifies. Evitez les titres vagues comme \"Besoin d'aide\".",
  },
  1: {
    title: "Optimisez vos forfaits",
    content: "Les services avec 3 forfaits bien differencies obtiennent 40% de commandes en plus. Le forfait Standard est choisi dans 65% des cas.",
  },
  2: {
    title: "FAQ strategique",
    content: "Les services avec au moins 3 FAQ ont un taux de conversion 25% superieur. Repondez aux objections courantes.",
  },
  3: {
    title: "L'image fait la difference",
    content: "Les services avec une galerie de 3+ images recoivent en moyenne 35% de commandes en plus. Montrez vos realisations !",
  },
};

type PackageData = { name: string; price: number; delivery: number; revisions: number; description: string };
type ExtraData = { label: string; price: number };

type FormData = {
  title: string;
  category: string;
  subcategory: string;
  description: string;
  tags: string[];
  image: string;
  packages: { basic: PackageData; standard: PackageData; premium: PackageData };
  faq: { question: string; answer: string }[];
  extras: ExtraData[];
};

const INITIAL: FormData = {
  title: "", category: "", subcategory: "", description: "", tags: [], image: "",
  packages: {
    basic: { name: "Basique", price: 50, delivery: 5, revisions: 1, description: "" },
    standard: { name: "Standard", price: 100, delivery: 3, revisions: 3, description: "" },
    premium: { name: "Premium", price: 200, delivery: 2, revisions: 5, description: "" },
  },
  faq: [],
  extras: [],
};

export default function NouveauServicePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span></div>}>
      <NouveauServiceContent />
    </Suspense>
  );
}

function NouveauServiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { services, addService, updateService } = useDashboardStore();
  const addToast = useToastStore((s) => s.addToast);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [published, setPublished] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [faqQ, setFaqQ] = useState("");
  const [faqA, setFaqA] = useState("");
  const [extraLabel, setExtraLabel] = useState("");
  const [extraPrice, setExtraPrice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [mediaFiles, setMediaFiles] = useState<{ name: string; url: string }[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const subcategories = useMemo(
    () => (form.category && CATEGORIES[form.category]) || [],
    [form.category]
  );

  const progressPercent = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  useEffect(() => {
    if (editId) {
      const existing = services.find((s) => s.id === editId);
      if (existing) {
        setForm({
          title: existing.title,
          category: existing.category,
          subcategory: existing.subcategory,
          description: existing.description,
          tags: existing.tags,
          image: existing.image,
          packages: existing.packages,
          faq: existing.faq,
          extras: existing.extras || [],
        });
        if (existing.image) {
          setMediaFiles([{ name: "image-existante", url: existing.image }]);
        }
      }
    }
  }, [editId, services]);

  function validateStep(): boolean {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.title.trim()) e.title = "Le titre est requis";
      else if (form.title.trim().length < 10) e.title = "Le titre doit faire au moins 10 caracteres";
      else if (form.title.length > 80) e.title = "80 caracteres maximum";
      if (!form.category) e.category = "La categorie est requise";
      if (!form.description.trim()) e.description = "La description est requise";
      else if (form.description.trim().length < 50) e.description = "La description doit faire au moins 50 caracteres";
    }
    if (step === 1) {
      if (form.packages.basic.price <= 0) e.basicPrice = "Le prix doit etre positif";
      if (!form.packages.basic.description.trim()) e.basicDesc = "La description du forfait Basique est requise";
      if (form.packages.standard.price <= form.packages.basic.price) e.standardPrice = "Le prix Standard doit etre superieur au Basique";
      if (form.packages.premium.price <= form.packages.standard.price) e.premiumPrice = "Le prix Premium doit etre superieur au Standard";
    }
    setErrors(e);
    if (Object.keys(e).length > 0) {
      addToast("error", "Veuillez corriger les erreurs du formulaire");
    }
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (!validateStep()) return;
    setStep((s) => Math.min(3, s + 1));
  }

  function handleSave(status: "actif" | "brouillon") {
    setSaving(true);
    setTimeout(() => {
      const data = {
        title: form.title.trim(),
        category: form.category,
        subcategory: form.subcategory,
        description: form.description.trim(),
        tags: form.tags,
        image: mediaFiles[0]?.url || form.image || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80",
        status,
        price: form.packages.basic.price,
        deliveryDays: form.packages.basic.delivery,
        revisions: form.packages.basic.revisions,
        packages: form.packages,
        faq: form.faq,
        extras: form.extras,
      };
      if (editId) {
        updateService(editId, data);
        addToast("success", "Service modifie avec succes !");
        setSaving(false);
        router.push("/dashboard/services");
      } else {
        addService(data);
        setSaving(false);
        if (status === "actif") {
          setPublished(true);
        } else {
          addToast("success", "Service sauvegarde en brouillon !");
          router.push("/dashboard/services");
        }
      }
    }, 800);
  }

  function addTag(t: string) {
    const val = t.trim();
    if (val && !form.tags.includes(val) && form.tags.length < 10) {
      setForm((f) => ({ ...f, tags: [...f.tags, val] }));
    }
    setTagInput("");
  }

  function addFaq() {
    if (faqQ.trim() && faqA.trim()) {
      setForm((f) => ({ ...f, faq: [...f.faq, { question: faqQ.trim(), answer: faqA.trim() }] }));
      setFaqQ(""); setFaqA("");
      addToast("success", "Question ajoutee");
    }
  }

  function addExtra() {
    if (extraLabel.trim() && extraPrice && Number(extraPrice) > 0) {
      setForm((f) => ({ ...f, extras: [...f.extras, { label: extraLabel.trim(), price: Number(extraPrice) }] }));
      setExtraLabel(""); setExtraPrice("");
      addToast("success", "Option ajoutee");
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const maxSize = 10 * 1024 * 1024; // 10MB
    Array.from(files).forEach((f) => {
      if (!f.type.startsWith("image/")) {
        addToast("error", `${f.name} n'est pas une image valide`);
        return;
      }
      if (f.size > maxSize) {
        addToast("error", `${f.name} depasse la taille maximale de 10 Mo`);
        return;
      }
      const url = URL.createObjectURL(f);
      setMediaFiles((prev) => [...prev, { name: f.name, url }]);
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  function updatePackage(tier: "basic" | "standard" | "premium", field: string, value: string | number) {
    setForm((f) => ({
      ...f,
      packages: { ...f.packages, [tier]: { ...f.packages[tier], [field]: value } },
    }));
  }

  if (published) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-4xl text-primary">check_circle</span>
        </div>
        <h2 className="text-2xl font-extrabold mb-2">Service publie avec succes !</h2>
        <p className="text-slate-400 text-sm mb-8">Votre service est maintenant visible dans la marketplace. Les clients peuvent le decouvrir et passer commande.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/dashboard/services" className="px-6 py-3 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            Voir mes services
          </Link>
          <button onClick={() => { setPublished(false); setStep(0); setForm(INITIAL); setMediaFiles([]); setErrors({}); }}
            className="px-6 py-3 border border-border-dark text-slate-300 font-bold rounded-xl text-sm hover:bg-primary/10 transition-all">
            Creer un autre service
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back + Title */}
      <div>
        <Link href="/dashboard/services" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary font-bold transition-colors mb-4">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Mes Services
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight">{editId ? "Modifier le service" : "Creer un nouveau service"}</h1>
        <p className="text-slate-400 text-sm mt-1.5">
          {editId ? "Modifiez les informations de votre service." : "Decrivez votre service pour recevoir des commandes rapidement."}
        </p>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_280px] gap-8">

        {/* LEFT SIDEBAR — Step Navigation */}
        <div className="lg:block">
          <div className="bg-background-dark/50 border border-border-dark rounded-2xl p-5 sticky top-24">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-5">Progression</p>
            <div className="space-y-1">
              {STEPS.map((s, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <button
                    key={i}
                    onClick={() => i < step && setStep(i)}
                    disabled={i > step}
                    className={cn(
                      "w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition-all",
                      active ? "bg-primary/10" : done ? "hover:bg-primary/5 cursor-pointer" : "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold",
                      active ? "bg-primary text-white" : done ? "bg-primary/20 text-primary" : "bg-border-dark text-slate-500"
                    )}>
                      {done ? <span className="material-symbols-outlined text-sm">check</span> : (
                        <span className="material-symbols-outlined text-sm">{s.icon}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className={cn("text-sm font-bold", active ? "text-primary" : done ? "text-slate-200" : "text-slate-500")}>{s.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{s.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-border-dark">
              <p className="text-xs text-slate-500 mb-2">Complete a {Math.round(progressPercent)}%</p>
              <div className="w-full h-2 bg-border-dark rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            {/* Expert Tip */}
            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm text-white">lightbulb</span>
                </div>
                <p className="text-xs font-bold text-primary">{EXPERT_TIPS[step].title}</p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{EXPERT_TIPS[step].content}</p>
            </div>
          </div>
        </div>

        {/* CENTER — Form Content */}
        <div className="min-w-0">
          <div className="bg-background-dark/50 border border-border-dark rounded-2xl p-6 sm:p-10">

            {/* Step 0: Informations */}
            {step === 0 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-extrabold mb-1">Informations du service</h2>
                  <p className="text-sm text-slate-400">Decrivez votre service pour attirer les bons clients.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Titre du service <span className="text-red-400">*</span></label>
                  <input
                    value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Ex : Developpement d'une application React/Next.js"
                    maxLength={80}
                    className={cn("w-full px-4 py-3 bg-neutral-dark border rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary transition-colors", errors.title ? "border-red-500" : "border-border-dark")}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.title && <p className="text-red-400 text-xs">{errors.title}</p>}
                    <p className="text-xs text-slate-500 ml-auto">{form.title.length}/80</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Categorie <span className="text-red-400">*</span></label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value, subcategory: "" }))}
                      className={cn("w-full px-4 py-3 bg-neutral-dark border rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary", errors.category ? "border-red-500" : "border-border-dark")}
                    >
                      <option value="">Choisir une categorie...</option>
                      {Object.keys(CATEGORIES).map((c) => <option key={c}>{c}</option>)}
                    </select>
                    {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Sous-categorie</label>
                    <select
                      value={form.subcategory}
                      onChange={(e) => setForm((f) => ({ ...f, subcategory: e.target.value }))}
                      disabled={!form.category}
                      className="w-full px-4 py-3 bg-neutral-dark border border-border-dark rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                    >
                      <option value="">Choisir...</option>
                      {subcategories.map((sc) => <option key={sc}>{sc}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Description <span className="text-red-400">*</span></label>
                  <textarea
                    value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={6} maxLength={2000} placeholder="Decrivez votre service en detail : ce que vous proposez, votre methode de travail, ce qui est inclus..."
                    className={cn("w-full px-4 py-3 bg-neutral-dark border rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary resize-none transition-colors", errors.description ? "border-red-500" : "border-border-dark")}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.description && <p className="text-red-400 text-xs">{errors.description}</p>}
                    <p className="text-xs text-slate-500 ml-auto">{form.description.length}/2000</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Competences / Tags</label>
                  <div className="flex flex-wrap items-center gap-2 min-h-[46px] w-full px-3 py-2.5 bg-neutral-dark border border-border-dark rounded-xl focus-within:ring-1 focus-within:ring-primary transition-colors">
                    {form.tags.map((t) => (
                      <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/15 text-primary text-xs font-bold">
                        {t}
                        <button onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }))} className="hover:text-red-400 transition-colors">
                          <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                      </span>
                    ))}
                    <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput); } }}
                      placeholder={form.tags.length === 0 ? "Ajouter une competence..." : ""}
                      className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder:text-slate-600" />
                  </div>
                  {form.tags.length < 10 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {TAGS_SUGGESTIONS.filter((t) => !form.tags.includes(t)).slice(0, 8).map((t) => (
                        <button key={t} onClick={() => addTag(t)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border-dark text-slate-400 text-xs hover:border-primary hover:text-primary transition-all">
                          <span className="material-symbols-outlined text-xs">add</span> {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 1: Forfaits */}
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-extrabold mb-1">Tarification par forfait</h2>
                  <p className="text-sm text-slate-400">Definissez 3 niveaux de prix pour toucher differents budgets.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-5">
                  {(["basic", "standard", "premium"] as const).map((tier, i) => (
                    <div key={tier} className={cn(
                      "border rounded-2xl p-6 space-y-5 transition-all",
                      i === 1 ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border-dark"
                    )}>
                      {i === 1 && <div className="text-center"><span className="text-xs font-bold text-primary bg-primary/15 px-3 py-1 rounded-full">Recommande</span></div>}
                      <h3 className="text-base font-extrabold text-center capitalize">{form.packages[tier].name}</h3>
                      <div>
                        <label className="text-xs font-bold text-slate-400 mb-1 block">Nom du forfait</label>
                        <input value={form.packages[tier].name} onChange={(e) => updatePackage(tier, "name", e.target.value)}
                          className="w-full px-3 py-2.5 bg-neutral-dark border border-border-dark rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 mb-1 block">Description {tier === "basic" && <span className="text-red-400">*</span>}</label>
                        <textarea value={form.packages[tier].description} onChange={(e) => updatePackage(tier, "description", e.target.value)} rows={3}
                          placeholder="Ce qui est inclus dans ce forfait..."
                          className={cn("w-full px-3 py-2.5 bg-neutral-dark border rounded-xl text-sm resize-none outline-none focus:ring-1 focus:ring-primary",
                            tier === "basic" && errors.basicDesc ? "border-red-500" : "border-border-dark")} />
                        {tier === "basic" && errors.basicDesc && <p className="text-red-400 text-xs mt-1">{errors.basicDesc}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 mb-1 block">Prix (€) {tier === "basic" && <span className="text-red-400">*</span>}</label>
                        <div className="relative">
                          <input type="number" min={1} value={form.packages[tier].price}
                            onChange={(e) => updatePackage(tier, "price", Number(e.target.value))}
                            className={cn("w-full pl-3 pr-10 py-2.5 bg-neutral-dark border rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary",
                              (tier === "basic" && errors.basicPrice) || (tier === "standard" && errors.standardPrice) || (tier === "premium" && errors.premiumPrice) ? "border-red-500" : "border-border-dark")} />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">EUR</span>
                        </div>
                        {tier === "basic" && errors.basicPrice && <p className="text-red-400 text-xs mt-1">{errors.basicPrice}</p>}
                        {tier === "standard" && errors.standardPrice && <p className="text-red-400 text-xs mt-1">{errors.standardPrice}</p>}
                        {tier === "premium" && errors.premiumPrice && <p className="text-red-400 text-xs mt-1">{errors.premiumPrice}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-bold text-slate-400 mb-1 block">Delai (j)</label>
                          <input type="number" min={1} value={form.packages[tier].delivery}
                            onChange={(e) => updatePackage(tier, "delivery", Number(e.target.value))}
                            className="w-full px-3 py-2.5 bg-neutral-dark border border-border-dark rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 mb-1 block">Revisions</label>
                          <input type="number" min={0} value={form.packages[tier].revisions}
                            onChange={(e) => updatePackage(tier, "revisions", Number(e.target.value))}
                            className="w-full px-3 py-2.5 bg-neutral-dark border border-border-dark rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Extras & FAQ */}
            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-extrabold mb-1">Options & FAQ</h2>
                  <p className="text-sm text-slate-400">Ajoutez des options payantes et repondez aux questions frequentes.</p>
                </div>
                {/* Extras */}
                <div>
                  <h3 className="font-bold mb-1 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">add_shopping_cart</span>
                    Options payantes additionnelles
                  </h3>
                  <p className="text-sm text-slate-400 mb-4">Proposez des services complementaires pour augmenter votre panier moyen.</p>
                  {form.extras.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {form.extras.map((e, i) => (
                        <div key={i} className="flex items-center gap-3 bg-neutral-dark border border-border-dark rounded-xl px-4 py-3 group">
                          <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                          <span className="flex-1 text-sm font-semibold">{e.label}</span>
                          <span className="text-sm font-bold text-primary">+{e.price} €</span>
                          <button onClick={() => setForm((f) => ({ ...f, extras: f.extras.filter((_, j) => j !== i) }))}
                            className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                            <span className="material-symbols-outlined text-lg">close</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-3">
                    <input value={extraLabel} onChange={(e) => setExtraLabel(e.target.value)} placeholder="Ex : Livraison express 24h"
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addExtra(); } }}
                      className="flex-1 px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary" />
                    <div className="relative w-28">
                      <input type="number" min={1} value={extraPrice} onChange={(e) => setExtraPrice(e.target.value)} placeholder="Prix"
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addExtra(); } }}
                        className="w-full pl-3 pr-8 py-2.5 bg-neutral-dark border border-border-dark rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">€</span>
                    </div>
                    <button onClick={addExtra} disabled={!extraLabel.trim() || !extraPrice || Number(extraPrice) <= 0}
                      className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-all">
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                </div>
                {/* FAQ */}
                <div>
                  <h3 className="font-bold mb-1 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">help</span>
                    Questions frequentes
                  </h3>
                  <p className="text-sm text-slate-400 mb-4">Repondez aux questions courantes pour rassurer les clients.</p>
                  {form.faq.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {form.faq.map((f, i) => (
                        <div key={i} className="bg-neutral-dark border border-border-dark rounded-xl px-4 py-3 group">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-sm">quiz</span>
                                {f.question}
                              </p>
                              <p className="text-xs text-slate-400 mt-1.5 pl-6">{f.answer}</p>
                            </div>
                            <button onClick={() => setForm((fm) => ({ ...fm, faq: fm.faq.filter((_, j) => j !== i) }))}
                              className="text-slate-500 hover:text-red-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                              <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="space-y-2">
                    <input value={faqQ} onChange={(e) => setFaqQ(e.target.value)} placeholder="Votre question..."
                      onKeyDown={(e) => { if (e.key === "Enter" && faqQ && faqA) { e.preventDefault(); addFaq(); } }}
                      className="w-full px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary" />
                    <textarea value={faqA} onChange={(e) => setFaqA(e.target.value)} rows={2} placeholder="Votre reponse..."
                      className="w-full px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-xl text-sm resize-none outline-none focus:ring-1 focus:ring-primary" />
                    <button onClick={addFaq} disabled={!faqQ.trim() || !faqA.trim()}
                      className="flex items-center gap-2 px-4 py-2.5 bg-border-dark text-slate-200 rounded-xl text-sm font-bold hover:bg-primary/20 disabled:opacity-50 transition-all">
                      <span className="material-symbols-outlined text-lg">add</span> Ajouter cette Q&A
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Gallery & Publication */}
            {step === 3 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-extrabold mb-1">Galerie & Publication</h2>
                  <p className="text-sm text-slate-400">Ajoutez des images de qualite pour presenter votre travail.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Photos de presentation</label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={cn(
                      "border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all",
                      dragOver ? "border-primary bg-primary/10" : "border-border-dark hover:border-primary hover:bg-primary/5"
                    )}
                  >
                    <span className="material-symbols-outlined text-4xl text-slate-500 mb-3 block">cloud_upload</span>
                    <p className="text-sm font-bold text-slate-300">Glissez vos fichiers ici ou cliquez pour parcourir</p>
                    <p className="text-xs text-slate-500 mt-1">JPG, PNG, WebP - Max 10 Mo par image</p>
                    <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                  </div>
                  {mediaFiles.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                      {mediaFiles.map((m, i) => (
                        <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-neutral-dark group border border-border-dark">
                          <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={(e) => { e.stopPropagation(); setMediaFiles((prev) => prev.filter((_, j) => j !== i)); }}
                              className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                              <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                          </div>
                          {i === 0 && (
                            <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-md">
                              Couverture
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 mt-10 border-t border-border-dark">
              <button
                onClick={() => step > 0 ? setStep((s) => s - 1) : router.back()}
                className="flex items-center gap-2 px-4 py-2.5 border border-border-dark rounded-xl text-sm font-bold text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-all"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                {step > 0 ? "Precedent" : "Annuler"}
              </button>
              <div className="flex gap-3">
                {step === 3 && (
                  <button onClick={() => handleSave("brouillon")} disabled={saving}
                    className="px-5 py-2.5 text-sm font-semibold border border-primary text-primary rounded-xl hover:bg-primary/10 transition-colors disabled:opacity-50">
                    Sauvegarder en brouillon
                  </button>
                )}
                {step < 3 ? (
                  <button onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                    Etape suivante <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                ) : (
                  <button onClick={() => handleSave("actif")} disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                    {saving && <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>}
                    {saving ? "Publication..." : editId ? "Enregistrer les modifications" : "Publier le service"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR — Live Preview */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            {/* Preview Card */}
            <div className="bg-background-dark/50 border border-border-dark rounded-2xl p-5">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">preview</span> Apercu du service
              </p>
              <div className="bg-neutral-dark border border-border-dark rounded-xl overflow-hidden">
                {mediaFiles.length > 0 ? (
                  <img src={mediaFiles[0].url} alt="Apercu" className="w-full h-32 object-cover" />
                ) : (
                  <div className="w-full h-32 bg-border-dark flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl text-slate-600">image</span>
                  </div>
                )}
                <div className="p-3">
                  <p className="font-bold text-sm line-clamp-2">{form.title || "Titre du service"}</p>
                  <p className="text-xs text-primary mt-0.5">{form.category || "Categorie"}</p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{form.description || "Description du service..."}</p>
                  {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {form.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-md font-semibold">{t}</span>
                      ))}
                      {form.tags.length > 3 && <span className="text-[10px] text-slate-500">+{form.tags.length - 3}</span>}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-border-dark">
                    <span className="text-xs text-slate-500">A partir de</span>
                    <span className="text-sm font-extrabold text-primary">{form.packages.basic.price} €</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume du projet */}
            <div className="bg-background-dark/50 border border-border-dark rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Resume du service</p>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="material-symbols-outlined text-primary text-sm">payments</span>
                  <span className="text-slate-400">Prix :</span>
                  <span className="font-bold ml-auto">{form.packages.basic.price} - {form.packages.premium.price} €</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                  <span className="text-slate-400">Delai :</span>
                  <span className="font-bold ml-auto">{form.packages.premium.delivery} - {form.packages.basic.delivery} jours</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="material-symbols-outlined text-primary text-sm">restart_alt</span>
                  <span className="text-slate-400">Revisions :</span>
                  <span className="font-bold ml-auto">jusqu&apos;a {form.packages.premium.revisions}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="material-symbols-outlined text-primary text-sm">sell</span>
                  <span className="text-slate-400">Forfaits :</span>
                  <span className="font-bold ml-auto">3 niveaux</span>
                </div>
                {form.extras.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="material-symbols-outlined text-primary text-sm">add_shopping_cart</span>
                    <span className="text-slate-400">Extras :</span>
                    <span className="font-bold ml-auto">{form.extras.length} option{form.extras.length > 1 ? "s" : ""}</span>
                  </div>
                )}
                {form.faq.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="material-symbols-outlined text-primary text-sm">quiz</span>
                    <span className="text-slate-400">FAQ :</span>
                    <span className="font-bold ml-auto">{form.faq.length} question{form.faq.length > 1 ? "s" : ""}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs">
                  <span className="material-symbols-outlined text-primary text-sm">photo_library</span>
                  <span className="text-slate-400">Images :</span>
                  <span className="font-bold ml-auto">{mediaFiles.length} photo{mediaFiles.length !== 1 ? "s" : ""}</span>
                </div>
              </div>
            </div>

            {/* Boost upsell */}
            <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-5 text-center">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white mx-auto mb-3">
                <span className="material-symbols-outlined">bolt</span>
              </div>
              <p className="text-sm font-bold mb-1">Besoin d&apos;aller plus vite ?</p>
              <p className="text-xs text-slate-400 mb-3">Boostez votre service pour qu&apos;il apparaisse en tete de liste pendant 24h.</p>
              <button className="px-4 py-2 border border-primary text-primary rounded-xl text-xs font-bold hover:bg-primary/10 transition-all w-full">
                Promouvoir mon service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
