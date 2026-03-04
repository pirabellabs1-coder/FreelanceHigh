// ============================================================
// FreelanceHigh — Comprehensive Demo Data
// All data for the fully functional freelance dashboard
// ============================================================

export interface Service {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  tags: string[];
  price: number;
  deliveryDays: number;
  revisions: number;
  status: "actif" | "pause" | "brouillon";
  views: number;
  clicks: number;
  orders: number;
  revenue: number;
  conversionRate: number;
  image: string;
  createdAt: string;
  packages: {
    basic: { name: string; price: number; delivery: number; revisions: number; description: string };
    standard: { name: string; price: number; delivery: number; revisions: number; description: string };
    premium: { name: string; price: number; delivery: number; revisions: number; description: string };
  };
  faq: { question: string; answer: string }[];
  extras: { label: string; price: number }[];
}

export interface Order {
  id: string;
  serviceId: string;
  serviceTitle: string;
  category: string;
  clientName: string;
  clientAvatar: string;
  clientCountry: string;
  status: "en_attente" | "en_cours" | "livre" | "revision" | "termine" | "annule" | "litige";
  amount: number;
  createdAt: string;
  deadline: string;
  deliveredAt: string | null;
  packageType: "basic" | "standard" | "premium";
  progress: number;
  messages: OrderMessage[];
  timeline: TimelineEvent[];
  files: OrderFile[];
  revisionsLeft: number;
}

export interface OrderMessage {
  id: string;
  sender: "freelance" | "client";
  senderName: string;
  content: string;
  timestamp: string;
  type: "text" | "file" | "system";
  fileName?: string;
  fileSize?: string;
}

export interface TimelineEvent {
  id: string;
  type: "created" | "started" | "delivered" | "revision" | "completed" | "cancelled" | "message";
  title: string;
  description: string;
  timestamp: string;
}

export interface OrderFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedBy: "freelance" | "client";
  uploadedAt: string;
  url: string;
}

export interface Transaction {
  id: string;
  type: "vente" | "retrait" | "commission" | "remboursement" | "bonus";
  description: string;
  amount: number;
  status: "complete" | "en_attente" | "echoue";
  date: string;
  orderId?: string;
  method?: string;
}

export interface Conversation {
  id: string;
  contactName: string;
  contactAvatar: string;
  contactRole: "client" | "agence" | "support";
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  online: boolean;
  orderId?: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  sender: "me" | "them";
  content: string;
  timestamp: string;
  type: "text" | "image" | "file";
  fileName?: string;
  fileSize?: string;
  read: boolean;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  images: string[];
  link: string;
  featured: boolean;
  createdAt: string;
  order: number;
}

export interface FreelancerProfile {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  photo: string;
  title: string;
  bio: string;
  city: string;
  country: string;
  hourlyRate: number;
  skills: { name: string; level: "debutant" | "intermediaire" | "expert" }[];
  languages: { name: string; level: string }[];
  links: { linkedin: string; github: string; portfolio: string; behance: string };
  completionPercent: number;
}

export interface AvailabilitySlot {
  day: number; // 0=Lun, 1=Mar, ..., 6=Dim
  dayName: string;
  available: boolean;
  startTime: string;
  endTime: string;
}

export interface NotificationSetting {
  id: string;
  label: string;
  category: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  commission: number;
  features: string[];
  servicesLimit: number | null;
  candidaturesLimit: number | null;
  boostLimit: number;
  current: boolean;
}

// ============================================================
// DEMO DATA
// ============================================================

