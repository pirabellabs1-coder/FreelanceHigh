// sitemap.ts — Génération dynamique du sitemap Next.js
// Revalidation toutes les 60 secondes (ISR)

import { MetadataRoute } from "next";
import prisma from "@freelancehigh/db";

export const revalidate = 60;

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://freelancehigh.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages statiques
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/explorer`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/formations`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/formations/explorer`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    { url: `${BASE_URL}/formations/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/formations/devenir-instructeur`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/tarifs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/comment-ca-marche`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/a-propos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/cgu`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/confidentialite`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Formations actives (avec ISR 60s)
  let formationRoutes: MetadataRoute.Sitemap = [];
  try {
    const formations = await prisma.formation.findMany({
      where: { status: "ACTIF" },
      select: { slug: true, updatedAt: true },
      orderBy: { studentsCount: "desc" },
      take: 5000,
    });

    formationRoutes = formations.map((f) => ({
      url: `${BASE_URL}/formations/${f.slug}`,
      lastModified: f.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("[sitemap] Erreur chargement formations:", error);
  }

  // Catégories formations
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categories = await prisma.formationCategory.findMany({
      select: { slug: true, createdAt: true },
    });

    categoryRoutes = categories.map((c) => ({
      url: `${BASE_URL}/formations/categories/${c.slug}`,
      lastModified: c.createdAt,
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("[sitemap] Erreur chargement catégories:", error);
  }

  // Profils instructeurs approuvés
  let instructeurRoutes: MetadataRoute.Sitemap = [];
  try {
    const instructeurs = await prisma.instructeurProfile.findMany({
      where: { status: "APPROUVE" },
      select: { id: true, updatedAt: true },
    });

    instructeurRoutes = instructeurs.map((i) => ({
      url: `${BASE_URL}/formations/instructeurs/${i.id}`,
      lastModified: i.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("[sitemap] Erreur chargement instructeurs:", error);
  }

  return [...staticRoutes, ...formationRoutes, ...categoryRoutes, ...instructeurRoutes];
}
