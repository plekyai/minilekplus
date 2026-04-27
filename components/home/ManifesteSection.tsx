'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

const TEXT =
  "Chez Minilek, nous croyons que chaque famille mérite des outils simples, joyeux et profonds pour explorer la Bible ensemble — parce que la foi grandit mieux quand on la partage en s'amusant, en toute langue, à n'importe quel âge."

export function ManifesteSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordsRef   = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    function update() {
      const rect = section!.getBoundingClientRect()
      const h    = section!.offsetHeight
      const vh   = window.innerHeight
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (h + vh)))
      wordsRef.current.forEach((w, i) => {
        if (!w) return
        const threshold = i / wordsRef.current.length
        w.classList.toggle('lit', progress > threshold)
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  const words = TEXT.split(' ')

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden flex items-center justify-center px-8"
      style={{ background: '#3730a3', minHeight: '50vh', paddingTop: 80, paddingBottom: 80 }}
    >
      <div className="absolute right-5 top-5 w-20 opacity-20 pointer-events-none" aria-hidden="true">
        <Image src="/svg/confeti.svg" alt="" width={80} height={80} />
      </div>
      <p
        className="font-display font-black text-white text-center leading-relaxed max-w-2xl"
        style={{ fontSize: 'clamp(20px, 5vw, 38px)', letterSpacing: '-0.5px' }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            ref={(el) => { if (el) wordsRef.current[i] = el }}
            className="word-reveal"
          >
            {word}{' '}
          </span>
        ))}
      </p>
    </section>
  )
}