export const DEMO_SERVICES: Service[] = [
  {
    id: "s1",
    title: "Logo Design Moderne & Minimaliste",
    category: "Identite visuelle",
    subcategory: "Logo",
    description: "Je crée un logo moderne et minimaliste qui représente parfaitement votre marque. Livraison en formats vectoriels (AI, SVG, PDF) et raster (PNG, JPG).",
    tags: ["logo", "design", "branding", "identite-visuelle"],
    price: 45,
    deliveryDays: 3,
    revisions: 2,
    status: "actif",
    views: 4200,
    clicks: 210,
    orders: 12,
    revenue: 540,
    conversionRate: 5.7,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&q=80",
    createdAt: "2025-11-15",
    packages: {
      basic: { name: "Basique", price: 45, delivery: 5, revisions: 1, description: "1 concept de logo + fichiers PNG" },
      standard: { name: "Standard", price: 85, delivery: 3, revisions: 3, description: "3 concepts + fichiers vectoriels + guide couleurs" },
      premium: { name: "Premium", price: 150, delivery: 2, revisions: 5, description: "5 concepts + charte graphique complète + fichiers source" },
    },
    faq: [
      { question: "Quels formats livrez-vous ?", answer: "PNG, JPG, SVG, AI, PDF et EPS." },
      { question: "Combien de révisions ?", answer: "Cela dépend du forfait choisi, de 1 à 5 révisions." },
    ],
    extras: [
      { label: "Livraison express 24h", price: 25 },
      { label: "Fichier source Illustrator", price: 15 },
    ],
  },
  {
    id: "s2",
    title: "Redaction Article Blog SEO 1000 mots",
    category: "Contenu",
    subcategory: "Redaction web",
    description: "Rédaction d'articles de blog optimisés pour le SEO avec recherche de mots-clés, structure Hn et meta description.",
    tags: ["redaction", "seo", "blog", "contenu"],
    price: 60,
    deliveryDays: 2,
    revisions: 1,
    status: "actif",
    views: 2100,
    clicks: 95,
    orders: 3,
    revenue: 180,
    conversionRate: 3.2,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80",
    createdAt: "2025-12-01",
    packages: {
      basic: { name: "Basique", price: 60, delivery: 3, revisions: 1, description: "1 article 1000 mots optimisé SEO" },
      standard: { name: "Standard", price: 100, delivery: 2, revisions: 2, description: "1 article 2000 mots + images libres de droits" },
      premium: { name: "Premium", price: 180, delivery: 2, revisions: 3, description: "3 articles 1500 mots + stratégie de mots-clés" },
    },
    faq: [
      { question: "Faites-vous la recherche de mots-clés ?", answer: "Oui, incluse dans tous les forfaits." },
    ],
    extras: [
      { label: "Recherche de mots-cles approfondie", price: 20 },
    ],
  },
  {
    id: "s3",
    title: "Montage Video Pub Facebook Pro",
    category: "Video",
    subcategory: "Montage",
    description: "Montage vidéo professionnel pour publicités Facebook et Instagram. Motion graphics, sous-titres et call-to-action inclus.",
    tags: ["video", "montage", "facebook", "publicite"],
    price: 120,
    deliveryDays: 5,
    revisions: 2,
    status: "pause",
    views: 1500,
    clicks: 45,
    orders: 0,
    revenue: 0,
    conversionRate: 0,
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&q=80",
    createdAt: "2025-10-20",
    packages: {
      basic: { name: "Basique", price: 120, delivery: 7, revisions: 1, description: "Montage vidéo 30s avec sous-titres" },
      standard: { name: "Standard", price: 200, delivery: 5, revisions: 2, description: "Montage 60s + motion graphics + musique" },
      premium: { name: "Premium", price: 350, delivery: 3, revisions: 3, description: "3 vidéos formats multiples + A/B testing" },
    },
    faq: [],
    extras: [],
  },
  {
    id: "s4",
    title: "Developpement Application React/Next.js",
    category: "Developpement Web",
    subcategory: "Frontend",
    description: "Développement d'applications web modernes avec React et Next.js. TypeScript, Tailwind CSS, API REST/GraphQL.",
    tags: ["react", "nextjs", "typescript", "frontend"],
    price: 120,
    deliveryDays: 14,
    revisions: 3,
    status: "actif",
    views: 3800,
    clicks: 185,
    orders: 8,
    revenue: 2160,
    conversionRate: 4.3,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80",
    createdAt: "2025-09-10",
    packages: {
      basic: { name: "Basique", price: 120, delivery: 14, revisions: 1, description: "Landing page responsive React/Next.js" },
      standard: { name: "Standard", price: 350, delivery: 10, revisions: 3, description: "Application 3-5 pages + authentification" },
      premium: { name: "Premium", price: 700, delivery: 21, revisions: 5, description: "Application complète + dashboard + API" },
    },
    faq: [
      { question: "Quelle stack utilisez-vous ?", answer: "Next.js 14, TypeScript, Tailwind CSS, Prisma." },
      { question: "Déployez-vous l'application ?", answer: "Oui, déploiement Vercel inclus dans Standard et Premium." },
    ],
    extras: [
      { label: "Deploiement Vercel inclus", price: 30 },
      { label: "Tests unitaires", price: 50 },
    ],
  },
  {
    id: "s5",
    title: "Design UI/UX avec Figma",
    category: "Design",
    subcategory: "UI/UX",
    description: "Création d'interfaces utilisateur modernes et user-friendly avec Figma. Wireframes, maquettes haute fidélité et prototypes interactifs.",
    tags: ["figma", "ui", "ux", "design", "prototype"],
    price: 75,
    deliveryDays: 5,
    revisions: 2,
    status: "actif",
    views: 2800,
    clicks: 130,
    orders: 6,
    revenue: 750,
    conversionRate: 4.6,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
    createdAt: "2025-11-01",
    packages: {
      basic: { name: "Basique", price: 75, delivery: 5, revisions: 1, description: "1 page UI design Figma" },
      standard: { name: "Standard", price: 180, delivery: 5, revisions: 3, description: "3 pages + composants réutilisables" },
      premium: { name: "Premium", price: 400, delivery: 7, revisions: 5, description: "Design system complet + prototype cliquable" },
    },
    faq: [],
    extras: [],
  },
  {
    id: "s6",
    title: "API Backend Node.js + Prisma",
    category: "Developpement",
    subcategory: "Backend",
    description: "Développement d'API REST robustes avec Node.js, Express/Fastify et Prisma ORM. Authentification, validation, tests inclus.",
    tags: ["nodejs", "api", "backend", "prisma"],
    price: 95,
    deliveryDays: 10,
    revisions: 2,
    status: "actif",
    views: 1900,
    clicks: 88,
    orders: 5,
    revenue: 475,
    conversionRate: 5.7,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80",
    createdAt: "2025-10-05",
    packages: {
      basic: { name: "Basique", price: 95, delivery: 10, revisions: 1, description: "API REST 5 endpoints + documentation" },
      standard: { name: "Standard", price: 250, delivery: 7, revisions: 2, description: "API complète + auth + tests + déploiement" },
      premium: { name: "Premium", price: 500, delivery: 14, revisions: 3, description: "API + WebSocket + jobs + monitoring" },
    },
    faq: [],
    extras: [],
  },
  {
    id: "s7",
    title: "Audit SEO Technique Complet",
    category: "Marketing",
    subcategory: "SEO",
    description: "Audit SEO technique complet de votre site web avec recommandations actionnables. Performance, accessibilité, Core Web Vitals.",
    tags: ["seo", "audit", "marketing", "performance"],
    price: 350,
    deliveryDays: 7,
    revisions: 1,
    status: "actif",
    views: 1200,
    clicks: 62,
    orders: 4,
    revenue: 1400,
    conversionRate: 6.5,
    image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=400&q=80",
    createdAt: "2025-12-10",
    packages: {
      basic: { name: "Basique", price: 350, delivery: 7, revisions: 0, description: "Audit SEO technique + rapport PDF" },
      standard: { name: "Standard", price: 600, delivery: 7, revisions: 1, description: "Audit + plan d'action + suivi 1 mois" },
      premium: { name: "Premium", price: 1200, delivery: 14, revisions: 2, description: "Audit complet + implémentation + suivi 3 mois" },
    },
    faq: [],
    extras: [],
  },
  {
    id: "s8",
    title: "Formation Next.js 15 App Router",
    category: "Formation",
    subcategory: "Developpement",
    description: "Formation complète sur Next.js 15 App Router : RSC, Server Actions, routing, middleware, déploiement.",
    tags: ["formation", "nextjs", "react", "cours"],
    price: 200,
    deliveryDays: 3,
    revisions: 0,
    status: "brouillon",
    views: 0,
    clicks: 0,
    orders: 0,
    revenue: 0,
    conversionRate: 0,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80",
    createdAt: "2026-01-15",
    packages: {
      basic: { name: "Basique", price: 200, delivery: 3, revisions: 0, description: "Accès cours vidéo 10h" },
      standard: { name: "Standard", price: 350, delivery: 5, revisions: 0, description: "Cours + exercices + code source" },
      premium: { name: "Premium", price: 600, delivery: 7, revisions: 0, description: "Cours + exercices + mentorat 1h + certificat" },
    },
    faq: [],
    extras: [],
  },
];

