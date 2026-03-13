// POST /api/formations/[id]/enroll — Inscrire un apprenant après paiement

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { stripeSessionId, paidAmount } = await req.json();

    const formation = await prisma.formation.findUnique({
      where: { id, status: "ACTIF" },
    });

    if (!formation) {
      return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });
    }

    // Vérifier que l'enrollment n'existe pas déjà (idempotence)
    const existing = await prisma.enrollment.findUnique({
      where: { userId_formationId: { userId: session.user.id, formationId: id } },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    // Créer l'enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        formationId: id,
        paidAmount: paidAmount ?? formation.price,
        stripeSessionId: stripeSessionId ?? null,
        progress: 0,
      },
    });

    // Incrémenter le compteur d'étudiants
    await prisma.formation.update({
      where: { id },
      data: { studentsCount: { increment: 1 } },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error("[POST /api/formations/[id]/enroll]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
