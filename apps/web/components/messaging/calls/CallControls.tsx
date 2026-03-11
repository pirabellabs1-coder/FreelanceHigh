"use client";

import { cn } from "@/lib/utils";

interface CallControlsProps {
  isMuted: boolean;
  isCameraOn: boolean;
  isSpeakerOn: boolean;
  isScreenSharing: boolean;
  showCameraButton?: boolean;
  showScreenShareButton?: boolean;
  connectionQuality: "excellent" | "good" | "fair" | "poor" | "unknown";
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onToggleSpeaker: () => void;
  onToggleScreenShare: () => void;
  onHangup: () => void;
  onOpenChat?: () => void;
}

const QUALITY_CONFIG = {
  excellent: { dots: 5, color: "text-emerald-400", label: "Excellente" },
  good: { dots: 4, color: "text-emerald-400", label: "Bonne" },
  fair: { dots: 3, color: "text-amber-400", label: "Moyenne" },
  poor: { dots: 2, color: "text-red-400", label: "Faible" },
  unknown: { dots: 0, color: "text-slate-500", label: "" },
};

export function CallControls({
  isMuted,
  isCameraOn,
  isSpeakerOn,
  isScreenSharing,
  showCameraButton = true,
  showScreenShareButton = false,
  connectionQuality,
  onToggleMute,
  onToggleCamera,
  onToggleSpeaker,
  onToggleScreenShare,
  onHangup,
  onOpenChat,
}: CallControlsProps) {
  const quality = QUALITY_CONFIG[connectionQuality];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Connection quality */}
      {connectionQuality !== "unknown" && (
        <div className={cn("flex items-center gap-1.5 text-xs", quality.color)}>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1 rounded-full",
                  i < quality.dots ? quality.color.replace("text-", "bg-") : "bg-slate-600"
                )}
                style={{ height: `${6 + i * 2}px` }}
              />
            ))}
          </div>
          <span>{quality.label}</span>
        </div>
      )}

      {/* Control buttons */}
      <div className="flex items-center gap-4">
        {/* Mute */}
        <button
          onClick={onToggleMute}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
            isMuted
              ? "bg-red-500/20 text-red-400"
              : "bg-white/10 text-white hover:bg-white/20"
          )}
          title={isMuted ? "Reactiver le micro" : "Couper le micro"}
        >
          <span className="material-symbols-outlined">
            {isMuted ? "mic_off" : "mic"}
          </span>
        </button>

        {/* Speaker */}
        <button
          onClick={onToggleSpeaker}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
            isSpeakerOn
              ? "bg-blue-500/20 text-blue-400"
              : "bg-white/10 text-white hover:bg-white/20"
          )}
          title={isSpeakerOn ? "Desactiver le haut-parleur" : "Activer le haut-parleur"}
        >
          <span className="material-symbols-outlined">
            {isSpeakerOn ? "volume_up" : "volume_down"}
          </span>
        </button>

        {/* Camera */}
        {showCameraButton && (
          <button
            onClick={onToggleCamera}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
              isCameraOn
                ? "bg-blue-500/20 text-blue-400"
                : "bg-white/10 text-white hover:bg-white/20"
            )}
            title={isCameraOn ? "Desactiver la camera" : "Activer la camera"}
          >
            <span className="material-symbols-outlined">
              {isCameraOn ? "videocam" : "videocam_off"}
            </span>
          </button>
        )}

        {/* Screen share */}
        {showScreenShareButton && (
          <button
            onClick={onToggleScreenShare}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
              isScreenSharing
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-white/10 text-white hover:bg-white/20"
            )}
            title={isScreenSharing ? "Arreter le partage" : "Partager l'ecran"}
          >
            <span className="material-symbols-outlined">
              {isScreenSharing ? "stop_screen_share" : "screen_share"}
            </span>
          </button>
        )}

        {/* Chat */}
        {onOpenChat && (
          <button
            onClick={onOpenChat}
            className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors"
            title="Chat"
          >
            <span className="material-symbols-outlined">chat</span>
          </button>
        )}

        {/* Hangup */}
        <button
          onClick={onHangup}
          className="w-14 h-14 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center transition-colors shadow-lg shadow-red-500/30"
          title="Raccrocher"
        >
          <span className="material-symbols-outlined text-2xl">call_end</span>
        </button>
      </div>
    </div>
  );
}
