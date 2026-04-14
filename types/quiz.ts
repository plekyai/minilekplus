export type Locale = 'fr' | 'en' | 'pt' | 'th'
export type TranslationStatus = 'source' | 'ai' | 'verified'
export type QuizStep = 'story' | 'facile' | 'moyenne' | 'impossible' | 'parents' | 'priere' | 'fin'
export const QUIZ_STEP_ORDER: QuizStep[] = ['story', 'facile', 'moyenne', 'impossible', 'parents', 'priere', 'fin']

export interface ParcoursTranslation {
  title: string
  story_text: string
  prayer_text: string
  translation_status: TranslationStatus
}

export interface AudioUrls {
  generique?: string
  facile?: string
  moyenne?: string
  difficile?: string
  parents?: string
  priere?: string
  correct?: string
  wrong?: string
}

export interface Parcours {
  id: string
  slug: string
  translations: Partial<Record<Locale, ParcoursTranslation>>
  image_url: string | null
  audio_urls: AudioUrls
  tags: string[]
  difficulty: 'debutant' | 'intermediaire' | 'avance'
  tier: 'free' | 'premium'
  published: boolean
  created_at: string
  updated_at: string
}

export interface QuestionTranslation {
  question: string
  choices: [string, string, string, string] | null
  correct_index: number | null
  explanation: string | null
  translation_status: TranslationStatus
}

export interface Question {
  id: string
  parcours_id: string
  type: 'facile' | 'moyenne' | 'impossible' | 'parents'
  order_index: number
  translations: Partial<Record<Locale, QuestionTranslation>>
  created_at: string
}

export interface QuizSessionState {
  parcours_id: string
  step: QuizStep
  question_index: number
  answers: Record<string, number>
  score: number
  completed_at: string | null
}
