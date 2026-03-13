// GET /api/formations/[id]/discussions — Lister les discussions d'une formation
// POST /api/formations/[id]/discussions — Créer une discussion

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Verify formation exists
    const formation = await prisma.formation.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!formation) {
      return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });
    }

    const discussions = await prisma.courseDiscussion.findMany({
      where: { formationId: id },
      include: {
        user: { select: { id: true, name: true, image: true, avatar: true } },
        _count: { select: { replies: true } },
      },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ discussions });
  } catch (error) {
    console.error("[GET /api/formations/[id]/discussions]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, content } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "Titre et contenu requis" }, { status: 400 });
    }

    // Verify user is enrolled or is the instructor
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: session.user.id, formationId: id },
    });

    const isInstructor = await prisma.formation.findFirst({
      where: { id, instructeur: { userId: session.user.id } },
    });

    if (!enrollment && !isInstructor) {
      return NextResponse.json({ error: "Vous devez être inscrit pour participer" }, { status: 403 });
    }

    const discussion = await prisma.courseDiscussion.create({
      data: {
        formationId: id,
        userId: session.user.id,
        title: title.trim(),
        content: content.trim(),
      },
      include: {
        user: { select: { id: true, name: true, image: true, avatar: true } },
        _count: { select: { replies: true } },
      },
    });

    return NextResponse.json({ discussion }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/formations/[id]/discussions]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
