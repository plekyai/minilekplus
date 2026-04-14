export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Parcours, Question } from '@/types/quiz'
import { ParcoursForm } from '@/components/admin/ParcoursForm'
import { QuestionsEditor } from '@/components/admin/QuestionsEditor'
import { TranslationPanel } from '@/components/admin/TranslationPanel'
import { updateParcours, deleteParcours } from '@/app/(admin)/admin/parcours/actions'

async function getData(id: string) {
  const supabase = createAdminClient()
  const [pRes, qRes] = await Promise.all([
    supabase.from('parcours').select('*').eq('id', id).single(),
    supabase.from('questions').select('*').eq('parcours_id', id).order('order_index'),
  ])
  return {
    parcours: pRes.data as Parcours | null,
    questions: (qRes.data ?? []) as Question[],
  }
}

interface Props { params: { id: string } }

export default async function EditParcoursPage({ params }: Props) {
  const { parcours, questions } = await getData(params.id)
  if (!parcours) notFound()

  const update = updateParcours.bind(null, params.id)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/parcours" className="font-body text-sm text-on-surface/50 hover:text-primary">
            ← Parcours
          </Link>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            {parcours.translations.fr?.title ?? parcours.slug}
          </h1>
        </div>
        <form action={deleteParcours.bind(null, params.id)}>
          <button type="submit" className="font-body text-sm text-error hover:underline">
            Supprimer
          </button>
        </form>
      </div>

      <section>
        <h2 className="font-display text-lg font-bold text-on-surface mb-4">Contenu FR</h2>
        <ParcoursForm parcours={parcours} action={update} submitLabel="Sauvegarder" />
      </section>

      <section>
        <QuestionsEditor parcoursId={params.id} questions={questions} />
      </section>

      <section>
        <TranslationPanel parcours={parcours} questions={questions} />
      </section>
    </div>
  )
}
