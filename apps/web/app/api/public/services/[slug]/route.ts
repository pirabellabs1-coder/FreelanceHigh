import { NextRequest, NextResponse } from "next/server";
import { serviceStore, reviewStore, orderStore, profileStore } from "@/lib/dev/data-store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const service = serviceStore
    .getAll()
    .find((s) => s.slug === slug && s.status === "actif");
  if (!service)
    return NextResponse.json(
      { error: "Service non trouvé" },
      { status: 404 }
    );

  // Get reviews for this service
  const reviews = reviewStore
    .getAll()
    .filter((r) => r.serviceId === service.id);

  // Get vendor profile
  const profile = profileStore.get(service.userId);

  // Get vendor's other active services (excluding current)
  const otherServices = serviceStore
    .getAll()
    .filter(
      (s) =>
        s.userId === service.userId &&
        s.id !== service.id &&
        s.status === "actif"
    )
    .slice(0, 4)
    .map((s) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      basePrice: s.basePrice,
      rating: s.rating,
      ratingCount: s.ratingCount,
      image: s.mainImage,
    }));

  // Get similar services (same category, excluding current)
  const similarServices = serviceStore
    .getAll()
    .filter(
      (s) =>
        s.categoryId === service.categoryId &&
        s.id !== service.id &&
        s.status === "actif"
    )
    .slice(0, 4)
    .map((s) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      basePrice: s.basePrice,
      rating: s.rating,
      ratingCount: s.ratingCount,
      image: s.mainImage,
      vendorName: s.vendorName,
    }));

  // Count completed orders for this vendor
  const completedOrders = orderStore
    .getAll()
    .filter(
      (o) => o.freelanceId === service.userId && o.status === "termine"
    ).length;

  return NextResponse.json({
    service: {
      ...service,
      reviews,
      vendor: {
        name: service.vendorName,
        avatar: service.vendorAvatar,
        username: service.vendorUsername,
        country: service.vendorCountry,
        badges: service.vendorBadges,
        rating: service.vendorRating,
        plan: service.vendorPlan,
        title: profile?.title || "",
        bio: profile?.bio || "",
        completedOrders,
        memberSince: profile?.userId ? undefined : undefined,
      },
      otherServices,
      similarServices,
    },
  });
}
