// GET /api/instructeur/promotions — Liste des promotions flash de l'instructeur
// POST /api/instructeur/promotions — Création d'une promotion flash

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import { getOrCreateInstructeurProfile } from "@/lib/formations/prisma-helpers";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const instructeur = await getOrCreateInstructeurProfile(session.user.id);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // active, scheduled, expired, all

    const now = new Date();
    let where: Record<string, unknown> = {};

    // Get all promotions for this instructor's products/formations
    const instructeurFormationIds = await prisma.formation.findMany({
      where: { instructeurId: instructeur.id },
      select: { id: true },
    });
    const instructeurProductIds = await prisma.digitalProduct.findMany({
      where: { instructeurId: instructeur.id },
      select: { id: true },
    });

    const formationIds = instructeurFormationIds.map((f) => f.id);
    const productIds = instructeurProductIds.map((p) => p.id);

    where = {
      OR: [
        { formationId: { in: formationIds } },
        { digitalProductId: { in: productIds } },
      ],
    };

    if (status === "active") {
      where.isActive = true;
      where.startsAt = { lte: now };
      where.endsAt = { gt: now };
    } else if (status === "scheduled") {
      where.isActive = true;
      where.startsAt = { gt: now };
    } else if (status === "expired") {
      where.OR = [
        { endsAt: { lte: now } },
        { isActive: false },
      ];
    }

    const promotions = await prisma.flashPromotion.findMany({
      where: where as never,
      orderBy: { createdAt: "desc" },
      include: {
        formation: { select: { id: true, title: true } },
        digitalProduct: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({ promotions });
  } catch (error) {
    console.error("[GET /api/instructeur/promotions]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

const createPromoSchema = z.object({
  formationId: z.string().optional(),
  digitalProductId: z.string().optional(),
  discountPct: z.number().min(1).max(90),
  startsAt: z.string().transform((s) => new Date(s)),
  endsAt: z.string().transform((s) => new Date(s)),
  maxUsage: z.number().int().min(1).optional(),
}).refine((data) => data.formationId || data.digitalProductId, {
  message: "formationId ou digitalProductId requis",
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const instructeur = await getOrCreateInstructeurProfile(session.user.id);

    const body = await req.json();
    const data = createPromoSchema.parse(body);

    // Verify ownership
    if (data.formationId) {
      const formation = await prisma.formation.findFirst({
        where: { id: data.formationId, instructeurId: instructeur.id },
      });
      if (!formation) {
        return NextResponse.json({ error: "Formation non trouvée" }, { status: 404 });
      }
    }
    if (data.digitalProductId) {
      const product = await prisma.digitalProduct.findFirst({
        where: { id: data.digitalProductId, instructeurId: instructeur.id },
      });
      if (!product) {
        return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
      }
    }

    // Validate dates
    if (data.endsAt <= data.startsAt) {
      return NextResponse.json({ error: "La date de fin doit être après la date de début" }, { status: 400 });
    }

    const promotion = await prisma.flashPromotion.create({
      data: {
        formationId: data.formationId || null,
        digitalProductId: data.digitalProductId || null,
        discountPct: data.discountPct,
        startsAt: data.startsAt,
        endsAt: data.endsAt,
        maxUsage: data.maxUsage || null,
        isActive: true,
        usageCount: 0,
      },
      include: {
        formation: { select: { id: true, title: true } },
        digitalProduct: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({ promotion }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: error.issues }, { status: 400 });
    }
    console.error("[POST /api/instructeur/promotions]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
