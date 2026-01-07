# Fonctionnalités d'Alecia Panel V2 (M&A Operating System)

Ce document détaille l'ensemble des fonctionnalités de la plateforme, structurées pour les flux de travail M&A, Private Equity et Corporate Finance.

## 1. Identité, Rôles & Conformité (Identity & RBAC)
**Objectif :** Sécuriser l'accès et garantir la traçabilité des actions dans un environnement confidentiel.

*   **Authentification Unifiée (SSO) :** Connexion sécurisée via Clerk (Email, Google, Microsoft), intégrant la gestion des sessions multi-devices.
*   **Gestion des Rôles (RBAC) :**
    *   **Sudo (Admin) :** Accès illimité à la configuration système et aux données sensibles.
    *   **Partner :** Accès complet au Deal Flow, validation des investissements, et gestion des équipes.
    *   **Advisor :** Accès restreint aux dossiers assignés et aux outils de collaboration.
*   **Sudo Panel (Administration) :**
    *   **Design System 2026 :** Interface haute densité (Linear-like), sidebar sombre distincte, typographie raffinée.
    *   **User Directory :** DataTable interactif (`@tanstack/react-table`) avec modification optimiste des rôles (Badge -> Select) et statut en temps réel.
    *   **Theme Engine :** Éditeur d'apparence "Live" avec Color Pickers popover et sliders de précision pour le radius et la typographie. Injection CSS client-side pour zéro latence.
*   **Profils Utilisateurs Enrichis :** Avatar, signature numérique (pour la validation de documents), et préférences de notification.
*   **Audit Logs (Implicite) :** Traçabilité des actions critiques (validation de deal, modification de settings).

## 2. Smart CRM & Sourcing (Intelligence)
**Objectif :** Centraliser l'intelligence marché et automatiser l'enrichissement des données cibles.

*   **Fiches Sociétés "360°" :**
    *   **Données Légales (Pappers) :** Synchronisation automatique via SIREN (NAF, TVA, Adresse Siège).
    *   **Données Financières :** Stockage structuré des métriques clés (CA, EBITDA, Dette Nette, Valorisation Ask) avec historique par année.
    *   **Identité Visuelle :** Récupération automatique des logos et descriptions.
*   **Moteur de Recherche Connecté :** Recherche directe dans la base Pappers via l'API intégrée pour créer des fiches prospects instantanément.
*   **Gestion des Contacts Clés :** Annuaire des dirigeants et actionnaires, liés aux entités juridiques, avec taggage dynamique (ex: "Cédant", "Expert-Comptable").
*   **Enrichissement Automatique (Placeholder) :** Architecture prête pour l'injection de données via APIs tierces (Clearbit/Apollo) sur base de nom de domaine.

## 3. Deal Flow & Moteur d'Investissement
**Objectif :** Piloter le cycle de vie des opportunités, du sourcing au closing, assisté par l'IA.

*   **Pipeline Kanban Interactif :** Visualisation des deals par stade ("New", "Due Diligence", "LOI", "Closing") avec Drag & Drop (`@dnd-kit`).
*   **Matching AI (Vector Search) :**
    *   **Embeddings :** Vectorisation automatique des descriptions de deals et des critères acquéreurs.
    *   **Recherche Sémantique :** Identification automatique des acheteurs potentiels (`buyer_criteria`) pour une cible donnée basée sur la proximité vectorielle.
*   **Moteur de Valorisation (Financial Engine) :**
    *   **Calculatrice Dynamique :** Exécution sécurisée de formules de valorisation complexes (ex: `(EBITDA * multiple) - NetDebt`) via `mathjs`.
    *   **Ingestion de Données Financières :** Parsing de fichiers CSV/Excel (`parseFinancialUpload`) pour extraire automatiquement les agrégats financiers (Revenue, EBITDA) et pré-remplir les modèles.

## 4. Gouvernance & CMS ("Edit Everything")
**Objectif :** Une interface administrative où le contenu et les règles sont modifiables sans code, avec un processus de validation strict.

*   **Theme Engine Dynamique :**
    *   Modification en temps réel des couleurs primaires, radius et fonts via le Sudo Panel.
    *   Injection CSS côté client (`ThemeInjector`) pour une prévisualisation live sans rebuild.
*   **Éditeur de Contenu Riche (PageEditor) :**
    *   **Tiptap Editor :** Édition WYSIWYG de pages (`site_pages`).
    *   **Sudo Direct Save :** Les administrateurs peuvent sauvegarder directement sans validation.
    *   **Partner Proposals :** Les Partners peuvent uniquement "Proposer des Changements", ce qui ouvre une PR interne avec un message de commit.
