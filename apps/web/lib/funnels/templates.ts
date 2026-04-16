// ═══════════════════════════════════════════════════════════════════════════
// LANDING PAGE TEMPLATES — 6 STRUCTURALLY DIFFERENT high-conversion designs
// ═══════════════════════════════════════════════════════════════════════════
//
// Design principle: each template has UNIQUE structural elements, not just
// different colors. Every template features blocks that the others don't
// have, producing genuinely different page architectures.
//
// Differentiators per template:
//   T1 Coach Premium    → Mentor portrait split + "Mon parcours" timeline + Calendar CTA
//   T2 Lancement        → BONUS STACK with crossed prices + Multi-CTA + Objection FAQ
//   T3 SaaS Tech        → Logo bar + "vs concurrence" comparison + Integration grid
//   T4 Business B2B     → 4 piliers méthodologie + Case study sectoriel + OPCO mention
//   T5 Créatif          → Galerie 3x2 + Mon processus créatif + Pricing intimate
//   T6 Webinar Live     → Date+heure prominents + AGENDA timestamps + Speaker bio
//
// ═══════════════════════════════════════════════════════════════════════════

type Block = { id: string; type: string; data: Record<string, unknown> };

let counter = 0;
function nid(): string {
  return `t-${Date.now()}-${counter++}-${Math.random().toString(36).slice(2, 5)}`;
}

