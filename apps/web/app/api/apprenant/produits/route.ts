// GET /api/apprenant/produits — Liste des produits achetés par l'apprenant

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const purchases = await prisma.digitalProductPurchase.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: {
            id: true,
            slug: true,
            titleFr: true,
            titleEn: true,
            productType: true,
            banner: true,
            fileMimeType: true,
          },
        },
      },
    });

    return NextResponse.json({ purchases });
  } catch (error) {
    console.error("[GET /api/apprenant/produits]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
