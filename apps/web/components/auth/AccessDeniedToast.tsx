"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToastStore } from "@/store/toast";

/**
 * Affiche un toast si l'utilisateur a ete redirige parce qu'il n'avait
 * pas acces a l'espace demande (?access_denied=1).
 * Place ce composant dans chaque layout de dashboard.
 */
export function AccessDeniedToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    if (searchParams.get("access_denied") === "1") {
      addToast("warning", "Vous n'avez pas accès à cet espace. Vous avez été redirigé vers votre tableau de bord.");
      // Nettoyer le parametre de l'URL sans recharger
      const url = new URL(window.location.href);
      url.searchParams.delete("access_denied");
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [searchParams, addToast, router]);

  return null;
}
