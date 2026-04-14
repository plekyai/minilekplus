'use client'
import { useRef, useState, useCallback, useEffect } from 'react'
import type { AudioUrls } from '@/types/quiz'

export type AudioKey = keyof AudioUrls

export function useAudio(audioUrls: AudioUrls | null) {
  const [playing, setPlaying] = useState(false)
  const bgRef = useRef<HTMLAudioElement | null>(null)
  const currentKeyRef = useRef<AudioKey | null>(null)
  const cache = useRef<Partial<Record<AudioKey, HTMLAudioElement>>>({})

  const getAudio = useCallback(
    (key: AudioKey): HTMLAudioElement | null => {
      const url = audioUrls?.[key]
      if (!url) return null
      if (!cache.current[key]) {
        cache.current[key] = new Audio(url)
      }
      return cache.current[key]!
    },
    [audioUrls]
  )

  const stopBackground = useCallback(() => {
    if (bgRef.current) {
      bgRef.current.pause()
      bgRef.current.currentTime = 0
    }
    setPlaying(false)
  }, [])

  const playBackground = useCallback(
    (key: AudioKey) => {
      // Stop current if different track
      if (bgRef.current && currentKeyRef.current !== key) {
        bgRef.current.pause()
        bgRef.current.currentTime = 0
      }
      const audio = getAudio(key)
      if (!audio) return
      audio.loop = true
      audio.volume = 0.4
      audio.play().catch(() => {})
      bgRef.current = audio
      currentKeyRef.current = key
      setPlaying(true)
    },
    [getAudio]
  )

  const toggleBackground = useCallback(
    (key: AudioKey) => {
      if (playing && currentKeyRef.current === key) {
        stopBackground()
      } else {
        playBackground(key)
      }
    },
    [playing, playBackground, stopBackground]
  )

  // When step changes, stop current background (user must re-click to play new one)
  const switchStep = useCallback(
    (key: AudioKey) => {
      stopBackground()
      currentKeyRef.current = key
    },
    [stopBackground]
  )

  const playOnce = useCallback(
    (key: AudioKey) => {
      const audio = getAudio(key)
      if (!audio) return
      audio.currentTime = 0
      audio.volume = 1
      audio.play().catch(() => {})
    },
    [getAudio]
  )

  useEffect(() => {
    return () => {
      bgRef.current?.pause()
    }
  }, [])

  return { playing, playBackground, toggleBackground, switchStep, stopBackground, playOnce }
}
