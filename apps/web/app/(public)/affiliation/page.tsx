"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    icon: "share",
    title: "Partagez votre lien",
    description:
      "Partagez votre lien unique avec vos amis et collegues",
  },
  {
    icon: "person_add",
    title: "Ils s'inscrivent",
    description:
      "Vos filleuls creent un compte et commencent a utiliser la plateforme",
  },
  {
    icon: "payments",
    title: "Gagnez des commissions",
    description:
      "Recevez une commission sur chaque transaction de vos filleuls",
  },
];

interface Tier {
  name: string;
  icon: string;
  range: string;
  min: number;
  max: number;
  commission: number;
  gradient: string;
  iconBg: string;
  features: string[];
}

const TIERS: Tier[] = [
  {
    name: "Bronze",
    icon: "military_tech",
    range: "1 - 5 filleuls",
    min: 1,
    max: 5,
    commission: 10,
    gradient: "from-amber-700 to-amber-900",
    iconBg: "bg-amber-700/20 text-amber-500",
    features: ["10% de commission", "Badge bronze", "Acces communaute"],
  },
  {
    name: "Silver",
    icon: "workspace_premium",
    range: "6 - 20 filleuls",
    min: 6,
    max: 20,
    commission: 15,
    gradient: "from-slate-400 to-slate-600",
    iconBg: "bg-slate-400/20 text-slate-300",
    features: [
      "15% de commission",
      "Badge argent",
      "Support prioritaire",
      "Bonus mensuel",
    ],
  },
  {
    name: "Gold",
    icon: "emoji_events",
    range: "21 - 50 filleuls",
    min: 21,
    max: 50,
    commission: 20,
    gradient: "from-accent to-yellow-600",
    iconBg: "bg-accent/20 text-accent",
    features: [
      "20% de commission",
      "Badge or",
      "Webinaires VIP",
      "Cashback",
    ],
  },
  {
    name: "Platinum",
    icon: "diamond",
    range: "50+ filleuls",
    min: 51,
    max: Infinity,
    commission: 25,
    gradient: "from-primary to-emerald-400",
    iconBg: "bg-primary/20 text-primary",
    features: [
      "25% de commission",
      "Badge platine",
      "Evenements exclusifs",
      "Manager dedie",
    ],
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Grace au programme, je gagne \u20AC500/mois en plus. C'est un complement de revenu incroyable.",
    name: "Marie K.",
    tier: "Gold",
    earnings: "\u20AC500/mois",
  },
  {
    quote:
      "J'ai recommande FreelanceHigh a mes collegues developpeurs et les commissions tombent chaque mois.",
    name: "Abdoulaye D.",
    tier: "Silver",
    earnings: "\u20AC280/mois",
  },
  {
    quote:
      "Le programme d'affiliation est transparent et fiable. Les paiements sont toujours a l'heure.",
    name: "Sophie L.",
    tier: "Platinum",
    earnings: "\u20AC1 200/mois",
  },
];

