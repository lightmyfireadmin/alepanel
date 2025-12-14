
import { db } from "./index";
import { posts, jobOffers } from "./schema";


const newsItems = [
    {
        titleFr: "alecia conseille SAFE GROUPE dans le cadre de l’acquisition de Dogs Security",
        slug: "safe-groupe-acquisition-dogs-security",
        contentFr: "Acteur majeur de la sécurité globale en France, SAFE GROUPE poursuit sa stratégie de développement en annonçant l’acquisition de Dogs Security. Cette opération lui permet de renforcer son maillage territorial avec un nouveau bureau en Île-de-France.\n\nL'équipe d'Alecia est fière d'avoir accompagné les dirigeants dans cette étape clé de leur croissance externe.",
        category: "Communiqué" as const,
        coverImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
        isPublished: true,
        publishedAt: new Date("2024-12-14"),
        titleEn: "alecia advises SAFE GROUPE on the acquisition of Dogs Security",
    },
    {
        titleFr: "Le top 10 des éléments à prendre en compte pour estimer la valeur de son entreprise",
        slug: "top-10-estimation-valeur-entreprise",
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
Une structure saine, sans contentieux majeurs et optimisée fiscalement, facilite la transaction et évite les décotes de dernière minute (garantie de passif).

## 8. La qualité des processus et du reporting
Une entreprise structurée avec des outils de gestion performants et un reporting financier fiable inspire confiance et accélère les due diligences.

## 9. Le potentiel de croissance (Scalabilité)
La capacité de l'entreprise à croître sans augmenter ses coûts fixes dans les mêmes proportions est un levier de valeur puissant.

## 10. Le "Fit" stratégique
La valeur n'est pas absolue : elle dépend aussi de l'acquéreur. Les synergies potentielles (commerciales, coûts) avec un acheteur stratégique peuvent faire grimper le prix bien au-delà des standards financiers.

### Vous envisagez de céder votre entreprise ?
Ne laissez pas le marché décider pour vous. Une préparation minutieuse est la clé pour maximiser la valeur de votre patrimoine professionnel. **Contactez l'équipe d'Alecia pour un échange confidentiel sur vos projets de transmission.**`,
        category: "Article" as const,
        coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2626&ixlib=rb-4.0.3",
        isPublished: true,
        publishedAt: new Date("2024-12-10"),
        titleEn: "Top 10 factors to consider when valuing your company",
    },
    {
        titleFr: "Comment mettre toutes les chances de mon côté pour lever des fonds ?",
        slug: "reussir-sa-levee-de-fonds",
        contentFr: `Lever des fonds est souvent une étape indispensable pour accélérer, mais c'est aussi un parcours du combattant. En 2024-2025, les investisseurs sont devenus plus sélectifs, privilégiant la rentabilité à l'hyper-croissance à tout prix.

Voici comment structurer votre démarche pour convaincre.

## 1. Avoir un "Equity Story" clair et cohérent
Votre vision doit être limpide. Quel problème résolvez-vous ? Pourquoi êtes-vous la meilleure équipe pour le faire ? Votre histoire doit donner envie de s'associer à votre succès.

## 2. Maîtriser ses chiffres sur le bout des doigts
L'époque des promesses vagues est révolue. Vous devez présenter un Business Plan réaliste, connaître vos unit economics (CAC, LTV, Churn) et justifier chaque hypothèse de croissance.

## 3. Démontrer une "Traction" tangible
Rien ne convainc mieux que des preuves de marché. Clients signés, croissance du MRR, partenariats stratégiques... Montrez que la machine est lancée et que le capital ne servira qu'à accélérer.

## 4. Structurer une Data Room irréprochable
La confiance se gagne dans les détails. Une Data Room organisée (juridique, social, financier) montre votre professionnalisme et permet aux investisseurs d'aller vite.

## 5. Choisir le bon timing
Ne levez pas quand vous n'avez plus de cash. Le meilleur moment pour lever est quand vous avez encore 6 à 9 mois de runway et de bonnes nouvelles à annoncer.

## 6. Se faire accompagner
Une levée de fonds est chronophage. Avoir un conseil à vos côtés vous permet de rester concentré sur le business pendant que nous gérons le processus, les négociations et la structuration du deal.

### Prêt à passer à la vitesse supérieure ?
Chez Alecia, nous connectons les entrepreneurs visionnaires avec les bons partenaires financiers. **Discutons de votre stratégie de financement autour d'un café.**`,
        category: "Article" as const,
        coverImage: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
        isPublished: true,
        publishedAt: new Date("2024-12-05"),
        titleEn: "How to maximize your chances of raising funds successfully",
    },
    {
        titleFr: "Les 5 secteurs dynamiques sur la Côte d'Azur en 2025",
        slug: "secteurs-dynamiques-cote-azur-2025",
        contentFr: `La région Sud et la Côte d'Azur ne sont pas seulement des terres de tourisme. En 2025, l'écosystème économique local se transforme, porté par l'innovation et l'attractivité internationale.

Voici les 5 secteurs qui tirent la croissance régionale et attirent les investisseurs.

## 1. La Tech et l'Intelligence Artificielle (Sophia Antipolis)
Avec Sophia Antipolis comme fer de lance, la région continue d'attirer les talents et les capitaux dans la tech. L'IA appliquée à la santé et à la mobilité est particulièrement dynamique.

## 2. La Smart City et les éco-technologies
Nice et sa métropole investissent massivement pour devenir des modèles de "Green Smart City". Les solutions de gestion de l'eau, de l'énergie et des déchets trouvent ici un terrain d'expérimentation idéal.

## 3. L'industrie du luxe et de l'expérientiel
Au-delà de l'hôtellerie traditionnelle, on observe une montée en gamme des services "lifestyle" : conciergerie digitale, événementiel exclusif, yachting écologique. Ce secteur reste une valeur refuge très rentable.

## 4. La Santé et les MedTech
Le tissu de cliniques privées, couplé à la recherche universitaire niçoise, favorise l'éclosion de startups dans les dispositifs médicaux et la e-santé, un secteur très résilient aux crises.

## 5. L'immobilier tertiaire premium
L'attractivité de la Côte d'Azur pour les cadres internationaux (télétravail, qualité de vie) booste la demande pour des espaces de bureaux flexibles et haut de gamme.

### Vous opérez dans l'un de ces secteurs ?
Que vous souhaitiez croître par acquisition ou céder votre entreprise au moment opportun, votre positionnement est stratégique. **L'équipe Alecia, ancrée localement, vous aide à décrypter les opportunités de votre marché.**`,
        category: "Article" as const,
        coverImage: "https://images.unsplash.com/photo-1534234828563-025417436aa8?auto=format&fit=crop&q=80&w=2669&ixlib=rb-4.0.3",
        isPublished: true,
        publishedAt: new Date("2024-12-01"),
        titleEn: "Top 5 dynamic sectors on the French Riviera in 2025",
    },
    {
        titleFr: "Pourquoi se faire accompagner par un cabinet M&A pour céder son entreprise ?",
        slug: "pourquoi-mandat-conseil-ma",
        contentFr: `Céder son entreprise est souvent l'opération financières la plus importante d'une vie. Pourtant, de nombreux dirigeants tentent l'aventure seuls, pensant économiser des honoraires. C'est souvent un calcul perdant.

Voici pourquoi un accompagnement professionnel change la donne.

## 1. Briser la solitude du dirigeant
Vendre est un processus émotionnel et solitaire. Avoir un tiers de confiance neutre permet de garder la tête froide et de prendre les décisions rationnelles aux moments critiques.

## 2. Créer une tension concurrentielle
C'est la règle d'or : pas de concurrence, pas d'optimisation du prix. Un cabinet M&A sait comment approcher plusieurs acquéreurs simultanément sans "brûler" le dossier, créant ainsi une surenchère vertueuse.

## 3. Gagner du temps (et rester concentré)
Une cession prend 6 à 12 mois. Si vous gérez tout seul, qui s'occupe de l'entreprise ? Si les performances chutent pendant le processus, le prix de vente chutera aussi. Nous gérons le processus pour que vous gériez votre business.

## 4. Sécuriser la transaction juridique
Le prix n'est rien sans les conditions (Garantie d'Actif et de Passif, Earn-out, clauses de non-concurrence). Nous négocions le pacte global pour protéger votre patrimoine après la vente.

## 5. Accéder à des acheteurs hors radar
Votre réseau est précieux, mais le nôtre est mondial. Les meilleurs acquéreurs sont souvent ceux auxquels on ne pense pas spontanément : fonds d'investissement, groupes étrangers, concurrents indirects.

### Vous méritez le meilleur pour votre sortie
Chez Alecia, nous ne sommes pas de simples intermédiaires, nous sommes vos partenaires de négociation. **Contactez-nous pour évaluer le potentiel de votre entreprise.**`,
        category: "Article" as const,
        coverImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=2669&ixlib=rb-4.0.3",
        isPublished: true,
        publishedAt: new Date("2024-11-20"),
        titleEn: "Why hire an M&A advisory firm to sell your business?",
    },
    {
        titleFr: "Transmission d'entreprise : Anticiper pour mieux réussir",
        slug: "transmission-entreprise-anticipation",
        contentFr: `Le mot d'ordre d'une transmission réussie est simple : **Anticipation**. Une vente précipitée (pour cause de santé, lassitude ou urgence financière) se solde presque toujours par une décote.

Idéalement, une cession se prépare 12 à 24 mois à l'avance. Voici les chantiers prioritaires.

## 1. Nettoyer le bilan
Sortez les actifs non stratégiques (immobilier perso, véhicules de complaisance), purgez les vieux contentieux et optimisez le BFR. Un bilan "propre" est beaucoup plus lisible et attrayant.

## 2. Structurer le "Middle Management"
Si vous partez demain, l'entreprise s'arrête-t-elle ? Si la réponse est oui, la valeur de votre PME est fragile. Déléguez, formez et fidélisez vos cadres clés avant de vendre.

## 3. Documenter les processus
Le savoir-faire est-il dans les têtes ou dans les procédures ? Formaliser les méthodes de travail rassure l'acquéreur sur la pérennité de l'activité après votre départ.

## 4. Auditer ses contrats
Vérifiez que vos contrats clients et fournisseurs clés sont cessibles (clauses de changement de contrôle). Sécurisez vos baux commerciaux et votre propriété intellectuelle.

## 5. Préparer sa fiscalité personnelle
L'impact fiscal de la cession peut varier du simple au double selon les montages (Holding, apport-cession, pacte Dutreil, départ retraite). Ces mécanismes doivent être mis en place bien en amont de la signature.

### N'attendez pas d'être au pied du mur
La préparation est le meilleur investissement que vous puissiez faire pour votre sortie. **Prenons rendez-vous pour auditer la "transmissibilité" de votre entreprise dès aujourd'hui.**`,
        category: "Article" as const,
        coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2671&ixlib=rb-4.0.3",
        isPublished: true,
        publishedAt: new Date("2024-11-15"),
        titleEn: "Business Transmission: Anticipate to succeed",
    }
];

const jobs = [
    {
        title: "Analyste",
        slug: "analyste-lorient",
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
        ]
    }
];

async function seedExtra() {
  console.log("🌱 Starting extra content seeding (News & Jobs)...");

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  // Clear existing? Maybe not 'deleteAll' indiscriminately if we have other data, 
  // but for migration it's safer to be idempotent or clean.
  // I'll delete from posts and jobOffers.
  await db.delete(posts);
  await db.delete(jobOffers);

  console.log(`Seeding ${newsItems.length} posts...`);
  await db.insert(posts).values(newsItems);

  console.log("Seeding job offers...");
  await db.insert(jobOffers).values(jobs);

  console.log("✅ Successfully seeded extra content.");
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedExtra().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}
