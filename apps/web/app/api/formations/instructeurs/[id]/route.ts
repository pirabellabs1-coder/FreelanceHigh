// GET /api/formations/instructeurs/[id] — Profil public d'un instructeur

import { NextRequest, NextResponse } from "next/server";
import prisma from "@freelancehigh/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const instructeur = await prisma.instructeurProfile.findUnique({
      where: { id, status: "APPROUVE" },
      include: {
        user: { select: { name: true, avatar: true, image: true } },
        formations: {
          where: { status: "ACTIF" },
          select: {
            id: true,
            slug: true,
            titleFr: true,
            titleEn: true,
            price: true,
            isFree: true,
            rating: true,
            studentsCount: true,
            reviewsCount: true,
            thumbnail: true,
            duration: true,
            level: true,
          },
          orderBy: { studentsCount: "desc" },
        },
        _count: { select: { formations: { where: { status: "ACTIF" } } } },
      },
    });

    if (!instructeur) {
      return NextResponse.json({ error: "Instructeur introuvable" }, { status: 404 });
    }

    // Calculate aggregates
    const totalStudents = instructeur.formations.reduce((acc, f) => acc + f.studentsCount, 0);
    const ratings = instructeur.formations.filter((f) => f.reviewsCount > 0);
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((acc, f) => acc + f.rating * f.reviewsCount, 0) /
          ratings.reduce((acc, f) => acc + f.reviewsCount, 0)
        : 0;

    return NextResponse.json({
      instructeur: {
        ...instructeur,
        avgRating: Math.round(avgRating * 10) / 10,
        totalStudents,
      },
    });
  } catch (error) {
    console.error("[GET /api/formations/instructeurs/[id]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
