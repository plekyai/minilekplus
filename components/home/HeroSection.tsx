import Image from 'next/image'
import Link from 'next/link'

const FLOATING_CHARS = [
  { src: '/svg/cerf.svg',     alt: 'Cerf',      size: 100, style: { top: '8%',   left: '2%',  animationDelay: '0s',    animationDuration: '4.5s', opacity: 0.55 } },
  { src: '/svg/phoque.svg',   alt: 'Phoque',    size: 80,  style: { top: '12%',  right: '4%', animationDelay: '1s',    animationDuration: '5s',   opacity: 0.5  } },
  { src: '/svg/oiseau.svg',   alt: 'Oiseau',    size: 70,  style: { top: '35%',  right: '8%', animationDelay: '0.5s',  animationDuration: '4s',   opacity: 0.45 } },
  { src: '/svg/ours.svg',     alt: 'Ours',      size: 90,  style: { bottom:'20%',left: '4%',  animationDelay: '1.5s',  animationDuration: '3.8s', opacity: 0.5  } },
  { src: '/svg/souris.svg',   alt: 'Souris',    size: 65,  style: { bottom:'28%',right: '5%', animationDelay: '0.8s',  animationDuration: '4.2s', opacity: 0.45 } },
  { src: '/svg/chat.svg',     alt: 'Chat',      size: 75,  style: { top: '55%',  left: '10%', animationDelay: '2s',    animationDuration: '5s',   opacity: 0.4  } },
  { src: '/svg/mouton.svg',   alt: 'Mouton',    size: 85,  style: { bottom:'8%', left: '40%', animationDelay: '0.3s',  animationDuration: '4.8s', opacity: 0.5  } },
  { src: '/svg/chat-gris.svg',alt: 'Chat gris', size: 70,  style: { top: '20%',  left: '30%', animationDelay: '1.2s',  animationDuration: '3.5s', opacity: 0.35 } },
]

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden flex flex-col items-center justify-center px-6 text-center"
      style={{ background: '#006a60', minHeight: 'calc(100vh - 60px)', paddingTop: 60, paddingBottom: 40 }}
    >
      {/* Floating background characters */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {FLOATING_CHARS.map(({ src, alt, size, style }) => (
          <div
            key={src}
            className="absolute"
            style={{
              width: size,
              height: size,
              animation: 'char-float 5s ease-in-out infinite',
              ...style,
            }}
          >
            <Image src={src} alt={alt} fill className="object-contain" />
          </div>
        ))}
      </div>

      {/* Confetti decorations */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute" style={{ width: 140, top: '10%', right: '15%', animation: 'char-float 6s ease-in-out infinite', animationDelay: '0.5s', opacity: 0.25 }}>
          <Image src="/svg/confeti.svg" alt="" fill className="object-contain" />
        </div>
        <div className="absolute" style={{ width: 100, bottom: '20%', left: '12%', animation: 'char-float 5s ease-in-out infinite', animationDelay: '1.5s', opacity: 0.25 }}>
          <Image src="/svg/confeti-2.svg" alt="" fill className="object-contain" />
        </div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 max-w-xl mx-auto">
        <div
          className="inline-block mb-5 px-4 py-1.5 rounded-full text-xs font-bold text-white backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          ✨ Activités bibliques pour les familles
        </div>
        <h1
          className="font-display font-black text-white mb-5 leading-[1.05]"
          style={{ fontSize: 'clamp(32px, 9vw, 60px)', letterSpacing: '-1.5px' }}
        >
          Explore la Bible<br />en famille, avec joie
        </h1>
        <p className="font-body text-sm leading-relaxed mb-8 mx-auto max-w-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
          Des quiz interactifs, mots mêlés et coloriages pour grandir dans la foi ensemble — disponible en 4 langues.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a
            href="#activites"
            className="inline-block bg-white rounded-full px-7 py-3 text-sm font-extrabold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl no-underline"
            style={{ color: '#006a60', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
          >
            Commencer →
          </a>
          <Link
            href="/notre-mission"
            className="inline-block rounded-full px-7 py-3 text-sm font-semibold text-white transition-colors duration-200 no-underline"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.4)' }}
          >
            Notre mission
          </Link>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div
          className="w-7 h-11 rounded-[14px] flex items-start justify-center pt-1.5"
          style={{ border: '2px solid rgba(255,255,255,0.4)' }}
        >
          <div
            className="w-1 h-2 rounded-sm"
            style={{ background: 'rgba(255,255,255,0.6)', animation: 'scroll-dot 1.6s ease-in-out infinite' }}
          />
        </div>
      </div>
    </section>
  )
}
