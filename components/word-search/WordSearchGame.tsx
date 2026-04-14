'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'
import { WORD_BANK, ALPHABETS } from '@/lib/word-search/word-bank'
import type { Locale } from '@/types/quiz'

// ─── Constants ────────────────────────────────────────────────────────────────
const GRID_ROWS = 10
const GRID_COLS = 8
const WORDS_PER_GAME = 8
const SCORE_PER_WORD = 100
const TIME_MALUS_INTERVAL = 5000
const MALUS_AMOUNT = 1

// ─── Types ────────────────────────────────────────────────────────────────────
interface PuzzleWord {
  /** Normalised uppercase key used for matching */
  cleanText: string
  /** Display text shown to the user (with accents / original script) */
  displayText: string
  emoji: string
  found: boolean
  start?: { r: number; c: number }
  end?: { r: number; c: number }
}

interface GameProps {
  /**
   * Optional: words from the DB puzzle.
   * If provided, the game uses these words (instead of WORD_BANK).
   * Each entry: { text: uppercase normalised, display: original display, emoji? }
   */
  seedWords?: { text: string; displayText: string; emoji?: string }[]
  puzzleTitle?: string
  puzzleDescription?: string
  shareUrl?: string
}

// ─── UI labels ────────────────────────────────────────────────────────────────
const UI: Record<string, {
  modalTitle: string; easyTitle: string; easyDesc: string
  hardTitle: string; hardDesc: string; score: string
  win: string; found: string; replay: string; changeLang: string; share: string
  shareText: string; closeBtn: string
}> = {
  fr: {
    modalTitle: 'Choisissez la difficulté',
    easyTitle: 'Facile', easyDesc: 'Les mots vont de gauche à droite, de haut en bas, et en diagonale normale.',
    hardTitle: 'Difficile', hardDesc: 'Les mots peuvent aller dans toutes les directions, même à l\'envers !',
    score: 'Score', win: 'Bravo ! 🎉', found: 'Tu as trouvé tous les mots !',
    replay: 'Nouvelle Grille', changeLang: 'Changer de Langue', share: '🔗 Partager',
    shareText: 'Jouez aux mots mêlés chrétiens sur', closeBtn: '✕',
  },
  en: {
    modalTitle: 'Choose Difficulty',
    easyTitle: 'Easy', easyDesc: 'Words go left to right, top to bottom, and normal diagonal.',
    hardTitle: 'Hard', hardDesc: 'Words can go in all directions, even backwards!',
    score: 'Score', win: 'Well done! 🎉', found: 'You found all the words!',
    replay: 'New Grid', changeLang: 'Change Language', share: '🔗 Share',
    shareText: 'Play Christian Word Search at', closeBtn: '✕',
  },
  pt: {
    modalTitle: 'Escolha a Dificuldade',
    easyTitle: 'Fácil', easyDesc: 'Palavras vão da esquerda para a direita, de cima para baixo e diagonal normal.',
    hardTitle: 'Difícil', hardDesc: 'Palavras podem ir em todas as direções, até de trás para frente!',
    score: 'Pontuação', win: 'Parabéns! 🎉', found: 'Você encontrou todas as palavras!',
    replay: 'Nova Grade', changeLang: 'Mudar Idioma', share: '🔗 Compartilhar',
    shareText: 'Jogue Caça-Palavras Cristão em', closeBtn: '✕',
  },
  th: {
    modalTitle: 'เลือกระดับความยาก',
    easyTitle: 'ง่าย', easyDesc: 'คำศัพท์เรียงจากซ้ายไปขวา บนลงล่าง และแนวทแยงปกติ',
    hardTitle: 'ยาก', hardDesc: 'คำศัพท์สามารถเรียงได้ทุกทิศทาง แม้กระทั่งย้อนกลับ!',
    score: 'คะแนน', win: 'ยินดีด้วย! 🎉', found: 'คุณพบคำทั้งหมดแล้ว!',
    replay: 'ตารางใหม่', changeLang: 'เปลี่ยนภาษา', share: '🔗 แชร์',
    shareText: 'เล่นเกมค้นหาคำศัพท์คริสเตียนที่', closeBtn: '✕',
  },
}

