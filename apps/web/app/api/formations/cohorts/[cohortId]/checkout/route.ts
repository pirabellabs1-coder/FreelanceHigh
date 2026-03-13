// POST /api/formations/cohorts/[cohortId]/checkout — Checkout Stripe pour cohorte

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-02-25.clover" });
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://freelancehigh.com";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ cohortId: string }> }
) {
  try {
    const { cohortId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get cohort with formation
    const cohort = await prisma.formationCohort.findUnique({
      where: { id: cohortId },
      include: {
        formation: {
          select: { id: true, titleFr: true, titleEn: true, status: true, slug: true },
        },
      },
    });

    if (!cohort) {
      return NextResponse.json({ error: "Cohorte introuvable" }, { status: 404 });
    }

    if (cohort.status !== "OUVERT") {
      return NextResponse.json({ error: "Cette cohorte n'accepte plus d'inscriptions" }, { status: 400 });
    }

    if (new Date() > cohort.enrollmentDeadline) {
      return NextResponse.json({ error: "La deadline d'inscription est dépassée" }, { status: 400 });
    }

    if (cohort.currentCount >= cohort.maxParticipants) {
      return NextResponse.json({ error: "Cette cohorte est complète" }, { status: 400 });
    }

    if (cohort.formation.status !== "ACTIF") {
      return NextResponse.json({ error: "La formation n'est plus active" }, { status: 400 });
    }

    // Check not already enrolled in this formation
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_formationId: { userId, formationId: cohort.formationId } },
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: "Vous êtes déjà inscrit à cette formation" }, { status: 400 });
    }

    // Create Stripe checkout session
    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: session.user.email ?? undefined,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${cohort.titleFr} — ${cohort.formation.titleFr}`,
              description: `Cohorte du ${new Date(cohort.startDate).toLocaleDateString("fr-FR")} au ${new Date(cohort.endDate).toLocaleDateString("fr-FR")}`,
            },
            unit_amount: Math.round(cohort.price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "cohort",
        userId,
        cohortId,
        formationId: cohort.formationId,
      },
      success_url: `${APP_URL}/formations/mes-cohorts/${cohortId}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/formations/${cohort.formation.slug}?cancelled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url, sessionId: checkoutSession.id });
  } catch (error) {
    console.error("[POST /api/formations/cohorts/[cohortId]/checkout]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
