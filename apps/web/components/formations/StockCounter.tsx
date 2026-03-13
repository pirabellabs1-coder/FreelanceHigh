"use client";

interface StockCounterProps {
  current: number;
  max: number;
  label?: string;
  className?: string;
}

export function StockCounter({ current, max, label, className = "" }: StockCounterProps) {
  const remaining = max - current;
  const pct = Math.min(100, (current / max) * 100);
  const isLow = remaining <= Math.ceil(max * 0.1);
  const isCritical = remaining <= 3;

  if (remaining <= 0) {
    return (
      <div className={`flex items-center gap-2 text-slate-500 ${className}`}>
        <span className="material-symbols-outlined text-sm">block</span>
        <span className="text-sm font-semibold">{label || "Rupture de stock"}</span>
      </div>
    );
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className={`font-bold ${isCritical ? "text-red-600 dark:text-red-400 animate-pulse" : isLow ? "text-orange-600 dark:text-orange-400" : "text-slate-700 dark:text-slate-300"}`}>
          {label || `Plus que ${remaining} exemplaire${remaining > 1 ? "s" : ""} !`}
        </span>
        <span className="text-xs text-slate-500">{current}/{max}</span>
      </div>
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isCritical
              ? "bg-red-500"
              : isLow
                ? "bg-orange-500"
                : "bg-primary"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
