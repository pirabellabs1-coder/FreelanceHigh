"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCurrencyStore } from "@/store/currency";
import { cn } from "@/lib/utils";
import {
  PLAN_RULES,
  PLAN_ORDER,
  PLAN_FEATURES,
  getCommissionLabel,
  formatLimit,
  type PlanName,
} from "@/lib/plans";

const PLAN_COLORS: Record<PlanName, string> = {
  DECOUVERTE: "border-slate-600",
  ASCENSION: "border-amber-500",
  SOMMET: "border-primary",
  EMPIRE: "border-emerald-500",
};

const PLAN_POPULAR: PlanName = "SOMMET";

const COMPARISON_ROWS = [
  { label: "Services actifs", key: "serviceLimit" as const },
  { label: "Candidatures/mois", key: "applicationLimit" as const },
  { label: "Boosts/mois", key: "boostLimit" as const },
  { label: "Commission", key: "commission" as const },
  { label: "Certification IA", key: "certificationLimit" as const },
  { label: "Scénarios auto", key: "scenarioLimit" as const },
  { label: "Outils productivité", key: "productiviteAccess" as const },
  { label: "Membres équipe", key: "teamLimit" as const },
  { label: "CRM clients", key: "crmAccess" as const },
  { label: "Cloud partagé", key: "cloudStorageGB" as const },
  { label: "Clés API", key: "apiAccess" as const },
  { label: "Support", key: "supportLevel" as const },
];

const SUPPORT_LABELS: Record<string, string> = {
  email: "Email",
  prioritaire: "Prioritaire",
  dedie: "Dédié",
  vip: "VIP dédié",
};

function getCellValue(plan: PlanName, key: string): string {
  const rules = PLAN_RULES[plan];
  switch (key) {
    case "serviceLimit":
    case "applicationLimit":
    case "boostLimit":
    case "scenarioLimit":
    case "certificationLimit":
      return formatLimit(rules[key as keyof typeof rules] as number);
    case "commission":
      return getCommissionLabel(plan);
    case "productiviteAccess":
    case "crmAccess":
    case "apiAccess":
      return (rules[key as keyof typeof rules] as boolean) ? "✓" : "—";
    case "teamLimit": {
      const val = rules.teamLimit;
      return val > 0 ? `${val} max` : "—";
    }
    case "cloudStorageGB": {
      const val = rules.cloudStorageGB;
      return val > 0 ? `${val} GB` : "—";
    }
    case "supportLevel":
      return SUPPORT_LABELS[rules.supportLevel] || rules.supportLevel;
    default:
      return "—";
  }
}

