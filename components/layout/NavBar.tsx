'use client'

import { useState, useEffect, useCallback } from 'react'
import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/context'
import type { Locale } from '@/lib/i18n/context'

/* ── Social SVG icons ──────────────────────────────────────────────────────── */
function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%"  stopColor="#fdf497" />
          <stop offset="5%"  stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
      <rect x="6.5" y="6.5" width="11" height="11" rx="3.5" fill="none" stroke="white" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" fill="none" stroke="white" strokeWidth="1.5" />
      <circle cx="17" cy="7" r="1" fill="white" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#1877F2" />
      <path d="M15.5 8H13.5C13.2 8 13 8.2 13 8.5V10H15.5L15.1 12.5H13V19H10.5V12.5H8.5V10H10.5V8.5C10.5 6.6 11.8 5 13.5 5H15.5V8Z" fill="white" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 24" width="34" height="30" aria-hidden="true">
      <rect width="28" height="24" rx="6" fill="#FF0000" />
      <path
        d="M23 8.3a2 2 0 00-1.4-1.4C20.2 6.5 14 6.5 14 6.5s-6.2 0-7.6.4A2 2 0 004.9 8.3C4.5 9.7 4.5 12 4.5 12s0 2.3.4 3.7a2 2 0 001.5 1.4c1.4.4 7.6.4 7.6.4s6.2 0 7.6-.4a2 2 0 001.4-1.4c.4-1.4.4-3.7.4-3.7s0-2.3-.4-3.7z"
        fill="#FF0000"
        stroke="white"
        strokeWidth="0.5"
      />
      <path d="M11.5 15.5V8.5L18 12l-6.5 3.5z" fill="white" />
    </svg>
  )
}

/* ── Nav items config ──────────────────────────────────────────────────────── */
const ACTIVITIES = [
  { href: '/culte-familial',  label: 'Culte Familial', icon: '/svg/chat-livre.svg'           },
  { href: '/mots-meles',      label: 'Mots Mêlés',     icon: '/svg/oiseau.svg'               },
  { href: '/coloriage',       label: 'Coloriage',       icon: '/svg/blonde-scientifique.svg'  },
]
const MINILEK = [
  { href: 'https://minilek.com', label: 'minilek.com',    icon: '/svg/grand-mere-genie.svg', external: true },
  { href: '/notre-mission',      label: 'Notre Mission',  icon: '/svg/casquette-rose.svg'                   },
]
const FOOTER_CHARS: { src: string; alt: string; style: CSSProperties }[] = [
  { src: '/svg/oiseau.svg',  alt: 'Oiseau',  style: { left: '0%'   } },
  { src: '/svg/souris.svg',  alt: 'Souris',  style: { left: '12%'  } },
  { src: '/svg/chat.svg',    alt: 'Chat',    style: { left: '25%'  } },
  { src: '/svg/cerf.svg',    alt: 'Cerf',    style: { left: '43%'  } },
  { src: '/svg/mouton.svg',  alt: 'Mouton',  style: { left: '60%'  } },
  { src: '/svg/ours.svg',    alt: 'Ours',    style: { right: '12%' } },
  { src: '/svg/phoque.svg',  alt: 'Phoque',  style: { right: '2%'  } },
]
const LANGS: { locale: Locale; flag: string; code: string; label: string }[] = [
  { locale: 'fr', flag: '🇫🇷', code: 'FR', label: 'Français'   },
  { locale: 'en', flag: '🇬🇧', code: 'EN', label: 'English'    },
  { locale: 'pt', flag: '🇧🇷', code: 'PT', label: 'Português'  },
  { locale: 'th', flag: '🇹🇭', code: 'TH', label: 'ภาษาไทย'  },
]

