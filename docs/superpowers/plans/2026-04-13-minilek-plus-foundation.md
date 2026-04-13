# Minilek Plus — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the complete Next.js 14 + Supabase platform at `plus.minilek.com` — project setup, database schema (all tables), auth (admin + family), design system tokens, language i18n, subscription access-control stub, Stripe webhook stub, and home page.

**Architecture:** Next.js 14 App Router with route groups `(public)`, `(admin)`, `(auth)`. Supabase handles DB + Auth + Storage. All content lives in JSONB `translations` fields with per-locale `translation_status`. Admin access is restricted to a single email via middleware against `ADMIN_EMAIL` env var. Family accounts are optional — guests use `sessionStorage`.

**Tech Stack:** Next.js 14, TypeScript 5, Tailwind CSS v3, Supabase JS v2 + `@supabase/ssr`, Jest + React Testing Library, Vercel.

**Spec:** `docs/superpowers/specs/2026-04-13-minilek-culte-familial-design.md`

**This plan is Plan 1 of 3.** Plans 2 (Culte Familial) and 3 (Mots Mêlés) depend on this foundation.

---

## File Map

```
Minilek-app/
  app/
    layout.tsx                          # Root layout: fonts, LanguageProvider
    globals.css                         # Base styles, CSS custom properties
    (public)/
      layout.tsx                        # Public layout: sticky header + LanguageSelector
      page.tsx                          # Home: activity hub grid
    (admin)/
      layout.tsx                        # Admin layout: sidebar nav
      admin/
        login/page.tsx                  # Admin login form
        dashboard/page.tsx              # Admin dashboard shell
        logout/route.ts                 # Sign-out server action
    (auth)/
      auth/
        login/page.tsx                  # Family login
        register/page.tsx               # Family register
        forgot-password/page.tsx        # Password reset request
        callback/route.ts               # Supabase Auth code exchange
  api/
    stripe/
      webhook/route.ts                  # Stubbed — returns 200
  components/
    LanguageSelector.tsx                # Locale switcher (client)
    ActivityCard.tsx                    # Home activity card
    ui/
      Button.tsx                        # Primary/secondary button variants
      PremiumGate.tsx                   # Subscription gate (Phase 1: transparent)
  lib/
    supabase/
      client.ts                         # Browser Supabase client
      server.ts                         # Server Supabase client (cookie-aware)
    i18n/
      context.tsx                       # LanguageContext + useLanguage + LanguageProvider
    access.ts                           # canAccess() stub
  middleware.ts                         # Protect /admin routes
  supabase/
    migrations/
      001_initial_schema.sql            # All tables + RLS + triggers
  .env.local.example
  jest.config.ts
  jest.setup.ts
  __tests__/
    lib/
      access.test.ts
    i18n/
      context.test.tsx
    api/
      stripe-webhook.test.ts
```

---

## Task 1: Bootstrap Next.js Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts` (scaffolded by create-next-app)
- Create: `jest.config.ts`
- Create: `jest.setup.ts`

- [ ] **Step 1: Scaffold Next.js 14 app**

Run from `/Users/piyanatlekyai/Desktop/Minilek/Minilek-app/`:

```bash
npx create-next-app@14 . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --yes
```

Expected: project files created. Confirm `app/` directory exists.

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install @supabase/ssr @supabase/supabase-js
```

- [ ] **Step 3: Install dev/test dependencies**

```bash
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event ts-node
```

- [ ] **Step 4: Create jest.config.ts**

```ts
// jest.config.ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default createJestConfig(config)
```

- [ ] **Step 5: Create jest.setup.ts**

```ts
// jest.setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Verify tests run (no tests yet — just confirm config works)**

```bash
npx jest --passWithNoTests
```

Expected output: `Test Suites: 0 passed` (no failures).

- [ ] **Step 7: Create .env.local.example**

```bash
# .env.local.example — copy to .env.local and fill in values
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=sk-ant-...
ADMIN_EMAIL=your-admin@email.com
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

- [ ] **Step 8: Commit**

```bash
git init
git add .
git commit -m "feat: bootstrap Next.js 14 project with Supabase and test setup"
```

---

## Task 2: Supabase Project + Database Schema

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`

