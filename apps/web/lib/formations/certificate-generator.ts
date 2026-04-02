// Certificate PDF generator — "Sovereign Gilt" premium design
// Inspired by diplomatic seals, central bank notes, and royal charters.
// No score displayed. Shows start date, completion date, 5-year validity.

import { jsPDF } from "jspdf";
import QRCode from "qrcode";

interface CertificateData {
  studentName: string;
  formationTitle: string;
  instructorName: string;
  startDate: Date;
  completionDate: Date;
  certificateCode: string;
  locale: "fr" | "en";
}

const LABELS = {
  fr: {
    brand: "FreelanceHigh",
    brandSub: "FORMATIONS  &  CERTIFICATIONS  PROFESSIONNELLES",
    title: "CERTIFICAT DE REUSSITE",
    subtitle: "Ce certificat atteste que",
    completed: "a complete avec succes la formation",
    startDate: "DATE DE DEBUT",
    endDate: "DATE DE FIN",
    validUntil: "VALIDE JUSQU'AU",
    instructor: "DELIVRE PAR L'INSTRUCTEUR",
    certId: "IDENTIFIANT UNIQUE DU CERTIFICAT",
    verify: "SCANNER POUR VERIFIER",
    verifyAt: "Verifiable sur",
    platform: "FreelanceHigh \u2014 La plateforme freelance qui eleve votre carriere au plus haut niveau",
    rights: "Tous droits reserves.",
    validityNote: "Ce certificat est valide 5 ans a compter de la date de delivrance.",
  },
  en: {
    brand: "FreelanceHigh",
    brandSub: "PROFESSIONAL  TRAINING  &  CERTIFICATIONS",
    title: "CERTIFICATE OF COMPLETION",
    subtitle: "This certifies that",
    completed: "has successfully completed the course",
    startDate: "START DATE",
    endDate: "COMPLETION DATE",
    validUntil: "VALID UNTIL",
    instructor: "ISSUED BY INSTRUCTOR",
    certId: "UNIQUE CERTIFICATE IDENTIFIER",
    verify: "SCAN TO VERIFY",
    verifyAt: "Verifiable at",
    platform: "FreelanceHigh \u2014 The freelance platform that elevates your career to the highest level",
    rights: "All rights reserved.",
    validityNote: "This certificate is valid for 5 years from the date of issuance.",
  },
};

// Sovereign Gilt palette
const NAVY = { r: 26, g: 31, b: 58 };
const GOLD = { r: 201, g: 168, b: 76 };
const GOLD_LIGHT = { r: 218, g: 195, b: 130 };
const GOLD_DARK = { r: 160, g: 130, b: 50 };
const IVORY = { r: 250, g: 246, b: 238 };
const VIOLET = { r: 91, g: 61, b: 143 };
const MUTED = { r: 140, g: 135, b: 125 };
const LIGHT_MUTED = { r: 180, g: 175, b: 165 };

// ── Helpers ──

function drawDiamond(doc: jsPDF, cx: number, cy: number, size: number) {
  doc.triangle(cx, cy - size, cx + size, cy, cx, cy + size, "F");
  doc.triangle(cx, cy - size, cx - size, cy, cx, cy + size, "F");
}

function drawCornerBrackets(doc: jsPDF, x: number, y: number, len: number, flipX: boolean, flipY: boolean) {
  const dx = flipX ? -1 : 1;
  const dy = flipY ? -1 : 1;
  doc.setDrawColor(GOLD.r, GOLD.g, GOLD.b);
  doc.setLineWidth(0.6);
  doc.line(x, y, x + dx * len, y);
  doc.line(x, y, x, y + dy * len);
  doc.setLineWidth(0.25);
  doc.line(x + dx * 2, y + dy * 2, x + dx * (len - 3), y + dy * 2);
  doc.line(x + dx * 2, y + dy * 2, x + dx * 2, y + dy * (len - 3));
}

function drawGuillocheBorder(doc: jsPDF, x: number, y: number, w: number, h: number) {
  doc.setDrawColor(GOLD.r, GOLD.g, GOLD.b);
  doc.setLineWidth(0.15);
  doc.rect(x, y, w, h);
  doc.rect(x + 1.5, y + 1.5, w - 3, h - 3);

  const density = 2.5;
  // Top & bottom guilloche wave
  for (let px = x + 4; px < x + w - 4; px += density) {
    const cyT = y + 0.75;
    doc.line(px, cyT - 0.4, px + density * 0.5, cyT + 0.4);
    doc.line(px + density * 0.5, cyT + 0.4, px + density, cyT - 0.4);
    const cyB = y + h - 0.75;
    doc.line(px, cyB - 0.4, px + density * 0.5, cyB + 0.4);
    doc.line(px + density * 0.5, cyB + 0.4, px + density, cyB - 0.4);
  }
  // Left & right
  for (let py = y + 4; py < y + h - 4; py += density) {
    const cxL = x + 0.75;
    doc.line(cxL - 0.4, py, cxL + 0.4, py + density * 0.5);
    doc.line(cxL + 0.4, py + density * 0.5, cxL - 0.4, py + density);
    const cxR = x + w - 0.75;
    doc.line(cxR - 0.4, py, cxR + 0.4, py + density * 0.5);
    doc.line(cxR + 0.4, py + density * 0.5, cxR - 0.4, py + density);
  }
}

