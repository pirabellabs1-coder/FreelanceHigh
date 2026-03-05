import Link from "next/link";

const STEPS_FREELANCE = [
  { icon: "person_add", title: "Créez votre profil", desc: "Inscrivez-vous, ajoutez vos compétences et votre portfolio." },
  { icon: "sell", title: "Publiez vos services", desc: "Définissez vos forfaits (Basique, Standard, Premium) avec prix et délais." },
  { icon: "work", title: "Recevez des commandes", desc: "Les clients commandent directement vos services ou vous invitent sur des projets." },
  { icon: "payments", title: "Soyez payé", desc: "Les fonds sont sécurisés en escrow et libérés après validation de la livraison." },
];

const STEPS_CLIENT = [
  { icon: "search", title: "Trouvez un expert", desc: "Explorez la marketplace ou publiez votre projet pour recevoir des candidatures." },
  { icon: "shopping_cart", title: "Commandez", desc: "Choisissez un forfait et passez commande. Le paiement est sécurisé." },
  { icon: "chat", title: "Collaborez", desc: "Échangez avec votre freelance via la messagerie intégrée." },
  { icon: "verified", title: "Validez et évaluez", desc: "Validez la livraison et laissez un avis. Les fonds sont libérés." },
];

const STEPS_AGENCE = [
  { icon: "business", title: "Créez votre agence", desc: "Inscrivez votre agence avec un profil dédié (logo, description, secteur)." },
  { icon: "group_add", title: "Constituez votre équipe", desc: "Invitez des freelances à rejoindre votre agence avec des rôles personnalisés." },
  { icon: "folder_shared", title: "Gérez vos projets", desc: "Assignez des missions, suivez l'avancement et gérez le CRM clients." },
  { icon: "account_balance", title: "Facturez et recevez", desc: "Finances centralisées, commission interne paramétrable, retraits collectifs." },
];

export default function CommentCaMarchePage() {
  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Comment ça marche ?</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">FreelanceHigh connecte freelances, clients et agences en toute sécurité.</p>
        </div>

        {[
          { title: "Pour les Freelances", steps: STEPS_FREELANCE, color: "text-primary", bg: "bg-primary/10" },
          { title: "Pour les Clients", steps: STEPS_CLIENT, color: "text-blue-400", bg: "bg-blue-500/10" },
          { title: "Pour les Agences", steps: STEPS_AGENCE, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        ].map(section => (
          <div key={section.title} className="mb-16">
            <h2 className={`text-2xl font-bold mb-8 ${section.color}`}>{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.steps.map((step, i) => (
                <div key={step.title} className="bg-neutral-dark rounded-2xl border border-border-dark p-6">
                  <div className={`w-12 h-12 rounded-xl ${section.bg} flex items-center justify-center mb-4`}>
                    <span className={`material-symbols-outlined ${section.color}`}>{step.icon}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-sm font-bold ${section.color}`}>Étape {i + 1}</span>
                  </div>
                  <h3 className="font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center mt-12">
          <Link href="/inscription" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
            Commencer maintenant
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
