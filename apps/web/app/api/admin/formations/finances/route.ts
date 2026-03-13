// GET /api/admin/formations/finances — Finances formations pour l'admin

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

    const [totalRevAgg, pendingRefunds, withdrawals] = await Promise.all([
      prisma.enrollment.aggregate({ _sum: { paidAmount: true } }),
      prisma.enrollment.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          paidAmount: { gt: 0 },
        },
      }),
      prisma.instructorWithdrawal.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
          instructeur: {
            include: { user: { select: { name: true, email: true } } },
          },
        },
      }),
    ]);

    const totalRevenue = totalRevAgg._sum.paidAmount ?? 0;
    const totalCommission = totalRevenue * 0.3;

    const pendingWithdrawalsAgg = await prisma.instructorWithdrawal.aggregate({
      where: { status: "EN_ATTENTE" },
      _sum: { amount: true },
    });
    const pendingWithdrawals = pendingWithdrawalsAgg._sum.amount ?? 0;

    // Revenue by month (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const enrollmentsByMonth = await prisma.enrollment.groupBy({
      by: ["createdAt"],
      where: { createdAt: { gte: twelveMonthsAgo }, paidAmount: { gt: 0 } },
      _sum: { paidAmount: true },
    });

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

    return NextResponse.json({
      totalRevenue,
      totalCommission,
      pendingWithdrawals,
      pendingRefunds,
      revenueByMonth,
      withdrawals,
    });
  } catch (error) {
    console.error("[GET /api/admin/formations/finances]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
