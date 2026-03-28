// GET /api/admin/formations/categories — Liste les catégories
// POST /api/admin/formations/categories — Créer une catégorie

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["admin", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const categories = await prisma.formationCategory.findMany({
      include: { _count: { select: { formations: true } } },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("[GET /api/admin/formations/categories]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["admin", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await req.json();
    const { name, slug, icon, color } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const maxOrder = await prisma.formationCategory.aggregate({ _max: { order: true } });
    const order = (maxOrder._max.order ?? 0) + 1;

    const category = await prisma.formationCategory.create({
      data: { name, slug, icon: icon || "library_books", color: color || "#6C2BD9", order },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("[POST /api/admin/formations/categories]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
