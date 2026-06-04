// components/histoires-playmobil/HeroSection.tsx
'use client'

import { useState, useEffect } from 'react'
import type { YouTubeVideo } from '@/lib/youtube/types'

interface HeroSectionProps {
  video: YouTubeVideo
  watchLabel: string
  moreInfoLabel: string
  onMoreInfo: () => void
}

function cleanTitle(t: string) {
  return t.replace(/\s*[–—-]\s*Histoires?\s+Bibliques?\s+Playmobil\s*$/i, '').trim()
}

export function HeroSection({ video, watchLabel, moreInfoLabel, onMoreInfo }: HeroSectionProps) {
  const [playing, setPlaying] = useState(false)

  // Réinitialiser le player quand on change de vidéo depuis le carrousel
  useEffect(() => {
    setPlaying(false)
  }, [video.id])

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        // En mode lecture, laisser le ratio 16:9 dicter la hauteur sans minHeight artificiel
        minHeight: playing ? 0 : 'clamp(320px, 56vw, 80vh)',
        background: '#0f0f0f',
      }}
    >
      {playing ? (
        /* ── Embedded player ── */
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          <iframe
            key={video.id}
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      ) : (
        /* ── Thumbnail hero ── */
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${video.thumbnail})` }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, #0f0f0f 0%, rgba(15,15,15,0.6) 45%, rgba(15,15,15,0.25) 100%)',
            }}
          />
          <div
            className="absolute inset-x-0 top-0 h-20"
            style={{ background: 'linear-gradient(to bottom, rgba(15,15,15,0.7) 0%, transparent 100%)' }}
          />
          <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-10 pb-8 sm:pb-14 z-10">
            <h1
              className="text-white font-black leading-tight mb-2 drop-shadow-lg line-clamp-3 sm:line-clamp-none"
              style={{ fontSize: 'clamp(18px, 3.2vw, 44px)', letterSpacing: '-0.3px', maxWidth: '36rem' }}
            >
              {cleanTitle(video.title)}
            </h1>
            <p className="text-white/70 text-sm leading-relaxed mb-5 line-clamp-2 max-w-sm">
              {video.description.split('\n')[0]}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setPlaying(true)}
                className="flex items-center gap-2 bg-white text-black font-bold px-5 py-2.5 rounded-md hover:bg-white/85 transition-colors text-sm"
              >
                ▶ {watchLabel}
              </button>
              <button
                onClick={onMoreInfo}
                className="flex items-center gap-2 font-bold px-5 py-2.5 rounded-md transition-colors text-sm text-white"
                style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(4px)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
              >
                ℹ {moreInfoLabel}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