function drawDivider(doc: jsPDF, cx: number, y: number, halfWidth: number) {
  doc.setDrawColor(GOLD.r, GOLD.g, GOLD.b);
  doc.setLineWidth(0.3);
  doc.line(cx - halfWidth, y, cx - 5, y);
  doc.line(cx + 5, y, cx + halfWidth, y);
  doc.setFillColor(GOLD.r, GOLD.g, GOLD.b);
  drawDiamond(doc, cx, y, 1.5);
  doc.setFillColor(GOLD_LIGHT.r, GOLD_LIGHT.g, GOLD_LIGHT.b);
  drawDiamond(doc, cx - 8, y, 0.7);
  drawDiamond(doc, cx + 8, y, 0.7);
}

function drawSeal(doc: jsPDF, cx: number, cy: number, radius: number) {
  doc.setDrawColor(GOLD.r, GOLD.g, GOLD.b);
  doc.setLineWidth(1.2);
  doc.circle(cx, cy, radius);
  doc.setLineWidth(0.3);
  doc.circle(cx, cy, radius - 1.5);
  doc.circle(cx, cy, radius - 3);

  // Notches
  doc.setLineWidth(0.2);
  const notches = 48;
  for (let i = 0; i < notches; i++) {
    const angle = (i / notches) * Math.PI * 2;
    const r1 = radius - 1.5;
    const r2 = radius - 2.8;
    doc.line(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1, cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
  }

  // Inner fill
  doc.setFillColor(IVORY.r, IVORY.g, IVORY.b);
  doc.circle(cx, cy, radius - 4, "F");
  doc.setDrawColor(GOLD_DARK.r, GOLD_DARK.g, GOLD_DARK.b);
  doc.setLineWidth(0.2);
  doc.circle(cx, cy, radius - 4);

  // Star
  doc.setFillColor(GOLD.r, GOLD.g, GOLD.b);
  const starR = 3;
  const starInner = 1.2;
  for (let i = 0; i < 10; i++) {
    const a1 = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 1) / 10) * Math.PI * 2 - Math.PI / 2;
    const r1 = i % 2 === 0 ? starR : starInner;
    const r2 = (i + 1) % 2 === 0 ? starR : starInner;
    doc.triangle(cx, cy, cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1, cx + Math.cos(a2) * r2, cy + Math.sin(a2) * r2, "F");
  }

  // Micro text
  doc.setFontSize(3.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(GOLD_DARK.r, GOLD_DARK.g, GOLD_DARK.b);
  const arcText = "FREELANCEHIGH  ·  CERTIFIE  ·  AUTHENTIQUE  ·";
  const arcRadius = radius - 2.2;
  const startAngle = -Math.PI * 0.75;
  const arcLen = Math.PI * 1.5;
  for (let i = 0; i < arcText.length; i++) {
    const angle = startAngle + (i / arcText.length) * arcLen;
    const x = cx + Math.cos(angle) * arcRadius;
    const y = cy + Math.sin(angle) * arcRadius;
    doc.text(arcText[i], x, y, { angle: -(angle * 180 / Math.PI) - 90, align: "center" });
  }
}

