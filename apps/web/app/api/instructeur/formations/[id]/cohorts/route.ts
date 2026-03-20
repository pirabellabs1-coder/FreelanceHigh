// GET/POST /api/instructeur/formations/[id]/cohorts — Lister + créer cohortes

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import { z } from "zod";

const createCohortSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(2000).optional().nullable(),
  startDate: z.string().refine((d) => !isNaN(Date.parse(d)), "Date invalide"),
  endDate: z.string().refine((d) => !isNaN(Date.parse(d)), "Date invalide"),
  enrollmentDeadline: z.string().refine((d) => !isNaN(Date.parse(d)), "Date invalide"),
  maxParticipants: z.number().int().min(2).max(500),
  price: z.number().min(0).max(10000),
  originalPrice: z.number().min(0).optional().nullable(),
  schedule: z.any().optional().nullable(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const cohorts = await prisma.formationCohort.findMany({
      where: { formationId: id },
      include: {
        _count: { select: { enrollments: true, messages: true } },
      },
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json({ cohorts });
  } catch (error) {
    console.error("[GET /api/instructeur/formations/[id]/cohorts]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    if (formation.status !== "ACTIF") {
      return NextResponse.json({ error: "La formation doit être active pour créer une cohorte" }, { status: 400 });
    }

    const body = await req.json();
    const data = createCohortSchema.parse(body);

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const enrollmentDeadline = new Date(data.enrollmentDeadline);

    if (endDate <= startDate) {
      return NextResponse.json({ error: "La date de fin doit être après la date de début" }, { status: 400 });
    }
    if (enrollmentDeadline >= startDate) {
      return NextResponse.json({ error: "La deadline d'inscription doit être avant la date de début" }, { status: 400 });
    }

    const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    const cohort = await prisma.formationCohort.create({
      data: {
        formationId: id,
        title: data.title,
        description: data.description ?? null,
        startDate,
        endDate,
        enrollmentDeadline,
        durationDays,
        maxParticipants: data.maxParticipants,
        price: data.price,
        originalPrice: data.originalPrice ?? null,
        schedule: data.schedule ?? null,
      },
    });

    // Mark formation as group formation
    if (!formation.isGroupFormation) {
      await prisma.formation.update({
        where: { id },
        data: { isGroupFormation: true },
      });
    }

    return NextResponse.json(cohort, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: error.issues }, { status: 400 });
    }
    console.error("[POST /api/instructeur/formations/[id]/cohorts]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
