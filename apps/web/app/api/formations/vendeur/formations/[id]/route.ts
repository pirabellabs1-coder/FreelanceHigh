import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { IS_DEV } from "@/lib/env";

import { getInstructeurId as _gii } from "@/lib/formations/instructeur";
async function getProfileId(userId: string) { return _gii(userId); }

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user && !IS_DEV) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const userId = session?.user?.id ?? (IS_DEV ? "dev-instructeur-001" : null);
    if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const { id } = await params;
    const pid = await getProfileId(userId);
    if (!pid) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

    const formation = await prisma.formation.findFirst({
      where: { id, instructeurId: pid },
      select: {
        id: true, slug: true, title: true, shortDesc: true, description: true,
        thumbnail: true, previewVideo: true, price: true, originalPrice: true,
        customCategory: true, status: true, rating: true, studentsCount: true,
        reviewsCount: true, createdAt: true, updatedAt: true,
        sections: {
          orderBy: { order: "asc" },
          select: {
            id: true, title: true, desc: true, order: true,
            lessons: {
              orderBy: { order: "asc" },
              select: {
                id: true, title: true, desc: true, type: true, duration: true,
                order: true, isFree: true, videoUrl: true,
              },
            },
          },
        },
      },
    });

    if (!formation) return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });
    return NextResponse.json({ data: formation });
  } catch (err) {
    console.error("[formations/[id] GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user && !IS_DEV) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const userId = session?.user?.id ?? (IS_DEV ? "dev-instructeur-001" : null);
    if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const { id } = await params;
    const pid = await getProfileId(userId);
    if (!pid) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

    const existing = await prisma.formation.findFirst({ where: { id, instructeurId: pid } });
    if (!existing) return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });

    const body = await request.json();
    const updated = await prisma.formation.update({
      where: { id },
      data: {
        title: body.title?.trim() || undefined,
        shortDesc: body.shortDesc !== undefined ? body.shortDesc?.trim() || null : undefined,
        description: body.description !== undefined ? body.description?.trim() || null : undefined,
        thumbnail: body.thumbnail !== undefined ? body.thumbnail || null : undefined,
        price: body.price !== undefined ? parseFloat(body.price) : undefined,
        originalPrice: body.originalPrice !== undefined ? (body.originalPrice ? parseFloat(body.originalPrice) : null) : undefined,
        status: body.status ?? undefined,
      },
    });

    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error("[formations/[id] PATCH]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
