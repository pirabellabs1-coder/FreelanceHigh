"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { RoleGuard } from "@/components/formations/RoleGuard";

const navGroups = [
  {
    label: "Général",
    items: [
      { icon: "dashboard",         label: "Tableau de bord", href: "/formations/apprenant/dashboard" },
      { icon: "school",            label: "Mes formations",  href: "/formations/apprenant/mes-formations" },
      { icon: "inventory_2",       label: "Mes produits",    href: "/formations/apprenant/produits" },
      { icon: "workspace_premium", label: "Certificats",     href: "/formations/apprenant/certificats" },
    ],
  },
  {
    label: "Achats",
    items: [
      { icon: "shopping_cart",         label: "Panier",    href: "/formations/apprenant/panier",    badge: true },
      { icon: "receipt_long",          label: "Commandes", href: "/formations/apprenant/commandes" },
      { icon: "account_balance_wallet",label: "Dépenses",  href: "/formations/apprenant/depenses" },
    ],
  },
  {
    label: "Accompagnement",
    items: [
      { icon: "support_agent", label: "Mes mentors",  href: "/formations/apprenant/mentors" },
      { icon: "event",         label: "Mes sessions", href: "/formations/apprenant/sessions" },
      { icon: "forum",         label: "Messages",     href: "/formations/messages" },
    ],
  },
  {
    label: "Compte",
    items: [
      { icon: "settings", label: "Paramètres", href: "/formations/apprenant/parametres" },
    ],
  },
];

function ApprenantFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md flex items-center justify-center bg-fh-600">
                <span className="text-white font-bold text-[10px]">NK</span>
              </div>
              <span className="font-bold text-gray-900 text-sm">Novakou</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              La plateforme d&apos;apprentissage qui élève votre carrière freelance.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3">Apprendre</p>
            <ul className="space-y-1.5">
              {[
                { label: "Explorer le catalogue",  href: "/formations/explorer" },
                { label: "Mes formations",          href: "/formations/apprenant/mes-formations" },
                { label: "Trouver un mentor",       href: "/formations/mentors" },
                { label: "Mes certificats",         href: "/formations/apprenant/certificats" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-gray-600 hover:text-fh-600 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3">Support</p>
            <ul className="space-y-1.5">
              {[
                { label: "Centre d'aide",               href: "/formations/aide" },
                { label: "Contact",                      href: "/formations/contact" },
                { label: "Conditions d'utilisation",     href: "/formations/cgu" },
                { label: "Politique de confidentialité", href: "/formations/confidentialite" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-xs text-gray-600 hover:text-fh-600 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-gray-600">© 2026 Novakou — Tous droits réservés</p>
          <p className="text-[10px] text-gray-600">Fondé par Lissanon Gildas · Afrique francophone &amp; diaspora</p>
        </div>
      </div>
    </footer>
  );
}

// Derive initials from name
function getInitials(name?: string | null): string {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function ApprenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard requiredRole="apprenant">
      <ApprenantLayoutInner>{children}</ApprenantLayoutInner>
    </RoleGuard>
  );
}

function ApprenantLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession();

  // Fetch cart count from real API
  const { data: cartData } = useQuery({
    queryKey: ["apprenant-cart-count"],
    queryFn: () => fetch("/api/formations/apprenant/cart").then((r) => r.json()),
    enabled: status === "authenticated",
    staleTime: 30_000,
  });

  const cartCount: number = cartData?.count ?? 0;
  const user = session?.user;
  const displayName  = user?.name ?? "Apprenant";
  const displayEmail = user?.email ?? "";
  const initials     = getInitials(user?.name);
  const avatarUrl    = (user as Record<string, unknown> | undefined)?.image as string | undefined
                    ?? (user as Record<string, unknown> | undefined)?.avatar as string | undefined;

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-14 flex items-center px-4 md:px-6 gap-4">
        <button
          className="md:hidden p-1.5 rounded-md hover:bg-gray-100 text-gray-900"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <span className="material-symbols-outlined text-[18px]">menu</span>
        </button>

        <Link href="/formations/apprenant/dashboard" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-md flex items-center justify-center bg-fh-600">
            <span className="text-white font-bold text-[10px] tracking-tight">NK</span>
          </div>
          <span className="hidden sm:block font-bold text-gray-900 text-base">Novakou</span>
        </Link>

        <div className="flex-1" />

        <div className="flex items-center gap-1">
          {/* Notifications */}
          <button className="relative p-1.5 rounded-full hover:bg-gray-100 text-gray-600">
            <span className="material-symbols-outlined text-[18px]">notifications</span>
          </button>

          {/* Cart */}
          <Link href="/formations/apprenant/panier" className="relative p-1.5 rounded-full hover:bg-gray-100 text-gray-600">
            <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-fh-600 text-white text-[9px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User avatar */}
          <Link href="/formations/apprenant/parametres">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover flex-shrink-0 ml-1" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-fh-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ml-1">
                {initials}
              </div>
            )}
          </Link>
        </div>
      </header>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-60 bg-white border-r border-gray-200 pt-14 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* User info */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-fh-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-xs truncate">{displayName}</p>
              <p className="text-[11px] text-gray-600 truncate">{displayEmail}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          <div>
            {navGroups.map((group) => (
              <div key={group.label} className="mt-4 first:mt-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-1">
                  {group.label}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/formations/apprenant/dashboard" && pathname.startsWith(item.href));
                    const showBadge = "badge" in item && item.badge && cartCount > 0;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-150 border-l-2 ${
                            isActive
                              ? "bg-fh-50 text-fh-700 font-semibold border-fh-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium border-transparent"
                          }`}
                        >
                          <span
                            className={`material-symbols-outlined text-[18px] flex-shrink-0 ${isActive ? "text-fh-600" : "text-gray-600"}`}
                            style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            {item.icon}
                          </span>
                          <span className="flex-1">{item.label}</span>
                          {showBadge && (
                            <span className="w-4 h-4 rounded-full bg-fh-600 text-white text-[9px] font-bold flex items-center justify-center">
                              {cartCount}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* CTAs */}
        <div className="px-2 py-3 border-t border-gray-200 space-y-1.5">
          <Link
            href="/formations/apprenant/affiliation"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-white text-xs font-bold hover:opacity-90 transition-opacity bg-fh-600"
          >
            <span className="material-symbols-outlined text-[15px]">volunteer_activism</span>
            Devenir Affilié
            <span className="ml-auto text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-bold">40%</span>
          </Link>
          <Link
            href="/formations/explorer"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-md border border-fh-200 text-fh-600 text-xs font-semibold hover:bg-fh-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">explore</span>
            Explorer le catalogue
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/formations" })}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors border border-red-200"
          >
            <span className="material-symbols-outlined text-[15px]">logout</span>
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="md:ml-60 pt-14 min-h-screen flex flex-col">
        <div className="flex-1">{children}</div>
        <ApprenantFooter />
      </main>
    </div>
  );
}
