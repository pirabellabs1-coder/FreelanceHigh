// Standalone seed script — run with: node packages/db/seed-formations.mjs
// Adds 3 video formations + 2 digital products for the default dev instructor.

import { PrismaClient } from "./generated/client/index.js";

const prisma = new PrismaClient();

const DEV_USER_ID = "dev-instructeur-001";

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

async function getOrCreateCategory(name) {
  const slug = slugify(name);
  const existing = await prisma.formationCategory.findUnique({ where: { slug } });
  if (existing) return existing;
  return prisma.formationCategory.create({ data: { name, slug, isActive: true } });
}

const FORMATIONS = [
  {
    title: "Marketing Digital de A à Z : Facebook, Instagram & TikTok Ads",
    shortDesc: "Maîtrisez les algorithmes des réseaux sociaux et lancez vos premières campagnes rentables.",
    description: "Cette formation complète vous emmène des bases du marketing digital jusqu'à la création de campagnes Facebook Ads, Instagram Ads et TikTok Ads qui convertissent. Vous apprendrez à cibler votre audience, créer des créatives percutantes, optimiser votre budget et analyser vos résultats.",
    category: "Marketing Digital",
    price: 45000,
    originalPrice: 75000,
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&h=720&fit=crop",
    modules: [
      { title: "Fondamentaux du Marketing Digital", lessons: [
        { title: "Introduction : pourquoi le digital change tout", duration: 8 },
        { title: "Le parcours client moderne (AIDA revisité)", duration: 12 },
        { title: "Construire sa stratégie en une page", duration: 18 },
      ]},
      { title: "Facebook & Instagram Ads Business", lessons: [
        { title: "Setup du Business Manager & Pixel", duration: 15 },
        { title: "Ciblage d'audiences", duration: 22 },
        { title: "Créatives qui convertissent", duration: 18 },
        { title: "Budget, enchères et tests A/B", duration: 20 },
      ]},
      { title: "TikTok Ads & Scaling", lessons: [
        { title: "Algorithme TikTok expliqué", duration: 10 },
        { title: "Créer une pub TikTok virale", duration: 25 },
        { title: "Passer de 100k à 1M de vues", duration: 15 },
      ]},
    ],
  },
  {
    title: "Freelance en 30 Jours : De Zéro à Premier Client",
    shortDesc: "La méthode complète pour décrocher vos 3 premiers clients et vivre de votre freelance.",
    description: "30 jours pour poser les bases d'une activité freelance rentable. Vous apprendrez à définir votre offre, trouver vos premiers clients sur LinkedIn et Malt, fixer vos tarifs sans vous sous-estimer, rédiger des propositions commerciales qui closent, et gérer votre activité au quotidien.",
    category: "Entrepreneuriat",
    price: 65000,
    originalPrice: 95000,
    thumbnail: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1280&h=720&fit=crop",
    modules: [
      { title: "Poser les fondations (Semaine 1)", lessons: [
        { title: "Choisir sa niche rentable", duration: 14 },
        { title: "Construire son offre signature", duration: 18 },
        { title: "Fixer ses tarifs sans culpabiliser", duration: 12 },
      ]},
      { title: "Prospecter et attirer (Semaine 2-3)", lessons: [
        { title: "LinkedIn : optimiser son profil freelance", duration: 20 },
        { title: "Messages de prospection qui ne spamment pas", duration: 15 },
        { title: "Malt, Upwork, Fiverr", duration: 22 },
      ]},
      { title: "Closer et livrer (Semaine 4)", lessons: [
        { title: "Proposition commerciale irrésistible", duration: 18 },
        { title: "Gérer la négociation", duration: 16 },
        { title: "Livrer, facturer, se faire recommander", duration: 14 },
      ]},
    ],
  },
  {
    title: "Développement Web Moderne : React, Next.js & TypeScript",
    shortDesc: "Construisez des applications web professionnelles avec la stack la plus demandée en 2026.",
    description: "Formation intensive pour développeurs qui veulent maîtriser React 18, Next.js 14 (App Router) et TypeScript. On construit ensemble 3 projets réels : un blog, un dashboard SaaS et une marketplace.",
    category: "Développement Web",
    price: 98000,
    originalPrice: 150000,
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1280&h=720&fit=crop",
    modules: [
      { title: "Les fondamentaux React moderne", lessons: [
        { title: "Setup projet Next.js + TypeScript", duration: 12 },
        { title: "Hooks essentiels", duration: 28 },
        { title: "Server Components vs Client Components", duration: 22 },
      ]},
      { title: "Construire un SaaS complet", lessons: [
        { title: "Authentification avec NextAuth", duration: 30 },
        { title: "Base de données Postgres + Prisma", duration: 35 },
        { title: "Paiements Stripe", duration: 40 },
        { title: "Dashboard admin avec tRPC", duration: 45 },
      ]},
      { title: "Déploiement & Best Practices", lessons: [
        { title: "Déploiement Vercel + monitoring Sentry", duration: 18 },
        { title: "SEO avec Next.js Metadata API", duration: 15 },
        { title: "Performance : Core Web Vitals", duration: 20 },
      ]},
    ],
  },
];

