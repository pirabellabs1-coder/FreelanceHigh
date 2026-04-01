"use client";

import { useState, useEffect } from "react";
import { X, Play, ShoppingCart, FileText, Headphones } from "lucide-react";
import DOMPurify from "dompurify";

interface FreeLessonData {
  id: string;
  title: string;
  type: string;
  content: string | null;
  videoUrl: string | null;
  duration: number;
  sectionTitle: string;
  formation: { id: string; title: string; slug: string };
}

interface FreeLessonPreviewModalProps {
  formationId: string;
  lessonId: string;
  onClose: () => void;
  onBuy: () => void;
  locale: string;
}

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
}

export default function FreeLessonPreviewModal({
  formationId,
  lessonId,
  onClose,
  onBuy,
  locale,
}: FreeLessonPreviewModalProps) {
  const [lesson, setLesson] = useState<FreeLessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fr = locale === "fr";

  useEffect(() => {
    fetch(`/api/formations/${formationId}/free-lesson/${lessonId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Leçon non disponible");
        return r.json();
      })
      .then((data) => {
        setLesson(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [formationId, lessonId]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
              <Play className="w-4 h-4 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 truncate">
                {fr ? "Aperçu gratuit" : "Free preview"}
              </p>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                {loading ? "..." : lesson?.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary" />
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-64 text-red-500 text-sm">
              {error}
            </div>
          )}

          {lesson && !loading && (
            <>
              {/* VIDEO */}
              {lesson.type === "VIDEO" && lesson.videoUrl && (
                <div className="aspect-video rounded-xl overflow-hidden bg-black mb-4">
                  {getYouTubeEmbedUrl(lesson.videoUrl) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(lesson.videoUrl)!}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={lesson.videoUrl}
                      controls
                      className="w-full h-full"
                    />
                  )}
                </div>
              )}

              {/* TEXTE */}
              {lesson.type === "TEXTE" && lesson.content && (
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(lesson.content),
                    }}
                  />
                </div>
              )}

              {/* AUDIO */}
              {lesson.type === "AUDIO" && lesson.videoUrl && (
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-4">
                  <Headphones className="w-6 h-6 text-purple-500" />
                  <audio
                    src={lesson.videoUrl}
                    controls
                    className="flex-1"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* CTA Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <p className="text-xs text-slate-500 mb-3 text-center">
            {fr
              ? "Cet aperçu est gratuit. Achetez la formation pour accéder à tout le contenu."
              : "This preview is free. Purchase the course to access all content."}
          </p>
          <button
            onClick={onBuy}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            {fr
              ? "Acheter la formation complète"
              : "Buy the full course"}
          </button>
        </div>
      </div>
    </div>
  );
}
