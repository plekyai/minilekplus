# Culte Familial — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full 7-step family quiz experience (Culte Familial) with admin back-office and Claude API auto-translation.

**Architecture:** Next.js App Router public quiz shell (`/culte-familial/[slug]`) driven by a `useReducer` state machine; admin CRUD pages use server actions with service-role Supabase client. Translation pipeline: admin saves FR content → Next.js API route calls Supabase Edge Function → Edge Function calls Claude API → writes EN/PT/TH back to JSONB.

**Tech Stack:** Next.js 14 App Router, Supabase (PostgreSQL + Auth + Storage), Tailwind CSS (Illuminated Fable tokens), Claude API `claude-sonnet-4-6`, TypeScript

---

## File Map

| File | Purpose |
|---|---|
| `types/quiz.ts` | Shared TS interfaces: Parcours, Question, QuizStep, QuizSessionState |
| `lib/supabase/admin.ts` | Service-role Supabase client (server-only) |
| `lib/supabase/queries/parcours.ts` | Server-side data fetchers |
| `lib/i18n/quiz-labels.ts` | UI strings for all 4 locales |
| `hooks/useAudio.ts` | Audio playback hook (background music + jingles) |
| `hooks/useQuizSession.ts` | Session state + sessionStorage persistence |
| `app/(public)/culte-familial/page.tsx` | Parcours list page |
| `components/quiz/StoryStep.tsx` | Step 1: story display |
| `components/quiz/MCQStep.tsx` | Steps 2-4: A/B/C/D MCQ tiles |
| `components/quiz/ParentsStep.tsx` | Step 5: open parents question |
| `components/quiz/PrayerStep.tsx` | Step 6: prayer display |
| `components/quiz/EndStep.tsx` | Step 7: score + encouragement |
| `app/(public)/culte-familial/[parcours_slug]/page.tsx` | Quiz shell (state machine) |
| `lib/supabase/admin.ts` | Service-role client for admin writes |
| `app/(admin)/admin/parcours/page.tsx` | Admin parcours list |
| `app/(admin)/admin/parcours/actions.ts` | Server actions: create/update/delete parcours |
| `components/admin/ParcoursForm.tsx` | Create/edit parcours metadata form |
| `components/admin/QuestionsEditor.tsx` | Questions CRUD client component |
| `app/(admin)/admin/parcours/[id]/questions/actions.ts` | Server actions: create/update/delete questions |
| `components/admin/TranslationPanel.tsx` | Side-by-side translation UI |
| `app/(admin)/admin/parcours/new/page.tsx` | Admin create parcours page |
| `app/(admin)/admin/parcours/[id]/page.tsx` | Admin edit parcours (form + questions + translations) |
| `app/api/translate/route.ts` | API route: triggers Edge Function |
| `supabase/functions/translate-content/index.ts` | Edge Function: Claude API translation |
| `supabase/migrations/002_seed_la_piece_retrouvee.sql` | Seed: first parcours + 16 questions |
| `__tests__/hooks/useAudio.test.ts` | Tests for useAudio |
| `__tests__/hooks/useQuizSession.test.ts` | Tests for useQuizSession |
| `__tests__/components/MCQStep.test.tsx` | Tests for MCQStep |

---

### Task 1: Quiz types + DB queries + admin Supabase client

**Files:**
- Create: `types/quiz.ts`
- Create: `lib/supabase/queries/parcours.ts`
- Create: `lib/supabase/admin.ts`

- [ ] **Step 1: Write the types**

```ts
// types/quiz.ts
export type Locale = 'fr' | 'en' | 'pt' | 'th'
export type TranslationStatus = 'source' | 'ai' | 'verified'
export type QuizStep = 'story' | 'facile' | 'moyenne' | 'impossible' | 'parents' | 'priere' | 'fin'
export const QUIZ_STEP_ORDER: QuizStep[] = ['story', 'facile', 'moyenne', 'impossible', 'parents', 'priere', 'fin']

export interface ParcoursTranslation {
  title: string
  story_text: string
  prayer_text: string
  translation_status: TranslationStatus
}

export interface AudioUrls {
  generique?: string
  facile?: string
  moyenne?: string
  difficile?: string
  parents?: string
  priere?: string
  correct?: string
  wrong?: string
}

export interface Parcours {
  id: string
  slug: string
  translations: Partial<Record<Locale, ParcoursTranslation>>
  image_url: string | null
  audio_urls: AudioUrls
  tags: string[]
  difficulty: 'debutant' | 'intermediaire' | 'avance'
  tier: 'free' | 'premium'
  published: boolean
  created_at: string
  updated_at: string
}

export interface QuestionTranslation {
  question: string
  choices: [string, string, string, string] | null
  correct_index: number | null
  explanation: string | null
  translation_status: TranslationStatus
}

export interface Question {
  id: string
  parcours_id: string
  type: 'facile' | 'moyenne' | 'impossible' | 'parents'
  order_index: number
  translations: Partial<Record<Locale, QuestionTranslation>>
  created_at: string
}

export interface QuizSessionState {
  parcours_id: string
  step: QuizStep
  question_index: number
  answers: Record<string, number>
  score: number
  completed_at: string | null
}
```

- [ ] **Step 2: Write admin Supabase client (service-role)**

```ts
// lib/supabase/admin.ts
// WARNING: server-only — never import from client components
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
```

- [ ] **Step 3: Write server-side data fetchers**

```ts
// lib/supabase/queries/parcours.ts
import { createClient } from '@/lib/supabase/server'
import type { Parcours, Question } from '@/types/quiz'

export async function getPublishedParcours(): Promise<Parcours[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('parcours')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data as Parcours[]
}

export async function getParcoursWithQuestions(
  slug: string
): Promise<{ parcours: Parcours; questions: Question[] } | null> {
  const supabase = await createClient()
  const { data: parcours, error: pe } = await supabase
    .from('parcours')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  if (pe || !parcours) return null

  const { data: questions, error: qe } = await supabase
    .from('questions')
    .select('*')
    .eq('parcours_id', parcours.id)
    .order('order_index', { ascending: true })
  if (qe) throw qe

  return { parcours: parcours as Parcours, questions: questions as Question[] }
}

export async function getAllParcoursAdmin(): Promise<Parcours[]> {
  // used server-side in admin pages — bypasses RLS via server client with service role
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('parcours')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Parcours[]
}

export async function getParcoursById(id: string): Promise<Parcours | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('parcours')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data as Parcours
}

export async function getQuestionsByParcoursId(parcoursId: string): Promise<Question[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('parcours_id', parcoursId)
    .order('order_index', { ascending: true })
  if (error) throw error
  return data as Question[]
}
```

- [ ] **Step 4: Commit**

```bash
git add types/quiz.ts lib/supabase/admin.ts lib/supabase/queries/parcours.ts
git commit -m "feat: quiz types, admin supabase client, parcours query helpers"
```

---

### Task 2: i18n quiz labels

**Files:**
- Create: `lib/i18n/quiz-labels.ts`

- [ ] **Step 1: Write quiz labels for all 4 locales**

```ts
// lib/i18n/quiz-labels.ts
import type { Locale } from '@/types/quiz'

export interface QuizLabels {
  start: string
  next: string
  checkAnswer: string
  correct: string
  incorrect: string
  parentsQuestion: string
  prayerTitle: string
  yourScore: string
  outOf: string
  scoreMessages: { min: number; max: number; message: string }[]
  nextStory: string
  backToList: string
  muteAudio: string
  unmuteAudio: string
  questionOf: (current: number, total: number) => string
  easyQuestions: string
  mediumQuestions: string
  hardQuestions: string
  writeYourAnswer: string
  continueBtn: string
}

const labels: Record<Locale, QuizLabels> = {
  fr: {
    start: 'On commence !',
    next: 'Suivant',
    checkAnswer: 'Valider',
    correct: 'Bonne réponse !',
    incorrect: 'Pas tout à fait…',
    parentsQuestion: 'Question des parents',
    prayerTitle: 'Prière',
    yourScore: 'Votre score',
    outOf: 'sur',
    scoreMessages: [
      { min: 0, max: 4, message: 'Continue à chercher !' },
      { min: 5, max: 9, message: 'Bien joué !' },
      { min: 10, max: 13, message: 'Excellent !' },
    ],
    nextStory: 'Histoire suivante',
    backToList: 'Toutes les histoires',
    muteAudio: 'Couper le son',
    unmuteAudio: 'Activer le son',
    questionOf: (c, t) => `Question ${c} sur ${t}`,
    easyQuestions: 'Questions faciles',
    mediumQuestions: 'Questions moyennes',
    hardQuestions: 'Questions impossibles',
    writeYourAnswer: 'Écrivez votre réponse…',
    continueBtn: 'Continuer',
  },
  en: {
    start: "Let's go!",
    next: 'Next',
    checkAnswer: 'Submit',
    correct: 'Correct!',
    incorrect: 'Not quite…',
    parentsQuestion: "Parents' question",
    prayerTitle: 'Prayer',
    yourScore: 'Your score',
    outOf: 'out of',
    scoreMessages: [
      { min: 0, max: 4, message: 'Keep searching!' },
      { min: 5, max: 9, message: 'Well done!' },
      { min: 10, max: 13, message: 'Excellent!' },
    ],
    nextStory: 'Next story',
    backToList: 'All stories',
    muteAudio: 'Mute audio',
    unmuteAudio: 'Unmute audio',
    questionOf: (c, t) => `Question ${c} of ${t}`,
    easyQuestions: 'Easy questions',
    mediumQuestions: 'Medium questions',
    hardQuestions: 'Impossible questions',
    writeYourAnswer: 'Write your answer…',
    continueBtn: 'Continue',
  },
  pt: {
    start: 'Vamos começar!',
    next: 'Próximo',
    checkAnswer: 'Confirmar',
    correct: 'Correto!',
    incorrect: 'Não exatamente…',
    parentsQuestion: 'Pergunta dos pais',
    prayerTitle: 'Oração',
    yourScore: 'Sua pontuação',
    outOf: 'de',
    scoreMessages: [
      { min: 0, max: 4, message: 'Continue procurando!' },
      { min: 5, max: 9, message: 'Muito bem!' },
      { min: 10, max: 13, message: 'Excelente!' },
    ],
    nextStory: 'Próxima história',
    backToList: 'Todas as histórias',
    muteAudio: 'Silenciar áudio',
    unmuteAudio: 'Ativar áudio',
    questionOf: (c, t) => `Pergunta ${c} de ${t}`,
    easyQuestions: 'Perguntas fáceis',
    mediumQuestions: 'Perguntas médias',
    hardQuestions: 'Perguntas impossíveis',
    writeYourAnswer: 'Escreva sua resposta…',
    continueBtn: 'Continuar',
  },
  th: {
    start: 'เริ่มเลย!',
    next: 'ถัดไป',
    checkAnswer: 'ยืนยัน',
    correct: 'ถูกต้อง!',
    incorrect: 'ไม่ค่อยถูก…',
    parentsQuestion: 'คำถามสำหรับผู้ปกครอง',
    prayerTitle: 'คำอธิษฐาน',
    yourScore: 'คะแนนของคุณ',
    outOf: 'จาก',
    scoreMessages: [
      { min: 0, max: 4, message: 'ลองค้นหาต่อไป!' },
      { min: 5, max: 9, message: 'เก่งมาก!' },
      { min: 10, max: 13, message: 'ยอดเยี่ยม!' },
    ],
    nextStory: 'เรื่องถัดไป',
    backToList: 'ทุกเรื่อง',
    muteAudio: 'ปิดเสียง',
    unmuteAudio: 'เปิดเสียง',
    questionOf: (c, t) => `คำถามที่ ${c} จาก ${t}`,
    easyQuestions: 'คำถามง่าย',
    mediumQuestions: 'คำถามปานกลาง',
    hardQuestions: 'คำถามที่เป็นไปไม่ได้',
    writeYourAnswer: 'เขียนคำตอบของคุณ…',
    continueBtn: 'ดำเนินการต่อ',
  },
}

export function getQuizLabels(locale: Locale): QuizLabels {
  return labels[locale] ?? labels.fr
}

export function getScoreMessage(score: number, locale: Locale): string {
  const msgs = labels[locale]?.scoreMessages ?? labels.fr.scoreMessages
  return msgs.find(m => score >= m.min && score <= m.max)?.message ?? msgs[msgs.length - 1].message
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/i18n/quiz-labels.ts
git commit -m "feat: i18n quiz labels for FR/EN/PT/TH"
```

