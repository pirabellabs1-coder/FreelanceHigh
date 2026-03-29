"use client";

import { useSession } from "next-auth/react";
import { hasPermission, type AdminRole, type AdminPermission } from "@/lib/admin-permissions";

/**
 * Hook to check current admin user's permission.
 * Returns the user's admin role and whether they have a specific permission.
 *
 * Usage:
 *   const { allowed, role, isLoading } = useAdminPermission("team.manage");
 *   if (!allowed) return <AccessDenied role={role} />;
 */
export function useAdminPermission(permission?: AdminPermission): {
  allowed: boolean;
  role: AdminRole | null;
  isLoading: boolean;
} {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  if (isLoading) {
    return { allowed: false, role: null, isLoading: true };
  }

  const role = (session?.user?.adminRole || "super_admin") as AdminRole;

  if (!permission) {
    return { allowed: true, role, isLoading: false };
  }

  return {
    allowed: hasPermission(role, permission),
    role,
    isLoading: false,
  };
}
