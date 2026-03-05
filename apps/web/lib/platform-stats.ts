// ============================================================
// FreelanceHigh — Mock Data Source (simulates database records)
//
// This file acts as a temporary data source until the real
// database (Prisma + Supabase) is connected. The API layer
// (lib/api/landing.ts) reads from here, applies ranking
// algorithms, and returns sorted/filtered results.
//
// When the backend is ready, only lib/api/landing.ts needs
// to be updated to query Prisma instead of importing from here.
// ============================================================

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------

export type FreelancerBadge = "Elite" | "Top Rated" | "Rising Talent" | "Pro";

export type TestimonialType = "client" | "freelance" | "agence";

export interface PlatformStats {
  totalFreelancers: number;
  totalClients: number;
  totalAgencies: number;
  totalServices: number;
  totalProjectsCompleted: number;
  totalRevenueEur: number;
  avgSatisfactionRating: number;
  totalReviews: number;
  countriesCovered: number;
  avgResponseTimeHours: number;
  avgDeliveryOnTimePercent: number;
  newFreelancersThisMonth: number;
  newProjectsThisMonth: number;
  totalPayoutsEur: number;
  activeMissions: number;
  repeatClientPercent: number;
}

export interface FreelancerRecord {
  id: string;
  username: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  completedOrders: number;
  location: string;
  country: string;
  countryFlag: string;
  badge: FreelancerBadge;
  skills: string[];
  dailyRateEur: number;
  completionRate: number;
  responseTimeHours: number;
  memberSince: string;
  totalEarningsEur: number;
  verified: boolean;
  // Fields for dynamic scoring
  recentOrdersLast30d: number;
  recentReviewsLast30d: number;
  profileViews30d: number;
  lastActiveAt: string;
}

export interface ServiceRecord {
  id: string;
  slug: string;
  title: string;
  description: string;
  freelancerName: string;
  freelancerUsername: string;
  freelancerAvatar: string;
  rating: number;
  reviewCount: number;
  totalOrders: number;
  priceEur: number;
  category: string;
  categorySlug: string;
  deliveryDays: number;
  image: string;
  featured: boolean;
  createdAt: string;
  // Fields for dynamic scoring
  ordersLast30d: number;
  ordersLast7d: number;
  viewsLast30d: number;
  conversionRate: number;
}

export interface CategoryRecord {
  icon: string;
  title: string;
  description: string;
  slug: string;
  serviceCount: number;
  freelancerCount: number;
  avgRating: number;
  totalOrders: number;
  growthPercent: number;
}

export interface TestimonialRecord {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  country: string;
  countryFlag: string;
  type: TestimonialType;
  createdAt: string;
  verified: boolean;
}

export interface PaymentMethod {
  name: string;
  icon: string;
  description: string;
}

// ------------------------------------------------------------
// 1. MOCK FREELANCERS (simulates users table)
// ------------------------------------------------------------

