// GET /api/admin/formations/apprenants — Liste tous les enrollments pour l'admin

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: { select: { name: true, email: true, avatar: true, image: true } },
        formation: { select: { titleFr: true, slug: true } },
        certificate: { select: { code: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({ enrollments });
  } catch (error) {
    console.error("[GET /api/admin/formations/apprenants]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
