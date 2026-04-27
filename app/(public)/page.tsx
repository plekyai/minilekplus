import type { Metadata } from 'next'
import { HeroSection }       from '@/components/home/HeroSection'
import { ManifesteSection }  from '@/components/home/ManifesteSection'
import { CharactersSection } from '@/components/home/CharactersSection'
import { ActivityStack }     from '@/components/home/ActivityStack'
import { CtaSection }        from '@/components/home/CtaSection'

export const metadata: Metadata = {
  title: 'Minilek+ — La Bible en famille, avec joie',
  description:
    'Des quiz interactifs, mots mêlés et coloriages bibliques pour explorer la Parole en famille. Disponible en français, anglais, portugais et thaïlandais.',
  openGraph: {
    title: 'Minilek+ — La Bible en famille, avec joie',
    description:
      'Activités bibliques interactives pour grandir dans la foi ensemble.',
    url: 'https://plus.minilek.com',
    siteName: 'Minilek+',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Minilek+ — La Bible en famille, avec joie',
    description: 'Activités bibliques interactives pour grandir dans la foi ensemble.',
  },
}

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ManifesteSection />
      <CharactersSection />
      <ActivityStack />
      <CtaSection />
    </main>
  )
}