export const MOCK_FREELANCERS: FreelancerRecord[] = [
  {
    id: "fl-001",
    username: "aminata-diallo",
    name: "Aminata Diallo",
    title: "UX/UI Designer Senior",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aminata",
    rating: 4.97,
    reviewCount: 218,
    completedOrders: 234,
    location: "Dakar",
    country: "Senegal",
    countryFlag: "SN",
    badge: "Elite",
    skills: ["Figma", "Design System", "Prototypage", "User Research"],
    dailyRateEur: 420,
    completionRate: 99.1,
    responseTimeHours: 1.2,
    memberSince: "2024-03-15",
    totalEarningsEur: 187500,
    verified: true,
    recentOrdersLast30d: 18,
    recentReviewsLast30d: 12,
    profileViews30d: 1420,
    lastActiveAt: "2026-03-04T10:30:00Z",
  },
  {
    id: "fl-002",
    username: "alexandre-moreau",
    name: "Alexandre Moreau",
    title: "Developpeur Full Stack",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandre",
    rating: 5.0,
    reviewCount: 176,
    completedOrders: 189,
    location: "Paris",
    country: "France",
    countryFlag: "FR",
    badge: "Elite",
    skills: ["React / Next.js", "Node.js", "TypeScript", "PostgreSQL"],
    dailyRateEur: 550,
    completionRate: 100,
    responseTimeHours: 0.8,
    memberSince: "2024-01-10",
    totalEarningsEur: 234000,
    verified: true,
    recentOrdersLast30d: 14,
    recentReviewsLast30d: 9,
    profileViews30d: 1890,
    lastActiveAt: "2026-03-04T09:15:00Z",
  },
  {
    id: "fl-003",
    username: "kwame-asante",
    name: "Kwame Asante",
    title: "Expert Growth Marketing",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kwame",
    rating: 4.92,
    reviewCount: 287,
    completedOrders: 312,
    location: "Abidjan",
    country: "Cote d'Ivoire",
    countryFlag: "CI",
    badge: "Top Rated",
    skills: ["SEO / SEA", "Analytics", "Growth Hacking", "Social Ads"],
    dailyRateEur: 380,
    completionRate: 97.4,
    responseTimeHours: 1.5,
    memberSince: "2024-02-20",
    totalEarningsEur: 198700,
    verified: true,
    recentOrdersLast30d: 22,
    recentReviewsLast30d: 15,
    profileViews30d: 2100,
    lastActiveAt: "2026-03-04T11:00:00Z",
  },
  {
    id: "fl-004",
    username: "sophie-laurent",
    name: "Sophie Laurent",
    title: "Brand Designer & Directrice Artistique",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
    rating: 4.95,
    reviewCount: 154,
    completedOrders: 167,
    location: "Bruxelles",
    country: "Belgique",
    countryFlag: "BE",
    badge: "Elite",
    skills: ["Branding", "Identite Visuelle", "Illustrator", "Motion Design"],
    dailyRateEur: 480,
    completionRate: 98.8,
    responseTimeHours: 2.0,
    memberSince: "2024-04-05",
    totalEarningsEur: 156800,
    verified: true,
    recentOrdersLast30d: 11,
    recentReviewsLast30d: 8,
    profileViews30d: 980,
    lastActiveAt: "2026-03-03T16:45:00Z",
  },
  {
    id: "fl-005",
    username: "moussa-traore",
    name: "Moussa Traore",
    title: "Developpeur Mobile Senior",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Moussa",
    rating: 4.88,
    reviewCount: 128,
    completedOrders: 145,
    location: "Bamako",
    country: "Mali",
    countryFlag: "ML",
    badge: "Pro",
    skills: ["React Native", "Flutter", "Firebase", "API REST"],
    dailyRateEur: 350,
    completionRate: 96.5,
    responseTimeHours: 2.8,
    memberSince: "2024-06-12",
    totalEarningsEur: 112400,
    verified: true,
    recentOrdersLast30d: 9,
    recentReviewsLast30d: 6,
    profileViews30d: 760,
    lastActiveAt: "2026-03-04T08:20:00Z",
  },
  {
    id: "fl-006",
    username: "fatima-benali",
    name: "Fatima Benali",
    title: "Data Analyst & Specialiste IA",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
    rating: 4.91,
    reviewCount: 89,
    completedOrders: 98,
    location: "Casablanca",
    country: "Maroc",
    countryFlag: "MA",
    badge: "Rising Talent",
    skills: ["Python", "Power BI", "Machine Learning", "SQL"],
    dailyRateEur: 400,
    completionRate: 97.9,
    responseTimeHours: 1.8,
    memberSince: "2025-01-08",
    totalEarningsEur: 78600,
    verified: true,
    recentOrdersLast30d: 8,
    recentReviewsLast30d: 7,
    profileViews30d: 1150,
    lastActiveAt: "2026-03-04T07:00:00Z",
  },
  {
    id: "fl-007",
    username: "ousmane-diop",
    name: "Ousmane Diop",
    title: "Monteur Video & Motion Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ousmane",
    rating: 4.86,
    reviewCount: 156,
    completedOrders: 178,
    location: "Dakar",
    country: "Senegal",
    countryFlag: "SN",
    badge: "Top Rated",
    skills: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Motion Graphics"],
    dailyRateEur: 300,
    completionRate: 95.5,
    responseTimeHours: 2.2,
    memberSince: "2024-05-20",
    totalEarningsEur: 95400,
    verified: true,
    recentOrdersLast30d: 15,
    recentReviewsLast30d: 10,
    profileViews30d: 1340,
    lastActiveAt: "2026-03-04T12:00:00Z",
  },
  {
    id: "fl-008",
    username: "mariame-kone",
    name: "Mariame Kone",
    title: "Redactrice Web & SEO Content",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mariame",
    rating: 4.83,
    reviewCount: 187,
    completedOrders: 215,
    location: "Abidjan",
    country: "Cote d'Ivoire",
    countryFlag: "CI",
    badge: "Pro",
    skills: ["Redaction SEO", "Copywriting", "WordPress", "Content Strategy"],
    dailyRateEur: 250,
    completionRate: 96.2,
    responseTimeHours: 1.4,
    memberSince: "2024-07-01",
    totalEarningsEur: 87200,
    verified: true,
    recentOrdersLast30d: 19,
    recentReviewsLast30d: 11,
    profileViews30d: 890,
    lastActiveAt: "2026-03-04T10:00:00Z",
  },
  {
    id: "fl-009",
    username: "youssef-el-amrani",
    name: "Youssef El Amrani",
    title: "Consultant SEO & Ads Manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Youssef",
    rating: 4.94,
    reviewCount: 142,
    completedOrders: 158,
    location: "Bruxelles",
    country: "Belgique",
    countryFlag: "BE",
    badge: "Top Rated",
    skills: ["Google Ads", "Meta Ads", "SEO Technique", "Analytics"],
    dailyRateEur: 450,
    completionRate: 98.1,
    responseTimeHours: 1.0,
    memberSince: "2024-04-18",
    totalEarningsEur: 145600,
    verified: true,
    recentOrdersLast30d: 12,
    recentReviewsLast30d: 9,
    profileViews30d: 1020,
    lastActiveAt: "2026-03-03T18:30:00Z",
  },
  {
    id: "fl-010",
    username: "abdou-ndiaye",
    name: "Abdou Ndiaye",
    title: "Developpeur Backend & DevOps",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abdou",
    rating: 4.89,
    reviewCount: 94,
    completedOrders: 108,
    location: "Dakar",
    country: "Senegal",
    countryFlag: "SN",
    badge: "Rising Talent",
    skills: ["Node.js", "Docker", "AWS", "PostgreSQL"],
    dailyRateEur: 400,
    completionRate: 97.2,
    responseTimeHours: 1.6,
    memberSince: "2025-02-14",
    totalEarningsEur: 68900,
    verified: true,
    recentOrdersLast30d: 10,
    recentReviewsLast30d: 8,
    profileViews30d: 1280,
    lastActiveAt: "2026-03-04T11:45:00Z",
  },
];

