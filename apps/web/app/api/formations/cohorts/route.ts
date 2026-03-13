// GET /api/formations/cohorts — Marketplace cohortes publiques

import { NextRequest, NextResponse } from "next/server";
import prisma from "@freelancehigh/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "12"), 50);
    const skip = (page - 1) * limit;

    const categorySlug = searchParams.get("category");
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const sort = searchParams.get("sort") ?? "date";

    // Build where clause
    const where: Record<string, unknown> = {
      status: "OUVERT",
      enrollmentDeadline: { gt: new Date() },
      formation: { status: "ACTIF" },
    };

    if (categorySlug) {
      where.formation = {
        ...(where.formation as Record<string, unknown>),
        category: { slug: categorySlug },
      };
    }
    if (minPrice !== undefined) where.price = { ...(where.price as Record<string, unknown> ?? {}), gte: minPrice };
    if (maxPrice !== undefined) where.price = { ...(where.price as Record<string, unknown> ?? {}), lte: maxPrice };

    // Build orderBy
    let orderBy: Record<string, string> = { startDate: "asc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    else if (sort === "price_desc") orderBy = { price: "desc" };
    else if (sort === "places") orderBy = { currentCount: "asc" };

    const [cohorts, total] = await Promise.all([
      prisma.formationCohort.findMany({
        where,
        include: {
          formation: {
            select: {
              id: true,
              slug: true,
              titleFr: true,
              titleEn: true,
              thumbnail: true,
              duration: true,
              level: true,
              category: {
                select: { nameFr: true, nameEn: true, slug: true },
              },
              instructeur: {
                select: {
                  id: true,
                  user: {
                    select: { name: true, avatar: true, image: true },
                  },
                },
              },
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.formationCohort.count({ where }),
    ]);

    return NextResponse.json({
      cohorts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[GET /api/formations/cohorts]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
