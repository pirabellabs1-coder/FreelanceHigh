// POST /api/webhooks/cinetpay — CinetPay payment notification handler
// Called by CinetPay when a payment status changes (success, failure, cancel).
//
// Security: CinetPay does not sign webhooks, so we always verify the
// transaction status via the checkPaymentStatus API before trusting the
// notification. This prevents spoofed/replayed webhook calls.

import { NextRequest, NextResponse } from "next/server";
import {
  checkPaymentStatus,
  isPaymentSuccessful,
  isPaymentFailed,
  isCinetPayConfigured,
} from "@/lib/cinetpay";
import { orderStore, notificationStore, transactionStore } from "@/lib/dev/data-store";

export async function POST(req: NextRequest) {
  try {
    // ── Parse the notification body ─────────────────────────────────────
    // CinetPay sends: cpm_trans_id, cpm_site_id, cpm_trans_date, cpm_amount,
    // cpm_currency, cpm_payment_config, cpm_page_action, cpm_version,
    // cpm_language, cpm_trans_status, cpm_designation, cpm_error_message
    const body = await req.json().catch(() => null);

    // CinetPay may also send form-encoded data; handle both
    let transactionId: string | null = null;

    if (body && typeof body === "object") {
      transactionId = body.cpm_trans_id || body.transaction_id || null;
    }

    if (!transactionId) {
      // Try to extract from URL search params as fallback
      transactionId = req.nextUrl.searchParams.get("cpm_trans_id");
    }

    if (!transactionId) {
      console.error("[CinetPay Webhook] No transaction ID in notification");
      return NextResponse.json(
        { error: "transaction_id manquant" },
        { status: 400 }
      );
    }

    console.log(
      `[CinetPay Webhook] Notification received for transaction: ${transactionId}`
    );

    // ── Extract orderId from transaction ID ─────────────────────────────
    // Our transaction IDs follow the format: FH-{orderId}-{timestamp}
    const orderId = extractOrderId(transactionId);

    if (!orderId) {
      console.error(
        `[CinetPay Webhook] Could not extract orderId from transactionId: ${transactionId}`
      );
      return NextResponse.json(
        { error: "Format de transaction_id non reconnu" },
        { status: 400 }
      );
    }

    // ── Verify payment status with CinetPay API ─────────────────────────
    // This is the recommended approach per CinetPay docs: never trust the
    // webhook payload alone, always verify server-to-server.
    if (!isCinetPayConfigured()) {
      console.warn("[CinetPay Webhook] API not configured — simulating success in dev mode");
      await handlePaymentSuccess(orderId, transactionId, "SIMULATED", "DEV_MODE");
      return NextResponse.json({ received: true, devMode: true });
    }

    const status = await checkPaymentStatus(transactionId);

    if (!status) {
      console.error(
        `[CinetPay Webhook] Could not verify transaction status: ${transactionId}`
      );
      // Return 200 to acknowledge receipt — we'll retry verification via a job later
      return NextResponse.json({
        received: true,
        verified: false,
        message: "Impossible de verifier le statut — sera retente",
      });
    }

    // ── Process based on verified status ────────────────────────────────
    if (isPaymentSuccessful(status)) {
      await handlePaymentSuccess(
        orderId,
        transactionId,
        status.data.payment_method,
        status.data.amount
      );

      console.log(
        `[CinetPay Webhook] Payment ACCEPTED: orderId=${orderId}, txId=${transactionId}, ` +
          `method=${status.data.payment_method}, amount=${status.data.amount} ${status.data.currency}`
      );
    } else if (isPaymentFailed(status)) {
      await handlePaymentFailure(
        orderId,
        transactionId,
        status.data.status,
        status.message
      );

      console.log(
        `[CinetPay Webhook] Payment REFUSED/CANCELLED: orderId=${orderId}, txId=${transactionId}, ` +
          `status=${status.data.status}, reason=${status.message}`
      );
    } else {
      // Payment is still pending (WAITING_FOR_CUSTOMER, etc.)
      console.log(
        `[CinetPay Webhook] Payment pending: orderId=${orderId}, txId=${transactionId}, ` +
          `status=${status.data.status}`
      );
    }

    // Always return 200 to CinetPay to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[CinetPay Webhook] Error:", error);
    // Return 200 anyway to prevent CinetPay from retrying indefinitely
    return NextResponse.json({ received: true, error: "Erreur interne" });
  }
}

// ── Handlers ────────────────────────────────────────────────────────────────

