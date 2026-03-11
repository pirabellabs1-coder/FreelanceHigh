"use client";

import { cn } from "@/lib/utils";
import type { UnifiedMessage } from "@/store/messaging";
import { VoicePlayer } from "./voice/VoicePlayer";

const ROLE_COLORS: Record<string, string> = {
  freelance: "text-emerald-400",
  client: "text-blue-400",
  agence: "text-amber-400",
  admin: "text-red-400",
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

function formatCallDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s} sec`;
  return `${m} min ${s.toString().padStart(2, "0")} sec`;
}

interface MessageBubbleProps {
  message: UnifiedMessage;
  isOwn: boolean;
  showSenderInfo?: boolean;
}

export function MessageBubble({ message, isOwn, showSenderInfo = true }: MessageBubbleProps) {
  // System messages
  if (message.type === "system") {
    return (
      <div className="flex justify-center my-2">
        <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-xs">info</span>
          {message.content}
        </div>
      </div>
    );
  }

  // Call entries (system-like messages)
  if (message.type === "call_audio" || message.type === "call_video" || message.type === "call_missed") {
    const isMissed = message.type === "call_missed";
    const isVideo = message.type === "call_video";
    const icon = isMissed ? "phone_missed" : isVideo ? "videocam" : "call";
    const duration = message.callDuration ? formatCallDuration(message.callDuration) : "";

    return (
      <div className="flex justify-center my-2">
        <div
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border",
            isMissed
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          )}
        >
          <span className="material-symbols-outlined text-sm">{icon}</span>
          <span>
            {isMissed && "Appel manque"}
            {message.type === "call_audio" && `Appel audio${duration ? ` - ${duration}` : ""}`}
            {message.type === "call_video" && `Appel video${duration ? ` - ${duration}` : ""}`}
          </span>
          <span className="text-slate-500">{formatTime(message.createdAt)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex gap-3", isOwn ? "flex-row-reverse" : "")}>
      {/* Avatar */}
      {!isOwn && showSenderInfo && (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 mt-1">
          {message.senderName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
      )}

      <div className={cn("max-w-[65%]", !isOwn && !showSenderInfo && "ml-11")}>
        {/* Sender info */}
        {!isOwn && showSenderInfo && (
          <p className="text-xs mb-1">
            <span className={cn("font-semibold", ROLE_COLORS[message.senderRole] || "text-slate-400")}>
              {message.senderName}
            </span>
            <span className="text-slate-600 ml-1.5 text-[10px] capitalize">{message.senderRole}</span>
          </p>
        )}

        {/* Bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isOwn
              ? "bg-primary/10 rounded-tr-md"
              : "bg-neutral-dark border border-border-dark rounded-tl-md"
          )}
        >
          {/* Voice message */}
          {message.type === "voice" && message.audioUrl ? (
            <VoicePlayer
              audioUrl={message.audioUrl}
              duration={message.audioDuration ?? 0}
              transcription={message.transcription}
              isOwn={isOwn}
            />
          ) : message.type === "file" || message.type === "image" ? (
            <div className="flex items-center gap-3 bg-background-dark/50 rounded-lg px-3 py-2">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-sm">
                  {message.type === "image" ? "image" : "description"}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate">{message.fileName ?? message.content}</p>
                {message.fileSize && <p className="text-[10px] text-slate-500">{message.fileSize}</p>}
              </div>
              <button className="text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg">download</span>
              </button>
            </div>
          ) : (
            <p className="text-sm leading-relaxed">{message.content}</p>
          )}

          {/* Timestamp + read status */}
          <div className="flex items-center justify-end gap-1 mt-1.5">
            <span className="text-[10px] text-slate-500">{formatTime(message.createdAt)}</span>
            {isOwn && (
              <span
                className={cn(
                  "material-symbols-outlined text-xs",
                  message.readBy.length > 1 ? "text-blue-400" : "text-slate-500"
                )}
              >
                {message.readBy.length > 1 ? "done_all" : "done"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