function formatDate(date: Date, locale: "fr" | "en"): string {
  return date.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  const { studentName, formationTitle, instructorName, startDate, completionDate, certificateCode, locale } = data;
  const t = LABELS[locale];

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();  // 297
  const h = doc.internal.pageSize.getHeight(); // 210

  // 5-year validity
  const validUntil = new Date(completionDate);
  validUntil.setFullYear(validUntil.getFullYear() + 5);

  // ── Background ──
  doc.setFillColor(IVORY.r, IVORY.g, IVORY.b);
  doc.rect(0, 0, w, h, "F");

  // Subtle paper texture
  doc.setGState(doc.GState({ opacity: 0.012 }));
  doc.setFillColor(GOLD_DARK.r, GOLD_DARK.g, GOLD_DARK.b);
  for (let px = 8; px < w - 8; px += 6) {
    for (let py = 8; py < h - 8; py += 6) {
      doc.circle(px, py, 0.2, "F");
    }
  }
  doc.setGState(doc.GState({ opacity: 1 }));

  // ── Guilloche border ──
  drawGuillocheBorder(doc, 8, 6, w - 16, h - 12);

  // Inner gold frame
  doc.setDrawColor(GOLD.r, GOLD.g, GOLD.b);
  doc.setLineWidth(0.5);
  doc.rect(14, 11, w - 28, h - 22);
  doc.setLineWidth(0.15);
  doc.rect(16, 13, w - 32, h - 26);

  // ── Corner ornaments ──
  const cLen = 18;
  drawCornerBrackets(doc, 14, 11, cLen, false, false);
  drawCornerBrackets(doc, w - 14, 11, cLen, true, false);
  drawCornerBrackets(doc, 14, h - 11, cLen, false, true);
  drawCornerBrackets(doc, w - 14, h - 11, cLen, true, true);

  doc.setFillColor(GOLD.r, GOLD.g, GOLD.b);
  const cd = 2;
  [[14, 11], [w - 14, 11], [14, h - 11], [w - 14, h - 11]].forEach(([cx, cy]) => {
    drawDiamond(doc, cx, cy, cd);
  });

  // Side dots
  doc.setGState(doc.GState({ opacity: 0.1 }));
  doc.setFillColor(GOLD.r, GOLD.g, GOLD.b);
  for (let sy = 25; sy < h - 25; sy += 6) {
    doc.circle(16.5, sy, 0.35, "F");
    doc.circle(w - 16.5, sy, 0.35, "F");
  }
  doc.setGState(doc.GState({ opacity: 1 }));

  // Top/bottom accent lines
  doc.setFillColor(GOLD.r, GOLD.g, GOLD.b);
  doc.rect(14, 6, w - 28, 0.8, "F");
  doc.setFillColor(VIOLET.r, VIOLET.g, VIOLET.b);
  doc.rect(14, 6.8, w - 28, 0.3, "F");
  doc.setFillColor(VIOLET.r, VIOLET.g, VIOLET.b);
  doc.rect(14, h - 7.1, w - 28, 0.3, "F");
  doc.setFillColor(GOLD.r, GOLD.g, GOLD.b);
  doc.rect(14, h - 6.8, w - 28, 0.8, "F");

  // ══════════════════════ CONTENT ══════════════════════

  // Brand
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(VIOLET.r, VIOLET.g, VIOLET.b);
  doc.text(t.brand, w / 2, 23, { align: "center" });

  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(GOLD.r, GOLD.g, GOLD.b);
  doc.text(t.brandSub, w / 2, 28, { align: "center" });

  drawDivider(doc, w / 2, 33, 55);

  // Title
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
  doc.text(t.title, w / 2, 46, { align: "center" });

  // Double underline
  doc.setDrawColor(GOLD.r, GOLD.g, GOLD.b);
  doc.setLineWidth(0.6);
  doc.line(w / 2 - 60, 49, w / 2 + 60, 49);
  doc.setLineWidth(0.2);
  doc.line(w / 2 - 45, 51, w / 2 + 45, 51);

  // "This certifies that"
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.text(t.subtitle, w / 2, 60, { align: "center" });

  // Student name
  doc.setFontSize(34);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
  doc.text(studentName, w / 2, 74, { align: "center" });

  const nameW = doc.getTextWidth(studentName);
  doc.setDrawColor(GOLD.r, GOLD.g, GOLD.b);
  doc.setLineWidth(0.4);
  doc.line(w / 2 - nameW / 2 - 10, 77, w / 2 + nameW / 2 + 10, 77);
  doc.setFillColor(GOLD.r, GOLD.g, GOLD.b);
  doc.circle(w / 2 - nameW / 2 - 10, 77, 0.6, "F");
  doc.circle(w / 2 + nameW / 2 + 10, 77, 0.6, "F");

  // "Has completed"
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.text(t.completed, w / 2, 86, { align: "center" });

  // Formation title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
  const titleLines = doc.splitTextToSize(formationTitle, w - 120);
  doc.text(titleLines, w / 2, 97, { align: "center" });

  const divY = titleLines.length > 1 ? 107 : 104;
  drawDivider(doc, w / 2, divY, 45);

  // ── Details: Start | Completion | Valid Until ──
  const detY = divY + 10;
  const col1 = w * 0.25;
  const col2 = w * 0.5;
  const col3 = w * 0.75;

  // Start date
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(GOLD_DARK.r, GOLD_DARK.g, GOLD_DARK.b);
  doc.text(t.startDate, col1, detY, { align: "center" });
  doc.setFontSize(11);
  doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
  doc.text(formatDate(startDate, locale), col1, detY + 7, { align: "center" });

  // Completion date
  doc.setFontSize(6.5);
  doc.setTextColor(GOLD_DARK.r, GOLD_DARK.g, GOLD_DARK.b);
  doc.text(t.endDate, col2, detY, { align: "center" });
  doc.setFontSize(11);
  doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
  doc.text(formatDate(completionDate, locale), col2, detY + 7, { align: "center" });

  // Valid until
  doc.setFontSize(6.5);
  doc.setTextColor(GOLD_DARK.r, GOLD_DARK.g, GOLD_DARK.b);
  doc.text(t.validUntil, col3, detY, { align: "center" });
  doc.setFontSize(11);
  doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
  doc.text(formatDate(validUntil, locale), col3, detY + 7, { align: "center" });

  // Separators
  doc.setDrawColor(GOLD_LIGHT.r, GOLD_LIGHT.g, GOLD_LIGHT.b);
  doc.setLineWidth(0.15);
  doc.line((col1 + col2) / 2, detY - 3, (col1 + col2) / 2, detY + 10);
  doc.line((col2 + col3) / 2, detY - 3, (col2 + col3) / 2, detY + 10);

  // ── Instructor + signature ──
  const instrY = detY + 20;
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(GOLD_DARK.r, GOLD_DARK.g, GOLD_DARK.b);
  doc.text(t.instructor, w / 2, instrY, { align: "center" });
  doc.setFontSize(13);
  doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
  doc.text(instructorName, w / 2, instrY + 7, { align: "center" });
  doc.setDrawColor(200, 195, 185);
  doc.setLineWidth(0.3);
  doc.line(w / 2 - 30, instrY + 10, w / 2 + 30, instrY + 10);

  // ── Seal ──
  drawSeal(doc, w - 50, h - 42, 14);

  // ── QR Code ──
  const qrX = 22;
  const qrY = h - 48;
  const qrSize = 22;
  const verifyUrl = `https://freelancehigh.com/formations/verification/${certificateCode}`;

  try {
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 300,
      margin: 1,
      color: { dark: "#1a1f3a", light: "#faf6ee" },
    });
    doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);
  } catch {
    // Fallback: draw placeholder box
    doc.setDrawColor(GOLD_LIGHT.r, GOLD_LIGHT.g, GOLD_LIGHT.b);
    doc.setLineWidth(0.3);
    doc.rect(qrX, qrY, qrSize, qrSize);
    doc.setFontSize(6);
    doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
    doc.text("QR", qrX + qrSize / 2, qrY + qrSize / 2, { align: "center" });
  }

  doc.setFontSize(4.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(LIGHT_MUTED.r, LIGHT_MUTED.g, LIGHT_MUTED.b);
  doc.text(t.verify, qrX + qrSize / 2, qrY + qrSize + 3.5, { align: "center" });

  // ── Certificate code ──
  const codeY = h - 28;
  doc.setFontSize(5.5);
  doc.setTextColor(LIGHT_MUTED.r, LIGHT_MUTED.g, LIGHT_MUTED.b);
  doc.text(t.certId, w / 2, codeY, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("courier", "bold");
  doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
  doc.text(certificateCode, w / 2, codeY + 6, { align: "center" });

  const codeW = doc.getTextWidth(certificateCode) + 10;
  doc.setDrawColor(GOLD_LIGHT.r, GOLD_LIGHT.g, GOLD_LIGHT.b);
  doc.setLineWidth(0.2);
  doc.line(w / 2 - codeW / 2, codeY + 8, w / 2 + codeW / 2, codeY + 8);

  // Verify URL
  doc.setFontSize(5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(LIGHT_MUTED.r, LIGHT_MUTED.g, LIGHT_MUTED.b);
  doc.text(`${t.verifyAt} freelancehigh.com/formations/verification`, w / 2, codeY + 13, { align: "center" });

  // ── Footer ──
  doc.setFontSize(4.5);
  doc.text(t.platform, w / 2, h - 15, { align: "center" });
  doc.setFontSize(4);
  doc.text(`\u00A9 ${new Date().getFullYear()} FreelanceHigh. ${t.rights} ${t.validityNote}`, w / 2, h - 12, { align: "center" });

  return Buffer.from(doc.output("arraybuffer"));
}

export function generateCertificateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segments: string[] = [];
  for (let s = 0; s < 3; s++) {
    let segment = "";
    for (let i = 0; i < 4; i++) {
      segment += chars[Math.floor(Math.random() * chars.length)];
    }
    segments.push(segment);
  }
  return `FH-${segments.join("-")}`;
}
