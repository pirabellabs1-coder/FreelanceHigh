"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface VoicePlayerProps {
  audioUrl: string;
  duration: number;
  transcription?: string;
  isOwn?: boolean;
}

export function VoicePlayer({ audioUrl, duration, transcription, isOwn = false }: VoicePlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showTranscription, setShowTranscription] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        // Audio source may not be available in demo mode
        setIsPlaying(false);
      });
    }
  }, [isPlaying]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * (audio.duration || duration);
  }, [duration]);

  const cycleSpeed = useCallback(() => {
    const rates = [1, 1.5, 2];
    const next = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  }, [playbackRate]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex items-center gap-2.5">
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
            isOwn
              ? "bg-primary/30 text-primary hover:bg-primary/40"
              : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
          )}
        >
          <span className="material-symbols-outlined text-lg">
            {isPlaying ? "pause" : "play_arrow"}
          </span>
        </button>

        {/* Waveform / Progress */}
        <div className="flex-1 min-w-0">
          <div
            className="relative h-8 flex items-center cursor-pointer group"
            onClick={handleSeek}
          >
            {/* Waveform bars (static visual) */}
            <div className="absolute inset-0 flex items-center gap-[2px]">
              {Array.from({ length: 40 }).map((_, i) => {
                const h = 4 + Math.abs(Math.sin(i * 0.7 + duration)) * 20;
                const filled = (i / 40) * 100 <= progress;
                return (
                  <div
                    key={i}
                    className={cn(
                      "w-[3px] rounded-full transition-colors",
                      filled
                        ? (isOwn ? "bg-primary" : "bg-emerald-400")
                        : (isOwn ? "bg-primary/25" : "bg-emerald-500/25")
                    )}
                    style={{ height: `${h}px` }}
                  />
                );
              })}
            </div>
          </div>

          {/* Time display */}
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-[10px] text-slate-500">
              {isPlaying || currentTime > 0 ? formatDuration(currentTime) : formatDuration(duration)}
            </span>
            <button
              onClick={cycleSpeed}
              className="text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors px-1"
            >
              {playbackRate}x
            </button>
          </div>
        </div>
      </div>

      {/* Transcription toggle */}
      {transcription !== undefined && (
        <div className="mt-1.5">
          <button
            onClick={() => setShowTranscription(!showTranscription)}
            className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-xs">subtitles</span>
            {showTranscription ? "Masquer la transcription" : "Voir la transcription"}
          </button>
          {showTranscription && (
            <p className="text-xs text-slate-400 mt-1 leading-relaxed italic">
              {transcription || "Transcription non disponible"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
