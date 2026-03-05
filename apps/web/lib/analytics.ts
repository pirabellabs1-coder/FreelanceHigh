// FreelanceHigh — Google Analytics event tracking
// Usage: import { trackEvent } from "@/lib/analytics";

type GAEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

export function trackEvent({ action, category, label, value }: GAEvent) {
  if (typeof window === "undefined") return;
  if (!window.gtag) return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
}

// Pre-defined events
export const analytics = {
  // Auth
  signUp: (method: string) => trackEvent({ action: "sign_up", category: "auth", label: method }),
  signIn: (method: string) => trackEvent({ action: "login", category: "auth", label: method }),

  // Services
  serviceCreated: (category: string) => trackEvent({ action: "service_created", category: "services", label: category }),
  serviceViewed: (serviceId: string) => trackEvent({ action: "service_viewed", category: "services", label: serviceId }),

  // Orders
  orderPlaced: (amount: number) => trackEvent({ action: "order_placed", category: "orders", value: amount }),
  orderCompleted: (amount: number) => trackEvent({ action: "order_completed", category: "orders", value: amount }),

  // Messaging
  messageSent: () => trackEvent({ action: "message_sent", category: "messaging" }),

  // Search
  searchPerformed: (query: string) => trackEvent({ action: "search", category: "search", label: query }),
};

// Extend window type for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