export const DEMO_ORDERS: Order[] = [
  {
    id: "ORD-1024",
    serviceId: "s5",
    serviceTitle: "Design Dashboard SaaS",
    category: "UI/UX Design",
    clientName: "TechCorp Inc.",
    clientAvatar: "TC",
    clientCountry: "FR",
    status: "en_cours",
    amount: 850,
    createdAt: "2026-02-15",
    deadline: "2026-03-10",
    deliveredAt: null,
    packageType: "premium",
    progress: 65,
    revisionsLeft: 3,
    messages: [
      { id: "m1", sender: "client", senderName: "TechCorp Inc.", content: "Bonjour ! On aimerait un dashboard moderne pour notre SaaS B2B.", timestamp: "2026-02-15T10:00:00", type: "text" },
      { id: "m2", sender: "freelance", senderName: "Vous", content: "Parfait ! J'ai bien noté vos besoins. Je commence par les wireframes.", timestamp: "2026-02-15T10:30:00", type: "text" },
      { id: "m3", sender: "freelance", senderName: "Vous", content: "Voici les premiers wireframes pour validation.", timestamp: "2026-02-18T14:00:00", type: "file", fileName: "wireframes-v1.fig", fileSize: "2.4 MB" },
      { id: "m4", sender: "client", senderName: "TechCorp Inc.", content: "Super travail ! Quelques ajustements sur la sidebar svp.", timestamp: "2026-02-19T09:00:00", type: "text" },
    ],
    timeline: [
      { id: "t1", type: "created", title: "Commande creee", description: "Forfait Premium - Design Dashboard SaaS", timestamp: "2026-02-15T09:00:00" },
      { id: "t2", type: "started", title: "Travail demarre", description: "Vous avez commencé à travailler sur la commande", timestamp: "2026-02-15T10:30:00" },
      { id: "t3", type: "message", title: "Wireframes envoyés", description: "Premier livrable envoyé au client", timestamp: "2026-02-18T14:00:00" },
    ],
    files: [
      { id: "f1", name: "brief-dashboard.pdf", size: "1.2 MB", type: "pdf", uploadedBy: "client", uploadedAt: "2026-02-15T09:15:00", url: "#" },
      { id: "f2", name: "wireframes-v1.fig", size: "2.4 MB", type: "figma", uploadedBy: "freelance", uploadedAt: "2026-02-18T14:00:00", url: "#" },
    ],
  },
  {
    id: "ORD-1019",
    serviceId: "s4",
    serviceTitle: "API Backend Node.js",
    category: "Developpement",
    clientName: "Lamine Diallo",
    clientAvatar: "LD",
    clientCountry: "SN",
    status: "livre",
    amount: 1200,
    createdAt: "2026-01-20",
    deadline: "2026-02-20",
    deliveredAt: "2026-02-18",
    packageType: "premium",
    progress: 100,
    revisionsLeft: 2,
    messages: [
      { id: "m1", sender: "client", senderName: "Lamine Diallo", content: "J'ai besoin d'une API pour mon app de livraison.", timestamp: "2026-01-20T08:00:00", type: "text" },
      { id: "m2", sender: "freelance", senderName: "Vous", content: "Je vous envoie le code source complet et la documentation.", timestamp: "2026-02-18T16:00:00", type: "text" },
    ],
    timeline: [
      { id: "t1", type: "created", title: "Commande creee", description: "Forfait Premium - API Backend", timestamp: "2026-01-20T08:00:00" },
      { id: "t2", type: "started", title: "Travail demarre", description: "Developpement en cours", timestamp: "2026-01-21T09:00:00" },
      { id: "t3", type: "delivered", title: "Livraison effectuee", description: "Code source + documentation livrés", timestamp: "2026-02-18T16:00:00" },
    ],
    files: [
      { id: "f1", name: "api-source-code.zip", size: "8.5 MB", type: "zip", uploadedBy: "freelance", uploadedAt: "2026-02-18T16:00:00", url: "#" },
      { id: "f2", name: "api-documentation.pdf", size: "3.2 MB", type: "pdf", uploadedBy: "freelance", uploadedAt: "2026-02-18T16:00:00", url: "#" },
    ],
  },
  {
    id: "ORD-1016",
    serviceId: "s7",
    serviceTitle: "Audit SEO E-commerce",
    category: "Marketing Digital",
    clientName: "Auto-Focus SARL",
    clientAvatar: "AF",
    clientCountry: "CI",
    status: "en_attente",
    amount: 450,
    createdAt: "2026-02-28",
    deadline: "2026-03-15",
    deliveredAt: null,
    packageType: "standard",
    progress: 0,
    revisionsLeft: 1,
    messages: [
      { id: "m1", sender: "client", senderName: "Auto-Focus SARL", content: "Nous aimerions un audit SEO complet de notre site e-commerce.", timestamp: "2026-02-28T11:00:00", type: "text" },
    ],
    timeline: [
      { id: "t1", type: "created", title: "Commande creee", description: "Forfait Standard - Audit SEO", timestamp: "2026-02-28T11:00:00" },
    ],
    files: [],
  },
  {
    id: "ORD-1012",
    serviceId: "s1",
    serviceTitle: "Logo Startup FinTech",
    category: "Identite visuelle",
    clientName: "Moussa Keita",
    clientAvatar: "MK",
    clientCountry: "ML",
    status: "revision",
    amount: 150,
    createdAt: "2026-02-10",
    deadline: "2026-02-28",
    deliveredAt: null,
    packageType: "premium",
    progress: 80,
    revisionsLeft: 2,
    messages: [
      { id: "m1", sender: "client", senderName: "Moussa Keita", content: "J'aimerais un logo pour ma startup FinTech.", timestamp: "2026-02-10T14:00:00", type: "text" },
      { id: "m2", sender: "freelance", senderName: "Vous", content: "Voici 3 propositions de logo.", timestamp: "2026-02-14T10:00:00", type: "file", fileName: "logos-v1.pdf", fileSize: "5.1 MB" },
      { id: "m3", sender: "client", senderName: "Moussa Keita", content: "J'aime le concept 2, mais j'aimerais des couleurs plus vives.", timestamp: "2026-02-15T08:00:00", type: "text" },
    ],
    timeline: [
      { id: "t1", type: "created", title: "Commande creee", description: "Forfait Premium - Logo FinTech", timestamp: "2026-02-10T14:00:00" },
      { id: "t2", type: "started", title: "Travail demarre", description: "Recherche et brainstorming", timestamp: "2026-02-11T09:00:00" },
      { id: "t3", type: "delivered", title: "Premiere livraison", description: "3 concepts envoyés", timestamp: "2026-02-14T10:00:00" },
      { id: "t4", type: "revision", title: "Revision demandee", description: "Ajustement couleurs demandé", timestamp: "2026-02-15T08:00:00" },
    ],
    files: [
      { id: "f1", name: "logos-v1.pdf", size: "5.1 MB", type: "pdf", uploadedBy: "freelance", uploadedAt: "2026-02-14T10:00:00", url: "#" },
    ],
  },
  {
    id: "ORD-1008",
    serviceId: "s2",
    serviceTitle: "Pack 5 Articles Blog",
    category: "Contenu",
    clientName: "Marie Dupont",
    clientAvatar: "MD",
    clientCountry: "FR",
    status: "termine",
    amount: 300,
    createdAt: "2026-01-05",
    deadline: "2026-01-20",
    deliveredAt: "2026-01-18",
    packageType: "standard",
    progress: 100,
    revisionsLeft: 0,
    messages: [
      { id: "m1", sender: "client", senderName: "Marie Dupont", content: "Merci pour ce travail excellent !", timestamp: "2026-01-19T11:00:00", type: "text" },
    ],
    timeline: [
      { id: "t1", type: "created", title: "Commande creee", description: "Forfait Standard - Pack Articles", timestamp: "2026-01-05T10:00:00" },
      { id: "t2", type: "started", title: "Travail demarre", description: "Rédaction en cours", timestamp: "2026-01-06T09:00:00" },
      { id: "t3", type: "delivered", title: "Livraison effectuee", description: "5 articles livrés", timestamp: "2026-01-18T15:00:00" },
      { id: "t4", type: "completed", title: "Commande terminee", description: "Client satisfait", timestamp: "2026-01-19T11:00:00" },
    ],
    files: [
      { id: "f1", name: "articles-blog-pack.zip", size: "1.8 MB", type: "zip", uploadedBy: "freelance", uploadedAt: "2026-01-18T15:00:00", url: "#" },
    ],
  },
  {
    id: "ORD-1003",
    serviceId: "s4",
    serviceTitle: "Application Mobile React Native",
    category: "Developpement",
    clientName: "Ibrahim Traore",
    clientAvatar: "IT",
    clientCountry: "BF",
    status: "annule",
    amount: 700,
    createdAt: "2025-12-15",
    deadline: "2026-01-15",
    deliveredAt: null,
    packageType: "premium",
    progress: 25,
    revisionsLeft: 5,
    messages: [
      { id: "m1", sender: "client", senderName: "Ibrahim Traore", content: "Je dois malheureusement annuler, changement de budget.", timestamp: "2025-12-28T10:00:00", type: "text" },
    ],
    timeline: [
      { id: "t1", type: "created", title: "Commande creee", description: "Forfait Premium - App Mobile", timestamp: "2025-12-15T10:00:00" },
      { id: "t2", type: "started", title: "Travail demarre", description: "Architecture et wireframes", timestamp: "2025-12-16T09:00:00" },
      { id: "t3", type: "cancelled", title: "Commande annulee", description: "Annulée par le client", timestamp: "2025-12-28T10:00:00" },
    ],
    files: [],
  },
];

