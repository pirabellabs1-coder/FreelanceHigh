// GET /api/formations/unsubscribe/[token] — Désabonnement des emails de relance panier

import { NextRequest, NextResponse } from "next/server";
import prisma from "@freelancehigh/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // The token is the userId (base64 encoded for obfuscation in emails)
    let userId: string;
    try {
      userId = Buffer.from(token, "base64").toString("utf-8");
    } catch {
      return new NextResponse(htmlPage("Lien invalide", "Ce lien de désabonnement est invalide."), {
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) {
      return new NextResponse(htmlPage("Lien invalide", "Utilisateur introuvable."), {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // Mark all abandoned carts as DESABONNE
    await prisma.abandonedCart.updateMany({
      where: {
        userId,
        status: { notIn: ["CONVERTI", "DESABONNE"] },
      },
      data: { status: "DESABONNE" },
    });

    return new NextResponse(
      htmlPage(
        "Désabonnement réussi",
        "Vous ne recevrez plus d'emails de rappel pour vos paniers abandonnés. Vous pouvez fermer cette page."
      ),
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  } catch (error) {
    console.error("[GET /api/formations/unsubscribe/[token]]", error);
    return new NextResponse(htmlPage("Erreur", "Une erreur est survenue. Veuillez réessayer plus tard."), {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}

function htmlPage(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — FreelanceHigh</title></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;">
  <div style="max-width:480px;background:#fff;border-radius:16px;padding:48px;text-align:center;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
    <h1 style="color:#6C2BD9;font-size:24px;margin:0 0 16px;">${title}</h1>
    <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">${message}</p>
    <a href="/formations" style="display:inline-block;background:#6C2BD9;color:#fff;padding:10px 24px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:bold;">Retour aux formations</a>
  </div>
</body>
</html>`;
}