const FAQ_ITEMS = [
  {
    question: "Comment fonctionne le programme ?",
    answer:
      "Inscrivez-vous au programme d'affiliation, partagez votre lien unique et gagnez une commission sur chaque transaction generee par vos filleuls. Plus vous parrainez, plus votre taux de commission augmente.",
  },
  {
    question: "Quand suis-je paye ?",
    answer:
      "Les commissions sont versees automatiquement chaque mois, le 15 du mois suivant. Vous pouvez choisir de recevoir vos gains par virement SEPA, PayPal, Wise ou Mobile Money.",
  },
  {
    question: "Y a-t-il un minimum de retrait ?",
    answer:
      "Le minimum de retrait est de \u20AC10. Des que votre solde atteint ce seuil, vous pouvez demander un virement a tout moment ou attendre le versement automatique mensuel.",
  },
  {
    question: "Puis-je parrainer des agences ?",
    answer:
      "Absolument ! Vous pouvez parrainer des freelances, des clients et des agences. Les commissions sur les parrainages d'agences sont particulierement interessantes car leurs volumes de transactions sont plus eleves.",
  },
  {
    question: "Comment suivre mes parrainages ?",
    answer:
      "Vous disposez d'un tableau de bord complet avec le nombre de filleuls, les commissions generees, l'historique des paiements et des statistiques detaillees sur vos performances.",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getTierForReferrals(count: number): Tier {
  return (
    TIERS.find((t) => count >= t.min && count <= t.max) ?? TIERS[0]
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AffiliationPage() {
  const [referrals, setReferrals] = useState(10);
  const [avgRevenue, setAvgRevenue] = useState(150);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const calculatedTier = useMemo(
    () => getTierForReferrals(referrals),
    [referrals],
  );

  const monthlyEarnings = useMemo(
    () => Math.round(referrals * avgRevenue * (calculatedTier.commission / 100)),
    [referrals, avgRevenue, calculatedTier],
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative px-6 lg:px-20 pt-16 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 lg:px-16 py-20 lg:py-28 text-center">
            {/* Decorative blurs */}
            <div className="absolute -top-32 -right-32 size-[500px] bg-primary/20 blur-[180px] rounded-full" />
            <div className="absolute -bottom-32 -left-32 size-[500px] bg-accent/10 blur-[180px] rounded-full" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider border border-accent/30">
                <span className="material-symbols-outlined text-base">auto_awesome</span>
                Programme d&apos;Affiliation
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
                Gagnez de l&apos;argent en recommandant{" "}
                <span className="text-primary">FreelanceHigh</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Rejoignez notre programme d&apos;affiliation et touchez des
                commissions sur chaque transaction de vos filleuls. Simple,
                transparent et sans limite de gains.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Link
                  href="/inscription"
                  className="inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white rounded-2xl px-10 py-5 text-lg font-bold shadow-xl shadow-primary/20 transition-all"
                >
                  <span className="material-symbols-outlined">person_add</span>
                  S&apos;inscrire au programme
                </Link>
                <a
                  href="#comment-ca-marche"
                  className="inline-flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl px-10 py-5 text-lg font-bold transition-all backdrop-blur-sm"
                >
                  En savoir plus
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  HOW IT WORKS                                                */}
      {/* ============================================================ */}
      <section id="comment-ca-marche" className="py-24 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Comment ca <span className="text-primary">marche</span> ?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Trois etapes simples pour commencer a gagner des commissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="relative bg-white dark:bg-neutral-dark p-10 rounded-3xl border border-slate-200 dark:border-border-dark text-center space-y-6 hover:shadow-xl transition-shadow"
              >
                {/* Step number */}
                <span className="absolute top-6 right-6 text-5xl font-extrabold text-slate-100 dark:text-slate-800 select-none">
                  {i + 1}
                </span>

                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                  <span className="material-symbols-outlined text-3xl">
                    {step.icon}
                  </span>
                </div>

                <h4 className="text-xl font-bold">{step.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TIERS                                                       */}
      {/* ============================================================ */}
      <section className="py-24 px-6 lg:px-20 bg-primary/5 dark:bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Niveaux de <span className="text-accent">commission</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Plus vous parrainez, plus votre taux de commission augmente. Grimpez les echelons et maximisez vos gains.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className="bg-white dark:bg-neutral-dark rounded-3xl border border-slate-200 dark:border-border-dark overflow-hidden hover:shadow-xl transition-shadow group"
              >
                {/* Gradient header */}
                <div
                  className={cn(
                    "bg-gradient-to-br p-6 flex items-center gap-4",
                    tier.gradient,
                  )}
                >
                  <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-3xl">
                      {tier.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-extrabold text-white">
                      {tier.name}
                    </h4>
                    <p className="text-white/70 text-sm font-semibold">
                      {tier.range}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6">
                  <div className="text-center">
                    <span className="text-4xl font-extrabold text-primary">
                      {tier.commission}%
                    </span>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                      de commission
                    </p>
                  </div>

                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300"
                      >
                        <span className="material-symbols-outlined text-primary text-lg">
                          check_circle
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/inscription"
                    className="block text-center text-sm font-bold text-primary hover:text-primary/80 transition-colors pt-2"
                  >
                    En savoir plus &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  EARNINGS CALCULATOR                                         */}
      {/* ============================================================ */}
      <section className="py-24 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Simulez vos <span className="text-primary">gains</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Deplacez les curseurs pour estimer vos revenus mensuels d&apos;affiliation.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white dark:bg-neutral-dark rounded-3xl border border-slate-200 dark:border-border-dark p-8 lg:p-12 shadow-xl space-y-10">
            {/* Slider: Nombre de filleuls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-bold text-lg">
                  Nombre de filleuls
                </label>
                <span className="text-2xl font-extrabold text-primary">
                  {referrals}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={referrals}
                onChange={(e) => setReferrals(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700 accent-primary"
              />
              <div className="flex justify-between text-xs text-slate-500 font-semibold">
                <span>1</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>

            {/* Slider: Revenu moyen par filleul */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-bold text-lg">
                  Revenu moyen par filleul / mois
                </label>
                <span className="text-2xl font-extrabold text-primary">
                  {avgRevenue}&nbsp;&euro;
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={500}
                step={10}
                value={avgRevenue}
                onChange={(e) => setAvgRevenue(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700 accent-primary"
              />
              <div className="flex justify-between text-xs text-slate-500 font-semibold">
                <span>50 &euro;</span>
                <span>150 &euro;</span>
                <span>250 &euro;</span>
                <span>350 &euro;</span>
                <span>500 &euro;</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 dark:border-border-dark" />

            {/* Result */}
            <div className="text-center space-y-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                Vos gains mensuels estimes
              </p>

              <div className="relative inline-block">
                <p
                  className="text-6xl sm:text-7xl font-extrabold text-primary transition-all duration-300"
                  key={monthlyEarnings}
                >
                  {monthlyEarnings.toLocaleString("fr-FR")}&nbsp;&euro;
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 flex-wrap">
                <span
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold",
                    calculatedTier.iconBg,
                  )}
                >
                  <span className="material-symbols-outlined text-base">
                    {calculatedTier.icon}
                  </span>
                  Niveau {calculatedTier.name}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
                  {calculatedTier.commission}% de commission
                </span>
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-md mx-auto leading-relaxed pt-2">
                Estimation basee sur {referrals} filleuls avec un revenu moyen
                de {avgRevenue}&nbsp;&euro;/mois et un taux de commission de{" "}
                {calculatedTier.commission}%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TESTIMONIALS                                                */}
      {/* ============================================================ */}
      <section className="py-24 px-6 lg:px-20 bg-primary/5 dark:bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Ils parrainent et <span className="text-primary">gagnent</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Decouvrez les temoignages de nos affilies les plus actifs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-white dark:bg-neutral-dark p-10 rounded-3xl border border-slate-200 dark:border-border-dark shadow-sm hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-accent text-2xl">
                    format_quote
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-8 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg">{t.name}</p>
                    <p className="text-sm text-slate-500">Affilie {t.tier}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold">
                    <span className="material-symbols-outlined text-base">
                      payments
                    </span>
                    {t.earnings}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FAQ                                                         */}
      {/* ============================================================ */}
      <section className="py-24 px-6 lg:px-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Questions <span className="text-primary">frequentes</span>
            </h2>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-neutral-dark rounded-2xl border border-slate-200 dark:border-border-dark overflow-hidden transition-shadow hover:shadow-md"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-bold text-lg pr-4">
                    {item.question}
                  </span>
                  <span
                    className={cn(
                      "material-symbols-outlined text-primary transition-transform flex-shrink-0",
                      openFaq === i && "rotate-180",
                    )}
                  >
                    expand_more
                  </span>
                </button>

                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    openFaq === i ? "max-h-60 pb-6" : "max-h-0",
                  )}
                >
                  <p className="px-6 text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA BOTTOM                                                  */}
      {/* ============================================================ */}
      <section className="px-6 lg:px-20 pb-32">
        <div className="max-w-7xl mx-auto bg-slate-900 border border-primary/30 rounded-[3rem] p-12 lg:p-24 text-center space-y-10 relative overflow-hidden shadow-2xl shadow-primary/10">
          {/* Decorative blurs */}
          <div className="absolute -top-24 -right-24 size-96 bg-primary/20 blur-[150px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 size-96 bg-accent/10 blur-[150px] rounded-full" />

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white max-w-4xl mx-auto leading-[1.1] relative z-10">
            Rejoignez le programme{" "}
            <span className="text-primary">maintenant</span>
          </h2>

          <p className="text-slate-400 text-xl max-w-2xl mx-auto relative z-10 leading-relaxed">
            Commencez a gagner des commissions des aujourd&apos;hui. Inscription
            gratuite, paiements mensuels, aucune limite de gains.
          </p>

          <div className="relative z-10">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-primary/30"
            >
              <span className="material-symbols-outlined">person_add</span>
              S&apos;inscrire au programme
            </Link>
          </div>

          <div className="pt-4 relative z-10">
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center gap-4">
              <span className="w-8 h-px bg-slate-800" />
              Gratuit &middot; Sans engagement &middot; Paiements mensuels
              <span className="w-8 h-px bg-slate-800" />
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
