// components/home/PlaymobilPreviewSection.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'
import { getPublicLabels } from '@/lib/i18n/public-labels'
import type { YouTubeVideo } from '@/lib/youtube/types'

interface PlaymobilPreviewSectionProps {
  videos: YouTubeVideo[]
}

export function PlaymobilPreviewSection({ videos }: PlaymobilPreviewSectionProps) {
  const { locale } = useLanguage()
  const labels = getPublicLabels(locale).playmobil
  const preview = videos.slice(0, 4)
  if (preview.length === 0) return null

  return (
    <section className="px-6 py-12" style={{ background: '#0f0f0f' }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h2
            className="font-display font-black text-white"
            style={{ fontSize: 'clamp(18px, 4vw, 26px)' }}
          >
            🎭 {labels.sectionTitle}
          </h2>
          <Link
            href="/histoires-playmobil"
            className="text-sm font-bold no-underline transition-colors"
            style={{ color: '#3ecdbb' }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#006a60')}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#3ecdbb')}
          >
            {labels.viewAll}
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {preview.map(video => (
            <Link key={video.id} href="/histoires-playmobil" className="group no-underline">
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: '16/9', borderRadius: 8 }}
              >
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 45vw, 25vw"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.9)' }}
                  >
                    <span className="text-black text-xs ml-0.5">▶</span>
                  </div>
                </div>
              </div>
              <p
                className="mt-1.5 text-[11px] leading-snug line-clamp-2 transition-colors"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                {video.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
