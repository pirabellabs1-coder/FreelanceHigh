import { NextResponse } from "next/server";
import {
  serviceStore,
  orderStore,
  transactionStore,
  reviewStore,
  candidatureStore,
  projectStore,
} from "@/lib/dev/data-store";
import { devStore } from "@/lib/dev/dev-store";

// GET /api/admin/analytics — Platform analytics computed from all stores
export async function GET() {
  try {
    const users = devStore.getAll().filter((u) => u.role !== "admin");
    const orders = orderStore.getAll();
    const services = serviceStore.getAll();
    const transactions = transactionStore.getAll();
    const reviews = reviewStore.getAll();
    const candidatures = candidatureStore.getAll();
    const projects = projectStore.getAll();

    const now = new Date();
    const currentYear = now.getFullYear();
    const monthNames = [
      "Jan", "Fev", "Mar", "Avr", "Mai", "Jun",
      "Jul", "Aou", "Sep", "Oct", "Nov", "Dec",
    ];

    // ── Revenue by Category ──
    const revenueByCategory: Record<string, { revenue: number; orders: number }> = {};
    for (const order of orders) {
      if (order.status === "termine" || order.status === "livre") {
        const cat = order.category || "Non categorise";
        if (!revenueByCategory[cat]) {
          revenueByCategory[cat] = { revenue: 0, orders: 0 };
        }
        revenueByCategory[cat].revenue += order.amount;
        revenueByCategory[cat].orders += 1;
      }
    }

    const revenueByCategoryArray = Object.entries(revenueByCategory)
      .map(([category, data]) => ({
        category,
        revenue: Math.round(data.revenue * 100) / 100,
        orders: data.orders,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // ── Top Countries (from users) ──
    const countryCount: Record<string, number> = {};
    for (const user of users) {
      // Use profile country if available; for dev users we don't have country on DevUser,
      // so we aggregate from orders/services
      const country = "FR"; // Default — will be enriched from order data
      countryCount[country] = (countryCount[country] ?? 0) + 1;
    }

    // Enrich with order country data
    const orderCountries: Record<string, { clients: number; revenue: number }> = {};
    for (const order of orders) {
      const country = order.clientCountry || "XX";
      if (!orderCountries[country]) {
        orderCountries[country] = { clients: 0, revenue: 0 };
      }
      orderCountries[country].clients += 1;
      if (order.status === "termine") {
        orderCountries[country].revenue += order.amount;
      }
    }

    const topCountries = Object.entries(orderCountries)
      .map(([country, data]) => ({
        country,
        orders: data.clients,
        revenue: Math.round(data.revenue * 100) / 100,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // ── Registration Trends (monthly for this year) ──
    const registrationTrends = Array.from({ length: 12 }, (_, i) => {
      const monthKey = `${currentYear}-${String(i + 1).padStart(2, "0")}`;
      const monthUsers = users.filter((u) =>
        u.createdAt.startsWith(monthKey)
      );

      return {
        month: monthNames[i],
        monthKey,
        total: monthUsers.length,
        freelances: monthUsers.filter((u) => u.role === "freelance").length,
        clients: monthUsers.filter((u) => u.role === "client").length,
        agencies: monthUsers.filter((u) => u.role === "agence").length,
      };
    });

    // ── Conversion Funnel ──
    const totalRegistrations = users.length;
    const usersWithOrders = new Set([
      ...orders.map((o) => o.clientId),
      ...orders.map((o) => o.freelanceId),
    ]).size;
    const usersWithCompletedOrders = new Set(
      orders
        .filter((o) => o.status === "termine")
        .flatMap((o) => [o.clientId, o.freelanceId])
    ).size;
    const usersWithReviews = new Set(
      reviews.map((r) => r.clientId)
    ).size;

    const conversionFunnel = {
      registered: totalRegistrations,
      profileCompleted: Math.round(totalRegistrations * 0.7), // Estimated
      firstOrder: usersWithOrders,
      orderCompleted: usersWithCompletedOrders,
      leftReview: usersWithReviews,
      rates: {
        registeredToProfileCompleted: totalRegistrations > 0
          ? Math.round((totalRegistrations * 0.7 / totalRegistrations) * 100)
          : 0,
        profileToFirstOrder: totalRegistrations > 0
          ? Math.round((usersWithOrders / totalRegistrations) * 100)
          : 0,
        firstOrderToCompleted: usersWithOrders > 0
          ? Math.round((usersWithCompletedOrders / usersWithOrders) * 100)
          : 0,
        completedToReview: usersWithCompletedOrders > 0
          ? Math.round((usersWithReviews / usersWithCompletedOrders) * 100)
          : 0,
      },
    };

    // ── Service Performance ──
    const activeServices = services.filter((s) => s.status === "actif");
    const totalViews = services.reduce((sum, s) => sum + s.views, 0);
    const totalClicks = services.reduce((sum, s) => sum + s.clicks, 0);
    const totalServiceOrders = services.reduce((sum, s) => sum + s.orderCount, 0);
    const avgRating =
      activeServices.length > 0
        ? activeServices
            .filter((s) => s.ratingCount > 0)
            .reduce((sum, s) => sum + s.rating, 0) /
          Math.max(1, activeServices.filter((s) => s.ratingCount > 0).length)
        : 0;

    const servicePerformance = {
      totalViews,
      totalClicks,
      totalOrders: totalServiceOrders,
      clickThroughRate: totalViews > 0 ? Math.round((totalClicks / totalViews) * 10000) / 100 : 0,
      conversionRate: totalClicks > 0 ? Math.round((totalServiceOrders / totalClicks) * 10000) / 100 : 0,
      avgRating: Math.round(avgRating * 10) / 10,
      topServices: [...services]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map((s) => ({
          id: s.id,
          title: s.title,
          category: s.categoryName,
          revenue: s.revenue,
          orders: s.orderCount,
          rating: s.rating,
          views: s.views,
        })),
    };

    // ── Revenue Trends (monthly) ──
    const revenueTrends = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

      const monthOrders = orders.filter(
        (o) => o.status === "termine" && o.completedAt?.startsWith(monthKey)
      );
      const monthRevenue = monthOrders.reduce((sum, o) => sum + o.amount, 0);
      const monthCommission = monthOrders.reduce((sum, o) => sum + o.commission, 0);

      return {
        month: monthNames[d.getMonth()],
        monthKey,
        revenue: Math.round(monthRevenue * 100) / 100,
        commission: Math.round(monthCommission * 100) / 100,
        orders: monthOrders.length,
      };
    });

    // ── Project & Candidature Stats ──
    const projectStats = {
      totalProjects: projects.length,
      openProjects: projects.filter((p) => p.status === "ouvert").length,
      filledProjects: projects.filter((p) => p.status === "pourvu").length,
      closedProjects: projects.filter((p) => p.status === "ferme").length,
      totalCandidatures: candidatures.length,
      acceptedCandidatures: candidatures.filter((c) => c.status === "acceptee").length,
      avgProposalsPerProject:
        projects.length > 0
          ? Math.round(
              (projects.reduce((sum, p) => sum + p.proposals, 0) / projects.length) * 10
            ) / 10
          : 0,
    };

    // ── Review Stats ──
    const reviewStats = {
      totalReviews: reviews.length,
      avgRating: reviews.length > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
        : 0,
      avgQuality: reviews.length > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.qualite, 0) / reviews.length) * 10) / 10
        : 0,
      avgCommunication: reviews.length > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.communication, 0) / reviews.length) * 10) / 10
        : 0,
      avgDelivery: reviews.length > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.delai, 0) / reviews.length) * 10) / 10
        : 0,
      reportedReviews: reviews.filter((r) => r.reported).length,
      ratingDistribution: {
        "5": reviews.filter((r) => r.rating >= 4.5).length,
        "4": reviews.filter((r) => r.rating >= 3.5 && r.rating < 4.5).length,
        "3": reviews.filter((r) => r.rating >= 2.5 && r.rating < 3.5).length,
        "2": reviews.filter((r) => r.rating >= 1.5 && r.rating < 2.5).length,
        "1": reviews.filter((r) => r.rating < 1.5).length,
      },
    };

    // ── Payment Method Distribution ──
    const paymentMethods: Record<string, number> = {};
    for (const tx of transactions) {
      const method = tx.method ?? "carte_bancaire";
      paymentMethods[method] = (paymentMethods[method] ?? 0) + 1;
    }

    return NextResponse.json({
      revenueByCategory: revenueByCategoryArray,
      topCountries,
      registrationTrends,
      conversionFunnel,
      servicePerformance,
      revenueTrends,
      projectStats,
      reviewStats,
      paymentMethods,
    });
  } catch (error) {
    console.error("[API /admin/analytics GET]", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des analytics" },
      { status: 500 }
    );
  }
}
