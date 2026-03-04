import Link from "next/link";

export function CtaSection() {
  return (
    <section className="px-6 lg:px-20 pb-32">
      <div className="max-w-7xl mx-auto bg-slate-900 border border-primary/30 rounded-[3rem] p-12 lg:p-24 text-center space-y-10 relative overflow-hidden shadow-2xl shadow-primary/10">
        {/* Decorative blurs */}
        <div className="absolute -top-24 -right-24 size-96 bg-primary/20 blur-[150px] rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 size-96 bg-accent/10 blur-[150px] rounded-full"></div>

        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white max-w-4xl mx-auto leading-[1.1] relative z-10">
          Prêt à lancer votre{" "}
          <span className="text-primary">prochain projet</span> ?
        </h2>

        <p className="text-slate-400 text-xl max-w-2xl mx-auto relative z-10 leading-relaxed">
          Rejoignez des milliers de clients et freelances qui collaborent chaque jour sur FreelanceHigh. Inscription gratuite, résultats immédiats.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 relative z-10">
          <Link
            href="/explorer"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-primary/30 text-center"
          >
            Trouver un freelance
          </Link>
          <Link
            href="/inscription"
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-12 py-5 rounded-2xl font-bold text-xl transition-all backdrop-blur-sm text-center"
          >
            Proposer mes services
          </Link>
        </div>

        <div className="pt-8 relative z-10">
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center gap-4">
            <span className="w-8 h-px bg-slate-800"></span>
            Inscription gratuite &middot; Aucun engagement
            <span className="w-8 h-px bg-slate-800"></span>
          </p>
        </div>
      </div>
    </section>
  );
}
