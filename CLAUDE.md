# Minilek+ — Mémoire projet Claude (ultra-dense)

---

## DÉPLOIEMENT

```bash
# Seule commande de déploiement valide
VERCEL_TOKEN=[retiré] \
  npx vercel deploy --prod --scope piyanats-projects-a2ca5d28
```

- **Live** : https://plus.minilek.com
- **Projet Vercel** : `minilekplus` sous compte `piyanat` (≠ `aktdigital` qui est le CLI local)
- **Supabase** : `suehveutdmhnchumojle` (compte `lekyai` = piyanatlkmedia@gmail.com)

---

## MODÈLES IA

| Usage | Modèle |
|---|---|
| Architecture/planification | `claude-opus-4-5` |
| Code (défaut projet) | `claude-sonnet-4-5` (dans `.claude/settings.json`) |
| Traduction répétitive | `claude-haiku-4-5` |

---

## STACK

- Next.js 14 App Router · TypeScript · Tailwind CSS
- Supabase (DB + Auth) · Anthropic API · YouTube Data API v3
- 5 locales : `fr` `en` `es` `pt` `th` (dans `types/quiz.ts` ET `lib/i18n/context.tsx`)

---

## ARCHITECTURE i18n

```
types/quiz.ts                    → Locale = 'fr'|'en'|'es'|'pt'|'th'
lib/i18n/context.tsx             → LanguageProvider, useLanguage(), même Locale
lib/i18n/public-labels.ts        → NavLabels, PlaymobilLabels, HeroPageConfig, PublicLabels
lib/i18n/homepage-labels.ts      → HomepageLabels (hero, manifeste, activities, stack, phoneDemo)
lib/i18n/quiz-labels.ts          → QuizLabels (5 locales)
lib/i18n/word-search-labels.ts   → WordSearchLabels (5 locales)
lib/i18n/mission-labels.ts       → MissionLabels (5 locales)
```

**Pattern pages** : page.tsx = Server Component (metadata) → rend un Client Component qui lit `useLanguage()`

**Hero traduit** : utiliser `<ClientInnerPageHero pageKey="xxx" bgColor="..." charSrc="..." />`
- Ne jamais utiliser `<InnerPageHero>` directement dans les pages publiques (pas de traduction)
- Ajouter la clé dans `public-labels.ts → heroPages[pageKey]` pour chaque locale

---

## ROUTES

| Route | Composant | Notes |
|---|---|---|
| `/` | `app/(public)/page.tsx` | Server async, `revalidate=3600`, appelle `getPlaylist()` |
| `/culte-familial` | Server + `ClientInnerPageHero` + `CulteFamilialList` | SEO `generateMetadata` dynamique |
| `/culte-familial/[slug]` | `QuizShell` | `getParcoursWithQuestions(slug)` |
| `/mots-meles` | Server + `ClientInnerPageHero` + `WordSearchGame` | |
| `/coloriage` | Server + `ClientInnerPageHero` | "bientôt" |
| `/notre-mission` | Server → `<NotreMissionContent />` | Client component (traduction dynamique) |
| `/histoires-playmobil` | Server async, `revalidate=3600` → `<PlaymobilContent>` | Netflix style |
| `/admin/*` | Dashboard admin Supabase | `/admin` → redirect vers `/admin/dashboard` |
| `/api/translate` | Claude Haiku | traduit parcours+questions FR→EN,ES,PT,TH |
| `/api/translate-text` | Claude Haiku | traduit texte libre (descriptions YouTube) |

---

## CULTE FAMILIAL — PARCOURS EN BASE

| Slug | Titre FR |
|---|---|
| `la-piece-retrouvee` | La pièce retrouvée |
| `la-peche-miraculeuse` | La pêche miraculeuse |
| `la-reine-esther` | La reine Esther |
| `5-pains-et-2-poissons` | 5 pains et 2 poissons ⚠️ ES manquant |
| `guerison-le-jour-du-sabbat` | Guérison le jour du sabbat |
| `les-mages-suivent-letoile` | Les mages qui suivent l'étoile |
| `maison-sur-le-roc` | Maison sur le roc |
| `joseph-et-ses-freres` | Joseph et ses frères |

**Structure questions** : 16 par parcours (4 facile + 4 moyenne + 4 impossible + 4 parents)
**Traduction admin** : bouton "Traduire" → `/api/translate` → génère EN, ES, PT, TH en parallèle via Promise.all

---

## YOUTUBE / HISTOIRES PLAYMOBIL

```
lib/youtube/types.ts         → YouTubeVideo { id, title, description, thumbnail, publishedAt }
lib/youtube/getPlaylist.ts   → PLAYLIST_ID = 'PL7GS8psh4FtaBqggodRFy41FOVwnvKCPv'
                               ⚠️ OBLIGATOIRE: header Referer: 'https://plus.minilek.com'
                               (clé API restreinte *.minilek.com/*)
```

**Clé YouTube** : `AIzaSyB3RwPdn8_sM2bZPUkwa4iKBpWXrGaiejA` (dans `.env.local` + Vercel env)
**Restriction** : HTTP Referrer `*.minilek.com/*` → les appels sans Referer retournent 403

