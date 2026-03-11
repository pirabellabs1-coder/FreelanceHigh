import { NextRequest, NextResponse } from "next/server";
import { serviceStore } from "@/lib/dev/data-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const limit = Math.min(parseInt(searchParams.get("limit") || "6", 10), 20);

    const services = serviceStore.getFeedServices();

    // Score: weighted combination of rating, order count, review count, and views
    const scored = services.map((s) => ({
      service: s,
      score:
        (s.rating / 5) * 0.35 +
        Math.min(s.orderCount / 100, 1) * 0.25 +
        Math.min(s.ratingCount / 50, 1) * 0.2 +
        Math.min(s.views / 500, 1) * 0.1 +
        (s.isBoosted ? 0.1 : 0),
    }));

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, limit).map(({ service }) => ({
      id: service.id,
      slug: service.slug,
      title: service.title,
      category: service.categoryName,
      priceEur: service.basePrice,
      rating: service.rating,
      reviews: service.ratingCount,
      orderCount: service.orderCount,
      image: service.mainImage || service.images[0] || "",
      freelancer: service.vendorName,
      freelancerAvatar: service.vendorAvatar,
    }));

    return NextResponse.json({ services: top });
  } catch (error) {
    console.error("[API /public/top-services GET]", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des top services" },
      { status: 500 }
    );
  }
}
