import Link from "next/link";

const FEATURES = [
  { icon: "lock", title: "Paiements sécurisés", desc: "Toutes les transactions sont protégées par le système d'escrow. Les fonds sont bloqués jusqu'à la validation de la livraison.", color: "text-primary", bg: "bg-primary/10" },
  { icon: "verified_user", title: "Vérification KYC", desc: "4 niveaux de vérification progressive (email, téléphone, identité, professionnel) pour garantir la fiabilité.", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: "gavel", title: "Résolution de litiges", desc: "Notre équipe intervient en cas de litige pour trouver une solution équitable entre les parties.", color: "text-amber-400", bg: "bg-amber-500/10" },
  { icon: "shield", title: "Chiffrement SSL", desc: "Toutes les communications et données sont chiffrées avec un certificat SSL de niveau bancaire.", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: "privacy_tip", title: "Protection des données", desc: "Conformité RGPD complète. Vos données personnelles sont stockées de manière sécurisée en Europe.", color: "text-purple-400", bg: "bg-purple-500/10" },
  { icon: "account_balance", title: "Escrow garanti", desc: "Les fonds ne sont jamais entre les mains d'une seule partie. Le système de séquestre protège acheteurs et vendeurs.", color: "text-cyan-400", bg: "bg-cyan-500/10" },
];

export default function ConfianceSecuritePage() {
  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Confiance &amp; Sécurité</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Votre sécurité est notre priorité. Découvrez comment FreelanceHigh protège chaque transaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-neutral-dark rounded-2xl border border-border-dark p-6">
              <div className={`w-14 h-14 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                <span className={`material-symbols-outlined text-2xl ${f.color}`}>{f.icon}</span>
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-neutral-dark rounded-2xl border border-primary/20 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Un problème ? Nous sommes là.</h2>
          <p className="text-slate-400 mb-6">Notre équipe support est disponible pour vous aider à résoudre tout problème.</p>
          <Link href="/aide" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
            Contacter le support
          </Link>
        </div>
      </div>
    </div>
  );
}
