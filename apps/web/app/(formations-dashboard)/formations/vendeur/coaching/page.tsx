"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

type MarketingStats = {
  summary: { activeTools: number };
};

export default function CoachingPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? "Instructeur";

  // We use the marketing API to hydrate "mode coach" indicator — coaching will have its own model in V2
  const { data: _m } = useQuery<{ data: MarketingStats | null }>({
    queryKey: ["vendeur-marketing-hub"],
    queryFn: () => fetch("/api/formations/vendeur/marketing").then((r) => r.json()),
    staleTime: 60_000,
  });

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-[#191c1e]">Mon espace Coaching</h1>
          <p className="text-sm text-[#5c647a] mt-0.5">Gérez vos sessions 1:1 et vos demandes de coaching</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
            <span className="material-symbols-outlined text-[14px] text-amber-600">schedule</span>
            <span className="text-xs font-bold text-amber-700">Bientôt disponible</span>
          </div>
          <Link
            href="/formations/vendeur/parametres"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-[#5c647a] hover:bg-gray-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">settings</span>
            Configurer
          </Link>
        </div>
      </div>

      {/* Stats — zeros until the feature is live */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Sessions ce mois", value: "0", icon: "calendar_month", color: "text-[#006e2f]", bg: "bg-[#006e2f]/10" },
          { label: "Revenus coaching", value: "0 FCFA", icon: "payments", color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Note moyenne", value: "—", icon: "star", color: "text-yellow-500", bg: "bg-yellow-50" },
          { label: "Taux d'acceptation", value: "—", icon: "check_circle", color: "text-blue-600", bg: "bg-blue-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <span className={`material-symbols-outlined text-[20px] ${s.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {s.icon}
              </span>
            </div>
            <p className="text-xl font-extrabold text-[#191c1e] leading-tight">{s.value}</p>
            <p className="text-xs text-[#5c647a] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Coming soon card */}
      <div className="bg-gradient-to-br from-[#006e2f]/5 to-emerald-50 border border-[#006e2f]/10 rounded-2xl p-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[32px] text-[#006e2f]" style={{ fontVariationSettings: "'FILL' 1" }}>
            support_agent
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-[#191c1e] mb-2">Coaching 1:1 — En construction</h2>
        <p className="text-sm text-[#5c647a] max-w-xl mx-auto mb-6">
          Bientôt, {userName}, vous pourrez proposer des sessions de coaching individuel, gérer votre agenda, recevoir les demandes et encaisser
          vos honoraires directement depuis Novakou — sans outil tiers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
          {[
            { icon: "event_available", title: "Agenda", desc: "Définissez vos créneaux disponibles" },
            { icon: "chat", title: "Demandes", desc: "Acceptez / refusez les requêtes" },
            { icon: "payments", title: "Paiements", desc: "Encaissez automatiquement à la session" },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-xl border border-[#006e2f]/10 p-4 text-left">
              <span className="material-symbols-outlined text-[20px] text-[#006e2f] mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>
                {f.icon}
              </span>
              <p className="text-xs font-bold text-[#191c1e]">{f.title}</p>
              <p className="text-[10px] text-[#5c647a] mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-[#5c647a] italic">
          En attendant, vos apprenants peuvent vous contacter via les messages depuis vos formations.
        </p>
      </div>
    </div>
  );
}
