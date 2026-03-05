// FreelanceHigh — Database Seed (Production)
// Only creates: categories + admin account
// NO fake data — the site starts clean

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Developpement Web", slug: "developpement-web", icon: "code", color: "#3B82F6", description: "Sites web, applications, APIs", order: 1 },
  { name: "Developpement Mobile", slug: "developpement-mobile", icon: "smartphone", color: "#8B5CF6", description: "Applications iOS, Android, React Native", order: 2 },
  { name: "Design UI/UX", slug: "design-ui-ux", icon: "palette", color: "#EC4899", description: "Interfaces utilisateur, experience utilisateur", order: 3 },
  { name: "Design Graphique", slug: "design-graphique", icon: "brush", color: "#F59E0B", description: "Logos, branding, illustrations", order: 4 },
  { name: "Redaction & Traduction", slug: "redaction-traduction", icon: "edit_note", color: "#10B981", description: "Contenu, articles, traductions", order: 5 },
  { name: "Marketing Digital", slug: "marketing-digital", icon: "campaign", color: "#EF4444", description: "SEO, publicite, reseaux sociaux", order: 6 },
  { name: "Video & Animation", slug: "video-animation", icon: "videocam", color: "#6366F1", description: "Montage, motion design, 3D", order: 7 },
  { name: "Photographie", slug: "photographie", icon: "photo_camera", color: "#14B8A6", description: "Photos produit, retouche, portfolio", order: 8 },
  { name: "Musique & Audio", slug: "musique-audio", icon: "music_note", color: "#F97316", description: "Production, voix off, jingles", order: 9 },
  { name: "Conseil & Strategie", slug: "conseil-strategie", icon: "lightbulb", color: "#0EA5E9", description: "Business, finance, management", order: 10 },
  { name: "Data & IA", slug: "data-ia", icon: "smart_toy", color: "#A855F7", description: "Data science, machine learning, automatisation", order: 11 },
  { name: "Administration", slug: "administration", icon: "description", color: "#64748B", description: "Saisie, comptabilite, support", order: 12 },
];

async function main() {
  console.log("Seeding production database...");

  // 1. Categories
  console.log("Creating categories...");
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log(`  ${CATEGORIES.length} categories created`);

  // 2. Admin account
  const adminEmail = process.env.ADMIN_EMAIL || "admin@freelancehigh.com";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.warn("  ADMIN_PASSWORD not set — skipping admin creation");
    console.warn("  Set ADMIN_PASSWORD in .env.local then run: npx prisma db seed");
  } else {
    console.log("Creating admin account...");
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { passwordHash, name: "Admin Principal", role: "ADMIN", plan: "AGENCE", kyc: 4, status: "ACTIF" },
      create: { email: adminEmail, passwordHash, name: "Admin Principal", role: "ADMIN", plan: "AGENCE", kyc: 4, status: "ACTIF" },
    });
    console.log(`  Admin created: ${adminEmail}`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
