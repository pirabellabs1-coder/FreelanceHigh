// GET /api/formations/[id]/discussions/[discussionId] — Détail discussion + réponses
// POST /api/formations/[id]/discussions/[discussionId] — Répondre à une discussion
// PATCH /api/formations/[id]/discussions/[discussionId] — Épingler / résoudre (instructeur)
// DELETE /api/formations/[id]/discussions/[discussionId] — Supprimer (auteur ou instructeur)

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import { ensureUserInDb } from "@/lib/formations/ensure-user";

type Params = { params: Promise<{ id: string; discussionId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { discussionId } = await params;

    const discussion = await prisma.courseDiscussion.findUnique({
      where: { id: discussionId },
      include: {
        user: { select: { id: true, name: true, image: true, avatar: true } },
        replies: {
          include: {
            user: { select: { id: true, name: true, image: true, avatar: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!discussion) {
      return NextResponse.json({ error: "Discussion introuvable" }, { status: 404 });
    }

    return NextResponse.json({ discussion });
  } catch (error) {
    console.error("[GET discussion detail]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    await ensureUserInDb(session as { user: { id: string; email: string; name: string } });

    const { id, discussionId } = await params;
    const body = await req.json();
    const { content } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: "Contenu requis" }, { status: 400 });
    }

    // Verify enrollment or instructor
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: session.user.id, formationId: id },
    });

    const isInstructor = await prisma.formation.findFirst({
      where: { id, instructeur: { userId: session.user.id } },
    });

    if (!enrollment && !isInstructor) {
      return NextResponse.json({ error: "Vous devez être inscrit pour répondre" }, { status: 403 });
    }

    const reply = await prisma.courseDiscussionReply.create({
      data: {
        discussionId,
        userId: session.user.id,
        content: content.trim(),
        isInstructor: !!isInstructor,
      },
      include: {
        user: { select: { id: true, name: true, image: true, avatar: true } },
      },
    });

    return NextResponse.json({ reply }, { status: 201 });
  } catch (error) {
    console.error("[POST discussion reply]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id, discussionId } = await params;
    const body = await req.json();

    // Only instructor can pin/resolve
    const isInstructor = await prisma.formation.findFirst({
      where: { id, instructeur: { userId: session.user.id } },
    });

    if (!isInstructor) {
      return NextResponse.json({ error: "Réservé à l'instructeur" }, { status: 403 });
    }

    const data: Record<string, boolean> = {};
    if (typeof body.isPinned === "boolean") data.isPinned = body.isPinned;
    if (typeof body.isResolved === "boolean") data.isResolved = body.isResolved;

    const discussion = await prisma.courseDiscussion.update({
      where: { id: discussionId },
      data,
    });

    return NextResponse.json({ discussion });
  } catch (error) {
    console.error("[PATCH discussion]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id, discussionId } = await params;

    const discussion = await prisma.courseDiscussion.findUnique({
      where: { id: discussionId },
    });

    if (!discussion) {
      return NextResponse.json({ error: "Discussion introuvable" }, { status: 404 });
    }

    // Author or instructor can delete
    const isAuthor = discussion.userId === session.user.id;
    const isInstructor = await prisma.formation.findFirst({
      where: { id, instructeur: { userId: session.user.id } },
    });

    if (!isAuthor && !isInstructor) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    await prisma.courseDiscussion.delete({ where: { id: discussionId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE discussion]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
