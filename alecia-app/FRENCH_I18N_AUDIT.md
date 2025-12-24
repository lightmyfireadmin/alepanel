# Audit i18n Français - Alecia M&A Website

## Date: 2025-12-24

## Objectif

Analyser et améliorer le fichier `fr.json` pour qu'il soit aligné avec:

1. Le wording du site original (www.alecia.fr)
2. Les recommandations du document "Optimisation Site Web M&A PME_ETI France"
3. Les meilleures pratiques pour un site M&A ciblant PME/ETI

---

## 1. ANALYSE DU TON DE VOIX

### Ton Souhaité (d'après documentation)

**"Expert, Empathique et Résolu"**

- **Expert**: Utilisation précise des termes techniques (LBO, OBO, Due Diligence)
- **Empathique**: Reconnaissance que la cession est le projet d'une vie
- **Résolu**: Voix active, engagement clair

### Écarts Identifiés

| Section               | Actuel                                                    | Problème                                                    | Solution                                               |
| --------------------- | --------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------ |
| `hero.subtitle`       | "Partenaire de confiance des dirigeants de PME et ETI..." | Trop long, bureaucratique                                   | Simplifier, plus direct et personnel                   |
| `provider.titlePart2` | "prestataire"                                             | Traduit littéralement du site original mais manque de punch | Conserver car aligné avec positionnement différenciant |
| `cta.titlePart1`      | "Prêt à concrétiser"                                      | Manque de personnalisation                                  | "Prêt à transformer" ou "Prêt à réaliser"              |

---

## 2. COMPARAISON AVEC LE SITE ORIGINAL

### Hero Section

**Original**: "Vos ambitions de croissance méritent un accompagnement stratégique à la hauteur."

**Actuel i18n**: "Partenaire de confiance des dirigeants de PME et ETI pour leurs opérations de haut de bilan : Cession, Acquisition, Finance. Une expertise pointue et un engagement total à vos côtés."

**Recommandation**: Revenir à un message plus proche de l'original qui utilise "vos ambitions" pour créer un lien émotionnel immédiat.

### Provider Section

**Original**: "Vos décisions stratégiques nécessitent plus qu'un simple accompagnement."

**Actuel i18n**: "Vos décisions stratégiques nécessitent plus qu'un simple accompagnement."

**Statut**: ✅ Parfaitement aligné

### Expertises

**Original**: "Vos projets méritent plus qu'une simple expertise."

**Actuel i18n**: "Vos projets méritent plus qu'une simple expertise."

**Statut**: ✅ Parfaitement aligné

---

## 3. ALIGNEMENT AVEC LE DOCUMENT D'OPTIMISATION

### Wording Recommandé (Section 5 du document)

#### Termes à Privilégier

- ✅ "Accompagnement" (présent)
- ✅ "Transmission" (présent)
- ✅ "Pérennité" (absent - À AJOUTER)
- ❌ Éviter: "Exit", "Liquidation", "Deal"

#### Voix Active

**Exemple document**: "Nous sécurisons votre transaction" > "Votre transaction sera sécurisée"

**Vérification dans i18n**:

- ❌ `provider.paragraph2`: "Vos opérations sont menées" → Passif, À CORRIGER
- ✅ `expertises.cession.longDescription`: "alecia vous accompagne" → Actif, BON

---

## 4. ANALYSE PAR SECTION

### A. Navigation (`nav`)

| Clé           | Actuel                   | Statut | Recommandation |
| ------------- | ------------------------ | ------ | -------------- |
| `cession`     | "Cession & transmission" | ✅     | Conserver      |
| `fundraising` | "Levée de fonds"         | ✅     | Conserver      |
| `acquisition` | "Acquisition"            | ✅     | Conserver      |

### B. Hero Section (`hero`)

| Clé         | Actuel                          | Problème                              | Nouveau                              |
| ----------- | ------------------------------- | ------------------------------------- | ------------------------------------ |
| `tagline`   | "Conseil en fusion-acquisition" | Trop technique pour première accroche | "Banque d'affaires" ou "Conseil M&A" |
| `subtitle`  | Texte de 36 mots                | Trop long, perd l'attention           | Scinder ou réduire à 20-25 mots max  |
| `ctaSeller` | "Vous cherchez à céder"         | Transactionnel                        | "Vous envisagez une cession"         |
| `ctaBuyer`  | "Vous cherchez à investir"      | Transactionnel                        | "Vous recherchez des opportunités"   |

