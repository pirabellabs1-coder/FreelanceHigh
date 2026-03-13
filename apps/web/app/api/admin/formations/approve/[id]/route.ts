// POST /api/admin/formations/approve/[id]

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import { sendFormationApprovedEmail } from "@/lib/email/formations";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const formation = await prisma.formation.update({
      where: { id },
      data: {
        status: "ACTIF",
        publishedAt: new Date(),
        refuseReason: null,
      },
      include: {
        instructeur: { include: { user: { select: { email: true, name: true } } } },
      },
    });

    // Notifier l'instructeur par email
    if (formation.instructeur?.user?.email) {
      sendFormationApprovedEmail({
        email: formation.instructeur.user.email,
        name: formation.instructeur.user.name ?? "Instructeur",
        formationTitle: formation.titleFr,
        formationSlug: formation.slug,
      }).catch((err) => console.error("[Email] sendFormationApprovedEmail:", err));
    }

    return NextResponse.json(formation);
  } catch (error) {
    console.error("[POST /api/admin/formations/approve/[id]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
