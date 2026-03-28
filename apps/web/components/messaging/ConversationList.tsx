"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { UnifiedConversation, ConversationType } from "@/store/messaging";

// Detect garbage display text: technical IDs, URLs, long filenames
function isGarbageDisplay(str: string): boolean {
  if (!str) return false;
  const s = str.trim();
  if (s.length < 3) return false;
  // URLs (http/https/cloudinary/data:)
  if (/^(https?:\/\/|data:|blob:)/i.test(s)) return true;
  // CUIDs: starts with c + 20+ alphanumeric
  if (/^c[a-z0-9]{20,}$/i.test(s)) return true;
  // UUIDs
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(s)) return true;
  // Long alphanumeric tokens (24+ chars without spaces)
  if (s.length >= 24 && /^[a-z0-9_./-]+$/i.test(s) && !s.includes(" ")) return true;
  return false;
}

// Make lastMessage human-readable
function humanizeLastMessage(text: string): string {
  if (!text) return "";
  const s = text.trim();
  // URL → "Lien"
  if (/^https?:\/\//i.test(s)) return "Lien";
  // File extensions → "Photo" or "Fichier"
  if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(s)) return "Photo";
  if (/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar|7z|mp4|webm|mov)$/i.test(s)) return "Fichier";
  // Technical IDs
  if (isGarbageDisplay(s)) return "...";
  return s;
}

function sanitizeName(text: string, fallback: string): string {
  if (!text || isGarbageDisplay(text.trim())) return fallback;
  return text;
}

const TYPE_BADGES: Record<ConversationType, { label: string; cls: string; icon: string }> = {
  direct: { label: "Direct", cls: "bg-blue-500/20 text-blue-400", icon: "chat" },
  group: { label: "Groupe", cls: "bg-primary/10 text-primary", icon: "group" },
  order: { label: "Commande", cls: "bg-amber-500/20 text-amber-400", icon: "shopping_cart" },
  admin: { label: "Admin", cls: "bg-red-500/20 text-red-400", icon: "admin_panel_settings" },
};

