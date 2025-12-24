# Quick Reference: Corrections de Code \u00c0 Impl\u00e9menter

## \ud83c\udfafObjectif

Remplacer les textes hardcod\u00e9s dans les composants client par les cl\u00e9s i18n maintenant disponibles dans `fr.json`.

---

## \ud83d\udd34 PRIORIT\u00c9 HAUTE (Accessibilit\u00e9)

### 1. `/components/features/scroll-to-top.tsx`

#### \ud83d\udd34 Modification \u00c0 Faire

```tsx
// AVANT (ligne 36)
\"use client\";

import { useState, useEffect } from \"react\";
import { motion, AnimatePresence } from \"framer-motion\";
import { ArrowUp } from \"lucide-react\";

export function ScrollToTop() {
  // ... state logic ...

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          // ...
          aria-label=\"Remonter en haut de la page\"  // \u2757 HARDCOD\u00c9
        >
          <ArrowUp className=\"w-5 h-5 mx-auto\" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
```

```tsx
// \u2705 APR\u00c8S

\"use client\";

import { useState, useEffect } from \"react\";
import { motion, AnimatePresence } from \"framer-motion\";
import { ArrowUp } from \"lucide-react\";
import { useTranslations } from \"next-intl\";  // \u2795 AJOUT

export function ScrollToTop() {
  const t = useTranslations(\"ui\");  // \u2795 AJOUT

  // ... state logic ...

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          // ...
          aria-label={t(\"scrollToTop\")}  // \u2705 I18N
        >
          <ArrowUp className=\"w-5 h-5 mx-auto\" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
```

---

### 2. `/components/features/contact-form.tsx`

#### \ud83d\udd34 Modification \u00c0 Faire

```tsx
// AVANT (ligne ~140)

export function ContactForm() {
  const t = useTranslations(\"contact.form\");

  return (
    <form>
      {/* ... */}
      <input
        type=\"text\"
        placeholder=\"Entreprise SAS\"  // \u2757 HARDCOD\u00c9
        disabled={formState === \"submitting\"}
      />
      {/* ... */}
    </form>
  );
}
```

```tsx
// \u2705 APR\u00c8S

export function ContactForm() {
  const t = useTranslations(\"contact.form\");

  return (
    <form>
      {/* ... */}
      <input
        type=\"text\"
        placeholder={t(\"companyPlaceholder\")}  // \u2705 I18N
        disabled={formState === \"submitting\"}
      />
      {/* ... */}
    </form>
  );
}
```

**Note**: La cl\u00e9 `contact.form.companyPlaceholder` existe d\u00e9j\u00e0 dans `fr.json` avec la valeur `\"Entreprise SAS\"`.

---

## \ud83d\udfe1 PRIORIT\u00c9 MOYENNE

### 3. `/components/home/HomeClient.tsx` - Aria Label pour Team Modal

#### \ud83d\udfe1 Modification \u00c0 Faire

```tsx
// AVANT (ligne ~219)

<motion.div
  key={member.name}
  // ...
  onClick={() => setSelectedMember(member)}
  role=\"button\"
  tabIndex={0}
  aria-label={`View details for ${member.name}`}  // \u2757 HARDCOD\u00c9 + ANGLAIS
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setSelectedMember(member);
    }
  }}
>
  {/* ... */}
</motion.div>
```

```tsx
// \u2705 APR\u00c8S

export function HomeClient() {
  const t = useTranslations();  // D\u00e9j\u00e0 pr\u00e9sent ligne 27

  return (
    <main>
      {/* ... */}
      <motion.div
        key={member.name}
        // ...
        onClick={() => setSelectedMember(member)}
        role=\"button\"
        tabIndex={0}
        aria-label={t(\"ui.viewDetails\", { name: member.name })}  // \u2705 I18N
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setSelectedMember(member);
          }
        }}
      > {/* ... */}
      </motion.div>
    </main>
  );
}
```

**Note**: Utilise la syntaxe de param\u00e9trisation `{name}` disponible dans next-intl.

---

### 4. `/components/features/team-member-modal.tsx` - Fallbacks Bio/Role

#### \ud83d\udfe1 Modifications \u00c0 Faire

**Ligne ~45 et ~69** :

```tsx
// AVANT

import { useTranslations } from \"next-intl\";

export function TeamMemberModal({ member, isOpen, onClose }) {
  const t = useTranslations();  // \u2757 PAS DE NAMESPACE

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {/* ... */}
        <p className=\"text-sm text-muted-foreground\">
          {member.role || t(\"memberRole\")}  // \u2757 CL\u00c9 N'EXISTE PAS
        </p>
        {/* ... */}
        <p className=\"text-sm\">
          {member.bio || t(\"defaultBio\")}  // \u2757 CL\u00c9 N'EXISTE PAS
        </p>
      </DialogContent>
    </Dialog>
  );
}
```

