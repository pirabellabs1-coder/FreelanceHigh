// POST /api/formations/[id]/reviews/[reviewId]/reply — Répondre à un avis (instructeur)

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import { ensureUserInDb } from "@/lib/formations/ensure-user";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; reviewId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    await ensureUserInDb(session as { user: { id: string; email: string; name: string } });

    const { id: formationId, reviewId } = await params;
    const { response } = await req.json();

    if (!response?.trim()) {
      return NextResponse.json({ error: "Réponse vide" }, { status: 400 });
    }

    // Verify that the user is the instructor of this formation
    const formation = await prisma.formation.findFirst({
      where: {
        id: formationId,
        instructeur: { userId: session.user.id },
      },
    });

    if (!formation) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const review = await prisma.formationReview.update({
      where: { id: reviewId, formationId },
      data: { response: response.trim() },
    });

    return NextResponse.json({ review });
  } catch (error) {
    console.error("[POST /api/formations/[id]/reviews/[reviewId]/reply]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
