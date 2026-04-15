"use client";

import Link from "next/link";

export function FormationsNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(15,23,42,0.06)]">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/formations" className="flex items-center">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="10" fill="#006e2f"/>
            <path d="M10 26V10h10v3.5h-6V17h5.5v3.5H14V26H10z" fill="white"/>
            <path d="M20 26V17.5h2.5V15c0-2.76 2.24-5 5-5h.5v3.5h-.5c-.83 0-1.5.67-1.5 1.5v2.5H29V26h-3.5v-5.5H23.5V26H20z" fill="#22c55e"/>
          </svg>
        </Link>

        {/* Nav */}
        <div className="hidden md:flex gap-8 items-center text-sm font-medium tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <Link href="/formations" className="text-slate-600 hover:text-green-500 transition-colors duration-300">
            Explorer
          </Link>
          <Link href="/formations/explorer" className="text-slate-600 hover:text-green-500 transition-colors duration-300">
            Marketplace
          </Link>
          <Link href="/formations/mentors" className="text-slate-600 hover:text-green-500 transition-colors duration-300">
            Mentors
          </Link>
          <Link href="/formations/tarifs" className="text-slate-600 hover:text-green-500 transition-colors duration-300">
            Tarifs
          </Link>
          <Link href="/formations/affiliation" className="text-slate-600 hover:text-green-500 transition-colors duration-300">
            Affiliation
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/formations/connexion" className="text-slate-600 text-sm font-semibold px-3 py-2 hover:text-green-500">
            Connexion
          </Link>
          <Link
            href="/formations/inscription"
            className="text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap active:scale-90 transition-transform shadow-lg shadow-green-200"
            style={{ background: "linear-gradient(to right, #006e2f, #22c55e)" }}
          >
            Créer ma boutique
          </Link>
        </div>
      </div>
    </nav>
  );
}
