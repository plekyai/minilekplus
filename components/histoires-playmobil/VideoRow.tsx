// components/histoires-playmobil/VideoRow.tsx
'use client'

import { useRef } from 'react'
import type { YouTubeVideo } from '@/lib/youtube/types'
import { VideoCard } from './VideoCard'

interface VideoRowProps {
  title: string
  videos: YouTubeVideo[]
  activeVideoId: string
  onSelect: (video: YouTubeVideo) => void
}

export function VideoRow({ title, videos, activeVideoId, onSelect }: VideoRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 'left' | 'right') {
    rowRef.current?.scrollBy({ left: dir === 'right' ? 520 : -520, behavior: 'smooth' })
  }

  return (
    <div className="mb-10">
      <h2 className="text-white font-bold text-base sm:text-lg mb-3 px-6">{title}</h2>
      <div className="relative group/row">
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-5 z-10 w-10 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
          style={{ background: 'linear-gradient(to right, #0f0f0f, transparent)' }}
          aria-label="Scroll left"
        >
          <span className="text-white text-3xl font-thin">‹</span>
        </button>

        {/* Scrollable strip */}
        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-auto px-6 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollSnapType: 'x mandatory' }}
        >
          {videos.map(video => (
            <div key={video.id} style={{ scrollSnapAlign: 'start' }}>
              <VideoCard
                videoId={video.id}
                title={video.title}
                thumbnail={video.thumbnail}
                isActive={video.id === activeVideoId}
                onClick={() => onSelect(video)}
              />
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-5 z-10 w-10 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
          style={{ background: 'linear-gradient(to left, #0f0f0f, transparent)' }}
          aria-label="Scroll right"
        >
          <span className="text-white text-3xl font-thin">›</span>
        </button>
      </div>
    </div>
  )
}
