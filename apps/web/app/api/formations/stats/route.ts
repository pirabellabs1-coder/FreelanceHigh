// GET /api/formations/stats — Statistiques publiques de la plateforme formations

import { NextResponse } from "next/server";
import prisma from "@freelancehigh/db";

export const revalidate = 60; // ISR: revalider toutes les 60 secondes

export async function GET() {
  try {
    const [
      formationsCount,
      enrollmentsAgg,
      instructeursCount,
      reviewsAgg,
    ] = await Promise.all([
      // Nombre de formations actives
      prisma.formation.count({ where: { status: "ACTIF" } }),

      // Nombre d'apprenants uniques (distinct userId sur Enrollment)
      prisma.enrollment.groupBy({
        by: ["userId"],
        _count: true,
      }),

      // Nombre d'instructeurs approuvés
      prisma.instructeurProfile.count({ where: { status: "APPROUVE" } }),

      // Note moyenne globale
      prisma.formationReview.aggregate({
        _avg: { rating: true },
        _count: true,
      }),
    ]);

    return NextResponse.json({
      formations: formationsCount,
      apprenants: enrollmentsAgg.length,
      instructeurs: instructeursCount,
      averageRating: reviewsAgg._avg.rating
        ? Math.round(reviewsAgg._avg.rating * 10) / 10
        : 0,
      totalReviews: reviewsAgg._count,
    });
  } catch (error) {
    console.error("[GET /api/formations/stats]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
