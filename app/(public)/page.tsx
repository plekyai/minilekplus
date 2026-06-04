// app/(public)/page.tsx
import type { Metadata } from 'next'
import { HeroSection }             from '@/components/home/HeroSection'
import { ManifesteSection }        from '@/components/home/ManifesteSection'
import { ActivitiesSection }       from '@/components/home/ActivitiesSection'
import { ActivityStack }           from '@/components/home/ActivityStack'
import { PlaymobilPreviewSection } from '@/components/home/PlaymobilPreviewSection'
import { getPlaylist }             from '@/lib/youtube/getPlaylist'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Minilek+ — La Bible en famille, avec joie',
  description:
    'Des quiz interactifs, mots mêlés et coloriages bibliques pour explorer la Parole en famille. Disponible en français, anglais, portugais, espagnol et thaïlandais.',
  openGraph: {
    title: 'Minilek+ — La Bible en famille, avec joie',
    description: 'Activités bibliques interactives pour grandir dans la foi ensemble.',
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

export default async function HomePage() {
  const videos = await getPlaylist()

  return (
    <main>
      <HeroSection />
      <ManifesteSection />
      <ActivitiesSection />
      <ActivityStack />
      <PlaymobilPreviewSection videos={videos} />
    </main>
  )
}