// ------------------------------------------------------------
// 2. MOCK SERVICES (simulates services table)
// ------------------------------------------------------------

export const MOCK_SERVICES: ServiceRecord[] = [
  {
    id: "svc-001",
    slug: "creation-logo-professionnel-charte-graphique",
    title: "Creation de logo professionnel & charte graphique",
    description:
      "Logo unique et memorable avec charte graphique complete. Fichiers vectoriels, guide couleurs et declinaisons inclus.",
    freelancerName: "Sophie Laurent",
    freelancerUsername: "sophie-laurent",
    freelancerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
    rating: 4.95,
    reviewCount: 342,
    totalOrders: 389,
    priceEur: 150,
    category: "Design & Creatif",
    categorySlug: "design-crea",
    deliveryDays: 5,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
    featured: true,
    createdAt: "2024-04-10",
    ordersLast30d: 28,
    ordersLast7d: 9,
    viewsLast30d: 4200,
    conversionRate: 8.2,
  },
  {
    id: "svc-002",
    slug: "developpement-site-web-nextjs-react",
    title: "Developpement site web Next.js / React",
    description:
      "Site web moderne et performant avec Next.js 14. SEO optimise, responsive, deploiement Vercel inclus.",
    freelancerName: "Alexandre Moreau",
    freelancerUsername: "alexandre-moreau",
    freelancerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandre",
    rating: 5.0,
    reviewCount: 278,
    totalOrders: 301,
    priceEur: 500,
    category: "Developpement & Tech",
    categorySlug: "developpement",
    deliveryDays: 14,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    featured: true,
    createdAt: "2024-01-20",
    ordersLast30d: 22,
    ordersLast7d: 7,
    viewsLast30d: 5100,
    conversionRate: 6.8,
  },
  {
    id: "svc-003",
    slug: "strategie-seo-complete-audit-technique",
    title: "Strategie SEO complete + audit technique",
    description:
      "Audit SEO technique approfondi avec plan d'action detaille. Core Web Vitals, mots-cles, backlinks et suivi mensuel.",
    freelancerName: "Kwame Asante",
    freelancerUsername: "kwame-asante",
    freelancerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kwame",
    rating: 4.92,
    reviewCount: 289,
    totalOrders: 347,
    priceEur: 350,
    category: "Marketing Digital",
    categorySlug: "marketing",
    deliveryDays: 7,
    image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&q=80",
    featured: true,
    createdAt: "2024-03-01",
    ordersLast30d: 25,
    ordersLast7d: 8,
    viewsLast30d: 3800,
    conversionRate: 7.5,
  },
  {
    id: "svc-004",
    slug: "application-mobile-react-native-ios-android",
    title: "Application mobile React Native iOS & Android",
    description:
      "Application mobile cross-platform performante. UI moderne, notifications push, API integration et publication stores.",
    freelancerName: "Moussa Traore",
    freelancerUsername: "moussa-traore",
    freelancerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Moussa",
    rating: 4.88,
    reviewCount: 196,
    totalOrders: 218,
    priceEur: 2000,
    category: "Developpement & Tech",
    categorySlug: "developpement",
    deliveryDays: 21,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    featured: false,
    createdAt: "2024-07-15",
    ordersLast30d: 12,
    ordersLast7d: 5,
    viewsLast30d: 2900,
    conversionRate: 5.1,
  },
  {
    id: "svc-005",
    slug: "montage-video-professionnel-youtube-tiktok",
    title: "Montage video professionnel YouTube/TikTok",
    description:
      "Montage video dynamique avec motion graphics, sous-titres animes, transitions et musique. Formats optimises pour chaque plateforme.",
    freelancerName: "Ousmane Diop",
    freelancerUsername: "ousmane-diop",
    freelancerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ousmane",
    rating: 4.86,
    reviewCount: 156,
    totalOrders: 178,
    priceEur: 200,
    category: "Video & Animation",
    categorySlug: "video",
    deliveryDays: 3,
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
    featured: false,
    createdAt: "2024-06-01",
    ordersLast30d: 20,
    ordersLast7d: 8,
    viewsLast30d: 3100,
    conversionRate: 7.8,
  },
  {
    id: "svc-006",
    slug: "identite-visuelle-complete-entreprise",
    title: "Identite visuelle complete pour entreprise",
    description:
      "Branding complet : logo, palette couleurs, typographie, papeterie, templates reseaux sociaux et guide de marque PDF.",
    freelancerName: "Aminata Diallo",
    freelancerUsername: "aminata-diallo",
    freelancerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aminata",
    rating: 4.97,
    reviewCount: 234,
    totalOrders: 256,
    priceEur: 800,
    category: "Design & Creatif",
    categorySlug: "design-crea",
    deliveryDays: 10,
    image: "https://images.unsplash.com/photo-1634733988138-bf2c3a2a13fa?w=800&q=80",
    featured: true,
    createdAt: "2024-03-20",
    ordersLast30d: 16,
    ordersLast7d: 5,
    viewsLast30d: 2600,
    conversionRate: 6.4,
  },
  {
    id: "svc-007",
    slug: "redaction-articles-seo-francais",
    title: "Redaction d'articles SEO en francais",
    description:
      "Articles de blog optimises pour le referencement naturel. Recherche de mots-cles, structure Hn, meta description et liens internes.",
    freelancerName: "Mariame Kone",
    freelancerUsername: "mariame-kone",
    freelancerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mariame",
    rating: 4.83,
    reviewCount: 187,
    totalOrders: 215,
    priceEur: 60,
    category: "Redaction & Traduction",
    categorySlug: "redaction",
    deliveryDays: 3,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
    featured: false,
    createdAt: "2024-07-10",
    ordersLast30d: 24,
    ordersLast7d: 9,
    viewsLast30d: 2200,
    conversionRate: 9.1,
  },
  {
    id: "svc-008",
    slug: "dashboard-analytics-power-bi-tableau",
    title: "Dashboard analytics avec Power BI / Tableau",
    description:
      "Tableaux de bord interactifs et professionnels. Connexion donnees, KPIs personnalises, rapports automatises et formation incluse.",
    freelancerName: "Fatima Benali",
    freelancerUsername: "fatima-benali",
    freelancerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
    rating: 4.91,
    reviewCount: 112,
    totalOrders: 124,
    priceEur: 450,
    category: "IA & Data Science",
    categorySlug: "ia-data",
    deliveryDays: 7,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    featured: false,
    createdAt: "2025-01-15",
    ordersLast30d: 10,
    ordersLast7d: 4,
    viewsLast30d: 1800,
    conversionRate: 5.8,
  },
  {
    id: "svc-009",
    slug: "campagne-google-ads-meta-ads",
    title: "Campagne Google Ads & Meta Ads optimisee",
    description:
      "Creation et optimisation de campagnes publicitaires Google Ads et Meta Ads. Audit, configuration, A/B testing et reporting mensuel.",
    freelancerName: "Youssef El Amrani",
    freelancerUsername: "youssef-el-amrani",
    freelancerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Youssef",
    rating: 4.94,
    reviewCount: 198,
    totalOrders: 221,
    priceEur: 400,
    category: "Marketing Digital",
    categorySlug: "marketing",
    deliveryDays: 5,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    featured: false,
    createdAt: "2024-05-01",
    ordersLast30d: 18,
    ordersLast7d: 6,
    viewsLast30d: 2400,
    conversionRate: 7.2,
  },
  {
    id: "svc-010",
    slug: "api-backend-nodejs-express",
    title: "API Backend Node.js / Express robuste",
    description:
      "Architecture API REST ou GraphQL avec Node.js. Authentification, validation, tests et documentation Swagger inclus.",
    freelancerName: "Abdou Ndiaye",
    freelancerUsername: "abdou-ndiaye",
    freelancerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abdou",
    rating: 4.89,
    reviewCount: 87,
    totalOrders: 102,
    priceEur: 600,
    category: "Developpement & Tech",
    categorySlug: "developpement",
    deliveryDays: 10,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    featured: false,
    createdAt: "2025-03-01",
    ordersLast30d: 9,
    ordersLast7d: 4,
    viewsLast30d: 1950,
    conversionRate: 5.5,
  },
  {
    id: "svc-011",
    slug: "community-management-reseaux-sociaux",
    title: "Community management & gestion reseaux sociaux",
    description:
      "Gestion complete de vos reseaux sociaux. Calendrier editorial, creation de contenu, moderation et reporting mensuel.",
    freelancerName: "Kwame Asante",
    freelancerUsername: "kwame-asante",
    freelancerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kwame",
    rating: 4.90,
    reviewCount: 145,
    totalOrders: 168,
    priceEur: 280,
    category: "Marketing Digital",
    categorySlug: "marketing",
    deliveryDays: 30,
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
    featured: false,
    createdAt: "2024-04-15",
    ordersLast30d: 14,
    ordersLast7d: 5,
    viewsLast30d: 1700,
    conversionRate: 6.9,
  },
  {
    id: "svc-012",
    slug: "animation-explainer-video-2d",
    title: "Animation explainer video 2D professionnelle",
    description:
      "Video d'animation explicative 2D avec script, storyboard, voix-off et musique. Ideal pour presenter un produit ou service.",
    freelancerName: "Ousmane Diop",
    freelancerUsername: "ousmane-diop",
    freelancerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ousmane",
    rating: 4.84,
    reviewCount: 98,
    totalOrders: 112,
    priceEur: 500,
    category: "Video & Animation",
    categorySlug: "video",
    deliveryDays: 10,
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80",
    featured: false,
    createdAt: "2024-08-20",
    ordersLast30d: 8,
    ordersLast7d: 3,
    viewsLast30d: 1400,
    conversionRate: 5.2,
  },
];