export const DEMO_TRANSACTIONS: Transaction[] = [
  { id: "tx1", type: "vente", description: "Commande ORD-1024 - Design Dashboard SaaS", amount: 850, status: "en_attente", date: "2026-02-15", orderId: "ORD-1024" },
  { id: "tx2", type: "vente", description: "Commande ORD-1019 - API Backend Node.js", amount: 1200, status: "complete", date: "2026-02-18", orderId: "ORD-1019" },
  { id: "tx3", type: "commission", description: "Commission FreelanceHigh (15%) - ORD-1019", amount: -180, status: "complete", date: "2026-02-18" },
  { id: "tx4", type: "retrait", description: "Retrait vers Wave - SN", amount: -500, status: "complete", date: "2026-02-20", method: "Wave" },
  { id: "tx5", type: "vente", description: "Commande ORD-1012 - Logo Startup FinTech", amount: 150, status: "en_attente", date: "2026-02-10", orderId: "ORD-1012" },
  { id: "tx6", type: "vente", description: "Commande ORD-1008 - Pack 5 Articles Blog", amount: 300, status: "complete", date: "2026-01-18", orderId: "ORD-1008" },
  { id: "tx7", type: "commission", description: "Commission FreelanceHigh (15%) - ORD-1008", amount: -45, status: "complete", date: "2026-01-18" },
  { id: "tx8", type: "retrait", description: "Retrait vers virement SEPA", amount: -800, status: "complete", date: "2026-01-25", method: "SEPA" },
  { id: "tx9", type: "bonus", description: "Bonus de bienvenue FreelanceHigh", amount: 25, status: "complete", date: "2025-11-15" },
  { id: "tx10", type: "retrait", description: "Retrait vers Orange Money", amount: -200, status: "echoue", date: "2026-02-01", method: "Orange Money" },
  { id: "tx11", type: "vente", description: "Commande terminée - UI/UX Design", amount: 400, status: "complete", date: "2026-01-02" },
  { id: "tx12", type: "vente", description: "Commande terminée - API Backend", amount: 250, status: "complete", date: "2025-12-20" },
];

