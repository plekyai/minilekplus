# Design Spec: Minilek Plus — Culte Familial (Family Worship Quiz)

**Date:** 2026-04-13  
**Project:** plus.minilek.com — Activity Hub  
**Scope:** Culte Familial (Phase 1) + Mots Mêlés migration. Scalable to future activities (coloriage).  
**Status:** Approved by user

---

## 1. Product Overview

A structured, 7-step interactive quiz experience for families, based on Bible stories. The quiz guides families through story reading, multiple-choice questions of increasing difficulty, a parents-only open question, and a closing prayer. Content is managed via a back-office admin interface and auto-translated from French into English, Portuguese, and Thai using the Claude API.

**Domain:** `plus.minilek.com`  
**Deployment:** Vercel  
**Primary language of content entry:** French (FR)

---

## 2. Architecture

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database + Auth + Storage | Supabase |
| Styling | Tailwind CSS (custom design tokens) |
| Auto-translation | Claude API (`claude-sonnet-4-6`) |
| Translation trigger | Supabase Edge Function (database webhook) |
| Deployment | Vercel |
| Session state (guest) | `sessionStorage` |
| Family accounts | Supabase Auth (optional, no mandatory login) |

### Route Structure

```
app/
  (public)/
    page.tsx                      # Home / activity hub
    culte-familial/
      page.tsx                    # Parcours list
      [parcours_slug]/
        page.tsx                  # Quiz shell (7-step flow)
    coloriage/                    # Future activity
    mots-meles/
      page.tsx                    # Puzzle list (parcours + mode selector)
      [puzzle_slug]/
        page.tsx                  # Game screen
  (admin)/
    admin/
      login/page.tsx
      dashboard/page.tsx
      parcours/
        page.tsx                  # List all parcours
        new/page.tsx              # Create parcours
        [id]/page.tsx             # Edit parcours + questions + translations
  (auth)/
    auth/
      login/page.tsx
      register/page.tsx
      forgot-password/page.tsx
      callback/page.tsx           # Supabase Auth redirect handler
```

### Key Principles

- **Scalable by route segment.** New activities are new route groups with zero impact on existing code.
- **No mandatory accounts.** All quiz flow works for guests via `sessionStorage`. Family accounts are optional.
- **Content language isolation.** All translated content lives in JSONB `translations` fields. The app reads the active locale at runtime.

---

## 3. Data Model

### `parcours`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
slug          text UNIQUE NOT NULL
translations  jsonb NOT NULL  -- { fr: {title, story_text, prayer_text}, en: {...}, pt: {...}, th: {...} }
image_url     text            -- Supabase Storage path or external URL
audio_urls    jsonb           -- { generique, facile, moyenne, difficile, parents, priere, correct, wrong }
tags          text[]          -- thematic tags e.g. ['parabole','pardon','Luc']
difficulty    text            -- 'debutant' | 'intermediaire' | 'avance'
tier          text DEFAULT 'free'  -- 'free' | 'premium' — controls access gate
published     boolean DEFAULT false
created_at    timestamptz DEFAULT now()
updated_at    timestamptz DEFAULT now()
```

### `questions`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
parcours_id     uuid REFERENCES parcours(id) ON DELETE CASCADE
type            text NOT NULL   -- 'facile' | 'moyenne' | 'impossible' | 'parents'
order_index     integer NOT NULL
translations    jsonb NOT NULL
  -- {
  --   fr: {
  --     question: text,
  --     choices: [A, B, C, D],   -- null for type='parents'
  --     correct_index: 0-3,      -- null for type='parents'
  --     explanation: text        -- shown after answer
  --   },
  --   en: {...}, pt: {...}, th: {...}
  -- }
created_at      timestamptz DEFAULT now()
```

**Note on multiple-choice format:** The existing WordPress site uses an accordion reveal format. The new app uses A/B/C/D tiles. When entering content in the back-office, 3 distractor answers must be provided per question in addition to the correct answer.

