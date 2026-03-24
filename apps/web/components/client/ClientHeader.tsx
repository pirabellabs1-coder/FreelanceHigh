"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface ClientHeaderProps {
  onMenuClick: () => void;
}

export function ClientHeader({ onMenuClick }: ClientHeaderProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";

  return (
    <header className="h-14 sm:h-16 flex-shrink-0 flex items-center justify-between px-3 sm:px-6 lg:px-8 border-b border-border-dark bg-background-dark/80 backdrop-blur-md sticky top-0 z-30">
      {/* Left: mobile menu + search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 sm:p-2 -ml-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex-shrink-0"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="relative hidden sm:flex items-center flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 text-slate-500 text-lg">search</span>
          <input
            type="text"
            placeholder="Rechercher un projet..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-border-dark rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Right: notifications + actions + logout (mobile) + user */}
      <div className="flex items-center gap-1 sm:gap-2">
        <NotificationBell userId={userId} notificationsHref="/client/parametres" />

        <Link href="/client/aide" className="hidden sm:flex p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined text-xl">help</span>
        </Link>

        <Link href="/client/parametres" className="hidden sm:flex p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined text-xl">settings</span>
        </Link>

        {/* Mobile logout button — visible when sidebar is hidden */}
        <button
          onClick={() => signOut({ callbackUrl: "/connexion" })}
          className="lg:hidden p-1.5 sm:p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          title="Se déconnecter"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
        </button>

        {/* Profile: hide name on mobile, show only avatar */}
        <Link href="/client/profil" className="flex items-center gap-2 sm:gap-3 ml-1 sm:ml-2 pl-2 sm:pl-3 border-l border-border-dark">
          <span className="hidden sm:inline text-sm font-medium text-white">{session?.user?.name || "Client"}</span>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center overflow-hidden flex-shrink-0">
            <span className="text-primary text-[10px] sm:text-xs font-bold">
              {(session?.user?.name || "C").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
