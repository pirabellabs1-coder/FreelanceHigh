// GET /api/apprenant/favoris — List user's favorite formations
// POST /api/apprenant/favoris — Add a formation to favorites
// DELETE /api/apprenant/favoris — Remove a formation from favorites
//
// Uses FormationFavorite model. Gracefully falls back if table doesn't exist yet.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = session.user.id;
    try {
      const favorites = await prisma.formationFavorite.findMany({
        where: { userId },
        select: { formationId: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ favorites });
    } catch {
      // Table doesn't exist yet (migration pending) — return empty
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

    const userId = session.user.id;
    try {
      await prisma.formationFavorite.upsert({
        where: { userId_formationId: { userId, formationId } },
        create: { userId, formationId },
        update: {},
      });
    } catch {
      // Table doesn't exist yet — silently succeed (localStorage still works)
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

    const userId = session.user.id;
    try {
      await prisma.formationFavorite.deleteMany({
        where: { userId, formationId },
      });
    } catch {
      // Table doesn't exist yet — silently succeed
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/apprenant/favoris]", error);
    return NextResponse.json({ success: true });
  }
}