### `family_profiles`
```sql
id                    uuid PRIMARY KEY REFERENCES auth.users(id)
display_name          text
-- Subscription fields (populated by Stripe webhook when billing is activated)
stripe_customer_id    text UNIQUE         -- set when family creates a Stripe customer
subscription_status   text DEFAULT 'free' -- 'free' | 'active' | 'past_due' | 'canceled'
subscription_tier     text DEFAULT 'free' -- 'free' | 'premium' (extensible)
subscription_ends_at  timestamptz NULL    -- set when subscription cancels/expires
created_at            timestamptz DEFAULT now()
```

### `progress_sessions`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
family_id       uuid REFERENCES family_profiles(id) NULL  -- null = guest
parcours_id     uuid REFERENCES parcours(id)
current_step    integer DEFAULT 0
answers         jsonb   -- { question_id: chosen_index }
score           integer DEFAULT 0
completed_at    timestamptz NULL
created_at      timestamptz DEFAULT now()
```

### `word_search_puzzles`
Curated (parcours) puzzles. One row per puzzle per language.

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
slug            text UNIQUE NOT NULL
mode            text DEFAULT 'parcours'  -- 'parcours' | 'aleatoire' (aleatoire rows = word bank seed)
translations    jsonb NOT NULL
  -- {
  --   fr: { title, verse_ref, verse_text, words: [{text, emoji, audio_url}], grid: string[], translation_status },
  --   en: {...}, pt: {...}, th: {...}
  -- }
  -- grid: array of 10 strings of 8 chars each (8 cols × 10 rows)
  -- words: max 8 items (grid constraint)
tags            text[]
tier            text DEFAULT 'free'   -- 'free' | 'premium'
published       boolean DEFAULT false
order_index     integer DEFAULT 0
created_at      timestamptz DEFAULT now()
```

### `word_search_word_bank`
Extensible word bank used for `aléatoire` mode. Managed from admin (starts with the hardcoded JS bank migrated).

```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
locale      text NOT NULL   -- 'fr' | 'en' | 'pt' | 'th'
word        text NOT NULL
emoji       text
audio_url   text NULL
tags        text[]          -- e.g. ['objet','personnage','valeur']
created_at  timestamptz DEFAULT now()
UNIQUE(locale, word)
```

### Translation JSONB convention

All `translations` fields follow the same shape per locale key (`fr`, `en`, `pt`, `th`). Each locale object includes a `translation_status` field:

```json
{
  "fr":  { "title": "...", "translation_status": "source" },
  "en":  { "title": "...", "translation_status": "ai" },
  "pt":  { "title": "...", "translation_status": "ai" },
  "th":  { "title": "...", "translation_status": "verified" }
}
```

Status values: `source` | `ai` | `verified`

---

## 4. Multi-Language Pipeline

1. Admin enters content in French (FR) in back-office.
2. On `INSERT` or `UPDATE` to `parcours` or `questions`, a Supabase database webhook fires.
3. The webhook triggers a Supabase Edge Function (`translate-content`).
4. The Edge Function calls the Claude API (`claude-sonnet-4-6`) to translate all text fields from FR → EN, PT, TH in a single prompt call per record.
5. Translated content is written back to the `translations` JSONB field with `translation_status: "ai"`.
6. In the back-office translation view, each locale shows:
   - A badge: **IA** (grey) for AI-generated, **Vérifié** (green checkmark) for manually corrected.
   - An editable text field. On save, `translation_status` updates to `"verified"`.

**Language selector:** Shown on the home/activity hub page and accessible from the quiz header at any point. Selection stored in `localStorage` and persists across page loads. All quiz content, UI labels, and question text render in the selected locale.

---

## 5. Quiz Flow (7 Steps)

The quiz is a linear, stateful 7-step flow. State is held in `sessionStorage` for guests and synced to `progress_sessions` for logged-in families.

| Step | Key | Description |
|---|---|---|
| 1 | `story` | Display story text + image. Parent reads aloud. CTA: "On commence !" |
| 2 | `facile` | Easy questions (MCQ A/B/C/D tiles). One question per screen. |
| 3 | `moyenne` | Medium questions. Same MCQ format. Background music changes. |
| 4 | `impossible` | Impossible questions. Inverted dark theme, inner-glow effect. |
| 5 | `parents` | Parents question. Open text area (not scored). Circle of Wisdom visual. |
| 6 | `priere` | Prayer text displayed. Centered, editorial layout. Candle imagery. Music plays. |
| 7 | `fin` | Score reveal, encouragement message, "Next story" CTA. |

