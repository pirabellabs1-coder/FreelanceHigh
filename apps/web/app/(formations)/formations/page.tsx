import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RevenueSimulator } from "@/components/formations/RevenueSimulator";
import { BestSellers } from "@/components/formations/BestSellers";

export const metadata: Metadata = {
  title: "FreelanceHigh | Le freelance parfait pour votre projet, à portée de clic",
  description:
    "Plus de 10 000 freelances vérifiés en Afrique francophone et internationale. Formations, services, mentoring — tout en un.",
};

const FREELANCER_AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCGX9twRtRgGltcxTW9EJqsOv96cSwnoA52sgPvi8MP01qX3Op1EHt2i0VBzfz-b6mSWa7jF_Tx7d3IDD85s0coZmYh7gfA7FB1N11CoeKDxxswhjkbzIvMehRzugu_lVYtx6Kqvl2lTR5vy15PIDDO7aQDWdNKgxQH_uEL7wHsK7GTFlqregV6cfryXRuDPzfPYQh4c-Af_Wv6qIGmS6JhUTKx7dsEmav4iWsoRfZhoNwe-uafQJCMFkqq0iR7RbD4IR8YIEA1JjhG",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD9Rh0ecjM8nGvWfG_C0KbaGYWrSmu8xmHRjCO70WBZ0-5sZv2Q2D-Fabrnx0JT4aLiEkSG11YZCkMwiEefpWTFRezj3cUHsuIsBJvS1JtkK_7oFybZDfAHwmDm-x3XW245JemBnQqaJLvjzqZYEmm5vcb8svccewMahXmGTu_kVEEV9BW2z0WeqRDmHbfwA8bpGilxMYyCmloYq4f1ntMSEdBg3G7z2jFkbA8eyRqogewLAHfdnyJW3V2nvgIKHN4cLsu4rdNAJIec",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCWvzWuZ26p82Ka65aS2FRWuFajMaeVjZFTmt2eKbeFM-76x_bYcQq7VTJJPuV5cz-ioD79i1dCmXQ3qMqU-4aLD4VUgTHd-i9NV5iPOaHec279DuNt-RDWnmVDNA8g3upiBszScHtBOVjg7zbx_pugaYRw1GK0SpNDOaVQzM_XwYrvSvAxx8P_uLrdUAUw3_GBisqCKKjiv2-RVRePMSUtMDEUgzmPQxAbgo6mJ329ft5SkMx0mv_meMJKtwORR4npogpFuRKhme5E",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBJMsH8gcPViMT9m87hdBDPJ0K2dr0Ejo7x6C6_-44qLZE4f_hs8uVzon3y-hKjaDSCuzD_3g8y2FvrM-tjauDVz07lchuSauJvoIlkfaMGgilLdMizmPaUL_Nu6BGxFMBaRMEV03DEJiS07MUesGcE5mP9V7tVjnBOPmld1708Dp_lZ5uM1YhuMbb7Pl9TKktgdameYvNndnlLt5kL-WNxrCVBDHMIJTJaHGews4c1lq1JkcMuQ_zRPsM2QM1L7QYb2cRPvhHqROQZ",
];

const CATEGORIES = [
  { label: "Graphisme & Design", icon: "palette", count: "1 240 services" },
  { label: "Programmation & Tech", icon: "code", count: "987 services" },
  { label: "Marketing digital", icon: "campaign", count: "856 services" },
  { label: "Vidéo & Animation", icon: "videocam", count: "612 services" },
  { label: "Rédaction & Traduction", icon: "edit", count: "734 services" },
  { label: "Musique & Audio", icon: "headphones", count: "289 services" },
  { label: "Business", icon: "business_center", count: "445 services" },
  { label: "Services d'IA", icon: "psychology", count: "367 services" },
  { label: "Consulting", icon: "support_agent", count: "234 services" },
  { label: "Data", icon: "analytics", count: "198 services" },
  { label: "Photographie", icon: "photo_camera", count: "321 services" },
  { label: "Finance", icon: "account_balance", count: "176 services" },
];

const HOW_IT_WORKS = [
  {
    icon: "search",
    title: "Trouvez le service",
    desc: "Parcourez 10 000+ services dans toutes les catégories.",
  },
  {
    icon: "chat",
    title: "Discutez avec le freelance",
    desc: "Posez vos questions avant de commander.",
  },
  {
    icon: "shopping_cart",
    title: "Passez commande",
    desc: "Paiement sécurisé en escrow jusqu'à validation.",
  },
  {
    icon: "task_alt",
    title: "Recevez & validez",
    desc: "Validez le livrable, paiement libéré au freelance.",
  },
];

