import { NextRequest, NextResponse } from "next/server";
import { trackingStore } from "@/lib/tracking/tracking-store";
import type { TrackingStatsQuery } from "@/lib/tracking/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const query: TrackingStatsQuery = {
      period: (searchParams.get("period") as TrackingStatsQuery["period"]) || "30d",
      space: (searchParams.get("space") as TrackingStatsQuery["space"]) || undefined,
      userId: searchParams.get("userId") || undefined,
      entityType: searchParams.get("entityType") || undefined,
      entityId: searchParams.get("entityId") || undefined,
    };

    const stats = trackingStore.getStats(query);

    return NextResponse.json({
      ...stats,
      activeSessions: trackingStore.getActiveSessions(),
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