### Audio behaviour
- Each step transition triggers the corresponding background music track (looped, crossfaded).
- Correct/wrong jingles play on MCQ answer selection before advancing.
- Music can be toggled via a global mute button in the header.
- All audio URLs are stored per-parcours in the `audio_urls` JSONB field.

### Scoring
- +1 point per correct MCQ answer.
- Parents question: not scored.
- Score displayed at end screen with a tier message (e.g., "Excellent !", "Bien joué !", "Continue à chercher !").

---

## 6. Back-Office Admin Interface

**Access:** `/admin` — protected by Supabase Auth.  
**Credentials management:** The admin account is a Supabase Auth user. `ADMIN_EMAIL` is stored as a Vercel environment variable and used by Next.js middleware to verify that the authenticated user's email matches the expected admin email. Supabase Auth manages the password; no password hash is stored in env vars.  
**Password reset:** Supported via Supabase Auth email flow (forgot-password → reset email). Admin email must **never** be committed to code.

### Admin Features

| Feature | Description |
|---|---|
| Parcours list | Table view with published/draft toggle, edit/delete, creation date |
| Create/Edit parcours | Title (FR), story text (FR, rich text), image upload, audio uploads, tags, difficulty, published toggle |
| Questions editor | Per-parcours question list: add/reorder/delete questions, select type, enter FR text, 4 choices + correct index, explanation |
| Translation panel | Side-by-side FR (source) + EN/PT/TH with AI/Vérifié badge; editable fields per locale |
| Re-trigger translation | Button to re-run Claude translation for a record |
| Media library | Supabase Storage browser for images and audio files |

### Family accounts (admin view)
- List of registered families (email, display name, created date).
- No password management in admin UI (handled by Supabase Auth).

---

## 7. Authentication

### Admin
- Supabase Auth with email/password.
- Middleware in Next.js protects all `/admin` routes.
- Forgot-password: Supabase Auth sends reset email.

### Family accounts
- Optional. Guest play requires no login.
- Supabase Auth with email/password.
- Forgot-password: same Supabase Auth email reset flow.
- On registration: `family_profiles` record created via Supabase Auth trigger.
- Progress sessions created in `progress_sessions` table (linked to `family_id`).

### Guest sessions
- `sessionStorage` key: `minilek_quiz_session`.
- Stores: `{ parcours_id, current_step, answers, score }`.
- On session end (tab close), state is lost unless user has an account.

---

## 8. Design System — "The Illuminated Fable"

Full spec: `stitch-minilek-culte-familial/little_storyteller/DESIGN.md`

### Key design tokens

| Token | Value |
|---|---|
| `primary` | `#006a60` |
| `primary_container` | `#3ecdbb` |
| `secondary` | `#795900` |
| `surface` | `#fbf9f8` |
| `on_surface` | `#1b1c1c` |
| `inverse_surface` | dark (for impossible question step) |

### Fonts
- **Plus Jakarta Sans** — display, headlines, titles
- **Lexend** — body text, story reading, labels

Both fonts loaded via Google Fonts / `next/font`.

### Critical rules
- **No 1px solid borders.** Boundaries defined exclusively by background color shifts.
- **No `#000000` text.** Always use `on_surface` (`#1b1c1c`).
- **No sharp corners.** Minimum `sm` (0.5rem) radius. Buttons/cards use `lg` (2rem) or `xl` (3rem).
- **Primary CTA gradient:** `primary` → `primary_container` at 135°.
- **MCQ tiles:** Large tactile tiles on `surface-container-low`. Selected state: `primary_fixed_dim` with ghost border of `primary`.
- **Impossible question step:** `inverse_surface` background, `inverse_primary` typography, inset box-shadow glow using `primary_container` at 10% opacity.
- **Prayer step:** `surface-bright` background, `xl` (3rem) corner radius, `headline-sm` typography, centered editorial layout.
- **Floating elements:** Glassmorphism — semi-transparent `surface` color + `backdrop-blur` 12–20px.

