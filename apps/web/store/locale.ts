"use client";

import { create } from "zustand";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export type Locale = "fr" | "en";

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()((set) => ({
  locale: (typeof document !== "undefined"
    ? (document.cookie
        .split("; ")
        .find((c) => c.startsWith("locale="))
        ?.split("=")[1] as Locale) ?? "fr"
    : "fr"),
  setLocale: (locale: Locale) => {
    document.cookie = `locale=${locale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    set({ locale });
  },
}));

export function useChangeLocale() {
  const router = useRouter();
  const setLocale = useLocaleStore((s) => s.setLocale);

  return useCallback(
    (locale: Locale) => {
      setLocale(locale);
      router.refresh();
    },
    [setLocale, router]
  );
}
