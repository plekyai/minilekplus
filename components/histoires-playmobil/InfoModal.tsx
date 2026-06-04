// components/histoires-playmobil/InfoModal.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { YouTubeVideo } from '@/lib/youtube/types'
import { useLanguage } from '@/lib/i18n/context'

interface InfoModalProps {
  video: YouTubeVideo
  watchLabel: string
  loadingLabel: string
  onClose: () => void
  onWatch: () => void
}

const LANG_LABELS: Record<string, string> = {
  en: 'English',
  es: 'Spanish (Spain)',
  pt: 'Portuguese (Brazilian)',
  th: 'Thai',
}

function cacheKey(videoId: string, locale: string) {
  return `minilek_yt_${videoId}_${locale}`
}

export function InfoModal({ video, watchLabel, loadingLabel, onClose, onWatch }: InfoModalProps) {
  const { locale } = useLanguage()
  const [description, setDescription] = useState(video.description)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setDescription(video.description)
    if (locale === 'fr' || !video.description) return

    const cached = localStorage.getItem(cacheKey(video.id, locale))
    if (cached) { setDescription(cached); return }

    setLoading(true)
    fetch('/api/translate-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: video.description,
        targetLang: locale,
        targetLabel: LANG_LABELS[locale] ?? 'English',
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.translated) {
          localStorage.setItem(cacheKey(video.id, locale), data.translated)
          setDescription(data.translated)
        }
      })
      .catch(() => { /* keep original */ })
      .finally(() => setLoading(false))
  }, [video.id, video.description, locale])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.78)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-xl shadow-2xl"
        style={{ background: '#1c1c1c', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button — toujours visible, hors du scroll */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold hover:scale-110 transition-transform text-sm"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          aria-label="Fermer"
        >
          ✕
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto rounded-xl" style={{ flex: 1 }}>
          {/* Thumbnail header */}
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover"
              unoptimized
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, #1c1c1c 5%, transparent 50%)' }}
            />
          </div>

          {/* Body */}
          <div className="px-6 pb-8 pt-2">
            <h2 className="text-white font-black text-xl mb-4 leading-snug pr-8">{video.title}</h2>
            <button
              onClick={() => { onWatch(); onClose() }}
              className="flex items-center gap-2 bg-white text-black font-bold px-5 py-2 rounded-md hover:bg-white/85 transition-colors mb-5 text-sm"
            >
              ▶ {watchLabel}
            </button>
            <div className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
              {loading ? (
                <span className="animate-pulse" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {loadingLabel}
                </span>
              ) : (
                <p className="whitespace-pre-line">{description || '—'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
