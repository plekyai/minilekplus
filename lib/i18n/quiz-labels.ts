import type { Locale } from '@/types/quiz'

export interface QuizLabels {
  start: string
  next: string
  checkAnswer: string
  correct: string
  incorrect: string
  parentsQuestion: string
  prayerTitle: string
  yourScore: string
  outOf: string
  scoreMessages: { min: number; max: number; message: string }[]
  nextStory: string
  backToList: string
  muteAudio: string
  unmuteAudio: string
  questionOf: (current: number, total: number) => string
  easyQuestions: string
  mediumQuestions: string
  hardQuestions: string
  writeYourAnswer: string
  continueBtn: string
  seeAnswer: string
  answerLabel: string
  // Section nav
  navStory: string
  navQuestions: string
  navVideo: string
  navPrayer: string
  // Quiz sub-nav
  navEasy: string
  navMedium: string
  navHard: string
  navParents: string
}

const labels: Record<Locale, QuizLabels> = {
  fr: {
    start: 'On commence !',
    next: 'Suivant',
    checkAnswer: 'Valider',
    correct: 'Bonne réponse !',
    incorrect: 'Pas tout à fait…',
    parentsQuestion: 'Question des parents',
    prayerTitle: 'Prière',
    yourScore: 'Votre score',
    outOf: 'sur',
    scoreMessages: [
      { min: 0, max: 4, message: 'Continue à chercher !' },
      { min: 5, max: 9, message: 'Bien joué !' },
      { min: 10, max: 13, message: 'Excellent !' },
    ],
    nextStory: 'Histoire suivante',
    backToList: 'Toutes les histoires',
    muteAudio: 'Couper le son',
    unmuteAudio: 'Activer le son',
    questionOf: (c, t) => `Question ${c} sur ${t}`,
    easyQuestions: 'Questions faciles',
    mediumQuestions: 'Questions moyennes',
    hardQuestions: 'Questions impossibles',
    writeYourAnswer: 'Écrivez votre réponse…',
    continueBtn: 'Continuer',
    seeAnswer: '👁 Voir la réponse',
    answerLabel: '💡 Réponse',
    navStory: '📖 Histoire',
    navQuestions: '⭐ Questions',
    navVideo: '🎬 Vidéo',
    navPrayer: '🕯️ Prière',
    navEasy: '⭐ Facile',
    navMedium: '⭐⭐ Moyenne',
    navHard: '⭐⭐⭐ Impossible',
    navParents: '👑 Parents',
  },
  en: {
    start: "Let's go!",
    next: 'Next',
    checkAnswer: 'Submit',
    correct: 'Correct!',
    incorrect: 'Not quite…',
    parentsQuestion: "Parents' question",
    prayerTitle: 'Prayer',
    yourScore: 'Your score',
    outOf: 'out of',
    scoreMessages: [
      { min: 0, max: 4, message: 'Keep searching!' },
      { min: 5, max: 9, message: 'Well done!' },
      { min: 10, max: 13, message: 'Excellent!' },
    ],
    nextStory: 'Next story',
    backToList: 'All stories',
    muteAudio: 'Mute audio',
    unmuteAudio: 'Unmute audio',
    questionOf: (c, t) => `Question ${c} of ${t}`,
    easyQuestions: 'Easy questions',
    mediumQuestions: 'Medium questions',
    hardQuestions: 'Impossible questions',
    writeYourAnswer: 'Write your answer…',
    continueBtn: 'Continue',
    seeAnswer: '👁 See the answer',
    answerLabel: '💡 Answer',
    navStory: '📖 Story',
    navQuestions: '⭐ Questions',
    navVideo: '🎬 Video',
    navPrayer: '🕯️ Prayer',
    navEasy: '⭐ Easy',
    navMedium: '⭐⭐ Medium',
    navHard: '⭐⭐⭐ Impossible',
    navParents: '👑 Parents',
  },
  pt: {
    start: 'Vamos começar!',
    next: 'Próximo',
    checkAnswer: 'Confirmar',
    correct: 'Correto!',
    incorrect: 'Não exatamente…',
    parentsQuestion: 'Pergunta dos pais',
    prayerTitle: 'Oração',
    yourScore: 'Sua pontuação',
    outOf: 'de',
    scoreMessages: [
      { min: 0, max: 4, message: 'Continue procurando!' },
      { min: 5, max: 9, message: 'Muito bem!' },
      { min: 10, max: 13, message: 'Excelente!' },
    ],
    nextStory: 'Próxima história',
    backToList: 'Todas as histórias',
    muteAudio: 'Silenciar áudio',
    unmuteAudio: 'Ativar áudio',
    questionOf: (c, t) => `Pergunta ${c} de ${t}`,
    easyQuestions: 'Perguntas fáceis',
    mediumQuestions: 'Perguntas médias',
    hardQuestions: 'Perguntas impossíveis',
    writeYourAnswer: 'Escreva sua resposta…',
    continueBtn: 'Continuar',
    seeAnswer: '👁 Ver a resposta',
    answerLabel: '💡 Resposta',
    navStory: '📖 História',
    navQuestions: '⭐ Perguntas',
    navVideo: '🎬 Vídeo',
    navPrayer: '🕯️ Oração',
    navEasy: '⭐ Fácil',
    navMedium: '⭐⭐ Médio',
    navHard: '⭐⭐⭐ Impossível',
    navParents: '👑 Pais',
  },
  th: {
    start: 'เริ่มเลย!',
    next: 'ถัดไป',
    checkAnswer: 'ยืนยัน',
    correct: 'ถูกต้อง!',
    incorrect: 'ไม่ค่อยถูก…',
    parentsQuestion: 'คำถามสำหรับผู้ปกครอง',
    prayerTitle: 'คำอธิษฐาน',
    yourScore: 'คะแนนของคุณ',
    outOf: 'จาก',
    scoreMessages: [
      { min: 0, max: 4, message: 'ลองค้นหาต่อไป!' },
      { min: 5, max: 9, message: 'เก่งมาก!' },
      { min: 10, max: 13, message: 'ยอดเยี่ยม!' },
    ],
    nextStory: 'เรื่องถัดไป',
    backToList: 'ทุกเรื่อง',
    muteAudio: 'ปิดเสียง',
    unmuteAudio: 'เปิดเสียง',
    questionOf: (c, t) => `คำถามที่ ${c} จาก ${t}`,
    easyQuestions: 'คำถามง่าย',
    mediumQuestions: 'คำถามปานกลาง',
    hardQuestions: 'คำถามที่เป็นไปไม่ได้',
    writeYourAnswer: 'เขียนคำตอบของคุณ…',
    continueBtn: 'ดำเนินการต่อ',
    seeAnswer: '👁 ดูคำตอบ',
    answerLabel: '💡 คำตอบ',
    navStory: '📖 เรื่อง',
    navQuestions: '⭐ คำถาม',
    navVideo: '🎬 วิดีโอ',
    navPrayer: '🕯️ คำอธิษฐาน',
    navEasy: '⭐ ง่าย',
    navMedium: '⭐⭐ กลาง',
    navHard: '⭐⭐⭐ ยาก',
    navParents: '👑 ผู้ปกครอง',
  },
}

export function getQuizLabels(locale: Locale): QuizLabels {
  return labels[locale] ?? labels.fr
}

export function getScoreMessage(score: number, locale: Locale): string {
  const msgs = labels[locale]?.scoreMessages ?? labels.fr.scoreMessages
  return msgs.find(m => score >= m.min && score <= m.max)?.message ?? msgs[msgs.length - 1].message
}
