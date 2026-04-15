import Link from "next/link";

export function FormationsFooter() {
  return (
    <footer className="bg-slate-50 w-full py-16 border-t border-slate-100" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 max-w-7xl mx-auto">

        {/* Col 1 — Brand */}
        <div className="space-y-6">
          <div className="text-xl font-bold text-slate-900">FreelanceHigh</div>
          <p className="text-sm text-slate-500 leading-relaxed">
            La plateforme qui transforme les talents en actifs numériques rentables. Le futur de l&apos;économie des créateurs
          </p>
        </div>

        {/* Col 2 — Marketplace */}
        <div className="space-y-6">
          <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest">Marketplace</h4>
          <ul className="space-y-3 text-sm text-slate-500">
            <li><Link href="/formations" className="hover:text-[#006e2f] transition-colors">Explorer</Link></li>
            <li><Link href="/formations/freelances" className="hover:text-[#006e2f] transition-colors">Freelances</Link></li>
            <li><Link href="/formations/services" className="hover:text-[#006e2f] transition-colors">Services</Link></li>
            <li><Link href="/formations/tarifs" className="hover:text-[#006e2f] transition-colors">Tarifs</Link></li>
          </ul>
        </div>

        {/* Col 3 — Entreprise */}
        <div className="space-y-6">
          <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest">Entreprise</h4>
          <ul className="space-y-3 text-sm text-slate-500">
            <li><a href="#" className="hover:text-[#006e2f] transition-colors">À propos</a></li>
            <li><a href="#" className="hover:text-[#006e2f] transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-[#006e2f] transition-colors">Partenaires</a></li>
            <li><a href="#" className="hover:text-[#006e2f] transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Col 4 — Newsletter */}
        <div className="space-y-6">
          <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest">Newsletter</h4>
          <p className="text-sm text-slate-500 leading-relaxed">
            Recevez les meilleures stratégies de monétisation directement dans votre boîte.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="votre@email.com"
              className="flex-1 px-4 py-2 text-sm rounded-full border border-slate-200 bg-white outline-none focus:border-[#006e2f] transition-colors"
            />
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200 flex-shrink-0"
              style={{ background: "linear-gradient(to right, #006e2f, #22c55e)" }}
              aria-label="S'abonner"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 pt-8 border-t border-slate-100 px-8 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
        <p>© 2026 FreelanceHigh · La Curation Digital</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-600 transition-colors">CGU</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Confidentialité</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
