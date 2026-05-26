"use client";

import Link from "next/link";
import { useState, useRef, useEffect, FormEvent } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { getDashboardForFormationsRole, getRoleLabel } from "@/lib/formations/role-routing";

type FormationsRole = "apprenant" | "instructeur" | "mentor" | "affilie" | undefined;

interface CategoryItem {
  href: string;
  label: string;
  icon?: string;
}

const CATEGORIES: CategoryItem[] = [
  { href: "/formations/explorer?cat=trending", label: "Tendance", icon: "local_fire_department" },
  { href: "/formations/explorer?cat=design", label: "Graphisme & Design" },
  { href: "/formations/explorer?cat=tech", label: "Programmation & Tech" },
  { href: "/formations/explorer?cat=marketing", label: "Marketing digital" },
  { href: "/formations/explorer?cat=video", label: "Vidéo & Animation" },
  { href: "/formations/explorer?cat=writing", label: "Rédaction & Traduction" },
  { href: "/formations/explorer?cat=audio", label: "Musique & Audio" },
  { href: "/formations/explorer?cat=business", label: "Business" },
  { href: "/formations/explorer?cat=ai", label: "Services d'IA" },
  { href: "/formations/explorer?cat=consulting", label: "Consulting" },
  { href: "/formations/explorer?cat=data", label: "Data" },
  { href: "/formations/explorer?cat=photo", label: "Photographie" },
];

