"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ToastContainer } from "@/components/ui/toast";

const ADMIN_CSS_VARS = {
  "--color-primary": "220 38 38",
  "--color-bg-light": "248 246 246",
  "--color-bg-dark": "18 14 14",
  "--color-neutral-dark": "30 24 24",
  "--color-border-dark": "50 38 38",
} as React.CSSProperties;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={ADMIN_CSS_VARS} className="flex h-screen overflow-hidden bg-background-dark">
      <ToastContainer />
      <div className="hidden lg:flex flex-shrink-0">
        <AdminSidebar />
      </div>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50"><AdminSidebar /></div>
        </div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
