"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePlatformDataStore } from "@/store/platform-data";

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { blogArticles } = usePlatformDataStore();
  const t = useTranslations("blog");

  const article = blogArticles.find(a => a.slug === slug && a.status === "publie");
  const related = blogArticles.filter(a => a.status === "publie" && a.id !== article?.id && a.category === article?.category).slice(0, 3);

  if (!article) {
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

  // Simple Markdown-like rendering
  function renderContent(content: string) {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-8 mb-3">{line.replace("## ", "")}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-bold text-white mt-6 mb-2">{line.replace("### ", "")}</h3>;
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} className="text-slate-300 leading-relaxed mb-2">{line}</p>;
    });
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent px-6 lg:px-20 pt-32 pb-12">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-primary transition-colors mb-6">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            {t("back")}
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">{article.category}</span>
            {article.tags.map(tag => (
              <span key={tag} className="text-xs text-slate-500">#{tag}</span>
            ))}
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-4">{article.title}</h1>
          <p className="text-lg text-slate-400 mb-6">{article.excerpt}</p>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{article.author.split(" ").map(n => n[0]).join("")}</div>
            <div>
              <p className="text-sm font-semibold text-white">{article.author}</p>
              <p className="text-xs text-slate-500">
                {article.publishedAt && new Date(article.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                {" · "}{t("views", { count: article.views.toLocaleString() })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 lg:px-0 pb-24">
        <article className="prose prose-invert max-w-none">
          {renderContent(article.content)}
        </article>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <span key={tag} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">#{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">{t("similar_articles")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map(r => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="group bg-white/5 rounded-xl border border-white/10 p-5 hover:border-primary/30 transition-all">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">{r.category}</span>
                  <h3 className="text-sm font-bold text-white mt-2 group-hover:text-primary transition-colors line-clamp-2">{r.title}</h3>
                  <p className="text-xs text-slate-500 mt-2">{r.author} · {t("views", { count: r.views.toLocaleString() })}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
