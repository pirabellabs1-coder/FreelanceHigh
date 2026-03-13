// GET /api/produits/[id] — Détail d'un produit numérique
// PUT /api/produits/[id] — Mise à jour (par l'instructeur)
// DELETE /api/produits/[id] — Archivage (par l'instructeur)

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";

const productDetailInclude = {
  instructeur: {
    select: {
      id: true,
      bioFr: true,
      bioEn: true,
      user: { select: { name: true, avatar: true, image: true } },
    },
  },
  category: { select: { id: true, nameFr: true, nameEn: true, slug: true } },
  reviews: {
    take: 10,
    orderBy: { createdAt: "desc" as const },
    select: {
      id: true,
      rating: true,
      comment: true,
      response: true,
      respondedAt: true,
      createdAt: true,
      user: { select: { name: true, avatar: true, image: true } },
    },
  },
  flashPromotions: {
    where: {
      isActive: true,
      startsAt: { lte: new Date() },
      endsAt: { gt: new Date() },
    },
    take: 1,
    select: {
      id: true,
      discountPct: true,
      startsAt: true,
      endsAt: true,
      maxUsage: true,
      usageCount: true,
    },
  },
} as const;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.digitalProduct.findFirst({
      where: {
        OR: [{ slug: id }, { id }],
        status: "ACTIF",
      },
      include: productDetailInclude,
    });

    if (!product) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }

    // Increment view count (fire-and-forget)
    prisma.digitalProduct.update({
      where: { id: product.id },
      data: { viewsCount: { increment: 1 } },
    }).catch(() => {});

    return NextResponse.json({ product });
  } catch (error) {
    console.error("[GET /api/produits/[id]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const instructeur = await prisma.instructeurProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!instructeur) {
      return NextResponse.json({ error: "Instructeur non trouvé" }, { status: 403 });
    }

    const existing = await prisma.digitalProduct.findFirst({
      where: { OR: [{ slug: id }, { id }], instructeurId: instructeur.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }

    const body = await req.json();
    const {
      titleFr, titleEn, descriptionFr, descriptionEn, descriptionFormat,
      price, originalPrice, isFree, banner, fileUrl, fileStoragePath,
      fileSize, fileMimeType, previewEnabled, previewPages, watermarkEnabled,
      maxBuyers, tags, productType, categoryId,
    } = body;

    const product = await prisma.digitalProduct.update({
      where: { id: existing.id },
      data: {
        ...(titleFr !== undefined && { titleFr }),
        ...(titleEn !== undefined && { titleEn }),
        ...(descriptionFr !== undefined && { descriptionFr }),
        ...(descriptionEn !== undefined && { descriptionEn }),
        ...(descriptionFormat !== undefined && { descriptionFormat }),
        ...(price !== undefined && { price: Number(price) }),
        ...(originalPrice !== undefined && { originalPrice: originalPrice ? Number(originalPrice) : null }),
        ...(isFree !== undefined && { isFree }),
        ...(banner !== undefined && { banner }),
        ...(fileUrl !== undefined && { fileUrl }),
        ...(fileStoragePath !== undefined && { fileStoragePath }),
        ...(fileSize !== undefined && { fileSize }),
        ...(fileMimeType !== undefined && { fileMimeType }),
        ...(previewEnabled !== undefined && { previewEnabled }),
        ...(previewPages !== undefined && { previewPages }),
        ...(watermarkEnabled !== undefined && { watermarkEnabled }),
        ...(maxBuyers !== undefined && { maxBuyers: maxBuyers ? Number(maxBuyers) : null }),
        ...(tags !== undefined && { tags }),
        ...(productType !== undefined && { productType }),
        ...(categoryId !== undefined && { categoryId }),
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("[PUT /api/produits/[id]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const instructeur = await prisma.instructeurProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!instructeur) {
      return NextResponse.json({ error: "Instructeur non trouvé" }, { status: 403 });
    }

    const existing = await prisma.digitalProduct.findFirst({
      where: { OR: [{ slug: id }, { id }], instructeurId: instructeur.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }

    await prisma.digitalProduct.update({
      where: { id: existing.id },
      data: { status: "ARCHIVE" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/produits/[id]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
