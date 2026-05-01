import Image from 'next/image'
import Link from 'next/link'

const ACTIVITIES = [
  {
    href:      '/culte-familial',
    label:     '📖 Activité',
    badge:     'Disponible',
    badgeBg:   '#006a60',
    title:     'Culte Familial',
    desc:      'Quiz bibliques interactifs à vivre ensemble en famille autour des histoires de la Bible.',
    cta:       'Commencer →',
    cardBg:    '#3ecdbb',
    charSrc:   '/svg/chat-livre.svg',
    available: true,
  },
  {
    href:      '/mots-meles',
    label:     '🔎 Activité',
    badge:     'Disponible',
    badgeBg:   '#FAB234',
    title:     'Mots Mêlés',
    desc:      'Retrouve les mots bibliques cachés dans la grille. Jouez ensemble, apprenez en vous amusant !',
    cta:       'Jouer →',
    cardBg:    '#FAB234',
    charSrc:   '/svg/oiseau.svg',
    available: true,
  },
  {
    href:      '/coloriage',
    label:     '🎨 Activité',
    badge:     'Bientôt',
    badgeBg:   '#FF1B37',
    title:     'Coloriage',
    desc:      'Des illustrations bibliques à colorier pour les petits artistes de la famille.',
    cta:       'Bientôt ✨',
    cardBg:    '#FF1B37',
    charSrc:   '/svg/blonde-scientifique.svg',
    available: false,
  },
]

export function ActivitiesSection() {
  return (
    <section
      id="activites"
      style={{ background: '#3730a3', padding: '72px 24px 80px' }}
    >
      {/* Section title with floating character */}
      <div className="text-center mb-14 relative" style={{ maxWidth: 700, margin: '0 auto 56px' }}>
        {/* Floating mascot above title */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: -64,
            width: 72,
            height: 72,
            animation: 'char-float 4s ease-in-out infinite',
          }}
          aria-hidden="true"
        >
          <Image src="/svg/souris.svg" alt="" fill className="object-contain" />
        </div>

        <h2
          className="font-display font-black text-white"
          style={{ fontSize: 'clamp(28px, 7vw, 52px)', letterSpacing: '-1px', lineHeight: 1.15 }}
        >
          Nos activités bibliques
        </h2>
        <p className="font-body text-sm mt-3" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Des expériences interactives pour explorer la foi en famille
        </p>
      </div>

      {/* Cards grid */}
      <div
        className="grid gap-6 mx-auto"
        style={{
          maxWidth: 960,
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        }}
      >
        {ACTIVITIES.map(({ href, label, badge, badgeBg, title, desc, cta, cardBg, charSrc, available }) => (
          <div
            key={href}
            className="rounded-[20px] overflow-hidden flex flex-col"
            style={{ background: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
          >
            {/* Colored top with character */}
            <div
              className="relative flex items-center justify-center"
              style={{ background: cardBg, height: 220 }}
            >
              {/* Category pill */}
              <div
                className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-white"
                style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ background: '#FAB234' }}
                />
                {label}
              </div>

              {/* Character illustration */}
              <div
                className="relative"
                style={{
                  width: 160,
                  height: 160,
                  animation: 'char-float 4s ease-in-out infinite',
                  filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
                }}
              >
                <Image src={charSrc} alt={title} fill className="object-contain" />
              </div>
            </div>

            {/* Card body */}
            <div className="flex flex-col flex-1 p-5 gap-3">
              {/* Badge */}
              <span
                className="self-start text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                style={{ background: badgeBg }}
              >
                {badge}
              </span>

              <h3 className="font-display text-lg font-black text-[#1b1c1c] leading-tight">
                {title}
              </h3>
              <p className="font-body text-xs text-[#666] leading-relaxed flex-1">
                {desc}
              </p>

              {available ? (
                <Link
                  href={href}
                  className="inline-flex items-center gap-1 font-body text-sm font-bold no-underline transition-colors duration-200 hover:opacity-70"
                  style={{ color: badgeBg === '#FAB234' ? '#795900' : badgeBg }}
                >
                  {cta}
                </Link>
              ) : (
                <span className="font-body text-sm font-bold" style={{ color: '#bbb' }}>
                  {cta}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