const LANG_MAP: Record<string, string> = { fr: 'fr-FR', en: 'en-US', pt: 'pt-BR', th: 'th-TH' }

// ─── Grid Generation ──────────────────────────────────────────────────────────
function normaliseWord(text: string, lang: string): string {
  if (lang === 'th') return text.replace(/\s+/g, '')
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, '')
}

function generatePuzzle(
  locale: string,
  difficulty: 'easy' | 'hard',
  seedWords?: { text: string; displayText: string; emoji?: string }[],
): { grid: string[][]; words: PuzzleWord[] } {
  const lang = locale in WORD_BANK ? locale : 'fr'

  // Select words
  let selected: PuzzleWord[]
  if (seedWords && seedWords.length > 0) {
    selected = seedWords.slice(0, WORDS_PER_GAME).map(w => ({
      cleanText: w.text, // already normalised from DB
      displayText: w.displayText,
      emoji: w.emoji ?? '📖',
      found: false,
    }))
  } else {
    const pool = [...(WORD_BANK[lang] ?? WORD_BANK.fr)].sort(() => 0.5 - Math.random())
    selected = pool.slice(0, WORDS_PER_GAME).map(w => ({
      cleanText: normaliseWord(w.text, lang),
      displayText: w.text,
      emoji: w.emoji,
      found: false,
    }))
  }

  // Sort longest first for placement
  selected.sort((a, b) => b.cleanText.length - a.cleanText.length)

  // Grid
  const grid: string[][] = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(''))

  const directions =
    difficulty === 'easy'
      ? [{ dr: 0, dc: 1 }, { dr: 1, dc: 0 }, { dr: 1, dc: 1 }]
      : [
          { dr: 0, dc: 1 }, { dr: 0, dc: -1 },
          { dr: 1, dc: 0 }, { dr: -1, dc: 0 },
          { dr: 1, dc: 1 }, { dr: 1, dc: -1 },
          { dr: -1, dc: 1 }, { dr: -1, dc: -1 },
        ]

  for (const word of selected) {
    let placed = false
    for (let attempt = 0; attempt < 150 && !placed; attempt++) {
      const dir = directions[Math.floor(Math.random() * directions.length)]
      const w = word.cleanText
      const startR = Math.floor(Math.random() * GRID_ROWS)
      const startC = Math.floor(Math.random() * GRID_COLS)
      const endR = startR + dir.dr * (w.length - 1)
      const endC = startC + dir.dc * (w.length - 1)
      if (endR < 0 || endR >= GRID_ROWS || endC < 0 || endC >= GRID_COLS) continue
      let ok = true
      for (let i = 0; i < w.length; i++) {
        const r = startR + dir.dr * i
        const c = startC + dir.dc * i
        if (grid[r][c] !== '' && grid[r][c] !== w[i]) { ok = false; break }
      }
      if (ok) {
        for (let i = 0; i < w.length; i++) {
          grid[startR + dir.dr * i][startC + dir.dc * i] = w[i]
        }
        word.start = { r: startR, c: startC }
        word.end = { r: endR, c: endC }
        placed = true
      }
    }
  }

  // Fill empty
  const alphabet = ALPHABETS[lang] ?? ALPHABETS.fr
  for (let r = 0; r < GRID_ROWS; r++)
    for (let c = 0; c < GRID_COLS; c++)
      if (grid[r][c] === '')
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)]

  return { grid, words: selected.filter(w => w.start) }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function cellsInLine(
  start: { r: number; c: number },
  end: { r: number; c: number },
): { r: number; c: number }[] {
  const dr = Math.sign(end.r - start.r)
  const dc = Math.sign(end.c - start.c)
  const steps = Math.max(Math.abs(end.r - start.r), Math.abs(end.c - start.c))
  return Array.from({ length: steps + 1 }, (_, i) => ({ r: start.r + dr * i, c: start.c + dc * i }))
}

function snapEnd(
  start: { r: number; c: number },
  raw: { r: number; c: number },
): { r: number; c: number } {
  const dr = raw.r - start.r
  const dc = raw.c - start.c
  const absDr = Math.abs(dr)
  const absDc = Math.abs(dc)
  if (absDr === 0 || absDc === 0) return raw
  if (absDr === absDc) return raw
  if (absDr < absDc / 2) return { r: start.r, c: raw.c }
  if (absDc < absDr / 2) return { r: raw.r, c: start.c }
  const dist = Math.min(absDr, absDc)
  return { r: start.r + Math.sign(dr) * dist, c: start.c + Math.sign(dc) * dist }
}

