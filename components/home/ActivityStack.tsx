import Image from 'next/image'
import Link from 'next/link'

interface ActivityCardProps {
  bgColor: string
  zIndex: number
  label: string
  title: string
  description: string
  href: string
  btnLabel: string
  btnDisabled?: boolean
  charSrc: string
  charLeft?: boolean
  phoneContent: React.ReactNode
}

function StickyCard({
  bgColor,
  zIndex,
  label,
  title,
  description,
  href,
  btnLabel,
  btnDisabled,
  charSrc,
  charLeft,
  phoneContent,
}: ActivityCardProps) {
  return (
    <div
      className="sticky top-0 flex items-center justify-center gap-10 px-6 overflow-hidden flex-wrap"
      style={{ background: bgColor, zIndex, minHeight: '100vh', paddingTop: 80, paddingBottom: 80 }}
    >
      {/* Background character */}
      <div
        className={`absolute bottom-0 ${charLeft ? 'left-[-20px]' : 'right-[-20px]'} w-[200px] h-[200px] opacity-20 pointer-events-none`}
        aria-hidden="true"
      >
        <Image src={charSrc} alt="" fill className="object-contain" />
      </div>

      {/* Text content */}
      <div className="relative z-10 max-w-xs">
        <p className="text-[11px] font-bold tracking-[3px] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {label}
        </p>
        <h2
          className="font-display font-black text-white mb-4 leading-[1.05]"
          style={{ fontSize: 'clamp(28px, 7vw, 52px)', letterSpacing: '-1px' }}
        >
          {title}
        </h2>
        <p className="font-body text-sm leading-relaxed mb-7" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {description}
        </p>
        {btnDisabled ? (
          <span
            className="inline-block rounded-full px-7 py-3 text-sm font-bold text-white cursor-default"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            {btnLabel}
          </span>
        ) : (
          <Link
            href={href}
            className="inline-block bg-white rounded-full px-7 py-3 text-sm font-extrabold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl no-underline"
            style={{ color: bgColor }}
          >
            {btnLabel}
          </Link>
        )}
      </div>

      {/* Phone mockup */}
      <div className="relative z-10 hidden sm:block">
        <div
          className="rounded-[32px] p-3"
          style={{ background: '#1b1c1c', width: 200, boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}
        >
          <div className="rounded-[22px] overflow-hidden bg-white p-4" style={{ minHeight: 280 }}>
            {phoneContent}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ActivityStack() {
  return (
    <div>
      {/* Card 1 — Culte Familial */}
      <StickyCard
        bgColor="#006a60"
        zIndex={10}
        label="Activité 01"
        title="Culte Familial"
        description="Quiz bibliques interactifs : histoire, questions, prière, vidéo. En famille, à votre rythme."
        href="/culte-familial"
        btnLabel="Jouer maintenant →"
        charSrc="/svg/cerf.svg"
        phoneContent={
          <div className="flex flex-col gap-2.5">
            <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: '#e8f5f4', color: '#006a60' }}>📖 Culte Familial</span>
            <p className="text-sm font-extrabold text-[#1b1c1c] leading-tight">Les Rois Mages</p>
            <p className="text-[11px] text-[#555] leading-relaxed">Qui ont-ils suivi pour trouver Jésus ?</p>
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="rounded-[10px] px-3 py-2 text-[11px] font-semibold" style={{ background: '#f0fdf4', border: '1.5px solid #c6f0e8', color: '#006a60' }}>🌟 Une étoile</div>
              <div className="rounded-[10px] px-3 py-2 text-[11px] font-semibold" style={{ background: '#f0fdf4', border: '1.5px solid #c6f0e8', color: '#006a60' }}>🕊️ Une colombe</div>
            </div>
          </div>
        }
      />

      {/* Card 2 — Mots Mêlés */}
      <StickyCard
        bgColor="#FAB234"
        zIndex={11}
        label="Activité 02"
        title="Mots Mêlés"
        description="Des grilles de mots cachés bibliques pour apprendre le vocabulaire de la foi en s'amusant."
        href="/mots-meles"
        btnLabel="Chercher →"
        charSrc="/svg/oiseau.svg"
        charLeft
        phoneContent={
          <div className="flex flex-col gap-2.5">
            <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.3)', color: '#1b1c1c' }}>🔎 Mots Mêlés</span>
            <div className="font-mono text-[13px] font-bold tracking-[3px] leading-[2] mt-2 text-[#1b1c1c]">
              <div>É<span className="bg-[#FAB233] text-white rounded px-0.5">TOILE</span>A</div>
              <div>ROIMAGE</div>
              <div>PA<span className="bg-[#006a60] text-white rounded px-0.5">IX</span>BIL</div>
              <div><span className="bg-[#FB1A38] text-white rounded px-0.5">FOI</span>ESUS</div>
            </div>
          </div>
        }
      />

      {/* Card 3 — Coloriage */}
      <StickyCard
        bgColor="#FF1B37"
        zIndex={12}
        label="Activité 03"
        title="Coloriage"
        description="Des illustrations bibliques à colorier — pour les plus petits comme pour les grands artistes."
        href="/coloriage"
        btnLabel="Bientôt disponible ✨"
        btnDisabled
        charSrc="/svg/blonde-scientifique.svg"
        phoneContent={
          <div className="flex flex-col items-center justify-center gap-3 h-full" style={{ minHeight: 220 }}>
            <span className="text-[52px]" style={{ animation: 'char-float 3s ease-in-out infinite' }}>🖌️</span>
            <span className="text-[11px] font-bold px-3.5 py-1 rounded-full" style={{ background: '#FAB233', color: '#1b1c1c' }}>Bientôt</span>
          </div>
        }
      />
    </div>
  )
}
