import type { Metadata } from 'next'
import Image from 'next/image'
import { InnerPageHero } from '@/components/layout/InnerPageHero'
import { CtaSection }    from '@/components/home/CtaSection'

export const metadata: Metadata = {
  title: 'Notre Mission — Minilek+ | La Bible accessible à toutes les familles',
  description:
    'Minilek+ croit que chaque famille mérite des outils simples, joyeux et profonds pour explorer la Bible ensemble — en français, anglais, portugais et thaïlandais.',
  openGraph: {
    title: 'Notre Mission — Minilek+',
    description:
      'Aider les familles à explorer la Bible ensemble, avec joie, simplicité et profondeur.',
    url: 'https://plus.minilek.com/notre-mission',
    siteName: 'Minilek+',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Notre Mission — Minilek+',
    description: 'Aider les familles à explorer la Bible ensemble avec joie.',
  },
}

const VALUES = [
  { icon: '🤲', title: 'Foi',     color: '#006a60', desc: 'Enracinés dans les Écritures, nous créons du contenu fidèle à la Parole de Dieu.' },
  { icon: '👨‍👩‍👧‍👦', title: 'Famille', color: '#FAB233', desc: 'Chaque activité est pensée pour être vécue ensemble, parents et enfants.' },
  { icon: '🎉', title: 'Joie',    color: '#FB1A38', desc: 'Apprendre la Bible doit être fun, mémorable et accessible à tous les âges.' },
  { icon: '🌍', title: 'Langues', color: '#3ecdbb', desc: 'Disponible en FR, EN, PT et TH — pour les familles du monde entier.' },
]

const STEPS = [
  { num: '01', title: 'Choisissez une histoire biblique', desc: 'Parcourez notre bibliothèque de cultes familiaux et sélectionnez l\'histoire du jour.' },
  { num: '02', title: 'Explorez ensemble', desc: 'Lisez l\'histoire, répondez aux questions, regardez la vidéo et priez ensemble.' },
  { num: '03', title: 'Jouez avec les mots mêlés', desc: 'Renforcez le vocabulaire biblique avec des grilles de mots cachés ludiques.' },
  { num: '✨', title: 'Bientôt : Coloriage', desc: 'Des illustrations à colorier viendront compléter l\'expérience pour les plus petits.', amber: true },
]

export default function NotreMissionPage() {
  return (
    <>
      <InnerPageHero
        title="Notre Mission"
        subtitle="Aider les familles à explorer la Bible ensemble — avec joie, simplicité et profondeur."
        bgColor="#006a60"
        charSrc="/svg/grand-mere-genie.svg"
        charSrcLeft="/svg/enfant-blond.svg"
        breadcrumb="Notre Mission"
      />

      {/* ── Mission statement ── */}
      <section className="bg-[#fbf9f8] px-6 py-14">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[11px] font-bold tracking-[3px] uppercase text-[#006a60] mb-4">Notre Credo</p>
          <blockquote
            className="font-display font-black text-[#1b1c1c] leading-snug italic"
            style={{ fontSize: 'clamp(18px, 5vw, 28px)' }}
          >
            «&nbsp;La foi grandit mieux quand on la partage en s&apos;amusant, en toute langue, à n&apos;importe quel âge.&nbsp;»
          </blockquote>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-white px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-9">
            <p className="text-[11px] font-bold tracking-[3px] uppercase text-[#006a60] mb-2">Nos valeurs</p>
            <h2 className="font-display text-2xl font-black text-[#1b1c1c]">Ce qui nous anime</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {VALUES.map(({ icon, title, color, desc }) => (
              <div
                key={title}
                className="rounded-2xl p-5 bg-[#fbf9f8] transition-transform duration-200 hover:-translate-y-1"
                style={{ borderTop: `4px solid ${color}` }}
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
            Comment ça fonctionne ?
          </h2>
          <div className="flex flex-col divide-y divide-[#c6f0e8]">
            {STEPS.map(({ num, title, desc, amber }) => (
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
            { src: '/svg/enfant-blond.svg', w: 90 },
            { src: '/svg/prof.svg',          w: 110 },
            { src: '/svg/chat-livre.svg',    w: 80 },
            { src: '/svg/grand-mere-genie.svg', w: 100 },
            { src: '/svg/enfant-brun.svg',   w: 90 },
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
