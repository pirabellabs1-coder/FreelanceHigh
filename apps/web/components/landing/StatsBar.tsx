export function StatsBar() {
  return (
    <section className="px-6 lg:px-20 -mt-20 relative z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Freelances actifs */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-primary/10 shadow-2xl flex items-center gap-6">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <span className="material-symbols-outlined text-4xl">groups</span>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-tight">Freelances actifs</p>
            <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white">25,000+</h3>
            <span className="text-xs font-bold text-primary flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              +1 200 ce mois
            </span>
          </div>
        </div>

        {/* Satisfaction client */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-primary/10 shadow-2xl flex items-center gap-6">
          <div className="size-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-tight">Satisfaction client</p>
            <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white">4.9/5</h3>
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mt-1">
              Basé sur 50 000+ avis vérifiés
            </span>
          </div>
        </div>

        {/* Projets livrés */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-primary/10 shadow-2xl flex items-center gap-6">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <span className="material-symbols-outlined text-4xl">task_alt</span>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-tight">Projets livrés</p>
            <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white">150,000+</h3>
            <span className="text-xs font-bold text-primary flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-xs">verified_user</span>
              Paiements 100% sécurisés
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
