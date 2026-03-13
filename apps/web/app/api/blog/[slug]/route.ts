import { NextRequest, NextResponse } from "next/server";

const IS_DEV_MODE = process.env.DEV_MODE === "true";

// GET /api/blog/[slug] — Public single article by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (IS_DEV_MODE) {
      // Fetch from admin API to get in-memory data
      const adminRes = await fetch(
        new URL("/api/admin/blog", request.nextUrl.origin),
        { headers: { cookie: request.headers.get("cookie") || "" } }
      );
      const adminData = await adminRes.json();
      const allArticles = (adminData.articles || []) as Array<{
        id: string;
        title: string;
        slug: string;
        content?: string;
        excerpt: string;
        author: string;
        category: string;
        tags: string[];
        status: string;
        publishedAt: string | null;
        featuredImage: string;
        views: number;
        createdAt: string;
      }>;

      const article = allArticles.find(a => a.slug === slug && a.status === "publie");
      if (!article) {
        return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
      }

      // Note: admin API doesn't return content in list view, so for dev we need full article
      // In dev, fetch again from admin or just return what we have
      return NextResponse.json({ article });
    }

    // Production: Prisma
    const { prisma } = await import("@freelancehigh/db");

    const article = await prisma.blogPost.findUnique({
      where: { slug },
      include: { author: { select: { name: true } } },
    });

    if (!article || article.status !== "PUBLIE") {
      return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
    }

    // Increment views
    await prisma.blogPost.update({
      where: { id: article.id },
      data: { views: { increment: 1 } },
    }).catch(() => {});

    return NextResponse.json({
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt,
        author: article.author.name,
        category: article.category,
        tags: article.tags,
        status: "publie",
        publishedAt: article.publishedAt?.toISOString() ?? null,
        featuredImage: article.coverImage ?? "",
        views: article.views + 1,
        createdAt: article.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[API /blog/[slug] GET]", error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
