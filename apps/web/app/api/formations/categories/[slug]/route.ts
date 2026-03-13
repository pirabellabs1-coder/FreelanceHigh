// GET /api/formations/categories/[slug] — Détail d'une catégorie avec ses formations

import { NextRequest, NextResponse } from "next/server";
import prisma from "@freelancehigh/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const category = await prisma.formationCategory.findUnique({
      where: { slug },
    });

    if (!category) {
      return NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 });
    }

    const formations = await prisma.formation.findMany({
      where: { categoryId: category.id, status: "ACTIF" },
      include: {
        instructeur: { include: { user: { select: { name: true } } } },
      },
      orderBy: [{ studentsCount: "desc" }, { rating: "desc" }],
    });

    return NextResponse.json({ category, formations });
  } catch (error) {
    console.error("[GET /api/formations/categories/[slug]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
