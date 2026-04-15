"use client";

import { useRef, useState, useCallback } from "react";

type Props = {
  value: string;
  onChange: (url: string) => void;
  folder?: "service" | "portfolio" | "avatar";
  aspectClass?: string; // Tailwind aspect classes, default "aspect-square"
  accept?: string;
  helper?: string;
};

export function ImageUploader({
  value,
  onChange,
  folder = "portfolio",
  aspectClass = "aspect-square",
  accept = "image/jpeg,image/png,image/webp,image/gif",
  helper = "Recommandé : 1280×720px · JPG ou PNG · Max 5 MB",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);
      const res = await fetch("/api/upload/image", { method: "POST", body: form });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      } else {
        setError(data.error ?? "Upload échoué");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur réseau");
    } finally {
      setUploading(false);
    }
  }, [folder, onChange]);

  const onFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`${aspectClass} relative overflow-hidden border-2 border-dashed cursor-pointer transition-all group ${
          dragging
            ? "border-[#22c55e] bg-[#22c55e]/5"
            : value
            ? "border-transparent bg-zinc-100"
            : "border-[#bccbb9] bg-[#f3f3f4] hover:bg-[#e8e8e8]"
        }`}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Aperçu" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold uppercase tracking-widest">
                Remplacer l&apos;image
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="absolute top-2 right-2 w-7 h-7 bg-zinc-900/80 hover:bg-[#ba1a1a] text-white flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
            {uploading ? (
              <>
                <span className="material-symbols-outlined text-5xl text-[#006e2f] animate-spin mb-4">progress_activity</span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Upload en cours…</p>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-5xl text-zinc-300 group-hover:text-[#006e2f] transition-colors">
                  add_photo_alternate
                </span>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  {dragging ? "Déposez ici" : "Glissez ou cliquez"}
                </p>
              </>
            )}
          </div>
        )}
        <input ref={inputRef} type="file" accept={accept} onChange={onFilePicked} className="hidden" />
      </div>

      <p className="text-[10px] text-zinc-400 leading-tight">{helper}</p>

      {error && (
        <p className="text-[10px] text-[#ba1a1a] font-bold uppercase tracking-widest">{error}</p>
      )}

      {value && (
        <p className="text-[10px] font-mono text-zinc-400 break-all">{value.length > 80 ? `${value.slice(0, 80)}…` : value}</p>
      )}
    </div>
  );
}
