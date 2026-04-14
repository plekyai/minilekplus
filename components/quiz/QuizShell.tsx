'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import type { Locale, Parcours, Question, QuizStep } from '@/types/quiz'
import { useLanguage } from '@/lib/i18n/context'
import { getQuizLabels } from '@/lib/i18n/quiz-labels'
import { useAudio, type AudioKey } from '@/hooks/useAudio'
import { useQuizSession } from '@/hooks/useQuizSession'
import { StoryStep } from '@/components/quiz/StoryStep'
import { MCQStep } from '@/components/quiz/MCQStep'
import { ParentsStep } from '@/components/quiz/ParentsStep'
import { PrayerStep } from '@/components/quiz/PrayerStep'
import { VideoStep } from '@/components/quiz/VideoStep'
import { EndStep } from '@/components/quiz/EndStep'
import type { QuizLabels } from '@/lib/i18n/quiz-labels'

// Skips the video step automatically if no youtube_url is set
function VideoStepOrSkip({ parcours, locale, labels, onNext }: {
  parcours: Parcours; locale: Locale; labels: QuizLabels; onNext: () => void
}) {
  useEffect(() => {
    if (!parcours.youtube_url) onNext()
  }, [parcours.youtube_url]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!parcours.youtube_url) return null
  return <VideoStep parcours={parcours} locale={locale} labels={labels} onNext={onNext} />
}

const STEP_AUDIO: Record<string, AudioKey> = {
  story:      'generique',
  facile:     'facile',
  moyenne:    'moyenne',
  impossible: 'difficile',
  parents:    'parents',
  priere:     'priere',
}

const QUIZ_STEPS = [
  { key: 'facile',     label: '⭐ Facile'        },
  { key: 'moyenne',    label: '⭐⭐ Moyenne'      },
  { key: 'impossible', label: '⭐⭐⭐ Impossible' },
  { key: 'parents',    label: '👑 Parents'        },
] as const

interface QuizShellProps {
  parcours: Parcours
  questions: Question[]
}