---

### Task 3: useAudio hook + tests

**Files:**
- Create: `hooks/useAudio.ts`
- Create: `__tests__/hooks/useAudio.test.ts`

- [ ] **Step 1: Write the hook**

```ts
// hooks/useAudio.ts
'use client'
import { useRef, useState, useCallback, useEffect } from 'react'
import type { AudioUrls } from '@/types/quiz'

export type AudioKey = keyof AudioUrls

export function useAudio(audioUrls: AudioUrls | null) {
  const [muted, setMuted] = useState(false)
  const bgRef = useRef<HTMLAudioElement | null>(null)
  const cache = useRef<Partial<Record<AudioKey, HTMLAudioElement>>>({})

  const getAudio = useCallback(
    (key: AudioKey): HTMLAudioElement | null => {
      const url = audioUrls?.[key]
      if (!url) return null
      if (!cache.current[key]) {
        cache.current[key] = new Audio(url)
      }
      return cache.current[key]!
    },
    [audioUrls]
  )

  const playBackground = useCallback(
    (key: AudioKey) => {
      if (bgRef.current) {
        bgRef.current.pause()
        bgRef.current.currentTime = 0
      }
      const audio = getAudio(key)
      if (!audio) return
      audio.loop = true
      audio.volume = muted ? 0 : 0.4
      audio.play().catch(() => {})
      bgRef.current = audio
    },
    [getAudio, muted]
  )

  const playOnce = useCallback(
    (key: AudioKey) => {
      const audio = getAudio(key)
      if (!audio) return
      audio.currentTime = 0
      audio.volume = muted ? 0 : 1
      audio.play().catch(() => {})
    },
    [getAudio, muted]
  )

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev
      if (bgRef.current) bgRef.current.volume = next ? 0 : 0.4
      return next
    })
  }, [])

  useEffect(() => {
    return () => {
      bgRef.current?.pause()
    }
  }, [])

  return { muted, playBackground, playOnce, toggleMute }
}
```

- [ ] **Step 2: Write failing tests**

```ts
// __tests__/hooks/useAudio.test.ts
import { renderHook, act } from '@testing-library/react'
import { useAudio } from '@/hooks/useAudio'

const mockPlay = jest.fn().mockResolvedValue(undefined)
const mockPause = jest.fn()

class MockAudio {
  src: string
  loop = false
  volume = 1
  currentTime = 0
  play = mockPlay
  pause = mockPause
  constructor(src: string) { this.src = src }
}

beforeEach(() => {
  jest.clearAllMocks()
  // @ts-expect-error mocking browser API
  global.Audio = MockAudio
})

const audioUrls = {
  generique: 'https://example.com/generique.mp3',
  correct: 'https://example.com/correct.mp3',
}

test('starts unmuted', () => {
  const { result } = renderHook(() => useAudio(audioUrls))
  expect(result.current.muted).toBe(false)
})

test('toggleMute flips muted state', () => {
  const { result } = renderHook(() => useAudio(audioUrls))
  act(() => { result.current.toggleMute() })
  expect(result.current.muted).toBe(true)
  act(() => { result.current.toggleMute() })
  expect(result.current.muted).toBe(false)
})

test('playBackground calls audio.play()', () => {
  const { result } = renderHook(() => useAudio(audioUrls))
  act(() => { result.current.playBackground('generique') })
  expect(mockPlay).toHaveBeenCalledTimes(1)
})

test('playOnce calls audio.play()', () => {
  const { result } = renderHook(() => useAudio(audioUrls))
  act(() => { result.current.playOnce('correct') })
  expect(mockPlay).toHaveBeenCalledTimes(1)
})

test('playBackground with null audioUrls does not throw', () => {
  const { result } = renderHook(() => useAudio(null))
  expect(() => {
    act(() => { result.current.playBackground('generique') })
  }).not.toThrow()
})
```

- [ ] **Step 3: Run tests — expect FAIL**

```bash
npx jest __tests__/hooks/useAudio.test.ts --no-coverage
```

Expected: FAIL — `Cannot find module '@/hooks/useAudio'`

- [ ] **Step 4: Run tests again — expect PASS**

```bash
npx jest __tests__/hooks/useAudio.test.ts --no-coverage
```

Expected: 5 tests passing

- [ ] **Step 5: Commit**

```bash
git add hooks/useAudio.ts __tests__/hooks/useAudio.test.ts
git commit -m "feat: useAudio hook with mute toggle and background/jingle playback"
```

---

### Task 4: useQuizSession hook + tests

**Files:**
- Create: `hooks/useQuizSession.ts`
- Create: `__tests__/hooks/useQuizSession.test.ts`

- [ ] **Step 1: Write the hook**

```ts
// hooks/useQuizSession.ts
'use client'
import { useState, useCallback, useEffect } from 'react'
import type { QuizStep, QuizSessionState } from '@/types/quiz'
import { QUIZ_STEP_ORDER } from '@/types/quiz'

const STORAGE_KEY = 'minilek_quiz_session'

function initialState(parcoursId: string): QuizSessionState {
  return {
    parcours_id: parcoursId,
    step: 'story',
    question_index: 0,
    answers: {},
    score: 0,
    completed_at: null,
  }
}

function loadFromStorage(parcoursId: string): QuizSessionState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState(parcoursId)
    const parsed: QuizSessionState = JSON.parse(raw)
    if (parsed.parcours_id !== parcoursId) return initialState(parcoursId)
    return parsed
  } catch {
    return initialState(parcoursId)
  }
}

export function useQuizSession(parcoursId: string) {
  const [session, setSession] = useState<QuizSessionState>(() =>
    initialState(parcoursId)
  )
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from sessionStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setSession(loadFromStorage(parcoursId))
    setHydrated(true)
  }, [parcoursId])

  // Persist to sessionStorage on every change
  useEffect(() => {
    if (!hydrated) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } catch {}
  }, [session, hydrated])

  const answer = useCallback(
    (questionId: string, choiceIndex: number, isCorrect: boolean) => {
      setSession(prev => ({
        ...prev,
        answers: { ...prev.answers, [questionId]: choiceIndex },
        score: isCorrect ? prev.score + 1 : prev.score,
      }))
    },
    []
  )

  const nextQuestion = useCallback(() => {
    setSession(prev => ({ ...prev, question_index: prev.question_index + 1 }))
  }, [])

  const goToStep = useCallback((step: QuizStep) => {
    setSession(prev => ({ ...prev, step, question_index: 0 }))
  }, [])

  const nextStep = useCallback(() => {
    setSession(prev => {
      const idx = QUIZ_STEP_ORDER.indexOf(prev.step)
      const next = QUIZ_STEP_ORDER[idx + 1] ?? 'fin'
      const completed_at = next === 'fin' ? new Date().toISOString() : prev.completed_at
      return { ...prev, step: next, question_index: 0, completed_at }
    })
  }, [])

  const reset = useCallback(() => {
    const fresh = initialState(parcoursId)
    setSession(fresh)
    try { sessionStorage.removeItem(STORAGE_KEY) } catch {}
  }, [parcoursId])

  return { session, hydrated, answer, nextQuestion, goToStep, nextStep, reset }
}
```

- [ ] **Step 2: Write failing tests**

