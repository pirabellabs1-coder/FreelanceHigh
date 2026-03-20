import { NextResponse } from "next/server";
import { getMaintenanceState } from "@/lib/admin/config-service";

// GET /api/public/maintenance — Check maintenance mode status (no auth required)
export async function GET() {
  const state = await getMaintenanceState();
  return NextResponse.json(state, {
    headers: {
      // Don't cache maintenance status — must always be fresh
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
