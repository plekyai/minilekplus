'use client'
import type { Parcours } from '@/types/quiz'

const AUDIO_KEYS = [
  { key: 'generique', label: 'Générique (intro)' },
  { key: 'facile', label: 'Questions faciles' },
  { key: 'moyenne', label: 'Questions moyennes' },
  { key: 'difficile', label: 'Questions impossibles' },
  { key: 'parents', label: 'Question parents' },
  { key: 'priere', label: 'Prière' },
  { key: 'correct', label: 'Bonne réponse (jingle)' },
  { key: 'wrong', label: 'Mauvaise réponse (jingle)' },
]

interface ParcoursFormProps {
  parcours?: Parcours
  action: (formData: FormData) => Promise<void>
  submitLabel: string
}

export function ParcoursForm({ parcours, action, submitLabel }: ParcoursFormProps) {
  const fr = parcours?.translations.fr
  const audioUrls = parcours?.audio_urls ?? {}

  return (
    <form action={action} className="flex flex-col gap-6 max-w-2xl">
      {!parcours && (
        <Field label="Slug (URL)" name="slug" required placeholder="la-piece-retrouvee" />
      )}

      <Field label="Titre (FR)" name="title" required defaultValue={fr?.title} />

      <div className="flex flex-col gap-1">
        <label className="font-display text-sm font-semibold text-on-surface">Histoire (FR)</label>
        <textarea
          name="story_text"
          rows={8}
          required
          defaultValue={fr?.story_text}
          className="rounded-2xl bg-surface-container-low px-4 py-3 font-body text-on-surface placeholder:text-on-surface/30 resize-y focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-display text-sm font-semibold text-on-surface">Prière (FR)</label>
        <textarea
          name="prayer_text"
          rows={4}
          defaultValue={fr?.prayer_text}
          className="rounded-2xl bg-surface-container-low px-4 py-3 font-body text-on-surface placeholder:text-on-surface/30 resize-y focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <Field label="Image URL" name="image_url" defaultValue={parcours?.image_url ?? ''} />

      <div className="flex flex-col gap-1">
        <label className="font-display text-sm font-semibold text-on-surface">Tags (séparés par virgule)</label>
        <input
          name="tags"
          defaultValue={parcours?.tags.join(', ')}
          placeholder="parabole, pardon, Luc"
          className="rounded-2xl bg-surface-container-low px-4 py-3 font-body text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <label className="font-display text-sm font-semibold text-on-surface">Difficulté</label>
          <select
            name="difficulty"
            defaultValue={parcours?.difficulty ?? 'debutant'}
            className="rounded-2xl bg-surface-container-low px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="debutant">Débutant</option>
            <option value="intermediaire">Intermédiaire</option>
            <option value="avance">Avancé</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="font-display text-sm font-semibold text-on-surface">Tier</label>
          <select
            name="tier"
            defaultValue={parcours?.tier ?? 'free'}
            className="rounded-2xl bg-surface-container-low px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="free">Gratuit</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>

      <label className="flex items-center gap-3 font-body text-on-surface cursor-pointer">
        <input
          type="checkbox"
          name="published"
          defaultChecked={parcours?.published ?? false}
          className="w-4 h-4 accent-primary"
        />
        Publié
      </label>

      <div className="flex flex-col gap-3">
        <h3 className="font-display text-sm font-semibold text-on-surface">URLs audio</h3>
        {AUDIO_KEYS.map(({ key, label }) => (
          <Field
            key={key}
            label={label}
            name={`audio_${key}`}
            defaultValue={(audioUrls as Record<string, string>)[key] ?? ''}
            placeholder="https://..."
          />
        ))}
      </div>

      <button
        type="submit"
        className="w-full rounded-[2rem] py-3 font-display font-semibold text-on-primary bg-primary-gradient shadow-ambient"
      >
        {submitLabel}
      </button>
    </form>
  )
}

function Field({
  label,
  name,
  required,
  defaultValue,
  placeholder,
}: {
  label: string
  name: string
  required?: boolean
  defaultValue?: string
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-display text-sm font-semibold text-on-surface">{label}</label>
      <input
        type="text"
        name={name}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="rounded-2xl bg-surface-container-low px-4 py-3 font-body text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  )
}
