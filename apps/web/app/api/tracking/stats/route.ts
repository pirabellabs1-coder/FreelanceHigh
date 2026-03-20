import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { trackingStore } from "@/lib/tracking/tracking-store";
import type { TrackingStatsQuery } from "@/lib/tracking/types";

export async function GET(req: NextRequest) {
  try {
    // Only admins can access tracking stats
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
    }

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
