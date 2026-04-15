"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

type Conversation = {
  id: string;
  type: string;
  title: string | null;
  otherUser: { id: string; name: string | null; email: string; image: string | null } | null;
  lastMessage: { content: string; createdAt: string; fromMe: boolean; read: boolean } | null;
  updatedAt: string;
};

const GRADIENTS = ["from-violet-400 to-purple-600","from-blue-400 to-sky-600","from-pink-400 to-rose-500","from-amber-400 to-orange-500","from-teal-400 to-emerald-600"];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "À l'instant";
  if (m < 60) return `Il y a ${m} min`;
  if (h < 24) return `Il y a ${h}h`;
  if (d === 1) return "Hier";
  return `Il y a ${d}j`;
}

export default function MessagesPage() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: response, isLoading } = useQuery<{ data: { conversations: Conversation[]; unreadCount: number } }>({
    queryKey: ["vendeur-messages"],
    queryFn: () => fetch("/api/formations/vendeur/messages").then((r) => r.json()),
    staleTime: 20_000,
  });

  const conversations = response?.data?.conversations ?? [];
  const unreadCount = response?.data?.unreadCount ?? 0;

  const filtered = useMemo(() => {
    if (!search.trim()) return conversations;
    const q = search.toLowerCase();
    return conversations.filter(
      (c) =>
        c.otherUser?.name?.toLowerCase().includes(q) ||
        c.otherUser?.email?.toLowerCase().includes(q) ||
        c.lastMessage?.content.toLowerCase().includes(q)
    );
  }, [conversations, search]);

  const selected = filtered.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c1e]">Messages</h1>
          <p className="text-sm text-[#5c647a] mt-1">
            {isLoading ? "Chargement…" : `${conversations.length} conversation${conversations.length !== 1 ? "s" : ""}${unreadCount > 0 ? ` · ${unreadCount} non lu${unreadCount > 1 ? "s" : ""}` : ""}`}
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex">
        {/* List pane */}
        <div className="w-full md:w-80 border-r border-gray-100 flex flex-col">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#5c647a]">search</span>
              <input
                type="text"
                placeholder="Rechercher…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#006e2f]/40"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[0, 1, 2].map((i) => <div key={i} className="h-14 bg-gray-50 rounded animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center px-4">
                <span className="material-symbols-outlined text-[32px] text-gray-300 block mb-2">chat_bubble_outline</span>
                <p className="text-sm font-semibold text-[#191c1e]">Aucune conversation</p>
                <p className="text-xs text-[#5c647a] mt-1">
                  Les messages de vos apprenants apparaîtront ici
                </p>
              </div>
            ) : (
              filtered.map((c, idx) => {
                const name = c.otherUser?.name ?? c.otherUser?.email ?? "Utilisateur";
                const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
                const isUnread = c.lastMessage && !c.lastMessage.fromMe && !c.lastMessage.read;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-gray-50 transition-colors ${
                      selectedId === c.id ? "bg-[#006e2f]/5" : "hover:bg-gray-50/50"
                    }`}
                  >
                    {c.otherUser?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.otherUser.image} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${GRADIENTS[idx % GRADIENTS.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {initials}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className={`text-sm truncate ${isUnread ? "font-bold text-[#191c1e]" : "font-semibold text-[#191c1e]"}`}>
                          {name}
                        </p>
                        {c.lastMessage && (
                          <span className="text-[10px] text-[#5c647a] flex-shrink-0">{timeAgo(c.lastMessage.createdAt)}</span>
                        )}
                      </div>
                      <p className={`text-xs truncate mt-0.5 ${isUnread ? "text-[#191c1e] font-semibold" : "text-[#5c647a]"}`}>
                        {c.lastMessage?.fromMe && "Vous : "}
                        {c.lastMessage?.content ?? "Aucun message"}
                      </p>
                    </div>
                    {isUnread && <span className="w-2 h-2 rounded-full bg-[#006e2f] flex-shrink-0 mt-2" />}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Detail pane */}
        <div className="flex-1 hidden md:flex flex-col items-center justify-center p-8 text-center">
          {selected ? (
            <>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#006e2f] to-emerald-500 flex items-center justify-center text-white text-lg font-bold mx-auto mb-4">
                {(selected.otherUser?.name ?? "U").charAt(0).toUpperCase()}
              </div>
              <p className="font-bold text-[#191c1e]">{selected.otherUser?.name ?? selected.otherUser?.email}</p>
              <p className="text-sm text-[#5c647a] mt-1">Conversation ouverte</p>
              <p className="text-xs text-[#5c647a] mt-4 max-w-sm">
                Le chat temps réel est en cours de développement. Bientôt vous pourrez répondre directement depuis cette interface.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px] text-gray-300">chat</span>
              </div>
              <p className="font-bold text-[#191c1e]">Sélectionnez une conversation</p>
              <p className="text-sm text-[#5c647a] mt-1">Choisissez un apprenant pour voir l&apos;historique</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
