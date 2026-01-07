# Architecture & Knowledge Base

Ce document détaille les choix techniques, l'architecture du système et la structure du code pour Alecia Panel V2.

## 1. Stack Technique "Best of Breed"
*   **Framework :** Next.js 15 (App Router) + React 19.
*   **Backend & Database :** Convex (Prod Instance: small-spoonbill-745).
*   **Auth :** Clerk.
*   **UI System :** Shadcn/UI (Tailwind v4).

## 2. Architecture des Données (Convex Schema)
*   **Identity (`users`) :** Rôles Sudo/Partner/Advisor.
*   **CRM & Deal Flow :** Structures optimisées pour le M&A (Pappers, Vector Search).
*   **CMS/Gouvernance :** Workflow de validation par vote (Proposals).

## 3. Logique Backend (Convex Actions & Mutations)
*   **`seed.ts` (Nouveau) :**
    *   `initialSetup` : Crée les `global_settings` par défaut (Thème Slate, Quorum 50%).
    *   `bootstrapSudo` : Mécanisme de "Claim Admin". Permet au premier utilisateur connecté de s'auto-promouvoir Sudo si la base est vide d'admins. Sécurité critique pour le premier déploiement.
*   **`cms.ts` :** Gestion du contenu et des votes.
*   **`queries.ts` / `mutations.ts` :** Gestion administrative.

## 4. Structure du Projet
```
panelv2/
├── convex/
│   ├── seed.ts         # Scripts d'initialisation et bootstrap
│   ├── cms.ts          # Logique CMS
│   ├── schema.ts       # Définition DB
│   └── ...
├── src/
│   ├── app/providers.tsx # Config Convex (env vars)
│   └── ...
├── .env.local          # Contient la clé de déploiement Prod
├── features.md
├── tocheck.md
└── knowledge.md
```

## 5. Décisions de Design Clés
*   **Production-Ready Deployment :**
    *   Configuration directe sur l'instance de production via `CONVEX_DEPLOYMENT`.
    *   Pas de hardcoding des URLs, utilisation stricte de `process.env.NEXT_PUBLIC_CONVEX_URL`.
*   **Bootstrap Pattern :**
    *   Plutôt que d'insérer manuellement des données dans la DB, on expose une mutation sécurisée (`bootstrapSudo`) appelable depuis l'application pour configurer l'accès initial.
\n\n## 6. CRM Architecture\n*   **Backend :** `convex/crm.ts` expose les queries optimisées. Pour les contacts, on fait un enrichissement "lazy" (Promise.all) pour récupérer le nom de la société associée. Pour scale >1k, il faudra dénormaliser.\n*   **Frontend :** Architecture réutilisable `DataTable` (basée sur Shadcn) + `EntityDrawer` (Sheet). Le but est de minimiser la navigation inter-pages.
\n\n## 7. Deal Flow Architecture\n*   **Backend :** `convex/deals.ts` gère l'enrichissement des deals (Owner/Company) pour l'affichage carte. Mutation `moveDeal` sécurisée.\n*   **Frontend :** Utilisation de `@dnd-kit/sortable` pour les colonnes et les cartes. Logique de tri vertical. Persistance de la vue (List/Board) via LocalStorage pour UX.
\n\n## 8. Deployment Log (2026-01-07)\n*   **Convex Deploy:** Successfully pushed schema and functions to `small-spoonbill-745`. Fixed missing `use node;` directive in actions.\n*   **Dependencies:** Added `@ai-sdk/openai` manually (missing from initial install). Used `--legacy-peer-deps` for React 19 compatibility.
\n\n## 8. Intelligence Architecture\n*   **Actions :** `convex/actions/intelligence.ts` (Pappers) et `openai.ts` (Embeddings) séparent la logique API externe du runtime Convex.\n*   **Vector Search :** Mutation interne `saveDealEmbedding` pour stocker le vecteur. Query `findMatchingBuyers` effectue la recherche de proximité sur l'index `by_vector`.
\n\n## 9. Matchmaker Refactoring\n*   **Architecture :** Séparation de la logique de matching dans `convex/matchmaker.ts` pour isoler les vecteurs des opérations CRUD classiques (`deals.ts`).\n*   **Actions :** `generateDealEmbedding` appelle désormais une mutation interne dédiée dans le namespace `matchmaker`.
\n\n## 9.1. OpenAI Integration Deep Dive\n*   **Actions vs Mutations :** Les actions (`openai.ts`) appellent l'API externe, puis utilisent `internalMutation` (`matchmaker.ts`) pour écrire le vecteur. Pour la lecture, elles utilisent `internalQuery` (`crm.ts`, `deals.ts`) pour construire le contexte du prompt sans exposer ces données au client public.
\n\n## 10. AI Strategy: Price-Performance Ratio\n*   **Why Groq?** LPU Inference offers 10x speed at a fraction of GPT-4o cost. Ideal for real-time UI feedback (e.g., "Analyser" button).\n*   **Hybrid Stack:**\n    *   **Generation:** Groq SDK (`llama3-70b` as daily driver).\n    *   **Vectors:** OpenAI SDK (Standard, reliable, cheap).
