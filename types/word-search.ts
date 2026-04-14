import type { Locale } from '@/types/quiz'

export interface WordSearchTranslation {
  title: string
  description?: string
  words: string[]         // normalised uppercase, accent-stripped: ["PIECE","LUMIERE"]
  displayWords?: string[] // display form with accents: ["Pièce","Lumière"]
}

export interface WordSearchPuzzle {
  id: string
  slug: string
  mode: 'parcours' | 'aleatoire'
  translations: Partial<Record<Locale, WordSearchTranslation>>
  tags: string[]
  tier: 'free' | 'premium'
  published: boolean
  order_index: number
  created_at: string
}

export interface PlacedWord {
  word: string               // normalised
  displayWord: string        // with accents
  cells: [number, number][]  // [row, col] for each letter
}

export interface GeneratedGrid {
  grid: string[][]
  placedWords: PlacedWord[]
}

export type GameStatus = 'playing' | 'won'
