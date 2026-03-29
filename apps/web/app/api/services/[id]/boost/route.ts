import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";
import {
  serviceStore,
  boostStore,
  BOOST_TIERS,
} from "@/lib/dev/data-store";
import { checkRateLimit, recordFailedAttempt } from "@/lib/auth/rate-limiter";
import { canBoost, normalizePlanName, getPlanLimits } from "@/lib/plans";

// Map dev tier names to Prisma BoostType enum
const TIER_TO_BOOST_TYPE: Record<string, "VIEWS_BOOST" | "FEATURED" | "PREMIUM"> = {
  standard: "VIEWS_BOOST",
  premium: "FEATURED",
  ultime: "PREMIUM",
};

// POST /api/services/[id]/boost — Activate a boost on a service
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const { id } = await params;

    // Anti-abus : rate limiting
    const rateLimitKey = `boost:${session.user.id}`;
    const rateCheck = checkRateLimit(rateLimitKey);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Trop de tentatives de boost. Veuillez patienter." },
        { status: 429 }
      );
    }
    recordFailedAttempt(rateLimitKey);

    const body = await request.json();
    const { tier } = body;

    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      // --- Dev mode (existing logic) ---
      const service = serviceStore.getById(id);
      if (!service) {
        return NextResponse.json({ error: "Service introuvable" }, { status: 404 });
      }
      if (service.userId !== session.user.id) {
        return NextResponse.json({ error: "Acces non autorise" }, { status: 403 });
      }
      if (service.status !== "actif") {
        return NextResponse.json({ error: "Seuls les services actifs peuvent etre boostes." }, { status: 400 });
      }

      const existingBoost = boostStore.getActiveBoost(id);
      if (existingBoost) {
        return NextResponse.json(
          { error: "Ce service a deja un boost actif.", currentBoost: { tier: existingBoost.tier, expiresAt: existingBoost.expiresAt } },
          { status: 409 }
        );
      }

      const userPlan = normalizePlanName(session.user.plan);
      const planLimits = getPlanLimits(userPlan);
      if (planLimits.boostLimit === 0) {
        return NextResponse.json({ error: "Le plan Gratuit ne permet pas de booster.", code: "PLAN_REQUIRED" }, { status: 403 });
      }

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const userBoostsThisMonth = boostStore.getByUser(session.user.id)
        .filter((b) => b.startedAt >= monthStart).length;

      if (!canBoost(userPlan, userBoostsThisMonth)) {
        return NextResponse.json(
          { error: `Limite de ${planLimits.boostLimit} boost(s)/mois atteinte.`, code: "BOOST_LIMIT_REACHED" },
          { status: 403 }
        );
      }

      if (!tier || !BOOST_TIERS[tier as keyof typeof BOOST_TIERS]) {
        return NextResponse.json({ error: "Tier invalide.", availableTiers: BOOST_TIERS }, { status: 400 });
      }

      const validTier = tier as keyof typeof BOOST_TIERS;
      const tierConfig = BOOST_TIERS[validTier];
      const boost = boostStore.activate(id, session.user.id, validTier);

      return NextResponse.json({
        boost,
        tierDetails: { name: tierConfig.name, duration: tierConfig.duration, price: tierConfig.price, estimatedViews: tierConfig.estimatedViews },
        message: `${tierConfig.name} active pour ${tierConfig.duration} jours.`,
      });
    }

    // --- Production: Prisma ---
    const service = await prisma.service.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!service) {
      return NextResponse.json({ error: "Service introuvable" }, { status: 404 });
    }
    if (service.userId !== session.user.id) {
      return NextResponse.json({ error: "Acces non autorise" }, { status: 403 });
    }
    if (service.status !== "ACTIF") {
      return NextResponse.json({ error: "Seuls les services actifs peuvent etre boostes." }, { status: 400 });
    }

    // Check active boost
    const existingBoost = await prisma.boost.findFirst({
      where: { serviceId: id, status: "ACTIVE" },
    });
    if (existingBoost) {
      return NextResponse.json(
        { error: "Ce service a deja un boost actif.", currentBoost: { type: existingBoost.type, endedAt: existingBoost.endedAt } },
        { status: 409 }
      );
    }

    // Plan limits
    const userPlan = normalizePlanName(service.user.plan);
    const planLimits = getPlanLimits(userPlan);
    if (planLimits.boostLimit === 0) {
      return NextResponse.json({ error: "Le plan Gratuit ne permet pas de booster.", code: "PLAN_REQUIRED" }, { status: 403 });
    }

    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const userBoostsThisMonth = await prisma.boost.count({
      where: { userId: session.user.id, startedAt: { gte: monthStart } },
    });
    if (!canBoost(userPlan, userBoostsThisMonth)) {
      return NextResponse.json(
        { error: `Limite de ${planLimits.boostLimit} boost(s)/mois atteinte.`, code: "BOOST_LIMIT_REACHED" },
        { status: 403 }
      );
    }

    // Validate tier
    if (!tier || !BOOST_TIERS[tier as keyof typeof BOOST_TIERS]) {
      return NextResponse.json({ error: "Tier invalide.", availableTiers: BOOST_TIERS }, { status: 400 });
    }

    const validTier = tier as keyof typeof BOOST_TIERS;
    const tierConfig = BOOST_TIERS[validTier];
    const boostType = TIER_TO_BOOST_TYPE[validTier] || "VIEWS_BOOST";

    const now = new Date();
    const endDate = new Date(now.getTime() + tierConfig.duration * 24 * 60 * 60 * 1000);

    // Validate wallet balance before boost payment
    let wallet = await prisma.walletFreelance.findUnique({ where: { userId: session.user.id } });
    if (!wallet) {
      wallet = await prisma.walletFreelance.create({ data: { userId: session.user.id } });
    }
    if (wallet.balance < tierConfig.price) {
      return NextResponse.json(
        { error: "Solde insuffisant. Votre solde est de " + wallet.balance.toFixed(2) + " EUR, le boost coute " + tierConfig.price.toFixed(2) + " EUR.", code: "INSUFFICIENT_BALANCE" },
        { status: 400 }
      );
    }

    // Create boost + escrow + admin transaction + wallet debit in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Debit wallet
      await tx.walletFreelance.update({
        where: { userId: session.user.id },
        data: { balance: { decrement: tierConfig.price } },
      });
      await tx.walletTransaction.create({
        data: {
          freelanceWalletId: wallet!.id,
          type: "COMMISSION_INTERNAL",
          amount: -tierConfig.price,
          description: `Boost ${tierConfig.name} - ${service.title} (${tierConfig.duration}j)`,
          status: "WALLET_COMPLETED",
        },
      });

      const boost = await tx.boost.create({
        data: {
          serviceId: id,
          userId: session.user.id,
          type: boostType,
          durationDays: tierConfig.duration,
          costPerDay: tierConfig.price / tierConfig.duration,
          totalCost: tierConfig.price,
          estimatedDailyImpressions: Math.round(tierConfig.estimatedViews / tierConfig.duration),
          totalEstimatedImpressions: tierConfig.estimatedViews,
          status: "ACTIVE",
          paidAt: now,
          startedAt: now,
          endedAt: endDate,
        },
      });

      // Create Escrow for boost payment
      await tx.escrow.create({
        data: {
          boostId: boost.id,
          amount: tierConfig.price,
          currency: "EUR",
          reason: "BOOST_PAYMENT",
          status: "RELEASED", // Boost payment is immediate
          releasedAt: now,
        },
      });

      // Admin wallet
      let adminWallet = await tx.adminWallet.findFirst();
      if (!adminWallet) {
        adminWallet = await tx.adminWallet.create({ data: {} });
      }
      await tx.adminWallet.update({
        where: { id: adminWallet.id },
        data: { totalFeesReleased: { increment: tierConfig.price } },
      });
      await tx.adminTransaction.create({
        data: {
          adminWalletId: adminWallet.id,
          type: "BOOST_FEE",
          amount: tierConfig.price,
          description: `Boost ${tierConfig.name} - ${service.title} (${tierConfig.duration}j)`,
          boostId: boost.id,
          status: "CONFIRMED",
        },
      });

      // Update service boost status
      await tx.service.update({
        where: { id },
        data: { isBoosted: true, boostedUntil: endDate },
      });

      // Create daily stat slots
      const stats = [];
      for (let i = 0; i < tierConfig.duration; i++) {
        const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
        date.setHours(0, 0, 0, 0);
        stats.push({ boostId: boost.id, date });
      }
      await tx.boostDailyStat.createMany({ data: stats });

      // Notification
      await tx.notification.create({
        data: {
          userId: session.user.id,
          title: "Boost active",
          message: `${tierConfig.name} active pour ${tierConfig.duration} jours sur "${service.title}".`,
          type: "BOOST",
          link: "/dashboard/services",
        },
      });

      return boost;
    });

    // Send invoice email (non-blocking)
    try {
      const { sendInvoiceEmail } = await import("@/lib/email/invoice-email");
      const userEmail = session.user.email || service.user?.email;
      if (userEmail) {
        sendInvoiceEmail({
          to: userEmail,
          userName: session.user.name || "Freelance",
          invoice: {
            id: `BST-${result.id.slice(0, 8).toUpperCase()}`,
            date: now.toISOString(),
            amount: tierConfig.price,
            description: `Boost ${tierConfig.name} - ${service.title} (${tierConfig.duration}j)`,
            status: "payee",
            customerName: session.user.name || "",
            customerEmail: userEmail,
          },
        }).catch((e: unknown) => console.error("[Boost] Invoice email error:", e));
      }
    } catch {
      // Invoice email is best-effort
    }

    return NextResponse.json({
      boost: result,
      tierDetails: { name: tierConfig.name, duration: tierConfig.duration, price: tierConfig.price, estimatedViews: tierConfig.estimatedViews },
      message: `${tierConfig.name} active pour ${tierConfig.duration} jours.`,
    });
  } catch (error) {
    console.error("[API /services/[id]/boost POST]", error);
    return NextResponse.json({ error: "Erreur lors de l'activation du boost" }, { status: 500 });
  }
}

