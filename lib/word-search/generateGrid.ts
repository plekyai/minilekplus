import type { GeneratedGrid, PlacedWord } from '@/types/word-search'

export type Direction = { dr: number; dc: number }

const DIRECTIONS_EASY: Direction[] = [
  { dr: 0,  dc:  1 },  // →
  { dr: 1,  dc:  0 },  // ↓
  { dr: 1,  dc:  1 },  // ↘
  { dr: 0,  dc: -1 },  // ←
]

const DIRECTIONS_HARD: Direction[] = [
  { dr:  0, dc:  1 },  // →
  { dr:  0, dc: -1 },  // ←
  { dr:  1, dc:  0 },  // ↓
  { dr: -1, dc:  0 },  // ↑
  { dr:  1, dc:  1 },  // ↘
  { dr:  1, dc: -1 },  // ↙
  { dr: -1, dc:  1 },  // ↗
  { dr: -1, dc: -1 },  // ↖
]

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export interface GenerateOptions {
  rows?: number
  cols?: number
  difficulty?: 'easy' | 'hard'
  displayWords?: string[]
}

export function generateGrid(
  normalisedWords: string[],
  options: GenerateOptions = {}
): GeneratedGrid {
  const ROWS = options.rows ?? 10
  const COLS = options.cols ?? 10
  const dirs = options.difficulty === 'hard' ? DIRECTIONS_HARD : DIRECTIONS_EASY
  const displayWords = options.displayWords ?? normalisedWords

  // Sort longest first — harder to place, do first
  const indexed = normalisedWords.map((w, i) => ({
    word: w,
    display: displayWords[i] ?? w,
  }))
  indexed.sort((a, b) => b.word.length - a.word.length)

  const grid: string[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(''))
  const placed: PlacedWord[] = []

  for (const { word, display } of indexed) {
    let didPlace = false

    for (let attempt = 0; attempt < 200 && !didPlace; attempt++) {
      const dir = dirs[Math.floor(Math.random() * dirs.length)]
      const startR = Math.floor(Math.random() * ROWS)
      const startC = Math.floor(Math.random() * COLS)
      const endR = startR + dir.dr * (word.length - 1)
      const endC = startC + dir.dc * (word.length - 1)

      // Bounds check
      if (endR < 0 || endR >= ROWS || endC < 0 || endC >= COLS) continue

      // Collision check — empty or same letter OK
      let canPlace = true
      for (let i = 0; i < word.length; i++) {
        const r = startR + dir.dr * i
        const c = startC + dir.dc * i
        if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
          canPlace = false
          break
        }
      }
      if (!canPlace) continue

      // Place
      const cells: [number, number][] = []
      for (let i = 0; i < word.length; i++) {
        const r = startR + dir.dr * i
        const c = startC + dir.dc * i
        grid[r][c] = word[i]
        cells.push([r, c])
      }
      placed.push({ word, displayWord: display, cells })
      didPlace = true
    }

    if (!didPlace) {
      console.warn(`[word-search] Could not place: ${word}`)
    }
  }

  // Fill empty cells with random letters
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
      }
    }
  }

  return { grid, placedWords: placed }
}
