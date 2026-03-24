"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { useVoiceRecorder } from "./useVoiceRecorder";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface VoiceRecorderProps {
  onSend: (blob: Blob, duration: number) => void;
}

export function VoiceRecorder({ onSend }: VoiceRecorderProps) {
  const {
    state,
    duration,
    audioBlob,
    audioUrl,
    error,
    analyserData,
    isSupported,
    startRecording,
    stopRecording,
    cancelRecording,
    resetRecorder,
  } = useVoiceRecorder();

  const previewRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const displayError = error || localError;

  const handleSend = useCallback(() => {
    if (audioBlob) {
      onSend(audioBlob, duration);
      resetRecorder();
    }
  }, [audioBlob, duration, onSend, resetRecorder]);

  const handleReplay = useCallback(() => {
    if (previewRef.current) {
      if (isPlaying) {
        previewRef.current.pause();
        previewRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        previewRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = previewRef.current;
    if (!audio) return;
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [audioUrl]);

  // État repos (ou non supporté) : bouton microphone
  if (state === "idle" || !isSupported) {
    return (
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => {
            if (!isSupported) {
              setLocalError("Navigateur non supporte");
              return;
            }
            setLocalError(null);
            startRecording();
          }}
          className="p-2.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
          title="Envoyer un message vocal"
        >
          <span className="material-symbols-outlined">mic</span>
        </button>
        {displayError && (
          <div className="flex items-center gap-1 text-xs text-red-400 max-w-[200px]">
            <span className="material-symbols-outlined text-sm flex-shrink-0">error</span>
            <span className="truncate">{displayError}</span>
            <button onClick={() => { resetRecorder(); setLocalError(null); }} className="flex-shrink-0 text-slate-500 hover:text-slate-300">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // État enregistrement
  if (state === "recording") {
    return (
      <div className="flex items-center gap-2 md:gap-3 flex-1 bg-red-500/10 border border-red-500/30 rounded-lg px-2 md:px-4 py-2">
        {/* Indicateur pulsant */}
        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse flex-shrink-0" />

        {/* Waveform animée — fewer bars on mobile */}
        <div className="flex items-center gap-0.5 h-6 flex-1 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => {
            const val = analyserData[i % analyserData.length] || 0;
            const height = Math.max(4, (val / 255) * 24);
            return (
              <div
                key={i}
                className="w-1 rounded-full bg-red-400 transition-all duration-100 flex-shrink-0"
                style={{ height: `${height}px` }}
              />
            );
          })}
        </div>

        {/* Chronomètre */}
        <span className="text-xs md:text-sm font-mono text-red-400 flex-shrink-0">
          {formatDuration(duration)}
        </span>

        {/* Annuler */}
        <button
          onClick={cancelRecording}
          className="p-1 md:p-1.5 rounded-full text-red-400 hover:bg-red-500/20 transition-colors flex-shrink-0"
          title="Annuler"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Valider */}
        <button
          onClick={stopRecording}
          className="p-1 md:p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors flex-shrink-0"
          title="Terminer l'enregistrement"
        >
          <span className="material-symbols-outlined text-lg">check</span>
        </button>
      </div>
    );
  }

  // État aperçu avant envoi
  if (state === "preview" && audioUrl) {
    return (
      <div className="flex items-center gap-2 md:gap-3 flex-1 bg-primary/10 border border-primary/30 rounded-lg px-2 md:px-4 py-2">
        <audio ref={previewRef} src={audioUrl} preload="auto" />

        {/* Réécouter */}
        <button
          onClick={handleReplay}
          className="p-1 md:p-1.5 rounded-full text-primary hover:bg-primary/20 transition-colors flex-shrink-0"
          title={isPlaying ? "Arreter" : "Reecouter"}
        >
          <span className="material-symbols-outlined text-lg">
            {isPlaying ? "pause" : "play_arrow"}
          </span>
        </button>

        {/* Barre visuelle */}
        <div className="flex items-center gap-0.5 h-6 flex-1 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-primary/50 flex-shrink-0"
              style={{ height: `${4 + Math.random() * 16}px` }}
            />
          ))}
        </div>

        {/* Durée */}
        <span className="text-xs md:text-sm font-mono text-primary flex-shrink-0">
          {formatDuration(duration)}
        </span>

        {/* Annuler */}
        <button
          onClick={cancelRecording}
          className="p-1 md:p-1.5 rounded-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
          title="Annuler"
        >
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>

        {/* Envoyer */}
        <button
          onClick={handleSend}
          className="p-1 md:p-1.5 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors flex-shrink-0"
          title="Envoyer le message vocal"
        >
          <span className="material-symbols-outlined text-lg">send</span>
        </button>
      </div>
    );
  }

  return null;
}
