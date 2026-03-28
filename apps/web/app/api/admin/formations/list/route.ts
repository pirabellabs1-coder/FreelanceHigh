// GET /api/admin/formations/list — Liste toutes les formations pour l'admin

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["admin", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const status = req.nextUrl.searchParams.get("status") ?? undefined;
    const categoryId = req.nextUrl.searchParams.get("category") ?? undefined;
    const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1");
    const limit = 20;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;

    const [formations, total] = await Promise.all([
      prisma.formation.findMany({
        where,
        include: {
          category: { select: { name: true } },
          instructeur: {
            include: { user: { select: { name: true } } },
          },
        },
        orderBy: [
          { status: "asc" }, // EN_ATTENTE first
          { createdAt: "desc" },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.formation.count({ where }),
    ]);

    return NextResponse.json({ formations, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("[GET /api/admin/formations/list]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
