import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";
import { orderStore } from "@/lib/dev/data-store";
import { createNotification } from "@/lib/notifications/service";

// POST /api/disputes/[id]/cancel — User cancels their own open dispute
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const { id } = await params;

    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      // Dev store: disputes are represented as orders with status "litige"
      const orders = orderStore.getAll();
      const order = orders.find(
        (o) => o.id === id && o.status === "litige"
      );
      if (!order) {
        return NextResponse.json({ error: "Litige introuvable ou non ouvert" }, { status: 404 });
      }
      if (order.clientId !== session.user.id) {
        return NextResponse.json({ error: "Seul le client ayant ouvert le litige peut l'annuler" }, { status: 403 });
      }

      const now = new Date().toISOString();
      orderStore.update(order.id, {
        status: "en_cours",
        timeline: [
          ...(order.timeline || []),
          {
            id: `t${Date.now()}`,
            type: "message",
            title: "Litige annule",
            description: "Le client a annule le litige. La commande reprend son cours normal.",
            timestamp: now,
          },
        ],
      });

      createNotification({
        userId: order.freelanceId,
        title: "Litige annule",
        message: `Le client a annule le litige concernant "${order.serviceTitle}". La commande reprend.`,
        type: "order",
        link: `/dashboard/commandes/${order.id}`,
      });
      createNotification({
        userId: order.clientId,
        title: "Litige annule",
        message: `Vous avez annule le litige concernant "${order.serviceTitle}".`,
        type: "order",
        link: `/client/commandes/${order.id}`,
      });

      return NextResponse.json({ success: true, message: "Litige annule avec succes" });
    }

    // ── Production: Prisma ──
    const { prisma } = await import("@/lib/prisma");

    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: {
        order: { select: { id: true, status: true, escrowStatus: true } },
        client: { select: { id: true, name: true } },
        freelance: { select: { id: true, name: true } },
      },
    });

    if (!dispute) {
      return NextResponse.json({ error: "Litige introuvable" }, { status: 404 });
    }

    if (dispute.clientId !== session.user.id) {
      return NextResponse.json({ error: "Seul le client ayant ouvert le litige peut l'annuler" }, { status: 403 });
    }

    if (dispute.status !== "OUVERT") {
      return NextResponse.json({ error: "Seul un litige ouvert peut etre annule" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update dispute status — "ANNULE" is not in DisputeStatus enum,
      //    so we mark it RESOLU with verdict ANNULATION
      await tx.dispute.update({
        where: { id: dispute.id },
        data: {
          status: "RESOLU",
          verdict: "ANNULATION",
          resolvedAt: new Date(),
          verdictNote: "Annule par le client",
        },
      });

      // 2. Restore order status
      await tx.order.update({
        where: { id: dispute.orderId },
        data: {
          status: "EN_COURS",
          escrowStatus: "HELD",
        },
      });

      // 3. Create notifications
      await tx.notification.createMany({
        data: [
          {
            userId: dispute.clientId,
            title: "Litige annule",
            message: "Vous avez annule votre litige. La commande reprend son cours normal.",
            type: "ORDER",
          },
          {
            userId: dispute.freelanceId,
            title: "Litige annule",
            message: `Le client a annule le litige. La commande reprend son cours normal.`,
            type: "ORDER",
          },
        ],
      });
    });

    return NextResponse.json({ success: true, message: "Litige annule avec succes" });
  } catch (error) {
    console.error("[API /disputes/[id]/cancel]", error);
    return NextResponse.json({ error: "Erreur lors de l'annulation du litige" }, { status: 500 });
  }
}
