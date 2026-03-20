// FreelanceHigh — Seed formations categories
// Run: npx ts-node prisma/seed-formations.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FORMATION_CATEGORIES = [
  { name: "Design & Créativité", slug: "design-creativite", icon: "palette", color: "#EC4899", order: 1 },
  { name: "Développement Web", slug: "developpement-web", icon: "terminal", color: "#3B82F6", order: 2 },
  { name: "App Mobile", slug: "app-mobile", icon: "smartphone", color: "#8B5CF6", order: 3 },
  { name: "Marketing Digital", slug: "marketing-digital", icon: "trending_up", color: "#EF4444", order: 4 },
  { name: "Intelligence Artificielle", slug: "intelligence-artificielle", icon: "smart_toy", color: "#6366F1", order: 5 },
  { name: "Data & Business", slug: "data-business", icon: "bar_chart", color: "#0EA5E9", order: 6 },
  { name: "Vidéo & Animation", slug: "video-animation", icon: "movie", color: "#F59E0B", order: 7 },
  { name: "Rédaction & Contenu", slug: "redaction-contenu", icon: "edit_note", color: "#10B981", order: 8 },
  { name: "Cybersécurité", slug: "cybersecurite", icon: "lock", color: "#DC2626", order: 9 },
  { name: "Freelancing & Business", slug: "freelancing-business", icon: "work", color: "#7C3AED", order: 10 },
  { name: "Langues", slug: "langues", icon: "language", color: "#059669", order: 11 },
  { name: "Développement Personnel", slug: "developpement-personnel", icon: "school", color: "#D97706", order: 12 },
];

async function main() {
  console.log("Seeding formation categories...");

  for (const cat of FORMATION_CATEGORIES) {
    await prisma.formationCategory.upsert({
      where: { slug: cat.slug },
      update: { icon: cat.icon },
      create: cat,
    });
    console.log(`  ✓ ${cat.name} (${cat.icon})`);
  }

  console.log(`\n${FORMATION_CATEGORIES.length} categories seeded.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
