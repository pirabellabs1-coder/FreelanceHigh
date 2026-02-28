# CLAUDE.md — FreelanceHigh

> Plateforme internationale de freelancing, francophone en premier.
> **Fondateur :** Lissanon Gildas · **Statut :** Phase zéro (maquettes HTML → implémentation)
> **Slogan :** "La plateforme freelance qui élève votre carrière au plus haut niveau"

---

## Projet en bref

FreelanceHigh est un marketplace freelance ciblant l'**Afrique francophone + diaspora + international**, avec 4 rôles : **Freelance, Client, Agence, Admin**. Roadmap sur 20 mois : MVP → V1 → V2 → V3 → V4.

- **Marché principal :** Afrique francophone (Sénégal, Côte d'Ivoire, Cameroun, etc.) + France + diaspora
- **Devise par défaut :** EUR (€) — conversion temps réel vers FCFA, USD, GBP, MAD
- **Langue de lancement :** Français (FR) — extensible EN (V1), AR/ES (V2), PT (V2+)
- **Phase actuelle :** 61 maquettes HTML existantes, aucun code de production encore

---

## Stack Technique

### Monorepo
```
pnpm workspaces + Turborepo
apps/web      → Next.js 14 (App Router)
apps/api      → Fastify + tRPC + Socket.io + BullMQ
packages/db   → Schéma Prisma + client généré
packages/ui   → Composants shadcn/ui partagés
packages/types → Types TypeScript partagés
packages/config → Configs ESLint / TypeScript
```

### Frontend (`apps/web`)
| Outil | Choix |
|---|---|
| Framework | Next.js 14 App Router (SSR + SSG + ISR + RSC) |
| UI | shadcn/ui + Radix UI |
| Styles | Tailwind CSS (classes `rtl:` pour arabe) |
| État client | Zustand (devise, langue, modales, wizards) |
| État serveur | TanStack Query v5 |
| i18n | next-intl |
| SEO | Next.js Metadata API |

### Backend (`apps/api`)
| Outil | Choix |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Fastify |
| API | tRPC v11 (sur Fastify) |
| WebSocket | Socket.io (sur Fastify) |
| Jobs | BullMQ |
| Cache/Broker | Redis (Upstash MVP → Railway V2+) |

### Base de données
| Outil | Rôle |
|---|---|
| Supabase (Postgres 15+) | DB principale — région `eu-central-1` Frankfurt |
| Prisma 5 | ORM — `schema.prisma` = source unique de vérité |
| RLS Supabase | Contrôle d'accès par rôle au niveau DB |
| Supabase Realtime | Broadcasts statuts commandes, dashboard admin |
| Redis (Upstash) | Sessions, cache, rate limiting, broker BullMQ |

### Auth
- **Supabase Auth** — JWT custom claims : `role`, `kyc_level`, `subscription_tier`
- OAuth social : Google, Facebook, LinkedIn, Apple
- 2FA TOTP (Google Authenticator) + SMS (Twilio)
- Impersonation admin via service-role JWT

### Paiements
| Couche | Service | Scope |
|---|---|---|
| 1 | Stripe Connect | International (cartes, SEPA, PayPal, Apple/Google Pay, abonnements) |
| 2 | CinetPay | Afrique francophone 17 pays (Orange Money, Wave, MTN MoMo) |
| 3 (V1) | Flutterwave | Afrique élargie (Nigeria, Ghana, Kenya) + fallback CinetPay |

### Stockage
- **Supabase Storage** → fichiers privés (KYC, livrables commandes, contrats)
- **Cloudinary** → images publiques (avatars, photos services, portfolio)

### Autres services
| Service | Usage |
|---|---|
| Resend + React Email | 23 templates email transactionnels |
| Twilio / Africa's Talking | SMS 2FA, alertes sécurité |
| OpenAI GPT-4o | Génération contrats, certifications IA (V3) |
| Sentry | Monitoring erreurs frontend + backend |
| PostHog | Analytics produit, funnels, cohortes |

### Hébergement
```
Vercel          → Next.js (Edge CDN mondial, nœud Johannesburg inclus)
Railway         → Fastify + Socket.io + BullMQ (même région EU que Supabase)
Supabase Cloud  → Postgres + Auth + Storage + Realtime (eu-central-1)
GitHub Actions  → CI/CD (lint, tests, build, deploy preview + prod)
```

---

## Structure des routes (`apps/web/app/`)

```
(public)/         Landing, marketplace (/explorer), blog, profils publics
(auth)/           /inscription, /connexion, /onboarding
dashboard/        Espace Freelance
client/           Espace Client
agence/           Espace Agence
admin/            Espace Admin
```

### Routes clés par espace

**Public :**
`/` · `/explorer` · `/services/[slug]` · `/freelances/[username]` · `/agences/[slug]` · `/projets` · `/blog` · `/tarifs`

**Freelance :** `/dashboard` · `/dashboard/services` · `/dashboard/commandes` · `/dashboard/finances` · `/dashboard/certifications`

**Client :** `/client/dashboard` · `/client/projets/nouveau` · `/client/commandes` · `/client/recherche-ia`

**Agence :** `/agence/dashboard` · `/agence/equipe` · `/agence/projets` · `/agence/contrats`

**Admin :** `/admin/dashboard` · `/admin/utilisateurs` · `/admin/kyc` · `/admin/litiges` · `/admin/finances`

---

## Conventions de code

### TypeScript — règles absolues
- **TypeScript partout** — frontend, backend, schéma DB, types partagés
- Pas de `any` explicite
- Types partagés dans `packages/types/`
- Schéma Prisma = source de vérité pour tous les types DB

### État — séparation stricte
- **Zustand** → état purement UI : devise choisie, langue active, étape wizard, thème, modales
- **TanStack Query** → tout ce qui vient de l'API : services, commandes, profils, transactions

### Composants React
- Server Components par défaut dans App Router
- `"use client"` uniquement si hooks d'état ou événements nécessaires
- Composants UI partagés dans `packages/ui/` (shadcn/ui)
- Styles via Tailwind CSS uniquement — pas de CSS-in-JS

### i18n — RTL dès le départ
```tsx
// Toujours utiliser les classes rtl: même si l'arabe n'est pas encore actif
<div className="ml-4 rtl:mr-4 rtl:ml-0">

// layout.tsx
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

### Base de données
- `prisma migrate dev` pour les nouvelles migrations (jamais de modif directe en prod)
- `prisma.$queryRaw` pour les requêtes analytics complexes
- RLS activé sur toutes les tables exposées via Supabase
- Colonnes `search_vector` générées pour la recherche full-text :
```sql
to_tsvector('french', coalesce(title, '') || ' ' || coalesce(description, ''))
```

### API tRPC
- Routers dans `apps/api/src/routes/`
- Procédures : `publicProcedure` pour les routes publiques, `protectedProcedure` pour les routes authentifiées
- Validation des inputs avec Zod

### Emails
- Templates dans `packages/ui/emails/` (composants React Email)
- Locale passée en prop à chaque template
- Expéditeur : `FreelanceHigh <no-reply@freelancehigh.com>`

---

## KYC — 4 niveaux progressifs

| Niveau | Vérification | Débloque |
|---|---|---|
| 1 | Email vérifié | Accès de base |
| 2 | Téléphone vérifié | Envoyer des offres, commander |
| 3 | Pièce d'identité | Retirer des fonds, publier des services |
| 4 | Vérification professionnelle | Badge Elite, limites relevées |

Les claims JWT `kyc_level` et `role` filtrent l'accès dans le middleware Next.js **sans requête DB supplémentaire**.

---

## Plans d'abonnement

| Plan | Prix | Commission |
|---|---|---|
| Gratuit | €0/mois | 20% |
| Pro | €15/mois | 15% |
| Business | €45/mois | 10% |
| Agence | €99/mois | 8% |

---

## Flux Escrow

```
Client paie
  → Fonds bloqués (Stripe Connect hold OU wallet_transactions.escrow_status = 'held')
  → Commande livrée + validée
  → Fonds libérés dans le wallet freelance
  → Retrait : Stripe payouts (international) OU CinetPay withdrawal API (Mobile Money)

En cas de litige :
  → escrow_status = 'disputed'
  → Fonds gelés jusqu'à verdict admin
```

Pour les paiements Mobile Money (CinetPay), l'escrow est géré en DB car CinetPay ne propose pas de hold natif.

---

## Roadmap versions

| Version | Mois | Objectif principal |
|---|---|---|
| **MVP** | 1–3 | Vendre, acheter, encaisser. 3 rôles fonctionnels. |
| **V1** | 4–6 | Marketplace complète, matching, multi-devises, Mobile Money |
| **V2** | 7–10 | Messagerie temps réel, KYC complet, badges, rétention |
| **V3** | 11–15 | IA (contrats, certifications, recherche sémantique) |
| **V4** | 16–20 | PWA, Web3/crypto, API publique, affiliation |

---

## Recherche — évolution par version

- **MVP–V1 :** Postgres FTS — `pg_trgm` + `tsvector` + index GIN (coût $0)
- **V2 :** Meilisearch sur Railway (~$15/mois) — sync via BullMQ
- **V3 :** `pgvector` + OpenAI `text-embedding-3-small` — recherche hybride sémantique

---

## Temps réel — architecture hybride

| Outil | Usage |
|---|---|
| **Socket.io** (sur Fastify) | Chat, typing indicators, présence utilisateur, messagerie agence |
| **Supabase Realtime** | Statuts commandes live, métriques dashboard admin |

Redis adapter Socket.io configuré dès le jour 1 pour permettre la montée en charge horizontale.

---

## Décisions techniques importantes à ne pas contredire

1. **Supabase Auth** (pas NextAuth.js) — intégré à la DB, pas de duplication d'infrastructure
2. **Postgres FTS** au MVP (pas Algolia) — Algolia coûte $200–500/mois à l'échelle
3. **Cloudinary (public) + Supabase Storage (privé)** — documents KYC ne vont JAMAIS dans Cloudinary
4. **tRPC sur Fastify** (pas Next.js API Routes) — WebSocket + uploads + jobs longs incompatibles avec serverless
5. **Base L2 (V4)** (pas Ethereum mainnet) — frais gas 1000x inférieurs pour micro-transactions
6. **pnpm** (pas npm/yarn) — monorepo avec workspaces

---

## Commandes utiles

```bash
# Développement
pnpm dev                    # Lance tout le monorepo (Turborepo)
pnpm dev --filter=web       # Frontend seulement
pnpm dev --filter=api       # Backend seulement

# Build
pnpm build                  # Build complet Turborepo

# Base de données
pnpm --filter=db migrate:dev    # Nouvelle migration Prisma
pnpm --filter=db migrate:deploy # Appliquer migrations en prod
pnpm --filter=db generate       # Régénérer le client Prisma
pnpm --filter=db studio         # Prisma Studio (GUI)

# Qualité code
pnpm lint                   # ESLint sur tout le monorepo
pnpm typecheck              # TypeScript check complet

# Tests
pnpm test                   # Tests unitaires
pnpm test:e2e               # Tests Playwright
```

---

## Variables d'environnement clés

Fichier `.env.local` à la racine — toujours dans `.gitignore`.

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Redis
REDIS_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# CinetPay
CINETPAY_API_KEY=
CINETPAY_SITE_ID=

# OpenAI
OPENAI_API_KEY=

# Resend
RESEND_API_KEY=

# Cloudinary
CLOUDINARY_URL=

# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=

# Sentry
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
```

---

## Maquettes existantes

61 maquettes HTML dans `/mnt/c/FreelanceHigh/` — une par fonctionnalité majeure. Elles servent de référence visuelle et fonctionnelle pour l'implémentation. Les dossiers suivent le pattern `nom_de_la_fonctionnalite/`.

Exemples :
- `afriquefreelance_landing_page_1/` → Landing page v1
- `freelancer_dashboard_overview/` → Dashboard freelance
- `tableau_de_bord_client/` → Dashboard client
- `admin_dashboard_global_stats/` → Dashboard admin
- `marketplace_service_explorer_1/` à `_12/` → 12 variantes du marketplace
- `messagerie_temps_r_el_int_gr_e_1/` et `_2/` → Messagerie temps réel

---

## Risques à garder en tête

| Risque | Mitigation |
|---|---|
| CinetPay instable | Retry BullMQ + Flutterwave fallback (V1) |
| Stripe Connect indisponible en Afrique | CinetPay payouts Mobile Money comme méthode principale de retrait locale |
| Coût OpenAI (V3) | Rate-limit par tier ; `gpt-4o-mini` par défaut, `gpt-4o` uniquement pour contrats |
| Coût Vercel à grande échelle | Next.js portable sur Railway si nécessaire, sans réécriture |
| RTL arabe mal géré | Classes `rtl:` Tailwind dès les premiers composants |
| Socket.io non scalable > 1 serveur | Adaptateur Redis configuré dès le jour 1 |

---

FreelanceHigh est une plateforme freelance complète destinée à l'Afrique francophone, la diaspora et le marché international. Elle met en relation des freelances, des clients et des agences autour de services numériques.

- **Fondateur :** Lissanon Gildas (2026)
- **Slogan :** "La plateforme freelance qui élève votre carrière au plus haut niveau"
- **Devise par défaut :** EUR (€) avec conversion automatique vers FCFA, USD, GBP, MAD
- **Langues :** Français (principal), Anglais
- **Référence complète :** voir [@PRD.md](./PRD.md) pour toutes les spécifications fonctionnelles

---

## 🏗️ Aperçu de l'architecture globale

La plateforme est organisée en **6 espaces distincts** :

```
FreelanceHigh
├── 🌐 Public          → Landing, Marketplace, Profils, Blog
├── 🔐 Auth            → Inscription multi-rôles, KYC, 2FA
├── 👨‍💻 Freelance       → Dashboard, Services, Commandes, Finances
├── 💼 Client          → Dashboard, Projets, Commandes, Explorer
├── 🏢 Agence          → Dashboard, Équipe, CRM, Projets, Finances
└── ⚙️  Admin           → Modération, KYC, Litiges, Analytics
```

- **Référence détaillée :** voir [@ARCHITECTURE.md](./ARCHITECTURE.md) pour le schéma complet, les routes, les modèles de données et les relations entre entités

---

## 🎨 Style visuel & Maquettes

### Règles générales
- Interface **claire et minimaliste**
- **Pas de mode sombre pour le MVP**
- Mobile-first, responsive sur tous les écrans
- Couleurs de la charte FreelanceHigh (violet primaire `#6C2BD9`, bleu `#0EA5E9`, vert `#10B981`)

### Respect des maquettes
Chaque espace de la plateforme dispose de maquettes de référence fournies dans le projet. Ces maquettes **font autorité** sur toute décision de design.

**Règles impératives :**
- Avant de développer une page ou un composant, **consulter la maquette correspondante** dans le dossier `/maquettes/`
- Reproduire fidèlement la structure, la hiérarchie visuelle, les espacements et les composants visibles dans la maquette
- En cas d'ambiguïté entre la maquette et une spec textuelle, **la maquette a la priorité**
- Ne pas inventer de composants ou de sections qui ne figurent pas dans la maquette sans validation explicite

### Organisation des maquettes
Les maquettes sont organisées par espace, correspondant aux 52 écrans définis :
- `/maquettes/public/` → Landing, Marketplace, Profils, Blog
- `/maquettes/auth/` → Connexion, Inscription, Onboarding
- `/maquettes/freelance/` → Dashboard, Services, Commandes, Finances
- `/maquettes/client/` → Dashboard, Projets, Explorer
- `/maquettes/agence/` → Dashboard, Équipe, CRM, Projets
- `/maquettes/admin/` → Dashboard Global, Modération, Litiges
- `/maquettes/identite/` → Logo, Design System, UI Kit

---

## 🔒 Contraintes et Politiques

- **NE JAMAIS exposer les clés API côté client.** Toutes les clés API (Stripe, CinetPay, OpenAI, Cloudinary, etc.) doivent être stockées exclusivement dans les variables d'environnement serveur (`.env`) et n'être utilisées que dans les routes API ou les Server Actions Next.js
- Ne jamais écrire de clé API en dur dans le code, même à titre de test
- Toujours valider les données côté serveur, même si une validation existe déjà côté client
- Les fonds financiers (escrow) ne doivent jamais être manipulés directement côté client

---

## 📦 Dépendances

- **Préférer les composants existants** plutôt que d'ajouter de nouvelles bibliothèques UI
- La bibliothèque de composants de référence est **shadcn/ui** — vérifier qu'un composant n'existe pas déjà dedans avant d'en créer un nouveau
- Stack validée (ne pas substituer sans validation) :
  - Frontend : Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Zustand, React Query
  - Backend : Prisma ORM, NextAuth.js, Socket.io
  - Infra : Supabase (PostgreSQL), Cloudinary, Resend, Stripe Connect

---

## ✅ Tests & Qualité (après chaque développement UI)

À la fin de **chaque développement qui implique l'interface graphique**, effectuer les vérifications suivantes avec **playwright-skill** :

1. **Responsive** : tester sur mobile (375px), tablette (768px) et desktop (1280px)
2. **Fonctionnel** : vérifier que tous les éléments interactifs (boutons, formulaires, navigation) répondent correctement
3. **Conformité maquette** : comparer visuellement le rendu avec la maquette de référence
4. **Accessibilité de base** : vérifier les contrastes, les labels de formulaires et la navigation clavier
5. **Besoin couvert** : confirmer que la fonctionnalité développée répond bien au cas d'usage défini dans la spec

---

## 📚 Documentation

| Document | Description |
|---|---|
| [@PRD.md](./PRD.md) | Product Requirements Document — toutes les spécifications fonctionnelles, user stories, cas d'usage par espace |
| [@ARCHITECTURE.md](./ARCHITECTURE.md) | Architecture technique — schéma global, routes, modèles de données, relations, décisions techniques |

---

## 🔧 Context7

Utiliser **toujours Context7** dans les situations suivantes, **sans attendre une demande explicite** :

- Génération de code impliquant une bibliothèque (Next.js, Prisma, Stripe, Socket.io, shadcn/ui, etc.)
- Étapes de configuration ou d'installation d'un outil ou service
- Documentation d'une API externe (Stripe, CinetPay, Cloudinary, Resend, OpenAI, etc.)
- Résolution d'un comportement inattendu lié à une version spécifique d'une lib

**Procédure :** utiliser automatiquement les outils MCP Context7 pour résoudre l'identifiant de bibliothèque et récupérer la documentation à jour avant de générer le code.

---

## 📝 Conventions de rédaction des specs

- Toutes les spécifications doivent être rédigées **en français**, y compris les sections `Purpose` et `Scenarios` des specs OpenSpec
- Seuls les **titres de Requirements** restent en anglais avec les mots-clés `SHALL` / `MUST` pour la validation OpenSpec
- Les commentaires dans le code peuvent être en français ou en anglais selon le contexte du fichier

---

## 🗓️ Versions du projet

| Version | Statut | Objectif |
|---|---|---|
| **MVP** | 🔴 En cours | Vendre, acheter, encaisser. Les 3 rôles existent. |
| **V1** | ⏳ Planifié | Matching complet, marketplace, multi-devises |
| **V2** | ⏳ Planifié | Confiance, messagerie temps réel, KYC, rétention |
| **V3** | ⏳ Planifié | IA, automatisation, contrats, différenciation |
| **V4** | ⏳ Planifié | PWA mobile, Web3, API publique, affiliation |

---

*© 2026 FreelanceHigh — Fondée par Lissanon Gildas*