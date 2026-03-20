// PUT /api/instructeur/sales-funnel/[id] — Mettre à jour les blocs du tunnel
// DELETE /api/instructeur/sales-funnel/[id] — Supprimer le tunnel

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import { z } from "zod";

const updateSchema = z.object({
  blocks: z.array(z.any()).optional(),
  published: z.boolean().optional(),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/).optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const data = updateSchema.parse(body);

    // Verify ownership
    const funnel = await prisma.salesPage.findFirst({
      where: { id, instructorId: session.user.id },
    });

    if (!funnel) {
      return NextResponse.json({ error: "Tunnel introuvable" }, { status: 404 });
    }

    // Check slug uniqueness if changing
    if (data.slug && data.slug !== funnel.slug) {
      const slugExists = await prisma.salesPage.findUnique({ where: { slug: data.slug } });
      if (slugExists) {
        return NextResponse.json({ error: "Ce slug est déjà utilisé" }, { status: 400 });
      }
    }

    const updated = await prisma.salesPage.update({
      where: { id },
      data: {
        ...(data.blocks !== undefined ? { blocks: data.blocks } : {}),
        ...(data.published !== undefined ? { published: data.published } : {}),
        ...(data.slug ? { slug: data.slug } : {}),
      },
    });

    return NextResponse.json({ funnel: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: error.issues }, { status: 400 });
    }
    console.error("[PUT /api/instructeur/sales-funnel/[id]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const funnel = await prisma.salesPage.findFirst({
      where: { id, instructorId: session.user.id },
    });

    if (!funnel) {
      return NextResponse.json({ error: "Tunnel introuvable" }, { status: 404 });
    }

    await prisma.salesPage.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/instructeur/sales-funnel/[id]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
