'use client'
import type { PlacedWord } from '@/types/word-search'

interface Props {
  placedWords: PlacedWord[]
  foundWords: Set<string>
}

export function WordList({ placedWords, foundWords }: Props) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {placedWords.map(pw => {
        const isFound = foundWords.has(pw.word)
        return (
          <span
            key={pw.word}
            className={`font-display text-sm font-semibold px-3 py-1.5 rounded-full transition-all duration-300
              ${isFound
                ? 'line-through text-on-surface/30 bg-surface-container-low'
                : 'text-on-surface bg-surface-container-lowest shadow-ambient'
              }`}
          >
            {pw.displayWord}
          </span>
        )
      })}
    </div>
  )
}
