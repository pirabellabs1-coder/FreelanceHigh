// GET /api/instructeur/marketing/stats — Statistiques marketing de l'instructeur

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const instructeur = await prisma.instructeurProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!instructeur) {
      return NextResponse.json({ error: "Instructeur non trouvé" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "30d";

    // Calculate date range
    const now = new Date();
    let daysBack = 30;
    if (period === "7d") daysBack = 7;
    else if (period === "90d") daysBack = 90;
    else if (period === "6m") daysBack = 180;
    else if (period === "1y") daysBack = 365;

    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
    const prevStartDate = new Date(startDate.getTime() - daysBack * 24 * 60 * 60 * 1000);

    // Get instructor's formation and product IDs
    const formationIds = (await prisma.formation.findMany({
      where: { instructeurId: instructeur.id },
      select: { id: true },
    })).map((f) => f.id);

    const productIds = (await prisma.digitalProduct.findMany({
      where: { instructeurId: instructeur.id },
      select: { id: true },
    })).map((p) => p.id);

    // Funnel data from MarketingEvents
    const [pageViews, addToCarts, checkoutsStarted, purchasesCompleted, paymentsFailed] = await Promise.all([
      prisma.marketingEvent.count({
        where: {
          type: "PAGE_VIEW",
          createdAt: { gte: startDate },
          OR: [
            { formationId: { in: formationIds } },
            { digitalProductId: { in: productIds } },
          ],
        },
      }),
      prisma.marketingEvent.count({
        where: {
          type: "ADD_TO_CART",
          createdAt: { gte: startDate },
          OR: [
            { formationId: { in: formationIds } },
            { digitalProductId: { in: productIds } },
          ],
        },
      }),
      prisma.marketingEvent.count({
        where: {
          type: "CHECKOUT_STARTED",
          createdAt: { gte: startDate },
          OR: [
            { formationId: { in: formationIds } },
            { digitalProductId: { in: productIds } },
          ],
        },
      }),
      prisma.marketingEvent.count({
        where: {
          type: "PURCHASE_COMPLETED",
          createdAt: { gte: startDate },
          OR: [
            { formationId: { in: formationIds } },
            { digitalProductId: { in: productIds } },
          ],
        },
      }),
      prisma.marketingEvent.count({
        where: {
          type: "PAYMENT_FAILED",
          createdAt: { gte: startDate },
          OR: [
            { formationId: { in: formationIds } },
            { digitalProductId: { in: productIds } },
          ],
        },
      }),
    ]);

    // Previous period for comparison
    const prevPurchases = await prisma.marketingEvent.count({
      where: {
        type: "PURCHASE_COMPLETED",
        createdAt: { gte: prevStartDate, lt: startDate },
        OR: [
          { formationId: { in: formationIds } },
          { digitalProductId: { in: productIds } },
        ],
      },
    });

    // Abandoned carts
    const [totalAbandoned, recoveredCarts] = await Promise.all([
      prisma.abandonedCart.count({
        where: {
          userId: { in: (await prisma.cartItem.findMany({
            where: { formationId: { in: formationIds } },
            select: { userId: true },
            distinct: ["userId"],
          })).map((c) => c.userId) },
          createdAt: { gte: startDate },
        },
      }),
      prisma.abandonedCart.count({
        where: {
          status: "CONVERTI",
          createdAt: { gte: startDate },
        },
      }),
    ]);

    const recoveryRate = totalAbandoned > 0 ? (recoveredCarts / totalAbandoned) * 100 : 0;

    // Revenue stats
    const enrollmentRevenue = await prisma.enrollment.aggregate({
      where: {
        formationId: { in: formationIds },
        createdAt: { gte: startDate },
      },
      _sum: { paidAmount: true },
    });

    const productRevenue = await prisma.digitalProductPurchase.aggregate({
      where: {
        productId: { in: productIds },
        createdAt: { gte: startDate },
      },
      _sum: { paidAmount: true },
    });

    const totalRevenue = (enrollmentRevenue._sum.paidAmount || 0) + (productRevenue._sum.paidAmount || 0);

    // Flash promotions
    const [activePromos, scheduledPromos] = await Promise.all([
      prisma.flashPromotion.findMany({
        where: {
          isActive: true,
          startsAt: { lte: now },
          endsAt: { gt: now },
          OR: [
            { formationId: { in: formationIds } },
            { digitalProductId: { in: productIds } },
          ],
        },
        include: {
          formation: { select: { titleFr: true } },
          digitalProduct: { select: { titleFr: true } },
        },
      }),
      prisma.flashPromotion.findMany({
        where: {
          isActive: true,
          startsAt: { gt: now },
          OR: [
            { formationId: { in: formationIds } },
            { digitalProductId: { in: productIds } },
          ],
        },
        include: {
          formation: { select: { titleFr: true } },
          digitalProduct: { select: { titleFr: true } },
        },
      }),
    ]);

    // Pixel status
    const pixels = await prisma.marketingPixel.findMany({
      where: { instructeurId: instructeur.id },
      select: { type: true, isActive: true },
    });

    return NextResponse.json({
      funnel: {
        pageViews,
        addToCarts,
        checkoutsStarted,
        purchasesCompleted,
        paymentsFailed,
        conversionRate: pageViews > 0 ? ((purchasesCompleted / pageViews) * 100).toFixed(1) : "0",
        prevPurchases,
        purchasesTrend: prevPurchases > 0
          ? (((purchasesCompleted - prevPurchases) / prevPurchases) * 100).toFixed(1)
          : "0",
      },
      abandonedCarts: {
        total: totalAbandoned,
        recovered: recoveredCarts,
        recoveryRate: recoveryRate.toFixed(1),
        recoveredRevenue: 0, // TODO: calculate when cart value tracking is added
      },
      revenue: {
        total: totalRevenue,
        formations: enrollmentRevenue._sum.paidAmount || 0,
        products: productRevenue._sum.paidAmount || 0,
      },
      flashPromotions: {
        active: activePromos,
        scheduled: scheduledPromos,
      },
      pixelStatus: pixels,
      period,
    });
  } catch (error) {
    console.error("[GET /api/instructeur/marketing/stats]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
