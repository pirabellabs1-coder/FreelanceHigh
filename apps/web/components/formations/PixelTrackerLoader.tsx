"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PixelTracker } from "./PixelTracker";

interface Pixel {
  id: string;
  type: "FACEBOOK" | "GOOGLE" | "TIKTOK";
  pixelId: string;
  isActive: boolean;
}

/**
 * Auto-loads pixels for the current formation/product's instructor.
 * Placed in the formations layout so pixels track all page views.
 */
export function PixelTrackerLoader() {
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    // Extract slug from formation or product detail pages
    const formationMatch = pathname.match(/^\/formations\/([^/]+)$/);
    const productMatch = pathname.match(/^\/formations\/produits\/([^/]+)$/);
    const slug = productMatch?.[1] || formationMatch?.[1];

    if (!slug || slug === "admin" || slug === "instructeur" || slug === "explorer" || slug === "categories" || slug === "produits" || slug === "connexion" || slug === "inscription") {
      setPixels([]);
      return;
    }

    // Fetch the instructor's pixels for this formation/product
    const isProduct = !!productMatch;
    const apiUrl = isProduct
      ? `/api/produits/${slug}` // product detail includes instructeurId
      : `/api/formations/${slug}`; // formation detail includes instructeur

    fetch(apiUrl)
      .then((r) => r.json())
      .then((data) => {
        const instructeurId = isProduct
          ? data?.instructeurId
          : data?.instructeur?.id;

        if (!instructeurId) return;

        // Fetch pixels for this instructor
        return fetch(`/api/instructeur/marketing/pixels?instructeurId=${instructeurId}`);
      })
      .then((r) => r?.json())
      .then((data) => {
        if (data?.pixels) {
          setPixels(data.pixels.filter((p: Pixel) => p.isActive));
        }
      })
      .catch(() => {});
  }, [pathname]);

  if (pixels.length === 0) return null;

  return <PixelTracker pixels={pixels} />;
}
