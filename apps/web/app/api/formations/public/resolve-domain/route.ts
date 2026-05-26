import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/formations/public/resolve-domain?host=<hostname>
 * Resolve a custom domain (verified only) to a shop slug.
 * Used by middleware to rewrite custom-domain requests to /formations/boutique/[slug].
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const host = (url.searchParams.get("host") ?? "").toLowerCase().trim();
  if (!host) return NextResponse.json({ error: "host manquant" }, { status: 400 });

  try {
    const [vendor, mentor] = await Promise.all([
      prisma.instructeurProfile.findFirst({
        where: { customDomain: host, customDomainVerifiedAt: { not: null } },
        select: { shopSlug: true },
      }),
      prisma.mentorProfile.findFirst({
        where: { customDomain: host, customDomainVerifiedAt: { not: null } },
        select: { shopSlug: true },
      }),
    ]);

    const slug = vendor?.shopSlug ?? mentor?.shopSlug ?? null;
    if (!slug) return NextResponse.json({ data: null });
    return NextResponse.json({ data: { slug } });
  } catch (err) {
    console.error("[public/resolve-domain]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
