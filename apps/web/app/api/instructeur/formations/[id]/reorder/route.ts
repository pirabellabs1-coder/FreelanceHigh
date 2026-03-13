// PATCH /api/instructeur/formations/[id]/reorder — Réorganiser sections et leçons

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";

interface ReorderItem {
  id: string;
  order: number;
  lessons?: { id: string; order: number }[];
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { sections } = body as { sections: ReorderItem[] };

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
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

    // Update section orders + lesson orders in a transaction
    await prisma.$transaction(async (tx) => {
      for (const section of sections) {
        await tx.section.update({
          where: { id: section.id },
          data: { order: section.order },
        });

        if (section.lessons) {
          for (const lesson of section.lessons) {
            await tx.lesson.update({
              where: { id: lesson.id },
              data: { order: lesson.order, sectionId: section.id },
            });
          }
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PATCH /api/instructeur/formations/[id]/reorder]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
