import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import {
  getConfig,
  updateConfig,
} from "@/lib/admin/config-service";
import { createAuditLog } from "@/lib/admin/audit";

// GET /api/admin/config — Get platform configuration
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["admin", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
    }

    const config = await getConfig();
    return NextResponse.json({ config });
  } catch (error) {
    console.error("[API /admin/config GET]", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation de la configuration" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/config — Update platform configuration (deep merge)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["admin", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
    }

    const body = await request.json();
    const config = await updateConfig(body, session.user.id);

    // Create audit log for config change
    await createAuditLog({
      actorId: session.user.id,
      action: "config.updated",
      targetType: "platform_config",
      details: { updatedKeys: Object.keys(body) },
    }).catch((err) => console.error("[Config] Audit log error:", err));

    return NextResponse.json({
      success: true,
      message: "Configuration mise a jour",
      config,
    });
  } catch (error) {
    console.error("[API /admin/config PATCH]", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour de la configuration" },
      { status: 500 }
    );
  }
}
