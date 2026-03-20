// GET /api/apprenant/cohorts — Mes cohortes

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = session.user.id;

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId,
        cohortId: { not: null },
      },
      include: {
        formation: {
          select: {
            id: true,
            slug: true,
            title: true,
            thumbnail: true,
            duration: true,
            level: true,
          },
        },
        cohort: {
          include: {
            _count: { select: { messages: true, enrollments: true } },
            formation: {
              select: {
                instructeur: {
                  select: {
                    user: { select: { name: true, avatar: true, image: true } },
                  },
                },
              },
            },
          },
        },
        certificate: { select: { code: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Group by status
    const cohorts = enrollments.map((e) => ({
      enrollmentId: e.id,
      progress: e.progress,
      completedAt: e.completedAt,
      enrolledAt: e.createdAt,
      formation: e.formation,
      cohort: e.cohort,
      certificate: e.certificate,
      instructeur: e.cohort?.formation?.instructeur ?? null,
    }));

    return NextResponse.json({ cohorts });
  } catch (error) {
    console.error("[GET /api/apprenant/cohorts]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
