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
  const [revealed, setRevealed] = useState(false)
  const question = questions[currentIndex]
  const t = question?.translations[locale] ?? question?.translations.fr
  // Explanation: use current locale first, fallback to FR if not yet translated
  const explanation = t?.explanation ?? question?.translations.fr?.explanation
  if (!question || !t) return null

  const key = question.id

  return (
    <div key={key} className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-8">
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

        {/* Réponse révélée */}
        {revealed && explanation && (
          <div className="rounded-2xl bg-primary/10 border border-primary/20 px-4 py-4">
            <p className="font-body text-sm font-semibold text-primary mb-1">{labels.answerLabel}</p>
            <p className="font-body text-on-surface leading-relaxed">{explanation}</p>
          </div>
        )}

        {/* Bouton voir la réponse */}
        {!revealed && explanation && (
          <button
            onClick={() => setRevealed(true)}
            className="w-full rounded-[2rem] py-3 font-display font-semibold border-2 border-primary text-primary hover:bg-primary/5 transition-all"
          >
            {labels.seeAnswer}
          </button>
        )}

        <button
          onClick={() => {
            setRevealed(false)
            onNext(question.id)
          }}
          className="w-full rounded-[2rem] py-3 font-display font-semibold text-on-primary bg-primary-gradient shadow-ambient"
        >
          {labels.continueBtn}
        </button>
      </div>
    </div>
  )
}
