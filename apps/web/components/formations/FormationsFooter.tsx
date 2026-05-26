"use client";

import Link from "next/link";

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };

const COLUMNS: FooterColumn[] = [
  {
    title: "Catégories",
    links: [
      { label: "Graphisme & Design", href: "/formations/explorer?cat=design" },
      { label: "Marketing digital", href: "/formations/explorer?cat=marketing" },
      { label: "Rédaction & Traduction", href: "/formations/explorer?cat=writing" },
      { label: "Vidéo & Animation", href: "/formations/explorer?cat=video" },
      { label: "Musique & Audio", href: "/formations/explorer?cat=audio" },
      { label: "Programmation & Tech", href: "/formations/explorer?cat=tech" },
      { label: "Services d'IA", href: "/formations/explorer?cat=ai" },
      { label: "Consulting", href: "/formations/explorer?cat=consulting" },
      { label: "Data", href: "/formations/explorer?cat=data" },
      { label: "Business", href: "/formations/explorer?cat=business" },
    ],
  },
  {
    title: "Pour les clients",
    links: [
      { label: "Comment ça marche", href: "/formations/comment-ca-marche" },
      { label: "Témoignages clients", href: "/formations/temoignages" },
      { label: "Guide qualité", href: "/formations/guide-qualite" },
      { label: "Guides FreelanceHigh", href: "/formations/guides" },
      { label: "FAQ", href: "/formations/faq" },
      { label: "Freelances par compétence", href: "/formations/freelances" },
      { label: "Trouver un service", href: "/formations/explorer" },
      { label: "Centre d'aide", href: "/formations/aide" },
    ],
  },
  {
    title: "Pour les freelances",
    links: [
      { label: "Devenir freelance", href: "/formations/inscription?role=vendeur" },
      { label: "Devenir une agence", href: "/formations/inscription?role=agence" },
      { label: "Centre communautaire", href: "/formations/communaute" },
      { label: "Forum", href: "/formations/forum" },
      { label: "Événements", href: "/formations/evenements" },
      { label: "Académie", href: "/formations/academie" },
      { label: "Programme affiliation", href: "/formations/affiliation" },
    ],
  },
  {
    title: "Solutions entreprises",
    links: [
      { label: "FreelanceHigh Pro", href: "/formations/pro" },
      { label: "Services de gestion de projets", href: "/formations/gestion-projets" },
      { label: "Service de recrutement expert", href: "/formations/recrutement" },
      { label: "Marketing de contenu", href: "/formations/marketing-contenu" },
      { label: "Outil de dropshipping", href: "/formations/dropshipping" },
      { label: "Créateur de magasin", href: "/formations/creator" },
      { label: "Créateur de logo", href: "/formations/logo-maker" },
      { label: "Contacter le service ventes", href: "/formations/contact-ventes" },
    ],
  },
  {
    title: "Société",
    links: [
      { label: "À propos", href: "/formations/a-propos" },
      { label: "Carrières", href: "/formations/carrieres" },
      { label: "Conditions d'utilisation", href: "/formations/cgu" },
      { label: "Politique de confidentialité", href: "/formations/confidentialite" },
      { label: "Ne pas vendre mes informations", href: "/formations/opt-out" },
      { label: "Partenariats", href: "/formations/partenaires" },
      { label: "Réseau de créateurs", href: "/formations/createurs" },
      { label: "Affiliés", href: "/formations/affiliation" },
      { label: "Inviter un ami", href: "/formations/parrainage" },
      { label: "Presse & Infos", href: "/formations/presse" },
    ],
  },
];

export function FormationsFooter() {
  return (
    <footer style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* ═══════════════════════════════════════════════════════════════
          SECTION PRINCIPALE — 5 colonnes catégorisées (Fiverr-style)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white py-12 md:py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-bold text-gray-900 mb-4 md:mb-5">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 hover:text-fh-600 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SOUS-FOOTER — logo + langue/devise + social + copyright
          ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-stone-50 border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

            {/* GAUCHE — Logo + copyright */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {/* Logo SVG — vert FH */}
                <svg
                  className="w-7 h-7"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect width="32" height="32" rx="8" className="fill-fh-600" />
                  <path
                    d="M10 22V10h12M10 16h8"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-base font-bold text-gray-900">Novakou</span>
              </div>
              <span className="text-xs text-gray-500">
                © 2026 Novakou. Tous droits réservés.
              </span>
            </div>

            {/* DROITE — Sélecteurs + social */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* Sélecteur langue */}
              <button
                type="button"
                className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-fh-600 transition-colors"
                aria-label="Changer de langue"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                  language
                </span>
                <span>Français</span>
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  expand_more
                </span>
              </button>

              {/* Sélecteur devise */}
              <button
                type="button"
                className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-fh-600 transition-colors"
                aria-label="Changer de devise"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                  euro
                </span>
                <span>EUR</span>
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  expand_more
                </span>
              </button>

              {/* Séparateur */}
              <span className="text-gray-300" aria-hidden="true">|</span>

              {/* Social icons */}
              <div className="flex items-center gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:border-fh-400 hover:text-fh-600 flex items-center justify-center text-gray-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:border-fh-400 hover:text-fh-600 flex items-center justify-center text-gray-500 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:border-fh-400 hover:text-fh-600 flex items-center justify-center text-gray-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12s.014 3.668.072 4.948c.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:border-fh-400 hover:text-fh-600 flex items-center justify-center text-gray-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:border-fh-400 hover:text-fh-600 flex items-center justify-center text-gray-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
