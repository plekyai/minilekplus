'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'
import { WordSearchGame } from '@/components/word-search/WordSearchGame'
import type { WordSearchPuzzle } from '@/types/word-search'
import type { Locale } from '@/types/quiz'

interface Props {
  puzzle: WordSearchPuzzle
}

export function WordSearchShell({ puzzle }: Props) {
  const { locale } = useLanguage()
  const lang = locale as Locale

  const t = puzzle.translations[lang] ?? puzzle.translations.fr

  // Build seed words from the DB puzzle translation
  const seedWords = t?.words?.map((word: string, idx: number) => ({
    text: word,                           // already normalised in the DB (UPPERCASE, no accents)
    displayText: t.displayWords?.[idx] ?? word,
    emoji: undefined,                     // no emoji in DB — WordSearchGame will use default
  }))

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-4">
      {/* Back link */}
      <Link
        href="/mots-meles"
        className="self-start font-body text-sm text-on-surface/60 hover:text-primary transition-colors"
      >
        ← Mots Mêlés
      </Link>

      {/* Game */}
      <WordSearchGame
        seedWords={seedWords}
        puzzleTitle={t?.title}
        puzzleDescription={t?.description}
        shareUrl={`https://minilek.com/mots-meles/${puzzle.slug}`}
      />
    </div>
  )
}
