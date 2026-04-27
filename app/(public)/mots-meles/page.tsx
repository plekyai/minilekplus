import type { Metadata } from 'next'
import { WordSearchGame }  from '@/components/word-search/WordSearchGame'
import { InnerPageHero }   from '@/components/layout/InnerPageHero'

export const metadata: Metadata = {
  title: 'Mots Mêlés Bibliques — Jouez en famille | Minilek+',
  description:
    'Retrouvez les mots bibliques cachés dans la grille. Un jeu de mots mêlés interactif pour apprendre le vocabulaire de la foi en famille.',
  openGraph: {
    title: 'Mots Mêlés Bibliques | Minilek+',
    description:
      'Jeu de mots mêlés bibliques interactif pour apprendre en famille.',
    url: 'https://plus.minilek.com/mots-meles',
    siteName: 'Minilek+',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mots Mêlés Bibliques — Minilek+',
    description: 'Jeu de mots mêlés bibliques interactif pour apprendre en famille.',
  },
}

export default function MotsMelesPage() {
  return (
    <>
      <InnerPageHero
        title="🔎 Mots Mêlés"
        subtitle="Retrouve les mots bibliques cachés dans la grille. Cherche horizontalement, verticalement et en diagonale !"
        bgColor="#795900"
        charSrc="/svg/oiseau.svg"
        charSrcLeft="/svg/souris.svg"
        breadcrumb="Mots Mêlés"
        accentColor="rgba(250,178,51,0.7)"
      />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <WordSearchGame />
      </main>
    </>
  )
}