const DIGITAL_PRODUCTS = [
  {
    title: "Le Guide Complet du Copywriting qui Convertit (E-book 120 pages)",
    description: "120 pages de techniques, formules et exemples concrets pour écrire des pages de vente, des emails et des posts qui vendent. Inclut 25 templates réutilisables, une checklist de relecture et 50 headlines prêts à copier.",
    productType: "PDF",
    category: "Marketing Digital",
    price: 18000,
    originalPrice: 29000,
    banner: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1280&h=720&fit=crop",
  },
  {
    title: "Pack Notion Freelance : 12 Templates Prêts à l'Emploi",
    description: "Un système Notion complet pour gérer votre activité freelance : CRM clients, pipeline commercial, gestion de projets, facturation, base de contrats, suivi du temps, objectifs annuels, et bien plus.",
    productType: "TEMPLATE",
    category: "Productivité",
    price: 12500,
    originalPrice: 25000,
    banner: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1280&h=720&fit=crop",
  },
];

async function main() {
  // 1. Ensure the dev user exists
  let user = await prisma.user.findUnique({ where: { id: DEV_USER_ID } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: DEV_USER_ID,
        email: "instructeur-dev@freelancehigh.com",
        passwordHash: "dev-placeholder-" + Math.random().toString(36).slice(2),
        name: "Instructeur Démo",
        role: "FREELANCE",
        status: "ACTIF",
      },
    });
    console.log(`✓ Created dev user ${DEV_USER_ID}`);
  }

  // 2. Ensure instructor profile
  let profile = await prisma.instructeurProfile.findUnique({ where: { userId: DEV_USER_ID } });
  if (!profile) {
    profile = await prisma.instructeurProfile.create({
      data: {
        userId: DEV_USER_ID,
        bioFr: "Instructeur FreelanceHigh — contenus de démonstration pour tester la plateforme.",
        expertise: ["Marketing Digital", "Freelance", "Développement Web"],
        yearsExp: 5,
        status: "APPROUVE",
      },
    });
    console.log(`✓ Created instructor profile`);
  }

  // 3. Seed formations
  for (const f of FORMATIONS) {
    const baseSlug = slugify(f.title);
    const existing = await prisma.formation.findUnique({ where: { slug: baseSlug } });
    if (existing) {
      console.log(`◦ Skipped formation "${f.title}" (already exists)`);
      continue;
    }
    const category = await getOrCreateCategory(f.category);
    const totalDuration = f.modules.reduce((s, m) => s + m.lessons.reduce((ss, l) => ss + l.duration, 0), 0);

    const created = await prisma.formation.create({
      data: {
        slug: baseSlug,
        title: f.title,
        shortDesc: f.shortDesc,
        description: f.description,
        customCategory: f.category,
        categoryId: category.id,
        thumbnail: f.thumbnail,
        price: f.price,
        originalPrice: f.originalPrice,
        duration: totalDuration,
        status: "ACTIF",
        instructeurId: profile.id,
        sections: {
          create: f.modules.map((m, mIdx) => ({
            title: m.title,
            order: mIdx,
            lessons: {
              create: m.lessons.map((l, lIdx) => ({
                title: l.title,
                type: "VIDEO",
                duration: l.duration,
                order: lIdx,
                isFree: mIdx === 0 && lIdx === 0,
              })),
            },
          })),
        },
      },
      include: { sections: { include: { lessons: true } } },
    });
    console.log(`✓ Formation "${created.title}" → ${created.sections.length} modules, ${created.sections.reduce((s, m) => s + m.lessons.length, 0)} leçons`);
  }

  // 4. Seed digital products
  for (const p of DIGITAL_PRODUCTS) {
    const baseSlug = slugify(p.title);
    const existing = await prisma.digitalProduct.findUnique({ where: { slug: baseSlug } });
    if (existing) {
      console.log(`◦ Skipped product "${p.title}" (already exists)`);
      continue;
    }
    const category = await getOrCreateCategory(p.category);
    const created = await prisma.digitalProduct.create({
      data: {
        slug: baseSlug,
        title: p.title,
        description: p.description,
        productType: p.productType,
        categoryId: category.id,
        banner: p.banner,
        price: p.price,
        originalPrice: p.originalPrice,
        status: "ACTIF",
        instructeurId: profile.id,
      },
    });
    console.log(`✓ Product "${created.title}" (${created.productType})`);
  }

  console.log("\n✅ Seed terminé.");
}

main()
  .catch((err) => { console.error("❌", err); process.exit(1); })
  .finally(() => prisma.$disconnect());