export const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: "conv1",
    contactName: "TechCorp Inc.",
    contactAvatar: "TC",
    contactRole: "client",
    lastMessage: "Super travail ! Quelques ajustements sur la sidebar svp.",
    lastMessageTime: "2026-02-19T09:00:00",
    unread: 1,
    online: true,
    orderId: "ORD-1024",
    messages: [
      { id: "cm1", sender: "them", content: "Bonjour ! On aimerait un dashboard moderne pour notre SaaS B2B.", timestamp: "2026-02-15T10:00:00", type: "text", read: true },
      { id: "cm2", sender: "me", content: "Parfait ! J'ai bien noté vos besoins. Je commence par les wireframes.", timestamp: "2026-02-15T10:30:00", type: "text", read: true },
      { id: "cm3", sender: "me", content: "Voici les premiers wireframes pour validation.", timestamp: "2026-02-18T14:00:00", type: "file", fileName: "wireframes-v1.fig", fileSize: "2.4 MB", read: true },
      { id: "cm4", sender: "them", content: "Super travail ! Quelques ajustements sur la sidebar svp.", timestamp: "2026-02-19T09:00:00", type: "text", read: false },
    ],
  },
  {
    id: "conv2",
    contactName: "Lamine Diallo",
    contactAvatar: "LD",
    contactRole: "client",
    lastMessage: "Merci beaucoup, l'API fonctionne parfaitement !",
    lastMessageTime: "2026-02-20T14:00:00",
    unread: 0,
    online: false,
    orderId: "ORD-1019",
    messages: [
      { id: "cm1", sender: "them", content: "J'ai besoin d'une API pour mon app de livraison.", timestamp: "2026-01-20T08:00:00", type: "text", read: true },
      { id: "cm2", sender: "me", content: "Bien reçu ! Je prépare l'architecture.", timestamp: "2026-01-20T09:00:00", type: "text", read: true },
      { id: "cm3", sender: "me", content: "Voici le code source et la documentation.", timestamp: "2026-02-18T16:00:00", type: "file", fileName: "api-source.zip", fileSize: "8.5 MB", read: true },
      { id: "cm4", sender: "them", content: "Merci beaucoup, l'API fonctionne parfaitement !", timestamp: "2026-02-20T14:00:00", type: "text", read: true },
    ],
  },
  {
    id: "conv3",
    contactName: "Moussa Keita",
    contactAvatar: "MK",
    contactRole: "client",
    lastMessage: "J'aime le concept 2, mais j'aimerais des couleurs plus vives.",
    lastMessageTime: "2026-02-15T08:00:00",
    unread: 2,
    online: true,
    orderId: "ORD-1012",
    messages: [
      { id: "cm1", sender: "them", content: "J'aimerais un logo pour ma startup FinTech.", timestamp: "2026-02-10T14:00:00", type: "text", read: true },
      { id: "cm2", sender: "me", content: "Super projet ! Je commence les recherches.", timestamp: "2026-02-10T15:00:00", type: "text", read: true },
      { id: "cm3", sender: "me", content: "Voici 3 propositions de logo.", timestamp: "2026-02-14T10:00:00", type: "file", fileName: "logos-v1.pdf", fileSize: "5.1 MB", read: true },
      { id: "cm4", sender: "them", content: "J'aime le concept 2, mais j'aimerais des couleurs plus vives.", timestamp: "2026-02-15T08:00:00", type: "text", read: false },
      { id: "cm5", sender: "them", content: "Pouvez-vous aussi tester avec un fond sombre ?", timestamp: "2026-02-15T08:05:00", type: "text", read: false },
    ],
  },
  {
    id: "conv4",
    contactName: "Support FreelanceHigh",
    contactAvatar: "FH",
    contactRole: "support",
    lastMessage: "Votre retrait a été traité avec succès.",
    lastMessageTime: "2026-02-21T10:00:00",
    unread: 0,
    online: true,
    messages: [
      { id: "cm1", sender: "me", content: "Mon retrait vers Wave est en attente depuis 3 jours.", timestamp: "2026-02-20T09:00:00", type: "text", read: true },
      { id: "cm2", sender: "them", content: "Nous vérifions votre retrait. Merci de patienter.", timestamp: "2026-02-20T10:00:00", type: "text", read: true },
      { id: "cm3", sender: "them", content: "Votre retrait a été traité avec succès.", timestamp: "2026-02-21T10:00:00", type: "text", read: true },
    ],
  },
];

