# Architecture & Knowledge Base

Ce document détaille les choix techniques, l'architecture du système et la structure du code pour Alecia Panel V2.

## 1. Stack Technique "Best of Breed"

- **Framework :** Next.js 15 (App Router) + React 19.
- **Backend & Database :** Convex (Vercel-integrated: colorless-bird-993, dev instance).
- **Auth :** Clerk.
- **UI System :** Shadcn/UI (Tailwind v4).

## 2. Architecture des Données (Convex Schema)

- **Identity (`users`) :** Rôles Sudo/Partner/Advisor.
- **CRM & Deal Flow :** Structures optimisées pour le M&A (Pappers, Vector Search).
- **CMS/Gouvernance :** Workflow de validation par vote (Proposals).

## 3. Logique Backend (Convex Actions & Mutations)

- **`seed.ts` (Nouveau) :**
  - `initialSetup` : Crée les `global_settings` par défaut (Thème Slate, Quorum 50%).
  - `bootstrapSudo` : Mécanisme de "Claim Admin". Permet au premier utilisateur connecté de s'auto-promouvoir Sudo.
  - `seedTeam` : Mutation utilitaire pour promouvoir automatiquement les membres clés (Christophe, Micou) au rôle Sudo après leur inscription via Clerk.
- **`cms.ts` :** Gestion du contenu et des votes.
- **`queries.ts` / `mutations.ts` :** Gestion administrative.

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

- **Production-Ready Deployment :**
  - Configuration directe sur l'instance de production via `CONVEX_DEPLOYMENT`.
  - Pas de hardcoding des URLs, utilisation stricte de `process.env.NEXT_PUBLIC_CONVEX_URL`.
- **Bootstrap Pattern :**
  - Plutôt que d'insérer manuellement des données dans la DB, on expose une mutation sécurisée (`bootstrapSudo`) appelable depuis l'application pour configurer l'accès initial.

## 6. CRM Architecture

- **Backend :** `convex/crm.ts` expose les queries optimisées. Pour les contacts, on fait un enrichissement "lazy" (Promise.all) pour récupérer le nom de la société associée. Pour scale >1k, il faudra dénormaliser.
- **Frontend :** Architecture réutilisable `DataTable` (basée sur Shadcn) + `EntityDrawer` (Sheet). Le but est de minimiser la navigation inter-pages.

## 7. Deal Flow Architecture

- **Backend :** `convex/deals.ts` gère l'enrichissement des deals (Owner/Company) pour l'affichage carte. Mutation `moveDeal` sécurisée.
- **Frontend :** Utilisation de `@dnd-kit/sortable` pour les colonnes et les cartes. Logique de tri vertical. Persistance de la vue (List/Board) via LocalStorage pour UX.

## 8. Deployment Log (2026-01-07)

- **Convex Deploy:** Successfully pushed schema and functions to `small-spoonbill-745`. Fixed missing `use node;` directive in actions.
- **Dependencies:** Added `@ai-sdk/openai` manually (missing from initial install). Used `--legacy-peer-deps` for React 19 compatibility.

## 8. Intelligence Architecture

- **Actions :** `convex/actions/intelligence.ts` (Pappers) et `openai.ts` (Embeddings) séparent la logique API externe du runtime Convex.
- **Vector Search :** Mutation interne `saveDealEmbedding` pour stocker le vecteur. Query `findMatchingBuyers` effectue la recherche de proximité sur l'index `by_vector`.

## 9. Matchmaker Refactoring

- **Architecture :** Séparation de la logique de matching dans `convex/matchmaker.ts` pour isoler les vecteurs des opérations CRUD classiques (`deals.ts`).
- **Actions :** `generateDealEmbedding` appelle désormais une mutation interne dédiée dans le namespace `matchmaker`.

## 9.1. OpenAI Integration Deep Dive

- **Actions vs Mutations :** Les actions (`openai.ts`) appellent l'API externe, puis utilisent `internalMutation` (`matchmaker.ts`) pour écrire le vecteur. Pour la lecture, elles utilisent `internalQuery` (`crm.ts`, `deals.ts`) pour construire le contexte du prompt sans exposer ces données au client public.

## 10. AI Strategy: Price-Performance Ratio

