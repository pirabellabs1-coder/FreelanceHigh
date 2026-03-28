import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";
import { serviceStore, reviewStore, orderStore } from "@/lib/dev/data-store";
import {
  serviceScoreTopPerformers,
  serviceScoreTrending,
  boostScore,
  hourlyHash,
  weightedRandomPick,
  enforceCategoryDiversity,
} from "@/lib/ranking";

interface ScoredService {
  id: string;
  slug: string;
  title: string;
  category: string;
  priceEur: number;
  rating: number;
  reviews: number;
  orderCount: number;
  image: string;
  freelancer: string;
  freelancerAvatar: string;
  vendorBadges: string[];
  pool: "top" | "trending" | "sponsored";
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const limit = Math.min(parseInt(searchParams.get("limit") || "6", 10), 20);

    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      const allServices = serviceStore.getAll().filter((s) => s.status === "actif" || s.status === "vedette");
      const allReviews = reviewStore.getAll();
      const allOrders = orderStore.getAll();
      const seed = hourlyHash("services");

      // Build scored list with review counts
      const enriched = allServices.map((s) => {
        const serviceReviews = allReviews.filter((r) => r.serviceId === s.id);
        const reviewCount = serviceReviews.length || s.ratingCount || 0;
        const recentOrders = allOrders.filter((o) => o.serviceId === s.id && (o.status === "livre" || o.status === "termine"));
        return { service: s, reviewCount, recentOrderCount: recentOrders.length };
      });

      // Pool 1: Top Performers (rating >= 3.5, orderCount >= 1)
      const topCandidates = enriched
        .filter((e) => e.service.rating >= 3.5 && e.service.orderCount >= 1)
        .map((e) => ({
          item: e,
          score: serviceScoreTopPerformers({
            rating: e.service.rating,
            orderCount: e.service.orderCount,
            reviewCount: e.reviewCount,
          }),
        }))
        .sort((a, b) => b.score - a.score);

      const topPicks = weightedRandomPick(
        topCandidates.slice(0, 10),
        topCandidates.slice(0, 10).map((c) => c.score + 0.01),
        Math.ceil(limit / 3),
        seed
      );

      // Pool 2: Trending (use total views/orders as proxy in dev mode)
      const trendingCandidates = enriched
        .filter((e) => e.service.views > 0)
        .map((e) => ({
          item: e,
          score: serviceScoreTrending({
            rating: e.service.rating,
            orderCount: e.service.orderCount,
            reviewCount: e.reviewCount,
            views: e.service.views,
            isBoosted: e.service.isBoosted,
            isVedette: e.service.status === "vedette",
            category: e.service.categoryName || "",
            views7d: e.service.views,
            orders7d: e.recentOrderCount,
          }),
        }))
        .sort((a, b) => b.score - a.score);

      const trendingPicks = weightedRandomPick(
        trendingCandidates.slice(0, 10),
        trendingCandidates.slice(0, 10).map((c) => c.score + 0.01),
        Math.ceil(limit / 3),
        seed + 1
      );

      // Pool 3: Sponsored (boosted services)
      const sponsoredCandidates = enriched.filter((e) => e.service.isBoosted);
      const sponsoredPicks = sponsoredCandidates.slice(0, Math.ceil(limit / 3));

      // Merge pools, deduplicate
      const seen = new Set<string>();
      const merged: ScoredService[] = [];

      function addToMerged(
        picks: Array<{ item: typeof enriched[0]; score?: number } | typeof enriched[0]>,
        pool: "top" | "trending" | "sponsored"
      ) {
        for (const pick of picks) {
          const e = "item" in pick ? pick.item : pick;
          if (seen.has(e.service.id)) continue;
          seen.add(e.service.id);
          merged.push({
            id: e.service.id,
            slug: e.service.slug,
            title: e.service.title,
            category: e.service.categoryName || "",
            priceEur: e.service.basePrice,
            rating: e.service.rating,
            reviews: e.reviewCount,
            orderCount: e.service.orderCount,
            image: e.service.images?.[0] ?? e.service.mainImage ?? "",
            freelancer: e.service.vendorName,
            freelancerAvatar: e.service.vendorAvatar ?? "",
            vendorBadges: e.service.vendorBadges ?? [],
            pool,
          });
        }
      }

      addToMerged(topPicks, "top");
      addToMerged(trendingPicks, "trending");
      addToMerged(sponsoredPicks, "sponsored");

      // Fill remaining slots from top candidates if needed
      if (merged.length < limit) {
        const remaining = enriched
          .filter((e) => !seen.has(e.service.id))
          .sort((a, b) => b.service.rating - a.service.rating);
        addToMerged(remaining.slice(0, limit - merged.length), "top");
      }

      // Enforce category diversity (max 2 per category)
      const diverse = enforceCategoryDiversity(merged.slice(0, limit), 2);

