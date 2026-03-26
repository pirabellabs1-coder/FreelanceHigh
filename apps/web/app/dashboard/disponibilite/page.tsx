"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDashboardStore, useToastStore } from "@/store/dashboard";

export default function DisponibilitePage() {
  const { availability, vacationMode, updateAvailability, toggleVacationMode, services } = useDashboardStore();
  const addToast = useToastStore((s) => s.addToast);
  const [toggling, setToggling] = useState(false);

  function handleToggleDay(day: number) {
    const slot = availability.find((a) => a.day === day);
    if (slot) {
      updateAvailability(day, { available: !slot.available });
      addToast("success", `${slot.dayName} ${slot.available ? "desactive" : "active"}`);
    }
  }

  function handleTimeChange(day: number, field: "startTime" | "endTime", value: string) {
    updateAvailability(day, { [field]: value });
  }

  async function handleVacation() {
    if (toggling) return;
    setToggling(true);
    const newMode = !vacationMode;
    try {
      await toggleVacationMode();
      if (newMode) {
        addToast("info", "Mode vacances active - Tous les services sont en pause");
      } else {
        addToast("success", "Mode vacances desactive - Vos services sont reactives");
      }
    } catch {
      addToast("error", "Erreur lors du changement de mode vacances");
    } finally {
      setToggling(false);
    }
  }

  const activeServices = services.filter((s) => s.status === "actif").length;
  const pausedServices = services.filter((s) => s.status === "pause").length;

  return (
    <div className="max-w-3xl w-full mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">Disponibilite</h2>
        <p className="text-slate-400 mt-1">Configurez vos jours et horaires de travail.</p>
      </div>

      {/* Vacation Mode */}
      <div className={cn(
        "rounded-xl p-6 border transition-all",
        vacationMode ? "bg-amber-500/5 border-amber-500/30" : "bg-background-dark/50 border-border-dark"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center",
              vacationMode ? "bg-amber-500/10 text-amber-400" : "bg-primary/10 text-primary"
            )}>
              <span className="material-symbols-outlined text-2xl">{vacationMode ? "beach_access" : "work"}</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Mode Vacances</h3>
              <p className="text-sm text-slate-400">
                {vacationMode
                  ? `Actif — ${pausedServices} service(s) en pause`
                  : `Inactif — ${activeServices} service(s) actif(s)`
                }
              </p>
            </div>
          </div>
          <button onClick={handleVacation}
            className={cn("relative w-14 h-7 rounded-full transition-colors",
              vacationMode ? "bg-amber-500" : "bg-border-dark"
            )}>
            <div className={cn("absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow",
              vacationMode ? "left-8" : "left-1"
            )} />
          </button>
        </div>
        {vacationMode && (
          <p className="text-xs text-amber-400 mt-4 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">warning</span>
            Tous vos services ont ete mis en pause. Desactivez le mode vacances pour les reactiver.
          </p>
        )}
      </div>

      {/* Calendar */}
      <div className="bg-background-dark/50 border border-border-dark rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border-dark">
          <h3 className="font-bold">Jours de travail</h3>
        </div>
        <div className="divide-y divide-border-dark">
          {availability.map((slot) => (
            <div key={slot.day} className={cn(
              "flex items-center gap-6 px-6 py-4 transition-colors",
              slot.available ? "hover:bg-primary/5" : "opacity-50"
            )}>
              {/* Toggle */}
              <button onClick={() => handleToggleDay(slot.day)}
                className={cn("relative w-11 h-6 rounded-full transition-colors flex-shrink-0",
                  slot.available ? "bg-primary" : "bg-border-dark"
                )}>
                <div className={cn("absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow",
                  slot.available ? "left-5.5" : "left-0.5"
                )} style={{ left: slot.available ? "22px" : "2px" }} />
              </button>

              {/* Day name */}
              <span className="w-24 text-sm font-bold">{slot.dayName}</span>

              {/* Time range */}
              {slot.available ? (
                <div className="flex items-center gap-2">
                  <input type="time" value={slot.startTime}
                    onChange={(e) => handleTimeChange(slot.day, "startTime", e.target.value)}
                    className="px-3 py-1.5 bg-neutral-dark border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" />
                  <span className="text-slate-500">a</span>
                  <input type="time" value={slot.endTime}
                    onChange={(e) => handleTimeChange(slot.day, "endTime", e.target.value)}
                    className="px-3 py-1.5 bg-neutral-dark border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" />
                </div>
              ) : (
                <span className="text-sm text-slate-500">Indisponible</span>
              )}

              {/* Status indicator */}
              <div className={cn("w-2.5 h-2.5 rounded-full ml-auto",
                slot.available ? "bg-emerald-400" : "bg-slate-500"
              )} />
            </div>
          ))}
        </div>
      </div>

      {/* Save info */}
      <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-1">
        <span className="material-symbols-outlined text-sm">info</span>
        Les modifications sont sauvegardees automatiquement.
      </p>
    </div>
  );
}
