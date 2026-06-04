// components/histoires-playmobil/VideoCard.tsx
'use client'

import Image from 'next/image'

interface VideoCardProps {
  videoId: string
  title: string
  thumbnail: string
  isActive?: boolean
  onClick: () => void
}

export function VideoCard({ title, thumbnail, isActive, onClick }: VideoCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative flex-shrink-0 w-[180px] sm:w-[210px] text-left bg-transparent border-0 p-0 cursor-pointer"
      style={{ outline: isActive ? '2px solid #006a60' : 'none', borderRadius: 8 }}
    >
      {/* Thumbnail */}
      <div
        className="relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.06] group-hover:shadow-2xl"
        style={{ aspectRatio: '16/9', borderRadius: 8 }}
      >
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 180px, 210px"
          unoptimized
        />
        {/* Play overlay on hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.9)' }}
          >
            <span className="text-black text-sm ml-0.5">▶</span>
          </div>
        </div>
      </div>
      {/* Title */}
      <p className="mt-1.5 text-[11px] leading-snug text-white/70 group-hover:text-white transition-colors line-clamp-2 px-0.5">
        {title}
      </p>
    </button>
  )
}
