'use client'

import Image from 'next/image'
import { ClientInnerPageHero } from '@/components/layout/ClientInnerPageHero'
import { CtaSection }          from '@/components/home/CtaSection'
import { useLanguage }         from '@/lib/i18n/context'
import { getMissionLabels }    from '@/lib/i18n/mission-labels'

const VALUE_COLORS = ['#006a60', '#FAB233', '#FB1A38', '#3ecdbb']

export function NotreMissionContent() {
  const { locale } = useLanguage()
  const m = getMissionLabels(locale)

  return (
    <>
      <ClientInnerPageHero
        pageKey="notre-mission"
        bgColor="#006a60"
        charSrc="/svg/grand-mere-genie.svg"
        charSrcLeft="/svg/enfant-blond.svg"
      />

      {/* ── Mission statement ── */}
      <section className="bg-[#fbf9f8] px-6 py-14">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[11px] font-bold tracking-[3px] uppercase text-[#006a60] mb-4">{m.credoLabel}</p>
          <blockquote
            className="font-display font-black text-[#1b1c1c] leading-snug italic"
            style={{ fontSize: 'clamp(18px, 5vw, 28px)' }}
          >
            {m.credo}
          </blockquote>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-white px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-9">
            <p className="text-[11px] font-bold tracking-[3px] uppercase text-[#006a60] mb-2">{m.valuesLabel}</p>
            <h2 className="font-display text-2xl font-black text-[#1b1c1c]">{m.valuesTitle}</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {m.values.map(({ icon, title, desc }, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 bg-[#fbf9f8] transition-transform duration-200 hover:-translate-y-1"
                style={{ borderTop: `4px solid ${VALUE_COLORS[i]}` }}
              >
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-display text-base font-extrabold text-[#1b1c1c] mb-1.5">{title}</h3>
                <p className="font-body text-xs text-[#666] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-[#f0fdf4] px-6 py-12">
        <div className="max-w-lg mx-auto">
          <h2 className="font-display text-xl font-black text-[#1b1c1c] text-center mb-8">
            {m.howTitle}
          </h2>
          <div className="flex flex-col divide-y divide-[#c6f0e8]">
            {m.steps.map(({ num, title, desc, amber }) => (
              <div key={num} className="flex gap-4 py-5 items-start">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
                  style={{ background: amber ? '#FAB233' : '#006a60' }}
                >
                  {num}
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-[#1b1c1c] mb-1">{title}</h4>
                  <p className="font-body text-xs text-[#666] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Characters illustration ── */}
      <section className="bg-white px-6 py-10">
        <div className="max-w-2xl mx-auto flex flex-wrap gap-6 justify-center items-end">
          {[
            { src: '/svg/enfant-blond.svg',     w: 90  },
            { src: '/svg/prof.svg',              w: 110 },
            { src: '/svg/chat-livre.svg',        w: 80  },
            { src: '/svg/grand-mere-genie.svg',  w: 100 },
            { src: '/svg/enfant-brun.svg',       w: 90  },
          ].map(({ src, w }, i) => (
            <div
              key={src}
              style={{ width: w, height: w, animation: 'char-float 5s ease-in-out infinite', animationDelay: `${i * 0.4}s` }}
              className="relative"
            >
              <Image src={src} alt="" fill className="object-contain" />
            </div>
          ))}
        </div>
      </section>

      <CtaSection />
    </>
  )
}
