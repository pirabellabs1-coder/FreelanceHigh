import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";
import { computeBadges } from "@/lib/badges";
import { RANK_LEVELS, getUserRank, getNextRank } from "@/lib/dev/data-store";

// GET /api/rank — Fetch user's rank, badges, and progress
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const userId = session.user.id;

    // --- DEV mode: use in-memory stores ---
    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      const { orderStore, reviewStore, transactionStore } = await import("@/lib/dev/data-store");

      // Calculate completed orders
      const orders = orderStore.getByFreelance(userId);
      const completedOrders = orders.filter((o) => o.status === "termine").length;
      const totalOrders = orders.filter((o) => o.status !== "annule").length;
      const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

      // Calculate avg rating
      const reviews = reviewStore.getByFreelance(userId);
      const avgRating = reviews.length > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
        : 0;

      // Get rank
      const currentRank = getUserRank(completedOrders);
      const nextRankInfo = getNextRank(completedOrders);

      // Calculate total revenue for High Seller badge
      const transactions = transactionStore.getByUser(userId);
      const totalRevenue = transactions
        .filter((t) => t.type === "vente" && t.status === "complete")
        .reduce((sum, t) => sum + t.amount, 0);

      const badges = computeBadges({
        completedOrders,
        completionRate,
        avgRating,
        kycLevel: session.user.kyc ?? 1,
        plan: session.user.plan ?? "gratuit",
        role: session.user.role,
        isInstructor: session.user.formationsRole === "instructeur",
        totalRevenue,
      });

      return NextResponse.json({
        rank: currentRank,
        nextRank: nextRankInfo.nextRank,
        progress: nextRankInfo.progress,
        salesNeeded: nextRankInfo.salesNeeded,
        completedSales: completedOrders,
        badges,
        stats: {
          completedOrders,
          completionRate,
          avgRating,
          totalReviews: reviews.length,
        },
        allRanks: RANK_LEVELS,
      });
    }

    // --- Production: use Prisma ---
    try {
      const { prisma } = await import("@/lib/prisma");

      // Fetch orders for this freelance
      const orders = await prisma.order.findMany({
        where: { freelanceId: userId },
        select: { status: true, freelancerPayout: true },
      });

      const completedOrders = orders.filter((o) => o.status === "TERMINE").length;
      const nonCancelledOrders = orders.filter((o) => o.status !== "ANNULE").length;
      const completionRate = nonCancelledOrders > 0
        ? Math.round((completedOrders / nonCancelledOrders) * 100)
        : 0;

      // Total revenue from completed orders (freelancer payout)
      const totalRevenue = orders
        .filter((o) => o.status === "TERMINE")
        .reduce((sum, o) => sum + (o.freelancerPayout ?? 0), 0);

      // Fetch reviews targeting this freelance
      const reviews = await prisma.review.findMany({
        where: { targetId: userId },
        select: { rating: true },
      });

      const avgRating = reviews.length > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
        : 0;

      // Compute rank using the shared pure functions (they only depend on completedOrders count)
      const currentRank = getUserRank(completedOrders);
      const nextRankInfo = getNextRank(completedOrders);

      // Fetch user for plan / kyc / formationsRole
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true, kyc: true, formationsRole: true, role: true },
      });

      const badges = computeBadges({
        completedOrders,
        completionRate,
        avgRating,
        kycLevel: user?.kyc ?? session.user.kyc ?? 1,
        plan: (user?.plan ?? session.user.plan ?? "GRATUIT").toLowerCase(),
        role: (user?.role ?? session.user.role ?? "").toLowerCase(),
        isInstructor: (user?.formationsRole ?? session.user.formationsRole) === "instructeur",
        totalRevenue,
      });

      return NextResponse.json({
        rank: currentRank,
        nextRank: nextRankInfo.nextRank,
        progress: nextRankInfo.progress,
        salesNeeded: nextRankInfo.salesNeeded,
        completedSales: completedOrders,
        badges,
        stats: {
          completedOrders,
          completionRate,
          avgRating,
          totalReviews: reviews.length,
        },
        allRanks: RANK_LEVELS,
      });
    } catch (prismaError) {
      console.error("[API /rank GET] Prisma error:", prismaError);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  } catch (error) {
    console.error("[API /rank GET]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
