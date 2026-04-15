"use client";

import Link from "next/link";
import { useState } from "react";

const plans = [
  {
    name: "Gratuit",
    price: { monthly: 0, annual: 0 },
    priceEur: { monthly: 0, annual: 0 },
    description: "Idéal pour découvrir la plateforme et commencer à apprendre.",
    color: "#5c647a",
    bg: "bg-white",
    badge: null,
    features: [
      { label: "Accès aux formations gratuites", included: true },
      { label: "3 produits achetables par mois", included: true },
      { label: "Téléchargements limités", included: true },
      { label: "Support communauté", included: true },
      { label: "Certifications premium", included: false },
      { label: "Formations illimitées", included: false },
      { label: "Support prioritaire", included: false },
      { label: "Vente de produits", included: false },
      { label: "Analytics avancées", included: false },
      { label: "Commission réduite (8%)", included: false },
    ],
  },
  {
    name: "Pro",
    price: { monthly: 9800, annual: 8820 },
    priceEur: { monthly: 15, annual: 13 },
    description: "Pour les apprenants sérieux et les créateurs qui débutent.",
    color: "#006e2f",
    bg: "bg-[#006e2f]",
    badge: "POPULAIRE",
    features: [
      { label: "Accès aux formations gratuites", included: true },
      { label: "Formations illimitées", included: true },
      { label: "Téléchargements illimités", included: true },
      { label: "Support prioritaire (24h)", included: true },
      { label: "Certifications premium", included: true },
      { label: "Vente jusqu'à 10 produits", included: true },
      { label: "Analytics basiques", included: true },
      { label: "Commission standard (15%)", included: true },
      { label: "Analytics avancées", included: false },
      { label: "Commission réduite (8%)", included: false },
    ],
  },
  {
    name: "Business",
    price: { monthly: 29500, annual: 26550 },
    priceEur: { monthly: 45, annual: 40 },
    description: "Pour les créateurs avancés et les agences de formation.",
    color: "#191c1e",
    bg: "bg-[#191c1e]",
    badge: null,
    features: [
      { label: "Accès aux formations gratuites", included: true },
      { label: "Formations illimitées", included: true },
      { label: "Téléchargements illimités", included: true },
      { label: "Support prioritaire (4h)", included: true },
      { label: "Certifications premium", included: true },
      { label: "Vente de produits illimitée", included: true },
      { label: "Analytics avancées", included: true },
      { label: "Commission réduite (8%)", included: true },
      { label: "Clés API & Webhooks", included: true },
      { label: "Manager de compte dédié", included: true },
    ],
  },
];

const faqs = [
  {
    q: "Puis-je changer de plan à tout moment ?",
    a: "Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment depuis vos paramètres. Le changement prend effet immédiatement, et vous ne payez que la différence au prorata.",
  },
  {
    q: "Comment fonctionne la facturation annuelle ?",
    a: "En choisissant la facturation annuelle, vous économisez 10% par rapport à la facturation mensuelle. Le paiement est effectué en une seule fois pour toute l'année.",
  },
  {
    q: "Quels moyens de paiement sont acceptés ?",
    a: "Nous acceptons Orange Money, Wave, MTN MoMo, les cartes Visa/Mastercard, et les virements bancaires SEPA. D'autres méthodes seront ajoutées prochainement.",
  },
  {
    q: "Y a-t-il une période d'essai gratuite ?",
    a: "Le plan Gratuit est accessible sans limite de temps. Les plans Pro et Business peuvent être testés gratuitement pendant 7 jours sans carte bancaire.",
  },
  {
    q: "Que se passe-t-il si j'annule mon abonnement ?",
    a: "Vous conservez l'accès à votre plan jusqu'à la fin de la période de facturation en cours. Ensuite, vous basculez automatiquement sur le plan Gratuit.",
  },
  {
    q: "La commission sur les ventes est-elle réduite avec le Pro ?",
    a: "Oui. En plan Gratuit, la commission de la plateforme est de 20%. Elle passe à 15% en Pro et à 8% en Business, ce qui augmente significativement vos revenus nets.",
  },
];

function formatFCFA(n: number) {
  return n.toLocaleString("fr-FR");
}

