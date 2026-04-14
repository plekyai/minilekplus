import Link from 'next/link'
import Image from 'next/image'
import { LanguageSelector } from '@/components/LanguageSelector'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <Link href="/" aria-label="Accueil">
          {/* Desktop logo */}
          <Image
            src="/logo-desktop.png"
            alt="Minilek+"
            width={140}
            height={40}
            className="hidden sm:block object-contain"
            priority
          />
          {/* Mobile logo */}
          <Image
            src="/logo-mobile.png"
            alt="Minilek+"
            width={40}
            height={40}
            className="block sm:hidden object-contain"
            priority
          />
        </Link>
        <LanguageSelector />
      </header>
      {children}
    </>
  )
}
