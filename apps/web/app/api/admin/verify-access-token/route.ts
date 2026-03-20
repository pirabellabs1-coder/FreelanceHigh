import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    const validToken = process.env.ADMIN_ACCESS_TOKEN;
    if (!validToken) {
      console.error("[ADMIN ACCESS] ADMIN_ACCESS_TOKEN non defini dans .env");
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
    }

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token manquant" }, { status: 401 });
    }

    // Timing-safe comparison to prevent timing attacks
    const tokenBuffer = Buffer.from(token);
    const validBuffer = Buffer.from(validToken);

    if (tokenBuffer.length !== validBuffer.length || !crypto.timingSafeEqual(tokenBuffer, validBuffer)) {
      // Log unauthorized access attempt
      console.warn(`[ADMIN ACCESS] Tentative acces non autorise — IP: ${req.headers.get("x-forwarded-for") || "unknown"} — Token: ${token.slice(0, 8)}...`);
      return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
