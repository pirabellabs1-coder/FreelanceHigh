# FreelanceHigh — Documentation Complète de la Plateforme

> **Version :** 1.0 — Mars 2026
> **Fondateur :** Lissanon Gildas
> **Site :** https://www.freelancehigh.com
> **Slogan :** "La plateforme freelance qui élève votre carrière au plus haut niveau"

---

## Table des matières

1. [Présentation générale](#1-présentation-générale)
2. [Espace Public](#2-espace-public)
3. [Espace Authentification](#3-espace-authentification)
4. [Espace Freelance (Dashboard)](#4-espace-freelance-dashboard)
5. [Espace Client](#5-espace-client)
6. [Espace Agence](#6-espace-agence)
7. [Espace Admin](#7-espace-admin)
8. [Système financier](#8-système-financier)
9. [Pages légales](#9-pages-légales)
10. [Architecture technique](#10-architecture-technique)

---

## 1. Présentation générale

### Qu'est-ce que FreelanceHigh ?

FreelanceHigh est une marketplace de services numériques qui met en relation trois types d'acteurs :
- **Les Freelances** : des prestataires indépendants qui vendent leurs compétences (développement, design, rédaction, marketing, traduction, etc.)
- **Les Clients** : des entreprises ou particuliers qui recherchent des prestataires pour leurs projets
- **Les Agences** : des structures collectives regroupant plusieurs freelances sous une marque commune

### Marché cible

- **Géographie principale :** Afrique francophone (Sénégal, Côte d'Ivoire, Cameroun, Bénin, Togo, Mali, Burkina Faso, etc.)
- **Géographie secondaire :** France, Belgique, Suisse, Canada francophone, diaspora africaine mondiale
- **Géographie tertiaire :** Marché international anglophone

### Devises supportées

| Devise | Symbole | Taux (base EUR) |
|--------|---------|-----------------|
| Euro | EUR (€) | 1.00 (référence) |
| Franc CFA | FCFA | 655.957 |
| Dollar US | USD ($) | 1.08 |
| Livre sterling | GBP (£) | 0.85 |
| Dirham marocain | MAD | 10.95 |

Le sélecteur de devise est disponible dans la navbar et les paramètres utilisateur. Tous les prix sont stockés en EUR et convertis à la volée pour l'affichage.

### Langues

- **Français** : langue principale et de lancement
- **Anglais** : prévu pour la V1
- **Arabe** : prévu pour la V2 (avec support RTL complet)
- **Espagnol, Portugais** : prévu pour la V2+

---

## 2. Espace Public

L'espace public est accessible à tous les visiteurs sans inscription. Il comprend les pages suivantes :

### 2.1 Page d'accueil (`/`)

La landing page est le point d'entrée principal de la plateforme. Elle comprend :

- **Hero section** : bandeau principal avec le slogan, deux boutons CTA ("Je cherche un freelance" et "Je propose mes services"), image/illustration d'accroche
- **Statistiques live** : compteurs animés affichant le nombre de freelances actifs, le montant total payé en euros, le nombre de pays couverts, et le nombre d'avis vérifiés
- **Catégories de services** : grille des catégories principales (Développement Web, Design Graphique, Rédaction, Marketing Digital, Traduction, etc.) avec icônes et liens vers la marketplace filtrée
- **Top freelances du moment** : carrousel de profils de freelances les mieux notés avec photo, nom, titre, note et nombre de commandes
- **Comment ça marche** : section en 3 étapes par rôle (Freelance, Client, Agence) avec illustrations
- **Témoignages** : avis vérifiés de vrais utilisateurs
- **Section partenaires** : logos des méthodes de paiement acceptées (Visa, Mastercard, Orange Money, Wave, MTN MoMo, PayPal)
- **Newsletter** : formulaire d'inscription à la newsletter
- **Sélecteur de devise** : visible dans la navbar sur toutes les pages

### 2.2 Marketplace — Explorer les services (`/explorer`)

La marketplace est le coeur de la plateforme. Elle affiche l'ensemble des services publiés par les freelances et les agences.

**Fonctionnalités :**
- **Mode d'affichage** : grille (cartes visuelles) ou liste (vue détaillée)
- **Filtres avancés** : catégorie, sous-catégorie, fourchette de prix (min/max), délai de livraison, note minimale, pays du prestataire, langue parlée, disponibilité (en ligne/hors ligne), fuseau horaire, niveau de vérification KYC
- **Tri** : par pertinence (défaut), prix croissant, prix décroissant, meilleure note, plus récent, plus populaire
- **Pagination** : chargement par pages avec option de défilement infini
- **Tags populaires** : nuage de tags des compétences les plus recherchées
- **Services boostés** : services mis en avant (payants) affichés en position prioritaire avec un badge "Sponsorisé"

**Chaque carte de service affiche :**
- Image principale du service
- Titre du service
- Nom et photo du prestataire (freelance ou agence)
- Note moyenne (étoiles) et nombre d'avis
- Prix à partir de (forfait Basique)
- Délai de livraison
- Badge du prestataire (Vérifié, Top Rated, etc.)

### 2.3 Marketplace par catégorie (`/explorer/categorie/[slug]`)

Page identique à la marketplace générale mais pré-filtrée par catégorie. Affiche un en-tête spécifique à la catégorie avec description et nombre de services disponibles.

### 2.4 Page détail d'un service (`/services/[slug]`)

Page complète d'un service individuel, comprenant :

- **Galerie** : photos et vidéo de présentation du service (carrousel)
- **Description** : description complète et détaillée du service rédigée par le prestataire
- **Forfaits** : tableau comparatif des 3 forfaits (Basique, Standard, Premium) avec pour chacun : prix, délai de livraison, nombre de révisions incluses, liste des éléments livrés. Bouton "Commander" pour chaque forfait
- **Options extras** : liste des options payantes additionnelles (livraison express, révisions supplémentaires, fichier source, etc.)
- **FAQ du vendeur** : questions fréquentes spécifiques au service, rédigées par le prestataire
- **Avis vérifiés** : liste paginée des avis clients avec note détaillée (qualité, communication, délai), commentaire, date, et réponse éventuelle du prestataire
- **Profil vendeur résumé** : mini-carte avec photo, nom, titre, note globale, nombre de commandes, taux de complétion, délai moyen de livraison, badge
- **Services similaires** : recommandations de services dans la même catégorie

### 2.5 Profil public freelance (`/freelances/[username]`)

Page publique du profil d'un freelance, comprenant :

- **En-tête** : photo, nom complet, titre professionnel (ex: "Développeur Full-Stack Senior"), pays, ville, fuseau horaire, statut en ligne
- **Badges** : affichage des badges obtenus (Vérifié, Rising Talent, Top Rated, Pro, Elite)
- **Bio** : description longue rédigée par le freelance
- **Compétences** : liste des compétences avec niveaux (débutant, intermédiaire, expert) sous forme de badges
- **Portfolio** : galerie visuelle des projets réalisés (images, titre, description, lien, compétences utilisées)
- **Services publiés** : grille de tous les services actifs du freelance
- **Avis reçus** : tous les avis avec note détaillée et réponses
- **Statistiques publiques** : taux de complétion des commandes, délai moyen de livraison, nombre de clients satisfaits, membre depuis (date)
- **Disponibilité** : calendrier de disponibilité (jours/heures), indication si disponible pour missions urgentes
- **Langues** : langues parlées avec niveaux
- **Boutons d'action** : "Contacter", "Commander un service"

### 2.6 Profil public agence (`/agences/[slug]`)

Page publique d'une agence, comprenant :

- **En-tête** : image de couverture, logo, nom de l'agence, secteur d'activité, pays, badge (Agence Vérifiée, Agence Premium)
- **Statistiques** : projets réalisés, clients satisfaits, taux de satisfaction, délai moyen
- **Onglets de navigation** :
  - **À propos** : description, spécialités, histoire
  - **Équipe** : membres visibles avec photo, nom, titre et compétences
  - **Avis** : avis clients avec note détaillée et pagination
- **Services de l'agence** : grille de services publiés sous la marque agence
- **Sidebar** : carte résumé avec informations clé, bouton "Demander un devis", liens sociaux

### 2.7 Explorateur d'offres clients (`/offres-projets`)

Liste des projets publiés par les clients, ouverts aux candidatures :

- **Filtres** : budget (min/max), catégorie, urgence (normale/urgente/très urgente), type de contrat (ponctuel/long terme/récurrent), compétences requises, pays
- **Chaque offre affiche** : titre, budget estimé, deadline, nombre de candidatures reçues, niveau d'urgence, compétences requises, profil résumé du client
- **Bouton "Postuler"** : redirige vers le formulaire de candidature (inscription requise)

### 2.8 Page Tarifs (`/tarifs`)

Présentation des 4 plans d'abonnement avec :

- **Toggle mensuel/annuel** : l'abonnement annuel offre une réduction de 20%
- **Tableau comparatif** des 4 plans (Gratuit, Pro, Business, Agence) avec toutes les fonctionnalités et limites
- **Plan recommandé** : le plan Pro est mis en avant visuellement comme "populaire"
- **FAQ** : 5 questions fréquentes sur les abonnements (accordéon dépliable)
- **Intégration devise** : les prix s'affichent dans la devise choisie par l'utilisateur

| Plan | Prix mensuel | Commission | Services actifs | Candidatures/mois |
|------|-------------|------------|-----------------|-------------------|
| Gratuit | 0 € | 20% | 3 | 5 |
| Pro | 15 € | 15% | 15 | 20 |
| Business | 45 € | 10% | Illimité | Illimité |
| Agence | 99 € | 8% | Illimité | Illimité |

### 2.9 Comment ça marche (`/comment-ca-marche`)

Guide pédagogique expliquant le fonctionnement de la plateforme par rôle :

- **Pour les Freelances** (4 étapes) : Créer votre profil → Publier vos services → Recevoir des commandes → Être payé
- **Pour les Clients** (4 étapes) : Trouver un expert → Commander un service → Collaborer en temps réel → Valider et évaluer
- **Pour les Agences** (4 étapes) : Créer votre agence → Constituer votre équipe → Gérer vos projets → Facturer et encaisser

Chaque étape comprend un titre, une description et une icône illustrative. Les sections sont colorées par rôle (violet pour Freelance, bleu pour Client, émeraude pour Agence).

### 2.10 Confiance & Sécurité (`/confiance-securite`)

Page détaillant les mesures de sécurité et de confiance de la plateforme :

- **Paiements sécurisés** : explication du système d'escrow (séquestre) — les fonds sont bloqués jusqu'à validation de la livraison
- **Vérification KYC** : explication des 4 niveaux de vérification d'identité progressive
- **Résolution de litiges** : processus de médiation par l'équipe FreelanceHigh avec timeline
- **Chiffrement SSL** : chiffrement de toutes les communications (TLS 1.3)
- **Protection des données** : conformité RGPD, stockage des données en UE
- **Escrow garanti** : protection financière pour les deux parties

### 2.11 Programme d'affiliation (`/affiliation`)

Page de présentation du programme de parrainage :

- **Niveaux de commission** : tiers de parrainage avec commissions en EUR
- **Calculateur de gains** : simulateur interactif de revenus potentiels
- **Témoignages d'affiliés** : retours d'expérience
- **Inscription** : bouton CTA pour rejoindre le programme

### 2.12 Centre d'aide (`/aide`)

Page d'aide complète avec :

- **Barre de recherche** : recherche dans les FAQ et articles d'aide
- **Catégories** : regroupement par thème (Compte, Paiements, Commandes, Sécurité, etc.)
- **FAQ** : questions fréquentes organisées par catégorie
- **Live chat** : widget de chat en direct avec l'équipe support
- **Système de tickets** : formulaire de création de ticket support
- **Liens utiles** : vers CGU, Confidentialité, Cookies, Mentions Légales

### 2.13 Contrats (`/contrats` et `/contrats/generateur`)

- Page d'information sur le système de contrats de la plateforme
- Générateur de contrats : outil de création de contrats personnalisés basés sur les détails d'une commande

---

## 3. Espace Authentification

### 3.1 Inscription (`/inscription`)

Formulaire d'inscription multi-rôles :

- **Choix du rôle** dès le départ : Freelance, Client ou Agence
- **Champs communs** : nom, prénom, email, mot de passe
- **Champs agence** (formulaire dédié) : nom de l'agence, secteur d'activité, taille de l'équipe, SIRET (optionnel)
- **Connexion sociale** : Google, Facebook, LinkedIn, Apple
- **Validation** : vérification email obligatoire par code OTP avant toute action

### 3.2 Connexion (`/connexion`)

- Email + mot de passe
- Connexion sociale (Google, Facebook, LinkedIn, Apple)
- Case "Se souvenir de moi" (prolonge la durée du refresh token à 30 jours)
- Détection automatique du rôle et redirection vers l'espace correspondant (Dashboard, Client, Agence)

### 3.3 Mot de passe oublié (`/mot-de-passe-oublie`)

- Saisie de l'adresse email
- Envoi d'un lien de réinitialisation par email
- Lien valide pendant 1 heure

### 3.4 Réinitialisation du mot de passe (`/reinitialiser-mot-de-passe`)

- Formulaire de saisie du nouveau mot de passe
- Vérification de la force du mot de passe
- Confirmation et redirection vers la connexion

### 3.5 Onboarding (`/onboarding`)

Wizard guidé en plusieurs étapes, adapté au rôle de l'utilisateur :

**Freelance (4 étapes) :**
1. Profil de base : photo, titre professionnel, bio
2. Compétences : sélection des compétences avec niveaux
3. Premier service : création rapide d'un premier service
4. Publication et confirmation

**Client (4 étapes) :**
1. Profil entreprise : nom, logo, description, secteur
2. Premier projet ou exploration de la marketplace
3. Méthode de paiement : ajout d'une carte bancaire ou Mobile Money
4. Confirmation

**Agence (4 étapes) :**
1. Informations agence : logo, description, spécialités
2. Membres fondateurs : invitation des premiers membres de l'équipe
3. Premier service agence : publication d'un service sous la marque agence
4. Vérification et confirmation

---

## 4. Espace Freelance (Dashboard)

L'espace Freelance est accessible à `/dashboard` et comprend toutes les fonctionnalités nécessaires à un freelance pour gérer son activité sur la plateforme.

### 4.1 Dashboard principal (`/dashboard`)

Vue d'ensemble de l'activité du freelance :

- **Revenus du mois** : montant total gagné ce mois avec graphique de progression par rapport au mois précédent
- **Commandes actives** : nombre et liste des commandes en cours avec statuts (en cours, livrée, en révision)
- **Messages non lus** : compteur de messages non lus dans la messagerie
- **Vues du profil** : nombre de vues du profil public cette semaine et ce mois
- **Taux de complétion** : pourcentage de commandes livrées dans les temps
- **Alertes importantes** : notifications urgentes (délai de livraison proche, révision demandée par un client, paiement reçu dans le portefeuille)
- **Recommandations** : suggestions de projets clients correspondant aux compétences du freelance, services à améliorer

### 4.2 Mes Services (`/dashboard/services`)

Gestion de tous les services publiés par le freelance :

- **Liste des services** : tableau avec pour chaque service : titre, catégorie, statut (actif/en pause/en modération), nombre de vues, nombre de commandes, taux de conversion, revenus générés
- **Actions** : créer un nouveau service, modifier, dupliquer, mettre en pause, supprimer
- **Statistiques détaillées** par service : graphique de vues et commandes dans le temps

### 4.3 Création de service (`/dashboard/services/nouveau`)

Wizard de création en 4 étapes :

**Étape 1 — Informations :**
- Titre du service (optimisé SEO)
- Catégorie et sous-catégorie
- Tags (compétences et mots-clés)
- Description détaillée (éditeur rich text)

**Étape 2 — Forfaits :**
- Configuration de 1 à 3 forfaits (Basique, Standard, Premium)
- Pour chaque forfait : prix (en EUR), délai de livraison (en jours), nombre de révisions incluses, liste des éléments livrés

**Étape 3 — Extras & FAQ :**
- Options payantes additionnelles (livraison express +X€, révision supplémentaire +X€, fichier source +X€)
- Questions fréquentes sur le service (éditées par le freelance)

**Étape 4 — Galerie & Publication :**
- Upload de photos et/ou vidéo de présentation
- Prévisualisation du service tel qu'il apparaîtra sur la marketplace
- Bouton "Publier" (envoi en modération)

### 4.4 Optimisation SEO (`/dashboard/services/seo`)

Outils pour optimiser la visibilité des services dans les résultats de recherche :
- Titre optimisé avec suggestions
- Mots-clés et meta description
- Score SEO avec recommandations d'amélioration

### 4.5 Commandes (`/dashboard/commandes`)

Gestion de toutes les commandes reçues :

- **Filtres** : en cours, livrées, en révision, annulées, en litige
- **Page de détail d'une commande** (`/dashboard/commandes/[id]`) :
  - Chat intégré avec le client (messagerie en temps réel)
  - Espace de livraison : upload de fichiers livrables
  - Timeline des étapes : historique chronologique de la commande
  - Historique des révisions demandées et effectuées
  - Demande d'extension de délai
  - Bouton "Marquer comme livré"
  - Statut de l'escrow (fonds bloqués, libérés, en litige)

- **Suivi de commande** (`/dashboard/commandes/[id]/suivi`) :
  - Vue détaillée de l'avancement
  - Étapes de progression visuelles
  - Notifications automatiques à chaque changement de statut

### 4.6 Candidatures (`/dashboard/candidatures`)

Gestion des candidatures aux projets publiés par les clients :

- Explorer les projets ouverts aux candidatures
- Postuler avec : lettre de motivation, prix proposé, délai estimé
- Suivi de l'état des candidatures : en attente, vue par le client, acceptée, refusée
- Filtres sur les projets : budget, catégorie, urgence, compétences requises

### 4.7 Offres personnalisées (`/dashboard/offres`)

Création et gestion de devis sur mesure :

- Créer une offre personnalisée pour un client spécifique (montant, délai, révisions, description détaillée)
- Durée de validité de l'offre (7, 14 ou 30 jours)
- Historique de toutes les offres envoyées avec statuts (en attente, acceptée, refusée, expirée)
- Relance automatique avant expiration de l'offre

### 4.8 Gains & Finances (`/dashboard/finances`)

Tableau de bord financier complet :

- **Solde disponible** : montant retirable immédiatement
- **En attente** : montant en escrow (fonds bloqués sur commandes en cours)
- **Total gagné** : revenus cumulés depuis l'inscription
- **Demande de retrait** : formulaire pour retirer les fonds via :
  - Virement SEPA (1-3 jours ouvrés)
  - PayPal (1-2 jours)
  - Wise (1-2 jours)
  - Mobile Money : Orange Money, Wave, MTN MoMo (instantané à 24h)
- **Méthodes de paiement** : gestion des méthodes de retrait sauvegardées
- **Factures** : toutes les factures générées automatiquement (téléchargeables en PDF)
- **Simulation fiscale** : estimation indicative des revenus nets après impôts

### 4.9 Statistiques (`/dashboard/statistiques`)

Analyses détaillées des performances :

- **Graphiques de revenus** : mensuel, annuel, période personnalisée
- **Performance des services** : vues, clics, commandes, taux de conversion, abandons
- **Comparaison périodique** : comparaison avec la période précédente (mois/trimestre/année)
- **Classement** : position dans la catégorie par rapport aux autres freelances
- **Export** : téléchargement des rapports en CSV ou PDF

### 4.10 Profil (`/dashboard/profil`)

Gestion du profil professionnel :

- **Informations personnelles** : prénom, nom, photo, bio, ville, pays
- **Profil professionnel** : titre, description longue, tarif horaire indicatif
- **Compétences** : liste avec niveaux (débutant/intermédiaire/expert)
- **Formation & Certifications** : diplômes et certificats avec justificatifs uploadables
- **Langues** : langues parlées avec niveaux
- **Liens externes** : LinkedIn, GitHub, Behance, Dribbble, site web personnel
- **Barre de complétion** : indicateur de pourcentage de profil complété avec suggestions d'amélioration

### 4.11 Portfolio (`/dashboard/portfolio`)

Galerie de projets réalisés :

- Ajouter un projet : titre, description, images (jusqu'à 10), lien externe, catégorie, compétences utilisées
- Réorganiser l'ordre d'affichage par glisser-déposer
- Mettre en avant 3 projets "coup de coeur" (affichés en priorité sur le profil public)
- Supprimer ou modifier un projet existant

### 4.12 Avis (`/dashboard/avis`)

Gestion des avis reçus :

- Tous les avis avec note détaillée (qualité, communication, délai) et note globale
- Répondre publiquement à chaque avis
- Signaler un avis abusif (injure, harcèlement, contenu inapproprié)
- Note moyenne et tendance (amélioration ou dégradation)

### 4.13 Disponibilité (`/dashboard/disponibilite`)

Gestion du calendrier :

- Calendrier hebdomadaire de disponibilité (jours et créneaux horaires)
- Mode vacances : mise en pause automatique de tous les services pendant l'absence, message d'absence personnalisable, date de retour estimée
- Badge "Disponible pour missions urgentes" (optionnel)

### 4.14 Certifications IA (`/dashboard/certifications`)

Système de certifications de compétences surveillé par IA :

- Catalogue de certifications disponibles : développement, design, rédaction, marketing digital, traduction, etc.
- Tests de compétences chronométrés
- Certifications validées affichées en badge sur le profil public
- Historique des tentatives et résultats

### 4.15 Productivité (`/dashboard/productivite`)

Outils intégrés pour améliorer la productivité :

- **Timer Pomodoro** : minuteur configurable (25/5/15 minutes) avec suivi du temps travaillé
- **Journal d'activité** : registre quotidien des tâches effectuées
- **Preuve de travail** : système de captures d'écran horodatées pour les missions facturées à l'heure

### 4.16 Automatisation (`/dashboard/automatisation`)

Workflows automatisés paramétrables :

- Création de règles logiques : "Si X → Alors Y" (ex: "Si commande acceptée → Envoyer message de bienvenue", "Si délai dans 24h → Me notifier")
- Bibliothèque de templates de workflows prédéfinis
- Réponses automatiques aux messages fréquents
- Intégration future avec Zapier/n8n via webhooks

### 4.17 Messagerie (`/dashboard/messages`)

Messagerie en temps réel :

- Liste des conversations avec tous les clients et agences
- Chat en temps réel avec indicateurs de frappe et de lecture
- Envoi de pièces jointes (images, fichiers, PDF)
- Historique persistant lié aux commandes
- Notifications push et email

### 4.18 Abonnement (`/dashboard/abonnement`)

Gestion de l'abonnement :

- Plan actuel avec détail des fonctionnalités et limites
- Changer de plan (upgrade/downgrade)
- Toggle mensuel/annuel
- Historique de facturation
- Annuler l'abonnement

### 4.19 Paramètres (`/dashboard/parametres`)

Configuration complète du compte :

- **Préférences** : langue (FR/EN), devise préférée, thème (clair/sombre)
- **Notifications** : paramétrage fin par type d'événement (email, push, SMS) et par fréquence
- **Confidentialité** : visibilité du profil (public, connexions uniquement, privé)
- **Sécurité** : changement de mot de passe, activation/désactivation 2FA, sessions actives avec révocation
- **Méthodes de paiement** : gestion des moyens de retrait
- **Clés API & Webhooks** : génération et gestion de clés API (plan Business)
- **Suppression du compte** : processus de suppression définitive

---

## 5. Espace Client

L'espace Client est accessible à `/client` et offre toutes les fonctionnalités nécessaires pour commander des services et gérer des projets.

### 5.1 Dashboard Client (`/client`)

Vue d'ensemble :

- **Projets actifs** : liste avec barres de progression
- **Dernières commandes** : statut de chaque commande (en cours, livrée, en attente de validation)
- **Freelances favoris** : accès rapide aux prestataires sauvegardés
- **Dépenses du mois** : graphique des dépenses avec répartition par catégorie
- **Recommandations** : freelances et services suggérés basés sur l'historique de commandes

### 5.2 Publier un projet (`/client/projets/nouveau`)

Wizard complet de publication d'offre :

1. **Titre et catégorie** : titre descriptif, catégorie et sous-catégorie
2. **Description détaillée** : éditeur rich text pour décrire le besoin
3. **Budget** : fixe (montant total) ou horaire (tarif horaire min/max)
4. **Délai souhaité** : date limite de livraison
5. **Compétences requises** : sélection des compétences nécessaires avec niveau attendu
6. **Fichiers joints** : upload de briefs, maquettes, documents de référence
7. **Visibilité** : public (visible par tous), privé (sur invitation), restreint à certains pays
8. **Urgence** : normale, urgente, très urgente
9. **Type de contrat** : ponctuel, long terme, récurrent
10. **Prévisualisation** avant publication

### 5.3 Mes Projets (`/client/projets`)

Gestion de tous les projets publiés :

- Liste des projets actifs, clos et en brouillon
- Candidatures reçues par projet avec profils résumés des candidats
- Filtrer et trier les candidatures (note, prix, délai, expérience)
- Accepter, refuser ou mettre en favoris une candidature
- Contacter directement un candidat
- Marquer un projet comme pourvu ou annuler

### 5.4 Mes Commandes (`/client/commandes`)

Suivi de toutes les commandes :

- Vue filtrée : actives, livrées, en révision, annulées, en litige
- Suivre l'avancement en temps réel
- Actions disponibles : valider la livraison, demander une révision (avec commentaires détaillés), ouvrir un litige
- Télécharger les livrables reçus

### 5.5 Explorer (`/client/explorer`)

Recherche avancée de freelances et d'agences :

- Filtres : compétences, note minimale, fourchette de prix, disponibilité, pays, type (freelance ou agence), niveau de vérification
- Vue profil complet avec portfolio et avis
- Envoyer un message direct
- Inviter à postuler sur un projet publié

### 5.6 Recherche IA (`/client/recherche-ia`)

Moteur de recherche intelligent :

- Décrire son besoin en langage naturel (ex: "Je cherche un développeur React qui parle français et peut livrer en 5 jours")
- L'IA analyse la demande et suggère les services, freelances et agences les plus pertinents
- Suggestions affinées selon l'historique d'achats du client
- Résultats classés par pertinence avec score de correspondance

### 5.7 Favoris (`/client/favoris`)

Organisation des favoris :

- Freelances favoris organisés en listes personnalisées
- Services sauvegardés
- Agences favorites

### 5.8 Messages (`/client/messages`)

Messagerie unifiée :

- Conversations avec tous les prestataires
- Lien vers la commande associée à chaque conversation
- Pièces jointes, indicateurs de frappe et de lecture

### 5.9 Factures & Paiements (`/client/factures` et `/client/paiements`)

Gestion financière :

- Toutes les factures reçues (téléchargeables en PDF)
- Historique des paiements par projet
- Méthodes de paiement enregistrées (carte bancaire, Mobile Money, virement)
- Solde de crédits FreelanceHigh
- Rapport de dépenses exportable (CSV/PDF)

### 5.10 Profil Entreprise (`/client/profil`)

Profil visible par les freelances :

- Nom de l'entreprise, logo, description, site web
- Secteur d'activité, taille d'équipe
- Historique : nombre de projets publiés, taux d'embauche
- Avis laissés par les freelances sur le client

### 5.11 Paramètres (`/client/parametres`)

Identiques à l'espace Freelance (préférences, notifications, sécurité, confidentialité, etc.)

---

## 6. Espace Agence

L'espace Agence est accessible à `/agence` et offre des fonctionnalités de gestion collective avancées.

### 6.1 Dashboard Agence (`/agence`)

Vue d'ensemble de l'activité de l'agence :

- **CA mensuel** : chiffre d'affaires global avec graphique d'évolution
- **Projets actifs** : nombre et liste des projets en cours
- **Clients actifs** : nombre de clients avec commandes en cours
- **Membres de l'équipe** : nombre de membres avec taux d'occupation moyen
- **Commandes** : commandes en cours par membre de l'équipe
- **Alertes** : délais proches, litiges, paiements reçus

### 6.2 Gestion de l'Équipe (`/agence/equipe`)

Administration des membres :

- **Liste des membres** : photo, nom, titre, rôle, statut (actif/inactif), taux d'occupation
- **Inviter un freelance** : par email — le freelance invité garde son profil individuel mais apparaît aussi dans l'équipe de l'agence
- **Rôles disponibles** :
  - Admin agence : tous les droits
  - Manager : gestion des projets et commandes, pas d'accès aux finances
  - Freelance membre : accès aux commandes assignées
  - Commercial : accès au CRM et aux offres, pas d'accès aux livrables
- **Taux d'occupation** : pourcentage de temps disponible par membre
- **Assigner** : attribuer une commande ou un projet à un membre
- **Suivi charge** : tableau de la charge de travail par membre
- **Retirer** : supprimer un membre de l'agence

### 6.3 Freelances externes (`/agence/freelances/[id]`)

Page de détail d'un freelance externe exploré depuis la plateforme, avec options pour :
- Inviter à rejoindre l'équipe
- Passer une commande de sous-traitance

### 6.4 CRM Clients (`/agence/clients`)

Gestion de la relation client :

- Liste des clients avec historique complet (commandes, CA généré, dernière interaction)
- Notes internes par client
- Rappels et suivi de relance
- Pipeline commercial visuel (prospect → devis → commande → livré → facturé)
- Ajouter un client externe manuellement

### 6.5 Projets Agence (`/agence/projets`)

Gestion de projets complexes impliquant plusieurs membres :

- **Vue Kanban** : colonnes par statut (À faire, En cours, En révision, Livré)
- **Vue Calendrier** : par deadline
- **Vue Liste** : exportable en CSV
- Suivi de l'avancement global et par membre
- Jalons / milestones par étape
- Commentaires internes sur les projets

### 6.6 Services de l'Agence (`/agence/services`)

Publication de services sous la marque agence :

- Wizard de création identique à l'espace Freelance
- Les services sont publiés sous le nom et le logo de l'agence
- Statistiques de performance par service agence

### 6.7 Commandes Agence (`/agence/commandes`)

Gestion des commandes :

- Toutes les commandes issues des services agence
- Assignation à un membre de l'équipe
- Suivi global et détaillé par commande

### 6.8 Finances Agence (`/agence/finances`)

Tableau de bord financier complet :

- CA global avec graphiques mensuels et annuels
- Revenus par membre (contribution individuelle)
- Commission interne de l'agence (pourcentage paramétrable prélevé sur chaque commande)
- Facturation clients
- Demande de retrait collectif
- Rapport financier exportable (CSV/PDF)

### 6.9 Analytics Agence (`/agence/analytics`)

Analyse des performances :

- Performance de l'équipe : commandes livrées, note moyenne, délai moyen
- Satisfaction clients (NPS)
- Revenus par catégorie de service
- Comparaisons de périodes
- Rapport de performance exportable

### 6.10 Messagerie Agence (`/agence/messages`)

Communication interne et externe :

- Canaux internes par projet
- Messagerie externe avec les clients
- Traduction temps réel (FR ↔ EN ↔ AR)
- Convertisseur de devises intégré dans le chat

### 6.11 Paramètres Agence (`/agence/parametres`)

Configuration de l'agence :

- Informations (logo, description, contacts)
- Gestion des rôles et permissions des membres
- Plan d'abonnement agence
- Méthodes de paiement et retrait
- Notifications
- Clés API (plan Business)

---

## 7. Espace Admin

L'espace Admin est accessible à `/admin` et fournit tous les outils nécessaires à la gestion et la modération de la plateforme.

### 7.1 Dashboard Global (`/admin`)

Vue d'ensemble en temps réel :

- **Métriques live** : utilisateurs totaux (par rôle), GMV (Gross Merchandise Value), commandes actives, commissions perçues, litiges ouverts, taux de conversion
- **Graphiques interactifs** : revenus, inscriptions, conversions dans le temps
- **Alertes automatiques** : anomalie financière, litige urgent, service signalé, tentative de fraude, pic de trafic
- **Carte du monde** : activité par pays avec densité visuelle

### 7.2 Gestion des Utilisateurs (`/admin/utilisateurs`)

Administration de tous les comptes :

- **Liste filtrée** : par rôle (freelance/client/agence), statut (actif/suspendu/banni), pays, date d'inscription, plan d'abonnement, niveau KYC
- **Page de détail utilisateur** (`/admin/utilisateurs/[id]`) :
  - Profil complet avec toutes les informations
  - Historique des commandes et transactions
  - Documents KYC soumis
  - Journal des actions admin sur ce compte
  - Avis donnés et reçus
- **Actions** : vérifier le KYC, suspendre temporairement (avec durée), bannir définitivement, envoyer un message, supprimer le compte
- **Impersonation** : se connecter en tant que l'utilisateur pour diagnostiquer un problème (via service-role JWT)

### 7.3 Vérifications KYC (`/admin/kyc`)

File d'attente de vérification :

- Liste des demandes de vérification en attente, triées par niveau demandé et ancienneté
- Visualisation des documents soumis (pièce d'identité, justificatifs)
- Interface d'approbation : approuver (avec attribution automatique du niveau) / rejeter (avec motif détaillé obligatoire)
- Historique de toutes les décisions KYC par opérateur admin
- Statistiques : temps moyen de traitement, taux d'approbation, répartition par niveau

### 7.4 Modération des Services (`/admin/services`)

Modération du contenu publié :

- File des nouveaux services en attente d'approbation
- Services signalés par les utilisateurs
- Interface de review : approuver, demander une modification (avec commentaire), refuser (avec motif), supprimer
- Historique des décisions de modération

### 7.5 Gestion des Commandes (`/admin/commandes`)

Vue administrative de toutes les commandes :

- Filtres avancés : statut, montant, date, rôle des parties, pays
- Détail de chaque commande avec historique complet
- Intervention manuelle possible en cas de blocage

### 7.6 Litiges (`/admin/litiges`)

Centre de résolution des conflits :

- File triée par urgence et ancienneté
- **Page de détail d'un litige** :
  - Timeline complète des échanges entre les parties
  - Accès à toutes les preuves (captures d'écran, fichiers soumis, messages)
  - Détail de la commande concernée avec historique
  - Interface de verdict : en faveur du freelance / en faveur du client / remboursement partiel (pourcentage ajustable) / annulation mutuelle
  - Motif de la décision (obligatoire)
- Historique des litiges résolus avec statistiques
- KPI : taux de litiges, causes principales, temps moyen de résolution

### 7.7 Transactions & Finances (`/admin/finances`)

Contrôle financier complet :

- Toutes les transactions de la plateforme (paiements, retraits, remboursements, commissions)
- Fonds en escrow par commande (montants bloqués)
- Valider ou bloquer un paiement/retrait manuellement
- Gérer les remboursements
- Commissions perçues par période (jour/semaine/mois/année)
- Paiements en attente de traitement
- Rapports financiers exportables (CSV/PDF)

### 7.8 Blog & Contenu (`/admin/blog`)

Gestion éditoriale :

- Éditeur d'articles rich text avec médias (images, vidéos)
- Gestion des catégories et tags
- Programmation de publications (date/heure)
- Gestion des auteurs et contributeurs
- Statistiques de lecture par article (vues, temps de lecture, partages)

### 7.9 Catégories & Tags (`/admin/categories`)

Organisation de la marketplace :

- CRUD complet sur les catégories de services et sous-catégories
- Définir l'ordre d'affichage et les catégories mises en avant sur la page d'accueil
- Gestion des tags populaires et des tendances

### 7.10 Plans & Commissions (`/admin/plans`)

Configuration commerciale :

- Modifier les taux de commission par plan
- Modifier les fonctionnalités et limites de chaque plan
- Gérer les codes promotionnels (conditions, expirations, limites d'usage)
- Créer des offres spéciales temporaires (ex: -50% sur le plan Pro pendant 1 mois)

### 7.11 Notifications & Emailing (`/admin/notifications`)

Communication ciblée :

- Envoyer une notification ciblée : à tous les utilisateurs, un segment (par rôle, pays, plan), un utilisateur spécifique
- Créer des campagnes email
- Gérer les templates d'emails transactionnels (23 templates définis)
- Statistiques d'ouverture et de clics par campagne

### 7.12 Analytics Plateforme (`/admin/analytics`)

Analyse avancée :

- Trafic et inscriptions par source, pays, rôle
- Conversions par étape du tunnel (visite → inscription → commande → paiement)
- Revenus par catégorie, pays, devise, période
- Cohortes d'utilisateurs (analyse de rétention)
- Rapports exportables (CSV/PDF)
- Comparaisons de périodes

### 7.13 Configuration Plateforme (`/admin/configuration`)

Paramètres globaux :

- Nom du site, logo, couleurs, langues actives
- Devises disponibles et taux de conversion
- Modes de paiement activés/désactivés
- Mode maintenance avec message personnalisé
- Configuration des emails transactionnels (expéditeur, templates)
- Règles de modération automatique (mots interdits, limites, seuils)

---

## 8. Système financier

### 8.1 Flux d'une commande type

```
1. Client sélectionne un forfait et paie
   → Fonds bloqués en escrow (Stripe Connect hold ou wallet DB)

2. Prestataire travaille sur la commande
   → Fonds toujours en escrow

3. Prestataire livre les fichiers
   → Notification au Client

4. Client valide la livraison (ou auto-validation après 3 jours)
   → Fonds libérés dans le portefeuille du Prestataire (moins la commission)

5. Prestataire demande un retrait
   → Virement SEPA / PayPal / Wise / Mobile Money
```

### 8.2 En cas de litige

```
1. Client ou Prestataire ouvre un litige
   → Fonds gelés en escrow (statut "disputed")

2. Les parties soumettent leurs preuves (48h)

3. L'équipe admin examine le dossier

4. Verdict rendu (dans les 5 jours ouvrés) :
   - En faveur du Client → remboursement intégral
   - En faveur du Prestataire → libération des fonds
   - Partiel → répartition selon l'évaluation
```

### 8.3 Méthodes de paiement par région

| Région | Méthodes disponibles |
|--------|---------------------|
| Europe / International | Visa, Mastercard, SEPA, PayPal, Apple Pay, Google Pay |
| Afrique francophone (17 pays) | Orange Money, Wave, MTN Mobile Money (via CinetPay) |
| Afrique anglophone (V1) | Flutterwave (Nigeria, Ghana, Kenya) |
| Crypto (V4) | USDC, USDT |

---

## 9. Pages légales

### 9.1 Conditions Générales d'Utilisation (`/cgu`)

Document juridique complet de 23 articles couvrant :
- Objet et définitions (Plateforme, Utilisateur, Freelance, Client, Agence, Service, Commande, Escrow, Portefeuille, KYC, Commission)
- Inscription et création de compte (conditions, choix du rôle, vérification email, onboarding, sécurité)
- Vérification d'identité KYC (4 niveaux progressifs)
- Publication et gestion des services (conditions, modération, forfaits, limites par plan)
- Commandes et exécution (passation, déroulement, cycle de vie, livraison, révisions, extensions)
- Offres et projets clients (publication, candidatures, offres personnalisées)
- Paiements, commissions et portefeuille (méthodes, devise, escrow, commissions par plan, retraits, facturation)
- Plans d'abonnement (4 plans avec détails)
- Litiges et résolution (ouverture, médiation, verdicts, caractère définitif, impact réputation)
- Évaluations et avis (système double sens, règles, droit de réponse)
- Propriété intellectuelle (droits sur livrables, droit de portfolio, droits Plateforme)
- Responsabilité (rôle d'intermédiaire, garanties limitées, force majeure)
- Contenus et activités interdits (14 types de contenus/activités listés)
- Dispositions spécifiques aux Agences
- Suspension, restriction et suppression de compte
- Données personnelles (renvoi vers Politique de Confidentialité)
- Politique d'annulation et de remboursement
- Badges et système de réputation (6 types de badges)
- Communication entre Utilisateurs
- Programme d'affiliation
- Modifications des CGU
- Droit applicable et juridiction (droit français, tribunaux de Paris)
- Contact

### 9.2 Politique de Confidentialité (`/confidentialite`)

Document RGPD complet de 14 sections couvrant :
- Responsable du traitement (Lissanon Gildas, FreelanceHigh)
- Données personnelles collectées (6 catégories : identification, professionnelles, KYC, financières, navigation, communication)
- Finalités du traitement (8 finalités détaillées)
- Bases légales (exécution du contrat, consentement, obligation légale, intérêt légitime)
- Destinataires des données (sous-traitants techniques avec tableau détaillé, autres utilisateurs, autorités)
- Transferts internationaux (EU-US Data Privacy Framework, CCT, mesures supplémentaires)
- Sécurité des données (mesures techniques : chiffrement, hachage, RLS, CSRF, rate limiting, 2FA ; mesures organisationnelles)
- Durées de conservation (tableau par type de données avec fondement légal)
- Vos droits RGPD (8 droits détaillés : accès, rectification, effacement, portabilité, opposition, limitation, retrait consentement, directives post-mortem)
- Cookies (renvoi vers Politique de Cookies)
- Protection des mineurs
- Profilage et décisions automatisées
- Modifications de la politique
- Contact (DPO : privacy@freelancehigh.com, CNIL)

### 9.3 Politique de Cookies (`/cookies`)

Document complet de 9 sections couvrant :
- Définition des cookies et technologies similaires
- Types de cookies utilisés avec tableaux détaillés :
  - Cookies essentiels (authentification, CSRF, consentement)
  - Stockage local (devise, langue, thème)
  - Cookies analytiques (PostHog : pages visitées, parcours, cohortes)
  - Cookies de performance (Sentry : erreurs JS, Web Vitals)
- Cookies tiers (Stripe, CinetPay, Cloudinary)
- Durées de conservation par type
- Comment gérer vos cookies (bandeau, navigateur, outils tiers)
- Balises web et pixels de suivi
- Cookies non utilisés (pas de pub, pas de retargeting, pas de Google Analytics)
- Mise à jour de la politique
- Contact

### 9.4 Mentions Légales (`/mentions-legales`)

Document complet de 12 sections couvrant :
- Éditeur du site (FreelanceHigh, Lissanon Gildas, contact)
- Hébergement (5 prestataires détaillés : Vercel, Railway, Supabase, Upstash, Cloudinary)
- Activité de la Plateforme (description de l'activité d'intermédiation)
- Propriété intellectuelle (droits FreelanceHigh, marques, contenus utilisateurs)
- Données personnelles (résumé RGPD avec renvoi vers Politique de Confidentialité)
- Cookies (résumé avec renvoi vers Politique de Cookies)
- Prestataires de paiement (Stripe certifié PCI DSS, CinetPay)
- Limitation de responsabilité (disponibilité, contenu, contenus utilisateurs, liens hypertextes)
- Droit applicable et juridiction (droit français, tribunaux de Paris, médiation)
- Signalement de contenus illicites (conformément LCEN, email abuse@)
- Crédits (technologies, polices, icônes)
- Contact (3 adresses email : contact, privacy, abuse)

---

## 10. Architecture technique

### 10.1 Stack technologique

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Radix UI |
| État client | Zustand (UI) + TanStack Query v5 (serveur) |
| Backend | Fastify, tRPC v11, Socket.io, BullMQ |
| Base de données | PostgreSQL 15+ (Supabase), Prisma 5 (ORM) |
| Cache | Redis (Upstash) |
| Auth | Supabase Auth (JWT custom claims) |
| Paiements | Stripe Connect, CinetPay, Flutterwave (V1) |
| Stockage | Supabase Storage (privé), Cloudinary (public) |
| Email | Resend + React Email |
| SMS | Twilio / Africa's Talking |
| Analytics | PostHog |
| Monitoring | Sentry |
| Hébergement | Vercel (frontend), Railway (backend), Supabase Cloud (DB) |
| CI/CD | GitHub Actions |
| Monorepo | pnpm workspaces + Turborepo |

### 10.2 Structure des routes

```
apps/web/app/
├── (public)/              # Pages publiques (navbar + footer)
│   ├── page.tsx           # Landing page /
│   ├── explorer/          # Marketplace
│   ├── services/[slug]/   # Détail service
│   ├── freelances/[username]/ # Profil freelance
│   ├── agences/[slug]/    # Profil agence
│   ├── offres-projets/    # Projets clients
│   ├── tarifs/            # Tarifs
│   ├── comment-ca-marche/ # Comment ça marche
│   ├── confiance-securite/# Confiance & Sécurité
│   ├── affiliation/       # Programme affiliation
│   ├── aide/              # Centre d'aide
│   ├── contrats/          # Contrats
│   ├── cgu/               # CGU
│   ├── confidentialite/   # Politique confidentialité
│   ├── cookies/           # Politique cookies
│   └── mentions-legales/  # Mentions légales
├── (auth)/                # Authentification
│   ├── connexion/
│   ├── inscription/
│   ├── onboarding/
│   ├── mot-de-passe-oublie/
│   └── reinitialiser-mot-de-passe/
├── dashboard/             # Espace Freelance (33+ pages)
├── client/                # Espace Client (17+ pages)
├── agence/                # Espace Agence (18+ pages)
├── admin/                 # Espace Admin (17+ pages)
└── developer/             # Portail développeur (2 pages)
```

### 10.3 Emails transactionnels (23 templates)

1. Confirmation d'inscription + OTP
2. Email de bienvenue (onboarding)
3. Confirmation de commande (client + freelance)
4. Nouveau message reçu
5. Livraison effectuée par le freelance
6. Révision demandée par le client
7. Commande validée → fonds libérés
8. Litige ouvert
9. Verdict de litige rendu
10. Retrait demandé
11. Retrait disponible sur le compte
12. Rappel : délai de livraison dans 24h
13. Rappel : livraison en attente de validation depuis 3 jours
14. Nouvelle candidature reçue (client)
15. Candidature acceptée (freelance)
16. Offre personnalisée reçue (client)
17. Facture mensuelle abonnement
18. Renouvellement abonnement à venir
19. Alerte connexion depuis un nouvel appareil
20. Code 2FA
21. Réinitialisation de mot de passe
22. KYC approuvé / refusé
23. Service approuvé / refusé par la modération
24. Nouveau membre invité dans une agence

### 10.4 Nombre total de pages

| Espace | Nombre de pages |
|--------|----------------|
| Public | 18 |
| Authentification | 5 |
| Freelance (Dashboard) | 33+ |
| Client | 17+ |
| Agence | 18+ |
| Admin | 17+ |
| Développeur | 2 |
| **Total** | **110+** |

---

## Annexes

### Roadmap des versions

| Version | Mois | Objectif |
|---------|------|----------|
| **MVP** | 1–3 | Vendre, acheter, encaisser. Les 3 rôles fonctionnels. |
| **V1** | 4–6 | Marketplace complète, matching freelance ↔ client ↔ agence, multi-devises. |
| **V2** | 7–10 | Messagerie temps réel, KYC complet, badges, confiance, rétention. |
| **V3** | 11–15 | IA (contrats, certifications, recherche sémantique), automatisation. |
| **V4** | 16–20 | PWA mobile, Web3/crypto, API publique, affiliation. |

### Contacts

| Objet | Email |
|-------|-------|
| Contact général | contact@freelancehigh.com |
| Données personnelles / DPO | privacy@freelancehigh.com |
| Signalement de contenu | abuse@freelancehigh.com |

---

*© 2026 FreelanceHigh — Documentation rédigée par l'équipe FreelanceHigh. Fondée par Lissanon Gildas.*
