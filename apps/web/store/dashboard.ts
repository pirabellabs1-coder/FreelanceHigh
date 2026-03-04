"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEMO_SERVICES, DEMO_ORDERS, DEMO_TRANSACTIONS, DEMO_CONVERSATIONS,
  DEMO_PORTFOLIO, DEMO_PROFILE, DEMO_AVAILABILITY, DEMO_NOTIFICATION_SETTINGS,
  type Service, type Order, type Transaction, type Conversation, type ChatMessage,
  type PortfolioProject, type FreelancerProfile, type AvailabilitySlot,
  type NotificationSetting, type OrderMessage, type OrderFile,
} from "@/lib/demo-data";

// ============================================================
// Toast store
// ============================================================
export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}

interface ToastState {
  toasts: Toast[];
  addToast: (type: Toast["type"], message: string) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (type, message) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// ============================================================
// Dashboard store — all freelance dashboard state
// ============================================================
interface DashboardState {
  // Services
  services: Service[];
  addService: (service: Omit<Service, "id" | "views" | "clicks" | "orders" | "revenue" | "conversionRate" | "createdAt"> & { extras?: Service["extras"] }) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
  toggleServiceStatus: (id: string) => void;

  // Orders
  orders: Order[];
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  addOrderMessage: (orderId: string, message: Omit<OrderMessage, "id">) => void;
  addOrderFile: (orderId: string, file: Omit<OrderFile, "id">) => void;

  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, "id">) => void;

  // Conversations
  conversations: Conversation[];
  sendMessage: (convId: string, content: string, type?: ChatMessage["type"], fileName?: string, fileSize?: string) => void;
  markConversationRead: (convId: string) => void;

  // Portfolio
  portfolio: PortfolioProject[];
  addPortfolioProject: (project: Omit<PortfolioProject, "id" | "createdAt" | "order">) => void;
  updatePortfolioProject: (id: string, updates: Partial<PortfolioProject>) => void;
  deletePortfolioProject: (id: string) => void;
  reorderPortfolio: (projects: PortfolioProject[]) => void;

  // Profile
  profile: FreelancerProfile;
  updateProfile: (updates: Partial<FreelancerProfile>) => void;

  // Availability
  availability: AvailabilitySlot[];
  vacationMode: boolean;
  updateAvailability: (day: number, updates: Partial<AvailabilitySlot>) => void;
  toggleVacationMode: () => void;

  // Notifications
  notificationSettings: NotificationSetting[];
  updateNotificationSetting: (id: string, updates: Partial<NotificationSetting>) => void;

  // Settings
  settings: {
    language: string;
    theme: "clair" | "sombre";
    twoFactorEnabled: boolean;
  };
  updateSettings: (updates: Partial<DashboardState["settings"]>) => void;

  // Subscription
  currentPlan: string;
  changePlan: (planId: string) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      // Services
      services: DEMO_SERVICES,
      addService: (service) => {
        const id = "s" + (Date.now().toString(36));
        const newService: Service = {
          ...service,
          id,
          extras: service.extras || [],
          views: 0,
          clicks: 0,
          orders: 0,
          revenue: 0,
          conversionRate: 0,
          createdAt: new Date().toISOString().slice(0, 10),
        };
        set((s) => ({ services: [newService, ...s.services] }));
      },
      updateService: (id, updates) =>
        set((s) => ({ services: s.services.map((sv) => (sv.id === id ? { ...sv, ...updates } : sv)) })),
      deleteService: (id) =>
        set((s) => ({ services: s.services.filter((sv) => sv.id !== id) })),
      toggleServiceStatus: (id) =>
        set((s) => ({
          services: s.services.map((sv) =>
            sv.id === id ? { ...sv, status: sv.status === "actif" ? "pause" : "actif" } : sv
          ),
        })),

