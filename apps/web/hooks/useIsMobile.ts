"use client";

import { useMediaQuery } from "./useMediaQuery";

/** true when viewport < 640px (Tailwind `sm`) */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 639px)");
}

/** true when viewport < 1024px (Tailwind `lg`) */
export function useIsTablet(): boolean {
  return useMediaQuery("(max-width: 1023px)");
}
