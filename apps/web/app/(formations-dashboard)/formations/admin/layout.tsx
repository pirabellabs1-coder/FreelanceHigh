"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

const navItems = [
  { icon: "dashboard", label: "Vue générale", href: "/formations/admin/dashboard" },
  { icon: "inventory_2", label: "Produits", href: "/formations/admin/produits" },
  { icon: "people", label: "Utilisateurs", href: "/formations/admin/utilisateurs" },
  { icon: "receipt_long", label: "Transactions", href: "/formations/admin/transactions" },
  { icon: "comment", label: "Commentaires", href: "/formations/admin/commentaires" },
  { icon: "flag", label: "Signalements", href: "/formations/admin/signalements" },
  { icon: "gavel", label: "Disputes mentor", href: "/formations/admin/mentor-disputes" },
  { icon: "badge", label: "Vérification KYC", href: "/formations/admin/kyc" },
  { icon: "settings", label: "Configuration", href: "/formations/admin/configuration" },
];

function getInitials(name?: string | null): string {
  if (!name) return "AD";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type BadgeCounts = {
  reports: number;
  comments: number;
  kyc: number;
  disputes: number;
  refunds: number;
};

type PendingCountsResponse = {
  data: {
    kyc: number;
    signalements: number;
    disputes: number;
    refunds: number;
    failedOrders24h: number;
    successOrders24h: number;
  };
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();

  const displayName = session?.user?.name ?? "Super Admin";
  const displayEmail = session?.user?.email ?? "admin@freelancehigh.com";
  const initials = getInitials(session?.user?.name);
  const avatarUrl = session?.user?.image;

  // Live pending counts — refetch every 30s for real-time badge updates
  const { data: pendingRes } = useQuery<PendingCountsResponse>({
    queryKey: ["admin-pending-counts"],
    queryFn: () => fetch("/api/formations/admin/pending-counts").then((r) => r.json()),
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });

  const { data: commentsRes } = useQuery<{ data: unknown[]; summary: { withoutResponse: number } | null }>({
    queryKey: ["admin-commentaires"],
    queryFn: () => fetch("/api/formations/admin/commentaires").then((r) => r.json()),
    staleTime: 60_000,
  });

  const badges: BadgeCounts = {
    reports: pendingRes?.data?.signalements ?? 0,
    comments: commentsRes?.summary?.withoutResponse ?? 0,
    kyc: pendingRes?.data?.kyc ?? 0,
    disputes: pendingRes?.data?.disputes ?? 0,
    refunds: pendingRes?.data?.refunds ?? 0,
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-14 flex items-center px-4 md:px-6 gap-4">
        {/* Hamburger (mobile) */}
        <button
          className="md:hidden p-1.5 rounded-md hover:bg-gray-100 text-gray-900"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <span className="material-symbols-outlined text-[18px]">menu</span>
        </button>

        {/* Logo */}
        <Link href="/formations/admin/dashboard" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-md flex items-center justify-center bg-fh-600">
            <span className="text-white font-bold text-[10px] tracking-tight">NK</span>
          </div>
          <span className="hidden sm:block font-bold text-gray-900 text-base">Novakou</span>
        </Link>

        {/* Admin badge */}
        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white bg-gray-900">
          <span className="material-symbols-outlined text-[11px]">shield</span>
          Admin Panel
        </span>

        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <button className="relative p-1.5 rounded-full hover:bg-gray-100 text-gray-600">
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>
          <button className="relative p-1.5 rounded-full hover:bg-gray-100 text-gray-600">
            <span className="material-symbols-outlined text-[18px]">settings</span>
          </button>
          {/* Admin avatar */}
          <div className="flex items-center gap-2 ml-1">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 bg-fh-600"
              >
                {initials}
              </div>
            )}
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-gray-900 leading-none">{displayName}</p>
              <p className="text-[10px] text-gray-600">{displayEmail}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-60 bg-white border-r border-gray-200 pt-14 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Admin info */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 bg-fh-600">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-xs truncate">{displayName}</p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-fh-600 rounded-full"></span>
                <p className="text-[10px] text-gray-600">Accès complet</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Administration
          </p>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
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
                      className={`material-symbols-outlined text-[18px] flex-shrink-0 ${
                        isActive ? "text-fh-600" : "text-gray-600"
                      }`}
                      style={{
                        fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                      }}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                    {item.icon === "flag" && badges.reports > 0 && (
                      <span className="ml-auto bg-red-100 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {badges.reports}
                      </span>
                    )}
                    {item.icon === "comment" && badges.comments > 0 && (
                      <span className="ml-auto bg-yellow-100 text-yellow-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {badges.comments}
                      </span>
                    )}
                    {item.icon === "gavel" && badges.disputes > 0 && (
                      <span className="ml-auto bg-red-100 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {badges.disputes}
                      </span>
                    )}
                    {item.icon === "badge" && badges.kyc > 0 && (
                      <span className="ml-auto bg-orange-100 text-orange-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {badges.kyc}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Accès rapide
            </p>
            <Link
              href="/formations"
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150 border-l-2 border-transparent"
            >
              <span className="material-symbols-outlined text-[18px] flex-shrink-0 text-gray-600">open_in_new</span>
              Voir la plateforme
            </Link>
            <Link
              href="/formations/explorer"
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150 border-l-2 border-transparent"
            >
              <span className="material-symbols-outlined text-[18px] flex-shrink-0 text-gray-600">storefront</span>
              Marketplace
            </Link>
          </div>
        </nav>

        {/* Bottom section */}
        <div className="px-2 py-3 border-t border-gray-200">
          <button className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-150">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="md:ml-60 pt-14 min-h-screen">{children}</main>
    </div>
  );
}
