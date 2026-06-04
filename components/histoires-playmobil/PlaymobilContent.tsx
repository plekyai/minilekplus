// components/histoires-playmobil/PlaymobilContent.tsx
'use client'

import { useState, useCallback, useRef } from 'react'
import type { YouTubeVideo } from '@/lib/youtube/types'
import { useLanguage } from '@/lib/i18n/context'
import { getPublicLabels } from '@/lib/i18n/public-labels'
import { HeroSection } from './HeroSection'
import { VideoRow } from './VideoRow'
import { InfoModal } from './InfoModal'
import { VideoCard } from './VideoCard'

interface PlaymobilContentProps {
  videos: YouTubeVideo[]
  podcastVideos: YouTubeVideo[]
}

export function PlaymobilContent({ videos, podcastVideos }: PlaymobilContentProps) {
  const topRef = useRef<HTMLDivElement>(null)
  const { locale } = useLanguage()
  const labels = getPublicLabels(locale).playmobil

  const [featured, setFeatured] = useState<YouTubeVideo>(videos[0])
  const [infoOpen, setInfoOpen] = useState(false)
  const [search, setSearch] = useState('')

  const handleSelect = useCallback((video: YouTubeVideo) => {
    setFeatured(video)
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const filtered = search.trim()
    ? videos.filter(v => v.title.toLowerCase().includes(search.toLowerCase()))
    : null

  const latest8 = videos.slice(0, 8)

  return (
    <div ref={topRef} style={{ background: '#0f0f0f', minHeight: '100vh', isolation: 'isolate' }}>

      {/* ── Hero ── */}
      <HeroSection
        video={featured}
        watchLabel={labels.watch}
        moreInfoLabel={labels.moreInfo}
        onMoreInfo={() => setInfoOpen(true)}
      />

      {/* ── Search bar ── */}
      <div className="px-4 sm:px-6 pt-4 pb-2">
        <div
          className="flex items-center gap-3 rounded-lg px-4 py-2.5 w-full max-w-lg"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/35 min-w-0"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-white/40 hover:text-white/70 transition-colors text-sm flex-shrink-0"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="pt-2 pb-20">
        {filtered ? (
          /* Search results grid */
          <div className="px-4 sm:px-6 pt-2">
            <p className="text-white/50 text-xs mb-4">
              {filtered.length > 0
                ? `${filtered.length} résultat${filtered.length > 1 ? 's' : ''}`
                : labels.noResults}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map(v => (
                <VideoCard
                  key={v.id}
                  videoId={v.id}
                  title={v.title}
                  thumbnail={v.thumbnail}
                  isActive={v.id === featured.id}
                  onClick={() => handleSelect(v)}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Normal rows */
          <>
            <VideoRow
              title={labels.latestReleases}
              videos={latest8}
              activeVideoId={featured.id}
              onSelect={handleSelect}
            />
            {podcastVideos.length > 0 && (
              <VideoRow
                title={labels.podcastLabel}
                videos={podcastVideos}
                activeVideoId={featured.id}
                onSelect={handleSelect}
              />
            )}
          </>
        )}
      </div>

      {/* ── Info modal ── */}
      {infoOpen && (
        <InfoModal
          video={featured}
          watchLabel={labels.watch}
          loadingLabel={labels.loadingDesc}
          onClose={() => setInfoOpen(false)}
          onWatch={() => setInfoOpen(false)}
        />
      )}
    </div>
  )
}
