// GET /api/apprenant/cohorts/[cohortId] — Détail cohorte apprenant

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ cohortId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { cohortId } = await params;
    const userId = session.user.id;

    // Verify the user is enrolled in this cohort
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId, cohortId },
      include: {
        certificate: { select: { code: true } },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Non inscrit à cette cohorte" }, { status: 403 });
    }

    // Get cohort with formation + instructor
    const cohort = await prisma.formationCohort.findUnique({
      where: { id: cohortId },
      include: {
        formation: {
          select: {
            id: true,
            slug: true,
            titleFr: true,
            titleEn: true,
            thumbnail: true,
            duration: true,
            instructeur: {
              select: {
                user: { select: { name: true, avatar: true, image: true } },
              },
            },
          },
        },
        enrollments: {
          select: {
            id: true,
            progress: true,
            user: {
              select: { name: true, avatar: true, image: true },
            },
          },
        },
      },
    });

    if (!cohort) {
      return NextResponse.json({ error: "Cohorte introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      id: cohort.id,
      titleFr: cohort.titleFr,
      titleEn: cohort.titleEn,
      descriptionFr: cohort.descriptionFr,
      descriptionEn: cohort.descriptionEn,
      startDate: cohort.startDate,
      endDate: cohort.endDate,
      enrollmentDeadline: cohort.enrollmentDeadline,
      maxParticipants: cohort.maxParticipants,
      currentCount: cohort.currentCount,
      price: cohort.price,
      status: cohort.status,
      schedule: cohort.schedule,
      formation: {
        id: cohort.formation.id,
        slug: cohort.formation.slug,
        titleFr: cohort.formation.titleFr,
        titleEn: cohort.formation.titleEn,
        thumbnail: cohort.formation.thumbnail,
        duration: cohort.formation.duration,
      },
      instructeur: cohort.formation.instructeur,
      enrollment: {
        id: enrollment.id,
        progress: enrollment.progress,
        completedAt: enrollment.completedAt,
        certificate: enrollment.certificate,
      },
      participants: cohort.enrollments.map((e) => ({
        id: e.id,
        progress: e.progress,
        user: e.user,
      })),
    });
  } catch (error) {
    console.error("[GET /api/apprenant/cohorts/[cohortId]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