export const DEMO_PORTFOLIO: PortfolioProject[] = [
  {
    id: "p1",
    title: "Dashboard Analytics SaaS",
    description: "Design et développement d'un dashboard analytics pour une startup SaaS. Interface moderne avec graphiques interactifs et dark mode.",
    category: "UI/UX Design",
    skills: ["Figma", "React", "Tailwind CSS", "Recharts"],
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    ],
    link: "https://example.com/dashboard",
    featured: true,
    createdAt: "2026-01-15",
    order: 0,
  },
  {
    id: "p2",
    title: "Plateforme E-commerce Afrique",
    description: "Développement full-stack d'une plateforme e-commerce ciblant le marché africain. Paiements Mobile Money intégrés.",
    category: "Developpement Web",
    skills: ["Next.js", "Node.js", "Prisma", "CinetPay"],
    images: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
    ],
    link: "https://example.com/ecommerce",
    featured: true,
    createdAt: "2025-12-01",
    order: 1,
  },
  {
    id: "p3",
    title: "Branding Startup FinTech",
    description: "Identité visuelle complète pour une startup FinTech : logo, charte graphique, supports marketing.",
    category: "Identite visuelle",
    skills: ["Illustrator", "Photoshop", "Branding"],
    images: [
      "https://images.unsplash.com/photo-1634733988138-bf2c3a2a13fa?w=600&q=80",
    ],
    link: "",
    featured: false,
    createdAt: "2025-11-10",
    order: 2,
  },
  {
    id: "p4",
    title: "API de Gestion de Flotte",
    description: "API REST complète pour un système de gestion de flotte de véhicules avec tracking temps réel et reporting.",
    category: "Backend",
    skills: ["Node.js", "PostgreSQL", "Socket.io", "Docker"],
    images: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80",
    ],
    link: "https://github.com/example/fleet-api",
    featured: true,
    createdAt: "2025-10-20",
    order: 3,
  },
];

