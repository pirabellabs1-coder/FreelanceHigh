// GET /api/formations/[id]/cohorts — Cohortes disponibles pour une formation

import { NextRequest, NextResponse } from "next/server";
import prisma from "@freelancehigh/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find formation by id or slug
    const formation = await prisma.formation.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        status: "ACTIF",
      },
      select: { id: true },
    });

    if (!formation) {
      return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });
    }

    const cohorts = await prisma.formationCohort.findMany({
      where: {
        formationId: formation.id,
        status: { in: ["OUVERT", "COMPLET", "EN_COURS"] },
      },
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json({ cohorts });
  } catch (error) {
    console.error("[GET /api/formations/[id]/cohorts]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
