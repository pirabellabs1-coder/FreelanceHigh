// GET /api/instructeur/formations/[id] — Récupérer une formation (pour modification)
// PUT /api/instructeur/formations/[id] — Modifier une formation (instructeur)
// DELETE /api/instructeur/formations/[id] — Supprimer une formation

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

    const instructeur = await prisma.instructeurProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!instructeur) {
      return NextResponse.json({ error: "Profil instructeur introuvable" }, { status: 403 });
    }

    const formation = await prisma.formation.findFirst({
      where: { id, instructeurId: instructeur.id },
      include: {
        sections: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              include: { quiz: { include: { questions: true } } },
            },
          },
        },
        category: true,
      },
    });

    if (!formation) {
      return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });
    }

    return NextResponse.json({ formation });
  } catch (error) {
    console.error("[GET /api/instructeur/formations/[id]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const instructeur = await prisma.instructeurProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!instructeur) {
      return NextResponse.json({ error: "Profil instructeur introuvable" }, { status: 403 });
    }

    // Verify ownership
    const existing = await prisma.formation.findFirst({
      where: { id, instructeurId: instructeur.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });
    }

    const {
      title, description,
      categoryId, level, duration, thumbnail, previewVideo,
      price, isFree, originalPrice, hasCertificate, minScore,
      status, sections, locale,
    } = body;

    // Update formation
    const formation = await prisma.formation.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(locale && { locale }),
        ...(categoryId && { categoryId }),
        ...(level && { level }),
        ...(duration !== undefined && { duration }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(previewVideo !== undefined && { previewVideo }),
        ...(price !== undefined && { price }),
        ...(isFree !== undefined && { isFree }),
        ...(originalPrice !== undefined && { originalPrice }),
        ...(hasCertificate !== undefined && { hasCertificate }),
        ...(minScore !== undefined && { minScore }),
        ...(status && { status }),
        ...(status === "EN_ATTENTE" && { publishedAt: new Date() }),
      },
    });

    // Upsert sections and lessons if provided
    if (sections && Array.isArray(sections)) {
      // Delete old sections/lessons
      await prisma.section.deleteMany({ where: { formationId: id } });

      // Create new ones
      for (const sectionData of sections) {
        const section = await prisma.section.create({
          data: {
            title: sectionData.title,
            order: sectionData.order,
            formationId: id,
          },
        });

        if (sectionData.lessons && Array.isArray(sectionData.lessons)) {
          for (const lessonData of sectionData.lessons) {
            const lesson = await prisma.lesson.create({
              data: {
                title: lessonData.title,
                type: lessonData.type,
                videoUrl: lessonData.videoUrl ?? null,
                content: lessonData.content ?? null,
                duration: lessonData.duration ?? null,
                isFree: lessonData.isFree ?? false,
                order: lessonData.order,
                sectionId: section.id,
                subtitleUrl: lessonData.subtitleUrl ?? null,
                subtitleStoragePath: lessonData.subtitleStoragePath ?? null,
                subtitleLabel: lessonData.subtitleLabel ?? null,
                chapters: lessonData.chapters ?? null,
              },
            });

            // Create quiz if present
            if (lessonData.type === "QUIZ" && lessonData.quiz) {
              const quiz = await prisma.quiz.create({
                data: {
                  title: lessonData.quiz.title,
                  passingScore: lessonData.quiz.passingScore ?? 80,
                  timeLimit: lessonData.quiz.timeLimit ?? null,
                  lessonId: lesson.id,
                },
              });

              if (lessonData.quiz.questions && Array.isArray(lessonData.quiz.questions)) {
                await prisma.question.createMany({
                  data: lessonData.quiz.questions.map((q: { type: string; text: string; options: unknown[]; correctAnswer: string; explanation?: string }, qIdx: number) => ({
                    type: q.type,
                    text: q.text,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation ?? null,
                    quizId: quiz.id,
                  })),
                });
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ formation });
  } catch (error) {
    console.error("[PUT /api/instructeur/formations/[id]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

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

    if (formation.studentsCount > 0) {
      return NextResponse.json(
        { error: "Impossible de supprimer une formation avec des apprenants inscrits" },
        { status: 400 }
      );
    }

    await prisma.formation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/instructeur/formations/[id]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