// ------------------------------------------------------------
// 3. MOCK CATEGORIES (simulates categories table with aggregates)
// ------------------------------------------------------------

export const MOCK_CATEGORIES: CategoryRecord[] = [
  {
    icon: "draw",
    title: "Design & Creatif",
    description: "UI/UX, Logos, Branding, Motion Design, Illustrations.",
    slug: "design-crea",
    serviceCount: 8740,
    freelancerCount: 4320,
    avgRating: 4.89,
    totalOrders: 34200,
    growthPercent: 12.5,
  },
  {
    icon: "terminal",
    title: "Developpement & Tech",
    description: "Web, Mobile, API, DevOps, Cloud, Blockchain.",
    slug: "developpement",
    serviceCount: 9850,
    freelancerCount: 5180,
    avgRating: 4.91,
    totalOrders: 41500,
    growthPercent: 18.2,
  },
  {
    icon: "ads_click",
    title: "Marketing Digital",
    description: "SEO, Social Media, Growth Hacking, Publicite.",
    slug: "marketing",
    serviceCount: 6420,
    freelancerCount: 3750,
    avgRating: 4.84,
    totalOrders: 28900,
    growthPercent: 15.8,
  },
  {
    icon: "edit_note",
    title: "Redaction & Traduction",
    description: "Copywriting, Articles, Traduction, Localisation.",
    slug: "redaction",
    serviceCount: 5380,
    freelancerCount: 3420,
    avgRating: 4.82,
    totalOrders: 22100,
    growthPercent: 9.4,
  },
  {
    icon: "videocam",
    title: "Video & Animation",
    description: "Montage, Motion Graphics, 3D, Explainer Videos.",
    slug: "video",
    serviceCount: 4120,
    freelancerCount: 2680,
    avgRating: 4.86,
    totalOrders: 16800,
    growthPercent: 22.1,
  },
  {
    icon: "music_note",
    title: "Musique & Audio",
    description: "Voix-off, Podcast, Jingles, Sound Design.",
    slug: "musique",
    serviceCount: 2870,
    freelancerCount: 1890,
    avgRating: 4.79,
    totalOrders: 9400,
    growthPercent: 7.3,
  },
  {
    icon: "business_center",
    title: "Business & Conseil",
    description: "Strategie, Comptabilite, Juridique, Consulting.",
    slug: "business",
    serviceCount: 3150,
    freelancerCount: 2340,
    avgRating: 4.85,
    totalOrders: 12600,
    growthPercent: 11.6,
  },
  {
    icon: "psychology",
    title: "IA & Data Science",
    description: "Machine Learning, Analyse de donnees, Chatbots, Automatisation.",
    slug: "ia-data",
    serviceCount: 2050,
    freelancerCount: 1420,
    avgRating: 4.90,
    totalOrders: 5800,
    growthPercent: 34.7,
  },
];

