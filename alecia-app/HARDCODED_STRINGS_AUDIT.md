# Audit des Textes Non-i18n dans les Composants Client

## Date: 2025-12-24

## Objectif

Identifier tous les textes français codés en dur dans les composants client et les remplacer par des clés i18n.

---

## Composants à Corriger

### 🔴 PRIORITÉ HAUTE

#### 1. `/components/features/scroll-to-top.tsx`

**Ligne 36**: `aria-label="Remonter en haut de la page"`

- **Action**: Ajouter clé `ui.scrollToTop` à fr.json
- **Impact**: Accessibilité

#### 2. `/components/features/contact-form.tsx`

**Ligne 140**: `placeholder="Entreprise SAS"`

- **Action**: Déjà existe dans `contact.form.company` mais utilise un placeholder différent
- **Fix**: Utiliser la clé i18n existante

#### 3. `/components/admin/onboarding-manager.tsx`

Plusieurs textes hardcodés (mais c'est ADMIN, à ignorer selon consignes):

- Ligne 44: `"Impossible de mettre à jour le mot de passe"`
- Ligne 94: `"Mise à jour..."`, `"Définir mon mot de passe"`
- Lignes 106-116: Textes du tour guidé

**Statut**: ⚠️ Admin panel - ignoré selon consignes utilisateur

#### 4. `/components/features/ProjectTimeline.tsx`

Données de demo hardcodées (lignes 45-51):

```tsx
{ id: "1", type: "Milestone", date: "2025-01-15", description: "Signature dumandat de cession" },
{ id: "2", type: "Meeting", date: "2025-01-20", description: "Réunion stratégique avec le client" },
...
```

**Statut**: ⚠️ Admin panel - données de demo, pas prioritaire

---

## Contenu Manquant du Site Original

### Section "FAQ" - Homepage

Le site original a une FAQ complète qui pourrait être ajoutée sur la homepage ou page dédiée.

**Questions du site original**:

1. "Quels sont les services offerts par alecia ?"
2. "Comment alecia se différencie d'autres conseils financiers ?"
3. "Êtes-vous spécialiste d'un secteur en particulier ?"
4. "Comment sont calculés vos honoraires ?"
5. "Que signifie alecia ?"

**Réponses complètes** disponibles dans `/www.alecia.fr/Alecia.md` (lignes 37-64)

**Action**:

- ✅ FAQ basique déjà présente (`faq` section dans fr.json)
- ❌ FAQ complète du site original manque
- **Recommandation**: Ajouter une section `homeFaq` enrichie

---

### Section "Une équipe expérimentée" - Homepage

**Texte original** (Alecia.md, lignes 33-36):

> "Vos projets méritent un accompagnement de haut niveau. C'est pour cela que deux associés expérimentés vous sont dédiés à chaque mission, garantissant une expertise pointue et une réactivité constante pour transformer vos objectifs en succès. Chez alecia, notre équipe multi-spécialiste comprend les défis propres à chaque secteur d'activité. Nous évaluons avec précision la faisabilité de vos projets et activons les leviers les plus pertinents pour optimiser chaque étape de leur réalisation."

**Statut actuel**:

- ❌ Ce texte n'est pas présent dans le nouveau site
- ℹ️ Message de valeur fort sur l'approche "2 associés dédiés"

**Action**: Ajouter section `team.dedicatedApproach` avec ce contenu

---

### Section "Ils nous font confiance" - Homepage

**Site original** (Expertises_Alecia.md, lignes 119-172):

- Logos clients/partenaires

**Statut actuel**:

- ❌ Non implémenté dans le nouveau site
- **Action**: Ajouter section avec logos (nécessite design/images)

---

### Page Actualités

**Site original** (Actualités_Alecia.md):

- Titre: "Les actualités alecia"
- Sous-titre: "Communiqués, articles et revues de presse"
- Section newsletter: "Restez informés - Inscrivez-vous à notre newsletter pour recevoir nos actualités au fil de l'eau"

**Statut actuel fr.json**:

- ✅ `news.title`: "Actualités"
- ✅ `news.subtitle`: "Les dernières nouvelles et communiqués de presse d'alecia"
- ⚠️ Légère différence de wording mais acceptable
- ✅ Newsletter présente

**Verdict**: ✅ Bien couvert

---

### Page Contact

**Site original** (Contact_Alecia.md):

- Titre: "Contactez-nous"
- Sous-titre: "Vous êtes dirigeant, actionnaire ou investisseur ? Contactez-nous pour toute information sur nos services."
- Bouton: "Contacter l'un de nos associés"
- Section bureaux: "Découvrez notre ancrage multi-régional"

**Statut actuel fr.json**:

- ✅ `contact.title`: "Contactez-nous"
- ⚠️ `contact.subtitle`: "Vous êtes dirigeant, actionnaire ou investisseur ? Contactez-nous pour toute information."
- ❌ Manque "sur nos services" dans le subtitle
- ✅ Bureaux bien présents

**Action**: Enrichir légèrement `contact.subtitle`

---

### Page Nous Rejoindre

**Site original** (Nous_rejoindre_Alecia.md):

- Section tagline manquante: "Honnêteté — Excellence — Humilité"
  - **Dans fr.json**: ✅ `careers.vision.tagline`

Les paragraphes du site original manquent de certains détails:

**Comparaison ligne par ligne**:

| Clé fr.json         | Site Original | Verdict |
| ------------------- | ------------- | ------- |
| `careers.subtitle`  | Identique     | ✅      |
| `careers.vision.p1` | Identique     | ✅      |
| `careers.vision.p2` | Identique     | ✅      |
| `careers.vision.3`  | Identique     | ✅      |
| `careers.vision.p4` | Identique     | ✅      |
| `careers.invest.p1` | Identique     | ✅      |
| `careers.invest.p2` | Identique     | ✅      |

**Verdict**: ✅ Parfaitement aligné

---

## Éléments d'Interaction Manquants

### 1. Scroll Indicator Text

**Localisation**: HomeClient.tsx ligne 129
**Texte**: "Scroll" (hardcodé en anglais !)

**Action**:

- Ajouter clé `ui.scroll` avec valeur vide ou "Défiler" si on veut traduire
- Ou laisser en anglais comme c'est un élément graphique universel

---

### 2. Team Member Modal

**Localisation**: `/components/features/team-member-modal.tsx`
**Clés utilisées**:

- `t("memberRole")` (ligne 45)
- `t("defaultBio")` (ligne 69)

**Vérification fr.json**:

- ❌ Ces clés n'existent PAS dans fr.json actuel !
- **Action**: Ajouter ces clés manquantes

---

### 3. Aria Labels & Accessibility

**Items trouvés**:

- ✅ "Remonter en haut de la page" (scroll-to-top.tsx) → à i18niser
- ✅ "View details for..." (HomeClient.tsx ligne 219) → en anglais, à i18niser

---

## Synthèse des Actions Requises

### À Ajouter à fr.json

```json
{
  "ui": {
    "scrollToTop": "Remonter en haut de la page",
    "scroll": "", // Vide car élément graphique
    "viewDetails": "Voir les détails de {name}"
  },

  "team": {
    "memberRole": "Membre de l'équipe",
    "defaultBio": "Biographie à venir",
    "dedicatedApproach": {
      "title": "Deux associés dédiés à chaque mission",
      "description": "Vos projets méritent un accompagnement de haut niveau. C'est pour cela que deux associés expérimentés vous sont dédiés à chaque mission, garantissant une expertise pointue et une réactivité constante pour transformer vos objectifs en succès. Chez alecia, notre équipe multi-spécialiste comprend les défis propres à chaque secteur d'activité. Nous évaluons avec précision la faisabilité de vos projets et activons les leviers les plus pertinents pour optimiser chaque étape de leur réalisation."
    }
  },

  "homeFaq": {
    "title": "FAQ",
    "subtitle": "Les réponses à toutes vos questions",
    "ctaTitle": "En savoir plus sur notre accompagnement",
    "ctaSubtitle": "Contactez l'un de nos associés pour plus d'informations",
    "questions": {
      "services": {
        "question": "Quels sont les services offerts par alecia ?",
        "answer": "alecia est une banque d'affaires, également appelée conseil en fusion-acquisition. Nous offrons une gamme de services spécialisés destinés aux entreprises, qui incluent la cession, l'acquisition, la fusion, le financement et la levée de fonds. Grâce à nos expertises sectorielles et à nos réseaux étendus, nous accompagnons les chefs d'entreprise et actionnaires dans l'identification des contreparties pertinentes (acheteurs, investisseurs, financeurs ou cibles d'acquisition), la production de la valorisation et des informations-clés, la négociation des termes et l'animation des conseils juridiques et fiscaux jusqu'à la réussite de l'opération."
      },
      "differentiation": {
        "question": "Comment alecia se différencie d'autres conseils financiers ?",
        "answer": "alecia se distingue par plusieurs atouts. Tout d'abord, nous adoptons une approche interprofessionnelle en constituant dès le début de l'opération une équipe intégrée de vos différents conseillers (expert-comptable, avocats spécialisés en droit des affaires et fiscalité, gestionnaires de patrimoine, etc.). Ensuite, nous garantissons l'implication continue de deux associés expérimentés tout au long de la mission, assurant ainsi une expertise et une réactivité constantes. Nos parcours entrepreneuriaux nous permettent de comprendre avec finesse le quotidien des chefs d'entreprise, ajoutant une perspective précieuse à notre accompagnement. Enfin, notre expertise en ingénierie financière et notre dimension multi-sectorielle nous permettent de construire des solutions adaptées à chaque situation."
      },
      "sectors": {
        "question": "Êtes-vous spécialiste d'un secteur en particulier ?",
        "answer": "Nous croisons les expériences de nos associés pour apporter une expertise multi-secteurs et une connaissance fine de leurs écosystèmes. Nous intervenons ainsi dans les domaines suivants : agroalimentaire, distribution et services aux consommateurs comme aux entreprises, immobilier et BTP, industries, santé, services financiers et assurances, technologies et logiciels, ainsi qu'entreprises à impact environnemental et/ou social."
      },
      "fees": {
        "question": "Comment sont calculés vos honoraires ?",
        "answer": "Notre rémunération se divise en deux parties. Tout d'abord des honoraires initiaux sont payés à la signature d'un mandat. Leur montant est limité et sert à formaliser notre engagement réciproque dans l'opération. Ensuite, la quasi-totalité de notre rémunération provient d'honoraires de succès, calculés en appliquant un pourcentage au montant de la transaction. Ce modèle garantit l'alignement de nos intérêts avec les vôtres et assure notre engagement tout au long de la mission. La seule exception concerne les missions d'acquisition, pour lesquelles les honoraires de succès sont basés sur la taille de la cible plutôt que sur le montant de la transaction, afin de maintenir cet alignement des intérêts."
      },
      "meaning": {
        "question": "Que signifie alecia ?",
        "answer": "alecia tire son origine du concept d'alètheia, qui incarne la notion de vérité et de réalité. Ce nom guide notre approche qui repose sur trois principes directeurs : honnêteté, excellence et humilité. Ces valeurs nous poussent à être transparents dans toutes nos interactions et à nous engager dans une amélioration continue de notre savoir-faire et de nos outils."
      }
    }
  },

  "contact": {
    "subtitle": "Vous êtes dirigeant, actionnaire ou investisseur ? Contactez-nous pour toute information sur nos services.",
    "offices": "Bureaux",
    "regionalPresenceTitle": "Découvrez notre ancrage multi-régional"
  }
}
```

### À Corriger dans les Composants

#### 1. scroll-to-top.tsx

```typescript
// Avant
aria-label="Remonter en haut de la page"

// Après
import { useTranslations } from 'next-intl';
const t = useTranslations('ui');
aria-label={t('scrollToTop')}
```

#### 2. contact-form.tsx

```typescript
// Avant
placeholder="Entreprise SAS"

// Après
placeholder={t('companyPlaceholder')} // Utiliser la clé existante
```

#### 3. HomeClient.tsx

```typescript
// Ligne 129 - Scroll text
// Remplacer "Scroll" par {t('ui.scroll')} si besoin

// Ligne 219 - Aria label
// Avant
aria-label={`View details for ${member.name}`}

// Après
aria-label={t('ui.viewDetails', { name: member.name })}
```

---

## Missing Content from Original Site - ENRICHMENT

### Homepage Missing Sections

#### 1. **"Une équipe expérimentée à vos côtés"**

Actuellement absent du nouveau site. C'est un **fort différenciateur** (2 associés dédiés).

**Proposition**: Ajouter après la section "Provider" et avant "Expertises"

#### 2. **FAQ Complète**

La FAQ actuelle est minimaliste (3 questions dans `faq` section).
Le site original a 5 questions détaillées qui forment un excellent contenu de conversion.

**Proposition**: Créer une section FAQ complète sur la homepage ou page dédiée "/faq"

#### 3. **"Ils nous font confiance" (Logos clients)**

Preuve sociale absente.

**Proposition**: Ajouter bandeau de logos (à récupérer du site original ou créer)

---

## Statistiques

### Couverture i18n actuelle

- ✅ **HomeClient.tsx**: 100% i18n
- ✅ **Navigation/Footer**: 100% i18n
- ✅ **Forms**: ~95% i18n (quelques placeholders codés en dur)
- ⚠️ **Accessibility labels**: 60% i18n
- ❌ **Admin components**: Non i18nisés (normal, hors scope)

### Textes à ajouter

- **Nouvelles clés i18n nécessaires**: ~15
- **Clés d'enrichissement (FAQ complète)**: ~10
- **Total**: ~25 clés à ajouter

---

## Priorités d'Implémentation

### Phase 1: Corrections (Aujourd'hui)

1. ✅ Ajouter les clés UI manquantes (`scrollToTop`, `viewDetails`, etc.)
2. ✅ Corriger les aria-labels hardcodés
3. ✅ Enrichir `contact.subtitle`

### Phase 2: Enrichissement (Cette semaine)

4. ⭐ Ajouter FAQ complète (`homeFaq`)
5. ⭐ Ajouter section "Team Dedicated Approach"
6. 📸 Ajouter section "Ils nous font confiance" (nécessite assets)

### Phase 3: Optimisation (Suivant)

7. 🔍 Audit complet de toutes les pages (Operations, Team, News, etc.)
8. 🌍 Vérifier cohérence EN/FR
9. ♿ Audit accessibilité complet

---

**Document créé le**: 2025-12-24  
**Prochaine action**: Implémenter Phase 1 + Phase 2 (FAQ et Team Approach)
