import { NextResponse } from "next/server";
import { retrievePayment, isMonerooConfigured } from "@/lib/moneroo";

/**
 * GET /api/formations/payment/verify?id=xxx
 *
 * Verifies a Moneroo payment status by ID. Returns status + metadata.
 * The actual order finalization (creating Enrollment/Purchase) is done
 * via /api/formations/checkout, which is called by the return page after
 * verifying the payment is successful.
 */
export async function GET(request: Request) {
  try {
    if (!isMonerooConfigured()) {
      return NextResponse.json({ error: "Moneroo non configuré" }, { status: 503 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

    const payment = await retrievePayment(id);
    return NextResponse.json({
      data: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        customer: payment.customer,
        metadata: payment.metadata,
      },
    });
  } catch (err) {
    console.error("[payment/verify]", err);
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json({ error: "Échec de la vérification", message }, { status: 500 });
  }
}
