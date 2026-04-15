import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { IS_DEV } from "@/lib/env";
import { VENDOR_NET_RATE } from "@/lib/formations/constants";
import { resolveActiveUserId } from "@/lib/formations/active-user";
import { getOrCreateInstructeur } from "@/lib/formations/instructeur";

/**
 * GET /api/formations/wallet
 * Returns all wallet balances for the authenticated user across roles:
 * - vendor (instructor): totalEarned - withdrawn
 * - mentor: sum of completed bookings * 95% - withdrawn
 * - affiliate: pendingEarnings
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user && !IS_DEV)
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    // Resolve the real user (by id or email fallback)
    const userId = await resolveActiveUserId(session, {
      devFallback: IS_DEV ? "dev-instructeur-001" : undefined,
    });
    if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    // ── Vendor wallet ──
    const inst = await getOrCreateInstructeur(userId);
    let vendor = null;
    let vendorWithdrawals: Array<{
      id: string;
      amount: number;
      method: string;
      status: string;
      createdAt: Date;
      processedAt: Date | null;
      refusedReason: string | null;
    }> = [];
    if (inst) {
      const wAgg = await prisma.instructorWithdrawal.aggregate({
        where: { instructeurId: inst.id, status: { in: ["EN_ATTENTE", "TRAITE"] } },
        _sum: { amount: true },
      });
      const withdrawn = wAgg._sum.amount ?? 0;
      const available = Math.max(0, inst.totalEarned - withdrawn);

      vendorWithdrawals = await prisma.instructorWithdrawal.findMany({
        where: { instructeurId: inst.id },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          amount: true,
          method: true,
          status: true,
          createdAt: true,
          processedAt: true,
          refusedReason: true,
        },
      });

      vendor = {
        instructeurId: inst.id,
        totalEarned: inst.totalEarned,
        withdrawn,
        available,
        currency: "XOF",
      };
    }

    // ── Mentor wallet ──
    const mentor = await prisma.mentorProfile.findUnique({ where: { userId } });
    let mentorWallet = null;
    if (mentor) {
      const completed = await prisma.mentorBooking.findMany({
        where: { mentorId: mentor.id, status: "COMPLETED" },
        select: { paidAmount: true },
      });
      const grossMentor = completed.reduce((s, b) => s + b.paidAmount, 0);
      const netMentor = Math.round(grossMentor * VENDOR_NET_RATE);

      // Mentor withdrawals — re-use InstructorWithdrawal table with method prefix `mentor:`
      // (Schema has a single withdrawal model; we tag mentor withdrawals via method prefix to keep schema simple.)
      // For now we don't have a separate withdrawal log for mentor — show available based on net only.
      mentorWallet = {
        mentorId: mentor.id,
        totalSessions: completed.length,
        gross: grossMentor,
        available: netMentor,
        currency: "XOF",
      };
    }

    // ── Affiliate wallet ──
    const affiliateProfile = await prisma.affiliateProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        affiliateCode: true,
        totalClicks: true,
        totalConversions: true,
        totalEarned: true,
        pendingEarnings: true,
        status: true,
      },
    });

    return NextResponse.json({
      data: {
        vendor,
        vendorWithdrawals,
        mentor: mentorWallet,
        affiliate: affiliateProfile,
      },
    });
  } catch (err) {
    console.error("[wallet GET]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/formations/wallet
 * Request a withdrawal.
 *
 * Body: {
 *   amount: number,
 *   method: "orange_money" | "wave" | "mtn" | "moov" | "bank" | "paypal",
 *   accountDetails: { phone?, email?, iban?, bankName?, accountHolder? },
 *   source?: "vendor" | "mentor" (default "vendor")
 * }
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user && !IS_DEV)
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    // Resolve real user
    const userId = await resolveActiveUserId(session, {
      devFallback: IS_DEV ? "dev-instructeur-001" : undefined,
    });
    if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const body = await request.json();
    const amount = Number(body.amount);
    const method: string = body.method;
    const accountDetails = body.accountDetails ?? {};
    const source: "vendor" | "mentor" = body.source === "mentor" ? "mentor" : "vendor";

    if (!amount || amount < 1000) {
      return NextResponse.json({ error: "Montant minimum : 1 000 FCFA" }, { status: 400 });
    }
    if (!method) {
      return NextResponse.json({ error: "Méthode de retrait requise" }, { status: 400 });
    }

    if (source === "vendor") {
      const inst = await getOrCreateInstructeur(userId);
      if (!inst)
        return NextResponse.json({ error: "Profil vendeur introuvable" }, { status: 404 });

      const wAgg = await prisma.instructorWithdrawal.aggregate({
        where: { instructeurId: inst.id, status: { in: ["EN_ATTENTE", "TRAITE"] } },
        _sum: { amount: true },
      });
      const available = inst.totalEarned - (wAgg._sum.amount ?? 0);
      if (amount > available) {
        return NextResponse.json(
          { error: `Solde insuffisant. Disponible : ${Math.round(available)} FCFA` },
          { status: 400 }
        );
      }

      const withdrawal = await prisma.instructorWithdrawal.create({
        data: {
          instructeurId: inst.id,
          amount,
          method,
          accountDetails,
          status: "EN_ATTENTE",
        },
      });

      // In-app notification for the user
      await prisma.notification.create({
        data: {
          userId,
          type: "PAYMENT",
          title: "Demande de retrait enregistrée",
          message: `Votre retrait de ${Math.round(amount)} FCFA via ${method} est en cours de traitement (24-48h ouvrées).`,
          link: "/formations/vendeur/transactions",
        },
      }).catch(() => null);

      return NextResponse.json({ data: withdrawal });
    }

    // Mentor withdrawal — reuse the same table tagging with method prefix
    if (source === "mentor") {
      const mentor = await prisma.mentorProfile.findUnique({ where: { userId } });
      if (!mentor)
        return NextResponse.json({ error: "Profil mentor introuvable" }, { status: 404 });

      // Need an instructeurProfile to write into the existing withdrawal table
      // (schema constraint). If user has none, create a stub.
      let inst = await prisma.instructeurProfile.findUnique({ where: { userId } });
      if (!inst) {
        inst = await prisma.instructeurProfile.create({
          data: { userId, status: "APPROUVE" },
        });
      }

      const completed = await prisma.mentorBooking.findMany({
        where: { mentorId: mentor.id, status: "COMPLETED" },
        select: { paidAmount: true },
      });
      const gross = completed.reduce((s, b) => s + b.paidAmount, 0);
      const available = Math.round(gross * VENDOR_NET_RATE);

      // Subtract previous mentor withdrawals (tagged with method having `_mentor` suffix)
      const wAgg = await prisma.instructorWithdrawal.aggregate({
        where: {
          instructeurId: inst.id,
          method: { endsWith: "_mentor" },
          status: { in: ["EN_ATTENTE", "TRAITE"] },
        },
        _sum: { amount: true },
      });
      const remaining = available - (wAgg._sum.amount ?? 0);

      if (amount > remaining) {
        return NextResponse.json(
          { error: `Solde mentor insuffisant. Disponible : ${remaining} FCFA` },
          { status: 400 }
        );
      }

      const withdrawal = await prisma.instructorWithdrawal.create({
        data: {
          instructeurId: inst.id,
          amount,
          method: `${method}_mentor`,
          accountDetails,
          status: "EN_ATTENTE",
        },
      });

      await prisma.notification.create({
        data: {
          userId,
          type: "PAYMENT",
          title: "Retrait mentor enregistré",
          message: `Votre retrait de ${Math.round(amount)} FCFA via ${method} est en cours de traitement.`,
          link: "/formations/mentor/dashboard",
        },
      }).catch(() => null);

      return NextResponse.json({ data: withdrawal });
    }

    return NextResponse.json({ error: "Source invalide" }, { status: 400 });
  } catch (err) {
    console.error("[wallet POST]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}
