'use client'
import { useRef, useState, useCallback } from 'react'
import type { PlacedWord } from '@/types/word-search'

interface Props {
  grid: string[][]
  placedWords: PlacedWord[]
  foundWords: Set<string>
  onWordFound: (word: string, cells: [number, number][]) => void
}

function cellKey(r: number, c: number) { return `${r},${c}` }

const FOUND_COLORS = [
  'bg-emerald-200 text-emerald-800',
  'bg-amber-200 text-amber-800',
  'bg-sky-200 text-sky-800',
  'bg-violet-200 text-violet-800',
  'bg-rose-200 text-rose-800',
  'bg-orange-200 text-orange-800',
  'bg-teal-200 text-teal-800',
  'bg-pink-200 text-pink-800',
  'bg-lime-200 text-lime-800',
  'bg-indigo-200 text-indigo-800',
]

export function WordGrid({ grid, placedWords, foundWords, onWordFound }: Props) {
  const COLS = grid[0]?.length ?? 0

  const containerRef = useRef<HTMLDivElement>(null)
  const [selecting, setSelecting] = useState(false)
  const [selStart, setSelStart] = useState<[number, number] | null>(null)
  const [selEnd, setSelEnd] = useState<[number, number] | null>(null)

  // Build found cells map: cellKey → color class
  const foundCellColorMap = new Map<string, string>()
  placedWords.forEach((pw, idx) => {
    if (foundWords.has(pw.word)) {
      const color = FOUND_COLORS[idx % FOUND_COLORS.length]
      pw.cells.forEach(([r, c]) => foundCellColorMap.set(cellKey(r, c), color))
    }
  })

  function getCellFromPoint(x: number, y: number): [number, number] | null {
    const el = document.elementFromPoint(x, y) as HTMLElement | null
    const r = el?.getAttribute('data-r')
    const c = el?.getAttribute('data-c')
    if (r == null || c == null) return null
    return [parseInt(r), parseInt(c)]
  }

  function snapEnd(start: [number, number], raw: [number, number]): [number, number] {
    const dr = raw[0] - start[0]
    const dc = raw[1] - start[1]
    const absDr = Math.abs(dr)
    const absDc = Math.abs(dc)
    if (absDr === 0 || absDc === 0) return raw             // H or V — no snap needed
    if (absDr === absDc) return raw                         // perfect diagonal
    const dist = Math.min(absDr, absDc)
    if (absDr < absDc * 0.5) return [start[0], raw[1]]     // mostly H
    if (absDc < absDr * 0.5) return [raw[0], start[1]]     // mostly V
    return [start[0] + Math.sign(dr) * dist, start[1] + Math.sign(dc) * dist]
  }

  function getCellsInLine(start: [number, number], end: [number, number]): [number, number][] {
    const dr = Math.sign(end[0] - start[0])
    const dc = Math.sign(end[1] - start[1])
    const steps = Math.max(Math.abs(end[0] - start[0]), Math.abs(end[1] - start[1]))
    const cells: [number, number][] = []
    for (let i = 0; i <= steps; i++) {
      cells.push([start[0] + dr * i, start[1] + dc * i])
    }
    return cells
  }

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const cell = getCellFromPoint(e.clientX, e.clientY)
    if (!cell) return
    e.preventDefault()
    ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
    setSelecting(true)
    setSelStart(cell)
    setSelEnd(cell)
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!selecting || !selStart) return
    const rawCell = getCellFromPoint(e.clientX, e.clientY)
    if (!rawCell) return
    setSelEnd(snapEnd(selStart, rawCell))
  }, [selecting, selStart])

  const handlePointerUp = useCallback(() => {
    if (!selecting || !selStart || !selEnd) {
      setSelecting(false)
      return
    }
    setSelecting(false)

    const selectedCells = getCellsInLine(selStart, selEnd)
    const selectedWord  = selectedCells.map(([r, c]) => grid[r][c]).join('')
    const reversed      = selectedWord.split('').reverse().join('')

    const match = placedWords.find(
      pw => !foundWords.has(pw.word) && (pw.word === selectedWord || pw.word === reversed)
    )
    if (match) {
      onWordFound(match.word, selectedCells)
    }

    setSelStart(null)
    setSelEnd(null)
  }, [selecting, selStart, selEnd, grid, placedWords, foundWords, onWordFound])

  // Active selection
  const activeCellKeys = new Set<string>()
  if (selecting && selStart && selEnd) {
    getCellsInLine(selStart, selEnd).forEach(([r, c]) => activeCellKeys.add(cellKey(r, c)))
  }

  return (
    <div
      ref={containerRef}
      className="select-none"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        touchAction: 'none',
        gap: '3px',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {grid.map((row, r) =>
        row.map((letter, c) => {
          const key = cellKey(r, c)
          const isActive = activeCellKeys.has(key)
          const foundColor = foundCellColorMap.get(key)
          const isFound = !!foundColor

          let cls =
            'w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg font-display font-bold text-sm cursor-pointer transition-all duration-100 '
          if (isActive)      cls += 'bg-primary text-on-primary scale-110 shadow-md'
          else if (isFound)  cls += foundColor
          else               cls += 'bg-surface-container-low text-on-surface hover:bg-surface-container'

          return (
            <div
              key={key}
              data-r={r}
              data-c={c}
              className={cls}
            >
              {letter}
            </div>
          )
        })
      )}
    </div>
  )
}
