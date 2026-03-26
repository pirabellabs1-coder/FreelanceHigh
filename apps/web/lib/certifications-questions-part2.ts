import type { QuestionDef } from "./certifications-data";

export const QUESTIONS_PART2: Record<string, QuestionDef[]> = {
  // ============================================================
  // 21. cert-publicite — Publicite en Ligne
  // ============================================================
  "cert-publicite": [
    {
      id: "q1",
      question: "Que signifie le sigle CPC dans la publicite en ligne ?",
      options: [
        "Cout Par Clic",
        "Cout Par Conversion",
        "Campagne Par Canal",
        "Cout Par Contact"
      ],
      correctIndex: 0
    },
    {
      id: "q2",
      question: "Quel modele de tarification facture l'annonceur pour 1000 impressions ?",
      options: [
        "CPC",
        "CPA",
        "CPM",
        "CPV"
      ],
      correctIndex: 2
    },
    {
      id: "q3",
      question: "Dans Google Ads, quel est le role du Quality Score ?",
      options: [
        "Determiner le nombre d'impressions quotidiennes",
        "Influencer le classement de l'annonce et le cout par clic",
        "Mesurer le taux de conversion du site",
        "Calculer le budget mensuel optimal"
      ],
      correctIndex: 1
    },
    {
      id: "q4",
      question: "Quel type de campagne Google Ads affiche des annonces dans les resultats de recherche ?",
      options: [
        "Display",
        "Shopping",
        "Search",
        "Discovery"
      ],
      correctIndex: 2
    },
    {
      id: "q5",
      question: "Sur Facebook Ads, qu'est-ce qu'une audience Lookalike ?",
      options: [
        "Une audience basee sur les visiteurs du site web",
        "Une audience similaire a une audience source existante",
        "Une audience definie par criteres demographiques manuels",
        "Une audience composee uniquement d'abonnes de la page"
      ],
      correctIndex: 1
    },
    {
      id: "q6",
      question: "Quel indicateur mesure le cout moyen pour obtenir une conversion ?",
      options: [
        "CTR",
        "CPA",
        "CPM",
        "ROAS"
      ],
      correctIndex: 1
    },
    {
      id: "q7",
      question: "Qu'est-ce que le ROAS en publicite en ligne ?",
      options: [
        "Le ratio entre le revenu genere et le cout publicitaire",
        "Le nombre de clics divise par les impressions",
        "Le cout total d'une campagne divise par le nombre de jours",
        "Le taux de rebond des pages de destination"
      ],
      correctIndex: 0
    },
    {
      id: "q8",
      question: "Quel est l'objectif principal du retargeting publicitaire ?",
      options: [
        "Toucher de nouveaux prospects jamais exposes a la marque",
        "Recibler les utilisateurs ayant deja interagi avec la marque",
        "Reduire le budget publicitaire global",
        "Augmenter le nombre d'impressions organiques"
      ],
      correctIndex: 1
    },
    {
      id: "q9",
      question: "Dans Google Ads, qu'est-ce qu'une extension d'annonce ?",
      options: [
        "Un format publicitaire video",
        "Un element supplementaire affiche avec l'annonce (lien, telephone, lieu)",
        "Une augmentation automatique du budget",
        "Un ciblage geographique etendu"
      ],
      correctIndex: 1
    },
    {
      id: "q10",
      question: "Quel format publicitaire Facebook est optimise pour generer des prospects directement dans l'application ?",
      options: [
        "Carousel Ads",
        "Lead Ads",
        "Collection Ads",
        "Stories Ads"
      ],
      correctIndex: 1
    },
    {
      id: "q11",
      question: "Qu'est-ce que le CTR (Click-Through Rate) ?",
      options: [
        "Le nombre total de clics sur une annonce",
        "Le pourcentage de personnes ayant clique par rapport aux impressions",
        "Le cout total divise par les clics",
        "Le taux de conversion apres le clic"
      ],
      correctIndex: 1
    },
    {
      id: "q12",
      question: "Quelle strategie d'encheres Google Ads vise a maximiser les conversions dans un budget donne ?",
      options: [
        "Encheres manuelles au CPC",
        "Maximiser les clics",
        "CPA cible",
        "Taux d'impression cible"
      ],
      correctIndex: 2
    },
    {
      id: "q13",
      question: "Qu'est-ce qu'un pixel de suivi Facebook ?",
      options: [
        "Un format d'image publicitaire de petite taille",
        "Un extrait de code place sur un site pour suivre les conversions",
        "Un outil de creation de visuels publicitaires",
        "Un indicateur de performance dans le Business Manager"
      ],
      correctIndex: 1
    },
    {
      id: "q14",
      question: "Quel est l'avantage principal des campagnes Display Google ?",
      options: [
        "Cibler uniquement les recherches actives",
        "Toucher les utilisateurs sur des millions de sites partenaires",
        "Garantir un taux de conversion eleve",
        "Afficher des annonces textuelles uniquement"
      ],
      correctIndex: 1
    },
    {
      id: "q15",
      question: "Qu'est-ce que le A/B testing dans la publicite en ligne ?",
      options: [
        "Comparer deux versions d'une annonce pour identifier la plus performante",
        "Alterner entre deux budgets differents",
        "Diffuser la meme annonce sur deux plateformes simultanement",
        "Tester une annonce aupres de deux pays differents uniquement"
      ],
      correctIndex: 0
    },
    {
      id: "q16",
      question: "Dans Facebook Ads, que signifie la 'portee' (reach) d'une campagne ?",
      options: [
        "Le nombre total d'affichages de l'annonce",
        "Le nombre de personnes uniques ayant vu l'annonce",
        "Le nombre de clics sur l'annonce",
        "Le nombre de partages de l'annonce"
      ],
      correctIndex: 1
    },
    {
      id: "q17",
      question: "Quel type de ciblage Google Ads utilise des mots-cles negatifs ?",
      options: [
        "Ciblage par audience",
        "Ciblage par emplacement",
        "Exclusion de termes de recherche non pertinents",
        "Ciblage demographique"
      ],
      correctIndex: 2
    },
    {
      id: "q18",
      question: "Quel budget publicitaire minimum quotidien est generalement recommande pour tester une campagne Facebook Ads ?",
      options: [
        "1 euro par jour",
        "5 a 10 euros par jour par ensemble de publicites",
        "50 euros par jour minimum",
        "100 euros par jour minimum"
      ],
      correctIndex: 1
    },
    {
      id: "q19",
      question: "Qu'est-ce que le 'frequency capping' en publicite display ?",
      options: [
        "Limiter le nombre de fois qu'un utilisateur voit la meme annonce",
        "Augmenter la frequence d'affichage pour maximiser la memorisation",
        "Plafonner le budget quotidien d'une campagne",
        "Reduire le nombre de formats publicitaires utilises"
      ],
      correctIndex: 0
    },
    {
      id: "q20",
      question: "Quelle metrique indique la rentabilite globale d'une campagne publicitaire ?",
      options: [
        "Nombre d'impressions",
        "CTR",
        "ROI (Return On Investment)",
        "Nombre de clics"
      ],
      correctIndex: 2
    }
  ],

  // ============================================================
  // 22. cert-analytics — Analytics & Data Marketing
  // ============================================================
  "cert-analytics": [
    {
      id: "q1",
      question: "Dans Google Analytics 4, qu'est-ce qu'un evenement ?",
      options: [
        "Une page vue uniquement",
        "Toute interaction utilisateur mesuree (clic, scroll, achat, etc.)",
        "Un rapport personnalise",
        "Un segment d'audience"
      ],
      correctIndex: 1
    },
    {
      id: "q2",
      question: "Quel KPI mesure le pourcentage de visiteurs qui quittent le site apres une seule page ?",
      options: [
        "Taux de conversion",
        "Taux de rebond",
        "Taux de sortie",
        "Taux d'engagement"
      ],
      correctIndex: 1
    },
    {
      id: "q3",
      question: "Qu'est-ce qu'un modele d'attribution en marketing digital ?",
      options: [
        "Une methode de segmentation d'audience",
        "Une regle pour attribuer le credit d'une conversion aux differents points de contact",
        "Un outil de creation de tableaux de bord",
        "Un algorithme de prediction des ventes"
      ],
      correctIndex: 1
    },
    {
      id: "q4",
      question: "Quel modele d'attribution accorde tout le credit au dernier point de contact avant la conversion ?",
      options: [
        "Premier clic",
        "Lineaire",
        "Dernier clic",
        "Base sur la position"
      ],
      correctIndex: 2
    },
    {
      id: "q5",
      question: "Que mesure le KPI 'Customer Lifetime Value' (CLV) ?",
      options: [
        "Le cout d'acquisition d'un nouveau client",
        "La valeur totale qu'un client genere sur toute sa relation avec l'entreprise",
        "Le nombre de visites par client par mois",
        "Le taux de retention mensuel"
      ],
      correctIndex: 1
    },
    {
      id: "q6",
      question: "Dans Google Analytics 4, qu'est-ce qu'une propriete ?",
      options: [
        "Un rapport specifique",
        "Un conteneur de donnees pour un site web ou une application",
        "Un filtre d'audience",
        "Un type de conversion"
      ],
      correctIndex: 1
    },
    {
      id: "q7",
      question: "Quel outil permet de creer des tableaux de bord marketing personnalises avec des donnees de multiples sources ?",
      options: [
        "Google Search Console uniquement",
        "Google Looker Studio (anciennement Data Studio)",
        "Google Tag Manager",
        "Google Optimize"
      ],
      correctIndex: 1
    },
    {
      id: "q8",
      question: "Qu'est-ce qu'un UTM parameter ?",
      options: [
        "Un outil de test A/B",
        "Un tag ajoute a une URL pour identifier la source et la campagne du trafic",
        "Un algorithme de classement Google",
        "Un format de rapport analytics"
      ],
      correctIndex: 1
    },
    {
      id: "q9",
      question: "Quel UTM parameter identifie le canal marketing (ex: email, social, cpc) ?",
      options: [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content"
      ],
      correctIndex: 1
    },
    {
      id: "q10",
      question: "Qu'est-ce qu'une cohorte en analytics ?",
      options: [
        "Un groupe d'utilisateurs partageant une caracteristique commune dans une periode donnee",
        "Un type de graphique en barres",
        "Un filtre pour exclure le trafic bot",
        "Un segment base sur le revenu"
      ],
      correctIndex: 0
    },
    {
      id: "q11",
      question: "Quel KPI mesure le cout d'acquisition d'un nouveau client ?",
      options: [
        "CLV",
        "CAC (Customer Acquisition Cost)",
        "ARPU",
        "MRR"
      ],
      correctIndex: 1
    },
    {
      id: "q12",
      question: "Qu'est-ce que le taux de conversion en analytics ?",
      options: [
        "Le nombre total de ventes",
        "Le pourcentage de visiteurs ayant realise l'action souhaitee",
        "Le temps moyen passe sur le site",
        "Le nombre de pages vues par session"
      ],
      correctIndex: 1
    },
    {
      id: "q13",
      question: "Quel outil Google permet de gerer et deployer des tags de suivi sans modifier le code source ?",
      options: [
        "Google Analytics",
        "Google Search Console",
        "Google Tag Manager",
        "Google Ads Editor"
      ],
      correctIndex: 2
    },
    {
      id: "q14",
      question: "Qu'est-ce qu'un funnel (entonnoir) de conversion ?",
      options: [
        "Un graphique montrant le trafic par pays",
        "La visualisation des etapes successives menant a une conversion avec les abandons",
        "Un rapport de revenus mensuels",
        "Un outil de segmentation d'audience"
      ],
      correctIndex: 1
    },
    {
      id: "q15",
      question: "Dans un dashboard marketing, que represente le KPI 'sessions' ?",
      options: [
        "Le nombre de visiteurs uniques",
        "Le nombre de periodes d'activite d'un utilisateur sur le site",
        "Le nombre de pages vues",
        "Le nombre de conversions"
      ],
      correctIndex: 1
    },
    {
      id: "q16",
      question: "Qu'est-ce que le modele d'attribution lineaire ?",
      options: [
        "Tout le credit au premier contact",
        "Tout le credit au dernier contact",
        "Le credit est reparti egalement entre tous les points de contact",
        "Le credit est attribue uniquement aux contacts payants"
      ],
      correctIndex: 2
    },
    {
      id: "q17",
      question: "Quel KPI mesure le revenu moyen par utilisateur ?",
      options: [
        "CAC",
        "CLV",
        "ARPU (Average Revenue Per User)",
        "NPS"
      ],
      correctIndex: 2
    },
    {
      id: "q18",
      question: "Qu'est-ce que le trafic organique dans Google Analytics ?",
      options: [
        "Le trafic provenant des reseaux sociaux",
        "Le trafic provenant des resultats de recherche non payants",
        "Le trafic provenant des campagnes email",
        "Le trafic provenant des publicites payantes"
      ],
      correctIndex: 1
    },
    {
      id: "q19",
      question: "Quel est l'objectif principal d'une analyse de cohorte ?",
      options: [
        "Comparer les performances de differentes campagnes publicitaires",
        "Mesurer la retention et le comportement de groupes d'utilisateurs dans le temps",
        "Calculer le ROI d'une campagne specifique",
        "Identifier les pages les plus visitees"
      ],
      correctIndex: 1
    },
    {
      id: "q20",
      question: "Quel rapport Google Analytics montre d'ou viennent les visiteurs (pays, ville) ?",
      options: [
        "Rapport d'acquisition",
        "Rapport demographique / geographique",
        "Rapport en temps reel",
        "Rapport de monetisation"
      ],
      correctIndex: 1
    }
  ],

  // ============================================================
  // 23. cert-redaction — Redaction Web & Copywriting
  // ============================================================
  "cert-redaction": [
    {
      id: "q1",
      question: "Que signifie l'acronyme AIDA en copywriting ?",
      options: [
        "Analyse, Integration, Developpement, Action",
        "Attention, Interet, Desir, Action",
        "Audience, Intention, Decision, Achat",
        "Attraction, Influence, Diffusion, Activation"
      ],
      correctIndex: 1
    },
    {
      id: "q2",
      question: "Qu'est-ce que la formule PAS en redaction persuasive ?",
      options: [
        "Produit, Avantage, Service",
        "Probleme, Agitation, Solution",
        "Planification, Action, Suivi",
        "Prospect, Analyse, Strategie"
      ],
      correctIndex: 1
    },
    {
      id: "q3",
      question: "Quel est l'objectif principal d'une balise title optimisee pour le SEO ?",
      options: [
        "Decrire le contenu de la page aux moteurs de recherche et inciter au clic",
        "Augmenter la vitesse de chargement de la page",
        "Definir la structure HTML du document",
        "Ameliorer le design visuel de la page"
      ],
      correctIndex: 0
    },
    {
      id: "q4",
      question: "En redaction web, quelle est la longueur ideale recommandee pour une meta description ?",
      options: [
        "50-70 caracteres",
        "120-160 caracteres",
        "200-250 caracteres",
        "300-400 caracteres"
      ],
      correctIndex: 1
    },
    {
      id: "q5",
      question: "Qu'est-ce que le 'tone of voice' d'une marque ?",
      options: [
        "Le volume sonore des publicites audio",
        "La personnalite et le style d'expression constants de la marque dans ses communications",
        "La frequence de publication sur les reseaux sociaux",
        "Le choix des canaux de communication"
      ],
      correctIndex: 1
    },
    {
      id: "q6",
      question: "Quelle technique de redaction consiste a placer l'information la plus importante en debut d'article ?",
      options: [
        "La pyramide inversee",
        "Le storytelling chronologique",
        "La methode deductive",
        "Le plan dialectique"
      ],
      correctIndex: 0
    },
    {
      id: "q7",
      question: "En SEO writing, qu'est-ce que la densite de mots-cles ?",
      options: [
        "Le nombre total de mots dans un article",
        "Le ratio entre le nombre d'occurrences d'un mot-cle et le nombre total de mots",
        "Le nombre de liens contenant le mot-cle",
        "La position du mot-cle dans la balise title"
      ],
      correctIndex: 1
    },
    {
      id: "q8",
      question: "Qu'est-ce qu'un CTA (Call-To-Action) en copywriting ?",
      options: [
        "Le titre principal d'une page web",
        "Un element incitant le lecteur a effectuer une action precise",
        "Le paragraphe de conclusion d'un article",
        "Un outil d'analyse de trafic"
      ],
      correctIndex: 1
    },
    {
      id: "q9",
      question: "Quelle est la regle de lisibilite de Flesch adaptee au web ?",
      options: [
        "Utiliser des phrases longues et complexes pour montrer l'expertise",
        "Viser un score de lisibilite eleve avec des phrases courtes et un vocabulaire accessible",
        "Ecrire uniquement en majuscules pour attirer l'attention",
        "Utiliser le plus de jargon technique possible"
      ],
      correctIndex: 1
    },
    {
      id: "q10",
      question: "En redaction web, qu'est-ce que le 'scannable content' ?",
      options: [
        "Un contenu crypte pour la securite",
        "Un contenu structure pour etre lu rapidement (titres, listes, gras, paragraphes courts)",
        "Un contenu genere automatiquement par IA",
        "Un contenu publie uniquement sur les reseaux sociaux"
      ],
      correctIndex: 1
    },
    {
      id: "q11",
      question: "Qu'est-ce que le storytelling en copywriting ?",
      options: [
        "L'utilisation de statistiques et de chiffres pour convaincre",
        "L'art de raconter une histoire pour creer une connexion emotionnelle avec le lecteur",
        "La redaction de fiches produits techniques",
        "La traduction d'un texte dans plusieurs langues"
      ],
      correctIndex: 1
    },
    {
      id: "q12",
      question: "Quel element est essentiel dans un titre d'article optimise pour le SEO ?",
      options: [
        "Etre le plus long possible",
        "Contenir le mot-cle principal, de preference au debut",
        "Utiliser uniquement des chiffres",
        "Eviter toute ponctuation"
      ],
      correctIndex: 1
    },
    {
      id: "q13",
      question: "Qu'est-ce que le 'content gap analysis' ?",
      options: [
        "L'analyse des erreurs grammaticales dans un contenu",
        "L'identification des sujets couverts par les concurrents mais absents de son propre site",
        "La mesure de la vitesse de chargement des pages",
        "Le calcul du retour sur investissement du contenu"
      ],
      correctIndex: 1
    },
    {
      id: "q14",
      question: "En redaction SEO, que sont les mots-cles de longue traine ?",
      options: [
        "Des mots-cles tres generiques et tres recherches",
        "Des expressions plus specifiques, avec moins de volume mais une intention plus precise",
        "Des mots-cles places uniquement dans le footer",
        "Des mots-cles en langue etrangere"
      ],
      correctIndex: 1
    },
    {
      id: "q15",
      question: "Quel est le role d'un brief editorial ?",
      options: [
        "Publier un article sur les reseaux sociaux",
        "Definir les consignes de redaction (sujet, angle, mots-cles, ton, longueur, CTA)",
        "Analyser les performances d'un article apres publication",
        "Corriger les fautes d'orthographe d'un texte"
      ],
      correctIndex: 1
    },
    {
      id: "q16",
      question: "Qu'est-ce que l'UX writing ?",
      options: [
        "La redaction de code HTML pour les interfaces",
        "La redaction de microtextes dans les interfaces (boutons, messages d'erreur, labels)",
        "La redaction d'articles de blog sur l'experience utilisateur",
        "La creation de maquettes graphiques"
      ],
      correctIndex: 1
    },
    {
      id: "q17",
      question: "Quelle pratique est deconseilllee en SEO writing moderne ?",
      options: [
        "Utiliser des synonymes et variations du mot-cle",
        "Repeter excessivement le meme mot-cle (keyword stuffing)",
        "Structurer le contenu avec des titres H2 et H3",
        "Ajouter des liens internes pertinents"
      ],
      correctIndex: 1
    },
    {
      id: "q18",
      question: "Qu'est-ce qu'un lead magnet en copywriting ?",
      options: [
        "Le premier paragraphe d'un article de presse",
        "Un contenu gratuit offert en echange d'une adresse email (ebook, checklist, template)",
        "Un titre accrocheur sur une page de vente",
        "Un lien vers un site partenaire"
      ],
      correctIndex: 1
    },
    {
      id: "q19",
      question: "Quel principe psychologique utilise la preuve sociale en copywriting ?",
      options: [
        "Les gens preferent les produits les moins chers",
        "Les gens ont tendance a suivre les actions et opinions des autres",
        "Les gens retiennent mieux les images que le texte",
        "Les gens lisent toujours un article en entier"
      ],
      correctIndex: 1
    },
    {
      id: "q20",
      question: "En redaction web, qu'est-ce qu'un 'hook' (accroche) ?",
      options: [
        "Un lien hypertexte vers une autre page",
        "La premiere phrase ou le premier paragraphe concu pour capter immediatement l'attention",
        "Un bouton de partage sur les reseaux sociaux",
        "Le dernier paragraphe de conclusion"
      ],
      correctIndex: 1
    }
  ],

  // ============================================================
  // 24. cert-traduction — Traduction & Localisation
  // ============================================================
  "cert-traduction": [
    {
      id: "q1",
      question: "Qu'est-ce qu'un outil TAO (Traduction Assistee par Ordinateur) ?",
      options: [
        "Un logiciel qui traduit automatiquement sans intervention humaine",
        "Un logiciel qui assiste le traducteur avec memoires de traduction et glossaires",
        "Un correcteur orthographique avance",
        "Un outil de mise en page pour documents multilingues"
      ],
      correctIndex: 1
    },
    {
      id: "q2",
      question: "Qu'est-ce qu'une memoire de traduction (TM) ?",
      options: [
        "Un dictionnaire bilingue en ligne",
        "Une base de donnees stockant des segments deja traduits pour reutilisation",
        "Un logiciel de traduction automatique",
        "Un format de fichier pour les traductions"
      ],
      correctIndex: 1
    },
    {
      id: "q3",
      question: "Quelle est la difference entre traduction et localisation ?",
      options: [
        "Il n'y a aucune difference",
        "La localisation adapte le contenu a la culture locale (formats, images, references), au-dela de la simple traduction",
        "La traduction est plus couteuse que la localisation",
        "La localisation ne concerne que les logiciels"
      ],
      correctIndex: 1
    },
    {
      id: "q4",
      question: "Quel est le format de fichier standard pour l'echange de donnees de traduction ?",
      options: [
        "DOCX",
        "XLIFF (XML Localisation Interchange File Format)",
        "CSV",
        "PDF"
      ],
      correctIndex: 1
    },
    {
      id: "q5",
      question: "Qu'est-ce qu'un glossaire terminologique en traduction ?",
      options: [
        "Un dictionnaire complet de la langue source",
        "Une liste de termes specifiques avec leurs traductions validees pour assurer la coherence",
        "Un guide de style grammatical",
        "Un outil de detection de plagiat"
      ],
      correctIndex: 1
    },
    {
      id: "q6",
      question: "Quel outil TAO est l'un des plus utilises dans l'industrie de la traduction ?",
      options: [
        "Microsoft Word",
        "SDL Trados Studio",
        "Google Docs",
        "Adobe InDesign"
      ],
      correctIndex: 1
    },
    {
      id: "q7",
      question: "Qu'est-ce que la 'transcreation' ?",
      options: [
        "La traduction mot a mot d'un texte",
        "L'adaptation creative d'un message marketing pour qu'il resonne dans la culture cible",
        "La traduction automatique par intelligence artificielle",
        "La correction d'une traduction existante"
      ],
      correctIndex: 1
    },
    {
      id: "q8",
      question: "En localisation logicielle, qu'est-ce que l'internationalisation (i18n) ?",
      options: [
        "Traduire l'interface dans toutes les langues",
        "Concevoir le logiciel pour qu'il puisse etre adapte a differentes langues sans modification du code",
        "Publier le logiciel dans plusieurs pays",
        "Ajouter des drapeaux de pays dans l'interface"
      ],
      correctIndex: 1
    },
    {
      id: "q9",
      question: "Pourquoi faut-il adapter les formats de date lors de la localisation ?",
      options: [
        "Les dates sont identiques dans toutes les cultures",
        "Les formats varient selon les pays (JJ/MM/AAAA en France vs MM/DD/YYYY aux USA)",
        "Les dates ne sont jamais affichees dans les logiciels",
        "Seul le fuseau horaire change"
      ],
      correctIndex: 1
    },
    {
      id: "q10",
      question: "Qu'est-ce que la post-edition en traduction ?",
      options: [
        "La publication d'un texte traduit sur un site web",
        "La revision et correction d'une traduction automatique par un traducteur humain",
        "La suppression des fichiers de traduction obsoletes",
        "La relecture du texte source avant traduction"
      ],
      correctIndex: 1
    },
    {
      id: "q11",
      question: "Quel probleme la localisation doit-elle anticiper avec les textes traduits ?",
      options: [
        "Le texte traduit a toujours exactement la meme longueur",
        "L'expansion du texte (certaines langues necessitent plus d'espace que d'autres)",
        "Toutes les langues utilisent le meme alphabet",
        "Les images n'ont jamais besoin d'etre adaptees"
      ],
      correctIndex: 1
    },
    {
      id: "q12",
      question: "Qu'est-ce qu'un 'fuzzy match' dans une memoire de traduction ?",
      options: [
        "Une traduction identique a 100% deja stockee",
        "Une correspondance partielle entre le segment source et un segment existant dans la TM",
        "Une erreur de traduction detectee automatiquement",
        "Un segment impossible a traduire"
      ],
      correctIndex: 1
    },
    {
      id: "q13",
      question: "Pourquoi la localisation des devises est-elle importante ?",
      options: [
        "Toutes les devises ont le meme symbole",
        "Les utilisateurs doivent voir les prix dans leur devise locale avec le format correct",
        "Les devises n'apparaissent jamais dans les interfaces",
        "Seul le dollar americain est utilise en ligne"
      ],
      correctIndex: 1
    },
    {
      id: "q14",
      question: "Qu'est-ce que le QA (Quality Assurance) en traduction ?",
      options: [
        "La phase de negociation du prix avec le client",
        "Les verifications systematiques de coherence, terminologie, format et exactitude",
        "La suppression des repetitions dans le texte",
        "Le choix de la paire de langues"
      ],
      correctIndex: 1
    },
    {
      id: "q15",
      question: "Quel defi specifique pose la localisation vers l'arabe ?",
      options: [
        "L'arabe s'ecrit de droite a gauche (RTL), necessitant l'adaptation de toute l'interface",
        "L'arabe ne peut pas etre affiche sur ecran",
        "L'arabe utilise le meme alphabet que le francais",
        "Les textes arabes sont toujours plus courts que les textes francais"
      ],
      correctIndex: 0
    },
    {
      id: "q16",
      question: "Qu'est-ce qu'une 'locale' en informatique ?",
      options: [
        "L'adresse IP de l'utilisateur",
        "Un identifiant combinant langue et region (ex: fr-FR, fr-CA, en-US)",
        "Le nom du serveur hebergeant le site",
        "Le nom du navigateur utilise"
      ],
      correctIndex: 1
    },
    {
      id: "q17",
      question: "Pourquoi eviter les expressions idiomatiques lors de la redaction de contenu a traduire ?",
      options: [
        "Les expressions idiomatiques sont grammaticalement incorrectes",
        "Elles sont souvent intraduisibles litteralement et perdent leur sens dans d'autres cultures",
        "Elles rendent le texte plus court",
        "Elles sont interdites par les normes de traduction"
      ],
      correctIndex: 1
    },
    {
      id: "q18",
      question: "Quel est le role d'un chef de projet en traduction ?",
      options: [
        "Traduire tous les textes personnellement",
        "Coordonner les linguistes, gerer les delais, assurer la qualite et la communication avec le client",
        "Concevoir l'interface graphique du logiciel",
        "Rediger le texte source original"
      ],
      correctIndex: 1
    },
    {
      id: "q19",
      question: "Qu'est-ce que le 'back translation' ?",
      options: [
        "Traduire un texte dans la langue source pour verifier la fidelite de la traduction",
        "Revenir a une version anterieure de la traduction",
        "Traduire un texte a l'envers mot par mot",
        "Supprimer une traduction erronee de la memoire"
      ],
      correctIndex: 0
    },
    {
      id: "q20",
      question: "En localisation de jeux video, qu'est-ce que la 'culturalisation' ?",
      options: [
        "Ajouter des sous-titres dans toutes les langues",
        "Adapter les contenus (visuels, references, humour) pour eviter les offenses culturelles",
        "Augmenter le prix du jeu pour certains marches",
        "Supprimer les dialogues du jeu"
      ],
      correctIndex: 1
    }
  ],

  // ============================================================
  // 25. cert-content-strategy — Strategie de Contenu
  // ============================================================
  "cert-content-strategy": [
    {
      id: "q1",
      question: "Qu'est-ce qu'un calendrier editorial ?",
      options: [
        "Un outil de planification des conges des redacteurs",
        "Un planning organisant la creation et la publication de contenus dans le temps",
        "Un agenda des reunions de l'equipe marketing",
        "Un calendrier fiscal pour les depenses publicitaires"
      ],
      correctIndex: 1
    },
    {
      id: "q2",
      question: "Qu'est-ce qu'un buyer persona en strategie de contenu ?",
      options: [
        "Le directeur marketing de l'entreprise",
        "Une representation semi-fictive du client ideal basee sur des donnees reelles",
        "Un compte fictif utilise pour tester les publicites",
        "Le nom de marque utilise sur les reseaux sociaux"
      ],
      correctIndex: 1
    },
    {
      id: "q3",
      question: "Que sont les 'content pillars' (piliers de contenu) ?",
      options: [
        "Les articles les plus longs du blog",
        "Les themes principaux autour desquels s'articule toute la strategie de contenu",
        "Les paragraphes d'introduction de chaque article",
        "Les publicites les plus performantes"
      ],
      correctIndex: 1
    },
    {
      id: "q4",
      question: "Qu'est-ce que le content mapping ?",
      options: [
        "La creation d'une carte geographique des lecteurs",
        "L'association de contenus specifiques a chaque etape du parcours client",
        "Le comptage du nombre de mots par article",
        "La traduction du contenu dans plusieurs langues"
      ],
      correctIndex: 1
    },
    {
      id: "q5",
      question: "Quel est l'objectif du contenu 'top of funnel' (TOFU) ?",
      options: [
        "Convertir les prospects en clients payants",
        "Attirer l'attention et generer de la notoriete aupres d'une large audience",
        "Fideliser les clients existants",
        "Obtenir des avis clients positifs"
      ],
      correctIndex: 1
    },
    {
      id: "q6",
      question: "Qu'est-ce que le contenu evergreen ?",
      options: [
        "Du contenu publie uniquement au printemps",
        "Du contenu qui reste pertinent et utile sur une longue duree",
        "Du contenu genere automatiquement par IA",
        "Du contenu publie exclusivement sur les reseaux sociaux"
      ],
      correctIndex: 1
    },
    {
      id: "q7",
      question: "Quel KPI mesure l'efficacite d'un article de blog en termes de trafic ?",
      options: [
        "Le nombre de mots de l'article",
        "Le nombre de pages vues et de sessions organiques",
        "Le nombre de couleurs dans les images",
        "Le nombre de paragraphes"
      ],
      correctIndex: 1
    },
    {
      id: "q8",
      question: "Qu'est-ce que le 'content repurposing' ?",
      options: [
        "Supprimer du contenu ancien",
        "Reutiliser et adapter un contenu existant sous differents formats (article, video, infographie)",
        "Copier le contenu d'un concurrent",
        "Publier le meme contenu sur toutes les plateformes sans adaptation"
      ],
      correctIndex: 1
    },
    {
      id: "q9",
      question: "Qu'est-ce qu'un audit de contenu ?",
      options: [
        "Une verification financiere des depenses de contenu",
        "Un inventaire et une analyse systematique de tout le contenu existant pour identifier forces et faiblesses",
        "Un test de vitesse de chargement des pages",
        "Un examen des competences de l'equipe editoriale"
      ],
      correctIndex: 1
    },
    {
      id: "q10",
      question: "Quel est le role du contenu 'middle of funnel' (MOFU) ?",
      options: [
        "Faire connaitre la marque au plus grand nombre",
        "Nourrir l'interet des prospects et les aider a evaluer les solutions",
        "Conclure la vente avec un bon de commande",
        "Collecter les adresses postales des prospects"
      ],
      correctIndex: 1
    },
    {
      id: "q11",
      question: "Qu'est-ce qu'une strategie de contenu 'hub and spoke' ?",
      options: [
        "Publier tout le contenu sur une seule page",
        "Organiser le contenu autour de pages piliers (hub) liees a des articles detailles (spoke)",
        "Distribuer le contenu uniquement par email",
        "Creer du contenu exclusivement en video"
      ],
      correctIndex: 1
    },
    {
      id: "q12",
      question: "Quel outil est couramment utilise pour planifier un calendrier editorial ?",
      options: [
        "Photoshop",
        "Trello, Notion ou Asana",
        "AutoCAD",
        "Excel uniquement en format papier"
      ],
      correctIndex: 1
    },
    {
      id: "q13",
      question: "Qu'est-ce que le 'content scoring' ?",
      options: [
        "Un systeme de notation pour evaluer la performance de chaque contenu",
        "Le nombre de partages sur les reseaux sociaux uniquement",
        "Un concours entre les redacteurs",
        "Le prix facture par mot redige"
      ],
      correctIndex: 0
    },
    {
      id: "q14",
      question: "Pourquoi est-il important de definir des personas avant de creer du contenu ?",
      options: [
        "Pour connaitre le budget de l'equipe marketing",
        "Pour creer du contenu adapte aux besoins, problemes et attentes de l'audience cible",
        "Pour choisir la couleur du logo de la marque",
        "Pour determiner le salaire des redacteurs"
      ],
      correctIndex: 1
    },
    {
      id: "q15",
      question: "Qu'est-ce que le contenu 'bottom of funnel' (BOFU) ?",
      options: [
        "Du contenu de sensibilisation generale",
        "Du contenu concu pour convertir les prospects prets a acheter (demos, temoignages, offres)",
        "Du contenu humoristique pour les reseaux sociaux",
        "Du contenu exclusivement textuel"
      ],
      correctIndex: 1
    },
    {
      id: "q16",
      question: "Quel est le principe du 'content cluster' en SEO ?",
      options: [
        "Regrouper tout le contenu sur une seule page pour simplifier",
        "Creer un ensemble de contenus interconnectes autour d'un sujet principal pour renforcer l'autorite thematique",
        "Publier du contenu identique sur plusieurs domaines",
        "Supprimer les anciens contenus chaque mois"
      ],
      correctIndex: 1
    },
    {
      id: "q17",
      question: "Qu'est-ce que le 'user-generated content' (UGC) ?",
      options: [
        "Du contenu cree par l'equipe interne de l'entreprise",
        "Du contenu cree par les utilisateurs eux-memes (avis, photos, temoignages)",
        "Du contenu genere par intelligence artificielle",
        "Du contenu achete a des agences de presse"
      ],
      correctIndex: 1
    },
    {
      id: "q18",
      question: "Pourquoi mesurer le taux d'engagement sur les contenus ?",
      options: [
        "Pour calculer le cout de production du contenu",
        "Pour evaluer si le contenu resonne avec l'audience (commentaires, partages, temps passe)",
        "Pour determiner la longueur ideale des URL",
        "Pour choisir les couleurs des images"
      ],
      correctIndex: 1
    },
    {
      id: "q19",
      question: "Qu'est-ce qu'un 'content brief' ?",
      options: [
        "Un resume de 50 mots d'un article publie",
        "Un document donnant les directives de creation d'un contenu (sujet, audience, mots-cles, angle, format)",
        "Un rapport de performance trimestriel",
        "Un email d'information interne"
      ],
      correctIndex: 1
    },
    {
      id: "q20",
      question: "Quelle est la meilleure pratique pour distribuer du contenu ?",
      options: [
        "Publier uniquement sur son site web et attendre le trafic organique",
        "Adapter et diffuser le contenu sur plusieurs canaux (site, email, reseaux sociaux, partenaires)",
        "Envoyer le contenu uniquement par courrier postal",
        "Publier tout le contenu en une seule fois le premier janvier"
      ],
      correctIndex: 1
    }
  ],

  // ============================================================
  // 26. cert-journalisme — Journalisme Digital
  // ============================================================
  "cert-journalisme": [
    {
      id: "q1",
      question: "Que signifie la regle des 5W en journalisme ?",
      options: [
        "Who, What, When, Where, Why",
        "Write, Watch, Work, Win, Wish",
        "Web, Widget, Wireframe, Wiki, Workflow",
        "World, Weather, Water, Waste, Wealth"
      ],
      correctIndex: 0
    },
    {
      id: "q2",
      question: "Qu'est-ce que le fact-checking en journalisme ?",
      options: [
        "L'ecriture d'articles d'opinion",
        "La verification systematique de l'exactitude des faits et des sources avant publication",
        "La mise en page des articles",
        "La relecture orthographique du texte"
      ],
      correctIndex: 1
    },
    {
      id: "q3",
      question: "Quel principe ethique fondamental guide le journalisme ?",
      options: [
        "Maximiser les revenus publicitaires",
        "L'objectivite, l'impartialite et la veracite de l'information",
        "Publier le plus d'articles possible par jour",
        "Privilegier les sujets qui generent le plus de clics"
      ],
      correctIndex: 1
    },
    {
      id: "q4",
      question: "Qu'est-ce que le digital storytelling ?",
      options: [
        "L'ecriture de romans numeriques",
        "L'utilisation de medias interactifs (texte, image, video, audio, infographie) pour raconter une histoire journalistique",
        "La publication d'articles uniquement sur papier",
        "La lecture a voix haute d'articles de presse"
      ],
      correctIndex: 1
    },
    {
      id: "q5",
      question: "Qu'est-ce qu'un 'angle journalistique' ?",
      options: [
        "L'orientation politique du media",
        "Le point de vue ou la perspective specifique choisie pour traiter un sujet",
        "L'angle physique de la camera lors d'une interview",
        "Le nombre de sources consultees"
      ],
      correctIndex: 1
    },
    {
      id: "q6",
      question: "Qu'est-ce qu'une source primaire en journalisme ?",
      options: [
        "Un article publie par un autre media",
        "Un temoin direct, un document original ou un acteur de l'evenement",
        "Un commentaire sur les reseaux sociaux",
        "Une analyse d'expert publiee dans un livre"
      ],
      correctIndex: 1
    },
    {
      id: "q7",
      question: "En journalisme digital, qu'est-ce que le 'SEO editorial' ?",
      options: [
        "Ecrire uniquement pour les moteurs de recherche sans se soucier du lecteur",
        "Optimiser les articles pour les moteurs de recherche tout en maintenant la qualite editoriale",
        "Supprimer tous les mots-cles des articles",
        "Publier des articles uniquement en anglais"
      ],
      correctIndex: 1
    },
    {
      id: "q8",
      question: "Qu'est-ce que le 'data journalism' ?",
      options: [
        "Le journalisme sur les entreprises technologiques",
        "L'utilisation de donnees structurees et de leur analyse pour produire des enquetes et des visualisations",
        "Le stockage d'articles dans des bases de donnees",
        "La publication d'articles uniquement en format PDF"
      ],
      correctIndex: 1
    },
    {
      id: "q9",
      question: "Quelle est la difference entre un fait et une opinion en journalisme ?",
      options: [
        "Il n'y a aucune difference",
        "Un fait est verifiable et objectif, une opinion est un jugement subjectif",
        "Un fait est toujours negatif, une opinion est toujours positive",
        "Les faits sont reserves aux editoriaux"
      ],
      correctIndex: 1
    },
    {
      id: "q10",
      question: "Qu'est-ce que le 'droit de reponse' en presse ?",
      options: [
        "Le droit du journaliste de ne pas reveler ses sources",
        "Le droit d'une personne mise en cause de faire publier sa reponse dans le meme media",
        "Le droit du redacteur en chef de modifier un article",
        "Le droit de l'editeur de refuser un article"
      ],
      correctIndex: 1
    },
    {
      id: "q11",
      question: "Qu'est-ce que le 'clickbait' en journalisme digital ?",
      options: [
        "Un titre honnete et informatif",
        "Un titre sensationnaliste concu pour generer des clics sans necessairement tenir ses promesses",
        "Un format d'article long et detaille",
        "Un outil de mesure du trafic web"
      ],
      correctIndex: 1
    },
    {
      id: "q12",
      question: "Quel est le role d'un editorialiste ?",
      options: [
        "Rapporter les faits de maniere neutre",
        "Exprimer un point de vue argumente sur un sujet d'actualite",
        "Corriger les fautes d'orthographe des articles",
        "Prendre les photos pour illustrer les articles"
      ],
      correctIndex: 1
    },
    {
      id: "q13",
      question: "Qu'est-ce qu'un 'podcast' dans le journalisme digital ?",
      options: [
        "Un article ecrit tres court",
        "Un contenu audio ou video diffuse en ligne, souvent sous forme de series thematiques",
        "Un format d'impression specifique",
        "Un type de publicite en ligne"
      ],
      correctIndex: 1
    },
    {
      id: "q14",
      question: "Pourquoi la verification croisee des sources est-elle essentielle ?",
      options: [
        "Pour augmenter le nombre de mots de l'article",
        "Pour confirmer l'exactitude d'une information en la recoupant avec plusieurs sources independantes",
        "Pour citer le plus grand nombre de personnes possible",
        "Pour respecter le copyright des photos"
      ],
      correctIndex: 1
    },
    {
      id: "q15",
      question: "Qu'est-ce que le 'live blogging' ?",
      options: [
        "La publication d'un article a une heure precise",
        "La couverture d'un evenement en temps reel avec des mises a jour continues",
        "La creation d'un blog personnel",
        "La redaction d'un article collaboratif"
      ],
      correctIndex: 1
    },
    {
      id: "q16",
      question: "Quel est le principe de la 'presomption d'innocence' dans le traitement mediatique ?",
      options: [
        "Tout accuse doit etre presente comme coupable avant le verdict",
        "Toute personne mise en cause doit etre presentee comme innocente tant qu'elle n'a pas ete jugee coupable",
        "Les medias n'ont pas le droit de parler d'affaires judiciaires",
        "Les journalistes doivent toujours defendre les accuses"
      ],
      correctIndex: 1
    },
    {
      id: "q17",
      question: "Qu'est-ce qu'une 'infographie' en journalisme digital ?",
      options: [
        "Un article ecrit en langage informatique",
        "Une representation visuelle de donnees et d'informations pour faciliter la comprehension",
        "Un logiciel de retouche photo",
        "Un format de publicite banniere"
      ],
      correctIndex: 1
    },
    {
      id: "q18",
      question: "Qu'est-ce que la 'deontologie journalistique' ?",
      options: [
        "L'ensemble des regles de mise en page d'un journal",
        "L'ensemble des regles ethiques et professionnelles qui guident la pratique journalistique",
        "Le droit d'auteur sur les articles publies",
        "La formation academique des journalistes"
      ],
      correctIndex: 1
    },
    {
      id: "q19",
      question: "Quel est le role des 'newsletters' dans le journalisme digital ?",
      options: [
        "Remplacer completement les sites d'information",
        "Offrir un contenu editorial curate et regulier directement dans la boite mail des abonnes",
        "Vendre des produits physiques aux lecteurs",
        "Stocker les archives des anciens articles"
      ],
      correctIndex: 1
    },
    {
      id: "q20",
      question: "Qu'est-ce que le 'mobile journalism' (MoJo) ?",
      options: [
        "Le journalisme qui traite des nouvelles technologies mobiles",
        "La production de contenus journalistiques (texte, photo, video) avec un smartphone",
        "La lecture d'articles sur telephone mobile",
        "L'envoi de SMS aux sources d'information"
      ],
      correctIndex: 1
    }
  ],

  // ============================================================
  // 27. cert-gestion-projet — Gestion de Projet
  // ============================================================
  "cert-gestion-projet": [
    {
      id: "q1",
      question: "Qu'est-ce qu'un diagramme de Gantt ?",
      options: [
        "Un graphique en camembert montrant la repartition du budget",
        "Un planning visuel representant les taches du projet sur une echelle de temps",
        "Un organigramme de l'equipe projet",
        "Un tableau comparatif des fournisseurs"
      ],
      correctIndex: 1
    },
    {
      id: "q2",
      question: "Que signifie WBS (Work Breakdown Structure) ?",
      options: [
        "Un systeme de facturation des projets",
        "Une decomposition hierarchique du projet en sous-taches et livrables",
        "Un logiciel de gestion de projet",
        "Un modele de contrat de prestation"
      ],
      correctIndex: 1
    },
    {
      id: "q3",
      question: "Qu'est-ce que le 'chemin critique' en gestion de projet ?",
      options: [
        "Le chemin le plus court pour finir le projet",
        "La sequence la plus longue de taches dependantes qui determine la duree minimale du projet",
        "Le trajet physique entre le bureau et le client",
        "La liste des taches les plus couteuses"
      ],
      correctIndex: 1
    },
    {
      id: "q4",
      question: "Qu'est-ce qu'un risque projet ?",
      options: [
        "Un evenement certain qui va se produire",
        "Un evenement incertain qui, s'il se produit, aura un impact positif ou negatif sur le projet",
        "Un bug dans le logiciel",
        "Un retard de paiement du client"
      ],
      correctIndex: 1
    },
    {
      id: "q5",
      question: "Quel document formalise le perimetre, les objectifs et les parties prenantes d'un projet ?",
      options: [
        "Le compte-rendu de reunion",
        "La charte de projet (project charter)",
        "Le planning de Gantt",
        "Le budget previsionnel"
      ],
      correctIndex: 1
    },
    {
      id: "q6",
      question: "Qu'est-ce que la 'gestion des parties prenantes' (stakeholder management) ?",
      options: [
        "La gestion des finances du projet",
        "L'identification, l'analyse et la gestion des attentes de toutes les personnes impactees par le projet",
        "Le recrutement de l'equipe projet",
        "La gestion des licences logicielles"
      ],
      correctIndex: 1
    },
    {
      id: "q7",
      question: "Qu'est-ce qu'un jalon (milestone) en gestion de projet ?",
      options: [
        "Un membre de l'equipe projet",
        "Un point de repere marquant un evenement ou une etape cle du projet sans duree propre",
        "Un outil de calcul du budget",
        "Un type de contrat"
      ],
      correctIndex: 1
    },
    {
      id: "q8",
      question: "Quelle est la formule du 'triangle de la gestion de projet' ?",
      options: [
        "Qualite + Marketing + Vente",
        "Perimetre, Delai, Cout (avec Qualite au centre)",
        "Planification, Execution, Cloture",
        "Risque, Opportunite, Budget"
      ],
      correctIndex: 1
    },
    {
      id: "q9",
      question: "Qu'est-ce qu'un RACI dans la gestion de projet ?",
      options: [
        "Un type de diagramme de flux",
        "Une matrice definissant les roles : Responsable, Accountable, Consulte, Informe",
        "Un indicateur de performance financiere",
        "Un logiciel de planification"
      ],
      correctIndex: 1
    },
    {
      id: "q10",
      question: "Qu'est-ce que la methode du 'Earned Value Management' (EVM) ?",
      options: [
        "Une technique de recrutement pour l'equipe projet",
        "Une methode de mesure de la performance du projet comparant valeur planifiee, cout reel et valeur acquise",
        "Un outil de gestion des emails du projet",
        "Une technique de negociation avec les fournisseurs"
      ],
      correctIndex: 1
    },
    {
      id: "q11",
      question: "Qu'est-ce qu'un registre des risques ?",
      options: [
        "Un document comptable du projet",
        "Un document centralisant tous les risques identifies, leur probabilite, impact et plan de reponse",
        "La liste des assurances souscrites",
        "Le planning des audits du projet"
      ],
      correctIndex: 1
    },
    {
      id: "q12",
      question: "Quelle strategie de reponse aux risques consiste a reduire la probabilite ou l'impact d'un risque ?",
      options: [
        "Accepter",
        "Attenuer (mitigate)",
        "Transferer",
        "Eviter"
      ],
      correctIndex: 1
    },
    {
      id: "q13",
      question: "Qu'est-ce qu'un 'scope creep' en gestion de projet ?",
      options: [
        "La reduction du perimetre du projet",
        "L'extension non controlee du perimetre du projet au-dela de ce qui etait initialement defini",
        "L'acceleration du calendrier du projet",
        "La diminution du budget du projet"
      ],
      correctIndex: 1
    },
    {
      id: "q14",
      question: "Qu'est-ce que la 'matrice de probabilite et impact' pour les risques ?",
      options: [
        "Un graphique montrant les couts du projet dans le temps",
        "Un outil classant les risques selon leur probabilite d'occurrence et la gravite de leur impact",
        "Un tableau des competences de l'equipe",
        "Un planning des livrables"
      ],
      correctIndex: 1
    },
    {
      id: "q15",
      question: "Qu'est-ce qu'un 'buffer' (marge) dans un planning projet ?",
      options: [
        "Un employe supplementaire dans l'equipe",
        "Un temps supplementaire ajoute pour absorber les retards imprevus",
        "Un budget de reserve pour les primes",
        "Un outil logiciel de planification"
      ],
      correctIndex: 1
    },
    {
      id: "q16",
      question: "Quelle est la difference entre un projet et un programme ?",
      options: [
        "Il n'y a aucune difference",
        "Un programme est un ensemble de projets coordonnes visant des objectifs strategiques communs",
        "Un programme est toujours plus court qu'un projet",
        "Un programme ne necessite pas de budget"
      ],
      correctIndex: 1
    },
    {
      id: "q17",
      question: "Qu'est-ce qu'un 'kick-off meeting' ?",
      options: [
        "La reunion de cloture du projet",
        "La reunion de lancement officiel du projet avec toutes les parties prenantes",
        "Une reunion d'urgence en cas de crise",
        "Une reunion de negociation du budget"
      ],
      correctIndex: 1
    },
    {
      id: "q18",
      question: "Quel outil permet de visualiser les dependances entre les taches d'un projet ?",
      options: [
        "Le tableau RACI",
        "Le diagramme de reseau (PERT/CPM)",
        "L'organigramme de l'equipe",
        "Le tableau de bord financier"
      ],
      correctIndex: 1
    },
    {
      id: "q19",
      question: "Qu'est-ce que la 'retrospective' en fin de projet ?",
      options: [
        "Un audit financier des depenses",
        "Une reunion pour analyser ce qui a bien fonctionne et ce qui peut etre ameliore",
        "La reedition du contrat initial",
        "La redistribution du budget non utilise"
      ],
      correctIndex: 1
    },
    {
      id: "q20",
      question: "Quel est l'objectif principal du 'resource leveling' ?",
      options: [
        "Augmenter le budget du projet",
        "Equilibrer la charge de travail des ressources pour eviter la surallocation",
        "Reduire le nombre de membres de l'equipe",
        "Accelerer le calendrier du projet"
      ],
      correctIndex: 1
    }
  ],

  // ============================================================
  // 28. cert-product-management — Product Management
  // ============================================================
  "cert-product-management": [
    {
      id: "q1",
      question: "Qu'est-ce que la phase de 'product discovery' ?",
      options: [
        "Le lancement commercial du produit",
        "L'exploration des besoins utilisateurs et la validation des hypotheses avant de construire",
        "La mise a jour technique du produit existant",
        "La formation de l'equipe de vente"
      ],
      correctIndex: 1
    },
    {
      id: "q2",
      question: "Qu'est-ce qu'une roadmap produit ?",
      options: [
        "Le plan comptable du departement produit",
        "Un plan strategique montrant l'evolution prevue du produit dans le temps",
        "Le manuel utilisateur du produit",
        "La liste des bugs a corriger"
      ],
      correctIndex: 1
    },
    {
      id: "q3",
      question: "Quel framework de priorisation utilise les criteres Reach, Impact, Confidence, Effort ?",
      options: [
        "MoSCoW",
        "RICE",
        "Kano",
        "Eisenhower"
      ],
      correctIndex: 1
    },
    {
      id: "q4",
      question: "Qu'est-ce qu'un MVP (Minimum Viable Product) ?",
      options: [
        "Le produit final avec toutes les fonctionnalites",
        "La version la plus simple du produit permettant de tester une hypothese avec de vrais utilisateurs",
        "Un prototype non fonctionnel",
        "Un document de specification technique"
      ],
      correctIndex: 1
    },
    {
      id: "q5",
      question: "Quel KPI mesure le pourcentage d'utilisateurs qui reviennent utiliser le produit ?",
      options: [
        "Taux de conversion",
        "Taux de retention",
        "Taux de rebond",
        "Taux d'acquisition"
      ],
      correctIndex: 1
    },
    {
      id: "q6",
      question: "Qu'est-ce que le framework MoSCoW en priorisation ?",
      options: [
        "Un outil de gestion budgetaire",
        "Une methode classant les fonctionnalites en Must, Should, Could, Won't",
        "Un modele de tarification",
        "Un framework de developpement logiciel"
      ],
      correctIndex: 1
    },
    {
      id: "q7",
      question: "Qu'est-ce qu'une 'user story' en product management ?",
      options: [
        "La biographie de l'utilisateur ideal",
        "Une description d'une fonctionnalite du point de vue de l'utilisateur (En tant que X, je veux Y, afin de Z)",
        "Un rapport d'analyse de donnees utilisateurs",
        "Un tutoriel video pour l'utilisateur"
      ],
      correctIndex: 1
    },
    {
      id: "q8",
      question: "Qu'est-ce que le 'product-market fit' ?",
      options: [
        "Le prix optimal du produit",
        "L'adequation entre le produit et un besoin reel du marche, validee par une adoption significative",
        "Le nombre de fonctionnalites du produit",
        "La taille de l'equipe produit"
      ],
      correctIndex: 1
    },
    {
      id: "q9",
      question: "Quel outil permet de visualiser le parcours complet d'un utilisateur avec le produit ?",
      options: [
        "Le diagramme de Gantt",
        "Le user journey map (carte du parcours utilisateur)",
        "Le bilan comptable",
        "L'organigramme de l'entreprise"
      ],
      correctIndex: 1
    },
    {
      id: "q10",
      question: "Qu'est-ce que le modele Kano ?",
      options: [
        "Un modele de tarification par abonnement",
        "Un modele classant les fonctionnalites selon leur impact sur la satisfaction client (basiques, performantes, attractives)",
        "Un framework de gestion d'equipe",
        "Un outil de mesure de la vitesse de developpement"
      ],
      correctIndex: 1
    },
    {
      id: "q11",
      question: "Qu'est-ce qu'un 'north star metric' ?",
      options: [
        "Le chiffre d'affaires annuel de l'entreprise",
        "La metrique principale qui capture la valeur fondamentale delivree aux utilisateurs",
        "Le nombre total d'employes",
        "Le budget marketing mensuel"
      ],
      correctIndex: 1
    },
    {
      id: "q12",
      question: "Qu'est-ce qu'un 'sprint review' dans le contexte produit ?",
      options: [
        "Un examen des performances individuelles des developpeurs",
        "Une demonstration du travail accompli durant le sprint aux parties prenantes",
        "Un audit de securite du code",
        "Un test de charge du serveur"
      ],
      correctIndex: 1
    },
    {
      id: "q13",
      question: "Quel est le role d'un Product Owner ?",
      options: [
        "Coder les fonctionnalites du produit",
        "Definir la vision produit, gerer le backlog et maximiser la valeur delivree",
        "Gerer les finances de l'entreprise",
        "Recruter les membres de l'equipe technique"
      ],
      correctIndex: 1
    },
    {
      id: "q14",
      question: "Qu'est-ce qu'un 'feature flag' (toggle de fonctionnalite) ?",
      options: [
        "Un rapport sur les fonctionnalites les plus utilisees",
        "Un mecanisme permettant d'activer ou desactiver une fonctionnalite sans deployer de nouveau code",
        "Un drapeau physique dans le bureau pour signaler une nouvelle release",
        "Un badge sur le profil utilisateur"
      ],
      correctIndex: 1
    },
    {
      id: "q15",
      question: "Qu'est-ce que le 'churn rate' ?",
      options: [
        "Le taux de croissance du nombre d'utilisateurs",
        "Le pourcentage d'utilisateurs ou clients qui cessent d'utiliser le produit sur une periode donnee",
        "Le temps moyen passe sur l'application",
        "Le nombre de fonctionnalites ajoutees par mois"
      ],
      correctIndex: 1
    },
    {
      id: "q16",
      question: "Qu'est-ce qu'un 'A/B test' en product management ?",
      options: [
        "Un test de securite du produit",
        "Une experience comparant deux versions d'une fonctionnalite pour mesurer laquelle performe mieux",
        "Un test d'acceptation par le client",
        "Un test de compatibilite navigateur"
      ],
      correctIndex: 1
    },
    {
      id: "q17",
      question: "Qu'est-ce que le 'jobs to be done' (JTBD) framework ?",
      options: [
        "Un outil de recrutement pour l'equipe produit",
        "Un cadre d'analyse centrant la reflexion sur les taches que les utilisateurs cherchent a accomplir",
        "Un planning de livraison des fonctionnalites",
        "Un tableau des descriptions de poste"
      ],
      correctIndex: 1
    },
    {
      id: "q18",
      question: "Qu'est-ce qu'un 'backlog grooming' (refinement) ?",
      options: [
        "Le nettoyage du code source",
        "La revue et l'affinage regulier des elements du backlog (estimation, clarification, priorisation)",
        "La suppression des utilisateurs inactifs",
        "L'archivage des anciens projets"
      ],
      correctIndex: 1
    },
    {
      id: "q19",
      question: "Quel indicateur mesure la facilite d'utilisation recommandee du produit par les utilisateurs ?",
      options: [
        "CAC",
        "NPS (Net Promoter Score)",
        "ARPU",
        "DAU"
      ],
      correctIndex: 1
    },
    {
      id: "q20",
      question: "Qu'est-ce que le 'time to value' ?",
      options: [
        "Le temps de developpement d'une fonctionnalite",
        "Le temps qu'il faut a un nouvel utilisateur pour obtenir de la valeur du produit",
        "La duree de vie du produit sur le marche",
        "Le delai de paiement des factures"
      ],
      correctIndex: 1
    }
  ],

  // ============================================================
  // 29. cert-agile — Methodologies Agiles
  // ============================================================
  "cert-agile": [
    {
      id: "q1",
      question: "Quels sont les 4 valeurs du Manifeste Agile ?",
      options: [
        "Documentation, processus, outils, contrats",
        "Individus et interactions, logiciel fonctionnel, collaboration client, reponse au changement",
        "Planification, execution, controle, cloture",
        "Vitesse, qualite, budget, perimetre"
      ],
      correctIndex: 1
    },
    {
      id: "q2",
      question: "Dans Scrum, quelle est la duree typique d'un sprint ?",
      options: [
        "1 jour",
        "1 a 4 semaines (generalement 2 semaines)",
        "3 mois",
        "6 mois"
      ],
      correctIndex: 1
    },
    {
      id: "q3",
      question: "Quel est le role du Scrum Master ?",
      options: [
        "Definir les priorites du backlog produit",
        "Faciliter le processus Scrum, supprimer les obstacles et proteger l'equipe",
        "Coder les fonctionnalites les plus complexes",
        "Approuver les budgets du projet"
      ],
      correctIndex: 1
    },
    {
      id: "q4",
      question: "Qu'est-ce qu'un 'daily standup' (melee quotidienne) ?",
      options: [
        "Une reunion hebdomadaire de planification",
        "Une reunion quotidienne courte (15 min) ou chaque membre partage ce qu'il a fait, va faire et ses blocages",
        "Une seance de formation quotidienne",
        "Un rapport ecrit quotidien envoye par email"
      ],
      correctIndex: 1
    },
    {
      id: "q5",
      question: "Qu'est-ce que le Kanban ?",
      options: [
        "Un cadre de travail avec des sprints fixes",
        "Une methode visuelle de gestion du flux de travail avec limitation du travail en cours (WIP)",
        "Un outil de gestion budgetaire",
        "Un logiciel de gestion de projet specifique"
      ],
      correctIndex: 1
    },
    {
      id: "q6",
      question: "Qu'est-ce que le WIP limit en Kanban ?",
      options: [
        "Le nombre maximum d'employes dans l'equipe",
        "Le nombre maximum de taches en cours simultanement dans une colonne",
        "Le budget maximum par sprint",
        "Le nombre maximum de jours dans un cycle"
      ],
      correctIndex: 1
    },
    {
      id: "q7",
      question: "Qu'est-ce qu'une 'sprint retrospective' ?",
      options: [
        "Une presentation du produit au client",
        "Une reunion en fin de sprint pour identifier ce qui a bien marche et ce qui peut etre ameliore",
        "Une seance de planification du prochain sprint",
        "Un rapport de performance individuel"
      ],
      correctIndex: 1
    },
    {
      id: "q8",
      question: "Qu'est-ce que SAFe (Scaled Agile Framework) ?",
      options: [
        "Un outil logiciel pour les tests automatises",
        "Un framework pour appliquer les principes Agile a l'echelle de grandes organisations",
        "Un langage de programmation agile",
        "Un certificat obligatoire pour les Scrum Masters"
      ],
      correctIndex: 1
    },
    {
      id: "q9",
      question: "Qu'est-ce que le 'sprint planning' ?",
      options: [
        "La planification annuelle du budget",
        "La reunion de debut de sprint pour selectionner les elements du backlog a realiser",
        "La planification des conges de l'equipe",
        "La mise en production du logiciel"
      ],
      correctIndex: 1
    },
    {
      id: "q10",
      question: "Qu'est-ce que la 'velocity' d'une equipe Scrum ?",
      options: [
        "La vitesse de connexion internet de l'equipe",
        "La quantite de travail (en story points) qu'une equipe complete en moyenne par sprint",
        "Le nombre de bugs corriges par jour",
        "La rapidite de reponse aux emails"
      ],
      correctIndex: 1
    },
    {
      id: "q11",
      question: "Qu'est-ce qu'un 'product backlog' ?",
      options: [
        "Les bugs non corriges du produit",
        "La liste ordonnee de toutes les fonctionnalites, corrections et ameliorations souhaitees pour le produit",
        "Les taches terminees dans le sprint precedent",
        "Le carnet de commandes des clients"
      ],
      correctIndex: 1
    },
    {
      id: "q12",
      question: "Qu'est-ce que le 'definition of done' (DoD) ?",
      options: [
        "La date de fin du projet",
        "L'ensemble des criteres qu'un element du backlog doit satisfaire pour etre considere comme termine",
        "Le dernier jour du sprint",
        "La validation du budget par la direction"
      ],
      correctIndex: 1
    },
    {
      id: "q13",
      question: "Qu'est-ce que le 'story pointing' ?",
      options: [
        "Le fait de pointer du doigt les erreurs des collegues",
        "L'estimation de la complexite relative des user stories en utilisant des points",
        "Le calcul du cout en euros de chaque fonctionnalite",
        "L'attribution de notes aux membres de l'equipe"
      ],
      correctIndex: 1
    },
    {
      id: "q14",
      question: "Quelle suite de nombres est couramment utilisee pour le planning poker ?",
      options: [
        "1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
        "La suite de Fibonacci (1, 2, 3, 5, 8, 13, 21...)",
        "Les multiples de 10 (10, 20, 30, 40...)",
        "Les puissances de 2 (2, 4, 8, 16, 32...)"
      ],
      correctIndex: 1
    },
    {
      id: "q15",
      question: "Qu'est-ce que le 'burn-down chart' ?",
      options: [
        "Un graphique montrant les couts du projet",
        "Un graphique montrant le travail restant a faire dans un sprint en fonction du temps",
        "Un rapport sur les heures supplementaires de l'equipe",
        "Un diagramme de la consommation energetique du serveur"
      ],
      correctIndex: 1
    },
    {
      id: "q16",
      question: "Quel est l'un des 12 principes du Manifeste Agile ?",
      options: [
        "Livrer le logiciel une seule fois en fin de projet",
        "Livrer frequemment un logiciel fonctionnel, de quelques semaines a quelques mois",
        "Eviter tout changement apres la planification initiale",
        "Documenter chaque decision avant d'agir"
      ],
      correctIndex: 1
    },
    {
      id: "q17",
      question: "Qu'est-ce que le 'continuous delivery' en lien avec l'Agile ?",
      options: [
        "La livraison continue de courrier postal",
        "La capacite de deployer du code en production a tout moment de maniere automatisee et fiable",
        "La publication de rapports quotidiens",
        "L'envoi continu d'emails au client"
      ],
      correctIndex: 1
    },
    {
      id: "q18",
      question: "Quelle ceremonie Scrum n'existe PAS dans le framework officiel ?",
      options: [
        "Sprint Planning",
        "Daily Scrum",
        "Sprint Status Report Meeting",
        "Sprint Retrospective"
      ],
      correctIndex: 2
    },
    {
      id: "q19",
      question: "Qu'est-ce que le 'lead time' en Kanban ?",
      options: [
        "Le temps que met le manager pour prendre une decision",
        "Le temps total entre la demande d'une tache et sa livraison",
        "Le temps passe en reunion par semaine",
        "Le delai de paiement des factures"
      ],
      correctIndex: 1
    },
    {
      id: "q20",
      question: "Quelle taille d'equipe est recommandee par le Scrum Guide ?",
      options: [
        "1 a 3 personnes",
        "10 personnes ou moins (generalement 3 a 9 developpeurs)",
        "20 a 30 personnes",
        "Plus de 50 personnes"
      ],
      correctIndex: 1
    }
  ],

  // ============================================================
  // 30. cert-leadership — Leadership & Management d'Equipe
  // ============================================================
  "cert-leadership": [
    {
      id: "q1",
      question: "Quelle est la difference fondamentale entre un manager et un leader ?",
      options: [
        "Il n'y a aucune difference",
        "Le manager gere les processus et l'organisation, le leader inspire et donne une vision",
        "Le manager gagne toujours plus que le leader",
        "Le leader ne prend jamais de decisions"
      ],
      correctIndex: 1
    },
    {
      id: "q2",
      question: "Qu'est-ce que la delegation efficace ?",
      options: [
        "Donner toutes les taches desagreables aux subordonnees",
        "Confier une responsabilite a un collaborateur en lui donnant l'autorite et les ressources necessaires",
        "Faire le travail soi-meme puis demander une relecture",
        "Attendre que les collaborateurs demandent du travail"
      ],
      correctIndex: 1
    },
    {
      id: "q3",
      question: "Qu'est-ce que le feedback constructif ?",
      options: [
        "Critiquer publiquement les erreurs d'un collaborateur",
        "Un retour specifique, actionnable et oriente vers l'amelioration, donne de maniere respectueuse",
        "Ne donner que des compliments pour maintenir la motivation",
        "Attendre l'evaluation annuelle pour partager ses observations"
      ],
      correctIndex: 1
    },
    {
      id: "q4",
      question: "Selon la theorie de Maslow, quel besoin se situe au sommet de la pyramide ?",
      options: [
        "Besoins physiologiques",
        "Besoins de securite",
        "Besoins d'appartenance",
        "Besoin d'accomplissement de soi (realisation personnelle)"
      ],
      correctIndex: 3
    },
    {
      id: "q5",
      question: "Qu'est-ce que le 'servant leadership' ?",
      options: [
        "Un style de leadership ou le leader commande de maniere autoritaire",
        "Un style ou le leader met en priorite les besoins de son equipe et l'aide a se developper",
        "Un style ou le leader delegalise toutes les decisions",
        "Un style reserve aux secteurs militaires"
      ],
      correctIndex: 1
    },
    {
      id: "q6",
      question: "Qu'est-ce que l'intelligence emotionnelle en management ?",
      options: [
        "Le QI du manager",
        "La capacite a reconnaitre, comprendre et gerer ses propres emotions et celles des autres",
        "La capacite a resoudre des problemes mathematiques complexes",
        "Le nombre d'annees d'experience en management"
      ],
      correctIndex: 1
    },
    {
      id: "q7",
      question: "Qu'est-ce qu'un objectif SMART ?",
      options: [
        "Un objectif defini par un logiciel intelligent",
        "Un objectif Specifique, Mesurable, Atteignable, Realiste et Temporellement defini",
        "Un objectif reserve aux employes les plus performants",
        "Un objectif fixe sans date limite"
      ],
      correctIndex: 1
    },
    {
      id: "q8",
      question: "Qu'est-ce que le micromanagement ?",
      options: [
        "La gestion de petites equipes",
        "Le fait de controler excessivement chaque detail du travail des collaborateurs, limitant leur autonomie",
        "La gestion de micro-entreprises",
        "Un style de management tres efficace"
      ],
      correctIndex: 1
    },
    {
      id: "q9",
      question: "Qu'est-ce que la theorie X et Y de McGregor ?",
      options: [
        "Deux types de produits dans une entreprise",
        "Deux visions du management : X (les employes sont passifs) vs Y (les employes sont motives et responsables)",
        "Deux generations de managers differentes",
        "Deux types de contrats de travail"
      ],
      correctIndex: 1
    },
    {
      id: "q10",
      question: "Quel est le but principal d'un entretien 'one-on-one' regulier ?",
      options: [
        "Verifier si le collaborateur arrive a l'heure",
        "Creer un espace d'echange pour discuter des progres, defis, objectifs et bien-etre du collaborateur",
        "Assigner de nouvelles taches urgentes",
        "Negocier les augmentations de salaire"
      ],
      correctIndex: 1
    },
    {
      id: "q11",
      question: "Qu'est-ce que la gestion de conflit en equipe ?",
      options: [
        "Eviter tout desaccord a tout prix",
        "Identifier, aborder et resoudre les tensions de maniere constructive pour maintenir la cohesion",
        "Toujours donner raison au manager",
        "Separer les personnes en conflit dans des equipes differentes"
      ],
      correctIndex: 1
    },
    {
      id: "q12",
      question: "Qu'est-ce que le 'situational leadership' (leadership situationnel) ?",
      options: [
        "Un style de leadership fixe quelle que soit la situation",
        "L'adaptation du style de leadership au niveau de maturite et de competence du collaborateur",
        "Le leadership exerce uniquement dans les situations de crise",
        "Le changement de leader a chaque nouveau projet"
      ],
      correctIndex: 1
    },
    {
      id: "q13",
      question: "Qu'est-ce que la 'psychological safety' (securite psychologique) en equipe ?",
      options: [
        "La securite physique des locaux de travail",
        "Un environnement ou les membres se sentent en confiance pour prendre des risques et exprimer leurs idees sans crainte",
        "Une assurance sante mentale pour les employes",
        "L'absence totale de stress au travail"
      ],
      correctIndex: 1
    },
    {
      id: "q14",
      question: "Quel est le principal avantage de la diversite dans une equipe ?",
      options: [
        "Reduire les couts de recrutement",
        "Apporter des perspectives variees qui favorisent l'innovation et la resolution de problemes complexes",
        "Simplifier la communication interne",
        "Reduire le nombre de reunions"
      ],
      correctIndex: 1
    },
    {
      id: "q15",
      question: "Qu'est-ce que la methode OKR (Objectives and Key Results) ?",
      options: [
        "Un outil de comptabilite",
        "Un framework de definition d'objectifs ambitieux avec des resultats cles mesurables",
        "Un logiciel de gestion de projet",
        "Un type de contrat de travail"
      ],
      correctIndex: 1
    },
    {
      id: "q16",
      question: "Qu'est-ce que le 'burnout' professionnel ?",
      options: [
        "Un incendie dans les locaux de l'entreprise",
        "Un etat d'epuisement physique, emotionnel et mental cause par un stress professionnel prolonge",
        "Une promotion rapide dans l'entreprise",
        "Un type de formation intensive"
      ],
      correctIndex: 1
    },
    {
      id: "q17",
      question: "Qu'est-ce que le 'coaching' en management ?",
      options: [
        "Donner des ordres stricts aux collaborateurs",
        "Accompagner un collaborateur pour l'aider a developper ses competences et atteindre ses objectifs",
        "Remplacer un collaborateur absent",
        "Evaluer les performances annuelles"
      ],
      correctIndex: 1
    },
    {
      id: "q18",
      question: "Qu'est-ce que la 'culture d'entreprise' ?",
      options: [
        "Les activites culturelles organisees par le comite d'entreprise",
        "L'ensemble des valeurs, croyances, comportements et normes qui definissent l'identite de l'organisation",
        "Le nombre de livres dans la bibliotheque de l'entreprise",
        "Les cours de langue offerts aux employes"
      ],
      correctIndex: 1
    },
    {
      id: "q19",
      question: "Quel est le principe du 'management by walking around' (MBWA) ?",
      options: [
        "Obliger les employes a marcher pour aller aux reunions",
        "Le manager se deplace regulierement pour echanger de maniere informelle avec les equipes sur le terrain",
        "Un programme de bien-etre au travail par la marche",
        "L'installation de bureaux debout pour tous"
      ],
      correctIndex: 1
    },
    {
      id: "q20",
      question: "Pourquoi la reconnaissance est-elle importante en management ?",
      options: [
        "Elle augmente les couts salariaux de l'entreprise",
        "Elle renforce la motivation, l'engagement et la retention des collaborateurs",
        "Elle cree de la competition negative entre collegues",
        "Elle est uniquement utile lors des evaluations annuelles"
      ],
      correctIndex: 1
    }
  ],

  // ============================================================
  // 31. cert-entrepreneuriat — Entrepreneuriat & Startup
  // ============================================================
  "cert-entrepreneuriat": [
    {
      id: "q1",
      question: "Qu'est-ce que le Business Model Canvas ?",
      options: [
        "Un tableau artistique pour decorer les bureaux de la startup",
        "Un outil visuel d'une page decrivant les 9 composantes cles d'un modele economique",
        "Un logiciel de comptabilite pour startups",
        "Un formulaire d'inscription pour les accelerateurs"
      ],
      correctIndex: 1
    },
    {
      id: "q2",
      question: "Qu'est-ce que la methode Lean Startup ?",
      options: [
        "Une methode pour reduire les effectifs de l'entreprise",
        "Une approche iterative basee sur le cycle Construire-Mesurer-Apprendre pour valider rapidement des hypotheses",
        "Une methode de comptabilite alleguee",
        "Un programme de perte de poids pour entrepreneurs"
      ],
      correctIndex: 1
    },
    {
      id: "q3",
      question: "Qu'est-ce qu'un 'pivot' dans le contexte startup ?",
      options: [
        "Le demenagement des bureaux de l'entreprise",
        "Un changement strategique fondamental du modele d'affaires base sur les retours du marche",
        "La rotation du CEO tous les 6 mois",
        "Le lancement d'un nouveau produit identique au premier"
      ],
      correctIndex: 1
    },
    {
      id: "q4",
      question: "Qu'est-ce que le 'bootstrapping' ?",
      options: [
        "Une technique de marketing viral",
        "Financer sa startup avec ses propres ressources sans levee de fonds externe",
        "Un type de contrat de franchise",
        "Un logiciel open source"
      ],
      correctIndex: 1
    },
    {
      id: "q5",
      question: "Qu'est-ce qu'un 'pitch deck' ?",
      options: [
        "Une terrasse amenagee pour les reunions en plein air",
        "Une presentation courte et visuelle destinee a convaincre des investisseurs",
        "Un dossier juridique pour creer une entreprise",
        "Un outil de gestion de projet"
      ],
      correctIndex: 1
    },
    {
      id: "q6",
      question: "Que signifie le terme 'runway' pour une startup ?",
      options: [
        "La piste d'atterrissage de l'aeroport le plus proche",
        "Le temps pendant lequel la startup peut fonctionner avec sa tresorerie actuelle avant d'epuiser ses fonds",
        "Le chiffre d'affaires mensuel",
        "Le nombre de clients actifs"
      ],
      correctIndex: 1
    },
    {
      id: "q7",
      question: "Qu'est-ce qu'une levee de fonds en Serie A ?",
      options: [
        "Le premier investissement personnel du fondateur",
        "Le premier tour de financement institutionnel significatif, generalement pour accelerer la croissance apres validation du produit",
        "Un pret bancaire classique",
        "Une campagne de crowdfunding"
      ],
      correctIndex: 1
    },
    {
      id: "q8",
      question: "Qu'est-ce qu'un 'burn rate' ?",
      options: [
        "Le taux de rotation du personnel",
        "Le rythme auquel une startup depense sa tresorerie (generalement mensuel)",
        "Le taux de retour produit",
        "La vitesse de production"
      ],
      correctIndex: 1
    },
    {
      id: "q9",
      question: "Qu'est-ce qu'un accelerateur de startups ?",
      options: [
        "Un logiciel pour accelerer le developpement",
        "Un programme intensif offrant mentorat, financement et reseau en echange d'une part de capital",
        "Un vehicule de transport pour entrepreneurs",
        "Un type de pret bancaire a taux reduit"
      ],
      correctIndex: 1
    },
    {
      id: "q10",
      question: "Qu'est-ce que le 'TAM SAM SOM' ?",
      options: [
        "Trois fondateurs celebres de la Silicon Valley",
        "Trois niveaux d'estimation de la taille du marche : Total, Serviceable, Obtainable",
        "Trois types de structures juridiques",
        "Trois etapes de la levee de fonds"
      ],
      correctIndex: 1
    },
    {
      id: "q11",
      question: "Qu'est-ce qu'un 'business angel' ?",
      options: [
        "Un comptable specialise dans les startups",
        "Un investisseur individuel qui finance des startups en phase de demarrage, souvent avec du mentorat",
        "Un avocat d'affaires",
        "Un consultant en strategie"
      ],
      correctIndex: 1
    },
    {
      id: "q12",
      question: "Qu'est-ce que le 'customer development' de Steve Blank ?",
      options: [
        "Le developpement de logiciels pour les clients",
        "Une methodologie pour decouvrir et valider les clients, leur probleme et la solution avant de scaler",
        "Un programme de fidelite client",
        "La formation du service client"
      ],
      correctIndex: 1
    },
    {
      id: "q13",
      question: "Qu'est-ce qu'un 'unicorn' (licorne) dans l'ecosysteme startup ?",
      options: [
        "Un produit qui n'a jamais ete vendu",
        "Une startup valorisee a plus d'un milliard de dollars",
        "Un entrepreneur qui a echoue trois fois",
        "Un investisseur anonyme"
      ],
      correctIndex: 1
    },
    {
      id: "q14",
      question: "Qu'est-ce que le 'freemium' comme modele economique ?",
      options: [
        "Un produit entierement gratuit sans aucune monetisation",
        "Un modele offrant une version gratuite de base et une version payante avec des fonctionnalites avancees",
        "Un modele uniquement par abonnement annuel",
        "Un modele de vente physique en magasin"
      ],
      correctIndex: 1
    },
    {
      id: "q15",
      question: "Qu'est-ce que la 'due diligence' lors d'une levee de fonds ?",
      options: [
        "La redaction du pitch deck",
        "L'audit approfondi de la startup par l'investisseur avant d'investir (finances, juridique, produit, equipe)",
        "La celebration de la signature de l'investissement",
        "La premiere reunion avec un investisseur"
      ],
      correctIndex: 1
    },
    {
      id: "q16",
      question: "Qu'est-ce qu'un 'co-founder' (co-fondateur) ideal apporte a une startup ?",
      options: [
        "Le meme profil et les memes competences que le fondateur",
        "Des competences complementaires, une vision partagee et un engagement egal",
        "Uniquement du capital financier",
        "Un reseau social avec beaucoup d'abonnes"
      ],
      correctIndex: 1
    },
    {
      id: "q17",
      question: "Qu'est-ce que le 'product-market fit' signal le plus fiable ?",
      options: [
        "Le fondateur est convaincu que son produit est excellent",
        "Les utilisateurs reviennent regulierement, recommandent le produit et la croissance est organique",
        "Le site web a un beau design",
        "L'entreprise a leve beaucoup de fonds"
      ],
      correctIndex: 1
    },
    {
      id: "q18",
      question: "Qu'est-ce qu'un 'term sheet' ?",
      options: [
        "Une feuille de paie pour les employes",
        "Un document non contraignant resumant les conditions principales d'un investissement",
        "Un contrat de travail definitif",
        "Une facture pour les services de conseil"
      ],
      correctIndex: 1
    },
    {
      id: "q19",
      question: "Qu'est-ce que le 'growth hacking' ?",
      options: [
        "Le piratage informatique pour faire croitre une entreprise",
        "Des techniques creatives et analytiques a faible cout pour acquerir et retenir des utilisateurs rapidement",
        "L'embauche massive de commerciaux",
        "L'achat de publicites televisees couteuses"
      ],
      correctIndex: 1
    },
    {
      id: "q20",
      question: "Qu'est-ce que la 'scalabilite' d'un business model ?",
      options: [
        "La capacite a reduire les effectifs rapidement",
        "La capacite a augmenter significativement les revenus sans augmenter proportionnellement les couts",
        "La capacite a changer de secteur d'activite",
        "La capacite a demenager dans un bureau plus grand"
      ],
      correctIndex: 1
    }
  ],

  // ============================================================
  // 32. cert-service-client — Service Client & Support
  // ============================================================
  "cert-service-client": [
    {
      id: "q1",
      question: "Que signifie NPS (Net Promoter Score) ?",
      options: [
        "Le nombre total de produits vendus",
        "Un indicateur mesurant la probabilite qu'un client recommande l'entreprise (de 0 a 10)",
        "Le nouveau prix de vente standard",
        "Le nombre de plaintes par semaine"
      ],
      correctIndex: 1
    },
    {
      id: "q2",
      question: "Que mesure le CSAT (Customer Satisfaction Score) ?",
      options: [
        "Le chiffre d'affaires annuel",
        "Le niveau de satisfaction du client apres une interaction ou un achat specifique",
        "Le cout du service apres-vente",
        "Le nombre d'agents du support"
      ],
      correctIndex: 1
    },
    {
      id: "q3",
      question: "Qu'est-ce qu'un systeme de ticketing ?",
      options: [
        "Un systeme de vente de billets de concert",
        "Un outil qui enregistre, suit et gere les demandes des clients de la creation a la resolution",
        "Un programme de fidelite avec des points",
        "Un outil de facturation automatique"
      ],
      correctIndex: 1
    },
    {
      id: "q4",
      question: "Qu'est-ce que l'escalation dans le support client ?",
      options: [
        "L'augmentation du prix des produits",
        "Le transfert d'un probleme a un niveau superieur d'expertise ou d'autorite quand il ne peut etre resolu au niveau actuel",
        "L'aggravation deliberee d'un conflit",
        "L'installation d'un escalator dans les locaux"
      ],
      correctIndex: 1
    },
    {
      id: "q5",
      question: "Qu'est-ce que le 'first contact resolution' (FCR) ?",
      options: [
        "Le premier contact commercial avec un prospect",
        "La resolution du probleme du client des le premier contact sans necessiter de suivi",
        "Le premier message envoye par le chatbot",
        "La premiere vente realisee par un nouvel agent"
      ],
      correctIndex: 1
    },
    {
      id: "q6",
      question: "Qu'est-ce qu'une base de connaissances (knowledge base) en support ?",
      options: [
        "Un examen d'entree pour les agents de support",
        "Un repertoire organise d'articles, FAQ et guides permettant aux clients et agents de trouver des reponses",
        "La liste des diplomes des employes",
        "Un logiciel de formation en ligne"
      ],
      correctIndex: 1
    },
    {
      id: "q7",
      question: "Qu'est-ce que le 'SLA' (Service Level Agreement) ?",
      options: [
        "Un logiciel de gestion des ventes",
        "Un accord definissant les niveaux de service garantis (temps de reponse, temps de resolution, disponibilite)",
        "Le salaire des agents de support",
        "Un type de contrat d'assurance"
      ],
      correctIndex: 1
    },
    {
      id: "q8",
      question: "Qu'est-ce que le support 'omnicanal' ?",
      options: [
        "Un support disponible uniquement par telephone",
        "Un support unifie sur tous les canaux (email, chat, telephone, reseaux sociaux) avec un historique partage",
        "Un support reserve aux clients premium",
        "Un support automatise sans intervention humaine"
      ],
      correctIndex: 1
    },
    {
      id: "q9",
      question: "Pourquoi l'empathie est-elle essentielle dans le service client ?",
      options: [
        "Elle permet d'eviter les remboursements",
        "Elle permet de comprendre le ressenti du client et de creer une connexion qui facilite la resolution",
        "Elle est obligatoire par la loi",
        "Elle augmente le prix des produits vendus"
      ],
      correctIndex: 1
    },
    {
      id: "q10",
      question: "Qu'est-ce que le 'customer effort score' (CES) ?",
      options: [
        "Le cout d'acquisition d'un client",
        "Un indicateur mesurant l'effort que le client doit fournir pour obtenir une reponse ou resoudre son probleme",
        "Le score de performance des agents",
        "Le nombre d'appels recus par jour"
      ],
      correctIndex: 1
    },
    {
      id: "q11",
      question: "Qu'est-ce que le 'churn prevention' en service client ?",
      options: [
        "La prevention des pannes informatiques",
        "Les actions proactives pour identifier et retenir les clients a risque de depart",
        "La prevention des accidents dans les locaux",
        "L'augmentation des prix pour compenser les pertes"
      ],
      correctIndex: 1
    },
    {
      id: "q12",
      question: "Quel est l'avantage principal du support en libre-service (self-service) ?",
      options: [
        "Il remplace totalement le besoin d'agents humains",
        "Il permet aux clients de trouver des reponses 24/7 et reduit la charge de l'equipe support",
        "Il est plus couteux que le support telephone",
        "Il est uniquement disponible en anglais"
      ],
      correctIndex: 1
    },
    {
      id: "q13",
      question: "Qu'est-ce qu'un 'chatbot' dans le service client ?",
      options: [
        "Un agent humain qui repond aux chats",
        "Un programme automatise capable de repondre aux questions courantes des clients par chat",
        "Un salon de discussion entre agents du support",
        "Un outil de surveillance des reseaux sociaux"
      ],
      correctIndex: 1
    },
    {
      id: "q14",
      question: "Qu'est-ce que le 'time to first response' (TTFR) ?",
      options: [
        "Le temps de formation d'un nouvel agent",
        "Le delai entre la soumission d'une demande par le client et la premiere reponse de l'equipe support",
        "Le temps total de resolution du ticket",
        "La duree d'un appel telephonique moyen"
      ],
      correctIndex: 1
    },
    {
      id: "q15",
      question: "Comment gerer un client en colere de maniere professionnelle ?",
      options: [
        "Raccrocher immediatement pour eviter le conflit",
        "Ecouter activement, reconnaitre le probleme, s'excuser si necessaire, et proposer une solution concrete",
        "Transmettre directement au manager sans essayer de resoudre",
        "Repondre sur le meme ton pour montrer qu'on ne se laisse pas faire"
      ],
      correctIndex: 1
    },
    {
      id: "q16",
      question: "Qu'est-ce que le 'proactive support' ?",
      options: [
        "Attendre que les clients contactent le support",
        "Anticiper les problemes et contacter les clients avant qu'ils ne rencontrent des difficultes",
        "Augmenter le nombre d'agents au support",
        "Exiger que les clients lisent la FAQ avant de contacter le support"
      ],
      correctIndex: 1
    },
    {
      id: "q17",
      question: "Qu'est-ce que le 'customer journey mapping' applique au support ?",
      options: [
        "La cartographie geographique des clients",
        "La visualisation de tous les points de contact entre le client et le support pour identifier les points de friction",
        "Le GPS utilise pour les livraisons",
        "Le planning des deplacements des agents"
      ],
      correctIndex: 1
    },
    {
      id: "q18",
      question: "Quel outil est couramment utilise pour le support client ?",
      options: [
        "Adobe Photoshop",
        "Zendesk, Freshdesk ou Intercom",
        "Microsoft PowerPoint",
        "Google Earth"
      ],
      correctIndex: 1
    },
    {
      id: "q19",
      question: "Qu'est-ce que le 'ticket backlog' en support ?",
      options: [
        "L'historique des tickets resolus",
        "L'accumulation de tickets non resolus en attente de traitement",
        "La sauvegarde automatique des conversations",
        "La liste des agents en conge"
      ],
      correctIndex: 1
    },
    {
      id: "q20",
      question: "Pourquoi est-il important de mesurer le 'average handle time' (AHT) ?",
      options: [
        "Pour punir les agents les plus lents",
        "Pour equilibrer efficacite (temps de traitement) et qualite de service afin d'optimiser les ressources",
        "Pour facturer les clients au temps passe",
        "Pour determiner les horaires d'ouverture du support"
      ],
      correctIndex: 1
    }
  ],

  // ============================================================
  // 33. cert-community — Community Management
  // ============================================================
  "cert-community": [
    {
      id: "q1",
      question: "Quel est le role principal d'un community manager ?",
      options: [
        "Developper le code du site web de l'entreprise",
        "Animer, federer et faire croitre la communaute en ligne autour de la marque",
        "Gerer la comptabilite de l'entreprise",
        "Concevoir les produits physiques de la marque"
      ],
      correctIndex: 1
    },
    {
      id: "q2",
      question: "Qu'est-ce que le taux d'engagement sur les reseaux sociaux ?",
      options: [
        "Le nombre total d'abonnes",
        "Le ratio entre les interactions (likes, commentaires, partages) et le nombre de personnes atteintes",
        "Le budget publicitaire depense",
        "Le nombre de publications par mois"
      ],
      correctIndex: 1
    },
    {
      id: "q3",
      question: "Qu'est-ce que la moderation de communaute ?",
      options: [
        "La suppression de tous les commentaires",
        "La surveillance et la gestion des contenus publies pour assurer le respect des regles et un environnement sain",
        "La publication de contenus uniquement par le community manager",
        "L'interdiction de tout debat dans la communaute"
      ],
      correctIndex: 1
    },
    {
      id: "q4",
      question: "Qu'est-ce qu'une crise sur les reseaux sociaux (bad buzz) ?",
      options: [
        "Une panne technique du serveur",
        "Une situation ou la marque fait face a des reactions negatives massives et virales en ligne",
        "Un manque de contenu a publier",
        "Une baisse du nombre d'abonnes de 1%"
      ],
      correctIndex: 1
    },
    {
      id: "q5",
      question: "Quelle est la premiere etape pour gerer une crise sur les reseaux sociaux ?",
      options: [
        "Supprimer tous les commentaires negatifs",
        "Reconnaitre le probleme rapidement, montrer que la marque est a l'ecoute et communiquer de maniere transparente",
        "Desactiver tous les comptes sociaux",
        "Ignorer la situation en esperant qu'elle passe"
      ],
      correctIndex: 1
    },
    {
      id: "q6",
      question: "Qu'est-ce que le 'reach organique' sur les reseaux sociaux ?",
      options: [
        "Le nombre de personnes atteintes grace a la publicite payante",
        "Le nombre de personnes atteintes naturellement sans promotion payante",
        "Le nombre total d'abonnes du compte",
        "Le nombre de hashtags utilises"
      ],
      correctIndex: 1
    },
    {
      id: "q7",
      question: "Qu'est-ce qu'un calendrier de publication en community management ?",
      options: [
        "Le calendrier des vacances de l'equipe marketing",
        "Un planning organisant les contenus a publier par date, heure, plateforme et format",
        "Le calendrier des evenements de l'industrie",
        "La liste des jours feries"
      ],
      correctIndex: 1
    },
    {
      id: "q8",
      question: "Qu'est-ce que le 'social listening' ?",
      options: [
        "Ecouter de la musique pendant le travail",
        "La surveillance et l'analyse des conversations en ligne mentionnant la marque, le secteur ou les concurrents",
        "L'envoi de messages prives a tous les abonnes",
        "L'ecoute des appels telephoniques du service client"
      ],
      correctIndex: 1
    },
    {
      id: "q9",
      question: "Quel KPI mesure la croissance de la communaute ?",
      options: [
        "Le taux de rebond du site web",
        "L'evolution du nombre d'abonnes / membres sur une periode donnee",
        "Le nombre de pages vues du blog",
        "Le chiffre d'affaires mensuel"
      ],
      correctIndex: 1
    },
    {
      id: "q10",
      question: "Qu'est-ce qu'un 'ambassadeur de marque' dans le contexte communautaire ?",
      options: [
        "Un employe du service marketing",
        "Un membre actif et enthousiaste de la communaute qui recommande et defend la marque spontanement",
        "Un influenceur paye pour promouvoir la marque",
        "Le CEO de l'entreprise"
      ],
      correctIndex: 1
    },
    {
      id: "q11",
      question: "Pourquoi est-il important de repondre rapidement aux commentaires et messages ?",
      options: [
        "Pour augmenter artificiellement le nombre de commentaires",
        "Pour montrer que la marque est reactive et attentive, ce qui renforce la confiance et l'engagement",
        "Pour eviter les amendes des plateformes",
        "Pour atteindre un objectif de nombre de mots publies"
      ],
      correctIndex: 1
    },
    {
      id: "q12",
      question: "Qu'est-ce que le 'user-generated content' (UGC) en community management ?",
      options: [
        "Du contenu cree par l'agence de communication",
        "Du contenu cree et partage par les membres de la communaute eux-memes",
        "Du contenu genere par intelligence artificielle",
        "Du contenu copie depuis d'autres marques"
      ],
      correctIndex: 1
    },
    {
      id: "q13",
      question: "Qu'est-ce qu'un 'troll' en ligne ?",
      options: [
        "Un utilisateur tres actif et positif",
        "Un utilisateur qui publie des messages provocateurs ou hors sujet pour susciter des reactions negatives",
        "Un robot automatise qui publie du spam",
        "Un moderateur de la communaute"
      ],
      correctIndex: 1
    },
    {
      id: "q14",
      question: "Comment gerer un troll dans une communaute ?",
      options: [
        "Repondre agressivement pour le dissuader",
        "Ne pas alimenter la provocation, appliquer les regles de moderation, avertir puis bannir si necessaire",
        "Ignorer toutes les critiques sans distinction",
        "Publier les informations personnelles du troll"
      ],
      correctIndex: 1
    },
    {
      id: "q15",
      question: "Qu'est-ce qu'une 'charte de communaute' ?",
      options: [
        "Le budget annuel de la communaute",
        "Un document definissant les regles de conduite, les comportements acceptes et interdits dans la communaute",
        "Le CV du community manager",
        "La liste des hashtags de la marque"
      ],
      correctIndex: 1
    },
    {
      id: "q16",
      question: "Quel outil est couramment utilise pour planifier les publications sur les reseaux sociaux ?",
      options: [
        "Microsoft Excel uniquement",
        "Hootsuite, Buffer ou Sprout Social",
        "Adobe Illustrator",
        "Google Maps"
      ],
      correctIndex: 1
    },
    {
      id: "q17",
      question: "Qu'est-ce que le 'sentiment analysis' en community management ?",
      options: [
        "L'analyse des emotions du community manager",
        "L'analyse automatisee du ton (positif, negatif, neutre) des mentions et commentaires en ligne",
        "Un sondage de satisfaction envoye par email",
        "L'analyse du budget publicitaire"
      ],
      correctIndex: 1
    },
    {
      id: "q18",
      question: "Pourquoi la regularite des publications est-elle importante ?",
      options: [
        "Pour que l'algorithme de la plateforme favorise le contenu et pour maintenir l'engagement de la communaute",
        "Pour remplir un quota impose par les reseaux sociaux",
        "Pour eviter la suppression du compte",
        "Parce que les publications irregulaires sont plus vues"
      ],
      correctIndex: 0
    },
    {
      id: "q19",
      question: "Qu'est-ce qu'un 'live' (diffusion en direct) apporte a la communaute ?",
      options: [
        "Rien de particulier, c'est un format peu efficace",
        "Un moment d'interaction authentique et en temps reel qui renforce le lien entre la marque et sa communaute",
        "Une augmentation automatique du nombre d'abonnes",
        "Une reduction des couts publicitaires"
      ],
      correctIndex: 1
    },
    {
      id: "q20",
      question: "Qu'est-ce que le 'community-led growth' ?",
      options: [
        "La croissance obtenue uniquement par la publicite payante",
        "Une strategie de croissance ou la communaute elle-meme genere de la valeur, du contenu et attire de nouveaux membres",
        "La croissance du nombre de community managers",
        "L'augmentation du budget de la communaute"
      ],
      correctIndex: 1
    }
  ],

  // ============================================================
  // 34. cert-relation-publique — Relations Publiques & Communication
  // ============================================================
  "cert-relation-publique": [
    {
      id: "q1",
      question: "Qu'est-ce qu'un communique de presse ?",
      options: [
        "Un article d'opinion publie dans un journal",
        "Un document officiel adresse aux medias pour annoncer une nouvelle ou un evenement",
        "Un email interne envoye aux employes",
        "Un post publie sur les reseaux sociaux"
      ],
      correctIndex: 1
    },
    {
      id: "q2",
      question: "Qu'est-ce que les 'media relations' (relations medias) ?",
      options: [
        "L'achat d'espaces publicitaires dans les medias",
        "La construction et le maintien de relations avec les journalistes et les medias pour obtenir une couverture editoriale",
        "La publication de contenus sur les reseaux sociaux",
        "La gestion des abonnements aux journaux"
      ],
      correctIndex: 1
    },
    {
      id: "q3",
      question: "Qu'est-ce que la communication de crise ?",
      options: [
        "La communication pendant les periodes de vente",
        "La gestion strategique de la communication lors d'un evenement menacant la reputation de l'organisation",
        "La communication entre les departements internes",
        "La publicite pendant les fetes de fin d'annee"
      ],
      correctIndex: 1
    },
    {
      id: "q4",
      question: "Quel est le premier reflexe en communication de crise ?",
      options: [
        "Nier les faits pour proteger l'image de l'entreprise",
        "Reagir rapidement, reconnaitre la situation et communiquer de maniere transparente",
        "Attendre que la crise passe d'elle-meme",
        "Blamer les medias pour leur couverture"
      ],
      correctIndex: 1
    },
    {
      id: "q5",
      question: "Qu'est-ce que le 'earned media' ?",
      options: [
        "La publicite payante dans les medias traditionnels",
        "La couverture mediatique obtenue gratuitement grace a la valeur de l'information (articles, mentions, interviews)",
        "Les contenus publies sur ses propres canaux",
        "Les publicites sur les reseaux sociaux"
      ],
      correctIndex: 1
    },
    {
      id: "q6",
      question: "Qu'est-ce qu'un 'media kit' (dossier de presse) ?",
      options: [
        "Un kit de nettoyage pour ecrans",
        "Un ensemble de documents (bio, photos, chiffres cles, communiques) fourni aux journalistes pour faciliter la couverture",
        "Un abonnement a une plateforme de veille media",
        "Un logiciel de montage video"
      ],
      correctIndex: 1
    },
    {
      id: "q7",
      question: "Qu'est-ce que la 'veille mediatique' ?",
      options: [
        "Regarder la television toute la nuit",
        "La surveillance systematique des mentions de la marque, du secteur et des concurrents dans les medias",
        "La lecture du journal le matin",
        "L'ecoute de la radio pendant le trajet"
      ],
      correctIndex: 1
    },
    {
      id: "q8",
      question: "Qu'est-ce que le 'storytelling corporate' ?",
      options: [
        "La lecture de contes aux employes",
        "L'utilisation de recits et d'histoires pour communiquer les valeurs, la mission et la vision de l'entreprise",
        "La redaction de rapports financiers",
        "La creation de jeux pour les evenements d'entreprise"
      ],
      correctIndex: 1
    },
    {
      id: "q9",
      question: "Qu'est-ce qu'un 'porte-parole' d'entreprise ?",
      options: [
        "Un employe qui repond au telephone",
        "Une personne officiellement designee pour representer et communiquer au nom de l'organisation aupres des medias",
        "Le responsable informatique",
        "Un stagiaire en communication"
      ],
      correctIndex: 1
    },
    {
      id: "q10",
      question: "Qu'est-ce que le 'owned media' ?",
      options: [
        "Les medias detenus par des concurrents",
        "Les canaux de communication que l'entreprise possede et controle (site web, blog, newsletter, reseaux sociaux)",
        "Les publicites payantes en ligne",
        "Les articles de presse non sollicites"
      ],
      correctIndex: 1
    },
    {
      id: "q11",
      question: "Qu'est-ce qu'une conference de presse ?",
      options: [
        "Une reunion interne entre managers",
        "Un evenement organise pour presenter une annonce aux journalistes et repondre a leurs questions",
        "Un cours de formation pour les journalistes",
        "Un debat televise entre politiciens"
      ],
      correctIndex: 1
    },
    {
      id: "q12",
      question: "Qu'est-ce que l'e-reputation ?",
      options: [
        "Le nombre d'emails recus par jour",
        "L'image et la perception d'une personne ou d'une marque sur internet",
        "Le classement du site dans les moteurs de recherche",
        "Le nombre d'abonnes sur les reseaux sociaux uniquement"
      ],
      correctIndex: 1
    },
    {
      id: "q13",
      question: "Qu'est-ce que le 'paid media' ?",
      options: [
        "Les articles redactionnels gratuits dans la presse",
        "Tout espace mediatique obtenu contre paiement (publicites, contenus sponsorises, placements produits)",
        "Les commentaires positifs laisses par les clients",
        "Les communiques de presse envoyes gratuitement"
      ],
      correctIndex: 1
    },
    {
      id: "q14",
      question: "Pourquoi un plan de communication de crise doit-il etre prepare en amont ?",
      options: [
        "Pour avoir quelque chose a lire pendant les temps morts",
        "Pour pouvoir reagir rapidement et de maniere coherente quand la crise survient, sans panique",
        "Parce que les assurances l'exigent",
        "Pour impressionner les investisseurs"
      ],
      correctIndex: 1
    },
    {
      id: "q15",
      question: "Qu'est-ce que le 'media training' ?",
      options: [
        "La formation des journalistes",
        "La preparation des dirigeants et porte-parole aux interviews et interactions avec les medias",
        "La formation a l'utilisation des reseaux sociaux",
        "Un cours de production video"
      ],
      correctIndex: 1
    },
    {
      id: "q16",
      question: "Qu'est-ce que la 'communication interne' ?",
      options: [
        "La communication avec les clients",
        "L'ensemble des actions de communication destinees aux collaborateurs de l'organisation",
        "La communication avec les fournisseurs",
        "La communication avec les medias"
      ],
      correctIndex: 1
    },
    {
      id: "q17",
      question: "Qu'est-ce qu'un 'key message' (message cle) en RP ?",
      options: [
        "Le mot de passe du compte social media",
        "Un message principal, clair et concis que l'organisation souhaite faire passer dans toute sa communication",
        "Le slogan publicitaire",
        "Le sujet de l'email de bienvenue"
      ],
      correctIndex: 1
    },
    {
      id: "q18",
      question: "Qu'est-ce que le 'lobbying' ?",
      options: [
        "La decoration du hall d'accueil de l'entreprise",
        "Les actions visant a influencer les decisions des pouvoirs publics en faveur d'interets particuliers",
        "La gestion des files d'attente a l'accueil",
        "Le nettoyage des bureaux"
      ],
      correctIndex: 1
    },
    {
      id: "q19",
      question: "Qu'est-ce que la RSE (Responsabilite Societale des Entreprises) en communication ?",
      options: [
        "Le rapport financier de l'entreprise",
        "La communication sur les engagements sociaux, environnementaux et ethiques de l'entreprise",
        "Le reglement interieur de l'entreprise",
        "Le service de reclamation"
      ],
      correctIndex: 1
    },
    {
      id: "q20",
      question: "Comment mesure-t-on l'impact des actions de relations publiques ?",
      options: [
        "Uniquement par le nombre de communiques envoyes",
        "Par des indicateurs comme les retombees presse, le sentiment, la portee, l'engagement et l'evolution de la notoriete",
        "En comptant le nombre de journalistes rencontres",
        "Par le budget depense uniquement"
      ],
      correctIndex: 1
    }
  ],

  // ============================================================
  // 35. cert-presentation — Art de la Presentation
  // ============================================================
  "cert-presentation": [
    {
      id: "q1",
      question: "Qu'est-ce que le storytelling applique a une presentation ?",
      options: [
        "Lire un texte mot a mot depuis ses diapositives",
        "Structurer sa presentation comme un recit avec un debut, un developpement et une fin pour captiver l'audience",
        "Raconter des blagues tout au long de la presentation",
        "Presenter uniquement des graphiques sans explication"
      ],
      correctIndex: 1
    },
    {
      id: "q2",
      question: "Quelle est la regle '10-20-30' de Guy Kawasaki pour les presentations ?",
      options: [
        "10 heures de preparation, 20 diapositives, 30 minutes de questions",
        "10 diapositives maximum, 20 minutes maximum, police de 30 points minimum",
        "10 couleurs, 20 images, 30 transitions",
        "10 intervenants, 20 sujets, 30 secondes par sujet"
      ],
      correctIndex: 1
    },
    {
      id: "q3",
      question: "Quel est le principal defaut des diapositives surchargees de texte ?",
      options: [
        "Elles sont trop rapides a preparer",
        "L'audience lit les diapositives au lieu d'ecouter le presentateur, ce qui reduit l'impact du message",
        "Elles sont plus belles visuellement",
        "Elles facilitent la memorisation"
      ],
      correctIndex: 1
    },
    {
      id: "q4",
      question: "Qu'est-ce que le 'public speaking anxiety' (trac) et comment le gerer ?",
      options: [
        "C'est un trouble incurable qu'on ne peut pas surmonter",
        "C'est une anxiete naturelle qu'on peut reduire par la preparation, la respiration et la pratique",
        "C'est un signe qu'on ne devrait jamais parler en public",
        "C'est exclusivement cause par un manque de connaissances sur le sujet"
      ],
      correctIndex: 1
    },
    {
      id: "q5",
      question: "Qu'est-ce que la 'regle des 3' en presentation ?",
      options: [
        "Ne presenter que 3 minutes maximum",
        "Structurer le contenu autour de 3 idees principales car le cerveau retient mieux les informations par groupes de 3",
        "Utiliser exactement 3 couleurs dans les slides",
        "Inviter 3 personnes maximum dans l'audience"
      ],
      correctIndex: 1
    },
    {
      id: "q6",
      question: "Pourquoi le contact visuel est-il important lors d'une presentation ?",
      options: [
        "Pour verifier si les gens dorment",
        "Pour creer un lien avec l'audience, montrer de la confiance et maintenir l'attention",
        "Pour lire les notes du fond de la salle",
        "Pour eviter de regarder ses diapositives"
      ],
      correctIndex: 1
    },
    {
      id: "q7",
      question: "Qu'est-ce qu'un 'hook' (accroche) en debut de presentation ?",
      options: [
        "Un crochet pour accrocher le micro",
        "Un element percutant (question, statistique, histoire, citation) qui capte immediatement l'attention",
        "Un resume detaille de la conclusion",
        "La liste des sponsors de l'evenement"
      ],
      correctIndex: 1
    },
    {
      id: "q8",
      question: "Quelle est la meilleure pratique pour utiliser les visuels dans une presentation ?",
      options: [
        "Mettre le maximum de texte possible sur chaque diapositive",
        "Utiliser des images de haute qualite, des graphiques clairs et un texte minimal pour soutenir le discours oral",
        "Ne jamais utiliser d'images",
        "Copier-coller des tableaux Excel complets"
      ],
      correctIndex: 1
    },
    {
      id: "q9",
      question: "Qu'est-ce que le 'langage corporel' en prise de parole en public ?",
      options: [
        "Le langage des signes",
        "L'ensemble des gestes, postures, expressions faciales et mouvements qui accompagnent et renforcent le discours",
        "Le choix des vetements pour la presentation",
        "Le volume de la voix uniquement"
      ],
      correctIndex: 1
    },
    {
      id: "q10",
      question: "Pourquoi est-il important de repeter sa presentation a voix haute ?",
      options: [
        "Pour impressionner les collegues dans le bureau",
        "Pour maitriser le timing, identifier les passages difficiles et gagner en aisance et en confiance",
        "Pour verifier que le microphone fonctionne",
        "Pour memoriser chaque mot exactement"
      ],
      correctIndex: 1
    },
    {
      id: "q11",
      question: "Qu'est-ce que la technique du 'silence strategique' ?",
      options: [
        "Ne rien dire pendant toute la presentation",
        "Marquer des pauses deliberees pour souligner un point important et laisser l'audience absorber l'information",
        "Parler tres doucement pour que l'audience se concentre",
        "Eteindre le son des diapositives"
      ],
      correctIndex: 1
    },
    {
      id: "q12",
      question: "Comment structurer efficacement une presentation persuasive ?",
      options: [
        "Commencer par la conclusion puis revenir en arriere",
        "Presenter le probleme, montrer les consequences, puis proposer la solution avec preuves a l'appui",
        "Lister tous les faits sans ordre particulier",
        "Lire un rapport complet de 50 pages"
      ],
      correctIndex: 1
    },
    {
      id: "q13",
      question: "Qu'est-ce que le 'call-to-action' en fin de presentation ?",
      options: [
        "Un appel telephonique a passer apres la presentation",
        "Une action precise que le presentateur demande a l'audience de realiser apres la presentation",
        "Le remerciement final adresse a l'audience",
        "L'invitation au cocktail apres l'evenement"
      ],
      correctIndex: 1
    },
    {
      id: "q14",
      question: "Quelle erreur courante faut-il eviter lors de la gestion des questions ?",
      options: [
        "Ecouter attentivement chaque question",
        "Repondre defensivement ou ignorer les questions difficiles",
        "Reformuler la question avant de repondre",
        "Admettre quand on ne connait pas la reponse"
      ],
      correctIndex: 1
    },
    {
      id: "q15",
      question: "Qu'est-ce que le 'PechaKucha' comme format de presentation ?",
      options: [
        "Un format libre sans contrainte de temps",
        "Un format de 20 diapositives de 20 secondes chacune (6 minutes 40 au total)",
        "Un format reserve aux presentations scientifiques",
        "Un format avec une seule diapositive pendant 2 heures"
      ],
      correctIndex: 1
    },
    {
      id: "q16",
      question: "Pourquoi utiliser des donnees et des statistiques dans une presentation ?",
      options: [
        "Pour rendre la presentation plus longue",
        "Pour etayer ses arguments avec des preuves concretes et renforcer la credibilite",
        "Pour impressionner l'audience avec des chiffres complexes",
        "Parce que toutes les presentations exigent des chiffres"
      ],
      correctIndex: 1
    },
    {
      id: "q17",
      question: "Qu'est-ce que la 'pyramide de Minto' en presentation ?",
      options: [
        "Une forme geometrique pour les diapositives",
        "Un principe de communication structurant le message du plus important au plus detaille (conclusion d'abord)",
        "Un type de graphique en forme de pyramide",
        "Une hierarchie des presentateurs dans l'entreprise"
      ],
      correctIndex: 1
    },
    {
      id: "q18",
      question: "Comment adapter sa presentation a une audience virtuelle (visioconference) ?",
      options: [
        "Presenter exactement comme en salle physique",
        "Raccourcir les sessions, augmenter l'interactivite (sondages, questions), et compenser l'absence de langage corporel visible",
        "Eteindre sa camera pour se concentrer sur les diapositives",
        "Lire ses notes a voix haute sans regarder la camera"
      ],
      correctIndex: 1
    },
    {
      id: "q19",
      question: "Quel outil de presentation permet de creer des diapositives non-lineaires avec un effet de zoom ?",
      options: [
        "Microsoft Word",
        "Prezi",
        "Google Sheets",
        "Adobe Acrobat"
      ],
      correctIndex: 1
    },
    {
      id: "q20",
      question: "Qu'est-ce que l'effet 'primacy-recency' en presentation ?",
      options: [
        "L'importance de la premiere et de la derniere diapositive en termes de design",
        "Le fait que l'audience retient mieux ce qui est dit au debut et a la fin de la presentation",
        "L'ordre alphabetique des sujets abordes",
        "La priorite donnee aux questions les plus recentes"
      ],
      correctIndex: 1
    }
  ],

  // ============================================================
  // 36. cert-comptabilite — Comptabilite & Finance
  // ============================================================
  "cert-comptabilite": [
    {
      id: "q1",
      question: "Qu'est-ce qu'un bilan comptable ?",
      options: [
        "Un rapport des ventes mensuelles",
        "Un document presentant l'actif (ce que l'entreprise possede) et le passif (ce qu'elle doit) a une date donnee",
        "Un planning des depenses futures",
        "Un resume des augmentations de salaire"
      ],
      correctIndex: 1
    },
    {
      id: "q2",
      question: "Qu'est-ce que le compte de resultat ?",
      options: [
        "Le solde du compte bancaire de l'entreprise",
        "Un document qui presente les produits (revenus) et les charges (depenses) sur une periode, determinant le resultat net",
        "La liste des investissements de l'entreprise",
        "Le tableau des emprunts en cours"
      ],
      correctIndex: 1
    },
    {
      id: "q3",
      question: "Qu'est-ce que la TVA (Taxe sur la Valeur Ajoutee) ?",
      options: [
        "Un impot sur les benefices de l'entreprise",
        "Un impot indirect sur la consommation, collecte par les entreprises et reverse a l'Etat",
        "Une cotisation sociale patronale",
        "Un droit de douane sur les importations"
      ],
      correctIndex: 1
    },
    {
      id: "q4",
      question: "Qu'est-ce que la tresorerie d'une entreprise ?",
      options: [
        "Le montant total des ventes annuelles",
        "L'ensemble des liquidites immediatement disponibles (comptes bancaires, caisse)",
        "Le capital social de l'entreprise",
        "Le montant des dettes fournisseurs"
      ],
      correctIndex: 1
    },
    {
      id: "q5",
      question: "Qu'est-ce que l'amortissement en comptabilite ?",
      options: [
        "Le remboursement d'un emprunt bancaire",
        "La repartition du cout d'un actif immobilise sur sa duree d'utilisation estimee",
        "La reduction du capital social",
        "La diminution du chiffre d'affaires"
      ],
      correctIndex: 1
    },
    {
      id: "q6",
      question: "Qu'est-ce que le besoin en fonds de roulement (BFR) ?",
      options: [
        "Le montant necessaire pour creer l'entreprise",
        "Le decalage entre les decaissements et les encaissements lies a l'activite courante",
        "Le benefice net de l'exercice",
        "Le montant des impots a payer"
      ],
      correctIndex: 1
    },
    {
      id: "q7",
      question: "Qu'est-ce qu'une facture en comptabilite ?",
      options: [
        "Un devis pour une prestation future",
        "Un document legal attestant d'une transaction commerciale entre un vendeur et un acheteur",
        "Un bon de commande",
        "Un releve bancaire"
      ],
      correctIndex: 1
    },
    {
      id: "q8",
      question: "Qu'est-ce que le principe de la partie double en comptabilite ?",
      options: [
        "Chaque operation doit etre enregistree deux fois dans le meme compte",
        "Chaque operation est enregistree au debit d'un compte et au credit d'un autre, les totaux devant etre egaux",
        "Les comptes doivent etre verifies par deux comptables differents",
        "Chaque depense doit avoir une recette equivalente"
      ],
      correctIndex: 1
    },
    {
      id: "q9",
      question: "Qu'est-ce que le chiffre d'affaires (CA) ?",
      options: [
        "Le benefice net de l'entreprise",
        "Le total des ventes de biens et services realises par l'entreprise sur une periode (hors taxes)",
        "Le total des charges de l'entreprise",
        "Le solde du compte bancaire"
      ],
      correctIndex: 1
    },
    {
      id: "q10",
      question: "Qu'est-ce qu'une provision en comptabilite ?",
      options: [
        "Un stock de marchandises",
        "Une charge estimee pour couvrir un risque ou une depense probable dont le montant ou la date n'est pas certain",
        "Un versement anticipe d'impots",
        "Un investissement dans un nouveau materiel"
      ],
      correctIndex: 1
    },
    {
      id: "q11",
      question: "Qu'est-ce que le resultat d'exploitation ?",
      options: [
        "Le chiffre d'affaires total",
        "La difference entre les produits d'exploitation et les charges d'exploitation, mesurant la performance operationnelle",
        "Le montant des impots payes",
        "Le capital investi par les actionnaires"
      ],
      correctIndex: 1
    },
    {
      id: "q12",
      question: "Qu'est-ce qu'un plan comptable ?",
      options: [
        "Un plan d'affaires pour investisseurs",
        "Un cadre normalise classant et numerotant les comptes utilises par les entreprises pour enregistrer les operations",
        "Un planning des echeances fiscales",
        "Un budget previsionnel sur 5 ans"
      ],
      correctIndex: 1
    },
    {
      id: "q13",
      question: "Qu'est-ce que le seuil de rentabilite (break-even point) ?",
      options: [
        "Le chiffre d'affaires maximum possible",
        "Le niveau de chiffre d'affaires a partir duquel l'entreprise couvre toutes ses charges et commence a faire du benefice",
        "Le montant minimum du capital social",
        "Le taux d'interet maximum d'un emprunt"
      ],
      correctIndex: 1
    },
    {
      id: "q14",
      question: "Qu'est-ce que la comptabilite analytique (ou de gestion) ?",
      options: [
        "La comptabilite obligatoire pour les declarations fiscales",
        "Un systeme de comptabilite interne qui analyse les couts par produit, service ou activite pour aider a la prise de decision",
        "La comptabilite des associations a but non lucratif",
        "La verification des comptes par un auditeur externe"
      ],
      correctIndex: 1
    },
    {
      id: "q15",
      question: "Qu'est-ce que le cash-flow (flux de tresorerie) ?",
      options: [
        "Le benefice net de l'entreprise",
        "La difference entre les entrees et les sorties de tresorerie sur une periode donnee",
        "Le chiffre d'affaires previsionnel",
        "Le montant des dividendes verses"
      ],
      correctIndex: 1
    },
    {
      id: "q16",
      question: "Qu'est-ce qu'un exercice comptable ?",
      options: [
        "Un examen pour devenir comptable",
        "La periode (generalement 12 mois) pendant laquelle sont enregistrees les operations comptables de l'entreprise",
        "Un exercice de calcul mental",
        "La duree d'un stage en comptabilite"
      ],
      correctIndex: 1
    },
    {
      id: "q17",
      question: "Qu'est-ce que la marge brute ?",
      options: [
        "Le chiffre d'affaires total avant toute deduction",
        "La difference entre le chiffre d'affaires et le cout d'achat des marchandises vendues (ou cout de production)",
        "Le benefice apres impots",
        "Le total des charges d'exploitation"
      ],
      correctIndex: 1
    },
    {
      id: "q18",
      question: "Qu'est-ce qu'un audit comptable ?",
      options: [
        "La preparation de la declaration fiscale",
        "L'examen systematique des comptes et des etats financiers pour verifier leur exactitude et leur conformite",
        "La formation des comptables juniors",
        "La creation de nouveaux comptes comptables"
      ],
      correctIndex: 1
    },
    {
      id: "q19",
      question: "Qu'est-ce que le delai moyen de paiement clients ?",
      options: [
        "Le temps moyen entre la commande et la livraison",
        "Le nombre moyen de jours entre l'emission de la facture et son reglement par le client",
        "Le delai de remboursement des emprunts",
        "Le temps de traitement d'une transaction bancaire"
      ],
      correctIndex: 1
    },
    {
      id: "q20",
      question: "Qu'est-ce que le ratio d'endettement ?",
      options: [
        "Le pourcentage de TVA applicable",
        "Un indicateur mesurant le poids des dettes par rapport aux capitaux propres de l'entreprise",
        "Le taux d'interet moyen des emprunts",
        "Le nombre de creanciers de l'entreprise"
      ],
      correctIndex: 1
    }
  ],

  // ============================================================
  // 37. cert-ecommerce — E-commerce & Vente en Ligne
  // ============================================================
  "cert-ecommerce": [
    {
      id: "q1",
      question: "Qu'est-ce que le taux de conversion en e-commerce ?",
      options: [
        "Le nombre total de visiteurs sur le site",
        "Le pourcentage de visiteurs qui effectuent un achat par rapport au nombre total de visiteurs",
        "Le nombre de produits en stock",
        "Le montant moyen du panier"
      ],
      correctIndex: 1
    },
    {
      id: "q2",
      question: "Qu'est-ce que l'optimisation du checkout (processus de paiement) ?",
      options: [
        "Augmenter le nombre d'etapes de paiement pour plus de securite",
        "Simplifier et fluidifier le parcours de paiement pour reduire les abandons de panier",
        "Ajouter le maximum de champs obligatoires",
        "Supprimer toutes les options de livraison"
      ],
      correctIndex: 1
    },
    {
      id: "q3",
      question: "Qu'est-ce que le 'panier moyen' (average order value) ?",
      options: [
        "Le prix du produit le moins cher du catalogue",
        "Le montant moyen depense par commande sur le site",
        "Le nombre moyen de produits en stock",
        "Le cout moyen de la livraison"
      ],
      correctIndex: 1
    },
    {
      id: "q4",
      question: "Qu'est-ce que le taux d'abandon de panier ?",
      options: [
        "Le pourcentage de produits retournes",
        "Le pourcentage de visiteurs qui ajoutent des produits au panier mais ne finalisent pas l'achat",
        "Le pourcentage de paniers livres en retard",
        "Le nombre de paniers crees par jour"
      ],
      correctIndex: 1
    },
    {
      id: "q5",
      question: "Qu'est-ce que le 'fulfillment' en e-commerce ?",
      options: [
        "La satisfaction du client apres l'achat",
        "L'ensemble des operations logistiques (stockage, preparation, expedition, livraison) pour honorer une commande",
        "Le paiement de la commande",
        "Le design du site web"
      ],
      correctIndex: 1
    },
    {
      id: "q6",
      question: "Qu'est-ce que le 'dropshipping' ?",
      options: [
        "Un type de livraison par drone",
        "Un modele ou le vendeur ne stocke pas les produits et les fait expedier directement par le fournisseur au client",
        "Un systeme de retours automatiques",
        "Une methode de packaging ecologique"
      ],
      correctIndex: 1
    },
    {
      id: "q7",
      question: "Qu'est-ce qu'une 'marketplace' ?",
      options: [
        "Un magasin physique",
        "Une plateforme en ligne ou plusieurs vendeurs independants proposent leurs produits ou services aux acheteurs",
        "Un site web avec un seul vendeur",
        "Un entrepot de stockage"
      ],
      correctIndex: 1
    },
    {
      id: "q8",
      question: "Qu'est-ce que le 'cross-selling' en e-commerce ?",
      options: [
        "Vendre des produits a l'international",
        "Proposer des produits complementaires a celui que le client est en train d'acheter",
        "Vendre ses produits sur plusieurs plateformes",
        "Proposer des reductions sur le meme produit"
      ],
      correctIndex: 1
    },
    {
      id: "q9",
      question: "Qu'est-ce que le 'upselling' ?",
      options: [
        "Proposer un produit moins cher que celui selectionne",
        "Proposer une version superieure ou plus chere du produit que le client envisage d'acheter",
        "Vendre des produits d'occasion",
        "Offrir la livraison gratuite"
      ],
      correctIndex: 1
    },
    {
      id: "q10",
      question: "Pourquoi les avis clients sont-ils importants en e-commerce ?",
      options: [
        "Ils n'ont aucun impact sur les ventes",
        "Ils influencent la decision d'achat des autres clients et renforcent la confiance (preuve sociale)",
        "Ils sont obligatoires par la loi",
        "Ils servent uniquement a la decoration du site"
      ],
      correctIndex: 1
    },
    {
      id: "q11",
      question: "Qu'est-ce que le 'retargeting' en e-commerce ?",
      options: [
        "Changer la cible de son marche",
        "Recibler les visiteurs qui ont quitte le site sans acheter avec des publicites personnalisees",
        "Modifier les prix pour attirer de nouveaux clients",
        "Supprimer les produits non vendus"
      ],
      correctIndex: 1
    },
    {
      id: "q12",
      question: "Qu'est-ce que le 'last mile delivery' (livraison du dernier kilometre) ?",
      options: [
        "La livraison des produits de l'usine a l'entrepot",
        "La derniere etape de la livraison, du centre de distribution jusqu'au domicile du client",
        "La livraison a l'international",
        "Le retour du colis a l'expediteur"
      ],
      correctIndex: 1
    },
    {
      id: "q13",
      question: "Qu'est-ce que le 'mobile commerce' (m-commerce) ?",
      options: [
        "La vente de telephones mobiles",
        "Les transactions commerciales realisees via des appareils mobiles (smartphone, tablette)",
        "Le commerce entre entreprises de telephonie",
        "La vente ambulante"
      ],
      correctIndex: 1
    },
    {
      id: "q14",
      question: "Qu'est-ce qu'une fiche produit efficace ?",
      options: [
        "Un simple titre et un prix",
        "Une page detaillant le produit avec titre, description, images de qualite, prix, avis, stock et CTA clair",
        "Un fichier PDF telechargeeable",
        "Une photo sans description"
      ],
      correctIndex: 1
    },
    {
      id: "q15",
      question: "Qu'est-ce que le 'social commerce' ?",
      options: [
        "Le commerce entre amis uniquement",
        "La vente de produits directement via les plateformes de reseaux sociaux (Instagram Shopping, Facebook Shops)",
        "Le partage de bons plans entre collegues",
        "La vente de services de community management"
      ],
      correctIndex: 1
    },
    {
      id: "q16",
      question: "Qu'est-ce que le 'customer lifetime value' (CLV) en e-commerce ?",
      options: [
        "La duree de vie du produit",
        "La valeur totale qu'un client genere pour l'entreprise sur toute la duree de sa relation",
        "Le nombre de visites du client sur le site",
        "Le montant de la premiere commande"
      ],
      correctIndex: 1
    },
    {
      id: "q17",
      question: "Qu'est-ce qu'un 'payment gateway' (passerelle de paiement) ?",
      options: [
        "Un guichet de banque physique",
        "Un service qui autorise et traite les paiements electroniques entre l'acheteur et le vendeur",
        "Un coffre-fort pour l'argent liquide",
        "Un systeme de facturation manuelle"
      ],
      correctIndex: 1
    },
    {
      id: "q18",
      question: "Pourquoi la vitesse de chargement est-elle cruciale pour un site e-commerce ?",
      options: [
        "Elle n'a aucun impact sur les ventes",
        "Chaque seconde de chargement supplementaire augmente les abandons et reduit les conversions",
        "Elle n'affecte que le SEO, pas les ventes",
        "Les clients preferent les sites lents car ils semblent plus fiables"
      ],
      correctIndex: 1
    },
    {
      id: "q19",
      question: "Qu'est-ce que le 'stock management' (gestion des stocks) en e-commerce ?",
      options: [
        "La gestion des actions boursieres de l'entreprise",
        "Le suivi et l'optimisation des quantites de produits disponibles pour eviter les ruptures et le surstockage",
        "La gestion des photos de produits",
        "La gestion des comptes clients"
      ],
      correctIndex: 1
    },
    {
      id: "q20",
      question: "Qu'est-ce que le 'omnichannel' en e-commerce ?",
      options: [
        "Vendre uniquement en ligne",
        "Offrir une experience d'achat fluide et integree sur tous les canaux (en ligne, mobile, magasin physique)",
        "Vendre uniquement en magasin physique",
        "Utiliser un seul canal de communication"
      ],
      correctIndex: 1
    }
  ],

  // ============================================================
  // 38. cert-crypto-finance — Finance Decentralisee DeFi
  // ============================================================
  "cert-crypto-finance": [
    {
      id: "q1",
      question: "Qu'est-ce que la finance decentralisee (DeFi) ?",
      options: [
        "Un systeme financier gere par une banque centrale unique",
        "Un ecosysteme de services financiers construits sur des blockchains, sans intermediaires bancaires traditionnels",
        "Un type de compte epargne dans une banque classique",
        "Un logiciel de comptabilite decentralise"
      ],
      correctIndex: 1
    },
    {
      id: "q2",
      question: "Qu'est-ce qu'un 'smart contract' (contrat intelligent) ?",
      options: [
        "Un contrat papier redige par un avocat specialise en technologie",
        "Un programme autonome deploye sur une blockchain qui s'execute automatiquement lorsque des conditions predefinies sont remplies",
        "Un contrat de travail pour les developpeurs blockchain",
        "Un type d'abonnement a un service en ligne"
      ],
      correctIndex: 1
    },
    {
      id: "q3",
      question: "Qu'est-ce qu'un 'wallet' (portefeuille) crypto ?",
      options: [
        "Un portefeuille physique pour ranger des billets",
        "Un logiciel ou materiel permettant de stocker, envoyer et recevoir des cryptomonnaies via des cles privees",
        "Un compte bancaire classique",
        "Un site web de trading"
      ],
      correctIndex: 1
    },
    {
      id: "q4",
      question: "Quelle est la difference entre un 'hot wallet' et un 'cold wallet' ?",
      options: [
        "La temperature de conservation des cryptomonnaies",
        "Un hot wallet est connecte a internet (pratique mais moins securise), un cold wallet est hors ligne (plus securise)",
        "Un hot wallet est pour Bitcoin, un cold wallet pour Ethereum",
        "Il n'y a aucune difference"
      ],
      correctIndex: 1
    },
    {
      id: "q5",
      question: "Qu'est-ce qu'un protocole de 'lending' (pret) en DeFi ?",
      options: [
        "Un site web de pret immobilier",
        "Un protocole permettant de preter ou emprunter des cryptomonnaies avec interet, sans intermediaire bancaire",
        "Un forum de discussion sur les cryptomonnaies",
        "Un type de minage de Bitcoin"
      ],
      correctIndex: 1
    },
    {
      id: "q6",
      question: "Qu'est-ce qu'un 'stablecoin' ?",
      options: [
        "Une cryptomonnaie dont le prix augmente toujours",
        "Une cryptomonnaie dont la valeur est adossee a un actif stable (dollar, euro, or) pour minimiser la volatilite",
        "Une piece de monnaie physique fabriquee en metal stable",
        "Un token reserve aux investisseurs institutionnels"
      ],
      correctIndex: 1
    },
    {
      id: "q7",
      question: "Qu'est-ce que le 'yield farming' en DeFi ?",
      options: [
        "L'agriculture connectee a la blockchain",
        "La strategie consistant a deplacer ses actifs entre differents protocoles DeFi pour maximiser les rendements",
        "La creation de nouvelles cryptomonnaies",
        "Le minage de Bitcoin avec de l'energie solaire"
      ],
      correctIndex: 1
    },
    {
      id: "q8",
      question: "Qu'est-ce qu'un 'DEX' (Decentralized Exchange) ?",
      options: [
        "Un bureau de change physique",
        "Une plateforme d'echange de cryptomonnaies fonctionnant sans autorite centrale via des smart contracts",
        "Un type de cryptomonnaie",
        "Un fonds d'investissement crypto"
      ],
      correctIndex: 1
    },
    {
      id: "q9",
      question: "Qu'est-ce que la 'liquidity pool' (pool de liquidite) ?",
      options: [
        "Une piscine dans un centre aquatique",
        "Un ensemble de tokens bloques dans un smart contract pour fournir de la liquidite aux echanges decentralises",
        "Un compte bancaire commun",
        "Un fonds d'urgence de l'entreprise"
      ],
      correctIndex: 1
    },
    {
      id: "q10",
      question: "Qu'est-ce que l'impermanent loss' (perte temporaire) dans une liquidity pool ?",
      options: [
        "La perte definitive de ses tokens",
        "La difference de valeur entre detenir des tokens dans un pool de liquidite et les conserver simplement dans un wallet",
        "Le cout des frais de transaction",
        "La perte due au vol de cryptomonnaies"
      ],
      correctIndex: 1
    },
    {
      id: "q11",
      question: "Qu'est-ce que le 'staking' ?",
      options: [
        "Le minage de Bitcoin avec du materiel specialise",
        "Le fait de verrouiller ses cryptomonnaies dans un protocole pour valider des transactions et recevoir des recompenses",
        "La vente massive de cryptomonnaies",
        "L'achat de NFT"
      ],
      correctIndex: 1
    },
    {
      id: "q12",
      question: "Qu'est-ce que la 'TVL' (Total Value Locked) en DeFi ?",
      options: [
        "Le nombre total de transactions par jour",
        "La valeur totale des actifs deposes dans les protocoles DeFi, mesurant leur adoption",
        "Le prix total de toutes les cryptomonnaies",
        "Le taux variable de liquidite"
      ],
      correctIndex: 1
    },
    {
      id: "q13",
      question: "Qu'est-ce qu'un 'rug pull' en DeFi ?",
      options: [
        "Un mouvement de marche normal",
        "Une arnaque ou les createurs d'un projet retirent soudainement toute la liquidite, laissant les investisseurs avec des tokens sans valeur",
        "Une technique de trading avancee",
        "Une mise a jour de protocole"
      ],
      correctIndex: 1
    },
    {
      id: "q14",
      question: "Qu'est-ce qu'un 'oracle' blockchain ?",
      options: [
        "Un devin qui predit le cours du Bitcoin",
        "Un service qui fournit des donnees externes (prix, meteo, evenements) aux smart contracts sur la blockchain",
        "Un type de cryptomonnaie",
        "Un outil de minage"
      ],
      correctIndex: 1
    },
    {
      id: "q15",
      question: "Qu'est-ce que le 'gas fee' sur Ethereum ?",
      options: [
        "Le prix de l'essence pour les livraisons",
        "Le frais paye pour executer une transaction ou un smart contract sur le reseau Ethereum",
        "Un abonnement mensuel au reseau Ethereum",
        "Le cout de creation d'un nouveau token"
      ],
      correctIndex: 1
    },
    {
      id: "q16",
      question: "Qu'est-ce qu'un 'bridge' en DeFi ?",
      options: [
        "Un partenariat entre deux entreprises crypto",
        "Un protocole permettant de transferer des actifs entre differentes blockchains",
        "Un type de wallet physique",
        "Une formation en ligne sur la DeFi"
      ],
      correctIndex: 1
    },
    {
      id: "q17",
      question: "Pourquoi la 'seed phrase' (phrase de recuperation) est-elle critique ?",
      options: [
        "C'est juste un mot de passe comme un autre",
        "C'est la seule methode pour recuperer l'acces a un wallet si l'appareil est perdu, elle ne doit jamais etre partagee",
        "C'est un code promotionnel pour des airdrops",
        "C'est necessaire uniquement pour le minage"
      ],
      correctIndex: 1
    },
    {
      id: "q18",
      question: "Qu'est-ce que le 'flash loan' en DeFi ?",
      options: [
        "Un pret immobilier rapide",
        "Un pret instantane sans collateral qui doit etre emprunte et rembourse dans la meme transaction blockchain",
        "Un type de carte de credit crypto",
        "Un financement participatif"
      ],
      correctIndex: 1
    },
    {
      id: "q19",
      question: "Qu'est-ce qu'un 'DAO' (Decentralized Autonomous Organization) ?",
      options: [
        "Un type de cryptomonnaie",
        "Une organisation gouvernee par ses membres via des smart contracts et des votes on-chain, sans hierarchie centrale",
        "Un fonds d'investissement traditionnel",
        "Un logiciel de gestion d'entreprise"
      ],
      correctIndex: 1
    },
    {
      id: "q20",
      question: "Qu'est-ce que le 'KYC/AML' dans le contexte crypto ?",
      options: [
        "Deux types de cryptomonnaies",
        "Les procedures de verification d'identite (Know Your Customer) et de lutte contre le blanchiment (Anti-Money Laundering)",
        "Des algorithmes de minage",
        "Des metriques de performance DeFi"
      ],
      correctIndex: 1
    }
  ],

  // ============================================================
  // 39. cert-rgpd — RGPD & Protection des Donnees
  // ============================================================
  "cert-rgpd": [
    {
      id: "q1",
      question: "Que signifie RGPD ?",
      options: [
        "Reglement General de la Production Digitale",
        "Reglement General sur la Protection des Donnees",
        "Reglement Global pour la Prevention des Defauts",
        "Registre General des Procedures Documentees"
      ],
      correctIndex: 1
    },
    {
      id: "q2",
      question: "Qu'est-ce qu'une 'donnee personnelle' au sens du RGPD ?",
      options: [
        "Uniquement le nom et le prenom d'une personne",
        "Toute information se rapportant a une personne physique identifiee ou identifiable (nom, email, IP, localisation, etc.)",
        "Les donnees financieres des entreprises",
        "Les secrets industriels"
      ],
      correctIndex: 1
    },
    {
      id: "q3",
      question: "Qu'est-ce que le consentement au sens du RGPD ?",
      options: [
        "Un simple message d'information affiche sur le site",
        "Une manifestation de volonte libre, specifique, eclairee et univoque par laquelle la personne accepte le traitement de ses donnees",
        "Une case pre-cochee dans un formulaire",
        "L'acceptation automatique en naviguant sur le site"
      ],
      correctIndex: 1
    },
    {
      id: "q4",
      question: "Qu'est-ce qu'un DPO (Delegue a la Protection des Donnees) ?",
      options: [
        "Un logiciel de protection antivirus",
        "La personne designee pour veiller au respect du RGPD au sein de l'organisation et assurer le lien avec l'autorite de controle",
        "Le directeur financier de l'entreprise",
        "Un prestataire de services cloud"
      ],
      correctIndex: 1
    },
    {
      id: "q5",
      question: "Quel est le droit a l'effacement (droit a l'oubli) ?",
      options: [
        "Le droit de modifier ses donnees a volonte",
        "Le droit d'obtenir la suppression de ses donnees personnelles dans certaines conditions",
        "Le droit de connaitre les donnees collectees",
        "Le droit de transferer ses donnees a un autre service"
      ],
      correctIndex: 1
    },
    {
      id: "q6",
      question: "Qu'est-ce que le droit a la portabilite des donnees ?",
      options: [
        "Le droit de transporter son ordinateur au travail",
        "Le droit de recevoir ses donnees personnelles dans un format structure et de les transmettre a un autre responsable de traitement",
        "Le droit de refuser les cookies",
        "Le droit de chiffrer ses donnees"
      ],
      correctIndex: 1
    },
    {
      id: "q7",
      question: "Quel est le delai maximum pour notifier une violation de donnees a l'autorite de controle ?",
      options: [
        "24 heures",
        "72 heures apres en avoir eu connaissance",
        "7 jours",
        "30 jours"
      ],
      correctIndex: 1
    },
    {
      id: "q8",
      question: "Qu'est-ce qu'une analyse d'impact relative a la protection des donnees (AIPD/DPIA) ?",
      options: [
        "Un audit financier de l'entreprise",
        "Une evaluation des risques que le traitement de donnees presente pour les droits et libertes des personnes concernees",
        "Un test de penetration informatique",
        "Un rapport de performance du site web"
      ],
      correctIndex: 1
    },
    {
      id: "q9",
      question: "Quel est le montant maximum des sanctions en cas de violation du RGPD ?",
      options: [
        "10 000 euros",
        "20 millions d'euros ou 4% du chiffre d'affaires annuel mondial (le montant le plus eleve)",
        "100 000 euros",
        "1 million d'euros"
      ],
      correctIndex: 1
    },
    {
      id: "q10",
      question: "Qu'est-ce que le principe de 'minimisation des donnees' ?",
      options: [
        "Collecter le maximum de donnees pour etre sur de ne rien manquer",
        "Ne collecter que les donnees strictement necessaires a la finalite du traitement",
        "Compresser les donnees pour economiser de l'espace de stockage",
        "Reduire la taille des formulaires pour ameliorer l'UX"
      ],
      correctIndex: 1
    },
    {
      id: "q11",
      question: "Qu'est-ce que le 'privacy by design' ?",
      options: [
        "Ajouter une page de politique de confidentialite au site web",
        "Integrer la protection des donnees des la conception de tout systeme, produit ou service",
        "Utiliser un VPN pour naviguer sur internet",
        "Chiffrer uniquement les mots de passe"
      ],
      correctIndex: 1
    },
    {
      id: "q12",
      question: "Qu'est-ce qu'un 'responsable de traitement' au sens du RGPD ?",
      options: [
        "L'administrateur de la base de donnees",
        "La personne physique ou morale qui determine les finalites et les moyens du traitement des donnees personnelles",
        "Le DPO de l'entreprise",
        "L'hebergeur du site web"
      ],
      correctIndex: 1
    },
    {
      id: "q13",
      question: "Qu'est-ce qu'un 'sous-traitant' au sens du RGPD ?",
      options: [
        "Un employe de l'entreprise",
        "Une personne physique ou morale qui traite des donnees personnelles pour le compte du responsable de traitement",
        "Un client de l'entreprise",
        "L'autorite de controle"
      ],
      correctIndex: 1
    },
    {
      id: "q14",
      question: "Qu'est-ce que le registre des activites de traitement ?",
      options: [
        "Le journal des activites physiques des employes",
        "Un document recensant tous les traitements de donnees personnelles effectues par l'organisation",
        "Un historique des connexions au site web",
        "Un registre du commerce"
      ],
      correctIndex: 1
    },
    {
      id: "q15",
      question: "Qu'est-ce que la base legale d'un traitement de donnees ?",
      options: [
        "L'adresse du siege social de l'entreprise",
        "Le fondement juridique qui autorise le traitement (consentement, contrat, obligation legale, interet legitime, etc.)",
        "Le pays ou les donnees sont stockees",
        "Le type de base de donnees utilisee"
      ],
      correctIndex: 1
    },
    {
      id: "q16",
      question: "Qu'est-ce que le droit d'acces au sens du RGPD ?",
      options: [
        "Le droit d'acceder a n'importe quel site web",
        "Le droit pour toute personne de savoir si ses donnees sont traitees et d'en obtenir une copie",
        "Le droit d'acceder aux locaux de l'entreprise",
        "Le droit de modifier les donnees d'autrui"
      ],
      correctIndex: 1
    },
    {
      id: "q17",
      question: "Qu'est-ce que le transfert de donnees hors UE et pourquoi est-il encadre ?",
      options: [
        "Il n'y a aucune restriction sur le transfert de donnees",
        "Le transfert vers un pays hors UE est soumis a des garanties specifiques car tous les pays n'offrent pas le meme niveau de protection",
        "Il est interdit de stocker des donnees en dehors de la France",
        "Le transfert est autorise uniquement vers les Etats-Unis"
      ],
      correctIndex: 1
    },
    {
      id: "q18",
      question: "Qu'est-ce qu'un cookie au regard du RGPD ?",
      options: [
        "Un gateau offert aux visiteurs du site",
        "Un fichier depose sur l'appareil de l'utilisateur qui peut constituer une donnee personnelle et necessite un consentement",
        "Un virus informatique",
        "Un element de design du site web"
      ],
      correctIndex: 1
    },
    {
      id: "q19",
      question: "Qu'est-ce que le principe de 'limitation de conservation' ?",
      options: [
        "Stocker les donnees indefiniment au cas ou",
        "Les donnees personnelles ne doivent etre conservees que le temps necessaire a la finalite pour laquelle elles ont ete collectees",
        "Limiter le nombre de sauvegardes a une par mois",
        "Conserver les donnees uniquement sur des serveurs locaux"
      ],
      correctIndex: 1
    },
    {
      id: "q20",
      question: "Quelle autorite de controle est competente en France pour le RGPD ?",
      options: [
        "L'ANSSI (Agence Nationale de la Securite des Systemes d'Information)",
        "La CNIL (Commission Nationale de l'Informatique et des Libertes)",
        "Le Ministere de l'Interieur",
        "La Banque de France"
      ],
      correctIndex: 1
    }
  ],

  // ============================================================
  // 40. cert-droit-numerique — Droit du Numerique & Contrats
  // ============================================================
  "cert-droit-numerique": [
    {
      id: "q1",
      question: "Qu'est-ce que les CGV (Conditions Generales de Vente) ?",
      options: [
        "Un document publicitaire destine aux clients",
        "Un document juridique definissant les conditions dans lesquelles un vendeur vend ses produits ou services",
        "Un rapport financier annuel",
        "Un guide d'utilisation du produit"
      ],
      correctIndex: 1
    },
    {
      id: "q2",
      question: "Qu'est-ce que les CGU (Conditions Generales d'Utilisation) ?",
      options: [
        "Les conditions de garantie d'un appareil electronique",
        "Un contrat entre le fournisseur d'un service en ligne et ses utilisateurs definissant les regles d'utilisation",
        "Les consignes de securite d'un batiment",
        "Un guide technique pour les developpeurs"
      ],
      correctIndex: 1
    },
    {
      id: "q3",
      question: "Qu'est-ce que la propriete intellectuelle dans le contexte numerique ?",
      options: [
        "La capacite intellectuelle des employes",
        "L'ensemble des droits protegeant les creations de l'esprit (logiciels, designs, contenus, marques, brevets)",
        "La propriete des serveurs physiques",
        "Le droit d'utiliser internet"
      ],
      correctIndex: 1
    },
    {
      id: "q4",
      question: "Qu'est-ce qu'une signature electronique ?",
      options: [
        "Un scan de la signature manuscrite",
        "Un procede electronique permettant d'authentifier l'identite du signataire et de garantir l'integrite du document",
        "Un email de confirmation",
        "Un mot de passe"
      ],
      correctIndex: 1
    },
    {
      id: "q5",
      question: "Quel est le delai de retractation pour un achat en ligne en France ?",
      options: [
        "7 jours",
        "14 jours a compter de la reception du bien ou de la conclusion du contrat pour un service",
        "30 jours",
        "48 heures"
      ],
      correctIndex: 1
    },
    {
      id: "q6",
      question: "Qu'est-ce que le droit d'auteur applique au code source ?",
      options: [
        "Le code source n'est protege par aucun droit",
        "Le code source est protege par le droit d'auteur des sa creation originale, sans formalite",
        "Le droit d'auteur ne s'applique qu'aux textes litteraires",
        "Le code source ne peut etre protege que par un brevet"
      ],
      correctIndex: 1
    },
    {
      id: "q7",
      question: "Qu'est-ce qu'un contrat SaaS (Software as a Service) ?",
      options: [
        "Un contrat de vente de materiel informatique",
        "Un contrat d'acces a un logiciel heberge et fourni en ligne sous forme d'abonnement",
        "Un contrat de travail pour developpeurs",
        "Un contrat d'assurance informatique"
      ],
      correctIndex: 1
    },
    {
      id: "q8",
      question: "Qu'est-ce que la responsabilite de l'hebergeur selon la LCEN ?",
      options: [
        "L'hebergeur est responsable de tout contenu publie sur ses serveurs",
        "L'hebergeur n'est pas responsable des contenus heberges tant qu'il n'en a pas connaissance, mais doit agir promptement une fois notifie",
        "L'hebergeur n'a aucune responsabilite dans tous les cas",
        "L'hebergeur doit verifier chaque contenu avant publication"
      ],
      correctIndex: 1
    },
    {
      id: "q9",
      question: "Qu'est-ce qu'un NDA (Non-Disclosure Agreement) ?",
      options: [
        "Un contrat de travail a duree indeterminee",
        "Un accord de confidentialite engageant les parties a ne pas divulguer certaines informations sensibles",
        "Un contrat de licence logicielle",
        "Un accord de partenariat commercial"
      ],
      correctIndex: 1
    },
    {
      id: "q10",
      question: "Qu'est-ce que le droit a l'image sur internet ?",
      options: [
        "Le droit de publier n'importe quelle photo sur internet",
        "Le droit de toute personne a autoriser ou refuser la diffusion de son image, y compris en ligne",
        "Le droit de modifier les images d'autrui",
        "Le droit de telecharger toutes les images trouvees en ligne"
      ],
      correctIndex: 1
    },
    {
      id: "q11",
      question: "Qu'est-ce que la licence Creative Commons ?",
      options: [
        "Un droit d'auteur plus strict que le copyright classique",
        "Un ensemble de licences standardisees permettant aux createurs de partager leurs oeuvres avec certaines conditions (attribution, non commercial, etc.)",
        "Une licence obligatoire pour publier sur internet",
        "Un brevet pour les inventions numeriques"
      ],
      correctIndex: 1
    },
    {
      id: "q12",
      question: "Qu'est-ce que les mentions legales obligatoires d'un site web ?",
      options: [
        "Des mentions de remerciements aux visiteurs",
        "Les informations identifiant le responsable du site (nom, adresse, editeur, hebergeur, contact)",
        "Les conditions de livraison des produits",
        "Les avis des utilisateurs"
      ],
      correctIndex: 1
    },
    {
      id: "q13",
      question: "Qu'est-ce qu'un contrat de cession de droits d'auteur ?",
      options: [
        "Un contrat d'embauche d'un auteur",
        "Un contrat par lequel l'auteur transfere certains droits d'exploitation de son oeuvre a un tiers",
        "Un contrat de maintenance logicielle",
        "Un contrat de pret de materiel"
      ],
      correctIndex: 1
    },
    {
      id: "q14",
      question: "Qu'est-ce que le reglement eIDAS concernant la signature electronique ?",
      options: [
        "Un reglement sur la protection des donnees",
        "Un reglement europeen etablissant un cadre juridique pour les signatures electroniques et les services de confiance",
        "Un reglement sur le commerce electronique",
        "Un reglement sur la cybersecurite"
      ],
      correctIndex: 1
    },
    {
      id: "q15",
      question: "Qu'est-ce que la clause de propriete intellectuelle dans un contrat de freelance ?",
      options: [
        "Une clause sans importance juridique",
        "Une clause definissant a qui appartiennent les creations realisees pendant la mission (client ou freelance)",
        "Une clause sur le lieu de travail du freelance",
        "Une clause sur les horaires de travail"
      ],
      correctIndex: 1
    },
    {
      id: "q16",
      question: "Qu'est-ce que le 'Digital Services Act' (DSA) europeen ?",
      options: [
        "Un reglement sur les services bancaires en ligne",
        "Un reglement encadrant les obligations des plateformes numeriques en matiere de contenus illegaux, transparence et protection des utilisateurs",
        "Un programme de subventions pour les startups",
        "Une norme technique pour les sites web"
      ],
      correctIndex: 1
    },
    {
      id: "q17",
      question: "Qu'est-ce que la clause limitative de responsabilite dans un contrat ?",
      options: [
        "Une clause qui elimine toute responsabilite du prestataire",
        "Une clause qui plafonne le montant des dommages que le prestataire pourrait devoir en cas de manquement",
        "Une clause qui definit les delais de livraison",
        "Une clause qui fixe le prix de la prestation"
      ],
      correctIndex: 1
    },
    {
      id: "q18",
      question: "Qu'est-ce que l'obligation d'information precontractuelle en e-commerce ?",
      options: [
        "Envoyer un email apres la vente",
        "L'obligation de fournir au consommateur des informations claires sur le produit, le prix, les conditions avant l'achat",
        "Publier un rapport annuel",
        "Afficher uniquement le logo de l'entreprise"
      ],
      correctIndex: 1
    },
    {
      id: "q19",
      question: "Qu'est-ce qu'un depot de marque ?",
      options: [
        "Le stockage physique de produits en entrepot",
        "La procedure d'enregistrement d'un signe distinctif (nom, logo) aupres d'un office de propriete intellectuelle",
        "La creation d'un compte sur les reseaux sociaux",
        "L'achat d'un nom de domaine"
      ],
      correctIndex: 1
    },
    {
      id: "q20",
      question: "Qu'est-ce que le 'Digital Markets Act' (DMA) europeen ?",
      options: [
        "Un reglement sur la publicite en ligne",
        "Un reglement ciblant les grandes plateformes (gatekeepers) pour garantir des marches numeriques equitables et ouverts",
        "Un reglement sur la taxation des cryptomonnaies",
        "Un programme de formation au marketing digital"
      ],
      correctIndex: 1
    }
  ],
};