```ts
// __tests__/hooks/useQuizSession.test.ts
import { renderHook, act } from '@testing-library/react'
import { useQuizSession } from '@/hooks/useQuizSession'

const PARCOURS_ID = 'test-parcours-123'

beforeEach(() => {
  sessionStorage.clear()
})

test('initialises at story step with zero score', () => {
  const { result } = renderHook(() => useQuizSession(PARCOURS_ID))
  expect(result.current.session.step).toBe('story')
  expect(result.current.session.score).toBe(0)
})

test('answer increments score on correct answer', () => {
  const { result } = renderHook(() => useQuizSession(PARCOURS_ID))
  act(() => { result.current.answer('q1', 2, true) })
  expect(result.current.session.score).toBe(1)
  expect(result.current.session.answers['q1']).toBe(2)
})

test('answer does not increment score on wrong answer', () => {
  const { result } = renderHook(() => useQuizSession(PARCOURS_ID))
  act(() => { result.current.answer('q1', 1, false) })
  expect(result.current.session.score).toBe(0)
})

test('nextStep advances from story to facile', () => {
  const { result } = renderHook(() => useQuizSession(PARCOURS_ID))
  act(() => { result.current.nextStep() })
  expect(result.current.session.step).toBe('facile')
})

test('nextStep advances through all steps to fin', () => {
  const { result } = renderHook(() => useQuizSession(PARCOURS_ID))
  const steps = ['facile', 'moyenne', 'impossible', 'parents', 'priere', 'fin']
  for (const expected of steps) {
    act(() => { result.current.nextStep() })
    expect(result.current.session.step).toBe(expected)
  }
})

test('reset restores initial state', () => {
  const { result } = renderHook(() => useQuizSession(PARCOURS_ID))
  act(() => { result.current.answer('q1', 0, true) })
  act(() => { result.current.nextStep() })
  act(() => { result.current.reset() })
  expect(result.current.session.step).toBe('story')
  expect(result.current.session.score).toBe(0)
  expect(result.current.session.answers).toEqual({})
})

test('persists to sessionStorage', async () => {
  const { result } = renderHook(() => useQuizSession(PARCOURS_ID))
  act(() => { result.current.answer('q1', 0, true) })
  // allow useEffect to run
  await act(async () => {})
  const stored = JSON.parse(sessionStorage.getItem('minilek_quiz_session') ?? '{}')
  expect(stored.score).toBe(1)
})
```

- [ ] **Step 3: Run tests — expect FAIL**

```bash
npx jest __tests__/hooks/useQuizSession.test.ts --no-coverage
```

Expected: FAIL — `Cannot find module '@/hooks/useQuizSession'`

- [ ] **Step 4: Run tests again — expect PASS**

```bash
npx jest __tests__/hooks/useQuizSession.test.ts --no-coverage
```

Expected: 7 tests passing

- [ ] **Step 5: Commit**

```bash
git add hooks/useQuizSession.ts __tests__/hooks/useQuizSession.test.ts
git commit -m "feat: useQuizSession hook with sessionStorage persistence"
```

---

### Task 5: Parcours list page

**Files:**
- Create: `app/(public)/culte-familial/page.tsx`

- [ ] **Step 1: Write the parcours list page**

```tsx
// app/(public)/culte-familial/page.tsx
import Link from 'next/link'
import { getPublishedParcours } from '@/lib/supabase/queries/parcours'
import type { Locale, Parcours } from '@/types/quiz'

// Difficulty badge colours
const DIFFICULTY_STYLES: Record<string, string> = {
  debutant: 'bg-primary/10 text-primary',
  intermediaire: 'bg-secondary/10 text-secondary',
  avance: 'bg-error/10 text-error',
}

const DIFFICULTY_LABELS: Record<string, string> = {
  debutant: 'Débutant',
  intermediaire: 'Intermédiaire',
  avance: 'Avancé',
}

function ParcoursCard({ parcours }: { parcours: Parcours }) {
  const t = parcours.translations.fr
  return (
    <Link
      href={`/culte-familial/${parcours.slug}`}
      className="group block bg-surface-container-lowest rounded-[2rem] shadow-ambient p-6 hover:shadow-lg transition-shadow"
    >
      {parcours.image_url && (
        <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-4 bg-surface-container-low">
          <img
            src={parcours.image_url}
            alt={t?.title ?? ''}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-display text-lg font-bold text-on-surface leading-snug">
          {t?.title ?? '—'}
        </h2>
        <span
          className={`shrink-0 text-xs font-body font-semibold px-2 py-1 rounded-full ${
            DIFFICULTY_STYLES[parcours.difficulty] ?? ''
          }`}
        >
          {DIFFICULTY_LABELS[parcours.difficulty] ?? parcours.difficulty}
        </span>
      </div>
      {parcours.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {parcours.tags.map(tag => (
            <span
              key={tag}
              className="text-xs font-body text-on-surface/50 bg-surface-container-low px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}

export default async function CulteFamilialPage() {
  let parcoursList: Parcours[] = []
  try {
    parcoursList = await getPublishedParcours()
  } catch {
    // Supabase not configured yet — show empty state
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 sm:py-16">
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-on-surface mb-2">
        Culte Familial
      </h1>
      <p className="font-body text-on-surface/60 mb-10">
        Des histoires bibliques interactives pour toute la famille.
      </p>

      {parcoursList.length === 0 ? (
        <p className="font-body text-on-surface/40 text-center py-20">
          Aucun parcours disponible pour le moment.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {parcoursList.map(p => (
            <ParcoursCard key={p.id} parcours={p} />
          ))}
        </div>
      )}
    </main>
  )
}
```

- [ ] **Step 2: Verify page renders at `/culte-familial`**

Run: `npm run build`
Expected: BUILD successful, no errors

- [ ] **Step 3: Commit**

```bash
git add app/\(public\)/culte-familial/page.tsx
git commit -m "feat: culte familial parcours list page"
```

---

### Task 6: StoryStep + PrayerStep components

**Files:**
- Create: `components/quiz/StoryStep.tsx`
- Create: `components/quiz/PrayerStep.tsx`

- [ ] **Step 1: Write StoryStep**

```tsx
// components/quiz/StoryStep.tsx
import type { Locale, Parcours } from '@/types/quiz'
import type { QuizLabels } from '@/lib/i18n/quiz-labels'

interface StoryStepProps {
  parcours: Parcours
  locale: Locale
  labels: QuizLabels
  onStart: () => void
}

export function StoryStep({ parcours, locale, labels, onStart }: StoryStepProps) {
  const t = parcours.translations[locale] ?? parcours.translations.fr
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">
      {parcours.image_url && (
        <div className="w-full aspect-[16/9] rounded-[2rem] overflow-hidden shadow-ambient">
          <img
            src={parcours.image_url}
            alt={t?.title ?? ''}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-[2rem] p-6 sm:p-8 shadow-ambient">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface mb-6">
          {t?.title}
        </h1>
        <div className="font-body text-on-surface/80 leading-relaxed whitespace-pre-wrap text-base sm:text-lg">
          {t?.story_text}
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full sm:w-auto sm:mx-auto rounded-[2rem] px-10 py-4 font-display font-semibold text-on-primary bg-primary-gradient text-lg shadow-ambient"
      >
        {labels.start}
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Write PrayerStep**

```tsx
// components/quiz/PrayerStep.tsx
import type { Locale, Parcours } from '@/types/quiz'
import type { QuizLabels } from '@/lib/i18n/quiz-labels'

interface PrayerStepProps {
  parcours: Parcours
  locale: Locale
  labels: QuizLabels
  onNext: () => void
}

