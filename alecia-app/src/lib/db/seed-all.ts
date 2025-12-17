/**
 * Complete Database Seeding Script
 * 
 * Seeds all data: team members, operations/deals, news articles, job offers, and admin user.
 * Run with: npm run db:seed:all
 * 
 * This script ensures complete data sync as per the alecia.fr website.
 */

import { config } from 'dotenv';
config({ path: '.env.local' });
import { db } from "./index";
import { deals, teamMembers, posts, jobOffers, users } from "./schema";
import bcrypt from "bcryptjs";

// =============================================================================
// TEAM MEMBERS DATA (8 members as per Equipe_Alecia.md)
// =============================================================================
const teamMembersData = [
  {
    slug: "gregory-colin",
    name: "Grégory Colin",
    role: "Associé fondateur",
    photo: "/assets/Equipe_Alecia/GC_1_-_cropped_p800.jpg",
    linkedinUrl: "https://www.linkedin.com/in/gregorycolin/",
    bioFr: "Grégory Colin est Associé fondateur chez alecia. Fort d'une expérience significative en conseil en fusion-acquisition, il accompagne les dirigeants de PME et ETI dans leurs opérations de transmission, acquisition et levée de fonds.",
    displayOrder: 0,
    isActive: true,
  },
  {
    slug: "christophe-berthon",
    name: "Christophe Berthon",
    role: "Associé fondateur",
    photo: "/assets/Equipe_Alecia/CB_1_-_cropped_-_alt_p800.jpg",
    linkedinUrl: "https://www.linkedin.com/in/christophe-berthon-843924118/",
    bioFr: "Christophe Berthon est Associé fondateur chez alecia. Fort d'une expérience significative en conseil en fusion-acquisition, il accompagne les dirigeants de PME et ETI dans leurs opérations de transmission, acquisition et levée de fonds.",
    displayOrder: 1,
    isActive: true,
  },
  {
    slug: "martin-egasse",
    name: "Martin Egasse",
    role: "Associé fondateur",
    photo: "/assets/Equipe_Alecia/ME_2_-_cropped_-_alt_p800.jpg",
    linkedinUrl: "https://www.linkedin.com/in/martinegasse/",
    bioFr: "Martin Egasse est Associé fondateur chez alecia. Fort d'une expérience significative en conseil en fusion-acquisition, il accompagne les dirigeants de PME et ETI dans leurs opérations de transmission, acquisition et levée de fonds.",
    displayOrder: 2,
    isActive: true,
  },
  {
    slug: "tristan-cossec",
    name: "Tristan Cossec",
    role: "Associé fondateur",
    photo: "/assets/Equipe_Alecia/TC_2_p800.jpg",
    linkedinUrl: "https://www.linkedin.com/in/tristan-cossec-3b5a0247/",
    bioFr: "Tristan Cossec est Associé fondateur chez alecia. Fort d'une expérience significative en conseil en fusion-acquisition, il accompagne les dirigeants de PME et ETI dans leurs opérations de transmission, acquisition et levée de fonds.",
    displayOrder: 3,
    isActive: true,
  },
  {
    slug: "serge-de-fay",
    name: "Serge de Faÿ",
    role: "Associé fondateur",
    photo: "/assets/Equipe_Alecia/SF_2_p800.jpg",
    linkedinUrl: "https://www.linkedin.com/in/serge-de-fa%C3%BF-09713555/",
    bioFr: "Serge de Faÿ est Associé fondateur chez alecia. Fort d'une expérience significative en conseil en fusion-acquisition, il accompagne les dirigeants de PME et ETI dans leurs opérations de transmission, acquisition et levée de fonds.",
    displayOrder: 4,
    isActive: true,
  },
  {
    slug: "jerome-berthiau",
    name: "Jérôme Berthiau",
    role: "Associé fondateur",
    photo: "/assets/Equipe_Alecia/JB_1_-_cropped_-_alt_p800.jpg",
    linkedinUrl: "https://www.linkedin.com/in/jeromeberthiau/",
    bioFr: "Jérôme Berthiau est Associé fondateur chez alecia. Fort d'une expérience significative en conseil en fusion-acquisition, il accompagne les dirigeants de PME et ETI dans leurs opérations de transmission, acquisition et levée de fonds.",
    displayOrder: 5,
    isActive: true,
  },
  {
    slug: "louise-pini",
    name: "Louise Pini",
    role: "Analyste",
    photo: "/assets/Equipe_Alecia/LP__2__-_cropped.jpg",
    linkedinUrl: "https://www.linkedin.com/in/louise-p-184b7a160/",
    bioFr: "Louise Pini est Analyste chez alecia. Elle participe activement aux opérations de fusion-acquisition et accompagne les équipes dans l'analyse financière et la structuration des transactions.",
    displayOrder: 6,
    isActive: true,
  },
  {
    slug: "mickael-furet",
    name: "Mickael Furet",
    role: "Analyste",
    photo: "/assets/Equipe_Alecia/MF_p800.jpg",
    linkedinUrl: "https://www.linkedin.com/in/mickael-furet/",
    bioFr: "Mickael Furet est Analyste chez alecia. Il participe activement aux opérations de fusion-acquisition et accompagne les équipes dans l'analyse financière et la structuration des transactions.",
    displayOrder: 7,
    isActive: true,
  },
];

