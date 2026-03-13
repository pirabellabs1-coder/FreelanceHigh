// POST /api/formations/promo/validate — Valider un code promo et retourner le prix réduit

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { code, formationId } = await req.json();

    if (!code) {
      return NextResponse.json({ valid: false, error: "Code requis" }, { status: 400 });
    }

    const promo = await prisma.promoCode.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    });

    if (!promo) {
      return NextResponse.json({ valid: false, error: "Code invalide ou expiré" });
    }

    // Vérifier la limite d'utilisation
    if (promo.maxUsage !== null && promo.usageCount >= promo.maxUsage) {
      return NextResponse.json({ valid: false, error: "Ce code a atteint sa limite d'utilisation" });
    }

    // Vérifier le ciblage par formation (formationIds vide = toutes les formations)
    if (promo.formationIds.length > 0 && formationId) {
      if (!promo.formationIds.includes(formationId)) {
        return NextResponse.json({ valid: false, error: "Ce code ne s'applique pas à cette formation" });
      }
    }

    // Calculer le prix réduit si un formationId est fourni
    let originalPrice: number | null = null;
    let discountedPrice: number | null = null;

    if (formationId) {
      const formation = await prisma.formation.findUnique({
        where: { id: formationId },
        select: { price: true },
      });
      if (formation) {
        originalPrice = formation.price;
        discountedPrice = Math.round(formation.price * (1 - promo.discountPct / 100) * 100) / 100;
      }
    } else {
      // Calculer sur tout le panier
      const cartItems = await prisma.cartItem.findMany({
        where: { userId: session.user.id },
        include: { formation: { select: { id: true, price: true } } },
      });

      // Filtrer les formations ciblées si le code a des formationIds
      const applicableItems = promo.formationIds.length > 0
        ? cartItems.filter((item) => promo.formationIds.includes(item.formationId))
        : cartItems;

      const subtotal = cartItems.reduce((s, item) => s + item.formation.price, 0);
      const applicableSubtotal = applicableItems.reduce((s, item) => s + item.formation.price, 0);
      const discountAmount = Math.round(applicableSubtotal * (promo.discountPct / 100) * 100) / 100;

      originalPrice = subtotal;
      discountedPrice = Math.round((subtotal - discountAmount) * 100) / 100;
    }

    return NextResponse.json({
      valid: true,
      code: promo.code,
      discountPct: promo.discountPct,
      originalPrice,
      discountedPrice,
      formationIds: promo.formationIds,
    });
  } catch (error) {
    console.error("[POST /api/formations/promo/validate]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
