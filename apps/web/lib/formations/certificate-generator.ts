// Certificate PDF generator — Premium design with QR code

import { jsPDF } from "jspdf";
import QRCode from "qrcode";

interface CertificateData {
  studentName: string;
  formationTitle: string;
  instructorName: string;
  score: number;
  completionDate: Date;
  certificateCode: string;
  locale: "fr" | "en";
}

const LABELS = {
  fr: {
    header: "FreelanceHigh Formations",
    title: "CERTIFICAT DE RÉUSSITE",
    subtitle: "Ce certificat atteste que",
    completed: "a complété avec succès la formation",
    score: "Score obtenu",
    date: "Date de complétion",
    instructor: "Instructeur",
    verify: "Vérifier ce certificat",
    platform: "FreelanceHigh — Plateforme Freelance Internationale",
    code: "Code du certificat",
    issued: "Délivré par",
    signedBy: "Signé par",
  },
  en: {
    header: "FreelanceHigh Formations",
    title: "CERTIFICATE OF COMPLETION",
    subtitle: "This certifies that",
    completed: "has successfully completed the course",
    score: "Score achieved",
    date: "Completion date",
    instructor: "Instructor",
    verify: "Verify this certificate",
    platform: "FreelanceHigh — International Freelance Platform",
    code: "Certificate code",
    issued: "Issued by",
    signedBy: "Signed by",
  },
};

// Primary brand color
const PRIMARY = { r: 108, g: 43, b: 217 }; // #6C2BD9
const ACCENT = { r: 14, g: 124, b: 102 };   // #0e7c66
const GOLD = { r: 212, g: 175, b: 55 };      // #D4AF37