const TRUST_LOGOS = [
  "Orange Sénégal",
  "Wave",
  "MTN",
  "Stripe",
  "Acme Corp",
  "TechFlow",
  "BNP Paribas",
  "Vercel",
];

const CATEGORY_SHOWCASE = [
  {
    title: "Marketing digital",
    avail: "1 240 freelances dispo",
    chips: ["SEO", "Google Ads", "Email marketing"],
    sponsoredTitle: "Stratégie SEO complète + audit technique",
    sponsoredPrice: "À partir de 22 990 FCFA",
  },
  {
    title: "Design & Branding",
    avail: "987 freelances dispo",
    chips: ["Logo", "Identité visuelle", "UI/UX"],
    sponsoredTitle: "Logo professionnel + charte graphique",
    sponsoredPrice: "À partir de 29 990 FCFA",
  },
  {
    title: "Programmation & Tech",
    avail: "1 540 freelances dispo",
    chips: ["WordPress", "Shopify", "React/Next.js"],
    sponsoredTitle: "Site web vitrine WordPress sur-mesure",
    sponsoredPrice: "À partir de 89 990 FCFA",
  },
];

const TESTIMONIALS = [
  {
    name: "Aïssatou D.",
    company: "Boutique en ligne · Dakar",
    initial: "AD",
    text: "FreelanceHigh m'a permis de trouver un dev WordPress en 24h, paiement sécurisé, livré en 3 jours. Génial.",
  },
  {
    name: "Marc R.",
    company: "Studio créatif · Lyon",
    initial: "MR",
    text: "J'ai testé plusieurs plateformes : ici c'est la qualité africaine + l'escrow Stripe. Le rapport qualité/prix est imbattable.",
  },
  {
    name: "Jean-Pierre N.",
    company: "Agence digitale · Abidjan",
    initial: "JN",
    text: "Notre équipe sous-traite régulièrement sur FreelanceHigh. Mobile Money, devises locales, freelances vérifiés — tout est pensé pour nous.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Comment commencer en tant que freelance ?",
    a: "Inscription gratuite en 2 minutes. Créez votre profil, publiez vos services, et recevez vos premières commandes avec paiement sécurisé.",
  },
  {
    q: "Quels sont les frais de plateforme ?",
    a: "Commission de 8 à 20% selon votre plan (Gratuit, Pro, Business, Agence). Aucun frais caché, aucun abonnement obligatoire.",
  },
  {
    q: "Comment sont protégés les paiements ?",
    a: "Tous les paiements transitent par un séquestre (escrow). Les fonds sont libérés au freelance uniquement après validation du livrable.",
  },
  {
    q: "Puis-je travailler avec mon propre domaine ?",
    a: "Oui, les plans Pro et Business permettent de connecter votre propre nom de domaine pour votre boutique freelance.",
  },
  {
    q: "Comment résoudre un litige ?",
    a: "Une médiation est ouverte automatiquement si vous le demandez. Notre équipe admin tranche sous 72h avec accès aux preuves des deux parties.",
  },
];

