# Fonctionnalités d'Alecia Panel V2 (M&A Operating System)

Ce document détaille l'ensemble des fonctionnalités de la plateforme, structurées pour les flux de travail M&A, Private Equity et Corporate Finance.

## 1. Identité, Rôles & Conformité (Identity & RBAC) - [Vérifié & Sécurisé]
**Objectif :** Sécuriser l'accès et garantir la traçabilité des actions dans un environnement confidentiel.

*   **Authentification Unifiée (SSO) :** Connexion sécurisée via Clerk.
*   **Gestion des Rôles (RBAC) :** Implémentée via `auth_utils.ts`. Vérification systématique dans les mutations `moveDeal`, etc.
*   **Sudo Panel (Administration) :**
    *   **Design System 2026 :** Dashboard principal implémenté avec sidebar haute densité et interface Linear-like.
    *   **User Directory :** DataTable interactif pour la gestion des rôles.
    *   **Theme Engine :** Éditeur d'apparence "Live" avec Color Pickers popover et sliders de précision pour le radius et la typographie. Injection CSS client-side pour zéro latence.
*   **Profils Utilisateurs Enrichis :** Avatar, signature numérique (pour la validation de documents), et préférences de notification.
*   **Audit Logs (Implicite) :** Traçabilité des actions critiques (validation de deal, modification de settings).

## 2. Smart CRM & Sourcing (Intelligence) - [Implemented]
**Objectif :** Centraliser l'intelligence marché et automatiser l'enrichissement des données cibles.

*   **Fiches Sociétés "360°" :**
    *   **Données Légales (Pappers) :** Implémenté via `CompanyEnricher.tsx`.
    *   **Données Financières :** Stockage structuré des métriques clés (CA, EBITDA, Dette Nette, Valorisation Ask) avec historique par année.
    *   **Identité Visuelle :** Récupération automatique des logos et descriptions.
*   **Moteur de Recherche Connecté :** Recherche directe dans la base Pappers via l'API intégrée pour créer des fiches prospects instantanément.
*   **Gestion des Contacts Clés :** Annuaire des dirigeants et actionnaires, liés aux entités juridiques, avec taggage dynamique (ex: "Cédant", "Expert-Comptable").
*   **Enrichissement Automatique :** Bouton "Enrichir via Pappers" fonctionnel.

## 3. Deal Flow & Moteur d'Investissement - [Implemented]
**Objectif :** Piloter le cycle de vie des opportunités, du sourcing au closing, assisté par l'IA.

*   **Pipeline Kanban Interactif :** Visualisation des deals par stade ("New", "Due Diligence", "LOI", "Closing") avec Drag & Drop (`@dnd-kit`).
*   **Matching AI (Vector Search) :** Implémenté via `DealMatchmaker.tsx`.
    *   **Embeddings :** Vectorisation automatique des descriptions de deals et des critères acquéreurs.
    *   **Recherche Sémantique :** Identification automatique des acheteurs potentiels (`buyer_criteria`) pour une cible donnée basée sur la proximité vectorielle.
    *   **Explication IA :** Justification textuelle du match par Groq.

## 4. Gouvernance & CMS ("Edit Everything") - [Implemented]
*   **Éditeur de Contenu Riche (PageEditor) :** Édition WYSIWYG de pages (`site_pages`) via Tiptap.
*   **Système de Vote (Governance Dashboard) :** Workflow de proposition/vote pour les modifications de contenu.

## 5. Outils de Productivité & Assets - [Implemented]
**Objectif :** Des outils métiers intégrés pour éviter la dispersion sur des logiciels tiers.

*   **Data Room (Office 365) :** Intégration OneDrive via `DataRoom.tsx` et Graph API.
*   **Pitch Deck Generator :** Création de PPTX via `DeckGenerator.tsx`.
*   **Whiteboards Collaboratifs :** Intégration **tldraw** via `Whiteboard.tsx`. Idéal pour les brainstormings de structuration.
*   **Notes Vocales Intelligentes :** Enregistreur natif avec transcription Whisper intégrée (`VoiceNoteRecorder.tsx`).

## 6. Dashboard (Implemented)
**Objectif :** Vue d'ensemble personnalisable.

*   **Draggable Widgets :** Implémenté via `DraggableDashboard.tsx` et `react-grid-layout`.
*   **Widgets Disponibles :** KPIs, Recent Deals, Activity Feed, Voice Notes, Whiteboard.

## 8. Reporting & Financial Intelligence (Implemented)
**Objectif :** Visualisation des données financières et analytiques.

*   **Smart Charts :** Composant réutilisable (`SmartChart.tsx`) basé sur `recharts`.
*   **Dashboard Financier :** Vue dédiée (`/admin/reporting`) avec comparatifs Revenue/EBITDA et tendances.
*   **Moteur Financier :** Backend `finance.ts` prêt pour le parsing Excel et calculs complexes.