### Responsive design
- Fully responsive across mobile, tablet, and desktop.
- NOT mobile-only. Layouts adapt at standard Tailwind breakpoints (`sm`, `md`, `lg`, `xl`).
- Story and question content should feel like a luxury publication at all screen sizes.

---

## 9. Seed Data — First Parcours: "La pièce retrouvée"

This data is ready to seed at launch from the existing WordPress page.

**Story:** La pièce retrouvée (The Lost Coin) — Luke 15:8-10  
**Image:** `https://minilek.com/wp-content/uploads/2026/02/la-piece-retrouvee-parabole-de-Jesus-histoire-biblique-pour-enfant-culte-familial-ludique-Minilek-scaled.png`

### Audio URLs
| Track | URL |
|---|---|
| Générique (intro) | `https://minilek.com/wp-content/uploads/2024/09/Mini-quizz-generique.mp3` |
| Questions faciles | `https://minilek.com/wp-content/uploads/2024/09/Mini-quiz-Question-simple.mp3` |
| Questions moyennes | `https://minilek.com/wp-content/uploads/2024/09/Mini-quiz-Question-moyenne.mp3` |
| Questions impossibles | `https://minilek.com/wp-content/uploads/2024/09/Mini-quiz-Question-difficile.mp3` |
| Questions parents | `https://minilek.com/wp-content/uploads/2024/10/Epicness-Musique-minilek-pour-la-question-des-parents-quiz-chretien-ludique.wav` |
| Prière | `https://minilek.com/wp-content/uploads/2024/09/Miniquiz-Piano-priere.mp3` |
| Bonne réponse (jingle) | `https://minilek.com/wp-content/uploads/2024/09/vrai.mp3` |
| Mauvaise réponse (jingle) | `https://minilek.com/wp-content/uploads/2024/09/faux.mp3` |

### Questions (extracted from WordPress — FR source)

16 questions total. Type breakdown: 5 facile / 5 moyenne / 3 impossible / 3 parents.

**⚠️ Action required at content entry:** The WordPress source uses accordion reveal format (question + answer only). The new app requires A/B/C/D multiple choice. When entering these questions in the back-office, 3 distractor answers must be added per MCQ question. Parents questions have no choices (open text).

| # | Type | Question (FR) | Correct Answer (FR) |
|---|---|---|---|
| 1 | facile | Combien de pièces d'argent la femme possédait-elle ? | 10 pièces |
| 2 | facile | Que fait-elle quand elle perd une pièce ? | Elle allume une lampe et balaie la maison |
| 3 | facile | Où cherche-t-elle la pièce ? | Dans toute la maison |
| 4 | facile | Que fait-elle quand elle retrouve la pièce ? | Elle appelle ses amies et voisines pour se réjouir |
| 5 | facile | Cette parabole parle de qui se réjouit quand un pécheur se repent ? | Les anges de Dieu |
| 6 | moyenne | Quel livre de la Bible raconte cette histoire ? | Luc |
| 7 | moyenne | Quel chapitre du livre de Luc ? | Chapitre 15 |
| 8 | moyenne | Qu'est-ce qu'une parabole ? | Une histoire avec un message caché / une leçon spirituelle |
| 9 | moyenne | Que représente la pièce perdue dans cette parabole ? | Une personne perdue / un pécheur |
| 10 | moyenne | Que représente la femme dans cette parabole ? | Dieu / Jésus qui cherche les perdus |
| 11 | impossible | Quels versets précis du chapitre 15 de Luc racontent cette parabole ? | Versets 8 à 10 |
| 12 | impossible | Dans la culture de l'époque, que représentait une pièce d'argent (une drachme) ? | Le salaire d'une journée de travail |
| 13 | impossible | Quelles sont les deux autres paraboles racontées dans Luc 15 ? | La brebis perdue et le fils prodigue |
| 14 | parents | Comment montres-tu à tes enfants que tu les cherches quand ils se perdent (font une bêtise) ? | (open — no correct answer) |
| 15 | parents | Comment expliquer à tes enfants que Dieu ne se décourage jamais de les chercher ? | (open — no correct answer) |
| 16 | parents | As-tu déjà ressenti que Dieu te cherchait dans un moment difficile ? Partage avec ta famille. | (open — no correct answer) |

