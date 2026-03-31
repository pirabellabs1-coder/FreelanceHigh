import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  serviceScoreRelevance,
  boostScore,
  hourlyHash,
  weightedRandomPick,
  interleave,
} from "@/lib/ranking";
import { computeBadges } from "@/lib/badges";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.toLowerCase() || "";
    const category = searchParams.get("category") || "";
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || Infinity;
    const sort = searchParams.get("sort") || "pertinence";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Number(searchParams.get("limit")) || 12);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { status: { in: ["ACTIF", "VEDETTE"] } };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { descriptionText: { contains: q, mode: "insensitive" } },
        { tags: { hasSome: [q] } },
      ];
    }
    if (category) {
      where.category = { slug: category };
    }
    if (minPrice > 0) where.basePrice = { ...where.basePrice, gte: minPrice };
    if (maxPrice < Infinity) where.basePrice = { ...where.basePrice, lte: maxPrice };

    // Determine ordering — sponsored rotation only on "pertinence"
    const isRelevanceSort = sort === "pertinence" || sort === "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = { rating: "desc" };
    if (!isRelevanceSort) {
      switch (sort) {
        case "prix_asc": orderBy = { basePrice: "asc" }; break;
        case "prix_desc": orderBy = { basePrice: "desc" }; break;
        case "note": orderBy = { rating: "desc" }; break;
        case "nouveau": orderBy = { createdAt: "desc" }; break;
        case "populaire": orderBy = { orderCount: "desc" }; break;
        default: orderBy = { rating: "desc" };
      }
    }

    // For relevance sort: fetch all, then score + interleave manually
    // For other sorts: use DB ordering directly
    const fetchLimit = isRelevanceSort ? Math.max(limit * 3, 50) : limit;
    const skip = isRelevanceSort ? 0 : (page - 1) * limit;

    const [allServices, total] = await Promise.all([
      prisma.service.findMany({
        where,
        orderBy: isRelevanceSort ? [{ rating: "desc" }, { orderCount: "desc" }] : orderBy,
        skip,
        take: fetchLimit,
        include: {
          media: { where: { isPrimary: true }, take: 1 },
          category: { select: { name: true } },
          user: { select: { name: true, image: true, avatar: true, country: true, plan: true, kyc: true } },
          agency: { select: { id: true, agencyName: true, logo: true } },
          _count: { select: { reviews: true } },
        },
      }),
      prisma.service.count({ where }),
    ]);

    // Build vendor badges
    function buildBadges(user: { plan?: string | null; kyc?: number | null } | null, agency: { id: string } | null): string[] {
      return computeBadges({ role: agency ? "agence" : "freelance", plan: user?.plan, kyc: user?.kyc, avgRating: 0, completedOrders: 0 });
    }

    function mapService(s: typeof allServices[0], isSponsored = false) {
      return {
        id: s.id,
        slug: s.slug,
        title: s.title,
        category: s.category?.name || "",
        categoryId: s.categoryId,
        basePrice: s.basePrice,
        deliveryDays: s.deliveryDays,
        rating: s.rating,
        ratingCount: s._count.reviews || s.ratingCount,
        orderCount: s.orderCount,
        image: s.media?.[0]?.url || (s.images as string[])?.[0] || "",
        images: s.images || [],
        vendorName: s.agency?.agencyName || s.user?.name || "",
        vendorAvatar: s.agency?.logo || s.user?.avatar || s.user?.image || "",
        vendorUsername: "",
        vendorCountry: s.user?.country || "",
        vendorBadges: buildBadges(s.user, s.agency),
        isBoosted: s.isBoosted,
        isVedette: s.status === "VEDETTE",
        isSponsored, // true for interleaved sponsored services
        tags: s.tags || [],
      };
    }

    if (!isRelevanceSort) {
      // Direct DB sort — no interleaving
      return NextResponse.json({
        services: allServices.map((s) => mapService(s)),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    }

    // ── Relevance sort with sponsored interleaving ──

    const seed = hourlyHash(`explorer:${page}`);
    const boosted = allServices.filter((s) => s.isBoosted);
    const regular = allServices.filter((s) => !s.isBoosted);

    // Score regular services by relevance
    const scoredRegular = regular
      .map((s) => ({
        service: s,
        score: serviceScoreRelevance({
          rating: s.rating,
          orderCount: s.orderCount,
          views: s.views,
        }),
      }))
      .sort((a, b) => b.score - a.score)
      .map((s) => s.service);

    // Score and shuffle boosted services by performance
    let shuffledBoosted = boosted;
    if (boosted.length > 0) {
      // Get active boost data for scoring
      const boostDataPromises = boosted.map(async (s) => {
        const boost = await prisma.boost.findFirst({
          where: { serviceId: s.id, status: "ACTIVE" },
        }).catch(() => null);
        return { service: s, boost };
      });
      const boostData = await Promise.all(boostDataPromises);
      const maxCost = Math.max(1, ...boostData.map((b) => b.boost?.totalCost ?? 0));

      const scored = boostData.map((b) => ({
        service: b.service,
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

      // Weighted random shuffle — higher scoring boosts get better positions
      shuffledBoosted = weightedRandomPick(
        scored.map((s) => s.service),
        scored.map((s) => s.score + 0.01),
        scored.length,
        seed
      );
    }

    // Interleave: 1 sponsored in position 2, then every 4 positions
    // This means max 1-2 in the first view, rest spread naturally
    const merged = interleave(shuffledBoosted, scoredRegular, 4);

    // Paginate the merged results
    const startIdx = (page - 1) * limit;
    const pageResults = merged.slice(startIdx, startIdx + limit);

    // Mark which ones are sponsored (interleaved boosted)
    const boostedIds = new Set(boosted.map((s) => s.id));

    return NextResponse.json({
      services: pageResults.map((s) => mapService(s, boostedIds.has(s.id))),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[API /public/services GET]", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des services" },
      { status: 500 }
    );
  }
}
