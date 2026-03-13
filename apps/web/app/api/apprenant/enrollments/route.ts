// GET /api/apprenant/enrollments — Mes formations avec stats

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
      where: { userId },
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
          },
        },
        certificate: { select: { code: true } },
        cohort: {
          select: {
            id: true,
            titleFr: true,
            titleEn: true,
            status: true,
            startDate: true,
            endDate: true,
          },
        },
        lessonProgress: {
          take: 1,
          orderBy: { completedAt: "desc" },
          where: { completed: true },
          include: {
            lesson: { select: { titleFr: true, titleEn: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Build instructor name for each enrollment
    const enriched = await Promise.all(
      enrollments.map(async (e) => {
        const instructeur = await prisma.instructeurProfile.findFirst({
          where: { formations: { some: { id: e.formationId } } },
          include: { user: { select: { name: true } } },
        });
        return {
          ...e,
          instructeur: { user: { name: instructeur?.user?.name ?? "" } },
          lastLessonTitle: e.lessonProgress[0]?.lesson?.titleFr ?? null,
        };
      })
    );

    // Stats
    const completed = enrollments.filter((e) => e.progress >= 100).length;
    const inProgress = enrollments.filter((e) => e.progress < 100).length;
    const certificates = enrollments.filter((e) => e.certificate !== null).length;
    const totalMinutes = enrollments.reduce((sum, e) => sum + e.formation.duration, 0);
    const totalHours = Math.round(totalMinutes / 60);

    // Streak: check consecutive days with lesson activity
    const recentProgress = await prisma.lessonProgress.findMany({
      where: {
        enrollment: { userId },
        completed: true,
        completedAt: { not: null },
      },
      select: { completedAt: true },
      orderBy: { completedAt: "desc" },
      take: 100,
    });

    let streak = 0;
    if (recentProgress.length > 0) {
      const dates = [...new Set(recentProgress.map((p) => p.completedAt!.toISOString().split("T")[0]))];
      const today = new Date().toISOString().split("T")[0];
      let current = today;
      for (const date of dates) {
        if (date === current) {
          streak++;
          const d = new Date(current);
          d.setDate(d.getDate() - 1);
          current = d.toISOString().split("T")[0];
        } else break;
      }
    }

    return NextResponse.json({
      enrollments: enriched,
      stats: { inProgress, completed, certificates, totalHours, streak },
    });
  } catch (error) {
    console.error("[GET /api/apprenant/enrollments]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
