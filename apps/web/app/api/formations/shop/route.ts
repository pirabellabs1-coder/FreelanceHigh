import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

/**
 * GET /api/formations/shop
 * Returns the authenticated user's shop settings (vendor + mentor merged).
 *
 * PATCH /api/formations/shop
 * Body: {
 *   role: "vendor" | "mentor",
 *   shopSlug?, shopName?, customDomain?, shopPrimaryColor?, shopLogoUrl?
 * }
 * Updates the corresponding profile's shop settings.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const [vendor, mentor] = await Promise.all([
      prisma.instructeurProfile.findUnique({
        where: { userId: session.user.id },
        select: {
          id: true,
          shopSlug: true,
          shopName: true,
          customDomain: true,
          customDomainVerifiedAt: true,
          customDomainTxt: true,
          shopPrimaryColor: true,
          shopLogoUrl: true,
        },
      }),
      prisma.mentorProfile.findUnique({
        where: { userId: session.user.id },
        select: {
          id: true,
          shopSlug: true,
          shopName: true,
          customDomain: true,
          customDomainVerifiedAt: true,
          customDomainTxt: true,
          shopPrimaryColor: true,
          shopLogoUrl: true,
        },
      }),
    ]);

    return NextResponse.json({ data: { vendor, mentor } });
  } catch (err) {
    console.error("[shop GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Validate a slug: 3-40 chars, [a-z0-9-], no leading/trailing dash
function isValidSlug(s: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?$/.test(s);
}

// Validate a domain: alphanumeric labels separated by dots, TLD >=2 chars
function isValidDomain(s: string): boolean {
  const lower = s.toLowerCase().trim();
  return /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/.test(lower) && lower.length <= 253;
}

const RESERVED_SLUGS = new Set([
  "admin", "api", "www", "app", "mail", "ftp", "blog", "shop", "boutique",
  "formations", "explorer", "marketplace", "mentors", "tarifs", "connexion", "inscription",
  "novakou", "freelancehigh", "kyc", "dashboard",
]);

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const body = await request.json();
    const { role } = body as { role?: string };
    if (role !== "vendor" && role !== "mentor") {
      return NextResponse.json({ error: "Rôle invalide (vendor ou mentor)" }, { status: 400 });
    }

    const shopSlug = body.shopSlug?.toString().trim().toLowerCase() || null;
    const shopName = body.shopName?.toString().trim().slice(0, 80) || null;
    const customDomain = body.customDomain?.toString().trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "") || null;
    const shopPrimaryColor = body.shopPrimaryColor?.toString().trim() || null;
    const shopLogoUrl = body.shopLogoUrl?.toString().trim() || null;

    if (shopSlug) {
      if (!isValidSlug(shopSlug))
        return NextResponse.json({ error: "Slug invalide : 3 à 40 caractères, a-z 0-9 tirets, pas de tiret en début/fin." }, { status: 400 });
      if (RESERVED_SLUGS.has(shopSlug))
        return NextResponse.json({ error: "Ce slug est réservé. Choisissez-en un autre." }, { status: 400 });
    }
    if (customDomain && !isValidDomain(customDomain))
      return NextResponse.json({ error: "Nom de domaine invalide (ex : ma-boutique.com)." }, { status: 400 });

    // Unicity check (across vendor + mentor)
    if (shopSlug) {
      const [cv, cm] = await Promise.all([
        prisma.instructeurProfile.findFirst({ where: { shopSlug, NOT: { userId: session.user.id } }, select: { id: true } }),
        prisma.mentorProfile.findFirst({ where: { shopSlug, NOT: { userId: session.user.id } }, select: { id: true } }),
      ]);
      if (cv || cm) return NextResponse.json({ error: "Ce slug est déjà utilisé." }, { status: 409 });
    }
    if (customDomain) {
      const [dv, dm] = await Promise.all([
        prisma.instructeurProfile.findFirst({ where: { customDomain, NOT: { userId: session.user.id } }, select: { id: true } }),
        prisma.mentorProfile.findFirst({ where: { customDomain, NOT: { userId: session.user.id } }, select: { id: true } }),
      ]);
      if (dv || dm) return NextResponse.json({ error: "Ce domaine est déjà utilisé par un autre compte." }, { status: 409 });
    }

    // Determine if a new DNS verification token is needed (domain changed)
    const existing = role === "vendor"
      ? await prisma.instructeurProfile.findUnique({ where: { userId: session.user.id }, select: { customDomain: true, customDomainTxt: true } })
      : await prisma.mentorProfile.findUnique({ where: { userId: session.user.id }, select: { customDomain: true, customDomainTxt: true } });

    let customDomainTxt = existing?.customDomainTxt ?? null;
    let customDomainVerifiedAt: Date | null | undefined = undefined;

    if (!customDomain) {
      // Removing domain — clear token + verification
      customDomainTxt = null;
      customDomainVerifiedAt = null;
    } else if (customDomain !== existing?.customDomain) {
      // New domain — generate fresh token, reset verification
      customDomainTxt = `novakou-verify=${randomBytes(12).toString("hex")}`;
      customDomainVerifiedAt = null;
    }

    const data: {
      shopSlug: string | null;
      shopName: string | null;
      customDomain: string | null;
      shopPrimaryColor: string | null;
      shopLogoUrl: string | null;
      customDomainTxt: string | null;
      customDomainVerifiedAt?: Date | null;
    } = {
      shopSlug,
      shopName,
      customDomain,
      shopPrimaryColor,
      shopLogoUrl,
      customDomainTxt,
    };
    if (customDomainVerifiedAt !== undefined) data.customDomainVerifiedAt = customDomainVerifiedAt;

    if (role === "vendor") {
      const updated = await prisma.instructeurProfile.update({
        where: { userId: session.user.id },
        data,
      });
      return NextResponse.json({ data: updated });
    } else {
      const updated = await prisma.mentorProfile.update({
        where: { userId: session.user.id },
        data,
      });
      return NextResponse.json({ data: updated });
    }
  } catch (err) {
    console.error("[shop PATCH]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Erreur serveur", detail: msg }, { status: 500 });
  }
}
