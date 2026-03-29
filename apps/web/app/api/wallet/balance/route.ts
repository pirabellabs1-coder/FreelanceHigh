import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

// GET /api/wallet/balance — Lightweight wallet balance for payment pages
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const userId = session.user.id;
    const role = session.user.role?.toLowerCase();

    // Agency wallet
    if (role === "agence" || role === "agency") {
      const agencyProfile = await prisma.agencyProfile.findFirst({
        where: { OR: [{ userId }, { members: { some: { userId, role: "PROPRIETAIRE" } } }] },
        select: { id: true },
      });

      if (agencyProfile) {
        let wallet = await prisma.walletAgency.findUnique({ where: { agencyId: agencyProfile.id } });
        if (!wallet) {
          wallet = await prisma.walletAgency.create({ data: { agencyId: agencyProfile.id } });
        }
        return NextResponse.json({
          balance: wallet.balance,
          pending: wallet.pending,
          currency: "EUR",
        });
      }
    }

    // Freelance wallet (default)
    let wallet = await prisma.walletFreelance.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await prisma.walletFreelance.create({ data: { userId } });
    }

    return NextResponse.json({
      balance: wallet.balance,
      pending: wallet.pending,
      currency: "EUR",
    });
  } catch (error) {
    console.error("[API /wallet/balance GET]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
