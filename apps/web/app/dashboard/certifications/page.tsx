"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Data constants
// ---------------------------------------------------------------------------

const ANSWERS = [
  {
    id: "a",
    label: "Write-through caching avec Redis Cluster",
  },
  {
    id: "b",
    label: "Cache-aside avec TTL dynamique basé sur la fréquence d'accès",
  },
  {
    id: "c",
    label: "Client-side caching uniquement pour les données statiques",
  },
  {
    id: "d",
    label: "Read-through caching avec synchronisation périodique SQL",
  },
];

const AI_METRICS = [
  {
    key: "eye",
    label: "Eye Tracking",
    value: "Stable",
    color: "text-emerald-400",
    icon: "visibility",
  },
  {
    key: "audio",
    label: "Audio Noise",
    value: "Low",
    color: "text-amber-400",
    icon: "mic",
  },
  {
    key: "tab",
    label: "Tab Focus",
    value: "Locked",
    color: "text-emerald-400",
    icon: "lock",
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Pentagon radar chart drawn in pure SVG — no external dependency required */
function RadarChart() {
  const cx = 96;
  const cy = 96;
  const r = 72;

  // Five vertices of a regular pentagon starting from the top
  const angleOffset = -Math.PI / 2; // top-center
  const vertices = Array.from({ length: 5 }, (_, i) => {
    const angle = angleOffset + (i * 2 * Math.PI) / 5;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });

  const toPath = (pts: { x: number; y: number }[], scale = 1) =>
    pts
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"} ${cx + (p.x - cx) * scale} ${cy + (p.y - cy) * scale}`
      )
      .join(" ") + " Z";

  // Filled area represents the skill profile
  const skillPoints = [
    { scale: 0.92 }, // BACKEND — near full
    { scale: 0.78 }, // FRONTEND
    { scale: 0.65 }, // DEVOPS
    { scale: 0.55 }, // MOBILE
    { scale: 0.70 }, // AI/ML
  ];

  const skillPath = vertices
    .map((v, i) => {
      const s = skillPoints[i].scale;
      const x = cx + (v.x - cx) * s;
      const y = cy + (v.y - cy) * s;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ") + " Z";

  const axisLabels = ["BACKEND", "FRONTEND", "DEVOPS", "MOBILE", "AI/ML"];
  const labelOffset = 18;

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 192 192" className="w-full h-full" aria-label="Radar de compétences">
        {/* Grid rings */}
        {[1, 0.8, 0.6, 0.4, 0.2].map((scale, idx) => (
          <path
            key={idx}
            d={toPath(vertices, scale)}
            fill="none"
            stroke="#1e3a5f"
            strokeWidth="1"
            opacity={0.5}
          />
        ))}

        {/* Axis lines */}
        {vertices.map((v, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={v.x}
            y2={v.y}
            stroke="#1e3a5f"
            strokeWidth="1"
            opacity={0.4}
          />
        ))}

        {/* Skill area */}
        <path d={skillPath} fill="#3b82f6" fillOpacity={0.25} stroke="#3b82f6" strokeWidth="1.5" />

        {/* Skill dots */}
        {vertices.map((v, i) => {
          const s = skillPoints[i].scale;
          const x = cx + (v.x - cx) * s;
          const y = cy + (v.y - cy) * s;
          return (
            <circle key={i} cx={x} cy={y} r={3} fill="#3b82f6" />
          );
        })}

        {/* Axis labels */}
        {vertices.map((v, i) => {
          const angle = angleOffset + (i * 2 * Math.PI) / 5;
          const lx = cx + (r + labelOffset) * Math.cos(angle);
          const ly = cy + (r + labelOffset) * Math.sin(angle);
          return (
            <text
              key={i}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="7"
              fontWeight="700"
              fill="#64748b"
              letterSpacing="0.05em"
            >
              {axisLabels[i]}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

/** Timer progress bar */
function TimerBar({ percent }: { percent: number }) {
  return (
    <div className="w-full h-2.5 bg-[#0d1117] rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500 rounded-full transition-all duration-1000"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

/** Single answer option row */
function AnswerOption({
  id,
  label,
  selected,
  onSelect,
}: {
  id: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      htmlFor={`answer-${id}`}
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all",
        selected
          ? "border-blue-500/60 bg-blue-500/10"
          : "border-[#30363d] hover:border-blue-500/30 hover:bg-blue-500/5"
      )}
      onClick={onSelect}
    >
      {/* Custom radio */}
      <span
        className={cn(
          "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
          selected ? "border-blue-500" : "border-[#30363d]"
        )}
      >
        {selected && (
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 block" />
        )}
      </span>
      <input
        id={`answer-${id}`}
        type="radio"
        name="exam-question"
        className="sr-only"
        checked={selected}
        onChange={onSelect}
      />
      <span
        className={cn(
          "text-sm leading-relaxed font-medium",
          selected ? "text-white font-semibold" : "text-slate-300"
        )}
      >
        {label}
      </span>
    </label>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export default function CertificationsPage() {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("b");

  return (
    /* Override the dashboard layout background for this dark-themed page */
    <div className="min-h-full -m-8 bg-[#0d1117] text-slate-100">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-8">

        {/* ---- Breadcrumb ---- */}
        <nav className="flex items-center gap-2 mb-6 text-sm font-medium flex-wrap">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-300 transition-colors">
            Accueil
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-emerald-400">Certification Fullstack Expert</span>
        </nav>

        {/* ---- Exam Header Card ---- */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight">
                Examen Expert Vérifié
              </h1>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-500/30">
                SURVEILLÉ PAR IA
              </span>
            </div>
            <p className="text-slate-400 text-sm md:text-base">
              Développement Fullstack, Architecture &amp; Algorithmique
            </p>
          </div>

          <div className="flex gap-3 flex-shrink-0">
            <button
              className="flex items-center gap-2 h-10 px-5 rounded-lg border border-[#30363d] text-slate-300 text-sm font-semibold hover:border-red-500/50 hover:text-red-400 transition-all"
              aria-label="Quitter l'examen"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              Quitter
            </button>
            <button
              className="h-10 px-5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all"
              aria-label="Soumettre l'examen"
            >
              Soumettre
            </button>
          </div>
        </div>

        {/* ---- Main 2-column grid ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ======================== LEFT COLUMN ======================== */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Question card */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8">
              {/* Question header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-xl font-bold">Question 14 sur 25</h2>
                <div className="flex items-center gap-2" aria-label="Progression">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Répondue" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Répondue" />
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" title="En cours" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#30363d]" title="À venir" />
                </div>
              </div>

              {/* Question body */}
              <p className="text-slate-200 text-base md:text-lg leading-relaxed mb-8">
                Considérant une architecture microservices avec une forte charge, quelle stratégie de
                mise en cache recommanderiez-vous pour minimiser la latence tout en garantissant la
                cohérence éventuelle des données utilisateur ?
              </p>

              {/* Answer options */}
              <div className="space-y-3" role="radiogroup" aria-label="Options de réponse">
                {ANSWERS.map((answer) => (
                  <AnswerOption
                    key={answer.id}
                    id={answer.id}
                    label={answer.label}
                    selected={selectedAnswer === answer.id}
                    onSelect={() => setSelectedAnswer(answer.id)}
                  />
                ))}
              </div>
            </div>

            {/* AI Surveillance card */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-400 text-xl">visibility</span>
                  Analyse de Surveillance IA
                </h3>
                <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded">
                  SYSTEM_ACTIVE: 98.4% CONFIDENCE
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {AI_METRICS.map((m) => (
                  <div
                    key={m.key}
                    className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-slate-500 text-sm">{m.icon}</span>
                      <p className="text-[10px] text-slate-500 uppercase tracking-tight font-semibold">
                        {m.label}
                      </p>
                    </div>
                    <p className={cn("font-bold text-sm", m.color)}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ======================== RIGHT COLUMN ======================== */}
          <div className="flex flex-col gap-6">

            {/* Timer card */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
              <div className="flex justify-between items-center mb-3">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  Temps restant
                </p>
                <p className="text-blue-400 font-mono font-bold text-xl" aria-live="polite">
                  18:42
                </p>
              </div>
              <TimerBar percent={65} />
              <p className="text-slate-500 text-xs text-right mt-1.5">65% du temps écoulé</p>
            </div>

            {/* Skills Radar card */}
            <div className="bg-[#0d1117] border border-blue-500/20 rounded-xl p-6 relative overflow-hidden">
              {/* Decorative background icon */}
              <span
                className="material-symbols-outlined absolute top-3 right-3 text-6xl text-blue-500/10 select-none"
                aria-hidden="true"
              >
                analytics
              </span>

              <h4 className="text-white font-bold mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400 text-xl">radar</span>
                Radar de Compétences
              </h4>

              <RadarChart />

              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center bg-[#161b22] border border-[#30363d] px-3 py-2 rounded-lg">
                  <span className="text-xs text-slate-400">Centile Global</span>
                  <span className="text-sm font-bold text-blue-400">Top 4%</span>
                </div>
                <div className="flex justify-between items-center bg-[#161b22] border border-[#30363d] border-l-2 border-l-blue-500 px-3 py-2 rounded-lg">
                  <span className="text-xs text-slate-200 font-medium">Badge &apos;Expert&apos;</span>
                  <span className="material-symbols-outlined text-emerald-400 text-base">verified</span>
                </div>
              </div>
            </div>

            {/* AI Camera card */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
              <h4 className="text-white font-bold mb-4">Vue Caméra IA</h4>

              {/* Camera viewport */}
              <div className="aspect-video bg-[#0d1117] rounded-lg relative overflow-hidden ring-1 ring-blue-500/20">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 pointer-events-none" />

                {/* Camera placeholder — stylized grid instead of external image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-8 grid-rows-5 gap-px w-full h-full opacity-5">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div key={i} className="bg-blue-400 rounded-sm" />
                    ))}
                  </div>
                  <span
                    className="material-symbols-outlined absolute text-7xl text-slate-700"
                    aria-hidden="true"
                  >
                    person
                  </span>
                </div>

                {/* REC badge */}
                <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse block" />
                  <span className="text-[9px] text-white font-mono bg-black/50 px-1.5 py-0.5 rounded tracking-wide">
                    REC 1080P
                  </span>
                </div>

                {/* Face detection brackets */}
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                  {/* Top-left corner */}
                  <span className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-blue-400/70 rounded-tl-md" />
                  {/* Top-right corner */}
                  <span className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-blue-400/70 rounded-tr-md" />
                  {/* Bottom-left corner */}
                  <span className="absolute bottom-8 left-4 w-7 h-7 border-b-2 border-l-2 border-blue-400/70 rounded-bl-md" />
                  {/* Bottom-right corner */}
                  <span className="absolute bottom-8 right-4 w-7 h-7 border-b-2 border-r-2 border-blue-400/70 rounded-br-md" />
                  {/* Center reticle */}
                  <span className="w-24 h-24 rounded-full border border-blue-400/25 opacity-60" />
                </div>

                {/* Bottom status bar */}
                <div className="absolute bottom-2 left-2 right-2 z-20 flex justify-between items-end">
                  <span className="text-[10px] text-white/80 font-mono">
                    FACE_RECOGNIZED: OK
                  </span>
                  {/* Audio waveform visual */}
                  <div className="flex items-end gap-0.5 h-4 px-1.5 bg-blue-500/20 rounded">
                    {[1, 2, 3, 1.5, 2.5].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-blue-400 rounded-full"
                        style={{ height: `${h * 4}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-slate-600 text-[10px] mt-3 leading-snug italic">
                La surveillance biométrique garantit l&apos;intégrité de votre certification auprès
                des clients internationaux.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
