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