export function PrayerStep({ parcours, locale, labels, onNext }: PrayerStepProps) {
  const t = parcours.translations[locale] ?? parcours.translations.fr
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-surface-container-lowest rounded-[3rem] p-8 sm:p-12 shadow-ambient text-center">
        <div className="text-4xl mb-4">🕯️</div>
        <h2 className="font-display text-xl font-bold text-on-surface mb-6">
          {labels.prayerTitle}
        </h2>
        <p className="font-body text-on-surface/80 leading-loose text-base sm:text-lg italic">
          {t?.prayer_text}
        </p>
        <button
          onClick={onNext}
          className="mt-8 rounded-[2rem] px-8 py-3 font-display font-semibold text-on-primary bg-primary-gradient shadow-ambient"
        >
          {labels.continueBtn}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/quiz/StoryStep.tsx components/quiz/PrayerStep.tsx
git commit -m "feat: StoryStep and PrayerStep components"
```

---

### Task 7: MCQStep component + tests

**Files:**
- Create: `components/quiz/MCQStep.tsx`
- Create: `__tests__/components/MCQStep.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// __tests__/components/MCQStep.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MCQStep } from '@/components/quiz/MCQStep'
import type { Question } from '@/types/quiz'
import { getQuizLabels } from '@/lib/i18n/quiz-labels'

const labels = getQuizLabels('fr')

const question: Question = {
  id: 'q1',
  parcours_id: 'p1',
  type: 'facile',
  order_index: 0,
  translations: {
    fr: {
      question: 'Combien de pièces possédait-elle ?',
      choices: ['5 pièces', '7 pièces', '10 pièces', '12 pièces'],
      correct_index: 2,
      explanation: 'Elle avait 10 pièces.',
      translation_status: 'source',
    },
  },
  created_at: '2026-01-01T00:00:00Z',
}

const mockOnAnswer = jest.fn()

beforeEach(() => { mockOnAnswer.mockClear() })

test('renders question text', () => {
  render(
    <MCQStep
      questions={[question]}
      currentIndex={0}
      locale="fr"
      onAnswer={mockOnAnswer}
      labels={labels}
    />
  )
  expect(screen.getByText('Combien de pièces possédait-elle ?')).toBeInTheDocument()
})

test('renders 4 choices', () => {
  render(
    <MCQStep
      questions={[question]}
      currentIndex={0}
      locale="fr"
      onAnswer={mockOnAnswer}
      labels={labels}
    />
  )
  expect(screen.getByText('5 pièces')).toBeInTheDocument()
  expect(screen.getByText('10 pièces')).toBeInTheDocument()
})

test('clicking a choice calls onAnswer', () => {
  render(
    <MCQStep
      questions={[question]}
      currentIndex={0}
      locale="fr"
      onAnswer={mockOnAnswer}
      labels={labels}
    />
  )
  fireEvent.click(screen.getByText('10 pièces'))
  expect(mockOnAnswer).toHaveBeenCalledWith('q1', 2, true)
})

test('clicking wrong choice calls onAnswer with isCorrect=false', () => {
  render(
    <MCQStep
      questions={[question]}
      currentIndex={0}
      locale="fr"
      onAnswer={mockOnAnswer}
      labels={labels}
    />
  )
  fireEvent.click(screen.getByText('5 pièces'))
  expect(mockOnAnswer).toHaveBeenCalledWith('q1', 0, false)
})

test('shows progress indicator', () => {
  render(
    <MCQStep
      questions={[question, question]}
      currentIndex={0}
      locale="fr"
      onAnswer={mockOnAnswer}
      labels={labels}
    />
  )
  expect(screen.getByText('Question 1 sur 2')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx jest __tests__/components/MCQStep.test.tsx --no-coverage
```

Expected: FAIL — `Cannot find module '@/components/quiz/MCQStep'`

- [ ] **Step 3: Write MCQStep**

```tsx
// components/quiz/MCQStep.tsx
'use client'
import { useState } from 'react'
import type { Locale, Question } from '@/types/quiz'
import type { QuizLabels } from '@/lib/i18n/quiz-labels'

const CHOICE_LABELS = ['A', 'B', 'C', 'D']

interface MCQStepProps {
  questions: Question[]
  currentIndex: number
  locale: Locale
  onAnswer: (questionId: string, choiceIndex: number, isCorrect: boolean) => void
  labels: QuizLabels
  inverted?: boolean  // true for 'impossible' step dark theme
}

export function MCQStep({
  questions,
  currentIndex,
  locale,
  onAnswer,
  labels,
  inverted = false,
}: MCQStepProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const question = questions[currentIndex]
  const t = question?.translations[locale] ?? question?.translations.fr
  if (!question || !t) return null

  function handleChoice(idx: number) {
    if (revealed) return
    const isCorrect = idx === t!.correct_index
    setSelected(idx)
    setRevealed(true)
    // Brief delay so user sees feedback before parent advances
    setTimeout(() => {
      onAnswer(question.id, idx, isCorrect)
      setSelected(null)
      setRevealed(false)
    }, 900)
  }

  const containerClass = inverted
    ? 'min-h-[60vh] flex flex-col px-4 py-8 bg-inverse-surface'
    : 'min-h-[60vh] flex flex-col px-4 py-8'

  const textClass = inverted ? 'text-inverse-primary' : 'text-on-surface'
  const subTextClass = inverted ? 'text-inverse-primary/60' : 'text-on-surface/60'

  function choiceTileClass(idx: number) {
    const base =
      'w-full text-left rounded-2xl px-5 py-4 font-body text-base transition-all duration-150 flex items-center gap-3'
    if (!revealed) {
      return inverted
        ? `${base} bg-white/10 text-inverse-primary hover:bg-white/20`
        : `${base} bg-surface-container-low text-on-surface hover:bg-surface-container`
    }
    if (idx === t!.correct_index) {
      return `${base} bg-primary text-on-primary scale-[1.02]`
    }
    if (idx === selected) {
      return `${base} bg-error/20 text-error`
    }
    return inverted
      ? `${base} bg-white/5 text-inverse-primary/40`
      : `${base} bg-surface-container-low text-on-surface/40`
  }

  return (
    <div className={containerClass}>
      <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
        {/* Progress */}
        <p className={`font-body text-sm ${subTextClass}`}>
          {labels.questionOf(currentIndex + 1, questions.length)}
        </p>

        {/* Question */}
        <h2 className={`font-display text-xl sm:text-2xl font-bold ${textClass} leading-snug`}>
          {t.question}
        </h2>

        {/* Choices */}
        <div className="flex flex-col gap-3">
          {(t.choices ?? []).map((choice, idx) => (
            <button
              key={idx}
              onClick={() => handleChoice(idx)}
              disabled={revealed}
              className={choiceTileClass(idx)}
            >
              <span
                className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-display font-bold ${
                  inverted ? 'bg-white/20' : 'bg-surface-container'
                }`}
              >
                {CHOICE_LABELS[idx]}
              </span>
              {choice}
            </button>
          ))}
        </div>

        {/* Explanation (shown after answer) */}
        {revealed && t.explanation && (
          <p className={`font-body text-sm ${subTextClass} italic mt-2`}>
            {t.explanation}
          </p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx jest __tests__/components/MCQStep.test.tsx --no-coverage
```

Expected: 5 tests passing

- [ ] **Step 5: Commit**

```bash
git add components/quiz/MCQStep.tsx __tests__/components/MCQStep.test.tsx
git commit -m "feat: MCQStep component with A/B/C/D tiles, feedback state, impossible inverted theme"
```

---

### Task 8: ParentsStep + EndStep components

**Files:**
- Create: `components/quiz/ParentsStep.tsx`
- Create: `components/quiz/EndStep.tsx`

- [ ] **Step 1: Write ParentsStep**

```tsx
// components/quiz/ParentsStep.tsx
'use client'
import { useState } from 'react'
import type { Locale, Question } from '@/types/quiz'
import type { QuizLabels } from '@/lib/i18n/quiz-labels'

interface ParentsStepProps {
  questions: Question[]
  currentIndex: number
  locale: Locale
  labels: QuizLabels
  onNext: (questionId: string) => void
}

export function ParentsStep({ questions, currentIndex, locale, labels, onNext }: ParentsStepProps) {
  const [text, setText] = useState('')
  const question = questions[currentIndex]
  const t = question?.translations[locale] ?? question?.translations.fr
  if (!question || !t) return null

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full flex flex-col gap-6">
        <div className="text-center">
          <div className="text-4xl mb-3">👑</div>
          <p className="font-body text-sm text-on-surface/50 mb-1">
            {labels.parentsQuestion} — {labels.questionOf(currentIndex + 1, questions.length)}
          </p>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-on-surface leading-snug">
            {t.question}
          </h2>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={labels.writeYourAnswer}
          rows={4}
          className="w-full rounded-2xl bg-surface-container-low px-4 py-3 font-body text-on-surface placeholder:text-on-surface/30 resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
        />

        <button
          onClick={() => onNext(question.id)}
          className="w-full rounded-[2rem] py-3 font-display font-semibold text-on-primary bg-primary-gradient shadow-ambient"
        >
          {labels.continueBtn}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write EndStep**

```tsx
// components/quiz/EndStep.tsx
import Link from 'next/link'
import type { Locale } from '@/types/quiz'
import type { QuizLabels } from '@/lib/i18n/quiz-labels'
import { getScoreMessage } from '@/lib/i18n/quiz-labels'

interface EndStepProps {
  score: number
  totalMCQ: number
  locale: Locale
  labels: QuizLabels
  onReset: () => void
}

export function EndStep({ score, totalMCQ, locale, labels, onReset }: EndStepProps) {
  const message = getScoreMessage(score, locale)
  const pct = totalMCQ > 0 ? Math.round((score / totalMCQ) * 100) : 0

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-sm w-full bg-surface-container-lowest rounded-[2rem] p-8 shadow-ambient text-center flex flex-col gap-6">
        <div className="text-5xl">🏆</div>

        <div>
          <p className="font-body text-sm text-on-surface/50 mb-1">{labels.yourScore}</p>
          <p className="font-display text-5xl font-bold text-primary">
            {score}
            <span className="text-2xl text-on-surface/40 font-normal">
              {' '}{labels.outOf} {totalMCQ}
            </span>
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-gradient rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>

        <p className="font-display text-xl font-bold text-on-surface">{message}</p>

        <div className="flex flex-col gap-3">
          <Link
            href="/culte-familial"
            className="w-full rounded-[2rem] py-3 font-display font-semibold text-on-primary bg-primary-gradient text-center shadow-ambient"
          >
            {labels.nextStory}
          </Link>
          <button
            onClick={onReset}
            className="w-full rounded-[2rem] py-3 font-display font-semibold text-primary bg-surface-container-low"
          >
            {labels.backToList}
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/quiz/ParentsStep.tsx components/quiz/EndStep.tsx
git commit -m "feat: ParentsStep and EndStep components"
```

---

### Task 9: Quiz shell page (state machine)

**Files:**
- Create: `app/(public)/culte-familial/[parcours_slug]/page.tsx`

- [ ] **Step 1: Write the quiz shell**

```tsx
// app/(public)/culte-familial/[parcours_slug]/page.tsx
import { notFound } from 'next/navigation'
import { getParcoursWithQuestions } from '@/lib/supabase/queries/parcours'
import { QuizShell } from '@/components/quiz/QuizShell'

interface Props {
  params: { parcours_slug: string }
}

export default async function QuizPage({ params }: Props) {
  const data = await getParcoursWithQuestions(params.parcours_slug).catch(() => null)
  if (!data) notFound()
  return <QuizShell parcours={data.parcours} questions={data.questions} />
}
```

- [ ] **Step 2: Write the client QuizShell component**

Create: `components/quiz/QuizShell.tsx`

```tsx
// components/quiz/QuizShell.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import type { Locale, Parcours, Question } from '@/types/quiz'
import { useLanguage } from '@/lib/i18n/context'
import { getQuizLabels } from '@/lib/i18n/quiz-labels'
import { useAudio } from '@/hooks/useAudio'
import { useQuizSession } from '@/hooks/useQuizSession'
import { StoryStep } from '@/components/quiz/StoryStep'
import { MCQStep } from '@/components/quiz/MCQStep'
import { ParentsStep } from '@/components/quiz/ParentsStep'
import { PrayerStep } from '@/components/quiz/PrayerStep'
import { EndStep } from '@/components/quiz/EndStep'

// Map quiz step → audio track key
const STEP_AUDIO: Record<string, string> = {
  story: 'generique',
  facile: 'facile',
  moyenne: 'moyenne',
  impossible: 'difficile',
  parents: 'parents',
  priere: 'priere',
}

interface QuizShellProps {
  parcours: Parcours
  questions: Question[]
}

export function QuizShell({ parcours, questions }: QuizShellProps) {
  const { locale } = useLanguage()
  const labels = getQuizLabels(locale as Locale)
  const { muted, playBackground, playOnce, toggleMute } = useAudio(parcours.audio_urls)
  const { session, hydrated, answer, nextQuestion, nextStep, reset } = useQuizSession(parcours.id)

  // Group questions by type
  const byType = (type: string) => questions.filter(q => q.type === type)
  const facileQs = byType('facile')
  const moyenneQs = byType('moyenne')
  const impossibleQs = byType('impossible')
  const parentsQs = byType('parents')
  const totalMCQ = facileQs.length + moyenneQs.length + impossibleQs.length

  // Play audio when step changes
  useEffect(() => {
    const key = STEP_AUDIO[session.step]
    if (key) playBackground(key as any)
  }, [session.step]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleMCQAnswer(questionId: string, choiceIndex: number, isCorrect: boolean) {
    answer(questionId, choiceIndex, isCorrect)
    playOnce(isCorrect ? 'correct' : 'wrong')

    // Get current step's questions
    const stepQs =
      session.step === 'facile' ? facileQs
      : session.step === 'moyenne' ? moyenneQs
      : impossibleQs

    setTimeout(() => {
      if (session.question_index + 1 < stepQs.length) {
        nextQuestion()
      } else {
        nextStep()
      }
    }, 950)
  }

  function handleParentsNext(questionId: string) {
    if (session.question_index + 1 < parentsQs.length) {
      nextQuestion()
    } else {
      nextStep()
    }
  }

  if (!hydrated) return null  // avoid SSR/sessionStorage mismatch flash

  const { step, question_index } = session

  return (
    <div className="relative min-h-screen">
      {/* Mute button */}
      <button
        onClick={toggleMute}
        className="fixed top-20 right-4 z-50 w-10 h-10 rounded-full bg-surface-container-lowest shadow-ambient flex items-center justify-center text-lg"
        aria-label={muted ? labels.unmuteAudio : labels.muteAudio}
      >
        {muted ? '🔇' : '🔊'}
      </button>

      {step === 'story' && (
        <StoryStep
          parcours={parcours}
          locale={locale as Locale}
          labels={labels}
          onStart={nextStep}
        />
      )}

      {step === 'facile' && facileQs.length > 0 && (
        <MCQStep
          questions={facileQs}
          currentIndex={question_index}
          locale={locale as Locale}
          labels={labels}
          onAnswer={handleMCQAnswer}
        />
      )}

      {step === 'moyenne' && moyenneQs.length > 0 && (
        <MCQStep
          questions={moyenneQs}
          currentIndex={question_index}
          locale={locale as Locale}
          labels={labels}
          onAnswer={handleMCQAnswer}
        />
      )}

      {step === 'impossible' && impossibleQs.length > 0 && (
        <div className="min-h-screen bg-inverse-surface">
          <MCQStep
            questions={impossibleQs}
            currentIndex={question_index}
            locale={locale as Locale}
            labels={labels}
            onAnswer={handleMCQAnswer}
            inverted
          />
        </div>
      )}

      {step === 'parents' && parentsQs.length > 0 && (
        <ParentsStep
          questions={parentsQs}
          currentIndex={question_index}
          locale={locale as Locale}
          labels={labels}
          onNext={handleParentsNext}
        />
      )}

      {step === 'priere' && (
        <PrayerStep
          parcours={parcours}
          locale={locale as Locale}
          labels={labels}
          onNext={nextStep}
        />
      )}

      {step === 'fin' && (
        <EndStep
          score={session.score}
          totalMCQ={totalMCQ}
          locale={locale as Locale}
          labels={labels}
          onReset={reset}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: BUILD successful

- [ ] **Step 4: Commit**

```bash
git add app/\(public\)/culte-familial/\[parcours_slug\]/page.tsx components/quiz/QuizShell.tsx
git commit -m "feat: quiz shell page with 7-step state machine and audio integration"
```

---

### Task 10: Admin parcours list page

**Files:**
- Create: `app/(admin)/admin/parcours/page.tsx`

- [ ] **Step 1: Write the admin parcours list**

```tsx
// app/(admin)/admin/parcours/page.tsx
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Parcours } from '@/types/quiz'

async function getAllParcours(): Promise<Parcours[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('parcours')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Parcours[]
}

export default async function AdminParcoursPage() {
  let parcoursList: Parcours[] = []
  try {
    parcoursList = await getAllParcours()
  } catch {}

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-on-surface">Parcours</h1>
        <Link
          href="/admin/parcours/new"
          className="rounded-[2rem] px-5 py-2 font-display font-semibold text-on-primary bg-primary-gradient text-sm shadow-ambient"
        >
          + Nouveau
        </Link>
      </div>

      {parcoursList.length === 0 ? (
        <p className="font-body text-on-surface/40 text-center py-20">
          Aucun parcours. Créez-en un !
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {parcoursList.map(p => {
            const title = p.translations.fr?.title ?? p.slug
            return (
              <div
                key={p.id}
                className="flex items-center justify-between bg-surface-container-lowest rounded-2xl px-5 py-4 shadow-ambient"
              >
                <div>
                  <p className="font-display font-semibold text-on-surface">{title}</p>
                  <p className="font-body text-xs text-on-surface/40 mt-0.5">
                    /{p.slug} · {p.difficulty} · {p.tier}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-body font-semibold px-2 py-1 rounded-full ${
                      p.published
                        ? 'bg-primary/10 text-primary'
                        : 'bg-surface-container text-on-surface/40'
                    }`}
                  >
                    {p.published ? 'Publié' : 'Brouillon'}
                  </span>
                  <Link
                    href={`/admin/parcours/${p.id}`}
                    className="font-body text-sm text-primary hover:underline"
                  >
                    Modifier
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Update admin dashboard to link to parcours**

Read `app/(admin)/admin/dashboard/page.tsx`, add a link to `/admin/parcours`:

```tsx
// In the dashboard page body, add:
<Link
  href="/admin/parcours"
  className="block bg-surface-container-lowest rounded-2xl p-6 shadow-ambient hover:shadow-lg transition-shadow"
>
  <h2 className="font-display text-lg font-bold text-on-surface">Culte Familial</h2>
  <p className="font-body text-sm text-on-surface/60 mt-1">Gérer les parcours et questions</p>
</Link>
```

- [ ] **Step 3: Commit**

```bash
git add app/\(admin\)/admin/parcours/page.tsx app/\(admin\)/admin/dashboard/page.tsx
git commit -m "feat: admin parcours list page with link from dashboard"
```

---

### Task 11: Admin ParcoursForm + server actions

**Files:**
- Create: `app/(admin)/admin/parcours/actions.ts`
- Create: `components/admin/ParcoursForm.tsx`
- Create: `app/(admin)/admin/parcours/new/page.tsx`

- [ ] **Step 1: Write server actions**

```ts
// app/(admin)/admin/parcours/actions.ts
'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createParcours(formData: FormData) {
  const supabase = createAdminClient()
  const title = formData.get('title') as string
  const story_text = formData.get('story_text') as string
  const prayer_text = formData.get('prayer_text') as string
  const slug = (formData.get('slug') as string).toLowerCase().replace(/\s+/g, '-')
  const image_url = formData.get('image_url') as string | null
  const difficulty = formData.get('difficulty') as string
  const tier = formData.get('tier') as string
  const published = formData.get('published') === 'on'
  const tagsRaw = formData.get('tags') as string
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : []

  // Audio URLs
  const audio_urls: Record<string, string> = {}
  for (const key of ['generique', 'facile', 'moyenne', 'difficile', 'parents', 'priere', 'correct', 'wrong']) {
    const val = formData.get(`audio_${key}`) as string
    if (val) audio_urls[key] = val
  }

  const translations = {
    fr: { title, story_text, prayer_text, translation_status: 'source' },
  }

  const { data, error } = await supabase
    .from('parcours')
    .insert({ slug, translations, image_url: image_url || null, audio_urls, tags, difficulty, tier, published })
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/admin/parcours')
  redirect(`/admin/parcours/${data.id}`)
}

export async function updateParcours(id: string, formData: FormData) {
  const supabase = createAdminClient()

  // Fetch current translations to preserve EN/PT/TH
  const { data: current } = await supabase
    .from('parcours')
    .select('translations')
    .eq('id', id)
    .single()

  const title = formData.get('title') as string
  const story_text = formData.get('story_text') as string
  const prayer_text = formData.get('prayer_text') as string
  const published = formData.get('published') === 'on'
  const tagsRaw = formData.get('tags') as string
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : []
  const image_url = formData.get('image_url') as string | null
  const difficulty = formData.get('difficulty') as string
  const tier = formData.get('tier') as string

  const audio_urls: Record<string, string> = {}
  for (const key of ['generique', 'facile', 'moyenne', 'difficile', 'parents', 'priere', 'correct', 'wrong']) {
    const val = formData.get(`audio_${key}`) as string
    if (val) audio_urls[key] = val
  }

  const translations = {
    ...(current?.translations ?? {}),
    fr: { title, story_text, prayer_text, translation_status: 'source' },
  }

  const { error } = await supabase
    .from('parcours')
    .update({ translations, image_url: image_url || null, audio_urls, tags, difficulty, tier, published })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/parcours')
  revalidatePath(`/admin/parcours/${id}`)
}

export async function deleteParcours(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('parcours').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/parcours')
  redirect('/admin/parcours')
}
```

- [ ] **Step 2: Write ParcoursForm component**

```tsx
// components/admin/ParcoursForm.tsx
'use client'
import { useRef } from 'react'
import type { Parcours } from '@/types/quiz'

const AUDIO_KEYS = [
  { key: 'generique', label: 'Générique (intro)' },
  { key: 'facile', label: 'Questions faciles' },
  { key: 'moyenne', label: 'Questions moyennes' },
  { key: 'difficile', label: 'Questions impossibles' },
  { key: 'parents', label: 'Question parents' },
  { key: 'priere', label: 'Prière' },
  { key: 'correct', label: 'Bonne réponse (jingle)' },
  { key: 'wrong', label: 'Mauvaise réponse (jingle)' },
]

interface ParcoursFormProps {
  parcours?: Parcours
  action: (formData: FormData) => Promise<void>
  submitLabel: string
}

export function ParcoursForm({ parcours, action, submitLabel }: ParcoursFormProps) {
  const fr = parcours?.translations.fr
  const audioUrls = parcours?.audio_urls ?? {}

  return (
    <form action={action} className="flex flex-col gap-6 max-w-2xl">
      {/* Slug (only for creation) */}
      {!parcours && (
        <Field label="Slug (URL)" name="slug" required placeholder="la-piece-retrouvee" />
      )}

      <Field label="Titre (FR)" name="title" required defaultValue={fr?.title} />

      <div className="flex flex-col gap-1">
        <label className="font-display text-sm font-semibold text-on-surface">Histoire (FR)</label>
        <textarea
          name="story_text"
          rows={8}
          required
          defaultValue={fr?.story_text}
          className="rounded-2xl bg-surface-container-low px-4 py-3 font-body text-on-surface placeholder:text-on-surface/30 resize-y focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-display text-sm font-semibold text-on-surface">Prière (FR)</label>
        <textarea
          name="prayer_text"
          rows={4}
          defaultValue={fr?.prayer_text}
          className="rounded-2xl bg-surface-container-low px-4 py-3 font-body text-on-surface placeholder:text-on-surface/30 resize-y focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <Field label="Image URL" name="image_url" defaultValue={parcours?.image_url ?? ''} />

      <div className="flex flex-col gap-1">
        <label className="font-display text-sm font-semibold text-on-surface">Tags (séparés par virgule)</label>
        <input
          name="tags"
          defaultValue={parcours?.tags.join(', ')}
          placeholder="parabole, pardon, Luc"
          className="rounded-2xl bg-surface-container-low px-4 py-3 font-body text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <label className="font-display text-sm font-semibold text-on-surface">Difficulté</label>
          <select
            name="difficulty"
            defaultValue={parcours?.difficulty ?? 'debutant'}
            className="rounded-2xl bg-surface-container-low px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="debutant">Débutant</option>
            <option value="intermediaire">Intermédiaire</option>
            <option value="avance">Avancé</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="font-display text-sm font-semibold text-on-surface">Tier</label>
          <select
            name="tier"
            defaultValue={parcours?.tier ?? 'free'}
            className="rounded-2xl bg-surface-container-low px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="free">Gratuit</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>

      <label className="flex items-center gap-3 font-body text-on-surface cursor-pointer">
        <input
          type="checkbox"
          name="published"
          defaultChecked={parcours?.published ?? false}
          className="w-4 h-4 accent-primary"
        />
        Publié
      </label>

      {/* Audio URLs */}
      <div className="flex flex-col gap-3">
        <h3 className="font-display text-sm font-semibold text-on-surface">URLs audio</h3>
        {AUDIO_KEYS.map(({ key, label }) => (
          <Field
            key={key}
            label={label}
            name={`audio_${key}`}
            defaultValue={(audioUrls as any)[key] ?? ''}
            placeholder="https://..."
          />
        ))}
      </div>

      <button
        type="submit"
        className="w-full rounded-[2rem] py-3 font-display font-semibold text-on-primary bg-primary-gradient shadow-ambient"
      >
        {submitLabel}
      </button>
    </form>
  )
}

function Field({
  label,
  name,
  required,
  defaultValue,
  placeholder,
}: {
  label: string
  name: string
  required?: boolean
  defaultValue?: string
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-display text-sm font-semibold text-on-surface">{label}</label>
      <input
        type="text"
        name={name}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="rounded-2xl bg-surface-container-low px-4 py-3 font-body text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  )
}
```

- [ ] **Step 3: Write new parcours page**

```tsx
// app/(admin)/admin/parcours/new/page.tsx
import { ParcoursForm } from '@/components/admin/ParcoursForm'
import { createParcours } from '@/app/(admin)/admin/parcours/actions'
import Link from 'next/link'

export default function NewParcoursPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/parcours" className="font-body text-sm text-on-surface/50 hover:text-primary">
          ← Parcours
        </Link>
        <h1 className="font-display text-2xl font-bold text-on-surface">Nouveau parcours</h1>
      </div>
      <ParcoursForm action={createParcours} submitLabel="Créer le parcours" />
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add app/\(admin\)/admin/parcours/actions.ts components/admin/ParcoursForm.tsx app/\(admin\)/admin/parcours/new/page.tsx
git commit -m "feat: admin ParcoursForm with server actions (create/update/delete)"
```

---

### Task 12: Admin QuestionsEditor + server actions

**Files:**
- Create: `app/(admin)/admin/parcours/[id]/questions/actions.ts`
- Create: `components/admin/QuestionsEditor.tsx`

- [ ] **Step 1: Write questions server actions**

```ts
// app/(admin)/admin/parcours/[id]/questions/actions.ts
'use server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export async function upsertQuestion(
  parcoursId: string,
  questionId: string | null,
  data: {
    type: string
    order_index: number
    question: string
    choices: [string, string, string, string] | null
    correct_index: number | null
    explanation: string | null
  }
) {
  const supabase = createAdminClient()
  const translations = {
    fr: {
      question: data.question,
      choices: data.choices,
      correct_index: data.correct_index,
      explanation: data.explanation,
      translation_status: 'source',
    },
  }

  if (questionId) {
    // fetch current translations to preserve EN/PT/TH
    const { data: current } = await supabase
      .from('questions')
      .select('translations')
      .eq('id', questionId)
      .single()
    const merged = { ...(current?.translations ?? {}), fr: translations.fr }
    const { error } = await supabase
      .from('questions')
      .update({ type: data.type, order_index: data.order_index, translations: merged })
      .eq('id', questionId)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase
      .from('questions')
      .insert({ parcours_id: parcoursId, type: data.type, order_index: data.order_index, translations })
    if (error) throw new Error(error.message)
  }
  revalidatePath(`/admin/parcours/${parcoursId}`)
}

export async function deleteQuestion(parcoursId: string, questionId: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('questions').delete().eq('id', questionId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/parcours/${parcoursId}`)
}
```

- [ ] **Step 2: Write QuestionsEditor component**

```tsx
// components/admin/QuestionsEditor.tsx
'use client'
import { useState } from 'react'
import type { Question } from '@/types/quiz'
import { upsertQuestion, deleteQuestion } from '@/app/(admin)/admin/parcours/[id]/questions/actions'

const QUESTION_TYPES = ['facile', 'moyenne', 'impossible', 'parents'] as const
type QType = typeof QUESTION_TYPES[number]

interface QuestionsEditorProps {
  parcoursId: string
  questions: Question[]
}

interface DraftQuestion {
  id: string | null
  type: QType
  order_index: number
  question: string
  choices: [string, string, string, string]
  correct_index: number
  explanation: string
}

function emptyDraft(order_index: number): DraftQuestion {
  return { id: null, type: 'facile', order_index, question: '', choices: ['', '', '', ''], correct_index: 0, explanation: '' }
}

export function QuestionsEditor({ parcoursId, questions }: QuestionsEditorProps) {
  const [editing, setEditing] = useState<DraftQuestion | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function startEdit(q: Question) {
    const fr = q.translations.fr
    setEditing({
      id: q.id,
      type: q.type as QType,
      order_index: q.order_index,
      question: fr?.question ?? '',
      choices: (fr?.choices ?? ['', '', '', '']) as [string, string, string, string],
      correct_index: fr?.correct_index ?? 0,
      explanation: fr?.explanation ?? '',
    })
  }

  function startNew() {
    setEditing(emptyDraft(questions.length))
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    setError('')
    try {
      await upsertQuestion(parcoursId, editing.id, {
        type: editing.type,
        order_index: editing.order_index,
        question: editing.question,
        choices: editing.type === 'parents' ? null : editing.choices,
        correct_index: editing.type === 'parents' ? null : editing.correct_index,
        explanation: editing.type === 'parents' ? null : editing.explanation,
      })
      setEditing(null)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(q: Question) {
    if (!confirm('Supprimer cette question ?')) return
    await deleteQuestion(parcoursId, q.id)
  }

  const TYPE_LABELS: Record<QType, string> = {
    facile: 'Facile', moyenne: 'Moyenne', impossible: 'Impossible', parents: 'Parents'
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-on-surface">Questions ({questions.length})</h2>
        <button
          onClick={startNew}
          className="rounded-[2rem] px-4 py-2 font-display text-sm font-semibold text-on-primary bg-primary-gradient shadow-ambient"
        >
          + Ajouter
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {questions.map((q, i) => {
          const fr = q.translations.fr
          return (
            <div key={q.id} className="flex items-start justify-between bg-surface-container-lowest rounded-2xl px-4 py-3 shadow-ambient">
              <div className="flex gap-3 items-start">
                <span className="font-body text-xs text-on-surface/40 mt-0.5 w-5">{i + 1}</span>
                <div>
                  <span className="font-body text-xs font-semibold text-primary mr-2">{TYPE_LABELS[q.type as QType]}</span>
                  <span className="font-body text-sm text-on-surface">{fr?.question ?? '—'}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0 ml-2">
                <button onClick={() => startEdit(q)} className="font-body text-xs text-primary hover:underline">Modifier</button>
                <button onClick={() => handleDelete(q)} className="font-body text-xs text-error hover:underline">Suppr.</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Edit/Create form */}
      {editing && (
        <div className="bg-surface-container-low rounded-2xl p-5 flex flex-col gap-4">
          <h3 className="font-display text-sm font-bold text-on-surface">{editing.id ? 'Modifier' : 'Nouvelle'} question</h3>

          <div className="flex gap-4">
            <select
              value={editing.type}
              onChange={e => setEditing({ ...editing, type: e.target.value as QType })}
              className="rounded-xl bg-surface-container px-3 py-2 font-body text-sm text-on-surface focus:outline-none"
            >
              {QUESTION_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
            </select>
            <input
              type="number"
              value={editing.order_index}
              onChange={e => setEditing({ ...editing, order_index: Number(e.target.value) })}
              className="w-20 rounded-xl bg-surface-container px-3 py-2 font-body text-sm text-on-surface focus:outline-none"
              placeholder="Ordre"
            />
          </div>

          <textarea
            value={editing.question}
            onChange={e => setEditing({ ...editing, question: e.target.value })}
            placeholder="Texte de la question (FR)"
            rows={2}
            className="rounded-xl bg-surface-container px-3 py-2 font-body text-sm text-on-surface placeholder:text-on-surface/30 resize-none focus:outline-none"
          />

          {editing.type !== 'parents' && (
            <>
              <div className="flex flex-col gap-2">
                {(['A', 'B', 'C', 'D'] as const).map((letter, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={editing.correct_index === idx}
                      onChange={() => setEditing({ ...editing, correct_index: idx })}
                      className="accent-primary"
                    />
                    <span className="font-body text-xs text-on-surface/50 w-4">{letter}</span>
                    <input
                      type="text"
                      value={editing.choices[idx]}
                      onChange={e => {
                        const c = [...editing.choices] as [string, string, string, string]
                        c[idx] = e.target.value
                        setEditing({ ...editing, choices: c })
                      }}
                      placeholder={`Choix ${letter}`}
                      className="flex-1 rounded-xl bg-surface-container px-3 py-1.5 font-body text-sm text-on-surface placeholder:text-on-surface/30 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={editing.explanation}
                onChange={e => setEditing({ ...editing, explanation: e.target.value })}
                placeholder="Explication (montrée après la réponse)"
                className="rounded-xl bg-surface-container px-3 py-2 font-body text-sm text-on-surface placeholder:text-on-surface/30 focus:outline-none"
              />
            </>
          )}

          {error && <p className="font-body text-xs text-error">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-[2rem] px-5 py-2 font-display text-sm font-semibold text-on-primary bg-primary-gradient shadow-ambient disabled:opacity-60"
            >
              {saving ? 'Sauvegarde…' : 'Sauvegarder'}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="rounded-[2rem] px-5 py-2 font-display text-sm font-semibold text-on-surface bg-surface-container"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/\(admin\)/admin/parcours/\[id\]/questions/actions.ts components/admin/QuestionsEditor.tsx
git commit -m "feat: admin QuestionsEditor with add/edit/delete and server actions"
```

---

### Task 13: Admin TranslationPanel + translate API route

**Files:**
- Create: `components/admin/TranslationPanel.tsx`
- Create: `app/api/translate/route.ts`

- [ ] **Step 1: Write TranslationPanel**

```tsx
// components/admin/TranslationPanel.tsx
'use client'
import { useState } from 'react'
import type { Locale, Parcours, Question, TranslationStatus } from '@/types/quiz'

const LOCALES: Exclude<Locale, 'fr'>[] = ['en', 'pt', 'th']
const LOCALE_LABELS: Record<string, string> = { en: '🇬🇧 EN', pt: '🇧🇷 PT', th: '🇹🇭 TH' }

function StatusBadge({ status }: { status: TranslationStatus }) {
  if (status === 'source') return null
  return (
    <span
      className={`text-xs font-body font-semibold px-2 py-0.5 rounded-full ${
        status === 'verified' ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface/50'
      }`}
    >
      {status === 'verified' ? '✓ Vérifié' : 'IA'}
    </span>
  )
}

interface TranslationPanelProps {
  parcours: Parcours
}

export function TranslationPanel({ parcours }: TranslationPanelProps) {
  const [translating, setTranslating] = useState(false)
  const [message, setMessage] = useState('')

  async function triggerTranslation() {
    setTranslating(true)
    setMessage('')
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: 'parcours', record_id: parcours.id }),
      })
      if (!res.ok) throw new Error(await res.text())
      setMessage('Traduction lancée — rechargez la page dans quelques secondes.')
    } catch (e: any) {
      setMessage(`Erreur : ${e.message}`)
    } finally {
      setTranslating(false)
    }
  }

  const frT = parcours.translations.fr
  if (!frT) return <p className="font-body text-sm text-on-surface/40">Aucun contenu FR.</p>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-on-surface">Traductions</h2>
        <button
          onClick={triggerTranslation}
          disabled={translating}
          className="rounded-[2rem] px-4 py-2 font-display text-sm font-semibold text-on-primary bg-primary-gradient shadow-ambient disabled:opacity-60"
        >
          {translating ? 'Traduction…' : '✨ Re-traduire avec IA'}
        </button>
      </div>

      {message && <p className="font-body text-sm text-on-surface/60">{message}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="text-left text-on-surface/50">
              <th className="pb-2 pr-4 font-semibold">Champ</th>
              <th className="pb-2 pr-4 font-semibold">🇫🇷 FR (source)</th>
              {LOCALES.map(l => (
                <th key={l} className="pb-2 pr-4 font-semibold">{LOCALE_LABELS[l]}</th>
              ))}
            </tr>
          </thead>
          <tbody className="align-top">
            {(['title', 'story_text', 'prayer_text'] as const).map(field => (
              <tr key={field} className="border-t border-surface-container">
                <td className="py-3 pr-4 font-semibold text-on-surface/70 whitespace-nowrap">{field}</td>
                <td className="py-3 pr-4 text-on-surface/60 max-w-xs">
                  <p className="line-clamp-3">{(frT as any)[field]}</p>
                </td>
                {LOCALES.map(l => {
                  const lt = parcours.translations[l]
                  return (
                    <td key={l} className="py-3 pr-4 max-w-xs">
                      {lt ? (
                        <div className="flex flex-col gap-1">
                          <StatusBadge status={lt.translation_status} />
                          <p className="text-on-surface/80 line-clamp-3">{(lt as any)[field]}</p>
                        </div>
                      ) : (
                        <span className="text-on-surface/30 italic">—</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write translate API route**

```ts
// app/api/translate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { table, record_id } = await req.json()
  if (!['parcours', 'questions'].includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  }

  const supabase = createAdminClient()

  if (table === 'parcours') {
    const { data, error } = await supabase.from('parcours').select('translations').eq('id', record_id).single()
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const fr = data.translations.fr
    if (!fr) return NextResponse.json({ error: 'No FR source' }, { status: 400 })

    const prompt = `You are a Bible content translator. Translate the following French text fields to English (en), Portuguese (pt), and Thai (th).
Return ONLY a valid JSON object with keys "en", "pt", "th". Each value must have the same fields as the input.

Input (French):
${JSON.stringify({ title: fr.title, story_text: fr.story_text, prayer_text: fr.prayer_text }, null, 2)}

Return format (fill in translated values):
{
  "en": { "title": "...", "story_text": "...", "prayer_text": "..." },
  "pt": { "title": "...", "story_text": "...", "prayer_text": "..." },
  "th": { "title": "...", "story_text": "...", "prayer_text": "..." }
}`

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ error: 'No JSON in response' }, { status: 500 })

    const translated = JSON.parse(jsonMatch[0])
    const newTranslations = {
      ...data.translations,
      en: { ...translated.en, translation_status: 'ai' },
      pt: { ...translated.pt, translation_status: 'ai' },
      th: { ...translated.th, translation_status: 'ai' },
    }

    await supabase.from('parcours').update({ translations: newTranslations }).eq('id', record_id)
    return NextResponse.json({ ok: true })
  }

  if (table === 'questions') {
    const { data, error } = await supabase.from('questions').select('translations, type').eq('id', record_id).single()
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const fr = data.translations.fr
    if (!fr) return NextResponse.json({ error: 'No FR source' }, { status: 400 })

    const isParents = data.type === 'parents'
    const prompt = isParents
      ? `Translate this French question to English (en), Portuguese (pt), and Thai (th).
Return ONLY valid JSON: { "en": { "question": "..." }, "pt": { "question": "..." }, "th": { "question": "..." } }
French question: "${fr.question}"`
      : `Translate this French MCQ question and its choices to English (en), Portuguese (pt), and Thai (th).
Return ONLY valid JSON with keys en, pt, th. Each: { "question": "...", "choices": ["A","B","C","D"], "explanation": "..." }
French: ${JSON.stringify({ question: fr.question, choices: fr.choices, explanation: fr.explanation })}`

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ error: 'No JSON in response' }, { status: 500 })

    const translated = JSON.parse(jsonMatch[0])
    const newTranslations = {
      ...data.translations,
      en: { ...fr, ...translated.en, correct_index: fr.correct_index, translation_status: 'ai' },
      pt: { ...fr, ...translated.pt, correct_index: fr.correct_index, translation_status: 'ai' },
      th: { ...fr, ...translated.th, correct_index: fr.correct_index, translation_status: 'ai' },
    }

    await supabase.from('questions').update({ translations: newTranslations }).eq('id', record_id)
    return NextResponse.json({ ok: true })
  }
}
```

- [ ] **Step 3: Install Anthropic SDK if not present**

```bash
npm list @anthropic-ai/sdk 2>/dev/null || npm install @anthropic-ai/sdk
```

- [ ] **Step 4: Commit**

```bash
git add components/admin/TranslationPanel.tsx app/api/translate/route.ts
git commit -m "feat: TranslationPanel UI + translate API route calling Claude claude-sonnet-4-6"
```

---

### Task 14: Admin edit parcours page (composite)

**Files:**
- Create: `app/(admin)/admin/parcours/[id]/page.tsx`

- [ ] **Step 1: Write the edit page wiring form + questions + translations**

```tsx
// app/(admin)/admin/parcours/[id]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Parcours, Question } from '@/types/quiz'
import { ParcoursForm } from '@/components/admin/ParcoursForm'
import { QuestionsEditor } from '@/components/admin/QuestionsEditor'
import { TranslationPanel } from '@/components/admin/TranslationPanel'
import { updateParcours, deleteParcours } from '@/app/(admin)/admin/parcours/actions'

async function getData(id: string) {
  const supabase = createAdminClient()
  const [pRes, qRes] = await Promise.all([
    supabase.from('parcours').select('*').eq('id', id).single(),
    supabase.from('questions').select('*').eq('parcours_id', id).order('order_index'),
  ])
  return {
    parcours: pRes.data as Parcours | null,
    questions: (qRes.data ?? []) as Question[],
  }
}

interface Props { params: { id: string } }

export default async function EditParcoursPage({ params }: Props) {
  const { parcours, questions } = await getData(params.id)
  if (!parcours) notFound()

  const update = updateParcours.bind(null, params.id)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/parcours" className="font-body text-sm text-on-surface/50 hover:text-primary">
            ← Parcours
          </Link>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            {parcours.translations.fr?.title ?? parcours.slug}
          </h1>
        </div>
        <form action={deleteParcours.bind(null, params.id)}>
          <button type="submit" className="font-body text-sm text-error hover:underline">
            Supprimer
          </button>
        </form>
      </div>

      {/* Section 1: Parcours metadata */}
      <section>
        <h2 className="font-display text-lg font-bold text-on-surface mb-4">Contenu FR</h2>
        <ParcoursForm parcours={parcours} action={update} submitLabel="Sauvegarder" />
      </section>

      {/* Section 2: Questions */}
      <section>
        <QuestionsEditor parcoursId={params.id} questions={questions} />
      </section>

      {/* Section 3: Translations */}
      <section>
        <TranslationPanel parcours={parcours} />
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: BUILD successful

- [ ] **Step 3: Commit**

```bash
git add app/\(admin\)/admin/parcours/\[id\]/page.tsx
git commit -m "feat: admin edit parcours page with form + questions editor + translation panel"
```

---

### Task 15: Seed SQL — "La pièce retrouvée"

**Files:**
- Create: `supabase/migrations/002_seed_la_piece_retrouvee.sql`

- [ ] **Step 1: Write seed SQL**

```sql
-- supabase/migrations/002_seed_la_piece_retrouvee.sql
-- Seed: La pièce retrouvée (Luc 15:8-10) — first Culte Familial parcours

insert into parcours (
  slug,
  translations,
  image_url,
  audio_urls,
  tags,
  difficulty,
  tier,
  published
) values (
  'la-piece-retrouvee',
  jsonb_build_object(
    'fr', jsonb_build_object(
      'title', 'La pièce retrouvée',
      'story_text', 'Une femme possédait dix pièces d''argent. Elle en perd une. Alors elle allume une lampe, balaie toute la maison et cherche avec soin jusqu''à ce qu''elle la retrouve.

Quand elle l''a retrouvée, elle appelle ses amies et ses voisines : "Réjouissez-vous avec moi, car j''ai retrouvé la pièce que j''avais perdue !"

Jésus dit : "De même, il y a de la joie devant les anges de Dieu pour un seul pécheur qui se repent."

— Luc 15 : 8-10',
      'prayer_text', 'Seigneur, merci de nous chercher quand nous nous perdons. Comme la femme cherche sa pièce avec soin, tu nous cherches avec amour. Aide-nous à rester proches de toi et à nous réjouir quand ceux qui étaient perdus reviennent vers toi. Amen.',
      'translation_status', 'source'
    )
  ),
  'https://minilek.com/wp-content/uploads/2026/02/la-piece-retrouvee-parabole-de-Jesus-histoire-biblique-pour-enfant-culte-familial-ludique-Minilek-scaled.png',
  jsonb_build_object(
    'generique',  'https://minilek.com/wp-content/uploads/2024/09/Mini-quizz-generique.mp3',
    'facile',     'https://minilek.com/wp-content/uploads/2024/09/Mini-quiz-Question-simple.mp3',
    'moyenne',    'https://minilek.com/wp-content/uploads/2024/09/Mini-quiz-Question-moyenne.mp3',
    'difficile',  'https://minilek.com/wp-content/uploads/2024/09/Mini-quiz-Question-difficile.mp3',
    'parents',    'https://minilek.com/wp-content/uploads/2024/10/Epicness-Musique-minilek-pour-la-question-des-parents-quiz-chretien-ludique.wav',
    'priere',     'https://minilek.com/wp-content/uploads/2024/09/Miniquiz-Piano-priere.mp3',
    'correct',    'https://minilek.com/wp-content/uploads/2024/09/vrai.mp3',
    'wrong',      'https://minilek.com/wp-content/uploads/2024/09/faux.mp3'
  ),
  array['parabole', 'pardon', 'Luc', 'argent'],
  'debutant',
  'free',
  true
);

-- Store parcours id for question inserts
do $$
declare
  p_id uuid;
begin
  select id into p_id from parcours where slug = 'la-piece-retrouvee';

  -- =====================
  -- QUESTIONS FACILES (1-5)
  -- =====================
  insert into questions (parcours_id, type, order_index, translations) values
  (p_id, 'facile', 0, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Combien de pièces d''argent la femme possédait-elle ?',
    'choices', array['5 pièces', '7 pièces', '10 pièces', '12 pièces'],
    'correct_index', 2,
    'explanation', 'Elle possédait 10 pièces d''argent, et en perdit une.',
    'translation_status', 'source'
  ))),
  (p_id, 'facile', 1, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que fait-elle quand elle perd une pièce ?',
    'choices', array['Elle pleure et attend', 'Elle cherche dehors dans la rue', 'Elle allume une lampe et balaie la maison', 'Elle demande à ses voisines de l''aider'],
    'correct_index', 2,
    'explanation', 'Elle allume une lampe et balaie toute la maison avec soin.',
    'translation_status', 'source'
  ))),
  (p_id, 'facile', 2, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Où cherche-t-elle la pièce ?',
    'choices', array['Dans son jardin', 'Dans la rue devant chez elle', 'Dans le temple', 'Dans toute la maison'],
    'correct_index', 3,
    'explanation', 'Elle cherche dans toute la maison jusqu''à la retrouver.',
    'translation_status', 'source'
  ))),
  (p_id, 'facile', 3, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que fait-elle quand elle retrouve la pièce ?',
    'choices', array['Elle remercie Dieu en silence', 'Elle va au temple offrir un sacrifice', 'Elle cache la pièce précieusement', 'Elle appelle ses amies et voisines pour se réjouir'],
    'correct_index', 3,
    'explanation', 'Elle partage sa joie avec toute sa communauté.',
    'translation_status', 'source'
  ))),
  (p_id, 'facile', 4, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Qui se réjouit quand un pécheur se repent, selon cette parabole ?',
    'choices', array['Les pharisiens', 'Les disciples de Jésus', 'Les prêtres du temple', 'Les anges de Dieu'],
    'correct_index', 3,
    'explanation', 'Jésus dit qu''il y a de la joie devant les anges de Dieu.',
    'translation_status', 'source'
  )));

  -- =====================
  -- QUESTIONS MOYENNES (6-10)
  -- =====================
  insert into questions (parcours_id, type, order_index, translations) values
  (p_id, 'moyenne', 5, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quel livre de la Bible raconte cette histoire ?',
    'choices', array['Matthieu', 'Marc', 'Jean', 'Luc'],
    'correct_index', 3,
    'explanation', 'C''est l''Évangile de Luc qui rapporte cette parabole.',
    'translation_status', 'source'
  ))),
  (p_id, 'moyenne', 6, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quel chapitre du livre de Luc ?',
    'choices', array['Chapitre 10', 'Chapitre 12', 'Chapitre 15', 'Chapitre 18'],
    'correct_index', 2,
    'explanation', 'La parabole se trouve au chapitre 15 de Luc.',
    'translation_status', 'source'
  ))),
  (p_id, 'moyenne', 7, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Qu''est-ce qu''une parabole ?',
    'choices', array['Une prière récitée à la synagogue', 'Un psaume chanté par les lévites', 'Un commandement de la loi de Moïse', 'Une histoire avec un message caché et une leçon spirituelle'],
    'correct_index', 3,
    'explanation', 'Jésus utilisait des histoires du quotidien pour enseigner des vérités spirituelles.',
    'translation_status', 'source'
  ))),
  (p_id, 'moyenne', 8, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que représente la pièce perdue dans cette parabole ?',
    'choices', array['Les richesses matérielles', 'Le paradis que l''on cherche', 'Le péché lui-même', 'Une personne perdue / un pécheur'],
    'correct_index', 3,
    'explanation', 'La pièce symbolise une personne éloignée de Dieu.',
    'translation_status', 'source'
  ))),
  (p_id, 'moyenne', 9, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Que représente la femme dans cette parabole ?',
    'choices', array['L''Église qui cherche ses membres', 'Marie, mère de Jésus', 'Les pharisiens qui jugent les pécheurs', 'Dieu / Jésus qui cherche les perdus'],
    'correct_index', 3,
    'explanation', 'La femme représente Dieu qui cherche activement chaque personne perdue.',
    'translation_status', 'source'
  )));

  -- =====================
  -- QUESTIONS IMPOSSIBLES (11-13)
  -- =====================
  insert into questions (parcours_id, type, order_index, translations) values
  (p_id, 'impossible', 10, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quels versets précis du chapitre 15 de Luc racontent cette parabole ?',
    'choices', array['Versets 1 à 7', 'Versets 8 à 10', 'Versets 11 à 24', 'Versets 25 à 32'],
    'correct_index', 1,
    'explanation', 'La parabole de la pièce perdue couvre exactement les versets 8 à 10.',
    'translation_status', 'source'
  ))),
  (p_id, 'impossible', 11, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Dans la culture de l''époque, que représentait une drachme (pièce d''argent) ?',
    'choices', array['Une offrande au temple', 'Le prix d''un repas pour une famille', 'Le salaire d''une journée de travail', 'Une petite somme sans grande valeur'],
    'correct_index', 2,
    'explanation', 'Une drachme équivalait au salaire d''un journalier pour une journée complète de travail.',
    'translation_status', 'source'
  ))),
  (p_id, 'impossible', 12, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Quelles sont les deux autres paraboles racontées dans Luc 15 ?',
    'choices', array['Le bon Samaritain et le fils prodigue', 'Le semeur et la brebis perdue', 'La brebis perdue et le fils prodigue', 'La brebis perdue et le pharisien et le publicain'],
    'correct_index', 2,
    'explanation', 'Luc 15 contient trois paraboles : la brebis perdue, la pièce perdue, et le fils prodigue.',
    'translation_status', 'source'
  )));

  -- =====================
  -- QUESTIONS PARENTS (14-16)
  -- =====================
  insert into questions (parcours_id, type, order_index, translations) values
  (p_id, 'parents', 13, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Comment montres-tu à tes enfants que tu les cherches quand ils se perdent (font une bêtise) ?',
    'choices', null::text[],
    'correct_index', null::integer,
    'explanation', null::text,
    'translation_status', 'source'
  ))),
  (p_id, 'parents', 14, jsonb_build_object('fr', jsonb_build_object(
    'question', 'Comment expliquer à tes enfants que Dieu ne se décourage jamais de les chercher ?',
    'choices', null::text[],
    'correct_index', null::integer,
    'explanation', null::text,
    'translation_status', 'source'
  ))),
  (p_id, 'parents', 15, jsonb_build_object('fr', jsonb_build_object(
    'question', 'As-tu déjà ressenti que Dieu te cherchait dans un moment difficile ? Partage avec ta famille.',
    'choices', null::text[],
    'correct_index', null::integer,
    'explanation', null::text,
    'translation_status', 'source'
  )));

end $$;
```

- [ ] **Step 2: Apply migration to Supabase**

In Supabase Dashboard → SQL Editor, paste and run the SQL above.
Or via MCP: apply migration with name `seed_la_piece_retrouvee`.

- [ ] **Step 3: Verify data**

```sql
select slug, published, jsonb_array_length(translations->'fr'->'story_text') from parcours;
select count(*) from questions;
-- Expected: 1 parcours, 16 questions
```

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/002_seed_la_piece_retrouvee.sql
git commit -m "feat: seed La pièce retrouvée — 1 parcours + 16 questions (FR source)"
```

---

### Task 16: Full test suite + build verification

- [ ] **Step 1: Run all tests**

```bash
npx jest --no-coverage
```

Expected: All tests passing (existing 8 + new: 5 useAudio + 7 useQuizSession + 5 MCQStep = 25 total)

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: BUILD successful, no TypeScript or ESLint errors

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: culte familial complete — quiz shell, admin CRUD, translations, seed data"
```

---

## Post-implementation manual steps

1. **Apply seed migration in Supabase:** Supabase Dashboard → SQL Editor → run `002_seed_la_piece_retrouvee.sql`
2. **Add `ANTHROPIC_API_KEY`** to `.env.local` (needed for `/api/translate`)
3. **Add `SUPABASE_SERVICE_ROLE_KEY`** to `.env.local` (needed for admin CRUD)
4. **Create admin Supabase Auth user:** Supabase Dashboard → Authentication → Users → Add user → email: `piyanatlkmedia@gmail.com`, password: choose secure password
5. **Test full quiz flow:** visit `/culte-familial/la-piece-retrouvee`
6. **Test translation:** admin → edit parcours → "Re-traduire avec IA" button
