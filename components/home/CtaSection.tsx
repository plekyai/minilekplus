import Image from 'next/image'
import Link from 'next/link'

const CHARS = [
  { src: '/svg/prof.svg',         alt: 'Prof',         style: { left: '4%',                  animationDelay: '0s'   } },
  { src: '/svg/grand-mere-genie.svg', alt: 'Grand-mère', style: { right: '4%',               animationDelay: '1s'   } },
  { src: '/svg/enfant-brun.svg',  alt: 'Enfant brun',  style: { left: '50%', marginLeft: -50, animationDelay: '0.5s' } },
]

export function CtaSection() {
  return (
    <section
      className="relative overflow-hidden flex items-center justify-center px-6 text-center"
      style={{ background: '#006a60', minHeight: 400, paddingTop: 80, paddingBottom: 80 }}
    >
      {/* Floating characters */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {CHARS.map(({ src, alt, style: { animationDelay, ...pos } }) => (
          <div
            key={src}
            className="absolute bottom-0 w-[120px] h-[120px]"
            style={{ animation: 'char-float 4s ease-in-out infinite', animationDelay, ...pos }}
          >
            <Image src={src} alt={alt} fill className="object-contain" />
          </div>
        ))}
      </div>

      <div className="relative z-10">
        <div
          className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-bold text-white"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          🌟 Gratuit &amp; multilingue
        </div>
        <h2
          className="font-display font-black text-white mb-7 leading-tight"
          style={{ fontSize: 'clamp(24px, 7vw, 48px)', letterSpacing: '-0.5px' }}
        >
          Prêt à explorer la Bible<br />en famille ?
        </h2>
        <Link
          href="/culte-familial"
          className="inline-block bg-white rounded-full px-9 py-4 text-base font-extrabold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl no-underline"
          style={{ color: '#006a60' }}
        >
          Commencer maintenant →
        </Link>
      </div>
    </section>
  )
}
