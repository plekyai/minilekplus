'use client'
import { useRef, useState, useCallback, useEffect } from 'react'
import type { AudioUrls } from '@/types/quiz'

export type AudioKey = keyof AudioUrls

export function useAudio(audioUrls: AudioUrls | null) {
  const [muted, setMuted] = useState(false)
  const bgRef = useRef<HTMLAudioElement | null>(null)
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

  const playBackground = useCallback(
    (key: AudioKey) => {
      if (bgRef.current) {
        bgRef.current.pause()
        bgRef.current.currentTime = 0
      }
      const audio = getAudio(key)
      if (!audio) return
      audio.loop = true
      audio.volume = muted ? 0 : 0.4
      audio.play().catch(() => {})
      bgRef.current = audio
    },
    [getAudio, muted]
  )

  const playOnce = useCallback(
    (key: AudioKey) => {
      const audio = getAudio(key)
      if (!audio) return
      audio.currentTime = 0
      audio.volume = muted ? 0 : 1
      audio.play().catch(() => {})
    },
    [getAudio, muted]
  )

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev
      if (bgRef.current) bgRef.current.volume = next ? 0 : 0.4
      return next
    })
  }, [])

  useEffect(() => {
    return () => {
      bgRef.current?.pause()
    }
  }, [])

  return { muted, playBackground, playOnce, toggleMute }
}