export default function TarifsPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#f7f9fb]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <section className="bg-white border-b border-gray-100 py-16 px-4 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#006e2f] mb-3">
          Plans & Tarifs
        </p>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#191c1e] tracking-tight mb-4">
          Investissez dans votre croissance
        </h1>
        <p className="text-[#5c647a] text-base md:text-lg max-w-2xl mx-auto mb-8">
          Des plans adaptés à chaque étape de votre parcours, du débutant à l&apos;expert.
          Tous les prix sont affichés en FCFA.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center gap-3 bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setAnnual(false)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              !annual ? "bg-white text-[#191c1e] shadow-sm" : "text-[#5c647a]"
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              annual ? "bg-white text-[#191c1e] shadow-sm" : "text-[#5c647a]"
            }`}
          >
            Annuel
            <span className="ml-1.5 text-[9px] font-black text-[#006e2f] bg-green-100 px-1.5 py-0.5 rounded-full">
              -10%
            </span>
          </button>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const isPopular = plan.badge === "POPULAIRE";
            const price = annual ? plan.price.annual : plan.price.monthly;
            const priceEur = annual ? plan.priceEur.annual : plan.priceEur.monthly;

            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl overflow-hidden transition-transform duration-300 hover:-translate-y-1 ${
                  isPopular ? "ring-2 ring-[#006e2f] shadow-xl scale-[1.02]" : "border border-gray-200 shadow-sm"
                }`}
              >
                {plan.badge && (
                  <div className="absolute top-0 left-0 right-0 text-center">
                    <span className="inline-block bg-[#006e2f] text-white text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-b-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div
                  className={`${
                    isPopular ? "bg-[#006e2f] text-white" : i === 2 ? "bg-[#191c1e] text-white" : "bg-white text-[#191c1e]"
                  } p-7 ${plan.badge ? "pt-9" : ""}`}
                >
                  <h3
                    className={`text-xl font-extrabold mb-1 ${
                      isPopular || i === 2 ? "text-white" : "text-[#191c1e]"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-sm mb-6 leading-relaxed ${
                      isPopular || i === 2 ? "text-white/70" : "text-[#5c647a]"
                    }`}
                  >
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    {price === 0 ? (
                      <p
                        className={`text-4xl font-extrabold tracking-tight ${
                          isPopular || i === 2 ? "text-white" : "text-[#191c1e]"
                        }`}
                      >
                        Gratuit
                      </p>
                    ) : (
                      <div>
                        <p
                          className={`text-4xl font-extrabold tracking-tight ${
                            isPopular || i === 2 ? "text-white" : "text-[#191c1e]"
                          }`}
                        >
                          {formatFCFA(price)}{" "}
                          <span className="text-base font-semibold">FCFA</span>
                        </p>
                        <p
                          className={`text-sm ${
                            isPopular || i === 2 ? "text-white/60" : "text-[#5c647a]"
                          }`}
                        >
                          ≈ {priceEur} €/mois
                        </p>
                      </div>
                    )}
                  </div>

                  <Link
                    href={price === 0 ? "/formations/inscription" : "/formations/checkout"}
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                      isPopular
                        ? "bg-white text-[#006e2f] hover:bg-white/90"
                        : i === 2
                        ? "bg-[#006e2f] text-white hover:opacity-90"
                        : "bg-[#006e2f] text-white hover:opacity-90"
                    }`}
                  >
                    {price === 0 ? "Commencer gratuitement" : "Choisir ce plan"}
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                <div className={`p-6 ${isPopular || i === 2 ? "bg-white" : "bg-[#f7f9fb]"}`}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#5c647a] mb-4">
                    Ce qui est inclus
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <span
                          className={`material-symbols-outlined text-[16px] mt-0.5 flex-shrink-0 ${
                            feature.included ? "text-[#006e2f]" : "text-gray-300"
                          }`}
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {feature.included ? "check_circle" : "cancel"}
                        </span>
                        <span
                          className={`text-sm ${
                            feature.included ? "text-[#191c1e]" : "text-gray-400 line-through"
                          }`}
                        >
                          {feature.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature comparison note */}
        <p className="text-center text-xs text-[#5c647a] mt-8">
          Tous les plans incluent le paiement via Mobile Money (Orange Money, Wave, MTN MoMo) et carte bancaire.
          <br />
          Les prix sont HT pour les vendeurs soumis à TVA.
        </p>
      </section>

      {/* Trust badges */}
      <section className="bg-white border-y border-gray-100 py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "shield", label: "Paiement sécurisé", sub: "SSL & 3D Secure" },
            { icon: "verified_user", label: "Garantie 30 jours", sub: "Satisfait ou remboursé" },
            { icon: "support_agent", label: "Support réactif", sub: "Réponse en 24h max" },
            { icon: "language", label: "Disponible partout", sub: "17 pays africains" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center text-center gap-2">
              <span className="material-symbols-outlined text-[#006e2f] text-[32px]">
                {item.icon}
              </span>
              <p className="font-bold text-[#191c1e] text-sm">{item.label}</p>
              <p className="text-xs text-[#5c647a]">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 md:px-8 py-16">
        <div className="text-center mb-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#006e2f] mb-2">FAQ</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#191c1e] tracking-tight">
            Questions fréquentes
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#f7f9fb] transition-colors"
              >
                <span className="font-semibold text-[#191c1e] text-sm pr-4">{faq.q}</span>
                <span
                  className="material-symbols-outlined text-[#5c647a] text-[20px] flex-shrink-0 transition-transform duration-200"
                  style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  expand_more
                </span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 pt-0">
                  <p className="text-sm text-[#5c647a] leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#5c647a] mb-4">
            Vous avez d&apos;autres questions ?
          </p>
          <a
            href="/formations/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#006e2f] text-[#006e2f] font-bold text-sm hover:bg-[#006e2f] hover:text-white transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            Contacter le support
          </a>
        </div>
      </section>
    </div>
  );
}