- [ ] **Step 1: Create Supabase project**

Go to [supabase.com/dashboard](https://supabase.com/dashboard) → New Project.
- Name: `minilek-plus`
- Password: generate strong password, save it
- Region: choose closest to your users

After creation, copy from Project Settings → API:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

Add these to `.env.local` (do NOT commit `.env.local`).

- [ ] **Step 2: Create migration file**

Create `supabase/migrations/001_initial_schema.sql`:

```sql
-- 001_initial_schema.sql

-- =====================
-- PARCOURS (Culte Familial)
-- =====================
create table parcours (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  translations  jsonb not null default '{}'::jsonb,
  image_url     text,
  audio_urls    jsonb not null default '{}'::jsonb,
  tags          text[] not null default '{}',
  difficulty    text not null default 'debutant'
                check (difficulty in ('debutant', 'intermediaire', 'avance')),
  tier          text not null default 'free'
                check (tier in ('free', 'premium')),
  published     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =====================
-- QUESTIONS (Culte Familial)
-- =====================
create table questions (
  id            uuid primary key default gen_random_uuid(),
  parcours_id   uuid not null references parcours(id) on delete cascade,
  type          text not null check (type in ('facile', 'moyenne', 'impossible', 'parents')),
  order_index   integer not null,
  translations  jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  unique(parcours_id, order_index)
);

-- =====================
-- WORD SEARCH PUZZLES (Mots Mêlés)
-- =====================
create table word_search_puzzles (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  mode          text not null default 'parcours'
                check (mode in ('parcours', 'aleatoire')),
  translations  jsonb not null default '{}'::jsonb,
  tags          text[] not null default '{}',
  tier          text not null default 'free'
                check (tier in ('free', 'premium')),
  published     boolean not null default false,
  order_index   integer not null default 0,
  created_at    timestamptz not null default now()
);

-- =====================
-- WORD SEARCH WORD BANK (aléatoire mode)
-- =====================
create table word_search_word_bank (
  id          uuid primary key default gen_random_uuid(),
  locale      text not null check (locale in ('fr', 'en', 'pt', 'th')),
  word        text not null,
  emoji       text,
  audio_url   text,
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now(),
  unique(locale, word)
);

-- =====================
-- FAMILY PROFILES
-- =====================
create table family_profiles (
  id                    uuid primary key references auth.users(id) on delete cascade,
  display_name          text,
  stripe_customer_id    text unique,
  subscription_status   text not null default 'free'
                        check (subscription_status in ('free', 'active', 'past_due', 'canceled')),
  subscription_tier     text not null default 'free'
                        check (subscription_tier in ('free', 'premium')),
  subscription_ends_at  timestamptz,
  created_at            timestamptz not null default now()
);

-- =====================
-- PROGRESS SESSIONS
-- =====================
create table progress_sessions (
  id            uuid primary key default gen_random_uuid(),
  family_id     uuid references family_profiles(id) on delete set null,
  activity_type text not null check (activity_type in ('culte-familial', 'mots-meles')),
  content_id    uuid not null,
  current_step  integer not null default 0,
  answers       jsonb not null default '{}'::jsonb,
  score         integer not null default 0,
  completed_at  timestamptz,
  created_at    timestamptz not null default now()
);

-- =====================
-- TRIGGER: auto-update parcours.updated_at
-- =====================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger parcours_updated_at
  before update on parcours
  for each row execute function update_updated_at();

-- =====================
-- TRIGGER: auto-create family_profiles on user registration
-- =====================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.family_profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =====================
-- ROW LEVEL SECURITY
-- =====================
alter table parcours enable row level security;
alter table questions enable row level security;
alter table word_search_puzzles enable row level security;
alter table word_search_word_bank enable row level security;
alter table family_profiles enable row level security;
alter table progress_sessions enable row level security;

-- parcours: public reads published rows; service_role bypasses RLS for admin writes
create policy "public read published parcours"
  on parcours for select using (published = true);

-- questions: public reads questions whose parcours is published
create policy "public read questions of published parcours"
  on questions for select
  using (
    exists (
      select 1 from parcours p
      where p.id = questions.parcours_id and p.published = true
    )
  );

-- word_search_puzzles: public reads published
create policy "public read published puzzles"
  on word_search_puzzles for select using (published = true);

-- word_search_word_bank: public reads all (needed for aléatoire mode)
create policy "public read word bank"
  on word_search_word_bank for select using (true);

-- family_profiles: users own their row
create policy "users read own profile"
  on family_profiles for select using (auth.uid() = id);

create policy "users update own profile"
  on family_profiles for update using (auth.uid() = id);

-- progress_sessions: users own their sessions; anyone can insert (supports guests)
create policy "users read own sessions"
  on progress_sessions for select
  using (family_id = auth.uid() or family_id is null);

create policy "anyone insert session"
  on progress_sessions for insert with check (true);

create policy "users update own sessions"
  on progress_sessions for update using (family_id = auth.uid());
```

- [ ] **Step 3: Apply migration via Supabase SQL editor**

In Supabase dashboard → SQL Editor → New query.
Paste the full contents of `001_initial_schema.sql` and run.

Expected: "Success. No rows returned." for each statement.

- [ ] **Step 4: Verify tables in Supabase dashboard**

In Supabase dashboard → Table Editor, confirm these tables exist:
- `parcours`
- `questions`
- `word_search_puzzles`
- `word_search_word_bank`
- `family_profiles`
- `progress_sessions`

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/001_initial_schema.sql
git commit -m "feat: add initial Supabase schema with all tables and RLS"
```

---

## Task 3: Supabase Client Setup

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`

- [ ] **Step 1: Create browser client**

```ts
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 2: Create server client**

```ts
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from a Server Component — cookies can't be set.
            // Middleware handles session refresh.
          }
        },
      },
    }
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/supabase/
git commit -m "feat: add Supabase browser and server clients"
```

---

## Task 4: Middleware (Admin Route Protection)

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Create middleware**

```ts
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — do NOT remove this
  const { data: { user } } = await supabase.auth.getUser()

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login')

  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    if (user.email !== process.env.ADMIN_EMAIL) {
      // Authenticated but not the admin — sign out and redirect
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/admin/:path*',
    // Exclude static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
```

- [ ] **Step 2: Verify middleware loads without error**

```bash
npm run dev
```

Visit `http://localhost:3000/admin/dashboard` — should redirect to `/admin/login` (404 is fine since the page doesn't exist yet; the redirect behavior confirms middleware works).

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat: add middleware to protect /admin routes by email"
```

---

## Task 5: Tailwind Design Tokens

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Update tailwind.config.ts**

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006a60',
          container: '#3ecdbb',
          'fixed-dim': '#57dbc9',
        },
        secondary: {
          DEFAULT: '#795900',
          container: '#ffdea4',
        },
        surface: {
          DEFAULT: '#fbf9f8',
          bright: '#fbf9f8',
          'container-lowest': '#ffffff',
          'container-low': '#f5f3f2',
          container: '#efe9e8',
          'container-high': '#e9e3e2',
        },
        'on-surface': '#1b1c1c',
        'on-primary': '#ffffff',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#261900',
        'inverse-surface': '#2f3030',
        'inverse-on-surface': '#f2f0ef',
        'inverse-primary': '#3ecdbb',
        'outline-variant': '#bec9c7',
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      boxShadow: {
        ambient: '0 20px 40px rgba(27, 28, 28, 0.06)',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #006a60, #3ecdbb)',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Update app/globals.css**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    /* Use body font as default */
    font-family: var(--font-body), system-ui, sans-serif;
    background-color: #fbf9f8;
    color: #1b1c1c;
  }

  /* Display font utility */
  .font-display {
    font-family: var(--font-display), sans-serif;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: add Illuminated Fable design tokens to Tailwind"
```

---

## Task 6: Root Layout + Fonts + LanguageProvider

**Files:**
- Create: `lib/i18n/context.tsx`
- Modify: `app/layout.tsx`
- Create: `__tests__/i18n/context.test.tsx`

- [ ] **Step 1: Write failing test for LanguageProvider**

```tsx
// __tests__/i18n/context.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageProvider, useLanguage } from '@/lib/i18n/context'

function TestConsumer() {
  const { locale, setLocale } = useLanguage()
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <button onClick={() => setLocale('en')}>Switch to EN</button>
    </div>
  )
}

describe('LanguageProvider', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to fr', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    )
    expect(screen.getByTestId('locale').textContent).toBe('fr')
  })

  it('updates locale on setLocale', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    )
    fireEvent.click(screen.getByText('Switch to EN'))
    expect(screen.getByTestId('locale').textContent).toBe('en')
  })

  it('persists locale to localStorage', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    )
    fireEvent.click(screen.getByText('Switch to EN'))
    expect(localStorage.getItem('minilek_locale')).toBe('en')
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx jest __tests__/i18n/context.test.tsx --no-coverage
```

Expected: FAIL — `Cannot find module '@/lib/i18n/context'`

- [ ] **Step 3: Create lib/i18n/context.tsx**

```tsx
// lib/i18n/context.tsx
'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'

export type Locale = 'fr' | 'en' | 'pt' | 'th'

const VALID_LOCALES: Locale[] = ['fr', 'en', 'pt', 'th']
const STORAGE_KEY = 'minilek_locale'

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: 'fr',
  setLocale: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (saved && VALID_LOCALES.includes(saved)) {
      setLocaleState(saved)
    }
  }, [])

  function setLocale(l: Locale) {
    setLocaleState(l)
    localStorage.setItem(STORAGE_KEY, l)
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx jest __tests__/i18n/context.test.tsx --no-coverage
```

Expected: PASS — 3 tests.

- [ ] **Step 5: Update app/layout.tsx**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Lexend } from 'next/font/google'
import { LanguageProvider } from '@/lib/i18n/context'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Minilek Plus',
  description: 'Activités bibliques pour la famille',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${plusJakartaSans.variable} ${lexend.variable}`}>
      <body className="font-body bg-surface text-on-surface antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add lib/i18n/ app/layout.tsx __tests__/i18n/
git commit -m "feat: add LanguageProvider with localStorage persistence"
```

