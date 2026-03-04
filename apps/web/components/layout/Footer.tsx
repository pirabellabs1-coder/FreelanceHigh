"use client";

import Link from "next/link";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  }

  return (
    <footer className="bg-slate-950 border-t border-white/5 px-6 lg:px-20 py-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        {/* Branding */}
        <div className="space-y-8">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-4xl font-bold">public</span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">FreelanceHigh</h2>
          </Link>
          <p className="text-slate-500 text-base leading-relaxed">
            La plateforme freelance qui élève votre carrière au plus haut niveau. Trouvez les meilleurs experts pour vos projets.
          </p>
          <div className="flex gap-4">
            {["language", "grid_view", "alternate_email"].map((icon) => (
              <Link
                key={icon}
                href="#"
                className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-primary transition-all"
              >
                <span className="material-symbols-outlined">{icon}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Plateforme */}
        <div>
          <h4 className="text-white font-bold text-lg mb-8">Plateforme</h4>
          <ul className="space-y-4 text-slate-500 text-base">
            <li><Link href="/explorer" className="hover:text-primary transition-colors">Explorer les services</Link></li>
            <li><Link href="/projets" className="hover:text-primary transition-colors">Projets en cours</Link></li>
            <li><Link href="/inscription" className="hover:text-primary transition-colors">Devenir freelance</Link></li>
            <li><Link href="/tarifs" className="hover:text-primary transition-colors">Nos tarifs</Link></li>
          </ul>
        </div>

        {/* Support & Sécurité */}
        <div>
          <h4 className="text-white font-bold text-lg mb-8">Support &amp; Sécurité</h4>
          <ul className="space-y-4 text-slate-500 text-base">
            <li><Link href="/confiance-securite" className="hover:text-primary transition-colors">Protection des paiements</Link></li>
            <li><Link href="/comment-ca-marche" className="hover:text-primary transition-colors">Comment ça marche</Link></li>
            <li><Link href="/aide" className="hover:text-primary transition-colors">Centre d&apos;aide</Link></li>
            <li><Link href="/confidentialite" className="hover:text-primary transition-colors">Politique de confidentialité</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white font-bold text-lg mb-8">Newsletter</h4>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Recevez les meilleures opportunités et conseils freelance directement dans votre boîte mail.
          </p>
          {submitted ? (
            <p className="text-sm font-bold flex items-center gap-2 text-accent">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Merci pour votre inscription !
            </p>
          ) : (
            <form onSubmit={handleNewsletter} className="flex flex-col gap-3">
              <div className="flex gap-2 p-1.5 bg-white/5 border border-white/10 rounded-xl focus-within:border-primary transition-all">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="bg-transparent border-none outline-none text-sm text-white w-full px-3 placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="bg-primary text-white p-3 rounded-lg hover:bg-primary/80 transition-all flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-slate-600 text-xs">© 2026 FreelanceHigh. Tous droits réservés.</p>
        <div className="flex gap-8 text-xs text-slate-600 font-bold">
          <Link href="/cgu" className="hover:text-white transition-colors">CGU</Link>
          <Link href="/mentions-legales" className="hover:text-white transition-colors">MENTIONS LÉGALES</Link>
          <Link href="/cookies" className="hover:text-white transition-colors">COOKIES</Link>
        </div>
      </div>
    </footer>
  );
}