### Prayer text (FR)
*Extracted from WordPress source — to be entered as `prayer_text` in FR translations field.*

> Seigneur, merci de nous chercher quand nous nous perdons. Comme la femme cherche sa pièce avec soin, tu nous cherches avec amour. Aide-nous à rester proches de toi et à nous réjouir quand ceux qui étaient perdus reviennent vers toi. Amen.

---

## 10. Environment Variables

All secrets and configuration must be set as Vercel environment variables. Never commit to code.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase operations |
| `ANTHROPIC_API_KEY` | Claude API for auto-translation |
| `ADMIN_EMAIL` | Admin email — used by middleware to authorize admin access |
| `STRIPE_SECRET_KEY` | Stripe secret key (server-side) — declared now, unused in Phase 1 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (client-side) — declared now, unused in Phase 1 |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret — declared now, unused in Phase 1 |

---

## 11. Mots Mêlés Activity

### Source
Existing game: `/Jeux online/Mots mélees/plugins/mots-melees-bible/assets/game.js` (Vanilla JS V4) + `style.css` + WordPress shortcode plugin. The game is functional and works well — the migration preserves all features, updating only the stack.

### What is kept
- Two modes: **Parcours** (curated fixed grids) and **Aléatoire** (random grid generated from word bank)
- Grid: 8 columns × 10 rows, fixed (responsive: cells shrink on mobile, grid does not wrap)
- Directions: horizontal (L/R) and vertical (U/D) — no diagonals
- Word chips with emoji + audio button per word
- Bible verse reference + text displayed per puzzle
- Timer, found-word counter, score
- FR/EN/PT/TH language support (already built into existing JS data structure)
- Random grid generation algorithm (place words, fill remaining cells with random letters)

### What changes
| Current | New |
|---|---|
| Vanilla JS + DOM manipulation | React component with `useState`/`useReducer` for game state |
| Data hardcoded in JS (PUZZLES, WORD_BANK) | Loaded from Supabase (`word_search_puzzles`, `word_search_word_bank`) |
| WordPress AJAX for leaderboard | Supabase `progress_sessions` table (same as Culte Familial) |
| CSS `--minilek-green: #19A69C` | Design tokens: `primary #006a60`, `secondary #795900` |
| Font: DM Sans | Plus Jakarta Sans (titles) + Lexend (body) |
| `2px solid` borders on cells and word chips | Tonal layering: cells on `surface-container-low`, found state uses `primary` background, no explicit border |
| WP shortcode `[mmb_game language="fr" mode="aleatoire"]` | Next.js route `/mots-meles/[puzzle_slug]` + query param `?mode=aleatoire` |

### Game component architecture

```
components/word-search/
  WordSearchGame.tsx        # Main game shell (state machine: idle → playing → won)
  WordGrid.tsx              # 8×10 grid, handles cell tap/drag selection
  WordChipList.tsx          # List of target words with found/pending state
  GameInfoBar.tsx           # Timer + found count + score
  useWordSearch.ts          # Game logic hook: grid generation, selection validation, scoring
  gridGenerator.ts          # Pure TS: placeWords() + fillGrid() — ported from JS V4
```

The grid generation logic (`canPlaceWord`, `placeWord`, `generateGrid`) is ported from the existing vanilla JS as pure TypeScript functions with no DOM dependencies — easy to test and reuse.

### Aléatoire mode
- On page load with `?mode=aleatoire`: fetch a random sample from `word_search_word_bank` for the active locale (8 words), generate grid client-side using `gridGenerator.ts`.
- "Nouvelle Grille" button: re-fetch + regenerate.
- No puzzle record needed in DB for random games — score recorded as an anonymous session.

### Back-office additions
- **Puzzle list**: table with slug, mode, locale count, tier, published toggle.
- **Puzzle editor**: enter title + verse (FR) → auto-translate → per-locale word list editor (add/remove words with emoji + audio URL) → grid preview (rendered live as admin enters words for visual validation).
- **Word bank editor**: add/edit/delete words per locale with emoji and tag.