---

## Task 7: Access Control Stub + PremiumGate

**Files:**
- Create: `lib/access.ts`
- Create: `components/ui/PremiumGate.tsx`
- Create: `__tests__/lib/access.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// __tests__/lib/access.test.ts
import { canAccess } from '@/lib/access'

describe('canAccess — Phase 1 (all content accessible)', () => {
  it('allows free user to access free content', () => {
    expect(canAccess('free', 'free')).toBe(true)
  })

  it('allows free user to access premium content in Phase 1', () => {
    expect(canAccess('free', 'premium')).toBe(true)
  })

  it('allows premium user to access premium content', () => {
    expect(canAccess('premium', 'premium')).toBe(true)
  })

  it('allows premium user to access free content', () => {
    expect(canAccess('premium', 'free')).toBe(true)
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx jest __tests__/lib/access.test.ts --no-coverage
```

Expected: FAIL — `Cannot find module '@/lib/access'`

- [ ] **Step 3: Create lib/access.ts**

```ts
// lib/access.ts
export type Tier = 'free' | 'premium'

/**
 * Phase 1: always returns true — all content is accessible.
 *
 * To activate billing in Phase 2, replace with:
 *   return userTier === 'premium' || contentTier === 'free'
 *
 * Every quiz page and activity listing should call this before rendering.
 * Changing the return value activates the paywall globally.
 */
export function canAccess(_userTier: Tier, _contentTier: Tier): boolean {
  return true
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx jest __tests__/lib/access.test.ts --no-coverage
```

