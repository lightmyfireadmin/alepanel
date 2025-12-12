# Feuille de route multi-phases pour faire du site Alecia la référence M&A PME-ETI en France (2025)

Ce plan s’appuie sur le rapport **« Optimisation Site Web M&A PME_ETI France »**, l’audit rapide du code actuel (Next.js 16, Tailwind v4, pages publiques `/`, `/expertises`, `/operations` avec filtres mock, `/equipe`, `/actualites`, `/contact`, `/mentions-legales`, `/politique-de-confidentialite`, `/nous-rejoindre`) et l’architecture annoncée dans le README (NextAuth, Drizzle/PostgreSQL, Vercel Blob, next-intl). Objectif : aligner parfaitement l’expérience, le wording, la conformité et les capacités techniques avec les standards M&A français 2025.

## Synthèse du gap actuel
- **Contenus/IA** : navigation déjà proche du sitemap cible mais données d’opérations mock (`mockDeals`) et biographies limitées. Pas de pages sectorielles dédiées ni d’études de cas détaillées.
- **Dual funnel** : CTA différenciés cédant/acquéreur présents sur le hero, mais pas de parcours complet (formulaires, scoring, nurturing).
- **Compliance** : pages Mentions légales et Politique de confidentialité existent, mais les mentions AMF/ORIAS, médiation et CMP cookies RGPD ne sont pas explicitement gérées dans le code.
- **Stack & intégrations** : CRM/VDR/Deal Flow non raccordés ; contact form envoie vers `/api/contact` sans hub CRM. Données transactions statiques, pas de moteur de recherche avancé (AJAX) ni d’espace investisseur.
- **UX/UI** : design déjà moderne (Hero vidéo possible via `HeroBackground`, counters, map), mais il manque les éléments « pixel perfect » attendus (photos authentiques, tombstones enrichis, dataviz, KPI ESG, sticky mobile CTA).

## Roadmap par phases (détaillée et actionnable)

### Phase 0 — Alignement & cadrage (Semaine 1)
- **Ateliers** : définir personas (cédant, acquéreur/fonds, talents), messages clés et différenciation (institutionnel vs boutique growth).
- **Inventaire légal** : collecter SIREN/SIRET, RCS, TVA, ORIAS/AMF, association agréée, médiateur, hébergeur, DPO, politique LCB-FT.
- **Branding** : verrouiller palette (bleu profond + accents or/cuivre), typos (Playfair/Merriweather + Inter/Montserrat), direction photo/vidéo.
- **SEO cible** : liste des mots-clés longue traîne par secteur + géographies (ex : « cabinet fusion acquisition Lyon », « cession PME industrielle Occitanie »).

### Phase 1 — Architecture de l’information & contenus (Semaines 2-3)
- **Sitemap conforme au rapport** : Home, Équipe, Transactions, Expertises, Secteurs (nouvelles pages par verticale), Insights/Actualités, Carrières, Contact, International/Réseau.
- **Pages sectorielles** : créer routes et modèles avec thèse d’investissement, transactions du secteur, associé référent, FAQ et CTA contextualisés.
- **Tombstones enrichis** : refondre `/operations/[slug]` en études de cas (Contexte / Intervention / Résultat / Verbatim) + badge rôle (Conseil vendeur/acquéreur) et indicateurs clés.
- **Contenus pédagogiques** : guides cession/LBO et Loi Hamon dans Insights ; mentions des obligations salariés.

### Phase 2 — UI/UX « modèle 2025 » (Semaines 3-5)
- **Hero & CTA dual funnel** : conserver double CTA mais étendre le parcours (pré-filtrage type de dossier, valeur indicative, anonymisation par défaut).
- **Mobile-first** : sticky footer CTA (Appeler/Emailer/WhatsApp) sur mobile, cards responsives pour le deal flow.
- **Imagerie réelle** : planifier shootings photos/vidéo équipe & bureaux régionaux ; bannir banques d’images.
- **Dataviz & chiffres clés** : compteurs animés (transactions, valeur cumulée, multiples moyens) et graphiques interactifs sur Insights.
- **Accessibilité & micro-interactions** : focus states, contrasts WCAG AA, animation légère via framer-motion existant.

