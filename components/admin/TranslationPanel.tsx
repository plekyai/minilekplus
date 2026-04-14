'use client'
import { useState } from 'react'
import type { Locale, Parcours, TranslationStatus } from '@/types/quiz'

const LOCALES: Exclude<Locale, 'fr'>[] = ['en', 'pt', 'th']
const LOCALE_LABELS: Record<string, string> = { en: '🇬🇧 EN', pt: '🇧🇷 PT', th: '🇹🇭 TH' }

function StatusBadge({ status }: { status: TranslationStatus }) {
  if (status === 'source') return null
  return (
    <span
      className={`text-xs font-body font-semibold px-2 py-0.5 rounded-full ${
        status === 'verified' ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface/50'
      }`}
    >
      {status === 'verified' ? '✓ Vérifié' : 'IA'}
    </span>
  )
}

interface TranslationPanelProps {
  parcours: Parcours
}

export function TranslationPanel({ parcours }: TranslationPanelProps) {
  const [translating, setTranslating] = useState(false)
  const [message, setMessage] = useState('')

  async function triggerTranslation() {
    setTranslating(true)
    setMessage('')
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: 'parcours', record_id: parcours.id }),
      })
      if (!res.ok) throw new Error(await res.text())
      setMessage('Traduction lancée — rechargez la page dans quelques secondes.')
    } catch (e: any) {
      setMessage(`Erreur : ${e.message}`)
    } finally {
      setTranslating(false)
    }
  }

  const frT = parcours.translations.fr
  if (!frT) return <p className="font-body text-sm text-on-surface/40">Aucun contenu FR.</p>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-on-surface">Traductions</h2>
        <button
          onClick={triggerTranslation}
          disabled={translating}
          className="rounded-[2rem] px-4 py-2 font-display text-sm font-semibold text-on-primary bg-primary-gradient shadow-ambient disabled:opacity-60"
        >
          {translating ? 'Traduction…' : '✨ Re-traduire avec IA'}
        </button>
      </div>

      {message && <p className="font-body text-sm text-on-surface/60">{message}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="text-left text-on-surface/50">
              <th className="pb-2 pr-4 font-semibold">Champ</th>
              <th className="pb-2 pr-4 font-semibold">🇫🇷 FR (source)</th>
              {LOCALES.map(l => (
                <th key={l} className="pb-2 pr-4 font-semibold">{LOCALE_LABELS[l]}</th>
              ))}
            </tr>
          </thead>
          <tbody className="align-top">
            {(['title', 'story_text', 'prayer_text'] as const).map(field => (
              <tr key={field} className="border-t border-surface-container">
                <td className="py-3 pr-4 font-semibold text-on-surface/70 whitespace-nowrap">{field}</td>
                <td className="py-3 pr-4 text-on-surface/60 max-w-xs">
                  <p className="line-clamp-3">{(frT as any)[field]}</p>
                </td>
                {LOCALES.map(l => {
                  const lt = parcours.translations[l]
                  return (
                    <td key={l} className="py-3 pr-4 max-w-xs">
                      {lt ? (
                        <div className="flex flex-col gap-1">
                          <StatusBadge status={lt.translation_status} />
                          <p className="text-on-surface/80 line-clamp-3">{(lt as any)[field]}</p>
                        </div>
                      ) : (
                        <span className="text-on-surface/30 italic">—</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
