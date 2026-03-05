"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MessageBubble } from "./MessageBubble";
import type { UnifiedConversation } from "@/store/messaging";

interface ChatPanelProps {
  conversation: UnifiedConversation | null;
  currentUserId: string;
  onSendMessage: (content: string, type?: "text" | "file", fileName?: string, fileSize?: string) => void;
  onMarkRead: () => void;
  showAdminActions?: boolean;
  onSendSystemMessage?: (content: string) => void;
}

export function ChatPanel({
  conversation,
  currentUserId,
  onSendMessage,
  onMarkRead,
  showAdminActions = false,
  onSendSystemMessage,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  useEffect(() => {
    if (conversation) onMarkRead();
  }, [conversation?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSend() {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  }

  function handleFileUpload(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((f) => {
      onSendMessage(f.name, "file", f.name, `${(f.size / (1024 * 1024)).toFixed(1)} MB`);
    });
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl mb-3">chat_bubble_outline</span>
          <p className="font-medium">Selectionnez une conversation</p>
          <p className="text-xs mt-1 text-slate-600">Choisissez une discussion pour commencer a echanger.</p>
        </div>
      </div>
    );
  }

  const otherParticipants = conversation.participants.filter((p) => p.id !== currentUserId);
  const displayName = conversation.title || otherParticipants.map((p) => p.name).join(", ") || "Conversation";
  const isOnline = otherParticipants.some((p) => p.online);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-dark flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {otherParticipants[0]?.avatar ?? "?"}
            </div>
            {isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-background-dark rounded-full" />
            )}
          </div>
          <div>
            <p className="font-bold text-sm text-white">{displayName}</p>
            <p className="text-xs text-slate-500">
              {isOnline ? "En ligne" : "Hors ligne"}
              {conversation.orderId && ` · ${conversation.orderId}`}
              {otherParticipants.length > 1 && ` · ${otherParticipants.length} participants`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {conversation.orderId && (
            <a
              href={`/dashboard/commandes/${conversation.orderId}`}
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1 mr-2"
            >
              Voir la commande <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          )}
          {showAdminActions && onSendSystemMessage && (
            <button
              onClick={() => {
                const msg = prompt("Message systeme a envoyer:");
                if (msg) onSendSystemMessage(msg);
              }}
              className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
              title="Envoyer un message systeme"
            >
              <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
            </button>
          )}
          <button className="p-2 text-slate-400 hover:text-primary rounded-lg hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined text-lg">info</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {conversation.messages.map((msg, i) => {
          const isOwn = msg.senderId === currentUserId;
          // Show sender info if sender changed from previous message
          const prevMsg = i > 0 ? conversation.messages[i - 1] : null;
          const showSenderInfo = !isOwn && (!prevMsg || prevMsg.senderId !== msg.senderId || prevMsg.type === "system");

          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={isOwn}
              showSenderInfo={showSenderInfo}
            />
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border-dark p-4 flex-shrink-0">
        <div className="flex gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            className="p-2.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <span className="material-symbols-outlined">attach_file</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Tapez votre message..."
            className="flex-1 px-4 py-2.5 bg-neutral-dark border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={cn(
              "px-4 py-2.5 rounded-lg font-semibold text-sm transition-all",
              input.trim()
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-border-dark text-slate-500"
            )}
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
