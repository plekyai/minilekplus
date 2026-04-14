import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Parcours } from '@/types/quiz'

async function getAllParcours(): Promise<Parcours[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('parcours')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Parcours[]
}

export default async function AdminParcoursPage() {
  let parcoursList: Parcours[] = []
  try {
    parcoursList = await getAllParcours()
  } catch {}

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-on-surface">Parcours</h1>
        <Link
          href="/admin/parcours/new"
          className="rounded-[2rem] px-5 py-2 font-display font-semibold text-on-primary bg-primary-gradient text-sm shadow-ambient"
        >
          + Nouveau
        </Link>
      </div>

      {parcoursList.length === 0 ? (
        <p className="font-body text-on-surface/40 text-center py-20">
          Aucun parcours. Créez-en un !
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {parcoursList.map(p => {
            const title = p.translations.fr?.title ?? p.slug
            return (
              <div
                key={p.id}
                className="flex items-center justify-between bg-surface-container-lowest rounded-2xl px-5 py-4 shadow-ambient"
              >
                <div>
                  <p className="font-display font-semibold text-on-surface">{title}</p>
                  <p className="font-body text-xs text-on-surface/40 mt-0.5">
                    /{p.slug} · {p.difficulty} · {p.tier}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-body font-semibold px-2 py-1 rounded-full ${
                      p.published
                        ? 'bg-primary/10 text-primary'
                        : 'bg-surface-container text-on-surface/40'
                    }`}
                  >
                    {p.published ? 'Publié' : 'Brouillon'}
                  </span>
                  <Link
                    href={`/admin/parcours/${p.id}`}
                    className="font-body text-sm text-primary hover:underline"
                  >
                    Modifier
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
