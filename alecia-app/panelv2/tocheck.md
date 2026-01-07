# Checklist de Déploiement & Configuration

Ce fichier recense les pré-requis, variables d'environnement et points de vigilance pour le bon fonctionnement d'Alecia Panel V2.

## 1. Variables d'Environnement (Secrets)

À configurer dans `.env.local` (local) et dans le dashboard Convex (Production).

### Convex & Auth

- [x] `CONVEX_DEPLOYMENT`: Configuré via `npx convex dev` (Vercel-integrated: colorless-bird-993).
- [x] `NEXT_PUBLIC_CONVEX_URL`: Configuré (https://colorless-bird-993.convex.cloud).
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clé publique Clerk (À FAIRE).
- [ ] `CLERK_SECRET_KEY`: Clé secrète Clerk (À FAIRE).

### Intelligence & IA

- [ ] `PAPPERS_API_KEY`: Clé API pour https://www.pappers.fr (Requis pour `intelligence.ts`).
- [ ] `OPENAI_API_KEY`: Clé API OpenAI (Requis pour `openai.ts`).

## 2. Installation & Build

- [ ] **Dépendances Legacy :** `npm install --legacy-peer-deps`
- [ ] **Déploiement Convex :**
  - Lancer `npx convex deploy` pour pousser le schéma, les fonctions et les `auth_utils` vers l'instance de production.
- [ ] **Initialisation des Données :**
  - Une fois connecté dans l'app, ouvrir le dashboard Convex.
  - Exécuter la mutation `seed.initialSetup` pour créer les settings globaux.
  - Exécuter la mutation `seed.bootstrapSudo` pour devenir administrateur (Sudo) automatiquement.
  - Exécuter la mutation `seed.seedTeam` pour promouvoir Christophe et Micou une fois inscrits.

## 4. Points de Vigilance

- [ ] **Sécurité RBAC :** Vérifier que les nouvelles fonctions dans `crm.ts` et `deals.ts` bloquent bien les accès non-authentifiés (Utiliser `checkRole`).
- [ ] **Clés API :** Vérifier que `PAPPERS_API_KEY` et `GROQ_API_KEY` sont définies dans le dashboard Convex.
- [ ] **Microsoft Auth :** Vérifier que le template JWT `microsoft_graph` est configuré dans Clerk pour l'accès OneDrive.

## 5. Tests Intelligence

- [ ] **Enrichissement Pappers :** Tester le bouton "Enrichir" sur une société test (ex: "Renault").

## 7. Tests CMS

- [ ] **Homepage :** Vérifier que la page d'accueil s'affiche correctement et charge le contenu depuis Convex.
- [ ] **Pages Publiques :** Vérifier l'accès à `/equipe`, `/expertises`, `/contact`.
- [ ] **Édition :** Modifier la page "home" dans le Sudo Panel et voir la mise à jour sur le site public.

## 5. Prochaines Étapes

1.  Remplir les clés Clerk/OpenAI dans `.env.local`.
2.  Lancer `npm run dev`.
3.  Se connecter et cliquer sur un bouton (à créer) ou utiliser le dashboard pour lancer le bootstrap.\n- [ ] **CRM Data :** Vérifier que les requêtes `getCompanies` et `getContacts` retournent bien les données enrichies (Logo, Nom entreprise pour contact). \n- [ ] **Drawer UX :** Tester l'ouverture du Drawer sur mobile (responsive check).
    \n- [ ] **Kanban Logic :** Vérifier que le Drag & Drop met bien à jour le stage dans la base (Mutation `moveDeal`).\n- [ ] **Optimistic UI :** Vérifier l'absence de scintillement lors du drop d'une carte.
    \n- [ ] **AI Keys :** Vérifier que `OPENAI_API_KEY` est bien configuré pour l'action `generateDealEmbedding`.\n- [ ] **Vector Index :** Vérifier que l'index `by_vector` est bien créé (déploiement précédent).
    \n- [ ] **Traduction UI :** Vérifier que tous les labels du module Intelligence sont bien en français (Dialogues, Boutons, Toasts).\n- [ ] **Matchmaker Query :** Vérifier que `api.matchmaker.findMatchingBuyers` retourne bien les scores triés.
    \n- [ ] **AI Explain :** Tester le bouton "Analyser" dans le Matchmaker et vérifier la qualité de l'explication en français.
    \n- [ ] **Env Vars :** Ajouter `GROQ_API_KEY` dans le dashboard Convex.\n- [ ] **Billing :** Vérifier que le compte OpenAI n'est plus utilisé que pour les embeddings (Coût négligeable).

## Pipedrive Configuration (2026-01-07)
- [ ] Obtenir clé API depuis Pipedrive Settings > API
- [ ] Ajouter `PIPEDRIVE_API_KEY` dans le Dashboard Convex (Settings > Environment Variables)
- [ ] Tester sync initial via bouton "Pipedrive" sur page Sociétés
- [ ] Vérifier le mapping des stages (Lead, NDA Signed, etc.)

## Pipedrive OAuth Configuration (2026-01-07 - Updated)
- [ ] Créer une app dans Pipedrive Developer Hub (https://developers.pipedrive.com/)
- [ ] Configurer l'URL de callback : `https://votre-domaine.com/api/auth/pipedrive/callback`
- [ ] Ajouter dans le Dashboard Convex :
  - `PIPEDRIVE_CLIENT_ID`
  - `PIPEDRIVE_CLIENT_SECRET`
- [ ] Ajouter dans `.env.local` :
  - `NEXT_PUBLIC_APP_URL=https://votre-domaine.com`

## Audit 2026-01-07 ✅
- **Dependencies:** 0 vulnerabilités
- **TypeScript:** Corrigés - 12 chemins d'import, types explicites
- **Convex Schema:** 18 tables, tous indices validés
- **Security:** OAuth Pipedrive, auth checks sur mutations
- **UI/UX:** Labels FR, composants responsive