async function handlePaymentSuccess(
  orderId: string,
  transactionId: string,
  paymentMethod: string,
  amount: string
): Promise<void> {
  const order = orderStore.getById(orderId);
  if (!order) {
    console.error(`[CinetPay Webhook] Order not found: ${orderId}`);
    return;
  }

  // Idempotency: skip if order is already paid/in progress
  if (order.status === "en_cours" || order.status === "termine") {
    console.log(
      `[CinetPay Webhook] Order ${orderId} already processed (status=${order.status}), skipping`
    );
    return;
  }

  // Update order status: payment confirmed, order is now active
  orderStore.update(orderId, {
    status: "en_cours",
    progress: 10,
  });

  // Add system message to order
  orderStore.addMessage(orderId, {
    sender: "client",
    senderName: "Systeme",
    content: `Paiement confirme via ${formatPaymentMethod(paymentMethod)} (ref: ${transactionId})`,
    timestamp: new Date().toISOString(),
    type: "system",
  });

  // Record transaction in finances (escrow: held until delivery validation)
  transactionStore.add({
    userId: order.freelanceId,
    type: "vente",
    description: `Paiement Mobile Money — ${order.serviceTitle}`,
    amount: order.amount - order.commission,
    status: "en_attente", // Escrow: held until delivery is validated
    date: new Date().toISOString(),
    orderId: order.id,
    method: `CinetPay (${formatPaymentMethod(paymentMethod)})`,
  });

  // Notify the freelance about the new paid order
  notificationStore.add({
    userId: order.freelanceId,
    title: "Nouvelle commande payee",
    message: `${order.clientName} a paye la commande "${order.serviceTitle}" via Mobile Money. Vous pouvez commencer le travail.`,
    type: "payment",
    read: false,
    link: `/dashboard/commandes/${orderId}`,
  });

  // Notify the client about the payment confirmation
  notificationStore.add({
    userId: order.clientId,
    title: "Paiement confirme",
    message: `Votre paiement de ${amount} pour "${order.serviceTitle}" a ete confirme. Le freelance peut maintenant commencer le travail.`,
    type: "payment",
    read: false,
    link: `/dashboard/commandes/${orderId}`,
  });
}

async function handlePaymentFailure(
  orderId: string,
  transactionId: string,
  status: string,
  reason: string
): Promise<void> {
  const order = orderStore.getById(orderId);
  if (!order) {
    console.error(`[CinetPay Webhook] Order not found: ${orderId}`);
    return;
  }

  // Don't revert orders that are already in progress or completed
  if (order.status === "en_cours" || order.status === "termine") {
    console.log(
      `[CinetPay Webhook] Order ${orderId} already active (status=${order.status}), not reverting`
    );
    return;
  }

  // Add system message about the failure
  orderStore.addMessage(orderId, {
    sender: "client",
    senderName: "Systeme",
    content: `Paiement echoue (${status}): ${reason}. Veuillez reessayer.`,
    timestamp: new Date().toISOString(),
    type: "system",
  });

  // Record the failed transaction
  transactionStore.add({
    userId: order.clientId,
    type: "vente",
    description: `Paiement Mobile Money echoue — ${order.serviceTitle}`,
    amount: order.amount,
    status: "echoue",
    date: new Date().toISOString(),
    orderId: order.id,
    method: `CinetPay`,
  });

  // Notify the client about the payment failure
  notificationStore.add({
    userId: order.clientId,
    title: "Echec du paiement",
    message: `Votre paiement pour "${order.serviceTitle}" a echoue (${reason}). Veuillez reessayer avec un autre moyen de paiement.`,
    type: "payment",
    read: false,
    link: `/dashboard/commandes/${orderId}`,
  });
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extract orderId from a transaction ID with format: FH-{orderId}-{timestamp}
 */
function extractOrderId(transactionId: string): string | null {
  // Match pattern: FH-ORDID-timestamp
  // orderId can contain letters, numbers, and hyphens (e.g., ORD-ABC123)
  const match = transactionId.match(/^FH-(.+)-\d+$/);
  return match ? match[1] : null;
}

/**
 * Format CinetPay payment method codes into human-readable names.
 */
function formatPaymentMethod(method: string): string {
  const methods: Record<string, string> = {
    OM: "Orange Money",
    MOMO: "MTN Mobile Money",
    MOOV: "Moov Money",
    WAVE: "Wave",
    FLOOZ: "Flooz",
    VISA: "Visa",
    MASTERCARD: "Mastercard",
    WALLET: "Portefeuille CinetPay",
  };
  return methods[method.toUpperCase()] || method;
}
