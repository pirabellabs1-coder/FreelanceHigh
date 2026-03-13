// POST /api/instructeur/formations/[id]/duplicate — Dupliquer une formation

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";

export async function POST(
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
      return NextResponse.json({ error: "Profil instructeur introuvable" }, { status: 404 });
    }

    const original = await prisma.formation.findUnique({
      where: { id, instructeurId: instructeur.id },
      include: {
        sections: {
          include: { lessons: { include: { resources: true, quiz: { include: { questions: true } } } } },
        },
      },
    });

    if (!original) {
      return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });
    }

    // Create copy
    const slug = `${original.slug}-copie-${Date.now()}`;
    const copy = await prisma.formation.create({
      data: {
        slug,
        titleFr: `${original.titleFr} (Copie)`,
        titleEn: original.titleEn ? `${original.titleEn} (Copy)` : "",
        shortDescFr: original.shortDescFr,
        shortDescEn: original.shortDescEn,
        descriptionFr: original.descriptionFr,
        descriptionEn: original.descriptionEn,
        learnPointsFr: original.learnPointsFr,
        learnPointsEn: original.learnPointsEn,
        requirementsFr: original.requirementsFr,
        requirementsEn: original.requirementsEn,
        targetAudienceFr: original.targetAudienceFr,
        targetAudienceEn: original.targetAudienceEn,
        thumbnail: original.thumbnail,
        previewVideo: original.previewVideo,
        categoryId: original.categoryId,
        level: original.level,
        language: original.language,
        price: original.price,
        originalPrice: original.originalPrice,
        isFree: original.isFree,
        hasCertificate: original.hasCertificate,
        minScore: original.minScore,
        status: "BROUILLON",
        instructeurId: instructeur.id,
      },
    });

    return NextResponse.json({ formation: copy });
  } catch (error) {
    console.error("[POST /api/instructeur/formations/[id]/duplicate]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
