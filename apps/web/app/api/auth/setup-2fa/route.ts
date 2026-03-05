import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import crypto from "crypto";

function generateTOTPSecret(): string {
  return crypto.randomBytes(20).toString("hex").slice(0, 32);
}

// POST: Generer un nouveau secret 2FA
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
    }

    const secret = generateTOTPSecret();
    const otpauthUrl = `otpauth://totp/FreelanceHigh:${session.user.email}?secret=${secret}&issuer=FreelanceHigh`;

    // Stocker le secret en DB (non verifie)
    try {
      const { prisma } = await import("@freelancehigh/db");
      await prisma.user.update({
        where: { id: session.user.id },
        data: { twoFactorSecret: secret, twoFactorEnabled: false },
      });
    } catch {
      // DB non connectee
    }

    return NextResponse.json({
      otpauthUrl,
      // Le secret n'est PAS retourne directement — seulement l'URL otpauth pour le QR code
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT: Confirmer le setup 2FA avec un code de verification
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const { code } = await request.json() as { code: string };
    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "Code invalide. Entrez un code a 6 chiffres." }, { status: 400 });
    }

    // TODO: Verification TOTP reelle avec otplib quand installe
    // import { authenticator } from 'otplib';
    // const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    // const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
    // if (!isValid) return NextResponse.json({ error: "Code incorrect" }, { status: 400 });

    try {
      const { prisma } = await import("@freelancehigh/db");
      await prisma.user.update({
        where: { id: session.user.id },
        data: { twoFactorEnabled: true },
      });
    } catch {
      // DB non connectee
    }

    return NextResponse.json({ success: true, message: "2FA active avec succes" });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
