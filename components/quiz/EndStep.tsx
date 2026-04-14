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
