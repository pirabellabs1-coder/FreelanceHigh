import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ slug: string }> };

/**
 * GET /api/formations/public/shop/[slug]
 * Resolve a shop by slug (tries vendor then mentor).
 * Returns the shop data + its formations/products (vendor) or profile (mentor).
 */
export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;
  try {
    const vendor = await prisma.instructeurProfile.findUnique({
      where: { shopSlug: slug },
      select: {
        id: true,
        shopSlug: true,
        shopName: true,
        customDomain: true,
        customDomainVerifiedAt: true,
        shopPrimaryColor: true,
        shopLogoUrl: true,
        bioFr: true,
        expertise: true,
        website: true,
        linkedin: true,
        user: { select: { id: true, name: true, image: true } },
        formations: {
          where: { status: "ACTIF" },
          orderBy: { createdAt: "desc" },
          take: 24,
          select: {
            id: true,
            slug: true,
            title: true,
            shortDesc: true,
            thumbnail: true,
            price: true,
            originalPrice: true,
            rating: true,
            reviewsCount: true,
            studentsCount: true,
          },
        },
        digitalProducts: {
          where: { status: "ACTIF" },
          orderBy: { createdAt: "desc" },
          take: 24,
          select: {
            id: true,
            slug: true,
            title: true,
            banner: true,
            productType: true,
            price: true,
            originalPrice: true,
            rating: true,
            reviewsCount: true,
            salesCount: true,
          },
        },
      },
    });

    if (vendor) {
      return NextResponse.json({
        data: {
          kind: "vendor",
          id: vendor.id,
          slug: vendor.shopSlug,
          name: vendor.shopName ?? vendor.user.name,
          owner: vendor.user,
          customDomain: vendor.customDomain,
          domainVerified: !!vendor.customDomainVerifiedAt,
          primaryColor: vendor.shopPrimaryColor ?? "#006e2f",
          logoUrl: vendor.shopLogoUrl,
          bio: vendor.bioFr,
          expertise: vendor.expertise,
          website: vendor.website,
          linkedin: vendor.linkedin,
          formations: vendor.formations,
          digitalProducts: vendor.digitalProducts,
        },
      });
    }

    const mentor = await prisma.mentorProfile.findUnique({
      where: { shopSlug: slug },
      select: {
        id: true,
        shopSlug: true,
        shopName: true,
        customDomain: true,
        customDomainVerifiedAt: true,
        shopPrimaryColor: true,
        shopLogoUrl: true,
        specialty: true,
        bio: true,
        domain: true,
        sessionPrice: true,
        sessionDuration: true,
        isAvailable: true,
        isVerified: true,
        rating: true,
        reviewsCount: true,
        totalSessions: true,
        user: { select: { id: true, name: true, image: true } },
      },
    });

    if (mentor) {
      return NextResponse.json({
        data: {
          kind: "mentor",
          id: mentor.id,
          slug: mentor.shopSlug,
          name: mentor.shopName ?? mentor.user.name,
          owner: mentor.user,
          customDomain: mentor.customDomain,
          domainVerified: !!mentor.customDomainVerifiedAt,
          primaryColor: mentor.shopPrimaryColor ?? "#006e2f",
          logoUrl: mentor.shopLogoUrl,
          specialty: mentor.specialty,
          bio: mentor.bio,
          domainExpertise: mentor.domain,
          sessionPrice: mentor.sessionPrice,
          sessionDuration: mentor.sessionDuration,
          isAvailable: mentor.isAvailable,
          isVerified: mentor.isVerified,
          rating: mentor.rating,
          reviewsCount: mentor.reviewsCount,
          totalSessions: mentor.totalSessions,
        },
      });
    }

    return NextResponse.json({ error: "Boutique introuvable" }, { status: 404 });
  } catch (err) {
    console.error("[public/shop/[slug]]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
