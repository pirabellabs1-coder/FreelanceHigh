import { NextResponse } from "next/server";
import { serviceStore, orderStore, transactionStore, reviewStore } from "@/lib/dev/data-store";
import { devStore } from "@/lib/dev/dev-store";

// GET /api/admin/dashboard — Aggregated platform stats for admin dashboard
export async function GET() {
  try {
    const users = devStore.getAll();
    const orders = orderStore.getAll();
    const services = serviceStore.getAll();
    const transactions = transactionStore.getAll();
    const reviews = reviewStore.getAll();

    // ── User Stats ──
    const totalUsers = users.filter((u) => u.role !== "admin").length;
    const freelances = users.filter((u) => u.role === "freelance").length;
    const clients = users.filter((u) => u.role === "client").length;
    const agencies = users.filter((u) => u.role === "agence").length;

    // ── Order Stats ──
    const totalOrders = orders.length;
    const activeOrders = orders.filter((o) =>
      ["en_attente", "en_cours", "revision"].includes(o.status)
    ).length;
    const completedOrders = orders.filter((o) => o.status === "termine").length;
    const gmv = orders
      .filter((o) => o.status !== "annule")
      .reduce((sum, o) => sum + o.amount, 0);

    // ── Service Stats ──
    const totalServices = services.length;
    const pendingModeration = services.filter((s) => s.status === "en_attente").length;

    // ── Financial Stats ──
    const completedSales = transactions.filter(
      (t) => t.type === "vente" && t.status === "complete"
    );
    const commissions = transactions.filter(
      (t) => t.type === "commission" && t.status === "complete"
    );
    const pendingTransactions = transactions.filter(
      (t) => t.status === "en_attente"
    );
    const withdrawals = transactions.filter(
      (t) => t.type === "retrait" && t.status === "en_attente"
    );

    const platformRevenue = commissions.reduce(
      (sum, t) => sum + Math.abs(t.amount),
      0
    );
    const escrowFunds = orders
      .filter((o) => ["en_attente", "en_cours", "revision", "livre"].includes(o.status))
      .reduce((sum, o) => sum + o.amount, 0);
    const pendingWithdrawals = withdrawals.reduce(
      (sum, t) => sum + Math.abs(t.amount),
      0
    );

    // ── Disputes ──
    const totalDisputes = orders.filter((o) => o.status === "litige").length;

    // ── Monthly Revenue (this year, grouped by month) ──
    const now = new Date();
    const currentYear = now.getFullYear();
    const monthNames = [
      "Jan", "Fev", "Mar", "Avr", "Mai", "Jun",
      "Jul", "Aou", "Sep", "Oct", "Nov", "Dec",
    ];

    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
      const monthKey = `${currentYear}-${String(i + 1).padStart(2, "0")}`;
      const monthOrders = orders.filter(
        (o) =>
          o.status === "termine" &&
          o.completedAt &&
          o.completedAt.startsWith(monthKey)
      );
      const revenue = monthOrders.reduce((sum, o) => sum + o.amount, 0);
      const commission = monthOrders.reduce((sum, o) => sum + o.commission, 0);

      return {
        month: monthNames[i],
        monthKey,
        revenue,
        commission,
        orders: monthOrders.length,
      };
    });

    // ── Orders by Status ──
    const ordersByStatus = {
      en_attente: orders.filter((o) => o.status === "en_attente").length,
      en_cours: orders.filter((o) => o.status === "en_cours").length,
      livre: orders.filter((o) => o.status === "livre").length,
      revision: orders.filter((o) => o.status === "revision").length,
      termine: completedOrders,
      annule: orders.filter((o) => o.status === "annule").length,
      litige: totalDisputes,
    };

    // ── Recent Orders (last 10) ──
    const recentOrders = [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10)
      .map((o) => ({
        id: o.id,
        serviceTitle: o.serviceTitle,
        clientName: o.clientName,
        amount: o.amount,
        status: o.status,
        createdAt: o.createdAt,
      }));

    // ── Recent Users (last 10) ──
    const recentUsers = [...users]
      .filter((u) => u.role !== "admin")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10)
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        plan: u.plan,
        status: u.status,
        createdAt: u.createdAt,
      }));

    // ── Review Stats ──
    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? Math.round(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10
          ) / 10
        : 0;
    const reportedReviews = reviews.filter((r) => r.reported).length;

    return NextResponse.json({
      users: {
        total: totalUsers,
        freelances,
        clients,
        agencies,
      },
      orders: {
        total: totalOrders,
        active: activeOrders,
        completed: completedOrders,
        gmv: Math.round(gmv * 100) / 100,
        byStatus: ordersByStatus,
      },
      services: {
        total: totalServices,
        pendingModeration,
        active: services.filter((s) => s.status === "actif").length,
        paused: services.filter((s) => s.status === "pause").length,
        refused: services.filter((s) => s.status === "refuse").length,
      },
      finances: {
        platformRevenue: Math.round(platformRevenue * 100) / 100,
        escrowFunds: Math.round(escrowFunds * 100) / 100,
        pendingWithdrawals: Math.round(pendingWithdrawals * 100) / 100,
        totalTransactions: transactions.length,
        pendingTransactions: pendingTransactions.length,
      },
      disputes: {
        total: totalDisputes,
      },
      reviews: {
        total: totalReviews,
        avgRating,
        reported: reportedReviews,
      },
      monthlyRevenue,
      recentOrders,
      recentUsers,
    });
  } catch (error) {
    console.error("[API /admin/dashboard GET]", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des statistiques" },
      { status: 500 }
    );
  }
}
