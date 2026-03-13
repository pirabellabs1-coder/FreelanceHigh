// FreelanceHigh — Seed formations categories
// Run: npx ts-node prisma/seed-formations.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FORMATION_CATEGORIES = [
  { nameFr: "Design & Créativité", nameEn: "Design & Creativity", slug: "design-creativite", icon: "🎨", color: "#EC4899", order: 1 },
  { nameFr: "Développement Web", nameEn: "Web Development", slug: "developpement-web", icon: "💻", color: "#3B82F6", order: 2 },
  { nameFr: "App Mobile", nameEn: "Mobile App", slug: "app-mobile", icon: "📱", color: "#8B5CF6", order: 3 },
  { nameFr: "Marketing Digital", nameEn: "Digital Marketing", slug: "marketing-digital", icon: "📈", color: "#EF4444", order: 4 },
  { nameFr: "Intelligence Artificielle", nameEn: "Artificial Intelligence", slug: "intelligence-artificielle", icon: "🤖", color: "#6366F1", order: 5 },
  { nameFr: "Data & Business", nameEn: "Data & Business", slug: "data-business", icon: "📊", color: "#0EA5E9", order: 6 },
  { nameFr: "Vidéo & Animation", nameEn: "Video & Animation", slug: "video-animation", icon: "🎬", color: "#F59E0B", order: 7 },
  { nameFr: "Rédaction & Contenu", nameEn: "Writing & Content", slug: "redaction-contenu", icon: "✍️", color: "#10B981", order: 8 },
  { nameFr: "Cybersécurité", nameEn: "Cybersecurity", slug: "cybersecurite", icon: "🔐", color: "#DC2626", order: 9 },
  { nameFr: "Freelancing & Business", nameEn: "Freelancing & Business", slug: "freelancing-business", icon: "💼", color: "#7C3AED", order: 10 },
  { nameFr: "Langues", nameEn: "Languages", slug: "langues", icon: "🌍", color: "#059669", order: 11 },
  { nameFr: "Développement Personnel", nameEn: "Self Development", slug: "developpement-personnel", icon: "🎓", color: "#D97706", order: 12 },
];

async function main() {
  console.log("Seeding formation categories...");

  for (const cat of FORMATION_CATEGORIES) {
    await prisma.formationCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    console.log(`  ✓ ${cat.nameFr}`);
  }

  console.log(`\n✅ ${FORMATION_CATEGORIES.length} categories seeded.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
