import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { IS_DEV } from "@/lib/env";
import { DigitalProductType } from "@prisma/client";
import { getOrCreateInstructeur } from "@/lib/formations/instructeur";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

async function getOrCreateCategory(name: string) {
  const slug = slugify(name);
  const existing = await prisma.formationCategory.findUnique({ where: { slug } });
  if (existing) return existing;
  return prisma.formationCategory.create({
    data: { name, slug, isActive: true },
  });
}

/**
 * POST /api/formations/vendeur/products/create
 * Body: { kind: "formation" | "product", productType?, title, description, price, originalPrice?, category, thumbnail? }
 *  - kind="formation" (cours vidéo ou pack) → creates Formation
 *  - kind="product" (ebook, template, audio, software, bundle) → creates DigitalProduct
 * Returns { id, slug, kind, status }
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user && !IS_DEV) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    const userId = session?.user?.id ?? (IS_DEV ? "dev-instructeur-001" : null);
    if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    // ── Self-healing profile ensure ──────────────────────────────────────
    // 1. Look for existing profile
    let profile = await prisma.instructeurProfile.findUnique({ where: { userId } });

    if (!profile) {
      // 2. Verify user exists in DB
      const userRow = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true },
      });
      if (!userRow) {
        return NextResponse.json(
          {
            error: `Session expirée. Votre identifiant (${userId.slice(0, 8)}…) n'existe plus en base. Déconnectez-vous et reconnectez-vous.`,
            code: "USER_NOT_FOUND",
          },
          { status: 401 }
        );
      }

      // 3. Try to create
      try {
        profile = await prisma.instructeurProfile.create({
          data: { userId, status: "APPROUVE" },
        });
      } catch (createErr) {
        // Race condition? Try findUnique again
        profile = await prisma.instructeurProfile.findUnique({ where: { userId } });
        if (!profile) {
          const msg = createErr instanceof Error ? createErr.message : String(createErr);
          console.error("[products/create] profile create failed for userId=" + userId, createErr);
          return NextResponse.json(
            {
              error: `Création du profil vendeur impossible : ${msg.slice(0, 160)}`,
              code: "PROFILE_CREATE_FAILED",
              detail: msg,
            },
            { status: 500 }
          );
        }
      }

      // Align role (non-blocking)
      prisma.user
        .update({ where: { id: userId }, data: { formationsRole: "instructeur" } })
        .catch(() => null);
    }

    const body = await request.json();
    const {
      kind,
      productType,
      title,
      description,
      shortDesc,
      price,
      originalPrice,
      category,
      thumbnail,
      publish,
      modules, // For formations: [{ title, lessons: [{ title, duration }] }]
      fileUrl, // For digital products: URL of the downloadable file
    } = body;

    if (!kind || !title || price === undefined || price === null) {
      return NextResponse.json(
        { error: "kind, title et price sont requis" },
        { status: 400 }
      );
    }

    const baseSlug = slugify(title);
    let slug = baseSlug || `produit-${Date.now()}`;
    let suffix = 1;

    if (kind === "formation") {
      // Find unique slug
      while (await prisma.formation.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${suffix++}`;
      }
      const cat = await getOrCreateCategory(category || "Divers");

      // Compute total duration from modules
      const validModules: Array<{ title: string; lessons: Array<{ title: string; duration?: number }> }> = Array.isArray(modules) ? modules : [];
      const totalDuration = validModules.reduce(
        (sum, m) => sum + (Array.isArray(m.lessons) ? m.lessons.reduce((s, l) => s + (Number(l.duration) || 0), 0) : 0),
        0
      );

      const formation = await prisma.formation.create({
        data: {
          slug,
          title: title.trim(),
          shortDesc: shortDesc?.trim() || null,
          description: description?.trim() || null,
          customCategory: category || null,
          categoryId: cat.id,
          thumbnail: thumbnail || null,
          price: parseFloat(price),
          originalPrice: originalPrice ? parseFloat(originalPrice) : null,
          isFree: parseFloat(price) === 0,
          duration: totalDuration,
          status: publish ? "ACTIF" : "BROUILLON",
          instructeurId: profile.id,
          sections: validModules.length > 0 ? {
            create: validModules
              .filter((m) => m.title?.trim())
              .map((m, mIdx) => ({
                title: m.title.trim(),
                order: mIdx,
                lessons: {
                  create: (Array.isArray(m.lessons) ? m.lessons : [])
                    .filter((l) => l.title?.trim())
                    .map((l, lIdx) => ({
                      title: l.title.trim(),
                      type: "VIDEO" as const,
                      duration: Number(l.duration) || null,
                      order: lIdx,
                      isFree: mIdx === 0 && lIdx === 0,
                    })),
                },
              })),
          } : undefined,
        },
        include: { sections: { include: { lessons: true } } },
      });

      return NextResponse.json({
        data: {
          id: formation.id,
          slug: formation.slug,
          kind: "formation",
          status: formation.status,
          modules: formation.sections.length,
          lessons: formation.sections.reduce((s, m) => s + m.lessons.length, 0),
        },
      });
    }

    if (kind === "product") {
      while (await prisma.digitalProduct.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${suffix++}`;
      }
      const cat = await getOrCreateCategory(category || "Divers");

      const validTypes: DigitalProductType[] = ["EBOOK", "PDF", "TEMPLATE", "AUDIO", "VIDEO", "LICENCE", "AUTRE"];
      const type: DigitalProductType = validTypes.includes(productType as DigitalProductType)
        ? (productType as DigitalProductType)
        : "EBOOK";

      const product = await prisma.digitalProduct.create({
        data: {
          slug,
          title: title.trim(),
          description: description?.trim() || null,
          productType: type,
          categoryId: cat.id,
          banner: thumbnail || null,
          fileUrl: fileUrl?.trim() || null,
          price: parseFloat(price),
          originalPrice: originalPrice ? parseFloat(originalPrice) : null,
          isFree: parseFloat(price) === 0,
          status: publish ? "ACTIF" : "BROUILLON",
          instructeurId: profile.id,
        },
      });

      return NextResponse.json({
        data: { id: product.id, slug: product.slug, kind: "product", status: product.status },
      });
    }

    return NextResponse.json({ error: "kind invalide" }, { status: 400 });
  } catch (err) {
    console.error("[products/create]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
