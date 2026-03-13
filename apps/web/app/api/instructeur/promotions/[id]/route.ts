// PUT /api/instructeur/promotions/[id] — Modifier une promotion flash
// DELETE /api/instructeur/promotions/[id] — Annuler une promotion flash

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";

async function getInstructeurAndPromo(userId: string, promoId: string) {
  const instructeur = await prisma.instructeurProfile.findUnique({ where: { userId } });
  if (!instructeur) return { instructeur: null, promo: null };

  const promo = await prisma.flashPromotion.findUnique({
    where: { id: promoId },
    include: {
      formation: { select: { instructeurId: true } },
      digitalProduct: { select: { instructeurId: true } },
    },
  });

  if (!promo) return { instructeur, promo: null };

  // Verify ownership
  const ownsFormation = promo.formation?.instructeurId === instructeur.id;
  const ownsProduct = promo.digitalProduct?.instructeurId === instructeur.id;

  if (!ownsFormation && !ownsProduct) return { instructeur, promo: null };

  return { instructeur, promo };
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

    const { instructeur, promo } = await getInstructeurAndPromo(session.user.id, id);
    if (!instructeur) {
      return NextResponse.json({ error: "Instructeur non trouvé" }, { status: 403 });
    }
    if (!promo) {
      return NextResponse.json({ error: "Promotion non trouvée" }, { status: 404 });
    }

    const body = await req.json();
    const { discountPct, startsAt, endsAt, maxUsage, isActive } = body;

    const promotion = await prisma.flashPromotion.update({
      where: { id },
      data: {
        ...(discountPct !== undefined && { discountPct: Number(discountPct) }),
        ...(startsAt !== undefined && { startsAt: new Date(startsAt) }),
        ...(endsAt !== undefined && { endsAt: new Date(endsAt) }),
        ...(maxUsage !== undefined && { maxUsage: maxUsage ? Number(maxUsage) : null }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ promotion });
  } catch (error) {
    console.error("[PUT /api/instructeur/promotions/[id]]", error);
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

    const { instructeur, promo } = await getInstructeurAndPromo(session.user.id, id);
    if (!instructeur) {
      return NextResponse.json({ error: "Instructeur non trouvé" }, { status: 403 });
    }
    if (!promo) {
      return NextResponse.json({ error: "Promotion non trouvée" }, { status: 404 });
    }

    await prisma.flashPromotion.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/instructeur/promotions/[id]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
