// components/histoires-playmobil/HeroSection.tsx
'use client'

import { useState } from 'react'
import type { YouTubeVideo } from '@/lib/youtube/types'

interface HeroSectionProps {
  video: YouTubeVideo
  watchLabel: string
  moreInfoLabel: string
  onMoreInfo: () => void
}

export function HeroSection({ video, watchLabel, moreInfoLabel, onMoreInfo }: HeroSectionProps) {
  const [playing, setPlaying] = useState(false)

  // Reset player when video changes
  if (playing && !video) setPlaying(false)

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ minHeight: 'min(56vw, 80vh)', background: '#0f0f0f' }}
    >
      {playing ? (
        /* ── Embedded player ── */
        <div className="relative w-full" style={{ paddingTop: 'min(56.25%, 80vh)' }}>
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
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${video.thumbnail})` }}
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, #0f0f0f 0%, rgba(15,15,15,0.5) 40%, rgba(15,15,15,0.2) 100%)',
            }}
          />
          {/* Content — bottom left */}
          <div
            className="absolute bottom-0 left-0 px-6 sm:px-10 pb-10 sm:pb-16 max-w-xl z-10"
            style={{ paddingTop: 80 }}
          >
            <h1
              className="text-white font-black leading-tight mb-3 drop-shadow-lg"
              style={{ fontSize: 'clamp(22px, 3.5vw, 46px)', letterSpacing: '-0.5px' }}
            >
              {video.title}
            </h1>
            <p className="text-white/70 text-sm leading-relaxed mb-6 line-clamp-2 max-w-sm">
              {video.description.split('\n')[0]}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setPlaying(true)}
                className="flex items-center gap-2 bg-white text-black font-bold px-6 py-2.5 rounded-md hover:bg-white/85 transition-colors text-sm"
              >
                ▶ {watchLabel}
              </button>
              <button
                onClick={onMoreInfo}
                className="flex items-center gap-2 font-bold px-6 py-2.5 rounded-md transition-colors text-sm text-white"
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
