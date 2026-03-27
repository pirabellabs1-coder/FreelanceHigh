import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { transactionStore } from "@/lib/dev/data-store";
import { prisma } from "@/lib/prisma";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user && process.env.DEV_MODE !== "true") {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }
    const devUserId = session?.user?.id || "dev-user";

    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      const summary = transactionStore.getSummary(devUserId);

      return NextResponse.json(summary);
    } else {
      const userId = session.user.id;
      const userRole = session.user.role;

      if (userRole === "CLIENT") {
        // Client: show spending summary
        const [totalSpent, pendingOrders] = await Promise.all([
          prisma.order.aggregate({ where: { clientId: userId, status: "TERMINE" }, _sum: { amount: true } }),
          prisma.order.aggregate({ where: { clientId: userId, status: { in: ["EN_ATTENTE", "EN_COURS", "REVISION"] } }, _sum: { amount: true } }),
        ]);

        return NextResponse.json({
          available: 0,
          pending: Math.round((pendingOrders._sum.amount ?? 0) * 100) / 100,
          totalEarned: 0,
          totalSpent: Math.round((totalSpent._sum.amount ?? 0) * 100) / 100,
          commissionThisMonth: 0,
        });
      }

      // Freelance / Agence: show earnings summary from wallet models
      if (userRole === "AGENCE" || userRole === "agence") {
        const agencyProfile = await prisma.agencyProfile.findUnique({
          where: { userId },
          select: { id: true },
        });

        if (agencyProfile) {
          const wallet = await prisma.walletAgency.findUnique({
            where: { agencyId: agencyProfile.id },
          });

          // Commission this month from orders
          const now = new Date();
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const commissionAgg = await prisma.order.aggregate({
            where: { agencyId: agencyProfile.id, status: "TERMINE", completedAt: { gte: monthStart } },
            _sum: { platformFee: true },
          });

          return NextResponse.json({
            available: Math.round((wallet?.balance ?? 0) * 100) / 100,
            pending: Math.round((wallet?.pending ?? 0) * 100) / 100,
            totalEarned: Math.round((wallet?.totalEarned ?? 0) * 100) / 100,
            commissionThisMonth: Math.round(Math.abs(commissionAgg._sum.platformFee ?? 0) * 100) / 100,
          });
        }
      }

      // Freelance: use wallet model
      const wallet = await prisma.walletFreelance.findUnique({
        where: { userId },
      });

      // Fallback: if no wallet yet, compute from payments
      if (!wallet) {
        const [completedAgg, pendingAgg] = await Promise.all([
          prisma.payment.aggregate({ where: { payeeId: userId, status: "COMPLETE" }, _sum: { amount: true } }),
          prisma.payment.aggregate({ where: { payeeId: userId, status: "EN_ATTENTE" }, _sum: { amount: true } }),
        ]);

        return NextResponse.json({
          available: Math.round((completedAgg._sum.amount ?? 0) * 100) / 100,
          pending: Math.round((pendingAgg._sum.amount ?? 0) * 100) / 100,
          totalEarned: Math.round((completedAgg._sum.amount ?? 0) * 100) / 100,
          commissionThisMonth: 0,
        });
      }

      // Commission this month
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const commissionAgg = await prisma.order.aggregate({
        where: { freelanceId: userId, status: "TERMINE", completedAt: { gte: monthStart } },
        _sum: { platformFee: true },
      });

      return NextResponse.json({
        available: Math.round((wallet.balance) * 100) / 100,
        pending: Math.round((wallet.pending) * 100) / 100,
        totalEarned: Math.round((wallet.totalEarned) * 100) / 100,
        commissionThisMonth: Math.round(Math.abs(commissionAgg._sum.platformFee ?? 0) * 100) / 100,
      });
    }
  } catch (error) {
    console.error("[API /finances/summary GET]", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation du resume financier" },
      { status: 500 }
    );
  }
}