// ------------------------------------------------------------
// 4. MOCK TESTIMONIALS
// ------------------------------------------------------------

export const MOCK_TESTIMONIALS: TestimonialRecord[] = [
  {
    id: "test-001",
    quote:
      "J'ai trouve un developpeur incroyable en moins de 24h. Le systeme d'escrow m'a rassure des le depart. Mon application mobile est exactement ce que j'imaginais.",
    name: "Jean-Philippe Mendy",
    role: "Fondateur",
    company: "PaySahel",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JeanPhilippe",
    rating: 5,
    country: "Senegal",
    countryFlag: "SN",
    type: "client",
    createdAt: "2025-11-15",
    verified: true,
  },
  {
    id: "test-002",
    quote:
      "FreelanceHigh m'a permis de doubler mes revenus en 6 mois. Les clients sont serieux et le paiement via Orange Money est un vrai plus pour nous en Afrique de l'Ouest.",
    name: "Aissatou Bah",
    role: "Designer UX/UI Freelance",
    company: "Independante",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aissatou",
    rating: 5,
    country: "Cote d'Ivoire",
    countryFlag: "CI",
    type: "freelance",
    createdAt: "2025-12-02",
    verified: true,
  },
  {
    id: "test-003",
    quote:
      "On utilise FreelanceHigh pour tous nos projets digitaux depuis 8 mois. La gestion d'equipe et le suivi des commandes sont vraiment au top. Un gain de temps enorme.",
    name: "Pierre Fontaine",
    role: "Directeur Digital",
    company: "AgenceNova",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre",
    rating: 5,
    country: "France",
    countryFlag: "FR",
    type: "agence",
    createdAt: "2026-01-10",
    verified: true,
  },
  {
    id: "test-004",
    quote:
      "La qualite des freelances sur cette plateforme est remarquable. J'ai lance 3 projets en parallele et chaque livraison etait dans les temps et au-dela de mes attentes.",
    name: "Nadege Tchatchoua",
    role: "CEO",
    company: "DigiCam Solutions",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nadege",
    rating: 5,
    country: "Cameroun",
    countryFlag: "CM",
    type: "client",
    createdAt: "2026-01-28",
    verified: true,
  },
  {
    id: "test-005",
    quote:
      "Depuis que j'ai rejoint FreelanceHigh, je travaille avec des clients internationaux sans quitter Bruxelles. Le systeme de facturation automatique me simplifie la vie.",
    name: "Youssef El Amrani",
    role: "Consultant SEO Freelance",
    company: "Independant",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Youssef",
    rating: 4,
    country: "Belgique",
    countryFlag: "BE",
    type: "freelance",
    createdAt: "2025-10-18",
    verified: true,
  },
  {
    id: "test-006",
    quote:
      "Le retrait via Mobile Money est instantane et les commissions sont justes. C'est la premiere plateforme qui comprend vraiment les besoins des freelances africains.",
    name: "Rachida Amrani",
    role: "Redactrice & Traductrice",
    company: "Independante",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachida",
    rating: 5,
    country: "Maroc",
    countryFlag: "MA",
    type: "freelance",
    createdAt: "2026-02-05",
    verified: true,
  },
];

