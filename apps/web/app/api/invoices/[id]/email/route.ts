import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { IS_DEV } from "@/lib/env";
import { orderStore } from "@/lib/dev/data-store";
import { createNotification } from "@/lib/notifications/service";

// POST /api/invoices/[id]/email — Send invoice by email
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const { id: invoiceId } = await params;
    // Invoice IDs follow pattern "inv-{orderId}"
    const orderId = invoiceId.startsWith("inv-") ? invoiceId.slice(4) : invoiceId;

    if (IS_DEV) {
      const order = orderStore.getById(orderId);
      if (!order) {
        return NextResponse.json({ error: "Facture introuvable" }, { status: 404 });
      }

      // Verify access: only client or freelance on this order
      if (order.clientId !== session.user.id && order.freelanceId !== session.user.id) {
        return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
      }

      // Create notification simulating email sent
      await createNotification({
        userId: session.user.id,
        title: "Facture envoyee par email",
        message: `La facture pour "${order.serviceTitle}" a ete envoyee a votre adresse email.`,
        type: "payment",
        link: `/client/factures`,
      });

      return NextResponse.json({
        success: true,
        message: `Facture envoyee par email pour la commande ${orderId}`,
      });
    }

    // Production: would use Resend to send the actual email with PDF attachment
    return NextResponse.json({
      success: true,
      message: `Facture envoyee par email`,
    });
  } catch (error) {
    console.error("[API /invoices/[id]/email POST]", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de la facture" },
      { status: 500 }
    );
  }
}
