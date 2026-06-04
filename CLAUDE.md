# Minilek+ — Contexte projet pour Claude

## Déploiement

### Production URL
- **Live** : https://plus.minilek.com
- **Vercel alias** : https://minilekplus-one.vercel.app

### Compte Vercel
Le projet `minilekplus` est sous le compte **piyanat** (pas `aktdigital`).

Pour déployer, utiliser le token personnel du compte piyanat :

```bash
VERCEL_TOKEN=[retiré] npx vercel deploy --prod --scope piyanats-projects-a2ca5d28
```

### Pourquoi ce contournement ?
Le CLI Vercel local est connecté au compte `aktdigital`. Le projet avec le domaine `plus.minilek.com` est sous le compte `piyanat`. Le token permet de déployer sans changer le compte connecté.

---

## Stratégie de modèles IA (rapport output/tokens optimal)

| Contexte | Modèle | Pourquoi |
|----------|--------|----------|
| **Planification / architecture** | `claude-opus-4-5` | Raisonnement complexe, décisions critiques |
| **Coding / review / debug** | `claude-sonnet-4-5` (défaut projet) | Excellent ratio qualité/coût pour le code |
| **Traduction (API `/api/translate`)** | `claude-3-5-haiku-20241022` | Tâche répétitive simple — ~10× moins cher |

**Règle** : ne jamais utiliser Opus pour du code routinier ni Haiku pour de l'architecture.  
Le modèle défaut du projet est défini dans `.claude/settings.json` → `claude-sonnet-4-5`.

---

## Stack technique

- **Framework** : Next.js 14 App Router
- **Styling** : Tailwind CSS + `app/globals.css` (keyframes custom)
- **i18n** : React Context (`LanguageProvider`) — locales : `fr`, `en`, `pt`, `th`
- **Base de données** : Supabase
- **Auth** : Supabase Auth

## Structure i18n

- `lib/i18n/context.tsx` — `LanguageProvider`, `useLanguage()`, type `Locale`
- `lib/i18n/homepage-labels.ts` — labels page d'accueil (hero, manifeste, activities, stack)
- `lib/i18n/public-labels.ts` — labels pages intérieures (culte-familial, etc.)

## Assets SVG

Personnages dans `public/svg/` :
`cerf`, `phoque`, `oiseau`, `ours`, `souris`, `chat`, `mouton`, `chat-gris`, `chat-livre`, `blonde-scientifique`, `casquette-rose`, `grand-mere-genie`

## Routes principales

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil |
| `/culte-familial` | Quiz bibliques familiaux |
| `/mots-meles` | Jeu de mots mêlés |
| `/coloriage` | Page "bientôt disponible" |
| `/notre-mission` | Page mission |
| `/admin/*` | Dashboard admin |
