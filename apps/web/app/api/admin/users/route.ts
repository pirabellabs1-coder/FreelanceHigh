import { NextResponse } from "next/server";
import { orderStore, transactionStore } from "@/lib/dev/data-store";
import { devStore } from "@/lib/dev/dev-store";

// GET /api/admin/users — List all users with aggregated stats
export async function GET() {
  try {
    const allUsers = devStore.getAll();
    const allOrders = orderStore.getAll();
    const allTransactions = transactionStore.getAll();

    const users = allUsers.map((u) => {
      // Count orders where user is client or freelance
      const userOrders = allOrders.filter(
        (o) => o.clientId === u.id || o.freelanceId === u.id
      );

      // Calculate revenue from completed sales transactions
      const userTransactions = allTransactions.filter(
        (t) => t.userId === u.id && t.type === "vente" && t.status === "complete"
      );
      const revenue = userTransactions.reduce((sum, t) => sum + t.amount, 0);

      // Total spent (for clients) — orders they placed
      const clientOrders = allOrders.filter((o) => o.clientId === u.id);
      const totalSpent = clientOrders
        .filter((o) => o.status === "termine")
        .reduce((sum, o) => sum + o.amount, 0);

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        plan: u.plan,
        status: u.status,
        kycLevel: u.kyc,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt ?? null,
        loginCount: u.loginCount,
        ordersCount: userOrders.length,
        revenue: Math.round(revenue * 100) / 100,
        totalSpent: Math.round(totalSpent * 100) / 100,
      };
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("[API /admin/users GET]", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des utilisateurs" },
      { status: 500 }
    );
  }
}
