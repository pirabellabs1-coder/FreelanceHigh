"use client";

import { useState, useEffect } from "react";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { ToastContainer } from "@/components/ui/toast";
import { useClientStore } from "@/store/client";

const CLIENT_CSS_VARS = {
  "--color-primary": "25 230 66",
  "--color-bg-light": "246 248 246",
  "--color-bg-dark": "17 33 20",
  "--color-neutral-dark": "26 47 30",
  "--color-border-dark": "42 63 46",
} as React.CSSProperties;

const NOTIFICATION_POLL_INTERVAL = 30_000; // 30 seconds

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const syncAll = useClientStore((s) => s.syncAll);
  const syncNotifications = useClientStore((s) => s.syncNotifications);

  // Initialize store data on layout mount so sidebar badges are populated
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
    <div style={CLIENT_CSS_VARS} className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-sans">
      <ToastContainer />

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <ClientSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50 animate-slide-in">
            <ClientSidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ClientHeader onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
