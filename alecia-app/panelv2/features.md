# Fonctionnalités d'Alecia Panel V2 (M&A Operating System)

Ce document détaille l'ensemble des fonctionnalités de la plateforme, structurées pour les flux de travail M&A, Private Equity et Corporate Finance.

## 1. Identité, Rôles & Conformité (Identity & RBAC) - [Vérifié & Sécurisé]

**Objectif :** Sécuriser l'accès et garantir la traçabilité des actions dans un environnement confidentiel.

- **Authentification Unifiée (SSO) :** Connexion sécurisée via Clerk.
- **Gestion des Rôles (RBAC) :** Implémentée via `auth_utils.ts`. Vérification systématique dans les mutations `moveDeal`, etc.
- **Sudo Panel (Administration) :**
  - **Design System 2026 :** Dashboard principal implémenté avec sidebar haute densité et interface Linear-like.
  - **User Directory :** DataTable interactif pour la gestion des rôles.
  - **Theme Engine :** Éditeur d'apparence "Live" avec Color Pickers popover et sliders de précision pour le radius et la typographie. Injection CSS client-side pour zéro latence.
- **Profils Utilisateurs Enrichis :** Avatar, signature numérique (pour la validation de documents), et préférences de notification.
- **Audit Logs (Implicite) :** Traçabilité des actions critiques (validation de deal, modification de settings).

## 2. Smart CRM & Sourcing (Intelligence) - [Implemented]

**Objectif :** Centraliser l'intelligence marché et automatiser l'enrichissement des données cibles.

- **Fiches Sociétés "360°" :**
  - **Données Légales (Pappers) :** Implémenté via `CompanyEnricher.tsx`.
  - **Données Financières :** Stockage structuré des métriques clés (CA, EBITDA, Dette Nette, Valorisation Ask) avec historique par année.
  - **Identité Visuelle :** Récupération automatique des logos et descriptions.
- **Moteur de Recherche Connecté :** Recherche directe dans la base Pappers via l'API intégrée pour créer des fiches prospects instantanément.
- **Gestion des Contacts Clés :** Annuaire des dirigeants et actionnaires, liés aux entités juridiques, avec taggage dynamique (ex: "Cédant", "Expert-Comptable").
- **Enrichissement Automatique :** Bouton "Enrichir via Pappers" fonctionnel.

## 3. Deal Flow & Moteur d'Investissement - [Implemented]

**Objectif :** Piloter le cycle de vie des opportunités, du sourcing au closing, assisté par l'IA.

- **Pipeline Kanban Interactif :** Visualisation des deals par stade ("New", "Due Diligence", "LOI", "Closing") avec Drag & Drop (`@dnd-kit`).
- **Matching AI (Vector Search) :** Implémenté via `DealMatchmaker.tsx`.
  - **Embeddings :** Vectorisation automatique des descriptions de deals et des critères acquéreurs.
  - **Recherche Sémantique :** Identification automatique des acheteurs potentiels (`buyer_criteria`) pour une cible donnée basée sur la proximité vectorielle.
  - **Explication IA :** Justification textuelle du match par Groq.

## 4. Gouvernance & CMS ("Edit Everything") - [Implemented]

- **Éditeur de Contenu Riche (PageEditor) :** Édition WYSIWYG de pages (`site_pages`) via Tiptap.
- **Système de Vote (Governance Dashboard) :** Workflow de proposition/vote pour les modifications de contenu.

## 5. Outils de Productivité & Assets - [Implemented]

**Objectif :** Des outils métiers intégrés pour éviter la dispersion sur des logiciels tiers.

- **Data Room (Office 365) :** Intégration OneDrive via `DataRoom.tsx` et Graph API.
- **Pitch Deck Generator :** Création de PPTX via `DeckGenerator.tsx`.
- **Whiteboards Collaboratifs :** Intégration **tldraw** via `Whiteboard.tsx`. Idéal pour les brainstormings de structuration.
- **Notes Vocales Intelligentes :** Enregistreur natif avec transcription Whisper intégrée (`VoiceNoteRecorder.tsx`).

## 6. Dashboard (Implemented)

**Objectif :** Vue d'ensemble personnalisable.

- **Draggable Widgets :** Implémenté via `DraggableDashboard.tsx` et `react-grid-layout`.
- **Widgets Disponibles :** KPIs, Recent Deals, Activity Feed, Voice Notes, Whiteboard.

