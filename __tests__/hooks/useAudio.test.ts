import { renderHook, act } from '@testing-library/react'
import { useAudio } from '@/hooks/useAudio'

const mockPlay = jest.fn().mockResolvedValue(undefined)
const mockPause = jest.fn()

class MockAudio {
  src: string
  loop = false
  volume = 1
  currentTime = 0
  play = mockPlay
  pause = mockPause
  constructor(src: string) { this.src = src }
}

beforeEach(() => {
  jest.clearAllMocks()
  // @ts-expect-error mocking browser API
  global.Audio = MockAudio
})

const audioUrls = {
  generique: 'https://example.com/generique.mp3',
  correct: 'https://example.com/correct.mp3',
}

test('starts unmuted', () => {
  const { result } = renderHook(() => useAudio(audioUrls))
  expect(result.current.muted).toBe(false)
})

test('toggleMute flips muted state', () => {
  const { result } = renderHook(() => useAudio(audioUrls))
  act(() => { result.current.toggleMute() })
  expect(result.current.muted).toBe(true)
  act(() => { result.current.toggleMute() })
  expect(result.current.muted).toBe(false)
})

test('playBackground calls audio.play()', () => {
  const { result } = renderHook(() => useAudio(audioUrls))
  act(() => { result.current.playBackground('generique') })
  expect(mockPlay).toHaveBeenCalledTimes(1)
})

test('playOnce calls audio.play()', () => {
  const { result } = renderHook(() => useAudio(audioUrls))
  act(() => { result.current.playOnce('correct') })
  expect(mockPlay).toHaveBeenCalledTimes(1)
})

test('playBackground with null audioUrls does not throw', () => {
  const { result } = renderHook(() => useAudio(null))
  expect(() => {
    act(() => { result.current.playBackground('generique') })
  }).not.toThrow()
})
