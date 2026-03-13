// POST /api/admin/instructeurs/reject/[id]

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import { z } from "zod";
import { sendInstructorRejectedEmail } from "@/lib/email/formations";

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

    const profile = await prisma.instructeurProfile.update({
      where: { id },
      data: { status: "SUSPENDU" },
      include: { user: { select: { email: true, name: true } } },
    });

    // Notifier l'instructeur
    if (profile.user?.email) {
      sendInstructorRejectedEmail({
        email: profile.user.email,
        name: profile.user.name ?? "Instructeur",
        reason,
      }).catch((err) => console.error("[Email] sendInstructorRejectedEmail:", err));
    }

    return NextResponse.json({ ...profile, rejectReason: reason });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: error.issues }, { status: 400 });
    }
    console.error("[POST /api/admin/instructeurs/reject/[id]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
