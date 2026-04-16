"use client";

import type { ReactElement } from "react";

// Mini visual mockup of a landing page template.
// Renders an abstract sketch (hero + sections + CTA) using the template's palette
// to give a real visual feel of what the page will look like.

interface Props {
  vibe: string;
  palette: string[];     // [primary, accent, neutral]
  preview: string;       // CSS gradient used as hero background
  variant: string;       // template key — drives layout differences
}

export function TemplatePreviewMockup({ vibe, palette, preview, variant }: Props) {
  const [primary, accent, neutral] = palette;
  const isDark = vibe === "premium" || vibe === "event";
  const bgPage = isDark ? "#0f172a" : "#fafafa";
  const bgCard = isDark ? "#1e293b" : "#ffffff";
  const lineCol = isDark ? "#334155" : "#e5e7eb";
  const textCol = isDark ? "#475569" : "#d1d5db";

  // Per-template layout choices (different structures, not just colors)
  const layouts: Record<string, ReactElement> = {
    // ─── COACH PREMIUM — Split hero (image + text) + 3 phases + CTA ─────────
    "coach-premium": (
      <div className="flex flex-col gap-1.5">
        {/* Hero split: image left, text right */}
        <div className="rounded-md p-2 flex gap-1.5" style={{ background: preview }}>
          <div className="w-1/3 aspect-[3/4] rounded-sm bg-white/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-white/70 text-[12px]">person</span>
          </div>
          <div className="flex-1 flex flex-col gap-1 justify-center">
            <div className="h-1 w-1/3 rounded-full" style={{ background: accent }} />
            <div className="h-1.5 rounded-full bg-white/90" />
            <div className="h-1.5 w-3/4 rounded-full bg-white/90" />
            <div className="h-1 w-2/3 rounded-full bg-white/50 mt-0.5" />
            <div className="h-3 w-1/2 rounded mt-1" style={{ background: accent }} />
          </div>
        </div>
        {/* 3 phase boxes */}
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 rounded p-1.5 flex flex-col gap-0.5" style={{ background: bgCard, border: `1px solid ${lineCol}` }}>
              <div className="w-2 h-2 rounded-full mx-auto" style={{ background: accent }} />
              <div className="h-0.5 rounded-full mx-auto w-2/3" style={{ background: textCol }} />
              <div className="h-0.5 rounded-full mx-auto w-3/4" style={{ background: textCol }} />
            </div>
          ))}
        </div>
        {/* Pricing card */}
        <div className="rounded p-2 flex flex-col items-center gap-1" style={{ background: bgCard, border: `2px solid ${accent}` }}>
          <div className="h-1 w-1/4 rounded-full" style={{ background: accent }} />
          <div className="h-2 w-1/3 rounded" style={{ background: primary }} />
          <div className="h-2 w-2/3 rounded mt-0.5" style={{ background: accent }} />
        </div>
      </div>
    ),

    // ─── LANCEMENT EXPRESS — Big hero + countdown + bonus stack ─────────────
    "lancement-express": (
      <div className="flex flex-col gap-1.5">
        {/* Hero with big CTA */}
        <div className="rounded-md p-2 flex flex-col gap-1 items-center" style={{ background: preview }}>
          <div className="h-1 w-1/4 rounded-full bg-white/40" />
          <div className="h-1.5 w-3/4 rounded-full bg-white/90" />
          <div className="h-1.5 w-2/3 rounded-full bg-white/90" />
          <div className="h-3 w-1/2 rounded-full mt-1 flex items-center justify-center" style={{ background: "#facc15" }}>
            <span className="material-symbols-outlined text-[8px] text-red-700">local_fire_department</span>
          </div>
        </div>
        {/* Countdown row */}
        <div className="flex gap-1 justify-center">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-5 h-6 rounded flex items-center justify-center text-[6px] font-bold" style={{ background: primary, color: "#fff" }}>
              48
            </div>
          ))}
        </div>
        {/* Bonus stack */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded p-1.5 flex items-center justify-between gap-1" style={{ background: bgCard, border: `1px solid ${accent}` }}>
            <div className="flex items-center gap-1 flex-1">
              <span className="material-symbols-outlined text-[10px]" style={{ color: primary }}>card_giftcard</span>
              <div className="h-0.5 flex-1 rounded-full" style={{ background: textCol }} />
            </div>
            <div className="h-1 w-6 rounded-full" style={{ background: primary }} />
          </div>
        ))}
      </div>
    ),

    // ─── SAAS TECH — Hero with screenshot + logo bar + features grid ────────
    "saas-tech": (
      <div className="flex flex-col gap-1.5">
        {/* Hero with screenshot */}
        <div className="rounded-md p-2 flex flex-col gap-1" style={{ background: preview }}>
          <div className="h-1 w-1/4 rounded-full bg-white/40 mx-auto" />
          <div className="h-1.5 w-2/3 rounded-full bg-white/90 mx-auto" />
          <div className="h-3 w-1/3 rounded-full mx-auto mt-0.5" style={{ background: accent }} />
          {/* Screenshot mockup */}
          <div className="aspect-[16/9] rounded-sm bg-white/95 mt-1 p-1 flex flex-col gap-0.5">
            <div className="flex gap-0.5">
              <div className="w-1 h-1 rounded-full bg-red-400" />
              <div className="w-1 h-1 rounded-full bg-yellow-400" />
              <div className="w-1 h-1 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 grid grid-cols-3 gap-0.5">
              <div className="rounded-sm" style={{ background: `${primary}40` }} />
              <div className="rounded-sm col-span-2" style={{ background: `${accent}30` }} />
            </div>
          </div>
        </div>
        {/* Logo bar */}
        <div className="flex justify-between gap-1 px-1">
          {["A", "B", "C", "D"].map((l) => (
            <div key={l} className="text-[6px] font-bold" style={{ color: textCol }}>{l}CORP</div>
          ))}
        </div>
        {/* 4-col features */}
        <div className="grid grid-cols-4 gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square rounded p-1 flex items-center justify-center" style={{ background: bgCard, border: `1px solid ${lineCol}` }}>
              <span className="material-symbols-outlined text-[10px]" style={{ color: primary }}>extension</span>
            </div>
          ))}
        </div>
      </div>
    ),

    // ─── BUSINESS B2B — Pro hero + 4 piliers + case study split ─────────────
    "business-b2b": (
      <div className="flex flex-col gap-1.5">
        {/* Hero pro */}
        <div className="rounded-md p-2 flex gap-1.5" style={{ background: preview }}>
          <div className="flex-1 flex flex-col gap-1 justify-center">
            <div className="h-1 w-1/4 rounded-full bg-white/40" />
            <div className="h-1.5 rounded-full bg-white/90" />
            <div className="h-1.5 w-3/4 rounded-full bg-white/90" />
            <div className="h-2.5 w-3/5 rounded mt-1" style={{ background: accent }} />
          </div>
          <div className="w-1/3 aspect-square rounded-sm bg-white/30" />
        </div>
        {/* 4 piliers */}
        <div className="grid grid-cols-4 gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded p-1 flex flex-col items-center gap-0.5" style={{ background: bgCard, border: `1px solid ${lineCol}` }}>
              <div className="text-[6px] font-bold" style={{ color: primary }}>0{i}</div>
              <div className="h-0.5 w-3/4 rounded-full" style={{ background: textCol }} />
            </div>
          ))}
        </div>
        {/* Case study split */}
        <div className="rounded p-1.5 flex gap-1.5" style={{ background: bgCard, border: `1px solid ${lineCol}` }}>
          <div className="w-1/3 aspect-square rounded-sm" style={{ background: `${primary}30` }} />
          <div className="flex-1 flex flex-col gap-0.5 justify-center">
            <div className="h-0.5 w-1/3 rounded-full" style={{ background: accent }} />
            <div className="h-1 rounded-full" style={{ background: textCol }} />
            <div className="h-0.5 w-2/3 rounded-full" style={{ background: textCol }} />
            <div className="h-0.5 w-3/4 rounded-full" style={{ background: textCol }} />
          </div>
        </div>
      </div>
    ),

    // ─── CRÉATIF — Soft hero + 3 image gallery + soft text ──────────────────
    "creatif": (
      <div className="flex flex-col gap-1.5">
        {/* Soft hero */}
        <div className="rounded-md p-2 flex flex-col items-center gap-1" style={{ background: preview }}>
          <div className="h-1 w-1/5 rounded-full bg-white/50" />
          <div className="h-2 w-2/3 rounded-full" style={{ background: "#7c2d12" }} />
          <div className="h-1 w-1/2 rounded-full bg-white/60" />
          <div className="h-3 w-1/3 rounded-full mt-1 bg-white" />
        </div>
        {/* 3-image gallery */}
        <div className="grid grid-cols-3 gap-1">
          {["i1", "i2", "i3"].map((i, idx) => (
            <div key={i} className="aspect-[3/4] rounded" style={{ background: `linear-gradient(135deg, ${palette[idx % palette.length]}80, ${palette[(idx + 1) % palette.length]}80)` }}>
              <div className="h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white/70 text-[10px]">image</span>
              </div>
            </div>
          ))}
        </div>
        {/* Soft text section */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="h-0.5 w-1/3 rounded-full" style={{ background: accent }} />
          <div className="h-1 w-1/2 rounded-full" style={{ background: textCol }} />
          <div className="h-0.5 w-2/3 rounded-full" style={{ background: textCol }} />
        </div>
      </div>
    ),

    // ─── WEBINAR LIVE — Dark hero + speaker bio + agenda timestamps ─────────
    "webinar-live": (
      <div className="flex flex-col gap-1.5" style={{ background: bgPage, padding: "4px", borderRadius: "6px" }}>
        {/* Hero event */}
        <div className="rounded-md p-2 flex flex-col items-center gap-1" style={{ background: preview }}>
          <div className="px-1.5 py-0.5 rounded-full text-[6px] font-bold text-white" style={{ background: "#dc2626" }}>● LIVE</div>
          <div className="h-1.5 w-3/4 rounded-full bg-white/90" />
          <div className="h-1 w-1/2 rounded-full bg-white/60" />
          <div className="h-2.5 w-2/5 rounded-full mt-1 bg-white" />
        </div>
        {/* Speaker bio split */}
        <div className="rounded p-1.5 flex gap-1.5" style={{ background: bgCard }}>
          <div className="w-1/4 aspect-[3/4] rounded" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }} />
          <div className="flex-1 flex flex-col gap-0.5 justify-center">
            <div className="h-0.5 w-1/3 rounded-full" style={{ background: accent }} />
            <div className="h-1 w-2/3 rounded-full bg-white/90" />
            <div className="h-0.5 rounded-full" style={{ background: textCol }} />
            <div className="h-0.5 w-3/4 rounded-full" style={{ background: textCol }} />
          </div>
        </div>
        {/* Agenda with timestamps */}
        <div className="flex flex-col gap-0.5">
          {["19:00", "19:15", "19:35", "20:00"].map((t) => (
            <div key={t} className="flex items-center gap-1.5 rounded px-1.5 py-1" style={{ background: bgCard }}>
              <div className="text-[6px] font-bold" style={{ color: accent }}>{t}</div>
              <div className="h-0.5 flex-1 rounded-full" style={{ background: textCol }} />
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div
      className="w-full h-full p-3 flex items-center justify-center"
      style={{ background: bgPage }}
    >
      <div className="w-full max-w-[200px]">
        {layouts[variant] ?? layouts["coach-premium"]}
      </div>
    </div>
  );
}
