// GET /api/apprenant/notes?lessonId=xxx — Récupérer les notes d'une leçon
// POST /api/apprenant/notes — Créer une note

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import { z } from "zod";

const createNoteSchema = z.object({
  lessonId: z.string(),
  content: z.string().min(1).max(2000),
  timestamp: z.number().nullable().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const lessonId = req.nextUrl.searchParams.get("lessonId");
    if (!lessonId) return NextResponse.json({ notes: [] });

    const notes = await prisma.lessonNote.findMany({
      where: { enrollment: { userId: session.user.id }, lessonId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("[GET /api/apprenant/notes]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const body = await req.json();
    const { lessonId, content, timestamp } = createNoteSchema.parse(body);

    // Find the lesson to get its formationId via section
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { section: { select: { formationId: true } } },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Leçon introuvable" }, { status: 404 });
    }

    // Find the enrollment for this user and formation
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_formationId: {
          userId: session.user.id,
          formationId: lesson.section.formationId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Non inscrit à cette formation" }, { status: 403 });
    }

    const note = await prisma.lessonNote.create({
      data: {
        enrollmentId: enrollment.id,
        lessonId,
        content,
        timestamp: timestamp ?? null,
      },
    });

    return NextResponse.json({ note });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }
    console.error("[POST /api/apprenant/notes]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
