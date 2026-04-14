import type { Locale } from '@/types/quiz'

export interface WordSearchLabels {
  wordsFound: (found: number, total: number) => string
  easyDiff: string
  hardDiff: string
  newGrid: string
  backToList: string
  congratsTitle: string
  replay: string
  otherPuzzles: string
  notAvailableInLang: string
}

const labels: Record<Locale, WordSearchLabels> = {
  fr: {
    wordsFound: (f, t) => `${f} / ${t} mots trouvés`,
    easyDiff: 'Facile',
    hardDiff: 'Difficile',
    newGrid: '🔄 Nouvelle grille',
    backToList: '← Mots Mêlés',
    congratsTitle: 'Bravo ! Tous les mots trouvés !',
    replay: 'Rejouer',
    otherPuzzles: 'Autres puzzles',
    notAvailableInLang: 'Puzzle non disponible dans cette langue.',
  },
  en: {
    wordsFound: (f, t) => `${f} / ${t} words found`,
    easyDiff: 'Easy',
    hardDiff: 'Hard',
    newGrid: '🔄 New grid',
    backToList: '← Word Search',
    congratsTitle: 'Congratulations! All words found!',
    replay: 'Play again',
    otherPuzzles: 'Other puzzles',
    notAvailableInLang: 'Puzzle not available in this language.',
  },
  pt: {
    wordsFound: (f, t) => `${f} / ${t} palavras encontradas`,
    easyDiff: 'Fácil',
    hardDiff: 'Difícil',
    newGrid: '🔄 Nova grelha',
    backToList: '← Caça-Palavras',
    congratsTitle: 'Parabéns! Todas as palavras encontradas!',
    replay: 'Jogar de novo',
    otherPuzzles: 'Outros puzzles',
    notAvailableInLang: 'Puzzle não disponível neste idioma.',
  },
  th: {
    wordsFound: (f, t) => `พบ ${f} / ${t} คำ`,
    easyDiff: 'ง่าย',
    hardDiff: 'ยาก',
    newGrid: '🔄 กริดใหม่',
    backToList: '← ค้นหาคำ',
    congratsTitle: 'ยินดีด้วย! พบทุกคำแล้ว!',
    replay: 'เล่นอีกครั้ง',
    otherPuzzles: 'ปริศนาอื่น ๆ',
    notAvailableInLang: 'ปริศนาไม่พร้อมใช้ในภาษานี้',
  },
}

export function getWordSearchLabels(locale: Locale): WordSearchLabels {
  return labels[locale] ?? labels.fr
}