/* ── Component ─────────────────────────────────────────────────────────────── */
export function NavBar() {
  const pathname  = usePathname()
  const { locale, setLocale } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  // Derive display object from context locale
  const lang = LANGS.find(l => l.locale === locale) ?? LANGS[0]

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMenuOpen(false); setLangOpen(false) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <>
      {/* ── Topbar ── */}
      <header
        className="fixed top-0 left-0 right-0 z-[200] h-[60px] flex items-center justify-between px-5"
        style={{ background: '#006a60', boxShadow: '0 2px 16px rgba(0,106,96,0.3)' }}
      >
        {/* Logo */}
        <Link href="/" aria-label="Accueil Minilek+" className="flex items-center">
          <Image
            src="/logo-desktop.png"
            alt="Minilek+"
            width={140}
            height={36}
            className="hidden sm:block object-contain"
            priority
          />
          <Image
            src="/logo-mobile.png"
            alt="Minilek+"
            width={36}
            height={36}
            className="block sm:hidden object-contain"
            priority
          />
        </Link>

        <div className="flex items-center gap-2.5 relative">
          {/* Lang selector */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setLangOpen(o => !o) }}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-white text-sm font-semibold cursor-pointer transition-colors"
              style={{ background: 'rgba(255,255,255,0.15)' }}
              aria-label="Sélectionner la langue"
              aria-expanded={langOpen}
            >
              <span>{lang.flag}</span>
              <span>{lang.code}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" className="opacity-60">
                <path d="M1 3l4 4 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </button>
            <div
              className={`lang-dropdown ${langOpen ? 'open' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLocale(l.locale); setLangOpen(false) }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-left hover:bg-[#f0fdf4] transition-colors"
                  style={{ color: lang.code === l.code ? '#006a60' : '#1b1c1c' }}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                  {lang.code === l.code && <span className="ml-auto text-[#006a60]">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Burger button */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            className={`w-9 h-9 rounded-full flex flex-col items-center justify-center gap-[5px] border-none cursor-pointer transition-colors ${menuOpen ? 'burger-open' : ''}`}
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <span className="burger-line" />
            <span className="burger-line" />
            <span className="burger-line" />
          </button>
        </div>
      </header>

      {/* Click outside to close lang dropdown */}
      {langOpen && (
        <div className="fixed inset-0 z-[250]" onClick={() => setLangOpen(false)} />
      )}

      {/* ── Mega Menu ── */}
      <nav
        className={`mega-menu-panel ${menuOpen ? 'open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className={`flex-1 px-6 pt-7 pb-0 flex flex-col menu-stagger ${menuOpen ? 'open' : ''}`}>

          {/* Activities */}
          <p className="text-[11px] font-bold tracking-[2.5px] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Activités
          </p>
          {ACTIVITIES.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              className="flex items-center justify-between py-2.5 border-b group"
              style={{ borderColor: 'rgba(255,255,255,0.08)', textDecoration: 'none' }}
            >
              <span
                className="text-[26px] font-black uppercase tracking-tight leading-none transition-all duration-200 group-hover:text-[#FAB233]"
                style={{
                  color: pathname === href ? '#FAB233' : 'white',
                  transform: 'translateX(0)',
                }}
              >
                {label}
              </span>
              <div className="w-[52px] h-[52px] flex items-center justify-center flex-shrink-0">
                <Image
                  src={icon}
                  alt=""
                  width={48}
                  height={48}
                  className="object-contain transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                />
              </div>
            </Link>
          ))}

          {/* Minilek */}
          <p className="text-[11px] font-bold tracking-[2.5px] uppercase mt-4 mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Minilek
          </p>
          {MINILEK.map(({ href, label, icon, external }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="flex items-center justify-between py-2.5 border-b group"
              style={{ borderColor: 'rgba(255,255,255,0.08)', textDecoration: 'none' }}
            >
              <span
                className="text-[26px] font-black uppercase tracking-tight leading-none transition-colors duration-200 group-hover:text-[#FAB233]"
                style={{ color: pathname === href ? '#FAB233' : 'white' }}
              >
                {label}
              </span>
              <div className="w-[52px] h-[52px] flex items-center justify-center flex-shrink-0">
                <Image
                  src={icon}
                  alt=""
                  width={48}
                  height={48}
                  className="object-contain transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                />
              </div>
            </Link>
          ))}

          {/* Social */}
          <p className="text-[11px] font-bold tracking-[2.5px] uppercase mt-4 mb-0" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Nous suivre
          </p>
          <div className="flex gap-5 py-4 flex-wrap">
            <a
              href="https://www.instagram.com/minilek/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 no-underline transition-all duration-200 hover:-translate-y-1"
              style={{ color: 'rgba(255,255,255,0.75)' }}
            >
              <InstagramIcon />
              <span className="text-sm font-semibold text-white/70 hover:text-white">Instagram</span>
            </a>
            <a
              href="https://www.facebook.com/minilek/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 no-underline transition-all duration-200 hover:-translate-y-1"
            >
              <FacebookIcon />
              <span className="text-sm font-semibold text-white/70 hover:text-white">Facebook</span>
            </a>
            <a
              href="https://www.youtube.com/@minilek"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 no-underline transition-all duration-200 hover:-translate-y-1"
            >
              <YouTubeIcon />
              <span className="text-sm font-semibold text-white/70 hover:text-white">YouTube</span>
            </a>
          </div>
        </div>

        {/* Footer row of floating characters */}
        <div className="relative h-[120px] flex-shrink-0 overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-[6px] rounded-t-sm" style={{ background: 'rgba(255,255,255,0.12)' }} />
          {FOOTER_CHARS.map(({ src, alt, style }) => (
            <div
              key={src}
              className="footer-char"
              style={style}
            >
              <Image src={src} alt={alt} width={60} height={60} className="object-contain w-full h-full" />
            </div>
          ))}
        </div>
      </nav>
    </>
  )
}
