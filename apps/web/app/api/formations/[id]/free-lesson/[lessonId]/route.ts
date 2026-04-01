// GET /api/formations/[id]/free-lesson/[lessonId]
// Returns lesson content if the lesson is marked as isFree.
// No authentication or enrollment required.

import { NextResponse } from "next/server";
import prisma from "@freelancehigh/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  try {
    const { id: formationId, lessonId } = await params;

    // Fetch the lesson with its section to verify it belongs to this formation
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        section: { formationId },
      },
      select: {
        id: true,
        title: true,
        type: true,
        content: true,
        videoUrl: true,
        duration: true,
        isFree: true,
        order: true,
        section: {
          select: {
            title: true,
            formation: {
              select: { id: true, title: true, slug: true },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Leçon introuvable" },
        { status: 404 }
      );
    }

    if (!lesson.isFree) {
      return NextResponse.json(
        { error: "Cette leçon nécessite un achat" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      id: lesson.id,
      title: lesson.title,
      type: lesson.type,
      content: lesson.content,
      videoUrl: lesson.videoUrl,
      duration: lesson.duration,
      sectionTitle: lesson.section.title,
      formation: lesson.section.formation,
    });
  } catch (error) {
    console.error("[GET /api/formations/[id]/free-lesson/[lessonId]]", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