// ------------------------------------------------------------
// 5. PAYMENT_METHODS (static — doesn't change)
// ------------------------------------------------------------

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    name: "Visa / Mastercard",
    icon: "credit_card",
    description: "Paiement par carte bancaire internationale securise via Stripe.",
  },
  {
    name: "Orange Money",
    icon: "phone_android",
    description: "Paiement mobile disponible au Senegal, Cote d'Ivoire, Cameroun et 14 autres pays.",
  },
  {
    name: "Wave",
    icon: "waves",
    description: "Transfert d'argent mobile rapide et sans frais caches en Afrique de l'Ouest.",
  },
  {
    name: "MTN Mobile Money",
    icon: "smartphone",
    description: "Paiement mobile MTN MoMo disponible en Cote d'Ivoire, Cameroun et Afrique centrale.",
  },
  {
    name: "PayPal",
    icon: "account_balance_wallet",
    description: "Paiement et retrait international via PayPal pour les freelances du monde entier.",
  },
  {
    name: "Virement SEPA",
    icon: "account_balance",
    description: "Virement bancaire europeen pour les retraits et paiements de grande valeur.",
  },
  {
    name: "USDC / USDT",
    icon: "currency_bitcoin",
    description: "Paiement en crypto stablecoins pour des transactions rapides et sans frontieres.",
  },
];

