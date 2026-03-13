"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  endsAt: string;
  className?: string;
  onExpired?: () => void;
}

export function CountdownTimer({ endsAt, className = "", onExpired }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(endsAt));

  useEffect(() => {
    const timer = setInterval(() => {
      const left = getTimeLeft(endsAt);
      setTimeLeft(left);
      if (left.total <= 0) {
        clearInterval(timer);
        onExpired?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endsAt, onExpired]);

  if (timeLeft.total <= 0) return null;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="material-symbols-outlined text-sm text-red-500">timer</span>
      <div className="flex items-center gap-1">
        {timeLeft.days > 0 && (
          <TimeUnit value={timeLeft.days} label="j" />
        )}
        <TimeUnit value={timeLeft.hours} label="h" />
        <span className="text-red-400 font-bold text-xs">:</span>
        <TimeUnit value={timeLeft.minutes} label="m" />
        <span className="text-red-400 font-bold text-xs">:</span>
        <TimeUnit value={timeLeft.seconds} label="s" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <span className="inline-flex items-center bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded px-1.5 py-0.5 text-xs font-bold tabular-nums min-w-[36px] justify-center">
      {String(value).padStart(2, "0")}{label}
    </span>
  );
}

function getTimeLeft(endsAt: string) {
  const end = new Date(endsAt).getTime();
  const now = Date.now();
  const total = Math.max(0, end - now);

  return {
    total,
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}
