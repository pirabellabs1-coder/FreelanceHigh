"use client";

import type { TrackingEvent, TrackingEventType } from "./types";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getDeviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function getUtmParams(): { utmSource?: string; utmMedium?: string; utmCampaign?: string } {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
  };
}

class Tracker {
  private sessionId: string;
  private buffer: TrackingEvent[] = [];
  private flushInterval: ReturnType<typeof setInterval> | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private userId?: string;
  private deviceType: "mobile" | "tablet" | "desktop";
  private utmParams: ReturnType<typeof getUtmParams>;
  private started = false;

  constructor() {
    this.deviceType = "desktop";
    this.utmParams = {};
    this.sessionId = "";
  }

  start() {
    if (this.started || typeof window === "undefined") return;
    this.started = true;

    // Session ID persisted in sessionStorage
    const existing = sessionStorage.getItem("fh_session_id");
    if (existing) {
      this.sessionId = existing;
    } else {
      this.sessionId = generateId();
      sessionStorage.setItem("fh_session_id", this.sessionId);
    }

    this.deviceType = getDeviceType();
    this.utmParams = getUtmParams();

    // Start session on server
    this.sendSession("start");

    // Flush buffer every 5 seconds
    this.flushInterval = setInterval(() => this.flush(), 5000);

    // Heartbeat every 30 seconds
    this.heartbeatInterval = setInterval(() => this.sendSession("heartbeat"), 30000);

    // Flush on visibility change / unload
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    window.addEventListener("beforeunload", this.handleUnload);
  }

  stop() {
    if (!this.started) return;
    this.flush();
    this.sendSession("end");
    if (this.flushInterval) clearInterval(this.flushInterval);
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    window.removeEventListener("beforeunload", this.handleUnload);
    this.started = false;
  }

  setUserId(userId: string | undefined) {
    this.userId = userId;
  }

  track(
    type: TrackingEventType,
    extra?: { entityType?: TrackingEvent["entityType"]; entityId?: string; metadata?: Record<string, string | number> }
  ) {
    if (typeof window === "undefined") return;

    const event: TrackingEvent = {
      id: generateId(),
      type,
      userId: this.userId,
      sessionId: this.sessionId,
      path: window.location.pathname,
      deviceType: this.deviceType,
      referrer: document.referrer || undefined,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      ...this.utmParams,
      ...extra,
    };

    this.buffer.push(event);

    // Auto-flush if buffer is large
    if (this.buffer.length >= 20) this.flush();
  }

  trackPageView() {
    this.track("page_view");
  }

  private flush() {
    if (this.buffer.length === 0) return;

    const events = [...this.buffer];
    this.buffer = [];

    // Use sendBeacon for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/tracking/event",
        new Blob([JSON.stringify({ events })], { type: "application/json" })
      );
    } else {
      fetch("/api/tracking/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events }),
        keepalive: true,
      }).catch(() => {});
    }
  }

  private sendSession(action: "start" | "heartbeat" | "end") {
    const payload = {
      action,
      sessionId: this.sessionId,
      userId: this.userId,
      deviceType: this.deviceType,
      path: typeof window !== "undefined" ? window.location.pathname : "/",
      referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
      ...this.utmParams,
    };

    if (navigator.sendBeacon && action === "end") {
      navigator.sendBeacon(
        "/api/tracking/sessions",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );
    } else {
      fetch("/api/tracking/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  }

  private handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      this.flush();
    }
  };

  private handleUnload = () => {
    this.flush();
    this.sendSession("end");
  };
}

// Singleton
export const tracker = new Tracker();
