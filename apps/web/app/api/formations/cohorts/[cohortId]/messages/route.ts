// GET/POST /api/formations/cohorts/[cohortId]/messages — Chat apprenant

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import { ensureUserInDb } from "@/lib/formations/ensure-user";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string().min(1).max(5000),
  attachmentUrl: z.string().optional().nullable(),
  attachmentName: z.string().optional().nullable(),
});

async function verifyEnrollment(cohortId: string, userId: string) {
  return prisma.enrollment.findFirst({
    where: { cohortId, userId },
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ cohortId: string }> }
) {
  try {
    const { cohortId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    await ensureUserInDb(session as { user: { id: string; email: string; name: string } });

    const enrollment = await verifyEnrollment(cohortId, session.user.id);
    if (!enrollment) {
      return NextResponse.json({ error: "Vous n'êtes pas inscrit à cette cohorte" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);
    const skip = (page - 1) * limit;
    const after = searchParams.get("after"); // For polling: messages after this timestamp

    const where: Record<string, unknown> = { cohortId };
    if (after) {
      where.createdAt = { gt: new Date(after) };
    }

    const [messages, total] = await Promise.all([
      prisma.cohortMessage.findMany({
        where: after ? where : { cohortId },
        include: {
          user: {
            select: { id: true, name: true, avatar: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: after ? 0 : skip,
        take: after ? 100 : limit,
      }),
      prisma.cohortMessage.count({ where: { cohortId } }),
    ]);

    // Pinned messages
    const pinned = await prisma.cohortMessage.findMany({
      where: { cohortId, isPinned: true },
      include: {
        user: {
          select: { id: true, name: true, avatar: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      messages: messages.reverse(),
      pinned,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[GET /api/formations/cohorts/[cohortId]/messages]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ cohortId: string }> }
) {
  try {
    const { cohortId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    await ensureUserInDb(session as { user: { id: string; email: string; name: string } });

    const enrollment = await verifyEnrollment(cohortId, session.user.id);
    if (!enrollment) {
      return NextResponse.json({ error: "Vous n'êtes pas inscrit à cette cohorte" }, { status: 403 });
    }

    const body = await req.json();
    const data = messageSchema.parse(body);

    const message = await prisma.cohortMessage.create({
      data: {
        cohortId,
        userId: session.user.id,
        content: data.content,
        isInstructor: false,
        attachmentUrl: data.attachmentUrl ?? null,
        attachmentName: data.attachmentName ?? null,
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true, image: true },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: error.issues }, { status: 400 });
    }
    console.error("[POST /api/formations/cohorts/[cohortId]/messages]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
