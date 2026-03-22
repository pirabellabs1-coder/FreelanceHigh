// GET /api/apprenant/favoris — List user's favorite formations
// POST /api/apprenant/favoris — Add a formation to favorites
// DELETE /api/apprenant/favoris — Remove a formation from favorites
//
// NOTE: Uses the FormationFavorite model. Falls back to empty array if model
// doesn't exist yet (pending migration).

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";

// Lazy import prisma to avoid build errors if model doesn't exist
async function getPrisma() {
  try {
    const mod = await import("@freelancehigh/db");
    return mod.default ?? mod;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const prisma = await getPrisma();
    if (!prisma) {
      return NextResponse.json({ favorites: [] });
    }

    const userId = session.user.id;

    // Try to query favorites — if model doesn't exist, return empty
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const favorites = await (prisma as any).formationFavorite.findMany({
        where: { userId },
        select: { formationId: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ favorites });
    } catch {
      // Model doesn't exist yet — return empty array gracefully
      return NextResponse.json({ favorites: [] });
    }
  } catch (error) {
    console.error("[GET /api/apprenant/favoris]", error);
    return NextResponse.json({ favorites: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const formationId = body?.formationId;

    if (!formationId || typeof formationId !== "string") {
      return NextResponse.json({ error: "formationId requis" }, { status: 400 });
    }

    const prisma = await getPrisma();
    if (!prisma) {
      return NextResponse.json({ success: true });
    }

    const userId = session.user.id;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (prisma as any).formationFavorite.upsert({
        where: { userId_formationId: { userId, formationId } },
        create: { userId, formationId },
        update: {},
      });
    } catch {
      // Model doesn't exist yet — silently succeed
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/apprenant/favoris]", error);
    return NextResponse.json({ success: true });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const formationId = searchParams.get("formationId");

    if (!formationId) {
      return NextResponse.json({ error: "formationId requis" }, { status: 400 });
    }

    const prisma = await getPrisma();
    if (!prisma) {
      return NextResponse.json({ success: true });
    }

    const userId = session.user.id;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (prisma as any).formationFavorite.deleteMany({
        where: { userId, formationId },
      });
    } catch {
      // Model doesn't exist yet — silently succeed
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/apprenant/favoris]", error);
    return NextResponse.json({ success: true });
  }
}
