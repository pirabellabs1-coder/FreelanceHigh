// POST /api/formations/cart/promo — Appliquer un code promo
// DELETE /api/formations/cart/promo — Retirer le code promo
// GET /api/formations/cart/promo?code=xxx&formationId=yyy — Vérifier un code promo

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const code = req.nextUrl.searchParams.get("code");
    if (!code) return NextResponse.json({ valid: false });

    const promo = await prisma.promoCode.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    });

    if (!promo) return NextResponse.json({ valid: false, error: "Code invalide ou expiré" });

    // Check usage limit
    if (promo.maxUsage !== null && promo.usageCount >= promo.maxUsage) {
      return NextResponse.json({ valid: false, error: "Code invalide ou expiré" });
    }

    // Calculate discount amount based on cart
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { formation: { select: { price: true } } },
    });
    const subtotal = cartItems.reduce((s, item) => s + item.formation.price, 0);
    const discountAmount = Math.round(subtotal * (promo.discountPct / 100) * 100) / 100;

    return NextResponse.json({ valid: true, discountAmount, code: promo.code, discountPct: promo.discountPct });
  } catch (error) {
    console.error("[GET /api/formations/cart/promo]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const { code } = await req.json();
    if (!code) return NextResponse.json({ error: "Code requis" }, { status: 400 });

    const promo = await prisma.promoCode.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    });

    if (!promo) return NextResponse.json({ error: "Code invalide ou expiré" }, { status: 400 });

    // Check usage limit
    if (promo.maxUsage !== null && promo.usageCount >= promo.maxUsage) {
      return NextResponse.json({ error: "Code invalide ou expiré" }, { status: 400 });
    }

    // Store in session/cookie (simple approach: store in a temporary table or session)
    // For MVP: return the promo info and let the client handle the display
    return NextResponse.json({
      success: true,
      promoCode: promo.code,
      discountPct: promo.discountPct,
    });
  } catch (error) {
    console.error("[POST /api/formations/cart/promo]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest) {
  // Remove promo code (handled client-side, returns success)
  return NextResponse.json({ success: true });
}
