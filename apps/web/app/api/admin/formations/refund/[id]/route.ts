// POST /api/admin/formations/refund/[id] — Admin procède au remboursement Stripe

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-02-25.clover" });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: {
        formation: {
          select: {
            titleFr: true,
            price: true,
            instructeurId: true,
          },
        },
        user: { select: { email: true, name: true } },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Inscription introuvable" }, { status: 404 });
    }

    if (!enrollment.refundRequested) {
      return NextResponse.json({ error: "Aucune demande de remboursement" }, { status: 400 });
    }

    // Attempt Stripe refund if stripeSessionId exists
    if (enrollment.stripeSessionId) {
      try {
        const stripe = getStripe();
        const checkoutSession = await stripe.checkout.sessions.retrieve(enrollment.stripeSessionId);
        if (checkoutSession.payment_intent) {
          await stripe.refunds.create({
            payment_intent: checkoutSession.payment_intent as string,
          });
        }
      } catch (stripeErr) {
        console.error("[Stripe refund error]", stripeErr);
        // Continue even if Stripe fails — mark as refunded in DB
      }
    }

    // Delete enrollment and related data
    await prisma.$transaction([
      prisma.lessonProgress.deleteMany({ where: { enrollmentId: enrollment.id } }),
      prisma.lessonNote.deleteMany({ where: { enrollmentId: enrollment.id } }),
      prisma.certificate.deleteMany({ where: { enrollmentId: enrollment.id } }),
      prisma.enrollment.delete({ where: { id: enrollment.id } }),
    ]);

    // Decrement student count
    await prisma.formation.update({
      where: { id: enrollment.formationId },
      data: { studentsCount: { decrement: 1 } },
    });

    return NextResponse.json({
      success: true,
      message: `Remboursement traité pour ${enrollment.user.name}`,
      amount: enrollment.paidAmount,
    });
  } catch (error) {
    console.error("[POST /api/admin/formations/refund/[id]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