## 8. Reporting & Financial Intelligence (Implemented)

**Objectif :** Visualisation des données financières et analytiques.

- **Smart Charts :** Composant réutilisable (`SmartChart.tsx`) basé sur `recharts`.
- **Dashboard Financier :** Vue dédiée (`/admin/reporting`) avec comparatifs Revenue/EBITDA et tendances.
- **Moteur Financier :** Backend `finance.ts` prêt pour le parsing Excel et calculs complexes.

## 9. Pipedrive Integration (Implemented - 2026-01-07)

**Objectif :** Migration transparente depuis Pipedrive avec synchronisation bidirectionnelle.

- **Sync Pull :** Import automatique des Organizations, Persons et Deals depuis Pipedrive (`syncFromPipedrive`).
- **Sync Push :** Écriture des modifications vers Pipedrive (`pushDealToPipedrive`).
- **UI Intégrée :** Bouton "Pipedrive" dans les pages Sociétés et Pipeline avec dialog de statut.
- **Mapping Automatique :** Conversion des statuts Pipedrive (open/won/lost) vers les stages M&A.
- **Index de Liaison :** Champ `pipedriveId` sur `companies` et `deals` pour éviter les doublons.

## 10. Pipeline Configuration (Implemented - 2026-01-07)

**Objectif :** Personnalisation avancée du pipeline M&A.

- **Colonnes Personnalisables :** Table `kanban_columns` pour définir des étapes custom.
- **Ordonnancement :** Réordonnancement par drag & drop (`reorderKanbanColumns`).
- **Couleurs :** Code couleur par étape pour identification visuelle rapide.

## 11. Journal d'Activité (Implemented - 2026-01-07)

**Objectif :** Traçabilité complète des actions sur les dossiers.

- **Types d'Événements :** status_change, note_added, document_uploaded, meeting_scheduled, email_sent, call_logged.
- **Timeline Enrichie :** Affichage avec nom et avatar de l'utilisateur.
- **Filtrage :** Par dossier, société, ou utilisateur.
- **Logging Automatique :** Mutation interne pour enregistrement depuis les autres actions.

## 12. Forum Interne (Implemented - 2026-01-07)

**Objectif :** Communication d'équipe structurée.

- **Threads :** Création, épinglage, verrouillage.
- **Posts :** Réponses hiérarchiques avec édition.
- **Enrichissement :** Auteur, avatar, compteur de posts, dernière activité.
- **UI :** `ForumThreadList.tsx` avec dialog de création.

## 13. Blog CMS (Implemented - 2026-01-07)

**Objectif :** Publication de contenu interne/externe.

- **Workflow :** Draft → Published → Archived.
- **SEO :** Meta title, description, keywords.
- **Slug :** Génération automatique avec unicité.
- **Tags :** Catégorisation flexible.

## 14. Demandes de Signature (Implemented - 2026-01-07)

**Objectif :** Workflow de signature électronique intégré.

- **Types :** NDA, LOI, Mandat, Contrat.
- **Workflow :** pending → signed/rejected/expired.
- **Capture :** Signature canvas HTML5.
- **UI :** `SignatureRequestPanel.tsx` avec tabs.

## 15. Tâches de Recherche (Implemented - 2026-01-07)

**Objectif :** Gestion des tâches d'analyse et due diligence.

- **Kanban :** todo → in_progress → review → done.
- **Priorité :** low/medium/high avec badges visuels.
- **Statistiques :** Compteurs et retards.
- **UI :** `ResearchTaskBoard.tsx` avec Kanban 4 colonnes.

## 16. Navigation Sidebar (Updated - 2026-01-07)

**Mise à jour :** Ajout section Collaboration dans le menu.

- **Pipeline M&A :** `/admin/deals` - Kanban des dossiers.
- **Intelligence :** `/admin/crm` - Sociétés et contacts.
- **Collaboration :**
  - Forum (`/admin/forum`)
  - Recherche (`/admin/research`)
  - Signatures (`/admin/signatures`)
  - Blog (`/admin/blog`)
- **Labels FR :** Toute l'interface en français.

## 17. Marketing CMS (Implemented - 2026-01-07)

