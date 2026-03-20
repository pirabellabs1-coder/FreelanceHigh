import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { token, space } = await req.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token manquant" }, { status: 401 });
    }

    // Chaque espace admin a son propre token
    let validToken: string | undefined;
    if (space === "marketplace") {
      validToken = process.env.ADMIN_MARKETPLACE_TOKEN;
    } else if (space === "formations") {
      validToken = process.env.ADMIN_FORMATIONS_TOKEN;
    }

    // Fallback sur le token general si les tokens specifiques ne sont pas definis
    if (!validToken) {
      validToken = process.env.ADMIN_ACCESS_TOKEN;
    }

    if (!validToken) {
      console.error("[ADMIN ACCESS] Aucun token admin configure dans .env");
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
    }

    // Timing-safe comparison
    const tokenBuffer = Buffer.from(token);
    const validBuffer = Buffer.from(validToken);

    if (tokenBuffer.length !== validBuffer.length || !crypto.timingSafeEqual(tokenBuffer, validBuffer)) {
      console.warn(`[ADMIN ACCESS] Tentative non autorisee — IP: ${req.headers.get("x-forwarded-for") || "unknown"} — Space: ${space} — Token: ${token.slice(0, 8)}...`);
      return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
