import type { Locale, Parcours } from '@/types/quiz'
import type { QuizLabels } from '@/lib/i18n/quiz-labels'

interface VideoStepProps {
  parcours: Parcours
  locale: Locale
  labels: QuizLabels
  onNext: () => void
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)
  return match?.[1] ?? null
}

export function VideoStep({ parcours, locale, labels, onNext }: VideoStepProps) {
  const t = parcours.translations[locale] ?? parcours.translations.fr
  const videoId = parcours.youtube_url ? getYouTubeId(parcours.youtube_url) : null

  if (!videoId) return null

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full flex flex-col gap-6 text-center">
        <div className="text-4xl">🎬</div>
        <h2 className="font-display text-xl font-bold text-on-surface">
          {t?.title}
        </h2>

        <div className="relative w-full rounded-[1.5rem] overflow-hidden shadow-ambient"
          style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Minilek vidéo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>

        <button
          onClick={onNext}
          className="rounded-[2rem] px-8 py-3 font-display font-semibold text-on-primary bg-primary-gradient shadow-ambient"
        >
          {labels.continueBtn}
        </button>
      </div>
    </div>
  )
}
