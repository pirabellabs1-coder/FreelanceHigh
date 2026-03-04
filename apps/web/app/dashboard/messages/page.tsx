"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useDashboardStore, useToastStore } from "@/store/dashboard";

export default function MessagesPage() {
  const { conversations, sendMessage, markConversationRead } = useDashboardStore();
  const addToast = useToastStore((s) => s.addToast);
  const [selectedId, setSelectedId] = useState<string | null>(conversations[0]?.id ?? null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(() => conversations.find((c) => c.id === selectedId), [conversations, selectedId]);

  const filteredConvs = useMemo(() => {
    if (!search) return conversations;
    const q = search.toLowerCase();
    return conversations.filter((c) => c.contactName.toLowerCase().includes(q));
  }, [conversations, search]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages]);

  useEffect(() => {
    if (selectedId) markConversationRead(selectedId);
  }, [selectedId, markConversationRead]);

  function handleSend() {
    if (!input.trim() || !selectedId) return;
    sendMessage(selectedId, input);
    setInput("");
    // Simulate reply after 2s
    setTimeout(() => {
      if (selected) {
        const replies = [
          "Merci pour votre message ! Je reviens vers vous rapidement.",
          "Bien recu, je regarde ca.",
          "Parfait, c'est note !",
          "Merci ! Je vous tiens au courant.",
        ];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        sendMessage(selectedId, reply);
      }
    }, 2000);
  }

  function handleFileUpload(files: FileList | null) {
    if (!files || !selectedId) return;
    Array.from(files).forEach((f) => {
      sendMessage(selectedId, f.name, "file", f.name, `${(f.size / (1024 * 1024)).toFixed(1)} MB`);
    });
    addToast("success", "Fichier envoye !");
  }

  function formatTime(ts: string) {
    const d = new Date(ts);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return d.toLocaleDateString("fr-FR", { weekday: "short" });
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  }

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  return (
    <div className="max-w-full space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">Messagerie</h2>
        <p className="text-slate-400 mt-1">{totalUnread > 0 ? `${totalUnread} message(s) non lu(s)` : "Toutes les conversations sont a jour."}</p>
      </div>

      <div className="flex bg-background-dark/50 border border-border-dark rounded-xl overflow-hidden" style={{ height: "calc(100vh - 220px)" }}>
        {/* Conversations List */}
        <div className="w-80 border-r border-border-dark flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-border-dark">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
              <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-dark border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConvs.map((conv) => (
              <button key={conv.id} onClick={() => setSelectedId(conv.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors border-b border-border-dark/50",
                  selectedId === conv.id ? "bg-primary/10" : "hover:bg-primary/5"
                )}>
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {conv.contactAvatar}
                  </div>
                  {conv.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-background-dark rounded-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={cn("text-sm font-semibold truncate", conv.unread > 0 && "font-bold")}>{conv.contactName}</p>
                    <span className="text-[10px] text-slate-500 flex-shrink-0">{formatTime(conv.lastMessageTime)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className={cn("text-xs truncate", conv.unread > 0 ? "text-slate-200 font-medium" : "text-slate-500")}>{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <span className="w-5 h-5 bg-primary rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 ml-2">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selected ? (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border-dark">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{selected.contactAvatar}</div>
                    {selected.online && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-background-dark rounded-full" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{selected.contactName}</p>
                    <p className="text-xs text-slate-500">{selected.online ? "En ligne" : "Hors ligne"}{selected.orderId ? ` · ${selected.orderId}` : ""}</p>
                  </div>
                </div>
                {selected.orderId && (
                  <a href={`/dashboard/commandes/${selected.orderId}`} className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                    Voir la commande <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selected.messages.map((msg) => (
                  <div key={msg.id} className={cn("flex gap-3", msg.sender === "me" ? "flex-row-reverse" : "")}>
                    <div className={cn("max-w-[65%] rounded-2xl px-4 py-3",
                      msg.sender === "me" ? "bg-primary/10" : "bg-neutral-dark"
                    )}>
                      {msg.type === "file" ? (
                        <div className="flex items-center gap-2 bg-background-dark/50 rounded-lg px-3 py-2">
                          <span className="material-symbols-outlined text-primary">description</span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">{msg.fileName}</p>
                            {msg.fileSize && <p className="text-[10px] text-slate-500">{msg.fileSize}</p>}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.content}</p>
                      )}
                      <div className="flex items-center justify-end gap-1 mt-1.5">
                        <span className="text-[10px] text-slate-500">{formatTime(msg.timestamp)}</span>
                        {msg.sender === "me" && (
                          <span className={cn("material-symbols-outlined text-xs", msg.read ? "text-blue-400" : "text-slate-500")}>
                            {msg.read ? "done_all" : "done"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-border-dark p-4">
                <div className="flex gap-3">
                  <button onClick={() => fileRef.current?.click()} className="p-2.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined">attach_file</span>
                  </button>
                  <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => handleFileUpload(e.target.files)} />
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Tapez votre message..."
                    className="flex-1 px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" />
                  <button onClick={handleSend} disabled={!input.trim()}
                    className="px-4 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 transition-all">
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <span className="material-symbols-outlined text-4xl mb-3">chat_bubble_outline</span>
                <p>Selectionnez une conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