### Design adjustments specific to Mots Mêlés
- **Cell states** (tonal, no borders):
  - Default: `surface-container-low` background
  - Hover: `surface-container` 
  - Selected (in progress): `secondary_container` (gold tint — differentiates from found)
  - Invalid selection: brief red tint using `error_container` then resets
  - Found: `primary` background, white text, subtle scale(1.03)
- **Word chip states**: same no-border rule — found state uses `primary_fixed_dim` background (matches MCQ tiles from Culte Familial for visual consistency)
- **Info bar**: `surface-container-lowest` card on `surface-container-low` background — no stroke

---

## 12. Subscription Architecture (Scaffolded, Not Implemented)

The billing system is **not visible or active in Phase 1**, but the architecture must accommodate it without a schema migration later.

### Model

Two tiers:
- **Free** — access to a configurable subset of activities/parcours (admin marks each as `tier: 'free'` or `tier: 'premium'`).
- **Premium** — full access. ~5€/month via Stripe (exact price set by admin). Billed via Stripe Subscriptions.

Guests (no account) are treated as `free` tier.

### What is scaffolded now

| Concern | What to scaffold in Phase 1 |
|---|---|
| DB schema | `tier` column on `parcours` (and future activity tables). `subscription_status`, `subscription_tier`, `stripe_customer_id`, `subscription_ends_at` on `family_profiles`. |
| Access control helper | A `canAccess(user, content)` server-side utility that checks `content.tier` vs `user.subscription_tier`. In Phase 1 it always returns `true` (all content is free). Billing activation = flip this logic without touching call sites. |
| UI gate component | A `<PremiumGate>` React component that wraps locked content. In Phase 1 it renders children unconditionally. Later it shows an upsell modal/paywall. |
| Env vars | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` — declared but unused in Phase 1. |
| Webhook route | `/api/stripe/webhook` — stubbed route (returns 200) so the endpoint exists and Stripe can be pointed at it without code changes later. |

### What is deferred

- Stripe Checkout / Payment Links integration
- Subscription management UI (upgrade, cancel, billing portal)
- Webhook handler logic (activate/deactivate subscription on payment events)
- Admin UI to set price and manage subscription plans
- Free tier content quota definition (which parcours are free vs premium)

### Access control pattern

```ts
// lib/access.ts — scaffolded in Phase 1, logic filled in when billing activates
export function canAccess(
  userTier: 'free' | 'premium',
  contentTier: 'free' | 'premium'
): boolean {
  // Phase 1: all content accessible
  return true
  // Phase 2: return userTier === 'premium' || contentTier === 'free'
}
```

Every quiz page and activity listing calls this helper before rendering. Changing the return value activates the paywall globally.

---

## 13. Out of Scope (Phase 1)

- Coloriage (online coloring) activity
- Push notifications / newsletter system
- Analytics / progress dashboards
- Native mobile app
- Offline mode
- Stripe billing activation (scaffolded but inactive — see Section 12)

---

## 14. Success Criteria

### Culte Familial
- [ ] A family can complete a full 7-step quiz flow as a guest (no account required)
- [ ] Content entered in FR is auto-translated to EN/PT/TH within 30 seconds of save
- [ ] Admin can create, edit, publish, and unpublish a parcours
- [ ] Language selector persists across page refreshes
- [ ] Audio plays at each step transition with correct/wrong jingles on MCQ answers
- [ ] Fully responsive on mobile (320px+), tablet, and desktop (1920px)
- [ ] Impossible question step renders with the inverted dark theme
- [ ] Prayer step renders with the sanctuary visual style
- [ ] Score displayed at end screen

### Mots Mêlés
- [ ] All existing FR/EN/PT/TH puzzles and word bank migrated to Supabase
- [ ] Parcours mode: fixed curated grids load correctly
- [ ] Aléatoire mode: random grid generated from word bank, "Nouvelle Grille" button works
- [ ] Word selection (tap + drag) works on touch and mouse
- [ ] Timer, found-word counter, and score all function as in the current game
- [ ] Audio button plays word pronunciation per chip
- [ ] Admin can create puzzles and edit the word bank
- [ ] Visual style matches "The Illuminated Fable" tokens (no legacy DM Sans / `#19A69C`)
