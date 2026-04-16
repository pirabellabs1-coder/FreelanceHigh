"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

function initials(name: string | null | undefined) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function UserMenu({
  name, email, image, role, formationsRole,
}: {
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  formationsRole?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Determine main dashboard URL based on role
  const isAdmin = role === "ADMIN";
  const isVendor = formationsRole === "instructeur";
  const dashboardHref = isAdmin
    ? "/formations/admin/dashboard"
    : isVendor
    ? "/formations/vendeur/dashboard"
    : "/formations/apprenant/dashboard";

  const dashboardLabel = isAdmin ? "Espace admin" : isVendor ? "Mon espace vendeur" : "Mon espace";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
      >
        <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-[#006e2f] to-[#22c55e] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="w-full h-full object-cover" />
          ) : (
            initials(name)
          )}
        </div>
        <span className="hidden lg:inline text-sm font-semibold text-[#191c1e] max-w-[120px] truncate">
          {name?.split(" ")[0] ?? "Mon compte"}
        </span>
        <span className={`material-symbols-outlined text-[16px] text-[#5c647a] transition-transform ${open ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-br from-[#006e2f]/5 to-[#22c55e]/5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#006e2f] to-[#22c55e] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt="" className="w-full h-full object-cover" />
                ) : (
                  initials(name)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#191c1e] truncate">{name ?? "Utilisateur"}</p>
                <p className="text-[11px] text-[#5c647a] truncate">{email}</p>
              </div>
            </div>
            {(isVendor || isAdmin) && (
              <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#006e2f] text-white uppercase tracking-wider">
                {isAdmin ? "Admin" : "Vendeur"}
              </span>
            )}
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            <Link href={dashboardHref} onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-[#191c1e] hover:bg-gray-50 transition-colors">
              <span className="material-symbols-outlined text-[18px] text-[#006e2f]">dashboard</span>
              {dashboardLabel}
            </Link>

            {!isAdmin && !isVendor && (
              <>
                <Link href="/formations/apprenant/mes-formations" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#191c1e] hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-[#5c647a]">school</span>
                  Mes formations
                </Link>
                <Link href="/formations/apprenant/produits" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#191c1e] hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-[#5c647a]">shopping_bag</span>
                  Mes produits
                </Link>
                <Link href="/formations/apprenant/commandes" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#191c1e] hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-[#5c647a]">receipt_long</span>
                  Mes commandes
                </Link>
              </>
            )}

            {isVendor && (
              <>
                <Link href="/formations/vendeur/produits" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#191c1e] hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-[#5c647a]">inventory_2</span>
                  Mes produits
                </Link>
                <Link href="/formations/vendeur/transactions" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#191c1e] hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-[#5c647a]">payments</span>
                  Mes ventes
                </Link>
                <Link href="/formations/vendeur/marketing" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#191c1e] hover:bg-gray-50 transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-[#5c647a]">campaign</span>
                  Marketing
                </Link>
              </>
            )}

            <div className="my-1 border-t border-gray-100" />

            <Link href={isVendor ? "/formations/vendeur/parametres" : "/formations/apprenant/parametres"} onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#191c1e] hover:bg-gray-50 transition-colors">
              <span className="material-symbols-outlined text-[18px] text-[#5c647a]">settings</span>
              Paramètres
            </Link>

            <button
              onClick={() => { setOpen(false); signOut({ callbackUrl: "/formations" }); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function FormationsNavbar() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && session?.user;

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
          <Link href="/formations" className="text-slate-600 hover:text-green-500 transition-colors duration-300">Explorer</Link>
          <Link href="/formations/explorer" className="text-slate-600 hover:text-green-500 transition-colors duration-300">Marketplace</Link>
          <Link href="/formations/mentors" className="text-slate-600 hover:text-green-500 transition-colors duration-300">Mentors</Link>
          <Link href="/formations/tarifs" className="text-slate-600 hover:text-green-500 transition-colors duration-300">Tarifs</Link>
          <Link href="/formations/affiliation" className="text-slate-600 hover:text-green-500 transition-colors duration-300">Affiliation</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />
          ) : isLoggedIn ? (
            <UserMenu
              name={session.user.name ?? null}
              email={session.user.email ?? ""}
              image={session.user.image ?? null}
              role={(session.user as { role?: string }).role ?? "APPRENANT"}
              formationsRole={(session.user as { formationsRole?: string }).formationsRole}
            />
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
