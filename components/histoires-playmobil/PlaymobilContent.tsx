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
}

export function PlaymobilContent({ videos }: PlaymobilContentProps) {
  const topRef = useRef<HTMLDivElement>(null)
  const { locale } = useLanguage()
  const labels = getPublicLabels(locale).playmobil

  const [featured, setFeatured] = useState<YouTubeVideo>(videos[0])
  const [infoOpen, setInfoOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  const handleSelect = useCallback((video: YouTubeVideo) => {
    setFeatured(video)
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const filtered = search.trim()
    ? videos.filter(v => v.title.toLowerCase().includes(search.toLowerCase()))
    : null

  const latest8 = videos.slice(0, 8)

  return (
    <div ref={topRef} style={{ background: '#0f0f0f', minHeight: '100vh' }}>

      {/* ── Search bar (fixed top-right, below NavBar) ── */}
      <div className="fixed top-[68px] right-4 z-30 flex items-center">
        <div
          className={`flex items-center overflow-hidden transition-all duration-300 rounded-md ${searchOpen ? 'w-56 border border-white/25' : 'w-8'}`}
          style={{ background: searchOpen ? 'rgba(0,0,0,0.85)' : 'transparent' }}
        >
          {searchOpen && (
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={labels.searchPlaceholder}
              className="flex-1 bg-transparent text-white text-sm px-3 py-1.5 outline-none placeholder:text-white/35"
            />
          )}
          <button
            onClick={() => { setSearchOpen(o => !o); if (searchOpen) setSearch('') }}
            className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors flex-shrink-0"
            aria-label={searchOpen ? 'Close search' : 'Open search'}
          >
            {searchOpen ? '✕' : '🔍'}
          </button>
        </div>
      </div>

      {/* ── Hero ── */}
      <HeroSection
        video={featured}
        watchLabel={labels.watch}
        moreInfoLabel={labels.moreInfo}
        onMoreInfo={() => setInfoOpen(true)}
      />

      {/* ── Content ── */}
      <div className="pt-4 pb-20">
        {filtered ? (
          /* Search results grid */
          <div className="px-6">
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
            <VideoRow
              title={labels.allStories}
              videos={videos}
              activeVideoId={featured.id}
              onSelect={handleSelect}
            />
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
