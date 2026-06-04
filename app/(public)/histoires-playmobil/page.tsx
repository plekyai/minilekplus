// app/(public)/histoires-playmobil/page.tsx
import type { Metadata } from 'next'
import { getPlaylist, getPodcastPlaylist } from '@/lib/youtube/getPlaylist'
import { PlaymobilContent } from '@/components/histoires-playmobil/PlaymobilContent'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Histoires Bibliques Playmobil | Minilek+',
  description:
    'Toutes les histoires bibliques en Playmobil. Regardez, explorez et grandissez dans la foi en famille avec Minilek+.',
  openGraph: {
    title: 'Histoires Bibliques Playmobil | Minilek+',
    description: 'Histoires bibliques animées en Playmobil pour toute la famille.',
    url: 'https://plus.minilek.com/histoires-playmobil',
    siteName: 'Minilek+',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Histoires Bibliques Playmobil | Minilek+',
    description: 'Histoires bibliques animées en Playmobil pour toute la famille.',
  },
}

export default async function HistoiresPlaymobilPage() {
  const [videos, podcastVideos] = await Promise.all([getPlaylist(), getPodcastPlaylist()])

  if (videos.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#0f0f0f', paddingTop: 80 }}
      >
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Aucune vidéo disponible.</p>
      </div>
    )
  }

  return <PlaymobilContent videos={videos} podcastVideos={podcastVideos} />
}
