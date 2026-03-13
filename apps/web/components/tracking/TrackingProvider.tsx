"use client";

import { usePageTracker } from "@/lib/tracking/usePageTracker";

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  usePageTracker();
  return <>{children}</>;
}
