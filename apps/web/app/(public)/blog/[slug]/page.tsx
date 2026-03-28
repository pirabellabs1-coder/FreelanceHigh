"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { TiptapRenderer } from "@/components/formations/TiptapRenderer";

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  status: string;
  publishedAt: string | null;
  featuredImage: string;
  views: number;
  createdAt: string;
}

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const t = useTranslations("blog");

  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [related, setRelated] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    // Fetch the article
    fetch(`/api/blog/${slug}`)
      .then(res => {
        if (!res.ok) { setNotFound(true); setLoading(false); return null; }
        return res.json();
      })
      .then(data => {
        if (!data) return;
        setArticle(data.article);
        setLoading(false);

        // Fetch related articles by same category
        if (data.article?.category) {
          fetch(`/api/blog?category=${encodeURIComponent(data.article.category)}&limit=4`)
            .then(res => res.json())
            .then(relData => {
              const others = (relData.articles || []).filter(
                (a: BlogArticle) => a.slug !== slug
              ).slice(0, 3);
              setRelated(others);
            })
            .catch(() => {});
        }
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <div className="text-center">
          <span className="material-symbols-outlined text-7xl text-slate-600">article</span>
          <h1 className="text-2xl font-bold text-white mt-4">{t("not_found_title")}</h1>
          <p className="text-slate-500 mt-2">{t("not_found_description")}</p>
          <Link href="/blog" className="inline-block mt-6 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">{t("back_to_blog")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-10 sm:pb-12">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-primary transition-colors mb-5 sm:mb-6">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            {t("back")}
          </Link>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">{article.category}</span>
            {(article.tags ?? []).slice(0, 4).map(tag => (
              <span key={tag} className="text-xs text-slate-500">#{tag}</span>
            ))}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 sm:mb-4">{article.title}</h1>
          <p className="text-base sm:text-lg text-slate-400 mb-5 sm:mb-6">{article.excerpt}</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">{(article.author || "?").split(" ").map(n => n[0]).join("")}</div>
              <div>
                <p className="text-sm font-semibold text-white">{article.author}</p>
                <p className="text-xs text-slate-500">
                  {article.publishedAt && new Date(article.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  {" · "}{t("views", { count: (article.views ?? 0).toLocaleString() })}
                </p>
              </div>
            </div>
            {/* Share buttons */}
            <div className="flex items-center gap-2 sm:ml-auto">
              <button
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.share) {
                    navigator.share({ title: article.title, url: window.location.href }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400 hover:text-white hover:border-white/20 transition-colors"
                title={t("share") ?? "Partager"}
              >
                <span className="material-symbols-outlined text-sm">share</span>
                <span className="hidden sm:inline">{t("share") ?? "Partager"}</span>
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors"
                title="Twitter/X"
              >
                <span className="text-xs font-bold">X</span>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors"
                title="LinkedIn"
              >
                <span className="text-xs font-bold">in</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 pb-24">
        <article className="overflow-hidden">
          <TiptapRenderer content={article.content} className="prose-base sm:prose-lg prose-invert [&_img]:w-full [&_img]:h-auto [&_pre]:overflow-x-auto [&_pre]:text-sm" />
        </article>

        {/* Tags */}
        {(article.tags ?? []).length > 0 && (
          <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10">
            <div className="flex flex-wrap gap-2">
              {(article.tags ?? []).map(tag => (
                <span key={tag} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">#{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-5 sm:mb-6">{t("similar_articles")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {related.map(r => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="group bg-white/5 rounded-xl border border-white/10 p-4 sm:p-5 hover:border-primary/30 transition-all">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">{r.category}</span>
                  <h3 className="text-sm font-bold text-white mt-2 group-hover:text-primary transition-colors line-clamp-2">{r.title}</h3>
                  <p className="text-xs text-slate-500 mt-2">{r.author} · {t("views", { count: (r.views ?? 0).toLocaleString() })}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
