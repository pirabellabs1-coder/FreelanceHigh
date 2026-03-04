const TESTIMONIALS = [
  {
    quote:
      "J'ai trouvé un développeur incroyable en moins de 24h. Le système de paiement sécurisé m'a rassuré dès le début. Je recommande à 100%.",
    name: "Thomas Martin",
    role: "CEO, StartupFlow",
    rating: 5,
  },
  {
    quote:
      "En tant que freelance, FreelanceHigh m'a permis de doubler mes revenus en 6 mois. La plateforme est intuitive et les clients sont sérieux.",
    name: "Léa Bernard",
    role: "Designer UX/UI Freelance",
    rating: 5,
  },
  {
    quote:
      "On utilise FreelanceHigh pour tous nos projets digitaux. La qualité des freelances et le suivi des commandes sont vraiment au top.",
    name: "Marc Durand",
    role: "Directeur Digital, AgenceX",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-32 px-6 lg:px-20 bg-primary/5 dark:bg-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-6 mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Des milliers de clients et freelances nous font confiance au quotidien.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white dark:bg-slate-800 p-10 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-shadow"
            >
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-accent text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-8 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="font-bold text-lg">{t.name}</p>
                <p className="text-sm text-slate-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
