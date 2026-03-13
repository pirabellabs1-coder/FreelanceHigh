import { NextRequest, NextResponse } from "next/server";

const IS_DEV_MODE = process.env.DEV_MODE === "true";

// GET /api/blog — Public list of published articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    if (IS_DEV_MODE) {
      // Import admin blog route to access the shared devBlogPosts
      // We re-fetch from the admin API to get the in-memory data
      const adminRes = await fetch(
        new URL("/api/admin/blog", request.nextUrl.origin),
        { headers: { cookie: request.headers.get("cookie") || "" } }
      );
      const adminData = await adminRes.json();
      const allArticles = (adminData.articles || []) as Array<{
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
      }>;

      let published = allArticles.filter(a => a.status === "publie");
      if (category) published = published.filter(a => a.category === category);
      published.sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
      published = published.slice(0, limit);

      return NextResponse.json({ articles: published, total: published.length });
    }

    // Production: Prisma
    const { prisma } = await import("@freelancehigh/db");

    const where: Record<string, unknown> = { status: "PUBLIE" };
    if (category) where.category = category;

    const articles = await prisma.blogPost.findMany({
      where,
      include: { author: { select: { name: true } } },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      articles: articles.map(a => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        author: a.author.name,
        category: a.category,
        tags: a.tags,
        status: "publie",
        publishedAt: a.publishedAt?.toISOString() ?? null,
        featuredImage: a.coverImage ?? "",
        views: a.views,
        createdAt: a.createdAt.toISOString(),
      })),
      total: articles.length,
    });
  } catch (error) {
    console.error("[API /blog GET]", error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