const FOUND_COLORS = [
  'bg-emerald-300', 'bg-amber-300', 'bg-sky-300',
  'bg-violet-300', 'bg-rose-300', 'bg-orange-300',
  'bg-teal-300', 'bg-pink-300', 'bg-lime-300', 'bg-indigo-300',
]

// ─── Component ────────────────────────────────────────────────────────────────
export function WordSearchGame({ seedWords, puzzleTitle, puzzleDescription, shareUrl }: GameProps) {
  const { locale } = useLanguage()
  const lang = locale as Locale
  const t = UI[lang] ?? UI.fr

  // Phase: 'difficulty' | 'playing' | 'won'
  const [phase, setPhase] = useState<'difficulty' | 'playing' | 'won'>('difficulty')
  const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy')
  const [grid, setGrid] = useState<string[][]>([])
  const [words, setWords] = useState<PuzzleWord[]>([])
  const [foundColors, setFoundColors] = useState<Map<string, string>>(new Map())
  const [score, setScore] = useState(0)
  const [hydrated, setHydrated] = useState(false)

  // Pointer selection state
  const [selStart, setSelStart] = useState<{ r: number; c: number } | null>(null)
  const [selEnd, setSelEnd] = useState<{ r: number; c: number } | null>(null)
  const isSelecting = useRef(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const scoreRef = useRef(0)
  const wordsFoundRef = useRef(0)

  // Hydration guard
  useEffect(() => { setHydrated(true) }, [])

  // Start a new game with chosen difficulty
  function startGame(diff: 'easy' | 'hard') {
    if (timerRef.current) clearInterval(timerRef.current)
    scoreRef.current = 0
    wordsFoundRef.current = 0
    setScore(0)
    setFoundColors(new Map())
    setSelStart(null)
    setSelEnd(null)

    const { grid: g, words: w } = generatePuzzle(lang, diff, seedWords)
    setGrid(g)
    setWords(w)
    setDifficulty(diff)
    setPhase('playing')

    timerRef.current = setInterval(() => {
      if (scoreRef.current > 0 && wordsFoundRef.current < w.length) {
        scoreRef.current = Math.max(0, scoreRef.current - MALUS_AMOUNT)
        setScore(scoreRef.current)
      }
    }, TIME_MALUS_INTERVAL)
  }

  // Regenerate when locale changes
  useEffect(() => {
    if (phase === 'playing') startGame(difficulty)
  }, [lang]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  // ── Pointer events ────────────────────────────────────────────────────────
  const getCellAt = useCallback((x: number, y: number): { r: number; c: number } | null => {
    const el = document.elementFromPoint(x, y) as HTMLElement | null
    const r = el?.dataset?.r
    const c = el?.dataset?.c
    if (r == null || c == null) return null
    return { r: parseInt(r), c: parseInt(c) }
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const cell = getCellAt(e.clientX, e.clientY)
    if (!cell) return
    e.preventDefault()
    ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
    isSelecting.current = true
    setSelStart(cell)
    setSelEnd(cell)
  }, [getCellAt])

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isSelecting.current || !selStart) return
    const raw = getCellAt(e.clientX, e.clientY)
    if (!raw) return
    const snapped = snapEnd(selStart, raw)
    const clamped = {
      r: Math.max(0, Math.min(GRID_ROWS - 1, snapped.r)),
      c: Math.max(0, Math.min(GRID_COLS - 1, snapped.c)),
    }
    setSelEnd(clamped)
  }, [getCellAt, selStart])

  const handlePointerUp = useCallback(() => {
    if (!isSelecting.current || !selStart || !selEnd) {
      isSelecting.current = false
      setSelStart(null)
      setSelEnd(null)
      return
    }
    isSelecting.current = false

    const selected = cellsInLine(selStart, selEnd)
    const selectedWord = selected.map(({ r, c }) => grid[r]?.[c] ?? '').join('')
    const reversed = selectedWord.split('').reverse().join('')

    const match = words.find(w => !w.found && (w.cleanText === selectedWord || w.cleanText === reversed))
    if (match) {
      match.found = true
      scoreRef.current += SCORE_PER_WORD
      wordsFoundRef.current++
      setScore(scoreRef.current)

      const colorIdx = words.indexOf(match)
      const color = FOUND_COLORS[colorIdx % FOUND_COLORS.length]
      setFoundColors(prev => {
        const next = new Map(prev)
        selected.forEach(({ r, c }) => next.set(`${r},${c}`, color))
        return next
      })
      setWords([...words])

      if (wordsFoundRef.current === words.length) {
        if (timerRef.current) clearInterval(timerRef.current)
        setTimeout(() => setPhase('won'), 500)
      }
    }

    setSelStart(null)
    setSelEnd(null)
  }, [selStart, selEnd, grid, words])

  // ── Speech synthesis ──────────────────────────────────────────────────────
  function speak(text: string) {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = LANG_MAP[lang] ?? 'fr-FR'
    window.speechSynthesis.speak(utt)
  }

  // ── Share ─────────────────────────────────────────────────────────────────
  function handleShare() {
    const url = shareUrl ?? 'https://minilek.com/mots-meles'
    const text = `${t.shareText} ${url}`
    if (navigator.share) {
      navigator.share({ title: 'Minilek Mots Mêlés', text, url }).catch(() => null)
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  if (!hydrated) return null

  // ── Active selection cells ────────────────────────────────────────────────
  const activeCells = new Set<string>()
  if (isSelecting.current && selStart && selEnd) {
    cellsInLine(selStart, selEnd).forEach(({ r, c }) => activeCells.add(`${r},${c}`))
  }

  // ── DIFFICULTY MODAL ──────────────────────────────────────────────────────
  if (phase === 'difficulty') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="bg-white rounded-[2rem] p-8 max-w-2xl w-full shadow-2xl relative">
          <Link
            href="/"
            className="absolute top-4 left-4 text-sm font-display font-semibold px-3 py-1.5 rounded-full bg-[#ECF0F1] text-[#2C3E50]/60 hover:text-[#2C3E50] transition-all"
          >
            🏠
          </Link>
          {puzzleTitle && (
            <div className="text-center mb-6">
              <p className="font-display text-2xl font-bold text-on-surface">{puzzleTitle}</p>
              {puzzleDescription && (
                <p className="font-body text-sm text-on-surface/60 mt-1">{puzzleDescription}</p>
              )}
            </div>
          )}
          <h2 className="font-display text-xl font-bold text-center mb-6 text-[#2C3E50]">
            {t.modalTitle}
          </h2>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => startGame('easy')}
              className="flex-1 min-w-[200px] bg-[#E8F8F5] border-2 border-[#A2D9CE] hover:border-[#19A69C] rounded-[1.5rem] p-6 flex flex-col items-center gap-3 transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer"
            >
              <span className="text-4xl">🟢</span>
              <h3 className="font-display font-bold text-lg text-[#2C3E50]">{t.easyTitle}</h3>
              <p className="font-body text-sm text-[#2C3E50]/70 text-center">{t.easyDesc}</p>
              <span className="font-bold text-xl tracking-widest text-[#19A69C]">→ ↓ ↘</span>
            </button>
            <button
              onClick={() => startGame('hard')}
              className="flex-1 min-w-[200px] bg-[#FDEDEC] border-2 border-[#F5B7B1] hover:border-red-500 rounded-[1.5rem] p-6 flex flex-col items-center gap-3 transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer"
            >
              <span className="text-4xl">🔴</span>
              <h3 className="font-display font-bold text-lg text-[#2C3E50]">{t.hardTitle}</h3>
              <p className="font-body text-sm text-[#2C3E50]/70 text-center">{t.hardDesc}</p>
              <span className="font-bold text-xl tracking-widest text-red-500">→ ← ↓ ↑ ↘ ↗</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── GAME ──────────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      {/* Score bar */}
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="font-display font-bold text-[#19A69C] text-lg">
          {t.score}: {score}
        </span>
        <div className="flex gap-2">
          <Link
            href="/"
            className="text-xs font-display font-semibold px-3 py-1.5 rounded-full bg-surface-container text-on-surface/60 hover:text-on-surface transition-all"
          >
            🏠
          </Link>
          <button
            onClick={() => setPhase('difficulty')}
            className="text-xs font-display font-semibold px-3 py-1.5 rounded-full bg-surface-container text-on-surface/60 hover:text-on-surface transition-all"
          >
            ⚙️
          </button>
          <button
            onClick={() => startGame(difficulty)}
            className="text-xs font-display font-semibold px-3 py-1.5 rounded-full bg-surface-container text-on-surface/60 hover:text-on-surface transition-all"
          >
            🔄
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Word list — shown above grid on mobile */}
        <div className="w-full sm:w-48 sm:shrink-0 order-first sm:order-last">
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-1.5">
            {words.map((w) => (
              <div
                key={w.cleanText}
                className={`flex items-center justify-between px-3 py-2 rounded-xl font-body text-sm font-medium transition-all
                  ${w.found
                    ? 'bg-[#e0f2f1] text-[#19A69C]/70 line-through opacity-70'
                    : 'bg-[#ECF0F1] text-[#2C3E50]'
                  }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <span>{w.emoji}</span>
                  <span className="truncate">{w.displayText}</span>
                </span>
                <button
                  onClick={() => speak(w.displayText)}
                  className="ml-1 shrink-0 text-base opacity-50 hover:opacity-100 transition-opacity"
                  aria-label="Écouter"
                >
                  🔊
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 flex justify-center overflow-auto">
          <div
            ref={gridRef}
            className="select-none touch-none rounded-[1rem] bg-[#ECF0F1] p-2"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
              gap: '3px',
              touchAction: 'none',
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {grid.map((row, r) =>
              row.map((letter, c) => {
                const key = `${r},${c}`
                const isActive = activeCells.has(key)
                const foundColor = foundColors.get(key)

                let cls =
                  'w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg font-display font-bold text-sm sm:text-base cursor-pointer transition-all duration-100 select-none '
                if (isActive)
                  cls += 'bg-[#F2C94C] text-white scale-110 shadow-md'
                else if (foundColor)
                  cls += `${foundColor} text-white`
                else
                  cls += 'bg-white text-[#2C3E50] hover:scale-105'

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
        </div>
      </div>

      {/* Victory Modal */}
      {phase === 'won' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl relative text-center">
            <button
              onClick={() => startGame(difficulty)}
              className="absolute top-4 right-4 text-lg text-[#2C3E50]/50 hover:text-[#2C3E50] transition-colors"
            >
              ✕
            </button>

            <div className="flex flex-col items-center gap-2 mb-4">
              <img
                src="https://minilek.com/wp-content/uploads/2025/11/minilek-miniature.svg"
                alt="Minilek"
                className="h-16 w-auto"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
              <h2 className="font-display text-2xl font-bold text-[#2C3E50]">{t.win}</h2>
            </div>

            <p className="font-body text-[#2C3E50]/60 mb-4">{t.found}</p>
            <p className="font-display font-bold text-[#19A69C] text-xl mb-6">{t.score}: {score}</p>

            <div className="grid grid-cols-2 gap-2 mb-6 max-h-52 overflow-y-auto">
              {words.map(w => (
                <div
                  key={w.cleanText}
                  className="bg-[#19A69C] text-white rounded-lg py-2 px-3 flex items-center gap-1.5 text-sm font-body font-medium"
                >
                  <span>{w.emoji}</span>
                  <span className="truncate">{w.displayText}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleShare}
                className="w-full py-2.5 rounded-xl font-display font-semibold border border-[#19A69C] text-[#19A69C] hover:bg-[#e0f2f1] transition-colors"
              >
                {t.share}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => startGame(difficulty)}
                  className="flex-1 py-2.5 rounded-xl font-display font-semibold bg-[#19A69C] text-white hover:bg-[#148a81] transition-colors"
                >
                  {t.replay}
                </button>
                <button
                  onClick={() => setPhase('difficulty')}
                  className="flex-1 py-2.5 rounded-xl font-display font-semibold border border-[#ccc] text-[#666] hover:bg-[#f5f5f5] transition-colors"
                >
                  ⚙️
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
