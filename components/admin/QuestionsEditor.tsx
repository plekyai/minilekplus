'use client'
import { useState } from 'react'
import type { Question } from '@/types/quiz'
import { upsertQuestion, deleteQuestion } from '@/app/(admin)/admin/parcours/[id]/questions/actions'

const QUESTION_TYPES = ['facile', 'moyenne', 'impossible', 'parents'] as const
type QType = typeof QUESTION_TYPES[number]

interface QuestionsEditorProps {
  parcoursId: string
  questions: Question[]
}

interface DraftQuestion {
  id: string | null
  type: QType
  order_index: number
  question: string
  choices: [string, string, string, string]
  correct_index: number
  explanation: string
}

function emptyDraft(order_index: number): DraftQuestion {
  return { id: null, type: 'facile', order_index, question: '', choices: ['', '', '', ''], correct_index: 0, explanation: '' }
}

export function QuestionsEditor({ parcoursId, questions }: QuestionsEditorProps) {
  const [editing, setEditing] = useState<DraftQuestion | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function startEdit(q: Question) {
    const fr = q.translations.fr
    setEditing({
      id: q.id,
      type: q.type as QType,
      order_index: q.order_index,
      question: fr?.question ?? '',
      choices: (fr?.choices ?? ['', '', '', '']) as [string, string, string, string],
      correct_index: fr?.correct_index ?? 0,
      explanation: fr?.explanation ?? '',
    })
  }

  function startNew() {
    setEditing(emptyDraft(questions.length))
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    setError('')
    try {
      await upsertQuestion(parcoursId, editing.id, {
        type: editing.type,
        order_index: editing.order_index,
        question: editing.question,
        choices: editing.type === 'parents' ? null : editing.choices,
        correct_index: editing.type === 'parents' ? null : editing.correct_index,
        explanation: editing.type === 'parents' ? null : editing.explanation,
      })
      setEditing(null)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(q: Question) {
    if (!confirm('Supprimer cette question ?')) return
    await deleteQuestion(parcoursId, q.id)
  }

  const TYPE_LABELS: Record<QType, string> = {
    facile: 'Facile', moyenne: 'Moyenne', impossible: 'Impossible', parents: 'Parents'
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-on-surface">Questions ({questions.length})</h2>
        <button
          onClick={startNew}
          className="rounded-[2rem] px-4 py-2 font-display text-sm font-semibold text-on-primary bg-primary-gradient shadow-ambient"
        >
          + Ajouter
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {questions.map((q, i) => {
          const fr = q.translations.fr
          return (
            <div key={q.id} className="flex items-start justify-between bg-surface-container-lowest rounded-2xl px-4 py-3 shadow-ambient">
              <div className="flex gap-3 items-start">
                <span className="font-body text-xs text-on-surface/40 mt-0.5 w-5">{i + 1}</span>
                <div>
                  <span className="font-body text-xs font-semibold text-primary mr-2">{TYPE_LABELS[q.type as QType]}</span>
                  <span className="font-body text-sm text-on-surface">{fr?.question ?? '—'}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0 ml-2">
                <button onClick={() => startEdit(q)} className="font-body text-xs text-primary hover:underline">Modifier</button>
                <button onClick={() => handleDelete(q)} className="font-body text-xs text-error hover:underline">Suppr.</button>
              </div>
            </div>
          )
        })}
      </div>

      {editing && (
        <div className="bg-surface-container-low rounded-2xl p-5 flex flex-col gap-4">
          <h3 className="font-display text-sm font-bold text-on-surface">{editing.id ? 'Modifier' : 'Nouvelle'} question</h3>

          <div className="flex gap-4">
            <select
              value={editing.type}
              onChange={e => setEditing({ ...editing, type: e.target.value as QType })}
              className="rounded-xl bg-surface-container px-3 py-2 font-body text-sm text-on-surface focus:outline-none"
            >
              {QUESTION_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
            </select>
            <input
              type="number"
              value={editing.order_index}
              onChange={e => setEditing({ ...editing, order_index: Number(e.target.value) })}
              className="w-20 rounded-xl bg-surface-container px-3 py-2 font-body text-sm text-on-surface focus:outline-none"
              placeholder="Ordre"
            />
          </div>

          <textarea
            value={editing.question}
            onChange={e => setEditing({ ...editing, question: e.target.value })}
            placeholder="Texte de la question (FR)"
            rows={2}
            className="rounded-xl bg-surface-container px-3 py-2 font-body text-sm text-on-surface placeholder:text-on-surface/30 resize-none focus:outline-none"
          />

          {editing.type !== 'parents' && (
            <>
              <div className="flex flex-col gap-2">
                {(['A', 'B', 'C', 'D'] as const).map((letter, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={editing.correct_index === idx}
                      onChange={() => setEditing({ ...editing, correct_index: idx })}
                      className="accent-primary"
                    />
                    <span className="font-body text-xs text-on-surface/50 w-4">{letter}</span>
                    <input
                      type="text"
                      value={editing.choices[idx]}
                      onChange={e => {
                        const c = [...editing.choices] as [string, string, string, string]
                        c[idx] = e.target.value
                        setEditing({ ...editing, choices: c })
                      }}
                      placeholder={`Choix ${letter}`}
                      className="flex-1 rounded-xl bg-surface-container px-3 py-1.5 font-body text-sm text-on-surface placeholder:text-on-surface/30 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={editing.explanation}
                onChange={e => setEditing({ ...editing, explanation: e.target.value })}
                placeholder="Explication (montrée après la réponse)"
                className="rounded-xl bg-surface-container px-3 py-2 font-body text-sm text-on-surface placeholder:text-on-surface/30 focus:outline-none"
              />
            </>
          )}

          {error && <p className="font-body text-xs text-error">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-[2rem] px-5 py-2 font-display text-sm font-semibold text-on-primary bg-primary-gradient shadow-ambient disabled:opacity-60"
            >
              {saving ? 'Sauvegarde…' : 'Sauvegarder'}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="rounded-[2rem] px-5 py-2 font-display text-sm font-semibold text-on-surface bg-surface-container"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
