import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { transactionStore } from "@/lib/dev/data-store";
import { prisma, IS_DEV } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    if (IS_DEV) {
      const summary = transactionStore.getSummary(session.user.id);

      return NextResponse.json(summary);
    } else {
      const userId = session.user.id;

      // Available balance: completed payments where user is payee
      const completedAgg = await prisma.payment.aggregate({
        where: { payeeId: userId, status: "COMPLETE" },
        _sum: { amount: true },
      });

      // Pending: payments still awaiting where user is payee
      const pendingAgg = await prisma.payment.aggregate({
        where: { payeeId: userId, status: "EN_ATTENTE" },
        _sum: { amount: true },
      });

      // Total earned: sum of all completed payments
      const totalEarnedAgg = await prisma.payment.aggregate({
        where: { payeeId: userId, status: "COMPLETE" },
        _sum: { amount: true },
      });

      // Commission this month
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const commissionAgg = await prisma.payment.aggregate({
        where: {
          payeeId: userId,
          status: "COMPLETE",
          type: "COMMISSION",
          createdAt: { gte: monthStart },
        },
        _sum: { amount: true },
      });

      const summary = {
        available: completedAgg._sum.amount ?? 0,
        pending: pendingAgg._sum.amount ?? 0,
        totalEarned: totalEarnedAgg._sum.amount ?? 0,
        commissionThisMonth: Math.abs(commissionAgg._sum.amount ?? 0),
      };

      return NextResponse.json(summary);
    }
  } catch (error) {
    console.error("[API /finances/summary GET]", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation du resume financier" },
      { status: 500 }
    );
  }
}
