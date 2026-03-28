// POST /api/subscription — Create a Stripe Checkout Session for plan upgrades

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { stripe } from "@/lib/stripe";
import { rateLimit } from "@/lib/api-rate-limit";

const VALID_PLANS = ["ascension", "sommet", "empire"] as const;
type PaidPlanId = (typeof VALID_PLANS)[number];

// Legacy plan name mapping
const LEGACY_MAP: Record<string, PaidPlanId> = {
  pro: "ascension",
  business: "sommet",
  agence: "empire",
  agency: "empire",
};

const PLAN_NAMES: Record<PaidPlanId, string> = {
  ascension: "Ascension",
  sommet: "Sommet",
  empire: "Empire",
};

const PLAN_PRICES_MONTHLY: Record<PaidPlanId, number> = {
  ascension: 15,
  sommet: 29.99,
  empire: 65,
};

/**
 * Map plan IDs to Stripe Price IDs from environment variables.
 *
 * Expected env vars:
 *   STRIPE_PRICE_ASCENSION — e.g. price_xxx for Ascension (15 EUR/month)
 *   STRIPE_PRICE_SOMMET    — e.g. price_xxx for Sommet (29.99 EUR/month)
 *   STRIPE_PRICE_EMPIRE    — e.g. price_xxx for Empire (65 EUR/month)
 *
 * Falls back to legacy env vars (STRIPE_PRICE_PRO, etc.) if new ones not set.
 */
function getStripePriceId(planId: PaidPlanId): string | null {
  const envMap: Record<PaidPlanId, string | undefined> = {
    ascension: process.env.STRIPE_PRICE_ASCENSION || process.env.STRIPE_PRICE_PRO,
    sommet: process.env.STRIPE_PRICE_SOMMET || process.env.STRIPE_PRICE_BUSINESS,
    empire: process.env.STRIPE_PRICE_EMPIRE || process.env.STRIPE_PRICE_AGENCE,
  };
  return envMap[planId] ?? null;
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentification requise." },
        { status: 401 }
      );
    }

    const rl = rateLimit(`subscription:${session.user.id}`, 5, 60_000);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Trop de requetes. Reessayez dans 1 minute." }, { status: 429 });
    }

    // Check Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: "Le systeme de paiement n'est pas configure." },
        { status: 503 }
      );
    }

    const body = await request.json();
    let { planId } = body as { planId: string };

    // Map legacy plan names to new names
    if (planId && LEGACY_MAP[planId]) {
      planId = LEGACY_MAP[planId];
    }

    // Validate planId
    if (!planId || !VALID_PLANS.includes(planId as PaidPlanId)) {
      return NextResponse.json(
        { error: "Plan invalide. Les plans acceptes sont : ascension, sommet, empire." },
        { status: 400 }
      );
    }

    const plan = planId as PaidPlanId;

    // Resolve Stripe Price ID
    const priceId = getStripePriceId(plan);
    if (!priceId) {
      return NextResponse.json(
        { error: `Le Price ID Stripe pour le plan "${plan}" n'est pas configure. Variable attendue : STRIPE_PRICE_${plan.toUpperCase()}` },
        { status: 503 }
      );
    }

    // Build success/cancel URLs
    const origin = request.nextUrl.origin;
    const successUrl = `${origin}/dashboard/abonnement?success=true&plan=${plan}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/dashboard/abonnement?cancelled=true`;

    const userEmail = session.user.email ?? undefined;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        platform: "freelancehigh",
        type: "subscription",
        plan_id: plan,
        user_id: session.user.id,
      },
      subscription_data: {
        metadata: {
          platform: "freelancehigh",
          plan_id: plan,
          user_id: session.user.id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
      plan: plan,
      planName: PLAN_NAMES[plan],
      amount: PLAN_PRICES_MONTHLY[plan],
    });
  } catch (error) {
    console.error("[API /subscription POST]", error);

    if (error instanceof Error && "type" in error) {
      return NextResponse.json(
        { error: `Erreur Stripe : ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la creation de la session de paiement." },
      { status: 500 }
    );
  }
}
