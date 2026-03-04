const TRUST_FEATURES = [
  {
    icon: "lock",
    title: "Paiement sécurisé",
    description: "Vos fonds sont protégés par notre système d'escrow jusqu'à validation de la livraison.",
  },
  {
    icon: "verified",
    title: "Freelances vérifiés",
    description: "Chaque profil est vérifié. Identité, compétences et avis 100% authentiques.",
  },
  {
    icon: "support_agent",
    title: "Support réactif",
    description: "Notre équipe est disponible pour vous accompagner à chaque étape de votre projet.",
  },
  {
    icon: "replay",
    title: "Satisfaction garantie",
    description: "Pas satisfait ? Demandez une révision ou obtenez un remboursement. Zéro risque.",
  },
];

export function TrustSection() {
  return (
    <section className="py-24 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Pourquoi choisir FreelanceHigh ?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Une plateforme pensée pour simplifier le freelancing et protéger chaque transaction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRUST_FEATURES.map((feature) => (
            <div key={feature.title} className="text-center space-y-4">
              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
              </div>
              <h4 className="font-bold text-lg">{feature.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
