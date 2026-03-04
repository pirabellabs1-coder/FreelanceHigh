"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  RotateCcw,
  Square,
  Camera,
  Keyboard,
  Share2,
  FolderOpen,
  CheckCircle2,
  Clock3,
  Zap,
  Coffee,
  Activity,
  Play,
  Pause,
} from "lucide-react";

// --- Types ---
type TimerState = "running" | "paused" | "stopped";

interface Session {
  id: string;
  label: string;
  start: string;
  end: string;
  duration: string;
  amount: number;
  status: "approved" | "in_progress";
}

// --- Static Data ---
const SESSIONS: Session[] = [
  {
    id: "s1",
    label: "Design System - Composants Boutons",
    start: "09:00",
    end: "10:30",
    duration: "1h30m",
    amount: 97.5,
    status: "approved",
  },
  {
    id: "s2",
    label: "Recherche Iconographie",
    start: "10:45",
    end: "12:15",
    duration: "1h30m",
    amount: 97.5,
    status: "in_progress",
  },
];

// --- Helpers ---
function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatSeconds(total: number): { h: string; m: string; s: string } {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return { h: pad(h), m: pad(m), s: pad(s) };
}

// Initial elapsed time in seconds: 01:42:15
const INITIAL_SECONDS = 1 * 3600 + 42 * 60 + 15;