**Composants** :
```
components/histoires-playmobil/
  PlaymobilContent.tsx   → Client root (état featured, search, modal)
  HeroSection.tsx        → Hero Netflix (thumbnail bg → iframe YouTube au clic)
  VideoRow.tsx           → Rangée scrollable horizontale
  VideoCard.tsx          → Carte 16:9 hover scale
  InfoModal.tsx          → Modal description traduite lazy (cache localStorage)
components/home/
  PlaymobilPreviewSection.tsx → 4 dernières vidéos sur homepage
```

**Description traduite** : lazy au clic "Plus d'infos" → `/api/translate-text` → cache `localStorage` clé `minilek_yt_${videoId}_${locale}`

---

## MOTS MÊLÉS

```
lib/word-search/word-bank.ts    → WORD_BANK: Record<string, WordEntry[]> (fr,en,es,pt,th)
                                   ALPHABETS: Record<string, string[]>
lib/word-search/generateGrid.ts → génération de grille
lib/word-search/normalise.ts    → normalisation mots
components/word-search/WordSearchGame.tsx → UI interne avec const UI (fr,en,es,pt,th)
                                            const LANG_MAP = {fr,en,es,pt,th}
```

---

## VARIABLES D'ENVIRONNEMENT

```env
NEXT_PUBLIC_SUPABASE_URL=https://suehveutdmhnchumojle.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_p4SO2312l9zpis-Y3E5XrA_eKZc5sQ6
SUPABASE_SERVICE_ROLE_KEY=[retiré]
ANTHROPIC_API_KEY=[retiré]
YOUTUBE_API_KEY=AIzaSyB3RwPdn8_sM2bZPUkwa4iKBpWXrGaiejA
ADMIN_EMAIL=piyanatlkmedia@gmail.com
```

---

## FICHIERS CRITIQUES — NE PAS OUBLIER

| Fichier | Rôle |
|---|---|
| `types/quiz.ts` | Type `Locale` → doit avoir les 5 locales |
| `lib/i18n/context.tsx` | Même type `Locale` + `VALID_LOCALES` |
| `lib/i18n/public-labels.ts` | Interfaces + données pour TOUTES les pages publiques |
| `app/api/translate/route.ts` | Haiku, traduit en EN+ES+PT+TH (4 langues en Promise.all) |
| `lib/youtube/getPlaylist.ts` | Header Referer obligatoire |
| `components/layout/ClientInnerPageHero.tsx` | Wrapper client pour heroes traduits |
| `components/layout/NavBar.tsx` | ACTIVITY_ITEMS + MINILEK_ITEMS + LANGS (5 drapeaux) |

---

## PIÈGES CONNUS

1. **Double session Claude Code** → conflits git stash/filter-branch → vérifier tous les fichiers i18n après incident
2. **YouTube API 403** → toujours inclure `headers: { Referer: 'https://plus.minilek.com' }` dans fetch
3. **`Locale` défini en deux endroits** (`types/quiz.ts` ET `context.tsx`) → mettre à jour les deux
4. **`InnerPageHero` vs `ClientInnerPageHero`** → utiliser `ClientInnerPageHero` partout (traduction). `InnerPageHero` n'a pas de contexte locale.
5. **`notre-mission/page.tsx`** → doit importer `NotreMissionContent` (client), pas `InnerPageHero` directement
6. **Ajout d'une nouvelle locale** → modifier : `types/quiz.ts`, `context.tsx`, `public-labels.ts`, `homepage-labels.ts`, `quiz-labels.ts`, `word-search-labels.ts`, `mission-labels.ts`, `word-bank.ts` (WORD_BANK + ALPHABETS), `WordSearchGame.tsx` (UI + LANG_MAP), `NavBar.tsx` (LANGS), `api/translate/route.ts`
7. **Parcours `5-pains-et-2-poissons`** → traduction ES manquante, lancer depuis admin
8. **word-bank.ts** → bloc `es:[]` doit être DANS l'objet WORD_BANK, pas après la fermeture `}`
9. **ISR homepage** → `export const revalidate = 3600` + `async` + `getPlaylist()` → si YouTube échoue, section preview masquée silencieusement (normal)
10. **git filter-branch** → ne pas utiliser avec stash actif (conflict → perte des fichiers non trackés)

---

## TODO

- [ ] Traduire `5-pains-et-2-poissons` en espagnol (lancer depuis `/admin`)
- [ ] Pousser vers GitHub (historique nettoyé mais push bloqué par secret scanning sur ancien plan doc — résolu mais push non fait)
- [ ] Considérer rotation du token Vercel (exposé dans un commit plan.md)

---

## ASSETS SVG (public/svg/)

`cerf` `phoque` `oiseau` `ours` `souris` `chat` `mouton` `chat-gris` `chat-livre` `blonde-scientifique` `casquette-rose` `grand-mere-genie`

---

## CONVENTIONS CODE

- Server Components : `export const revalidate = N` pour ISR, `export const dynamic = 'force-dynamic'` pour toujours fresh
- Client Components : `'use client'` + `useLanguage()` pour locale
- Toujours `unoptimized` sur `<Image>` pour URLs YouTube externes
- Migrations Supabase : `supabase/migrations/0XX_seed_*.sql`, appliquées via MCP `execute_sql`
- Commit format : `feat:` / `fix:` / `docs:` + `Co-Authored-By: Claude Sonnet 4.6`
