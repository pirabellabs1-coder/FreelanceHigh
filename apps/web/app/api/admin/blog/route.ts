import { NextRequest, NextResponse } from "next/server";

// ── In-memory Blog Store ──
// Blog is secondary for now — articles stored in module-level state.
// Data resets on server restart, which is acceptable for dev mode.

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  authorId: string;
  category: string;
  tags: string[];
  status: "brouillon" | "publie" | "programme" | "archive";
  publishedAt: string | null;
  scheduledAt: string | null;
  featuredImage: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Seed articles for the blog
const blogArticles: BlogArticle[] = [
  {
    id: "blog_1",
    title: "Comment gagner 3000 EUR par mois en freelance depuis Dakar",
    slug: "gagner-3000-eur-freelance-dakar",
    content:
      "Decouvrez les strategies eprouvees pour developper votre activite de freelance depuis l'Afrique francophone. De la creation de votre profil a l'acquisition de vos premiers clients internationaux, ce guide couvre toutes les etapes essentielles...",
    excerpt:
      "Les strategies pour developper son activite freelance depuis l'Afrique francophone.",
    author: "Admin FreelanceHigh",
    authorId: "dev-admin-1",
    category: "Conseils",
    tags: ["freelance", "afrique", "revenus", "dakar"],
    status: "publie",
    publishedAt: "2026-02-15T10:00:00Z",
    scheduledAt: null,
    featuredImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    views: 1247,
    likes: 89,
    createdAt: "2026-02-14T08:00:00Z",
    updatedAt: "2026-02-15T10:00:00Z",
  },
  {
    id: "blog_2",
    title: "Les 10 competences les plus demandees en 2026",
    slug: "10-competences-demandees-2026",
    content:
      "Le marche du freelancing evolue rapidement. Voici les competences qui dominent en 2026 : developpement IA, design UI/UX, marketing digital, cybersecurite...",
    excerpt:
      "Decouvrez les competences freelance les plus recherchees cette annee.",
    author: "Admin FreelanceHigh",
    authorId: "dev-admin-1",
    category: "Tendances",
    tags: ["competences", "2026", "tendances", "marche"],
    status: "publie",
    publishedAt: "2026-02-20T10:00:00Z",
    scheduledAt: null,
    featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    views: 856,
    likes: 62,
    createdAt: "2026-02-19T08:00:00Z",
    updatedAt: "2026-02-20T10:00:00Z",
  },
  {
    id: "blog_3",
    title: "Guide complet : creer son premier service sur FreelanceHigh",
    slug: "guide-creer-premier-service",
    content:
      "Vous venez de vous inscrire sur FreelanceHigh ? Felicitations ! Voici un guide etape par etape pour creer un service qui attire les clients...",
    excerpt:
      "Guide pas a pas pour creer et optimiser votre premier service.",
    author: "Admin FreelanceHigh",
    authorId: "dev-admin-1",
    category: "Tutoriels",
    tags: ["guide", "debutant", "service", "tutoriel"],
    status: "publie",
    publishedAt: "2026-03-01T10:00:00Z",
    scheduledAt: null,
    featuredImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
    views: 2103,
    likes: 156,
    createdAt: "2026-02-28T08:00:00Z",
    updatedAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "blog_4",
    title: "Success Story : De Abidjan a 5000 EUR/mois en design",
    slug: "success-story-abidjan-design",
    content:
      "Rencontrez Kouame, designer UI/UX base a Abidjan, qui a construit une carriere internationale grace au freelancing...",
    excerpt:
      "L'histoire inspirante d'un designer ivoirien devenu freelance international.",
    author: "Admin FreelanceHigh",
    authorId: "dev-admin-1",
    category: "Success Stories",
    tags: ["success-story", "design", "abidjan", "inspiration"],
    status: "brouillon",
    publishedAt: null,
    scheduledAt: null,
    featuredImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    views: 0,
    likes: 0,
    createdAt: "2026-03-05T08:00:00Z",
    updatedAt: "2026-03-05T08:00:00Z",
  },
];