Expected: PASS — 4 tests.

- [ ] **Step 5: Create components/ui/PremiumGate.tsx**

```tsx
// components/ui/PremiumGate.tsx
// Phase 1: renders children unconditionally.
// Phase 2: show upsell modal when canAccess() returns false.

import type { ReactNode } from 'react'

interface PremiumGateProps {
  children: ReactNode
}

export function PremiumGate({ children }: PremiumGateProps) {
  return <>{children}</>
}
```

- [ ] **Step 6: Commit**

```bash
git add lib/access.ts components/ui/PremiumGate.tsx __tests__/lib/access.test.ts
git commit -m "feat: add canAccess stub and PremiumGate component (Phase 1: transparent)"
```

---

## Task 8: Stripe Webhook Stub

**Files:**
- Create: `app/api/stripe/webhook/route.ts`
- Create: `__tests__/api/stripe-webhook.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// __tests__/api/stripe-webhook.test.ts
import { POST } from '@/app/api/stripe/webhook/route'

describe('POST /api/stripe/webhook', () => {
  it('returns 200 with { received: true }', async () => {
    const request = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({ received: true })
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx jest __tests__/api/stripe-webhook.test.ts --no-coverage
```

Expected: FAIL — `Cannot find module '@/app/api/stripe/webhook/route'`

