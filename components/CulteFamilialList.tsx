'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'
import { getPublicLabels } from '@/lib/i18n/public-labels'
import type { Locale } from '@/types/quiz'
import type { Parcours } from '@/types/quiz'

function ParcoursCard({ parcours, locale }: { parcours: Parcours; locale: Locale }) {
  const l = getPublicLabels(locale)
  const t = parcours.translations[locale] ?? parcours.translations.fr
  const diffLabel = l.difficulty[parcours.difficulty as keyof typeof l.difficulty] ?? parcours.difficulty

  const DIFFICULTY_STYLES: Record<string, string> = {
    debutant: 'bg-primary/10 text-primary',
    intermediaire: 'bg-secondary/10 text-secondary',
    avance: 'bg-error/10 text-error',
  }

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
          {t?.title ?? parcours.translations.fr?.title ?? '—'}
        </h2>
        <span
          className={`shrink-0 text-xs font-body font-semibold px-2 py-1 rounded-full ${
            DIFFICULTY_STYLES[parcours.difficulty] ?? ''
          }`}
        >
          {diffLabel}
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

export function CulteFamilialList({ parcoursList }: { parcoursList: Parcours[] }) {
  const { locale } = useLanguage()
  const l = getPublicLabels(locale as Locale)

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 sm:py-16">
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-on-surface mb-2">
        {l.culteFamilialPageTitle}
      </h1>
      <p className="font-body text-on-surface/60 mb-10">
        {l.culteFamilialPageSubtitle}
      </p>

      {parcoursList.length === 0 ? (
        <p className="font-body text-on-surface/40 text-center py-20">
          {l.noParcours}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {parcoursList.map(p => (
            <ParcoursCard key={p.id} parcours={p} locale={locale as Locale} />
          ))}
        </div>
      )}
    </main>
  )
}