const img = (seed: string, w = 1200, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export type LandingTemplate = {
  key: string;
  label: string;
  tagline: string;
  description: string;
  vibe: string;
  icon: string;
  palette: string[];
  preview: string;
  uniqueElements: string[];   // What makes THIS template different
  build: () => Block[];
};

// ═════════════════════════════════════════════════════════════════════════════
// T1 — COACH PREMIUM (Navy + Gold)
// UNIQUE: Mentor split-hero · Mon parcours timeline · Réservation appel CTA
// ═════════════════════════════════════════════════════════════════════════════
const coachPremium: LandingTemplate = {
  key: "coach-premium",
  label: "Coach Premium",
  tagline: "Coaching individuel haut de gamme",
  description: "Pour mentors et consultants individuels. Met votre parcours et votre méthode au centre. Design sombre + accents dorés = perception de prestige et d'expertise.",
  vibe: "premium",
  icon: "diamond",
  palette: ["#0f172a", "#fbbf24", "#f8fafc"],
  preview: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #fbbf24 100%)",
  uniqueElements: ["Hero split portrait/texte", "Timeline parcours en 3 dates", "CTA \"Réserver appel\""],
  build: () => [
    // ─── HERO SPLIT (image gauche, texte droite) ─────────────────────────────
    {
      id: nid(), type: "section",
      data: {
        bgColor: "linear-gradient(135deg, #0f172a, #1e293b)", textColor: "#ffffff",
        paddingY: 80, paddingX: 16, maxWidth: 1280, bgImage: "",
        blocks: [
          { id: nid(), type: "row",
            data: {
              gap: 56, padding: 0, bgColor: "",
              columns: [
                { blocks: [
                  { id: nid(), type: "image", data: { url: img("coach-portrait-v2", 800, 1000), alt: "Votre coach", align: "center", radius: 24 } },
                ] },
                { blocks: [
                  { id: nid(), type: "text", data: { content: "✨  COACHING PERSONNALISÉ", align: "left", size: 12, color: "#fbbf24" } },
                  { id: nid(), type: "heading", data: { content: "Atteignez votre prochain palier en 90 jours", level: 1, align: "left", color: "#ffffff" } },
                  { id: nid(), type: "text", data: { content: "Un accompagnement individuel intensif pour les entrepreneurs ambitieux qui veulent franchir un cap décisif sans perdre 2 ans à tâtonner.", align: "left", size: 18, color: "#cbd5e1" } },
                  { id: nid(), type: "spacer", data: { height: 12 } },
                  { id: nid(), type: "list", data: { items: ["12 sessions individuelles · 1h chacune", "Plan personnalisé 90 jours", "WhatsApp prioritaire 24/7"], icon: "verified", color: "#fbbf24" } },
                  { id: nid(), type: "spacer", data: { height: 16 } },
                  { id: nid(), type: "button", data: { text: "📞  Réserver mon appel découverte (gratuit)", link: "", linkType: "external", style: "primary", size: "lg", align: "left", bgColor: "#fbbf24", textColor: "#0f172a", fullWidth: false, icon: "" } },
                ] },
              ],
            },
          },
        ],
      },
    },
    // ─── STATS GOLD ──────────────────────────────────────────────────────────
    {
      id: nid(), type: "stats",
      data: {
        title: "", subtitle: "", columns: 3, bgColor: "#f8fafc", valueColor: "#0f172a",
        items: [
          { value: "200", prefix: "+", suffix: "", label: "Entrepreneurs accompagnés", icon: "groups" },
          { value: "92", prefix: "", suffix: "%", label: "Atteignent leur objectif", icon: "trending_up" },
          { value: "10", prefix: "", suffix: " ans", label: "D'expérience terrain", icon: "workspace_premium" },
        ],
      },
    },
    // ─── PARCOURS TIMELINE (UNIQUE) ──────────────────────────────────────────
    {
      id: nid(), type: "section",
      data: {
        bgColor: "#ffffff", textColor: "", paddingY: 72, paddingX: 16, maxWidth: 1152, bgImage: "",
        blocks: [
          { id: nid(), type: "text", data: { content: "MON PARCOURS", align: "center", size: 12, color: "#fbbf24" } },
          { id: nid(), type: "heading", data: { content: "10 ans à transformer des vies professionnelles", level: 2, align: "center", color: "#0f172a" } },
          { id: nid(), type: "spacer", data: { height: 32 } },
          { id: nid(), type: "row",
            data: {
              gap: 24, padding: 0, bgColor: "",
              columns: [
                { blocks: [{ id: nid(), type: "icon-box", data: { icon: "looks_one", title: "2014 — Premiers clients", desc: "Lance mon activité de coach après 5 ans de salariat. 12 premiers clients en 6 mois.", align: "center", color: "#fbbf24" } }] },
                { blocks: [{ id: nid(), type: "icon-box", data: { icon: "looks_two", title: "2018 — Méthode brevetée", desc: "Formalise la méthode 3-phases après 50 accompagnements réussis. Speaker TEDx.", align: "center", color: "#fbbf24" } }] },
                { blocks: [{ id: nid(), type: "icon-box", data: { icon: "looks_3", title: "2024 — 200+ entrepreneurs", desc: "Communauté de 200+ alumnis, taux de succès stable à 92%, partenariats institutionnels.", align: "center", color: "#fbbf24" } }] },
              ],
            },
          },
        ],
      },
    },
    // ─── METHODE 3 PHASES ────────────────────────────────────────────────────
    {
      id: nid(), type: "features",
      data: {
        title: "Ma méthode en 3 phases",
        columns: 3,
        items: [
          { icon: "search", title: "Phase 1 · Diagnostic 360°", desc: "Audit complet : forces, blocages, opportunités. Vous comprenez où vous êtes vraiment." },
          { icon: "rocket_launch", title: "Phase 2 · Plan d'action", desc: "Roadmap personnalisée 90 jours. Objectifs SMART, jalons clairs, KPIs mesurables." },
          { icon: "support_agent", title: "Phase 3 · Accompagnement", desc: "12 sessions hebdo + WhatsApp prio. Vous n'avancez plus jamais seul." },
        ],
      },
    },
    // ─── TESTIMONIALS ────────────────────────────────────────────────────────
    {
      id: nid(), type: "testimonials",
      data: {
        title: "Résultats concrets de mes alumnis", columns: 2,
        items: [
          { name: "Aminata D.", role: "Fondatrice e-commerce · Dakar", text: "En 4 mois, j'ai triplé mon CA et structuré une équipe de 8 personnes. L'investissement le plus rentable de ma carrière.", rating: 5 },
          { name: "Marc-Étienne L.", role: "CEO SaaS · Abidjan", text: "Sans cette méthode, je tournerais encore en rond. La clarté apportée vaut largement le prix payé.", rating: 5 },
        ],
      },
    },
    // ─── PRICING + RÉSERVATION CTA ───────────────────────────────────────────
    {
      id: nid(), type: "pricing",
      data: {
        title: "Programme complet 90 jours", price: 250000, originalPrice: 0, currency: "FCFA",
        benefits: ["12 sessions individuelles (1h)", "WhatsApp prioritaire 24/7", "Méthode brevetée + workbooks", "Bilan 360° après 90 jours", "Garantie résultat ou remboursement"],
        benefitIcon: "auto_awesome",
        ctaText: "📞  Réserver mon appel découverte", ctaLink: "",
        badgeText: "ACCOMPAGNEMENT VIP", badgeColor: "#fbbf24",
        guaranteeText: "Premier appel offert · Engagement après validation mutuelle",
        accentColor: "#fbbf24",
      },
    },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// T2 — LANCEMENT EXPRESS (Red + Orange)
// UNIQUE: BONUS STACK avec valeurs cumulées · Multi-CTA répétés · FAQ objections
// ═════════════════════════════════════════════════════════════════════════════
const lancementExpress: LandingTemplate = {
  key: "lancement-express",
  label: "Lancement Express",
  tagline: "Lancement chaud avec urgence et bonus stack",
  description: "Pour lancer un produit avec urgence maximale. Page longue qui empile les preuves : countdown, bonus avec valeur cumulée, témoignages multiples, FAQ d'objections, multi-CTAs.",
  vibe: "urgent",
  icon: "local_fire_department",
  palette: ["#dc2626", "#f97316", "#fef3c7"],
  preview: "linear-gradient(135deg, #dc2626 0%, #f97316 50%, #facc15 100%)",
  uniqueElements: ["BONUS STACK avec valeur cumulée", "Countdown + multi-CTAs", "FAQ orientée objections"],
  build: () => [
    // ─── HERO ENERGIE ────────────────────────────────────────────────────────
    {
      id: nid(), type: "hero",
      data: {
        badge: "🔥  OFFRE DE LANCEMENT -50%",
        headline: "La méthode qui a déjà transformé +1 247 personnes",
        subheadline: "Disponible à prix lancement pendant 48h. Après, le prix double et 3 bonus disparaissent. Ne ratez pas le coche.",
        ctaText: "Je réserve ma place maintenant",
        ctaLink: "",
        imageUrl: img("rocket-launch-v2", 1000, 800),
        bgColor: "linear-gradient(135deg, #dc2626, #f97316)",
        textColor: "#ffffff",
      },
    },
    // ─── COUNTDOWN ───────────────────────────────────────────────────────────
    {
      id: nid(), type: "countdown",
      data: { title: "⏱  Cette offre expire dans :", endsInHours: 48, subtitle: "Après cette date, retour au tarif plein. Pas de seconde chance." },
    },
    // ─── STATS MASSIVES ──────────────────────────────────────────────────────
    {
      id: nid(), type: "stats",
      data: {
        title: "", subtitle: "", columns: 4, bgColor: "#ffffff", valueColor: "#dc2626",
        items: [
          { value: "1247", prefix: "+", suffix: "", label: "Clients satisfaits", icon: "groups" },
          { value: "94", prefix: "", suffix: "%", label: "Atteignent leur objectif", icon: "trending_up" },
          { value: "4.9", prefix: "", suffix: "/5", label: "Note moyenne", icon: "star" },
          { value: "30", prefix: "", suffix: " jours", label: "Garantie satisfait", icon: "verified_user" },
        ],
      },
    },
    // ─── BONUS STACK (UNIQUE — visualise la valeur cumulée) ──────────────────
    {
      id: nid(), type: "section",
      data: {
        bgColor: "linear-gradient(135deg, #fef3c7, #fed7aa)", textColor: "", paddingY: 72, paddingX: 16, maxWidth: 1024, bgImage: "",
        blocks: [
          { id: nid(), type: "text", data: { content: "🎁  TOUT CE QUE VOUS RECEVEZ", align: "center", size: 12, color: "#dc2626" } },
          { id: nid(), type: "heading", data: { content: "Valeur totale : 250 000 FCFA", level: 2, align: "center", color: "#7c2d12" } },
          { id: nid(), type: "text", data: { content: "Aujourd'hui à seulement 25 000 FCFA — soit 90% de remise", align: "center", size: 16, color: "#92400e" } },
          { id: nid(), type: "spacer", data: { height: 24 } },
          // Stack visual avec content-boxes
          { id: nid(), type: "content-box",
            data: {
              bgColor: "#ffffff", borderColor: "#fbbf24", borderWidth: 2, radius: 16, padding: 20, shadow: "md",
              blocks: [
                { id: nid(), type: "row", data: { gap: 16, padding: 0, bgColor: "",
                  columns: [
                    { blocks: [{ id: nid(), type: "icon-box", data: { icon: "ondemand_video", title: "Formation principale (12h vidéo HD)", desc: "", align: "left", color: "#dc2626" } }] },
                    { blocks: [{ id: nid(), type: "heading", data: { content: "150 000 F", level: 3, align: "right", color: "#dc2626" } }] },
                  ],
                } },
              ],
            },
          },
          { id: nid(), type: "content-box",
            data: {
              bgColor: "#ffffff", borderColor: "#fbbf24", borderWidth: 2, radius: 16, padding: 20, shadow: "md",
              blocks: [
                { id: nid(), type: "row", data: { gap: 16, padding: 0, bgColor: "",
                  columns: [
                    { blocks: [{ id: nid(), type: "icon-box", data: { icon: "menu_book", title: "BONUS 1 · Workbook 80 pages", desc: "", align: "left", color: "#f97316" } }] },
                    { blocks: [{ id: nid(), type: "heading", data: { content: "30 000 F", level: 3, align: "right", color: "#f97316" } }] },
                  ],
                } },
              ],
            },
          },
          { id: nid(), type: "content-box",
            data: {
              bgColor: "#ffffff", borderColor: "#fbbf24", borderWidth: 2, radius: 16, padding: 20, shadow: "md",
              blocks: [
                { id: nid(), type: "row", data: { gap: 16, padding: 0, bgColor: "",
                  columns: [
                    { blocks: [{ id: nid(), type: "icon-box", data: { icon: "groups", title: "BONUS 2 · Communauté privée à vie", desc: "", align: "left", color: "#f97316" } }] },
                    { blocks: [{ id: nid(), type: "heading", data: { content: "40 000 F", level: 3, align: "right", color: "#f97316" } }] },
                  ],
                } },
              ],
            },
          },
          { id: nid(), type: "content-box",
            data: {
              bgColor: "#ffffff", borderColor: "#fbbf24", borderWidth: 2, radius: 16, padding: 20, shadow: "md",
              blocks: [
                { id: nid(), type: "row", data: { gap: 16, padding: 0, bgColor: "",
                  columns: [
                    { blocks: [{ id: nid(), type: "icon-box", data: { icon: "live_help", title: "BONUS 3 · Sessions Q&A live (2x/mois)", desc: "", align: "left", color: "#f97316" } }] },
                    { blocks: [{ id: nid(), type: "heading", data: { content: "30 000 F", level: 3, align: "right", color: "#f97316" } }] },
                  ],
                } },
              ],
            },
          },
        ],
      },
    },
    // ─── TESTIMONIALS 3 COL ──────────────────────────────────────────────────
    {
      id: nid(), type: "testimonials",
      data: {
        title: "Ils l'ont fait, vous aussi !", columns: 3,
        items: [
          { name: "Aminata D.", role: "Freelance · Dakar", text: "J'ai doublé mes revenus en 3 mois. Cette formation a littéralement changé ma carrière.", rating: 5 },
          { name: "Jean-Baptiste K.", role: "Consultant · Abidjan", text: "Concret, clair, applicable immédiatement. Je recommande les yeux fermés.", rating: 5 },
          { name: "Marie-Claire A.", role: "Entrepreneure · Lomé", text: "J'étais sceptique. Après 30 jours, mes résultats parlent d'eux-mêmes.", rating: 5 },
        ],
      },
    },
    // ─── PRICING ─────────────────────────────────────────────────────────────
    {
      id: nid(), type: "pricing",
      data: {
        title: "Tout pour réussir, à prix lancement", price: 25000, originalPrice: 250000, currency: "FCFA",
        benefits: ["Formation principale (12h vidéo HD)", "BONUS 1 · Workbook PDF 80 pages", "BONUS 2 · Communauté privée à vie", "BONUS 3 · Sessions Q&A 2x/mois", "Accès à vie + mises à jour gratuites", "Support prioritaire 7j/7"],
        benefitIcon: "check_circle",
        ctaText: "🔥  OUI — Je réserve à -90%", ctaLink: "",
        badgeText: "OFFRE LIMITÉE 48H", badgeColor: "#dc2626",
        guaranteeText: "Garantie 30 jours satisfait ou remboursé · Aucune justification demandée",
        accentColor: "#dc2626",
      },
    },
    // ─── FAQ OBJECTIONS (UNIQUE — répond aux freins d'achat) ─────────────────
    {
      id: nid(), type: "faq",
      data: {
        title: "Vos doutes, levés un par un",
        items: [
          { q: "Et si je n'ai pas le temps ?", a: "Modules de 10-15 min. Même 15 min par jour suffisent. La formation est conçue pour les entrepreneurs déjà occupés." },
          { q: "Pourquoi ce prix cassé est suspect ?", a: "Aucune entourloupe. C'est un lancement, on vise du volume sur 48h. Après, prix plein 50 000 + bonus retirés." },
          { q: "Et si ça ne marche pas pour moi ?", a: "Garantie 30 jours sans condition. Si vous n'êtes pas satisfait pour n'importe quelle raison, on rembourse intégralement." },
          { q: "Combien de temps ai-je accès ?", a: "À vie. Mises à jour futures incluses. Vous pouvez revenir aux contenus quand vous voulez, autant que vous voulez." },
          { q: "Puis-je payer en plusieurs fois ?", a: "Oui, paiement en 3x sans frais possible. Sélectionnez l'option à l'étape paiement." },
          { q: "Y a-t-il vraiment une communauté active ?", a: "+1 247 membres actifs, networking quotidien, posts d'élèves qui partagent leurs résultats. Vivante." },
        ],
      },
    },
    // ─── CTA FINAL ───────────────────────────────────────────────────────────
    {
      id: nid(), type: "cta",
      data: {
        headline: "Le timer tourne — ne ratez pas l'occasion",
        subheadline: "Rejoignez les +1 247 personnes qui ont déjà transformé leur quotidien grâce à cette méthode.",
        ctaText: "🚀  Je passe à l'action maintenant", ctaLink: "",
      },
    },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// T3 — SAAS / TECH (Indigo + Violet)
// UNIQUE: Logo bar clients · Comparaison vs concurrence · Integration grid
// ═════════════════════════════════════════════════════════════════════════════
const saasTech: LandingTemplate = {
  key: "saas-tech",
  label: "SaaS & Tech",
  tagline: "Outils, logiciels, plateformes",
  description: "Pour SaaS, plateformes ou outils tech. Esthétique épurée avec screenshot, comparaison concurrentielle, grille d'intégrations. Inspire confiance et innovation.",
  vibe: "modern",
  icon: "rocket_launch",
  palette: ["#4f46e5", "#a78bfa", "#f5f3ff"],
  preview: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a78bfa 100%)",
  uniqueElements: ["Logo bar de clients", "Comparaison \"vs concurrence\"", "Grille de 6 intégrations"],
  build: () => [
    // ─── HERO SCREENSHOT ─────────────────────────────────────────────────────
    {
      id: nid(), type: "hero",
      data: {
        badge: "Nouveau · Bêta publique",
        headline: "L'outil qui simplifie votre travail au quotidien",
        subheadline: "Conçu par des pros pour des pros. Configurez en 5 minutes, gagnez 5h par semaine. Disponible immédiatement.",
        ctaText: "Essayer gratuitement (14 jours)",
        ctaLink: "",
        imageUrl: img("saas-dashboard-v2", 1200, 800),
        bgColor: "linear-gradient(135deg, #4f46e5, #7c3aed)",
        textColor: "#ffffff",
      },
    },
    // ─── LOGO BAR (UNIQUE — preuve sociale en logos clients) ─────────────────
    {
      id: nid(), type: "section",
      data: {
        bgColor: "#ffffff", textColor: "", paddingY: 40, paddingX: 16, maxWidth: 1280, bgImage: "",
        blocks: [
          { id: nid(), type: "text", data: { content: "ILS NOUS FONT CONFIANCE", align: "center", size: 11, color: "#9ca3af" } },
          { id: nid(), type: "spacer", data: { height: 16 } },
          { id: nid(), type: "row",
            data: {
              gap: 32, padding: 0, bgColor: "",
              columns: [
                { blocks: [{ id: nid(), type: "text", data: { content: "ACME CORP", align: "center", size: 18, color: "#9ca3af" } }] },
                { blocks: [{ id: nid(), type: "text", data: { content: "TECHFLOW", align: "center", size: 18, color: "#9ca3af" } }] },
                { blocks: [{ id: nid(), type: "text", data: { content: "NORDIX", align: "center", size: 18, color: "#9ca3af" } }] },
                { blocks: [{ id: nid(), type: "text", data: { content: "PIXELHUB", align: "center", size: 18, color: "#9ca3af" } }] },
                { blocks: [{ id: nid(), type: "text", data: { content: "BIRCHWAVE", align: "center", size: 18, color: "#9ca3af" } }] },
              ],
            },
          },
        ],
      },
    },
    // ─── FEATURES 4 COL ──────────────────────────────────────────────────────
    {
      id: nid(), type: "features",
      data: {
        title: "Tout ce dont vous avez besoin, dans une seule app",
        columns: 4,
        items: [
          { icon: "speed", title: "Ultra-rapide", desc: "Interface optimisée. Zéro temps d'attente, tout se charge instantanément." },
          { icon: "lock", title: "Sécurisé", desc: "Chiffrement bout-en-bout. Vos données ne sortent jamais de vos serveurs." },
          { icon: "extension", title: "Intégrations", desc: "Connectez-vous à 50+ outils en 1 clic : Zapier, Slack, Notion, etc." },
          { icon: "support_agent", title: "Support 24/7", desc: "Chat live + emails répondus en moins de 2h, 7j/7." },
        ],
      },
    },
    // ─── COMPARAISON VS CONCURRENCE (UNIQUE) ─────────────────────────────────
    {
      id: nid(), type: "section",
      data: {
        bgColor: "#f5f3ff", textColor: "", paddingY: 72, paddingX: 16, maxWidth: 1024, bgImage: "",
        blocks: [
          { id: nid(), type: "text", data: { content: "POURQUOI NOUS CHOISIR", align: "center", size: 12, color: "#4f46e5" } },
          { id: nid(), type: "heading", data: { content: "Pourquoi nos clients quittent les autres outils", level: 2, align: "center", color: "#4f46e5" } },
          { id: nid(), type: "spacer", data: { height: 32 } },
          { id: nid(), type: "row",
            data: {
              gap: 16, padding: 0, bgColor: "",
              columns: [
                { blocks: [
                  { id: nid(), type: "content-box",
                    data: { bgColor: "#ffffff", borderColor: "#e5e7eb", borderWidth: 1, radius: 16, padding: 24, shadow: "sm",
                      blocks: [
                        { id: nid(), type: "text", data: { content: "LES AUTRES", align: "center", size: 11, color: "#9ca3af" } },
                        { id: nid(), type: "list", data: { items: ["Setup en 2-3 jours", "Tarif par utilisateur", "Support email 48h", "10-15 intégrations", "Pas d'API publique"], icon: "close", color: "#ef4444" } },
                      ],
                    },
                  },
                ] },
                { blocks: [
                  { id: nid(), type: "content-box",
                    data: { bgColor: "linear-gradient(135deg, #4f46e5, #7c3aed)", borderColor: "#4f46e5", borderWidth: 2, radius: 16, padding: 24, shadow: "lg",
                      blocks: [
                        { id: nid(), type: "text", data: { content: "✨  NOTRE OUTIL", align: "center", size: 11, color: "#fef3c7" } },
                        { id: nid(), type: "list", data: { items: ["Setup en 5 minutes", "Tarif fixe illimité", "Chat live + email 2h", "50+ intégrations natives", "API REST publique"], icon: "check_circle", color: "#fbbf24" } },
                      ],
                    },
                  },
                ] },
              ],
            },
          },
        ],
      },
    },
    // ─── INTEGRATION GRID (UNIQUE) ───────────────────────────────────────────
    {
      id: nid(), type: "section",
      data: {
        bgColor: "#ffffff", textColor: "", paddingY: 64, paddingX: 16, maxWidth: 1152, bgImage: "",
        blocks: [
          { id: nid(), type: "heading", data: { content: "S'intègre avec vos outils favoris", level: 2, align: "center", color: "#4f46e5" } },
          { id: nid(), type: "text", data: { content: "Connectez en 1 clic. 50+ intégrations natives, plus 5 000 via Zapier.", align: "center", size: 16, color: "#6b7280" } },
          { id: nid(), type: "spacer", data: { height: 32 } },
          { id: nid(), type: "row",
            data: {
              gap: 16, padding: 0, bgColor: "",
              columns: [
                { blocks: [{ id: nid(), type: "icon-box", data: { icon: "chat", title: "Slack", desc: "Notifications & commandes en DM", align: "center", color: "#4f46e5" } }] },
                { blocks: [{ id: nid(), type: "icon-box", data: { icon: "edit_note", title: "Notion", desc: "Sync bidirectionnelle de pages", align: "center", color: "#4f46e5" } }] },
                { blocks: [{ id: nid(), type: "icon-box", data: { icon: "mail", title: "Gmail", desc: "Création auto à partir d'emails", align: "center", color: "#4f46e5" } }] },
              ],
            },
          },
          { id: nid(), type: "spacer", data: { height: 16 } },
          { id: nid(), type: "row",
            data: {
              gap: 16, padding: 0, bgColor: "",
              columns: [
                { blocks: [{ id: nid(), type: "icon-box", data: { icon: "calendar_month", title: "Google Calendar", desc: "Synchro événements & rappels", align: "center", color: "#4f46e5" } }] },
                { blocks: [{ id: nid(), type: "icon-box", data: { icon: "code", title: "Github", desc: "Issues, PR, deployments", align: "center", color: "#4f46e5" } }] },
                { blocks: [{ id: nid(), type: "icon-box", data: { icon: "bolt", title: "Zapier", desc: "5 000+ apps connectées", align: "center", color: "#4f46e5" } }] },
              ],
            },
          },
        ],
      },
    },
    // ─── TESTIMONIALS DEV ────────────────────────────────────────────────────
    {
      id: nid(), type: "testimonials",
      data: {
        title: "Ce qu'en disent nos utilisateurs", columns: 2,
        items: [
          { name: "Sarah Levitt", role: "Product Manager · TechFlow", text: "On a testé tous les concurrents — celui-ci est 3x plus rapide et 2x moins cher. Aucun regret depuis 8 mois.", rating: 5 },
          { name: "Karim Belhaj", role: "Lead Dev · Nordix", text: "L'API est ultra-clean, la doc parfaite. Intégré en 2 jours dans notre stack, zéro friction.", rating: 5 },
        ],
      },
    },
    // ─── PRICING SIMPLE ──────────────────────────────────────────────────────
    {
      id: nid(), type: "pricing",
      data: {
        title: "Un seul plan, simple et transparent", price: 12000, originalPrice: 0, currency: "FCFA/mois",
        benefits: ["Utilisateurs illimités", "Toutes les fonctionnalités", "50+ intégrations natives", "API REST publique", "Support email + chat 24/7", "Annulation à tout moment"],
        benefitIcon: "check",
        ctaText: "Commencer l'essai gratuit (14j)", ctaLink: "",
        badgeText: "", badgeColor: "",
        guaranteeText: "14 jours d'essai gratuit · Aucune carte requise",
        accentColor: "#4f46e5",
      },
    },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// T4 — BUSINESS B2B (Deep Blue + Sky)
// UNIQUE: 4 piliers méthodologie · Cas client détaillé avec image · OPCO
// ═════════════════════════════════════════════════════════════════════════════
const businessB2B: LandingTemplate = {
  key: "business-b2b",
  label: "Business B2B",
  tagline: "Formation pro, entreprises, OPCO",
  description: "Pour formations B2B, programmes entreprises, certifications. Structure rassurante avec piliers méthodologiques, cas client réel, mention OPCO. Cible cadres et décideurs.",
  vibe: "professional",
  icon: "business_center",
  palette: ["#0c4a6e", "#0ea5e9", "#fef3c7"],
  preview: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0ea5e9 100%)",
  uniqueElements: ["4 piliers méthodologie", "Cas client image + chiffres", "Mention OPCO + facture pro"],
  build: () => [
    // ─── HERO PRO ────────────────────────────────────────────────────────────
    {
      id: nid(), type: "hero",
      data: {
        badge: "Formation certifiante RNCP",
        headline: "Le programme qui transforme vos équipes en experts",
        subheadline: "Méthodologie éprouvée, cas pratiques d'entreprises, certification reconnue. Pour les organisations qui investissent dans le capital humain.",
        ctaText: "Demander une démo personnalisée",
        ctaLink: "",
        imageUrl: img("business-team-v2", 1000, 800),
        bgColor: "linear-gradient(135deg, #0c4a6e, #0369a1)",
        textColor: "#ffffff",
      },
    },
    // ─── STATS ENTREPRISE ────────────────────────────────────────────────────
    {
      id: nid(), type: "stats",
      data: {
        title: "", subtitle: "", columns: 4, bgColor: "#ffffff", valueColor: "#0c4a6e",
        items: [
          { value: "500", prefix: "+", suffix: "", label: "Entreprises clientes", icon: "corporate_fare" },
          { value: "12", prefix: "", suffix: " ans", label: "D'expertise sectorielle", icon: "school" },
          { value: "94", prefix: "", suffix: "%", label: "Taux de satisfaction", icon: "thumb_up" },
          { value: "ISO", prefix: "", suffix: " 9001", label: "Qualité certifiée", icon: "verified" },
        ],
      },
    },
    // ─── 4 PILIERS (UNIQUE) ──────────────────────────────────────────────────
    {
      id: nid(), type: "section",
      data: {
        bgColor: "#f8fafc", textColor: "", paddingY: 72, paddingX: 16, maxWidth: 1152, bgImage: "",
        blocks: [
          { id: nid(), type: "text", data: { content: "NOTRE MÉTHODE", align: "center", size: 12, color: "#0ea5e9" } },
          { id: nid(), type: "heading", data: { content: "Une méthode structurée en 4 piliers", level: 2, align: "center", color: "#0c4a6e" } },
          { id: nid(), type: "text", data: { content: "Approche éprouvée garantissant des résultats mesurables et durables.", align: "center", size: 16, color: "#64748b" } },
          { id: nid(), type: "spacer", data: { height: 32 } },
          { id: nid(), type: "row",
            data: {
              gap: 24, padding: 0, bgColor: "",
              columns: [
                { blocks: [{ id: nid(), type: "icon-box", data: { icon: "insights", title: "1 · Diagnostic", desc: "Audit initial de vos enjeux, équipes, processus. Identification précise des gaps.", align: "center", color: "#0c4a6e" } }] },
                { blocks: [{ id: nid(), type: "icon-box", data: { icon: "account_tree", title: "2 · Plan", desc: "Roadmap personnalisée 8-12 sem avec jalons clairs et KPIs mesurables.", align: "center", color: "#0c4a6e" } }] },
                { blocks: [{ id: nid(), type: "icon-box", data: { icon: "engineering", title: "3 · Exécution", desc: "Formation, ateliers pratiques, outils personnalisés. Accompagnement terrain.", align: "center", color: "#0c4a6e" } }] },
                { blocks: [{ id: nid(), type: "icon-box", data: { icon: "verified", title: "4 · Certification", desc: "Évaluation finale + diplôme reconnu valorisable RNCP.", align: "center", color: "#0c4a6e" } }] },
              ],
            },
          },
        ],
      },
    },
    // ─── CAS CLIENT DÉTAILLÉ AVEC IMAGE (UNIQUE) ─────────────────────────────
    {
      id: nid(), type: "section",
      data: {
        bgColor: "#ffffff", textColor: "", paddingY: 72, paddingX: 16, maxWidth: 1152, bgImage: "",
        blocks: [
          { id: nid(), type: "row",
            data: {
              gap: 56, padding: 0, bgColor: "",
              columns: [
                { blocks: [{ id: nid(), type: "image", data: { url: img("case-study-corp", 800, 600), alt: "Cas client", align: "center", radius: 16 } }] },
                { blocks: [
                  { id: nid(), type: "text", data: { content: "ÉTUDE DE CAS", align: "left", size: 12, color: "#0ea5e9" } },
                  { id: nid(), type: "heading", data: { content: "Comment Nordix a formé 200 collaborateurs en 6 mois", level: 3, align: "left", color: "#0c4a6e" } },
                  { id: nid(), type: "text", data: { content: "Nordix devait monter en compétences ses équipes commerciales sur les nouvelles technologies. Notre programme a permis de certifier 200 collaborateurs en 6 mois.", align: "left", size: 15, color: "#374151" } },
                  { id: nid(), type: "list", data: { items: ["+38% de productivité commerciale", "Délai de formation divisé par 2", "ROI atteint en 4 mois", "Taux de satisfaction interne : 96%"], icon: "trending_up", color: "#0ea5e9" } },
                  { id: nid(), type: "spacer", data: { height: 12 } },
                  { id: nid(), type: "text", data: { content: "« Investissement le plus rentable de notre stratégie RH 2024. »", align: "left", size: 14, color: "#64748b" } },
                  { id: nid(), type: "text", data: { content: "— Marie Dupont, DRH Nordix", align: "left", size: 12, color: "#9ca3af" } },
                ] },
              ],
            },
          },
        ],
      },
    },
    // ─── PRICING OPCO ────────────────────────────────────────────────────────
    {
      id: nid(), type: "pricing",
      data: {
        title: "Programme complet · Devis personnalisé", price: 75000, originalPrice: 0, currency: "FCFA / pers",
        benefits: ["Programme structuré en 8 modules", "Études de cas réelles", "Certificat reconnu RNCP", "Support expert sous 24h", "Accès à vie + mises à jour", "Facture pro · Éligible OPCO"],
        benefitIcon: "check_circle",
        ctaText: "Demander un devis personnalisé", ctaLink: "",
        badgeText: "PROGRAMME ENTREPRISE", badgeColor: "#0ea5e9",
        guaranteeText: "Tarifs dégressifs à partir de 5 collaborateurs · Datadock + Qualiopi",
        accentColor: "#0c4a6e",
      },
    },
    // ─── FAQ DÉCIDEURS ───────────────────────────────────────────────────────
    {
      id: nid(), type: "faq",
      data: {
        title: "Questions des décideurs",
        items: [
          { q: "Cette formation est-elle éligible OPCO ?", a: "Oui. Notre organisme est référencé Datadock et certifié Qualiopi. Tous les frais sont éligibles à la prise en charge OPCO." },
          { q: "Quel est le format pédagogique ?", a: "100% en ligne avec sessions live programmées. Modules de 15-20 min adaptés au rythme professionnel." },
          { q: "Pouvez-vous personnaliser le programme ?", a: "Absolument. Pour les groupes de 5+, nous co-construisons un programme sur mesure adapté à votre contexte." },
          { q: "Combien de temps pour démarrer ?", a: "Onboarding sous 5 jours ouvrés après signature. Démarrage immédiat de la formation." },
        ],
      },
    },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// T5 — CRÉATIF / ARTISTIQUE (Rose + Cream + Terracotta)
// UNIQUE: Galerie 3 images · Mon univers · Pricing intimiste
// ═════════════════════════════════════════════════════════════════════════════
const creatif: LandingTemplate = {
  key: "creatif",
  label: "Créatif & Esthétique",
  tagline: "Artistes, créateurs, makers",
  description: "Pour artistes, designers, créateurs de contenu. Palette douce et chaleureuse, galerie de réalisations, ambiance inspirante. Cours d'art, photographie, design, illustration.",
  vibe: "creative",
  icon: "palette",
  palette: ["#fda4af", "#fcd34d", "#fffbeb"],
  preview: "linear-gradient(135deg, #fda4af 0%, #fbbf24 100%)",
  uniqueElements: ["Galerie 3 images réalisations", "Mon univers (about narratif)", "Pricing intimiste"],
  build: () => [
    // ─── HERO ESTHÉTIQUE ─────────────────────────────────────────────────────
    {
      id: nid(), type: "hero",
      data: {
        badge: "Nouveau cycle 2026",
        headline: "Trouvez votre signature créative",
        subheadline: "Un programme intime pour les artistes et créateurs qui veulent affirmer leur style et vivre de leur passion.",
        ctaText: "Découvrir le programme",
        ctaLink: "",
        imageUrl: img("creative-art-v2", 1000, 800),
        bgColor: "linear-gradient(135deg, #fda4af, #fcd34d)",
        textColor: "#7c2d12",
      },
    },
    // ─── MON UNIVERS NARRATIF ────────────────────────────────────────────────
    {
      id: nid(), type: "section",
      data: {
        bgColor: "#fffbeb", textColor: "", paddingY: 72, paddingX: 16, maxWidth: 1024, bgImage: "",
        blocks: [
          { id: nid(), type: "text", data: { content: "MON UNIVERS", align: "center", size: 12, color: "#c2410c" } },
          { id: nid(), type: "heading", data: { content: "10 ans d'exploration créative", level: 2, align: "center", color: "#7c2d12" } },
          { id: nid(), type: "text", data: { content: "Des galeries en Europe, des collaborations avec des marques exigeantes, et la conviction profonde que chacun porte une voix unique à révéler. Cette formation est la synthèse de tout ce que j'aurais aimé apprendre quand j'ai commencé.", align: "center", size: 16, color: "#92400e" } },
        ],
      },
    },
    // ─── GALERIE 3 IMAGES (UNIQUE) ───────────────────────────────────────────
    {
      id: nid(), type: "section",
      data: {
        bgColor: "#fffbeb", textColor: "", paddingY: 32, paddingX: 16, maxWidth: 1280, bgImage: "",
        blocks: [
          { id: nid(), type: "row",
            data: {
              gap: 16, padding: 0, bgColor: "",
              columns: [
                { blocks: [{ id: nid(), type: "image", data: { url: img("art-piece-1", 600, 800), alt: "", align: "center", radius: 16 } }] },
                { blocks: [{ id: nid(), type: "image", data: { url: img("art-piece-2", 600, 800), alt: "", align: "center", radius: 16 } }] },
                { blocks: [{ id: nid(), type: "image", data: { url: img("art-piece-3", 600, 800), alt: "", align: "center", radius: 16 } }] },
              ],
            },
          },
        ],
      },
    },
    // ─── PROCESSUS CRÉATIF ───────────────────────────────────────────────────
    {
      id: nid(), type: "features",
      data: {
        title: "Ce que vous allez vivre",
        columns: 3,
        items: [
          { icon: "auto_awesome", title: "Trouver votre style", desc: "Exercices guidés pour identifier ce qui vous distingue vraiment des autres." },
          { icon: "brush", title: "Maîtriser les techniques", desc: "Approfondir les techniques essentielles à votre médium, sans se disperser." },
          { icon: "favorite", title: "Vivre de votre art", desc: "Stratégies douces pour monétiser votre travail sans se trahir ni se brûler." },
        ],
      },
    },
    // ─── TESTIMONIALS DOUX ───────────────────────────────────────────────────
    {
      id: nid(), type: "testimonials",
      data: {
        title: "Témoignages d'élèves", columns: 2,
        items: [
          { name: "Léa M.", role: "Photographe", text: "J'ai enfin osé assumer ma signature visuelle. Mes ventes ont triplé en 6 mois sans changer mes prix.", rating: 5 },
          { name: "Tom B.", role: "Illustrateur", text: "Un programme tendre et exigeant à la fois. Exactement ce dont j'avais besoin pour avancer.", rating: 5 },
        ],
      },
    },
    // ─── PRICING INTIMISTE ───────────────────────────────────────────────────
    {
      id: nid(), type: "pricing",
      data: {
        title: "Rejoignez le cycle", price: 35000, originalPrice: 0, currency: "FCFA",
        benefits: ["8 modules vidéo (~15h)", "Workbook créatif PDF", "Galerie privée des élèves", "1 session live mensuelle", "Accès à vie + mises à jour", "Communauté bienveillante"],
        benefitIcon: "favorite",
        ctaText: "Je rejoins le cycle 🌸", ctaLink: "",
        badgeText: "", badgeColor: "",
        guaranteeText: "Garantie 14 jours · Si ça ne résonne pas, on rembourse sans question",
        accentColor: "#c2410c",
      },
    },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// T6 — WEBINAR LIVE (Purple + Cyan + Black)
// UNIQUE: Date+heure prominents · AGENDA timestamps · Speaker bio détaillée
// ═════════════════════════════════════════════════════════════════════════════
const webinarLive: LandingTemplate = {
  key: "webinar-live",
  label: "Webinar Live",
  tagline: "Événement gratuit · Inscription rapide",
  description: "Pour webinars, masterclass live, ateliers gratuits. Date+heure visibles, countdown, AGENDA détaillé avec horaires, profil intervenant. Conversion maximale sur l'inscription.",
  vibe: "event",
  icon: "videocam",
  palette: ["#7c3aed", "#06b6d4", "#0f172a"],
  preview: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
  uniqueElements: ["Date+heure visibles dans le hero", "AGENDA détaillé avec horaires", "Speaker bio + crédentiels"],
  build: () => [
    // ─── HERO ÉVÉNEMENT ──────────────────────────────────────────────────────
    {
      id: nid(), type: "hero",
      data: {
        badge: "🔴  EN DIRECT · GRATUIT",
        headline: "Masterclass : les 3 leviers pour faire décoller votre business en 2026",
        subheadline: "Mardi 28 novembre · 19h (heure de Dakar) · 90 min en direct + Q&A · Replay disponible 48h",
        ctaText: "Réserver ma place gratuitement",
        ctaLink: "",
        imageUrl: img("webinar-event-v2", 1200, 800),
        bgColor: "linear-gradient(135deg, #7c3aed, #06b6d4)",
        textColor: "#ffffff",
      },
    },
    // ─── COUNTDOWN ───────────────────────────────────────────────────────────
    {
      id: nid(), type: "countdown",
      data: { title: "Le webinar démarre dans :", endsInHours: 168, subtitle: "Inscription gratuite — places limitées à 500 connexions simultanées." },
    },
    // ─── SPEAKER BIO DÉTAILLÉE (UNIQUE) ──────────────────────────────────────
    {
      id: nid(), type: "section",
      data: {
        bgColor: "#0f172a", textColor: "#ffffff", paddingY: 72, paddingX: 16, maxWidth: 1152, bgImage: "",
        blocks: [
          { id: nid(), type: "row",
            data: {
              gap: 56, padding: 0, bgColor: "",
              columns: [
                { blocks: [{ id: nid(), type: "image", data: { url: img("speaker-portrait-v2", 600, 800), alt: "Intervenant", align: "center", radius: 24 } }] },
                { blocks: [
                  { id: nid(), type: "text", data: { content: "VOTRE INTERVENANTE", align: "left", size: 12, color: "#06b6d4" } },
                  { id: nid(), type: "heading", data: { content: "Sarah Mensah", level: 2, align: "left", color: "#ffffff" } },
                  { id: nid(), type: "text", data: { content: "Entrepreneure depuis 8 ans, fondatrice de 2 startups dont une revente à 7 chiffres. Speaker reconnu (TEDx, Vivatech). Auteur du best-seller \"L'effet 10x\" (50 000 copies).", align: "left", size: 16, color: "#cbd5e1" } },
                  { id: nid(), type: "list", data: { items: ["8 ans d'expertise terrain", "+10 000 entrepreneurs accompagnés", "Speaker TEDx & Vivatech 2024", "Auteur best-seller (50K copies)", "Mentionnée dans Les Échos, Forbes Afrique"], icon: "verified", color: "#06b6d4" } },
                ] },
              ],
            },
          },
        ],
      },
    },
    // ─── AGENDA DÉTAILLÉ AVEC HORAIRES (UNIQUE) ──────────────────────────────
    {
      id: nid(), type: "section",
      data: {
        bgColor: "#ffffff", textColor: "", paddingY: 72, paddingX: 16, maxWidth: 1024, bgImage: "",
        blocks: [
          { id: nid(), type: "text", data: { content: "AGENDA DU LIVE", align: "center", size: 12, color: "#7c3aed" } },
          { id: nid(), type: "heading", data: { content: "90 minutes ultra-condensées", level: 2, align: "center", color: "#0f172a" } },
          { id: nid(), type: "spacer", data: { height: 32 } },
          { id: nid(), type: "content-box",
            data: { bgColor: "#f5f3ff", borderColor: "#c4b5fd", borderWidth: 1, radius: 16, padding: 24, shadow: "sm",
              blocks: [
                { id: nid(), type: "row", data: { gap: 24, padding: 0, bgColor: "",
                  columns: [
                    { blocks: [{ id: nid(), type: "heading", data: { content: "19:00", level: 3, align: "left", color: "#7c3aed" } }] },
                    { blocks: [
                      { id: nid(), type: "heading", data: { content: "Ouverture & contexte", level: 3, align: "left", color: "#0f172a" } },
                      { id: nid(), type: "text", data: { content: "Pourquoi 2026 est l'année charnière. Les 3 erreurs à éviter absolument.", align: "left", size: 14, color: "#64748b" } },
                    ] },
                  ],
                } },
              ],
            },
          },
          { id: nid(), type: "spacer", data: { height: 12 } },
          { id: nid(), type: "content-box",
            data: { bgColor: "#f5f3ff", borderColor: "#c4b5fd", borderWidth: 1, radius: 16, padding: 24, shadow: "sm",
              blocks: [
                { id: nid(), type: "row", data: { gap: 24, padding: 0, bgColor: "",
                  columns: [
                    { blocks: [{ id: nid(), type: "heading", data: { content: "19:15", level: 3, align: "left", color: "#7c3aed" } }] },
                    { blocks: [
                      { id: nid(), type: "heading", data: { content: "Levier #1 — Le mindset 10x", level: 3, align: "left", color: "#0f172a" } },
                      { id: nid(), type: "text", data: { content: "La transformation mentale qui multiplie les résultats avant de toucher au business.", align: "left", size: 14, color: "#64748b" } },
                    ] },
                  ],
                } },
              ],
            },
          },
          { id: nid(), type: "spacer", data: { height: 12 } },
          { id: nid(), type: "content-box",
            data: { bgColor: "#f5f3ff", borderColor: "#c4b5fd", borderWidth: 1, radius: 16, padding: 24, shadow: "sm",
              blocks: [
                { id: nid(), type: "row", data: { gap: 24, padding: 0, bgColor: "",
                  columns: [
                    { blocks: [{ id: nid(), type: "heading", data: { content: "19:35", level: 3, align: "left", color: "#7c3aed" } }] },
                    { blocks: [
                      { id: nid(), type: "heading", data: { content: "Levier #2 — L'offre irrésistible", level: 3, align: "left", color: "#0f172a" } },
                      { id: nid(), type: "text", data: { content: "Comment construire une offre qui se vend toute seule, sans pression ni manipulation.", align: "left", size: 14, color: "#64748b" } },
                    ] },
                  ],
                } },
              ],
            },
          },
          { id: nid(), type: "spacer", data: { height: 12 } },
          { id: nid(), type: "content-box",
            data: { bgColor: "#f5f3ff", borderColor: "#c4b5fd", borderWidth: 1, radius: 16, padding: 24, shadow: "sm",
              blocks: [
                { id: nid(), type: "row", data: { gap: 24, padding: 0, bgColor: "",
                  columns: [
                    { blocks: [{ id: nid(), type: "heading", data: { content: "20:00", level: 3, align: "left", color: "#7c3aed" } }] },
                    { blocks: [
                      { id: nid(), type: "heading", data: { content: "Levier #3 — Le scaling intelligent", level: 3, align: "left", color: "#0f172a" } },
                      { id: nid(), type: "text", data: { content: "Les automations + délégations pour multiplier votre temps disponible sans perdre la qualité.", align: "left", size: 14, color: "#64748b" } },
                    ] },
                  ],
                } },
              ],
            },
          },
          { id: nid(), type: "spacer", data: { height: 12 } },
          { id: nid(), type: "content-box",
            data: { bgColor: "linear-gradient(135deg, #7c3aed, #06b6d4)", borderColor: "#7c3aed", borderWidth: 0, radius: 16, padding: 24, shadow: "lg",
              blocks: [
                { id: nid(), type: "row", data: { gap: 24, padding: 0, bgColor: "",
                  columns: [
                    { blocks: [{ id: nid(), type: "heading", data: { content: "20:30", level: 3, align: "left", color: "#ffffff" } }] },
                    { blocks: [
                      { id: nid(), type: "heading", data: { content: "Q&A live ouverte", level: 3, align: "left", color: "#ffffff" } },
                      { id: nid(), type: "text", data: { content: "30 min de questions-réponses en direct avec Sarah. Posez les vôtres dans le chat.", align: "left", size: 14, color: "#cbd5e1" } },
                    ] },
                  ],
                } },
              ],
            },
          },
        ],
      },
    },
    // ─── TESTIMONIALS ANCIENS PARTICIPANTS ───────────────────────────────────
    {
      id: nid(), type: "testimonials",
      data: {
        title: "Anciens participants en parlent", columns: 3,
        items: [
          { name: "Aminata D.", role: "Coach business", text: "Le meilleur webinar auquel j'ai assisté en 2 ans. Concret, sans blabla, applicable immédiatement.", rating: 5 },
          { name: "Marc-Étienne L.", role: "Fondateur SaaS", text: "Sarah donne une masterclass à elle seule. Reparti avec un plan d'action clair sur 90 jours.", rating: 5 },
          { name: "Joëlle K.", role: "Consultante", text: "Gratuit mais avec une valeur de programme à 500€. Je recommande chaudement.", rating: 5 },
        ],
      },
    },
    // ─── CTA FINAL ───────────────────────────────────────────────────────────
    {
      id: nid(), type: "cta",
      data: {
        headline: "Réservez votre place — c'est gratuit",
        subheadline: "Rejoignez les +500 entrepreneurs déjà inscrits. Replay disponible 48h pour les inscrits.",
        ctaText: "✋  Je réserve ma place gratuitement",
        ctaLink: "",
      },
    },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═════════════════════════════════════════════════════════════════════════════
export const LANDING_TEMPLATES: LandingTemplate[] = [
  coachPremium,
  lancementExpress,
  saasTech,
  businessB2B,
  creatif,
  webinarLive,
];
