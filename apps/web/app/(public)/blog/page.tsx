"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
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

export default function BlogPage() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState("");
  const t = useTranslations("blog");

  useEffect(() => {
    fetch("/api/blog")
      .then(res => res.json())
      .then(data => {
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const published = useMemo(() => {
    let list = articles;
    if (catFilter) list = list.filter(a => a.category === catFilter);
    return list.sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
  }, [articles, catFilter]);

  const categories = useMemo(() => {
    const cats = new Set(articles.map(a => a.category).filter(Boolean));
    return Array.from(cats);
  }, [articles]);

  const featured = published[0];
  const rest = published.slice(1);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
          <p className="text-slate-400">Chargement des articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent px-6 lg:px-20 pt-32 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">{t("title")}</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-0 pb-24">
        {/* Category filter */}
        <div className="flex gap-2 mb-10 flex-wrap">
          <button onClick={() => setCatFilter("")} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${!catFilter ? "bg-primary text-white" : "bg-white/5 text-slate-400 hover:text-white border border-white/10"}`}>
            {t("all")}
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCatFilter(cat)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${catFilter === cat ? "bg-primary text-white" : "bg-white/5 text-slate-400 hover:text-white border border-white/10"}`}>
              {cat}
            </button>
          ))}
        </div>

        {published.length === 0 ? (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-6xl text-slate-600">article</span>
            <p className="text-slate-500 mt-4 text-lg">{t("no_articles")}</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && !catFilter && (
              <Link href={`/blog/${featured.slug}`} className="block mb-12 group">
                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-primary/30 transition-all">
                  <div className="h-64 bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-7xl text-white/20">article</span>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">{featured.category}</span>
                      <span className="text-xs text-slate-500">{featured.publishedAt && new Date(featured.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                      <span className="text-xs text-slate-500">{t("views", { count: featured.views.toLocaleString() })}</span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-black text-white group-hover:text-primary transition-colors mb-3">{featured.title}</h2>
                    <p className="text-slate-400 leading-relaxed">{featured.excerpt}</p>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{featured.author.split(" ").map(n => n[0]).join("")}</div>
                      <span className="text-sm text-slate-400">{featured.author}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(catFilter ? published : rest).map(article => (
                <Link key={article.id} href={`/blog/${article.slug}`} className="group">
                  <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-primary/30 transition-all h-full flex flex-col">
                    <div className="h-40 bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-white/10">article</span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">{article.category}</span>
                        <span className="text-xs text-slate-600">{article.views > 0 && t("views", { count: article.views.toLocaleString() })}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors mb-2 line-clamp-2">{article.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2 flex-1">{article.excerpt}</p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                        <span className="text-xs text-slate-500">{article.author}</span>
                        <span className="text-xs text-slate-600">{article.publishedAt && new Date(article.publishedAt).toLocaleDateString("fr-FR")}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