### Phase 3 — Deal Engine & données (Semaines 5-7)
- **Modèle de données** : remplacer `mockDeals` par tables/migrations `deals`, `sectors`, `industries`, `offices`, `testimonials`; prévoir champs rôle, type (MBO/OBO/LBO), taille, année, zone, statut confidentialité.
- **CMS / back-office** : utiliser Drizzle + Next admin existant pour CRUD (upload logos en Vercel Blob, rich text pour cas clients).
- **Moteur de recherche** : filtrage AJAX (secteur, type, rôle, année, région, taille) avec URL state, pagination et exports PDF/CSV.
- **Espace investisseur** : route protégée (NextAuth) listant teasers publics, lien VDR par dossier, demande d’accès/NDAs.

### Phase 4 — Intégrations & automatisations (Semaines 7-9)
- **CRM** : connecter `/api/contact` et formulaires funnel à Pipedrive/HubSpot ou DealCloud (webhooks/API). Champs « type de visiteur » et scoring lead.
- **Deal Flow privé** : inscription investisseur → segmenter dans CRM, notifications aux associés responsables.
- **Data Room** : bouton « Accès Data Room » vers VDR (Ideals/Drooms/Intralinks) avec redirection SSO si disponible.
- **Maps & localisation** : carte des bureaux (Mapbox token déjà prévu) avec numéros locaux.

### Phase 5 — Conformité FR & RGPD (Semaines 8-9 en parallèle)
- **Mentions légales complètes** : enrichir page avec RCS, TVA, ORIAS/AMF, association agréée, médiateur, hébergeur, directeur de publication.
- **Disclaimers risques** : bandeaux/footers sur pages opportunités et espace investisseur (perte en capital, illiquidité).
- **Cookies/CMP** : intégrer Axeptio/Didomi (refus par défaut, granularité stats/marketing/tiers).
- **Privacy by design** : chiffrer en transit, purge/suppression des leads inactifs, registre de traitements, bannières LCB-FT.

### Phase 6 — Performance, SEO & analytics (Semaines 9-10)
- **Core Web Vitals** : optimisation images (next/image), prefetch critique, lazy loading, réduction framer-motion si mobile low-end.
- **SEO technique** : métadonnées par page, balisage Schema.org (Organization, BreadcrumbList, Article, FinancialService, Eventual Deal), sitemap/robots, hreflang fr/en (next-intl).
- **Analytics RGPD** : Matomo (self-host ou cloud EU) + tableaux de bord funnel (cédant vs acquéreur) et conversion formulaire.
- **Monitoring** : logs/alerts sur formulaires (rate limiting existant à ajuster), sécurité headers (CSP, HSTS, referrer-policy).

### Phase 7 — Delivery & gouvernance (Semaines 10-11)
- **Design system** : tokens Tailwind v4 (couleurs, typos, ombres, rayons) + kit Figma aligné.
- **Qualité** : scénarios E2E (Cypress/Playwright) pour funnels, formulaires, filtres deals, accessibilité (axe a11y).
- **Process** : checklists déploiement (préprod/staging), revue de contenus légaux trimestrielle, rotation secrets (AUTH_SECRET, tokens VDR/CRM).

## Décisions clés à trancher en amont
- **CRM cible** (Pipedrive/HubSpot vs DealCloud) pour structurer les webhooks et les champs leads.  
- **VDR** choisie et mode d’auth (SSO ou liens magiques par dossier).  
- **Positionnement visuel** : institutionnel « forteresse » vs boutique « growth » (influence palette/ton of voice).  
- **Périmètre du portail investisseur** : simple teaser wall vs mini data-room.  
- **CMP** : Axeptio (FR, UX) vs Didomi (entreprise).  

## Livrables attendus par phase (résumé)
- **P0** : brief brand, liste légale complète, backlog SEO mots-clés.  
- **P1** : arborescence validée, gabarits pages sectorielles & cas clients.  
- **P2** : kit UI (Figma + tokens), prototypes mobile/desktop, assets photo/vidéo.  
- **P3** : schéma DB + migrations, CRUD admin, moteur de filtres live, templates tombstones enrichis.  
- **P4** : connecteurs CRM, workflow lead scoring, portail investisseur, liens VDR.  
- **P5** : mentions légales/CGU/Privacy mises à jour, CMP en prod, disclaimers risques.  
- **P6** : rapport CWV, mise en place Matomo + dashboards, Schema.org & sitemap.  
- **P7** : scripts E2E clés, checklist déploiement/staging, gouvernance sécurité.  

Cette feuille de route permet d’orchestrer la montée en gamme du site pour qu’il devienne la référence M&A PME-ETI en France, conforme aux exigences AMF/RGPD, optimisé pour le deal flow et crédible auprès des dirigeants comme des investisseurs.