function formatTime(ts: string) {
  const d = new Date(ts);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return d.toLocaleDateString("fr-FR", { weekday: "short" });
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

interface ConversationListProps {
  conversations: UnifiedConversation[];
  currentUserId: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  showTypeFilter?: boolean;
  showAllTypes?: boolean;
  isLoading?: boolean;
}

export function ConversationList({
  conversations,
  currentUserId,
  selectedId,
  onSelect,
  showTypeFilter = false,
  showAllTypes = false,
  isLoading = false,
}: ConversationListProps) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("tous");

  const totalUnread = (conversations || []).reduce((s, c) => s + (c.unreadCount || 0), 0);

  const filtered = useMemo(() => {
    let list = conversations;

    if (filterType !== "tous") {
      list = list.filter((c) => c.type === filterType);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) => {
        const names = (c.participants || [])
          .filter((p) => p.id !== currentUserId)
          .map((p) => (p.name || "").toLowerCase());
        const title = c.title?.toLowerCase() ?? "";
        const lastMsg = (c.lastMessage || "").toLowerCase();
        return names.some((n) => n.includes(q)) || title.includes(q) || lastMsg.includes(q);
      });
    }

    return list;
  }, [conversations, filterType, search, currentUserId]);

  function getConversationName(conv: UnifiedConversation): string {
    if (conv.title && !isGarbageDisplay(conv.title)) return conv.title;
    const others = (conv.participants || []).filter((p) => p.id !== currentUserId);
    if (others.length === 0) return "Conversation";
    if (others.length === 1) return sanitizeName(others[0].name, "Utilisateur");
    return others.map((p) => sanitizeName(p.name, "Utilisateur").split(" ")[0]).join(", ");
  }

  function getConversationAvatar(conv: UnifiedConversation): { text: string; online: boolean } {
    const others = (conv.participants || []).filter((p) => p.id !== currentUserId);
    if (others.length === 0) return { text: "?", online: false };
    const avatar = others[0].avatar || "";
    // If avatar is a URL or ID, generate initials from name
    const safeAvatar = isGarbageDisplay(avatar) || avatar.length > 3
      ? sanitizeName(others[0].name, "U").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
      : avatar;
    return { text: safeAvatar || "?", online: others[0].online };
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-border-dark">
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <h2 className="font-bold text-white text-sm md:text-base">Messages</h2>
          {totalUnread > 0 && (
            <span className="text-[10px] bg-primary text-background-dark px-2 py-0.5 rounded-full font-bold">
              {totalUnread} non lu{totalUnread > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-dark border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Type filter */}
        {(showTypeFilter || showAllTypes) && (
          <div className="flex gap-1 mt-2 md:mt-3 overflow-x-auto scrollbar-hide">
            {[
              { key: "tous", label: "Tous" },
              { key: "direct", label: "Direct" },
              { key: "order", label: "Commandes" },
              { key: "group", label: "Groupes" },
              ...(showAllTypes ? [{ key: "admin", label: "Admin" }] : []),
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setFilterType(t.key)}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-shrink-0 whitespace-nowrap",
                  filterType === t.key
                    ? "bg-primary text-background-dark"
                    : "text-slate-500 hover:text-white hover:bg-border-dark"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-0">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2.5 md:gap-3 px-3 md:px-4 py-2.5 md:py-3.5 border-b border-border-dark/50 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-slate-700/50 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-slate-700/50 rounded w-2/3" />
                  <div className="h-2.5 bg-slate-700/30 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 px-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl text-primary/40">forum</span>
            </div>
            <p className="text-sm font-medium text-slate-400">Aucun message pour le moment</p>
            <p className="text-xs text-slate-600 mt-1 text-center">Vos conversations avec vos clients apparaitront ici</p>
          </div>
        ) : (
          filtered.map((conv) => {
            const name = getConversationName(conv);
            const avatar = getConversationAvatar(conv);
            const typeBadge = TYPE_BADGES[conv.type];
            if (!typeBadge) return null;

            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 md:gap-3 px-3 md:px-4 py-2.5 md:py-3.5 text-left transition-colors border-b border-border-dark/50",
                  selectedId === conv.id ? "bg-primary/10" : "hover:bg-primary/5"
                )}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {avatar.text}
                  </div>
                  {avatar.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-background-dark rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <p className={cn("text-sm truncate", conv.unreadCount > 0 ? "font-bold text-white" : "font-semibold text-slate-300")}>
                        {name}
                      </p>
                      {showAllTypes && (
                        <span className={cn("text-[8px] font-semibold px-1 py-0.5 rounded-full flex-shrink-0", typeBadge.cls)}>
                          {typeBadge.label}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 flex-shrink-0">{formatTime(conv.lastMessageTime)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className={cn("text-xs truncate flex items-center gap-1", conv.unreadCount > 0 ? "text-slate-200 font-medium" : "text-slate-500")}>
                      {conv.lastMessage === "Message vocal" && (
                        <span className="material-symbols-outlined text-xs">mic</span>
                      )}
                      {conv.lastMessage === "Appel audio" && (
                        <span className="material-symbols-outlined text-xs text-emerald-400">call</span>
                      )}
                      {conv.lastMessage === "Appel video" && (
                        <span className="material-symbols-outlined text-xs text-blue-400">videocam</span>
                      )}
                      {conv.lastMessage === "Appel manque" && (
                        <span className="material-symbols-outlined text-xs text-red-400">phone_missed</span>
                      )}
                      {humanizeLastMessage(conv.lastMessage)}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 bg-primary rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 ml-2">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  {conv.orderId && (
                    <p className="text-[10px] text-primary mt-0.5 truncate">Commande #{(conv.orderNumber || conv.orderId.slice(-6)).toUpperCase()}</p>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
