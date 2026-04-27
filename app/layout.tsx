import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Lexend } from 'next/font/google'
import { LanguageProvider } from '@/lib/i18n/context'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default:  'Minilek+ — La Bible en famille, avec joie',
    template: '%s | Minilek+',
  },
  description:
    'Activités bibliques interactives pour explorer la foi en famille — quiz, mots mêlés et coloriages en 4 langues.',
  metadataBase: new URL('https://plus.minilek.com'),
  openGraph: {
    siteName: 'Minilek+',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fr"
      className={`${plusJakartaSans.variable} ${lexend.variable}`}
    >
      <body className="font-body bg-surface text-on-surface antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
