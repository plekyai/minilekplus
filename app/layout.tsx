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
  title: 'Minilek Plus',
  description: 'Activités bibliques pour la famille',
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
