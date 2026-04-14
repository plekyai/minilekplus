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
  onNext: () => void
  labels: QuizLabels
  inverted?: boolean
}

export function MCQStep({
  questions,
  currentIndex,
  locale,
  onAnswer,
  onNext,
  labels,
  inverted = false,
}: MCQStepProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [answered, setAnswered] = useState(false)

  const question = questions[currentIndex]
  const t = question?.translations[locale] ?? question?.translations.fr
  if (!question || !t) return null

  function handleChoice(idx: number) {
    if (revealed) return
    const isCorrect = idx === t!.correct_index
    setSelected(idx)
    setRevealed(true)
    setAnswered(true)
    // Play jingle immediately via onAnswer but don't advance yet
    onAnswer(question.id, idx, isCorrect)
  }

  function handleNext() {
    setSelected(null)
    setRevealed(false)
    setAnswered(false)
    onNext()
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
        <p className={`font-body text-sm ${subTextClass}`}>
          {labels.questionOf(currentIndex + 1, questions.length)}
        </p>

        <h2 className={`font-display text-xl sm:text-2xl font-bold ${textClass} leading-snug`}>
          {t.question}
        </h2>

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

        {revealed && t.explanation && (
          <div className={`rounded-2xl px-5 py-4 mt-2 ${
            inverted ? 'bg-white/10' : 'bg-surface-container-low'
          }`}>
            <p className={`font-body text-xs font-semibold uppercase tracking-wider mb-1 ${
              inverted ? 'text-inverse-primary/50' : 'text-on-surface/40'
            }`}>
              💡 {labels.answerLabel.replace('💡 ', '')}
            </p>
            <p className={`font-body text-sm leading-relaxed ${
              inverted ? 'text-inverse-primary/90' : 'text-on-surface/80'
            }`}>
              {t.explanation}
            </p>
          </div>
        )}

        {answered && (
          <button
            onClick={handleNext}
            className={`w-full rounded-[2rem] px-6 py-3 font-display font-semibold text-sm transition-all mt-2
              ${inverted
                ? 'bg-white/20 text-inverse-primary hover:bg-white/30'
                : 'bg-primary text-on-primary shadow-ambient hover:opacity-90'
              }`}
          >
            {labels.next} →
          </button>
        )}
      </div>
    </div>
  )
}