export const DEMO_PROFILE: FreelancerProfile = {
  firstName: "Gildas",
  lastName: "Lissanon",
  username: "gildas-dev",
  email: "gildas@freelancehigh.com",
  phone: "+225 07 12 34 56",
  photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  title: "Developpeur Full-Stack & Designer UI/UX",
  bio: "Développeur passionné basé à Abidjan, spécialisé en React/Next.js et design d'interfaces modernes. +5 ans d'expérience avec des clients internationaux.",
  city: "Abidjan",
  country: "Cote d'Ivoire",
  hourlyRate: 45,
  skills: [
    { name: "React/Next.js", level: "expert" },
    { name: "TypeScript", level: "expert" },
    { name: "Node.js", level: "expert" },
    { name: "Figma", level: "intermediaire" },
    { name: "Tailwind CSS", level: "expert" },
    { name: "PostgreSQL", level: "intermediaire" },
    { name: "Docker", level: "intermediaire" },
    { name: "SEO", level: "debutant" },
  ],
  languages: [
    { name: "Francais", level: "Natif" },
    { name: "Anglais", level: "Courant" },
  ],
  links: {
    linkedin: "https://linkedin.com/in/gildas-dev",
    github: "https://github.com/gildas-dev",
    portfolio: "https://gildas.dev",
    behance: "",
  },
  completionPercent: 85,
};