export default async function FormationsPage() {
  return (
    <>
      {/* ── 1. HERO HYBRIDE BLANC COMPLEXE ─────────────────────────── */}
      <section className="relative overflow-hidden bg-white">
        {/* Décor : blobs subtils */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-24 w-[480px] h-[480px] bg-fh-100/40 rounded-full blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-24 w-[420px] h-[420px] bg-fh-50/60 rounded-full blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-10 md:pt-16 pb-12 md:pb-20 min-h-[640px] flex flex-col md:flex-row items-center gap-10 md:gap-12">
          {/* Colonne gauche */}
          <div className="flex-1 w-full space-y-5 md:space-y-6 text-center md:text-left">
            <span className="inline-flex items-center gap-2 bg-fh-50 text-fh-700 px-3 py-1 rounded-full text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              Trouvez votre freelance en moins de 5 min
            </span>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Le freelance parfait pour{" "}
              <span className="text-fh-600">votre projet</span>, à portée de clic
            </h1>

            <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Plus de 10 000 freelances vérifiés en Afrique francophone et internationale.
              Formations, services, mentoring — tout en un.
            </p>

            {/* Search bar proéminente */}
            <form
              action="/formations/explorer"
              method="get"
              className="bg-white border-2 border-gray-200 hover:border-fh-300 focus-within:border-fh-500 rounded-xl shadow-lg overflow-hidden flex items-center transition-colors max-w-2xl mx-auto md:mx-0"
            >
              <span className="material-symbols-outlined text-gray-400 pl-5">search</span>
              <input
                type="text"
                name="q"
                placeholder="Que recherchez-vous ? Site web, logo, formation SEO..."
                className="flex-1 px-3 py-4 text-base text-gray-900 outline-none placeholder-gray-400 bg-transparent"
                aria-label="Recherche de services"
              />
              <button
                type="submit"
                className="bg-fh-600 hover:bg-fh-700 text-white px-5 md:px-6 py-4 font-semibold flex items-center gap-2 transition-colors"
              >
                <span className="hidden sm:inline">Rechercher</span>
                <span className="material-symbols-outlined text-[20px] sm:hidden">arrow_forward</span>
              </button>
            </form>

            {/* Suggestions tags */}
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
              <span className="text-xs text-gray-500 font-medium">Populaire :</span>
              {["Site web WordPress", "Logo & Branding", "Vidéo promo", "Rédaction SEO"].map(
                (tag) => (
                  <Link
                    key={tag}
                    href={`/formations/explorer?q=${encodeURIComponent(tag)}`}
                    className="inline-block bg-white border border-gray-200 hover:border-fh-400 hover:bg-fh-50 text-gray-700 text-xs px-3 py-1.5 rounded-full transition-colors"
                  >
                    {tag}
                  </Link>
                ),
              )}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-4 justify-center md:justify-start">
              <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                <span className="material-symbols-outlined text-fh-600 text-[20px]">
                  verified_user
                </span>
                10 000+ freelances vérifiés
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                <span className="material-symbols-outlined text-fh-600 text-[20px]">payments</span>
                Paiement sécurisé
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                <span
                  className="material-symbols-outlined text-fh-600 text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                4.8/5 sur 50 000 avis
              </div>
            </div>
          </div>

          {/* Colonne droite — photos freelances flottantes (desktop only) */}
          <div className="hidden md:block flex-1 w-full">
            <div className="relative h-[480px] w-full">
              {/* Blob décoratif */}
              <div
                aria-hidden
                className="absolute inset-12 bg-fh-100 rounded-full blur-3xl -z-10"
              />

              {/* Photo 1 — top-left */}
              <div className="absolute top-0 left-12 w-32 h-32 rounded-full ring-4 ring-white shadow-xl overflow-hidden">
                <Image
                  src={FREELANCER_AVATARS[0]}
                  alt="Freelance Top Rated"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  unoptimized
                />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-fh-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow">
                  ✓ Top Rated
                </span>
              </div>

              {/* Photo 2 — top-right */}
              <div className="absolute top-32 right-0 w-40 h-40 rounded-full ring-4 ring-white shadow-2xl overflow-hidden">
                <Image
                  src={FREELANCER_AVATARS[1]}
                  alt="Freelance vérifiée"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>

              {/* Photo 3 — bottom-left */}
              <div className="absolute bottom-16 left-0 w-36 h-36 rounded-full ring-4 ring-white shadow-xl overflow-hidden">
                <Image
                  src={FREELANCER_AVATARS[2]}
                  alt="Freelance vidéaste"
                  width={144}
                  height={144}
                  className="w-full h-full object-cover"
                  unoptimized
                />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white text-fh-700 border border-fh-200 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow">
                  Vidéo Promo · 24h
                </span>
              </div>

              {/* Photo 4 — bottom-right */}
              <div className="absolute bottom-0 right-20 w-28 h-28 rounded-full ring-4 ring-white shadow-xl overflow-hidden">
                <Image
                  src={FREELANCER_AVATARS[3]}
                  alt="Freelance"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>

              {/* Card flottante centre */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl border border-gray-100 px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-fh-50 flex items-center justify-center flex-shrink-0">
                  <span
                    className="material-symbols-outlined text-amber-400 text-[22px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">5.0 (1 240 avis)</div>
                  <div className="text-xs text-gray-500">Awa K. · Designer UI/UX</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. CATÉGORIES POPULAIRES ─────────────────────────────── */}
      <section className="py-12 md:py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-6 md:mb-8 flex-wrap gap-3">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Catégories populaires
          </h2>
          <Link
            href="/formations/explorer"
            className="text-sm text-fh-600 hover:underline font-semibold flex items-center gap-1"
          >
            Voir toutes les catégories
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={`/formations/explorer?cat=${encodeURIComponent(cat.label)}`}
              className="bg-white border border-gray-200 hover:border-fh-300 hover:shadow-md rounded-xl p-4 flex flex-col items-center gap-2 text-center transition-all cursor-pointer group"
            >
              <span className="material-symbols-outlined text-fh-600 text-[28px] group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <span className="text-sm font-semibold text-gray-900 leading-tight">
                {cat.label}
              </span>
              <span className="text-xs text-gray-500">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3. SERVICES POPULAIRES ────────────────────────────────── */}
      <section className="bg-stone-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 md:mb-10">
            <div className="space-y-1.5">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
                Services populaires
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                Les services les plus commandés cette semaine.
              </p>
            </div>
            <Link
              href="/formations/explorer"
              className="text-fh-600 font-semibold flex items-center gap-2 group text-sm hover:text-fh-700 transition-colors"
            >
              Explorer tout le catalogue
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-[18px]">
                arrow_forward
              </span>
            </Link>
          </div>

          <BestSellers />
        </div>
      </section>

      {/* ── 4. COMMENT ÇA MARCHE ──────────────────────────────────── */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Comment ça marche en 4 étapes
          </h2>
          <p className="text-sm md:text-base text-gray-600 mt-3 max-w-2xl mx-auto">
            De la recherche à la livraison, FreelanceHigh sécurise chaque étape de votre
            collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((step, i) => (
            <div
              key={step.title}
              className="relative bg-white border border-gray-200 rounded-xl p-6 hover:border-fh-300 hover:shadow-sm transition-all"
            >
              <div className="text-4xl font-extrabold text-fh-600/20 leading-none mb-3">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="bg-fh-50 w-12 h-12 rounded-lg flex items-center justify-center text-fh-600 mb-4">
                <span className="material-symbols-outlined text-[24px]">{step.icon}</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. ILS NOUS FONT CONFIANCE ────────────────────────────── */}
      <section className="py-10 md:py-14 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-6">
            Plus de 200 entreprises nous font confiance
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 md:gap-x-12 gap-y-4">
            {TRUST_LOGOS.map((logo) => (
              <span
                key={logo}
                className="text-gray-400 text-xl font-bold tracking-wide opacity-70 hover:opacity-100 transition-opacity"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. NOS FREELANCES PAR CATÉGORIE ──────────────────────── */}
      <section className="py-12 md:py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Nos freelances par catégorie
            </h2>
            <p className="text-sm md:text-base text-gray-600 mt-3 max-w-2xl mx-auto">
              Découvrez les talents disponibles dans les domaines les plus demandés.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CATEGORY_SHOWCASE.map((cat, idx) => (
              <div
                key={cat.title}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {FREELANCER_AVATARS.slice(0, 3).map((src, i) => (
                      <Image
                        key={i}
                        src={src}
                        alt={`Freelance ${i + 1}`}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                        unoptimized
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{cat.avail}</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900">{cat.title}</h3>

                <div className="flex flex-wrap gap-2">
                  {cat.chips.map((chip) => (
                    <span
                      key={chip}
                      className="inline-block bg-fh-50 text-fh-700 text-xs font-semibold px-2.5 py-1 rounded-full"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/formations/explorer?cat=${encodeURIComponent(cat.title)}`}
                  className="mt-auto bg-stone-50 border border-gray-200 rounded-lg p-3 hover:border-fh-300 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={FREELANCER_AVATARS[idx % FREELANCER_AVATARS.length]}
                      alt="Service sponsorisé"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      unoptimized
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-900 line-clamp-1 group-hover:text-fh-600 transition-colors">
                        {cat.sponsoredTitle}
                      </div>
                      <div className="text-xs text-fh-600 font-bold mt-0.5">
                        {cat.sponsoredPrice}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. TÉMOIGNAGES CLIENTS ────────────────────────────────── */}
      <section className="py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Ils ont trouvé leur freelance idéal
            </h2>
            <p className="text-sm md:text-base text-gray-600 mt-3 max-w-2xl mx-auto">
              Des témoignages authentiques de clients satisfaits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[18px] text-amber-400"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-fh-100 text-fh-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. PROGRAMME RÉCOMPENSES VENDEURS ─────────────────────── */}
      <RevenueSimulator />

      {/* ── 9. FAQ ────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Questions fréquentes
            </h2>
            <p className="text-sm md:text-base text-gray-600 mt-3">
              Tout ce que vous devez savoir avant de démarrer.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.q}
                className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-fh-300 transition-colors"
              >
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <h3 className="font-semibold text-sm md:text-base text-gray-900 pr-4">
                    {item.q}
                  </h3>
                  <span className="material-symbols-outlined text-fh-600 flex-shrink-0 text-[22px] group-open:rotate-45 transition-transform">
                    add
                  </span>
                </summary>
                <p className="text-gray-600 text-sm leading-relaxed mt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. CTA FINAL ─────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-fh-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Prêt à transformer votre activité ?
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez 10 000+ freelances qui vendent déjà sur FreelanceHigh.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/formations/inscription?role=vendeur"
              className="bg-fh-600 hover:bg-fh-700 text-white px-6 py-3 rounded-lg font-bold transition-colors inline-flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
              Lancer ma boutique
            </Link>
            <Link
              href="/formations/explorer"
              className="bg-white text-gray-900 border border-gray-200 hover:border-fh-300 px-6 py-3 rounded-lg font-bold transition-colors inline-flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">explore</span>
              Explorer le catalogue
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
