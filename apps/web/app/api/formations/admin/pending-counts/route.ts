import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { IS_DEV } from "@/lib/env";

/**
 * GET /api/formations/admin/pending-counts
 *
 * Returns real-time counts of items requiring admin attention.
 * Used by the admin layout sidebar to display live badge counts.
 *
 * Response:
 *   {
 *     data: {
 *       kyc: number,            // KYC requests pending review
 *       signalements: number,   // Discussion reports
 *       disputes: number,       // Mentor bookings awaiting admin decision
 *       refunds: number,        // Refund requests pending
 *       failedOrders24h: number,// Failed/refunded orders in last 24h (health metric)
 *       successOrders24h: number// Successful orders in last 24h (health metric)
 *     }
 *   }
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role?.toString().toUpperCase();
    if (!session?.user && !IS_DEV) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    if (session?.user && role !== "ADMIN" && !IS_DEV) {
      return NextResponse.json({ error: "Accès admin requis" }, { status: 403 });
    }

    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      kycCount,
      signalementsCount,
      disputesCount,
      refundsCount,
      failedEnrollments24h,
      successEnrollments24h,
      successPurchases24h,
    ] = await Promise.all([
      prisma.kycRequest.count({ where: { status: "EN_ATTENTE" } }),
      prisma.discussionReport.count(),
      prisma.mentorBooking.count({
        where: {
          status: { in: ["CANCELLATION_REQUESTED_STUDENT", "CANCELLATION_REQUESTED_MENTOR"] },
        },
      }),
      prisma.refundRequest.count({ where: { status: "PENDING" } }),
      prisma.enrollment.count({
        where: { refundedAt: { not: null, gte: last24h } },
      }),
      prisma.enrollment.count({
        where: { createdAt: { gte: last24h }, refundedAt: null },
      }),
      prisma.digitalProductPurchase.count({
        where: { createdAt: { gte: last24h } },
      }),
    ]);

    return NextResponse.json({
      data: {
        kyc: kycCount,
        signalements: signalementsCount,
        disputes: disputesCount,
        refunds: refundsCount,
        failedOrders24h: failedEnrollments24h,
        successOrders24h: successEnrollments24h + successPurchases24h,
      },
    });
  } catch (err) {
    console.error("[admin/pending-counts]", err);
    return NextResponse.json({
      data: {
        kyc: 0,
        signalements: 0,
        disputes: 0,
        refunds: 0,
        failedOrders24h: 0,
        successOrders24h: 0,
      },
    });
  }
}
