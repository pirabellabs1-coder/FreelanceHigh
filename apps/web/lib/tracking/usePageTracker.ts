"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { tracker } from "./tracker";

export function usePageTracker() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const prevPathRef = useRef<string>("");

  // Initialize tracker once
  useEffect(() => {
    tracker.start();
    return () => tracker.stop();
  }, []);

  // Update userId when session changes
  useEffect(() => {
    tracker.setUserId(session?.user?.id || undefined);
  }, [session?.user?.id]);

  // Track page views on route change
  useEffect(() => {
    if (pathname && pathname !== prevPathRef.current) {
      prevPathRef.current = pathname;
      tracker.trackPageView();
    }
  }, [pathname]);
}
