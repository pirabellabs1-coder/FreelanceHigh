"use client";

import { useState, useEffect } from "react";
import { AgenceSidebar } from "@/components/agence/AgenceSidebar";
import { AgenceHeader } from "@/components/agence/AgenceHeader";
import { ToastContainer } from "@/components/ui/toast";
import { useAgencyStore } from "@/store/agency";

const AGENCE_CSS_VARS = {
  "--color-primary": "20 184 53",
  "--color-bg-light": "246 248 246",
  "--color-bg-dark": "17 33 20",
  "--color-neutral-dark": "26 47 30",
  "--color-border-dark": "42 63 46",
} as React.CSSProperties;

const NOTIFICATION_POLL_INTERVAL = 30_000; // 30 seconds

export default function AgenceLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const syncAll = useAgencyStore((s) => s.syncAll);
  const syncNotifications = useAgencyStore((s) => s.syncNotifications);

  // Initialize store data on layout mount
  useEffect(() => {
    syncAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll notifications every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      syncNotifications();
    }, NOTIFICATION_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [syncNotifications]);

  return (
    <div style={AGENCE_CSS_VARS} className="flex h-screen overflow-hidden bg-background-dark font-sans">
      <ToastContainer />

      <div className="hidden lg:flex flex-shrink-0">
        <AgenceSidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50 animate-slide-in">
            <AgenceSidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <AgenceHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
