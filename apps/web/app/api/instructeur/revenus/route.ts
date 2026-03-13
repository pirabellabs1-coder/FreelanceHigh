// GET /api/instructeur/revenus — Finances instructeur

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import { INSTRUCTOR_COMMISSION, PLATFORM_COMMISSION } from "@/lib/formations/prisma-helpers";

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
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Number(searchParams.get("limit")) || 20);

    const formations = await prisma.formation.findMany({
      where: { instructeurId: instructeur.id },
      select: { id: true },
    });
    const formationIds = formations.map((f) => f.id);

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where: { formationId: { in: formationIds } },
        include: {
          user: { select: { name: true } },
          formation: { select: { titleFr: true, titleEn: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.enrollment.count({ where: { formationId: { in: formationIds } } }),
    ]);

    const withdrawals = await prisma.instructorWithdrawal.findMany({
      where: { instructeurId: instructeur.id },
      orderBy: { createdAt: "desc" },
    });

    const totalRevenue = enrollments.reduce((acc, e) => acc + e.paidAmount, 0);
    const withdrawnAmount = withdrawals
      .filter((w) => w.status === "TRAITE")
      .reduce((acc, w) => acc + w.amount, 0);

    const availableBalance = Math.round(
      (totalRevenue * INSTRUCTOR_COMMISSION - withdrawnAmount) * 100
    ) / 100;

    // Montant en attente (enrollments < 30 jours)
    const allEnrollments = await prisma.enrollment.findMany({
      where: { formationId: { in: formationIds } },
      select: { paidAmount: true, createdAt: true },
    });

    const pendingRevenue = allEnrollments
      .filter((e) => new Date(e.createdAt) > thirtyDaysAgo)
      .reduce((acc, e) => acc + e.paidAmount * INSTRUCTOR_COMMISSION, 0);

    const transactions = enrollments.map((e) => ({
      id: e.id,
      formationTitleFr: e.formation.titleFr,
      formationTitleEn: e.formation.titleEn,
      studentName: e.user.name,
      amount: e.paidAmount,
      net: Math.round(e.paidAmount * INSTRUCTOR_COMMISSION * 100) / 100,
      commission: Math.round(e.paidAmount * PLATFORM_COMMISSION * 100) / 100,
      status:
        new Date(e.createdAt) > thirtyDaysAgo ? "EN_ATTENTE" : "DISPONIBLE",
      createdAt: e.createdAt,
    }));

    return NextResponse.json({
      totalRevenue: Math.round(totalRevenue * INSTRUCTOR_COMMISSION * 100) / 100,
      availableBalance,
      pendingRevenue: Math.round(pendingRevenue * 100) / 100,
      withdrawnAmount,
      transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      withdrawals,
    });
  } catch (error) {
    console.error("[GET /api/instructeur/revenus]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
