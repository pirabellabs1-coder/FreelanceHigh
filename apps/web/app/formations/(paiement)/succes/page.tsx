"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, BookOpen, ArrowRight } from "lucide-react";

export default function PaiementSuccesPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("formations_lang") as "fr" | "en" | null;
    if (saved) setLang(saved);

    // Verify the session if provided
    if (sessionId) {
      fetch(`/api/formations/checkout/verify?session_id=${sessionId}`)
        .then((r) => r.json())
        .then(() => setVerified(true))
        .catch(() => setVerified(true));
    } else {
      setVerified(true);
    }
  }, [sessionId]);

  const t = (fr: string, en: string) => (lang === "fr" ? fr : en);

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
          {t("Paiement réussi !", "Payment Successful!")}
        </h1>
        <p className="text-slate-400 mb-8">
          {t(
            "Votre formation est maintenant accessible. Commencez à apprendre dès maintenant !",
            "Your course is now accessible. Start learning right now!"
          )}
        </p>

        {/* Confirmation box */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 mb-8 text-left">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-medium text-sm">
                {t("Confirmation envoyée", "Confirmation Sent")}
              </p>
              <p className="text-slate-400 text-sm mt-1">
                {t(
                  "Vous recevrez un email de confirmation avec les détails de votre achat.",
                  "You will receive a confirmation email with your purchase details."
                )}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 mt-4">
            <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-medium text-sm">
                {t("Accès immédiat", "Immediate Access")}
              </p>
              <p className="text-slate-400 text-sm mt-1">
                {t(
                  "Votre formation est déjà disponible dans votre espace apprenant.",
                  "Your course is already available in your learner space."
                )}
              </p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Link
            href="/formations/mes-formations"
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            {t("Accéder à mes formations", "Access My Courses")}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/formations/explorer"
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            {t("Explorer d'autres formations", "Explore more courses")}
          </Link>
        </div>
      </div>
    </div>
  );
}
