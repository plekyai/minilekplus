'use client'
import { useState } from 'react'
import type { Locale, Parcours, Question, ParcoursTranslation, TranslationStatus } from '@/types/quiz'

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
  questions: Question[]
}

async function translateOne(table: 'parcours' | 'questions', record_id: string) {
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ table, record_id }),
  })
  if (!res.ok) throw new Error(await res.text())
}

export function TranslationPanel({ parcours, questions }: TranslationPanelProps) {
  const [translating, setTranslating] = useState(false)
  const [progress, setProgress] = useState('')
  const [message, setMessage] = useState('')

  async function triggerFullTranslation() {
    setTranslating(true)
    setMessage('')

    try {
      // 1. Traduire le parcours (titre + histoire + prière)
      setProgress('Traduction du parcours…')
      await translateOne('parcours', parcours.id)

      // 2. Traduire chaque question une par une
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i]
        const type = q.translations.fr?.question
          ? `${q.type} #${i + 1}`
          : `question #${i + 1}`
        setProgress(`Traduction ${type} (${i + 1}/${questions.length})…`)
        await translateOne('questions', q.id)
      }

      setMessage(`✅ Tout traduit — ${questions.length} questions + parcours. Rechargez la page.`)
    } catch (e: unknown) {
      setMessage(`❌ Erreur : ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setTranslating(false)
      setProgress('')
    }
  }

  const frT = parcours.translations.fr
  if (!frT) return <p className="font-body text-sm text-on-surface/40">Aucun contenu FR.</p>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-on-surface">Traductions</h2>
        <button
          onClick={triggerFullTranslation}
          disabled={translating}
          className="rounded-[2rem] px-4 py-2 font-display text-sm font-semibold text-on-primary bg-primary-gradient shadow-ambient disabled:opacity-60"
        >
          {translating ? progress || 'Traduction…' : '✨ Tout traduire avec IA'}
        </button>
      </div>

      {message && (
        <p className="font-body text-sm text-on-surface/70 bg-surface-container rounded-xl px-4 py-3">
          {message}
        </p>
      )}

      {/* Parcours translations */}
      <div>
        <h3 className="font-display text-sm font-semibold text-on-surface/60 mb-3 uppercase tracking-wide">
          Parcours — Histoire &amp; Prière
        </h3>
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
                    <p className="line-clamp-3">{(frT as ParcoursTranslation)[field]}</p>
                  </td>
                  {LOCALES.map(l => {
                    const lt = parcours.translations[l]
                    return (
                      <td key={l} className="py-3 pr-4 max-w-xs">
                        {lt ? (
                          <div className="flex flex-col gap-1">
                            <StatusBadge status={lt.translation_status} />
                            <p className="text-on-surface/80 line-clamp-3">{(lt as ParcoursTranslation)[field]}</p>
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

      {/* Questions translations */}
      {questions.length > 0 && (
        <div>
          <h3 className="font-display text-sm font-semibold text-on-surface/60 mb-3 uppercase tracking-wide">
            Questions ({questions.length})
          </h3>
          <div className="flex flex-col gap-3">
            {questions.map((q, i) => {
              const frQ = q.translations.fr
              const hasTranslation = LOCALES.some(l => q.translations[l])
              return (
                <div key={q.id} className="rounded-xl bg-surface-container-lowest border border-surface-container p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-body font-semibold uppercase text-on-surface/40">
                      {q.type} #{i + 1}
                    </span>
                    {hasTranslation && (
                      <StatusBadge status={q.translations.en?.translation_status ?? 'ai'} />
                    )}
                  </div>
                  <p className="font-body text-sm text-on-surface/80 mb-1">
                    <span className="font-semibold">🇫🇷 </span>{frQ?.question}
                  </p>
                  {LOCALES.map(l => {
                    const tq = q.translations[l]
                    if (!tq) return null
                    return (
                      <p key={l} className="font-body text-xs text-on-surface/50">
                        <span className="font-semibold">{LOCALE_LABELS[l]} </span>{tq.question}
                      </p>
                    )
                  })}
                  {frQ?.choices && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {frQ.choices.map((c: string, ci: number) => (
                        <span
                          key={ci}
                          className={`text-xs font-body px-2 py-0.5 rounded-full ${
                            ci === frQ.correct_index
                              ? 'bg-primary/10 text-primary font-semibold'
                              : 'bg-surface-container text-on-surface/50'
                          }`}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                  {frQ?.explanation && (
                    <p className="mt-2 font-body text-xs text-on-surface/60 italic border-l-2 border-primary/30 pl-2">
                      💡 {frQ.explanation}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
