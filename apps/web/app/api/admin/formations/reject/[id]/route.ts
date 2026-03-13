// POST /api/admin/formations/reject/[id]

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import { z } from "zod";
import { sendFormationRejectedEmail } from "@/lib/email/formations";

const rejectSchema = z.object({ reason: z.string().min(10) });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await req.json();
    const { reason } = rejectSchema.parse(body);

    const formation = await prisma.formation.update({
      where: { id },
      data: { status: "BROUILLON", refuseReason: reason },
      include: {
        instructeur: { include: { user: { select: { email: true, name: true } } } },
      },
    });

    // Notifier l'instructeur
    if (formation.instructeur?.user?.email) {
      sendFormationRejectedEmail({
        email: formation.instructeur.user.email,
        name: formation.instructeur.user.name ?? "Instructeur",
        formationTitle: formation.titleFr,
        reason,
      }).catch((err) => console.error("[Email] sendFormationRejectedEmail:", err));
    }

    return NextResponse.json(formation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: error.issues }, { status: 400 });
    }
    console.error("[POST /api/admin/formations/reject/[id]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
