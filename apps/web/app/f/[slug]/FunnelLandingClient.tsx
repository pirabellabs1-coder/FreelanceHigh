"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PixelInjector } from "@/components/formations/PixelInjector";

// ─── Types (must match editor) ─────────────────────────────────────────────────
interface Block {
  id: string;
  type: string;
  data: Record<string, unknown>;
}

interface Step {
  id: string;
  stepOrder: number;
  stepType: string;
  title: string;
  headlineFr: string | null;
  ctaTextFr: string | null;
  formationId: string | null;
  productId: string | null;
  blocks: Block[] | null;
}

interface Theme {
  primaryColor?: string;
  accentColor?: string;
  textColor?: string;
  bgColor?: string;
  font?: string;
  logoUrl?: string;
}

interface Pixel {
  type: "FACEBOOK" | "GOOGLE" | "TIKTOK";
  pixelId: string;
}

interface Funnel {
  id: string;
  name: string;
  slug: string;
  theme: Theme | null;
  steps: Step[];
  instructeur: {
    id: string;
    user: { id: string; name: string | null; image: string | null };
    marketingPixels?: Pixel[];
  };
}

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

// ─── Block renderers ───────────────────────────────────────────────────────────
function HeroBlock({ data, theme, onCta }: { data: Record<string, unknown>; theme: Theme; onCta: () => void }) {
  const { badge, headline, subheadline, ctaText, imageUrl } = data as {
    badge?: string;
    headline?: string;
    subheadline?: string;
    ctaText?: string;
    imageUrl?: string;
  };

  return (
    <section
      className="py-16 md:py-24 px-4"
      style={{
        background: `linear-gradient(135deg, ${theme.primaryColor}10, ${theme.accentColor}05)`,
      }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          {badge && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
              style={{
                background: `${theme.primaryColor}15`,
                color: theme.primaryColor,
              }}
            >
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
              {badge}
            </span>
          )}
          <h1
            className="text-3xl md:text-5xl font-extrabold leading-tight mb-5"
            style={{ color: theme.textColor }}
          >
            {headline}
          </h1>
          {subheadline && (
            <p className="text-base md:text-lg text-gray-600 mb-7 leading-relaxed">{subheadline}</p>
          )}
          <button
            onClick={onCta}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl text-white font-bold text-base shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all"
            style={{
              background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.accentColor})`,
            }}
          >
            {ctaText ?? "Commencer"}
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
        {imageUrl && (
          <div>
            <img
              src={imageUrl}
              alt=""
              className="w-full rounded-3xl shadow-2xl"
            />
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturesBlock({ data, theme }: { data: Record<string, unknown>; theme: Theme }) {
  const { title, items } = data as {
    title?: string;
    items?: Array<{ icon: string; title: string; desc: string }>;
  };
  return (
    <section className="py-14 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        {title && (
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-10" style={{ color: theme.textColor }}>
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(items ?? []).map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${theme.primaryColor}15` }}
              >
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={{ color: theme.primaryColor, fontVariationSettings: "'FILL' 1" }}
                >
                  {item.icon}
                </span>
              </div>
              <h3 className="text-base font-extrabold mb-1.5" style={{ color: theme.textColor }}>
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountdownBlock({ data, theme }: { data: Record<string, unknown>; theme: Theme }) {
  const { title, endsInHours = 48, subtitle } = data as {
    title?: string;
    endsInHours?: number;
    subtitle?: string;
  };

  const [target] = useState(() => Date.now() + endsInHours * 60 * 60 * 1000);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  const remaining = Math.max(0, target - now);
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return (
    <section
      className="py-12 px-4"
      style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})` }}
    >
      <div className="max-w-3xl mx-auto text-center text-white">
        <h2 className="text-xl md:text-2xl font-extrabold mb-5">{title}</h2>
        <div className="flex items-center justify-center gap-3 md:gap-5 mb-3">
          {[
            { v: days, label: "Jours" },
            { v: hours, label: "Heures" },
            { v: minutes, label: "Min" },
            { v: seconds, label: "Sec" },
          ].map((unit) => (
            <div key={unit.label} className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 md:px-6 md:py-4 min-w-[64px]">
              <p className="text-3xl md:text-5xl font-extrabold tabular-nums">
                {String(unit.v).padStart(2, "0")}
              </p>
              <p className="text-[10px] md:text-xs uppercase tracking-wider mt-1 opacity-80">{unit.label}</p>
            </div>
          ))}
        </div>
        {subtitle && <p className="text-sm md:text-base opacity-85 mt-4">{subtitle}</p>}
      </div>
    </section>
  );
}

function TestimonialsBlock({ data, theme }: { data: Record<string, unknown>; theme: Theme }) {
  const { title, items } = data as {
    title?: string;
    items?: Array<{ name: string; role: string; text: string; rating: number }>;
  };
  return (
    <section className="py-14 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        {title && (
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-10" style={{ color: theme.textColor }}>
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {(items ?? []).map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className="material-symbols-outlined text-[16px]"
                    style={{
                      color: s <= item.rating ? "#f59e0b" : "#d1d5db",
                      fontVariationSettings: "'FILL' 1",
                    }}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4 italic">&ldquo;{item.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})` }}
                >
                  {item.name?.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: theme.textColor }}>
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqBlock({ data, theme }: { data: Record<string, unknown>; theme: Theme }) {
  const { title, items } = data as {
    title?: string;
    items?: Array<{ q: string; a: string }>;
  };
  return (
    <section className="py-14 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        {title && (
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8" style={{ color: theme.textColor }}>
            {title}
          </h2>
        )}
        <div className="space-y-3">
          {(items ?? []).map((item, i) => (
            <details
              key={i}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 list-none">
                <span className="text-sm font-bold" style={{ color: theme.textColor }}>
                  {item.q}
                </span>
                <span
                  className="material-symbols-outlined text-[20px] group-open:rotate-180 transition-transform"
                  style={{ color: theme.primaryColor }}
                >
                  expand_more
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBlock({ data, theme, onCta }: { data: Record<string, unknown>; theme: Theme; onCta: () => void }) {
  const { headline, subheadline, ctaText } = data as {
    headline?: string;
    subheadline?: string;
    ctaText?: string;
  };
  return (
    <section
      className="py-16 px-4 text-center"
      style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})` }}
    >
      <div className="max-w-2xl mx-auto text-white">
        <h2 className="text-2xl md:text-4xl font-extrabold mb-3">{headline}</h2>
        {subheadline && <p className="text-base md:text-lg opacity-90 mb-7">{subheadline}</p>}
        <button
          onClick={onCta}
          className="inline-flex items-center gap-2 bg-white px-7 py-4 rounded-2xl font-bold text-base shadow-lg hover:opacity-90 transition-opacity"
          style={{ color: theme.primaryColor }}
        >
          {ctaText ?? "Commencer"}
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </section>
  );
}

function VideoBlock({ data, theme }: { data: Record<string, unknown>; theme: Theme }) {
  const { url, caption } = data as { url?: string; caption?: string };
  if (!url) return null;
  return (
    <section className="py-14 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="aspect-video rounded-2xl overflow-hidden bg-black">
          <iframe src={url} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
        </div>
        {caption && <p className="text-center text-sm text-gray-600 mt-3" style={{ color: theme.textColor }}>{caption}</p>}
      </div>
    </section>
  );
}

function StatsBlock({ data, theme }: { data: Record<string, unknown>; theme: Theme }) {
  const { items } = data as { items?: Array<{ value: string; label: string }> };
  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
        {(items ?? []).map((s, i) => (
          <div key={i}>
            <p className="text-3xl md:text-5xl font-extrabold" style={{ color: theme.primaryColor }}>
              {s.value}
            </p>
            <p className="text-xs md:text-sm text-gray-600 mt-1.5 font-semibold">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingBlock({
  data,
  theme,
  onCta,
}: {
  data: Record<string, unknown>;
  theme: Theme;
  onCta: () => void;
}) {
  const { title, price = 0, originalPrice, currency = "FCFA", benefits, ctaText } = data as {
    title?: string;
    price?: number;
    originalPrice?: number;
    currency?: string;
    benefits?: string[];
    ctaText?: string;
  };
  const discount = originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  return (
    <section className="py-14 px-4 bg-white">
      <div className="max-w-md mx-auto bg-white rounded-3xl border-2 p-8 text-center shadow-2xl" style={{ borderColor: theme.primaryColor }}>
        {title && <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: theme.primaryColor }}>{title}</p>}
        {discount > 0 && (
          <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 mb-3">
            -{discount}%
          </span>
        )}
        <div className="mb-6">
          <p className="text-5xl font-extrabold" style={{ color: theme.textColor }}>
            {fmt(price)} <span className="text-xl font-bold text-gray-500">{currency}</span>
          </p>
          {originalPrice && originalPrice > price && (
            <p className="text-base text-gray-400 line-through mt-1">{fmt(originalPrice)} {currency}</p>
          )}
        </div>
        {benefits && benefits.length > 0 && (
          <ul className="space-y-2 mb-7 text-left">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-[18px] flex-shrink-0"
                  style={{ color: theme.primaryColor, fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                <span className="text-sm" style={{ color: theme.textColor }}>{b}</span>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={onCta}
          className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg hover:opacity-90 transition-opacity"
          style={{ background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.accentColor})` }}
        >
          {ctaText ?? "Commander maintenant"}
        </button>
      </div>
    </section>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
const DEFAULT_THEME: Theme = {
  primaryColor: "#006e2f",
  accentColor: "#22c55e",
  textColor: "#191c1e",
  bgColor: "#f7f9fb",
};

export default function FunnelLandingClient({ slug }: { slug: string }) {
  const router = useRouter();
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/formations/public/funnel/${slug}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const json = await res.json();
        setFunnel(json.data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  function handleCta() {
    if (!funnel) return;
    const landing = funnel.steps[0];
    if (landing?.formationId) {
      router.push(`/formations/checkout?fids=${landing.formationId}`);
    } else if (landing?.productId) {
      router.push(`/formations/checkout?pids=${landing.productId}`);
    } else {
      router.push("/formations/explorer");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <span className="material-symbols-outlined text-[#006e2f] text-5xl animate-spin">progress_activity</span>
      </div>
    );
  }

  if (notFound || !funnel) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md">
          <span className="material-symbols-outlined text-gray-300 text-6xl">link_off</span>
          <h2 className="text-lg font-bold text-[#191c1e] mt-3">Page introuvable</h2>
          <p className="text-sm text-[#5c647a] mt-1.5 mb-4">
            Cette page de vente n&apos;existe pas ou n&apos;a pas encore été publiée.
          </p>
        </div>
      </div>
    );
  }

  const theme = { ...DEFAULT_THEME, ...(funnel.theme ?? {}) };
  const landingStep = funnel.steps.find((s) => s.stepType === "LANDING") ?? funnel.steps[0];
  const blocks = (landingStep?.blocks as Block[] | null) ?? [];

  return (
    <div style={{ background: theme.bgColor, color: theme.textColor }}>
      {/* Pixel tracking — fires on page load */}
      <PixelInjector
        pixels={funnel.instructeur.marketingPixels ?? []}
        event={{ name: "PageView" }}
      />

      {blocks.length === 0 ? (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md">
            <span className="material-symbols-outlined text-gray-300 text-6xl">construction</span>
            <h2 className="text-lg font-bold text-[#191c1e] mt-3">Page en construction</h2>
            <p className="text-sm text-[#5c647a] mt-1.5">Ce funnel n&apos;a pas encore de contenu publié.</p>
          </div>
        </div>
      ) : (
        blocks.map((block) => {
          switch (block.type) {
            case "hero":
              return <HeroBlock key={block.id} data={block.data} theme={theme} onCta={handleCta} />;
            case "features":
              return <FeaturesBlock key={block.id} data={block.data} theme={theme} />;
            case "countdown":
              return <CountdownBlock key={block.id} data={block.data} theme={theme} />;
            case "testimonials":
              return <TestimonialsBlock key={block.id} data={block.data} theme={theme} />;
            case "faq":
              return <FaqBlock key={block.id} data={block.data} theme={theme} />;
            case "cta":
              return <CtaBlock key={block.id} data={block.data} theme={theme} onCta={handleCta} />;
            case "video":
              return <VideoBlock key={block.id} data={block.data} theme={theme} />;
            case "stats":
              return <StatsBlock key={block.id} data={block.data} theme={theme} />;
            case "pricing":
              return <PricingBlock key={block.id} data={block.data} theme={theme} onCta={handleCta} />;
            default:
              return null;
          }
        })
      )}

      {/* Powered by footer */}
      <footer className="py-6 px-4 text-center bg-white border-t border-gray-100">
        <p className="text-xs text-gray-400">
          Propulsé par{" "}
          <a href="/formations" className="font-bold text-[#006e2f] hover:underline">
            FreelanceHigh
          </a>
        </p>
      </footer>
    </div>
  );
}