export function QuizShell({ parcours, questions }: QuizShellProps) {
  const { locale } = useLanguage()
  const labels = getQuizLabels(locale as Locale)
  const { playing, toggleBackground, switchStep, playOnce } = useAudio(parcours.audio_urls)
  const { session, hydrated, answer, nextQuestion, goToStep, nextStep, reset } = useQuizSession(parcours.id)

  const byType = (type: string) => questions.filter(q => q.type === type)
  const facileQs     = byType('facile')
  const moyenneQs    = byType('moyenne')
  const impossibleQs = byType('impossible')
  const parentsQs    = byType('parents')
  const totalMCQ     = facileQs.length + moyenneQs.length + impossibleQs.length

  // When step changes, stop background so user re-clicks to play
  useEffect(() => {
    const key = STEP_AUDIO[session.step]
    if (key) switchStep(key)
  }, [session.step]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleMCQAnswer(questionId: string, choiceIndex: number, isCorrect: boolean) {
    answer(questionId, choiceIndex, isCorrect)
    // Jingles play automatically
    playOnce(isCorrect ? 'correct' : 'wrong')

    const stepQs =
      session.step === 'facile'   ? facileQs
      : session.step === 'moyenne' ? moyenneQs
      : impossibleQs

    setTimeout(() => {
      if (session.question_index + 1 < stepQs.length) {
        nextQuestion()
      } else {
        nextStep()
      }
    }, 950)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleParentsNext(questionId: string) {
    if (session.question_index + 1 < parentsQs.length) {
      nextQuestion()
    } else {
      nextStep()
    }
  }

  if (!hydrated) return null

  const { step, question_index } = session
  const currentAudioKey = STEP_AUDIO[step]
  const showQuizNav = (['facile', 'moyenne', 'impossible', 'parents'] as QuizStep[]).includes(step as QuizStep)

  return (
    <div className="relative min-h-screen">

      {/* ── Barre de navigation quiz (sections + bouton son + retours) ── */}
      {showQuizNav && (
        <nav className="sticky top-[60px] z-40 bg-surface/95 backdrop-blur-md border-b border-surface-container">
          {/* Ligne 1 : retour histoire + retour liste + son */}
          <div className="flex items-center justify-between px-3 pt-2 pb-1 max-w-2xl mx-auto gap-2">
            <button
              onClick={() => goToStep('story')}
              className="flex items-center gap-1 text-xs font-body text-on-surface/60 hover:text-primary transition-colors"
            >
              ← Histoire
            </button>

            <button
              onClick={() => toggleBackground(currentAudioKey)}
              className={`flex items-center gap-1 text-xs font-display font-semibold px-3 py-1 rounded-full transition-all
                ${playing
                  ? 'bg-primary text-on-primary shadow-ambient'
                  : 'bg-surface-container text-on-surface/60 hover:text-primary'
                }`}
              aria-label={playing ? 'Couper la musique' : 'Lancer la musique'}
            >
              {playing ? '🔊 Son ON' : '🔇 Son OFF'}
            </button>

            <Link
              href="/culte-familial"
              className="flex items-center gap-1 text-xs font-body text-on-surface/60 hover:text-primary transition-colors"
            >
              📚 Cultes
            </Link>
          </div>

          {/* Ligne 2 : navigation entre types de questions */}
          <div className="flex items-center gap-1 px-2 pb-2 max-w-2xl mx-auto">
            {QUIZ_STEPS.map(({ key, label }) => {
              const isActive = step === key
              return (
                <button
                  key={key}
                  onClick={() => goToStep(key as QuizStep)}
                  className={`flex-1 rounded-full px-2 py-1.5 text-xs font-display font-semibold transition-all
                    ${isActive
                      ? 'bg-primary text-on-primary shadow-ambient'
                      : 'bg-surface-container text-on-surface/60 hover:bg-surface-container-lowest hover:text-on-surface'
                    }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </nav>
      )}

      {step === 'story' && (
        <StoryStep
          parcours={parcours}
          locale={locale as Locale}
          labels={labels}
          onStart={nextStep}
        />
      )}

      {step === 'facile' && facileQs.length > 0 && (
        <MCQStep
          questions={facileQs}
          currentIndex={question_index}
          locale={locale as Locale}
          labels={labels}
          onAnswer={handleMCQAnswer}
        />
      )}

      {step === 'moyenne' && moyenneQs.length > 0 && (
        <MCQStep
          questions={moyenneQs}
          currentIndex={question_index}
          locale={locale as Locale}
          labels={labels}
          onAnswer={handleMCQAnswer}
        />
      )}

      {step === 'impossible' && impossibleQs.length > 0 && (
        <div className="min-h-screen bg-inverse-surface">
          <MCQStep
            questions={impossibleQs}
            currentIndex={question_index}
            locale={locale as Locale}
            labels={labels}
            onAnswer={handleMCQAnswer}
            inverted
          />
        </div>
      )}

      {step === 'parents' && parentsQs.length > 0 && (
        <ParentsStep
          questions={parentsQs}
          currentIndex={question_index}
          locale={locale as Locale}
          labels={labels}
          onNext={handleParentsNext}
        />
      )}

      {step === 'priere' && (
        <PrayerStep
          parcours={parcours}
          locale={locale as Locale}
          labels={labels}
          onNext={nextStep}
        />
      )}

      {step === 'video' && (
        <VideoStepOrSkip
          parcours={parcours}
          locale={locale as Locale}
          labels={labels}
          onNext={nextStep}
        />
      )}

      {step === 'fin' && (
        <EndStep
          score={session.score}
          totalMCQ={totalMCQ}
          locale={locale as Locale}
          labels={labels}
          onReset={reset}
        />
      )}
    </div>
  )
}