export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  const { studentName, formationTitle, instructorName, score, completionDate, certificateCode, locale } = data;
  const t = LABELS[locale];

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // ── Background gradient simulation ────────────────────────
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, w, h, "F");

  // Subtle gradient effect at top
  for (let i = 0; i < 8; i++) {
    const alpha = 6 - i * 0.7;
    doc.setFillColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
    doc.setGState(doc.GState({ opacity: Math.max(0.02, alpha / 100) }));
    doc.rect(0, i * 3, w, 3, "F");
  }
  doc.setGState(doc.GState({ opacity: 1 }));

  // ── Decorative outer border ───────────────────────────────
  doc.setDrawColor(GOLD.r, GOLD.g, GOLD.b);
  doc.setLineWidth(1.5);
  doc.rect(8, 8, w - 16, h - 16);

  // Inner double border
  doc.setDrawColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
  doc.setLineWidth(0.3);
  doc.rect(11, 11, w - 22, h - 22);

  // ── Corner ornaments ──────────────────────────────────────
  const cs = 18;
  doc.setDrawColor(GOLD.r, GOLD.g, GOLD.b);
  doc.setLineWidth(1.2);
  // Top-left
  doc.line(8, 8, 8 + cs, 8); doc.line(8, 8, 8, 8 + cs);
  // Top-right
  doc.line(w - 8, 8, w - 8 - cs, 8); doc.line(w - 8, 8, w - 8, 8 + cs);
  // Bottom-left
  doc.line(8, h - 8, 8 + cs, h - 8); doc.line(8, h - 8, 8, h - 8 - cs);
  // Bottom-right
  doc.line(w - 8, h - 8, w - 8 - cs, h - 8); doc.line(w - 8, h - 8, w - 8, h - 8 - cs);

  // ── Diamond corner accents ────────────────────────────────
  doc.setFillColor(GOLD.r, GOLD.g, GOLD.b);
  const drawDiamond = (cx: number, cy: number, size: number) => {
    doc.triangle(cx, cy - size, cx + size, cy, cx, cy + size, "F");
    doc.triangle(cx, cy - size, cx - size, cy, cx, cy + size, "F");
  };
  drawDiamond(8, 8, 2);
  drawDiamond(w - 8, 8, 2);
  drawDiamond(8, h - 8, 2);
  drawDiamond(w - 8, h - 8, 2);

  // ── Header: Platform name ─────────────────────────────────
  doc.setFontSize(11);
  doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
  doc.setFont("helvetica", "bold");
  doc.text(t.header, w / 2, 24, { align: "center" });

  // Decorative dots under header
  doc.setFillColor(GOLD.r, GOLD.g, GOLD.b);
  for (let i = -3; i <= 3; i++) {
    doc.circle(w / 2 + i * 5, 28, 0.7, "F");
  }

  // ── Title ─────────────────────────────────────────────────
  doc.setFontSize(30);
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.text(t.title, w / 2, 42, { align: "center" });

  // Gold line under title
  doc.setDrawColor(GOLD.r, GOLD.g, GOLD.b);
  doc.setLineWidth(0.8);
  doc.line(w / 2 - 50, 47, w / 2 + 50, 47);

  // ── Subtitle ──────────────────────────────────────────────
  doc.setFontSize(12);
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "normal");
  doc.text(t.subtitle, w / 2, 57, { align: "center" });

  // ── Student name (large, prominent) ───────────────────────
  doc.setFontSize(28);
  doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
  doc.setFont("helvetica", "bold");
  doc.text(studentName, w / 2, 72, { align: "center" });

  // Decorative line under name
  doc.setDrawColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
  doc.setLineWidth(0.3);
  const nameWidth = doc.getTextWidth(studentName);
  doc.line(w / 2 - nameWidth / 2 - 5, 75, w / 2 + nameWidth / 2 + 5, 75);

  // ── "has completed" text ──────────────────────────────────
  doc.setFontSize(12);
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "normal");
  doc.text(t.completed, w / 2, 84, { align: "center" });

  // ── Formation title ───────────────────────────────────────
  doc.setFontSize(18);
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(formationTitle, w - 100);
  doc.text(titleLines, w / 2, 96, { align: "center" });

  // ── Details section (3 columns) ───────────────────────────
  const detailsY = titleLines.length > 1 ? 116 : 112;
  const colWidth = (w - 80) / 3;
  const col1 = 40 + colWidth / 2;
  const col2 = w / 2;
  const col3 = w - 40 - colWidth / 2;

  // Score box
  doc.setFillColor(245, 245, 255);
  doc.roundedRect(col1 - colWidth / 2, detailsY - 6, colWidth, 22, 3, 3, "F");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "normal");
  doc.text(t.score, col1, detailsY, { align: "center" });
  doc.setFontSize(18);
  doc.setTextColor(ACCENT.r, ACCENT.g, ACCENT.b);
  doc.setFont("helvetica", "bold");
  doc.text(`${score}%`, col1, detailsY + 10, { align: "center" });

  // Date box
  doc.setFillColor(245, 245, 255);
  doc.roundedRect(col2 - colWidth / 2, detailsY - 6, colWidth, 22, 3, 3, "F");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "normal");
  doc.text(t.date, col2, detailsY, { align: "center" });
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  const formattedDate = completionDate.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(formattedDate, col2, detailsY + 10, { align: "center" });

  // Instructor box
  doc.setFillColor(245, 245, 255);
  doc.roundedRect(col3 - colWidth / 2, detailsY - 6, colWidth, 22, 3, 3, "F");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "normal");
  doc.text(t.instructor, col3, detailsY, { align: "center" });
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.text(instructorName, col3, detailsY + 10, { align: "center" });

  // ── Signature section ─────────────────────────────────────
  const sigY = detailsY + 32;

  // Signature line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(w / 2 - 30, sigY, w / 2 + 30, sigY);
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "normal");
  doc.text(t.signedBy + " " + instructorName, w / 2, sigY + 5, { align: "center" });

  // ── QR Code ───────────────────────────────────────────────
  const verifyUrl = `https://freelancehigh.com/formations/verification/${certificateCode}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 200,
      margin: 1,
      color: { dark: "#6C2BD9", light: "#FFFFFF" },
    });
    const qrSize = 22;
    doc.addImage(qrDataUrl, "PNG", 20, h - 42, qrSize, qrSize);
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text(t.verify, 20 + qrSize / 2, h - 18, { align: "center" });
  } catch {
    // QR generation failed — continue without it
  }

  // ── Certificate code (bottom center) ──────────────────────
  doc.setFontSize(9);
  doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
  doc.setFont("helvetica", "bold");
  doc.text(certificateCode, w / 2, h - 26, { align: "center" });
  doc.setFontSize(7);
  doc.setTextColor(160, 160, 160);
  doc.setFont("helvetica", "normal");
  doc.text(t.code, w / 2, h - 21, { align: "center" });

  // ── Platform footer ───────────────────────────────────────
  doc.setFontSize(7);
  doc.setTextColor(180, 180, 180);
  doc.text(t.platform, w / 2, h - 14, { align: "center" });
  doc.setFontSize(6);
  doc.text(`© ${new Date().getFullYear()} FreelanceHigh. ${locale === "fr" ? "Tous droits réservés." : "All rights reserved."}`, w / 2, h - 10.5, { align: "center" });

  // Return as buffer
  return Buffer.from(doc.output("arraybuffer"));
}

// Generate a unique certificate code (format: FH-XXXX-XXXX-XXXX)
export function generateCertificateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segments = [];
  for (let s = 0; s < 3; s++) {
    let segment = "";
    for (let i = 0; i < 4; i++) {
      segment += chars[Math.floor(Math.random() * chars.length)];
    }
    segments.push(segment);
  }
  return `FH-${segments.join("-")}`;
}
