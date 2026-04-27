import Image from 'next/image'

const SCATTERED = [
  { src: '/svg/enfant-blond.svg',        alt: 'Enfant blond',        style: { top: '5%',   left: '2%',   width: 110, animationDelay: '0s'   } },
  { src: '/svg/prof.svg',                alt: 'Prof',                style: { top: '3%',   right: '5%',  width: 130, animationDelay: '0.8s' } },
  { src: '/svg/enfant-brun.svg',         alt: 'Enfant brun',         style: { bottom:'8%', left: '8%',   width: 100, animationDelay: '1.5s' } },
  { src: '/svg/grand-mere-genie.svg',    alt: 'Grand-mère',          style: { bottom:'5%', right: '3%',  width: 120, animationDelay: '0.5s' } },
  { src: '/svg/casquette-rose.svg',      alt: 'Casquette rose',      style: { top: '35%',  left: '5%',   width: 90,  animationDelay: '1s'   } },
  { src: '/svg/blonde-scientifique.svg', alt: 'Blonde scientifique', style: { top: '30%',  right: '4%',  width: 110, animationDelay: '1.8s' } },
  { src: '/svg/chat-livre.svg',          alt: 'Chat livre',          style: { bottom:'30%',left: '38%',  width: 100, animationDelay: '0.3s', opacity: 0.7 } },
  { src: '/svg/ours.svg',                alt: 'Ours',                style: { top: '20%',  left: '45%',  width: 90,  animationDelay: '2s',   opacity: 0.6 } },
]

export function CharactersSection() {
  return (
    <section
      className="relative overflow-hidden flex items-center justify-center"
      style={{ background: '#fbf9f8', minHeight: 460, padding: '40px 24px' }}
    >
      {/* Scattered floating characters */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {SCATTERED.map(({ src, alt, style: { width, animationDelay, opacity, ...pos } }) => (
          <div
            key={src}
            className="absolute"
            style={{
              width,
              height: width,
              animation: 'char-float 5s ease-in-out infinite',
              animationDelay,
              opacity: opacity ?? 1,
              ...pos,
            }}
          >
            <Image src={src} alt={alt} fill className="object-contain" />
          </div>
        ))}
      </div>

      {/* Centre text */}
      <div className="relative z-10 text-center">
        <div
          className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-bold text-white"
          style={{ background: '#006a60' }}
        >
          👨‍👩‍👧‍👦 Pour toute la famille
        </div>
        <h2
          className="font-display font-black leading-tight"
          style={{ fontSize: 'clamp(24px, 6vw, 40px)', color: '#1b1c1c' }}
        >
          Des personnages qui<br />donnent vie aux histoires
        </h2>
      </div>
    </section>
  )
}
