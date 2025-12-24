# 🎯 Feuille de Route Intégrale — Faire du Site alecia la Référence M&A PME-ETI en France (2025)

> **Document exhaustif de 75+ points d'action** alignant l'audit du code actuel (Next.js 16, Tailwind v4, Drizzle ORM/PostgreSQL), le rapport « Optimisation Site Web M&A PME_ETI France » et les meilleures pratiques du secteur.

---

## 📊 Synthèse de l'Audit Codebase Actuel

### ✅ Points Forts Identifiés

| Élément                             | Fichier/Composant                                 | État                                        |
| ----------------------------------- | ------------------------------------------------- | ------------------------------------------- |
| Hero dual-CTA (cédant/acquéreur)    | `src/app/page.tsx`                                | ✅ Implémenté                               |
| Compteurs animés                    | `src/components/features/animated-counter.tsx`    | ✅ Fonctionnel                              |
| Carte régionale France              | `src/components/features/regional-map.tsx`        | ✅ SVG précis                               |
| Outil de valorisation (Lead Magnet) | `src/components/features/valuation-estimator.tsx` | ✅ Multiples sectoriels                     |
| Cookie banner RGPD                  | `src/components/features/cookie-banner.tsx`       | ⚠️ Basique (manque granularité)             |
| Formulaire contact rate-limited     | `src/app/api/contact/route.ts`                    | ✅ Protection anti-spam                     |
| Sitemap dynamique                   | `src/app/sitemap.ts`                              | ✅ 8 pages indexées                         |
| Robots.txt                          | `src/app/robots.ts`                               | ✅ Admin/API exclus                         |
| i18n next-intl (fr/en)              | `src/messages/fr.json`, `en.json`                 | ✅ Traductions complètes                    |
| Schema Drizzle complet              | `src/lib/db/schema.ts`                            | ✅ 12 tables (deals, contacts, projects...) |

### 🔴 Gaps Critiques à Combler

| Gap                                                           | Impact          | Priorité |
| ------------------------------------------------------------- | --------------- | -------- |
| Données mock (`mockDeals` dans `data.ts`) au lieu de BDD      | UX/Crédibilité  | 🔴 P0    |
| Pas de pages sectorielles dédiées                             | SEO/Conversion  | 🔴 P1    |
| CMP cookies trop simple (pas Axeptio/Didomi)                  | RGPD            | 🔴 P1    |
| Mentions légales incomplètes (AMF/ORIAS/Médiateur manquants)  | Conformité      | 🔴 P0    |
| Contact form non raccordé CRM                                 | Deal Flow       | 🔴 P1    |
| Pas d'espace investisseur/VDR                                 | Deal Flow       | 🟠 P2    |
| Tombstones sans études de cas enrichies                       | Crédibilité     | 🟠 P2    |
| Pas de Schema.org structuré                                   | SEO             | 🟠 P2    |
| Biographies équipe limitées (pas de `bioFr`/`bioEn` peuplées) | People Business | 🟠 P2    |

---

## 🗺️ Roadmap Détaillée — 75+ Actions Prioritaires

---

### 🎯 PHASE 0 — Alignement Stratégique & Cadrage (Semaine 1)

#### Personas & Messaging

1. **Atelier personas cédant** — Définir les 3 profils cédants types (primo-cédant retraite, transmission familiale, LBO secondaire) avec pain points et motivations
2. **Atelier personas acquéreur** — Définir profils acquéreurs (fonds PE, family office, corporate M&A, MBI manager)
3. **Atelier personas talent** — Profil candidat idéal (ex-banquier, ex-big4, école de commerce)
4. **Message différenciant** — Formaliser le positionnement "boutique growth vs institutionnel forteresse" → Recommandation : boutique agile avec ancrage régional
5. **Tone of Voice** — Documenter voix "Expert, Empathique, Résolu" avec exemples de wording DO/DON'T

#### Inventaire Légal

6. **Collecte SIREN/SIRET** — SAS 980 823 231 RCS Nice ✅ (déjà dans mentions légales)
7. **Numéro TVA intracommunautaire** — Ajouter FR XX 980823231
8. **Enregistrement ORIAS/AMF** — Vérifier si CIF requis selon activité et obtenir numéro
9. **Association agréée** — Adhésion CNCEF ou ANACOFI si applicable
10. **Médiateur consommation** — Identifier et contractualiser avec médiateur agréé
11. **DPO désigné** — Nommer DPO (Christophe Berthon ou externe) + email dédié rgpd@alecia.fr
12. **Politique LCB-FT** — Documenter procédures KYC/AML internes

