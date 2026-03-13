// GET /api/formations/checkout/verify?session_id=xxx — Vérifier une session Stripe post-paiement

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import Stripe from "stripe";
import prisma from "@freelancehigh/db";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-02-25.clover" });
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const sessionId = req.nextUrl.searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json({ error: "session_id manquant" }, { status: 400 });
    }

    // Vérifier la session Stripe
    const stripe = getStripe();
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (stripeSession.payment_status !== "paid") {
      return NextResponse.json({ paid: false, status: stripeSession.payment_status });
    }

    // Vérifier que la session appartient bien à cet utilisateur
    const metadata = stripeSession.metadata ?? {};
    if (metadata.userId !== session.user.id) {
      return NextResponse.json({ error: "Session non autorisée" }, { status: 403 });
    }

    // Récupérer les enrollments créés pour cette session
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: session.user.id,
        stripeSessionId: sessionId,
      },
      include: {
        formation: { select: { id: true, titleFr: true, titleEn: true, slug: true, thumbnail: true } },
      },
    });

    return NextResponse.json({
      paid: true,
      enrollments,
      formationCount: enrollments.length,
    });
  } catch (error) {
    console.error("[GET /api/formations/checkout/verify]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