### C. Provider Section (`provider`)

| Clé          | Actuel                                                         | Problème     | Nouveau                                               |
| ------------ | -------------------------------------------------------------- | ------------ | ----------------------------------------------------- |
| `paragraph2` | "Vos opérations sont menées avec soin par des associés dédiés" | Voix passive | "Nos associés dédiés mènent vos opérations avec soin" |

### D. Expertises (`expertises`)

#### Cession

| Clé          | Analyse                                    | Action                       |
| ------------ | ------------------------------------------ | ---------------------------- |
| `step1Title` | "Préparation"                              | ✅ Bon                       |
| `step1Desc`  | "Étude réaliste et transparente"           | ✅ Aligné avec site original |
| `challenge1` | "Garantir la confidentialité des échanges" | ✅ Point clé bien exprimé    |

**Note**: Cette section est très bien rédigée, proche du site original.

#### Levée de fonds

| Clé          | Analyse                                   | Action                                                          |
| ------------ | ----------------------------------------- | --------------------------------------------------------------- | ---------------------------------- |
| `title`      | "Levée de fonds & financement"            | ✅ Bon                                                          |
| `step2Title` | "Accès à un réseau étendu"                | Peut être plus fort                                             | "Un réseau étendu d'investisseurs" |
| `challenge2` | "Préparer une documentation convaincante" | ❌ Manque le côté "comprendre votre stratégie" du site original | Ajouter contexte                   |

#### Acquisition

**Note**: Section bien rédigée, alignée avec le site original.

### E. Team Section (`team`)

| Clé        | Actuel                                                                      | Problème                          | Nouveau                                                                 |
| ---------- | --------------------------------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------- |
| `subtitle` | "La variété de nos parcours et de nos expertises fait la richesse d'alecia" | Bon mais peut être plus personnel | "Notre richesse réside dans la diversité de nos parcours et expertises" |

### F. Careers (`careers`)

| Clé              | Actuel                              | Statut       | Note                         |
| ---------------- | ----------------------------------- | ------------ | ---------------------------- |
| `subtitle`       | Texte de 60+ mots                   | ⚠️ Trop long | OK car page dédiée carrières |
| `vision.tagline` | "Honnêteté — Excellence — Humilité" | ✅ Parfait   | Core values, bien            |

### G. Forms (`sellerForm`, `buyerForm`)

#### Seller Form

| Clé              | Actuel                                  | Analyse                      | Recommandation                             |
| ---------------- | --------------------------------------- | ---------------------------- | ------------------------------------------ |
| `title`          | "Vous souhaitez céder votre entreprise" | Neutre                       | "Votre projet de cession" (plus personnel) |
| `motivations`    | Termes utilisés                         | ✅ Bons                      | Conserver                                  |
| `successMessage` | "Un associé vous contactera sous 48h"   | ⚠️ Délai précis = engagement | Vérifier si aligné avec pratique réelle    |

#### Buyer Form

**Note**: Bien rédigé, vocabulaire adapté au profil investisseur.

### H. Contact Widget (`contactWidget`)

| Clé      | Actuel               | Problème                      | Nouveau                                      |
| -------- | -------------------- | ----------------------------- | -------------------------------------------- |
| `chatAI` | "Discuter avec l'IA" | Trop technique/froid pour M&A | "Posez vos questions" ou "Assistant virtuel" |

### I. Valuation Form (`valuationForm`)

| Clé          | Analyse                                                                       | Statut                          |
| ------------ | ----------------------------------------------------------------------------- | ------------------------------- |
| `title`      | "Estimez la valeur de votre entreprise"                                       | ✅ Direct, clair                |
| `disclaimer` | "Cette estimation est indicative et ne constitue pas un avis de valorisation" | ✅ Conforme obligations légales |

---

## 5. MOTS-CLÉS SEO À VÉRIFIER

D'après le document d'optimisation (Section 5.3):

### Mots-clés Géographiques

- ❌ Absents dans i18n actuel
- **Action**: Ajouter dans metadata/SEO (pas directement dans fr.json mais dans composants pages)

### Mots-clés Typologiques

