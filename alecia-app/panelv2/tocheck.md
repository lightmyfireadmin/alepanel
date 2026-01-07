# Checklist de Déploiement & Configuration

Ce fichier recense les pré-requis, variables d'environnement et points de vigilance pour le bon fonctionnement d'Alecia Panel V2.

## 1. Variables d'Environnement (Secrets)
À configurer dans `.env.local` (local) et dans le dashboard Convex (Production).

### Convex & Auth
- [x] `CONVEX_DEPLOYMENT`: Configuré (prod:small-spoonbill-745).
- [x] `NEXT_PUBLIC_CONVEX_URL`: Configuré (https://small-spoonbill-745.convex.cloud).
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clé publique Clerk (À FAIRE).
- [ ] `CLERK_SECRET_KEY`: Clé secrète Clerk (À FAIRE).

### Intelligence & IA
- [ ] `PAPPERS_API_KEY`: Clé API pour https://www.pappers.fr (Requis pour `intelligence.ts`).
- [ ] `OPENAI_API_KEY`: Clé API OpenAI (Requis pour `openai.ts`).

## 2. Installation & Build
- [ ] **Dépendances Legacy :** `npm install --legacy-peer-deps`
- [ ] **Déploiement Convex :**
    - Lancer `npx convex deploy` pour pousser le schéma et les fonctions vers l'instance de production configurée.
- [ ] **Initialisation des Données :**
    - Une fois connecté dans l'app, ouvrir la console développeur du navigateur ou le dashboard Convex.
    - Exécuter la mutation `seed.initialSetup` pour créer les settings globaux.
    - Exécuter la mutation `seed.bootstrapSudo` pour devenir administrateur (Sudo) automatiquement.

## 3. Configuration SaaS
- [ ] **Clerk :** Configurer les URLs de redirection vers l'instance de prod ou localhost.

## 4. Points de Vigilance
- [ ] **Hardcoding :** Vérification effectuée. Les URLs et clés passent par `process.env`.
- [ ] **Bootstrap Sécurisé :** La fonction `bootstrapSudo` se verrouille automatiquement dès qu'un admin existe. Ne pas supprimer le premier admin sans en avoir créé un autre.

## 5. Prochaines Étapes
1.  Remplir les clés Clerk/OpenAI dans `.env.local`.
2.  Lancer `npm run dev`.
3.  Se connecter et cliquer sur un bouton (à créer) ou utiliser le dashboard pour lancer le bootstrap.\n- [ ] **CRM Data :** Vérifier que les requêtes `getCompanies` et `getContacts` retournent bien les données enrichies (Logo, Nom entreprise pour contact). \n- [ ] **Drawer UX :** Tester l'ouverture du Drawer sur mobile (responsive check).
\n- [ ] **Kanban Logic :** Vérifier que le Drag & Drop met bien à jour le stage dans la base (Mutation `moveDeal`).\n- [ ] **Optimistic UI :** Vérifier l'absence de scintillement lors du drop d'une carte.
\n- [ ] **AI Keys :** Vérifier que `OPENAI_API_KEY` est bien configuré pour l'action `generateDealEmbedding`.\n- [ ] **Vector Index :** Vérifier que l'index `by_vector` est bien créé (déploiement précédent).
\n- [ ] **Traduction UI :** Vérifier que tous les labels du module Intelligence sont bien en français (Dialogues, Boutons, Toasts).\n- [ ] **Matchmaker Query :** Vérifier que `api.matchmaker.findMatchingBuyers` retourne bien les scores triés.
\n- [ ] **AI Explain :** Tester le bouton "Analyser" dans le Matchmaker et vérifier la qualité de l'explication en français.
\n- [ ] **Env Vars :** Ajouter `GROQ_API_KEY` dans le dashboard Convex.\n- [ ] **Billing :** Vérifier que le compte OpenAI n'est plus utilisé que pour les embeddings (Coût négligeable).
