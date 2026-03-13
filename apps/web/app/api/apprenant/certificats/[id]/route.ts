// GET /api/apprenant/certificats/[id] — Détail d'un certificat

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

    const certificate = await prisma.certificate.findFirst({
      where: { id, userId: session.user.id },
      include: {
        user: { select: { name: true } },
        enrollment: {
          include: {
            formation: {
              select: {
                titleFr: true,
                titleEn: true,
                slug: true,
                duration: true,
                instructeur: { include: { user: { select: { name: true } } } },
              },
            },
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json({ error: "Certificat introuvable" }, { status: 404 });
    }

    return NextResponse.json({ certificate });
  } catch (error) {
    console.error("[GET /api/apprenant/certificats/[id]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