- [ ] **Step 3: Create the stubbed route**

```ts
// app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server'

// Stubbed in Phase 1 — endpoint exists so Stripe can be pointed at it without code changes.
// Phase 2: verify Stripe-Signature header and process subscription lifecycle events
// (customer.subscription.updated, customer.subscription.deleted, etc.).
export async function POST() {
  return NextResponse.json({ received: true })
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx jest __tests__/api/stripe-webhook.test.ts --no-coverage
```

Expected: PASS — 1 test.

- [ ] **Step 5: Commit**

```bash
git add app/api/stripe/ __tests__/api/
git commit -m "feat: stub Stripe webhook endpoint (Phase 1: returns 200)"
```

---

## Task 9: LanguageSelector Component

**Files:**
- Create: `components/LanguageSelector.tsx`

- [ ] **Step 1: Create LanguageSelector**

```tsx
// components/LanguageSelector.tsx
'use client'

import { useLanguage, type Locale } from '@/lib/i18n/context'

const LOCALES: { value: Locale; label: string }[] = [
  { value: 'fr', label: '🇫🇷 FR' },
  { value: 'en', label: '🇬🇧 EN' },
  { value: 'pt', label: '🇧🇷 PT' },
  { value: 'th', label: '🇹🇭 TH' },
]

export function LanguageSelector() {
  const { locale, setLocale } = useLanguage()

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      aria-label="Changer de langue"
      className="bg-surface-container-low rounded-lg px-3 py-1.5 font-body text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary cursor-pointer"
    >
      {LOCALES.map((l) => (
        <option key={l.value} value={l.value}>
          {l.label}
        </option>
      ))}
    </select>
  )
}
```

- [ ] **Step 2: Create public layout with sticky header**

```tsx
// app/(public)/layout.tsx
import { LanguageSelector } from '@/components/LanguageSelector'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <span className="font-display font-bold text-primary text-lg">Minilek+</span>
        <LanguageSelector />
      </header>
      {children}
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/LanguageSelector.tsx app/(public)/layout.tsx
git commit -m "feat: add LanguageSelector and public layout with sticky header"
```

---

## Task 10: Home Page (Activity Hub)

**Files:**
- Create: `app/(public)/page.tsx`
- Create: `components/ActivityCard.tsx`

- [ ] **Step 1: Create ActivityCard component**

```tsx
// components/ActivityCard.tsx
import Link from 'next/link'

interface ActivityCardProps {
  href: string
  icon: string
  title: string
  description: string
  available?: boolean
}

export function ActivityCard({
  href,
  icon,
  title,
  description,
  available = true,
}: ActivityCardProps) {
  if (!available) {
    return (
      <div className="bg-surface-container-lowest rounded-[2rem] p-6 opacity-40">
        <div className="text-4xl mb-4">{icon}</div>
        <h2 className="font-display text-xl font-bold text-on-surface mb-1">{title}</h2>
        <p className="font-body text-sm text-on-surface/60">{description}</p>
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="block bg-surface-container-lowest rounded-[2rem] p-6 shadow-ambient hover:bg-surface-container-low transition-colors group"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="font-display text-xl font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">
        {title}
      </h2>
      <p className="font-body text-sm text-on-surface/60">{description}</p>
    </Link>
  )
}
```

