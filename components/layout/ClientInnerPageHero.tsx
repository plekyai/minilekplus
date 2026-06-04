'use client'

import { useLanguage } from '@/lib/i18n/context'
import { getPublicLabels } from '@/lib/i18n/public-labels'
import { InnerPageHero } from './InnerPageHero'

interface ClientInnerPageHeroProps {
  /** Route slug used as the key in heroPages translations (e.g. 'culte-familial') */
  pageKey: string
  bgColor: string
  charSrc: string
  charSrcLeft?: string
  accentColor?: string
}

/**
 * Auto-translated hero banner.
 * Add a new entry to `lib/i18n/public-labels.ts → heroPages` for each new page
 * and it will automatically render in the active language.
 */
export function ClientInnerPageHero({
  pageKey,
  bgColor,
  charSrc,
  charSrcLeft,
  accentColor,
}: ClientInnerPageHeroProps) {
  const { locale } = useLanguage()
  const labels = getPublicLabels(locale)
  const hero = labels.heroPages[pageKey] ?? {
    title: pageKey,
    subtitle: '',
    breadcrumb: pageKey,
  }

  return (
    <InnerPageHero
      title={hero.title}
      subtitle={hero.subtitle}
      breadcrumb={hero.breadcrumb}
      homeLabel={labels.home}
      bgColor={bgColor}
      charSrc={charSrc}
      charSrcLeft={charSrcLeft}
      accentColor={accentColor}
    />
  )
}
