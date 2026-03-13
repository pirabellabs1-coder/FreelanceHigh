// GET /api/admin/formations/stats — Stats globales formations pour l'admin

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalFormations,
      totalStudents,
      certificatesIssued,
      pendingFormations,
      pendingInstructors,
      recentEnrollments,
      recentCertificates,
    ] = await Promise.all([
      prisma.formation.count({ where: { status: "ACTIF" } }),
      prisma.enrollment.count(),
      prisma.certificate.count(),
      prisma.formation.count({ where: { status: "EN_ATTENTE" } }),
      prisma.instructeurProfile.count({ where: { status: "EN_ATTENTE" } }),
      prisma.enrollment.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true } },
          formation: { select: { titleFr: true } },
        },
      }),
      prisma.certificate.findMany({
        take: 5,
        orderBy: { issuedAt: "desc" },
        include: {
          user: { select: { name: true } },
          enrollment: {
            include: {
              formation: { select: { titleFr: true } },
            },
          },
        },
      }),
    ]);

    // Revenue this month (sum of enrollments where paidAmount > 0)
    const monthRevenue = await prisma.enrollment.aggregate({
      where: { createdAt: { gte: startOfMonth }, paidAmount: { gt: 0 } },
      _sum: { paidAmount: true },
    });
    const revenueThisMonth = monthRevenue._sum.paidAmount ?? 0;

    // Revenue by month (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const enrollmentsByMonth = await prisma.enrollment.groupBy({
      by: ["createdAt"],
      where: { createdAt: { gte: twelveMonthsAgo }, paidAmount: { gt: 0 } },
      _sum: { paidAmount: true },
    });

    // Aggregate by month
    const monthMap = new Map<string, number>();
    for (const row of enrollmentsByMonth) {
      const key = `${row.createdAt.getFullYear()}-${String(row.createdAt.getMonth() + 1).padStart(2, "0")}`;
      monthMap.set(key, (monthMap.get(key) ?? 0) + (row._sum.paidAmount ?? 0));
    }

    const revenueByMonth = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const rev = monthMap.get(key) ?? 0;
      revenueByMonth.push({
        month: d.toLocaleString("fr-FR", { month: "short" }),
        revenue: Math.round(rev),
        commission: Math.round(rev * 0.3),
      });
    }

    // Recent activity
    const recentActivity = [
      ...recentEnrollments.map((e) => ({
        type: "enrollment",
        title: `Inscription : ${e.formation.titleFr}`,
        user: e.user.name,
        date: new Date(e.createdAt).toLocaleDateString("fr-FR"),
      })),
      ...recentCertificates.map((c) => ({
        type: "certificate",
        title: `Certificat : ${c.enrollment.formation.titleFr}`,
        user: c.user.name,
        date: new Date(c.issuedAt).toLocaleDateString("fr-FR"),
      })),
    ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10);

    // Marketing stats
    const [totalProducts, productSalesAgg, abandonedCartsTotal, recoveredCarts, failedPayments] = await Promise.all([
      prisma.digitalProduct.count({ where: { status: "ACTIF" } }),
      prisma.digitalProductPurchase.aggregate({ _sum: { paidAmount: true }, _count: true }),
      prisma.abandonedCart.count(),
      prisma.abandonedCart.count({ where: { status: "CONVERTI" } }),
      prisma.marketingEvent.count({ where: { type: "PAYMENT_FAILED" } }),
    ]);

    const marketing = {
      totalProducts,
      productSales: productSalesAgg._count,
      productRevenue: productSalesAgg._sum.paidAmount ?? 0,
      abandonedCarts: abandonedCartsTotal,
      recoveredCarts,
      recoveryRate: abandonedCartsTotal > 0 ? (recoveredCarts / abandonedCartsTotal) * 100 : 0,
      failedPayments,
    };

    return NextResponse.json({
      totalFormations,
      totalStudents,
      revenueThisMonth,
      certificatesIssued,
      pendingFormations,
      pendingInstructors,
      revenueByMonth,
      recentActivity,
      marketing,
    });
  } catch (error) {
    console.error("[GET /api/admin/formations/stats]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