- [ ] **Step 2: Create home page**

```tsx
// app/(public)/page.tsx
// Note: locale-aware titles are handled client-side via LanguageProvider.
// Server render uses French as default; client hydration applies saved locale.
// Full locale-aware rendering is implemented in Plan 2 (Culte Familial).

import { ActivityCard } from '@/components/ActivityCard'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-on-surface mb-2">
          Minilek Plus
        </h1>
        <p className="font-body text-on-surface/60 mb-12">
          Activités bibliques pour la famille
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ActivityCard
            href="/culte-familial"
            icon="✝️"
            title="Culte Familial"
            description="Quiz biblique interactif en famille"
          />
          <ActivityCard
            href="/mots-meles"
            icon="🔎"
            title="Mots Mêlés"
            description="Mots cachés bibliques"
          />
          <ActivityCard
            href="/coloriage"
            icon="🎨"
            title="Coloriage"
            description="Bientôt disponible"
            available={false}
          />
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Start dev server and verify home page renders**

```bash
npm run dev
```

Visit `http://localhost:3000`. You should see:
- Sticky header with "Minilek+" and language selector
- 3 activity cards: Culte Familial, Mots Mêlés (both linked), Coloriage (dimmed)
- Clicking the language selector updates the stored locale

- [ ] **Step 4: Commit**

```bash
git add components/ActivityCard.tsx app/(public)/page.tsx
git commit -m "feat: add activity hub home page with ActivityCard grid"
```

---

## Task 11: Auth Pages

**Files:**
- Create: `app/(admin)/layout.tsx`
- Create: `app/(admin)/admin/login/page.tsx`
- Create: `app/(admin)/admin/dashboard/page.tsx`
- Create: `app/(admin)/admin/logout/route.ts`
- Create: `app/(auth)/auth/login/page.tsx`
- Create: `app/(auth)/auth/register/page.tsx`
- Create: `app/(auth)/auth/forgot-password/page.tsx`
- Create: `app/(auth)/auth/callback/route.ts`

- [ ] **Step 1: Create shared auth form input component**

This is used across all auth pages to avoid repetition:

```tsx
// components/ui/AuthInput.tsx
interface AuthInputProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  required?: boolean
}

export function AuthInput({ id, label, type = 'text', value, onChange, required }: AuthInputProps) {
  return (
    <div>
      <label htmlFor={id} className="font-body text-sm text-on-surface/60 block mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-lg bg-surface-container-low px-4 py-2.5 font-body text-on-surface outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  )
}
```

- [ ] **Step 2: Create admin layout (no nav in Phase 1 — nav added in Plan 2)**

```tsx
// app/(admin)/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-container-low">
      {children}
    </div>
  )
}
```

- [ ] **Step 3: Create admin login page**

