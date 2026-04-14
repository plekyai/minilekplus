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
