import { renderHook, act } from '@testing-library/react'
import { useQuizSession } from '@/hooks/useQuizSession'

const PARCOURS_ID = 'test-parcours-123'

beforeEach(() => {
  sessionStorage.clear()
})

test('initialises at story step with zero score', () => {
  const { result } = renderHook(() => useQuizSession(PARCOURS_ID))
  expect(result.current.session.step).toBe('story')
  expect(result.current.session.score).toBe(0)
})

test('answer increments score on correct answer', () => {
  const { result } = renderHook(() => useQuizSession(PARCOURS_ID))
  act(() => { result.current.answer('q1', 2, true) })
  expect(result.current.session.score).toBe(1)
  expect(result.current.session.answers['q1']).toBe(2)
})

test('answer does not increment score on wrong answer', () => {
  const { result } = renderHook(() => useQuizSession(PARCOURS_ID))
  act(() => { result.current.answer('q1', 1, false) })
  expect(result.current.session.score).toBe(0)
})

test('nextStep advances from story to facile', () => {
  const { result } = renderHook(() => useQuizSession(PARCOURS_ID))
  act(() => { result.current.nextStep() })
  expect(result.current.session.step).toBe('facile')
})

test('nextStep advances through all steps to fin', () => {
  const { result } = renderHook(() => useQuizSession(PARCOURS_ID))
  const steps = ['facile', 'moyenne', 'impossible', 'parents', 'priere', 'fin']
  for (const expected of steps) {
    act(() => { result.current.nextStep() })
    expect(result.current.session.step).toBe(expected)
  }
})

test('reset restores initial state', () => {
  const { result } = renderHook(() => useQuizSession(PARCOURS_ID))
  act(() => { result.current.answer('q1', 0, true) })
  act(() => { result.current.nextStep() })
  act(() => { result.current.reset() })
  expect(result.current.session.step).toBe('story')
  expect(result.current.session.score).toBe(0)
  expect(result.current.session.answers).toEqual({})
})

test('persists to sessionStorage', async () => {
  const { result } = renderHook(() => useQuizSession(PARCOURS_ID))
  act(() => { result.current.answer('q1', 0, true) })
  // allow useEffect to run
  await act(async () => {})
  const stored = JSON.parse(sessionStorage.getItem('minilek_quiz_session') ?? '{}')
  expect(stored.score).toBe(1)
})
