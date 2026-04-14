import { render, screen, fireEvent } from '@testing-library/react'
import { MCQStep } from '@/components/quiz/MCQStep'
import type { Question } from '@/types/quiz'
import { getQuizLabels } from '@/lib/i18n/quiz-labels'

const labels = getQuizLabels('fr')

const question: Question = {
  id: 'q1',
  parcours_id: 'p1',
  type: 'facile',
  order_index: 0,
  translations: {
    fr: {
      question: 'Combien de pièces possédait-elle ?',
      choices: ['5 pièces', '7 pièces', '10 pièces', '12 pièces'],
      correct_index: 2,
      explanation: 'Elle avait 10 pièces.',
      translation_status: 'source',
    },
  },
  created_at: '2026-01-01T00:00:00Z',
}

const mockOnAnswer = jest.fn()

beforeEach(() => { mockOnAnswer.mockClear() })

test('renders question text', () => {
  render(
    <MCQStep
      questions={[question]}
      currentIndex={0}
      locale="fr"
      onAnswer={mockOnAnswer}
      labels={labels}
    />
  )
  expect(screen.getByText('Combien de pièces possédait-elle ?')).toBeInTheDocument()
})

test('renders 4 choices', () => {
  render(
    <MCQStep
      questions={[question]}
      currentIndex={0}
      locale="fr"
      onAnswer={mockOnAnswer}
      labels={labels}
    />
  )
  expect(screen.getByText('5 pièces')).toBeInTheDocument()
  expect(screen.getByText('10 pièces')).toBeInTheDocument()
})

test('clicking a choice calls onAnswer', () => {
  jest.useFakeTimers()
  render(
    <MCQStep
      questions={[question]}
      currentIndex={0}
      locale="fr"
      onAnswer={mockOnAnswer}
      labels={labels}
    />
  )
  fireEvent.click(screen.getByText('10 pièces'))
  jest.runAllTimers()
  expect(mockOnAnswer).toHaveBeenCalledWith('q1', 2, true)
  jest.useRealTimers()
})

test('clicking wrong choice calls onAnswer with isCorrect=false', () => {
  jest.useFakeTimers()
  render(
    <MCQStep
      questions={[question]}
      currentIndex={0}
      locale="fr"
      onAnswer={mockOnAnswer}
      labels={labels}
    />
  )
  fireEvent.click(screen.getByText('5 pièces'))
  jest.runAllTimers()
  expect(mockOnAnswer).toHaveBeenCalledWith('q1', 0, false)
  jest.useRealTimers()
})

test('shows progress indicator', () => {
  render(
    <MCQStep
      questions={[question, question]}
      currentIndex={0}
      locale="fr"
      onAnswer={mockOnAnswer}
      labels={labels}
    />
  )
  expect(screen.getByText('Question 1 sur 2')).toBeInTheDocument()
})
