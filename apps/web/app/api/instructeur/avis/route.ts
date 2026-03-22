// GET /api/instructeur/avis — Avis reçus par l'instructeur

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import { getOrCreateInstructeurProfile } from "@/lib/formations/prisma-helpers";

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const instructeur = await getOrCreateInstructeurProfile(session.user.id);

    const avis = await prisma.formationReview.findMany({
      where: {
        formation: { instructeurId: instructeur.id },
      },
      include: {
        user: { select: { name: true, avatar: true, image: true } },
        formation: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ avis });
  } catch (error) {
    console.error("[GET /api/instructeur/avis]", error);
    return NextResponse.json({ avis: [] });
  }
}
