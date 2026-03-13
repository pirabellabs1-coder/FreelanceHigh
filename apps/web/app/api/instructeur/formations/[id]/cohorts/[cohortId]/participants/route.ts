// GET /api/instructeur/formations/[id]/cohorts/[cohortId]/participants — Liste participants

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; cohortId: string }> }
) {
  try {
    const { id, cohortId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const instructeur = await prisma.instructeurProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!instructeur) {
      return NextResponse.json({ error: "Profil instructeur introuvable" }, { status: 403 });
    }

    const formation = await prisma.formation.findFirst({
      where: { id, instructeurId: instructeur.id },
    });
    if (!formation) {
      return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });
    }

    const cohort = await prisma.formationCohort.findFirst({
      where: { id: cohortId, formationId: id },
    });
    if (!cohort) {
      return NextResponse.json({ error: "Cohorte introuvable" }, { status: 404 });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { cohortId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            image: true,
            country: true,
          },
        },
        certificate: { select: { code: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    const participants = enrollments.map((e) => ({
      id: e.id,
      progress: e.progress,
      completedAt: e.completedAt,
      createdAt: e.createdAt,
      user: e.user,
      certificate: e.certificate,
    }));

    return NextResponse.json({ participants });
  } catch (error) {
    console.error("[GET /api/instructeur/.../participants]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