function initials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function SearchBar({ onSubmit, autoFocus = false }: { onSubmit?: () => void; autoFocus?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/formations/explorer?q=${encodeURIComponent(trimmed)}`);
    onSubmit?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center w-full border border-gray-300 hover:border-gray-400 focus-within:border-fh-600 rounded-lg overflow-hidden bg-white transition-colors"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus={autoFocus}
        placeholder="Quel service recherchez-vous aujourd'hui ?"
        className="flex-1 px-4 py-2.5 text-sm outline-none placeholder-gray-400 bg-transparent"
      />
      <button
        type="submit"
        aria-label="Rechercher"
        className="bg-fh-600 hover:bg-fh-700 text-white p-2.5 transition-colors flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-[20px]">search</span>
      </button>
    </form>
  );
}

function UserMenu({
  name,
  email,
  image,
  role,
  formationsRole,
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

  const isAdmin = role === "ADMIN";
  const isVendor = formationsRole === "instructeur";
  const isMentor = formationsRole === "mentor";
  const isAffilie = formationsRole === "affilie";
  const dashboardHref = getDashboardForFormationsRole(formationsRole as FormationsRole, role);
  const dashboardLabel = isAdmin
    ? "Espace admin"
    : isVendor
    ? "Mon espace vendeur"
    : isMentor
    ? "Mon espace mentor"
    : isAffilie
    ? "Mon espace affilié"
    : "Mon espace apprenant";
  const roleLabel = isAdmin ? "Admin" : getRoleLabel(formationsRole as FormationsRole);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex items-center rounded-full hover:ring-2 hover:ring-gray-200 transition-all"
        aria-label="Menu utilisateur"
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-fh-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ring-2 ring-white">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="" className="w-full h-full object-cover" />
            ) : (
              initials(name)
            )}
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 bg-fh-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-fh-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt="" className="w-full h-full object-cover" />
                ) : (
                  initials(name)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{name ?? "Utilisateur"}</p>
                <p className="text-[11px] text-gray-500 truncate">{email}</p>
              </div>
            </div>
            {(formationsRole || isAdmin) && (
              <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-fh-600 text-white uppercase tracking-wider">
                {roleLabel}
              </span>
            )}
          </div>
          <div className="py-1.5">
            <Link
              href={dashboardHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-fh-600">dashboard</span>
              {dashboardLabel}
            </Link>
            {!isAdmin && !isVendor && (
              <>
                <Link
                  href="/formations/apprenant/mes-formations"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50"
                >
                  <span className="material-symbols-outlined text-[18px] text-gray-500">school</span>
                  Mes formations
                </Link>
                <Link
                  href="/formations/apprenant/commandes"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50"
                >
                  <span className="material-symbols-outlined text-[18px] text-gray-500">receipt_long</span>
                  Mes commandes
                </Link>
              </>
            )}
            {isVendor && (
              <>
                <Link
                  href="/formations/vendeur/produits"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50"
                >
                  <span className="material-symbols-outlined text-[18px] text-gray-500">inventory_2</span>
                  Mes produits
                </Link>
                <Link
                  href="/formations/vendeur/transactions"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50"
                >
                  <span className="material-symbols-outlined text-[18px] text-gray-500">payments</span>
                  Mes ventes
                </Link>
              </>
            )}
            <div className="my-1 border-t border-gray-100" />
            <Link
              href={isVendor ? "/formations/vendeur/parametres" : "/formations/apprenant/parametres"}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50"
            >
              <span className="material-symbols-outlined text-[18px] text-gray-500">settings</span>
              Paramètres
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/formations" });
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 text-left"
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

function IconButton({
  href,
  icon,
  label,
  hasNotification = false,
}: {
  href: string;
  icon: string;
  label: string;
  hasNotification?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="relative hidden md:flex items-center justify-center w-9 h-9 rounded-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
    >
      <span className="material-symbols-outlined text-[22px]">{icon}</span>
      {hasNotification && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
      )}
    </Link>
  );
}

export function FormationsNavbar() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session?.user;
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileQuery, setMobileQuery] = useState("");

  const formationsRole = (session?.user as { formationsRole?: string } | undefined)?.formationsRole;
  const userRole = (session?.user as { role?: string } | undefined)?.role ?? "APPRENANT";
  const isVendor = formationsRole === "instructeur";

  useEffect(() => {
    if (mobileMenu || mobileSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenu, mobileSearchOpen]);

  const handleMobileSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = mobileQuery.trim();
    if (!trimmed) return;
    router.push(`/formations/explorer?q=${encodeURIComponent(trimmed)}`);
    setMobileSearchOpen(false);
    setMobileQuery("");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white">
        {/* LIGNE 1 — Logo + Search + Actions */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto h-16 flex items-center gap-4 px-4 md:px-6">
            {/* GAUCHE — Logo */}
            <Link href="/formations" className="flex items-center gap-2 flex-shrink-0">
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="10" fill="#006e2f" />
                <path d="M10 26V10h10v3.5h-6V17h5.5v3.5H14V26H10z" fill="white" />
                <path d="M20 26V17.5h2.5V15c0-2.76 2.24-5 5-5h.5v3.5h-.5c-.83 0-1.5.67-1.5 1.5v2.5H29V26h-3.5v-5.5H23.5V26H20z" fill="#22c55e" />
              </svg>
              <span className="text-base font-bold text-gray-900 hidden sm:inline">Novakou</span>
            </Link>

            {/* CENTRE — Search bar permanente (desktop) */}
            <div className="flex-1 max-w-2xl hidden md:flex">
              <SearchBar />
            </div>

            {/* Mobile : icône loupe seule */}
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden ml-auto flex items-center justify-center w-9 h-9 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Rechercher"
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </button>

            {/* DROITE — Actions */}
            <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
              {status === "loading" ? (
                <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />
              ) : isLoggedIn && session?.user ? (
                <>
                  <IconButton href="/formations/apprenant/notifications" icon="notifications" label="Notifications" hasNotification />
                  <IconButton href="/formations/apprenant/messages" icon="mail" label="Messages" hasNotification />
                  <IconButton href="/formations/apprenant/favoris" icon="favorite" label="Favoris" />
                  <Link
                    href={isVendor ? "/formations/vendeur/transactions" : "/formations/apprenant/commandes"}
                    className="hidden lg:inline text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-1"
                  >
                    Commandes
                  </Link>
                  <Link
                    href={isVendor ? "/formations/apprenant/mes-formations" : "/formations/vendeur"}
                    className="hidden lg:inline text-sm font-semibold text-fh-600 hover:text-fh-700 transition-colors px-1"
                  >
                    {isVendor ? "Mode acheteur" : "Mode vendeur"}
                  </Link>
                  <UserMenu
                    name={session.user.name ?? null}
                    email={session.user.email ?? ""}
                    image={session.user.image ?? null}
                    role={userRole}
                    formationsRole={formationsRole}
                  />
                  <button
                    onClick={() => setMobileMenu(true)}
                    className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Menu"
                  >
                    <span className="material-symbols-outlined text-[24px] text-gray-700">menu</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/formations/vendeur"
                    className="hidden md:inline text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors px-2"
                  >
                    Devenir freelance
                  </Link>
                  <Link
                    href="/formations/connexion"
                    className="hidden sm:inline text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors px-2"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/formations/inscription"
                    className="bg-fh-600 hover:bg-fh-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
                  >
                    Rejoindre
                  </Link>
                  <button
                    onClick={() => setMobileMenu(true)}
                    className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Menu"
                  >
                    <span className="material-symbols-outlined text-[24px] text-gray-700">menu</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* LIGNE 2 — Sous-barre catégories */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto flex items-center gap-5 md:gap-7 px-4 md:px-6 py-2.5 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const isActive = pathname?.startsWith("/formations/explorer") && typeof window !== "undefined" && window.location.search.includes(cat.href.split("?")[1] ?? "");
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className={`flex items-center gap-1 text-xs md:text-sm whitespace-nowrap font-medium flex-shrink-0 transition-colors ${
                    isActive ? "text-fh-600" : "text-gray-700 hover:text-fh-600"
                  }`}
                >
                  {cat.icon && (
                    <span className="material-symbols-outlined text-[16px] text-orange-500">
                      {cat.icon}
                    </span>
                  )}
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-white md:hidden">
          <div className="flex items-center gap-2 px-4 h-16 border-b border-gray-100">
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100"
              aria-label="Fermer"
            >
              <span className="material-symbols-outlined text-[24px] text-gray-700">arrow_back</span>
            </button>
            <form onSubmit={handleMobileSearchSubmit} className="flex-1 flex items-center border border-gray-300 focus-within:border-fh-600 rounded-lg overflow-hidden">
              <input
                type="text"
                autoFocus
                value={mobileQuery}
                onChange={(e) => setMobileQuery(e.target.value)}
                placeholder="Quel service recherchez-vous ?"
                className="flex-1 px-4 py-2.5 text-sm outline-none placeholder-gray-400"
              />
              <button
                type="submit"
                aria-label="Rechercher"
                className="bg-fh-600 hover:bg-fh-700 text-white p-2.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">search</span>
              </button>
            </form>
          </div>
          <div className="px-4 py-4">
            <p className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-3">Catégories populaires</p>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  onClick={() => setMobileSearchOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  {cat.icon && (
                    <span className="material-symbols-outlined text-[18px] text-orange-500">{cat.icon}</span>
                  )}
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenu && (
        <div className="fixed inset-0 z-[60] bg-black/50 md:hidden" onClick={() => setMobileMenu(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header drawer */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100 sticky top-0 bg-white">
              <span className="text-base font-bold text-gray-900">Menu</span>
              <button
                onClick={() => setMobileMenu(false)}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100"
                aria-label="Fermer"
              >
                <span className="material-symbols-outlined text-[24px] text-gray-700">close</span>
              </button>
            </div>

            {/* Search in drawer */}
            <div className="px-4 py-3 border-b border-gray-100">
              <SearchBar onSubmit={() => setMobileMenu(false)} />
            </div>

            {/* User section */}
            {isLoggedIn && session?.user ? (
              <div className="px-4 py-3 bg-fh-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-fh-600 flex items-center justify-center text-white text-sm font-bold">
                    {session.user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      initials(session.user.name ?? null)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{session.user.name ?? "Utilisateur"}</p>
                    <p className="text-[11px] text-gray-500 truncate">{session.user.email}</p>
                  </div>
                </div>
              </div>
            ) : null}

            {/* User links */}
            {isLoggedIn && (
              <div className="py-2 border-b border-gray-100">
                <Link
                  href={getDashboardForFormationsRole(formationsRole as FormationsRole, userRole)}
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                >
                  <span className="material-symbols-outlined text-[20px] text-fh-600">dashboard</span>
                  Mon espace
                </Link>
                <Link
                  href={isVendor ? "/formations/vendeur/transactions" : "/formations/apprenant/commandes"}
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-900 hover:bg-gray-50"
                >
                  <span className="material-symbols-outlined text-[20px] text-gray-500">receipt_long</span>
                  Mes commandes
                </Link>
                <Link
                  href="/formations/apprenant/favoris"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-900 hover:bg-gray-50"
                >
                  <span className="material-symbols-outlined text-[20px] text-gray-500">favorite</span>
                  Mes favoris
                </Link>
                <Link
                  href="/formations/apprenant/messages"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-900 hover:bg-gray-50"
                >
                  <span className="material-symbols-outlined text-[20px] text-gray-500">mail</span>
                  Messages
                </Link>
                <Link
                  href={isVendor ? "/formations/apprenant/mes-formations" : "/formations/vendeur"}
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-fh-600 hover:bg-gray-50"
                >
                  <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
                  {isVendor ? "Mode acheteur" : "Mode vendeur"}
                </Link>
              </div>
            )}

            {/* Catégories */}
            <div className="py-2">
              <p className="px-4 py-2 text-xs font-bold uppercase text-gray-500 tracking-wider">Catégories</p>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  {cat.icon && (
                    <span className="material-symbols-outlined text-[18px] text-orange-500">{cat.icon}</span>
                  )}
                  {cat.label}
                </Link>
              ))}
            </div>

            {/* CTAs si non connecté */}
            {!isLoggedIn && (
              <div className="p-4 border-t border-gray-100 space-y-2 sticky bottom-0 bg-white">
                <Link
                  href="/formations/connexion"
                  onClick={() => setMobileMenu(false)}
                  className="block w-full text-center text-sm font-semibold text-gray-700 hover:text-gray-900 py-2.5 border border-gray-300 rounded-lg"
                >
                  Se connecter
                </Link>
                <Link
                  href="/formations/inscription"
                  onClick={() => setMobileMenu(false)}
                  className="block w-full text-center text-sm font-bold text-white bg-fh-600 hover:bg-fh-700 py-2.5 rounded-lg"
                >
                  Rejoindre
                </Link>
              </div>
            )}

            {/* Logout si connecté */}
            {isLoggedIn && (
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setMobileMenu(false);
                    signOut({ callbackUrl: "/formations" });
                  }}
                  className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-red-600 hover:bg-red-50 py-2.5 rounded-lg border border-red-200"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
