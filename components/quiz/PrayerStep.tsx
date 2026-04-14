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
