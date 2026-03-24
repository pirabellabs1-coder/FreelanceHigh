"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileSidebarOverlay } from "@/components/ui/MobileSidebarOverlay";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ToastContainer } from "@/components/ui/toast";
import { AccessDeniedToast } from "@/components/auth/AccessDeniedToast";
import { useAdminStore } from "@/store/admin";

const ADMIN_CSS_VARS = {
  "--color-primary": "220 38 38",
  "--color-bg-light": "248 250 252",
  "--color-bg-dark": "15 23 42",
  "--color-neutral-dark": "17 24 39",
  "--color-border-dark": "31 41 55",
} as React.CSSProperties;

const IS_DEV = process.env.NODE_ENV === "development";
const ADMIN_POLL_INTERVAL = IS_DEV ? 300_000 : 30_000; // 5min en dev, 30s en prod

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const syncDashboard = useAdminStore((s) => s.syncDashboard);

  // Initial sync on mount
  useEffect(() => {
    syncDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll dashboard metrics every 30s for real-time alerts
  useEffect(() => {
    const interval = setInterval(() => {
      syncDashboard();
    }, ADMIN_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [syncDashboard]);

  return (
    <div style={ADMIN_CSS_VARS} className="flex h-screen overflow-hidden bg-background-dark text-slate-100">
      <ToastContainer />
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0 relative">
        <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />
      </div>
      {/* Mobile sidebar overlay */}
      <MobileSidebarOverlay open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <AdminSidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
      </MobileSidebarOverlay>
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <AccessDeniedToast />
          {children}
        </main>
      </div>
    </div>
  );
}
