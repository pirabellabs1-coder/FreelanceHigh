import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || (IS_DEV ? "dev-user" : null);
    if (!userId) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      // Dev mode: no invoice table in dev stores — return empty list
      return NextResponse.json({ invoices: [] });
    }

    // Prisma: map completed orders to invoice shape
    // Falls back to empty array if the invoice table is not yet available
    try {
      const { prisma } = await import("@/lib/prisma");

      const orders = await prisma.order.findMany({
        where: {
          OR: [{ clientId: userId }, { freelanceId: userId }],
          status: { in: ["TERMINE", "LIVRE"] },
        },
        include: {
          service: true,
          client: true,
          freelance: true,
        },
        orderBy: { createdAt: "desc" },
      });

      const invoices = orders.map((o) => ({
        id: `INV-${o.id.slice(0, 8).toUpperCase()}`,
        orderId: o.id,
        label: o.service?.title || o.title || "Commande",
        amount: o.amount,
        currency: o.currency || "EUR",
        status: o.status.toLowerCase(),
        issuedAt: o.completedAt?.toISOString() || o.updatedAt.toISOString(),
        clientName: o.client?.name || "",
        freelanceName: o.freelance?.name || "",
      }));

      return NextResponse.json({ invoices });
    } catch (prismaError) {
      // Graceful fallback if schema is not yet fully migrated
      console.warn("[API /billing/invoices GET] Prisma query failed, returning empty list:", prismaError);
      return NextResponse.json({ invoices: [] });
    }
  } catch (error) {
    console.error("[API /billing/invoices GET]", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des factures" },
      { status: 500 }
    );
  }
}
