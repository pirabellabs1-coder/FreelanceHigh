"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";

export function ImpersonationBanner() {
  const { impersonatedUser, stopImpersonation, isImpersonating } = useAuthStore();
  const router = useRouter();

  if (!isImpersonating() || !impersonatedUser) return null;

  function handleStop() {
    stopImpersonation();
    router.push("/admin/utilisateurs");
  }

  const roleLabels: Record<string, string> = {
    freelance: "Freelance",
    client: "Client",
    agence: "Agence",
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-red-600 text-white px-4 py-2 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-lg">visibility</span>
        <span className="text-sm font-semibold">
          Vous visualisez le compte de{" "}
          <strong>{impersonatedUser.name}</strong>{" "}
          ({roleLabels[impersonatedUser.role] ?? impersonatedUser.role})
          {" — "}
          <span className="opacity-80">{impersonatedUser.email}</span>
        </span>
      </div>
      <button
        onClick={handleStop}
        className="flex items-center gap-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold transition-colors"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Retour admin
      </button>
    </div>
  );
}
