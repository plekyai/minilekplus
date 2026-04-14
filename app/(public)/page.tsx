'use client'
import { ActivityCard } from '@/components/ActivityCard'
import { useLanguage } from '@/lib/i18n/context'
import { getPublicLabels } from '@/lib/i18n/public-labels'
import type { Locale } from '@/types/quiz'

export default function HomePage() {
  const { locale } = useLanguage()
  const l = getPublicLabels(locale as Locale)

  return (
    <main className="min-h-screen bg-surface px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-on-surface mb-2">
          Minilek Plus
        </h1>
        <p className="font-body text-on-surface/60 mb-12">
          {l.homeSubtitle}
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ActivityCard
            href="/culte-familial"
            icon="✝️"
            title={l.culteFamilialTitle}
            description={l.culteFamilialDesc}
          />
          <ActivityCard
            href="/mots-meles"
            icon="🔎"
            title={l.motsMelesTitle}
            description={l.motsMelesDesc}
          />
          <ActivityCard
            href="/coloriage"
            icon="🎨"
            title={l.colorTitle}
            description={l.comingSoon}
            available={false}
          />
        </div>
      </div>
    </main>
  )
}
