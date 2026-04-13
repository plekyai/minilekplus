'use client'

import { useLanguage, type Locale } from '@/lib/i18n/context'

const LOCALES: { value: Locale; label: string }[] = [
  { value: 'fr', label: '🇫🇷 FR' },
  { value: 'en', label: '🇬🇧 EN' },
  { value: 'pt', label: '🇧🇷 PT' },
  { value: 'th', label: '🇹🇭 TH' },
]

export function LanguageSelector() {
  const { locale, setLocale } = useLanguage()

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      aria-label="Changer de langue"
      className="bg-surface-container-low rounded-lg px-3 py-1.5 font-body text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary cursor-pointer"
    >
      {LOCALES.map((l) => (
        <option key={l.value} value={l.value}>
          {l.label}
        </option>
      ))}
    </select>
  )
}
