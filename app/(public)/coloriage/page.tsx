import type { Metadata } from 'next'
import Link from 'next/link'
import { InnerPageHero } from '@/components/layout/InnerPageHero'

export const metadata: Metadata = {
  title: 'Coloriage Biblique — Bientôt disponible | Minilek+',
  description:
    'Des illustrations bibliques à colorier arrivent bientôt sur Minilek+. Un espace créatif pour les enfants de toutes les familles.',
  openGraph: {
    title: 'Coloriage Biblique — Bientôt | Minilek+',
    description:
      'Des illustrations bibliques à colorier arrivent bientôt sur Minilek+.',
    url: 'https://plus.minilek.com/coloriage',
    siteName: 'Minilek+',
    locale: 'fr_FR',
    type: 'website',
  },
}

const PREVIEWS = ['🦁', '⛵', '🌟', '🕊️']

export default function ColoriagePage() {
  return (
    <>
      <InnerPageHero
        title="🎨 Coloriage"
        subtitle="Des illustrations bibliques à colorier. Pour les petits artistes de la famille !"
        bgColor="#1b1c1c"
        charSrc="/svg/blonde-scientifique.svg"
        charSrcLeft="/svg/mouton.svg"
        breadcrumb="Coloriage"
        accentColor="rgba(250,178,51,0.6)"
      />

      <main className="flex flex-col items-center px-6 py-16 gap-6 text-center">
        {/* Floating paintbrush */}
        <span
          className="text-[80px] block"
          style={{ animation: 'char-float 4s ease-in-out infinite' }}
          aria-hidden="true"
        >
          🖌️
        </span>

        {/* Badge */}
        <div
          className="inline-block px-5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest"
          style={{ background: '#FAB233', color: '#1b1c1c' }}
        >
          Bientôt disponible
        </div>

        <h2
          className="font-display font-black text-[#1b1c1c] leading-tight max-w-xs"
          style={{ fontSize: 'clamp(22px, 6vw, 32px)' }}
        >
          Des pages de coloriage arrivent bientôt !
        </h2>
        <p className="font-body text-sm text-[#666] leading-relaxed max-w-xs">
          Nous préparons de belles illustrations bibliques pour que toute la famille puisse colorier ensemble.
        </p>

        {/* Preview icons */}
        <div className="flex gap-4 flex-wrap justify-center mt-2">
          {PREVIEWS.map((emoji, i) => (
            <div
              key={emoji}
              className="w-[70px] h-[70px] bg-white rounded-2xl flex items-center justify-center text-[32px] shadow-lg"
              style={{ animation: 'char-float 3s ease-in-out infinite', animationDelay: `${i * 0.4}s` }}
            >
              {emoji}
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="mt-4 inline-block bg-[#006a60] text-white rounded-full px-7 py-3 text-sm font-extrabold no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          ← Retour à l&apos;accueil
        </Link>
      </main>
    </>
  )
}
