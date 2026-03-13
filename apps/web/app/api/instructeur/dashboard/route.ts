// GET /api/instructeur/dashboard — Stats du dashboard instructeur

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import { INSTRUCTOR_COMMISSION } from "@/lib/formations/prisma-helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const instructeur = await prisma.instructeurProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!instructeur || instructeur.status !== "APPROUVE") {
      return NextResponse.json({ error: "Compte instructeur non approuvé" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") ?? "30d";

    // Calculer la date de début selon la période
    const now = new Date();
    const startDate = new Date();
    switch (period) {
      case "7d": startDate.setDate(now.getDate() - 7); break;
      case "3m": startDate.setMonth(now.getMonth() - 3); break;
      case "6m": startDate.setMonth(now.getMonth() - 6); break;
      case "1y": startDate.setFullYear(now.getFullYear() - 1); break;
      default: startDate.setDate(now.getDate() - 30); // 30d
    }

    // Formations de l'instructeur
    const formations = await prisma.formation.findMany({
      where: { instructeurId: instructeur.id },
      select: {
        id: true,
        titleFr: true,
        titleEn: true,
        status: true,
        studentsCount: true,
        rating: true,
        reviewsCount: true,
        _count: { select: { enrollments: true } },
      },
    });

    const formationIds = formations.map((f) => f.id);

    // Enrollments dans la période
    const enrollments = await prisma.enrollment.findMany({
      where: {
        formationId: { in: formationIds },
        createdAt: { gte: startDate },
      },
      select: {
        paidAmount: true,
        createdAt: true,
        formationId: true,
      },
    });

    // CA total et net
    const totalRevenue = enrollments.reduce((acc, e) => acc + e.paidAmount, 0);
    const netRevenue = Math.round(totalRevenue * INSTRUCTOR_COMMISSION * 100) / 100;

    // Revenus ce mois
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const revenueThisMonth = enrollments
      .filter((e) => new Date(e.createdAt) >= firstOfMonth)
      .reduce((acc, e) => acc + e.paidAmount, 0);

    // Stats par formation (top 5)
    const formationStats = formations.map((f) => {
      const formationEnrollments = enrollments.filter((e) => e.formationId === f.id);
      const revenue = formationEnrollments.reduce((acc, e) => acc + e.paidAmount, 0);
      return {
        id: f.id,
        titleFr: f.titleFr,
        titleEn: f.titleEn,
        students: f.studentsCount,
        revenue: Math.round(revenue * INSTRUCTOR_COMMISSION * 100) / 100,
        rating: f.rating,
      };
    }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    // Graphique revenus par mois (12 derniers mois)
    const allEnrollments = await prisma.enrollment.findMany({
      where: {
        formationId: { in: formationIds },
        createdAt: { gte: new Date(now.getFullYear() - 1, now.getMonth(), 1) },
      },
      select: { paidAmount: true, createdAt: true },
    });

    const revenueByMonth: { month: string; amount: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextD = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthRevenue = allEnrollments
        .filter((e) => {
          const ed = new Date(e.createdAt);
          return ed >= d && ed < nextD;
        })
        .reduce((acc, e) => acc + e.paidAmount, 0);

      revenueByMonth.push({
        month: d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" }),
        amount: Math.round(monthRevenue * INSTRUCTOR_COMMISSION * 100) / 100,
      });
    }

    // Total apprenants
    const totalStudents = formations.reduce((acc, f) => acc + f.studentsCount, 0);

    // Note moyenne
    const avgRating = formations.filter((f) => f.rating > 0).length > 0
      ? Math.round(
          formations.filter((f) => f.rating > 0).reduce((acc, f) => acc + f.rating, 0) /
          formations.filter((f) => f.rating > 0).length * 10
        ) / 10
      : 0;

    return NextResponse.json({
      totalRevenue: Math.round(totalRevenue * INSTRUCTOR_COMMISSION * 100) / 100,
      revenueThisMonth: Math.round(revenueThisMonth * INSTRUCTOR_COMMISSION * 100) / 100,
      pendingRevenue: 0, // Calculé à partir des enrollments < 30 jours
      netRevenue,
      totalStudents,
      activeFormations: formations.filter((f) => f.status === "ACTIF").length,
      avgRating,
      revenueByMonth,
      topFormations: formationStats,
    });
  } catch (error) {
    console.error("[GET /api/instructeur/dashboard]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
