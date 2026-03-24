"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { NotificationBell } from "@/components/notifications/NotificationBell";

export function AdminHeader({ onMobileMenu }: { onMobileMenu: () => void }) {
  return (
    <header className="h-14 border-b border-border-dark flex items-center justify-between px-4 sm:px-6 shrink-0 bg-neutral-dark/50">
      <div className="flex items-center gap-3">
        <button onClick={onMobileMenu} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-border-dark transition-colors">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
          <input placeholder="Rechercher utilisateur, commande, service..." className="w-full max-w-xs lg:w-80 pl-10 pr-4 py-2 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50" />
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          En ligne
        </span>
        <NotificationBell userId="admin-1" notificationsHref="/admin/notifications" />
        <Link href="/admin/configuration" className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors hidden sm:flex">
          <span className="material-symbols-outlined text-lg">settings</span>
        </Link>
        <Link href="/admin" className="hidden sm:flex items-center gap-2 ml-1 px-2 py-1.5 rounded-xl hover:bg-border-dark/50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">AP</div>
          <span className="text-sm font-semibold text-white hidden md:inline">Admin</span>
        </Link>
        {/* Mobile logout — always visible on small screens */}
        <button
          onClick={() => signOut({ callbackUrl: "/connexion" })}
          className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span className="text-xs font-semibold hidden xs:inline sm:inline">Deconnexion</span>
        </button>
      </div>
    </header>
  );
}
