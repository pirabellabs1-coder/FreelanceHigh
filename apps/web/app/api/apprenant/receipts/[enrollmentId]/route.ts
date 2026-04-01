// GET /api/apprenant/receipts/[enrollmentId]
// Generates and returns a PDF receipt for a formation purchase.

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";
import { jsPDF } from "jspdf";

export async function GET(
  _req: Request,
  { params }: { params: { enrollmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { enrollmentId } = params;
    const userId = session.user.id;

    const enrollment = await prisma.enrollment.findFirst({
      where: { id: enrollmentId, userId },
      include: {
        formation: {
          select: {
            title: true,
            price: true,
            isFree: true,
            instructeur: {
              select: { user: { select: { name: true } } },
            },
          },
        },
        user: {
          select: { name: true, email: true },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Inscription introuvable" }, { status: 404 });
    }

    // Generate PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(108, 43, 217); // Primary purple
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("FreelanceHigh", 20, 22);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Formations - Reçu de paiement", 20, 32);

    // Receipt number
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("REÇU DE PAIEMENT", 20, 55);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const receiptNumber = `FH-${enrollment.id.slice(-8).toUpperCase()}`;
    const date = new Date(enrollment.createdAt).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    doc.text(`N° ${receiptNumber}`, 20, 63);
    doc.text(`Date : ${date}`, 20, 70);
    if (enrollment.stripeSessionId) {
      doc.text(`Réf. transaction : ${enrollment.stripeSessionId.slice(0, 30)}`, 20, 77);
    }

    // Separator
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 83, pageWidth - 20, 83);

    // Buyer info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Acheteur", 20, 93);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(enrollment.user.name || "—", 20, 100);
    doc.text(enrollment.user.email || "—", 20, 107);

    // Formation info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Formation", 20, 122);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(enrollment.formation.title, 20, 129);
    doc.text(
      `Instructeur : ${enrollment.formation.instructeur?.user?.name || "—"}`,
      20,
      136
    );

    // Price table
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 245, 245);
    doc.rect(20, 148, pageWidth - 40, 12, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Description", 25, 156);
    doc.text("Montant", pageWidth - 55, 156);

    doc.setFont("helvetica", "normal");
    const amount = enrollment.paidAmount ?? enrollment.formation.price ?? 0;
    const amountStr = enrollment.formation.isFree
      ? "Gratuit (0,00 €)"
      : `${amount.toFixed(2)} €`;
    doc.rect(20, 160, pageWidth - 40, 12, "D");
    doc.text(enrollment.formation.title.slice(0, 50), 25, 168);
    doc.text(amountStr, pageWidth - 55, 168);

    // Total
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Total :", pageWidth - 80, 185);
    doc.text(amountStr, pageWidth - 55, 185);

    // Footer
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 200, pageWidth - 20, 200);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      "FreelanceHigh — La plateforme freelance qui élève votre carrière au plus haut niveau",
      pageWidth / 2,
      210,
      { align: "center" }
    );
    doc.text(
      "Ce document constitue un reçu de paiement. Conservez-le pour vos archives.",
      pageWidth / 2,
      216,
      { align: "center" }
    );

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="recu-${receiptNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("[GET /api/apprenant/receipts/[enrollmentId]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