Présents dans le contenu:

- ✅ "Transmission entreprise"
- ✅ "Levée de fonds"
- ✅ "Valorisation PME"
- ❌ Manque: "Conseil cession", "Fusion acquisition PME"

---

## 6. CONFORMITÉ LÉGALE

### Mentions Légales (`footer`)

| Clé           | Actuel                         | Statut |
| ------------- | ------------------------------ | ------ |
| `legalNotice` | "Mentions légales"             | ✅     |
| `privacy`     | "Politique de confidentialité" | ✅     |

**Note**: Les pages elles-mêmes doivent inclure SIRET, RCS, ORIAS (à vérifier dans les composants, pas dans i18n)

### RGPD

- Cookie banner présent: ✅
- Wording conforme: ✅

---

## 7. LACUNES IDENTIFIÉES

### Termes Manquants

1. **Pérennité** - Terme clé pour la transmission d'entreprise
2. **Écosystème** - Utilisé dans le contexte régional sur site original
3. **Patrimoine** - Important pour les cessions (réalisation patrimoniale)

### Expressions à Ajouter

D'après le site original:

- "Une histoire de confiance" (pas dans i18n actuel)
- "Entrepreneurs nous-mêmes" (concept présent dans careers mais pourrait être renforcé)

---

## 8. RECOMMANDATIONS PRIORITAIRES

### 🔴 HAUTE PRIORITÉ

1. **Hero.subtitle**: Réduire la longueur, augmenter l'impact émotionnel
2. **Provider.paragraph2**: Passer à la voix active
3. **ContactWidget.chatAI**: Adoucir le wording "IA"
4. **CtaSeller/CtaBuyer**: Langue plus empathique

### 🟡 PRIORITÉ MOYENNE

5. **Expertises.fundraising.challenge2**: Enrichir avec "comprendre votre stratégie"
6. **Team.subtitle**: Rendre plus personnel
7. **SellerForm.title**: Plus personnel et moins transactionnel

### 🟢 PRIORITÉ BASSE

8. Ajouter variations de wording pour SEO dans metadata
9. Micro-améliorations stylistiques

---

## 9. CHECKLIST CONTRE DOCUMENT D'OPTIMISATION

### Ton de Voix ✅ / ❌ / ⚠️

- [✅] Expert (termes techniques présents)
- [⚠️] Empathique (bien pour expertises, à améliorer pour CTAs)
- [⚠️] Résolu (quelques passifs à corriger)

### Codes Secteur M&A

- [✅] Évite "Exit", "Deal", "Liquidation"
- [✅] Utilise "Accompagnement", "Transmission"
- [❌] Manque "Pérennité" dans contexte cession

### Architecture de Confiance

- [✅] FAQ présente (inline dans original)
- [✅] Transparence honoraires (FAQ)
- [✅] Process en étapes (step1/2/3)

---

## 10. PLAN D'ACTION

### Phase 1: Corrections Critiques (Aujourd'hui)

1. Réécrire `hero.subtitle`
2. Corriger `provider.paragraph2` (voix active)
3. Adoucir `contactWidget.chatAI`
4. Améliorer CTAs (`ctaSeller`, `ctaBuyer`)

### Phase 2: Enrichissements (Cette semaine)

5. Ajouter variations sémantiques
6. Enrichir `expertises` sections
7. Réviser formulaires pour plus d'empathie

### Phase 3: Optimisation SEO (Suivant)

8. Metadata avec mots-clés géographiques
9. Structured data pour rich snippets
10. Alt texts optimisés

---

## ANNEXE: RÉFÉRENCES

### Documents Sources

1. `/alecia-app/src/messages/fr.json` - Fichier i18n actuel
2. `/www.alecia.fr/Alecia.md` - Site original (homepage)
3. `/www.alecia.fr/Expertises_Alecia.md` - Site original (expertises)
4. `Optimisation Site Web M&A PME_ETI France.md` - Document de stratégie

### Principes Clés du Document d'Optimisation

- **Section 5.1**: Ton "Expert, Empathique, Résolu"
- **Section 5.2**: Structure des pages (case studies, sectorielles)
- **Section 7**: Conformité légale (AMF, RGPD)
- **Section 8**: Checklist mise en œuvre

---

**Fin de l'audit**
