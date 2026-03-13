// GET /api/formations/[id]/reviews — Liste des avis
// POST /api/formations/[id]/reviews — Ajouter un avis

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import { z } from "zod";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(20, Number(searchParams.get("limit")) || 10);

    const [reviews, total] = await Promise.all([
      prisma.formationReview.findMany({
        where: { formationId: id },
        include: {
          user: { select: { name: true, avatar: true, image: true, country: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.formationReview.count({ where: { formationId: id } }),
    ]);

    return NextResponse.json({ reviews, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("[GET /api/formations/[id]/reviews]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(2000),
});

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

    // Vérifier que l'apprenant est inscrit
    const enrollment = await prisma.enrollment.findFirst({
      where: { formationId: id, userId: session.user.id },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Vous devez être inscrit à cette formation pour laisser un avis" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { rating, comment } = reviewSchema.parse(body);

    const review = await prisma.formationReview.upsert({
      where: { userId_formationId: { userId: session.user.id, formationId: id } },
      update: { rating, comment, updatedAt: new Date() },
      create: {
        userId: session.user.id,
        formationId: id,
        enrollmentId: enrollment.id,
        rating,
        comment,
      },
      include: {
        user: { select: { name: true, avatar: true, image: true, country: true } },
      },
    });

    // Recalculer la note moyenne de la formation
    const stats = await prisma.formationReview.aggregate({
      where: { formationId: id },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.formation.update({
      where: { id },
      data: {
        rating: Math.round((stats._avg.rating ?? 0) * 10) / 10,
        reviewsCount: stats._count.rating,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: error.issues }, { status: 400 });
    }
    console.error("[POST /api/formations/[id]/reviews]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