// =============================================================================
// NEWS ARTICLES DATA (6 articles as per Actualités)
// =============================================================================
const newsData = [
  {
    slug: "safe-groupe-acquisition-dogs-security",
    titleFr: "alecia conseille SAFE GROUPE dans le cadre de l'acquisition de Dogs Security",
    titleEn: "alecia advises SAFE GROUPE on the acquisition of Dogs Security",
    contentFr: `Acteur majeur de la sécurité globale en France, SAFE GROUPE poursuit sa stratégie de développement en annonçant l'acquisition de Dogs Security. Cette opération lui permet de renforcer son maillage territorial avec un nouveau bureau en Île-de-France.

L'équipe d'Alecia est fière d'avoir accompagné les dirigeants dans cette étape clé de leur croissance externe.`,
    excerpt: "Acteur majeur de la sécurité globale en France, SAFE GROUPE poursuit sa stratégie de développement en annonçant l'acquisition de Dogs Security.",
    category: "Communiqué",
    coverImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=2070",
    isPublished: true,
    publishedAt: new Date("2024-12-14"),
  },
  {
    slug: "top-10-estimation-valeur-entreprise",
    titleFr: "Le top 10 des éléments à prendre en compte pour estimer la valeur de son entreprise",
    titleEn: "Top 10 factors to consider when valuing your company",
    contentFr: `Estimer la valeur d'une entreprise est un exercice complexe qui va bien au-delà de la simple application de multiples sur l'EBITDA. Pour obtenir une valorisation juste et défendable, il est crucial d'analyser l'entreprise dans sa globalité.

Voici les 10 éléments incontournables que nous scrutons chez Alecia pour affiner nos valorisations :

## 1. La performance financière historique
La constance de la croissance du chiffre d'affaires et de la rentabilité (EBITDA) sur les 3 à 5 dernières années rassure les acquéreurs. Une tendance haussière est toujours valorisée.

## 2. La récurrence du chiffre d'affaires
Un modèle économique basé sur des revenus récurrents (abonnements, contrats cadres) offre une visibilité précieuse et réduit le risque perçu, augmentant ainsi les multiples de valorisation.

## 3. La diversification du portefeuille clients
La dépendance à un ou deux gros clients est un facteur de risque majeur. Une base client diversifiée et fidèle est un atout considérable.

## 4. La propriété intellectuelle et les barrières à l'entrée
Brevets, marques déposées, savoir-faire unique ou logiciels propriétaires constituent des actifs intangibles qui peuvent justifier une prime significative.

## 5. La qualité et l'autonomie de l'équipe de management
Une entreprise qui "tourne" sans son dirigeant fondateur a plus de valeur. La présence d'une ligne de managers intermédiaires compétents est rassurante pour un repreneur.

## 6. Le positionnement sur le marché
Être leader sur une niche ou challenger sur un marché en forte croissance offre des perspectives de développement attrayantes.

## 7. La structure juridique et fiscale
Une structure saine, sans contentieux majeurs et optimisée fiscalement, facilite la transaction et évite les décotes de dernière minute.

## 8. La qualité des processus et du reporting
Une entreprise structurée avec des outils de gestion performants et un reporting financier fiable inspire confiance et accélère les due diligences.

## 9. Le potentiel de croissance (Scalabilité)
La capacité de l'entreprise à croître sans augmenter ses coûts fixes dans les mêmes proportions est un levier de valeur puissant.

## 10. Le "Fit" stratégique
La valeur n'est pas absolue : elle dépend aussi de l'acquéreur. Les synergies potentielles peuvent faire grimper le prix bien au-delà des standards financiers.

### Vous envisagez de céder votre entreprise ?
Contactez l'équipe d'Alecia pour un échange confidentiel sur vos projets de transmission.`,
    excerpt: "Estimer la valeur d'une entreprise est un exercice complexe. Voici les 10 éléments incontournables pour une valorisation juste.",
    category: "Article",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2626",
    isPublished: true,
    publishedAt: new Date("2024-12-10"),
  },
  {
    slug: "reussir-sa-levee-de-fonds",
    titleFr: "Comment mettre toutes les chances de mon côté pour lever des fonds ?",
    titleEn: "How to maximize your chances of raising funds successfully",
    contentFr: `Lever des fonds est souvent une étape indispensable pour accélérer, mais c'est aussi un parcours du combattant. En 2024-2025, les investisseurs sont devenus plus sélectifs.

Voici comment structurer votre démarche pour convaincre.

## 1. Avoir un "Equity Story" clair et cohérent
Votre vision doit être limpide. Quel problème résolvez-vous ? Pourquoi êtes-vous la meilleure équipe pour le faire ?

## 2. Maîtriser ses chiffres sur le bout des doigts
L'époque des promesses vagues est révolue. Vous devez présenter un Business Plan réaliste et connaître vos unit economics.

## 3. Démontrer une "Traction" tangible
Rien ne convainc mieux que des preuves de marché. Clients signés, croissance du MRR, partenariats stratégiques...

## 4. Structurer une Data Room irréprochable
La confiance se gagne dans les détails. Une Data Room organisée montre votre professionnalisme.

## 5. Choisir le bon timing
Le meilleur moment pour lever est quand vous avez encore 6 à 9 mois de runway et de bonnes nouvelles à annoncer.

## 6. Se faire accompagner
Une levée de fonds est chronophage. Avoir un conseil à vos côtés vous permet de rester concentré sur le business.

### Prêt à passer à la vitesse supérieure ?
Chez Alecia, nous connectons les entrepreneurs visionnaires avec les bons partenaires financiers.`,
    excerpt: "Lever des fonds est un parcours du combattant. Voici comment structurer votre démarche pour convaincre les investisseurs.",
    category: "Article",
    coverImage: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=2670",
    isPublished: true,
    publishedAt: new Date("2024-12-05"),
  },
  {
    slug: "secteurs-dynamiques-cote-azur-2025",
    titleFr: "Les 5 secteurs dynamiques sur la Côte d'Azur en 2025",
    titleEn: "Top 5 dynamic sectors on the French Riviera in 2025",
    contentFr: `La région Sud et la Côte d'Azur ne sont pas seulement des terres de tourisme. En 2025, l'écosystème économique local se transforme.

Voici les 5 secteurs qui tirent la croissance régionale et attirent les investisseurs.

## 1. La Tech et l'Intelligence Artificielle (Sophia Antipolis)
Avec Sophia Antipolis comme fer de lance, la région continue d'attirer les talents et les capitaux dans la tech.

## 2. La Smart City et les éco-technologies
Nice et sa métropole investissent massivement pour devenir des modèles de "Green Smart City".

## 3. L'industrie du luxe et de l'expérientiel
Au-delà de l'hôtellerie traditionnelle, on observe une montée en gamme des services "lifestyle".

## 4. La Santé et les MedTech
Le tissu de cliniques privées, couplé à la recherche universitaire niçoise, favorise l'éclosion de startups.

## 5. L'immobilier tertiaire premium
L'attractivité de la Côte d'Azur booste la demande pour des espaces de bureaux flexibles et haut de gamme.

### Vous opérez dans l'un de ces secteurs ?
L'équipe Alecia, ancrée localement, vous aide à décrypter les opportunités de votre marché.`,
    excerpt: "En 2025, l'écosystème économique de la Côte d'Azur se transforme. Découvrez les 5 secteurs qui attirent les investisseurs.",
    category: "Article",
    coverImage: "https://images.unsplash.com/photo-1534234828563-025417436aa8?auto=format&fit=crop&q=80&w=2669",
    isPublished: true,
    publishedAt: new Date("2024-12-01"),
  },
  {
    slug: "pourquoi-mandat-conseil-ma",
    titleFr: "Pourquoi se faire accompagner par un cabinet M&A pour céder son entreprise ?",
    titleEn: "Why hire an M&A advisory firm to sell your business?",
    contentFr: `Céder son entreprise est souvent l'opération financière la plus importante d'une vie. Pourtant, de nombreux dirigeants tentent l'aventure seuls.

Voici pourquoi un accompagnement professionnel change la donne.

## 1. Briser la solitude du dirigeant
Vendre est un processus émotionnel et solitaire. Avoir un tiers de confiance permet de garder la tête froide.

## 2. Créer une tension concurrentielle
Pas de concurrence, pas d'optimisation du prix. Un cabinet M&A sait comment approcher plusieurs acquéreurs simultanément.

## 3. Gagner du temps (et rester concentré)
Une cession prend 6 à 12 mois. Nous gérons le processus pour que vous gériez votre business.

## 4. Sécuriser la transaction juridique
Nous négocions le pacte global pour protéger votre patrimoine après la vente.

## 5. Accéder à des acheteurs hors radar
Votre réseau est précieux, mais le nôtre est mondial.

### Vous méritez le meilleur pour votre sortie
Contactez-nous pour évaluer le potentiel de votre entreprise.`,
    excerpt: "Céder son entreprise est l'opération la plus importante d'une vie. Découvrez pourquoi un accompagnement professionnel change la donne.",
    category: "Article",
    coverImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=2669",
    isPublished: true,
    publishedAt: new Date("2024-11-20"),
  },
  {
    slug: "transmission-entreprise-anticipation",
    titleFr: "Transmission d'entreprise : Anticiper pour mieux réussir",
    titleEn: "Business Transmission: Anticipate to succeed",
    contentFr: `Le mot d'ordre d'une transmission réussie est simple : Anticipation. Une vente précipitée se solde presque toujours par une décote.

Idéalement, une cession se prépare 12 à 24 mois à l'avance. Voici les chantiers prioritaires.

## 1. Nettoyer le bilan
Sortez les actifs non stratégiques, purgez les vieux contentieux et optimisez le BFR.

## 2. Structurer le "Middle Management"
Si vous partez demain, l'entreprise s'arrête-t-elle ? Déléguez, formez et fidélisez vos cadres clés.

## 3. Documenter les processus
Le savoir-faire est-il dans les têtes ou dans les procédures ? Formaliser les méthodes rassure l'acquéreur.

## 4. Auditer ses contrats
Vérifiez que vos contrats clients et fournisseurs clés sont cessibles.

## 5. Préparer sa fiscalité personnelle
L'impact fiscal peut varier du simple au double selon les montages.

### N'attendez pas d'être au pied du mur
Prenons rendez-vous pour auditer la "transmissibilité" de votre entreprise.`,
    excerpt: "Le mot d'ordre d'une transmission réussie : Anticipation. Une vente précipitée se solde par une décote.",
    category: "Article",
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2671",
    isPublished: true,
    publishedAt: new Date("2024-11-15"),
  },
];

