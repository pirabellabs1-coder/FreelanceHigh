import { NextResponse } from "next/server";
import { devStore } from "@/lib/dev/dev-store";
import { serviceStore, orderStore, reviewStore } from "@/lib/dev/data-store";

export async function GET() {
  try {
    const users = devStore.getAll();
    const services = serviceStore.getAll();
    const orders = orderStore.getAll();
    const reviews = reviewStore.getAll();

    const freelances = users.filter((u) => u.role === "freelance" && u.status === "ACTIF");
    const clients = users.filter((u) => u.role === "client" && u.status === "ACTIF");
    const agences = users.filter((u) => u.role === "agence" && u.status === "ACTIF");
    const activeServices = services.filter((s) => s.status === "actif");
    const completedOrders = orders.filter((o) => o.status === "livre" || o.status === "termine");

    // Average rating from reviews
    const avgRating = reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

    // New users this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const newUsersThisMonth = users.filter(
      (u) => new Date(u.createdAt) >= monthStart
    ).length;

    // Total reviews count
    const totalReviews = reviews.length;

    return NextResponse.json({
      freelances: freelances.length,
      clients: clients.length,
      agences: agences.length,
      totalUsers: users.length,
      activeServices: activeServices.length,
      completedOrders: completedOrders.length,
      totalOrders: orders.length,
      averageRating: avgRating,
      totalReviews,
      newUsersThisMonth,
    });
  } catch (error) {
    console.error("[API /public/stats GET]", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des stats" },
      { status: 500 }
    );
  }
}
