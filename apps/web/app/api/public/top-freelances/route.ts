import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";
import { devStore } from "@/lib/dev/dev-store";
import { serviceStore, orderStore, reviewStore } from "@/lib/dev/data-store";
import {
  freelanceScore,
  isRisingTalent,
  hourlyHash,
  weightedRandomPick,
} from "@/lib/ranking";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const limit = Math.min(parseInt(searchParams.get("limit") || "3", 10), 12);
    const seed = hourlyHash("freelances");

    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      const users = devStore.getAll().filter((u) => (u.role === "freelance" || u.role === "agence") && u.status === "ACTIF");
      const allServices = serviceStore.getAll();
      const allOrders = orderStore.getAll();
      const allReviews = reviewStore.getAll();

      // Build scored pool (top 20)
      const pool = users.map((user) => {
        const userServices = allServices.filter((s) => s.userId === user.id && s.status === "actif");
        const userOrders = allOrders.filter((o) => o.freelanceId === user.id);
        const userReviews = allReviews.filter((r) => r.freelanceId === user.id);
        const completedOrders = userOrders.filter((o) => o.status === "livre" || o.status === "termine");

        const avgRating = userReviews.length > 0
          ? userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length
          : 0;

        const topService = userServices.sort((a, b) => b.revenue - a.revenue)[0];
        const dailyRateEur = topService ? topService.basePrice : 0;
        const skills = [...new Set(userServices.flatMap((s) => s.tags))].slice(0, 3);
        const primaryCategory = topService?.categoryName || (skills[0] ?? "Freelance");

        const score = freelanceScore({
          avgRating,
          completedOrders: completedOrders.length,
          totalOrders: userOrders.length,
          reviewCount: userReviews.length,
          serviceCount: userServices.length,
        });

        const rising = isRisingTalent({
          createdAt: user.createdAt,
          completedOrders: completedOrders.length,
          avgRating,
          reviewCount: userReviews.length,
        });

        // Rising talent bonus: 30% more weight
        const effectiveScore = score * (1 + (rising ? 0.3 : 0));

        return {
          user,
          score: effectiveScore,
          avgRating: Math.round(avgRating * 10) / 10,
          completedOrders: completedOrders.length,
          reviewCount: userReviews.length,
          skills,
          dailyRateEur,
          serviceCount: userServices.length,
          primaryCategory,
          isRising: rising,
        };
      });

      // Sort to get top 20 pool
      pool.sort((a, b) => b.score - a.score);
      const topPool = pool.slice(0, 20);

      if (topPool.length === 0) {
        return NextResponse.json({ freelances: [] });
      }

      // Weighted random pick of `limit` from the pool
      let selected = weightedRandomPick(
        topPool,
        topPool.map((p) => p.score + 0.01),
        limit,
        seed
      );

      // Enforce category diversity: try to have different primary categories
      if (selected.length >= 3) {
        const categories = selected.map((s) => s.primaryCategory);
        const uniqueCats = new Set(categories);
        if (uniqueCats.size < Math.min(3, selected.length)) {
          // Try to swap duplicates with pool members of different categories
          const usedIds = new Set(selected.map((s) => s.user.id));
          const replacements = topPool.filter((p) => !usedIds.has(p.user.id));
          for (let i = selected.length - 1; i >= 1; i--) {
            const prevCats = selected.slice(0, i).map((s) => s.primaryCategory);
            if (prevCats.includes(selected[i].primaryCategory)) {
              const swap = replacements.find((r) => !prevCats.includes(r.primaryCategory));
              if (swap) {
                selected[i] = swap;
                replacements.splice(replacements.indexOf(swap), 1);
              }
            }
          }
        }
      }

      // Ensure at least 1 badged freelance if available
      const hasBadged = selected.some((s) => s.avgRating >= 4.0);
      if (!hasBadged) {
        const badgedCandidate = topPool.find(
          (p) => p.avgRating >= 4.0 && !selected.some((s) => s.user.id === p.user.id)
        );
        if (badgedCandidate && selected.length > 0) {
          selected[selected.length - 1] = badgedCandidate;
        }
      }

      const top = selected.map((item) => ({
        id: item.user.id,
        username: item.user.id,
        name: item.user.name,
        title: item.skills.length > 0 ? item.skills[0] : "Freelance",
        rating: item.avgRating,
        skills: item.skills,
        dailyRateEur: item.dailyRateEur,
        completedOrders: item.completedOrders,
        reviewCount: item.reviewCount,
        badge: item.isRising
          ? "RISING TALENT"
          : item.avgRating >= 4.5 && item.completedOrders >= 5
            ? "ELITE"
            : item.avgRating >= 4.0
              ? "TOP RATED"
              : "",
        badges: buildBadgesList(item),
        image: "",
        location: "",
      }));

      return NextResponse.json({ freelances: top });
    }

    // ── Production: Prisma ──

    const users = await prisma.user.findMany({
      where: { role: { in: ["FREELANCE", "AGENCE"] }, status: "ACTIF" },
      include: {
        freelancerProfile: true,
        services: { where: { status: { in: ["ACTIF", "VEDETTE"] } } },
        reviewsReceived: true,
        ordersAsFreelance: { select: { id: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const pool = users.map((u) => {
      const avgRating = u.reviewsReceived.length > 0
        ? Math.round(
            (u.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) / u.reviewsReceived.length) * 10
          ) / 10
        : 0;
      const completedOrders = u.ordersAsFreelance.filter((o) => o.status === "TERMINE").length;
      const totalOrders = u.ordersAsFreelance.length;
      const skills = (u.freelancerProfile?.skills as string[] | null)?.slice(0, 3) ?? [];
      const primaryCategory = u.freelancerProfile?.title ?? (skills[0] || "Freelance");

      const score = freelanceScore({
        avgRating,
        completedOrders,
        totalOrders,
        reviewCount: u.reviewsReceived.length,
        serviceCount: u.services.length,
      });

      const rising = isRisingTalent({
        createdAt: u.createdAt,
        completedOrders,
        avgRating,
        reviewCount: u.reviewsReceived.length,
      });

      const effectiveScore = score * (1 + (rising ? 0.3 : 0));

      return {
        user: u,
        score: effectiveScore,
        avgRating,
        completedOrders,
        reviewCount: u.reviewsReceived.length,
        skills,
        primaryCategory,
        isRising: rising,
      };
    });

    pool.sort((a, b) => b.score - a.score);
    const topPool = pool.slice(0, 20);

    if (topPool.length === 0) {
      return NextResponse.json({ freelances: [] });
    }

    let selected = weightedRandomPick(
      topPool,
      topPool.map((p) => p.score + 0.01),
      limit,
      seed
    );

    // Category diversity
    if (selected.length >= 3) {
      const usedIds = new Set(selected.map((s) => s.user.id));
      const replacements = topPool.filter((p) => !usedIds.has(p.user.id));
      for (let i = selected.length - 1; i >= 1; i--) {
        const prevCats = selected.slice(0, i).map((s) => s.primaryCategory);
        if (prevCats.includes(selected[i].primaryCategory)) {
          const swap = replacements.find((r) => !prevCats.includes(r.primaryCategory));
          if (swap) {
            selected[i] = swap;
            replacements.splice(replacements.indexOf(swap), 1);
          }
        }
      }
    }

    // Ensure at least 1 badged
    const hasBadged = selected.some((s) => s.avgRating >= 4.0);
    if (!hasBadged) {
      const badgedCandidate = topPool.find(
        (p) => p.avgRating >= 4.0 && !selected.some((s) => s.user.id === p.user.id)
      );
      if (badgedCandidate && selected.length > 0) {
        selected[selected.length - 1] = badgedCandidate;
      }
    }

    const top = selected.map((item) => ({
      id: item.user.id,
      username: item.user.id,
      name: item.user.name,
      title: item.user.freelancerProfile?.title ?? "Freelance",
      rating: item.avgRating,
      skills: item.skills,
      dailyRateEur: item.user.freelancerProfile?.hourlyRate ?? 0,
      completedOrders: item.completedOrders,
      reviewCount: item.reviewCount,
      badge: item.isRising
        ? "RISING TALENT"
        : item.avgRating >= 4.5 && item.completedOrders >= 5
          ? "ELITE"
          : item.avgRating >= 4.0
            ? "TOP RATED"
            : "",
      badges: buildBadgesListPrisma(item),
      image: item.user.image ?? "",
      location: item.user.country ?? "",
    }));

    return NextResponse.json({ freelances: top });
  } catch (error) {
    console.error("[API /public/top-freelances GET]", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des top freelances" },
      { status: 500 }
    );
  }
}

// Helper: build badges array for dev mode
function buildBadgesList(item: { isRising: boolean; avgRating: number; completedOrders: number }): string[] {
  const badges: string[] = [];
  if (item.isRising) badges.push("RISING TALENT");
  if (item.avgRating >= 4.5 && item.completedOrders >= 5) badges.push("ELITE");
  else if (item.avgRating >= 4.0) badges.push("TOP RATED");
  return badges;
}

// Helper: build badges array for Prisma mode
function buildBadgesListPrisma(item: {
  isRising: boolean;
  avgRating: number;
  completedOrders: number;
  user: { kyc?: number | null };
}): string[] {
  const badges: string[] = [];
  if (item.isRising) badges.push("RISING TALENT");
  if (item.avgRating >= 4.5 && item.completedOrders >= 5) badges.push("ELITE");
  else if (item.avgRating >= 4.0) badges.push("TOP RATED");
  if (item.user.kyc && item.user.kyc >= 3) badges.push("Verifie");
  return badges;
}
