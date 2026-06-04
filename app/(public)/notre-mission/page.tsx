import type { Metadata } from 'next'
import { NotreMissionContent } from '@/components/notre-mission/NotreMissionContent'

export const metadata: Metadata = {
  title: 'Notre Mission — Minilek+ | La Bible accessible à toutes les familles',
  description:
    'Minilek+ croit que chaque famille mérite des outils simples, joyeux et profonds pour explorer la Bible ensemble — en français, anglais, portugais, espagnol et thaïlandais.',
  openGraph: {
    title: 'Notre Mission — Minilek+',
    description:
      'Aider les familles à explorer la Bible ensemble, avec joie, simplicité et profondeur.',
    url: 'https://plus.minilek.com/notre-mission',
    siteName: 'Minilek+',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Notre Mission — Minilek+',
    description: 'Aider les familles à explorer la Bible ensemble avec joie.',
  },
}

export default function NotreMissionPage() {
  return <NotreMissionContent />
}