// GET /api/services/[id]/boost — Get boost info for a service
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const { id } = await params;

    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      const service = serviceStore.getById(id);
      if (!service) {
        return NextResponse.json({ error: "Service introuvable" }, { status: 404 });
      }
      if (service.userId !== session.user.id) {
        return NextResponse.json({ error: "Acces non autorise" }, { status: 403 });
      }

      const activeBoost = boostStore.getActiveBoost(id);
      const boostHistory = boostStore.getByService(id);
      const totalStats = boostHistory.reduce(
        (acc, b) => ({
          totalSpent: acc.totalSpent + b.price,
          totalViews: acc.totalViews + b.viewsGenerated,
          totalClicks: acc.totalClicks + b.clicksGenerated,
          totalOrders: acc.totalOrders + b.ordersGenerated,
        }),
        { totalSpent: 0, totalViews: 0, totalClicks: 0, totalOrders: 0 }
      );

      return NextResponse.json({ activeBoost, history: boostHistory, stats: totalStats, availableTiers: BOOST_TIERS });
    }

    // Production: Prisma
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) {
      return NextResponse.json({ error: "Service introuvable" }, { status: 404 });
    }
    if (service.userId !== session.user.id) {
      return NextResponse.json({ error: "Acces non autorise" }, { status: 403 });
    }

    const activeBoost = await prisma.boost.findFirst({
      where: { serviceId: id, status: "ACTIVE" },
      include: { dailyStats: { orderBy: { date: "asc" } } },
    });

    const history = await prisma.boost.findMany({
      where: { serviceId: id },
      include: { dailyStats: true },
      orderBy: { createdAt: "desc" },
    });

    // Calculate real totals from daily stats
    const totalStats = history.reduce(
      (acc, b) => {
        const bStats = b.dailyStats.reduce(
          (s, d) => ({
            views: s.views + d.impressions,
            clicks: s.clicks + d.clicks,
            contacts: s.contacts + d.contacts,
            orders: s.orders + d.orders,
          }),
          { views: 0, clicks: 0, contacts: 0, orders: 0 }
        );
        return {
          totalSpent: acc.totalSpent + b.totalCost,
          totalViews: acc.totalViews + bStats.views,
          totalClicks: acc.totalClicks + bStats.clicks,
          totalOrders: acc.totalOrders + bStats.orders,
        };
      },
      { totalSpent: 0, totalViews: 0, totalClicks: 0, totalOrders: 0 }
    );

    return NextResponse.json({
      activeBoost,
      history,
      stats: totalStats,
      availableTiers: BOOST_TIERS,
    });
  } catch (error) {
    console.error("[API /services/[id]/boost GET]", error);
    return NextResponse.json({ error: "Erreur lors de la recuperation des informations de boost" }, { status: 500 });
  }
}