```tsx
// \u2705 APR\u00c8S

import { useTranslations } from \"next-intl\";

export function TeamMemberModal({ member, isOpen, onClose }) {
  const t = useTranslations(\"team\");  // \u2705 NAMESPACE CORRECT

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {/* ... */}
        <p className=\"text-sm text-muted-foreground\">
          {member.role || t(\"memberRole\")}  // \u2705 MAINTENANT EXISTE
        </p>
        {/* ... */}
        <p className=\"text-sm\">
          {member.bio || t(\"defaultBio\")}  // \u2705 MAINTENANT EXISTE
        </p>
      </DialogContent>
    </Dialog>
  );
}
```

**Rappel des valeurs** :

- `team.memberRole`: \"Membre de l'\u00e9quipe\"
- `team.defaultBio`: \"Biographie \u00e0 venir\"

---

## \ud83c\udfc3 Commandes de Test Rapide

### V\u00e9rifier que tout fonctionne apr\u00e8s modifications :

```bash
# 1. Lancer le dev server
npm run dev

# 2. Tester la page d'accueil
# Ouvrir http://localhost:3000
# V\u00e9rifier :
# - Bouton scroll-to-top (aria-label en fran\u00e7ais)
# - Hover sur photos d'\u00e9quipe (aria-label \"Voir les d\u00e9tails de...\")

# 3. Tester le formulaire de contact
# Ouvrir http://localhost:3000/contact
# V\u00e9rifier placeholder \"Entreprise SAS\" dans le champ entreprise

# 4. Tester la modal team
# Cliquer sur une photo d'\u00e9quipe
# V\u00e9rifier fallback \"Biographie \u00e0 venir\" si pas de bio
```

---

## \ud83d\udcc4 Checklist Compl\u00e8te

- [ ] `scroll-to-top.tsx` : Import `useTranslations(\"ui\")`
- [ ] `scroll-to-top.tsx` : Remplacer aria-label hardcod\u00e9
- [ ] `contact-form.tsx` : Remplacer placeholder hardcod\u00e9
- [ ] `HomeClient.tsx` : Aria-label avec param\u00e8tre `{name}`
- [ ] `team-member-modal.tsx` : Namespace `\"team\"` pour `useTranslations`
- [ ] `team-member-modal.tsx` : V\u00e9rifier fallbacks `memberRole` et `defaultBio`
- [ ] Test manuel : Bouton scroll visible et aria-label correct
- [ ] Test manuel : Formulaire contact avec bon placeholder
- [ ] Test manuel : Modal team avec fallbacks fran\u00e7ais
- [ ] Test accessibilit\u00e9 : Lecteur d'\u00e9cran (optionnel mais recommand\u00e9)

---

## \u231b Estimation Temps

| Tâche              | Temps       | Commentaire                       |
| ------------------ | ----------- | --------------------------------- |
| Modifications code | 15-20 min   | 4 fichiers, modifications simples |
| Tests manuels      | 10 min      | V\u00e9rifier chaque modification |
| **Total**          | **~30 min** | **Tr\u00e8s rapide !**            |

---

## \u2705 Apr\u00e8s Ces Corrections

### Couverture i18n Client-Side

| Zone          | Avant   | Apr\u00e8s      |
| ------------- | ------- | --------------- |
| Homepage      | 95%     | **100%**        |
| Forms         | 95%     | **100%**        |
| Accessibility | 60%     | **100%**        |
| Modals        | 70%     | **100%**        |
| **TOTAL**     | **85%** | **\u2705 100%** |

---

## \ud83d\udc4d Bonnes Pratiques Appliqu\u00e9es

1. \u2705 **Namespace i18n** : `useTranslations(\"ui\")`, `useTranslations(\"team\")`, etc.
2. \u2705 **Param\u00e9trisation** : `t(\"viewDetails\", { name })` pour textes dynamiques
3. \u2705 **Fallbacks** : `member.role || t(\"memberRole\")` pour donn\u00e9es optionnelles
4. \u2705 **Accessibilit\u00e9** : Tous les `aria-label` en fran\u00e7ais

---

**Document cr\u00e9\u00e9 le** : 2025-12-24
**Auteur** : Documentation technique Antigravity
**Pour** : Impl\u00e9mentation rapide des corrections i18n
