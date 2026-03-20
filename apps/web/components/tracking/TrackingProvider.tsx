"use client";

import { usePageTracker } from "@/lib/tracking/usePageTracker";

// Tracking enabled in all environments — dev data goes to JSON files, prod to DB
const TRACKING_ENABLED = true;

function TrackingActive({ children }: { children: React.ReactNode }) {
  usePageTracker();
  return <>{children}</>;
}

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  if (!TRACKING_ENABLED) return <>{children}</>;
  return <TrackingActive>{children}</TrackingActive>;
}