- **Why Groq?** LPU Inference offers 10x speed at a fraction of GPT-4o cost. Ideal for real-time UI feedback (e.g., "Analyser" button).
- **Hybrid Stack:**
  - **Generation:** Groq SDK (`llama3-70b` as daily driver).
  - **Vectors:** OpenAI SDK (Standard, reliable, cheap).

## 12. Dashboard Architecture

- **Grid Engine :** `react-grid-layout` gère le positionnement (x, y, w, h) des widgets.

- **Composant :** `DraggableDashboard.tsx` encapsule la logique de drag & drop et le registre des widgets disponibles.

## 14. Reporting Architecture

- **Charting Library :** `recharts` (Standard industry choice) wrapper dans `SmartChart.tsx` pour une API simplifiée.

- **Data Flow :** Le composant gère son propre état de chargement et accepte des données statiques ou une URL de fetch (pour l'intégration future avec les actions Convex).

## 15. Audit Report (2026-01-07)

### Gap Analysis vs Specification

**Coverage:** ~40% of specified features implemented.

#### 🔴 Critical Gaps

| Component                      | Status        | Issue                         |
| ------------------------------ | ------------- | ----------------------------- |
| `KanbanBoard.tsx`              | ❌ Missing    | Only `DealCard.tsx` exists    |
| `kanban_boards` table          | ❌ Missing    | Pipeline visualization broken |
| `kanban_columns` table         | ❌ Missing    | No custom stages              |
| `project_events` table         | ❌ Missing    | No activity timeline          |
| `CompanyEnricher.applyChanges` | ⚠️ Simulation | No mutation call              |
| Dashboard widgets              | ⚠️ Hardcoded  | Need real Convex queries      |

#### ✅ Well-Implemented

- CMS Governance (`cms.ts`): Full voting/merge workflow
- AI Matchmaker: Vector search with embeddings
- Pappers Integration: `intelligence.ts` working
- RBAC System: sudo/partner/advisor roles

#### Missing Tables (vs Spec)

`kanban_boards`, `kanban_columns`, `project_events`, `forum_threads`,
`forum_posts`, `blog_posts`, `sign_requests`, `research_tasks`

### Recommended Phases

1. **Core M&A**: Kanban + enhanced deals schema
2. **Intelligence**: Complete matchmaker stubs, DataRoom token flow
3. **Collaboration**: Forum, blog posts, PPTX generation
4. **Polish**: Valuation calculator, chart builder

---

## 16. Consolidated Vision Reference (2026-01-07)

See full distilled specification in artifacts:

- **[alecia_vision_consolidee.md](file:///Users/utilisateur/.gemini/antigravity/brain/2013cf96-bd97-4aba-a775-74d169c49fef/alecia_vision_consolidee.md)**: Complete vision (9 prompts, 4 phases, tech stack, agent orchestration)
- **[reference_repos_guide.md](file:///Users/utilisateur/.gemini/antigravity/brain/2013cf96-bd97-4aba-a775-74d169c49fef/reference_repos_guide.md)**: Patterns from Twenty/Monica/Openblocks

### Reference Repos Quick Access

| Repo       | Path                                                                               | Key Components      |
| ---------- | ---------------------------------------------------------------------------------- | ------------------- |
| Twenty     | `_references/twenty/packages/twenty-front/src/modules/object-record/record-board/` | Kanban patterns     |
| Monica     | `_references/monica-main/database/migrations/`                                     | Relationship schema |
| Openblocks | `_references/openblocks-develop/client/packages/openblocks-design/`                | Icons, widgets      |

## Neon → Convex Migration (2026-01-07)

### Data Migrated

| Table           | Records | Source            |
| --------------- | ------- | ----------------- |
| transactions    | 46      | Neon deals        |
| team_members    | 8       | Neon team_members |
| marketing_tiles | 12      | Neon tiles        |

### Scripts Created

- `scripts/analyze-neon.js` - Analyze Neon database structure
- `scripts/prepare-migration.js` - Transform data for Convex import
- `scripts/run-import.js` - Prepare JSONL files for import
- `convex/import.ts` - Internal mutations for imports

### Files Generated

- `neon_marketing_dump.json` - Full Neon database export (507MB)
- `convex_import_data.json` - Transformed data for Convex
- `data/*.jsonl` - Import-ready JSONL files

### Neon DB Credentials

```
Host: ep-fancy-rice-ag8i6qv2-pooler.c-2.eu-central-1.aws.neon.tech
Database: neondb
User: neondb_owner
```

## 17. Marketing CMS Architecture (2026-01-07)

### V2 Panel Admin Pages

| Route                 | Component             | Purpose          |
| --------------------- | --------------------- | ---------------- |
| `/admin/transactions` | DataTable + Edit Form | Track record M&A |
| `/admin/team`         | Grid Cards            | Team profiles    |
| `/admin/careers`      | DataTable             | Job offers       |
| `/admin/tiles`        | Visual Grid           | Ambiance gallery |

### Convex Functions

```
convex/
├── marketing.ts    # Public queries (no auth)
├── transactions.ts # CRUD for deals
├── team.ts         # CRUD for team
├── careers.ts      # CRUD for jobs
└── tiles.ts        # CRUD for gallery
```

### V1 Marketing Site Integration

- **HTTP Client:** Direct Convex API calls via fetch
- **Server Actions:** `src/lib/actions/convex-marketing.ts`
- **Pages Updated:**
  - `/operations` → `transactions` table
  - `/equipe` → `team_members` table
  - `/actualites` → `blog_posts` table
  - `/nous-rejoindre` → `job_offers` table

### Data Flow

```
V1 Marketing Site
    ↓ (HTTP fetch, 60s cache)
Convex Public Queries (marketing.ts)
    ↓
Convex Tables
    ↑
V2 Admin Panel (mutations)
```

---

## V2 Marketing Site Refonte (January 2026)

### Safe Development Protocol

All V2 pages use `_2` suffix to avoid touching production site.

### New Components (`src/components/public_v2/`)

- `layout/`: `Navbar_2.tsx`, `Footer_2.tsx`
- `home/`: `HeroVideo_2.tsx`, `MetierSection_2.tsx`, `TransactionsCarousel_2.tsx`, `KPIBand_2.tsx`, `ContactSection_2.tsx`
- `transactions/`: `TombstoneCard_2.tsx` (flip animation), `TransactionsGrid_2.tsx` (filters), `PressRelease_2.tsx`
- `equipe/`: `TeamMemberCard_2.tsx`, `TeamGrid_2.tsx`, `MemberDeals_2.tsx`

### New Routes (`src/app/(public)/`)

| Route               | Description               |
| ------------------- | ------------------------- |
| `/page_2`           | Landing Page V2           |
| `/operations_2`     | Transactions with filters |
| `/equipe_2`         | Team grid                 |
| `/expertises_2`     | Expertises + case studies |
| `/actualites_2`     | News                      |
| `/nous-rejoindre_2` | Careers                   |
| `/acces-prive_2`    | Private access            |
| `/contact_2`        | Contact form              |

### Design References

- `7oceans.com`: Fullscreen video hero
- `stratema.com`: Carousels with arrows
- `cambonpartners.com`: Tombstone flip animation
- `albarest-partners.com`: Team grid overlays

---

## V3 Architecture (Planning 2026-01-10)

### Route Strategy (`_3` Suffix)

Comme pour V2, on isole V3 avec des suffixes pour garantir la sécurité de la prod.

- `src/app/page_3.tsx`
- `src/app/transactions_3/page.tsx` (Renommage de "operations" pour coller au C.D.C)
- `src/app/expertises_3/page.tsx`
- `src/app/equipe_3/page.tsx`
- `src/app/actualites_3/page.tsx`
- `src/app/carrieres_3/page.tsx`
- `src/app/acces-prive_3/page.tsx`
- `src/app/contact_3/page.tsx`

### Components Strategy (`src/components/*_3/`)

Architecture modulaire par fonctionnalité :

- `home_3/`: `HeroVideo_3` (Video + 3 blocs expertise), `TransactionsCarousel_3`, `KPIBand_3`, `ContactSection_3`
- `transactions_3/`: `FlipCard_3` (3D CSS pure), `DealFilter_3` (Custom routing to /transactions_3)
- `layout_3/`: `Navbar_3`, `Footer_3` (Indépendants du layout global pour faciliter le switch)

### Data Strategy

Réutilisation maximale des actions Convex existantes (`convex-marketing.ts`) car les données sous-jacentes (Deals, Team, Posts) ne changent pas, seule la présentation change.
Les "Meta-données" manquantes (ex: Passion, Citation, Études de cas spécifiques) sont pour l'instant mockées dans les composants V3 pour validation visuelle avant migration de schéma.