      // Orders
      orders: DEMO_ORDERS,
      updateOrderStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) => {
            if (o.id !== id) return o;
            const updates: Partial<Order> = { status };
            if (status === "livre") {
              updates.deliveredAt = new Date().toISOString();
              updates.progress = 100;
              updates.timeline = [
                ...o.timeline,
                {
                  id: "t" + Date.now(),
                  type: "delivered",
                  title: "Livraison effectuee",
                  description: "Vous avez livré la commande",
                  timestamp: new Date().toISOString(),
                },
              ];
            }
            if (status === "en_cours" && o.status === "en_attente") {
              updates.progress = 10;
              updates.timeline = [
                ...o.timeline,
                {
                  id: "t" + Date.now(),
                  type: "started",
                  title: "Travail demarre",
                  description: "Vous avez commencé le travail",
                  timestamp: new Date().toISOString(),
                },
              ];
            }
            if (status === "termine") {
              updates.progress = 100;
              updates.timeline = [
                ...o.timeline,
                {
                  id: "t" + Date.now(),
                  type: "completed",
                  title: "Commande terminee",
                  description: "Le client a validé la livraison",
                  timestamp: new Date().toISOString(),
                },
              ];
            }
            return { ...o, ...updates };
          }),
        })),
      addOrderMessage: (orderId, message) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === orderId
              ? { ...o, messages: [...o.messages, { ...message, id: "m" + Date.now() }] }
              : o
          ),
        })),
      addOrderFile: (orderId, file) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === orderId
              ? { ...o, files: [...o.files, { ...file, id: "f" + Date.now() }] }
              : o
          ),
        })),

      // Transactions
      transactions: DEMO_TRANSACTIONS,
      addTransaction: (tx) => {
        const id = "tx" + Date.now();
        set((s) => ({ transactions: [{ ...tx, id }, ...s.transactions] }));
      },

      // Conversations
      conversations: DEMO_CONVERSATIONS,
      sendMessage: (convId, content, type = "text", fileName, fileSize) =>
        set((s) => ({
          conversations: s.conversations.map((c) => {
            if (c.id !== convId) return c;
            const newMsg: ChatMessage = {
              id: "cm" + Date.now(),
              sender: "me",
              content,
              timestamp: new Date().toISOString(),
              type,
              fileName,
              fileSize,
              read: true,
            };
            return {
              ...c,
              messages: [...c.messages, newMsg],
              lastMessage: content,
              lastMessageTime: new Date().toISOString(),
            };
          }),
        })),
      markConversationRead: (convId) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  unread: 0,
                  messages: c.messages.map((m) => ({ ...m, read: true })),
                }
              : c
          ),
        })),

      // Portfolio
      portfolio: DEMO_PORTFOLIO,
      addPortfolioProject: (project) => {
        const id = "p" + Date.now();
        const order = get().portfolio.length;
        set((s) => ({
          portfolio: [
            ...s.portfolio,
            { ...project, id, createdAt: new Date().toISOString().slice(0, 10), order },
          ],
        }));
      },
      updatePortfolioProject: (id, updates) =>
        set((s) => ({
          portfolio: s.portfolio.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      deletePortfolioProject: (id) =>
        set((s) => ({ portfolio: s.portfolio.filter((p) => p.id !== id) })),
      reorderPortfolio: (projects) => set({ portfolio: projects }),

      // Profile
      profile: DEMO_PROFILE,
      updateProfile: (updates) =>
        set((s) => ({ profile: { ...s.profile, ...updates } })),

      // Availability
      availability: DEMO_AVAILABILITY,
      vacationMode: false,
      updateAvailability: (day, updates) =>
        set((s) => ({
          availability: s.availability.map((a) => (a.day === day ? { ...a, ...updates } : a)),
        })),
      toggleVacationMode: () =>
        set((s) => {
          const newMode = !s.vacationMode;
          if (newMode) {
            return {
              vacationMode: newMode,
              services: s.services.map((sv) =>
                sv.status === "actif" ? { ...sv, status: "pause" as const } : sv
              ),
            };
          }
          return { vacationMode: newMode };
        }),

      // Notifications
      notificationSettings: DEMO_NOTIFICATION_SETTINGS,
      updateNotificationSetting: (id, updates) =>
        set((s) => ({
          notificationSettings: s.notificationSettings.map((n) =>
            n.id === id ? { ...n, ...updates } : n
          ),
        })),

      // Settings
      settings: {
        language: "fr",
        theme: "sombre" as const,
        twoFactorEnabled: false,
      },
      updateSettings: (updates) =>
        set((s) => ({ settings: { ...s.settings, ...updates } })),

      // Subscription
      currentPlan: "pro",
      changePlan: (planId) => set({ currentPlan: planId }),
    }),
    {
      name: "freelancehigh-dashboard",
      partialize: (state) => ({
        services: state.services,
        orders: state.orders,
        transactions: state.transactions,
        conversations: state.conversations,
        portfolio: state.portfolio,
        profile: state.profile,
        availability: state.availability,
        vacationMode: state.vacationMode,
        notificationSettings: state.notificationSettings,
        settings: state.settings,
        currentPlan: state.currentPlan,
      }),
    }
  )
);
