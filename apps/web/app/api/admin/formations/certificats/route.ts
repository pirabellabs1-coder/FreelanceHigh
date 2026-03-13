// GET /api/admin/formations/certificats — Liste tous les certificats pour l'admin

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

    const certificates = await prisma.certificate.findMany({
      include: {
        user: { select: { name: true, email: true } },
        enrollment: {
          include: {
            formation: { select: { titleFr: true, slug: true } },
          },
        },
      },
      orderBy: { issuedAt: "desc" },
      take: 200,
    });

    return NextResponse.json({ certificates });
  } catch (error) {
    console.error("[GET /api/admin/formations/certificats]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
