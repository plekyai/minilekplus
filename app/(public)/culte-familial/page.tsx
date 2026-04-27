import type { Metadata } from 'next'
import { getPublishedParcours }  from '@/lib/supabase/queries/parcours'
import { CulteFamilialList }     from '@/components/CulteFamilialList'
import { InnerPageHero }         from '@/components/layout/InnerPageHero'
import type { Parcours }         from '@/types/quiz'

export const metadata: Metadata = {
  title: 'Culte Familial — Quiz bibliques en famille | Minilek+',
  description:
    'Explorez des histoires bibliques interactives en famille. Choisissez un parcours, répondez aux questions, priez et regardez des vidéos ensemble.',
  openGraph: {
    title: 'Culte Familial — Quiz bibliques en famille | Minilek+',
    description:
      'Histoires bibliques interactives avec quiz, prière et vidéo pour toute la famille.',
    url: 'https://plus.minilek.com/culte-familial',
    siteName: 'Minilek+',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Culte Familial — Minilek+',
    description: 'Histoires bibliques interactives pour toute la famille.',
  },
}

export default async function CulteFamilialPage() {
  let parcoursList: Parcours[] = []
  try {
    parcoursList = await getPublishedParcours()
  } catch {
    // Supabase not configured yet — show empty state
  }

  return (
    <>
      <InnerPageHero
        title="📖 Culte Familial"
        subtitle="Des histoires bibliques interactives à vivre ensemble. Choisissez un parcours et explorez la Parole."
        bgColor="#006a60"
        charSrc="/svg/chat-livre.svg"
        charSrcLeft="/svg/cerf.svg"
        breadcrumb="Culte Familial"
      />
      <CulteFamilialList parcoursList={parcoursList} />
    </>
  )
}
