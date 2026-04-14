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