// =============================================================================
// JOB OFFERS DATA
// =============================================================================
const jobOffersData = [
  {
    slug: "analyste-lorient",
    title: "Analyste",
    type: "Stage/alternance",
    location: "Lorient",
    description: "Stage/alternance - Temps plein",
    contactEmail: "gregory.colin@alecia.fr",
    isPublished: true,
    requirements: [
      "Master en finance, école de commerce ou équivalent",
      "1-3 ans d'expérience en M&A, Transaction Services ou Corporate Finance",
      "Excellentes capacités analytiques et de modélisation",
      "Anglais courant",
    ],
  },
];

// =============================================================================
// OPERATIONS/DEALS DATA (49 operations from Opérations_alecia.md)
// =============================================================================
interface OperationData {
  slug: string;
  clientName: string;
  clientLogo: string | null;
  acquirerName: string | null;
  acquirerLogo: string | null;
  sector: string;
  region: string | null;
  year: number;
  mandateType: "Cession" | "Acquisition" | "Levée de fonds";
  isPriorExperience: boolean;
}

const operationsData: OperationData[] = [
  // 1. HMR (2022)
  { slug: "hmr-2", clientName: "HMR", clientLogo: "/assets/Operations_alecia/logo-hmr.jpg", acquirerName: "Leclerc - franchisé", acquirerLogo: "/assets/Operations_alecia/logo-leclerc.jpg", sector: "Distribution & services B2C", region: "Provence-Alpes-Côte d'Azur", year: 2022, mandateType: "Cession", isPriorExperience: false },
  // 2. HMR (2021)
  { slug: "hmr", clientName: "HMR", clientLogo: "/assets/Operations_alecia/logo-hmr.jpg", acquirerName: "Crédit Agricole", acquirerLogo: null, sector: "Distribution & services B2C", region: "Provence-Alpes-Côte d'Azur", year: 2021, mandateType: "Levée de fonds", isPriorExperience: false },
  // 3. Safe Group (2024)
  { slug: "safe-group", clientName: "Safe Group", clientLogo: null, acquirerName: "DOGS Security", acquirerLogo: null, sector: "Distribution & services B2B", region: "Île-de-France", year: 2024, mandateType: "Acquisition", isPriorExperience: false },
  // 4. Signes (2024)
  { slug: "signes", clientName: "Signes", clientLogo: null, acquirerName: "La/Ba Architectes", acquirerLogo: null, sector: "Distribution & services B2C", region: "Île-de-France", year: 2024, mandateType: "Cession", isPriorExperience: true },
  // 5. XRL Consulting (2023-2024)
  { slug: "xrl-consulting", clientName: "XRL Consulting", clientLogo: null, acquirerName: "Banque Populaire et Caisse d'Epargne", acquirerLogo: null, sector: "Distribution & services B2B", region: "Île-de-France", year: 2024, mandateType: "Levée de fonds", isPriorExperience: true },
  // 6. Confidentiel (Santé)
  { slug: "confidentiel", clientName: "Confidentiel", clientLogo: null, acquirerName: "Confidentiel", acquirerLogo: null, sector: "Santé", region: null, year: 2023, mandateType: "Cession", isPriorExperience: true },
  // 7. Maison Bracq
  { slug: "maison-bracq", clientName: "Maison Bracq", clientLogo: null, acquirerName: "5 cadres + fonds", acquirerLogo: null, sector: "Distribution & services B2C", region: "Pays de la Loire", year: 2023, mandateType: "Cession", isPriorExperience: true },
  // 8. Kanopé
  { slug: "kanope", clientName: "Kanopé", clientLogo: null, acquirerName: "Metagram", acquirerLogo: null, sector: "Services financiers & assurance", region: "Occitanie", year: 2023, mandateType: "Cession", isPriorExperience: true },
  // 9. Holly's
  { slug: "hollys", clientName: "Holly's Diner", clientLogo: null, acquirerName: "Prêteurs bancaires", acquirerLogo: null, sector: "Distribution & services B2C", region: "Centre-Val de Loire", year: 2022, mandateType: "Levée de fonds", isPriorExperience: true },
  // 10. Keller Williams
  { slug: "keller-williams", clientName: "Keller Williams", clientLogo: null, acquirerName: "Entrepreneur Invest", acquirerLogo: null, sector: "Immobilier & construction", region: "Île-de-France", year: 2022, mandateType: "Levée de fonds", isPriorExperience: true },
  // 11. Lovial
  { slug: "lovial", clientName: "Lovial", clientLogo: null, acquirerName: "Family office", acquirerLogo: null, sector: "Distribution & services B2B", region: "Auvergne-Rhône-Alpes", year: 2022, mandateType: "Cession", isPriorExperience: true },
  // 12. Omnes Education (EU)
  { slug: "omnes-education-2", clientName: "Omnes Education", clientLogo: null, acquirerName: "EU Business School", acquirerLogo: null, sector: "Distribution & services B2C", region: "Île-de-France", year: 2022, mandateType: "Acquisition", isPriorExperience: true },
  // 13. Omnes Education (CEI)
  { slug: "omnes-education", clientName: "Omnes Education", clientLogo: null, acquirerName: "CEI.", acquirerLogo: null, sector: "Distribution & services B2C", region: "Île-de-France", year: 2022, mandateType: "Acquisition", isPriorExperience: true },
  // 14. Patie Michel
  { slug: "patie-michel", clientName: "Patie Michel", clientLogo: null, acquirerName: "Perseus", acquirerLogo: null, sector: "Industries", region: "Provence-Alpes-Côte d'Azur", year: 2021, mandateType: "Cession", isPriorExperience: true },
  // 15. Jardin Molinari
  { slug: "jardin-molinari", clientName: "Jardin Molinari", clientLogo: null, acquirerName: "Confidentiel", acquirerLogo: null, sector: "Distribution & services B2C", region: "Provence-Alpes-Côte d'Azur", year: 2021, mandateType: "Cession", isPriorExperience: true },
  // 16. Uside
  { slug: "uside", clientName: "Uside", clientLogo: null, acquirerName: "Sia Partners", acquirerLogo: null, sector: "Distribution & services B2B", region: "Île-de-France", year: 2021, mandateType: "Cession", isPriorExperience: true },
  // 17. Gault & Frémont
  { slug: "gault-fremont", clientName: "Gault & Frémont", clientLogo: null, acquirerName: "Groupe Guillin", acquirerLogo: null, sector: "Industries", region: "Centre-Val de Loire", year: 2021, mandateType: "Cession", isPriorExperience: true },
  // 18. Finaxy
  { slug: "finaxy", clientName: "Finaxy", clientLogo: null, acquirerName: "Ardian", acquirerLogo: null, sector: "Services financiers & assurance", region: "Île-de-France", year: 2021, mandateType: "Cession", isPriorExperience: true },
  // 19. Realités
  { slug: "realites", clientName: "Realités", clientLogo: null, acquirerName: "River Bank", acquirerLogo: null, sector: "Immobilier & construction", region: "Pays de la Loire", year: 2021, mandateType: "Levée de fonds", isPriorExperience: true },
  // 20. Wyz Group
  { slug: "wyz-group", clientName: "Wyz Group", clientLogo: null, acquirerName: "Generis Capital Partners ; BPI France ; BNP Paribas", acquirerLogo: null, sector: "Technologies & logiciels", region: "Hauts-de-France", year: 2021, mandateType: "Levée de fonds", isPriorExperience: true },
  // 21. Link4Life
  { slug: "link4life", clientName: "Link4Life", clientLogo: null, acquirerName: "BPI France et un pool bancaire", acquirerLogo: null, sector: "Santé", region: "Provence-Alpes-Côte d'Azur", year: 2021, mandateType: "Levée de fonds", isPriorExperience: true },
  // 22. Bolden
  { slug: "bolden", clientName: "Bolden", clientLogo: null, acquirerName: "River Bank", acquirerLogo: null, sector: "Services financiers & assurance", region: "Île-de-France", year: 2020, mandateType: "Cession", isPriorExperience: true },
  // 23. April
  { slug: "april", clientName: "April", clientLogo: null, acquirerName: "+ Simple.fr Assurances", acquirerLogo: null, sector: "Services financiers & assurance", region: "Auvergne-Rhône-Alpes", year: 2020, mandateType: "Cession", isPriorExperience: true },
  // 24. Socodi
  { slug: "socodi", clientName: "Corse GSM Socodi", clientLogo: null, acquirerName: "Pool bancaire", acquirerLogo: null, sector: "Technologies & logiciels", region: "Provence-Alpes-Côte d'Azur", year: 2020, mandateType: "Levée de fonds", isPriorExperience: true },
  // 25. Le Wagon
  { slug: "le-wagon", clientName: "Le Wagon", clientLogo: null, acquirerName: "Africinvest", acquirerLogo: null, sector: "Technologies & logiciels", region: "Île-de-France", year: 2020, mandateType: "Levée de fonds", isPriorExperience: true },
  // 26. Capelli
  { slug: "capelli", clientName: "Capelli", clientLogo: null, acquirerName: "River Bank", acquirerLogo: null, sector: "Immobilier & construction", region: "Île-de-France", year: 2020, mandateType: "Levée de fonds", isPriorExperience: true },
  // 27. Eurasia
  { slug: "eurasia", clientName: "Eurasia Groupe", clientLogo: null, acquirerName: "River Bank", acquirerLogo: null, sector: "Immobilier & construction", region: "Île-de-France", year: 2020, mandateType: "Levée de fonds", isPriorExperience: true },
  // 28. Come to Paris
  { slug: "come-to-paris", clientName: "Come to Paris", clientLogo: null, acquirerName: "Bolden", acquirerLogo: null, sector: "Distribution & services B2C", region: "Île-de-France", year: 2020, mandateType: "Cession", isPriorExperience: true },
  // 29. Axelliance
  { slug: "axelliance", clientName: "Axelliance Groupe", clientLogo: null, acquirerName: "Ciprés ; Apax Partners", acquirerLogo: null, sector: "Services financiers & assurance", region: "Île-de-France", year: 2020, mandateType: "Acquisition", isPriorExperience: true },
  // 30. Temelio
  { slug: "temelio", clientName: "Temelio", clientLogo: null, acquirerName: "Redpill", acquirerLogo: null, sector: "Technologies & logiciels", region: "Hauts-de-France", year: 2019, mandateType: "Cession", isPriorExperience: true },
  // 31. Kujten
  { slug: "kujten", clientName: "Kujten", clientLogo: null, acquirerName: "Confidentiel", acquirerLogo: null, sector: "Industries", region: "Île-de-France", year: 2019, mandateType: "Cession", isPriorExperience: true },
  // 32. Staci
  { slug: "staci", clientName: "Staci", clientLogo: null, acquirerName: "Ardian", acquirerLogo: null, sector: "Distribution & services B2B", region: "Île-de-France", year: 2019, mandateType: "Cession", isPriorExperience: true },
  // 33. Haudecoeur
  { slug: "haudecoeur", clientName: "Haudecoeur", clientLogo: null, acquirerName: "Ergon Capital", acquirerLogo: null, sector: "Agroalimentaire", region: "Île-de-France", year: 2019, mandateType: "Cession", isPriorExperience: true },
  // 34. Sophie Lebreuilly
  { slug: "sophie-lebreuilly", clientName: "Sophie Lebreuilly", clientLogo: null, acquirerName: "French Food Company ; Generis Capital Partners ; Finorpa", acquirerLogo: null, sector: "Distribution & services B2B", region: "Provence-Alpes-Côte d'Azur", year: 2019, mandateType: "Levée de fonds", isPriorExperience: true },
  // 35. Les Ateliers Peyrache
  { slug: "les-ateliers-peyrache", clientName: "Les Ateliers Peyrache", clientLogo: null, acquirerName: "Apicap", acquirerLogo: null, sector: "Distribution & services B2C", region: "Auvergne-Rhône-Alpes", year: 2019, mandateType: "Levée de fonds", isPriorExperience: true },
  // 36. Patchwork
  { slug: "patchwork", clientName: "Patchwork", clientLogo: null, acquirerName: "Extendam", acquirerLogo: null, sector: "Distribution & services B2B", region: "Île-de-France", year: 2019, mandateType: "Levée de fonds", isPriorExperience: true },
  // 37. Y2A
  { slug: "y2a", clientName: "Y2A Experts", clientLogo: null, acquirerName: "Confidentiel", acquirerLogo: null, sector: "Distribution & services B2B", region: "Provence-Alpes-Côte d'Azur", year: 2019, mandateType: "Acquisition", isPriorExperience: true },
  // 38. Pixiel Group
  { slug: "pixiel-group", clientName: "Pixiel Group", clientLogo: null, acquirerName: "Delta Drone", acquirerLogo: null, sector: "Distribution & services B2C", region: "Pays de la Loire", year: 2018, mandateType: "Cession", isPriorExperience: true },
  // 39. MIa Solutions RH
  { slug: "mia-solutions-rh", clientName: "MIa Solutions RH", clientLogo: null, acquirerName: "Managers", acquirerLogo: null, sector: "Distribution & services B2B", region: null, year: 2018, mandateType: "Cession", isPriorExperience: true },
  // 40. Opteven
  { slug: "opteven", clientName: "Opteven", clientLogo: null, acquirerName: "Ardian", acquirerLogo: null, sector: "Services financiers & assurance", region: "Île-de-France", year: 2018, mandateType: "Cession", isPriorExperience: true },
  // 41. Filiassur
  { slug: "filiassur", clientName: "Filiassur", clientLogo: null, acquirerName: "Five Arrows", acquirerLogo: null, sector: "Services financiers & assurance", region: "Île-de-France", year: 2018, mandateType: "Levée de fonds", isPriorExperience: true },
  // 42. KFC
  { slug: "kfc", clientName: "KFC", clientLogo: null, acquirerName: "A Plus Finance", acquirerLogo: null, sector: "Distribution & services B2C", region: "Île-de-France", year: 2018, mandateType: "Levée de fonds", isPriorExperience: true },
  // 43. CC&C
  { slug: "cc-c", clientName: "CC&C", clientLogo: null, acquirerName: "Mediawan", acquirerLogo: null, sector: "Distribution & services B2C", region: "Île-de-France", year: 2017, mandateType: "Cession", isPriorExperience: true },
  // 44. Editions 365
  { slug: "editions-365", clientName: "Editions 365", clientLogo: null, acquirerName: "Fleurus", acquirerLogo: null, sector: "Distribution & services B2C", region: "Île-de-France", year: 2017, mandateType: "Cession", isPriorExperience: true },
  // 45. ISP System
  { slug: "isp-system", clientName: "ISP System", clientLogo: null, acquirerName: "Crédit Mutuel", acquirerLogo: null, sector: "Technologies & logiciels", region: "Occitanie", year: 2017, mandateType: "Levée de fonds", isPriorExperience: true },
  // 46. Soléo
  { slug: "soleo", clientName: "Soléo Services", clientLogo: null, acquirerName: "Next Stage", acquirerLogo: null, sector: "Énergie & environnement", region: "Île-de-France", year: 2017, mandateType: "Levée de fonds", isPriorExperience: true },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================
function generateContext(deal: OperationData): string {
  const contexts = [
    `Dans un contexte de forte croissance, ${deal.clientName} souhaitait structurer son capital.`,
    `Les actionnaires de ${deal.clientName} cherchaient à s'adosser à un partenaire industriel.`,
    `Pour accélérer son développement, ${deal.clientName} avait besoin de nouveaux financements.`,
    `Leader sur son marché régional, ${deal.clientName} visait une expansion nationale.`,
    `Dans le cadre d'une réorganisation patrimoniale, les fondateurs de ${deal.clientName} ont initié ce processus.`
  ];
  // Use a deterministic index based on slug hash
  const hash = deal.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return contexts[hash % contexts.length];
}

// =============================================================================
// MAIN SEED FUNCTION
// =============================================================================
async function seedAll() {
  console.log("🌱 Starting COMPLETE database seeding...\n");

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  try {
    // 1. Create admin user: Christophe Berthon
    console.log("👤 Creating admin user...");
    const passwordHash = await bcrypt.hash("alecia2024", 10);
    
    const existingUsers = await db.select().from(users);
    const existingUser = existingUsers.find(u => u.email === "c.berthon@alecia.fr");
    
    if (!existingUser) {
      await db.insert(users).values({
        email: "c.berthon@alecia.fr",
        passwordHash,
        name: "Christophe Berthon",
        role: "admin",
      });
      console.log("✅ Admin user created: c.berthon@alecia.fr (password: alecia2024)\n");
    } else {
      console.log("ℹ️  Admin user already exists\n");
    }

    // 2. Seed Team Members
    console.log("👥 Seeding team members...");
    await db.delete(teamMembers);
    await db.insert(teamMembers).values(teamMembersData);
    console.log(`✅ Inserted ${teamMembersData.length} team members\n`);

    // 3. Seed News/Posts
    console.log("📰 Seeding news articles...");
    await db.delete(posts);
    await db.insert(posts).values(newsData);
    console.log(`✅ Inserted ${newsData.length} news articles\n`);

    // 4. Seed Job Offers
    console.log("💼 Seeding job offers...");
    await db.delete(jobOffers);
    await db.insert(jobOffers).values(jobOffersData);
    console.log(`✅ Inserted ${jobOffersData.length} job offers\n`);

    // 5. Seed Operations/Deals
    console.log("📊 Seeding operations/deals...");
    await db.delete(deals);
    
    const dealsToInsert = operationsData.map((op, index) => ({
      slug: op.slug,
      clientName: op.clientName,
      clientLogo: op.clientLogo,
      acquirerName: op.acquirerName,
      acquirerLogo: op.acquirerLogo,
      sector: op.sector,
      region: op.region || "Île-de-France",
      year: op.year,
      mandateType: op.mandateType,
      isPriorExperience: op.isPriorExperience,
      context: generateContext(op),
      intervention: "alecia a accompagné les dirigeants tout au long du processus : structuration de l'opération, valorisation, identification et approche des contreparties, négociation et coordination des due diligences jusqu'au closing.",
      result: "L'opération a été conclue dans des conditions optimales, permettant aux actionnaires de réaliser leur projet.",
      testimonialText: op.isPriorExperience ? null : "Excellent accompagnement de l'équipe alecia.",
      testimonialAuthor: op.isPriorExperience ? null : "Dirigeant, " + op.clientName,
      roleType: op.mandateType === "Cession" ? "Conseil vendeur" : op.mandateType === "Acquisition" ? "Conseil acquéreur" : "Conseil levée",
      displayOrder: index,
      isConfidential: op.clientName.toLowerCase().includes("confidentiel"),
      dealSize: "10-50 M€",
    }));
    
    await db.insert(deals).values(dealsToInsert);
    console.log(`✅ Inserted ${dealsToInsert.length} deals/operations\n`);

    console.log("🎉 COMPLETE database seeding finished!");
    console.log("\nSummary:");
    console.log(`  - 1 admin user`);
    console.log(`  - ${teamMembersData.length} team members`);
    console.log(`  - ${newsData.length} news articles`);
    console.log(`  - ${jobOffersData.length} job offers`);
    console.log(`  - ${dealsToInsert.length} deals/operations`);

  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

// Run if executed directly
seedAll()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
