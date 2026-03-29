"use client";

import Link from "next/link";
import { useAdminPermission } from "@/lib/use-admin-permission";
import { ADMIN_ROLE_LABELS, type AdminPermission } from "@/lib/admin-permissions";

/**
 * Wraps admin page content. Shows "Access Denied" if the current user's
 * admin role does not have the required permission.
 */
export function AdminPermissionGuard({
  permission,
  children,
}: {
  permission: AdminPermission;
  children: React.ReactNode;
}) {
  const { allowed, role, isLoading } = useAdminPermission(permission);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!allowed) {
    const roleLabel = role ? (ADMIN_ROLE_LABELS[role] || role) : "Inconnu";
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-3xl text-red-400">gpp_bad</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Acces non autorise</h2>
        <p className="text-sm text-slate-400 max-w-md mb-2">
          Votre role <span className="font-bold text-white">{roleLabel}</span> ne dispose pas de la permission requise pour acceder a cette page.
        </p>
        <p className="text-xs text-slate-600 mb-6">
          Permission requise : <code className="text-slate-400">{permission}</code>
        </p>
        <Link href="/admin" className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
          Retour au dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