// --- Main Component ---
export default function ProductivitePage() {
  const [timerState, setTimerState] = useState<TimerState>("running");
  const [elapsed, setElapsed] = useState(INITIAL_SECONDS);
  const [captureEnabled, setCaptureEnabled] = useState(true);
  const [showBreakBanner, setShowBreakBanner] = useState(true);
  const [breakTaken, setBreakTaken] = useState(false);

  // Countdown / count-up tick
  useEffect(() => {
    if (timerState !== "running") return;
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerState]);

  const handleReset = useCallback(() => {
    setElapsed(0);
    setTimerState("stopped");
    setBreakTaken(false);
    setShowBreakBanner(true);
  }, []);

  const handlePauseResume = useCallback(() => {
    setTimerState((prev) => (prev === "running" ? "paused" : "running"));
  }, []);

  const handleStop = useCallback(() => {
    setTimerState("stopped");
  }, []);

  const handleBreak = useCallback(() => {
    setBreakTaken(true);
    setShowBreakBanner(false);
    setTimerState("paused");
  }, []);

  const { h, m, s } = formatSeconds(elapsed);

  const isRunning = timerState === "running";
  const isPaused = timerState === "paused";

  return (
    <div className="max-w-full space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Link href="/dashboard" className="hover:text-primary transition-colors">
          Projets
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          Session de Focus
        </span>
      </nav>

      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Mode Focus
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Suivi du temps en temps réel pour{" "}
            <span className="text-slate-700 dark:text-slate-300 font-semibold">
              Client XYZ
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-background-dark/50 border border-slate-200 dark:border-border-dark rounded-lg text-sm font-semibold hover:shadow-sm transition-all">
            <FolderOpen className="w-4 h-4" />
            Détails Projet
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0e7c66] text-white rounded-lg text-sm font-semibold shadow-lg shadow-[#0e7c66]/20 hover:bg-[#0a6454] transition-all">
            <Share2 className="w-4 h-4" />
            Partager au Client
          </button>
        </div>
      </header>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — Timer + Sessions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timer Card */}
          <div className="bg-white dark:bg-background-dark/50 border border-slate-200 dark:border-border-dark rounded-2xl p-8 shadow-sm">
            {/* Badge */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold",
                    isRunning
                      ? "bg-[#0e7c66]/15 text-[#0e7c66]"
                      : isPaused
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  )}
                >
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      isRunning
                        ? "bg-[#0e7c66] animate-pulse"
                        : isPaused
                        ? "bg-amber-500"
                        : "bg-slate-400"
                    )}
                  />
                  {isRunning
                    ? "Session de Travail Intense"
                    : isPaused
                    ? "Session en Pause"
                    : "Session Arrêtée"}
                </span>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
            </div>

            {/* Timer Display */}
            <div className="flex items-center justify-center gap-3 mb-10">
              {/* Hours */}
              <div className="flex flex-col items-center gap-2">
                <div className="bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-border-dark rounded-xl px-5 py-4 min-w-[90px] text-center">
                  <span className="text-5xl font-black tabular-nums tracking-tight text-slate-800 dark:text-white font-mono">
                    {h}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Heures
                </span>
              </div>

              {/* Separator */}
              <span
                className={cn(
                  "text-4xl font-black text-slate-300 dark:text-slate-600 mb-6 select-none",
                  isRunning && "animate-pulse"
                )}
              >
                :
              </span>

              {/* Minutes */}
              <div className="flex flex-col items-center gap-2">
                <div className="bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-border-dark rounded-xl px-5 py-4 min-w-[90px] text-center">
                  <span className="text-5xl font-black tabular-nums tracking-tight text-slate-800 dark:text-white font-mono">
                    {m}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Minutes
                </span>
              </div>

              {/* Separator */}
              <span
                className={cn(
                  "text-4xl font-black text-slate-300 dark:text-slate-600 mb-6 select-none",
                  isRunning && "animate-pulse"
                )}
              >
                :
              </span>

              {/* Seconds */}
              <div className="flex flex-col items-center gap-2">
                <div className="bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-border-dark rounded-xl px-5 py-4 min-w-[90px] text-center">
                  <span className="text-5xl font-black tabular-nums tracking-tight text-[#0e7c66] font-mono">
                    {s}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Secondes
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              {/* Reset */}
              <button
                onClick={handleReset}
                title="Réinitialiser"
                className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-border-dark flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {/* Pause / Play — main action */}
              <button
                onClick={handlePauseResume}
                title={isRunning ? "Mettre en pause" : "Reprendre"}
                className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-200",
                  isRunning
                    ? "bg-[#0e7c66] hover:bg-[#0a6454] shadow-[#0e7c66]/30 text-white"
                    : "bg-amber-500 hover:bg-amber-600 shadow-amber-500/30 text-white"
                )}
              >
                {isRunning ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 translate-x-0.5" />
                )}
              </button>

              {/* Stop */}
              <button
                onClick={handleStop}
                title="Arrêter la session"
                className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 flex items-center justify-center text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
              >
                <Square className="w-5 h-5" />
              </button>
            </div>

            {/* Timer status label */}
            <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-5 font-medium">
              {isRunning
                ? "Chronomètre en cours — Appuyez sur pause pour suspendre"
                : isPaused
                ? "Session suspendue — Appuyez sur play pour reprendre"
                : "Session arrêtée — Appuyez sur play pour démarrer"}
            </p>
          </div>

          {/* Daily Sessions */}
          <div className="bg-white dark:bg-background-dark/50 border border-slate-200 dark:border-border-dark rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-border-dark/60 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 dark:text-slate-100">
                Sessions de la journée
              </h2>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Total :{" "}
                <span className="text-[#0e7c66] font-bold">
                  €
                  {SESSIONS.reduce((acc, s) => acc + s.amount, 0).toFixed(2)}
                </span>
              </span>
            </div>

            <ul className="divide-y divide-slate-100 dark:divide-border-dark/60">
              {SESSIONS.map((session) => (
                <li
                  key={session.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors"
                >
                  {/* Left */}
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                        session.status === "approved"
                          ? "bg-[#0e7c66]/10 text-[#0e7c66]"
                          : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      )}
                    >
                      {session.status === "approved" ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Clock3 className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                        {session.label}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <Clock3 className="w-3 h-3" />
                        {session.start} – {session.end}
                        <span className="text-slate-300 dark:text-slate-600">
                          ·
                        </span>
                        {session.duration}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-3 sm:flex-shrink-0">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      €{session.amount.toFixed(2)}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold",
                        session.status === "approved"
                          ? "bg-[#0e7c66]/10 text-[#0e7c66]"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      )}
                    >
                      {session.status === "approved" ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Approuvé
                        </>
                      ) : (
                        <>
                          <Zap className="w-3 h-3" />
                          En cours
                        </>
                      )}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT — Proof of work + Pause suggestion */}
        <div className="space-y-6">
          {/* Proof of Work Card */}
          <div className="bg-white dark:bg-background-dark/50 border border-slate-200 dark:border-border-dark rounded-2xl shadow-sm overflow-hidden">
            {/* Card Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-border-dark/60 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                Preuves de travail
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0e7c66]/15 text-[#0e7c66]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0e7c66] animate-pulse" />
                ACTIF
              </span>
            </div>

            <div className="p-5 space-y-5">
              {/* Capture toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0e7c66]/10 flex items-center justify-center text-[#0e7c66]">
                    <Camera className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Capture d&apos;écran (auto)
                  </span>
                </div>
                {/* Toggle switch */}
                <button
                  onClick={() => setCaptureEnabled((v) => !v)}
                  className={cn(
                    "relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none",
                    captureEnabled ? "bg-[#0e7c66]" : "bg-slate-200 dark:bg-slate-700"
                  )}
                  aria-pressed={captureEnabled}
                  aria-label="Activer/désactiver la capture d'écran"
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200",
                      captureEnabled ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              {/* Keyboard activity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Keyboard className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Niveau d&apos;activité clavier
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#0e7c66]">85%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden ml-10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0e7c66] to-emerald-400 transition-all duration-700"
                    style={{ width: "85%" }}
                  />
                </div>
              </div>

              {/* Screenshot preview */}
              <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-black/20 overflow-hidden">
                <div className="flex flex-col items-center justify-center py-8 gap-2 text-slate-400 dark:text-slate-600">
                  <Activity className="w-8 h-8" />
                  <span className="text-xs font-medium">
                    Dernière capture : il y a 4 min
                  </span>
                  <span className="text-[10px] text-slate-300 dark:text-slate-700">
                    Prochaine dans 6 min
                  </span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-[#0e7c66]/5 border border-[#0e7c66]/20">
                <Share2 className="w-3.5 h-3.5 text-[#0e7c66] mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Captures partagées automatiquement avec le client sur ce
                  contrat
                </p>
              </div>
            </div>
          </div>

          {/* Break suggestion card */}
          {showBreakBanner && !breakTaken && (
            <div className="bg-white dark:bg-background-dark/50 border border-amber-200 dark:border-amber-800/40 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-amber-100 dark:border-amber-800/30 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Coffee className="w-3.5 h-3.5" />
                </div>
                <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  Pause suggérée
                </h2>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Vous travaillez depuis{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    1h42
                  </span>{" "}
                  sans pause. Une pause de{" "}
                  <span className="font-bold">5 min</span> améliorerait votre
                  productivité.
                </p>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleBreak}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0e7c66] text-white rounded-lg text-sm font-bold hover:bg-[#0a6454] transition-all shadow-sm shadow-[#0e7c66]/20"
                  >
                    <Coffee className="w-4 h-4" />
                    Prendre une pause
                  </button>
                  <button
                    onClick={() => setShowBreakBanner(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-border-dark text-slate-500 dark:text-slate-400 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                  >
                    Ignorer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Break taken confirmation */}
          {breakTaken && (
            <div className="bg-white dark:bg-background-dark/50 border border-[#0e7c66]/30 rounded-2xl shadow-sm p-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0e7c66]/10 flex items-center justify-center text-[#0e7c66] flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Pause enregistrée
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  Revenez dans 5 minutes pour reprendre votre session.
                </p>
              </div>
            </div>
          )}

          {/* Earnings Summary */}
          <div className="bg-white dark:bg-background-dark/50 border border-slate-200 dark:border-border-dark rounded-2xl shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">
              Résumé de la journée
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Temps total travaillé
                </span>
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {h}h{m}m
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Sessions complétées
                </span>
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {SESSIONS.length}
                </span>
              </div>
              <div className="h-px bg-slate-100 dark:bg-border-dark/60" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Revenus générés
                </span>
                <span className="text-base font-black text-[#0e7c66]">
                  €{SESSIONS.reduce((acc, s) => acc + s.amount, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