      return NextResponse.json({
        services: diverse.map(({ pool: _pool, ...rest }) => rest),
      });
    }

    // ── Production: Prisma ──

    const seed = hourlyHash("services");
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Fetch candidate services
    const services = await prisma.service.findMany({
      where: { status: { in: ["ACTIF", "VEDETTE"] } },
      orderBy: [{ rating: "desc" }, { orderCount: "desc" }],
      take: 50,
      include: {
        category: { select: { name: true } },
        user: { select: { id: true, name: true, avatar: true, image: true, plan: true, kyc: true } },
        agency: { select: { id: true, agencyName: true, logo: true } },
        _count: { select: { reviews: true } },
      },
    });

    // Enrich with 7-day metrics
    const enriched = await Promise.all(
      services.map(async (s) => {
        const [views7d, orders7d] = await Promise.all([
          prisma.serviceView.count({ where: { serviceId: s.id, createdAt: { gte: sevenDaysAgo } } }).catch(() => 0),
          prisma.order.count({ where: { serviceId: s.id, createdAt: { gte: sevenDaysAgo } } }).catch(() => 0),
        ]);
        return { service: s, views7d, orders7d };
      })
    );

    // Pool 1: Top Performers
    const topCandidates = enriched
      .filter((e) => e.service.rating >= 3.5 && e.service.orderCount >= 1)
      .map((e) => ({
        item: e,
        score: serviceScoreTopPerformers({
          rating: e.service.rating,
          orderCount: e.service.orderCount,
          reviewCount: e.service._count.reviews || e.service.ratingCount,
        }),
      }))
      .sort((a, b) => b.score - a.score);

    const topPicks = weightedRandomPick(
      topCandidates.slice(0, 10),
      topCandidates.slice(0, 10).map((c) => c.score + 0.01),
      Math.ceil(limit / 3),
      seed
    );

    // Pool 2: Trending
    const trendingCandidates = enriched
      .filter((e) => e.views7d > 0 || e.service.views > 0)
      .map((e) => ({
        item: e,
        score: serviceScoreTrending({
          rating: e.service.rating,
          orderCount: e.service.orderCount,
          reviewCount: e.service._count.reviews || e.service.ratingCount,
          views: e.service.views,
          isBoosted: e.service.isBoosted,
          isVedette: e.service.status === "VEDETTE",
          category: e.service.category?.name ?? "",
          views7d: e.views7d,
          orders7d: e.orders7d,
        }),
      }))
      .sort((a, b) => b.score - a.score);

    const trendingPicks = weightedRandomPick(
      trendingCandidates.slice(0, 10),
      trendingCandidates.slice(0, 10).map((c) => c.score + 0.01),
      Math.ceil(limit / 3),
      seed + 1
    );

    // Pool 3: Sponsored
    const sponsoredServices = enriched.filter((e) => e.service.isBoosted);
    let sponsoredPicks: typeof enriched = [];
    if (sponsoredServices.length > 0) {
      // Get boost data for scoring
      const boostData = await Promise.all(
        sponsoredServices.map(async (e) => {
          const boost = await prisma.boost.findFirst({
            where: { serviceId: e.service.id, status: "ACTIVE" },
          });
          return { item: e, boost };
        })
      );
      const maxCost = Math.max(1, ...boostData.map((b) => b.boost?.totalCost ?? 0));
      const scored = boostData.map((b) => ({
        item: b.item,
        score: b.boost
          ? boostScore({
              totalCost: b.boost.totalCost,
              actualImpressions: b.boost.actualImpressions,
              actualClicks: b.boost.actualClicks,
              actualOrders: b.boost.actualOrders,
              startedAt: b.boost.startedAt ?? b.boost.createdAt,
            }, maxCost)
          : 0.01,
      }));
      sponsoredPicks = weightedRandomPick(
        scored,
        scored.map((s) => s.score + 0.01),
        Math.ceil(limit / 3),
        seed + 2
      ).map((s) => s.item);
    }

    // Merge + deduplicate
    const seen = new Set<string>();
    const merged: ScoredService[] = [];

    function buildBadges(user: { plan?: string | null; kyc?: number | null } | null, agency: { id: string } | null): string[] {
      const badges: string[] = [];
      if (agency) badges.push("Agence");
      if (user?.kyc && user.kyc >= 3) badges.push("Verifie");
      if (user?.plan) {
        const plan = user.plan.toUpperCase();
        if (plan === "PRO") badges.push("Pro");
        else if (plan === "BUSINESS") badges.push("Business");
      }
      return badges;
    }

    function addPrismaToMerged(
      picks: Array<{ item: typeof enriched[0]; score?: number } | typeof enriched[0]>,
      pool: "top" | "trending" | "sponsored"
    ) {
      for (const pick of picks) {
        const e = "item" in pick ? pick.item : pick;
        const s = e.service;
        if (seen.has(s.id)) continue;
        seen.add(s.id);
        merged.push({
          id: s.id,
          slug: s.slug,
          title: s.title,
          category: s.category?.name ?? "",
          priceEur: s.basePrice,
          rating: s.rating,
          reviews: s._count.reviews || (s.ratingCount ?? 0),
          orderCount: s.orderCount,
          image: (s.images as string[])?.[0] ?? "",
          freelancer: s.agency?.agencyName || (s.user?.name ?? ""),
          freelancerAvatar: s.agency?.logo || s.user?.avatar || (s.user?.image ?? ""),
          vendorBadges: buildBadges(s.user, s.agency),
          pool,
        });
      }
    }

    addPrismaToMerged(topPicks, "top");
    addPrismaToMerged(trendingPicks, "trending");
    addPrismaToMerged(sponsoredPicks.map((item) => ({ item })), "sponsored");

    // Fill remaining
    if (merged.length < limit) {
      const remaining = enriched.filter((e) => !seen.has(e.service.id));
      addPrismaToMerged(remaining.slice(0, limit - merged.length).map((item) => ({ item })), "top");
    }

    const diverse = enforceCategoryDiversity(merged.slice(0, limit), 2);

    return NextResponse.json({
      services: diverse.map(({ pool: _pool, ...rest }) => rest),
    });
  } catch (error) {
    console.error("[API /public/top-services GET]", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des top services" },
      { status: 500 }
    );
  }
}
