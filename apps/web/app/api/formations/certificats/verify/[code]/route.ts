// GET /api/formations/certificats/verify/[code] — Vérification publique du certificat

import { NextRequest, NextResponse } from "next/server";
import prisma from "@freelancehigh/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const certificate = await prisma.certificate.findUnique({
      where: { code },
      include: {
        user: { select: { name: true, country: true } },
        enrollment: {
          include: {
            formation: {
              select: {
                title: true,
                slug: true,
                duration: true,
                instructeur: {
                  include: {
                    user: { select: { name: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { valid: false, message: "Certificat introuvable" },
        { status: 404 }
      );
    }

    if (certificate.revokedAt) {
      return NextResponse.json({
        valid: false,
        revoked: true,
        revokedAt: certificate.revokedAt,
        message: "Ce certificat a été révoqué",
      });
    }

    const formation = certificate.enrollment.formation;

    return NextResponse.json({
      valid: true,
      certificate: {
        code: certificate.code,
        score: certificate.score,
        issuedAt: certificate.issuedAt,
        userName: certificate.user.name,
        userCountry: certificate.user.country,
        formationTitle: formation.title,
        formationSlug: formation.slug,
        formationDuration: formation.duration,
        instructorName: formation.instructeur.user.name,
      },
    });
  } catch (error) {
    console.error("[GET /api/formations/certificats/verify/[code]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
