// POST /api/instructeur/sales-funnel — Créer un tunnel de vente
// GET /api/instructeur/sales-funnel — Lister les tunnels de l'instructeur
// GET /api/instructeur/sales-funnel?formationId=xxx — Récupérer le tunnel d'une formation

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import { z } from "zod";

const createSchema = z.object({
  formationId: z.string(),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/),
  blocks: z.array(z.any()).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const formationId = searchParams.get("formationId");

    if (formationId) {
      const funnel = await prisma.salesPage.findFirst({
        where: { formationId, instructorId: session.user.id },
      });
      return NextResponse.json({ funnel });
    }

    // List all funnels for this instructor
    const funnels = await prisma.salesPage.findMany({
      where: { instructorId: session.user.id },
      include: {
        formation: {
          select: { title: true, slug: true, thumbnail: true, price: true, studentsCount: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ funnels });
  } catch (error) {
    console.error("[GET /api/instructeur/sales-funnel]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const { formationId, slug, blocks } = createSchema.parse(body);

    // Verify formation belongs to this instructor
    const formation = await prisma.formation.findFirst({
      where: {
        id: formationId,
        instructeur: { userId: session.user.id },
      },
    });

    if (!formation) {
      return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });
    }

    // Check if funnel already exists
    const existing = await prisma.salesPage.findFirst({
      where: { formationId },
    });

    if (existing) {
      return NextResponse.json({ error: "Un tunnel existe déjà pour cette formation" }, { status: 400 });
    }

    // Check slug uniqueness
    const slugExists = await prisma.salesPage.findUnique({ where: { slug } });
    if (slugExists) {
      return NextResponse.json({ error: "Ce slug est déjà utilisé" }, { status: 400 });
    }

    const defaultBlocks = blocks ?? [
      { type: "HERO", data: { title: formation.title, subtitle: "", bgImage: formation.thumbnail ?? "", ctaText: "Acheter maintenant" } },
      { type: "PRICING", data: {} },
      { type: "CTA", data: { text: "Commencer la formation", url: "" } },
    ];

    const funnel = await prisma.salesPage.create({
      data: {
        formationId,
        instructorId: session.user.id,
        slug,
        blocks: defaultBlocks,
      },
    });

    return NextResponse.json({ funnel }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: error.issues }, { status: 400 });
    }
    console.error("[POST /api/instructeur/sales-funnel]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
