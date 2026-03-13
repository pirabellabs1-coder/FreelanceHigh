import { NextRequest, NextResponse } from "next/server";
import { trackingStore } from "@/lib/tracking/tracking-store";
import type { TrackingEvent } from "@/lib/tracking/types";

// Rate limiting simple en mémoire
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const MAX_PER_MIN = 100;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= MAX_PER_MIN) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await req.json();
    const events: TrackingEvent[] = body.events;

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: "No events provided" }, { status: 400 });
    }

    // Limit batch size
    const batch = events.slice(0, 50);
    trackingStore.recordEvents(batch);

    return NextResponse.json({ ok: true, recorded: batch.length });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
