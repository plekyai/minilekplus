import Image from 'next/image'
import Link from 'next/link'

interface InnerPageHeroProps {
  title: string
  subtitle: string
  bgColor: string
  charSrc: string
  charSrcLeft?: string
  breadcrumb: string
  accentColor?: string
}

export function InnerPageHero({
  title,
  subtitle,
  bgColor,
  charSrc,
  charSrcLeft,
  breadcrumb,
  accentColor = 'rgba(255,255,255,0.5)',
}: InnerPageHeroProps) {
  return (
    <section
      className="relative overflow-hidden flex items-center justify-center px-6"
      style={{ background: bgColor, minHeight: 300, paddingTop: 48, paddingBottom: 40 }}
    >
      {/* Right character */}
      <div
        className="absolute bottom-0 right-4 w-[140px] h-[140px]"
        style={{ animation: 'char-float 4s ease-in-out infinite' }}
      >
        <Image src={charSrc} alt="" fill className="object-contain" />
      </div>

      {/* Left character (optional, subtle) */}
      {charSrcLeft && (
        <div
          className="absolute bottom-0 left-4 w-[110px] h-[110px] opacity-30"
          style={{ animation: 'char-float 5s ease-in-out infinite', animationDelay: '1s' }}
        >
          <Image src={charSrcLeft} alt="" fill className="object-contain" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center max-w-lg">
        <p className="text-xs font-semibold mb-3" style={{ color: accentColor }}>
          <Link href="/" className="no-underline hover:underline" style={{ color: accentColor }}>
            Accueil
          </Link>
          {' / '}
          {breadcrumb}
        </p>
        <h1
          className="font-display font-black text-white leading-[1.05] mb-4"
          style={{ fontSize: 'clamp(28px, 8vw, 52px)', letterSpacing: '-1px' }}
        >
          {title}
        </h1>
        <p className="font-body text-sm leading-relaxed max-w-sm mx-auto" style={{ color: 'rgba(255,255,255,0.8)' }}>
          {subtitle}
        </p>
      </div>
    </section>
  )
}
