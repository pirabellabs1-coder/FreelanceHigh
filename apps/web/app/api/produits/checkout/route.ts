// POST /api/produits/checkout — Création session Stripe Checkout pour un produit numérique

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "productId requis" },
        { status: 400 }
      );
    }

    // Atomic stock check + product fetch
    const product = await prisma.digitalProduct.findFirst({
      where: {
        id: productId,
        status: "ACTIF",
      },
      select: {
        id: true,
        titleFr: true,
        titleEn: true,
        price: true,
        isFree: true,
        maxBuyers: true,
        currentBuyers: true,
        banner: true,
        slug: true,
        instructeur: {
          select: { id: true },
        },
        flashPromotions: {
          where: {
            isActive: true,
            startsAt: { lte: new Date() },
            endsAt: { gt: new Date() },
          },
          take: 1,
          select: { id: true, discountPct: true, maxUsage: true, usageCount: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produit introuvable ou inactif" },
        { status: 404 }
      );
    }

    // Check if already purchased
    const existingPurchase = await prisma.digitalProductPurchase.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: product.id,
        },
      },
    });

    if (existingPurchase) {
      return NextResponse.json(
        { error: "Vous avez déjà acheté ce produit" },
        { status: 400 }
      );
    }

    // Check stock limit
    if (product.maxBuyers !== null && product.currentBuyers >= product.maxBuyers) {
      return NextResponse.json(
        { error: "Ce produit a atteint sa limite de ventes" },
        { status: 400 }
      );
    }

    // Handle free products
    if (product.isFree || product.price === 0) {
      await prisma.$transaction(async (tx) => {
        // Atomic stock check for free products
        if (product.maxBuyers !== null) {
          const updated = await tx.digitalProduct.updateMany({
            where: {
              id: product.id,
              currentBuyers: { lt: product.maxBuyers },
            },
            data: { currentBuyers: { increment: 1 }, salesCount: { increment: 1 } },
          });
          if (updated.count === 0) {
            throw new Error("STOCK_EXHAUSTED");
          }
        } else {
          await tx.digitalProduct.update({
            where: { id: product.id },
            data: { salesCount: { increment: 1 } },
          });
        }

        await tx.digitalProductPurchase.create({
          data: {
            userId: session.user.id,
            productId: product.id,
            paidAmount: 0,
          },
        });
      });

      return NextResponse.json({
        free: true,
        redirectUrl: `/formations/produits/${product.slug}?purchased=true`,
      });
    }

    // Calculate price with flash promo
    let finalPrice = product.price;
    let flashPromoId: string | null = null;

    const activePromo = product.flashPromotions[0];
    if (activePromo) {
      const promoAvailable =
        !activePromo.maxUsage || activePromo.usageCount < activePromo.maxUsage;
      if (promoAvailable) {
        finalPrice = product.price * (1 - activePromo.discountPct / 100);
        flashPromoId = activePromo.id;
      }
    }

    // Create Stripe Checkout session
    const stripe = getStripe();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3450";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: product.titleFr,
              ...(product.banner && { images: [product.banner] }),
            },
            unit_amount: Math.round(finalPrice * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "digital_product",
        userId: session.user.id,
        productId: product.id,
        flashPromoId: flashPromoId || "",
      },
      success_url: `${baseUrl}/formations/produits/${product.slug}?purchased=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/formations/produits/${product.slug}`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    if (error instanceof Error && error.message === "STOCK_EXHAUSTED") {
      return NextResponse.json(
        { error: "Ce produit a atteint sa limite de ventes" },
        { status: 400 }
      );
    }
    console.error("[POST /api/produits/checkout]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