```tsx
// app/(admin)/admin/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AuthInput } from '@/components/ui/AuthInput'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-[2rem] p-8 shadow-ambient">
        <h1 className="font-display text-2xl font-bold text-on-surface mb-6">Admin</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput id="email" label="Email" type="email" value={email} onChange={setEmail} required />
          <AuthInput id="password" label="Mot de passe" type="password" value={password} onChange={setPassword} required />

          {error && (
            <p className="font-body text-sm text-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[2rem] py-3 font-display font-semibold text-on-primary bg-primary-gradient disabled:opacity-60"
          >
            {loading ? 'Connexion…' : 'Connexion'}
          </button>
        </form>

        <a
          href="/admin/forgot-password"
          className="block text-center mt-4 font-body text-sm text-primary"
        >
          Mot de passe oublié ?
        </a>
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Create admin dashboard shell**

```tsx
// app/(admin)/admin/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/admin/login')
  }

  return (
    <main className="p-8">
      <h1 className="font-display text-2xl font-bold text-on-surface mb-2">Dashboard</h1>
      <p className="font-body text-on-surface/60">
        Bienvenue, {user.email}. La gestion du contenu sera disponible dans la prochaine version.
      </p>
    </main>
  )
}
```

- [ ] **Step 5: Create admin logout route**

```ts
// app/(admin)/admin/logout/route.ts
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function POST() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
```

- [ ] **Step 6: Create family login page**

```tsx
// app/(auth)/auth/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AuthInput } from '@/components/ui/AuthInput'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-[2rem] p-8 shadow-ambient">
        <h1 className="font-display text-2xl font-bold text-on-surface mb-6">Connexion</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput id="email" label="Email" type="email" value={email} onChange={setEmail} required />
          <AuthInput id="password" label="Mot de passe" type="password" value={password} onChange={setPassword} required />

          {error && <p className="font-body text-sm text-error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[2rem] py-3 font-display font-semibold text-on-primary bg-primary-gradient disabled:opacity-60"
          >
            {loading ? 'Connexion…' : 'Connexion'}
          </button>
        </form>

        <div className="mt-4 flex flex-col gap-2 text-center">
          <a href="/auth/forgot-password" className="font-body text-sm text-primary">
            Mot de passe oublié ?
          </a>
          <a href="/auth/register" className="font-body text-sm text-on-surface/60">
            Créer un compte famille
          </a>
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 7: Create family register page**

```tsx
// app/(auth)/auth/register/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AuthInput } from '@/components/ui/AuthInput'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // family_profiles row is auto-created by DB trigger on_auth_user_created
    router.push('/?registered=true')
    router.refresh()
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-[2rem] p-8 shadow-ambient">
        <h1 className="font-display text-2xl font-bold text-on-surface mb-6">
          Compte famille
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput id="name" label="Nom de famille" value={displayName} onChange={setDisplayName} required />
          <AuthInput id="email" label="Email" type="email" value={email} onChange={setEmail} required />
          <AuthInput id="password" label="Mot de passe" type="password" value={password} onChange={setPassword} required />

          {error && <p className="font-body text-sm text-error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[2rem] py-3 font-display font-semibold text-on-primary bg-primary-gradient disabled:opacity-60"
          >
            {loading ? 'Création…' : 'Créer le compte'}
          </button>
        </form>

        <a href="/auth/login" className="block text-center mt-4 font-body text-sm text-on-surface/60">
          Déjà un compte ? Connexion
        </a>
      </div>
    </main>
  )
}
```

- [ ] **Step 8: Create forgot-password page**

```tsx
// app/(auth)/auth/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AuthInput } from '@/components/ui/AuthInput'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/auth/update-password`,
    })

    if (error) {
      setError(error.message)
      return
    }

    setSent(true)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-[2rem] p-8 shadow-ambient">
        <h1 className="font-display text-2xl font-bold text-on-surface mb-6">
          Mot de passe oublié
        </h1>

        {sent ? (
          <p className="font-body text-on-surface/60">
            Un email de réinitialisation a été envoyé à <strong>{email}</strong>.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput id="email" label="Email" type="email" value={email} onChange={setEmail} required />

            {error && <p className="font-body text-sm text-error">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-[2rem] py-3 font-display font-semibold text-on-primary bg-primary-gradient"
            >
              Envoyer le lien
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
```

- [ ] **Step 9: Create auth callback route (Supabase code exchange)**

```ts
// app/(auth)/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return user to error page on failure
  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`)
}
```

- [ ] **Step 10: Verify auth flow works**

```bash
npm run dev
```

1. Visit `http://localhost:3000/auth/register` — fill in form and submit
2. Check Supabase dashboard → Authentication → Users — new user should appear
3. Check Supabase dashboard → Table Editor → `family_profiles` — row should be auto-created by trigger
4. Visit `http://localhost:3000/auth/forgot-password` — submit email, confirm you receive the email

- [ ] **Step 11: Commit**

```bash
git add app/(admin)/ app/(auth)/ components/ui/AuthInput.tsx
git commit -m "feat: add admin and family auth pages with Supabase Auth"
```

---

## Task 12: Run All Tests + Final Checks

- [ ] **Step 1: Run the full test suite**

```bash
npx jest --no-coverage
```

Expected:
```
Test Suites: 3 passed, 3 total
Tests:       8 passed, 8 total
```

(3 suites: `access.test.ts`, `context.test.tsx`, `stripe-webhook.test.ts`)

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: build completes with no TypeScript errors. Ignore any `generateStaticParams` warnings for dynamic routes — those are expected at this stage.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve any build issues from final check"
```

---

## Task 13: Vercel Deployment

- [ ] **Step 1: Push repo to GitHub**

Create a new GitHub repo (e.g., `minilek-plus`) and push:

```bash
git remote add origin https://github.com/<your-username>/minilek-plus.git
git branch -M main
git push -u origin main
```

- [ ] **Step 2: Connect to Vercel**

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub → select `minilek-plus`
2. Framework preset: Next.js (auto-detected)
3. Build command: `npm run build` (default)
4. Output directory: `.next` (default)

- [ ] **Step 3: Add environment variables in Vercel**

In Vercel project → Settings → Environment Variables, add all variables from `.env.local.example`:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | your Supabase service role key |
| `ANTHROPIC_API_KEY` | your Claude API key |
| `ADMIN_EMAIL` | your admin email (the one you registered in Supabase Auth) |
| `STRIPE_SECRET_KEY` | `sk_test_placeholder` (unused in Phase 1) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_placeholder` (unused in Phase 1) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_placeholder` (unused in Phase 1) |

- [ ] **Step 4: Configure custom domain**

In Vercel project → Settings → Domains → Add `plus.minilek.com`.
In your DNS provider, add a CNAME record: `plus` → `cname.vercel-dns.com`

- [ ] **Step 5: Trigger deployment and verify**

```bash
git push
```

Wait for Vercel build to complete. Visit `https://plus.minilek.com`:
- Home page loads with 3 activity cards
- Language selector is visible and functional
- `/admin/login` renders correctly
- `/admin/dashboard` redirects to `/admin/login` (not yet logged in)

- [ ] **Step 6: Register admin account in Supabase**

In Supabase dashboard → Authentication → Users → Invite User.
Enter the email address matching `ADMIN_EMAIL` env var. Set a strong password.

**Test admin login:**
1. Visit `https://plus.minilek.com/admin/login`
2. Log in with admin credentials
3. Should reach `/admin/dashboard`
4. Visit with a different email → should redirect to `/` (not admin)

- [ ] **Step 7: Final commit**

```bash
git add .
git commit -m "chore: foundation complete — deployed to plus.minilek.com"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Covered |
|---|---|
| Next.js 14 App Router | ✅ Task 1 |
| Supabase DB (all tables) | ✅ Task 2 |
| Supabase client browser + server | ✅ Task 3 |
| Middleware admin protection by email | ✅ Task 4 |
| Tailwind design tokens (The Illuminated Fable) | ✅ Task 5 |
| Plus Jakarta Sans + Lexend fonts | ✅ Task 6 |
| LanguageProvider + localStorage | ✅ Task 6 |
| canAccess() stub | ✅ Task 7 |
| PremiumGate stub | ✅ Task 7 |
| Stripe webhook stub | ✅ Task 8 |
| LanguageSelector in header | ✅ Task 9 |
| Home page activity hub | ✅ Task 10 |
| Admin login + logout + dashboard | ✅ Task 11 |
| Family login + register + forgot-password | ✅ Task 11 |
| Supabase Auth callback route | ✅ Task 11 |
| family_profiles auto-created on register (DB trigger) | ✅ Task 2 (SQL trigger) |
| RLS policies | ✅ Task 2 |
| Subscription fields scaffolded on family_profiles | ✅ Task 2 |
| tier field on parcours + word_search_puzzles | ✅ Task 2 |
| Vercel deployment + custom domain | ✅ Task 13 |
| .env.local.example with all variables | ✅ Task 1 |

**Not in this plan (deferred to Plan 2 + 3):**
- Culte Familial quiz flow, admin content editor, translation pipeline, seed data
- Mots Mêlés game component, word bank migration, puzzle editor
- Admin sidebar nav (added in Plan 2 when content sections exist)