#### Branding & Design System

13. **Palette définitive** — Verrouiller tokens dans `globals.css` :
    - Primary : Bleu profond (#1a2744 actuel ✅)
    - Accent : Or/Cuivre (#c9a227 actuel ✅)
    - ESG : Vert croissance (#2d9d58)
14. **Typographies** — Confirmer Playfair Display (titres) + Inter (corps) ✅ déjà en place
15. **Direction photo** — Planifier shooting équipe + bureaux régionaux (bannir Unsplash pour portraits)
16. **Kit Figma** — Exporter tokens Tailwind v4 vers fichier Figma partagé

#### SEO & Mots-Clés

17. **Liste mots-clés longue traîne** — Créer fichier `SEO_KEYWORDS.md` avec :
    - Géographiques : "cabinet fusion acquisition Lyon", "cession PME PACA"
    - Sectoriels : "transmission entreprise BTP", "levée fonds SaaS"
    - Typologiques : "MBO accompagnement", "valorisation PME industrielle"
18. **Analyse concurrence SEO** — Auditer In Extenso, Synercom, Cambon Partners

---

### 📐 PHASE 1 — Architecture de l'Information & Contenus (Semaines 2-3)

#### Nouvelle Arborescence

19. **Page Secteurs parent** — Créer route `/secteurs` avec liste des 9 verticales définies dans `SECTORS` du schema.ts :

    - Technologies & logiciels
    - Distribution & services B2B
    - Distribution & services B2C
    - Santé
    - Immobilier & construction
    - Industries
    - Services financiers & assurance
    - Agroalimentaire
    - Énergie & environnement

20. **Pages sectorielles individuelles** — Créer `/secteurs/[slug]` avec pour chaque :

    - Thèse d'investissement sectorielle
    - Transactions filtrées du secteur (query from DB)
    - Associé référent avec lien vers `/equipe/[slug]`
    - FAQ contextualisée
    - CTA dual funnel spécifique

21. **Page International/Réseau** — Créer `/reseau` avec :

    - Partenariats internationaux (Clairfield, Oaklins si applicable)
    - Carte Europe/Monde interactive
    - Témoignages cross-border

22. **Route dynamique équipe** — Créer `/equipe/[slug]/page.tsx` avec bio complète :

    ```typescript
    // Enrichir schema teamMembers avec bioFr, bioEn, sectorsExpertise
    bioFr: text("bio_fr"),
    bioEn: text("bio_en"),
    sectorsExpertise: text("sectors_expertise").array(),
    transactions: uuid("transaction_ids").array(), // FK vers deals
    ```

23. **Page Insights/Blog** — Renommer `/actualites` en `/insights` avec catégories :

    - Analyses de marché
    - Points de vue
    - Communiqués de presse
    - Guides pratiques (nouvelle catégorie)

24. **Contenus pédagogiques obligatoires** — Créer articles pour :
    - "Guide complet de la cession d'entreprise"
    - "Comprendre les obligations Loi Hamon"
    - "LBO : définition et mécanismes"
    - "Valorisation PME : méthodes et multiples"

#### Tombstones Enrichis

25. **Refonte `/operations/[slug]`** — Transformer les deal cards en études de cas :

    ```typescript
    // Enrichir schema deals avec :
    context: text("context"), // Contexte de l'opération
    intervention: text("intervention"), // Notre intervention
    result: text("result"), // Résultats obtenus
    testimonialText: text("testimonial_text"), // Verbatim client
    testimonialAuthor: text("testimonial_author"),
    roleType: text("role_type"), // "Conseil vendeur" | "Conseil acquéreur"
    dealSize: text("deal_size"), // Fourchette valeur
    keyMetrics: jsonb("key_metrics"), // {"multiple": 6.5, "duration": "8 mois"}
    ```

26. **Badge rôle visuel** — Ajouter badge coloré dans DealCard.tsx :

    - Bleu : Conseil vendeur
    - Or : Conseil acquéreur
    - Vert : Levée de fonds

27. **Indicateurs clés visuels** — Ajouter dans page deal :
    - Multiple obtenu vs marché
    - Durée de la mission
    - Nombre d'acquéreurs approchés

---

### 🎨 PHASE 2 — UI/UX « Modèle 2025 » (Semaines 3-5)

#### Hero & Dual Funnel

28. **Améliorer parcours cédant** — Après clic CTA "Je souhaite céder" :

    - Formulaire multi-step avec pré-filtrage (CA, secteur, urgence)
    - Anonymisation par défaut proposée
    - Score de qualification automatique

29. **Améliorer parcours acquéreur** — Après clic CTA "Je souhaite acquérir" :

    - Inscription newsletter deal flow
    - Formulaire critères d'acquisition
    - Accès espace investisseur

30. **Hero video background** — Remplacer `HeroBackground.tsx` par vraie vidéo :
    - Séquences bureau, réunions, ville (silencieuse, loop)
    - Fallback image optimisée pour slow connections
    - `prefers-reduced-motion` respecté

#### Mobile-First

31. **Sticky footer CTA mobile** — Implémenter dans layout.tsx :

    ```tsx
    // Afficher uniquement sur mobile avec boutons :
    // 📞 Appeler | ✉️ Email | 💬 WhatsApp
    ```

32. **Cards deals responsives** — Adapter DealCard.tsx pour affichage carte sur mobile (pas tableau)

33. **Navigation thumb-friendly** — Bouger CTA principaux dans zone pouce (bas écran)

#### Imagerie & Média

34. **Shooting photo équipe** — Planifier avec :

    - Direction artistique cohérente
    - Fond neutre ou bureaux réels
    - Tenues business casual coordonnées

35. **Photos bureaux régionaux** — Capturer :

    - Vue emblématique ville (Place Bellecour Lyon, Promenade Nice...)
    - Intérieur bureaux si applicable

36. **Supprimer images stock** — Auditer et remplacer toute image Unsplash par vraies photos

#### Dataviz & Chiffres

37. **Enrichir compteurs homepage** — Ajouter dans page.tsx :

    - "€XXM+ valeur cumulée" (animation)
    - "XX clients satisfaits" (nouveau)
    - "XX ans d'expérience cumulée" (nouveau)

38. **Graphiques insights** — Intégrer charts Recharts/Chart.js pour :
    - Évolution multiples EBITDA par secteur
    - Répartition géographique des deals

#### Accessibilité

39. **Audit WCAG AA** — Vérifier :

    - Contraste couleurs (ratio 4.5:1 minimum)
    - Focus states visibles
    - Alt text sur toutes images
    - Navigation clavier complète

40. **Skip to content link** — Ajouter lien invisible en haut de page

41. **Aria labels** — Enrichir tous les boutons icône-only

---

### ⚙️ PHASE 3 — Deal Engine & Base de Données (Semaines 5-7)

#### Migration Données

42. **Supprimer mockDeals** — Dans `src/lib/data.ts`, remplacer par :

    ```typescript
    // Importer depuis Drizzle
    import { db } from "@/lib/db";
    import { deals } from "@/lib/db/schema";
    export const getDeals = async () => await db.select().from(deals);
    ```

43. **Seed database** — Créer migration avec données initiales :

    - 30+ transactions minimum
    - 8 membres équipe avec bios complètes
    - 5+ articles insights

44. **Tables complémentaires** — Ajouter si manquantes :

    ```typescript
    // sectors (entité séparée avec metadata)
    export const sectors = pgTable("sectors", {
      id: uuid("id").defaultRandom().primaryKey(),
      slug: text("slug").unique().notNull(),
      name: text("name").notNull(),
      description: text("description"),
      investmentThesis: text("investment_thesis"),
      referentPartnerId: uuid("referent_partner_id").references(
        () => teamMembers.id
      ),
    });

    // offices (bureaux régionaux)
    export const offices = pgTable("offices", {
      id: uuid("id").defaultRandom().primaryKey(),
      name: text("name").notNull(),
      city: text("city").notNull(),
      region: text("region").notNull(),
      address: text("address"),
      phone: text("phone"),
      imageUrl: text("image_url"),
    });

    // testimonials (verbatims clients)
    export const testimonials = pgTable("testimonials", {
      id: uuid("id").defaultRandom().primaryKey(),
      dealId: uuid("deal_id").references(() => deals.id),
      authorName: text("author_name").notNull(),
      authorRole: text("author_role"),
      content: text("content").notNull(),
      rating: integer("rating"), // 1-5
    });
    ```

#### CMS Admin

45. **CRUD Deals enrichi** — Dans `/admin/deals`, ajouter champs :

    - Upload logos (Vercel Blob existant)
    - Rich text pour context/intervention/result
    - Sélecteur associé référent

46. **CRUD Secteurs** — Créer `/admin/sectors` avec :

    - Édition thèse d'investissement
    - Association associé référent
    - Gestion FAQ

47. **Prévisualisation tombstone** — Dans admin, bouton "Voir sur le site" avec draft mode

#### Moteur de Recherche

48. **Filtrage AJAX temps réel** — Dans DealFilter.tsx :

    - State synchronisé avec URL params ✅ (déjà fait)
    - Debounce sur recherche texte
    - Compteur résultats temps réel

49. **Pagination** — Ajouter dans `/operations` :

    - 12 deals par page
    - Infinite scroll ou pagination classique

50. **Export PDF/CSV** — Bouton admin pour exporter liste transactions avec template branded

#### Espace Investisseur

51. **Route protégée `/investisseur`** — Créer avec NextAuth :

    - Login investisseur séparé de admin
    - Liste teasers publics
    - Formulaire demande accès NDA

52. **Teaser generator** — Template PDF automatique avec :
    - Informations anonymisées
    - Métriques clés
    - Contact associé référent

---

### 🔗 PHASE 4 — Intégrations & Automatisations (Semaines 7-9)

#### CRM

53. **Webhook contact form → CRM** — Dans `/api/contact/route.ts` :

    ```typescript
    // Intégrer HubSpot/Pipedrive API
    // POST vers CRM avec champs :
    // - source: "website_contact_form"
    // - type_visiteur: "cédant" | "acquéreur" | "candidat"
    // - scoring_lead: calculé selon CA renseigné
    ```

54. **Webhook valuation estimator → CRM** — Après capture email dans ValuationEstimator.tsx :

    - Créer lead avec résultat valorisation
    - Notifier associé secteur concerné

55. **Synchronisation bidirectionnelle** — Deals fermés en CRM → update DB site

#### Deal Flow Privé

56. **Inscription investisseur** — Formulaire avec :

    - Critères d'acquisition (secteurs, taille, géo)
    - Validation manuelle par admin
    - Segmentation automatique CRM

57. **Alertes email** — Quand nouveau deal matche critères investisseur :
    - Email template branded
    - Lien vers teaser
    - CTA demande accès VDR

#### VDR/Data Room

58. **Intégration VDR** — Bouton "Accès Data Room" redirigeant vers :

    - Ideals, Drooms ou Intralinks (selon choix)
    - SSO si disponible
    - Tracking accès documents

59. **Liens magiques documents** — Déjà dans schema `documents.accessToken` :
    - Expiration configurable
    - Logging des accès

#### Maps & Localisation

60. **Carte bureaux interactive** — Dans `/contact` :
    - Mapbox avec markers bureaux
    - Popup avec numéro local (04, 05... pas 01 unique)
    - Directions click-to-call

---

### ⚖️ PHASE 5 — Conformité FR & RGPD (Semaines 8-9)

#### Mentions Légales Complètes

61. **Enrichir mentions-legales/page.tsx** — Ajouter sections manquantes :

    ```
    - N° SIRET : XXX XXX XXX XXXXX
    - N° TVA : FR XX XXXXXXXXX
    - Capital social : 1 000 € ✅
    - RCS Nice : 980 823 231 ✅
    - ORIAS : N° XX XXX XXX (si applicable)
    - AMF : Agrément/Enregistrement N° XXX (si applicable)
    - Association : Membre CNCEF/ANACOFI (si applicable)
    - Médiateur : [Nom médiateur] - [Adresse] - [Site web]
    - DPO : rgpd@alecia.fr
    ```

62. **Page CGU** — Créer `/conditions-generales` avec :
    - Conditions d'utilisation du site
    - Conditions d'utilisation espace investisseur
    - Limitations de responsabilité

#### Disclaimers Risques

63. **Bannière espace investisseur** — Ajouter en haut de `/investisseur` :

    > ⚠️ Investir comporte des risques de perte en capital. Les performances passées ne préjugent pas des performances futures. Les investissements présentés sont illiquides.

64. **Footer disclaimer** — Dans Footer.tsx, ajouter texte légal conditionnel sur pages opportunités

#### CMP Cookies Avancée

65. **Remplacer cookie-banner.tsx** — Intégrer Axeptio ou Didomi :

    - Consentement granulaire (Essentiel/Analytics/Marketing/Tiers)
    - Opt-out explicite possible
    - Preuve de consentement stockée
    - Intégration GTM conditionnelle

66. **Cookies essentiels only par défaut** — Ne charger analytics/marketing qu'après opt-in

#### Privacy by Design

67. **Chiffrement transit** — Vérifier SSL/TLS sur tout le domaine ✅

68. **Purge données leads** — Cron job pour supprimer leads inactifs > 24 mois

69. **Registre traitements** — Documenter dans `/legal/registre-traitements.pdf` :

    - Finalités traitement
    - Bases légales
    - Durées conservation
    - Sous-traitants

70. **Bannière LCB-FT** — Information sur obligations KYC avant contractualisation

---

### 📈 PHASE 6 — Performance, SEO & Analytics (Semaines 9-10)

#### Core Web Vitals

71. **Audit Lighthouse** — Objectifs :

    - LCP < 2.5s
    - FID/INP < 100ms
    - CLS < 0.1

72. **Optimisation images** — Vérifier usage systématique de `next/image` avec :

    - Format WebP/AVIF
    - Sizes appropriés
    - Priority sur above-the-fold

73. **Prefetch critique** — Dans layout.tsx :

    ```tsx
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
    ```

74. **Lazy loading** — Appliquer sur :

    - Images below-the-fold
    - Composants lourds (cartes, graphiques)
    - iframes

75. **Reduced motion** — Dans animations Framer Motion :
    ```tsx
    const prefersReducedMotion = useReducedMotion();
    // Désactiver animations si true
    ```

#### SEO Technique

76. **Métadonnées par page** — Vérifier/enrichir dans chaque page.tsx :

    - Title unique avec mot-clé principal
    - Description 150-160 caractères
    - Open Graph complet
    - Twitter cards

77. **Schema.org structuré** — Ajouter dans layout.tsx :

    ```json
    {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      "name": "alecia",
      "description": "Conseil en fusion-acquisition pour PME et ETI",
      "areaServed": "France",
      "serviceType": ["M&A Advisory", "Business Valuation", "Fundraising"],
      "address": {...},
      "sameAs": ["linkedin.com/company/alecia"]
    }
    ```

78. **BreadcrumbList schema** — Sur pages profondes :

    ```json
    { "@type": "BreadcrumbList", "itemListElement": [...] }
    ```

79. **Article schema** — Sur pages `/insights/*`

80. **Sitemap enrichi** — Ajouter dans sitemap.ts :

    - Toutes pages sectorielles dynamiques
    - Tous deals publics
    - Tous articles insights
    - Pages équipe individuelles

81. **Hreflang** — Implémenter avec next-intl pour fr/en

#### Analytics RGPD-Compliant

82. **Remplacer GA4 par Matomo** — Configuration :

    - Self-hosted ou Matomo Cloud EU
    - Mode sans cookies si refus
    - Dashboards funnel (cédant vs acquéreur)

83. **Tracking conversion** — Events à tracker :

    - Contact form submit
    - Valuation estimator complete
    - Newsletter signup
    - Click CTA deal flow

84. **Dashboards métier** — Créer dans Matomo :
    - Taux conversion par source
    - Pages les plus consultées
    - Parcours utilisateur type

#### Monitoring & Sécurité

85. **Headers sécurité** — Dans next.config.ts :

    ```typescript
    headers: [
      { key: "Content-Security-Policy", value: "..." },
      { key: "Strict-Transport-Security", value: "max-age=31536000" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    ];
    ```

86. **Rate limiting ajusté** — Dans `rate-limit.ts`, configurer par endpoint :

    - Contact form : 5/min ✅ (existant)
    - Valuation : 10/min
    - Newsletter : 3/min

87. **Alertes formulaires** — Notifications Slack/email si spike d'erreurs

---

### 🚀 PHASE 7 — Delivery & Gouvernance (Semaines 10-11)

#### Design System

88. **Documentation tokens** — Créer `/docs/design-system.md` avec :

    - Variables CSS complètes
    - Composants UI avec exemples
    - Guidelines usage

89. **Storybook** (optionnel) — Setup pour composants réutilisables

#### Tests E2E

90. **Setup Playwright** — Tests prioritaires :

    ```typescript
    // tests/e2e/contact.spec.ts
    test('contact form submits successfully', async ({ page }) => {...});

    // tests/e2e/deals.spec.ts
    test('deals filter by sector', async ({ page }) => {...});

    // tests/e2e/valuation.spec.ts
    test('valuation estimator flow', async ({ page }) => {...});
    ```

91. **Tests accessibilité** — Intégrer axe-core dans Playwright

92. **Tests responsive** — Viewports mobile/tablet/desktop

#### Process Déploiement

93. **Environnement staging** — Configurer branche `staging` → preview Vercel

94. **Checklist pré-déploiement** — Documenter dans `.github/DEPLOYMENT_CHECKLIST.md` :

    - [ ] Lint OK
    - [ ] Build OK
    - [ ] Tests E2E passent
    - [ ] Preview testée manuellement
    - [ ] Variables environnement à jour

95. **Rotation secrets** — Planifier rotation trimestrielle :
    - AUTH_SECRET
    - DATABASE_URL password
    - Tokens API (VDR, CRM, Mapbox)

#### Gouvernance Contenus

96. **Revue légale trimestrielle** — Calendrier pour vérifier :

    - Mentions légales à jour
    - CGV/CGU conformes
    - Disclaimers actualisés

97. **Revue opérations mensuelle** — Process pour ajouter nouvelles transactions

98. **Revue SEO bimensuelle** — Monitoring positions mots-clés cibles

---

## 📋 Décisions Clés à Trancher (Bloquantes)

| #   | Décision                   | Options                               | Impact                       | Owner     |
| --- | -------------------------- | ------------------------------------- | ---------------------------- | --------- |
| D1  | **CRM cible**              | Pipedrive / HubSpot / DealCloud       | Intégrations, coût, features | Direction |
| D2  | **VDR choisie**            | Ideals / Drooms / Intralinks          | Sécurité, coût, SSO          | Direction |
| D3  | **Statut réglementaire**   | CIF / Courtier / Autre                | Mentions AMF/ORIAS           | Juridique |
| D4  | **CMP cookies**            | Axeptio / Didomi                      | UX, conformité, coût         | Tech      |
| D5  | **Analytics**              | Matomo self-host / Matomo Cloud / GA4 | RGPD, coût, features         | Tech      |
| D6  | **Positionnement visuel**  | Boutique Growth / Institutionnel      | Design, wording              | Direction |
| D7  | **Périmètre investisseur** | Teaser wall simple / Mini data-room   | Développement, sécurité      | Direction |

---

## 📦 Livrables par Phase

| Phase  | Livrables Clés                                                     | Date Cible |
| ------ | ------------------------------------------------------------------ | ---------- |
| **P0** | Brief brand, liste légale complète, backlog SEO                    | S1         |
| **P1** | Arborescence validée, gabarits sectoriels, migration schema DB     | S3         |
| **P2** | Kit UI Figma, prototypes mobile, assets photo, tombstones enrichis | S5         |
| **P3** | Données live (plus de mock), CRUD admin complet, filtrage AJAX     | S7         |
| **P4** | Webhooks CRM, portail investisseur, liens VDR                      | S9         |
| **P5** | Mentions légales complètes, CMP Axeptio/Didomi, disclaimers        | S9         |
| **P6** | Score Lighthouse >90, Matomo live, Schema.org, sitemap enrichi     | S10        |
| **P7** | Tests E2E, checklist déploiement, process gouvernance              | S11        |

---

## 🎯 KPIs de Succès

| Métrique                            | Actuel | Cible S11 | Cible S24 |
| ----------------------------------- | ------ | --------- | --------- |
| Score Lighthouse Performance        | ~75    | >90       | >95       |
| Pages indexées Google               | 8      | 50+       | 100+      |
| Taux conversion contact form        | N/A    | 2%        | 5%        |
| Leads qualifiés/mois                | N/A    | 10        | 30        |
| Positions top 10 (mots-clés cibles) | 0      | 5         | 20        |
| NPS investisseurs portail           | N/A    | >40       | >60       |

---

## 🔄 Changelog Document

| Version | Date       | Modifications                                                       |
| ------- | ---------- | ------------------------------------------------------------------- |
| 1.0     | 2025-12-13 | Création initiale avec 75+ points d'action basés sur audit codebase |

---

> **Note** : Cette feuille de route a été générée après audit complet du codebase Next.js 16 (`alecia-app/`), du schema Drizzle, des composants features existants, et du rapport stratégique « Optimisation Site Web M&A PME_ETI France ». Les références aux fichiers sont précises et les gaps identifiés sont priorisés selon l'impact business et conformité.
