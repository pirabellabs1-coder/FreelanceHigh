"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { RoleGuard } from "@/components/formations/RoleGuard";

type NavItem = {
  icon: string;
  label: string;
  href: string;
  badge?: string;
  section?: string;
};

// Mapping segments techniques → libellés français pour les breadcrumbs
const SEGMENT_LABELS: Record<string, string> = {
  formations: "Accueil",
  vendeur: "Espace vendeur",
  dashboard: "Tableau de bord",
  produits: "Produits",
  nouveau: "Nouveau",
  creer: "Créer",
  editer: "Éditer",
  automatisations: "Automatisations",
  marketing: "Marketing",
  statistiques: "Statistiques",
  transactions: "Transactions",
  messages: "Messages",
  communaute: "Communauté",
  coaching: "Coaching",
  ressources: "Ressources",
  "api-keys": "Clés API",
  profil: "Mon profil",
  kyc: "Vérification KYC",
  boutique: "Ma boutique",
  parametres: "Paramètres",
  wallet: "Revenus & retraits",
  explorer: "Explorer",
  mentors: "Mentors",
};

type Crumb = { label: string; href: string; isLast: boolean };

function buildBreadcrumbs(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return [];

  const crumbs: Crumb[] = [];
  let acc = "";
  segments.forEach((segment, idx) => {
    acc += `/${segment}`;
    // Ignorer les IDs (cuid/uuid-like) en se basant sur la longueur et l'absence de mapping
    const isLikelyId = !SEGMENT_LABELS[segment] && segment.length >= 16;
    if (isLikelyId) return;
    const label = SEGMENT_LABELS[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
    crumbs.push({
      label,
      href: acc,
      isLast: idx === segments.length - 1,
    });
  });
  // Marquer le dernier réel (après filtrage)
  if (crumbs.length > 0) {
    crumbs.forEach((c, i) => {
      c.isLast = i === crumbs.length - 1;
    });
  }
  return crumbs;
}

const navItems: NavItem[] = [
  // Vue
  { icon: "dashboard", label: "Tableau de bord", href: "/formations/vendeur/dashboard", section: "Vue" },
  { icon: "bar_chart", label: "Statistiques", href: "/formations/vendeur/statistiques", section: "Vue" },
  // Catalogue
  { icon: "storefront", label: "Mes produits", href: "/formations/vendeur/produits", section: "Catalogue" },
  { icon: "receipt_long", label: "Transactions", href: "/formations/vendeur/transactions", section: "Catalogue" },
  { icon: "account_balance_wallet", label: "Revenus & retraits", href: "/formations/wallet", section: "Catalogue" },
  // Croissance
  { icon: "campaign", label: "Marketing", href: "/formations/vendeur/marketing", section: "Croissance" },
  { icon: "bolt", label: "Automatisations", href: "/formations/vendeur/automatisations", section: "Croissance" },
  // Engagement
  { icon: "chat_bubble", label: "Messages", href: "/formations/messages", section: "Engagement" },
  { icon: "groups", label: "Communauté", href: "/formations/vendeur/communaute", section: "Engagement" },
  { icon: "support_agent", label: "Coaching", href: "/formations/vendeur/coaching", section: "Engagement", badge: "Pro" },
  { icon: "folder_open", label: "Ressources", href: "/formations/vendeur/ressources", section: "Engagement" },
  // Développeur
  { icon: "key", label: "Clés API", href: "/formations/vendeur/api-keys", section: "Développeur" },
  { icon: "menu_book", label: "Documentation API", href: "/developer/docs", section: "Développeur" },
  // Compte
  { icon: "account_circle", label: "Mon profil", href: "/formations/vendeur/profil", section: "Compte" },
  { icon: "verified_user", label: "Vérification KYC", href: "/formations/kyc", section: "Compte" },
  { icon: "storefront", label: "Ma boutique", href: "/formations/boutique", section: "Compte" },
  { icon: "settings", label: "Paramètres", href: "/formations/vendeur/parametres", section: "Compte" },
  // Découvrir
  { icon: "explore", label: "Explorer la marketplace", href: "/formations/explorer", section: "Découvrir" },
  { icon: "record_voice_over", label: "Trouver un mentor", href: "/formations/mentors", section: "Découvrir" },
];

// Group nav items by section
const sections = Array.from(new Set(navItems.map((n) => n.section))).filter(Boolean) as string[];

function getInitials(name?: string | null): string {
  if (!name) return "FH";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function VendeurLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard requiredRole="instructeur">
      <VendeurLayoutInner>{children}</VendeurLayoutInner>
    </RoleGuard>
  );
}

function VendeurLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  // Collapsed sidebar on desktop (persisted in localStorage)
  const [collapsed, setCollapsed] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("vendeur-sidebar-collapsed");
      if (saved === "true") setCollapsed(true);
    } catch { /* ignore */ }
  }, []);

  // Fermer le menu FAB au clic à l'extérieur ou à l'appui sur Escape
  useEffect(() => {
    if (!fabOpen) return;
    function onDocClick(e: MouseEvent) {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) {
        setFabOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setFabOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [fabOpen]);

  // Fermer le FAB en cas de navigation
  useEffect(() => {
    setFabOpen(false);
  }, [pathname]);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    try { localStorage.setItem("vendeur-sidebar-collapsed", String(next)); } catch { /* ignore */ }
  }

  const displayName = session?.user?.name ?? "Instructeur";
  const initials = getInitials(session?.user?.name);
  const avatarUrl = session?.user?.image;

  const sidebarWidth = collapsed ? "w-16" : "w-60";
  const mainOffset = collapsed ? "md:ml-16" : "md:ml-60";

  // FAB caché sur pages de création / édition (redondant)
  const hideFab = pathname.includes("/nouveau") || pathname.includes("/editer") || pathname.includes("/creer");

  // Breadcrumbs (à partir de "formations" — on saute le premier "Accueil" technique)
  const crumbs = buildBreadcrumbs(pathname);

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-14 flex items-center px-4 md:px-6 gap-3">
        {/* Mobile hamburger */}
        <button
          className="md:hidden p-1.5 rounded-md hover:bg-gray-100 text-gray-900"
          onClick={() => setMobileOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <span className="material-symbols-outlined text-[18px]">menu</span>
        </button>

        {/* Desktop collapse toggle */}
        <button
          onClick={toggleCollapsed}
          className="hidden md:flex p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
          aria-label={collapsed ? "Étendre le menu" : "Réduire le menu"}
          title={collapsed ? "Étendre le menu" : "Réduire le menu"}
        >
          <span className="material-symbols-outlined text-[18px]">
            {collapsed ? "menu_open" : "menu"}
          </span>
        </button>

        {/* Logo */}
        <Link href="/formations/vendeur/dashboard" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-md flex items-center justify-center bg-fh-600">
            <span className="text-white font-bold text-[10px] tracking-tight">NK</span>
          </div>
          <span className="hidden sm:block font-bold text-gray-900 text-base">Novakou</span>
        </Link>

        {/* Vendor badge */}
        <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-full">
          <span className="material-symbols-outlined text-amber-500 text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
          <span className="text-amber-700 text-[10px] font-semibold">Espace Vendeur</span>
        </div>

        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <button className="relative p-1.5 rounded-full hover:bg-gray-100 text-gray-600" aria-label="Notifications">
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-400 rounded-full ring-2 ring-white" />
          </button>
          <button className="relative p-1.5 rounded-full hover:bg-gray-100 text-gray-600" aria-label="Aide">
            <span className="material-symbols-outlined text-[18px]">help_outline</span>
          </button>
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover flex-shrink-0 ml-1 ring-1 ring-gray-200" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ml-1 ring-1 ring-gray-200">
              {initials}
            </div>
          )}
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 bg-white border-r border-gray-200 pt-14 flex flex-col transition-all duration-300 ${sidebarWidth} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${mobileOpen ? "w-60" : ""}`}
      >
        {/* Close button mobile */}
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden absolute top-3 right-3 p-1 rounded-md hover:bg-gray-100"
          >
            <span className="material-symbols-outlined text-[18px] text-gray-600">close</span>
          </button>
        )}

        {/* Instructor info */}
        <div className={`border-b border-gray-200 transition-all ${collapsed && !mobileOpen ? "py-3 px-2" : "px-4 py-3"}`}>
          <div className={`flex items-center ${collapsed && !mobileOpen ? "justify-center" : "gap-2.5"}`}>
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-fh-200" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                {initials}
              </div>
            )}
            {(!collapsed || mobileOpen) && (
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-xs truncate">{displayName}</p>
                <p className="text-[11px] text-gray-600 flex items-center gap-1">
                  <span className="material-symbols-outlined text-amber-500 text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                  Instructeur
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation — sectioned */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          {sections.map((section) => {
            const items = navItems.filter((n) => n.section === section);
            return (
              <div key={section} className="mt-4 first:mt-0">
                {(!collapsed || mobileOpen) && (
                  <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {section}
                  </p>
                )}
                <ul className="space-y-0.5">
                  {items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          title={collapsed && !mobileOpen ? item.label : undefined}
                          className={`group flex items-center gap-2.5 rounded-md text-sm transition-all duration-150 ${
                            collapsed && !mobileOpen ? "justify-center px-2 py-2" : "px-3 py-2"
                          } ${
                            isActive
                              ? "bg-fh-50 text-fh-700 font-semibold border-l-2 border-fh-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium border-l-2 border-transparent"
                          }`}
                        >
                          <span
                            className={`material-symbols-outlined text-[18px] flex-shrink-0 ${
                              isActive ? "text-fh-600" : "text-gray-600 group-hover:text-gray-900"
                            }`}
                            style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            {item.icon}
                          </span>
                          {(!collapsed || mobileOpen) && (
                            <>
                              <span className="truncate">{item.label}</span>
                              {item.badge && (
                                <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                  {item.badge}
                                </span>
                              )}
                            </>
                          )}
                          {collapsed && !mobileOpen && item.badge && (
                            <span className="absolute ml-7 -mt-4 text-[8px] font-bold w-2.5 h-2.5 rounded-full bg-amber-400" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* Sign out only (Create product CTA retiré) */}
        <div className={`border-t border-gray-200 ${collapsed && !mobileOpen ? "p-2" : "px-2 py-3"}`}>
          <button
            onClick={() => signOut({ callbackUrl: "/formations" })}
            title={collapsed && !mobileOpen ? "Se déconnecter" : undefined}
            className={`flex items-center justify-center gap-2 w-full rounded-md text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors border border-red-200 ${
              collapsed && !mobileOpen ? "py-1.5 px-2" : "py-2 px-3"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">logout</span>
            {(!collapsed || mobileOpen) && "Se déconnecter"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`pt-14 min-h-screen transition-all duration-300 ${mainOffset}`}>
        {/* Breadcrumbs contextuels */}
        {crumbs.length > 1 && (
          <nav
            aria-label="Fil d'Ariane"
            className="px-4 py-2 md:px-6"
          >
            <ol className="flex items-center flex-wrap gap-1 text-xs text-gray-500">
              {crumbs.map((crumb, idx) => (
                <li key={crumb.href} className="flex items-center gap-1">
                  {idx > 0 && <span className="text-gray-300 select-none" aria-hidden>›</span>}
                  {crumb.isLast ? (
                    <span className="text-gray-900 font-medium truncate max-w-[180px]" aria-current="page">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="hover:text-fh-600 hover:underline truncate max-w-[180px] transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {children}
      </main>

      {/* FAB — Création rapide */}
      {!hideFab && (
        <div
          ref={fabRef}
          className="fixed bottom-6 right-6 z-40"
        >
          {/* Mini-menu */}
          {fabOpen && (
            <div
              role="menu"
              aria-label="Menu de création"
              className="absolute bottom-[60px] right-0 w-60 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150"
            >
              <div className="px-3 py-2 border-b border-gray-200">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Créer</p>
              </div>
              <Link
                href="/formations/vendeur/produits/nouveau?type=formation"
                role="menuitem"
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors group"
                onClick={() => setFabOpen(false)}
              >
                <span
                  className="material-symbols-outlined text-[18px] text-fh-600 flex-shrink-0"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  school
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900">Nouvelle formation</p>
                  <p className="text-[10px] text-gray-600">Cours vidéo · modules</p>
                </div>
              </Link>
              <Link
                href="/formations/vendeur/produits/nouveau?type=digital"
                role="menuitem"
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors group"
                onClick={() => setFabOpen(false)}
              >
                <span
                  className="material-symbols-outlined text-[18px] text-fh-600 flex-shrink-0"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  download
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900">Nouveau produit numérique</p>
                  <p className="text-[10px] text-gray-600">E-book · template · pack</p>
                </div>
              </Link>
              <Link
                href="/formations/vendeur/automatisations"
                role="menuitem"
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors group"
                onClick={() => setFabOpen(false)}
              >
                <span
                  className="material-symbols-outlined text-[18px] text-fh-600 flex-shrink-0"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  bolt
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900">Nouvelle automatisation</p>
                  <p className="text-[10px] text-gray-600">Workflow déclencheur → action</p>
                </div>
              </Link>
            </div>
          )}

          {/* Bouton principal */}
          <button
            type="button"
            onClick={() => setFabOpen((v) => !v)}
            aria-label={fabOpen ? "Fermer le menu de création" : "Ouvrir le menu de création"}
            aria-expanded={fabOpen}
            aria-haspopup="menu"
            className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 bg-fh-600"
          >
            <span
              className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${fabOpen ? "rotate-45" : "rotate-0"}`}
            >
              add
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