export const DEMO_AVAILABILITY: AvailabilitySlot[] = [
  { day: 0, dayName: "Lundi", available: true, startTime: "09:00", endTime: "18:00" },
  { day: 1, dayName: "Mardi", available: true, startTime: "09:00", endTime: "18:00" },
  { day: 2, dayName: "Mercredi", available: true, startTime: "09:00", endTime: "18:00" },
  { day: 3, dayName: "Jeudi", available: true, startTime: "09:00", endTime: "18:00" },
  { day: 4, dayName: "Vendredi", available: true, startTime: "09:00", endTime: "16:00" },
  { day: 5, dayName: "Samedi", available: false, startTime: "10:00", endTime: "13:00" },
  { day: 6, dayName: "Dimanche", available: false, startTime: "10:00", endTime: "13:00" },
];

export const DEMO_NOTIFICATION_SETTINGS: NotificationSetting[] = [
  { id: "n1", label: "Nouvelle commande", category: "Commandes", email: true, push: true, sms: false },
  { id: "n2", label: "Commande livree", category: "Commandes", email: true, push: true, sms: false },
  { id: "n3", label: "Revision demandee", category: "Commandes", email: true, push: true, sms: true },
  { id: "n4", label: "Nouveau message", category: "Messages", email: false, push: true, sms: false },
  { id: "n5", label: "Paiement recu", category: "Finances", email: true, push: true, sms: true },
  { id: "n6", label: "Retrait traite", category: "Finances", email: true, push: false, sms: false },
  { id: "n7", label: "Nouvelle candidature", category: "Candidatures", email: true, push: true, sms: false },
  { id: "n8", label: "Avis recu", category: "Avis", email: true, push: true, sms: false },
  { id: "n9", label: "Rappel de delai", category: "Commandes", email: true, push: true, sms: true },
];

export const DEMO_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Gratuit",
    price: 0,
    commission: 20,
    features: ["3 services actifs", "5 candidatures/mois", "Support email", "Profil public"],
    servicesLimit: 3,
    candidaturesLimit: 5,
    boostLimit: 0,
    current: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 15,
    commission: 15,
    features: ["15 services actifs", "20 candidatures/mois", "1 boost/mois", "Certifications IA", "Support prioritaire", "Badge Pro"],
    servicesLimit: 15,
    candidaturesLimit: 20,
    boostLimit: 1,
    current: true,
  },
  {
    id: "business",
    name: "Business",
    price: 45,
    commission: 10,
    features: ["Services illimites", "Candidatures illimitees", "5 boosts/mois", "Cles API", "Analytics avances", "Badge Business", "Support dedie"],
    servicesLimit: null,
    candidaturesLimit: null,
    boostLimit: 5,
    current: false,
  },
];

// Revenue data for charts
export const MONTHLY_REVENUE = [
  { month: "Sep", revenue: 450, orders: 3 },
  { month: "Oct", revenue: 875, orders: 5 },
  { month: "Nov", revenue: 1200, orders: 7 },
  { month: "Dec", revenue: 950, orders: 4 },
  { month: "Jan", revenue: 1650, orders: 9 },
  { month: "Fev", revenue: 2100, orders: 11 },
  { month: "Mar", revenue: 1800, orders: 8 },
];

export const WEEKLY_ORDERS = [
  { week: "S1", orders: 2 },
  { week: "S2", orders: 4 },
  { week: "S3", orders: 3 },
  { week: "S4", orders: 5 },
  { week: "S5", orders: 3 },
  { week: "S6", orders: 6 },
  { week: "S7", orders: 4 },
  { week: "S8", orders: 7 },
];

export const PROFILE_VIEWS = [
  { date: "Lun", views: 45 },
  { date: "Mar", views: 62 },
  { date: "Mer", views: 38 },
  { date: "Jeu", views: 71 },
  { date: "Ven", views: 55 },
  { date: "Sam", views: 28 },
  { date: "Dim", views: 19 },
];

export const TRAFFIC_SOURCES = [
  { name: "Recherche", value: 45, color: "#0e7c66" },
  { name: "Direct", value: 25, color: "#f2b705" },
  { name: "Reseaux sociaux", value: 20, color: "#0EA5E9" },
  { name: "Autres", value: 10, color: "#94a3b8" },
];

export const INVOICES = [
  { id: "INV-2026-001", date: "2026-01-01", amount: 15, description: "Abonnement Pro - Janvier 2026", status: "payee" as const },
  { id: "INV-2026-002", date: "2026-02-01", amount: 15, description: "Abonnement Pro - Fevrier 2026", status: "payee" as const },
  { id: "INV-2026-003", date: "2026-03-01", amount: 15, description: "Abonnement Pro - Mars 2026", status: "en_attente" as const },
];