**Objectif :** Gestion complète du contenu marketing depuis le panel V2.

### Admin Pages

- **Track Record (`/admin/transactions`) :**
  - DataTable avec recherche et filtrage par secteur
  - Formulaire complet avec tous les champs M&A
  - Duplication, suppression, réordonnancement
- **Équipe (`/admin/team`) :**
  - Grille visuelle avec photos et toggles actif/inactif
  - Gestion des expertises sectorielles
- **Carrières (`/admin/careers`) :**
  - Table des offres d'emploi
  - Toggle publication instantané
- **Galerie (`/admin/tiles`) :**
  - Éditeur visuel de tuiles ambiance
  - Support image + son

### Convex Backend

- **`marketing.ts` :** Queries publiques (sans auth) pour le site web
- **`transactions.ts` / `team.ts` / `careers.ts` / `tiles.ts` :** CRUD mutations

### Site Marketing V1

- **Refactorisé :** `/operations`, `/equipe`, `/actualites`, `/nous-rejoindre`
- **Data Source :** Convex HTTP API via `convex-marketing.ts`
- **Cache :** Revalidation 60s pour performance

---

## 14. Foundation Polish (UX Enhancements) - [Implemented 2026-01-08]

### Navigation

- **Breadcrumbs :** Composant `<Breadcrumbs />` intégré dans admin layout
  - Détection automatique de la route via `usePathname()`
  - Labels français pour toutes les sections admin
  - Icône Home + chevrons pour navigation hiérarchique

### Loading States

- **TableSkeleton :** Squelettes animés pour les tableaux (companies, contacts)
- **KanbanSkeleton :** Squelettes pour la vue pipeline (deals)
- Remplace tous les spinners `Loader2` par des skeletons content-aware

### Empty States

- **EmptyDeals :** État vide avec icône Briefcase + CTA "Créer un dossier"
- **EmptyCompanies :** État vide avec icône Building + CTA "Ajouter une société"
- **EmptyContacts :** État vide avec icône Users + CTA "Nouveau contact"
- Chaque colonne Kanban affiche "Aucun dossier" si vide

---

## 15. Dynamic Theme System - [Implemented 2026-01-08]

### Backend (Convex)

- **`convex/theme.ts` :** Queries/mutations pour paramètres de thème
  - `getThemeSettings` / `updateThemeSettings` / `resetThemeSettings`
  - Stockage dans `global_config` table (singleton pattern)

### Theme Engine

- **Admin UI :** `/admin/settings` avec color pickers et font selectors
- **Colors :** Primary, Secondary, Background × Light/Dark modes
- **Typography :** Google Fonts dynamiques (Headings + Body)

### CSS Variables Dynamiques

- **Gradients :** `--theme-primary-grad-1/2/3` auto-générés
- **Hover States :** `--theme-primary-hover` calculé
- **Shadows :** `--theme-shadow-sm/md/lg/xl/2xl`
- **Injection :** `useThemeSettings` hook + `ThemeSettingsProvider`

---

## 16. Phase 1 Foundation Polish - [COMPLETE 2026-01-08]

### Navigation & UX

- **Responsive Sidebar :** `AdminSidebar` et `SudoSidebar` avec drawer mobile
- **Breadcrumbs :** Navigation contextuelle sur toutes les pages admin
- **Sticky Headers :** En-têtes de table fixes au scroll

### Data Management

- **CSV Export :** Bouton export dans DataTable (papaparse)
- **Bulk Actions :** Sélection multiple + suppression en masse
- **Advanced Filters :** Composant filtres avancés multi-critères
  - Opérateurs : equals, contains, greaterThan, between, isEmpty...
  - Types : text, number, date, select

### Form Utilities

- **useFormAutosave :** Hook de sauvegarde automatique
  - localStorage persistence
  - Intervalle configurable (défaut 30s)
  - Détection dirty state
  - Save on beforeunload
- **AutosaveIndicator :** Statut visuel de sauvegarde

### Components Created

| Fichier                                      | Description                    |
| -------------------------------------------- | ------------------------------ |
| `hooks/useFormAutosave.ts`                   | Hook d'autosave avec indicator |
| `components/ui/advanced-filters.tsx`         | Filtres avancés + hook         |
| `components/features/admin/AdminSidebar.tsx` | Sidebar admin responsive       |
