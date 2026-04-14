'use client'
import { useEffect } from 'react'
import type { Locale, Parcours, Question } from '@/types/quiz'
import { useLanguage } from '@/lib/i18n/context'
import { getQuizLabels } from '@/lib/i18n/quiz-labels'
import { useAudio, type AudioKey } from '@/hooks/useAudio'
import { useQuizSession } from '@/hooks/useQuizSession'
import { StoryStep } from '@/components/quiz/StoryStep'
import { MCQStep } from '@/components/quiz/MCQStep'
import { ParentsStep } from '@/components/quiz/ParentsStep'
import { PrayerStep } from '@/components/quiz/PrayerStep'
import { EndStep } from '@/components/quiz/EndStep'

const STEP_AUDIO: Record<string, string> = {
  story: 'generique',
  facile: 'facile',
  moyenne: 'moyenne',
  impossible: 'difficile',
  parents: 'parents',
  priere: 'priere',
}

interface QuizShellProps {
  parcours: Parcours
  questions: Question[]
}

export function QuizShell({ parcours, questions }: QuizShellProps) {
  const { locale } = useLanguage()
  const labels = getQuizLabels(locale as Locale)
  const { muted, playBackground, playOnce, toggleMute } = useAudio(parcours.audio_urls)
  const { session, hydrated, answer, nextQuestion, nextStep, reset } = useQuizSession(parcours.id)

  const byType = (type: string) => questions.filter(q => q.type === type)
  const facileQs = byType('facile')
  const moyenneQs = byType('moyenne')
  const impossibleQs = byType('impossible')
  const parentsQs = byType('parents')
  const totalMCQ = facileQs.length + moyenneQs.length + impossibleQs.length

  useEffect(() => {
    const key = STEP_AUDIO[session.step]
    if (key) playBackground(key as AudioKey)
  }, [session.step]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleMCQAnswer(questionId: string, choiceIndex: number, isCorrect: boolean) {
    answer(questionId, choiceIndex, isCorrect)
    playOnce(isCorrect ? 'correct' : 'wrong')

    const stepQs =
      session.step === 'facile' ? facileQs
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

  return (
    <div className="relative min-h-screen">
      <button
        onClick={toggleMute}
        className="fixed top-20 right-4 z-50 w-10 h-10 rounded-full bg-surface-container-lowest shadow-ambient flex items-center justify-center text-lg"
        aria-label={muted ? labels.unmuteAudio : labels.muteAudio}
      >
        {muted ? '🔇' : '🔊'}
      </button>

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
