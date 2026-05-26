import { NextRequest, NextResponse } from "next/server";
import { trackingStore } from "@/lib/tracking/tracking-store";
import type { TrackingEvent } from "@/lib/tracking/types";
import { getCountryFromRequest } from "@/lib/tracking/geo";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// Rate limiting simple en memoire
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const MAX_PER_MIN = 100;

// Deduplication: Map of recent event IDs with timestamp (TTL-based, 1 hour window)
const recentEventIds = new Map<string, number>();
const DEDUP_TTL = 60 * 60 * 1000; // 1 hour

// Server-side dedup for entity views: (sessionId|entityId) -> timestamp
// Avoid spamming MarketingEvent + viewsCount when client tracker mis-fires
const entityViewDedup = new Map<string, number>();
const ENTITY_VIEW_TTL = 30 * 60 * 1000; // 30 min

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

function isValidEvent(e: unknown): e is TrackingEvent {
  if (!e || typeof e !== "object") return false;
  const ev = e as Record<string, unknown>;
  return !!(ev.id && ev.type && ev.sessionId && ev.path && ev.timestamp);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await req.json();
    const events: TrackingEvent[] = body?.events;

    if (!Array.isArray(events) || events.length === 0) {
      // Return 200 with 0 recorded instead of 400 to avoid noisy client errors
      return NextResponse.json({ ok: true, recorded: 0 });
    }

    // Prune expired dedup entries (older than 1 hour)
    const now = Date.now();
    for (const [id, ts] of recentEventIds) {
      if (now - ts > DEDUP_TTL) recentEventIds.delete(id);
    }

    // Validate, deduplicate, stamp geoloc, and limit batch
    const country = getCountryFromRequest(req);
    const batch: TrackingEvent[] = [];
    for (const event of events.slice(0, 50)) {
      if (!isValidEvent(event)) continue;
      if (recentEventIds.has(event.id)) continue; // Skip duplicate

      recentEventIds.set(event.id, now);
      batch.push(country ? { ...event, country: event.country || country } : event);
    }

    if (batch.length > 0) {
      trackingStore.recordEvents(batch);

      // Increment pageViews in session for ACTUAL page_view events only (not duration markers)
      const sessionPageViews = new Map<string, number>();
      for (const ev of batch) {
        if (ev.type === "page_view" && !ev.metadata?._isDurationEvent) {
          sessionPageViews.set(ev.sessionId, (sessionPageViews.get(ev.sessionId) ?? 0) + 1);
        }
      }
      // Update session pageViews based on actual page_view events
      for (const [sessionId, count] of sessionPageViews) {
        const sessions = trackingStore.getSessions();
        const existing = sessions.find((s) => s.id === sessionId);
        if (existing) {
          trackingStore.upsertSession({
            ...existing,
            pageViews: existing.pageViews + count,
          });
        }
      }

      // ── Persist entity views in DB (Formation / DigitalProduct viewsCount + MarketingEvent) ──
      // Fire-and-forget: don't block the response if DB write fails
      void persistEntityViews(batch).catch((err) => {
        console.error("[tracking/event] persistEntityViews failed:", err);
      });
    }

    return NextResponse.json({ ok: true, recorded: batch.length });
  } catch {
    // Return 200 silently to avoid polluting client console
    return NextResponse.json({ ok: false, recorded: 0 });
  }
}

/**
 * Persist entity views in DB:
 * - Resolve each entityId to Formation or DigitalProduct
 * - Bulk-insert MarketingEvent rows (type: PAGE_VIEW)
 * - Atomically increment viewsCount on the matching model
 * Server-side dedup avoids spam from buggy clients.
 */
async function persistEntityViews(batch: TrackingEvent[]) {
  const now = Date.now();

  // Prune old dedup entries
  if (entityViewDedup.size > 5000) {
    for (const [k, ts] of entityViewDedup) {
      if (now - ts > ENTITY_VIEW_TTL) entityViewDedup.delete(k);
    }
  }

  // Collect entity-view events (not duration markers)
  const candidates = batch.filter(
    (e) =>
      e.entityId &&
      (e.type === "page_view" ||
        e.type === "service_viewed" ||
        e.type === "formation_viewed") &&
      !e.metadata?._isDurationEvent
  );
  if (candidates.length === 0) return;

  // Dedup per (sessionId, entityId) over 30min
  const fresh: TrackingEvent[] = [];
  for (const e of candidates) {
    const key = `${e.sessionId}:${e.entityId}`;
    const last = entityViewDedup.get(key);
    if (last && now - last < ENTITY_VIEW_TTL) continue;
    entityViewDedup.set(key, now);
    fresh.push(e);
  }
  if (fresh.length === 0) return;

  // Resolve entityIds → Formation or DigitalProduct
  const entityIds = [...new Set(fresh.map((e) => e.entityId!))];
  const [formations, products] = await Promise.all([
    prisma.formation.findMany({
      where: { id: { in: entityIds } },
      select: { id: true },
    }),
    prisma.digitalProduct.findMany({
      where: { id: { in: entityIds } },
      select: { id: true },
    }),
  ]);
  const formationIds = new Set(formations.map((f) => f.id));
  const productIds = new Set(products.map((p) => p.id));

  // Build MarketingEvent rows + per-entity increment count
  const formationIncrement = new Map<string, number>();
  const productIncrement = new Map<string, number>();
  const eventRows: Prisma.MarketingEventCreateManyInput[] = [];

  for (const e of fresh) {
    const id = e.entityId!;
    const isFormation = formationIds.has(id);
    const isProduct = productIds.has(id);
    if (!isFormation && !isProduct) continue;

    if (isFormation) {
      formationIncrement.set(id, (formationIncrement.get(id) ?? 0) + 1);
    } else {
      productIncrement.set(id, (productIncrement.get(id) ?? 0) + 1);
    }

    eventRows.push({
      type: "PAGE_VIEW",
      formationId: isFormation ? id : null,
      digitalProductId: isProduct ? id : null,
      userId: e.userId ?? null,
      metadata: {
        path: e.path,
        country: e.country ?? null,
        deviceType: e.deviceType,
        referrer: e.referrer ?? null,
        sessionId: e.sessionId,
      } as Prisma.InputJsonValue,
    });
  }
  if (eventRows.length === 0) return;

  // Persist all in parallel
  await Promise.all([
    prisma.marketingEvent.createMany({ data: eventRows }),
    ...[...formationIncrement.entries()].map(([id, count]) =>
      prisma.formation.update({
        where: { id },
        data: { viewsCount: { increment: count } },
      })
    ),
    ...[...productIncrement.entries()].map(([id, count]) =>
      prisma.digitalProduct.update({
        where: { id },
        data: { viewsCount: { increment: count } },
      })
    ),
  ]);
}
