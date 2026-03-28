// GET /api/admin/instructeurs/list — Liste tous les instructeurs pour l'admin

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["admin", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const status = req.nextUrl.searchParams.get("status") ?? undefined;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const instructeurs = await prisma.instructeurProfile.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, avatar: true, image: true } },
        _count: { select: { formations: true } },
      },
      orderBy: [
        { status: "asc" }, // EN_ATTENTE first
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ instructeurs });
  } catch (error) {
    console.error("[GET /api/admin/instructeurs/list]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
