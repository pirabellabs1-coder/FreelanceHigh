import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";
import { serviceStore } from "@/lib/dev/data-store";

// POST /api/services/[id]/track-view — Track a real service view
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      const service = serviceStore.getById(id);
      if (!service) {
        return NextResponse.json({ error: "Service introuvable" }, { status: 404 });
      }
      // Increment views counter in dev mode
      serviceStore.update(id, { views: (service.views || 0) + 1 });
      return NextResponse.json({ success: true });
    }

    // Production: create real ServiceView record
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) {
      return NextResponse.json({ error: "Service introuvable" }, { status: 404 });
    }

    await prisma.serviceView.create({
      data: {
        serviceId: id,
        userId: session?.user?.id || null,
        ip,
      },
    });

    // Update cached counter on service
    await prisma.service.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /services/[id]/track-view]", error);
    return NextResponse.json({ error: "Erreur tracking vue" }, { status: 500 });
  }
}