// ------------------------------------------------------------
// 6. TRENDING_SEARCHES (will be computed from search analytics)
// ------------------------------------------------------------

export const TRENDING_SEARCHES: string[] = [
  "Logo Design",
  "Site WordPress",
  "App Mobile",
  "SEO",
  "Montage Video",
  "Redaction Web",
  "UI/UX Design",
  "React / Next.js",
  "Community Manager",
  "Power BI",
];

// ------------------------------------------------------------
// 7. Helper Functions
// ------------------------------------------------------------

/**
 * Format a large number into a human-readable abbreviated string.
 * Examples: 1234 -> "1.2K", 28500000 -> "28.5M"
 */
export function formatLargeNumber(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";

  if (abs >= 1_000_000_000) {
    const value = abs / 1_000_000_000;
    return `${sign}${stripTrailingZero(value.toFixed(1))}B`;
  }
  if (abs >= 1_000_000) {
    const value = abs / 1_000_000;
    return `${sign}${stripTrailingZero(value.toFixed(1))}M`;
  }
  if (abs >= 1_000) {
    const value = abs / 1_000;
    return `${sign}${stripTrailingZero(value.toFixed(1))}K`;
  }
  return `${sign}${abs}`;
}

function stripTrailingZero(s: string): string {
  return s.endsWith(".0") ? s.slice(0, -2) : s;
}
