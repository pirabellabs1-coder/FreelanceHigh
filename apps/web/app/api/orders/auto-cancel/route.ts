import { NextResponse } from "next/server";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";
import { orderStore } from "@/lib/dev/data-store";
import { prisma } from "@/lib/prisma";

const THREE_DAYS_MS = 72 * 60 * 60 * 1000;

export async function POST() {
  try {
    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      const cancelled = orderStore.autoCancelStale();
      return NextResponse.json({ cancelled, count: cancelled.length });
    }

    // Prisma: find and cancel stale orders
    const cutoff = new Date(Date.now() - THREE_DAYS_MS);
    const staleOrders = await prisma.order.findMany({
      where: {
        status: "EN_ATTENTE",
        createdAt: { lt: cutoff },
      },
      select: { id: true },
    });

    if (staleOrders.length === 0) {
      return NextResponse.json({ cancelled: [], count: 0 });
    }

    const ids = staleOrders.map((o) => o.id);
    await prisma.order.updateMany({
      where: { id: { in: ids } },
      data: { status: "ANNULE", updatedAt: new Date() },
    });

    return NextResponse.json({ cancelled: ids, count: ids.length });
  } catch (error) {
    console.error("[API /orders/auto-cancel]", error);
    return NextResponse.json({ error: "Erreur auto-cancel" }, { status: 500 });
  }
}
