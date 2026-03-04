import type { Metadata } from "next";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsBar } from "@/components/landing/StatsBar";
import { CategoriesSection } from "@/components/landing/CategoriesSection";
import { PopularServicesSection } from "@/components/landing/PopularServicesSection";
import { TopFreelancesSection } from "@/components/landing/TopFreelancesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { CtaSection } from "@/components/landing/CtaSection";

export const metadata: Metadata = {
  title: "FreelanceHigh — La plateforme freelance qui élève votre carrière",
  description:
    "Trouvez les meilleurs freelances pour vos projets. Design, développement, marketing et plus. Paiement sécurisé, satisfaction garantie.",
  openGraph: {
    title: "FreelanceHigh — La plateforme freelance qui élève votre carrière",
    description:
      "Trouvez les meilleurs freelances pour vos projets. Paiement sécurisé, satisfaction garantie.",
    url: "https://freelancehigh.com",
    siteName: "FreelanceHigh",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FreelanceHigh",
    description:
      "La plateforme freelance qui élève votre carrière au plus haut niveau.",
  },
  alternates: {
    canonical: "https://freelancehigh.com",
  },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "FreelanceHigh",
      url: "https://freelancehigh.com",
      description:
        "Plateforme freelance nouvelle génération. Trouvez les meilleurs experts pour vos projets avec un paiement 100% sécurisé.",
      foundingDate: "2026",
      founder: {
        "@type": "Person",
        name: "Lissanon Gildas",
      },
      sameAs: [],
    }),
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <StatsBar />
      <CategoriesSection />
      <PopularServicesSection />
      <TopFreelancesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <TrustSection />
      <CtaSection />
    </div>
  );
}
