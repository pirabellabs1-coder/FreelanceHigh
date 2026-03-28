// POST /api/admin/instructeurs/approve/[id]

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import { sendInstructorApprovedEmail } from "@/lib/email/formations";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || !["admin", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const profile = await prisma.instructeurProfile.update({
      where: { id },
      data: { status: "APPROUVE" },
      include: { user: { select: { email: true, name: true } } },
    });

    // Notifier l'instructeur
    if (profile.user?.email) {
      sendInstructorApprovedEmail({
        email: profile.user.email,
        name: profile.user.name ?? "Instructeur",
      }).catch((err) => console.error("[Email] sendInstructorApprovedEmail:", err));
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[POST /api/admin/instructeurs/approve/[id]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
