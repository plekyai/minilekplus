import Link from 'next/link'
import { getPublishedParcours } from '@/lib/supabase/queries/parcours'
import type { Parcours } from '@/types/quiz'

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
