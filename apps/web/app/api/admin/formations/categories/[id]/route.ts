// PUT /api/admin/formations/categories/[id] — Modifier une catégorie
// DELETE /api/admin/formations/categories/[id] — Supprimer une catégorie

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, slug, icon, color, order } = body;

    const category = await prisma.formationCategory.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(icon && { icon }),
        ...(color && { color }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("[PUT /api/admin/formations/categories/[id]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;

    // Check if formations use this category
    const count = await prisma.formation.count({ where: { categoryId: id } });
    if (count > 0) {
      return NextResponse.json(
        { error: `Impossible de supprimer : ${count} formation(s) utilisent cette catégorie` },
        { status: 400 }
      );
    }

    await prisma.formationCategory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/formations/categories/[id]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
