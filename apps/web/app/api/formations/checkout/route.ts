// POST /api/formations/checkout — Créer une session Stripe Checkout

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import Stripe from "stripe";
import { z } from "zod";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-02-25.clover" });
}

const checkoutSchema = z.object({
  promoCode: z.string().optional(),
  locale: z.enum(["fr", "en"]).default("fr"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const { promoCode, locale } = checkoutSchema.parse(body);

    // Récupérer le panier
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        formation: {
          select: {
            id: true,
            titleFr: true,
            titleEn: true,
            price: true,
            thumbnail: true,
            status: true,
          },
        },
      },
    });

    const activeItems = cartItems.filter((i) => i.formation.status === "ACTIF");

    if (activeItems.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    // Calculer la réduction promo
    let discountPct = 0;
    let promoId: string | undefined;

    if (promoCode) {
      const promo = await prisma.promoCode.findFirst({
        where: {
          code: promoCode.toUpperCase(),
          isActive: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      });

      if (promo) {
        discountPct = promo.discountPct;
        promoId = promo.id;
      }
    }

    // Check for active flash promotions on each formation
    const now = new Date();
    const flashPromos = await prisma.flashPromotion.findMany({
      where: {
        formationId: { in: activeItems.map((i) => i.formationId) },
        isActive: true,
        startsAt: { lte: now },
        endsAt: { gt: now },
      },
    });
    const flashPromoByFormation = new Map(
      flashPromos.filter((p) => !p.maxUsage || p.usageCount < p.maxUsage).map((p) => [p.formationId, p])
    );

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3450";

    // Créer la session Stripe Checkout
    const stripe = getStripe();
    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      locale: locale === "fr" ? "fr" : "en",
      line_items: activeItems.map((item) => {
        // Use flash promo if it gives a better discount than promo code
        const flashPromo = flashPromoByFormation.get(item.formationId);
        const effectiveDiscount = flashPromo
          ? Math.max(flashPromo.discountPct, discountPct)
          : discountPct;

        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: locale === "fr" ? item.formation.titleFr : item.formation.titleEn,
              images: item.formation.thumbnail ? [item.formation.thumbnail] : [],
              metadata: { formationId: item.formation.id },
            },
            unit_amount: Math.round(item.formation.price * (1 - effectiveDiscount / 100) * 100),
          },
          quantity: 1,
        };
      }),
      customer_email: session.user.email,
      metadata: {
        type: "formation",
        userId: session.user.id,
        formationIds: JSON.stringify(activeItems.map((i) => i.formationId)),
        promoId: promoId ?? "",
        flashPromoIds: JSON.stringify(flashPromos.map((p) => p.id)),
      },
      success_url: `${baseUrl}/formations/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/formations/panier?cancelled=true`,
    });

    return NextResponse.json({ url: stripeSession.url, sessionId: stripeSession.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: error.issues }, { status: 400 });
    }
    console.error("[POST /api/formations/checkout]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
