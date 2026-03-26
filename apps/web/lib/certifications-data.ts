export interface CertificationDef {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  questionCount: number;
  passingScore: number;
  durationMinutes: number;
}

export interface QuestionDef {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export const CERTIFICATIONS: CertificationDef[] = [
  // Technique (10)
  { id: "cert-dev-web", name: "Developpement Web", category: "Technique", icon: "code", description: "Maitrisez HTML, CSS, JavaScript et les frameworks modernes pour creer des sites et applications web performants.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-dev-mobile", name: "Developpement Mobile", category: "Technique", icon: "phone_android", description: "Validez vos competences en developpement d'applications mobiles natives et cross-platform.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-dev-backend", name: "Developpement Backend", category: "Technique", icon: "dns", description: "Prouvez votre expertise en architecture serveur, APIs REST/GraphQL et bases de donnees.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-dev-python", name: "Python & Data Science", category: "Technique", icon: "data_object", description: "Demontrez vos competences en Python, analyse de donnees, pandas et machine learning.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-dev-wordpress", name: "WordPress & CMS", category: "Technique", icon: "web", description: "Certifiez votre maitrise de WordPress, des themes, plugins et de l'ecosysteme CMS.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-cybersecurite", name: "Cybersecurite", category: "Technique", icon: "security", description: "Validez vos connaissances en securite informatique, cryptographie et protection des systemes.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-devops", name: "DevOps & Cloud", category: "Technique", icon: "cloud", description: "Prouvez votre expertise en CI/CD, conteneurisation, orchestration et services cloud.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-ia-ml", name: "Intelligence Artificielle & ML", category: "Technique", icon: "smart_toy", description: "Demontrez vos competences en apprentissage automatique, reseaux de neurones et IA appliquee.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-blockchain", name: "Blockchain & Web3", category: "Technique", icon: "currency_bitcoin", description: "Certifiez vos connaissances en blockchain, smart contracts et applications decentralisees.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-qa-testing", name: "Tests & Assurance Qualite", category: "Technique", icon: "bug_report", description: "Validez votre expertise en tests logiciels, automatisation et assurance qualite.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  // Design (6)
  { id: "cert-design-ui", name: "Design UI/UX", category: "Design", icon: "palette", description: "Prouvez votre maitrise du design d'interfaces, de l'experience utilisateur et du prototypage.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-design-graphique", name: "Design Graphique", category: "Design", icon: "brush", description: "Certifiez vos competences en creation visuelle, typographie et composition graphique.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-design-3d", name: "Design 3D & Animation", category: "Design", icon: "view_in_ar", description: "Validez votre expertise en modelisation 3D, animation et rendu visuel.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-design-video", name: "Montage Video & Motion", category: "Design", icon: "movie", description: "Demontrez vos competences en montage video, motion design et post-production.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-design-photo", name: "Photographie & Retouche", category: "Design", icon: "photo_camera", description: "Prouvez votre maitrise de la photographie numerique et de la retouche professionnelle.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-design-branding", name: "Branding & Identite Visuelle", category: "Design", icon: "branding_watermark", description: "Certifiez vos competences en creation de marques, chartes graphiques et identites visuelles.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  // Marketing (6)
  { id: "cert-marketing-digital", name: "Marketing Digital", category: "Marketing", icon: "campaign", description: "Validez votre expertise en strategie digitale, acquisition et conversion en ligne.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-seo", name: "SEO & Referencement", category: "Marketing", icon: "travel_explore", description: "Demontrez vos competences en optimisation pour les moteurs de recherche et referencement naturel.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-social-media", name: "Social Media Management", category: "Marketing", icon: "share", description: "Prouvez votre maitrise de la gestion des reseaux sociaux et du community management.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-email-marketing", name: "Email Marketing & Automation", category: "Marketing", icon: "email", description: "Certifiez vos competences en email marketing, segmentation et automatisation des campagnes.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  // Marketing suite (2)
  { id: "cert-publicite", name: "Publicite en Ligne", category: "Marketing", icon: "ads_click", description: "Maitrisez Google Ads, Facebook Ads et les strategies publicitaires digitales.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-analytics", name: "Analytics & Data Marketing", category: "Marketing", icon: "analytics", description: "Analysez les performances marketing avec Google Analytics et les outils de mesure.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  // Redaction (4)
  { id: "cert-redaction", name: "Redaction Web & Copywriting", category: "Redaction", icon: "edit_note", description: "Validez vos competences en redaction web, copywriting et creation de contenu.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-traduction", name: "Traduction & Localisation", category: "Redaction", icon: "translate", description: "Certifiez votre expertise en traduction professionnelle et localisation de contenu.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-content-strategy", name: "Strategie de Contenu", category: "Redaction", icon: "article", description: "Prouvez votre maitrise de la planification et strategie de contenu editorial.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-journalisme", name: "Journalisme Digital", category: "Redaction", icon: "newspaper", description: "Demontrez vos competences en journalisme numerique, investigation et reportage.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  // Business (6)
  { id: "cert-gestion-projet", name: "Gestion de Projet", category: "Business", icon: "assignment", description: "Validez votre expertise en gestion de projet, planification et suivi d'equipes.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-product-management", name: "Product Management", category: "Business", icon: "inventory_2", description: "Certifiez vos competences en gestion de produit, roadmap et priorisation.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-agile", name: "Agile & Scrum", category: "Business", icon: "sprint", description: "Prouvez votre maitrise des methodologies agiles, Scrum et Kanban.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-leadership", name: "Leadership & Management", category: "Business", icon: "groups", description: "Demontrez vos competences en leadership, gestion d'equipe et prise de decision.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-entrepreneuriat", name: "Entrepreneuriat", category: "Business", icon: "rocket_launch", description: "Validez vos connaissances en creation d'entreprise, business model et strategie.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-service-client", name: "Service Client & Support", category: "Business", icon: "support_agent", description: "Certifiez votre expertise en relation client, support technique et satisfaction.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  // Communication (4)
  { id: "cert-community", name: "Community Management", category: "Communication", icon: "forum", description: "Prouvez votre maitrise de l'animation de communautes en ligne et de l'engagement.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-relation-publique", name: "Relations Publiques", category: "Communication", icon: "record_voice_over", description: "Demontrez vos competences en relations publiques, communication de crise et media.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-presentation", name: "Presentation & Pitch", category: "Communication", icon: "slideshow", description: "Validez votre expertise en creation de presentations et techniques de pitch.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  // Finance & Legal (4)
  { id: "cert-comptabilite", name: "Comptabilite & Finance", category: "Finance", icon: "account_balance", description: "Certifiez vos connaissances en comptabilite, gestion financiere et fiscalite freelance.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-ecommerce", name: "E-commerce", category: "Finance", icon: "shopping_cart", description: "Prouvez votre maitrise du commerce en ligne, des plateformes et de la logistique.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-crypto-finance", name: "Crypto & Finance Decentralisee", category: "Finance", icon: "currency_exchange", description: "Validez vos competences en cryptomonnaies, DeFi et finance decentralisee.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-rgpd", name: "RGPD & Protection des Donnees", category: "Legal", icon: "policy", description: "Demontrez votre expertise en protection des donnees personnelles et conformite RGPD.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
  { id: "cert-droit-numerique", name: "Droit du Numerique", category: "Legal", icon: "gavel", description: "Certifiez vos connaissances en droit du numerique, propriete intellectuelle et contrats.", questionCount: 20, passingScore: 70, durationMinutes: 25 },
];

export const QUESTIONS: Record<string, QuestionDef[]> = {
  // =========================================================================
  // 1. DEVELOPPEMENT WEB (cert-dev-web)
  // =========================================================================
  "cert-dev-web": [
    { id: "dw-1", question: "Quel est le role principal de l'attribut 'alt' sur une balise <img> en HTML ?", options: ["Definir la taille de l'image", "Fournir un texte alternatif pour l'accessibilite", "Ajouter un lien vers l'image", "Definir le format de l'image"], correctIndex: 1 },
    { id: "dw-2", question: "Quelle propriete CSS permet de creer une mise en page flexible en colonnes et en lignes ?", options: ["float", "display: grid", "position: absolute", "text-align: center"], correctIndex: 1 },
    { id: "dw-3", question: "En JavaScript, quelle est la difference entre '==' et '===' ?", options: ["Aucune difference", "'===' compare les valeurs et les types, '==' ne compare que les valeurs", "'==' est plus rapide", "'===' ne fonctionne qu'avec les nombres"], correctIndex: 1 },
    { id: "dw-4", question: "Quelle balise HTML5 est utilisee pour definir une section de navigation ?", options: ["<div id='nav'>", "<navigation>", "<nav>", "<menu>"], correctIndex: 2 },
    { id: "dw-5", question: "Quel est le comportement par defaut de 'display: flex' sur les elements enfants ?", options: ["Ils s'empilent verticalement", "Ils s'alignent horizontalement sur une ligne", "Ils deviennent invisibles", "Ils prennent toute la largeur"], correctIndex: 1 },
    { id: "dw-6", question: "Quelle methode JavaScript permet de transformer un tableau en une seule valeur ?", options: ["map()", "filter()", "reduce()", "forEach()"], correctIndex: 2 },
    { id: "dw-7", question: "En CSS, quelle unite est relative a la taille de police de l'element parent ?", options: ["px", "rem", "em", "vh"], correctIndex: 2 },
    { id: "dw-8", question: "Qu'est-ce que le DOM en developpement web ?", options: ["Un langage de programmation", "Un modele representant la structure du document HTML", "Un serveur web", "Un format d'image"], correctIndex: 1 },
    { id: "dw-9", question: "Quelle est la fonction de 'localStorage' dans le navigateur ?", options: ["Stocker des donnees cote serveur", "Stocker des donnees persistantes cote client", "Executer du code backend", "Gerer les cookies uniquement"], correctIndex: 1 },
    { id: "dw-10", question: "Quel protocole est utilise pour securiser les echanges entre le navigateur et le serveur ?", options: ["HTTP", "FTP", "HTTPS", "SMTP"], correctIndex: 2 },
    { id: "dw-11", question: "En React, quel hook permet de gerer un etat local dans un composant fonctionnel ?", options: ["useEffect", "useState", "useContext", "useRef"], correctIndex: 1 },
    { id: "dw-12", question: "Quelle propriete CSS est utilisee pour ajouter un espace entre le contenu et la bordure d'un element ?", options: ["margin", "padding", "border-spacing", "gap"], correctIndex: 1 },
    { id: "dw-13", question: "Quel est l'avantage principal d'utiliser un bundler comme Webpack ou Vite ?", options: ["Remplacer le HTML", "Combiner et optimiser les fichiers pour la production", "Ecrire du CSS automatiquement", "Heberger le site web"], correctIndex: 1 },
    { id: "dw-14", question: "Quelle methode HTTP est typiquement utilisee pour envoyer des donnees a un serveur ?", options: ["GET", "POST", "DELETE", "HEAD"], correctIndex: 1 },
    { id: "dw-15", question: "Qu'est-ce que le 'responsive design' ?", options: ["Un design uniquement pour mobile", "Un design qui s'adapte a differentes tailles d'ecran", "Un design anime", "Un design sans images"], correctIndex: 1 },
    { id: "dw-16", question: "Quelle est la sortie de 'typeof null' en JavaScript ?", options: ["'null'", "'undefined'", "'object'", "'boolean'"], correctIndex: 2 },
    { id: "dw-17", question: "Quel attribut HTML permet de charger un script de maniere asynchrone ?", options: ["defer", "async", "lazy", "preload"], correctIndex: 1 },
    { id: "dw-18", question: "En CSS, comment selectionne-t-on tous les elements <p> directement enfants d'un <div> ?", options: ["div p", "div > p", "div + p", "div ~ p"], correctIndex: 1 },
    { id: "dw-19", question: "Qu'est-ce qu'une SPA (Single Page Application) ?", options: ["Un site avec une seule image", "Une application web qui charge une seule page HTML et met a jour dynamiquement le contenu", "Un site statique sans JavaScript", "Une page web sans CSS"], correctIndex: 1 },
    { id: "dw-20", question: "Quel est le role d'un CDN (Content Delivery Network) ?", options: ["Compiler le code JavaScript", "Distribuer le contenu geographiquement pour reduire la latence", "Gerer la base de donnees", "Ecrire du HTML automatiquement"], correctIndex: 1 },
  ],

  // =========================================================================
  // 2. DEVELOPPEMENT MOBILE (cert-dev-mobile)
  // =========================================================================
  "cert-dev-mobile": [
    { id: "dm-1", question: "Quel langage est principalement utilise pour le developpement natif Android ?", options: ["Swift", "Kotlin", "Dart", "C#"], correctIndex: 1 },
    { id: "dm-2", question: "Quel framework permet de developper des applications mobiles cross-platform avec JavaScript ?", options: ["Flutter", "React Native", "SwiftUI", "Jetpack Compose"], correctIndex: 1 },
    { id: "dm-3", question: "Quel langage utilise Flutter pour le developpement mobile ?", options: ["JavaScript", "TypeScript", "Dart", "Kotlin"], correctIndex: 2 },
    { id: "dm-4", question: "Qu'est-ce qu'une activite (Activity) dans le contexte Android ?", options: ["Un fichier de configuration", "Un composant representant un ecran avec une interface utilisateur", "Un service d'arriere-plan", "Un type de base de donnees"], correctIndex: 1 },
    { id: "dm-5", question: "Quel outil est utilise pour gerer les dependances dans un projet iOS natif ?", options: ["npm", "CocoaPods", "Gradle", "pip"], correctIndex: 1 },
    { id: "dm-6", question: "Qu'est-ce que Xcode ?", options: ["Un emulateur Android", "L'IDE officiel pour le developpement iOS et macOS", "Un framework JavaScript", "Un outil de test automatise"], correctIndex: 1 },
    { id: "dm-7", question: "Quel pattern architectural est recommande par Google pour les applications Android modernes ?", options: ["MVC", "MVVM", "Singleton", "Factory"], correctIndex: 1 },
    { id: "dm-8", question: "Qu'est-ce que le 'hot reload' dans Flutter ?", options: ["Redemarrer completement l'application", "Appliquer les changements de code instantanement sans perdre l'etat", "Compiler l'application pour la production", "Tester l'application sur un appareil physique"], correctIndex: 1 },
    { id: "dm-9", question: "Quel est le role de Gradle dans un projet Android ?", options: ["Gerer l'interface utilisateur", "Automatiser la compilation et la gestion des dependances", "Ecrire des tests unitaires", "Designer les icones"], correctIndex: 1 },
    { id: "dm-10", question: "Quelle base de donnees locale est couramment utilisee dans les applications mobiles ?", options: ["PostgreSQL", "SQLite", "MongoDB", "Redis"], correctIndex: 1 },
    { id: "dm-11", question: "Qu'est-ce qu'un Intent dans Android ?", options: ["Un type de vue", "Un objet de messagerie pour demander une action a un autre composant", "Un fichier de ressources", "Un gestionnaire de memoire"], correctIndex: 1 },
    { id: "dm-12", question: "Quel est l'avantage principal du developpement cross-platform ?", options: ["Meilleures performances que le natif", "Un seul code source pour plusieurs plateformes", "Acces exclusif aux fonctionnalites materielles", "Temps de compilation plus rapide"], correctIndex: 1 },
    { id: "dm-13", question: "Qu'est-ce que SwiftUI ?", options: ["Un langage de programmation", "Le framework declaratif d'Apple pour construire des interfaces", "Un outil de test iOS", "Un gestionnaire de paquets"], correctIndex: 1 },
    { id: "dm-14", question: "Quel format est utilise pour publier une application sur Google Play Store ?", options: [".ipa", ".apk ou .aab", ".exe", ".dmg"], correctIndex: 1 },
    { id: "dm-15", question: "Qu'est-ce que le 'deep linking' dans une application mobile ?", options: ["Un lien vers le code source", "Un lien qui ouvre directement un contenu specifique dans l'application", "Un lien de telechargement", "Un raccourci clavier"], correctIndex: 1 },
    { id: "dm-16", question: "Quel outil permet de tester une application Android sans appareil physique ?", options: ["TestFlight", "Android Emulator", "Postman", "Charles Proxy"], correctIndex: 1 },
    { id: "dm-17", question: "En React Native, comment accede-t-on aux fonctionnalites natives du telephone ?", options: ["Avec du CSS", "Via des modules natifs (Native Modules) ou des librairies tierces", "En ecrivant du HTML", "Avec des cookies"], correctIndex: 1 },
    { id: "dm-18", question: "Quel est le role du fichier AndroidManifest.xml ?", options: ["Stocker les donnees utilisateur", "Declarer les composants, permissions et configurations de l'application", "Definir les styles CSS", "Compiler le code Java"], correctIndex: 1 },
    { id: "dm-19", question: "Qu'est-ce que Firebase dans le contexte mobile ?", options: ["Un langage de programmation", "Une plateforme Backend-as-a-Service de Google pour les applications mobiles", "Un emulateur iOS", "Un framework CSS"], correctIndex: 1 },
    { id: "dm-20", question: "Quelle est la difference entre une application native et une PWA ?", options: ["Aucune difference", "Une app native est installee depuis le store, une PWA fonctionne dans le navigateur", "Une PWA est plus rapide", "Une app native ne fonctionne pas hors ligne"], correctIndex: 1 },
  ],

  // =========================================================================
  // 3. DEVELOPPEMENT BACKEND (cert-dev-backend)
  // =========================================================================
  "cert-dev-backend": [
    { id: "db-1", question: "Qu'est-ce qu'une API REST ?", options: ["Un type de base de donnees", "Une interface de programmation basee sur les principes du protocole HTTP", "Un langage de programmation", "Un outil de monitoring"], correctIndex: 1 },
    { id: "db-2", question: "Quel code HTTP indique qu'une ressource a ete creee avec succes ?", options: ["200", "201", "301", "404"], correctIndex: 1 },
    { id: "db-3", question: "Qu'est-ce que le middleware dans un framework backend comme Express ?", options: ["Une base de donnees", "Une fonction qui intercepte et traite les requetes avant la reponse", "Un type de serveur", "Un fichier de configuration"], correctIndex: 1 },
    { id: "db-4", question: "Quelle est la principale difference entre SQL et NoSQL ?", options: ["SQL est plus rapide", "SQL utilise des tables relationnelles, NoSQL utilise des structures flexibles", "NoSQL ne peut pas stocker de donnees", "SQL est gratuit, NoSQL est payant"], correctIndex: 1 },
    { id: "db-5", question: "Qu'est-ce qu'un ORM (Object-Relational Mapping) ?", options: ["Un protocole reseau", "Un outil qui mappe les objets du code aux tables de la base de donnees", "Un type de serveur web", "Un langage de requete"], correctIndex: 1 },
    { id: "db-6", question: "Quel est le role d'un index dans une base de donnees ?", options: ["Supprimer des donnees", "Accelerer les requetes de recherche", "Creer des sauvegardes", "Gerer les utilisateurs"], correctIndex: 1 },
    { id: "db-7", question: "Qu'est-ce que GraphQL par rapport a REST ?", options: ["Un remplacement complet de HTTP", "Un langage de requete qui permet au client de demander exactement les donnees dont il a besoin", "Un type de base de donnees", "Un protocole de securite"], correctIndex: 1 },
    { id: "db-8", question: "Quel pattern permet de gerer l'authentification sans etat (stateless) ?", options: ["Sessions serveur", "JWT (JSON Web Token)", "Cookies uniquement", "Basic Auth uniquement"], correctIndex: 1 },
    { id: "db-9", question: "Qu'est-ce que le rate limiting ?", options: ["Limiter la taille des fichiers", "Limiter le nombre de requetes qu'un client peut faire dans un laps de temps", "Limiter la vitesse du serveur", "Limiter le nombre d'utilisateurs"], correctIndex: 1 },
    { id: "db-10", question: "Quel est l'avantage principal de la conteneurisation avec Docker ?", options: ["Accelerer le reseau", "Garantir un environnement identique entre le developpement et la production", "Remplacer la base de donnees", "Ecrire du code plus rapidement"], correctIndex: 1 },
    { id: "db-11", question: "Qu'est-ce qu'une migration de base de donnees ?", options: ["Deplacer la base de donnees sur un autre serveur", "Un ensemble de changements versionnees appliques au schema de la base", "Sauvegarder les donnees", "Supprimer les anciennes tables"], correctIndex: 1 },
    { id: "db-12", question: "Quel mecanisme protege contre les injections SQL ?", options: ["Le chiffrement des donnees", "Les requetes parametrees (prepared statements)", "Le HTTPS", "Le rate limiting"], correctIndex: 1 },
    { id: "db-13", question: "Qu'est-ce que le CORS (Cross-Origin Resource Sharing) ?", options: ["Un type de base de donnees", "Un mecanisme permettant a un serveur d'autoriser les requetes provenant d'origines differentes", "Un framework backend", "Un protocole de chiffrement"], correctIndex: 1 },
    { id: "db-14", question: "Quel est le role d'une queue de messages comme RabbitMQ ou BullMQ ?", options: ["Stocker des fichiers", "Traiter des taches de maniere asynchrone et decouplee", "Afficher des pages web", "Compiler du code"], correctIndex: 1 },
    { id: "db-15", question: "Qu'est-ce qu'une transaction dans une base de donnees ?", options: ["Un paiement en ligne", "Un ensemble d'operations executees de maniere atomique (tout ou rien)", "Une requete de lecture", "Un type d'index"], correctIndex: 1 },
    { id: "db-16", question: "Quel code HTTP indique une erreur d'autorisation (non authentifie) ?", options: ["403", "401", "500", "302"], correctIndex: 1 },
    { id: "db-17", question: "Qu'est-ce que le caching cote serveur ?", options: ["Effacer les donnees regulierement", "Stocker temporairement des resultats frequemment demandes pour accelerer les reponses", "Compresser les fichiers", "Crypter les donnees"], correctIndex: 1 },
    { id: "db-18", question: "Quel est le principe ACID dans les bases de donnees ?", options: ["Un langage de requete", "Atomicite, Coherence, Isolation, Durabilite — garanties de fiabilite des transactions", "Un type de chiffrement", "Un outil de monitoring"], correctIndex: 1 },
    { id: "db-19", question: "Qu'est-ce qu'un webhook ?", options: ["Un type de base de donnees", "Un callback HTTP automatique declenche par un evenement", "Un protocole de securite", "Un framework frontend"], correctIndex: 1 },
    { id: "db-20", question: "Quelle est la difference entre authentification et autorisation ?", options: ["Aucune difference", "L'authentification verifie l'identite, l'autorisation verifie les permissions", "L'autorisation vient toujours avant l'authentification", "L'authentification est cote client, l'autorisation cote serveur uniquement"], correctIndex: 1 },
  ],

  // =========================================================================
  // 4. PYTHON & DATA SCIENCE (cert-dev-python)
  // =========================================================================
  "cert-dev-python": [
    { id: "py-1", question: "Quel type de donnees Python est immutable et ordonne ?", options: ["list", "dict", "tuple", "set"], correctIndex: 2 },
    { id: "py-2", question: "Quelle librairie Python est la reference pour la manipulation de donnees tabulaires ?", options: ["NumPy", "pandas", "Matplotlib", "SciPy"], correctIndex: 1 },
    { id: "py-3", question: "Que retourne la fonction 'len()' appliquee a une liste Python ?", options: ["Le type de la liste", "Le nombre d'elements dans la liste", "Le dernier element", "La somme des elements"], correctIndex: 1 },
    { id: "py-4", question: "En pandas, quelle methode permet de lire un fichier CSV ?", options: ["pd.open_csv()", "pd.read_csv()", "pd.load_csv()", "pd.import_csv()"], correctIndex: 1 },
    { id: "py-5", question: "Qu'est-ce qu'une list comprehension en Python ?", options: ["Une fonction de tri", "Une syntaxe concise pour creer des listes a partir d'iterations", "Un type de dictionnaire", "Une methode de classe"], correctIndex: 1 },
    { id: "py-6", question: "Quelle librairie est utilisee pour creer des graphiques en Python ?", options: ["pandas", "NumPy", "Matplotlib", "requests"], correctIndex: 2 },
    { id: "py-7", question: "Que fait la methode '.groupby()' dans pandas ?", options: ["Trie un DataFrame", "Regroupe les donnees par une ou plusieurs colonnes pour appliquer des agregations", "Fusionne deux DataFrames", "Supprime les doublons"], correctIndex: 1 },
    { id: "py-8", question: "Qu'est-ce que NumPy en Python ?", options: ["Un framework web", "Une librairie pour le calcul numerique et les tableaux multidimensionnels", "Un outil de visualisation", "Un gestionnaire de paquets"], correctIndex: 1 },
    { id: "py-9", question: "Quelle est la difference entre une liste et un dictionnaire en Python ?", options: ["Aucune difference", "Une liste est ordonnee par index, un dictionnaire utilise des cles", "Un dictionnaire est plus rapide", "Une liste ne peut contenir que des nombres"], correctIndex: 1 },
    { id: "py-10", question: "En Python, que fait le mot-cle 'yield' ?", options: ["Arrete le programme", "Transforme une fonction en generateur, retournant des valeurs une par une", "Importe un module", "Definit une constante"], correctIndex: 1 },
    { id: "py-11", question: "Quelle librairie Python est la reference pour le machine learning ?", options: ["pandas", "scikit-learn", "BeautifulSoup", "Flask"], correctIndex: 1 },
    { id: "py-12", question: "Que fait la methode '.fillna()' dans pandas ?", options: ["Supprime les lignes vides", "Remplace les valeurs manquantes (NaN) par une valeur specifiee", "Compte les valeurs nulles", "Trie par valeurs nulles"], correctIndex: 1 },
    { id: "py-13", question: "Qu'est-ce qu'un environnement virtuel (venv) en Python ?", options: ["Un simulateur", "Un espace isole avec ses propres dependances Python", "Un type de variable", "Un outil de debogage"], correctIndex: 1 },
    { id: "py-14", question: "Quelle fonction pandas permet de fusionner deux DataFrames ?", options: ["pd.concat()", "pd.merge()", "pd.join()", "Les trois sont valides pour differents cas"], correctIndex: 3 },
    { id: "py-15", question: "En Python, que fait le decorateur '@staticmethod' ?", options: ["Rend la methode plus rapide", "Definit une methode qui n'a pas besoin d'acces a l'instance ou a la classe", "Rend la methode privee", "Active la mise en cache"], correctIndex: 1 },
    { id: "py-16", question: "Quel est le role de Jupyter Notebook dans la data science ?", options: ["Compiler du Python", "Permettre l'execution interactive de code avec visualisation des resultats", "Deployer des modeles en production", "Gerer les bases de donnees"], correctIndex: 1 },
    { id: "py-17", question: "Que mesure le R-carre (R2) dans un modele de regression ?", options: ["La vitesse du modele", "La proportion de la variance expliquee par le modele", "Le nombre de variables", "La taille du jeu de donnees"], correctIndex: 1 },
    { id: "py-18", question: "Quelle est la complexite temporelle d'une recherche dans un dictionnaire Python ?", options: ["O(n)", "O(log n)", "O(1) en moyenne", "O(n^2)"], correctIndex: 2 },
    { id: "py-19", question: "Que fait 'pip install' en Python ?", options: ["Compile un programme", "Installe un paquet depuis PyPI (Python Package Index)", "Lance un serveur", "Cree un fichier Python"], correctIndex: 1 },
    { id: "py-20", question: "Quelle methode pandas affiche les premieres lignes d'un DataFrame ?", options: [".first()", ".head()", ".top()", ".preview()"], correctIndex: 1 },
  ],

  // =========================================================================
  // 5. WORDPRESS & CMS (cert-dev-wordpress)
  // =========================================================================
  "cert-dev-wordpress": [
    { id: "wp-1", question: "Quel langage de programmation est principalement utilise par WordPress ?", options: ["Python", "PHP", "Ruby", "Java"], correctIndex: 1 },
    { id: "wp-2", question: "Ou se trouvent les fichiers d'un theme WordPress dans l'arborescence ?", options: ["/wp-admin/themes/", "/wp-content/themes/", "/wp-includes/themes/", "/themes/"], correctIndex: 1 },
    { id: "wp-3", question: "Qu'est-ce qu'un hook dans WordPress ?", options: ["Un plugin de securite", "Un point d'ancrage permettant d'executer du code a un moment specifique", "Un type de base de donnees", "Un outil de design"], correctIndex: 1 },
    { id: "wp-4", question: "Quelle est la difference entre un 'action hook' et un 'filter hook' ?", options: ["Aucune difference", "Une action execute du code, un filtre modifie une donnee et la retourne", "Un filtre est plus rapide", "Une action est reservee aux admins"], correctIndex: 1 },
    { id: "wp-5", question: "Quel fichier definit le template principal d'un theme WordPress ?", options: ["style.css", "index.php", "functions.php", "header.php"], correctIndex: 1 },
    { id: "wp-6", question: "Qu'est-ce que WooCommerce ?", options: ["Un theme WordPress", "Un plugin e-commerce pour WordPress", "Un hebergeur web", "Un framework CSS"], correctIndex: 1 },
    { id: "wp-7", question: "Quel role utilisateur WordPress a les permissions les plus elevees ?", options: ["Editor", "Author", "Administrator", "Subscriber"], correctIndex: 2 },
    { id: "wp-8", question: "Qu'est-ce qu'un CPT (Custom Post Type) dans WordPress ?", options: ["Un type de commentaire", "Un type de contenu personnalise au-dela des articles et pages", "Un type de plugin", "Un outil SEO"], correctIndex: 1 },
    { id: "wp-9", question: "Quel fichier WordPress contient la configuration de la base de donnees ?", options: ["functions.php", "wp-config.php", "settings.php", ".htaccess"], correctIndex: 1 },
    { id: "wp-10", question: "Qu'est-ce que Gutenberg dans WordPress ?", options: ["Un plugin de securite", "L'editeur de contenu par blocs introduit dans WordPress 5.0", "Un theme premium", "Un outil de sauvegarde"], correctIndex: 1 },
    { id: "wp-11", question: "Comment ajoute-t-on correctement un script JavaScript dans un theme WordPress ?", options: ["Avec une balise <script> dans header.php", "Avec wp_enqueue_script() dans functions.php", "En modifiant le fichier .htaccess", "Avec un shortcode"], correctIndex: 1 },
    { id: "wp-12", question: "Qu'est-ce qu'un shortcode WordPress ?", options: ["Un raccourci clavier", "Un code entre crochets qui execute une fonction et affiche du contenu", "Un type de widget", "Un format d'image"], correctIndex: 1 },
    { id: "wp-13", question: "Quel plugin est le plus populaire pour le SEO sur WordPress ?", options: ["Akismet", "Yoast SEO", "Jetpack", "WooCommerce"], correctIndex: 1 },
    { id: "wp-14", question: "Qu'est-ce que l'API REST de WordPress ?", options: ["Un plugin", "Une interface permettant d'acceder aux donnees WordPress via des requetes HTTP", "Un editeur de texte", "Un theme"], correctIndex: 1 },
    { id: "wp-15", question: "Quel est le role du fichier functions.php dans un theme ?", options: ["Afficher le pied de page", "Definir les fonctionnalites du theme (menus, widgets, scripts)", "Configurer la base de donnees", "Gerer les commentaires"], correctIndex: 1 },
    { id: "wp-16", question: "Qu'est-ce qu'un child theme (theme enfant) dans WordPress ?", options: ["Un theme simplifie", "Un theme qui herite d'un theme parent et permet des modifications sans affecter le parent", "Un theme pour les applications mobiles", "Un theme reserve aux debutants"], correctIndex: 1 },
    { id: "wp-17", question: "Quelle table WordPress stocke les articles et pages par defaut ?", options: ["wp_users", "wp_posts", "wp_content", "wp_articles"], correctIndex: 1 },
    { id: "wp-18", question: "Qu'est-ce que le 'Headless WordPress' ?", options: ["WordPress sans theme", "Utiliser WordPress comme backend API et un framework frontend separe", "WordPress sans plugins", "WordPress en mode maintenance"], correctIndex: 1 },
    { id: "wp-19", question: "Quel outil WordPress permet de creer des pages avec du drag-and-drop ?", options: ["Gutenberg (natif) ou Elementor (plugin)", "PhpMyAdmin", "FileZilla", "WP-CLI"], correctIndex: 0 },
    { id: "wp-20", question: "Qu'est-ce que WP-CLI ?", options: ["Un editeur visuel", "Une interface en ligne de commande pour gerer WordPress", "Un plugin de cache", "Un outil de monitoring"], correctIndex: 1 },
  ],

  // =========================================================================
  // 6. CYBERSECURITE (cert-cybersecurite)
  // =========================================================================
  "cert-cybersecurite": [
    { id: "cs-1", question: "Qu'est-ce qu'une attaque par phishing ?", options: ["Une attaque par force brute sur un serveur", "Une technique de tromperie pour obtenir des informations sensibles via de faux messages", "Un virus informatique", "Une attaque DDoS"], correctIndex: 1 },
    { id: "cs-2", question: "Quel protocole assure le chiffrement des communications web ?", options: ["HTTP", "FTP", "TLS/SSL", "SMTP"], correctIndex: 2 },
    { id: "cs-3", question: "Qu'est-ce qu'une attaque par injection SQL ?", options: ["Un virus", "L'insertion de code SQL malveillant dans les requetes pour manipuler la base de donnees", "Une attaque sur le reseau", "Un probleme de performance"], correctIndex: 1 },
    { id: "cs-4", question: "Quel est le principe du 'moindre privilege' en securite ?", options: ["Donner les droits admin a tous", "Accorder uniquement les permissions minimales necessaires a chaque utilisateur", "Utiliser le mot de passe le plus court", "Limiter le nombre d'utilisateurs"], correctIndex: 1 },
    { id: "cs-5", question: "Qu'est-ce qu'un pare-feu (firewall) ?", options: ["Un antivirus", "Un systeme qui filtre le trafic reseau entrant et sortant selon des regles", "Un outil de chiffrement", "Un type de VPN"], correctIndex: 1 },
    { id: "cs-6", question: "Que signifie 'XSS' dans le contexte de la securite web ?", options: ["Extra Secure System", "Cross-Site Scripting — injection de scripts malveillants dans des pages web", "XML Security Standard", "Cross-Server Synchronization"], correctIndex: 1 },
    { id: "cs-7", question: "Qu'est-ce que le chiffrement asymetrique ?", options: ["Un chiffrement avec une seule cle", "Un systeme utilisant une paire de cles (publique et privee)", "Un chiffrement sans cle", "Un type de compression"], correctIndex: 1 },
    { id: "cs-8", question: "Qu'est-ce qu'une attaque DDoS ?", options: ["Un vol de donnees", "Une attaque qui submerge un serveur avec un volume massif de requetes", "Un type de malware", "Une injection SQL"], correctIndex: 1 },
    { id: "cs-9", question: "Quel est le role d'un certificat SSL/TLS ?", options: ["Accelerer le site web", "Authentifier le serveur et chiffrer la communication entre le client et le serveur", "Stocker les mots de passe", "Compresser les images"], correctIndex: 1 },
    { id: "cs-10", question: "Qu'est-ce que le hachage (hashing) d'un mot de passe ?", options: ["Chiffrer le mot de passe de maniere reversible", "Transformer le mot de passe en une empreinte fixe irreversible", "Compresser le mot de passe", "Stocker le mot de passe en clair"], correctIndex: 1 },
    { id: "cs-11", question: "Quel algorithme de hachage est recommande pour stocker des mots de passe ?", options: ["MD5", "SHA-1", "bcrypt", "Base64"], correctIndex: 2 },
    { id: "cs-12", question: "Qu'est-ce que l'authentification a deux facteurs (2FA) ?", options: ["Utiliser deux mots de passe", "Combiner deux methodes d'authentification differentes (ex: mot de passe + code SMS)", "Se connecter sur deux appareils", "Chiffrer deux fois les donnees"], correctIndex: 1 },
    { id: "cs-13", question: "Qu'est-ce qu'un ransomware ?", options: ["Un antivirus", "Un malware qui chiffre les fichiers et demande une rancon pour les deverrouiller", "Un outil de test de penetration", "Un firewall"], correctIndex: 1 },
    { id: "cs-14", question: "Que signifie OWASP ?", options: ["Open Web Application Security Project — organisation de reference pour la securite web", "Online Web Authentication Secure Protocol", "Open Wireless Access Security Platform", "Operational Web Attack Simulation Program"], correctIndex: 0 },
    { id: "cs-15", question: "Qu'est-ce qu'un VPN (Virtual Private Network) ?", options: ["Un type de pare-feu", "Un reseau prive virtuel qui chiffre le trafic et masque l'adresse IP", "Un antivirus en ligne", "Un type de certificat SSL"], correctIndex: 1 },
    { id: "cs-16", question: "Qu'est-ce que le 'social engineering' en cybersecurite ?", options: ["Un outil technique", "La manipulation psychologique de personnes pour obtenir des informations confidentielles", "Un type de chiffrement", "Un protocole reseau"], correctIndex: 1 },
    { id: "cs-17", question: "Quel est le role d'un test de penetration (pentest) ?", options: ["Verifier la vitesse du reseau", "Simuler une attaque pour identifier les vulnerabilites d'un systeme", "Installer des mises a jour", "Sauvegarder les donnees"], correctIndex: 1 },
    { id: "cs-18", question: "Qu'est-ce que le CSRF (Cross-Site Request Forgery) ?", options: ["Un type de virus", "Une attaque qui force un utilisateur authentifie a executer une action non desiree", "Un protocole de chiffrement", "Un outil de monitoring"], correctIndex: 1 },
    { id: "cs-19", question: "Que signifie le principe de 'defense en profondeur' ?", options: ["Utiliser un seul pare-feu tres puissant", "Mettre en place plusieurs couches de securite independantes", "Chiffrer toutes les donnees deux fois", "Limiter l'acces a Internet"], correctIndex: 1 },
    { id: "cs-20", question: "Qu'est-ce qu'un SIEM (Security Information and Event Management) ?", options: ["Un antivirus", "Un systeme qui collecte et analyse les evenements de securite en temps reel", "Un type de pare-feu", "Un outil de chiffrement"], correctIndex: 1 },
  ],

  // =========================================================================
  // 7. DEVOPS & CLOUD (cert-devops)
  // =========================================================================
  "cert-devops": [
    { id: "do-1", question: "Qu'est-ce que le DevOps ?", options: ["Un langage de programmation", "Une culture et ensemble de pratiques unissant le developpement et les operations", "Un outil de monitoring", "Un type de serveur"], correctIndex: 1 },
    { id: "do-2", question: "Qu'est-ce que le CI/CD ?", options: ["Un type de serveur", "Integration Continue / Deploiement Continu — automatisation du build, test et deploiement", "Un langage de script", "Un outil de design"], correctIndex: 1 },
    { id: "do-3", question: "Quel est le role de Docker dans le DevOps ?", options: ["Gerer le code source", "Conteneuriser les applications pour les rendre portables et reproductibles", "Ecrire des tests", "Gerer les DNS"], correctIndex: 1 },
    { id: "do-4", question: "Qu'est-ce que Kubernetes ?", options: ["Un langage de programmation", "Un systeme d'orchestration de conteneurs pour le deploiement a grande echelle", "Un outil de monitoring", "Un service de messagerie"], correctIndex: 1 },
    { id: "do-5", question: "Quelle est la difference entre IaaS, PaaS et SaaS ?", options: ["Aucune difference", "IaaS fournit l'infrastructure, PaaS la plateforme, SaaS le logiciel complet", "Ce sont trois langages differents", "IaaS est gratuit, PaaS et SaaS sont payants"], correctIndex: 1 },
    { id: "do-6", question: "Qu'est-ce qu'un Dockerfile ?", options: ["Un fichier de configuration reseau", "Un fichier texte contenant les instructions pour construire une image Docker", "Un fichier de log", "Un type de certificat SSL"], correctIndex: 1 },
    { id: "do-7", question: "Quel outil est couramment utilise pour l'Infrastructure as Code (IaC) ?", options: ["Photoshop", "Terraform", "Excel", "Postman"], correctIndex: 1 },
    { id: "do-8", question: "Qu'est-ce que GitHub Actions ?", options: ["Un reseau social", "Un service d'automatisation CI/CD integre a GitHub", "Un editeur de code", "Un outil de design"], correctIndex: 1 },
    { id: "do-9", question: "Quel service AWS est utilise pour le stockage d'objets (fichiers) ?", options: ["EC2", "S3", "RDS", "Lambda"], correctIndex: 1 },
    { id: "do-10", question: "Qu'est-ce que le 'blue-green deployment' ?", options: ["Un type de test", "Une strategie de deploiement avec deux environnements identiques pour minimiser les interruptions", "Un outil de monitoring", "Un type de conteneur"], correctIndex: 1 },
    { id: "do-11", question: "Quel outil est utilise pour la gestion de configuration ?", options: ["Docker", "Ansible", "Git", "npm"], correctIndex: 1 },
    { id: "do-12", question: "Qu'est-ce que le monitoring applicatif ?", options: ["Ecrire du code", "Surveiller en continu les performances, la disponibilite et les erreurs d'une application", "Deployer une application", "Sauvegarder les donnees"], correctIndex: 1 },
    { id: "do-13", question: "Qu'est-ce qu'un reverse proxy ?", options: ["Un serveur de base de donnees", "Un serveur intermediaire qui distribue les requetes vers les serveurs backend", "Un outil de chiffrement", "Un type de firewall"], correctIndex: 1 },
    { id: "do-14", question: "Quel est le role de nginx dans une architecture DevOps ?", options: ["Compiler le code", "Serveur web, reverse proxy et load balancer", "Gerer les conteneurs", "Ecrire des tests"], correctIndex: 1 },
    { id: "do-15", question: "Qu'est-ce que le 'scaling horizontal' ?", options: ["Augmenter les ressources d'un seul serveur", "Ajouter plus de serveurs pour repartir la charge", "Reduire la taille du code", "Compresser les images"], correctIndex: 1 },
    { id: "do-16", question: "Quel outil est utilise pour centraliser les logs ?", options: ["Docker", "ELK Stack (Elasticsearch, Logstash, Kibana)", "GitHub", "Stripe"], correctIndex: 1 },
    { id: "do-17", question: "Qu'est-ce qu'un pipeline CI/CD ?", options: ["Un cable reseau", "Une suite d'etapes automatisees (build, test, deploy) declenchee par un changement de code", "Un type de base de donnees", "Un outil de design"], correctIndex: 1 },
    { id: "do-18", question: "Quelle est la difference entre un conteneur et une machine virtuelle ?", options: ["Aucune difference", "Un conteneur partage le noyau OS et est plus leger, une VM virtualise tout le systeme", "Une VM est plus rapide", "Un conteneur necessite plus de ressources"], correctIndex: 1 },
    { id: "do-19", question: "Qu'est-ce que AWS Lambda ?", options: ["Un serveur dedie", "Un service de calcul serverless executant du code en reponse a des evenements", "Un outil de stockage", "Un service de messagerie"], correctIndex: 1 },
    { id: "do-20", question: "Qu'est-ce que le 'canary deployment' ?", options: ["Un deploiement complet", "Un deploiement progressif vers un petit pourcentage d'utilisateurs avant la generalisation", "Un deploiement de nuit", "Un rollback automatique"], correctIndex: 1 },
  ],

  // =========================================================================
  // 8. INTELLIGENCE ARTIFICIELLE & ML (cert-ia-ml)
  // =========================================================================
  "cert-ia-ml": [
    { id: "ia-1", question: "Quelle est la difference entre l'apprentissage supervise et non supervise ?", options: ["Aucune difference", "Le supervise utilise des donnees etiquetees, le non supervise decouvre des patterns sans etiquettes", "Le non supervise est plus precis", "Le supervise ne fonctionne qu'avec des images"], correctIndex: 1 },
    { id: "ia-2", question: "Qu'est-ce qu'un reseau de neurones artificiel ?", options: ["Un reseau informatique", "Un modele inspire du cerveau humain compose de couches de neurones interconnectes", "Un algorithme de tri", "Un type de base de donnees"], correctIndex: 1 },
    { id: "ia-3", question: "Que signifie 'overfitting' dans un modele de machine learning ?", options: ["Le modele est trop simple", "Le modele apprend trop bien les donnees d'entrainement et generalise mal", "Le modele est trop rapide", "Le modele manque de donnees"], correctIndex: 1 },
    { id: "ia-4", question: "Qu'est-ce que la descente de gradient ?", options: ["Un type de graphique", "Un algorithme d'optimisation qui minimise la fonction de cout en ajustant les parametres", "Un outil de visualisation", "Un type de reseau"], correctIndex: 1 },
    { id: "ia-5", question: "Quel framework est le plus utilise pour le deep learning ?", options: ["pandas", "TensorFlow / PyTorch", "scikit-learn", "jQuery"], correctIndex: 1 },
    { id: "ia-6", question: "Qu'est-ce que le NLP (Natural Language Processing) ?", options: ["Un langage de programmation", "Le traitement automatique du langage naturel par les machines", "Un protocole reseau", "Un outil de design"], correctIndex: 1 },
    { id: "ia-7", question: "Qu'est-ce qu'un CNN (Convolutional Neural Network) ?", options: ["Un reseau social", "Un type de reseau de neurones specialise dans le traitement d'images", "Un protocole de communication", "Un outil de compression"], correctIndex: 1 },
    { id: "ia-8", question: "Que mesure la metrique 'precision' dans un modele de classification ?", options: ["La vitesse du modele", "Le ratio de vrais positifs parmi toutes les predictions positives", "La taille du modele", "Le nombre de parametres"], correctIndex: 1 },
    { id: "ia-9", question: "Qu'est-ce que le 'transfer learning' ?", options: ["Copier un modele", "Reutiliser un modele pre-entraine sur de nouvelles donnees pour accelerer l'apprentissage", "Envoyer des donnees", "Fusionner deux modeles"], correctIndex: 1 },
    { id: "ia-10", question: "Qu'est-ce qu'un transformer en deep learning ?", options: ["Un composant electrique", "Une architecture basee sur l'attention, utilisee dans GPT et BERT", "Un type de CNN", "Un outil de preprocessing"], correctIndex: 1 },
    { id: "ia-11", question: "Qu'est-ce que le 'reinforcement learning' ?", options: ["Un type de regression", "Un apprentissage ou un agent apprend par essais et erreurs via des recompenses", "Un algorithme de clustering", "Une technique de validation"], correctIndex: 1 },
    { id: "ia-12", question: "Qu'est-ce que la validation croisee (cross-validation) ?", options: ["Verifier manuellement les resultats", "Une technique qui divise les donnees en k plis pour evaluer la robustesse du modele", "Comparer deux modeles visuellement", "Une methode de chiffrement"], correctIndex: 1 },
    { id: "ia-13", question: "Qu'est-ce qu'un GAN (Generative Adversarial Network) ?", options: ["Un antivirus", "Deux reseaux (generateur et discriminateur) qui s'entrainent mutuellement pour generer des contenus", "Un type de CNN", "Un outil de stockage"], correctIndex: 1 },
    { id: "ia-14", question: "Quel est le role de la fonction d'activation dans un neurone artificiel ?", options: ["Stocker les donnees", "Introduire de la non-linearite dans le modele pour capturer des patterns complexes", "Accelerer le calcul", "Compresser les donnees"], correctIndex: 1 },
    { id: "ia-15", question: "Qu'est-ce que le 'feature engineering' ?", options: ["Construire des serveurs", "Le processus de creation et selection de variables pertinentes pour le modele", "Installer des logiciels", "Debugger du code"], correctIndex: 1 },
    { id: "ia-16", question: "Que signifie 'epoch' dans l'entrainement d'un modele ?", options: ["Un type de donnees", "Un passage complet sur l'ensemble des donnees d'entrainement", "Une mesure de precision", "Un type de couche"], correctIndex: 1 },
    { id: "ia-17", question: "Qu'est-ce que le 'batch size' dans l'entrainement ?", options: ["La taille du modele", "Le nombre d'exemples traites avant de mettre a jour les poids", "La taille du fichier", "Le nombre de couches"], correctIndex: 1 },
    { id: "ia-18", question: "Quel est le probleme du 'vanishing gradient' ?", options: ["Le modele est trop rapide", "Les gradients deviennent trop petits pour mettre a jour les poids dans les couches profondes", "Le modele consomme trop de memoire", "Les donnees sont trop volumineuses"], correctIndex: 1 },
    { id: "ia-19", question: "Qu'est-ce qu'un embedding dans le contexte du NLP ?", options: ["Un type de fichier", "Une representation vectorielle dense d'un mot ou texte dans un espace continu", "Un outil de traduction", "Un type de base de donnees"], correctIndex: 1 },
    { id: "ia-20", question: "Quelle est la difference entre classification et regression ?", options: ["Aucune", "La classification predit des categories, la regression predit des valeurs continues", "La regression est plus simple", "La classification utilise plus de donnees"], correctIndex: 1 },
  ],

  // =========================================================================
  // 9. BLOCKCHAIN & WEB3 (cert-blockchain)
  // =========================================================================
  "cert-blockchain": [
    { id: "bc-1", question: "Qu'est-ce qu'une blockchain ?", options: ["Un type de base de donnees SQL", "Un registre distribue et immuable de transactions organisees en blocs chaines", "Un langage de programmation", "Un outil de chiffrement"], correctIndex: 1 },
    { id: "bc-2", question: "Qu'est-ce qu'un smart contract ?", options: ["Un contrat papier numerise", "Un programme autonome execute sur la blockchain quand des conditions sont remplies", "Un email automatique", "Un type de cryptomonnaie"], correctIndex: 1 },
    { id: "bc-3", question: "Quel est le mecanisme de consensus utilise par Bitcoin ?", options: ["Proof of Stake", "Proof of Work", "Delegated Proof of Stake", "Proof of Authority"], correctIndex: 1 },
    { id: "bc-4", question: "Qu'est-ce qu'Ethereum ?", options: ["Une cryptomonnaie uniquement", "Une plateforme blockchain programmable supportant les smart contracts", "Un exchange de crypto", "Un wallet"], correctIndex: 1 },
    { id: "bc-5", question: "Quel langage est utilise pour ecrire des smart contracts sur Ethereum ?", options: ["Python", "Solidity", "JavaScript", "Rust"], correctIndex: 1 },
    { id: "bc-6", question: "Qu'est-ce qu'un NFT (Non-Fungible Token) ?", options: ["Une cryptomonnaie classique", "Un jeton unique et non interchangeable representant un actif numerique", "Un type de wallet", "Un protocole reseau"], correctIndex: 1 },
    { id: "bc-7", question: "Qu'est-ce que la DeFi (Finance Decentralisee) ?", options: ["Un type de banque", "Des services financiers construits sur blockchain sans intermediaires traditionnels", "Un exchange centralise", "Un type de NFT"], correctIndex: 1 },
    { id: "bc-8", question: "Qu'est-ce qu'un wallet (portefeuille) crypto ?", options: ["Un compte bancaire", "Un logiciel ou materiel stockant les cles privees pour gerer des actifs crypto", "Un site web", "Un type de blockchain"], correctIndex: 1 },
    { id: "bc-9", question: "Que signifie 'gas' dans le contexte Ethereum ?", options: ["Un type de token", "L'unite mesurant le cout computationnel d'une transaction ou smart contract", "Un outil de developpement", "Un type de wallet"], correctIndex: 1 },
    { id: "bc-10", question: "Qu'est-ce qu'un DAO (Decentralized Autonomous Organization) ?", options: ["Un type de cryptomonnaie", "Une organisation geree par des smart contracts et gouvernee par ses membres via des votes", "Un exchange", "Un type de NFT"], correctIndex: 1 },
    { id: "bc-11", question: "Quelle est la difference entre Proof of Work et Proof of Stake ?", options: ["Aucune difference", "PoW utilise la puissance de calcul, PoS utilise la detention de tokens pour valider", "PoS est plus lent", "PoW est plus ecologique"], correctIndex: 1 },
    { id: "bc-12", question: "Qu'est-ce qu'un token ERC-20 ?", options: ["Un NFT", "Un standard de token fongible sur Ethereum", "Un type de blockchain", "Un wallet"], correctIndex: 1 },
    { id: "bc-13", question: "Qu'est-ce que le Web3 ?", options: ["La version 3 de HTML", "La vision d'un internet decentralise base sur la blockchain", "Un navigateur web", "Un type de serveur"], correctIndex: 1 },
    { id: "bc-14", question: "Qu'est-ce qu'un Layer 2 (couche 2) ?", options: ["Un type de token", "Une solution construite au-dessus d'une blockchain pour ameliorer la scalabilite", "Un second wallet", "Un type de mining"], correctIndex: 1 },
    { id: "bc-15", question: "Qu'est-ce que MetaMask ?", options: ["Un exchange", "Un wallet navigateur pour interagir avec la blockchain Ethereum", "Un type de token", "Un outil de mining"], correctIndex: 1 },
    { id: "bc-16", question: "Que signifie 'immutable' dans le contexte blockchain ?", options: ["Modifiable facilement", "Les donnees une fois enregistrees ne peuvent pas etre modifiees ou supprimees", "Temporaire", "Chiffre"], correctIndex: 1 },
    { id: "bc-17", question: "Qu'est-ce qu'un oracle blockchain ?", options: ["Une base de donnees", "Un service qui fournit des donnees du monde reel aux smart contracts", "Un type de consensus", "Un wallet"], correctIndex: 1 },
    { id: "bc-18", question: "Qu'est-ce que le 'staking' en crypto ?", options: ["Vendre des tokens", "Verrouiller des tokens pour participer a la validation et gagner des recompenses", "Miner des bitcoins", "Acheter des NFT"], correctIndex: 1 },
    { id: "bc-19", question: "Qu'est-ce qu'un DEX (Decentralized Exchange) ?", options: ["Un exchange centralise", "Une plateforme d'echange de cryptomonnaies operant sans intermediaire central", "Un type de wallet", "Un outil de mining"], correctIndex: 1 },
    { id: "bc-20", question: "Qu'est-ce que IPFS dans le contexte Web3 ?", options: ["Un protocole de paiement", "Un systeme de fichiers decentralise pour stocker et partager des donnees", "Un type de token", "Un outil de chiffrement"], correctIndex: 1 },
  ],

  // =========================================================================
  // 10. TESTS & ASSURANCE QUALITE (cert-qa-testing)
  // =========================================================================
  "cert-qa-testing": [
    { id: "qa-1", question: "Quelle est la difference entre un test unitaire et un test d'integration ?", options: ["Aucune difference", "Un test unitaire teste un composant isole, un test d'integration teste l'interaction entre composants", "Un test d'integration est plus rapide", "Un test unitaire est fait manuellement"], correctIndex: 1 },
    { id: "qa-2", question: "Qu'est-ce que le TDD (Test-Driven Development) ?", options: ["Tester apres le developpement", "Ecrire les tests avant le code, puis implementer le code pour les faire passer", "Un outil de test", "Un type de framework"], correctIndex: 1 },
    { id: "qa-3", question: "Quel outil est couramment utilise pour les tests unitaires en JavaScript ?", options: ["Selenium", "Jest", "Postman", "Cypress"], correctIndex: 1 },
    { id: "qa-4", question: "Qu'est-ce qu'un test de regression ?", options: ["Un test de performance", "Un test qui verifie que les modifications recentes n'ont pas casse les fonctionnalites existantes", "Un test de securite", "Un test d'interface"], correctIndex: 1 },
    { id: "qa-5", question: "Qu'est-ce que Selenium ?", options: ["Un framework backend", "Un outil d'automatisation de tests pour les navigateurs web", "Un outil de monitoring", "Un langage de programmation"], correctIndex: 1 },
    { id: "qa-6", question: "Qu'est-ce que le 'boundary testing' (test aux limites) ?", options: ["Tester la securite", "Tester les valeurs aux frontieres des plages acceptees (minimum, maximum, hors limites)", "Tester la performance", "Tester l'interface utilisateur"], correctIndex: 1 },
    { id: "qa-7", question: "Qu'est-ce qu'un mock dans le contexte des tests ?", options: ["Un faux serveur", "Un objet simulant le comportement d'une dependance reelle pour isoler le test", "Un type de bug", "Un rapport de test"], correctIndex: 1 },
    { id: "qa-8", question: "Qu'est-ce que le test E2E (End-to-End) ?", options: ["Un test unitaire avance", "Un test qui verifie le parcours complet d'un utilisateur du debut a la fin", "Un test de base de donnees", "Un test de securite"], correctIndex: 1 },
    { id: "qa-9", question: "Qu'est-ce que la couverture de code (code coverage) ?", options: ["Le nombre de fichiers", "Le pourcentage de code source execute par les tests", "La taille du projet", "Le nombre de bugs trouves"], correctIndex: 1 },
    { id: "qa-10", question: "Qu'est-ce que Cypress ?", options: ["Un langage de programmation", "Un outil de test E2E moderne pour les applications web", "Un outil de deploiement", "Un framework CSS"], correctIndex: 1 },
    { id: "qa-11", question: "Qu'est-ce que le 'smoke testing' ?", options: ["Tester sous contrainte", "Un test rapide des fonctionnalites principales pour verifier que le systeme fonctionne basiquement", "Un test de securite", "Un test de charge"], correctIndex: 1 },
    { id: "qa-12", question: "Quel est le role d'un QA engineer ?", options: ["Ecrire du code uniquement", "Assurer la qualite logicielle via la planification, l'execution et l'automatisation des tests", "Gerer les serveurs", "Designer l'interface"], correctIndex: 1 },
    { id: "qa-13", question: "Qu'est-ce que le test de charge (load testing) ?", options: ["Tester les fonctionnalites", "Evaluer les performances du systeme sous un volume eleve de requetes simultanees", "Tester la securite", "Tester l'interface"], correctIndex: 1 },
    { id: "qa-14", question: "Qu'est-ce qu'un test flaky (instable) ?", options: ["Un test bien ecrit", "Un test qui echoue ou reussit de maniere non deterministe sans changement de code", "Un test de securite", "Un test de performance"], correctIndex: 1 },
    { id: "qa-15", question: "Qu'est-ce que le BDD (Behavior-Driven Development) ?", options: ["Un outil de test", "Une approche ou les tests sont ecrits en langage naturel decrivant le comportement attendu", "Un type de base de donnees", "Un framework frontend"], correctIndex: 1 },
    { id: "qa-16", question: "Quel outil est utilise pour les tests de performance web ?", options: ["Jest", "JMeter ou k6", "Prettier", "ESLint"], correctIndex: 1 },
    { id: "qa-17", question: "Qu'est-ce que le 'test pyramid' (pyramide des tests) ?", options: ["Un outil de test", "Un modele recommandant beaucoup de tests unitaires, moins d'integration, encore moins de E2E", "Un type de rapport", "Un framework de test"], correctIndex: 1 },
    { id: "qa-18", question: "Qu'est-ce qu'un bug de severite critique ?", options: ["Un bug visuel mineur", "Un bug qui empeche l'utilisation du systeme ou cause une perte de donnees", "Un bug de performance", "Un bug de traduction"], correctIndex: 1 },
    { id: "qa-19", question: "Qu'est-ce que le 'shift left testing' ?", options: ["Tester en fin de projet", "Integrer les tests le plus tot possible dans le cycle de developpement", "Tester uniquement l'interface", "Automatiser tous les tests"], correctIndex: 1 },
    { id: "qa-20", question: "Qu'est-ce qu'un test A/B ?", options: ["Un test unitaire", "Un test comparant deux versions d'un element pour mesurer laquelle performe mieux", "Un test de securite", "Un test de regression"], correctIndex: 1 },
  ],

  // =========================================================================
  // 11. DESIGN UI/UX (cert-design-ui)
  // =========================================================================
  "cert-design-ui": [
    { id: "ui-1", question: "Quelle est la difference entre UI et UX design ?", options: ["Aucune difference", "UI concerne l'apparence visuelle, UX concerne l'experience globale de l'utilisateur", "UI est plus important", "UX ne concerne que le mobile"], correctIndex: 1 },
    { id: "ui-2", question: "Qu'est-ce qu'un wireframe ?", options: ["Un prototype haute fidelite", "Une representation simplifiee de la structure d'une page sans design visuel", "Un fichier de code", "Un type de police"], correctIndex: 1 },
    { id: "ui-3", question: "Quel outil est couramment utilise pour le prototypage UI/UX ?", options: ["Visual Studio Code", "Figma", "Excel", "Photoshop"], correctIndex: 1 },
    { id: "ui-4", question: "Qu'est-ce que la hierarchie visuelle en design ?", options: ["L'organisation des fichiers", "L'arrangement des elements pour guider l'oeil de l'utilisateur vers les informations les plus importantes", "La taille du texte uniquement", "L'ordre alphabetique"], correctIndex: 1 },
    { id: "ui-5", question: "Qu'est-ce que la loi de Fitts en UX ?", options: ["Une loi sur les couleurs", "Le temps pour atteindre une cible depend de sa taille et de sa distance", "Une loi sur la typographie", "Une regle de mise en page"], correctIndex: 1 },
    { id: "ui-6", question: "Qu'est-ce qu'un design system ?", options: ["Un logiciel de design", "Un ensemble de composants, regles et principes reutilisables pour assurer la coherence", "Un type de wireframe", "Un outil de prototypage"], correctIndex: 1 },
    { id: "ui-7", question: "Qu'est-ce que le 'responsive design' ?", options: ["Un design anime", "Une approche de design qui adapte l'interface a differentes tailles d'ecran", "Un design en 3D", "Un design sans images"], correctIndex: 1 },
    { id: "ui-8", question: "Qu'est-ce qu'un persona en UX design ?", options: ["Un vrai utilisateur", "Un profil fictif representant un segment d'utilisateurs cibles", "Un type de wireframe", "Un outil de test"], correctIndex: 1 },
    { id: "ui-9", question: "Qu'est-ce que le 'user journey mapping' ?", options: ["Un GPS", "La cartographie du parcours complet d'un utilisateur avec ses actions, emotions et points de friction", "Un type de test", "Un outil de design"], correctIndex: 1 },
    { id: "ui-10", question: "Quel est le principe de la 'loi de Hick' en UX ?", options: ["Plus il y a de couleurs, mieux c'est", "Le temps de decision augmente avec le nombre de choix", "Les gros boutons sont toujours meilleurs", "La navigation doit etre horizontale"], correctIndex: 1 },
    { id: "ui-11", question: "Qu'est-ce que l'accessibilite web (a11y) ?", options: ["Un type de design", "Concevoir des interfaces utilisables par tous, y compris les personnes en situation de handicap", "Un outil de test", "Un format de fichier"], correctIndex: 1 },
    { id: "ui-12", question: "Quel est le ratio de contraste minimum recommande par les WCAG pour le texte normal ?", options: ["2:1", "3:1", "4.5:1", "7:1"], correctIndex: 2 },
    { id: "ui-13", question: "Qu'est-ce qu'un 'call-to-action' (CTA) ?", options: ["Un type de page", "Un element visuel incitant l'utilisateur a effectuer une action specifique", "Un outil de test", "Un type de menu"], correctIndex: 1 },
    { id: "ui-14", question: "Qu'est-ce que le 'design thinking' ?", options: ["Penser au design", "Une methodologie centree utilisateur : empathie, definition, ideation, prototype, test", "Un outil de wireframing", "Un type de test utilisateur"], correctIndex: 1 },
    { id: "ui-15", question: "Qu'est-ce qu'un test d'utilisabilite ?", options: ["Un test de performance", "Observer de vrais utilisateurs interagir avec le produit pour identifier les problemes", "Un test automatise", "Un test de securite"], correctIndex: 1 },
    { id: "ui-16", question: "Qu'est-ce que le 'white space' (espace blanc) en design ?", options: ["Un bug d'affichage", "L'espace vide entre les elements qui ameliore la lisibilite et la respiration visuelle", "Un fond blanc obligatoire", "Un type d'erreur"], correctIndex: 1 },
    { id: "ui-17", question: "Qu'est-ce que le 'mobile-first design' ?", options: ["Designer uniquement pour mobile", "Concevoir d'abord pour mobile puis adapter progressivement aux ecrans plus grands", "Ignorer les desktops", "Un type de responsive design"], correctIndex: 1 },
    { id: "ui-18", question: "Qu'est-ce qu'un 'affordance' en UX ?", options: ["Un type de bouton", "Un indice visuel qui suggere comment un element peut etre utilise", "Un outil de design", "Un type de transition"], correctIndex: 1 },
    { id: "ui-19", question: "Quel format de fichier est vectoriel et adapte aux icones et logos ?", options: ["PNG", "JPEG", "SVG", "GIF"], correctIndex: 2 },
    { id: "ui-20", question: "Qu'est-ce que le 'micro-interaction' en UX design ?", options: ["Un bug visuel", "Une petite animation ou retour visuel en reponse a une action utilisateur", "Un type de test", "Un outil de prototypage"], correctIndex: 1 },
  ],

  // =========================================================================
  // 12. DESIGN GRAPHIQUE (cert-design-graphique)
  // =========================================================================
  "cert-design-graphique": [
    { id: "dg-1", question: "Quelle est la difference entre les modes coloriometriques RVB et CMJN ?", options: ["Aucune difference", "RVB est pour les ecrans (lumiere), CMJN est pour l'impression (encre)", "RVB est pour l'impression", "CMJN produit plus de couleurs"], correctIndex: 1 },
    { id: "dg-2", question: "Qu'est-ce que la resolution d'une image en DPI ?", options: ["La taille du fichier", "Le nombre de points par pouce, determinant la nettete a l'impression", "Le nombre de couleurs", "La vitesse de chargement"], correctIndex: 1 },
    { id: "dg-3", question: "Quelle est la resolution minimale recommandee pour l'impression ?", options: ["72 DPI", "150 DPI", "300 DPI", "600 DPI"], correctIndex: 2 },
    { id: "dg-4", question: "Qu'est-ce que la typographie en design graphique ?", options: ["Un outil logiciel", "L'art de choisir et agencer les polices de caracteres pour la communication visuelle", "Un type d'image", "Un format de fichier"], correctIndex: 1 },
    { id: "dg-5", question: "Quelle est la difference entre une police serif et sans-serif ?", options: ["Aucune difference", "Serif a de petites extensions aux extremites des lettres, sans-serif n'en a pas", "Sans-serif est toujours en gras", "Serif est uniquement pour le web"], correctIndex: 1 },
    { id: "dg-6", question: "Qu'est-ce que le 'kerning' en typographie ?", options: ["La taille de la police", "L'ajustement de l'espace entre deux caracteres specifiques", "La couleur du texte", "L'epaisseur du trait"], correctIndex: 1 },
    { id: "dg-7", question: "Quel logiciel est la reference pour le design vectoriel ?", options: ["Photoshop", "Adobe Illustrator", "Premiere Pro", "After Effects"], correctIndex: 1 },
    { id: "dg-8", question: "Qu'est-ce que la regle des tiers en composition ?", options: ["Utiliser trois couleurs", "Diviser l'image en 9 zones egales et placer les elements cles sur les intersections", "Avoir trois elements maximum", "Utiliser trois polices"], correctIndex: 1 },
    { id: "dg-9", question: "Quelle est la difference entre une image raster (bitmap) et vectorielle ?", options: ["Aucune", "Le raster est compose de pixels (perd en qualite au zoom), le vectoriel de formules mathematiques (scalable)", "Le vectoriel est toujours en couleur", "Le raster est plus leger"], correctIndex: 1 },
    { id: "dg-10", question: "Qu'est-ce que le 'leading' (interlignage) en typographie ?", options: ["La taille de la police", "L'espace vertical entre les lignes de texte", "L'espace entre les mots", "La couleur du texte"], correctIndex: 1 },
    { id: "dg-11", question: "Qu'est-ce que la theorie des couleurs complementaires ?", options: ["Des couleurs identiques", "Des couleurs opposees sur le cercle chromatique qui creent un contraste maximal", "Des couleurs adjacentes", "Des couleurs chaudes"], correctIndex: 1 },
    { id: "dg-12", question: "Quel format d'image supporte la transparence et est adapte au web ?", options: ["JPEG", "BMP", "PNG", "TIFF"], correctIndex: 2 },
    { id: "dg-13", question: "Qu'est-ce que le 'bleed' (fond perdu) en impression ?", options: ["Un type de couleur", "La zone supplementaire autour du design qui sera coupee apres impression", "Un effet special", "Un type de papier"], correctIndex: 1 },
    { id: "dg-14", question: "Qu'est-ce que la hierarchie typographique ?", options: ["L'ordre alphabetique", "L'utilisation de tailles, graisses et styles de police pour organiser l'importance du contenu", "Le nombre de polices utilisees", "La couleur du texte"], correctIndex: 1 },
    { id: "dg-15", question: "Qu'est-ce que le 'golden ratio' (nombre d'or) en design ?", options: ["Un type de couleur", "Un ratio de proportion (~1.618) utilise pour creer des compositions harmonieuses", "Un format de papier", "Un type de police"], correctIndex: 1 },
    { id: "dg-16", question: "Quel espace colorimetrique est le plus large ?", options: ["sRGB", "Adobe RGB", "CMJN", "Niveaux de gris"], correctIndex: 1 },
    { id: "dg-17", question: "Qu'est-ce que la saturation d'une couleur ?", options: ["Sa luminosite", "L'intensite ou la purete de la couleur", "Sa teinte", "Son opacite"], correctIndex: 1 },
    { id: "dg-18", question: "Quel est le role d'une grille (grid) en design graphique ?", options: ["Dessiner des bordures", "Organiser et aligner les elements pour une mise en page coherente et equilibree", "Ajouter des couleurs", "Creer des animations"], correctIndex: 1 },
    { id: "dg-19", question: "Qu'est-ce qu'un mockup en design graphique ?", options: ["Un wireframe", "Une mise en situation realiste du design dans un contexte d'utilisation", "Un fichier source", "Un type de police"], correctIndex: 1 },
    { id: "dg-20", question: "Qu'est-ce que le 'negative space' (espace negatif) en design ?", options: ["Un espace vide inutile", "L'espace autour et entre les sujets qui peut aussi former des formes significatives", "Un fond noir", "Une erreur de mise en page"], correctIndex: 1 },
  ],

  // =========================================================================
  // 13. DESIGN 3D & ANIMATION (cert-design-3d)
  // =========================================================================
  "cert-design-3d": [
    { id: "d3-1", question: "Qu'est-ce que la modelisation polygonale en 3D ?", options: ["Dessiner en 2D", "Creer des formes 3D a partir de vertices, edges et faces (polygones)", "Filmer en 3D", "Un type de rendu"], correctIndex: 1 },
    { id: "d3-2", question: "Quel logiciel 3D gratuit et open-source est le plus populaire ?", options: ["Maya", "Blender", "3ds Max", "Cinema 4D"], correctIndex: 1 },
    { id: "d3-3", question: "Qu'est-ce que le 'rigging' en animation 3D ?", options: ["Le texturage", "La creation d'un squelette articule pour animer un modele 3D", "Le rendu final", "L'eclairage de la scene"], correctIndex: 1 },
    { id: "d3-4", question: "Qu'est-ce que le 'UV mapping' ?", options: ["Un type de lumiere", "Le depliage d'un modele 3D en 2D pour appliquer des textures", "Un format de fichier", "Un type d'animation"], correctIndex: 1 },
    { id: "d3-5", question: "Quelle est la difference entre un rendu en temps reel et un rendu pre-calcule ?", options: ["Aucune", "Le temps reel calcule instantanement (jeux), le pre-calcule produit des images de haute qualite sur un temps plus long", "Le pre-calcule est moins beau", "Le temps reel est plus lent"], correctIndex: 1 },
    { id: "d3-6", question: "Qu'est-ce que le 'sculpting' numerique ?", options: ["Un type de rendu", "Modeler de la matiere digitale comme de l'argile pour creer des formes organiques detaillees", "Un type d'animation", "Une technique d'eclairage"], correctIndex: 1 },
    { id: "d3-7", question: "Qu'est-ce qu'un 'keyframe' en animation ?", options: ["Un type de camera", "Une image cle definissant une position ou un etat a un moment precis de l'animation", "Un type de lumiere", "Un format d'export"], correctIndex: 1 },
    { id: "d3-8", question: "Qu'est-ce que le 'ray tracing' ?", options: ["Un type de texturage", "Une technique de rendu simulant le comportement physique de la lumiere", "Un outil de modelisation", "Un type de compression"], correctIndex: 1 },
    { id: "d3-9", question: "Qu'est-ce que le 'topology' en modelisation 3D ?", options: ["La couleur du modele", "L'organisation et la disposition des polygones sur la surface d'un modele", "Le poids du fichier", "Un type de rendu"], correctIndex: 1 },
    { id: "d3-10", question: "Qu'est-ce que le 'motion capture' (mocap) ?", options: ["Filmer en slow motion", "Enregistrer les mouvements d'acteurs reels pour les appliquer a des modeles 3D", "Un type de rendu", "Un outil de texturage"], correctIndex: 1 },
    { id: "d3-11", question: "Quel format de fichier 3D est universellement supporte pour l'echange ?", options: [".blend", ".max", ".fbx ou .obj", ".psd"], correctIndex: 2 },
    { id: "d3-12", question: "Qu'est-ce que le 'normal mapping' ?", options: ["Un type de modelisation", "Une technique simulant des details de surface sans ajouter de geometrie reelle", "Un type d'animation", "Un outil de rendu"], correctIndex: 1 },
    { id: "d3-13", question: "Qu'est-ce qu'un 'shader' en 3D ?", options: ["Un type de lumiere", "Un programme qui determine l'apparence d'une surface (couleur, reflexion, transparence)", "Un outil de modelisation", "Un format de fichier"], correctIndex: 1 },
    { id: "d3-14", question: "Qu'est-ce que l'animation procedurale ?", options: ["L'animation image par image", "L'animation generee par des regles et algorithmes plutot que manuellement", "Un type de rendu", "Un outil de rigging"], correctIndex: 1 },
    { id: "d3-15", question: "Qu'est-ce que le 'HDRI' en eclairage 3D ?", options: ["Un type de texture", "Une image a haute plage dynamique utilisee pour eclairer une scene de maniere realiste", "Un format de modele", "Un type de camera"], correctIndex: 1 },
    { id: "d3-16", question: "Qu'est-ce que le 'retopology' ?", options: ["Supprimer un modele", "Reconstruire la topologie d'un modele haute resolution avec un maillage plus propre et leger", "Appliquer des textures", "Un type d'animation"], correctIndex: 1 },
    { id: "d3-17", question: "Qu'est-ce que le 'subsurface scattering' en rendu ?", options: ["Un type de texture", "La simulation de la lumiere penetrant et diffusant sous la surface d'un materiau (peau, cire)", "Un outil de sculpting", "Un type de camera"], correctIndex: 1 },
    { id: "d3-18", question: "Qu'est-ce que le 'LOD' (Level of Detail) ?", options: ["Un type de rendu", "Differentes versions d'un modele avec des niveaux de detail variables selon la distance", "Un format de fichier", "Un outil de texturage"], correctIndex: 1 },
    { id: "d3-19", question: "Qu'est-ce que le 'inverse kinematics' (IK) en animation ?", options: ["Un type de rendu", "Une technique ou le mouvement d'un membre est calcule a partir de la position de son extremite", "Un outil de sculpting", "Un format d'export"], correctIndex: 1 },
    { id: "d3-20", question: "Qu'est-ce que PBR (Physically Based Rendering) ?", options: ["Un format de fichier", "Un systeme de rendu qui simule les interactions realistes entre la lumiere et les materiaux", "Un outil de modelisation", "Un type d'animation"], correctIndex: 1 },
  ],

  // =========================================================================
  // 14. MONTAGE VIDEO & MOTION (cert-design-video)
  // =========================================================================
  "cert-design-video": [
    { id: "dv-1", question: "Quelle est la difference entre le montage lineaire et non lineaire ?", options: ["Aucune", "Le lineaire edite sequentiellement, le non lineaire permet d'acceder a n'importe quel point librement", "Le lineaire est plus rapide", "Le non lineaire necessite plus de materiel"], correctIndex: 1 },
    { id: "dv-2", question: "Quel logiciel Adobe est la reference pour le montage video professionnel ?", options: ["After Effects", "Premiere Pro", "Photoshop", "Illustrator"], correctIndex: 1 },
    { id: "dv-3", question: "Que signifie 'frame rate' (FPS) ?", options: ["La resolution de la video", "Le nombre d'images affichees par seconde", "La taille du fichier", "Le format de compression"], correctIndex: 1 },
    { id: "dv-4", question: "Quel est le FPS standard pour le cinema ?", options: ["30 fps", "60 fps", "24 fps", "120 fps"], correctIndex: 2 },
    { id: "dv-5", question: "Qu'est-ce que le 'color grading' ?", options: ["L'ajout de texte", "L'etalonnage des couleurs pour creer une ambiance visuelle et une coherence esthetique", "Le montage sonore", "L'ajout d'effets speciaux"], correctIndex: 1 },
    { id: "dv-6", question: "Quel logiciel est specialise dans le motion design et les effets visuels ?", options: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Final Cut Pro"], correctIndex: 1 },
    { id: "dv-7", question: "Qu'est-ce qu'un 'cut' en montage video ?", options: ["Un effet special", "La transition la plus basique: passage direct d'un plan a un autre", "Un type de zoom", "Un effet sonore"], correctIndex: 1 },
    { id: "dv-8", question: "Quelle est la difference entre la resolution 1080p et 4K ?", options: ["Aucune difference visible", "1080p = 1920x1080 pixels, 4K = 3840x2160 pixels (4x plus de pixels)", "4K est plus petit", "1080p est plus recent"], correctIndex: 1 },
    { id: "dv-9", question: "Qu'est-ce que le 'keyframing' en motion design ?", options: ["Un type de transition", "Definir des points cles dans le temps pour animer des proprietes (position, opacite, echelle)", "Un type de rendu", "Un format d'export"], correctIndex: 1 },
    { id: "dv-10", question: "Quel codec video offre un bon equilibre qualite/taille pour le web ?", options: ["ProRes", "H.264", "AVI non compresse", "MPEG-2"], correctIndex: 1 },
    { id: "dv-11", question: "Qu'est-ce que le 'J-cut' et le 'L-cut' en montage ?", options: ["Des types de fichiers", "Des techniques ou l'audio et la video de deux plans se chevauchent pour une transition fluide", "Des effets speciaux", "Des types de zoom"], correctIndex: 1 },
    { id: "dv-12", question: "Qu'est-ce que le 'compositing' en post-production ?", options: ["Le montage sonore", "La combinaison de plusieurs couches visuelles en une seule image ou video", "L'ajout de sous-titres", "Le choix de la musique"], correctIndex: 1 },
    { id: "dv-13", question: "Qu'est-ce que le 'chroma key' (fond vert) ?", options: ["Un filtre de couleur", "Une technique remplacant une couleur unie d'arriere-plan par une autre image ou video", "Un type de camera", "Un codec video"], correctIndex: 1 },
    { id: "dv-14", question: "Quel logiciel gratuit est reconnu pour l'etalonnage colorimetrique professionnel ?", options: ["iMovie", "DaVinci Resolve", "Windows Movie Maker", "OpenShot"], correctIndex: 1 },
    { id: "dv-15", question: "Qu'est-ce que le 'bitrate' d'une video ?", options: ["Le nombre de couleurs", "La quantite de donnees traitees par seconde, influencant la qualite et la taille du fichier", "Le nombre d'images", "La resolution"], correctIndex: 1 },
    { id: "dv-16", question: "Qu'est-ce qu'une 'timeline' en montage video ?", options: ["Un calendrier", "L'interface chronologique ou les clips video, audio et effets sont organises", "Un type de transition", "Un format de fichier"], correctIndex: 1 },
    { id: "dv-17", question: "Qu'est-ce que le 'motion tracking' ?", options: ["Un type de montage", "Le suivi du mouvement d'un element dans une video pour y attacher des effets ou du texte", "Un filtre", "Un type de transition"], correctIndex: 1 },
    { id: "dv-18", question: "Qu'est-ce que le ratio d'aspect 16:9 ?", options: ["Un format audio", "Le rapport largeur/hauteur standard pour les videos HD et Full HD", "Un type de zoom", "Un format d'image fixe"], correctIndex: 1 },
    { id: "dv-19", question: "Qu'est-ce que le 'rendering' (rendu) en video ?", options: ["Filmer une scene", "Le processus de calcul final qui produit le fichier video exportable", "Importer des rushes", "Ajouter de la musique"], correctIndex: 1 },
    { id: "dv-20", question: "Qu'est-ce que le 'storyboard' en production video ?", options: ["Le montage final", "Une serie de dessins ou vignettes representant les plans prevus avant le tournage", "Un type de transition", "Un outil de colorimetrie"], correctIndex: 1 },
  ],

  // =========================================================================
  // 15. PHOTOGRAPHIE & RETOUCHE (cert-design-photo)
  // =========================================================================
  "cert-design-photo": [
    { id: "dp-1", question: "Qu'est-ce que le 'triangle d'exposition' en photographie ?", options: ["Un type de flash", "La relation entre ouverture, vitesse d'obturation et sensibilite ISO", "Un filtre", "Un type d'objectif"], correctIndex: 1 },
    { id: "dp-2", question: "Que controle l'ouverture du diaphragme (f-stop) ?", options: ["La mise au point", "La quantite de lumiere entrant et la profondeur de champ", "Le zoom", "La balance des blancs"], correctIndex: 1 },
    { id: "dp-3", question: "Qu'est-ce que la profondeur de champ ?", options: ["La distance focale", "La zone de nettete devant et derriere le sujet", "La resolution de l'image", "La taille du capteur"], correctIndex: 1 },
    { id: "dp-4", question: "Une grande ouverture (f/1.8) produit quel effet ?", options: ["Grande profondeur de champ", "Faible profondeur de champ avec arriere-plan flou", "Image sombre", "Image tres nette partout"], correctIndex: 1 },
    { id: "dp-5", question: "Quel format de fichier photo preserve le maximum d'informations pour la retouche ?", options: ["JPEG", "PNG", "RAW", "GIF"], correctIndex: 2 },
    { id: "dp-6", question: "Qu'est-ce que la balance des blancs ?", options: ["Un filtre", "Le reglage des couleurs pour que le blanc apparaisse neutre sous differentes lumieres", "Un type d'objectif", "La resolution"], correctIndex: 1 },
    { id: "dp-7", question: "Quel logiciel est la reference pour la retouche photo professionnelle ?", options: ["Illustrator", "Adobe Photoshop", "Premiere Pro", "InDesign"], correctIndex: 1 },
    { id: "dp-8", question: "Qu'est-ce que l'histogramme en photographie ?", options: ["Un type de filtre", "Un graphique montrant la distribution des tons clairs et sombres dans l'image", "Un type d'objectif", "Un outil de mise au point"], correctIndex: 1 },
    { id: "dp-9", question: "Qu'est-ce que le 'bokeh' en photographie ?", options: ["Un type d'eclairage", "L'aspect esthetique du flou d'arriere-plan produit par l'objectif", "Un filtre numerique", "Un type de cadrage"], correctIndex: 1 },
    { id: "dp-10", question: "Que signifie ISO en photographie numerique ?", options: ["Un format de fichier", "La sensibilite du capteur a la lumiere", "Un type d'objectif", "Le ratio d'aspect"], correctIndex: 1 },
    { id: "dp-11", question: "Qu'est-ce que les calques (layers) dans Photoshop ?", options: ["Des filtres", "Des niveaux superposes permettant d'editer des elements independamment", "Des couleurs", "Des outils de selection"], correctIndex: 1 },
    { id: "dp-12", question: "Qu'est-ce que le 'dodging and burning' en retouche ?", options: ["Un effet special", "Eclaircir (dodge) et assombrir (burn) selectivement des zones de l'image", "Un type de filtre", "Un outil de recadrage"], correctIndex: 1 },
    { id: "dp-13", question: "Quelle est la difference entre recadrage et redimensionnement ?", options: ["Aucune difference", "Le recadrage coupe une partie de l'image, le redimensionnement change sa taille globale", "Le redimensionnement est destructif", "Le recadrage augmente la resolution"], correctIndex: 1 },
    { id: "dp-14", question: "Qu'est-ce qu'un masque de fusion dans Photoshop ?", options: ["Un filtre", "Un outil permettant de masquer ou reveler des parties d'un calque de maniere non destructive", "Un type de couleur", "Un outil de dessin"], correctIndex: 1 },
    { id: "dp-15", question: "Qu'est-ce que la regle des tiers en photographie ?", options: ["Utiliser trois couleurs", "Placer les sujets le long de lignes imaginaires divisant l'image en 9 parties egales", "Prendre trois photos", "Utiliser trois objectifs"], correctIndex: 1 },
    { id: "dp-16", question: "Qu'est-ce que le 'HDR' en photographie ?", options: ["Un format de fichier", "High Dynamic Range: technique combinant plusieurs expositions pour capturer plus de details", "Un type d'objectif", "Un reglage ISO"], correctIndex: 1 },
    { id: "dp-17", question: "Qu'est-ce que Adobe Lightroom ?", options: ["Un editeur video", "Un logiciel de gestion et de developpement de photos, specialise dans le traitement RAW", "Un outil de design 3D", "Un navigateur web"], correctIndex: 1 },
    { id: "dp-18", question: "Qu'est-ce que le 'cloning' (tampon de duplication) en retouche ?", options: ["Un outil de decoupe", "Un outil qui copie une zone de l'image pour recouvrir une autre zone", "Un type de filtre", "Un outil de texte"], correctIndex: 1 },
    { id: "dp-19", question: "Quelle est la difference entre une photo surexposee et sous-exposee ?", options: ["Aucune", "Surexposee = trop de lumiere (trop claire), sous-exposee = pas assez de lumiere (trop sombre)", "Surexposee = floue", "Sous-exposee = trop saturee"], correctIndex: 1 },
    { id: "dp-20", question: "Qu'est-ce que le format TIFF ?", options: ["Un format compresse avec perte", "Un format d'image sans perte de qualite souvent utilise en impression professionnelle", "Un format video", "Un format exclusif Apple"], correctIndex: 1 },
  ],

  // =========================================================================
  // 16. BRANDING & IDENTITE VISUELLE (cert-design-branding)
  // =========================================================================
  "cert-design-branding": [
    { id: "br-1", question: "Qu'est-ce qu'une charte graphique ?", options: ["Un type de logo", "Un document definissant les regles d'utilisation de l'identite visuelle d'une marque", "Un site web", "Un outil de design"], correctIndex: 1 },
    { id: "br-2", question: "Quelle est la difference entre un logo et une identite visuelle ?", options: ["Aucune difference", "Le logo est un element de l'identite visuelle, qui englobe aussi couleurs, typographies, motifs, etc.", "Le logo est plus important", "L'identite visuelle est un logo en couleur"], correctIndex: 1 },
    { id: "br-3", question: "Qu'est-ce que le 'brand positioning' (positionnement de marque) ?", options: ["Le classement Google", "La place qu'occupe une marque dans l'esprit des consommateurs par rapport aux concurrents", "Le prix du produit", "L'emplacement du logo"], correctIndex: 1 },
    { id: "br-4", question: "Qu'est-ce qu'un logotype ?", options: ["Un logo en 3D", "Un logo constitue uniquement du nom de la marque en typographie stylisee", "Un logo anime", "Un pictogramme"], correctIndex: 1 },
    { id: "br-5", question: "Qu'est-ce que le 'brand equity' (capital de marque) ?", options: ["Le prix des actions", "La valeur ajoutee qu'une marque apporte a un produit grace a la perception des consommateurs", "Le budget marketing", "Le nombre d'employes"], correctIndex: 1 },
    { id: "br-6", question: "Quels elements composent une identite visuelle complete ?", options: ["Un logo uniquement", "Logo, palette de couleurs, typographies, iconographie, motifs, regles de mise en page", "Un site web et des cartes de visite", "Des publicites"], correctIndex: 1 },
    { id: "br-7", question: "Qu'est-ce qu'un 'moodboard' en branding ?", options: ["Un tableau financier", "Un collage d'images, textures, couleurs et typographies definissant l'atmosphere de la marque", "Un plan marketing", "Un type de logo"], correctIndex: 1 },
    { id: "br-8", question: "Qu'est-ce que la coherence de marque (brand consistency) ?", options: ["Changer souvent de look", "Maintenir une apparence et un ton uniformes sur tous les supports et points de contact", "Copier les concurrents", "Avoir un seul produit"], correctIndex: 1 },
    { id: "br-9", question: "Qu'est-ce qu'un 'tagline' (slogan) ?", options: ["Le nom de la marque", "Une phrase courte et memorable qui resume la promesse ou l'essence de la marque", "Un type de logo", "Une description longue"], correctIndex: 1 },
    { id: "br-10", question: "Qu'est-ce que le 'rebranding' ?", options: ["Creer une nouvelle entreprise", "Le processus de changement de l'identite visuelle ou du positionnement d'une marque existante", "Supprimer le logo", "Augmenter les prix"], correctIndex: 1 },
    { id: "br-11", question: "Qu'est-ce qu'un 'brand book' ?", options: ["Un livre de marketing", "Un guide complet documentant l'identite, les valeurs, le ton et les regles visuelles de la marque", "Un catalogue produits", "Un rapport financier"], correctIndex: 1 },
    { id: "br-12", question: "Qu'est-ce que le 'tone of voice' (ton de voix) d'une marque ?", options: ["Le volume sonore des publicites", "La maniere dont la marque communique: style, vocabulaire, personnalite dans les textes", "Un type de logo", "Le nom de la marque"], correctIndex: 1 },
    { id: "br-13", question: "Pourquoi un logo doit-il etre vectoriel ?", options: ["Pour etre plus colore", "Pour pouvoir etre redimensionne a n'importe quelle taille sans perte de qualite", "Pour etre anime", "Pour etre plus leger"], correctIndex: 1 },
    { id: "br-14", question: "Qu'est-ce que la 'brand architecture' ?", options: ["Le design du siege social", "L'organisation et la hierarchie des marques, sous-marques et produits d'une entreprise", "Un type de logo", "Un outil de design"], correctIndex: 1 },
    { id: "br-15", question: "Quelle est l'importance de la psychologie des couleurs en branding ?", options: ["Aucune importance", "Les couleurs evoquent des emotions et associations qui influencent la perception de la marque", "Seul le bleu est important", "Les couleurs n'affectent que le prix"], correctIndex: 1 },
    { id: "br-16", question: "Qu'est-ce qu'un pictogramme dans un logo ?", options: ["Un texte stylise", "Un symbole graphique simplifie representant un concept ou l'activite de la marque", "Un type de police", "Un fond de couleur"], correctIndex: 1 },
    { id: "br-17", question: "Qu'est-ce que le 'brand storytelling' ?", options: ["Un type de publicite TV", "L'art de raconter l'histoire et les valeurs de la marque pour creer un lien emotionnel", "Un outil de design", "Une strategie de prix"], correctIndex: 1 },
    { id: "br-18", question: "Quelles sont les variantes essentielles d'un logo a prevoir ?", options: ["Uniquement en couleur", "Couleur, noir et blanc, monochrome, horizontal, vertical, avec et sans texte", "Grand format uniquement", "Version animee uniquement"], correctIndex: 1 },
    { id: "br-19", question: "Qu'est-ce que le 'brand audit' ?", options: ["Un audit financier", "Une analyse approfondie de tous les elements de la marque pour evaluer coherence et performance", "Un rapport de ventes", "Un test de logo"], correctIndex: 1 },
    { id: "br-20", question: "Qu'est-ce que la 'brand promise' (promesse de marque) ?", options: ["Une garantie legale", "L'engagement que la marque fait a ses clients sur ce qu'elle delivre systematiquement", "Un slogan publicitaire", "Le prix garanti le plus bas"], correctIndex: 1 },
  ],

  // =========================================================================
  // 17. MARKETING DIGITAL (cert-marketing-digital)
  // =========================================================================
  "cert-marketing-digital": [
    { id: "md-1", question: "Qu'est-ce que le 'funnel' (entonnoir) de conversion en marketing digital ?", options: ["Un type de publicite", "Le parcours d'un prospect depuis la decouverte jusqu'a l'achat", "Un outil d'emailing", "Un reseau social"], correctIndex: 1 },
    { id: "md-2", question: "Que signifie 'CPC' en publicite en ligne ?", options: ["Cost Per Conversion", "Cost Per Click — cout par clic", "Customer Purchase Cost", "Content Production Cost"], correctIndex: 1 },
    { id: "md-3", question: "Qu'est-ce que le 'content marketing' ?", options: ["La publicite payante", "La creation et distribution de contenu de valeur pour attirer et fidéliser une audience", "Le design de logos", "La gestion des reseaux sociaux"], correctIndex: 1 },
    { id: "md-4", question: "Qu'est-ce que le 'taux de conversion' ?", options: ["Le nombre de visiteurs", "Le pourcentage de visiteurs qui effectuent une action desiree (achat, inscription)", "Le cout d'une campagne", "Le nombre de clics"], correctIndex: 1 },
    { id: "md-5", question: "Que signifie 'ROI' en marketing ?", options: ["Rate of Interest", "Return on Investment — retour sur investissement", "Reach of Impact", "Revenue Over Income"], correctIndex: 1 },
    { id: "md-6", question: "Qu'est-ce que l'inbound marketing ?", options: ["Envoyer des emails non sollicites", "Attirer les clients en creant du contenu utile plutot qu'en les sollicitant directement", "Faire de la publicite TV", "Le marketing direct"], correctIndex: 1 },
    { id: "md-7", question: "Qu'est-ce qu'un 'lead' en marketing ?", options: ["Un type de publicite", "Un prospect potentiel qui a montre un interet pour le produit ou service", "Un reseau social", "Un type de contenu"], correctIndex: 1 },
    { id: "md-8", question: "Qu'est-ce que le 'retargeting' (reciblage) ?", options: ["Changer de cible", "Afficher des publicites aux personnes ayant deja visite le site sans convertir", "Un type de SEO", "Envoyer des SMS"], correctIndex: 1 },
    { id: "md-9", question: "Qu'est-ce qu'une 'landing page' ?", options: ["La page d'accueil", "Une page web dediee concue pour convertir les visiteurs en leads ou clients", "Un blog", "Un formulaire de contact"], correctIndex: 1 },
    { id: "md-10", question: "Qu'est-ce que le 'customer lifetime value' (CLV) ?", options: ["Le prix du produit", "La valeur totale qu'un client genere pendant toute sa relation avec l'entreprise", "Le cout d'acquisition", "Le nombre de commandes"], correctIndex: 1 },
    { id: "md-11", question: "Qu'est-ce que le 'growth hacking' ?", options: ["Un piratage informatique", "Des strategies creatives et a faible cout pour accelerer rapidement la croissance", "Un type de publicite premium", "Une technique de SEO"], correctIndex: 1 },
    { id: "md-12", question: "Qu'est-ce que le 'buyer persona' ?", options: ["Un vrai client", "Un profil fictif detaille representant le client ideal base sur des donnees", "Un type de publicite", "Un outil analytique"], correctIndex: 1 },
    { id: "md-13", question: "Que signifie 'KPI' en marketing ?", options: ["Key Product Innovation", "Key Performance Indicator — indicateur cle de performance", "Knowledge Per Investment", "Keyword Promotion Index"], correctIndex: 1 },
    { id: "md-14", question: "Qu'est-ce que le 'marketing automation' ?", options: ["Le marketing manuel", "L'utilisation de logiciels pour automatiser les taches marketing repetitives", "Le marketing vocal", "Le telemarketing"], correctIndex: 1 },
    { id: "md-15", question: "Qu'est-ce que le 'CAC' (Customer Acquisition Cost) ?", options: ["Le prix du produit", "Le cout moyen pour acquerir un nouveau client", "Le chiffre d'affaires", "Le nombre de clients"], correctIndex: 1 },
    { id: "md-16", question: "Qu'est-ce que le 'storytelling' en marketing ?", options: ["Ecrire un roman", "Utiliser des recits pour engager emotionnellement le public et transmettre le message de la marque", "Un type de publicite radio", "Un format video"], correctIndex: 1 },
    { id: "md-17", question: "Qu'est-ce que le 'taux de rebond' (bounce rate) d'un site web ?", options: ["Le nombre de visiteurs", "Le pourcentage de visiteurs qui quittent le site apres avoir vu une seule page", "Le temps de chargement", "Le nombre de pages vues"], correctIndex: 1 },
    { id: "md-18", question: "Qu'est-ce que le 'affiliate marketing' ?", options: ["Le marketing direct", "Un modele ou des partenaires sont remuneres pour chaque client apporte", "Un type de publicite TV", "Le marketing par SMS"], correctIndex: 1 },
    { id: "md-19", question: "Qu'est-ce qu'un 'CTA' (Call-to-Action) en marketing digital ?", options: ["Un type de publicite", "Un element incitant l'utilisateur a effectuer une action specifique (acheter, s'inscrire)", "Un reseau social", "Un outil analytique"], correctIndex: 1 },
    { id: "md-20", question: "Qu'est-ce que le 'multicanal' en marketing digital ?", options: ["Utiliser un seul canal", "Utiliser plusieurs canaux (email, social, web, mobile) de maniere coordonnee", "Le marketing TV", "Un type de publicite imprimee"], correctIndex: 1 },
  ],

  // =========================================================================
  // 18. SEO & REFERENCEMENT (cert-seo)
  // =========================================================================
  "cert-seo": [
    { id: "seo-1", question: "Que signifie SEO ?", options: ["Social Engine Optimization", "Search Engine Optimization — optimisation pour les moteurs de recherche", "Site Enhancement Online", "Secure Electronic Output"], correctIndex: 1 },
    { id: "seo-2", question: "Qu'est-ce qu'un 'backlink' en SEO ?", options: ["Un lien interne", "Un lien provenant d'un autre site web pointant vers le votre", "Un lien casse", "Un lien publicitaire"], correctIndex: 1 },
    { id: "seo-3", question: "Quelle est la difference entre SEO on-page et off-page ?", options: ["Aucune", "On-page = optimisations sur le site (contenu, balises), off-page = actions externes (backlinks, autorite)", "On-page est plus important", "Off-page concerne uniquement les reseaux sociaux"], correctIndex: 1 },
    { id: "seo-4", question: "Qu'est-ce que la balise 'title' en SEO ?", options: ["Le titre de l'article", "L'element HTML definissant le titre de la page affiche dans les resultats de recherche", "Un type de meta tag", "Le nom du domaine"], correctIndex: 1 },
    { id: "seo-5", question: "Qu'est-ce que le 'crawling' par les moteurs de recherche ?", options: ["L'affichage des resultats", "Le processus par lequel les robots des moteurs parcourent et decouvrent les pages web", "Le classement des pages", "La suppression de pages"], correctIndex: 1 },
    { id: "seo-6", question: "Qu'est-ce qu'un 'sitemap XML' ?", options: ["Un plan du site visible par les visiteurs", "Un fichier listant les URLs du site pour aider les moteurs de recherche a le parcourir", "Un type de design", "Un outil analytique"], correctIndex: 1 },
    { id: "seo-7", question: "Qu'est-ce que le 'keyword research' (recherche de mots-cles) ?", options: ["Ecrire des mots au hasard", "L'analyse et la selection des termes que les utilisateurs recherchent pour optimiser le contenu", "Un type de publicite", "Le choix du nom de domaine"], correctIndex: 1 },
    { id: "seo-8", question: "Qu'est-ce que le 'canonical URL' ?", options: ["L'URL la plus courte", "Une balise indiquant aux moteurs la version principale d'une page en cas de contenu duplique", "L'URL du sitemap", "L'URL de la page d'accueil"], correctIndex: 1 },
    { id: "seo-9", question: "Quel outil Google est essentiel pour suivre les performances SEO d'un site ?", options: ["Google Ads", "Google Search Console", "Google Maps", "Google Sheets"], correctIndex: 1 },
    { id: "seo-10", question: "Qu'est-ce que le 'PageRank' ?", options: ["Le classement d'une page dans un site", "L'algorithme de Google evaluant l'importance d'une page basee sur la qualite des liens entrants", "Le rang de la page dans le sitemap", "Le nombre de visiteurs"], correctIndex: 1 },
    { id: "seo-11", question: "Qu'est-ce que le 'schema markup' (donnees structurees) ?", options: ["Un type de design", "Du code ajoute aux pages pour aider les moteurs a comprendre le contenu et afficher des extraits enrichis", "Un outil de design", "Un type de sitemap"], correctIndex: 1 },
    { id: "seo-12", question: "Qu'est-ce que le 'black hat SEO' ?", options: ["Le SEO pour les sites sombres", "Des techniques non ethiques violant les guidelines des moteurs pour manipuler le classement", "Le SEO technique", "Le SEO local"], correctIndex: 1 },
    { id: "seo-13", question: "Pourquoi la vitesse de chargement est-elle importante pour le SEO ?", options: ["Elle ne l'est pas", "Google l'utilise comme facteur de classement et les utilisateurs quittent les sites lents", "Elle n'affecte que le design", "Elle ne concerne que le mobile"], correctIndex: 1 },
    { id: "seo-14", question: "Qu'est-ce que le 'SEO local' ?", options: ["Le SEO en francais", "L'optimisation pour apparaitre dans les resultats de recherche geographiquement cibles", "Le SEO technique", "Le SEO pour les reseaux sociaux"], correctIndex: 1 },
    { id: "seo-15", question: "Qu'est-ce que le 'meta description' ?", options: ["Le titre de la page", "Un court texte decrivant le contenu de la page, affiche dans les resultats de recherche", "Un type de lien", "Un mot-cle"], correctIndex: 1 },
    { id: "seo-16", question: "Qu'est-ce que le 'link building' ?", options: ["Creer des liens internes uniquement", "La strategie d'obtention de backlinks de qualite pour ameliorer l'autorite du site", "Acheter des liens", "Supprimer des liens"], correctIndex: 1 },
    { id: "seo-17", question: "Qu'est-ce que le fichier robots.txt ?", options: ["Un robot web", "Un fichier indiquant aux moteurs de recherche quelles pages explorer ou ignorer", "Un outil de test", "Un type de sitemap"], correctIndex: 1 },
    { id: "seo-18", question: "Qu'est-ce que le 'Core Web Vitals' ?", options: ["Un outil de design", "Des metriques Google mesurant l'experience utilisateur (chargement, interactivite, stabilite visuelle)", "Un type de backlink", "Un format de contenu"], correctIndex: 1 },
    { id: "seo-19", question: "Qu'est-ce que le 'long tail keyword' (mot-cle de longue traine) ?", options: ["Un mot-cle court et generique", "Une expression de recherche plus longue et specifique, avec moins de volume mais plus de conversion", "Un mot-cle paye", "Un mot-cle interdit"], correctIndex: 1 },
    { id: "seo-20", question: "Qu'est-ce que le 'duplicate content' et pourquoi est-ce un probleme ?", options: ["Ce n'est pas un probleme", "Du contenu identique sur plusieurs URLs, ce qui peut diluer le classement et confondre les moteurs", "Du contenu traduit", "Du contenu mis a jour"], correctIndex: 1 },
  ],

  // =========================================================================
  // 19. SOCIAL MEDIA MANAGEMENT (cert-social-media)
  // =========================================================================
  "cert-social-media": [
    { id: "sm-1", question: "Qu'est-ce que le 'community management' ?", options: ["La gestion d'un immeuble", "L'animation et la moderation des communautes en ligne d'une marque sur les reseaux sociaux", "Le marketing par email", "La gestion de projet"], correctIndex: 1 },
    { id: "sm-2", question: "Qu'est-ce que le 'taux d'engagement' sur les reseaux sociaux ?", options: ["Le nombre de followers", "Le ratio d'interactions (likes, commentaires, partages) par rapport a la portee ou aux abonnes", "Le nombre de publications", "Le cout de la publicite"], correctIndex: 1 },
    { id: "sm-3", question: "Qu'est-ce qu'un 'calendrier editorial' ?", options: ["Un calendrier d'evenements", "Un planning organisant les publications sur les reseaux sociaux avec dates, contenus et plateformes", "Un type de publicite", "Un outil analytique"], correctIndex: 1 },
    { id: "sm-4", question: "Quelle est la difference entre 'reach' (portee) et 'impressions' ?", options: ["Aucune difference", "La portee = nombre de personnes uniques touchees, les impressions = nombre total d'affichages", "Les impressions sont toujours superieures", "La portee inclut les impressions"], correctIndex: 1 },
    { id: "sm-5", question: "Qu'est-ce que le 'social listening' ?", options: ["Ecouter de la musique sur les reseaux", "Surveiller les conversations en ligne sur une marque, un secteur ou des mots-cles specifiques", "Un type de publicite", "Un outil de design"], correctIndex: 1 },
    { id: "sm-6", question: "Quel type de contenu genere generalement le plus d'engagement sur les reseaux sociaux ?", options: ["Les longs textes", "La video et les contenus visuels interactifs", "Les liens externes", "Les documents PDF"], correctIndex: 1 },
    { id: "sm-7", question: "Qu'est-ce qu'un 'influenceur' dans le contexte du social media ?", options: ["Un employe de la marque", "Une personne avec une audience significative capable d'influencer les decisions de ses abonnes", "Un type de publicite", "Un outil analytique"], correctIndex: 1 },
    { id: "sm-8", question: "Qu'est-ce que le 'user-generated content' (UGC) ?", options: ["Du contenu cree par la marque", "Du contenu cree par les utilisateurs ou clients a propos de la marque", "Du contenu publicitaire", "Du contenu automatise"], correctIndex: 1 },
    { id: "sm-9", question: "Qu'est-ce qu'un 'hashtag' et a quoi sert-il ?", options: ["Un type de lien", "Un mot-cle precede de # qui categorise le contenu et ameliore sa decouverte", "Un filtre photo", "Un type de publicite"], correctIndex: 1 },
    { id: "sm-10", question: "Qu'est-ce que l'algorithme d'un reseau social ?", options: ["Un virus", "Un systeme automatise qui determine quel contenu afficher a chaque utilisateur selon ses preferences", "Un outil de publication", "Un type de profil"], correctIndex: 1 },
    { id: "sm-11", question: "Quel outil est couramment utilise pour planifier des publications sur plusieurs reseaux ?", options: ["Photoshop", "Hootsuite ou Buffer", "Excel", "Slack"], correctIndex: 1 },
    { id: "sm-12", question: "Qu'est-ce qu'un 'KPI' en social media ?", options: ["Un type de post", "Un indicateur cle de performance pour mesurer le succes des actions (engagement, portee, conversions)", "Un reseau social", "Un type de hashtag"], correctIndex: 1 },
    { id: "sm-13", question: "Qu'est-ce que le 'social selling' ?", options: ["Vendre sur un marche", "Utiliser les reseaux sociaux pour identifier, contacter et developper des relations avec des prospects", "Un type de publicite", "Le e-commerce"], correctIndex: 1 },
    { id: "sm-14", question: "Qu'est-ce qu'une 'story' sur les reseaux sociaux ?", options: ["Un article de blog", "Un contenu ephemere (photo/video) qui disparait apres 24h", "Un profil utilisateur", "Un type de publicite permanente"], correctIndex: 1 },
    { id: "sm-15", question: "Qu'est-ce que le 'A/B testing' en social media ?", options: ["Un test technique", "Comparer deux versions d'un contenu pour determiner laquelle performe le mieux", "Un type de hashtag", "Un outil de moderation"], correctIndex: 1 },
    { id: "sm-16", question: "Qu'est-ce que la 'viralite' d'un contenu ?", options: ["Un virus informatique", "La capacite d'un contenu a etre massivement partage et diffuse rapidement", "Un type de publicite payante", "Un outil analytique"], correctIndex: 1 },
    { id: "sm-17", question: "Qu'est-ce qu'une 'crise sur les reseaux sociaux' ?", options: ["Un bug technique", "Une situation ou la reputation de la marque est menacee par des commentaires ou evenements negatifs viraux", "Un manque de contenu", "Une baisse de followers"], correctIndex: 1 },
    { id: "sm-18", question: "Quelle est la meilleure strategie face a un commentaire negatif ?", options: ["Le supprimer", "Repondre rapidement, professionnellement et chercher a resoudre le probleme publiquement", "L'ignorer", "Bloquer l'utilisateur"], correctIndex: 1 },
    { id: "sm-19", question: "Qu'est-ce que le 'social proof' (preuve sociale) ?", options: ["Un type de publicite", "Le phenomene ou les gens imitent les actions des autres (avis, temoignages, nombre de followers)", "Un outil de mesure", "Un type de contenu"], correctIndex: 1 },
    { id: "sm-20", question: "Qu'est-ce que le 'contenu evergreen' (perenne) ?", options: ["Du contenu sur l'ecologie", "Du contenu qui reste pertinent et utile longtemps, independamment de l'actualite", "Du contenu viral", "Du contenu sponsorise"], correctIndex: 1 },
  ],

  // =========================================================================
  // 20. EMAIL MARKETING & AUTOMATION (cert-email-marketing)
  // =========================================================================
  "cert-email-marketing": [
    { id: "em-1", question: "Qu'est-ce que le 'taux d'ouverture' (open rate) en email marketing ?", options: ["Le nombre d'emails envoyes", "Le pourcentage de destinataires qui ouvrent l'email", "Le nombre de clics", "Le cout de l'envoi"], correctIndex: 1 },
    { id: "em-2", question: "Qu'est-ce que la 'segmentation' en email marketing ?", options: ["Envoyer le meme email a tous", "Diviser la liste de contacts en groupes cibles selon des criteres specifiques", "Supprimer des contacts", "Envoyer des spams"], correctIndex: 1 },
    { id: "em-3", question: "Qu'est-ce qu'un 'autoresponder' ?", options: ["Un outil de spam", "Un email automatique envoye en reponse a une action specifique (inscription, achat)", "Un type de newsletter", "Un filtre anti-spam"], correctIndex: 1 },
    { id: "em-4", question: "Que signifie 'CTR' en email marketing ?", options: ["Cost To Reach", "Click-Through Rate — taux de clic", "Customer Total Revenue", "Content Type Rating"], correctIndex: 1 },
    { id: "em-5", question: "Qu'est-ce que le 'double opt-in' ?", options: ["S'inscrire deux fois", "Demander une confirmation par email apres l'inscription pour valider le consentement", "Envoyer deux emails", "Un type de segmentation"], correctIndex: 1 },
    { id: "em-6", question: "Pourquoi le 'subject line' (objet de l'email) est-il crucial ?", options: ["Il n'est pas important", "C'est le premier element vu par le destinataire et il determine le taux d'ouverture", "Il affecte uniquement le design", "Il est cache au destinataire"], correctIndex: 1 },
    { id: "em-7", question: "Qu'est-ce qu'un 'workflow d'automation' en email marketing ?", options: ["Un type de newsletter", "Une serie d'emails automatiques declenches par des actions ou conditions specifiques", "Un outil de design", "Un filtre anti-spam"], correctIndex: 1 },
    { id: "em-8", question: "Qu'est-ce que le 'taux de desabonnement' (unsubscribe rate) ?", options: ["Le nombre de nouveaux abonnes", "Le pourcentage de destinataires qui se desabonnent apres reception d'un email", "Le cout de l'abonnement", "Le nombre d'emails envoyes"], correctIndex: 1 },
    { id: "em-9", question: "Qu'est-ce que le 'lead nurturing' par email ?", options: ["Acheter des leads", "Le processus d'entretien de la relation avec les prospects via des emails pertinents jusqu'a la conversion", "Envoyer des spams", "Supprimer les inactifs"], correctIndex: 1 },
    { id: "em-10", question: "Qu'est-ce que le 'responsive email design' ?", options: ["Un email anime", "La conception d'emails qui s'adaptent correctement a tous les appareils (mobile, tablette, desktop)", "Un email avec beaucoup d'images", "Un email en HTML uniquement"], correctIndex: 1 },
    { id: "em-11", question: "Qu'est-ce que le 'DKIM' en email ?", options: ["Un type de spam", "Un protocole d'authentification des emails permettant de verifier l'identite de l'expediteur", "Un outil de design", "Un format d'email"], correctIndex: 1 },
    { id: "em-12", question: "Qu'est-ce que le 'taux de rebond' (bounce rate) en email ?", options: ["Le taux de lecture", "Le pourcentage d'emails non delivres (hard bounce = adresse invalide, soft bounce = temporaire)", "Le taux de clic", "Le taux de conversion"], correctIndex: 1 },
    { id: "em-13", question: "Qu'est-ce que la 'personnalisation' en email marketing ?", options: ["Changer le logo", "Adapter le contenu de l'email en fonction des donnees du destinataire (prenom, preferences, historique)", "Envoyer au meme moment", "Utiliser la meme couleur"], correctIndex: 1 },
    { id: "em-14", question: "Qu'est-ce que le 'SPF' (Sender Policy Framework) ?", options: ["Un filtre de contenu", "Un protocole DNS indiquant quels serveurs sont autorises a envoyer des emails pour un domaine", "Un outil de design", "Un type de newsletter"], correctIndex: 1 },
    { id: "em-15", question: "Qu'est-ce qu'un 'email transactionnel' ?", options: ["Un email promotionnel", "Un email automatique declenche par une action utilisateur (confirmation d'achat, mot de passe oublie)", "Un spam", "Un type de newsletter"], correctIndex: 1 },
    { id: "em-16", question: "Qu'est-ce que le 'drip campaign' (campagne goutte-a-goutte) ?", options: ["Un type de spam", "Une serie d'emails envoyes automatiquement a intervalles reguliers selon un scenario predefini", "Un email unique", "Un outil analytique"], correctIndex: 1 },
    { id: "em-17", question: "Pourquoi est-il important de nettoyer regulierement sa liste de contacts ?", options: ["Ce n'est pas necessaire", "Pour maintenir une bonne delivrabilite, reduire les bounces et ameliorer les performances", "Pour economiser de l'encre", "Pour envoyer plus d'emails"], correctIndex: 1 },
    { id: "em-18", question: "Qu'est-ce que le 'RGPD' implique pour l'email marketing ?", options: ["Rien du tout", "Le consentement explicite est requis avant d'envoyer des emails commerciaux en Europe", "Seul le design est concerne", "Il concerne uniquement les SMS"], correctIndex: 1 },
    { id: "em-19", question: "Qu'est-ce que le 'preheader text' dans un email ?", options: ["Le pied de page", "Le texte d'apercu visible apres l'objet dans la boite de reception, complement du subject line", "Le lien de desabonnement", "Le nom de l'expediteur"], correctIndex: 1 },
    { id: "em-20", question: "Quel est le meilleur moment pour envoyer des emails marketing ?", options: ["Toujours a minuit", "Il varie selon l'audience, mais mardi-jeudi en milieu de matinee sont souvent performants, a tester via A/B", "Le dimanche soir", "Le 1er janvier"], correctIndex: 1 },
  ],
};