// ── GET /api/admin/blog — List all blog articles ──
export async function GET() {
  try {
    // Check for scheduled articles that should be published
    const now = new Date();
    for (const article of blogArticles) {
      if (
        article.status === "programme" &&
        article.scheduledAt &&
        new Date(article.scheduledAt) <= now
      ) {
        article.status = "publie";
        article.publishedAt = article.scheduledAt;
        article.updatedAt = now.toISOString();
      }
    }

    // Categories summary
    const categories = blogArticles.reduce<Record<string, number>>(
      (acc, a) => {
        acc[a.category] = (acc[a.category] ?? 0) + 1;
        return acc;
      },
      {}
    );

    return NextResponse.json({
      articles: blogArticles.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        author: a.author,
        category: a.category,
        tags: a.tags,
        status: a.status,
        publishedAt: a.publishedAt,
        scheduledAt: a.scheduledAt,
        featuredImage: a.featuredImage,
        views: a.views,
        likes: a.likes,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
      total: blogArticles.length,
      published: blogArticles.filter((a) => a.status === "publie").length,
      drafts: blogArticles.filter((a) => a.status === "brouillon").length,
      scheduled: blogArticles.filter((a) => a.status === "programme").length,
      categories,
    });
  } catch (error) {
    console.error("[API /admin/blog GET]", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des articles" },
      { status: 500 }
    );
  }
}

// ── POST /api/admin/blog — Create a new blog article ──
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      author,
      authorId,
      category,
      tags,
      status,
      scheduledAt,
      featuredImage,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "title et content sont requis" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const article: BlogArticle = {
      id: `blog_${Date.now().toString(36)}`,
      title,
      slug: generateSlug(title),
      content,
      excerpt: excerpt ?? content.slice(0, 200),
      author: author ?? "Admin FreelanceHigh",
      authorId: authorId ?? "dev-admin-1",
      category: category ?? "General",
      tags: tags ?? [],
      status: status ?? "brouillon",
      publishedAt: status === "publie" ? now : null,
      scheduledAt: scheduledAt ?? null,
      featuredImage: featuredImage ?? "",
      views: 0,
      likes: 0,
      createdAt: now,
      updatedAt: now,
    };

    blogArticles.unshift(article);

    return NextResponse.json({
      success: true,
      message: `Article "${title}" cree`,
      article,
    });
  } catch (error) {
    console.error("[API /admin/blog POST]", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation de l'article" },
      { status: 500 }
    );
  }
}

// ── PATCH /api/admin/blog — Update an existing blog article ──
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id est requis" },
        { status: 400 }
      );
    }

    const idx = blogArticles.findIndex((a) => a.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { error: "Article introuvable" },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();

    // Update fields
    if (updates.title) {
      blogArticles[idx].title = updates.title;
      blogArticles[idx].slug = generateSlug(updates.title);
    }
    if (updates.content !== undefined) blogArticles[idx].content = updates.content;
    if (updates.excerpt !== undefined) blogArticles[idx].excerpt = updates.excerpt;
    if (updates.category !== undefined) blogArticles[idx].category = updates.category;
    if (updates.tags !== undefined) blogArticles[idx].tags = updates.tags;
    if (updates.featuredImage !== undefined) blogArticles[idx].featuredImage = updates.featuredImage;
    if (updates.scheduledAt !== undefined) blogArticles[idx].scheduledAt = updates.scheduledAt;

    // Handle status changes
    if (updates.status) {
      blogArticles[idx].status = updates.status;
      if (updates.status === "publie" && !blogArticles[idx].publishedAt) {
        blogArticles[idx].publishedAt = now;
      }
    }

    blogArticles[idx].updatedAt = now;

    return NextResponse.json({
      success: true,
      message: `Article "${blogArticles[idx].title}" mis a jour`,
      article: blogArticles[idx],
    });
  } catch (error) {
    console.error("[API /admin/blog PATCH]", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour de l'article" },
      { status: 500 }
    );
  }
}

// ── DELETE /api/admin/blog — Delete a blog article ──
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id est requis (query param)" },
        { status: 400 }
      );
    }

    const idx = blogArticles.findIndex((a) => a.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { error: "Article introuvable" },
        { status: 404 }
      );
    }

    const title = blogArticles[idx].title;
    blogArticles.splice(idx, 1);

    return NextResponse.json({
      success: true,
      message: `Article "${title}" supprime`,
    });
  } catch (error) {
    console.error("[API /admin/blog DELETE]", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'article" },
      { status: 500 }
    );
  }
}
