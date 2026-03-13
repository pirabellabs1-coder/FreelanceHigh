// GET /api/produits — Liste des produits numériques (marketplace publique)
// POST /api/produits — Création d'un produit numérique (instructeur)

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import { z } from "zod";

const productInclude = {
  instructeur: {
    select: {
      user: { select: { name: true, avatar: true, image: true } },
    },
  },
  category: { select: { id: true, nameFr: true, nameEn: true, slug: true } },
} as const;

// GET — Marketplace publique
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const rating = searchParams.get("rating");
    const sort = searchParams.get("sort") || "populaire";
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const where: Record<string, unknown> = { status: "ACTIF" };

    if (category) where.categoryId = category;
    if (type) where.productType = type;
    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) (where.price as Record<string, number>).gte = parseFloat(priceMin);
      if (priceMax) (where.price as Record<string, number>).lte = parseFloat(priceMax);
    }
    if (rating) where.rating = { gte: parseFloat(rating) };
    if (search) {
      where.OR = [
        { titleFr: { contains: search, mode: "insensitive" } },
        { titleEn: { contains: search, mode: "insensitive" } },
      ];
    }

    let orderBy: Record<string, string> = { salesCount: "desc" };
    switch (sort) {
      case "recent": orderBy = { createdAt: "desc" }; break;
      case "prix_asc": orderBy = { price: "asc" }; break;
      case "prix_desc": orderBy = { price: "desc" }; break;
      case "note": orderBy = { rating: "desc" }; break;
      default: orderBy = { salesCount: "desc" };
    }

    const [products, total] = await Promise.all([
      prisma.digitalProduct.findMany({
        where: where as never,
        include: productInclude,
        orderBy: orderBy as never,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.digitalProduct.count({ where: where as never }),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[GET /api/produits]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST — Création produit numérique
const createProductSchema = z.object({
  titleFr: z.string().min(3),
  titleEn: z.string().min(3),
  descriptionFr: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionFormat: z.enum(["text", "tiptap"]).default("text"),
  productType: z.enum(["EBOOK", "PDF", "TEMPLATE", "LICENCE", "AUDIO", "VIDEO", "AUTRE"]),
  categoryId: z.string(),
  price: z.number().min(0),
  originalPrice: z.number().optional(),
  isFree: z.boolean().default(false),
  banner: z.string().optional(),
  fileUrl: z.string().optional(),
  fileStoragePath: z.string().optional(),
  fileSize: z.number().optional(),
  fileMimeType: z.string().optional(),
  previewEnabled: z.boolean().default(false),
  previewPages: z.number().min(1).max(50).default(5),
  watermarkEnabled: z.boolean().default(true),
  maxBuyers: z.number().int().min(1).optional(),
  tags: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const instructeur = await prisma.instructeurProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!instructeur || instructeur.status !== "APPROUVE") {
      return NextResponse.json({ error: "Instructeur non approuvé" }, { status: 403 });
    }

    const body = await req.json();
    const data = createProductSchema.parse(body);

    // Generate unique slug
    const baseSlug = data.titleFr
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    const product = await prisma.digitalProduct.create({
      data: {
        slug,
        titleFr: data.titleFr,
        titleEn: data.titleEn,
        descriptionFr: data.descriptionFr,
        descriptionEn: data.descriptionEn,
        descriptionFormat: data.descriptionFormat,
        productType: data.productType,
        categoryId: data.categoryId,
        price: data.price,
        originalPrice: data.originalPrice,
        isFree: data.isFree,
        banner: data.banner,
        fileUrl: data.fileUrl,
        fileStoragePath: data.fileStoragePath,
        fileSize: data.fileSize,
        fileMimeType: data.fileMimeType,
        previewEnabled: data.previewEnabled,
        previewPages: data.previewPages,
        watermarkEnabled: data.watermarkEnabled,
        maxBuyers: data.maxBuyers,
        tags: data.tags,
        status: "EN_ATTENTE",
        instructeurId: instructeur.id,
      },
      include: productInclude,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: error.issues }, { status: 400 });
    }
    console.error("[POST /api/produits]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