*   **Système de Vote (Governance Dashboard) :**
    *   **Liste des Propositions :** Vue d'ensemble des modifications en attente.
    *   **Diff Viewer Intelligent :** Visualisation côte-à-côte (`react-diff-viewer-continued`) avec un résumé des changements généré par IA (`openai.generateDiffSummary`).
    *   **Voting Panel :** Interface de vote ("Pour", "Contre") avec barre de progression vers le quorum.
    *   **Merge Automatique :** Bouton de fusion activé uniquement si le quorum est atteint.
*   **Paramètres Globaux :** Configuration centralisée du thème (couleurs, fonts, radius) et des règles de gouvernance.

## 5. Outils de Productivité & Assets
**Objectif :** Des outils métiers intégrés pour éviter la dispersion sur des logiciels tiers.

*   **Whiteboards Collaboratifs :** Tableaux blancs infinis (type Miro/Tldraw) pour le brainstorming de structuration de deal, sauvegardés en base de données.
*   **Notes Vocales Intelligentes :**
    *   Stockage des fichiers audio (comptes-rendus de réunion).
    *   Transcription et Résumé automatique par IA (`generateSummary`).
*   **Modélisation Financière :** Gestionnaire de modèles de valorisation réutilisables avec variables dynamiques.\n\n## 6. CRM Module (Implemented)\n**Objectif :** Gestion haute performance des entités avec une UX type "Linear".\n\n*   **DataTables :** Utilisation de `@tanstack/react-table` avec tri, filtre et pagination. Design "dense" avec bordures fines.\n*   **Entity Drawer :** Les détails (Société/Contact) s'ouvrent dans un volet latéral (Sheet) pour ne pas perdre le contexte de la liste. Visualisation JSON des données financières.\n*   **Sources :** Distinction visuelle entre données Pappers (API) et Manuelles.
\n\n## 7. Deal Flow (Kanban)\n**Objectif :** Gestion visuelle et interactive du pipeline d'investissement.\n\n*   **Kanban Interactif :** Drag & Drop fluide avec `@dnd-kit`. 5 colonnes fixes (Lead, NDA, Offer, DD, Closing).\n*   **Smart Cards :** Affichage optimisé avec Badges dynamiques (Hot/Stalled) et calcul automatique des totaux par colonne.\n*   **Dual View :** Bascule instantanée entre vue Tableau (List) et Kanban (Board), persistant le choix utilisateur.
\n\n## 8. Intelligence & AI Module\n**Objectif :** Enrichissement automatique et matching sémantique.\n\n*   **Enrichissement Pappers :** Bouton "Auto-Enrich" dans le drawer CRM. Récupère SIREN, NAF, CA, EBITDA et adresse. Affiche un diff visuel avant validation.\n*   **AI Matchmaker :** Onglet dédié dans les Deals. Utilise `openai` (embeddings) + Convex Vector Search pour suggérer des acquéreurs pertinents avec un score de compatibilité.
\n\n## 9. Intelligence Module (French Localization)\n**Objectif :** Adaptation complète de l'interface en français pour le marché cible.\n\n*   **Enrichissement (CompanyEnricher) :** Interface traduite ("Enrichir via Pappers"). Comparaison détaillée des champs (SIREN, NAF, CA, EBE).\n*   **Matchmaking (DealMatchmaker) :** Scores de compatibilité et explications en français. Terminologie M&A adaptée ("Acquéreurs Potentiels", "Lier au dossier").
\n\n## 9.1. AI Matchmaker Refinement\n*   **Explication IA Dynamique :** Action `explainMatch` ajoutée pour générer une justification textuelle (GPT-4o) du score de compatibilité à la demande.\n*   **Internal Queries :** Ajout de `crm.getContact` pour supporter l'enrichissement du prompt IA.
\n\n## 10. AI Engine Migration (Groq)\n**Objectif :** Optimisation Coût/Latence.\n\n*   **Inference (Texte) :** Migration vers **Groq**.\n    *   `llama3-8b-8192` : Pour les tâches simples (Résumés rapides).\n    *   `llama3-70b-8192` : Pour le raisonnement complexe (Diffs, Matchmaking).\n*   **Embeddings (Vecteurs) :** Maintien d'**OpenAI** (`text-embedding-3-small`) pour la compatibilité avec le Vector Store Convex.
