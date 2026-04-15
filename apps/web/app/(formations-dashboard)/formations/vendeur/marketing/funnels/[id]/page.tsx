"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use as usePromise } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type BlockType = "hero" | "features" | "countdown" | "testimonials" | "faq" | "cta" | "video" | "stats" | "pricing";

interface Block {
  id: string;
  type: BlockType;
  data: Record<string, unknown>;
}

interface Step {
  id: string;
  stepOrder: number;
  stepType: string;
  title: string;
  headlineFr: string | null;
  descriptionFr: string | null;
  ctaTextFr: string | null;
  formationId: string | null;
  productId: string | null;
  discountPct: number | null;
  blocks: Block[] | null;
  views: number;
  conversions: number;
}

interface Theme {
  primaryColor: string;
  accentColor: string;
  textColor: string;
  bgColor: string;
  font: string;
  logoUrl?: string;
}

interface Funnel {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  totalViews: number;
  totalConversions: number;
  totalRevenue: number;
  theme: Theme | null;
  steps: Step[];
}

// ─── Block templates ───────────────────────────────────────────────────────────
const BLOCK_TEMPLATES: Record<BlockType, { label: string; icon: string; default: Record<string, unknown> }> = {
  hero: {
    label: "Hero / Bannière",
    icon: "view_carousel",
    default: {
      badge: "Nouveau",
      headline: "Votre titre accrocheur ici",
      subheadline: "Un sous-titre qui décrit la valeur unique de votre offre.",
      ctaText: "Je découvre",
      imageUrl: "",
    },
  },
  features: {
    label: "Liste de bénéfices",
    icon: "check_circle",
    default: {
      title: "Ce que vous obtenez",
      items: [
        { icon: "check_circle", title: "Bénéfice 1", desc: "Description courte." },
        { icon: "rocket_launch", title: "Bénéfice 2", desc: "Description courte." },
        { icon: "support_agent", title: "Bénéfice 3", desc: "Description courte." },
      ],
    },
  },
  countdown: {
    label: "Compteur urgence",
    icon: "timer",
    default: {
      title: "Offre limitée — fin dans :",
      endsInHours: 48,
      subtitle: "Après cette date, le prix passera au tarif normal.",
    },
  },
  testimonials: {
    label: "Témoignages",
    icon: "format_quote",
    default: {
      title: "Ils en parlent mieux que nous",
      items: [
        { name: "Prénom Nom", role: "Métier · Ville", text: "Un témoignage authentique de votre client.", rating: 5 },
      ],
    },
  },
  faq: {
    label: "FAQ",
    icon: "help",
    default: {
      title: "Questions fréquentes",
      items: [
        { q: "Une question fréquente ?", a: "Réponse claire et rassurante." },
      ],
    },
  },
  cta: {
    label: "Appel à l'action",
    icon: "ads_click",
    default: {
      headline: "Prêt à passer à l'action ?",
      subheadline: "Rejoignez la communauté maintenant.",
      ctaText: "Commencer",
    },
  },
  video: {
    label: "Vidéo",
    icon: "play_circle",
    default: {
      url: "",
      caption: "Découvrez la formation en 2 minutes",
    },
  },
  stats: {
    label: "Statistiques",
    icon: "monitoring",
    default: {
      items: [
        { value: "10 000+", label: "Apprenants" },
        { value: "4.9/5", label: "Satisfaction" },
        { value: "98%", label: "Recommandent" },
      ],
    },
  },
  pricing: {
    label: "Pricing",
    icon: "sell",
    default: {
      title: "Investissement",
      price: 25000,
      originalPrice: 50000,
      currency: "FCFA",
      benefits: ["Accès à vie", "Mises à jour incluses", "Certificat de complétion"],
      ctaText: "Acheter maintenant",
    },
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
function newBlockId() {
  return `b-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

// ─── Block Editor Components ───────────────────────────────────────────────────
function StringInput({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-[#5c647a] uppercase tracking-wider mb-1">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006e2f]/30 focus:border-[#006e2f] resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006e2f]/30 focus:border-[#006e2f]"
        />
      )}
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-[#5c647a] uppercase tracking-wider mb-1">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006e2f]/30 focus:border-[#006e2f]"
      />
    </div>
  );
}

function ListEditor<T extends Record<string, unknown>>({
  label,
  items,
  template,
  onChange,
  renderItem,
}: {
  label: string;
  items: T[];
  template: T;
  onChange: (items: T[]) => void;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-[#5c647a] uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-[#5c647a]">#{i + 1}</span>
              <button
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="text-red-500 hover:text-red-700"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
            {renderItem(item, (patch) => {
              const updated = [...items];
              updated[i] = { ...item, ...patch };
              onChange(updated);
            })}
          </div>
        ))}
        <button
          onClick={() => onChange([...items, { ...template }])}
          className="w-full px-3 py-2 rounded-xl border-2 border-dashed border-gray-300 text-xs font-semibold text-[#5c647a] hover:border-[#006e2f] hover:text-[#006e2f] transition-colors"
        >
          + Ajouter
        </button>
      </div>
    </div>
  );
}

function BlockEditor({ block, onChange, onDelete }: { block: Block; onChange: (b: Block) => void; onDelete: () => void }) {
  const update = (data: Record<string, unknown>) => onChange({ ...block, data: { ...block.data, ...data } });

  function renderEditor() {
    switch (block.type) {
      case "hero":
        return (
          <div className="space-y-3">
            <StringInput label="Badge" value={(block.data.badge as string) ?? ""} onChange={(v) => update({ badge: v })} />
            <StringInput label="Titre principal" value={(block.data.headline as string) ?? ""} onChange={(v) => update({ headline: v })} />
            <StringInput label="Sous-titre" value={(block.data.subheadline as string) ?? ""} onChange={(v) => update({ subheadline: v })} multiline />
            <StringInput label="Texte du bouton" value={(block.data.ctaText as string) ?? ""} onChange={(v) => update({ ctaText: v })} />
            <StringInput label="URL de l'image (optionnel)" value={(block.data.imageUrl as string) ?? ""} onChange={(v) => update({ imageUrl: v })} />
          </div>
        );
      case "features":
        return (
          <div className="space-y-3">
            <StringInput label="Titre de section" value={(block.data.title as string) ?? ""} onChange={(v) => update({ title: v })} />
            <ListEditor
              label="Bénéfices"
              items={(block.data.items as Array<{ icon: string; title: string; desc: string }>) ?? []}
              template={{ icon: "check_circle", title: "Bénéfice", desc: "Description" }}
              onChange={(items) => update({ items })}
              renderItem={(item, patch) => (
                <div className="space-y-2">
                  <StringInput label="Icône (Material)" value={item.icon} onChange={(v) => patch({ icon: v })} />
                  <StringInput label="Titre" value={item.title} onChange={(v) => patch({ title: v })} />
                  <StringInput label="Description" value={item.desc} onChange={(v) => patch({ desc: v })} />
                </div>
              )}
            />
          </div>
        );
      case "countdown":
        return (
          <div className="space-y-3">
            <StringInput label="Titre" value={(block.data.title as string) ?? ""} onChange={(v) => update({ title: v })} />
            <NumberInput label="Durée (heures)" value={(block.data.endsInHours as number) ?? 48} onChange={(v) => update({ endsInHours: v })} />
            <StringInput label="Sous-titre" value={(block.data.subtitle as string) ?? ""} onChange={(v) => update({ subtitle: v })} />
          </div>
        );
      case "testimonials":
        return (
          <div className="space-y-3">
            <StringInput label="Titre de section" value={(block.data.title as string) ?? ""} onChange={(v) => update({ title: v })} />
            <ListEditor
              label="Témoignages"
              items={(block.data.items as Array<{ name: string; role: string; text: string; rating: number }>) ?? []}
              template={{ name: "Prénom Nom", role: "Métier · Ville", text: "Témoignage…", rating: 5 }}
              onChange={(items) => update({ items })}
              renderItem={(item, patch) => (
                <div className="space-y-2">
                  <StringInput label="Nom" value={item.name} onChange={(v) => patch({ name: v })} />
                  <StringInput label="Rôle" value={item.role} onChange={(v) => patch({ role: v })} />
                  <StringInput label="Témoignage" value={item.text} onChange={(v) => patch({ text: v })} multiline />
                  <NumberInput label="Note (1-5)" value={item.rating} onChange={(v) => patch({ rating: v })} />
                </div>
              )}
            />
          </div>
        );
      case "faq":
        return (
          <div className="space-y-3">
            <StringInput label="Titre" value={(block.data.title as string) ?? ""} onChange={(v) => update({ title: v })} />
            <ListEditor
              label="Questions"
              items={(block.data.items as Array<{ q: string; a: string }>) ?? []}
              template={{ q: "Question ?", a: "Réponse claire." }}
              onChange={(items) => update({ items })}
              renderItem={(item, patch) => (
                <div className="space-y-2">
                  <StringInput label="Question" value={item.q} onChange={(v) => patch({ q: v })} />
                  <StringInput label="Réponse" value={item.a} onChange={(v) => patch({ a: v })} multiline />
                </div>
              )}
            />
          </div>
        );
      case "cta":
        return (
          <div className="space-y-3">
            <StringInput label="Titre" value={(block.data.headline as string) ?? ""} onChange={(v) => update({ headline: v })} />
            <StringInput label="Sous-titre" value={(block.data.subheadline as string) ?? ""} onChange={(v) => update({ subheadline: v })} />
            <StringInput label="Texte du bouton" value={(block.data.ctaText as string) ?? ""} onChange={(v) => update({ ctaText: v })} />
          </div>
        );
      case "video":
        return (
          <div className="space-y-3">
            <StringInput label="URL de la vidéo (YouTube/Vimeo embed)" value={(block.data.url as string) ?? ""} onChange={(v) => update({ url: v })} />
            <StringInput label="Légende" value={(block.data.caption as string) ?? ""} onChange={(v) => update({ caption: v })} />
          </div>
        );
      case "stats":
        return (
          <ListEditor
            label="Statistiques"
            items={(block.data.items as Array<{ value: string; label: string }>) ?? []}
            template={{ value: "100+", label: "Label" }}
            onChange={(items) => update({ items })}
            renderItem={(item, patch) => (
              <div className="space-y-2">
                <StringInput label="Valeur" value={item.value} onChange={(v) => patch({ value: v })} />
                <StringInput label="Label" value={item.label} onChange={(v) => patch({ label: v })} />
              </div>
            )}
          />
        );
      case "pricing":
        return (
          <div className="space-y-3">
            <StringInput label="Titre" value={(block.data.title as string) ?? ""} onChange={(v) => update({ title: v })} />
            <NumberInput label="Prix" value={(block.data.price as number) ?? 0} onChange={(v) => update({ price: v })} />
            <NumberInput label="Prix barré (optionnel)" value={(block.data.originalPrice as number) ?? 0} onChange={(v) => update({ originalPrice: v })} />
            <StringInput label="Devise" value={(block.data.currency as string) ?? "FCFA"} onChange={(v) => update({ currency: v })} />
            <StringInput label="Texte du bouton" value={(block.data.ctaText as string) ?? ""} onChange={(v) => update({ ctaText: v })} />
            <ListEditor
              label="Avantages"
              items={((block.data.benefits as string[]) ?? []).map((s) => ({ text: s }))}
              template={{ text: "Avantage" }}
              onChange={(items) => update({ benefits: items.map((i) => i.text) })}
              renderItem={(item, patch) => (
                <StringInput label="Texte" value={item.text} onChange={(v) => patch({ text: v })} />
              )}
            />
          </div>
        );
    }
  }

  const tpl = BLOCK_TEMPLATES[block.type];

  return (
    <div className="bg-[#f7f9fb] rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006e2f] text-[18px]">{tpl.icon}</span>
          <span className="text-sm font-bold text-[#191c1e]">{tpl.label}</span>
        </div>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700">
          <span className="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
      <div className="p-4">{renderEditor()}</div>
    </div>
  );
}

// ─── Main editor ───────────────────────────────────────────────────────────────
export default function FunnelEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const router = useRouter();
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [showAddBlock, setShowAddBlock] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/formations/vendeur/funnels/${id}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setFunnel(json.data);
      setActiveStepId((prev) => prev ?? json.data.steps[0]?.id ?? null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function save(patch: Partial<Funnel> & { steps?: Partial<Step>[] }) {
    if (!funnel) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/formations/vendeur/funnels/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const json = await res.json();
        setFunnel(json.data);
        setSavedAt(new Date());
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Supprimer ce funnel définitivement ?")) return;
    await fetch(`/api/formations/vendeur/funnels/${id}`, { method: "DELETE" });
    router.push("/formations/vendeur/marketing/funnels");
  }

  if (loading || !funnel) {
    return (
      <div className="p-8 max-w-7xl mx-auto animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded-xl mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="h-96 bg-gray-200 rounded-2xl" />
          <div className="lg:col-span-2 h-96 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const activeStep = funnel.steps.find((s) => s.id === activeStepId) ?? funnel.steps[0];
  const blocks = (activeStep?.blocks as Block[]) ?? [];

  function updateBlock(idx: number, block: Block) {
    if (!activeStep) return;
    const updated = [...blocks];
    updated[idx] = block;
    save({ steps: [{ id: activeStep.id, blocks: updated as unknown as Block[] }] });
    setFunnel((f) => f ? { ...f, steps: f.steps.map((s) => s.id === activeStep.id ? { ...s, blocks: updated } : s) } : f);
  }

  function deleteBlock(idx: number) {
    if (!activeStep) return;
    const updated = blocks.filter((_, j) => j !== idx);
    save({ steps: [{ id: activeStep.id, blocks: updated }] });
    setFunnel((f) => f ? { ...f, steps: f.steps.map((s) => s.id === activeStep.id ? { ...s, blocks: updated } : s) } : f);
  }

  function addBlock(type: BlockType) {
    if (!activeStep) return;
    const tpl = BLOCK_TEMPLATES[type];
    const newBlock: Block = { id: newBlockId(), type, data: { ...tpl.default } };
    const updated = [...blocks, newBlock];
    save({ steps: [{ id: activeStep.id, blocks: updated }] });
    setFunnel((f) => f ? { ...f, steps: f.steps.map((s) => s.id === activeStep.id ? { ...s, blocks: updated } : s) } : f);
    setShowAddBlock(false);
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="px-5 md:px-8 h-14 flex items-center gap-3 max-w-7xl mx-auto">
          <Link href="/formations/vendeur/marketing/funnels" className="text-[#5c647a] hover:text-[#191c1e]">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <input
            type="text"
            value={funnel.name}
            onChange={(e) => setFunnel({ ...funnel, name: e.target.value })}
            onBlur={() => save({ name: funnel.name })}
            className="text-sm font-bold text-[#191c1e] flex-1 bg-transparent focus:outline-none focus:bg-gray-50 px-2 py-1 rounded transition-colors"
          />

          <div className="flex items-center gap-2 text-xs text-[#5c647a]">
            {saving ? (
              <>
                <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                Sauvegarde…
              </>
            ) : savedAt ? (
              <>
                <span className="material-symbols-outlined text-[14px] text-green-500">check_circle</span>
                Sauvegardé
              </>
            ) : null}
          </div>

          <a
            href={`/f/${funnel.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 text-[#191c1e] hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            Aperçu
          </a>

          <button
            onClick={() => save({ isActive: !funnel.isActive })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              funnel.isActive
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {funnel.isActive ? "check_circle" : "publish"}
            </span>
            {funnel.isActive ? "Publié" : "Publier"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ── Steps sidebar ─────────────────────────────────────── */}
        <aside className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-20">
            <h3 className="text-xs font-bold text-[#191c1e] mb-3 uppercase tracking-wider">
              Étapes du funnel
            </h3>
            <div className="space-y-1.5">
              {funnel.steps.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveStepId(s.id)}
                  className={`w-full flex items-start gap-2.5 text-left p-2.5 rounded-xl transition-colors ${
                    s.id === activeStepId
                      ? "bg-[#006e2f]/10 border border-[#006e2f]/20"
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      s.id === activeStepId ? "bg-[#006e2f] text-white" : "bg-gray-100 text-[#5c647a]"
                    }`}
                  >
                    <span className="text-xs font-extrabold">{s.stepOrder}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${s.id === activeStepId ? "text-[#006e2f]" : "text-[#191c1e]"}`}>
                      {s.title}
                    </p>
                    <p className="text-[10px] text-[#5c647a]">{s.stepType}</p>
                    {s.views > 0 && (
                      <p className="text-[9px] text-[#5c647a] mt-0.5">
                        {s.views} vues · {s.conversions} conv.
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <div>
                <p className="text-[10px] font-bold text-[#5c647a] uppercase mb-1">Slug public</p>
                <p className="text-xs text-[#191c1e] font-mono bg-gray-50 px-2 py-1 rounded truncate">
                  /f/{funnel.slug}
                </p>
              </div>
              <button
                onClick={handleDelete}
                className="w-full mt-3 text-xs text-red-500 hover:text-red-700 flex items-center justify-center gap-1.5 py-2"
              >
                <span className="material-symbols-outlined text-[14px]">delete</span>
                Supprimer ce funnel
              </button>
            </div>
          </div>
        </aside>

        {/* ── Editor + Preview ──────────────────────────────────── */}
        <main className="lg:col-span-9 space-y-4">
          {/* Step header */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-[10px] font-bold text-[#006e2f] uppercase tracking-wider mb-0.5">
                  Étape {activeStep?.stepOrder} · {activeStep?.stepType}
                </p>
                <input
                  type="text"
                  value={activeStep?.title ?? ""}
                  onChange={(e) => {
                    if (!activeStep) return;
                    setFunnel((f) => f ? { ...f, steps: f.steps.map((s) => s.id === activeStep.id ? { ...s, title: e.target.value } : s) } : f);
                  }}
                  onBlur={() => activeStep && save({ steps: [{ id: activeStep.id, title: activeStep.title }] })}
                  className="text-xl font-extrabold text-[#191c1e] bg-transparent focus:outline-none focus:bg-gray-50 px-2 py-1 rounded -ml-2"
                />
              </div>
            </div>
          </div>

          {/* Blocks */}
          {blocks.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
              <span className="material-symbols-outlined text-gray-300 text-5xl">widgets</span>
              <p className="text-sm font-bold text-[#191c1e] mt-3">Aucun block sur cette étape</p>
              <p className="text-xs text-[#5c647a] mt-1 mb-4">
                Ajoutez votre premier block pour commencer à construire cette page.
              </p>
              <button
                onClick={() => setShowAddBlock(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold"
                style={{ background: "linear-gradient(to right, #006e2f, #22c55e)" }}
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Ajouter un block
              </button>
            </div>
          ) : (
            <>
              {blocks.map((block, i) => (
                <BlockEditor
                  key={block.id}
                  block={block}
                  onChange={(b) => updateBlock(i, b)}
                  onDelete={() => deleteBlock(i)}
                />
              ))}
              <button
                onClick={() => setShowAddBlock(true)}
                className="w-full py-3.5 rounded-2xl border-2 border-dashed border-gray-300 text-sm font-bold text-[#5c647a] hover:border-[#006e2f] hover:text-[#006e2f] transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Ajouter un block
              </button>
            </>
          )}
        </main>
      </div>

      {/* Add block dialog */}
      {showAddBlock && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowAddBlock(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-extrabold text-[#191c1e] mb-1">Ajouter un block</h2>
            <p className="text-sm text-[#5c647a] mb-5">
              Choisissez le type de block à ajouter sur cette page.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(Object.entries(BLOCK_TEMPLATES) as [BlockType, typeof BLOCK_TEMPLATES[BlockType]][]).map(
                ([type, tpl]) => (
                  <button
                    key={type}
                    onClick={() => addBlock(type)}
                    className="bg-[#f7f9fb] rounded-2xl p-4 text-left hover:bg-[#006e2f]/5 hover:ring-2 hover:ring-[#006e2f]/30 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#006e2f]/10 flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-[#006e2f] text-[20px]">
                        {tpl.icon}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-[#191c1e]">{tpl.label}</p>
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => setShowAddBlock(false)}
              className="w-full mt-5 px-4 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-[#191c1e] hover:bg-gray-200"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
