import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";
import { orderStore, transactionStore } from "@/lib/dev/data-store";
import { createNotification } from "@/lib/notifications/service";

// POST /api/disputes/[id]/settle — User proposes 50/50 settlement
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
        return NextResponse.json({ error: "Seul le client ayant ouvert le litige peut proposer un accord" }, { status: 403 });
      }

      const now = new Date().toISOString();
      const refundAmount = Math.round(order.amount * 0.5 * 100) / 100;
      const commission = order.commission ?? Math.round(order.amount * 0.2 * 100) / 100;
      const freelanceAmount = Math.round((order.amount - refundAmount - commission * 0.5) * 100) / 100;

      // Credit client refund
      transactionStore.add({
        userId: order.clientId,
        type: "remboursement",
        description: `Accord 50/50 - ${order.serviceTitle}`,
        amount: refundAmount,
        status: "complete",
        date: now.slice(0, 10),
        orderId: order.id,
      });

      // Credit freelance partial payment
      transactionStore.add({
        userId: order.freelanceId,
        type: "vente",
        description: `Paiement partiel (accord 50/50) - ${order.serviceTitle}`,
        amount: freelanceAmount,
        status: "complete",
        date: now.slice(0, 10),
        orderId: order.id,
      });

      orderStore.update(order.id, {
        status: "termine",
        completedAt: now,
        timeline: [
          ...(order.timeline || []),
          {
            id: `t${Date.now()}`,
            type: "completed",
            title: "Accord 50/50 accepte",
            description: `Le client a propose un accord 50/50. ${refundAmount.toFixed(2)} EUR rembourses au client, ${freelanceAmount.toFixed(2)} EUR liberes au freelance.`,
            timestamp: now,
          },
        ],
      });

      createNotification({
        userId: order.clientId,
        title: "Accord 50/50 valide",
        message: `${refundAmount.toFixed(2)} EUR rembourses pour "${order.serviceTitle}".`,
        type: "payment",
        link: `/client/commandes/${order.id}`,
      });
      createNotification({
        userId: order.freelanceId,
        title: "Accord 50/50 valide",
        message: `${freelanceAmount.toFixed(2)} EUR liberes pour "${order.serviceTitle}".`,
        type: "payment",
        link: `/dashboard/finances`,
      });

      return NextResponse.json({
        success: true,
        message: "Accord 50/50 applique",
        refundAmount,
        freelanceAmount,
      });
    }

    // ── Production: Prisma ──
    const { prisma } = await import("@/lib/prisma");

    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: {
        order: true,
        client: { select: { id: true, name: true } },
        freelance: { select: { id: true, name: true } },
      },
    });

    if (!dispute) {
      return NextResponse.json({ error: "Litige introuvable" }, { status: 404 });
    }

    if (dispute.clientId !== session.user.id) {
      return NextResponse.json({ error: "Seul le client ayant ouvert le litige peut proposer un accord" }, { status: 403 });
    }

    if (!["OUVERT", "EN_EXAMEN"].includes(dispute.status)) {
      return NextResponse.json({ error: "Ce litige ne peut plus etre modifie" }, { status: 400 });
    }

    const order = dispute.order;
    if (!order) {
      return NextResponse.json({ error: "Commande associee introuvable" }, { status: 404 });
    }

    const orderAmount = order.amount ?? 0;
    const orderCommission = order.commission ?? order.platformFee ?? 0;
    const refundAmount = Math.round(orderAmount * 0.5 * 100) / 100;
    const adminFee = Math.round(orderCommission * 0.5 * 100) / 100;
    const freelanceAmount = Math.round((orderAmount - refundAmount - adminFee) * 100) / 100;

    await prisma.$transaction(async (tx) => {
      // 1. Update dispute
      await tx.dispute.update({
        where: { id: dispute.id },
        data: {
          status: "RESOLU",
          verdict: "PARTIEL",
          verdictNote: "Accord 50/50 propose par le client",
          partialPercent: 50,
          resolvedAt: new Date(),
        },
      });

      // 2. Update order
      await tx.order.update({
        where: { id: dispute.orderId },
        data: {
          status: "TERMINE",
          escrowStatus: "RELEASED",
          completedAt: new Date(),
        },
      });

      // 3. Release escrow
      await tx.escrow.updateMany({
        where: { orderId: dispute.orderId, status: "HELD" },
        data: { status: "RELEASED", releasedAt: new Date() },
      });

      // 4. Handle admin wallet fees
      const adminWallet = await tx.adminWallet.findFirst();
      if (adminWallet) {
        await tx.adminWallet.update({
          where: { id: adminWallet.id },
          data: {
            totalFeesHeld: { decrement: orderCommission },
            totalFeesReleased: { increment: adminFee },
          },
        });
        await tx.adminTransaction.updateMany({
          where: { orderId: dispute.orderId, status: "PENDING" },
          data: { status: "CONFIRMED" },
        });
      }

      // 5. Credit freelance/agency wallet with partial amount
      if (order.agencyId) {
        const w = await tx.walletAgency.upsert({
          where: { agencyId: order.agencyId },
          create: { agencyId: order.agencyId, balance: freelanceAmount, totalEarned: freelanceAmount },
          update: { balance: { increment: freelanceAmount }, totalEarned: { increment: freelanceAmount } },
        });
        await tx.walletTransaction.create({
          data: {
            agencyWalletId: w.id,
            type: "ORDER_PAYOUT",
            amount: freelanceAmount,
            description: `Accord 50/50 - commande #${dispute.orderId.slice(0, 8)}`,
            status: "WALLET_COMPLETED",
            orderId: dispute.orderId,
          },
        });
      } else {
        const w = await tx.walletFreelance.upsert({
          where: { userId: dispute.freelanceId },
          create: { userId: dispute.freelanceId, balance: freelanceAmount, totalEarned: freelanceAmount },
          update: { balance: { increment: freelanceAmount }, totalEarned: { increment: freelanceAmount } },
        });
        await tx.walletTransaction.create({
          data: {
            freelanceWalletId: w.id,
            type: "ORDER_PAYOUT",
            amount: freelanceAmount,
            description: `Accord 50/50 - commande #${dispute.orderId.slice(0, 8)}`,
            status: "WALLET_COMPLETED",
            orderId: dispute.orderId,
          },
        });
      }

      // 6. Update payments
      await tx.payment.updateMany({
        where: { orderId: dispute.orderId },
        data: { status: "COMPLETE" },
      });

      // 7. Notifications
      await tx.notification.createMany({
        data: [
          {
            userId: dispute.clientId,
            title: "Accord 50/50 valide",
            message: `${refundAmount.toFixed(2)} EUR rembourses.`,
            type: "PAYMENT",
          },
          {
            userId: dispute.freelanceId,
            title: "Accord 50/50 valide",
            message: `${freelanceAmount.toFixed(2)} EUR liberes.`,
            type: "PAYMENT",
          },
        ],
      });
    });

    return NextResponse.json({
      success: true,
      message: "Accord 50/50 applique",
      refundAmount,
      freelanceAmount,
    });
  } catch (error) {
    console.error("[API /disputes/[id]/settle]", error);
    return NextResponse.json({ error: "Erreur lors de l'application de l'accord 50/50" }, { status: 500 });
  }
}