export default function TarifsPage() {
  const t = useTranslations("pricing");
  const [annual, setAnnual] = useState(false);
  const { format } = useCurrencyStore();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const FAQ = [
    {
      q: "Puis-je changer de plan à tout moment ?",
      a: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Le changement prend effet immédiatement, avec un prorata sur la facturation.",
    },
    {
      q: "Y a-t-il un engagement minimum ?",
      a: "Non, tous nos plans sont sans engagement. Vous pouvez annuler à tout moment. L'abonnement annuel offre 25% de réduction.",
    },
    {
      q: "Comment fonctionne la commission ?",
      a: "La commission est prélevée automatiquement sur chaque vente réussie. Découverte : 12%, Ascension : 5%, Sommet : 1€ fixe par vente, Empire : 0% — vous gardez tout !",
    },
    {
      q: "Quelles méthodes de paiement acceptez-vous ?",
      a: "Carte bancaire (Visa, Mastercard), Orange Money, Wave, MTN Mobile Money, PayPal et virement SEPA. Les méthodes disponibles dépendent de votre pays.",
    },
    {
      q: "Le plan Empire inclut-il la gestion d'équipe ?",
      a: "Oui ! Empire est conçu pour les freelances premium ET les agences. Il inclut la gestion de 25 membres, un CRM clients, 100 GB de cloud partagé, et 0% de commission.",
    },
    {
      q: "Quelle est la différence avec Fiverr ou Upwork ?",
      a: "Fiverr prend 20% de commission sur chaque vente. Upwork prend 10-15%. Chez FreelanceHigh, dès le plan gratuit vous ne payez que 12%. Et avec Empire, c'est 0%. De plus, nous supportons Orange Money et Wave nativement.",
    },
  ];

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Choisissez le plan qui correspond à vos ambitions. Évoluez à votre rythme.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={cn("text-sm font-semibold", !annual ? "text-white" : "text-slate-500")}>
              Mensuel
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={cn("w-14 h-7 rounded-full transition-colors relative", annual ? "bg-primary" : "bg-slate-600")}
            >
              <div className={cn("w-5 h-5 rounded-full bg-white absolute top-1 transition-all", annual ? "left-8" : "left-1")} />
            </button>
            <span className={cn("text-sm font-semibold", annual ? "text-white" : "text-slate-500")}>
              Annuel <span className="text-primary text-xs font-bold ml-1">-25%</span>
            </span>
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14 sm:mb-20">
          {PLAN_ORDER.map((planKey) => {
            const rules = PLAN_RULES[planKey];
            const features = PLAN_FEATURES[planKey];
            const isPopular = planKey === PLAN_POPULAR;
            const color = PLAN_COLORS[planKey];
            const price = annual ? rules.priceAnnual : rules.priceMonthly;
            const commLabel = getCommissionLabel(planKey);

            return (
              <div
                key={planKey}
                className={cn(
                  "relative bg-neutral-dark rounded-2xl border-2 p-5 sm:p-6 flex flex-col",
                  isPopular && "mt-4 md:mt-0",
                  color,
                  isPopular && "ring-2 ring-primary/30 md:scale-[1.02]"
                )}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                    Populaire
                  </div>
                )}

                <h3 className="text-xl font-bold text-white mb-1">{rules.name}</h3>
                <p className="text-xs text-slate-500 mb-4">
                  {planKey === "DECOUVERTE" && "Pour commencer"}
                  {planKey === "ASCENSION" && "Commission divisée par 2"}
                  {planKey === "SOMMET" && "1€ fixe, peu importe le montant"}
                  {planKey === "EMPIRE" && "0% commission + équipe"}
                </p>

                {/* Price */}
                <div className="mb-2">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    {rules.priceMonthly === 0 ? "Gratuit" : format(annual ? Math.round(price / 12 * 100) / 100 : price)}
                  </span>
                  {rules.priceMonthly > 0 && (
                    <span className="text-slate-500 text-sm">/mois</span>
                  )}
                </div>
                {annual && rules.priceMonthly > 0 && (
                  <p className="text-xs text-slate-500 mb-4">
                    {format(price)}/an — Économisez {format(rules.priceMonthly * 12 - rules.priceAnnual)}/an
                  </p>
                )}
                {!annual && rules.priceMonthly > 0 && (
                  <p className="text-xs text-slate-500 mb-4">&nbsp;</p>
                )}
                {rules.priceMonthly === 0 && (
                  <p className="text-xs text-slate-500 mb-4">Pour toujours</p>
                )}

                {/* Commission highlight */}
                <div className={cn(
                  "text-center py-2 px-3 rounded-lg mb-6",
                  planKey === "EMPIRE" ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-primary/10 border border-primary/30"
                )}>
                  <span className={cn(
                    "text-sm font-bold",
                    planKey === "EMPIRE" ? "text-emerald-400" : "text-primary"
                  )}>
                    Commission : {commLabel}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 flex-1 mb-6">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="material-symbols-outlined text-primary text-sm mt-0.5 shrink-0">check</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={rules.priceMonthly === 0 ? "/inscription" : "/dashboard/abonnement"}
                  className={cn(
                    "w-full py-3 rounded-xl text-sm font-bold transition-colors text-center block",
                    isPopular
                      ? "bg-primary text-white hover:bg-primary/90"
                      : planKey === "EMPIRE"
                        ? "bg-emerald-600 text-white hover:bg-emerald-500"
                        : "bg-border-dark text-white hover:bg-border-dark/80"
                  )}
                >
                  {rules.priceMonthly === 0 ? "Commencer gratuitement" : `Choisir ${rules.name}`}
                </a>
              </div>
            );
          })}
        </div>

        {/* Comparison table */}
        <div className="mb-14 sm:mb-20">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-8">Comparaison complète</h2>
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-border-dark">
                  <th className="text-left text-sm font-semibold text-slate-400 py-4 px-4 w-48">Fonctionnalité</th>
                  {PLAN_ORDER.map((planKey) => (
                    <th key={planKey} className={cn("text-center text-sm font-bold py-4 px-4", planKey === PLAN_POPULAR ? "text-primary" : "text-white")}>
                      {PLAN_RULES[planKey].name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price row */}
                <tr className="border-b border-border-dark/50">
                  <td className="text-sm text-slate-400 py-3 px-4 font-semibold">Prix/mois</td>
                  {PLAN_ORDER.map((planKey) => (
                    <td key={planKey} className="text-center text-sm text-white py-3 px-4 font-bold">
                      {PLAN_RULES[planKey].priceMonthly === 0 ? "Gratuit" : `${PLAN_RULES[planKey].priceMonthly}€`}
                    </td>
                  ))}
                </tr>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.key} className="border-b border-border-dark/50">
                    <td className="text-sm text-slate-400 py-3 px-4">{row.label}</td>
                    {PLAN_ORDER.map((planKey) => {
                      const val = getCellValue(planKey, row.key);
                      return (
                        <td key={planKey} className={cn(
                          "text-center text-sm py-3 px-4",
                          val === "—" ? "text-slate-600" : val === "✓" ? "text-primary font-bold" : "text-slate-300"
                        )}>
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto w-full">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-8">Questions fréquentes</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left gap-3"
                >
                  <span className="font-semibold text-white text-sm leading-snug">{item.q}</span>
                  <span className="material-symbols-outlined text-slate-400 shrink-0">
                    {openFaq === i ? "expand_less" : "expand_more"}
                  </span>
                </button>
                {openFaq === i && (
                  <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-slate-400 leading-relaxed">{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
