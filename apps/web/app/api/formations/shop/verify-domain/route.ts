import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { promises as dns } from "dns";

/**
 * POST /api/formations/shop/verify-domain
 * Body: { role: "vendor" | "mentor" }
 *
 * Looks up the TXT records of `customDomain` and checks that `customDomainTxt`
 * is present. If yes, sets `customDomainVerifiedAt = now`.
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const body = await request.json();
    const { role } = body as { role?: string };
    if (role !== "vendor" && role !== "mentor")
      return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });

    const profile = role === "vendor"
      ? await prisma.instructeurProfile.findUnique({
          where: { userId: session.user.id },
          select: { customDomain: true, customDomainTxt: true },
        })
      : await prisma.mentorProfile.findUnique({
          where: { userId: session.user.id },
          select: { customDomain: true, customDomainTxt: true },
        });

    if (!profile?.customDomain || !profile.customDomainTxt) {
      return NextResponse.json(
        { error: "Aucun domaine custom configuré. Enregistrez-en un d'abord." },
        { status: 400 },
      );
    }

    let records: string[][] = [];
    try {
      records = await dns.resolveTxt(profile.customDomain);
    } catch (dnsErr) {
      return NextResponse.json(
        {
          error: "Impossible de lire les enregistrements DNS. Assurez-vous d'avoir ajouté le TXT chez votre registrar (propagation DNS peut prendre jusqu'à 24h).",
          detail: dnsErr instanceof Error ? dnsErr.message : String(dnsErr),
        },
        { status: 400 },
      );
    }

    const flat = records.map((arr) => arr.join(""));
    const token = profile.customDomainTxt;
    const found = flat.some((txt) => txt.includes(token));

    if (!found) {
      return NextResponse.json(
        {
          error: "Token non trouvé dans les TXT records. Vérifiez la valeur et attendez la propagation DNS.",
          expected: token,
          received: flat,
        },
        { status: 400 },
      );
    }

    const now = new Date();
    if (role === "vendor") {
      await prisma.instructeurProfile.update({
        where: { userId: session.user.id },
        data: { customDomainVerifiedAt: now },
      });
    } else {
      await prisma.mentorProfile.update({
        where: { userId: session.user.id },
        data: { customDomainVerifiedAt: now },
      });
    }

    return NextResponse.json({ data: { verified: true, verifiedAt: now } });
  } catch (err) {
    console.error("[shop/verify-domain POST]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
